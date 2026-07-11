import assert from "node:assert/strict";
import { test } from "node:test";
import {
  VENUE_EDITION_ANNUAL_PRICE_CENTS,
  VENUE_EDITION_ANNUAL_PRICE_EUR,
  VENUE_EDITION_COUPLE_ACCESS_DAYS,
  VENUE_EDITION_COUPLE_ACCESS_MONTHS,
  venueEditionAnnualAmountCents,
} from "./venue-edition";

test("Venue Edition has one fixed annual price", () => {
  assert.equal(VENUE_EDITION_ANNUAL_PRICE_EUR, 1_500);
  assert.equal(VENUE_EDITION_ANNUAL_PRICE_CENTS, 150_000);
  assert.equal(venueEditionAnnualAmountCents("founding"), 150_000);
  assert.equal(venueEditionAnnualAmountCents("paid"), 150_000);
});

test("pilot venues remain outside paid revenue", () => {
  assert.equal(venueEditionAnnualAmountCents("pilot"), null);
});

test("Venue Edition couple access lasts 18 months", () => {
  assert.equal(VENUE_EDITION_COUPLE_ACCESS_MONTHS, 18);
  assert.equal(VENUE_EDITION_COUPLE_ACCESS_DAYS, 548);
});
