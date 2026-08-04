import "server-only";
import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { appendEvent } from "./audit";
import { requireActor, type MutationActor } from "./guard";
import { sponsorPriceAgreements, sponsors } from "./schema";
import { assignFoundingNumber, type AssignResult } from "./founding-numbers";
import {
  annualTermEndsAtMs,
  deriveVenueBillingState,
  foundingLockState,
  latestPriceAgreement,
  planChangeRefusal,
  prepaymentRefusal,
  priceAgreementAt,
  proposedRenewalPolicy,
  renewalAction,
  type FoundingLockState,
  type PriceAgreementRecord,
  type RenewalAction,
  type RenewalPolicy,
  type VenueBillingSnapshot,
} from "@/lib/venue-billing";
import {
  vatInclusive,
  vatInclusiveFromRecord,
  type VatInclusiveAmount,
} from "@/lib/venue-money";
import { venueEditionAnnualAmountCents, type VenueEditionPlan } from "@/lib/venue-edition";
import { formatFoundingNumber } from "@/lib/venue-founding-number";

/**
 * The annual prepaid cash ledger for Venue Edition — E08.01, E08.02, E08.03.
 *
 * ── What this is, stated plainly ──────────────────────────────────────────
 *
 * **There is no payment provider for venues.** Stripe carries the workspace,
 * studio, wedding and event tiers and has no venue price id; the venue webhook
 * path does not exist and no invoice, dunning or renewal-billing code exists in
 * either repository. Venue money is invoiced out of band and the cleared
 * payment is recorded here. That is the process, and nothing in this module or
 * anything reading it may present it as automatic.
 *
 * This module is therefore the *system of record for money received*, not a
 * payments product. `recordedVia` is where a future provider becomes visible.
 *
 * ── The two things it makes impossible ────────────────────────────────────
 *
 * 1. **Recording the wrong plan's price.** `prepaymentRefusal` refuses a
 *    standard amount against a founding agreement and the reverse. That defect
 *    shipped once (I-002) and would have put every founding venue into the cash
 *    ledger at EUR 1,500 against EUR 1,000 actually received.
 *
 * 2. **Losing a historical price to a price change.** Every term is its own
 *    append-only row. Changing the constants tomorrow cannot reach a term that
 *    has already been paid for.
 */

const genId = (prefix: string) =>
  `${prefix}-${randomUUID().replace(/-/g, "").slice(0, 18)}`;

/** The basis string stamped on every agreement written by this code path. */
export const CURRENT_PRICE_BASIS =
  "D-009 · D-021 · contracts/commercial-terms.v2.json";

export type RecordPrepaymentInput = {
  /** Either is accepted; the slug is what an operator has to hand. */
  sponsorId?: string | null;
  sponsorSlug?: string | null;
  venuePlan: "founding" | "paid";
  /** What actually landed, in cents. Must equal the plan's ratified amount. */
  amountReceivedCents: number;
  /** The instant the payment CLEARED. Not the invoice date, not signature. */
  paidAtMs: number;
  /** Defaults to `paidAtMs`. */
  termStartsAtMs?: number | null;
  /**
   * The VAT rate applied to this payment, in basis points, or null when the
   * treatment has not been determined. **Null is the honest default.** Whether
   * Signal Studio is an accountable person is unconfirmed and the Revenue
   * submission is unfiled (R-014, R-018, R-022).
   */
  vatRateBasisPoints?: number | null;
  actor: MutationActor;
  recordedVia: string;
  note?: string | null;
  origin?: string | null;
};

export type RecordPrepaymentResult =
  | {
      state: "recorded";
      sponsorId: string;
      agreementId: string;
      amount: VatInclusiveAmount;
      termStartsAtMs: number;
      termEndsAtMs: number;
      /** Present only for a founding agreement. */
      foundingNumber?: { state: AssignResult["state"]; label: string | null };
    }
  | { state: "already_recorded"; sponsorId: string; agreementId: string }
  | { state: "refused"; reason: string };

