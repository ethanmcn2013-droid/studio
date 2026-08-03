/** Canonical commercial terms for new Venue Edition sales. */
export const VENUE_EDITION_ANNUAL_PRICE_EUR = 1_500;
export const VENUE_EDITION_ANNUAL_PRICE_CENTS =
  VENUE_EDITION_ANNUAL_PRICE_EUR * 100;

/**
 * The Founding 25 rate (D-009), held for as long as the agreement renews
 * continuously without lapse. Both prices are VAT-INCLUSIVE (D-021): the
 * amount a venue pays is the amount written here, and VAT at the prevailing
 * rate comes out of it rather than being added to it.
 *
 * Never describe this rate as "for life" or "forever" on any surface.
 */
export const VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR = 1_000;
export const VENUE_EDITION_FOUNDING_ANNUAL_PRICE_CENTS =
  VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR * 100;

export const VENUE_EDITION_COUPLE_ACCESS_MONTHS = 18;
export const VENUE_EDITION_COUPLE_ACCESS_DAYS = 548;

/**
 * D-010: couple access runs 18 months from redemption, **or 3 months past the
 * wedding date, whichever is later**. 548 days is the floor, not the answer.
 */
export const VENUE_EDITION_WEDDING_GRACE_DAYS = 90;

export type VenueEditionPlan = "pilot" | "founding" | "paid";

/**
 * Pilot venues do not count as revenue. Founding venues pay the Founding 25
 * rate; every other paid venue pays the standard annual price. Venue size and
 * number of sites never change either number (D-020: no volume screen).
 */
export function venueEditionAnnualAmountCents(
  plan: VenueEditionPlan,
): number | null {
  if (plan === "pilot") return null;
  if (plan === "founding") return VENUE_EDITION_FOUNDING_ANNUAL_PRICE_CENTS;
  return VENUE_EDITION_ANNUAL_PRICE_CENTS;
}

/* ── Couple access term (R-015 · D-022) ──────────────────────────────────
 *
 * Irish venues book 12 to 24 months out. A couple who signs in March 2027 for
 * a September 2028 wedding and redeems on the day they sign would, under a
 * flat 548-day term, lose the product before the wedding it was bought for —
 * in public, at the venue that gifted it. These rules exist to make that
 * impossible.
 *
 * Everything below is pure and client-safe. The database writers in
 * `entitlements-db/` are the only callers that persist the result.
 * ----------------------------------------------------------------------- */

const DAY_MS = 24 * 60 * 60 * 1000;

/** A wedding date is a calendar day, so it is carried as UTC midnight. */
const WEDDING_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse a wedding date into the UTC-midnight instant that starts that day.
 * Accepts `YYYY-MM-DD` or an epoch already on a UTC day boundary. Returns null
 * for anything unparseable — a bad date must never silently become "today",
 * because "today" is the one value that shortens access.
 */
export function normaliseWeddingDateMs(
  input: string | number | null | undefined,
): number | null {
  if (input == null) return null;
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return null;
    return Math.floor(input / DAY_MS) * DAY_MS;
  }
  const raw = input.trim();
  if (!WEDDING_DATE_PATTERN.test(raw)) return null;
  const ms = Date.parse(`${raw}T00:00:00.000Z`);
  if (!Number.isFinite(ms)) return null;
  // Date.parse accepts 2026-02-31 and rolls it forward; reject the roll.
  if (new Date(ms).toISOString().slice(0, 10) !== raw) return null;
  return ms;
}

/** The UTC calendar day of an instant, as `YYYY-MM-DD`. */
export function weddingDateLabel(ms: number | null | undefined): string | null {
  if (ms == null || !Number.isFinite(ms)) return null;
  return new Date(ms).toISOString().slice(0, 10);
}

/**
 * D-022 point 2. Access ends at
 *   `max(redemption + 548 days, wedding date + 90 days)`.
 *
 * There is no upper cap: a couple booking three years out gets three years
 * plus the grace period. At roughly EUR 0.10 per live workspace per month the
 * marginal cost is a few euro, against the certainty of the worst failure this
 * product can produce.
 *
 * With no wedding date the floor applies unchanged, which is exactly what
 * shipped today — so an unknown date is never worse than the status quo.
 */
