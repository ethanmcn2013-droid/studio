import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import type { entitlementsDb } from "./client-core";
import type { db } from "../db";
import { sponsors, entitlementEvents } from "./schema";
import { sponsors as studioSponsors } from "../db/schema";
import { appendEvent } from "./audit-core";
import { parseRoster, resolveOperator } from "./pure";
import { venueEditionAnnualAmountCents } from "../venue-edition";
import { VENUE_PAYMENT_FIELDS as financialFields } from "./venue-payment-proof";

export type VenuePaymentInput = {
  slug: string;
  plan: "founding" | "paid";
  /** An opaque reference to retained cleared-payment evidence, never bank details. */
  reference: string;
  paidAt: number;
  amountCents: number;
  actorId: string;
  actorName: string;
};

type Stores = { shared: ReturnType<typeof entitlementsDb>; studio: typeof db };
const YEAR = 365 * 24 * 60 * 60 * 1000;

export class VenuePaymentMirrorError extends Error {
  constructor(cause: unknown) {
    super("Shared payment is recorded; Studio mirror is incomplete. Retry with exactly the same payment reference, time, amount and plan.", { cause });
    this.name = "VenuePaymentMirrorError";
  }
}

/**
 * Shared payment + audit commit together. Studio is a repairable mirror.
 * No distributed transaction is claimed. The evidence key and original term
 * survive an interrupted run; a retry never invents a new payment time.
 * Uses existing sponsors and entitlement_events columns, with no migration.
 */
export async function recordVenuePayment(input: VenuePaymentInput, stores: Stores) {
  const slug = input.slug.trim();
  const reference = input.reference.trim();
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) throw new Error("A sponsor slug is required.");
  if (!/^[A-Za-z0-9][A-Za-z0-9._:/-]{2,159}$/.test(reference)) {
    throw new Error("Use an opaque payment evidence reference (3–160 characters), without personal or bank details.");
  }
  if (input.plan !== "founding" && input.plan !== "paid") throw new Error("Payment plan must be founding or paid.");
  const amount = venueEditionAnnualAmountCents(input.plan);
  if (!Number.isSafeInteger(input.amountCents) || input.amountCents !== amount) {
    throw new Error("Cleared amount must match the retained VAT-inclusive annual price: 100000 cents Founding or 150000 cents standard.");
  }
  if (!Number.isSafeInteger(input.paidAt) || input.paidAt <= 0 || input.paidAt > Date.now()) {
    throw new Error("Payment time must be the actual cleared time, not a future date.");
  }
  const actor = resolveOperator(
    { id: input.actorId, name: input.actorName }, parseRoster(process.env.SIGNAL_HQ_OPERATORS),
  );
  if (!actor.ok) throw new Error(actor.reason);
  const evidenceKey = `venue-payment:${createHash("sha256").update(reference).digest("hex")}`;
  const ledger = {
    venuePlan: input.plan,
    annualAmountCents: input.amountCents,
    foundingLocked: input.plan === "founding" ? 1 : null,
    termStartsAt: input.paidAt,
    termEndsAt: input.paidAt + YEAR,
    paidAt: input.paidAt,
  };
  const evidence = { version: 1, slug, evidenceKey, ...ledger };

  const [local] = await stores.studio.select({ id: studioSponsors.id })
    .from(studioSponsors).where(eq(studioSponsors.slug, slug)).limit(1);
  if (!local) throw new Error("Studio sponsor is missing. Reconcile sponsor provisioning before recording payment.");

  const result = await stores.shared.transaction(async (tx) => {
    const [venue] = await tx.select().from(sponsors).where(eq(sponsors.slug, slug)).limit(1);
    if (!venue || venue.kind !== "venue") throw new Error("Shared venue sponsor is missing.");
    const [previous] = await tx.select().from(entitlementEvents)
      .where(eq(entitlementEvents.origin, evidenceKey)).limit(1);
    if (previous) {
      if (previous.action !== "venue_payment" || previous.sponsorId !== venue.id ||
          previous.afterJson !== JSON.stringify(evidence)) {
        throw new Error("Payment reference already belongs to different evidence. Reconcile it; do not reuse or replace the reference.");
      }
      if (!financialFields.every((key) => venue[key] === ledger[key])) {
        throw new Error("Payment has been superseded or changed. An old receipt cannot overwrite the current ledger.");
      }
      return { replayed: true, eventId: previous.id, sponsorId: venue.id };
    }
    if (venue.paidAt != null && venue.paidAt >= input.paidAt) {
      throw new Error("Payment is not newer than the recorded payment. Use the original evidence for retry, or reconcile legacy payment history.");
    }
    if (venue.foundingLocked && venue.paidAt != null &&
        venue.termEndsAt != null && venue.termEndsAt >= input.paidAt && input.plan !== "founding") {
      throw new Error("A continuously renewed Founding agreement retains its Founding rate.");
    }
    if (venue.paidAt != null && (venue.termEndsAt == null || venue.termEndsAt > input.paidAt)) {
      throw new Error("Existing annual term needs reconciliation. Early renewal or missing legacy term cannot be overwritten by this command.");
    }
    await tx.update(sponsors).set({ ...ledger, updatedAt: Date.now() }).where(eq(sponsors.id, venue.id));
    const eventId = await appendEvent(tx, {
      action: "venue_payment", sponsorId: venue.id,
      actorId: actor.id, actorName: actor.name,
      reason: "Operator verified cleared annual payment against retained evidence",
      before: Object.fromEntries(financialFields.map((key) => [key, venue[key]])),
      after: evidence, origin: evidenceKey,
    });
    return { replayed: false, eventId, sponsorId: venue.id };
  });

  try {
    // Hold the shared write transaction while repairing the mirror so a newer
    // payment cannot race an older retry into restoring the previous term.
    await stores.shared.transaction(async (tx) => {
      const [current] = await tx.select().from(sponsors).where(eq(sponsors.id, result.sponsorId)).limit(1);
      if (!current || !financialFields.every((key) => current[key] === ledger[key])) {
        throw new Error("Shared ledger changed before mirror repair; review the latest payment.");
      }
      await stores.studio.transaction(async (mirror) => {
        const [row] = await mirror.select().from(studioSponsors).where(eq(studioSponsors.id, local.id)).limit(1);
        if (!row || row.slug !== slug) throw new Error("Studio sponsor disappeared before mirror repair.");
        if (row.paidAt != null && row.paidAt > input.paidAt) throw new Error("Studio contains a newer payment; reconcile before repair.");
        if (financialFields.every((key) => row[key] === ledger[key])) return;
        const updated = await mirror.update(studioSponsors).set({ ...ledger, updatedAt: Date.now() })
          .where(eq(studioSponsors.id, local.id)).returning({ id: studioSponsors.id });
        if (updated.length !== 1) throw new Error("Studio mirror did not update exactly one sponsor.");
      });
    });
  } catch (error) {
    throw new VenuePaymentMirrorError(error);
  }
  return { ...result, paidAt: input.paidAt, termEndsAt: ledger.termEndsAt, mirror: "complete" as const };
}
