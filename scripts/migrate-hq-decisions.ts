#!/usr/bin/env tsx
/**
 * One-shot migration: extract every DecisionItem from src/lib/hq/data.ts
 * into a markdown file at content/hq/decisions/<id>.md.
 *
 * Per the HQ v2 audit (2026-05-14), the 2,334-line seed migrates to
 * markdown in passes. This is the Decisions pilot — HQ-6a.
 *
 * Idempotent: re-running overwrites existing files. The seed in data.ts
 * is NOT deleted by this script — that happens in HQ-6b after the
 * dashboard reads from markdown.
 *
 * Run: npx tsx scripts/migrate-hq-decisions.ts
 */

import fs from "node:fs/promises";
import path from "node:path";
import { seedHqData } from "../src/lib/hq/data";

const OUT_DIR = path.join(process.cwd(), "content", "hq", "decisions");

function safeArrayInline(items: string[]): string {
  return `[${items.map((s) => s.replace(/[\[\]]/g, "")).join(", ")}]`;
}

function fmString(value: string | undefined): string {
  if (value === undefined || value === null) return '""';
  // Inline array detection
  if (value.startsWith("[") && value.endsWith("]")) return value;
  // Use raw — frontmatter parser handles unquoted strings.
  return value;
}

async function main(): Promise<void> {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const decisions = seedHqData.decisions;
  console.log(`Migrating ${decisions.length} decisions to ${OUT_DIR}`);

  for (const d of decisions) {
    const file = path.join(OUT_DIR, `${d.id}.md`);
    const lines: string[] = [];
    lines.push("---");
    lines.push(`id: ${d.id}`);
    lines.push(`title: ${d.decision.slice(0, 110)}${d.decision.length > 110 ? "…" : ""}`);
    lines.push(`category: ${fmString(d.category)}`);
    lines.push(`date: ${fmString(d.date)}`);
    lines.push(`status: ${fmString(d.status)}`);
    if (d.reviewDate) lines.push(`reviewDate: ${d.reviewDate}`);
    if (d.relatedObjects && d.relatedObjects.length > 0) {
      lines.push(`relatedObjects: ${safeArrayInline(d.relatedObjects)}`);
    }
    lines.push("---");
    lines.push("");
    lines.push("## Decision");
    lines.push("");
    lines.push(d.decision);
    lines.push("");
    lines.push("## Reason");
    lines.push("");
    lines.push(d.reason);
    lines.push("");
    if (d.alternatives) {
      lines.push("## Alternatives considered");
      lines.push("");
      lines.push(d.alternatives);
      lines.push("");
    }
    if (d.risks) {
      lines.push("## Risks");
      lines.push("");
      lines.push(d.risks);
      lines.push("");
    }
    if (d.notes) {
      lines.push("## Notes");
      lines.push("");
      lines.push(d.notes);
      lines.push("");
    }

    await fs.writeFile(file, lines.join("\n"));
    console.log(`  ✓ ${d.id}.md`);
  }

  console.log("");
  console.log(`Migration complete. ${decisions.length} decisions written.`);
  console.log(`Read path: src/lib/hq/markdown.ts → readHqSection("decisions")`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
