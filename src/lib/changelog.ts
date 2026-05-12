import fs from "node:fs/promises";
import path from "node:path";

/**
 * Shared changelog parser for the Signal Studio umbrella log.
 *
 * Reads `studio/CHANGELOG.md` and parses its regular structure:
 *   ## YYYY-MM-DD [(suffix)]   → date section
 *   ### Entry title            → entry inside the current section
 *   body lines...              → entry body
 *
 * Used by `/changelog` (HTML) and `/changelog.rss` (XML feed).
 */

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
