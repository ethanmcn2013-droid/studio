/**
 * The Founding Venue number — E02.13, implementing the policy ratified in
 * E02.10 and D-009 point 6.
 *
 * Until this existed, `01/25` appeared in exactly one place in the codebase:
 * marketing copy on the public venues page. The programme promised every
 * founding venue a number and had nowhere to record which one they held, which
 * makes telling two venues they are both `07/25` a matter of luck rather than
 * of design. These are the rules, and the unique index behind them is what
 * turns "unlikely" into "impossible".
 *
 * From `docs/strategy/FOUNDING_25_PROGRAMME_MECHANICS.md` §2:
 *
 *   - Format `NN/25`, zero-padded, 01 to 25.
 *   - **Assigned when the first payment clears.** Not at signature, not on
 *     invoice, not on a verbal yes. Payment is the only event that cannot be
 *     walked back, and that is what makes 01/25 worth having.
 *   - Ordered by the moment payment clears; the lowest free number goes to the
 *     first to clear. Ties break on the earlier signature date, then by hand.
 *   - **A number is never reused.** A venue that lapses in year three keeps
 *     07/25 historically and the place shows as closed, not open.
 *   - A number is not a licence. It is recognition; the agreement grants the
 *     product.
 *   - **One exception:** if a payment reverses after assignment, the number is
 *     withdrawn and the place returns to the pool, recorded with date and
 *     reason.
 *
 * Pure and client-safe.
 */

/** Places in the programme. Ratified at 25 by D-001 point 9 and D-009. */
export const FOUNDING_PLACES = 25;

/**
 * `NN/25`, zero-padded. The only format used anywhere: the certificate, the
 * founding page, the agreement schedule, the portal, the film.
 */
export function formatFoundingNumber(n: number | null | undefined): string | null {
  if (!isValidFoundingNumber(n)) return null;
  return `${String(n).padStart(2, "0")}/${FOUNDING_PLACES}`;
}

export function isValidFoundingNumber(n: unknown): n is number {
  return Number.isInteger(n) && (n as number) >= 1 && (n as number) <= FOUNDING_PLACES;
}

/**
 * The lowest free place, or null when the programme is full.
 *
 * `taken` must include numbers held by lapsed venues. A lapsed venue keeps its
 * number, so treating it as free is the bug that hands `07/25` to two different
 * businesses.
 */
export function nextFoundingNumber(taken: Iterable<number>): number | null {
  const used = new Set<number>();
  for (const n of taken) if (isValidFoundingNumber(n)) used.add(n);
  for (let n = 1; n <= FOUNDING_PLACES; n += 1) {
    if (!used.has(n)) return n;
  }
  return null;
}

/** Places left, for scarcity claims. Never a countdown for effect: the
 *  mechanics doc requires every published claim to be true when it is sent. */
export function foundingPlacesRemaining(taken: Iterable<number>): number {
  const used = new Set<number>();
  for (const n of taken) if (isValidFoundingNumber(n)) used.add(n);
  return Math.max(0, FOUNDING_PLACES - used.size);
}

export function isFoundingProgrammeClosed(taken: Iterable<number>): boolean {
  return foundingPlacesRemaining(taken) === 0;
}

/**
 * Assignment order: earliest cleared payment first; ties broken by the earlier
 * signature date. When both match, the mechanics doc says Ethan assigns and
 * records why — so this returns 0 rather than inventing a winner, and the
 * caller must not treat 0 as "either will do".
 */
export type FoundingCandidate = {
  sponsorId: string;
  paidAt: number;
  signedAt?: number | null;
};

export function compareFoundingClaim(a: FoundingCandidate, b: FoundingCandidate): number {
  if (a.paidAt !== b.paidAt) return a.paidAt - b.paidAt;
  const aSigned = a.signedAt ?? null;
  const bSigned = b.signedAt ?? null;
  if (aSigned != null && bSigned != null && aSigned !== bSigned) return aSigned - bSigned;
  if (aSigned != null && bSigned == null) return -1;
  if (aSigned == null && bSigned != null) return 1;
  return 0;
}

/** True when the two claims cannot be separated by rule and need the founder. */
export function needsManualTieBreak(a: FoundingCandidate, b: FoundingCandidate): boolean {
  return compareFoundingClaim(a, b) === 0;
}

/**
 * Is this venue eligible for a number right now?
 *
 * Payment is the gate, and nothing else is. A signed agreement with no cleared
 * payment gets a held place, not a number.
 */
export function foundingNumberRefusal(input: {
  paidAt: number | null | undefined;
  existingNumber: number | null | undefined;
  venuePlan: string;
}): string | null {
  if (input.existingNumber != null) {
    return `already holds ${formatFoundingNumber(input.existingNumber)}`;
  }
  if (input.venuePlan !== "founding") {
    return `only founding venues receive a number (plan is '${input.venuePlan}')`;
  }
  if (input.paidAt == null) {
    return "payment has not cleared — a number is assigned on cleared payment, never on signature";
  }
  return null;
}
