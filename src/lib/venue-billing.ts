/**
 * Venue Edition billing lifecycle — annual prepaid term, renewal, grace and
 * lapse. E08.01, E08.02, E08.03.
 *
 * Pure and client-safe. No database, no I/O, no clock of its own: every
 * function that needs "now" is handed it.
 *
 * ── What is settled, and by what ──────────────────────────────────────────
 *
 * D-009 point 3   The founding lock covers the base annual agreement "for as
 *                 long as it renews continuously without lapse". A lapse
 *                 therefore ends the lock. Never "for life", never "forever".
 * D-009 point 4   The rate follows the property. It survives rebrand and
 *                 ownership change while the agreement runs continuously, and
 *                 it does not transfer to additional properties.
 * D-009 point 6   A founding number is assigned on cleared payment.
 * D-020 point 2   A lapse stops NEW issuance only. Every already-redeemed
 *                 couple workspace keeps its full term plus Keepsake.
 * D-021           Prices are VAT-inclusive. See `venue-money.ts`.
 * E02.10          A founding number is never reused. A venue that lapses keeps
 *                 its number historically and its place shows as closed, not
 *                 open. The single exception is a reversed payment, which is
 *                 handled by `withdrawFoundingNumber`, not by this module.
 *
 * ── What is NOT settled, and is therefore a seam rather than a guess ──────
 *
 * Three sub-questions have no ratified answer in D-009, D-020, D-021 or E02.04:
 *
 *   1. How long the grace window is between the end of a prepaid term and the
 *      point at which the agreement counts as lapsed.
 *   2. How far in advance the renewal notice goes out.
 *   3. Whether a lapsed founding venue that returns is re-offered EUR 1,000 or
 *      moves to the standard EUR 1,500.
 *
 * The state machine below is correct for **any** value of (1) and (2), because
 * both are parameters rather than baked-in constants. `VENUE_RENEWAL_POLICY`
 * carries the proposed values with `ratified: false`, and
 * `renewalPolicyPublicationRefusal()` refuses to let an unratified number reach
 * a venue-facing surface. (3) is not implemented at all: `foundingRateOnReturn`
 * returns an explicit "unsettled" marker so no caller can quietly decide it.
 */

import {
  VENUE_EDITION_ANNUAL_PRICE_CENTS,
  VENUE_EDITION_FOUNDING_ANNUAL_PRICE_CENTS,
  venueEditionAnnualAmountCents,
  type VenueEditionPlan,
} from "./venue-edition";

const DAY_MS = 24 * 60 * 60 * 1000;

/** An annual prepaid term. 365 days, not 12 calendar months: the couple term
 *  is already computed in days and mixing the two units is how a renewal date
 *  drifts by a day a year. */
export const ANNUAL_TERM_DAYS = 365;
export const ANNUAL_TERM_MS = ANNUAL_TERM_DAYS * DAY_MS;

/**
 * The renewal timings, in one place, marked with whether the founder has
 * ratified them.
 *
 * **These numbers are proposals, not decisions.** D-009 established that a
 * lapse breaks the lock; it never said how long a venue has to renew before it
 * counts as one. Publishing an invented grace window to twenty-five venues in
 * an agreement is precisely the kind of number that becomes binding by being
 * written down, so it stays unratified until Ethan says otherwise.
 */
export const VENUE_RENEWAL_POLICY = {
  ratified: false,
  /** Days before term end that the renewal notice goes out. Proposed. */
  proposedNoticeLeadDays: 30,
  /** Days after term end before the agreement counts as lapsed. Proposed. */
  proposedGraceDays: 30,
  /** Where the open question is recorded. */
  founderQuestionRef: "E08.03 founder question 1",
} as const;

export type RenewalPolicy = {
  noticeLeadDays: number;
  graceDays: number;
};

/** The proposed policy, as a plain object the state machine can take. */
export function proposedRenewalPolicy(): RenewalPolicy {
  return {
    noticeLeadDays: VENUE_RENEWAL_POLICY.proposedNoticeLeadDays,
    graceDays: VENUE_RENEWAL_POLICY.proposedGraceDays,
  };
}

/**
 * Refusal reason if this policy may not be quoted to a venue, or null if it
 * may.
 *
 * Internal operator surfaces may show the proposed numbers, clearly labelled.
 * Agreements, order forms, renewal emails and the portal may not, because a
 * number a venue reads in a contract is a number Signal Studio is held to.
 */
