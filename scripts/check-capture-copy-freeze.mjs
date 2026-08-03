#!/usr/bin/env node

/**
 * The capture-copy freeze.
 *
 *   node scripts/check-capture-copy-freeze.mjs            verify
 *   node scripts/check-capture-copy-freeze.mjs --write     record the manifest
 *   node scripts/check-capture-copy-freeze.mjs --readiness report what blocks the freeze
 *
 * D-008 sets the copy freeze at 2026-08-21 and the capture freeze at
 * 2026-08-22. E09.12 is that freeze.
 *
 * A FREEZE IS A RECORDED STATE, NOT A CLAIM. Declaring copy frozen in a
 * document changes nothing: the string is still one careless edit away from
 * moving between the day it was approved and the day it is filmed. So the
 * mechanism is a manifest of every capture-copy string with a hash, and a
 * check that says which string moved.
 *
 * TWO THINGS THIS DELIBERATELY DOES.
 *
 * It records STRINGS, not files. A file hash tells you something changed. A
 * string hash tells you "the Notes note body moved", which is the sentence a
 * person can act on.
 *
 * It refuses to freeze a defect quietly. Every extracted string is run
 * against the prohibited-claims list from E09.11 before it is recorded. A
 * string that violates is recorded by hash and by rule, and its TEXT IS NOT
 * STORED, because copying a P8 dietary line into an evidence file to prove it
 * is a P8 dietary line is the failure it names. Those strings are reported by
 * `--readiness` as what blocks the freeze.
 *
 * WHAT IT DOES NOT COVER. Rendered output. A string can be correct in source
 * and wrong on screen through composition. The runtime counterpart is
 * `app/scripts/demo-reset.mjs`, which hashes the rendered demonstration state
 * itself, and `app/scripts/experience/demo-determinism.mjs`, which proves that
 * state does not move with the wall clock.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const root = process.cwd();
const MANIFEST =
  "docs/execution/venue-edition-and-films/evidence/copy/capture-copy-manifest.v1.json";
const CLAIMS =
  "docs/execution/venue-edition-and-films/evidence/copy/prohibited-claims.v1.json";

const write = process.argv.includes("--write");
const readiness = process.argv.includes("--readiness");

const abs = (p) => path.join(root, p);
const norm = (t) => t.replace(/\r\n?/g, "\n");
const hash = (t) => createHash("sha256").update(t).digest("hex").slice(0, 16);

/**
 * The capture surfaces. Every one of these is on screen during the live
 * walkthrough (E11.10 beats 1 to 6), in a film frame, or on the page a venue
 * reads before the call.
 *
 * Paths are relative to studio/. `../app/` reaches the product repository,
 * because the capture surfaces are mostly there and a freeze that stopped at
 * the repository boundary would freeze the landing page and none of the
 * product.
 */
const SURFACES = [
  { path: "../app/src/lib/review-suite-fixture.ts", beat: "the story: venue, couple, milestones" },
  { path: "../app/src/lib/demo-clock.ts", beat: "the story: anchor and wedding date" },
  { path: "../app/src/server/demo/tasks-demo.ts", beat: "beat 3, the Tasks board" },
  { path: "../app/src/modules/notes/server/demo/notes-demo.ts", beat: "beat 3, the Notes notebook" },
  { path: "../app/src/modules/timeline/lib/roadmap/demo-data.ts", beat: "beat 4, the Timeline" },
  { path: "../app/src/modules/signal/lib/briefing/mock-source.ts", beat: "beat 3, the Signal briefing" },
  { path: "../app/src/app/the-wedding/page.tsx", beat: "the couple-facing demonstration page" },
  { path: "../app/src/components/welcome/venue-welcome-card.tsx", beat: "beat 2, the couple opens it" },
  { path: "../app/src/lib/templates.generated.ts", beat: "beat 2, what the workspace opens with" },
  { path: "src/app/venues/page.tsx", beat: "the page a venue reads before the call" },
  { path: "src/lib/templates/wedding-planning-workspace/tasks.ts", beat: "template source, tasks" },
  { path: "src/lib/templates/wedding-planning-workspace/roadmap.ts", beat: "template source, roadmap" },
  { path: "src/lib/templates/wedding-planning-workspace/notes.ts", beat: "template source, notes" },
  { path: "src/lib/account/fixtures.ts", beat: "beat 5, the venue's own account" },
];

