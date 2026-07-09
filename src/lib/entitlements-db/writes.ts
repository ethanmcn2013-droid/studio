import "server-only";
import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { appendEvent } from "./audit";
import {
  assertBulkAllowed,
  assertVelocity,
  reportAnomaly,
  requireActor,
  type MutationActor,
} from "./guard";
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
    reportAnomaly({ kind: "unknown_tier", detail: `write rejected: tier '${tier}'` });
    throw new Error(`writeSharedEntitlement: unknown tier '${tier}'`);
  }
}

const BACKOFFS_MS = [0, 100, 300];
const genId = () => `e-${randomUUID().replace(/-/g, "").slice(0, 16)}`;

/**
 * Grant/write a shared entitlement, idempotently and atomically with its
 * audit event.
 *
 * - Every write carries an identified `actor` (requireActor) and passes the
 *   per-operator velocity cap — enforced HERE at the writer, so the curl
 *   routes and cron cannot bypass it.
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
export async function writeSharedEntitlement(input: {
  userClerkId: string;
  tier: EntitlementTier;
  source: EntitlementSource;
  sourceRef: string;
  actor: MutationActor;
  expiresAtMs?: number | null;
  metadata?: Record<string, unknown> | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  billingState?: string | null;
  grantReason?: string | null;
  batchId?: string | null;
  stripePriceId?: string | null;
  emailHash?: string | null;
  origin?: string | null;
}): Promise<{ id: string; created: boolean }> {
  assertKnownTier(input.tier);
  if (!input.userClerkId) throw new Error("writeSharedEntitlement: userClerkId required");
  if (!input.sourceRef) throw new Error("writeSharedEntitlement: non-null sourceRef required");
  const actor = requireActor(input.actor);
  await assertVelocity(actor);

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
            grantedBy: actor.actorId,
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
            actorId: actor.actorId,
            actorName: actor.actorName,
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
  actor: MutationActor;
  stripeSubscriptionId?: string | null;
  sourceRef?: string | null;
  origin?: string | null;
}): Promise<void> {
  const actor = requireActor(input.actor);
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
        actorId: actor.actorId,
        actorName: actor.actorName,
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
  actor: MutationActor;
  origin?: string | null;
}): Promise<void> {
  if (!input.reason?.trim()) throw new Error("revokeEntitlementById: reason required");
  const actor = requireActor(input.actor);
  await assertVelocity(actor);
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
      actorId: actor.actorId,
      actorName: actor.actorName,
      reason: input.reason,
      origin: input.origin ?? "hq",
    });
  });
}

export type BulkRevokeResult = { revoked: number; skipped: string[] };

/**
 * Revoke a FROZEN set of entitlement ids in one transaction.
 *
 * The frozen set is the exact id list the operator confirmed at dry-run.
 * Blast-radius controls run first (bulk hard cap, two-person approval,
 * velocity) at the writer layer, so this cannot be bypassed by a route or
 * cron. The commit is drift-guarded: if any frozen row is no longer
 * `active` (someone else changed it since the dry-run), the whole batch is
 * REJECTED rather than partially applied — the operator re-runs the dry-run
 * against the true current set. Reason is mandatory; every row writes its own
 * revoke event in the same transaction.
 */
export async function revokeEntitlementsBulk(input: {
  entitlementIds: string[];
  reason: string;
  actor: MutationActor;
  approvals?: number;
  origin?: string | null;
}): Promise<BulkRevokeResult> {
  if (!input.reason?.trim()) throw new Error("revokeEntitlementsBulk: reason required");
  const frozen = Array.from(new Set(input.entitlementIds.filter(Boolean)));
  if (frozen.length === 0) return { revoked: 0, skipped: [] };
  const actor = requireActor(input.actor);
  assertBulkAllowed(frozen.length, { approvals: input.approvals });
  await assertVelocity(actor, frozen.length);

  const db = entitlementsDb();
  const now = Date.now();
  return db.transaction(async (tx) => {
    const active = await tx
      .select({ id: entitlements.id, userClerkId: entitlements.userClerkId })
      .from(entitlements)
      .where(and(inArray(entitlements.id, frozen), eq(entitlements.status, "active")));

    // Drift guard: the frozen set must still match the active set exactly.
    if (active.length !== frozen.length) {
      const stillActive = new Set(active.map((r) => r.id));
      const drifted = frozen.filter((id) => !stillActive.has(id));
      reportAnomaly({
        kind: "drift",
        actorId: actor.actorId,
        detail: `bulk revoke rejected: ${drifted.length} of ${frozen.length} rows drifted since dry-run`,
      });
      throw new Error(
        `bulk revoke rejected: ${drifted.length} of ${frozen.length} frozen rows are no longer active (drift). Re-run the dry-run.`,
      );
    }

    await tx
      .update(entitlements)
      .set({ status: "revoked", updatedAt: now })
      .where(and(inArray(entitlements.id, frozen), eq(entitlements.status, "active")));

    for (const r of active) {
      await appendEvent(tx, {
        action: "revoke",
        entitlementId: r.id,
        userClerkId: r.userClerkId,
        actorId: actor.actorId,
        actorName: actor.actorName,
        reason: input.reason,
        origin: input.origin ?? "hq",
      });
    }
    return { revoked: active.length, skipped: [] };
  });
}