/**
 * Record one cleared annual prepayment.
 *
 * Order of operations, and it matters:
 *
 *   1. One transaction writes the append-only price agreement, refreshes the
 *      `sponsors` cache columns, and appends the signed audit line. Either all
 *      three land or none do.
 *   2. **Then** the founding number is assigned, outside that transaction,
 *      because `assignFoundingNumber` runs its own. Payment is recorded first
 *      so a failure between the two leaves a paid venue without a number
 *      (recoverable, and the assigner is idempotent) rather than a numbered
 *      venue without a payment (which is the thing D-009 point 6 forbids).
 *
 * Closing this gap is the point: before this existed, the only writer that
 * recorded a cleared payment never called the assigner at all, so a venue could
 * be marked paid and hold no founding number.
 */
export async function recordAnnualPrepayment(
  input: RecordPrepaymentInput,
): Promise<RecordPrepaymentResult> {
  const actor = requireActor(input.actor);
  const recordedVia = input.recordedVia?.trim();
  if (!recordedVia) {
    return {
      state: "refused",
      reason: "recordedVia is required — how the money was taken is part of the record",
    };
  }

  const db = entitlementsDb();
  const key = input.sponsorId
    ? eq(sponsors.id, input.sponsorId)
    : input.sponsorSlug
      ? eq(sponsors.slug, input.sponsorSlug)
      : null;
  if (!key) {
    return { state: "refused", reason: "a sponsorId or sponsorSlug is required" };
  }

  const [sponsor] = await db
    .select({
      id: sponsors.id,
      slug: sponsors.slug,
      venuePlan: sponsors.venuePlan,
      paidAt: sponsors.paidAt,
      termEndsAt: sponsors.termEndsAt,
    })
    .from(sponsors)
    .where(key)
    .limit(1);
  if (!sponsor) {
    return {
      state: "refused",
      reason: `no sponsor '${input.sponsorId ?? input.sponsorSlug}'`,
    };
  }

  const termStartsAtMs = input.termStartsAtMs ?? input.paidAtMs;
  const refusal = prepaymentRefusal({
    venuePlan: input.venuePlan,
    amountReceivedCents: input.amountReceivedCents,
    paidAtMs: input.paidAtMs,
    termStartsAtMs,
  });
  if (refusal) return { state: "refused", reason: refusal };

  // The founding rate is immutable while the agreement renews continuously
  // (D-009 point 3). Append-only rows protect the past; this protects the next
  // term. Without it a held EUR 1,000 lock could be renewed as a EUR 1,500
  // standard term with every previous row intact and no lapse on record.
  const priorHistory = await priceAgreementHistory(sponsor.id);
  const prior = latestPriceAgreement(priorHistory);
  if (prior) {
    const priorBilling = deriveVenueBillingState({
      venuePlan: prior.venuePlan,
      paidAt: sponsor.paidAt,
      termEndsAt: sponsor.termEndsAt,
      nowMs: input.paidAtMs,
    });
    const planRefusal = planChangeRefusal({
      priorPlan: prior.venuePlan,
      priorLock: foundingLockState({
        venuePlan: prior.venuePlan,
        billingState: priorBilling.state,
      }),
      nextPlan: input.venuePlan,
    });
    if (planRefusal) return { state: "refused", reason: planRefusal };
  }

  const termEndsAtMs = annualTermEndsAtMs(termStartsAtMs);
  // Gross comes from the plan, never from the caller. The caller's number is
  // checked against it above and then discarded, so an operator typo cannot
  // become the price of record.
  const gross = venueEditionAnnualAmountCents(input.venuePlan as VenueEditionPlan) as number;
  const amount = vatInclusive({
    grossCents: gross,
    vatRateBasisPoints: input.vatRateBasisPoints ?? null,
  });

  // A term already recorded for this exact start is the same payment arriving
  // twice, not a second term. The UNIQUE index is the real guarantee; this
  // check turns the resulting error into a clear answer.
  const [existing] = await db
    .select({ id: sponsorPriceAgreements.id })
    .from(sponsorPriceAgreements)
    .where(
      and(
        eq(sponsorPriceAgreements.sponsorId, sponsor.id),
        eq(sponsorPriceAgreements.effectiveFrom, termStartsAtMs),
      ),
    )
    .limit(1);
  if (existing) {
    return { state: "already_recorded", sponsorId: sponsor.id, agreementId: existing.id };
  }

  const agreementId = genId("pa");
  const founding = input.venuePlan === "founding";
  const now = Date.now();

  await db.transaction(async (tx) => {
    await tx.insert(sponsorPriceAgreements).values({
      id: agreementId,
      sponsorId: sponsor.id,
      venuePlan: input.venuePlan,
      grossAmountCents: amount.grossCents,
      amountReceivedCents: input.amountReceivedCents,
      vatBasis: "inclusive",
      vatRateBasisPoints: amount.vatRateBasisPoints,
      netAmountCents: amount.netCents,
      vatAmountCents: amount.vatCents,
      foundingLocked: founding ? 1 : 0,
      priceBasis: CURRENT_PRICE_BASIS,
      effectiveFrom: termStartsAtMs,
      effectiveTo: termEndsAtMs,
      paidAt: input.paidAtMs,
      recordedBy: actor.actorId,
      recordedVia,
      note: input.note?.trim() || null,
      createdAt: now,
    });

    // The sponsors row is a cache of the latest agreement, kept because HQ
    // Traction and the portal read it. It is refreshed here, never treated as
    // the record.
    await tx
      .update(sponsors)
      .set({
        venuePlan: input.venuePlan,
        annualAmountCents: amount.grossCents,
        foundingLocked: founding ? 1 : null,
        termStartsAt: termStartsAtMs,
        termEndsAt: termEndsAtMs,
        paidAt: input.paidAtMs,
        updatedAt: now,
      })
      .where(eq(sponsors.id, sponsor.id));

    await appendEvent(tx, {
      action: "grant",
      sponsorId: sponsor.id,
      actorId: actor.actorId,
      actorName: actor.actorName,
      reason: `annual prepaid term recorded: ${input.venuePlan}, EUR ${
        amount.grossCents / 100
      } inclusive of VAT at the prevailing rate, via ${recordedVia}`,
      before: { termStartsAt: null, termEndsAt: null },
      after: {
        agreementId,
        venuePlan: input.venuePlan,
        grossAmountCents: amount.grossCents,
        vatRateBasisPoints: amount.vatRateBasisPoints,
        effectiveFrom: termStartsAtMs,
        effectiveTo: termEndsAtMs,
      },
      origin: input.origin ?? "venue-billing",
    });
  });

  const result: RecordPrepaymentResult = {
    state: "recorded",
    sponsorId: sponsor.id,
    agreementId,
    amount,
    termStartsAtMs,
    termEndsAtMs,
  };

  if (!founding) return result;

  // D-009 point 6: the number is assigned on cleared payment. This is the call
  // that was missing.
  const assigned = await assignFoundingNumber({
    sponsorId: sponsor.id,
    actor,
    origin: input.origin ?? "venue-billing",
  });
  return {
    ...result,
    foundingNumber: {
      state: assigned.state,
      label:
        assigned.state === "assigned" || assigned.state === "already_assigned"
          ? assigned.label
          : null,
    },
  };
}

