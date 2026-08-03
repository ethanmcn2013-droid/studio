import assert from "node:assert/strict";
import test from "node:test";

import {
  ANNUAL_TERM_DAYS,
  VENUE_RENEWAL_POLICY,
  annualTermEndsAtMs,
  deriveVenueBillingState,
  foundingLockState,
  foundingNumberOnLapse,
  foundingRateOnReturn,
  lapseConsequences,
  latestPriceAgreement,
  planChangeRefusal,
  prepaymentRefusal,
  priceAgreementAt,
  proposedRenewalPolicy,
  renewalAction,
  renewalPolicyPublicationRefusal,
  type PriceAgreementRecord,
} from "./venue-billing";
import { accessAfterSponsorshipEvent, canIssueNewSponsorship } from "./venue-lifecycle";

const DAY = 24 * 60 * 60 * 1000;
const TERM_START = Date.parse("2026-09-01T10:00:00.000Z");
const TERM_END = annualTermEndsAtMs(TERM_START);
const POLICY = { noticeLeadDays: 30, graceDays: 30 };

function snapshotAt(nowMs: number, overrides?: Partial<Parameters<typeof deriveVenueBillingState>[0]>) {
  return deriveVenueBillingState({
    venuePlan: "founding",
    paidAt: TERM_START,
    termEndsAt: TERM_END,
    nowMs,
    policy: POLICY,
    ...overrides,
  });
}

/* ── The term ────────────────────────────────────────────────────────────── */

test("an annual term is 365 days from its start", () => {
  assert.equal(ANNUAL_TERM_DAYS, 365);
  assert.equal(TERM_END - TERM_START, 365 * DAY);
  assert.equal(new Date(TERM_END).toISOString(), "2027-09-01T10:00:00.000Z");
});

/* ── The state machine ───────────────────────────────────────────────────── */

test("walks current, renewal due, grace, lapsed at the right boundaries", () => {
  assert.equal(snapshotAt(TERM_START + DAY).state, "current");
  assert.equal(snapshotAt(TERM_END - 31 * DAY).state, "current");
  assert.equal(snapshotAt(TERM_END - 30 * DAY).state, "renewal_due", "the notice window opens exactly on the lead day");
  assert.equal(snapshotAt(TERM_END - DAY).state, "renewal_due");
  assert.equal(snapshotAt(TERM_END).state, "grace", "the instant the term ends is grace, not lapse");
  assert.equal(snapshotAt(TERM_END + 29 * DAY).state, "grace");
  assert.equal(snapshotAt(TERM_END + 30 * DAY).state, "lapsed");
  assert.equal(snapshotAt(TERM_END + 400 * DAY).state, "lapsed");
});

test("distinguishes never-paid, unknown-term and non-paying plans from a lapse", () => {
  assert.equal(snapshotAt(TERM_END + 90 * DAY, { paidAt: null }).state, "never_paid");
  assert.equal(snapshotAt(TERM_END + 90 * DAY, { termEndsAt: null }).state, "term_end_unknown");
  assert.equal(snapshotAt(TERM_END + 90 * DAY, { venuePlan: "pilot" }).state, "not_a_paying_plan");
  assert.equal(snapshotAt(TERM_END + 90 * DAY, { venuePlan: "none" }).state, "not_a_paying_plan");
  // None of them is a lapse. Nothing was renewing, so nothing broke.
  for (const state of ["never_paid", "term_end_unknown", "not_a_paying_plan"] as const) {
    assert.equal(
      snapshotAt(TERM_END + 90 * DAY, {
        paidAt: state === "never_paid" ? null : TERM_START,
        termEndsAt: state === "term_end_unknown" ? null : TERM_END,
        venuePlan: state === "not_a_paying_plan" ? "pilot" : "founding",
      }).lapsed,
      false,
    );
  }
});

test("the renewal date is derived, never calculated by hand", () => {
  const snapshot = snapshotAt(TERM_END - 45 * DAY);
  assert.equal(snapshot.termEndsAtMs, TERM_END);
  assert.equal(snapshot.noticeDueAtMs, TERM_END - 30 * DAY);
  assert.equal(snapshot.lapsesAtMs, TERM_END + 30 * DAY);
  assert.equal(snapshot.daysToTermEnd, 45);
  assert.equal(snapshotAt(TERM_END + 10 * DAY).daysToTermEnd, -10);
});

