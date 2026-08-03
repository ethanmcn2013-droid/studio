#!/usr/bin/env node
/**
 * Demonstration-number reconciliation harness (E09.09).
 *
 * E09.09 reads: "Reconcile every sample invitation count, adoption metric,
 * report number, date and product-reach value." Reconciliation is inherently
 * cross-surface, and before this script there was no cross-surface anything:
 * the portal fixture, the marketing pages, the wireframes, the rendered
 * prototype and the product demo fixtures each carried their own numbers and
 * none derived from another. Nothing would have failed if they disagreed, and
 * they do disagree.
 *
 * This is the harness, not the reconciliation. E09.09 depends on E09.07's
 * deterministic fixture, which is being built in parallel, so the numbers
 * cannot be made to agree yet. What can exist now is the thing that notices:
 * a script that walks every place a sample number appears, extracts it,
 * and reports every inconsistency. Run it before and after E09.07 lands and
 * the difference is the reconciliation.
 *
 * What it reports, in order of how much it matters:
 *
 *   RETIRED   A number or label that encodes the allotment model E09.01
 *             section 4.1 retired permanently. "Allotted", "Available",
 *             "codes remaining", "licences allotted". These are not drift,
 *             they are a model that no longer exists reaching a venue.
 *   UNDEFINED A venue-facing metric with no definition in E09.02.
 *   MISSING   An E09.02 metric with no representation anywhere.
 *   DRIFT     One metric or story constant carrying two different values on
 *             two surfaces.
 *   UNWIRED   A surface that carries a sample number as a hand-written
 *             literal rather than deriving it from a fixture. These are the
 *             ones that will silently drift the moment the fixture changes,
 *             which is the failure mode E09.07 makes imminent.
 *   UNKNOWN   A file carrying venue-metric-shaped claims that is not in the
 *             surface registry. New drift sources announce themselves here
 *             instead of arriving unnoticed.
 *
 * Usage:
 *   node scripts/check-demo-number-reconciliation.mjs           report, exit 1 on any finding
 *   node scripts/check-demo-number-reconciliation.mjs --report  report, always exit 0
 *   node scripts/check-demo-number-reconciliation.mjs --json    machine-readable
 *   node scripts/check-demo-number-reconciliation.mjs --only=DRIFT,RETIRED
 *
 * Read-only.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const STUDIO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKSPACE_ROOT = path.resolve(STUDIO_ROOT, "..");

const repoRoot = (repo) =>
  repo === "studio" ? STUDIO_ROOT : path.join(WORKSPACE_ROOT, repo);

// ── the surface registry ─────────────────────────────────────────────────────
//
// `role` decides how a finding is graded:
//   canonical      the value other surfaces are reconciled against
//   venue-facing   a venue, coordinator or couple can read it
//   internal       a programme document; drift matters but nobody is misled
//   retired        superseded by E09.01, kept only so its numbers are visible
//
// `derivesFrom` names the module a surface should read its numbers from. A
// surface with claims and no derivesFrom import is UNWIRED.

const SURFACES = [
  {
    id: "portal-fixture",
    repo: "studio",
    file: "src/lib/account/fixtures.ts",
    label: "Venue Portal snapshot fixtures",
    role: "canonical",
    canonicalFor: ["venue-metrics"],
  },
  {
    id: "product-story-fixture",
    repo: "app",
    file: "src/lib/review-suite-fixture.ts",
    label: "Review suite story fixture",
    role: "canonical",
    canonicalFor: ["story"],
  },
  {
    id: "demo-clock",
    repo: "app",
    file: "src/lib/demo-clock.ts",
    label: "The pinned demonstration clock",
    role: "canonical",
    canonicalFor: ["clock"],
    optional: true,
  },
  {
    id: "calendar-frame",
    repo: "app",
    file: "src/lib/calendar-frame.ts",
    label: "Tasks pinned review calendar frame",
    role: "internal",
    derivesFrom: "src/lib/demo-clock.ts",
  },
  {
    id: "timeline-hero-fixture",
    repo: "studio",
    file: "src/components/marketing/heroes/timeline/fixture.ts",
    label: "Marketing Timeline hero fixture",
    role: "venue-facing",
    derivesFrom: "src/lib/review-suite-fixture.ts",
  },
  {
    id: "venues-offer-page",
    repo: "studio",
    file: "src/app/venues/page.tsx",
    label: "The Founding 25 offer page",
    role: "venue-facing",
    derivesFrom: "src/lib/account/fixtures.ts",
  },
  {
    id: "venues-walkthrough",
    repo: "studio",
    file: "src/app/venues/demo/page.tsx",
    label: "The venue walkthrough page",
    role: "venue-facing",
    derivesFrom: "src/lib/account/fixtures.ts",
  },
  {
    id: "public-timeline-demo",
    repo: "app",
    file: "src/app/the-wedding/page.tsx",
    label: "The public Timeline demonstration",
    role: "venue-facing",
    derivesFrom: "src/lib/review-suite-fixture.ts",
  },
  {
    id: "tasks-demo-board",
    repo: "app",
    file: "src/server/demo/tasks-demo.ts",
    label: "The Tasks demonstration board",
    role: "internal",
    derivesFrom: "src/lib/demo-clock.ts",
  },
  {
    id: "notes-demo",
    repo: "app",
    file: "src/modules/notes/server/demo/notes-demo.ts",
    label: "The Notes demonstration notebook",
    role: "internal",
    derivesFrom: "src/lib/demo-clock.ts",
    optional: true,
  },
  {
    id: "signal-mock-source",
    repo: "app",
    file: "src/modules/signal/lib/briefing/mock-source.ts",
    label: "The Signal briefing mock source",
    role: "internal",
    derivesFrom: "src/lib/demo-clock.ts",
  },
  {
    id: "timeline-demo-data",
    repo: "app",
    file: "src/modules/timeline/lib/roadmap/demo-data.ts",
    label: "The Timeline demonstration data",
    role: "internal",
    derivesFrom: "src/lib/demo-clock.ts",
    optional: true,
  },
  {
    id: "portal-wireframes",
    repo: "studio",
    file: "docs/venue-portal/WIREFRAMES.md",
    label: "Venue Portal wireframes",
    role: "internal",
  },
  {
    id: "portal-prototype",
    repo: "studio",
    file: "docs/venue-portal/phase-a-wireframes.html",
    label: "Venue Portal rendered prototype",
    role: "internal",
  },
  {
    id: "venue-facing-claims",
    repo: "studio",
    file: "docs/venue-portal/VENUE_FACING_CLAIMS.md",
    label: "Venue-facing claims sheet",
    role: "internal",
  },
  {
    id: "retired-dictionary",
    repo: "studio",
    file: "docs/venue-portal/METRIC_DICTIONARY.md",
    label: "The retired venue-metrics.v1 dictionary",
    role: "retired",
  },
  {
    id: "venue-seed-collateral",
    repo: "studio",
    file: "public/brand/collateral/venue/wedding-seed.md",
    label: "The venue demonstration seed sheet",
    role: "venue-facing",
  },
];

// ── what E09.02 actually defines ─────────────────────────────────────────────

const E09_02_METRICS = {
  "first-useful-action": {
    section: "E09.02 section 2",
    fixtureFields: ["firstUsefulAction"],
    prose: [/first useful action/i, /have started planning/i],
  },
  "recent-use": {
    section: "E09.02 section 3",
    fixtureFields: ["activeRecently"],
    prose: [/in the last 30 days/i, /recent use/i],
  },
  continuation: {
    section: "E09.02 section 4",
    fixtureFields: ["continuedAfter30Days"],
    prose: [/came back around a month/i, /returned around day 30/i],
  },
  "product-reach": {
    section: "E09.02 section 5",
    fixtureFields: ["workspacesReached"],
    prose: [/product reach/i],
  },
  "timeline-creation": {
    section: "E09.02 section 6",
    fixtureFields: ["timelineCreated", "timelinesCreated", "shapedTimeline"],
    prose: [/shaped their own timeline/i],
  },
  "timeline-sharing": {
    section: "E09.02 section 7",
    fixtureFields: ["timelineShared", "currentlyShared", "everShared"],
    prose: [/timeline live for their guests/i, /currently shared/i],
  },
};

/** Tier 2 commercial facts, E09.01 section 4. Defined, retained, not retired. */
const TIER_2_FIELDS = ["issued", "redeemed", "outstanding", "released"];