/* ── Reads ───────────────────────────────────────────────────────────────── */

export type PriceAgreementRow = PriceAgreementRecord & {
  vatBasis: string;
  priceBasis: string;
  recordedBy: string;
  recordedVia: string;
  note: string | null;
  createdAt: number;
};

function toRecord(row: typeof sponsorPriceAgreements.$inferSelect): PriceAgreementRow {
  return {
    id: row.id,
    sponsorId: row.sponsorId,
    venuePlan: row.venuePlan,
    grossAmountCents: row.grossAmountCents,
    amountReceivedCents: row.amountReceivedCents,
    vatRateBasisPoints: row.vatRateBasisPoints,
    foundingLocked: row.foundingLocked === 1,
    effectiveFrom: row.effectiveFrom,
    effectiveTo: row.effectiveTo,
    paidAt: row.paidAt,
    vatBasis: row.vatBasis,
    priceBasis: row.priceBasis,
    recordedBy: row.recordedBy,
    recordedVia: row.recordedVia,
    note: row.note,
    createdAt: row.createdAt,
  };
}

/** Every term this venue has ever paid for, oldest first. */
export async function priceAgreementHistory(
  sponsorId: string,
): Promise<PriceAgreementRow[]> {
  const db = entitlementsDb();
  const rows = await db
    .select()
    .from(sponsorPriceAgreements)
    .where(eq(sponsorPriceAgreements.sponsorId, sponsorId))
    .orderBy(sponsorPriceAgreements.effectiveFrom);
  return rows.map(toRecord);
}

