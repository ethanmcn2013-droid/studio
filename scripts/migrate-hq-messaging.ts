#!/usr/bin/env tsx
/**
 * HQ-6b: migrate the messaging object from src/lib/hq/data.ts to a
 * single content/hq/messaging.md. Unlike the array-shaped sections,
 * messaging is one document — positioning, ecosystem line, founder
 * story, hooks, pitches, objections, CTAs.
 *
 * Run: npx tsx scripts/migrate-hq-messaging.ts
 */

import fs from "node:fs/promises";
import path from "node:path";
import { seedHqData } from "../src/lib/hq/data";

const OUT_FILE = path.join(process.cwd(), "content", "hq", "messaging.md");

async function main(): Promise<void> {
  const m = seedHqData.messaging;
  const lines: string[] = [];
  lines.push("---");
  lines.push(`id: messaging`);
  lines.push(`title: Suite messaging`);
  lines.push(`status: Active`);
  lines.push(`date: 2026-05-14`);
  lines.push("---");
  lines.push("");
  lines.push("## Positioning");
  lines.push("");
  lines.push(m.positioning);
  lines.push("");
  lines.push("## Ecosystem line");
  lines.push("");
  lines.push(m.ecosystemLine);
  lines.push("");
  lines.push("## Founder story");
  lines.push("");
  lines.push(m.founderStory);
  lines.push("");
  lines.push("## Hooks");
  lines.push("");
  for (const h of m.hooks) {
    lines.push(`- ${h}`);
  }
  lines.push("");
  lines.push("## Pitches");
  lines.push("");
  for (const [audience, pitch] of Object.entries(m.pitches)) {
    lines.push(`### ${audience}`);
    lines.push("");
    lines.push(String(pitch));
    lines.push("");
  }
  lines.push("## Objections");
  lines.push("");
  for (const o of m.objections) {
    lines.push(`- ${o}`);
  }
  lines.push("");
  lines.push("## CTAs");
  lines.push("");
  for (const c of m.ctas) {
    lines.push(`- ${c}`);
  }
  lines.push("");

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, lines.join("\n"));
  console.log(`✓ messaging.md written (${lines.length} lines)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
