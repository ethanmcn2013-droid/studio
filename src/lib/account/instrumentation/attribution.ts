/**
 * Attribution — deciding which sponsor, if any, an action belongs to.
 *
 * The chain is `subject → redemption → sponsor activation`, and it is followed
 * exactly. Where it is ambiguous the action becomes `unattributed` and leaves
 * the venue's numbers entirely. A guess here would show a venue use it did not
 * sponsor, which is worse than showing less.
 */

export type RedemptionLink = {
  subjectIdHash: string;
  sponsorId: string;
  /** When sponsored access began. Actions before this are not sponsored use. */
  redeemedAt: number;
  /** Set when access ended; actions after it are outside the sponsored window. */
  endedAt?: number | null;
  /** Seed, demo, and view-as chains never count as real use. */
  origin?: "production" | "demo" | "seed" | "view-as";
};

export type AttributionInput = {
  subjectIdHash: string;
  occurredAt: number;
};

export type AttributionResult =
  | { attributed: true; sponsorId: string }
  | { attributed: false; reason: AttributionRejection };

export type AttributionRejection =
  | "no-redemption"
  | "ambiguous-sponsor"
  | "before-redemption"
  | "after-access-ended"
  | "non-production-origin";

export function attributeAction(
  input: AttributionInput,
  links: readonly RedemptionLink[],
): AttributionResult {
  const forSubject = links.filter((l) => l.subjectIdHash === input.subjectIdHash);
  if (forSubject.length === 0) return { attributed: false, reason: "no-redemption" };

  const covering = forSubject.filter(
    (l) =>
      input.occurredAt >= l.redeemedAt &&
      (l.endedAt == null || input.occurredAt <= l.endedAt),
  );

  if (covering.length === 0) {
    // Distinguish "too early" from "too late" so coverage reporting can explain
    // which edge the action fell off.
    const anyStarted = forSubject.some((l) => input.occurredAt >= l.redeemedAt);
    return {
      attributed: false,
      reason: anyStarted ? "after-access-ended" : "before-redemption",
    };
  }

  const nonProduction = covering.find((l) => l.origin && l.origin !== "production");
  if (nonProduction) return { attributed: false, reason: "non-production-origin" };

  const sponsors = new Set(covering.map((l) => l.sponsorId));
  if (sponsors.size > 1) return { attributed: false, reason: "ambiguous-sponsor" };

  return { attributed: true, sponsorId: covering[0].sponsorId };
}
