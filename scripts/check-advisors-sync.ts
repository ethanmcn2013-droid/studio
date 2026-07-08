/**
 * Advisors ↔ ELT drift check.
 *
 * Studio's `src/lib/hq/elt.ts` is a hand-maintained mirror of the source of
 * truth at `signal-directors/config/advisors.yaml`. This script makes drift
 * VISIBLE instead of silent: it reads the sibling repo's advisors.yaml and
 * compares the stable fields (id, persona, short_name, cadence, autonomy_layer)
 * against elt.ts, then reports.
 *
 * Read-only. It never rewrites elt.ts — that file also carries studio-only
 * presentation fields (cluster, oneLine, veto, product) that the source does
 * not have, so regeneration would lose them. A `--write` mode is left as a
 * future enhancement once elt.ts is split into data + presentation.
 *
 * Usage:  tsx scripts/check-advisors-sync.ts        (report; exit 1 on drift)
 *         SIGNAL_ADVISORS_YAML=/path/to/advisors.yaml tsx scripts/check-advisors-sync.ts
 *
 * Note: the source names each role an "Advisor"; elt.ts renders them as
 * "Director". That `name` divergence is intentional and is not treated as drift.
 */

import fs from "node:fs";
import path from "node:path";
import { DIRECTORS } from "@/lib/hq/elt";

type SourceAdvisor = {
  id: string;
  shortName?: string;
  persona?: string;
  cadence?: string;
  autonomyLayer?: number;
};

const DEFAULT_YAML = path.join(
  process.cwd(),
  "..",
  "signal-directors",
  "config",
  "advisors.yaml",
);

function unquote(s: string): string {
  return s.trim().replace(/^["']|["']$/g, "");
}

/** Minimal, targeted parse of the advisors list — zero-dep, structure-specific. */
function parseAdvisors(raw: string): SourceAdvisor[] {
  const out: SourceAdvisor[] = [];
  let cur: SourceAdvisor | null = null;
  for (const line of raw.split(/\r?\n/)) {
    const idMatch = line.match(/^\s*-\s+id:\s*(.+)$/);
    if (idMatch) {
      if (cur) out.push(cur);
      cur = { id: unquote(idMatch[1]) };
      continue;
    }
    if (!cur) continue;
    const kv = line.match(/^\s+([a-z_]+):\s*(.+)$/);
    if (!kv) continue;
    const [, key, valueRaw] = kv;
    const value = unquote(valueRaw);
    if (key === "short_name") cur.shortName = value;
    else if (key === "persona") cur.persona = value;
    else if (key === "cadence") cur.cadence = value;
    else if (key === "autonomy_layer") cur.autonomyLayer = Number(value);
  }
  if (cur) out.push(cur);
  return out;
}

function main() {
  const yamlPath = process.env.SIGNAL_ADVISORS_YAML ?? DEFAULT_YAML;

  if (!fs.existsSync(yamlPath)) {
    // Expected on Vercel / any checkout without the sibling repo — not a failure.
    console.log(`advisors.yaml not found at ${yamlPath} — skipping drift check.`);
    console.log("(set SIGNAL_ADVISORS_YAML to run it, e.g. locally next to signal-directors)");
    process.exit(0);
  }

  const source = parseAdvisors(fs.readFileSync(yamlPath, "utf-8"));
  const sourceById = new Map(source.map((a) => [a.id, a]));
  const eltById = new Map(DIRECTORS.map((d) => [d.id, d]));

  const missingInElt = source.filter((a) => !eltById.has(a.id)).map((a) => a.id);
  const extraInElt = DIRECTORS.filter((d) => !sourceById.has(d.id)).map((d) => d.id);

  const fieldDrift: string[] = [];
  for (const d of DIRECTORS) {
    const s = sourceById.get(d.id);
    if (!s) continue;
    if (s.shortName && s.shortName !== d.shortName)
      fieldDrift.push(`${d.id}: shortName elt="${d.shortName}" source="${s.shortName}"`);
    if (s.persona && s.persona !== d.persona)
      fieldDrift.push(`${d.id}: persona elt="${d.persona}" source="${s.persona}"`);
    if (s.cadence && s.cadence !== d.cadence)
      fieldDrift.push(`${d.id}: cadence elt="${d.cadence}" source="${s.cadence}"`);
    if (s.autonomyLayer && s.autonomyLayer !== d.autonomyLayer)
      fieldDrift.push(`${d.id}: autonomyLayer elt=${d.autonomyLayer} source=${s.autonomyLayer}`);
  }

  console.log(`Source: ${yamlPath}`);
  console.log(`Source advisors: ${source.length} · elt directors: ${DIRECTORS.length}`);

  const clean = !missingInElt.length && !extraInElt.length && !fieldDrift.length;
  if (clean) {
    console.log("✓ In sync. No drift on id / persona / short_name / cadence / autonomy_layer.");
    process.exit(0);
  }

  console.log("\n✗ Drift found:");
  if (missingInElt.length)
    console.log(`  In advisors.yaml but not elt.ts: ${missingInElt.join(", ")}`);
  if (extraInElt.length)
    console.log(`  In elt.ts but not advisors.yaml: ${extraInElt.join(", ")}`);
  for (const f of fieldDrift) console.log(`  ${f}`);
  console.log("\nUpdate src/lib/hq/elt.ts to match, then bump ELT_SNAPSHOT.generatedAt.");
  process.exit(1);
}

main();