/** E09.01 section 4.1 — retired permanently under D-020. */
const RETIRED_FIELDS = ["allotted", "available", "remaining", "codesRemaining"];

/**
 * Copy-level retirements. These run over prose, markup and labels. They
 * deliberately do NOT re-scan the structured fixture fields, which the
 * numeric extractor already reports, because reporting one defect twice
 * teaches a reader to skim the output.
 */
const RETIRED_PHRASES = [
  { re: /codes remaining/i, why: "E09.01 section 4.1 retired the phrase 'codes remaining' in any venue-facing surface." },
  { re: /licences? allotted/i, why: "E09.01 section 4.1 retired 'licences allotted' permanently under D-020." },
  { re: /\ballotted\b/i, why: "E09.01 section 4.1 retired the allotment model under D-020.", proseOnly: true },
  { re: /\bremaining\b/i, why: "'remaining' is the retired 'codes remaining' figure wearing a shorter label.", proseOnly: true },
  { re: /low allotment/i, why: "E09.01 section 4.1 retired the low-allotment attention item." },
  { re: /\bX of your \d+\b/i, why: "E09.02 section 8 prohibits any sentence containing 'X of your 60'." },
  { re: /\bseats?\b(?![ ](of|at)[ ](the[ ])?(table|ceremony))/i, why: "E09.10 section 2 never-list: seats, seat count." },
];