test("the machine is correct for any ratified notice and grace window", () => {
  // The lengths are unratified, so nothing may depend on the proposed numbers.
  const long = deriveVenueBillingState({
    venuePlan: "paid",
    paidAt: TERM_START,
    termEndsAt: TERM_END,
    nowMs: TERM_END + 60 * DAY,
    policy: { noticeLeadDays: 90, graceDays: 90 },
  });
  assert.equal(long.state, "grace");
  const zero = deriveVenueBillingState({
    venuePlan: "paid",
    paidAt: TERM_START,
    termEndsAt: TERM_END,
    nowMs: TERM_END,
    policy: { noticeLeadDays: 0, graceDays: 0 },
  });
  assert.equal(zero.state, "lapsed");
  assert.throws(
    () => snapshotAt(TERM_END, { policy: { noticeLeadDays: -1, graceDays: 30 } }),
    /noticeLeadDays/,
  );
});

/* ── The seam ────────────────────────────────────────────────────────────── */

test("the renewal timings are marked unratified and may not reach a venue", () => {
  assert.equal(VENUE_RENEWAL_POLICY.ratified, false);
  const refusal = renewalPolicyPublicationRefusal();
  assert.ok(refusal, "an unratified grace window must not be publishable");
  assert.match(refusal as string, /not ratified/);
  assert.match(refusal as string, /agreement/);
  assert.equal(proposedRenewalPolicy().graceDays, VENUE_RENEWAL_POLICY.proposedGraceDays);
  assert.equal(snapshotAt(TERM_START).policyRatified, false);
});

test("what a returning lapsed founding venue is offered is left undecided", () => {
  const open = foundingRateOnReturn();
  assert.equal(open.settled, false);
  assert.match(open.whatIsSettled, /renews continuously without lapse/);
  assert.match(open.question, /EUR 1,000/);
});

/* ── The founding lock ───────────────────────────────────────────────────── */

test("the lock holds through grace and breaks only on a lapse", () => {
  for (const state of ["current", "renewal_due", "grace"] as const) {
    assert.equal(
      foundingLockState({ venuePlan: "founding", billingState: state }),
      "held",
      `the lock must hold in ${state}`,
    );
  }
  assert.equal(
    foundingLockState({ venuePlan: "founding", billingState: "lapsed" }),
    "broken_by_lapse",
  );
  assert.equal(foundingLockState({ venuePlan: "paid", billingState: "lapsed" }), "not_applicable");
  assert.equal(foundingLockState({ venuePlan: "pilot", billingState: "current" }), "not_applicable");
});

test("a lapse never returns a founding number to the pool", () => {
  const outcome = foundingNumberOnLapse();
  assert.equal(outcome.action, "keep");
  assert.equal(outcome.placeReturnsToPool, false);
  assert.equal(outcome.placeShowsAs, "closed");
  assert.match(outcome.reason, /never reused/);
  assert.match(outcome.reason, /withdrawFoundingNumber/);
});

/* ── The couple invariant ────────────────────────────────────────────────── */

test("a lapse stops new issuance and moves no couple's access", () => {
  const consequences = lapseConsequences();
  assert.equal(consequences.newIssuanceStops, true);
  assert.equal(consequences.redeemedWorkspacesUnchanged, true);
  assert.equal(consequences.keepsakeUnchanged, true);
  assert.equal(consequences.brandingRemovalDeadlineHours, 24);

  // D-020 point 2, exercised against the lifecycle module this one links to
  // rather than reimplements. Every access state survives the licence lapsing.
  for (const access of ["invited", "active", "keepsake", "deleted"] as const) {
    assert.equal(
      accessAfterSponsorshipEvent({ accessState: access, event: "licence_lapses" }),
      access,
      `a lapse must not move a couple from ${access}`,
    );
  }
  assert.equal(canIssueNewSponsorship("ended"), false, "only new issuance stops");
  assert.equal(canIssueNewSponsorship("active"), true);
});