/* ------------------------------------------------------------------ *
 * Extraction
 * ------------------------------------------------------------------ */

/**
 * A copy string is a quoted literal a person would read. Identifiers, paths,
 * class names, imports and colour tokens are not copy, and including them
 * would make the manifest churn on every refactor until nobody read it.
 *
 * The first version of this filter required sentence punctuation or a common
 * stopword. It threw away "Collect final dietary notes", which is the single
 * string in this whole manifest that most needs to be pinned. A copy filter
 * that drops the defect is worse than no filter, so the rule is now shaped
 * around what is NOT copy rather than around what looks like a sentence.
 */
const NOT_COPY = [
  /^https?:/i,
  /^[\w.@-]+\/[\w./@-]*$/,
  /^#[0-9a-f]{3,8}$/i,
  /^use (client|server)$/,
  /^[A-Z0-9_\s]+$/,
  /^[\d\s:.,+%-]+$/,
  /\bfont-(?:feature|variant|family)\b/,
  /^(?:[a-z]+:)?[a-z-]+-(?:\d|\[)/,
  /\d+(?:px|rem|em|vh|vw)\b/,
  /rgba?\(|hsla?\(|var\(--|calc\(/,
  /^[\d\s.,%-]*(?:deg|ms|s)\b/,
];

/** Tailwind and CSS utility strings, the single biggest source of noise. */
const UTILITY = /(?:^|\s)(?:sm|md|lg|xl|2xl|hover|focus|active|group|dark|first|last|peer):|(?:^|\s)(?:text|bg|border|ring|fill|stroke|flex|grid|gap|inline|block|absolute|relative|sticky|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|w|h|min|max|rounded|shadow|opacity|z|overflow|tracking|leading|font|items|justify|self|col|row|order|space|divide|transition|duration|ease|scale|translate|rotate)-/;

function looksLikeCopy(text) {
  if (text.length < 12) return false;
  if ((text.match(/\s/g) ?? []).length < 2) return false;
  if (!/[a-z]/.test(text)) return false;
  if (UTILITY.test(text)) return false;
  if ((text.match(/-/g) ?? []).length > 3 && !/[.,:;?!]/.test(text)) return false;
  return !NOT_COPY.some((re) => re.test(text));
}

/**
 * Comments are stripped first. A comment is not copy, and a manifest that
 * trips on a reworded docblock is a manifest people learn to regenerate
 * without reading.
 */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/^[ \t]*\/\/.*$/gm, "");
}

/**
 * Quoted literals and JSX text nodes, with their line numbers. Template and
 * expression holes are normalised to `{}` so a rename of the variable does
 * not read as a change to the sentence.
 *
 * JSX text is extracted separately because the most important couple-facing
 * string in the whole capture, "Compliments of {sponsorName}" in
 * `venue-welcome-card.tsx`, is not a string literal. A freeze that missed it
 * would have frozen everything except the one line D-027 point 3 is about.
 */
function extract(source) {
  const out = [];
  const re =
    /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`|>([^<>`"']*?)</gs;
  const whole = stripComments(norm(source));
  let m;
  while ((m = re.exec(whole)) !== null) {
    const raw = m[1] ?? m[2] ?? m[3] ?? m[4] ?? "";
    const text = raw
      .replace(/\$?\{[^{}]*\}/g, "{}")
      .replace(/\\n/g, " ")
      .replace(/&[a-z]+;|&#\d+;/g, "")
      .replace(/\s+/g, " ")
      .trim();
    // The copy filter may drop a string. It may never drop a defect.
    // `entitlement: "18 months"` is nine characters with one space, so no
    // reasonable copy heuristic keeps it, and it is on screen four times in
    // the portal mock a prospect reads. Anything that breaks a prohibited
    // claim is recorded whatever its length or shape.
    if (!looksLikeCopy(text) && violations(text).length === 0) continue;
    const line = whole.slice(0, m.index).split("\n").length;
    out.push({ line, text });
  }
  // Same sentence twice in one file is one frozen string, recorded once.
  const seen = new Set();
  return out
    .filter(({ text }) => (seen.has(text) ? false : (seen.add(text), true)))
    .sort((a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0));
}

/* ------------------------------------------------------------------ *
 * Prohibited-claim screening
 * ------------------------------------------------------------------ */

const claims = JSON.parse(norm(readFileSync(abs(CLAIMS), "utf8")));

function violations(text) {
  const hit = [];
  for (const rule of claims.rules) {
    if (rule.punctuation) continue;
    if (rule.claimOnly && /\?\s*$/.test(text)) continue;
    if (rule.kind === "bare-term") {
      const re = new RegExp(rule.patterns[0], "gi");
      const grace = new RegExp(rule.gracePattern, "i");
      let m;
      while ((m = re.exec(text)) !== null) {
        if (!grace.test(text.slice(m.index, m.index + rule.graceWithin))) {
          hit.push(rule.id);
          break;
        }
      }
      continue;
    }
    if (rule.patterns.some((p) => new RegExp(p, "i").test(text))) hit.push(rule.id);
  }
  return [...new Set(hit)];
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

function build() {
  const surfaces = [];
  let strings = 0;
  let blocked = 0;

  for (const surface of SURFACES) {
    if (!existsSync(abs(surface.path))) {
      throw new Error(
        `capture surface ${surface.path} does not exist. A surface that ` +
          `vanishes from the manifest is a surface nobody notices went unfrozen.`,
      );
    }
    const source = norm(readFileSync(abs(surface.path), "utf8"));
    const found = extract(source);
    const entries = found.map(({ line, text }) => {
      const v = violations(text);
      strings += 1;
      if (v.length > 0) blocked += 1;
      return v.length > 0
        ? { h: hash(text), n: text.length, line, blockedBy: v, t: null }
        : { h: hash(text), n: text.length, line, t: text };
    });
    surfaces.push({
      path: surface.path,
      beat: surface.beat,
      fileHash: hash(source),
      stringCount: entries.length,
      strings: entries,
    });
  }

  return {
    version: "capture-copy-manifest.v1",
    task: "E09.12",
    recorded: "2026-08-03",
    frozen: false,
    freezeDate: "2026-08-22",
    copyFreezeDate: "2026-08-21",
    freezeNote:
      "frozen:false means this is a recorded state, not a declared freeze. " +
      "Today is 2026-08-03; the copy freeze is 2026-08-21 and the capture " +
      "freeze is 2026-08-22, and neither is a founder approval this file can " +
      "give itself. Drift is already detected: the check fails on any change " +
      "to a recorded string whether frozen is true or false. Setting it to " +
      "true changes the wording of the failure, not whether there is one.",
    blockedNote:
      "A string with blockedBy has its text withheld on purpose. Copying a " +
      "P8 dietary line into an evidence file to prove it is a P8 dietary line " +
      "is the failure it names. The hash still pins it, so a change is still " +
      "detected.",
    totals: { surfaces: surfaces.length, strings, blocked },
    surfaces,
  };
}

/* ------------------------------------------------------------------ *
 * Run
 * ------------------------------------------------------------------ */

const current = build();

if (write) {
  writeFileSync(abs(MANIFEST), `${JSON.stringify(current, null, 2)}\n`);
  console.log(
    `[capture-copy-freeze] recorded ${current.totals.strings} string(s) across ` +
      `${current.totals.surfaces} surface(s); ${current.totals.blocked} blocked by ` +
      `a prohibited claim`,
  );
  process.exit(0);
}

if (!existsSync(abs(MANIFEST))) {
  console.error(
    `[capture-copy-freeze] no manifest at ${MANIFEST}. Record one with --write.`,
  );
  process.exit(1);
}

const recorded = JSON.parse(norm(readFileSync(abs(MANIFEST), "utf8")));

if (readiness) {
  console.log("[capture-copy-freeze] readiness");
  console.log(`  recorded          ${recorded.recorded}`);
  console.log(`  copy freeze       ${recorded.copyFreezeDate} (D-008)`);
  console.log(`  capture freeze    ${recorded.freezeDate} (D-008)`);
  console.log(`  frozen            ${recorded.frozen}`);
  console.log(
    `  surfaces          ${recorded.totals.surfaces}` +
      `   strings ${recorded.totals.strings}` +
      `   blocked ${recorded.totals.blocked}`,
  );
  console.log("");
  if (recorded.totals.blocked === 0) {
    console.log("  Nothing in the recorded capture copy breaks a prohibited claim.");
  } else {
    console.log("  The freeze cannot be pulled while these strings are on a capture surface:");
    for (const s of recorded.surfaces) {
      const bad = s.strings.filter((e) => e.blockedBy);
      if (bad.length === 0) continue;
      console.log(`    ${s.path}  (${s.beat})`);
      for (const e of bad) {
        console.log(`      line ${e.line}  ${e.h}  ${e.blockedBy.join(", ")}  [text withheld]`);
      }
    }
  }
  console.log("");
  console.log("  Still required before the freeze can be declared:");
  console.log("    1. Founder approval of E09.11. A freeze of unapproved copy freezes a draft.");
  console.log("    2. The blocked strings above, each owned by a named task.");
  console.log("    3. E09.11 OQ-5 to OQ-8 answered.");
  console.log("    4. This manifest re-recorded on the day of the freeze, and frozen set to true.");
  process.exit(0);
}

/* Verify. */

const failures = [];
const byPath = new Map(recorded.surfaces.map((s) => [s.path, s]));

for (const s of current.surfaces) {
  const was = byPath.get(s.path);
  if (!was) {
    failures.push(`${s.path} is a capture surface with no entry in the manifest`);
    continue;
  }
  byPath.delete(s.path);
  const wasStrings = new Map(was.strings.map((e) => [e.h, e]));
  const nowStrings = new Map(s.strings.map((e) => [e.h, e]));

  for (const [h, e] of nowStrings) {
    if (!wasStrings.has(h)) {
      failures.push(
        `${s.path}:${e.line} carries a capture string that is not in the manifest ` +
          `(${h}${e.blockedBy ? `, blocked by ${e.blockedBy.join(", ")}` : ""})` +
          (e.t ? `: ${JSON.stringify(e.t.slice(0, 80))}` : ""),
      );
    }
  }
  for (const [h, e] of wasStrings) {
    if (!nowStrings.has(h)) {
      failures.push(
        `${s.path} no longer carries the recorded capture string ${h}` +
          (e.t ? `: ${JSON.stringify(e.t.slice(0, 80))}` : " [text withheld]"),
      );
    }
  }
}

for (const [p] of byPath) {
  failures.push(`${p} is in the manifest but is no longer a listed capture surface`);
}

if (failures.length > 0) {
  console.error(
    `[capture-copy-freeze] ${recorded.frozen ? "FREEZE VIOLATION" : "capture copy has moved since it was recorded"}`,
  );
  for (const f of failures) console.error(`- ${f}`);
  console.error(
    recorded.frozen
      ? "\n  The capture copy is frozen. This change needs founder approval and a " +
          "recorded re-freeze, not a manifest regeneration."
      : "\n  If the change is intended, re-record with --write in the same change, " +
          "so the move is on the record rather than absorbed.",
  );
  process.exit(1);
}

console.log(
  `[capture-copy-freeze] ok  ·  ${recorded.totals.strings} string(s) across ` +
    `${recorded.totals.surfaces} surface(s) match the recorded state` +
    (recorded.totals.blocked > 0
      ? `; ${recorded.totals.blocked} still blocked by a prohibited claim (run --readiness)`
      : ""),
);