/**
 * E09.10 P7 — "18 months" alone is wrong, because the term is 18 months from
 * redemption OR 3 months past the wedding, whichever is later. The bare figure
 * describes a product this programme deliberately does not ship.
 */
const P7 = {
  re: /\b18\s*months?\b/gi,
  graceWindow: 160,
  grace: /whichever is later|3 months past|three months past|past the wedding/i,
};

// ── story constants ──────────────────────────────────────────────────────────

const STORY = {
  "venue-name": {
    canonical: "Glenmara House",
    basis: "D-012 point 1",
    candidates: [
      { value: "Glenmara House", re: /Glenmara House/g },
      { value: "Glenmara Estate", re: /Glenmara Estate/g },
      { value: "Glenmara", re: /Glenmara(?! House| Estate)/g },
      { value: "The Orchard", re: /The Orchard/g },
      { value: "Glen House", re: /Glen House/g },
    ],
  },
  "couple-names": {
    canonical: "Mara and Finn",
    basis: "D-012 point 1",
    candidates: [
      { value: "Mara and Finn", re: /Mara (?:and|&) Finn/g },
      { value: "Aoife and Dan", re: /Aoife (?:and|&) Dan/g },
      { value: "Nora and Cian", re: /Nora (?:and|&) Cian/g },
      { value: "Aisling and Tom", re: /Aisling (?:and|&) Tom/g },
    ],
  },
  "wedding-date": {
    canonical: null, // read from demo-clock.ts if present
    basis: "determination recorded in app/src/lib/demo-clock.ts (DEMO_WEDDING_DATE), pending founder ratification",
    candidates: [
      { value: "2026-10-03", re: /2026-10-03/g },
      { value: "2026-09-12", re: /2026-09-12/g },
    ],
  },
  "pinned-today": {
    canonical: null, // read from demo-clock.ts if present
    basis: "app/src/lib/demo-clock.ts (DEMO_TODAY)",
    candidates: [
      { value: "2026-07-16", re: /2026-07-16/g },
      { value: "2026-07-27", re: /2026-07-27/g },
      { value: "2026-07-24", re: /2026-07-24/g },
      { value: "2026-07-13", re: /2026-07-13/g },
      { value: "2026-07-15", re: /2026-07-15/g },
    ],
  },
};

// ── prose claim patterns ─────────────────────────────────────────────────────
//
// Deliberately narrow. A generic number grep over a TSX file returns Tailwind
// classes and nothing else, so each pattern names the shape of a real claim.