/* ── Prepayment guards ───────────────────────────────────────────────────── */

test("refuses the other plan's price, in both directions", () => {
  const base = { paidAtMs: TERM_START, termStartsAtMs: TERM_START };
  const foundingAtStandard = prepaymentRefusal({
    ...base,
    venuePlan: "founding",
    amountReceivedCents: 150_000,
  });
  assert.match(foundingAtStandard as string, /I-002/);
  // [\s\S]* rather than the /s dotAll flag: this tsconfig targets below es2018
  // and /s is a typecheck error, which is how the checkpoint shipped red.
  assert.match(foundingAtStandard as string, /EUR 1000[\s\S]*EUR 1500/);

  const standardAtFounding = prepaymentRefusal({
    ...base,
    venuePlan: "paid",
    amountReceivedCents: 100_000,
  });
  assert.match(standardAtFounding as string, /I-002/);

  assert.equal(prepaymentRefusal({ ...base, venuePlan: "founding", amountReceivedCents: 100_000 }), null);
  assert.equal(prepaymentRefusal({ ...base, venuePlan: "paid", amountReceivedCents: 150_000 }), null);
});

test("refuses a prepayment against a plan that has no price", () => {
  const base = { paidAtMs: TERM_START, termStartsAtMs: TERM_START, amountReceivedCents: 100_000 };
  assert.match(prepaymentRefusal({ ...base, venuePlan: "pilot" }) as string, /only a founding or paid/);
  assert.match(prepaymentRefusal({ ...base, venuePlan: "none" }) as string, /only a founding or paid/);
});

test("refuses a partial amount and a missing payment instant", () => {
  assert.match(
    prepaymentRefusal({
      venuePlan: "founding",
      amountReceivedCents: 50_000,
      paidAtMs: TERM_START,
      termStartsAtMs: TERM_START,
    }) as string,
    /EUR 1000[\s\S]*EUR 500/,
  );
  assert.match(
    prepaymentRefusal({
      venuePlan: "founding",
      amountReceivedCents: 100_000,
      paidAtMs: 0,
      termStartsAtMs: TERM_START,
    }) as string,
    /paidAtMs/,
  );
});

/* ── Historical price ────────────────────────────────────────────────────── */

const agreement = (
  from: number,
  gross: number,
  plan = "founding",
): PriceAgreementRecord => ({
  id: `pa-${from}`,
  sponsorId: "sp-1",
  venuePlan: plan,
  grossAmountCents: gross,
  amountReceivedCents: gross,
  vatRateBasisPoints: null,
  foundingLocked: plan === "founding",
  effectiveFrom: from,
  effectiveTo: annualTermEndsAtMs(from),
  paidAt: from,
});

test("a venue that joined at EUR 1,000 still reads EUR 1,000 after the standard price moves", () => {
  // Three terms. The third is priced at a hypothetical future standard rate of
  // EUR 1,800, which is exactly the change E08.02 has to survive.
  const year1 = agreement(TERM_START, 100_000);
  const year2 = agreement(annualTermEndsAtMs(TERM_START), 100_000);
  const year3 = agreement(annualTermEndsAtMs(annualTermEndsAtMs(TERM_START)), 180_000);
  const history = [year1, year2, year3];

  assert.equal(priceAgreementAt(history, TERM_START + 10 * DAY)?.grossAmountCents, 100_000);
  assert.equal(priceAgreementAt(history, year2.effectiveFrom + DAY)?.grossAmountCents, 100_000);
  assert.equal(priceAgreementAt(history, year3.effectiveFrom + DAY)?.grossAmountCents, 180_000);
  // The old terms were not rewritten by the new price.
  assert.equal(year1.grossAmountCents, 100_000);
  assert.equal(year2.grossAmountCents, 100_000);
  assert.equal(latestPriceAgreement(history)?.id, year3.id);
});

test("term windows are half-open, so a renewal boundary is never ambiguous", () => {
  const year1 = agreement(TERM_START, 100_000);
  const year2 = agreement(annualTermEndsAtMs(TERM_START), 100_000);
  const boundary = year1.effectiveTo;
  assert.equal(boundary, year2.effectiveFrom);
  assert.equal(priceAgreementAt([year1, year2], boundary)?.id, year2.id);
  assert.equal(priceAgreementAt([year1, year2], boundary - 1)?.id, year1.id);
});