/**
 * What this venue was charged for the term covering `atMs`.
 *
 * This is the function E08.02 turns on: it reads the term's own record, so a
 * venue that joined at EUR 1,000 still reads EUR 1,000 after the standard price
 * moves, and each past term keeps the amount it was actually charged.
 */
export async function priceOnDate(
  sponsorId: string,
  atMs: number,
): Promise<{ agreement: PriceAgreementRow; amount: VatInclusiveAmount } | null> {
  const history = await priceAgreementHistory(sponsorId);
  const agreement = priceAgreementAt(history, atMs);
  if (!agreement) return null;
  return { agreement, amount: vatInclusiveFromRecord(agreement) };
}

/** The most recent term, or null when the venue has never paid. */
export async function currentPriceAgreement(
  sponsorId: string,
): Promise<{ agreement: PriceAgreementRow; amount: VatInclusiveAmount } | null> {
  const history = await priceAgreementHistory(sponsorId);
  const agreement = latestPriceAgreement(history);
  if (!agreement) return null;
  return { agreement, amount: vatInclusiveFromRecord(agreement) };
}

export type VenueBillingView = {
  sponsorId: string;
  slug: string;
  name: string;
  venuePlan: string;
  billing: VenueBillingSnapshot;
  foundingLock: FoundingLockState;
  foundingNumberLabel: string | null;
  action: RenewalAction;
  /** The current term's amount, or null when there is no recorded term. */
  amount: VatInclusiveAmount | null;
};

/**
 * The operator worklist. Every paying venue with its derived state and the one
 * thing to do about it.
 *
 * Nothing here fires an email, raises an invoice or takes a payment. There is
 * no sender wired in this repository at all: `renewal-upcoming.tsx` and
 * `payment-failed.tsx` are finished, registered, render-tested templates with
 * no delivery path. The runbook at
 * `docs/strategy/VENUE_RENEWAL_AND_LAPSE_RUNBOOK.md` is how they are sent.
 */
export async function venueRenewalWorklist(options?: {
  nowMs?: number;
  policy?: RenewalPolicy;
}): Promise<VenueBillingView[]> {
  const nowMs = options?.nowMs ?? Date.now();
  const policy = options?.policy ?? proposedRenewalPolicy();
  const db = entitlementsDb();
  const rows = await db
    .select({
      id: sponsors.id,
      slug: sponsors.slug,
      name: sponsors.name,
      venuePlan: sponsors.venuePlan,
      paidAt: sponsors.paidAt,
      termEndsAt: sponsors.termEndsAt,
      foundingNumber: sponsors.foundingNumber,
    })
    .from(sponsors)
    .where(inArray(sponsors.venuePlan, ["founding", "paid"]));

  const views: VenueBillingView[] = [];
  for (const row of rows) {
    const billing = deriveVenueBillingState({
      venuePlan: row.venuePlan,
      paidAt: row.paidAt,
      termEndsAt: row.termEndsAt,
      nowMs,
      policy,
    });
    const current = await currentPriceAgreement(row.id);
    views.push({
      sponsorId: row.id,
      slug: row.slug,
      name: row.name,
      venuePlan: row.venuePlan,
      billing,
      foundingLock: foundingLockState({
        venuePlan: row.venuePlan,
        billingState: billing.state,
      }),
      foundingNumberLabel: formatFoundingNumber(row.foundingNumber),
      action: renewalAction(billing, { venuePlan: row.venuePlan, nowMs }),
      amount: current?.amount ?? null,
    });
  }
  return views;
}

