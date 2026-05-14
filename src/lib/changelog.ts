import fs from "node:fs/promises";
import path from "node:path";

/**
 * Shared parser for the Signal Studio umbrella dispatch.
 *
 * Two entry shapes are supported in the same file — the convention
 * locked at 2026-05-14 (see BRAND.md §6.5) introduced the new shape;
 * pre-2026-05-14 entries keep their original shape and are rendered
 * with a lighter chrome.
 *
 *   NEW (dispatch shape):
 *     ## YYYY-MM-DD · X·NN · verb · headline
 *     **bold impact-lead sentence**
 *     body prose...
 *
 *   OLD (pre-convention):
 *     ## YYYY-MM-DD · suffix    → section header
 *     ### Entry title           → entry inside the section
 *     body lines...             → entry body
 *
 *   OLD (compound single-entry, no ###):
 *     ## YYYY-MM-DD · headline  → entry header with body following
 *
 * Used by `/dispatch` (HTML) and `/changelog.rss` (XML feed).
 */

export type Verb = "ships" | "tightens" | "cuts" | "holds" | "reads";

export type DispatchEntry = {
  date: string;
  cycleCode: string | null;
  verb: Verb | null;
  headline: string;
  boldLead: string | null;
  body: string;
  isLegacy: boolean;
};

/** Legacy Section + Entry shape retained for RSS feed compatibility. */
export type Entry = { title: string; body: string };
export type Section = { date: string; entries: Entry[] };

function parseChangelog(raw: string): Section[] {
  const lines = raw.split("\n");
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentEntry: Entry | null = null;

  for (const line of lines) {
    const sectionMatch = line.match(/^##\s+(\d{4}-\d{2}-\d{2}.*)$/);
    if (sectionMatch) {
      if (currentEntry && currentSection) currentSection.entries.push(currentEntry);
      if (currentSection) sections.push(currentSection);
      currentSection = { date: sectionMatch[1].trim(), entries: [] };
      currentEntry = null;
      continue;
    }

    const entryMatch = line.match(/^###\s+(.+)$/);
    if (entryMatch) {
      if (currentEntry && currentSection) currentSection.entries.push(currentEntry);
      currentEntry = { title: entryMatch[1].trim(), body: "" };
      continue;
    }

    if (currentEntry) {
      currentEntry.body += line + "\n";
    }
  }
  if (currentEntry && currentSection) currentSection.entries.push(currentEntry);
  if (currentSection) sections.push(currentSection);
  return sections;
}

export async function readChangelogSections(): Promise<Section[]> {
  const file = await fs.readFile(
    path.join(process.cwd(), "CHANGELOG.md"),
    "utf-8",
  );
  return parseChangelog(file);
}

const VERBS: readonly Verb[] = ["ships", "tightens", "cuts", "holds", "reads"];
const VERB_SET = new Set<string>(VERBS);

const DISPATCH_HEADER = /^##\s+(\d{4}-\d{2}-\d{2})\s+·\s+([A-Z])·(\d{2})\s+·\s+(\w+)\s+·\s+(.+?)\s*$/;
const LEGACY_H2 = /^##\s+(\d{4}-\d{2}-\d{2})(?:\s+·\s+(.+?))?\s*$/;
const LEGACY_H3 = /^###\s+(.+)$/;

function extractBoldLead(body: string): { boldLead: string | null; rest: string } {
  const m = body.trimStart().match(/^\*\*([^]+?)\*\*\s*(?:\n|$)/);
  if (!m) return { boldLead: null, rest: body };
  const startIdx = body.indexOf(m[0]);
  const rest = body.slice(startIdx + m[0].length);
  return { boldLead: m[1].replace(/\s+/g, " ").trim(), rest };
}

/** Parse CHANGELOG.md into a flat list of dispatch entries (newest first as written). */
function parseDispatch(raw: string): DispatchEntry[] {
  const lines = raw.split("\n");
  const entries: DispatchEntry[] = [];
  let current: DispatchEntry | null = null;
  let legacyDate: string | null = null;
  let legacySuffix: string | null = null;

  const finalize = () => {
    if (!current) return;
    const { boldLead, rest } = extractBoldLead(current.body);
    current.boldLead = boldLead;
    current.body = rest.trim();
    entries.push(current);
    current = null;
  };

  for (const line of lines) {
    const newMatch = line.match(DISPATCH_HEADER);
    if (newMatch && VERB_SET.has(newMatch[4].toLowerCase())) {
      finalize();
      legacyDate = null;
      legacySuffix = null;
      current = {
        date: newMatch[1],
        cycleCode: `${newMatch[2]}·${newMatch[3]}`,
        verb: newMatch[4].toLowerCase() as Verb,
        headline: newMatch[5].trim(),
        boldLead: null,
        body: "",
        isLegacy: false,
      };
      continue;
    }

    const h2 = line.match(LEGACY_H2);
    if (h2) {
      finalize();
      legacyDate = h2[1];
      legacySuffix = h2[2]?.trim() ?? "";
      current = {
        date: legacyDate,
        cycleCode: null,
        verb: null,
        headline: legacySuffix || legacyDate,
        boldLead: null,
        body: "",
        isLegacy: true,
      };
      continue;
    }

    const h3 = line.match(LEGACY_H3);
    if (h3 && legacyDate) {
      finalize();
      current = {
        date: legacyDate,
        cycleCode: null,
        verb: null,
        headline: h3[1].trim(),
        boldLead: null,
        body: "",
        isLegacy: true,
      };
      continue;
    }

    if (current) current.body += line + "\n";
  }
  finalize();
  return entries;
}

export async function readDispatchEntries(): Promise<DispatchEntry[]> {
  const file = await fs.readFile(
    path.join(process.cwd(), "CHANGELOG.md"),
    "utf-8",
  );
  return parseDispatch(file);
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
