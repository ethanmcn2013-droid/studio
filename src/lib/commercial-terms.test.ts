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
  assert.equal(COMMERCIAL_TERMS.plans.venue.activationAllowance, null);
  assert.equal(COMMERCIAL_TERMS.broadLaunchDate, null);
});
