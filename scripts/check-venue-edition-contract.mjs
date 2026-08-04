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
  "docs/strategy/VENUE_RENEWAL_AND_LAPSE_RUNBOOK.md",
  "docs/strategy/VENUE_SALES_PACK.md",
  "docs/strategy/WEDDING_VENUE_OPERATING_MODEL.md",
  "signal-growth/assets/year-one-asset-library.md",
  "signal-growth/outbound/venue-edition-A1-staged.md",
  "signal-growth/outbound/venue-edition-outreach.md",
  "src/app/venues/page.tsx",
  // E12.07 and E12.08. Every new commercial route joins this list in the same
  // change that creates it, or it ships unswept: retired pricing, the retired
  // 15-venue cohort and all four permanence patterns go unchecked on it.
  "src/app/venues/privacy/page.tsx",
  "src/app/venues/questions/page.tsx",
  // E12.05 and E12.06. Same rule, same reason. These two carry the couple-side
  // preview and the venue-side record preview, so they are the two commercial
  // routes most likely to acquire a term, a price or a permanence promise by
  // accident while somebody is making a sentence warmer.
  "src/app/venues/couple-preview/page.tsx",
  "src/app/venues/what-you-see/page.tsx",
  // E12.09. The proposal words are data, not a route, so the file that
  // carries the price is the file that gets swept. The sheet component and
  // the composer are swept too: a price can be typed into a placeholder or a
  // caption as easily as into a paragraph.
  "src/lib/venue-proposal.ts",
  "src/components/venue/venue-proposal-sheet.tsx",
  "src/app/hq/venue-proposal/composer.tsx",
  // E12.02 and E12.03. The private per-venue page carries the whole offer in
  // text, so it is the one surface where a retired price would be read by a
  // venue at the moment it is deciding. Its words live in one module and the
  // module is swept with the route.
  "src/lib/venue-invitation/copy.ts",
  "src/app/v/[token]/page.tsx",
  "src/app/v/[token]/states.tsx",
  "src/app/v/[token]/not-found.tsx",
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
// Until 2026-08-03 this required the literal line `const founding = plan ===
// "founding";`, because the CLI wrote the five ledger columns itself and that
// line was where the rate lock got set. The CLI no longer writes the ledger: it
// records through recordAnnualPrepayment, which sets the lock, writes the
// append-only term row, writes the audit line and assigns the founding number
// on cleared payment. Requiring the deleted line would have forced the weaker
// version back, so the requirement now names the mechanism instead.
requireText(
  "scripts/mark-venue-paid.ts",
  "recordAnnualPrepayment",
  "the operator CLI must record through the one guarded writer, which sets the rate lock and keeps the term history",
);
requireText(
  "scripts/mark-venue-paid.ts",
  "assigned on cleared payment",
  "the CLI must report the founding number it assigned, because assignment on cleared payment is D-009 point 6",
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
/**
 * E12.14, 2026-08-03. `priceSpecification` was banned outright as a proxy for
 * "no price range", because the retired position expressed €1,500 to €4,000 as
 * a specification with `minPrice` and `maxPrice`. Those four range fields are
 * each banned above, by name, so the proxy was doing no work the direct rules
 * were not already doing.
 *
 * It was also blocking D-021. Schema.org puts `valueAddedTaxIncluded` on
 * PriceSpecification and nowhere else, so under the old rule the one price
 * published on all forty-plus studio routes was the one price on the site that
 * could not state it was VAT-inclusive. A structured-data offer is a published
 * price and D-021 admits no exception for the ones only machines read.
 *
 * The proxy is replaced by two rules that are strictly tighter: AggregateOffer,
 * which is the schema type that actually expresses a range, is now banned by
 * name; and the VAT statement is now REQUIRED rather than merely permitted. A
 * future edit that drops it fails this gate.
 */
forbidText(
  "src/app/layout.tsx",
  "AggregateOffer",
  "Venue Edition structured data must remain one exact offer, never a range",
);
requireText(
  "src/app/layout.tsx",
  "valueAddedTaxIncluded: true",
  "D-021: the published Venue Edition price must state that it includes VAT",
);

if (failures.length > 0) {
  console.error("[venue-edition-contract] failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("[venue-edition-contract] ok");
