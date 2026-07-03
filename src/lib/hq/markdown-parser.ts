/**
 * Pure parsing functions for HQ markdown entries.
 *
 * Extracted from `markdown.ts` so they can be tested without the
 * `import "server-only"` guard (which can't resolve outside a Next
 * runtime). The runtime loader at `markdown.ts` calls these functions
 * after reading entries from disk.
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

export function parseFrontmatter(
  raw: string,
): { fm: Record<string, unknown>; body: string } {
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
        // JSON.parse first, survives commas inside string values.
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
 * { sectionName: bodyText }.
 */
export function splitH2Sections(body: string): Record<string, string> {
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

export function toEntry(
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

export function sortByDateDesc(entries: HqMarkdownEntry[]): HqMarkdownEntry[] {
  return [...entries].sort((a, b) => {
    const da = a.fm.date ?? "";
    const db = b.fm.date ?? "";
    if (da !== db) return db.localeCompare(da);
    return a.fm.title.localeCompare(b.fm.title);
  });
}
