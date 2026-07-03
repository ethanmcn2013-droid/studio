#!/usr/bin/env node
/**
 * compile-taste — turn pairwise ratings into the taste map the brand-voice skill reads.
 *
 * Reads items.json (canonical sentence bank) + judgements.jsonl (exported from rater.html),
 * fits a recency-weighted Bradley-Terry ranking, and writes:
 *   · taste.json — scores, per-axis leans, exemplars / anti-exemplars (machine)
 *   · TASTE.md   — the human + skill readable summary (few-shot exemplars the skill imitates)
 *
 * Single source of truth stays BRAND.md §3. This is derived DATA — the founder's ear,
 * encoded. When a pattern here is stable across sessions, promote it into §3 by hand.
 *
 * Usage: node compile-taste.mjs   (run from studio/brand/taste/)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const AXES = ["stance", "altitude", "register", "motion", "breath", "temp", "rhythm"];
const HALF_LIFE_DAYS = 90;

const items = JSON.parse(readFileSync(join(DIR, "items.json"), "utf8")).items;
const byId = Object.fromEntries(items.map((i) => [i.id, i]));

const readJsonl = (p) => existsSync(p)
  ? readFileSync(p, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l))
  : [];
// bootstrap = obvious shipped-vs-retired poles (my priors, down-weighted); judgements =
// the founder's real pairwise ratings (full weight, recency-decayed).
const bootstrap = readJsonl(join(DIR, "bootstrap.jsonl"));
const rated = readJsonl(join(DIR, "judgements.jsonl"));
const judgements = rated; // "confident" is gated on the founder's ratings, not the bootstrap
const all = [...bootstrap, ...rated];

const sig = (x) => 1 / (1 + Math.exp(-x));
const now = Date.now();
const BOOT_WEIGHT = 0.4;
const wOf = (j) => j.src === "bootstrap"
  ? BOOT_WEIGHT
  : Math.pow(0.5, ((now - (j.ts || now)) / 86400000) / HALF_LIFE_DAYS);

// ── Fit Bradley-Terry by weighted gradient ascent ───────────────────────────
const theta = Object.fromEntries(items.map((i) => [i.id, 0]));
const EPOCHS = 500;
for (let e = 0; e < EPOCHS; e++) {
  const lr = 0.25 * (1 - e / EPOCHS) + 0.02;
  for (const j of all) {
    if (!(j.a in theta) || !(j.b in theta)) continue;
    const w = wOf(j);
    if (j.winner === "both") { theta[j.a] -= lr * w * 0.5; theta[j.b] -= lr * w * 0.5; continue; }
    const win = j.winner, lose = j.a === win ? j.b : j.a;
    if (theta[lose] === undefined) continue;
    const err = 1 - sig(theta[win] - theta[lose]);
    theta[win] += lr * w * err; theta[lose] -= lr * w * err;
  }
}
// center
const mean = Object.values(theta).reduce((a, b) => a + b, 0) / (items.length || 1);
for (const id in theta) theta[id] -= mean;

// ── Per-axis lean (Pearson corr of axis value vs score, over shown items) ────
const shownIds = new Set();
for (const j of all) { shownIds.add(j.a); shownIds.add(j.b); }
const seen = items.filter((i) => shownIds.has(i.id));
function pearson(xs, ys) {
  const n = xs.length; if (n < 2) return 0;
  const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) { const a = xs[i] - mx, b = ys[i] - my; num += a * b; dx += a * a; dy += b * b; }
  return dx && dy ? num / Math.sqrt(dx * dy) : 0;
}
const leans = {};
for (const ax of AXES)
  leans[ax] = seen.length >= 2 ? pearson(seen.map((i) => i.axes[ax] ?? 2), seen.map((i) => theta[i.id])) : 0;

// ── Exemplars / anti-exemplars ──────────────────────────────────────────────
const ranked = [...items].sort((a, b) => theta[b.id] - theta[a.id]);
const enough = judgements.length >= 12;
const exemplars = ranked.slice(0, 8);
const anti = ranked.slice(-8).reverse();

// ── Write taste.json ────────────────────────────────────────────────────────
writeFileSync(join(DIR, "taste.json"), JSON.stringify({
  generated: new Date().toISOString(),
  ratings: judgements.length,
  confident: enough,
  scores: Object.fromEntries(ranked.map((i) => [i.id, +theta[i.id].toFixed(3)])),
  leans: Object.fromEntries(AXES.map((a) => [a, +leans[a].toFixed(3)])),
  exemplars: exemplars.map((i) => i.id),
  antiExemplars: anti.map((i) => i.id),
}, null, 2) + "\n");

// ── Write TASTE.md (what the skill reads) ───────────────────────────────────
function leanLine(ax) {
  const r = leans[ax];
  const strength = Math.abs(r) < 0.15 ? "weak" : Math.abs(r) < 0.4 ? "leans" : "strong";
  const dir = ax === "temp"
    ? (r > 0 ? "toward calm-confident" : "away from calm (too hot or too cold)")
    : (r > 0 ? `toward more ${ax}` : `toward less ${ax}`);
  return `- **${ax}** — ${strength} ${dir} (r=${r.toFixed(2)})`;
}
const header = enough
  ? `Derived from **${judgements.length}** pairwise ratings (recency-weighted, ${HALF_LIFE_DAYS}-day half-life). This is the founder's ear, encoded. Imitate the exemplars, avoid the anti-exemplars.`
  : `⚠ Only **${judgements.length}** ratings so far — this is a **seed**, not yet trustworthy. Rate ~60 pairs over 3 sessions (open rater.html) then re-run. Until then, lean on BRAND.md §3 and the seed poles below.`;

const md = `# Signal Studio — the founder's taste

> Generated by \`compile-taste.mjs\` on ${new Date().toISOString().slice(0, 10)}. Derived data, not law.
> Canonical voice lives in \`studio/BRAND.md\` §3. When a pattern here holds across sessions, promote it into §3 by hand.

${header}

## Axis leans

${AXES.map(leanLine).join("\n")}

## Exemplars — write like these

${exemplars.map((i) => `- "${i.text}"  \`${i.subject}\``).join("\n")}

## Anti-exemplars — never like these

${anti.map((i) => `- "${i.text}"  \`${i.subject}\``).join("\n")}

---
_${judgements.length} ratings · ${enough ? "confident" : "seed — keep rating"} · items: ${items.length}_
`;
writeFileSync(join(DIR, "TASTE.md"), md);

console.log(`compile-taste: ${judgements.length} ratings → taste.json + TASTE.md ${enough ? "(confident)" : "(seed — rate more)"}`);
if (!enough) console.log("Open rater.html, rate ~60 pairs over a few days, Export → judgements.jsonl here, re-run.");
