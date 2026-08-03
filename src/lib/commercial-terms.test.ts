import assert from "node:assert/strict";
import test from "node:test";

import {
  COMMERCIAL_TERMS,
  formatEuroCents,
  requireVerifiedAmount,
} from "./commercial-terms";
import {
  VENUE_EDITION_ANNUAL_PRICE_CENTS,
  VENUE_EDITION_COUPLE_ACCESS_DAYS,
  VENUE_EDITION_COUPLE_ACCESS_MONTHS,
  VENUE_EDITION_FOUNDING_ANNUAL_PRICE_CENTS,
} from "./venue-edition";

test("exports only verified consumer prices as usable amounts", () => {
  assert.equal(formatEuroCents(requireVerifiedAmount("student")), "€9.99");
  assert.equal(formatEuroCents(requireVerifiedAmount("pro")), "€12");
  assert.equal(formatEuroCents(requireVerifiedAmount("event")), "€89");
  assert.equal(formatEuroCents(requireVerifiedAmount("venue")), "€1,500");
  assert.equal(
    COMMERCIAL_TERMS.plans.venue.annualAmountCents,
    VENUE_EDITION_ANNUAL_PRICE_CENTS,
  );
  assert.equal(
    COMMERCIAL_TERMS.plans.venue.coupleAccessMonths,
    VENUE_EDITION_COUPLE_ACCESS_MONTHS,
  );
  assert.equal(
    COMMERCIAL_TERMS.plans.venue.operationalAccessDays,
    VENUE_EDITION_COUPLE_ACCESS_DAYS,
  );
});

test("keeps unresolved commercial choices explicit", () => {
  assert.equal(COMMERCIAL_TERMS.plans.pro.annualAmountCents, null);
  assert.equal(COMMERCIAL_TERMS.plans.pro.workspaceLimit, null);
  assert.equal(COMMERCIAL_TERMS.plans.student.workspaceLimit, null);
  assert.equal(COMMERCIAL_TERMS.broadLaunchDate, null);
});

/**
 * The Founding 25 (venue-edition-founding-25-2026-08-03, VEF-2026 D-009/D-020/
 * D-021). v1 encoded a 15-venue cohort with no founding rate and an unresolved
 * allowance, which is the state that let a live page publish one number while
 * the decision record held another.
 */
test("encodes the ratified Founding 25 position", () => {
  const venue = COMMERCIAL_TERMS.plans.venue;

  assert.equal(venue.founding.cohortSize, 25);
  assert.equal(venue.founding.annualAmountCents, 100000);
  assert.equal(
    venue.founding.annualAmountCents,
    VENUE_EDITION_FOUNDING_ANNUAL_PRICE_CENTS,
  );
  assert.equal(formatEuroCents(venue.founding.annualAmountCents), "€1,000");
  assert.equal(venue.founding.numberAssignedOn, "payment");
  assert.equal(venue.founding.placeHoldDays, 14);
  assert.equal(venue.founding.outreachCohortSize, 25);
  assert.equal(venue.founding.lockCondition, "continuous_renewal_without_lapse");
  assert.equal(venue.founding.lockFollows, "property");
  assert.equal(venue.founding.lockTransfersToNewProperties, false);
});

/**
 * D-001 point 16 and R-008. The same trap already caught this price lock once:
 * "for life" reached shipped copy while the canonical decision never said it.
 */
test("refuses permanence wording anywhere in the contract", () => {
  const serialised = JSON.stringify(COMMERCIAL_TERMS).toLowerCase();
  for (const banned of ["for life", "forever", "in perpetuity", "lifetime"]) {
    const inForbiddenList = COMMERCIAL_TERMS.plans.venue.founding.forbiddenWording
      .map((w) => w.toLowerCase())
      .includes(banned);
    assert.ok(
      inForbiddenList,
      `"${banned}" must be listed as forbidden wording`,
    );
    // "forever" is the Free plan's cadence value, not a Venue Edition promise.
    const occurrences = serialised.split(banned).length - 1;
    const allowed = banned === "forever" ? 2 : 1; // the ban list entry, plus Free's cadence
    assert.ok(
      occurrences <= allowed,
      `"${banned}" appears ${occurrences} times in the commercial contract`,
    );
  }
});

/** D-020: unlimited, with no number anywhere in the commercial terms. */
test("states entitlement as unlimited and never as a count", () => {
  assert.equal(COMMERCIAL_TERMS.plans.venue.activationAllowance, "unlimited");
  assert.equal(
    COMMERCIAL_TERMS.plans.venue.fairUseBehaviour,
    "notify_never_block",
  );
  assert.equal(
    COMMERCIAL_TERMS.plans.venue.redeemedWorkspaceSurvivesLicenceEnd,
    true,
  );
  assert.ok(
    !COMMERCIAL_TERMS.unresolved.includes("venue_activation_allowance"),
    "the allowance is ratified by D-020 and must not still read as unresolved",
  );
});

/** D-021: both venue prices are the amount the venue pays, VAT included. */
test("states venue pricing as VAT-inclusive", () => {
  assert.equal(COMMERCIAL_TERMS.vat.basis, "inclusive");
  assert.equal(COMMERCIAL_TERMS.plans.venue.priceBasis, "vat_inclusive");
  assert.equal(
    COMMERCIAL_TERMS.vat.publicStatement,
    "inclusive of VAT at the prevailing rate",
  );
});

/** D-010 + D-022. 548 days is the floor, not the answer. */
test("carries the couple access grace rule, not just the floor", () => {
  assert.equal(COMMERCIAL_TERMS.plans.venue.operationalAccessDays, 548);
  assert.equal(COMMERCIAL_TERMS.plans.venue.weddingGraceDays, 90);
  assert.equal(
    COMMERCIAL_TERMS.plans.venue.coupleAccessRule,
    "max(redeemedAt + 548 days, weddingDate + 90 days)",
  );
});
