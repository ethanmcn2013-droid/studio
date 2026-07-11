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

for (const file of currentCommercialSources) {
  const source = read(file);
  for (const pattern of retiredPricePatterns) {
    if (pattern.test(source)) {
      failures.push(`${file} contains retired Venue Edition pricing (${pattern})`);
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
  "new paid venue writes must share one fixed price",
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
requireText(
  "signal-growth/outbound/venue-edition-outreach.md",
  "Every couple you book gets eighteen months of the full suite.",
  "active outreach must carry the ratified couple-access duration",
);
requireCount(
  "signal-growth/outbound/venue-edition-A1-staged.md",
  "Every couple you book gets eighteen months of the full suite.",
  5,
  "staged venue outreach must carry the ratified couple-access duration",
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
  "the founding plan must always record the lifetime price lock",
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

if (failures.length > 0) {
  console.error("[venue-edition-contract] failed");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("[venue-edition-contract] ok");