export function renewalPolicyPublicationRefusal(): string | null {
  if (VENUE_RENEWAL_POLICY.ratified) return null;
  return `the renewal notice period and grace window are not ratified (${VENUE_RENEWAL_POLICY.founderQuestionRef}); they may be shown on internal operator surfaces, labelled proposed, and may not appear in an agreement, an order form, a renewal email or the portal`;
}

/* ── Billing state ───────────────────────────────────────────────────────── */

/**
 * `not_a_paying_plan`  pilot or none. There is no billing clock.
 * `never_paid`         a paying plan with no cleared payment. Not a lapse:
 *                      nothing was ever renewed, so nothing broke.
 * `term_end_unknown`   paid, but no term end recorded. The operator is told
 *                      rather than a renewal date being invented.
 * `current`            inside the term, before the notice window.
 * `renewal_due`        inside the notice window, before term end.
 * `grace`              past term end, inside the grace window. The agreement
 *                      has NOT lapsed and the founding lock still holds.
 * `lapsed`             past the grace window. The lock is broken (D-009 p3).
 */
export const VENUE_BILLING_STATES = [
  "not_a_paying_plan",
  "never_paid",
  "term_end_unknown",
  "current",
  "renewal_due",
  "grace",
  "lapsed",
] as const;
export type VenueBillingState = (typeof VENUE_BILLING_STATES)[number];

export type VenueBillingInput = {
  venuePlan: string;
  paidAt: number | null | undefined;
  termEndsAt: number | null | undefined;
  nowMs: number;
  policy?: RenewalPolicy;
};

export type VenueBillingSnapshot = {
  state: VenueBillingState;
  /** When the renewal notice is due. Null when there is no term end. */
  noticeDueAtMs: number | null;
  /** When the term ends. Null when unknown. */
  termEndsAtMs: number | null;
  /** The instant the agreement counts as lapsed. Null when there is no term end. */
  lapsesAtMs: number | null;
  /** Whole days until the term ends. Negative once it has passed. Null when unknown. */
  daysToTermEnd: number | null;
  /** True only in `lapsed`. Everything else, including `grace`, is not a lapse. */
  lapsed: boolean;
  /** The policy actually used, so an operator surface can label it. */
  policy: RenewalPolicy;
  policyRatified: boolean;
};

function isPayingPlan(plan: string): boolean {
  return plan === "founding" || plan === "paid";
}

/** Whole days from `from` to `to`, rounded toward zero at the day boundary. */
function daysBetween(fromMs: number, toMs: number): number {
  return Math.floor((toMs - fromMs) / DAY_MS);
}

export function deriveVenueBillingState(
  input: VenueBillingInput,
): VenueBillingSnapshot {
  const policy = input.policy ?? proposedRenewalPolicy();
  if (!Number.isInteger(policy.noticeLeadDays) || policy.noticeLeadDays < 0) {
    throw new Error("deriveVenueBillingState: noticeLeadDays must be a whole number of days, zero or more");
  }
  if (!Number.isInteger(policy.graceDays) || policy.graceDays < 0) {
    throw new Error("deriveVenueBillingState: graceDays must be a whole number of days, zero or more");
  }

  const base = {
    noticeDueAtMs: null,
    termEndsAtMs: null,
    lapsesAtMs: null,
    daysToTermEnd: null,
    lapsed: false,
    policy,
    policyRatified: VENUE_RENEWAL_POLICY.ratified,
  } satisfies Omit<VenueBillingSnapshot, "state">;

  if (!isPayingPlan(input.venuePlan)) {
    return { ...base, state: "not_a_paying_plan" };
  }
  if (input.paidAt == null) {
    return { ...base, state: "never_paid" };
  }
  const termEndsAt = input.termEndsAt ?? null;
  if (termEndsAt == null || !Number.isFinite(termEndsAt)) {
    return { ...base, state: "term_end_unknown" };
  }

  const noticeDueAtMs = termEndsAt - policy.noticeLeadDays * DAY_MS;
  const lapsesAtMs = termEndsAt + policy.graceDays * DAY_MS;
  const shape = {
    ...base,
    noticeDueAtMs,
    termEndsAtMs: termEndsAt,
    lapsesAtMs,
    daysToTermEnd: daysBetween(input.nowMs, termEndsAt),
  };

  if (input.nowMs >= lapsesAtMs) return { ...shape, state: "lapsed", lapsed: true };
  if (input.nowMs >= termEndsAt) return { ...shape, state: "grace" };
  if (input.nowMs >= noticeDueAtMs) return { ...shape, state: "renewal_due" };
  return { ...shape, state: "current" };
}

