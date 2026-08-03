#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function read(file) {
  return readFileSync(path.join(root, file), "utf8");
}

function requireText(file, needle, reason) {
  if (!read(file).includes(needle)) {
    failures.push(`${file} is missing ${JSON.stringify(needle)} (${reason})`);
  }
}

function forbidText(file, needle, reason) {
  if (read(file).includes(needle)) {
    failures.push(`${file} still contains ${JSON.stringify(needle)} (${reason})`);
  }
}

function requireCount(file, needle, expected, reason) {
  const count = read(file).split(needle).length - 1;
  if (count !== expected) {
    failures.push(
      `${file} contains ${JSON.stringify(needle)} ${count} time(s), expected ${expected} (${reason})`,
    );
  }
}

const currentCommercialSources = [
  "docs/strategy/FOUNDING_25_BENEFITS_CHARTER.md",
  "docs/strategy/FOUNDING_25_PROGRAMME_MECHANICS.md",
  "docs/MARKETING_PLAN_6MO.md",
  "docs/VENUE_EDITIONS_PLAN.md",
  "docs/shipped-state.md",
  "docs/strategy/VENUE_EDITION_STRATEGY.md",
  "docs/strategy/VENUE_FULFILMENT_RUNBOOK.md",
  "docs/strategy/VENUE_GTM_EXECUTION_PLAN.md",
  "docs/strategy/VENUE_OUTREACH_SEQUENCE.md",
  "docs/strategy/VENUE_SALES_PACK.md",
  "docs/strategy/WEDDING_VENUE_OPERATING_MODEL.md",
  "signal-growth/assets/year-one-asset-library.md",
  "signal-growth/outbound/venue-edition-A1-staged.md",
  "signal-growth/outbound/venue-edition-outreach.md",
  "src/app/venues/page.tsx",
  "src/components/hq/marketing-deck.tsx",
  "src/lib/comparison-pages.ts",
  "src/lib/hq/marketing.ts",
];

const publicDeckSources = [
  "public/brand/business-loan-pack-2026.html",
  "public/brand/market-entry-deck-2026.html",
  "public/brand/pitch-deck-2026.html",
];

const retiredPricePatterns = [
  /€\s?1[,.]500\s*(?:–|-|to)\s*€?\s?4[,.]000/i,
  /EUR\s?1[,.]500\s*(?:–|-|to)\s*EUR?\s?4[,.]000/i,
  /€\s?2[,.]500/i,
];

/**
 * Retired on 2026-08-03 by `venue-edition-founding-25-2026-08-03`.
 *
 * Until this block existed the gate only forbade the *pre*-July-11 price band,
 * so it reported "ok" while roughly 140 files still published the July-11
 * position: one flat price, fifteen founding venues, no founding discount. A
 * gate that passes through a whole commercial change is worse than no gate,
 * because it is read as proof.
 *
 * The permanence patterns are the important half. D-001 point 16 forbids any
 * unconditional promise, and "for life" has already reached shipped copy once
 * while the canonical decision never said it (R-008).
 */
