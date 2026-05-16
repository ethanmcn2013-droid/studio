import fs from "node:fs/promises";
import path from "node:path";

/**
 * Two artifacts, two readers (see BRAND.md §6.5).
 *
 *   readDispatchEntries() reads `content/dispatch/*.md` — one entry per
 *   file, operator-voice, four-line cap. Powers the public `/dispatch`
 *   surface at signalstudio.ie/dispatch.
 *
 *   readChangelogSections() reads `CHANGELOG.md` — the engineering log,
 *   jargon welcome, audience is future-Ethan. Powers the legacy
 *   `/changelog.rss` feed.
 *
 * Dispatch entry file shape:
 *
 *   ## YYYY-MM-DD · verb · headline
 *   **bold impact-lead sentence**
 *   body prose (≤ 4 lines)
 *
 * Filename convention: YYYY-MM-DD-slug.md. Multiple entries can share a
 * date; the parser sorts by date desc, then by filename to keep order
 * deterministic.
 */

export type Verb = "ships" | "tightens" | "cuts" | "holds" | "reads";

export type DispatchEntry = {
  date: string;
  verb: Verb;
  headline: string;
  boldLead: string | null;
  body: string;
};

const VERBS: readonly Verb[] = ["ships", "tightens", "cuts", "holds", "reads"];
const VERB_SET = new Set<string>(VERBS);

const DISPATCH_FILE_HEADER = /^##\s+(\d{4}-\d{2}-\d{2})\s+·\s+(\w+)\s+·\s+(.+?)\s*$/;

function extractBoldLead(body: string): { boldLead: string | null; rest: string } {
  const m = body.trimStart().match(/^\*\*([^]+?)\*\*\s*(?:\n|$)/);
  if (!m) return { boldLead: null, rest: body };
  const startIdx = body.indexOf(m[0]);
  const rest = body.slice(startIdx + m[0].length);
  return { boldLead: m[1].replace(/\s+/g, " ").trim(), rest };
}

function parseDispatchFile(raw: string, filename: string): DispatchEntry | null {
  const lines = raw.split("\n");
  let header: RegExpMatchArray | null = null;
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(DISPATCH_FILE_HEADER);
    if (m && VERB_SET.has(m[2].toLowerCase())) {
      header = m;
      headerIdx = i;
      break;
    }
  }
  if (!header) {
    console.warn(`[dispatch] skipping ${filename} — no valid header`);
    return null;
  }
  const body = lines.slice(headerIdx + 1).join("\n");
  const { boldLead, rest } = extractBoldLead(body);
  return {
    date: header[1],
    verb: header[2].toLowerCase() as Verb,
    headline: header[3].trim(),
    boldLead,
    body: rest.trim(),
  };
}

export async function readDispatchEntries(): Promise<DispatchEntry[]> {
  const dir = path.join(process.cwd(), "content", "dispatch");
  let files: string[];
  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }
  const mdFiles = files.filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const raws = await Promise.all(
    mdFiles.map((file) => fs.readFile(path.join(dir, file), "utf-8")),
  );
  const entries: DispatchEntry[] = [];
  for (let i = 0; i < mdFiles.length; i++) {
    const entry = parseDispatchFile(raws[i], mdFiles[i]);
    if (entry) entries.push(entry);
  }
  entries.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return 0;
  });
  return entries;
}

/** Split body into paragraphs (blank-line separated) and trim. */
export function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);
}

/**
 * Parse a section's date header into a Date for RSS pubDate.
 * The date string can carry trailing parenthetical context — we only
 * use the YYYY-MM-DD prefix and noon UTC as a stable wall-clock.
 */
export function sectionDate(label: string): Date {
  const m = label.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return new Date();
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0));
}

/** XML-escape a string for use inside an RSS element. */
export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