// A single space between the number and the word, never `\s+`. Column-aligned
// ASCII tables in the wireframes otherwise read "GH-••••-21    Redeemed" as the
// claim "21 redeemed", which is how a harness earns a reputation for noise.
const PROSE_PATTERNS = [
  { key: "ratio", re: /\b(\d{1,4}) of (\d{1,4})\b(?![ ]?(px|rem|em))/g, render: (m) => `${m[1]} of ${m[2]}` },
  { key: "couples", re: /\b(\d{1,4}) couples?\b/gi, render: (m) => `${m[1]} couples` },
  { key: "invitations", re: /\b(\d{1,4}) (?:invitations?|codes?)\b/gi, render: (m) => `${m[1]} invitations` },
  { key: "issued", re: /\b(\d{1,4}) issued\b/g, render: (m) => `${m[1]} issued` },
  { key: "activated", re: /\b(\d{1,4}) activated\b/g, render: (m) => `${m[1]} activated` },
  { key: "redeemed", re: /\b(\d{1,4}) redeemed\b/g, render: (m) => `${m[1]} redeemed` },
  { key: "days-covered", re: /\b(\d{1,4}) of (\d{1,4}) days\b/gi, render: (m) => `${m[1]} of ${m[2]} days` },
  { key: "active-days", re: /\b(\d{1,4}) (?:venue )?active days\b/gi, render: (m) => `${m[1]} active days` },
  { key: "active-workspaces", re: /\b(\d{1,4}) active sponsored workspaces\b/gi, render: (m) => `${m[1]} active sponsored workspaces` },
  { key: "days-to-event", re: /\b(\d{1,4}) days? to (?:event|the day|the wedding)\b/gi, render: (m) => `${m[1]} days to event` },
  { key: "code-prefix", re: /\b(G[A-Z])-(?:[••]{2,}|\d{2,})[-\d]*\b/g, render: (m) => `code prefix ${m[1]}` },
];

// ── run ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const jsonOut = args.includes("--json");
const reportOnly = args.includes("--report");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? new Set(onlyArg.slice("--only=".length).split(",").map((s) => s.trim().toUpperCase())) : null;

const findings = [];
const add = (kind, surfaceId, where, detail, extra = {}) =>
  findings.push({ kind, surfaceId, where, detail, ...extra });

const loaded = [];
for (const surface of SURFACES) {
  const absolute = path.join(repoRoot(surface.repo), surface.file.split("/").join(path.sep));
  if (!fs.existsSync(absolute)) {
    if (!surface.optional) {
      add("UNKNOWN", surface.id, `${surface.repo}/${surface.file}`, "declared surface does not exist. Remove it from the registry or restore the file.");
    }
    continue;
  }
  loaded.push({ ...surface, absolute, text: fs.readFileSync(absolute, "utf8") });
}

const bySurfaceId = new Map(loaded.map((s) => [s.id, s]));

// canonical clock values, if E09.07's module has landed
const clock = bySurfaceId.get("demo-clock");
if (clock) {
  const wedding = clock.text.match(/DEMO_WEDDING_DATE\s*=\s*"(\d{4}-\d{2}-\d{2})"/);
  const today = clock.text.match(/DEMO_TODAY\s*=\s*"(\d{4}-\d{2}-\d{2})"/);
  if (wedding) STORY["wedding-date"].canonical = wedding[1];
  if (today) STORY["pinned-today"].canonical = today[1];
}

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

// ── extraction ───────────────────────────────────────────────────────────────

/** claims: metricKey -> [{ surfaceId, value, line, raw }] */
const claims = new Map();
const record = (key, entry) => {
  if (!claims.has(key)) claims.set(key, []);
  claims.get(key).push(entry);
};

const FIXTURE_VALUE = /(\w+):\s*(exact|lowerBound)\(\s*(\d+)\s*(?:,\s*(\d+)\s*)?\)/g;
const FIXTURE_BLOCK = /export const (VENUE_[A-Z_]+)/g;
const PRODUCT_LABEL = /product:\s*"([A-Za-z]+)"/g;

