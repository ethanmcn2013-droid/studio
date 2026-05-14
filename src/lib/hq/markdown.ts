import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * HQ markdown loader — reads file-backed HQ content from
 * `content/hq/<section>/*.md`. Mirrors the atlas loader pattern.
 *
 * The 2,334-line seedHqData in src/lib/hq/data.ts is the legacy
 * substrate. Per the HQ v2 audit (2026-05-14), every load-bearing
 * section migrates to markdown over HQ-6a / -6b / -6c. This loader
 * is the read path; the migration commits are the writes.
 *
 * File shape:
 *   ---
 *   id: "stable-slug"
 *   title: "Short human title"
 *   category: "Brand | Product | Pricing | ..."
 *   date: "YYYY-MM-DD"
 *   status: "Active | Closed | Superseded"
 *   reviewDate: "YYYY-MM-DD"  # optional
 *   relatedObjects: [a, b, c]  # inline array
 *   ---
 *
 *   ## Decision
 *   ...
 *
 *   ## Reason
 *   ...
 */

export type HqMarkdownFrontmatter = {
  id: string;
  title: string;
  category?: string;
  date?: string;
  status?: string;
  reviewDate?: string;
  relatedObjects: string[];
  // Free-form additional fields a section may declare.
  [key: string]: unknown;
};

export type HqMarkdownEntry = {
  fm: HqMarkdownFrontmatter;
  body: string;
  sections: Record<string, string>;
  filename: string;
};

function parseFrontmatter(raw: string): { fm: Record<string, unknown>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return { fm: {}, body: raw.trim() };
  }
  const fmRaw = match[1];
  const body = match[2].trim();
  const fm: Record<string, unknown> = {};

  for (const line of fmRaw.split("\n")) {
    const kv = line.match(/^([a-zA-Z][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value: unknown = kv[2].trim();
    if (typeof value === "string") {
      const str = value;
      if (str.startsWith("[") && str.endsWith("]")) {
        // Prefer JSON.parse — handles arrays whose string values
        // contain commas (e.g. "Foo (a, b, c)"). Falls back to a
        // naive comma-split for inline-array syntax without quotes.
        try {
          const parsed = JSON.parse(str);
          if (Array.isArray(parsed)) {
            value = parsed.map((v) => String(v));
          } else {
            throw new Error("not-array");
          }
        } catch {
          const inner = str.slice(1, -1).trim();
          value = inner
            ? inner
                .split(",")
                .map((s: string) => s.trim().replace(/^["']|["']$/g, ""))
            : [];
        }
      } else if (
        (str.startsWith('"') && str.endsWith('"')) ||
        (str.startsWith("'") && str.endsWith("'"))
      ) {
        value = str.slice(1, -1);
      }
    }
    fm[key] = value;
  }
  return { fm, body };
}

/**
 * Split a markdown body on H2 boundaries. Returns a map of
 * { sectionName: bodyText }. Used to extract the named sub-sections
 * (Decision / Reason / Alternatives / Risks / Notes) without forcing
 * the caller to re-parse.
 */
function splitH2Sections(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = body.split("\n");
  let currentName: string | null = null;
  let currentBuffer: string[] = [];

  const flush = () => {
    if (currentName === null) return;
    sections[currentName] = currentBuffer.join("\n").trim();
    currentBuffer = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      flush();
      currentName = h2[1].trim();
      continue;
    }
    if (currentName !== null) {
      currentBuffer.push(line);
    }
  }
  flush();

  return sections;
}

function toEntry(
  rawFm: Record<string, unknown>,
  body: string,
  filename: string,
): HqMarkdownEntry {
  const fileSlug = filename.replace(/\.md$/, "");
  const fm: HqMarkdownFrontmatter = {
    id: String(rawFm.id ?? fileSlug),
    title: String(rawFm.title ?? fileSlug),
    category: rawFm.category !== undefined ? String(rawFm.category) : undefined,
    date: rawFm.date !== undefined ? String(rawFm.date) : undefined,
    status: rawFm.status !== undefined ? String(rawFm.status) : undefined,
    reviewDate:
      rawFm.reviewDate !== undefined ? String(rawFm.reviewDate) : undefined,
    relatedObjects: Array.isArray(rawFm.relatedObjects)
      ? rawFm.relatedObjects.map(String)
      : [],
  };
  // Pass through any unknown fields verbatim (e.g. owner, priority, etc.)
  for (const [k, v] of Object.entries(rawFm)) {
    if (!(k in fm)) fm[k] = v;
  }
  return {
    fm,
    body,
    sections: splitH2Sections(body),
    filename,
  };
}

/**
 * Read all entries in a given content/hq/<section>/ directory.
 * Section names are lowercase kebab-case (e.g. "decisions", "risks").
 */
export async function readHqSection(section: string): Promise<HqMarkdownEntry[]> {
  const dir = path.join(process.cwd(), "content", "hq", section);
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  const mdFiles = files.filter(
    (f) => f.endsWith(".md") && f !== "README.md",
  );
  const entries = await Promise.all(
    mdFiles.map(async (file) => {
      const raw = await fs.readFile(path.join(dir, file), "utf-8");
      const { fm, body } = parseFrontmatter(raw);
      return toEntry(fm, body, file);
    }),
  );
  // Sort by date descending (most recent first); fall back to title.
  return entries.sort((a, b) => {
    const da = a.fm.date ?? "";
    const db = b.fm.date ?? "";
    if (da !== db) return db.localeCompare(da);
    return a.fm.title.localeCompare(b.fm.title);
  });
}

/**
 * Read a single entry by slug from a section. Slug is the filename
 * without the .md extension.
 */
export async function readHqEntry(
  section: string,
  slug: string,
): Promise<HqMarkdownEntry | null> {
  const all = await readHqSection(section);
  return all.find((e) => e.filename.replace(/\.md$/, "") === slug) ?? null;
}

/**
 * Helpful section-status helper — count entries grouped by status
 * (e.g. Active / Closed / Superseded for decisions).
 */
export function countByStatus(
  entries: HqMarkdownEntry[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of entries) {
    const s = e.fm.status ?? "—";
    counts[s] = (counts[s] ?? 0) + 1;
  }
  return counts;
}