/** The end of a prepaid annual term that starts at `termStartsAt`. */
export function annualTermEndsAtMs(termStartsAtMs: number): number {
  if (!Number.isFinite(termStartsAtMs)) {
    throw new Error("annualTermEndsAtMs: termStartsAtMs must be a finite instant");
  }
  return termStartsAtMs + ANNUAL_TERM_MS;
}

/* ── The founding lock ───────────────────────────────────────────────────── */

/**
 * `not_applicable`  the venue is not on the founding plan.
 * `held`            the agreement has renewed continuously. Includes `grace`:
 *                   a venue inside its grace window has not lapsed.
 * `broken_by_lapse` the agreement lapsed. D-009 point 3's condition failed.
 */
export const FOUNDING_LOCK_STATES = [
  "not_applicable",
  "held",
  "broken_by_lapse",
] as const;
export type FoundingLockState = (typeof FOUNDING_LOCK_STATES)[number];

export function foundingLockState(input: {
  venuePlan: string;
  billingState: VenueBillingState;
}): FoundingLockState {
  if (input.venuePlan !== "founding") return "not_applicable";
  return input.billingState === "lapsed" ? "broken_by_lapse" : "held";
}

/**
 * What happens to the founding NUMBER when an agreement lapses.
 *
 * Settled, and deliberately separate from the lock: the lock is commercial and
 * the number is recognition. E02.10 is explicit that a number is never reused,
 * that a lapsed venue keeps it historically, and that its place shows as closed
 * rather than open. Handing 07/25 to a second business because the first
 * stopped paying is unrecoverable with exactly the people whose reference value
 * is why they were recruited.
 */
export function foundingNumberOnLapse(): {
  action: "keep";
  placeReturnsToPool: false;
  placeShowsAs: "closed";
  reason: string;
} {
  return {
    action: "keep",
    placeReturnsToPool: false,
    placeShowsAs: "closed",
    reason:
      "E02.10: a founding number is never reused. A lapsed venue keeps its number historically and its place shows as closed. Only a reversed payment withdraws a number, via withdrawFoundingNumber.",
  };
}

/**
 * Whether a lapsed founding venue that comes back is re-offered EUR 1,000.
 *
 * **Not settled, and deliberately not decided here.** D-009 point 3 says the
 * lock holds while the agreement renews continuously without lapse. It does not
 * say what a returning venue is offered, and inventing "they go to EUR 1,500"
 * or "Ethan may restore it" would put a commercial term into code that no
 * decision record contains.
 */
export function foundingRateOnReturn(): {
  settled: false;
  question: string;
  whatIsSettled: string;
} {
  return {
    settled: false,
    question:
      "A founding venue lapses and later wants to come back. Is it re-offered EUR 1,000, moved to the standard EUR 1,500, or is restoration a case-by-case call Ethan makes and records?",
    whatIsSettled:
      "D-009 point 3: the lock holds while the agreement renews continuously without lapse. The lapse ends the lock. What is offered afterwards has never been decided.",
  };
}

/* ── Lapse consequences ──────────────────────────────────────────────────── */

/**
 * The settled consequences of a lapse, as data rather than prose, so a runbook
 * and a test read the same source.
 *
 * The couple half is the part that must never move. It is D-020 point 2, stated
 * unprompted in the outreach email and the agreement. The executable proof lives
 * in `venue-lifecycle.ts` — `accessAfterSponsorshipEvent()` returns the access
 * state unchanged for every sponsorship event, including `licence_lapses` — and
 * this module deliberately does not reimplement it. One source, linked.
 */
export function lapseConsequences(): {
  newIssuanceStops: true;
  redeemedWorkspacesUnchanged: true;
  keepsakeUnchanged: true;
  foundingNumberKept: true;
  foundingLockBroken: true;
  brandingRemovalDeadlineHours: 24;
  invariantEnforcedBy: string;
} {
  return {
    newIssuanceStops: true,
    redeemedWorkspacesUnchanged: true,
    keepsakeUnchanged: true,
    foundingNumberKept: true,
    foundingLockBroken: true,
    brandingRemovalDeadlineHours: 24,
    invariantEnforcedBy:
      "src/lib/venue-lifecycle.ts: accessAfterSponsorshipEvent, canIssueNewSponsorship, sponsorBrandingVisible, BRANDING_REMOVAL_DEADLINE_MS",
  };
}

/* ── Price agreements ────────────────────────────────────────────────────── */

