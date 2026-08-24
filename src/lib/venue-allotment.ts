/**
 * How many sponsored workspaces a venue may issue — R-016, under D-020.
 *
 * D-020 ratified the entitlement as **every couple who books, unlimited, for
 * as long as the licence is current**, with no number in the commercial terms.
 * The shipped system could not express that: the mint refused a null allotment
 * by design, and the HQ onboarding form defaulted to ten. Ten was never
 * decided by anyone.
 *
 * Pure and client-safe. The database writers are the only callers that
 * persist any of it.
 */

/**
 * `limited` keeps today's behaviour exactly: `code_allotment` is a hard cap and
 * a null cap means the venue is not mint-eligible. `unlimited` is the D-020
 * entitlement: the mint always succeeds and `code_allotment` is ignored.
 *
 * The mode is an explicit column rather than a new meaning for
 * `code_allotment IS NULL`, because null already carries three different
 * meanings across this codebase — "not mint-eligible" in the entitlements
 * mint, "unlimited" on `grant_batches`, and "unlimited" in the studio-local
 * sponsor mirror. Reusing it would silently convert every existing null-cap
 * sponsor into an unlimited one, and there is no way to check from here how
 * many of those exist in production.
 */
export const ALLOTMENT_MODES = ["limited", "unlimited"] as const;
export type AllotmentMode = (typeof ALLOTMENT_MODES)[number];

export const DEFAULT_ALLOTMENT_MODE: AllotmentMode = "limited";

export function isAllotmentMode(value: unknown): value is AllotmentMode {
  return (ALLOTMENT_MODES as readonly unknown[]).includes(value);
}

/** A sponsor's issuance shape, as far as any allotment rule is concerned. */
export type AllotmentPosture = {
  allotmentMode?: string | null;
  codeAllotment?: number | null;
  codesIssued: number;
};

export function isUnlimitedSponsor(s: {
  allotmentMode?: string | null;
}): boolean {
  return s.allotmentMode === "unlimited";
}

/**
 * Codes still mintable, or null when the question does not apply — either the
 * venue is unlimited, or it has no cap recorded at all. Null is never rendered
 * as a number and never as zero: "no answer" and "none left" are different
 * facts and a venue sold "no seats" must not be shown either one as a count.
 */
export function remainingAllotment(s: AllotmentPosture): number | null {
  if (isUnlimitedSponsor(s)) return null;
  if (s.codeAllotment == null) return null;
  return Math.max(0, s.codeAllotment - s.codesIssued);
}

/* ── Fair use (D-020 point 1) ────────────────────────────────────────────
 *
 * "Fair use notifies, never blocks. Issuance above the internal ceiling
 * alerts Signal HQ and keeps issuing. A numeric pause must never appear in a
 * document that also says unlimited."
 *
 * So the ceiling is a monitoring threshold and nothing else. It is never
 * quoted to a venue, never printed in an agreement, and never returned from a
 * code path that can refuse.
 * ---------------------------------------------------------------------- */

/**
 * The smallest ceiling worth setting. D-012 rules out venues under roughly 20
 * weddings a year, and the multiplier below doubles that, so 40 is the floor a
 * qualifying venue would reach anyway.
 */
export const FAIR_USE_CEILING_FLOOR = 40;

/**
 * Headroom over the venue's own annual figure. Doubling covers reissues,
 * cancellations, replacements and a year of growth without ever being tight
 * enough to fire on ordinary use — which matters, because an alert that cries
 * wolf is an alert nobody reads.
 */
export const FAIR_USE_CEILING_MULTIPLIER = 2;

/**
 * D-020 point 4: the venue's annual wedding count is collected **after
 * signature** as an onboarding field. "This sets your issuance ceiling, it
 * never sets your price, and it never changes at renewal."
 *
 * A missing count yields the floor rather than no ceiling, so an
 * un-onboarded venue still has a monitoring threshold.
 */
export function fairUseCeilingFor(
  annualWeddingCount: number | null | undefined,
): number {
  if (
    annualWeddingCount == null ||
    !Number.isFinite(annualWeddingCount) ||
    annualWeddingCount <= 0
  ) {
    return FAIR_USE_CEILING_FLOOR;
  }
  return Math.max(
    FAIR_USE_CEILING_FLOOR,
    Math.ceil(annualWeddingCount) * FAIR_USE_CEILING_MULTIPLIER,
  );
}

/**
 * Would issuing `requested` more codes cross the ceiling? Advisory only — the
 * caller reports it and proceeds. `issuedInTerm` is issuance inside the
 * current licence term, because the ceiling is derived from an **annual**
 * figure and comparing an annual number against a lifetime counter would fire
 * on every venue in its second year.
 */
export function fairUseBreach(input: {
  fairUseCeiling: number | null | undefined;
  issuedInTerm: number;
  requested: number;
}): { breached: boolean; ceiling: number; wouldReach: number } | null {
  const ceiling = input.fairUseCeiling;
  if (ceiling == null || !Number.isFinite(ceiling) || ceiling <= 0) return null;
  const wouldReach = input.issuedInTerm + input.requested;
  return { breached: wouldReach > ceiling, ceiling, wouldReach };
}
