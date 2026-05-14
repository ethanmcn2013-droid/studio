#!/usr/bin/env tsx
/**
 * HQ-6c.5 / A1: Empty the 18 migrated arrays in src/lib/hq/data.ts.
 *
 * The seed kept its data after HQ-6a/-6b/-6c.1 because the dashboard's
 * derived scores still depended on it. After HQ-6c.2 (S·17) the
 * dashboard prefers markdown; after A2 (this cycle) signals.ts also
 * prefers markdown. The seed is finally safe to empty.
 *
 * Kept full (operator-owned, localStorage-backed):
 *   prospects, feedback, weeklyRhythm, nextActions
 * Kept full (deferred):
 *   metrics
 * Kept as object (different shape, migrated to messaging.md but stays
 * here for type-shape compatibility with non-refactored callers):
 *   messaging
 *
 * Run: npx tsx scripts/empty-migrated-seed-arrays.ts
 */

import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "src", "lib", "hq", "data.ts");

const MIGRATED_SECTIONS = [
  "products",
  "ecosystemFlows",
  "collaborationLoop",
  "sharedObjects",
  "accessRoles",
  "collaboratorFirstView",
  "shareableArtifacts",
  "features",
  "launchReadiness",
  "segments",
  "campaigns",
  "contentItems",
  "demos",
  "templates",
  "pilots",
  "decisions",
  "risks",
  "growthWorkflow",
];

/**
 * Find the closing `]` matching the opening `[` at `openIdx`. Tracks
 * bracket depth across both [] and {} and skips string literals
 * (single + double + backtick) so brackets-in-strings don't confuse
 * the count.
 */
function findClosingBracket(source: string, openIdx: number): number {
  let depth = 0;
  let inString: '"' | "'" | "`" | null = null;
  let escaped = false;
  for (let i = openIdx; i < source.length; i++) {
    const ch = source[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      escaped = true;
      continue;
    }
    if (inString) {
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = ch;
      continue;
    }
    if (ch === "[" || ch === "{") depth += 1;
    else if (ch === "]" || ch === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  throw new Error(`Could not find closing bracket from index ${openIdx}`);
}

function main(): void {
  let source = fs.readFileSync(FILE, "utf-8");
  const before = source.length;

  // Process sections from end to start so earlier-replacement positions
  // remain valid for later replacements.
  type Match = { name: string; start: number; end: number };
  const matches: Match[] = [];

  for (const name of MIGRATED_SECTIONS) {
    // Match: start-of-line + two-space indent + name + colon + space + [
    const pattern = new RegExp(`(^|\\n)  ${name}: \\[`, "g");
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(source)) !== null) {
      const openIdx = m.index + m[0].length - 1; // points at the '['
      const closeIdx = findClosingBracket(source, openIdx);
      matches.push({ name, start: openIdx, end: closeIdx });
    }
  }

  matches.sort((a, b) => b.start - a.start);

  for (const match of matches) {
    const replacement = "[]";
    source =
      source.slice(0, match.start) +
      replacement +
      source.slice(match.end + 1);
    console.log(`  ✓ emptied ${match.name}`);
  }

  fs.writeFileSync(FILE, source);
  const after = source.length;
  console.log("");
  console.log(`data.ts: ${before} → ${after} chars (${before - after} removed)`);
}

main();