/* ── Lapse ───────────────────────────────────────────────────────────────── */

export type LapseResult =
  | {
      state: "recorded";
      sponsorId: string;
      foundingNumberKept: string | null;
      foundingLock: FoundingLockState;
    }
  | { state: "refused"; reason: string };

/**
 * Record that an agreement has lapsed.
 *
 * **What this deliberately does not touch.** It does not write to
 * `entitlements`, it does not shorten any `expires_at`, and it does not
 * withdraw a founding number.
 *
 * The first two are D-020 point 2, which Signal Studio states unprompted in the
 * outreach email and the agreement: a workspace already redeemed keeps its full
 * term plus Keepsake whatever happens to the licence, and only new issuance
 * stops. A lapse writer that reached into entitlements would be the mechanism
 * for the worst outcome this product can produce.
 *
 * The third is E02.10: a lapsed venue keeps its number and its place shows as
 * closed. Only a reversed payment withdraws one, through
 * `withdrawFoundingNumber`.
 */
export async function recordVenueLapse(input: {
  sponsorId: string;
  reason: string;
  actor: MutationActor;
  nowMs?: number;
  policy?: RenewalPolicy;
  origin?: string | null;
}): Promise<LapseResult> {
  const actor = requireActor(input.actor);
  const reason = input.reason?.trim();
  if (!reason) {
    return {
      state: "refused",
      reason: "a reason is required — a lapse is a commercial event and the venue is told",
    };
  }
  const nowMs = input.nowMs ?? Date.now();
  const db = entitlementsDb();

  const [sponsor] = await db
    .select({
      id: sponsors.id,
      venuePlan: sponsors.venuePlan,
      paidAt: sponsors.paidAt,
      termEndsAt: sponsors.termEndsAt,
      foundingNumber: sponsors.foundingNumber,
    })
    .from(sponsors)
    .where(eq(sponsors.id, input.sponsorId))
    .limit(1);
  if (!sponsor) return { state: "refused", reason: `no sponsor '${input.sponsorId}'` };

  const billing = deriveVenueBillingState({
    venuePlan: sponsor.venuePlan,
    paidAt: sponsor.paidAt,
    termEndsAt: sponsor.termEndsAt,
    nowMs,
    policy: input.policy ?? proposedRenewalPolicy(),
  });
  if (billing.state !== "lapsed") {
    return {
      state: "refused",
      reason: `this agreement is '${billing.state}', not lapsed. A lapse is derived from the term and the grace window, never declared by hand.`,
    };
  }

  await db.transaction(async (tx) => {
    await appendEvent(tx, {
      action: "expire",
      sponsorId: sponsor.id,
      actorId: actor.actorId,
      actorName: actor.actorName,
      reason: `venue agreement lapsed: ${reason}. New issuance stops. Every redeemed couple workspace keeps its full term plus Keepsake (D-020 point 2). The founding number is kept and its place shows as closed (E02.10).`,
      before: { foundingLock: "held" },
      after: {
        foundingLock: foundingLockState({
          venuePlan: sponsor.venuePlan,
          billingState: "lapsed",
        }),
        foundingNumber: sponsor.foundingNumber,
        entitlementsTouched: 0,
      },
      origin: input.origin ?? "venue-billing",
    });
  });

  return {
    state: "recorded",
    sponsorId: sponsor.id,
    foundingNumberKept: formatFoundingNumber(sponsor.foundingNumber),
    foundingLock: foundingLockState({
      venuePlan: sponsor.venuePlan,
      billingState: "lapsed",
    }),
  };
}