function nearestBefore(text, index, pattern, fallback) {
  let value = fallback;
  const rx = new RegExp(pattern.source, "g");
  let m;
  while ((m = rx.exec(text)) && m.index < index) value = m[1];
  return value;
}

function blockNameAt(text, index) {
  return nearestBefore(text, index, FIXTURE_BLOCK, "(top level)");
}

/** Strip comments so a doc comment explaining a superseded value is not read
 *  as that value still being live. */
function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(Math.max(0, m.length - p1.length)));
}

for (const surface of loaded) {
  const { text, id } = surface;
  const isCode = /\.(tsx?|mjs)$/i.test(surface.file);
  const lines = text.split("\n");
  // Markdown wraps a claim across two lines ("partial for 3 of\n  30 days"),
  // so continuation newlines are replaced with a space. One character for one
  // character, which keeps every index and therefore every line number exact.
  const flowed = /\.md$/i.test(surface.file) ? text.replace(/\n(?=[ \t]+\S)/g, " ") : text;
  const bare = isCode ? stripComments(text) : flowed;

  // structured fixture values
  FIXTURE_VALUE.lastIndex = 0;
  let m;
  while ((m = FIXTURE_VALUE.exec(text))) {
    const [raw, field, form, value, denominator] = m;
    const block = blockNameAt(text, m.index);
    const line = lineOf(text, m.index);
    // Product reach is four independent counts over overlapping sets
    // (E09.02 section 5). They do not sum and they are not one another's
    // drift, so each product is its own key.
    const product =
      field === "workspacesReached" ? nearestBefore(text, m.index, PRODUCT_LABEL, "unknown") : null;
    const key = product ? `${block}.productReach.${product}` : `${block}.${field}`;
    record(key, {
      surfaceId: id,
      value: denominator ? `${value} of ${denominator}` : value,
      line,
      raw: raw.trim(),
      form,
      field,
    });

    if (RETIRED_FIELDS.includes(field)) {
      add(
        "RETIRED",
        id,
        `${surface.repo}/${surface.file}:${line}`,
        `field "${field}" carries ${raw.trim()}. E09.01 section 4.1 retired this permanently under D-020, and it reaches the venue as a label on screen, in the PDF and in the CSV.`,
      );
    }
  }

  // retired phrases. The retired dictionary is expected to contain them.
  if (surface.role !== "retired") {
    for (const { re, why, proseOnly } of RETIRED_PHRASES) {
      if (proseOnly && isCode) continue;
      const rx = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
      let p;
      while ((p = rx.exec(bare))) {
        const line = lineOf(bare, p.index);
        const snippet = lines[line - 1]?.trim().slice(0, 120) ?? "";
        add("RETIRED", id, `${surface.repo}/${surface.file}:${line}`, `${why} Line reads: ${snippet}`);
        if (rx.lastIndex === p.index) rx.lastIndex += 1;
      }
    }
  }

  // E09.10 P7 — "18 months" without its grace clause
  if (surface.role === "venue-facing" || surface.role === "internal") {
    const rx = new RegExp(P7.re.source, P7.re.flags);
    let p;
    while ((p = rx.exec(bare))) {
      const window = bare.slice(p.index, p.index + P7.graceWindow);
      if (P7.grace.test(window)) continue;
      const line = lineOf(bare, p.index);
      add(
        "RETIRED",
        id,
        `${surface.repo}/${surface.file}:${line}`,
        `E09.10 P7: "18 months" with no grace clause within ${P7.graceWindow} characters. The term is 18 months from when the couple opens it, or 3 months past the wedding, whichever is later (D-010.2, D-022). Line reads: ${lines[line - 1]?.trim().slice(0, 120) ?? ""}`,
      );
    }
  }

  // prose claims, only on surfaces a person reads
  if (surface.role === "venue-facing" || surface.role === "internal") {
    for (const pattern of PROSE_PATTERNS) {
      const rx = new RegExp(pattern.re.source, pattern.re.flags);
      let p;
      while ((p = rx.exec(bare))) {
        const line = lineOf(bare, p.index);
        const lineText = lines[line - 1] ?? "";
        // Tailwind and CSS noise: a claim never sits inside a class string.
        if (/className=|class="|style=|--[a-z-]+:|\d+px|grid-cols|rounded-|leading-/.test(lineText)) continue;
        record(`prose.${pattern.key}`, {
          surfaceId: id,
          value: pattern.render(p),
          line,
          raw: lineText.trim().slice(0, 120),
        });
        if (rx.lastIndex === p.index) rx.lastIndex += 1;
      }
    }
  }

  // story constants. The canonical clock module declares every pinned instant
  // in the repository on purpose, with a reason for each, so it is the source
  // of that set and not a surface that drifts from it.
  for (const [key, spec] of Object.entries(STORY)) {
    if (surface.canonicalFor?.includes("clock") && (key === "pinned-today" || key === "wedding-date")) continue;
    for (const candidate of spec.candidates) {
      const rx = new RegExp(candidate.re.source, candidate.re.flags);
      const hits = bare.match(rx);
      if (!hits?.length) continue;
      record(`story.${key}`, {
        surfaceId: id,
        value: candidate.value,
        line: lineOf(bare, bare.search(new RegExp(candidate.re.source))),
        raw: `${hits.length} occurrence(s)`,
      });
    }
  }

  // unwired: carries a claim but does not import its declared source
  if (surface.derivesFrom) {
    const importName = path.posix.basename(surface.derivesFrom).replace(/\.tsx?$/, "");
    if (!text.includes(importName)) surface.unwired = true;
  }
}

// ── grading ──────────────────────────────────────────────────────────────────

// UNDEFINED: a fixture field on a venue-facing path that E09.02 does not define
const definedFields = new Set([
  ...Object.values(E09_02_METRICS).flatMap((m) => m.fixtureFields),
  ...TIER_2_FIELDS,
  ...RETIRED_FIELDS,
]);
const seenFields = new Set();
for (const entries of claims.values()) {
  for (const e of entries) if (e.field) seenFields.add(e.field);
}
for (const field of [...seenFields].sort()) {
  if (definedFields.has(field)) continue;
  const where = [...claims.entries()]
    .filter(([, v]) => v.some((e) => e.field === field))
    .map(([k]) => k)
    .join(", ");
  add(
    "UNDEFINED",
    "portal-fixture",
    where,
    `metric field "${field}" is shown to a venue and has no definition in E09.02. Either it is defined and ratified, or it does not render.`,
  );
}

// MISSING: an E09.02 metric with no representation anywhere
for (const [metricId, spec] of Object.entries(E09_02_METRICS)) {
  const present =
    spec.fixtureFields.some((f) => seenFields.has(f)) ||
    loaded.some((s) => spec.prose.some((re) => re.test(s.text)));
  if (!present) {
    add(
      "MISSING",
      "portal-fixture",
      spec.section,
      `${metricId} is defined in ${spec.section} and appears on no surface. A defined metric with no implementation cannot be reconciled, and a venue asked to ratify it is ratifying a definition with nothing behind it.`,
    );
  }
}

const surfaceFile = (id) => {
  const s = bySurfaceId.get(id);
  return s ? `${s.repo}/${s.file}` : id;
};
const where = (hits) =>
  [...new Set(hits.map((h) => `${surfaceFile(h.surfaceId)}:${h.line}`))].join(", ");

// DRIFT, story keys: measured against the canonical answer, not against
// whether the values happen to be uniform.
for (const [key, spec] of Object.entries(STORY)) {
  const entries = claims.get(`story.${key}`);
  if (!entries?.length) continue;
  if (!spec.canonical) {
    add("DRIFT", "(cross-surface)", `story.${key}`, `no canonical value is available for ${key}, so nothing can be reconciled against it. ${spec.basis}`);
    continue;
  }
  const wrong = entries.filter((e) => e.value !== spec.canonical);
  if (!wrong.length) continue;
  const byValue = new Map();
  for (const e of wrong) {
    if (!byValue.has(e.value)) byValue.set(e.value, []);
    byValue.get(e.value).push(e);
  }
  for (const [value, hits] of byValue) {
    add(
      "DRIFT",
      "(cross-surface)",
      `story.${key}`,
      `canonical is "${spec.canonical}" (${spec.basis}). Found "${value}" at ${where(hits)}.`,
      { values: [value] },
    );
  }
}

// DRIFT, metric and prose keys: one key carrying more than one value.
for (const [key, entries] of [...claims.entries()].sort()) {
  if (key.startsWith("story.")) continue;
  const distinct = new Map();
  for (const e of entries) {
    if (!distinct.has(e.value)) distinct.set(e.value, []);
    distinct.get(e.value).push(e);
  }
  if (distinct.size <= 1) continue;
  const detail = [...distinct.entries()].map(([value, hits]) => `${value} at ${where(hits)}`).join(" · ");
  add("DRIFT", entries[0].surfaceId, key, `no single value. Found: ${detail}`, {
    values: [...distinct.keys()],
  });
}

// UNWIRED
for (const surface of loaded) {
  if (!surface.unwired) continue;
  const carries = [...claims.values()].some((entries) => entries.some((e) => e.surfaceId === surface.id));
  if (!carries) continue;
  add(
    "UNWIRED",
    surface.id,
    `${surface.repo}/${surface.file}`,
    `carries sample numbers as hand-written literals and does not read ${surface.derivesFrom}. It will drift the moment the fixture changes, silently, with nothing failing.`,
  );
}

// UNKNOWN: files outside the registry that carry venue-metric-shaped claims
const SWEEP_ROOTS = [
  { repo: "studio", dir: "src" },
  { repo: "app", dir: "src" },
];
const SKIP = /(^|[\\/])(node_modules|\.next|\.git|out|dist|coverage)([\\/]|$)/;
const registryPaths = new Set(loaded.map((s) => path.join(repoRoot(s.repo), s.file.split("/").join(path.sep))));
const SIGNAL = /(exact|lowerBound)\(\s*\d+/;

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (SKIP.test(full)) continue;
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

for (const { repo, dir } of SWEEP_ROOTS) {
  for (const file of walk(path.join(repoRoot(repo), dir))) {
    if (!/\.(tsx?|mjs)$/i.test(file)) continue;
    if (/\.test\.|__tests__|\.spec\./i.test(file)) continue;
    if (registryPaths.has(file)) continue;
    let text = "";
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (!SIGNAL.test(text)) continue;
    add(
      "UNKNOWN",
      "(unregistered)",
      `${repo}/${path.relative(repoRoot(repo), file).split(path.sep).join("/")}`,
      "carries metric-shaped sample values and is not in the surface registry. Add it to SURFACES so its numbers are reconciled, or remove the values.",
    );
  }
}

// ── output ───────────────────────────────────────────────────────────────────

const ORDER = ["RETIRED", "UNDEFINED", "MISSING", "DRIFT", "UNWIRED", "UNKNOWN"];
const shown = findings.filter((f) => !only || only.has(f.kind));
shown.sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));

