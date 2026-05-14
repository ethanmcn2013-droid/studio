#!/usr/bin/env tsx
/**
 * HQ-6c.1: migrate the remaining 14 narrative sections from
 * src/lib/hq/data.ts into markdown.
 *
 * Each section gets one file per entry at content/hq/<section>/<id>.md.
 * The per-section config below decides:
 *   - titleField: which field carries the human title
 *   - fmFields: which fields go into frontmatter (scalar + array values)
 *   - bodyFields: which fields become H2 sections in the body
 *
 * Idempotent. Re-running overwrites. Seed in data.ts stays in place
 * until HQ-6c.4 (dashboard refactor + seed cleanup).
 *
 * Run: npx tsx scripts/migrate-hq-remaining.ts
 */

import fs from "node:fs/promises";
import path from "node:path";
import { seedHqData } from "../src/lib/hq/data";

const ROOT = path.join(process.cwd(), "content", "hq");

type SectionConfig = {
  key: keyof typeof seedHqData;
  dir: string;
  titleField: string;
  // Frontmatter is anything scalar or string[]. Body sections are prose.
  bodyFields: string[];
};

const SECTIONS: SectionConfig[] = [
  {
    key: "products",
    dir: "products",
    titleField: "name",
    bodyFields: ["role", "notes"],
  },
  {
    key: "ecosystemFlows",
    dir: "ecosystem-flows",
    titleField: "from",
    bodyFields: ["purpose", "nextAction"],
  },
  {
    key: "collaborationLoop",
    dir: "collaboration-loop",
    titleField: "step",
    bodyFields: ["purpose"],
  },
  {
    key: "sharedObjects",
    dir: "shared-objects",
    titleField: "object",
    bodyFields: ["definition", "nextAction"],
  },
  {
    key: "accessRoles",
    dir: "access-roles",
    titleField: "role",
    bodyFields: ["purpose"],
  },
  {
    key: "collaboratorFirstView",
    dir: "collaborator-first-view",
    titleField: "section",
    bodyFields: ["question", "purpose"],
  },
  {
    key: "shareableArtifacts",
    dir: "shareable-artifacts",
    titleField: "name",
    bodyFields: ["purpose"],
  },
  {
    key: "launchReadiness",
    dir: "launch-readiness",
    titleField: "category",
    bodyFields: ["notes"],
  },
  {
    key: "segments",
    dir: "segments",
    titleField: "segment",
    bodyFields: ["painPoint", "coreMessage", "offer"],
  },
  {
    key: "contentItems",
    dir: "content",
    titleField: "title",
    bodyFields: ["hook", "structure", "notes"],
  },
  {
    key: "demos",
    dir: "demos",
    titleField: "title",
    bodyFields: ["objective", "script", "notes"],
  },
  {
    key: "templates",
    dir: "templates",
    titleField: "name",
    bodyFields: ["useCase", "notes"],
  },
  {
    key: "pilots",
    dir: "pilots",
    titleField: "name",
    bodyFields: ["offer", "value", "ask", "currentStatus", "nextStep"],
  },
  {
    key: "growthWorkflow",
    dir: "growth-workflow",
    titleField: "title",
    bodyFields: ["hook", "structure", "notes"],
  },
];

function inlineArray(items: string[]): string {
  // If any value contains a comma or special char, emit as JSON to keep
  // the parser honest. Otherwise use the lighter inline syntax.
  const needsJson = items.some(
    (s) => typeof s === "string" && /[,"\[\]:#]/.test(String(s)),
  );
  if (needsJson) {
    return JSON.stringify(items.map((s) => String(s)));
  }
  return `[${items.map((s) => String(s)).join(", ")}]`;
}

function safeFm(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return inlineArray(value as string[]);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "string") {
    if (!value.trim()) return null;
    if (value.length > 240) return null; // long prose belongs in body
    return value;
  }
  return null;
}

async function migrateSection(cfg: SectionConfig): Promise<number> {
  const dir = path.join(ROOT, cfg.dir);
  await fs.mkdir(dir, { recursive: true });

  const items = (seedHqData as unknown as Record<string, unknown>)[cfg.key] as
    | Array<Record<string, unknown>>
    | undefined;
  if (!Array.isArray(items)) {
    console.log(`  (${cfg.key} not an array — skipped)`);
    return 0;
  }

  for (const item of items) {
    const id = String(item.id ?? "unknown");
    const file = path.join(dir, `${id}.md`);
    const lines: string[] = [];
    lines.push("---");
    lines.push(`id: ${id}`);

    const titleRaw = item[cfg.titleField];
    const title = typeof titleRaw === "string" ? titleRaw : id;
    lines.push(`title: ${title.slice(0, 200)}`);

    // Walk every field that isn't id/title/body — try to put it in
    // frontmatter if it's scalar/short, otherwise it'll fall through
    // to the body collection below.
    const bodySet = new Set(cfg.bodyFields);
    for (const [key, value] of Object.entries(item)) {
      if (key === "id" || key === cfg.titleField) continue;
      if (bodySet.has(key)) continue;
      const fm = safeFm(value);
      if (fm !== null) {
        lines.push(`${key}: ${fm}`);
      }
    }

    lines.push("---");
    lines.push("");

    for (const field of cfg.bodyFields) {
      const value = item[field];
      if (value === undefined || value === null) continue;
      const text =
        typeof value === "string"
          ? value
          : Array.isArray(value)
            ? (value as string[]).map((v) => `- ${v}`).join("\n")
            : String(value);
      if (!text.trim()) continue;
      lines.push(`## ${humanize(field)}`);
      lines.push("");
      lines.push(text);
      lines.push("");
    }

    await fs.writeFile(file, lines.join("\n"));
  }

  return items.length;
}

function humanize(field: string): string {
  // Camel → Title with spaces.
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

async function main(): Promise<void> {
  let total = 0;
  for (const cfg of SECTIONS) {
    const count = await migrateSection(cfg);
    total += count;
    console.log(`  ✓ ${String(cfg.key).padEnd(24)} ${count} files → ${cfg.dir}/`);
  }
  console.log("");
  console.log(`Migrated ${total} entries across ${SECTIONS.length} sections.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
