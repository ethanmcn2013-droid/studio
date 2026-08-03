import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { COMMERCIAL_TERMS } from "./commercial-terms";
import {
  VAT_INCLUSIVE_STATEMENT,
  describeVatBreakdown,
  formatEurCents,
  formatVenuePrice,
  sameAmount,
  vatInclusive,
  vatInclusiveFromRecord,
  vatTreatmentOf,
  venuePriceCopyRefusal,
  type VatInclusiveAmount,
} from "./venue-money";
import {
  VENUE_EDITION_ANNUAL_PRICE_CENTS,
  VENUE_EDITION_FOUNDING_ANNUAL_PRICE_CENTS,
  venueEditionAnnualAmountCents,
} from "./venue-edition";

const IRISH_STANDARD_RATE_BP = 2300;

/* ── The core property ───────────────────────────────────────────────────── */

test("gross is the input and net is derived, never the other way round", () => {
  const founding = vatInclusive({
    grossCents: VENUE_EDITION_FOUNDING_ANNUAL_PRICE_CENTS,
    vatRateBasisPoints: IRISH_STANDARD_RATE_BP,
  });
  assert.equal(founding.grossCents, 100_000);
  // D-021's recorded consequence: EUR 1,000 inclusive nets EUR 813.01 at 23%.
  assert.equal(founding.netCents, 81_301);
  assert.equal(founding.vatCents, 18_699);

  const standard = vatInclusive({
    grossCents: VENUE_EDITION_ANNUAL_PRICE_CENTS,
    vatRateBasisPoints: IRISH_STANDARD_RATE_BP,
  });
  assert.equal(standard.netCents, 121_951, "EUR 1,500 inclusive nets EUR 1,219.51");
});

test("net plus VAT equals gross exactly, for every amount and rate", () => {
  // The failure this rules out: a rounding artefact that makes the venue-facing
  // number EUR 999.99 in one report and EUR 1,000.00 in another, permanently,
  // under a price lock that cannot be corrected (R-022).
  for (let gross = 0; gross <= 200_000; gross += 997) {
    for (const rate of [0, 900, 1350, 2100, 2300, 2500, 10_000]) {
      const amount = vatInclusive({ grossCents: gross, vatRateBasisPoints: rate });
      assert.equal(
        (amount.netCents as number) + (amount.vatCents as number),
        gross,
        `net + vat != gross for ${gross} at ${rate}bp`,
      );
      assert.ok((amount.netCents as number) >= 0);
      assert.ok((amount.vatCents as number) >= 0);
    }
  }
});

test("an undetermined VAT treatment records null, not zero", () => {
  // Zero would be a claim that the supply is zero-rated. Nobody is entitled to
  // make it: the Revenue MyEnquiries submission is drafted and unfiled, and
  // accountable-person status is unconfirmed (R-014, R-018, R-022).
  const undetermined = vatInclusive({ grossCents: 100_000 });
  assert.equal(undetermined.vatRateBasisPoints, null);
  assert.equal(undetermined.netCents, null);
  assert.equal(undetermined.vatCents, null);
  assert.equal(vatTreatmentOf(undetermined), "not_determined");

  const zeroRated = vatInclusive({ grossCents: 100_000, vatRateBasisPoints: 0 });
  assert.equal(zeroRated.netCents, 100_000, "zero-rated is a determination, and it is not the same thing");
  assert.equal(vatTreatmentOf(zeroRated), "applied");
});

test("the read path recomputes net from gross rather than trusting a stored column", () => {
  // A hand-edited or corrupted net column must never become a number a venue
  // sees. The record read below carries a wrong net on purpose.
  const rebuilt = vatInclusiveFromRecord({
    grossAmountCents: 100_000,
    vatRateBasisPoints: IRISH_STANDARD_RATE_BP,
  });
  assert.equal(rebuilt.netCents, 81_301);
  assert.equal(rebuilt.grossCents, 100_000);
});

test("refuses nonsense inputs rather than coercing them", () => {
  assert.throws(() => vatInclusive({ grossCents: -1 }), /non-negative/);
  assert.throws(() => vatInclusive({ grossCents: 1000.5 }), /whole number/);
  assert.throws(
    () => vatInclusive({ grossCents: 1000, vatRateBasisPoints: 10_001 }),
    /between 0 and 10000/,
  );
  assert.throws(
    () => vatInclusive({ grossCents: 1000, vatRateBasisPoints: -100 }),
    /between 0 and 10000/,
  );
});

test("two amounts are the same money when gross and rate match", () => {
  const a = vatInclusive({ grossCents: 100_000, vatRateBasisPoints: 2300 });
  const b = vatInclusive({ grossCents: 100_000, vatRateBasisPoints: 2300 });
  const c = vatInclusive({ grossCents: 100_000 });
  assert.equal(sameAmount(a, b), true);
  assert.equal(sameAmount(a, c), false);
});

/* ── The type is a guard, not decoration ─────────────────────────────────── */

test("an object literal cannot be passed as a VAT-inclusive amount", () => {
  // The assertion is the @ts-expect-error below: `tsc --noEmit` fails if the
  // literal ever starts type-checking, which is the moment the brand stopped
  // guarding anything. Nothing is executed here.
  const reject = (_: VatInclusiveAmount) => undefined;
  // @ts-expect-error — a hand-assembled amount must not satisfy the brand
  const literal: VatInclusiveAmount = {
    grossCents: 100_000,
    vatRateBasisPoints: 2300,
    netCents: 100_000,
    vatCents: 0,
  };
  void reject;
  void literal;
  assert.ok(true);
});