if (jsonOut) {
  console.log(
    JSON.stringify(
      {
        surfacesDeclared: SURFACES.length,
        surfacesFound: loaded.length,
        claimKeys: claims.size,
        counts: Object.fromEntries(ORDER.map((k) => [k, findings.filter((f) => f.kind === k).length])),
        findings: shown,
      },
      null,
      2,
    ),
  );
} else {
  console.log("Demonstration-number reconciliation (E09.09)");
  console.log("");
  console.log(`  surfaces declared   ${SURFACES.length}`);
  console.log(`  surfaces found      ${loaded.length}`);
  console.log(`  claim keys tracked  ${claims.size}`);
  console.log("");
  for (const kind of ORDER) {
    const rows = shown.filter((f) => f.kind === kind);
    if (!rows.length) continue;
    console.log(`  ${kind}  (${rows.length})`);
    for (const r of rows) {
      console.log(`    ${r.where}`);
      console.log(`      ${r.detail}`);
    }
    console.log("");
  }
  const counts = ORDER.map((k) => `${k} ${findings.filter((f) => f.kind === k).length}`).join(" · ");
  console.log(`  ${counts}`);
  console.log(`  ${findings.length} finding(s) total`);
}

process.exit(reportOnly || findings.length === 0 ? 0 : 1);