/**
 * One prepaid annual term at one price. Append-only: a renewal writes a new
 * record, it never edits the previous one.
 *
 * This is the shape that makes "a venue that joined at EUR 1,000 still reads
 * EUR 1,000 after the standard price moves" true. The price is a property of
 * the term, not a mutable column on the venue, so changing
 * `VENUE_EDITION_ANNUAL_PRICE_CENTS` tomorrow cannot reach backwards into a
 * term that has already been paid for.
 */
export type PriceAgreementRecord = {
  id: string;
  sponsorId: string;
  venuePlan: string;
  /** What the venue paid for this term, VAT-inclusive. */
  grossAmountCents: number;
  /** What actually landed. Recorded separately so a discrepancy is visible. */
  amountReceivedCents: number;
  vatRateBasisPoints: number | null;
  foundingLocked: boolean;
  effectiveFrom: number;
  effectiveTo: number;
  paidAt: number;
};

/**
 * The agreement covering `atMs`, or null when none does.
 *
 * Terms are half-open: `[effectiveFrom, effectiveTo)`. A renewal that starts
 * the instant the previous term ends therefore matches exactly one record, and
 * the boundary instant is never ambiguous.
 */
export function priceAgreementAt<T extends Pick<PriceAgreementRecord, "effectiveFrom" | "effectiveTo">>(
  agreements: readonly T[],
  atMs: number,
): T | null {
  let best: T | null = null;
  for (const a of agreements) {
    if (atMs >= a.effectiveFrom && atMs < a.effectiveTo) {
      // Later start wins if two terms somehow overlap, so a correction recorded
      // afterwards reads as the answer rather than the older row.
      if (best == null || a.effectiveFrom > best.effectiveFrom) best = a;
    }
  }
  return best;
}

/** The most recent agreement by term start, or null when there are none. */
export function latestPriceAgreement<T extends Pick<PriceAgreementRecord, "effectiveFrom">>(
  agreements: readonly T[],
): T | null {
  let best: T | null = null;
  for (const a of agreements) {
    if (best == null || a.effectiveFrom > best.effectiveFrom) best = a;
  }
  return best;
}

/**
 * Refusal reason if this payment may not be recorded, or null when it may.
 *
 * The rule that matters: **the amount must be the plan's amount.** Recording
 * EUR 1,500 against a founding agreement is the defect that shipped once
 * already (I-002: `mark-venue-paid.ts` wrote the standard price for both plans,
 * so every founding venue would have been recorded in the cash ledger at
 * EUR 1,500 against EUR 1,000 actually received). It is refused here rather than
 * left to the caller, so no second writer can reintroduce it.
 */
export function prepaymentRefusal(input: {
  venuePlan: string;
  amountReceivedCents: number;
  paidAtMs: number;
  termStartsAtMs: number;
}): string | null {
  if (input.venuePlan !== "founding" && input.venuePlan !== "paid") {
    return `only a founding or paid agreement carries a prepayment (plan is '${input.venuePlan}')`;
  }
  const expected = venueEditionAnnualAmountCents(input.venuePlan as VenueEditionPlan);
  if (expected == null) {
    return `plan '${input.venuePlan}' has no annual amount`;
  }
  if (!Number.isInteger(input.amountReceivedCents) || input.amountReceivedCents < 0) {
    return "amountReceivedCents must be a non-negative whole number of cents";
  }
  if (input.amountReceivedCents !== expected) {
    const other =
      input.venuePlan === "founding"
        ? VENUE_EDITION_ANNUAL_PRICE_CENTS
        : VENUE_EDITION_FOUNDING_ANNUAL_PRICE_CENTS;
    const hint =
      input.amountReceivedCents === other
        ? ` That is the other plan's price. Recording it here is how a founding venue ends up in the cash ledger at the standard rate (I-002).`
        : "";
    return `a '${input.venuePlan}' agreement is EUR ${expected / 100}, and EUR ${
      input.amountReceivedCents / 100
    } was supplied.${hint}`;
  }
  if (!Number.isFinite(input.paidAtMs) || input.paidAtMs <= 0) {
    return "paidAtMs must be the instant the payment cleared";
  }
  if (!Number.isFinite(input.termStartsAtMs) || input.termStartsAtMs <= 0) {
    return "termStartsAtMs must be a real instant";
  }
  return null;
}

