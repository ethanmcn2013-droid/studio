/** Canonical commercial terms for new Venue Edition sales. */
export const VENUE_EDITION_ANNUAL_PRICE_EUR = 1_500;
export const VENUE_EDITION_ANNUAL_PRICE_CENTS =
  VENUE_EDITION_ANNUAL_PRICE_EUR * 100;
export const VENUE_EDITION_COUPLE_ACCESS_MONTHS = 18;
export const VENUE_EDITION_COUPLE_ACCESS_DAYS = 548;

export type VenueEditionPlan = "pilot" | "founding" | "paid";

/**
 * Pilot venues do not count as revenue. Every new paid Venue Edition uses
 * one fixed annual price, regardless of venue size or number of sites.
 */
export function venueEditionAnnualAmountCents(
  plan: VenueEditionPlan,
): number | null {
  return plan === "pilot" ? null : VENUE_EDITION_ANNUAL_PRICE_CENTS;
}