const retiredCohortPatterns = [
  [/\bfounding\s+fifteen\b/i, "the founding cohort is 25, not 15"],
  [/\bfirst\s+fifteen\s+venues?\b/i, "the founding cohort is 25, not 15"],
  [/\bfounding\s+group\s+of\s+fifteen\b/i, "the founding cohort is 25, not 15"],
  [/\bfoundingCohortSize"?\s*:\s*15\b/i, "the founding cohort is 25, not 15"],
];

const permanencePatterns = [
  [/\bfor\s+life\b/i, "permanence wording is forbidden (D-001 p16, R-008)"],
  [/\blifetime\s+(?:lock|price|rate|guarantee)\b/i, "permanence wording is forbidden"],
  [/\bforever\b/i, "permanence wording is forbidden (D-001 p16, R-008)"],
  [/\bin\s+perpetuity\b/i, "permanence wording is forbidden"],
];

/**
 * These two documents exist to DEFINE the banned terminology, so they have to
 * be able to name the phrases they forbid. They are still checked for retired
 * pricing. Nothing else gets an exemption: a strict gate with two documented
 * exceptions is worth more than a lenient one with none.
 */
const terminologyBanDefiners = new Set([
  "docs/strategy/FOUNDING_25_PROGRAMME_MECHANICS.md",
  "docs/strategy/FOUNDING_25_BENEFITS_CHARTER.md",
]);

for (const file of currentCommercialSources) {
  const source = read(file);
  for (const pattern of retiredPricePatterns) {
    if (pattern.test(source)) {
      failures.push(`${file} contains retired Venue Edition pricing (${pattern})`);
    }
  }
  if (terminologyBanDefiners.has(file)) continue;
  for (const [pattern, reason] of [...retiredCohortPatterns, ...permanencePatterns]) {
    if (pattern.test(source)) {
      failures.push(
        `${file} contains the retired 2026-07-11 position: ${reason} (${pattern})`,
      );
    }
  }
}

for (const file of publicDeckSources) {
  const source = read(file);
  for (const pattern of retiredPricePatterns.slice(0, 2)) {
    if (pattern.test(source)) {
      failures.push(`${file} contains a retired Venue Edition range (${pattern})`);
    }
  }
}

forbidText(
  "public/brand/market-entry-deck-2026.html",
  "18 prepaid venue licences × €2,500",
  "the public growth deck must use fixed-price venue economics",
);
forbidText(
  "public/brand/business-loan-pack-2026.html",
  "18 prepaid venue licenses × €2,500",
  "the lender pack must use fixed-price venue economics",
);
forbidText(
  "public/brand/pitch-deck-2026.html",
  "Avg venue license / yr",
  "the pitch deck must not imply a negotiated average price",
);

requireText(
  "src/lib/venue-edition.ts",
  "VENUE_EDITION_ANNUAL_PRICE_EUR = 1_500",
  "new paid venue writes must share one fixed standard price",
);
requireText(
  "src/lib/venue-edition.ts",
  "VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR = 1_000",
  "the Founding 25 rate must live in code, not in a document",
);
requireText(
  "contracts/commercial-terms.v2.json",
  '"cohortSize": 25',
  "the machine contract must carry 25 founding places",
);
requireText(
  "contracts/commercial-terms.v2.json",
  '"annualAmountCents": 100000',
  "the machine contract must carry the EUR 1,000 founding rate",
);
requireText(
  "contracts/commercial-terms.v2.json",
  '"numberAssignedOn": "payment"',
  "a founding number is assigned on payment, never on signature",
);
requireText(
  "contracts/commercial-terms.v2.json",
  '"activationAllowance": "unlimited"',
  "D-020: every booked couple, with no number in the commercial terms",
);
requireText(
  "src/lib/commercial-terms.ts",
  "commercial-terms.v2.json",
  "the app must read the current contract version",
);
requireText(
  "content/hq/decisions/venue-edition-founding-25-2026-08-03.md",
  "status: Active",
  "the current pricing decision must be the Active one in HQ",
);
requireText(
  "content/hq/decisions/venue-edition-fixed-price-2026-07-11.md",
  "status: Superseded",
  "two Active pricing decisions is how a live page and a decision record disagree",
);
requireText(
  "CHANGELOG.md",
  "S·124 · holds · Venue Edition is one price",
  "the user-visible commercial change must stay in the suite ledger",
);
requireText(
  "src/lib/hq/financial-model.ts",
  "paidVenueAcvEur: VENUE_EDITION_ANNUAL_PRICE_EUR",
  "the HQ forecast must use the fixed venue ACV",
);
requireText(
  "signal-growth/outbound/lambs-hill-pilot-send.md",
  "BLOCKED / SUPERSEDED 2026-07-11",
  "the old 365-day pilot packet must not remain send-ready",
);
// D-010 + D-022: 548 days is the floor, not the whole term. Outreach that
// promises a flat eighteen months understates what a long-lead couple gets.
requireText(
  "signal-growth/outbound/venue-edition-outreach.md",
  "Every couple you book gets eighteen months of the full suite, or three months past the wedding, whichever is later.",
  "active outreach must carry the ratified couple-access term including the grace rule",
);
requireCount(
  "signal-growth/outbound/venue-edition-A1-staged.md",
  "Every couple you book gets eighteen months of the full suite, or three months past the wedding, whichever is later.",
  5,
  "staged venue outreach must carry the ratified couple-access term including the grace rule",
);
forbidText(
  "signal-growth/outbound/venue-edition-outreach.md",
  "Every couple you book gets twelve months of the full suite.",
  "active outreach must not promise the retired duration",
);
forbidText(
  "signal-growth/outbound/venue-edition-A1-staged.md",
  "Every couple you book gets twelve months of the full suite.",
  "staged outreach must not promise the retired duration",
);
requireText(
  "src/lib/venue-edition.ts",
  "VENUE_EDITION_COUPLE_ACCESS_DAYS = 548",
  "Venue Edition couple access is 18 months",
);
requireText(
  "src/lib/entitlements-db/venues.ts",
  "venueEditionAnnualAmountCents(input.venuePlan)",
  "the database writer, not an operator field, chooses the annual amount",
);
forbidText(
  "src/app/hq/entitlements/OnboardVenueForm.tsx",
  'name="annualAmountEur"',
  "HQ must not accept negotiated annual amounts",
);
forbidText(
  "scripts/mark-venue-paid.ts",
  "eurArg",
  "the operator CLI must not accept an arbitrary price",
);
requireText(
  "scripts/mark-venue-paid.ts",
  'const founding = plan === "founding";',
  "the founding plan must always record the rate lock",
);
requireText(
  "scripts/mark-venue-paid.ts",
  "venueEditionAnnualAmountCents(plan)",
  "the cash ledger must take the amount from the plan, not one shared constant",
);
requireText(
  "src/app/layout.tsx",
  "price: String(VENUE_EDITION_ANNUAL_PRICE_EUR)",
  "structured data must expose one exact offer",
);
forbidText(
  "src/app/layout.tsx",
  "lowPrice",
  "structured data must not reintroduce a range",
);
forbidText(
  "src/app/layout.tsx",
  "highPrice",
  "structured data must not reintroduce a range",
);
forbidText(
  "src/app/layout.tsx",
  "minPrice",
  "structured data must not reintroduce the retired price specification",
);
forbidText(
  "src/app/layout.tsx",
  "maxPrice",
  "structured data must not reintroduce the retired price specification",
);
forbidText(
  "src/app/layout.tsx",
  "priceSpecification",
  "Venue Edition structured data must remain one exact offer",
);

/* ------------------------------------------------------------------ *
 * Stage 2 — [venue-copy]
 *
 * R-020's recorded mitigation is an automated check that polices Signal
 * Studio's own strings. That was necessary and insufficient: the strings
 * twenty-five untrained venues say to couples are not in this repository,
 * and the check above reached exactly two copy files.
 *
 * This stage reads its patterns from the prohibited-claims list that the
 * venue copy pack renders, so the pack a venue is handed and the gate that
 * polices us cannot drift apart. It sweeps a named surface list across both
 * repositories.
 *
 * Every surface carries a PINNED expected hit count. A count going up fails.
 * A count going down fails too, with a message saying to lower the pin, so a
 * fix cannot land silently and the number can only ratchet toward zero.
 *
 * Two tiers, because a gate another package cannot make green is a gate that
 * gets deleted. `enforced` surfaces are inside WP-06's column and are pinned
 * at zero. `tracked` surfaces are owned elsewhere; their hits are named,
 * counted and attributed to the owning task on every run.
 * ------------------------------------------------------------------ */

const CLAIMS_PATH =
  "docs/execution/venue-edition-and-films/evidence/copy/prohibited-claims.v1.json";

const claims = JSON.parse(read(CLAIMS_PATH));

/** A question is not a claim. A FAQ has to be able to ask what it answers. */
function isQuestion(line) {
  return /\?[*_`"'\s)]*$/.test(line.trim());
}

/**
 * In an evidence document the copy is what is inside the blockquote. The
 * prose around it states the rule, and a rule has to be able to name the
 * word it forbids.
 */
function selectLines(source, scope) {
  const lines = source.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    const text = lines[i];
    if (scope === "blockquote" && !/^\s*>/.test(text)) continue;
    out.push({ text, line: i + 1 });
  }
  return out;
}

/**
 * A line that forbids a word is not a line that uses it, and a voice guard
 * listing the banned register has to be able to list it.
 *
 * This was first written as a heuristic: a quoted match on a line carrying a
 * prohibition word. It suppressed two REAL defects on the live venues page,
 * because ordinary copy is full of "no" and "not" and both defects happened
 * to sit inside a quoted string. A heuristic that hides the thing the check
 * exists to find is worse than no heuristic.
 *
 * So citations are explicit, and each one names the line it exempts by a
 * distinctive substring rather than by line number. If the line is reworded,
 * the entry stops matching and the hit comes back, which is the correct
 * failure direction.
 */
function isCitation(surface, rule, entry) {
  const list = claims.citations ?? [];
  return list.some(
    (c) =>
      c.path === surface.path &&
      c.rule === rule.id &&
      entry.text.includes(c.contains),
  );
}

function compiled(rule) {
  return rule.patterns.map((p) => new RegExp(p, "i"));
}

/**
 * P7 is contextual, not a word. "18 months" is only a defect when the grace
 * rule does not travel with it, so the match carries a lookahead window.
 */
function bareTermHits(rule, text) {
  const re = new RegExp(rule.patterns[0], "gi");
  const grace = new RegExp(rule.gracePattern, "i");
  const found = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const window = text.slice(m.index, m.index + rule.graceWithin);
    if (!grace.test(window)) found.push({ match: m[0], index: m.index });
  }
  return found;
}

function sweep(surface) {
  let source;
  try {
    source = read(surface.path);
  } catch {
    return { missing: true, hits: [], cited: 0 };
  }
  const selected = selectLines(source, surface.scope);
  const hits = [];
  let cited = 0;

  const record = (rule, entry, match) => {
    if (isCitation(surface, rule, entry)) {
      cited += 1;
      return;
    }
    hits.push({
      rule: rule.id,
      line: entry.line,
      match,
      text: entry.text.trim(),
    });
  };

  for (const rule of claims.rules) {
    if (rule.copyOnly && surface.kind === "code") continue;
    if (rule.punctuation && surface.scope !== "blockquote") continue;

    if (rule.kind === "bare-term") {
      for (const entry of selected) {
        for (const { match, index } of bareTermHits(rule, entry.text)) {
          record(rule, entry, match, index);
        }
      }
      continue;
    }

    for (const re of compiled(rule)) {
      for (const entry of selected) {
        if (rule.claimOnly && isQuestion(entry.text)) continue;
        const m = re.exec(entry.text);
        if (m) record(rule, entry, m[0], m.index);
      }
    }
  }
  return { missing: false, hits, cited };
}

const copyReport = [];
let sweptSurfaces = 0;
let totalHits = 0;
let totalCited = 0;

for (const tier of ["enforced", "tracked"]) {
  for (const surface of claims.surfaces[tier]) {
    const { missing, hits, cited } = sweep(surface);
    totalCited += cited ?? 0;
    if (missing) {
      failures.push(
        `[venue-copy] ${surface.path} is listed in ${CLAIMS_PATH} but does not exist. ` +
          `A surface that vanishes from the sweep is how a defect stops being counted.`,
      );
      continue;
    }
    sweptSurfaces += 1;
    totalHits += hits.length;
    copyReport.push({ tier, surface, hits, cited });

    if (hits.length > surface.expected) {
      const fresh = hits.slice(surface.expected);
      failures.push(
        `[venue-copy] ${surface.path} has ${hits.length} prohibited-claim hit(s), ` +
          `pinned at ${surface.expected} (owner: ${surface.owner}). New: ` +
          fresh
            .map((h) => `${h.rule} at line ${h.line} ${JSON.stringify(h.match)}`)
            .join("; "),
      );
    } else if (hits.length < surface.expected) {
      failures.push(
        `[venue-copy] ${surface.path} now has ${hits.length} hit(s) but is pinned at ` +
          `${surface.expected}. Lower the pin in ${CLAIMS_PATH} in the same change, ` +
          `so a fix is recorded rather than absorbed.`,
      );
    }
  }
}

const shouldReport =
  process.argv.includes("--copy-report") || failures.length > 0;

if (shouldReport) {
  console.log(
    `[venue-copy] swept ${sweptSurfaces} surface(s) against ` +
      `${claims.rules.length} rule(s) / ` +
      `${claims.rules.reduce((n, r) => n + r.patterns.length, 0)} pattern(s); ` +
      `${totalHits} hit(s), ${totalCited} suppressed as citations`,
  );
  for (const { tier, surface, hits, cited } of copyReport) {
    if (hits.length === 0 && !cited) continue;
    console.log(
      `  [${tier}] ${surface.path} ` +
        `${hits.length} hit(s), pinned ${surface.expected}` +
        (cited ? `, ${cited} cited` : "") +
        `, owner ${surface.owner}`,
    );
    for (const h of hits) {
      console.log(
        `      ${h.rule}  line ${h.line}  ${JSON.stringify(h.match)}  |  ${h.text.slice(0, 96)}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error("[venue-edition-contract] failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `[venue-edition-contract] ok  ·  [venue-copy] ${sweptSurfaces} surfaces, ` +
    `${totalHits} tracked hit(s), all at their pinned counts`,
);
