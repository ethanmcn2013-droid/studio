import assert from "node:assert/strict";
import { test } from "node:test";
import {
  VENUE_EDITION_ANNUAL_PRICE_CENTS,
  VENUE_EDITION_ANNUAL_PRICE_EUR,
  VENUE_EDITION_COUPLE_ACCESS_DAYS,
  VENUE_EDITION_COUPLE_ACCESS_MONTHS,
  VENUE_EDITION_FOUNDING_ANNUAL_PRICE_CENTS,
  VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR,
  VENUE_EDITION_WEDDING_GRACE_DAYS,
  coupleAccessDurationDays,
  coupleAccessExpiryMs,
  extendedCoupleAccessExpiryMs,
  normaliseWeddingDateMs,
  venueEditionAnnualAmountCents,
  venueEditionDurationRefusal,
  weddingDateLabel,
} from "./venue-edition";

const DAY = 24 * 60 * 60 * 1000;
const at = (iso: string) => Date.parse(iso);

test("Venue Edition has one standard annual price", () => {
  assert.equal(VENUE_EDITION_ANNUAL_PRICE_EUR, 1_500);
  assert.equal(VENUE_EDITION_ANNUAL_PRICE_CENTS, 150_000);
  assert.equal(venueEditionAnnualAmountCents("paid"), 150_000);
});

test("the Founding 25 rate is EUR 1,000 and the writer chooses it", () => {
  assert.equal(VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR, 1_000);
  assert.equal(VENUE_EDITION_FOUNDING_ANNUAL_PRICE_CENTS, 100_000);
  assert.equal(venueEditionAnnualAmountCents("founding"), 100_000);
});

test("pilot venues remain outside paid revenue", () => {
  assert.equal(venueEditionAnnualAmountCents("pilot"), null);
});

test("Venue Edition couple access lasts 18 months, with a 90-day grace", () => {
  assert.equal(VENUE_EDITION_COUPLE_ACCESS_MONTHS, 18);
  assert.equal(VENUE_EDITION_COUPLE_ACCESS_DAYS, 548);
  assert.equal(VENUE_EDITION_WEDDING_GRACE_DAYS, 90);
});

/* ── wedding-date parsing ───────────────────────────────────────────────── */

test("a wedding date parses to the UTC midnight that starts the day", () => {
  assert.equal(
    normaliseWeddingDateMs("2028-09-16"),
    at("2028-09-16T00:00:00.000Z"),
  );
  assert.equal(weddingDateLabel(at("2028-09-16T00:00:00.000Z")), "2028-09-16");
});

test("an epoch inside the day floors to that day, never past it", () => {
  assert.equal(
    normaliseWeddingDateMs(at("2028-09-16T23:59:59.000Z")),
    at("2028-09-16T00:00:00.000Z"),
  );
});

test("an unparseable or impossible date is null, never today", () => {
  for (const bad of [
    null,
    undefined,
    "",
    "not a date",
    "16/09/2028",
    "2028-9-16",
    "2028-02-31",
    "2028-13-01",
    Number.NaN,
  ]) {
    assert.equal(
      normaliseWeddingDateMs(bad as string | number | null),
      null,
      `expected null for ${JSON.stringify(bad)}`,
    );
  }
});

/* ── R-015: the case that would have cost a couple their wedding ─────────── */

test("R-015: a long-lead booking keeps access 90 days past the wedding", () => {
  // Books and redeems March 2027, marries September 2028. Under a flat 548-day
  // term this couple lost the product roughly a year before the wedding.
  const redeemedAtMs = at("2027-03-01T10:00:00.000Z");
  const weddingDateMs = normaliseWeddingDateMs("2028-09-16");
  const flat548 = redeemedAtMs + 548 * DAY;

  const expiry = coupleAccessExpiryMs({ redeemedAtMs, weddingDateMs });

  assert.ok(flat548 < weddingDateMs!, "the shipped rule expired pre-wedding");
  assert.equal(expiry, weddingDateMs! + 90 * DAY);
  assert.equal(weddingDateLabel(expiry), "2028-12-15");
});

test("a short-lead booking keeps the ratified 548-day floor", () => {
  // Marries three months after redeeming: 548 days beats wedding + 90.
  const redeemedAtMs = at("2027-03-01T10:00:00.000Z");
  const expiry = coupleAccessExpiryMs({
    redeemedAtMs,
    weddingDateMs: normaliseWeddingDateMs("2027-06-05"),
  });
  assert.equal(expiry, redeemedAtMs + 548 * DAY);
});

test("no wedding date falls back to the floor, exactly as shipped", () => {
  const redeemedAtMs = at("2027-03-01T10:00:00.000Z");
  assert.equal(
    coupleAccessExpiryMs({ redeemedAtMs, weddingDateMs: null }),
    redeemedAtMs + 548 * DAY,
  );
  assert.equal(
    coupleAccessExpiryMs({ redeemedAtMs }),
    redeemedAtMs + 548 * DAY,
  );
});

