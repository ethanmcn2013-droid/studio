#!/usr/bin/env tsx
/**
 * HQ-6b: migrate every RiskItem from src/lib/hq/data.ts to
 * content/hq/risks/<id>.md.
 *
 * Run: npx tsx scripts/migrate-hq-risks.ts
 */

import fs from "node:fs/promises";
import path from "node:path";
import { seedHqData } from "../src/lib/hq/data";

const OUT_DIR = path.join(process.cwd(), "content", "hq", "risks");

async function main(): Promise<void> {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const items = seedHqData.risks;
  console.log(`Migrating ${items.length} risks to ${OUT_DIR}`);

  for (const r of items) {
    const file = path.join(OUT_DIR, `${r.id}.md`);
    const lines: string[] = [];
    lines.push("---");
    lines.push(`id: ${r.id}`);
    lines.push(`title: ${r.risk}`);
    lines.push(`category: ${r.area}`);
    lines.push(`likelihood: ${r.likelihood}`);
    lines.push(`impact: ${r.impact}`);
    lines.push(`status: ${r.status}`);
    lines.push(`owner: ${r.owner}`);
    if (r.reviewDate) lines.push(`reviewDate: ${r.reviewDate}`);
    lines.push("---");
    lines.push("");
    lines.push("## Mitigation");
    lines.push("");
    lines.push(r.mitigation || "—");
    lines.push("");

    await fs.writeFile(file, lines.join("\n"));
    console.log(`  ✓ ${r.id}.md`);
  }

  console.log("");
  console.log(`${items.length} risks written.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
