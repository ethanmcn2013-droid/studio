import "server-only";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { appendEvent } from "./audit";
import {
  ENTITLEMENT_TIERS,
  entitlements,
  type EntitlementSource,
  type EntitlementTier,
} from "./schema";

/** Reject any tier not in the locked vocabulary at WRITE time, so a
 *  drifted/typo'd tier can never land a paying customer on a row the
 *  resolver ranks below free. */
function assertKnownTier(tier: string): asserts tier is EntitlementTier {
  if (!(ENTITLEMENT_TIERS as readonly string[]).includes(tier)) {
    throw new Error(`writeSharedEntitlement: unknown tier '${tier}'`);
  }
}

const BACKOFFS_MS = [0, 100, 300];
const genId = () => `e-${randomUUID().replace(/-/g, "").slice(0, 16)}`;

export type WriteActor = { actorId?: string | null; actorName?: string | null };

/**
 * Grant/write a shared entitlement, idempotently and atomically with its
 * audit event.
 *
 * - Requires a non-null deterministic `sourceRef` on every write (Stripe:
 *   subscription id; Event: checkout session id; comp/batch/venue: a
 *   deterministic key like `${batch.slug}:${clerkId}`). Closes the
 *   null-source_ref path that had neither app nor DB dedup.
 * - UPSERT via ON CONFLICT DO NOTHING RETURNING: a benign duplicate never
 *   throws a unique violation. On conflict we look up the existing row and
 *   return `{created:false}`. Transient Turso failover still retries.
 * - The insert and the `grant` audit event commit in ONE transaction, so a
 *   state change can never land unaudited.
 */
export async function writeSharedEntitlement(
  input: {
    userClerkId: string;
    tier: EntitlementTier;
    source: EntitlementSource;
    sourceRef: string;
    expiresAtMs?: number | null;
    metadata?: Record<string, unknown> | null;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    billingState?: string | null;
    grantedBy?: string | null;
    grantReason?: string | null;
    batchId?: string | null;
    stripePriceId?: string | null;
    emailHash?: string | null;
    origin?: string | null;
  } & WriteActor,
): Promise<{ id: string; created: boolean }> {
  assertKnownTier(input.tier);
  if (!input.userClerkId) throw new Error("writeSharedEntitlement: userClerkId required");
  if (!input.sourceRef) throw new Error("writeSharedEntitlement: non-null sourceRef required");

  const db = entitlementsDb();
  let lastErr: unknown;
  for (const wait of BACKOFFS_MS) {
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    try {
      return await db.transaction(async (tx) => {
        const id = genId();
        const inserted = await tx
          .insert(entitlements)
          .values({
            id,
            userClerkId: input.userClerkId,
            tier: input.tier,
            source: input.source,
            sourceRef: input.sourceRef,
            expiresAt: input.expiresAtMs ?? null,
            status: "active",
            stripeCustomerId: input.stripeCustomerId ?? null,
            stripeSubscriptionId: input.stripeSubscriptionId ?? null,
            billingState: input.billingState ?? null,
            grantedBy: input.grantedBy ?? input.actorId ?? null,
            grantReason: input.grantReason ?? null,
            batchId: input.batchId ?? null,
            stripePriceId: input.stripePriceId ?? null,
            emailHash: input.emailHash ?? null,
            metadata: input.metadata ? JSON.stringify(input.metadata) : null,
          })
          .onConflictDoNothing()
          .returning({ id: entitlements.id });

        if (inserted[0]) {
          await appendEvent(tx, {
            action: "grant",
            entitlementId: inserted[0].id,
            userClerkId: input.userClerkId,
            batchId: input.batchId ?? null,
            actorId: input.actorId ?? input.grantedBy ?? null,
            actorName: input.actorName ?? null,
            reason: input.grantReason ?? null,
            after: { tier: input.tier, source: input.source, sourceRef: input.sourceRef },
            origin: input.origin ?? null,
          });
          return { id: inserted[0].id, created: true };
        }

        // Conflict: a row with this dedup key already exists. Return it.
        const existing = await tx
          .select({ id: entitlements.id })
          .from(entitlements)
          .where(
            and(
              eq(entitlements.userClerkId, input.userClerkId),
              eq(entitlements.source, input.source),
              eq(entitlements.sourceRef, input.sourceRef),
            ),
          )
          .limit(1);
        return { id: existing[0]?.id ?? id, created: false };
      });
    } catch (err) {
      // onConflictDoNothing means a unique violation never reaches here;
      // anything thrown is a transient failover -> retry.
      lastErr = err;
    }
  }
  throw lastErr;
}

/**
 * Expire an entitlement (natural end, e.g. Stripe subscription.deleted).
 * Guarded WHERE status='active' so a later benign event can never clobber
 * a deliberate 'revoked' back to 'expired'. Writes an expire event.
 */
export async function expireSharedEntitlement(input: {
  stripeSubscriptionId?: string | null;
  sourceRef?: string | null;
  actorId?: string | null;
  origin?: string | null;
}): Promise<void> {
  const db = entitlementsDb();
  const now = Date.now();
  const key = input.stripeSubscriptionId
    ? eq(entitlements.stripeSubscriptionId, input.stripeSubscriptionId)
    : input.sourceRef
      ? eq(entitlements.sourceRef, input.sourceRef)
      : null;
  if (!key) return;

  await db.transaction(async (tx) => {
    const targets = await tx
      .select({ id: entitlements.id })
      .from(entitlements)
      .where(and(key, eq(entitlements.status, "active")));
    if (targets.length === 0) return;
    await tx
      .update(entitlements)
      .set({ expiresAt: now, status: "expired", updatedAt: now })
      .where(and(key, eq(entitlements.status, "active")));
    for (const t of targets) {
      await appendEvent(tx, {
        action: "expire",
        entitlementId: t.id,
        actorId: input.actorId ?? "stripe-webhook",
        origin: input.origin ?? "stripe",
      });
    }
  });
}

/**
 * For-cause revocation, targeting an entitlement id (never a source_ref).
 * Reason is mandatory. Writes a revoke event in the same transaction.
 */
export async function revokeEntitlementById(input: {
  entitlementId: string;
  reason: string;
  actorId?: string | null;
  actorName?: string | null;
  origin?: string | null;
}): Promise<void> {
  if (!input.reason?.trim()) throw new Error("revokeEntitlementById: reason required");
  const db = entitlementsDb();
  const now = Date.now();
  await db.transaction(async (tx) => {
    const rows = await tx
      .select({ id: entitlements.id, userClerkId: entitlements.userClerkId })
      .from(entitlements)
      .where(and(eq(entitlements.id, input.entitlementId), eq(entitlements.status, "active")))
      .limit(1);
    if (rows.length === 0) return;
    await tx
      .update(entitlements)
      .set({ status: "revoked", updatedAt: now })
      .where(eq(entitlements.id, input.entitlementId));
    await appendEvent(tx, {
      action: "revoke",
      entitlementId: input.entitlementId,
      userClerkId: rows[0].userClerkId,
      actorId: input.actorId ?? null,
      actorName: input.actorName ?? null,
      reason: input.reason,
      origin: input.origin ?? "hq",
    });
  });
}