test("there is no upper cap: a three-year lead gets three years", () => {
  const redeemedAtMs = at("2027-01-04T09:00:00.000Z");
  const weddingDateMs = normaliseWeddingDateMs("2030-05-18")!;
  assert.equal(
    coupleAccessExpiryMs({ redeemedAtMs, weddingDateMs }),
    weddingDateMs + 90 * DAY,
  );
});

/* ── mint-time duration ─────────────────────────────────────────────────── */

test("a known long-lead wedding date produces a longer mint duration", () => {
  const issuedAtMs = at("2027-03-01T10:00:00.000Z");
  const days = coupleAccessDurationDays({
    issuedAtMs,
    weddingDateMs: normaliseWeddingDateMs("2028-09-16"),
  });
  assert.ok(days > 548, `expected more than the floor, got ${days}`);
  assert.equal(days, Math.ceil((normaliseWeddingDateMs("2028-09-16")! + 90 * DAY - issuedAtMs) / DAY));
});

test("mint duration never drops below the ratified floor", () => {
  const issuedAtMs = at("2027-03-01T10:00:00.000Z");
  assert.equal(
    coupleAccessDurationDays({
      issuedAtMs,
      weddingDateMs: normaliseWeddingDateMs("2027-04-01"),
    }),
    548,
  );
  assert.equal(coupleAccessDurationDays({ issuedAtMs }), 548);
});

/* ── D-022 point 3: access moves later, never earlier ───────────────────── */

test("a postponement extends access automatically", () => {
  const redeemedAtMs = at("2027-03-01T10:00:00.000Z");
  const first = coupleAccessExpiryMs({
    redeemedAtMs,
    weddingDateMs: normaliseWeddingDateMs("2028-05-20"),
  });
  const postponed = extendedCoupleAccessExpiryMs({
    currentExpiresAtMs: first,
    redeemedAtMs,
    weddingDateMs: normaliseWeddingDateMs("2029-05-19"),
  });
  assert.ok(postponed! > first);
  assert.equal(postponed, normaliseWeddingDateMs("2029-05-19")! + 90 * DAY);
});

test("bringing the wedding forward never shortens access", () => {
  const redeemedAtMs = at("2027-03-01T10:00:00.000Z");
  const long = coupleAccessExpiryMs({
    redeemedAtMs,
    weddingDateMs: normaliseWeddingDateMs("2030-05-18"),
  });
  const corrected = extendedCoupleAccessExpiryMs({
    currentExpiresAtMs: long,
    redeemedAtMs,
    weddingDateMs: normaliseWeddingDateMs("2028-05-18"),
  });
  assert.equal(corrected, long);
});

test("clearing the wedding date never shortens access", () => {
  const redeemedAtMs = at("2027-03-01T10:00:00.000Z");
  const long = coupleAccessExpiryMs({
    redeemedAtMs,
    weddingDateMs: normaliseWeddingDateMs("2030-05-18"),
  });
  assert.equal(
    extendedCoupleAccessExpiryMs({
      currentExpiresAtMs: long,
      redeemedAtMs,
      weddingDateMs: null,
    }),
    long,
  );
});

test("a row with no expiry is never given one", () => {
  assert.equal(
    extendedCoupleAccessExpiryMs({
      currentExpiresAtMs: null,
      redeemedAtMs: at("2027-03-01T10:00:00.000Z"),
      weddingDateMs: normaliseWeddingDateMs("2028-09-16"),
    }),
    null,
  );
});

test("recompute is idempotent — repeating it changes nothing", () => {
  const redeemedAtMs = at("2027-03-01T10:00:00.000Z");
  const weddingDateMs = normaliseWeddingDateMs("2028-09-16");
  const once = coupleAccessExpiryMs({ redeemedAtMs, weddingDateMs });
  const twice = extendedCoupleAccessExpiryMs({
    currentExpiresAtMs: once,
    redeemedAtMs,
    weddingDateMs,
  });
  assert.equal(twice, once);
});

/* ── D-022 point 4: the relaxed mint guard ──────────────────────────────── */

test("the mint guard accepts the floor and any computed duration above it", () => {
  assert.equal(venueEditionDurationRefusal(548), null);
  assert.equal(venueEditionDurationRefusal(1_200), null);
  assert.equal(venueEditionDurationRefusal(10_000), null);
});

test("the mint guard still refuses anything shorter than the ratified term", () => {
  assert.match(String(venueEditionDurationRefusal(547)), /at least 548 days/);
  assert.match(String(venueEditionDurationRefusal(365)), /at least 548 days/);
  assert.match(String(venueEditionDurationRefusal(0)), /at least 548 days/);
});

test("the mint guard refuses a null or fractional duration", () => {
  assert.match(String(venueEditionDurationRefusal(null)), /explicit duration/);
  assert.match(String(venueEditionDurationRefusal(undefined)), /explicit duration/);
  assert.match(String(venueEditionDurationRefusal(600.5)), /whole number/);
});
