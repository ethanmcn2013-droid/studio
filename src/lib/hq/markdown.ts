import "server-only";
import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import {
  parseFrontmatter,
  sortByDateDesc,
  toEntry,
  type HqMarkdownEntry,
  type HqMarkdownFrontmatter,
} from "./markdown-parser";

export type { HqMarkdownEntry, HqMarkdownFrontmatter };
export { countByStatus } from "./markdown-parser";

/**
 * HQ markdown loader, reads file-backed HQ content from
 * `content/hq/<section>/*.md`. Mirrors the atlas loader pattern.
 *
 * Pure parsing lives in `./markdown-parser` so tests can exercise it
 * without the server-only guard. This module owns the fs reads.
 *
 * `readHqSection` is wrapped in React's `cache()` so duplicate calls
 * within a single request (e.g. Today + Inbox both reading decisions
 * or risks) collapse to one disk read. The cache is per-request —
 * separate page loads get fresh data.
 */

export const readHqSection = cache(
  async (section: string): Promise<HqMarkdownEntry[]> => {
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
    return sortByDateDesc(entries);
  },
);

export async function readHqEntry(
  section: string,
  slug: string,
): Promise<HqMarkdownEntry | null> {
  const all = await readHqSection(section);
  return all.find((e) => e.filename.replace(/\.md$/, "") === slug) ?? null;
}