/* ── Venue-facing wording ────────────────────────────────────────────────── */

test("the D-021 statement matches the machine contract character for character", () => {
  assert.equal(VAT_INCLUSIVE_STATEMENT, COMMERCIAL_TERMS.vat.publicStatement);
  assert.equal(COMMERCIAL_TERMS.plans.venue.priceBasis, "vat_inclusive");
});

test("every venue-facing price carries the ratified basis", () => {
  assert.equal(
    formatVenuePrice(vatInclusive({ grossCents: 100_000 })),
    "EUR 1,000 inclusive of VAT at the prevailing rate",
  );
  assert.equal(
    formatVenuePrice(vatInclusive({ grossCents: 150_000 }), { symbol: "€" }),
    "€1,500 inclusive of VAT at the prevailing rate",
  );
  // There is deliberately no variant that omits the statement, so the only way
  // to publish a price without it is to stop using this function.
  assert.match(formatVenuePrice(vatInclusive({ grossCents: 1 })), /inclusive of VAT/);
});

test("formats cents without depending on the Node ICU build", () => {
  assert.equal(formatEurCents(100_000), "1,000");
  assert.equal(formatEurCents(150_000), "1,500");
  assert.equal(formatEurCents(81_301), "813.01");
  assert.equal(formatEurCents(0), "0");
  assert.equal(formatEurCents(5), "0.05");
  assert.equal(formatEurCents(123_456_789), "1,234,567.89");
});

test("the internal breakdown says so when the treatment is not determined", () => {
  assert.match(
    describeVatBreakdown(vatInclusive({ grossCents: 100_000 })),
    /VAT treatment not determined, so no net is recorded/,
  );
  assert.equal(
    describeVatBreakdown(vatInclusive({ grossCents: 100_000, vatRateBasisPoints: 2300 })),
    "gross EUR 1,000 = net EUR 813.01 + VAT EUR 186.99 at 23%",
  );
});

test("refuses copy that adds VAT on top or quotes a bare price", () => {
  assert.match(
    venuePriceCopyRefusal("EUR 1,000 per year plus VAT") as string,
    /D-021/,
  );
  assert.match(
    venuePriceCopyRefusal("€1,500 a year, ex VAT") as string,
    /D-021/,
  );
  assert.match(
    venuePriceCopyRefusal("€1,000 a year for the Founding 25") as string,
    /without the ratified basis/,
  );
  assert.equal(
    venuePriceCopyRefusal("€1,000 a year, inclusive of VAT at the prevailing rate"),
    null,
  );
  // Copy with no price is not this function's business.
  assert.equal(venuePriceCopyRefusal("Every couple you book gets a workspace."), null);
});

test("no surface built here claims a confirmed VAT position", () => {
  // D-016 and R-013: nothing may state or imply that VAT treatment has been
  // confirmed by Revenue or verified by an accountant.
  const surfaces = [
    formatVenuePrice(vatInclusive({ grossCents: 100_000 })),
    describeVatBreakdown(vatInclusive({ grossCents: 100_000 })),
    describeVatBreakdown(vatInclusive({ grossCents: 100_000, vatRateBasisPoints: 2300 })),
    venuePriceCopyRefusal("EUR 1,000 plus VAT") as string,
  ].join(" \n ");
  for (const claim of [
    "approved by revenue",
    "confirmed by revenue",
    "revenue has confirmed",
    "reviewed by a solicitor",
    "verified by an accountant",
    "legally approved",
    "gdpr compliant",
  ]) {
    assert.ok(
      !surfaces.toLowerCase().includes(claim),
      `a surface claims ${JSON.stringify(claim)}`,
    );
  }
});

/* ── Source contract ─────────────────────────────────────────────────────── */

const SOURCES = [
  "src/lib/venue-money.ts",
  "src/lib/venue-billing.ts",
  "src/lib/entitlements-db/venue-billing.ts",
];

function sourceOf(file: string): string {
  return readFileSync(path.join(process.cwd(), file), "utf8");
}

test("no code path reconstructs gross from net", () => {
  // The rule D-021 makes load-bearing: net is a derived report of gross. An
  // assignment that runs the other way is how EUR 1,000 becomes EUR 999.99 and
  // stays there under a price lock.
  const offender = /\b(gross\w*)\s*=\s*[^;\n]*\bnet\w*/i;
  for (const file of SOURCES) {
    const lines = sourceOf(file).split("\n");
    lines.forEach((line, i) => {
      const code = line.replace(/^\s*\*.*/, "").replace(/\/\/.*/, "");
      assert.ok(
        !offender.test(code),
        `${file}:${i + 1} computes a gross amount from a net one: ${line.trim()}`,
      );
    });
  }
});

test("the price for a plan comes from one resolver", () => {
  // E08.01: one place, and it agrees with the machine contract.
  assert.equal(venueEditionAnnualAmountCents("founding"), 100_000);
  assert.equal(venueEditionAnnualAmountCents("paid"), 150_000);
  assert.equal(venueEditionAnnualAmountCents("pilot"), null);
  assert.equal(
    venueEditionAnnualAmountCents("founding"),
    COMMERCIAL_TERMS.plans.venue.founding.annualAmountCents,
  );
  assert.equal(
    venueEditionAnnualAmountCents("paid"),
    COMMERCIAL_TERMS.plans.venue.annualAmountCents,
  );
});