export function coupleAccessExpiryMs(input: {
  redeemedAtMs: number;
  weddingDateMs?: number | null;
  /**
   * The duration the code was minted with, when it is longer than the 548-day
   * floor. A venue that already knew a long-lead wedding date at mint time
   * chose that term deliberately, and a couple who then declines to enter a
   * date must not silently lose it.
   */
  mintedDurationDays?: number | null;
}): number {
  const floorDays = Math.max(
    VENUE_EDITION_COUPLE_ACCESS_DAYS,
    input.mintedDurationDays != null && Number.isFinite(input.mintedDurationDays)
      ? input.mintedDurationDays
      : 0,
  );
  const floor = input.redeemedAtMs + floorDays * DAY_MS;
  const wedding = normaliseWeddingDateMs(input.weddingDateMs ?? null);
  if (wedding == null) return floor;
  return Math.max(floor, wedding + VENUE_EDITION_WEDDING_GRACE_DAYS * DAY_MS);
}

/**
 * The same rule expressed as a mint-time duration, for the case where the
 * wedding date is known before the code is handed over. Always at least the
 * 548-day floor, so a mint can never encode a shorter term than the ratified
 * one.
 */
export function coupleAccessDurationDays(input: {
  issuedAtMs: number;
  weddingDateMs?: number | null;
}): number {
  const expiry = coupleAccessExpiryMs({
    redeemedAtMs: input.issuedAtMs,
    weddingDateMs: input.weddingDateMs,
  });
  return Math.max(
    VENUE_EDITION_COUPLE_ACCESS_DAYS,
    Math.ceil((expiry - input.issuedAtMs) / DAY_MS),
  );
}

/**
 * D-022 point 3. A wedding-date change recomputes expiry, and **access only
 * ever moves later**. A postponement extends it; a correction that would pull
 * it back leaves it where it is.
 *
 * The deliberate consequence: a couple who mistypes 2028 and fixes it to 2027
 * keeps the longer access. Granting a few extra months of a product the venue
 * has already paid for is a far cheaper error than taking access away from
 * someone who has started planning inside it.
 *
 * A null current expiry means the row has no expiry at all. It stays null —
 * this rule extends access, it never introduces an end date that was absent.
 */
export function extendedCoupleAccessExpiryMs(input: {
  currentExpiresAtMs: number | null;
  redeemedAtMs: number;
  weddingDateMs?: number | null;
  mintedDurationDays?: number | null;
}): number | null {
  if (input.currentExpiresAtMs == null) return null;
  const recomputed = coupleAccessExpiryMs({
    redeemedAtMs: input.redeemedAtMs,
    weddingDateMs: input.weddingDateMs,
    mintedDurationDays: input.mintedDurationDays,
  });
  return Math.max(input.currentExpiresAtMs, recomputed);
}

/**
 * D-022 point 4. The mint guard used to demand exactly 548 days, which made
 * the ratified grace rule unmintable. It now accepts any computed duration at
 * or above the floor and refuses anything below it.
 *
 * Null is refused rather than defaulted: on the redeem path a null duration
 * means *no expiry*, so silently accepting it would hand out a perpetual
 * wedding entitlement under the banner of an 18-month term.
 */
export function venueEditionDurationRefusal(
  durationDays: number | null | undefined,
): string | null {
  if (durationDays == null) {
    return `Venue Edition codes must carry an explicit duration of at least ${VENUE_EDITION_COUPLE_ACCESS_DAYS} days`;
  }
  if (!Number.isInteger(durationDays)) {
    return "Venue Edition code duration must be a whole number of days";
  }
  if (durationDays < VENUE_EDITION_COUPLE_ACCESS_DAYS) {
    return `Venue Edition codes must use wedding access for at least ${VENUE_EDITION_COUPLE_ACCESS_DAYS} days (got ${durationDays})`;
  }
  return null;
}
