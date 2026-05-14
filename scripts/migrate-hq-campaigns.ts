#!/usr/bin/env tsx
/**
 * HQ-6b: migrate every Campaign from src/lib/hq/data.ts to
 * content/hq/campaigns/<id>.md.
 *
 * Run: npx tsx scripts/migrate-hq-campaigns.ts
 */

import fs from "node:fs/promises";
import path from "node:path";
import { seedHqData } from "../src/lib/hq/data";

const OUT_DIR = path.join(process.cwd(), "content", "hq", "campaigns");

function inlineArray(items: string[]): string {
  return `[${items.map((s) => s.replace(/[\[\]]/g, "")).join(", ")}]`;
}

async function main(): Promise<void> {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const items = seedHqData.campaigns;
  console.log(`Migrating ${items.length} campaigns to ${OUT_DIR}`);

  for (const c of items) {
    const file = path.join(OUT_DIR, `${c.id}.md`);
    const lines: string[] = [];
    lines.push("---");
    lines.push(`id: ${c.id}`);
    lines.push(`title: ${c.name}`);
    lines.push(`segment: ${c.segment}`);
    lines.push(`status: ${c.status}`);
    if (c.startDate) lines.push(`startDate: ${c.startDate}`);
    if (c.endDate) lines.push(`endDate: ${c.endDate}`);
    if (typeof c.progress === "number") lines.push(`progress: ${c.progress}`);
    if (c.relatedLandingPage) lines.push(`relatedLandingPage: ${c.relatedLandingPage}`);
    if (c.relatedMetric) lines.push(`relatedMetric: ${c.relatedMetric}`);
    if (c.assetsNeeded && c.assetsNeeded.length > 0) {
      lines.push(`assetsNeeded: ${inlineArray(c.assetsNeeded)}`);
    }
    lines.push("---");
    lines.push("");
    lines.push("## Goal");
    lines.push("");
    lines.push(c.goal || "—");
    lines.push("");
    if (c.offer) {
      lines.push("## Offer");
      lines.push("");
      lines.push(c.offer);
      lines.push("");
    }
    if (c.currentBlocker) {
      lines.push("## Current blocker");
      lines.push("");
      lines.push(c.currentBlocker);
      lines.push("");
    }
    if (c.nextStep) {
      lines.push("## Next step");
      lines.push("");
      lines.push(c.nextStep);
      lines.push("");
    }
    if (c.relatedContent) {
      lines.push("## Related content");
      lines.push("");
      lines.push(c.relatedContent);
      lines.push("");
    }

    await fs.writeFile(file, lines.join("\n"));
    console.log(`  ✓ ${c.id}.md`);
  }

  console.log("");
  console.log(`${items.length} campaigns written.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
