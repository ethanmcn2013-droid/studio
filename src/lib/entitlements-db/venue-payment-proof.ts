import type { EntitlementEvent, Sponsor } from "./schema";
import { rowHashOf } from "./pure";
import { venueEditionAnnualAmountCents } from "../venue-edition";

/** The writer and reader must agree on the complete financial snapshot. */
export const VENUE_PAYMENT_FIELDS = [
  "venuePlan", "annualAmountCents", "foundingLocked", "paidAt", "termStartsAt", "termEndsAt",
] as const;

export function matchesCurrentVenuePayment(
  venue: Sponsor,
  event: EntitlementEvent | null,
  now: number,
): boolean {
  if (venue.kind !== "venue" || !["founding", "paid"].includes(venue.venuePlan)) return false;
  if (!event || event.action !== "venue_payment" || event.sponsorId !== venue.id ||
      !event.actorId || !event.prevHash || !event.rowHash ||
      !/^venue-payment:[a-f0-9]{64}$/.test(event.origin ?? "") ||
      !Number.isSafeInteger(venue.paidAt) || venue.paidAt! <= 0 || venue.paidAt! > now ||
      event.createdAt < venue.paidAt! || event.createdAt > now ||
      event.rowHash !== rowHashOf(event.prevHash, event)) return false;
  if (venue.annualAmountCents !== venueEditionAnnualAmountCents(venue.venuePlan as "founding" | "paid") ||
      venue.foundingLocked !== (venue.venuePlan === "founding" ? 1 : null) ||
      venue.termStartsAt !== venue.paidAt ||
      venue.termEndsAt !== venue.paidAt! + 365 * 86400000) return false;
  try {
    const receipt = JSON.parse(event.afterJson ?? "null");
    return receipt?.version === 1 && receipt.slug === venue.slug &&
      receipt.evidenceKey === event.origin &&
      VENUE_PAYMENT_FIELDS.every((key) => receipt[key] === venue[key]);
  } catch {
    return false;
  }
}