test("a date outside every term has no price rather than the nearest one", () => {
  const year1 = agreement(TERM_START, 100_000);
  assert.equal(priceAgreementAt([year1], TERM_START - DAY), null);
  assert.equal(priceAgreementAt([year1], year1.effectiveTo + DAY), null);
  assert.equal(priceAgreementAt([], TERM_START), null);
  assert.equal(latestPriceAgreement([]), null);
});

/* ── The worklist ────────────────────────────────────────────────────────── */

test("produces one operator action per state, and never claims automation", () => {
  const cases: Array<[number, string]> = [
    [TERM_START + DAY, "none"],
    [TERM_END - 10 * DAY, "send_renewal_notice"],
    [TERM_END + 10 * DAY, "chase_payment"],
    [TERM_END + 60 * DAY, "record_lapse"],
  ];
  for (const [nowMs, kind] of cases) {
    const action = renewalAction(snapshotAt(nowMs), { venuePlan: "founding", nowMs });
    assert.equal(action.kind, kind, `at ${new Date(nowMs).toISOString()}`);
  }
  assert.equal(
    renewalAction(snapshotAt(TERM_START, { paidAt: null }), {
      venuePlan: "founding",
      nowMs: TERM_START,
    }).kind,
    "record_first_payment",
  );
  assert.equal(
    renewalAction(snapshotAt(TERM_START, { termEndsAt: null }), {
      venuePlan: "founding",
      nowMs: TERM_START,
    }).kind,
    "fix_data",
  );

  const notice = renewalAction(snapshotAt(TERM_END - 10 * DAY), {
    venuePlan: "founding",
    nowMs: TERM_END - 10 * DAY,
  });
  assert.match(notice.detail, /by hand/, "the notice is sent by a person, and the worklist says so");
});

/* ── The founding rate is immutable while the agreement renews ───────────── */

test("a held founding lock cannot be renewed onto the standard plan", () => {
  // The defect this closes: append-only rows protect the PAST. Without this
  // check the NEXT term could be recorded as 'paid' at EUR 1,500 with every
  // previous row intact, every amount matching its plan, and the EUR 1,000 lock
  // ended without a lapse ever happening.
  const refusal = planChangeRefusal({
    priorPlan: "founding",
    priorLock: "held",
    nextPlan: "paid",
  });
  assert.ok(refusal, "a held founding lock was silently downgraded");
  assert.match(refusal, /renews continuously without lapse/);
  assert.match(refusal, /Record the lapse first/);
});

test("a renewal on the same plan is never refused", () => {
  assert.equal(
    planChangeRefusal({ priorPlan: "founding", priorLock: "held", nextPlan: "founding" }),
    null,
  );
  assert.equal(
    planChangeRefusal({ priorPlan: "paid", priorLock: "not_applicable", nextPlan: "paid" }),
    null,
  );
});

test("a first term is never refused, because there is no prior plan to change", () => {
  for (const nextPlan of ["founding", "paid"]) {
    assert.equal(
      planChangeRefusal({ priorPlan: null, priorLock: "not_applicable", nextPlan }),
      null,
    );
  }
});

test("moving a standard venue into the Founding 25 is refused as unsettled, not decided", () => {
  const refusal = planChangeRefusal({
    priorPlan: "paid",
    priorLock: "not_applicable",
    nextPlan: "founding",
  });
  assert.ok(refusal);
  assert.match(refusal, /not a settled operation/);
  assert.match(refusal, /founder decision/);
  // It must not invent an answer in either direction.
  assert.doesNotMatch(refusal, /is allowed|is permitted|automatically/i);
});

test("a lapsed founding venue's return is refused and points at the open question", () => {
  const refusal = planChangeRefusal({
    priorPlan: "founding",
    priorLock: "broken_by_lapse",
    nextPlan: "paid",
  });
  assert.ok(refusal);
  assert.match(refusal, /has never been decided/);
  assert.match(refusal, /foundingRateOnReturn/);
});