/**
 * Refusal reason if this renewal would change the plan a venue is on, or null
 * when the plan is unchanged or there is no prior term.
 *
 * **This is what makes the founding rate immutable in practice.** Everything
 * else in this module protects the *history*: terms are append-only rows, so a
 * past term cannot be rewritten. That is necessary and it is not sufficient.
 * Without this check, a venue holding 07/25 at EUR 1,000 could have its NEXT
 * term recorded as `paid` at EUR 1,500 — every past row intact, every amount
 * matching its plan, `prepaymentRefusal` satisfied, and the founding lock quietly
 * ended without a lapse ever happening. D-009 point 3 says the lock holds while
 * the agreement renews continuously. A renewal that changes the plan is the one
 * way to break that without a lapse, so it is refused here rather than trusted
 * to the operator who typed the command.
 *
 * The two directions are refused for different reasons and the messages say so:
 *
 *   founding → paid   The lock is held. This is settled: the only thing that
 *                     ends the lock is a lapse, and a lapse is derived from the
 *                     term and the grace window, never declared by hand. Record
 *                     the lapse first, then a new agreement is a new agreement.
 *
 *   paid → founding   **Not settled.** Whether a venue already on the standard
 *                     rate can later be moved into the Founding 25 is not
 *                     answered by D-009, which describes "the first 25 founding
 *                     agreements" and assigns a number on cleared payment. It is
 *                     refused rather than guessed, because guessing it either
 *                     hands out a founding number that D-009 did not authorise
 *                     or silently denies one Ethan intended.
 */
export function planChangeRefusal(input: {
  priorPlan: string | null;
  priorLock: FoundingLockState;
  nextPlan: string;
}): string | null {
  if (input.priorPlan == null) return null;
  if (input.priorPlan === input.nextPlan) return null;

  if (input.priorPlan === "founding" && input.priorLock === "held") {
    return `this venue holds the Founding 25 rate and the lock is held, so its renewal cannot be recorded as '${input.nextPlan}'. D-009 point 3: the lock holds while the agreement renews continuously without lapse, and a lapse is derived from the term and the grace window rather than declared. Record the lapse first if that is what happened.`;
  }
  if (input.priorPlan === "founding") {
    return `this venue's founding agreement lapsed, and what a returning founding venue is offered has never been decided (see foundingRateOnReturn). Recording a '${input.nextPlan}' term here would decide it in code.`;
  }
  return `this venue is on the standard agreement and moving it to '${input.nextPlan}' is not a settled operation. D-009 describes the first 25 founding agreements and assigns a number on cleared payment; it does not say whether a standard venue can later join the Founding 25. That is a founder decision, not a recording step.`;
}

/* ── Renewal worklist ────────────────────────────────────────────────────── */

/**
 * What an operator should do about this venue today, if anything.
 *
 * There is no automated renewal billing and there is no scheduled sender. This
 * function produces a worklist a human works through, which is the honest shape
 * of the process for twenty-five manually invoiced venues, and it says so.
 */
export type RenewalAction =
  | { kind: "none"; detail: string }
  | { kind: "send_renewal_notice"; detail: string; dueAtMs: number }
  | { kind: "chase_payment"; detail: string; lapsesAtMs: number }
  | { kind: "record_lapse"; detail: string; lapsedSinceMs: number }
  | { kind: "record_first_payment"; detail: string }
  | { kind: "fix_data"; detail: string };

export function renewalAction(
  snapshot: VenueBillingSnapshot,
  input: { venuePlan: string; nowMs: number },
): RenewalAction {
  switch (snapshot.state) {
    case "not_a_paying_plan":
      return { kind: "none", detail: `plan '${input.venuePlan}' has no billing clock` };
    case "never_paid":
      return {
        kind: "record_first_payment",
        detail: "a paying plan with no cleared payment; a founding number is not assigned until it clears",
      };
    case "term_end_unknown":
      return {
        kind: "fix_data",
        detail: "paid with no term end recorded, so no renewal date can be derived without inventing one",
      };
    case "current":
      return {
        kind: "none",
        detail: `term ends in ${String(snapshot.daysToTermEnd)} days`,
      };
    case "renewal_due":
      return {
        kind: "send_renewal_notice",
        detail: "inside the renewal notice window; the notice is sent by hand and its delivery recorded",
        dueAtMs: snapshot.noticeDueAtMs as number,
      };
    case "grace":
      return {
        kind: "chase_payment",
        detail: "the term has ended and the agreement has not lapsed; the founding lock still holds",
        lapsesAtMs: snapshot.lapsesAtMs as number,
      };
    case "lapsed":
      return {
        kind: "record_lapse",
        detail: "the agreement lapsed; new issuance stops and every redeemed workspace is untouched",
        lapsedSinceMs: snapshot.lapsesAtMs as number,
      };
  }
}
