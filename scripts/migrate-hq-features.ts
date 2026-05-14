#!/usr/bin/env tsx
/**
 * HQ-6b: migrate every FeatureItem from src/lib/hq/data.ts to
 * content/hq/features/<id>.md.
 *
 * Idempotent. Re-running overwrites. Seed in data.ts stays in place
 * until HQ-6c.
 *
 * Run: npx tsx scripts/migrate-hq-features.ts
 */

import fs from "node:fs/promises";
import path from "node:path";
import { seedHqData } from "../src/lib/hq/data";

const OUT_DIR = path.join(process.cwd(), "content", "hq", "features");

async function main(): Promise<void> {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const items = seedHqData.features;
  console.log(`Migrating ${items.length} features to ${OUT_DIR}`);

  for (const f of items) {
    const file = path.join(OUT_DIR, `${f.id}.md`);
    const lines: string[] = [];
    lines.push("---");
    lines.push(`id: ${f.id}`);
    lines.push(`title: ${f.name}`);
    lines.push(`product: ${f.product}`);
    lines.push(`category: ${f.type}`);
    lines.push(`status: ${f.status}`);
    lines.push(`priority: ${f.priority}`);
    lines.push(`effort: ${f.effort}`);
    lines.push(`impact: ${f.impact}`);
    lines.push(`owner: ${f.owner}`);
    if (f.principleAlignment !== undefined) {
      lines.push(`principleAlignment: ${f.principleAlignment}`);
    }
    if (f.relatedCampaign) lines.push(`relatedCampaign: ${f.relatedCampaign}`);
    if (f.relatedMetric) lines.push(`relatedMetric: ${f.relatedMetric}`);
    lines.push("---");
    lines.push("");
    lines.push("## Notes");
    lines.push("");
    lines.push(f.notes || "—");
    lines.push("");

    await fs.writeFile(file, lines.join("\n"));
    console.log(`  ✓ ${f.id}.md`);
  }

  console.log("");
  console.log(`${items.length} features written.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
