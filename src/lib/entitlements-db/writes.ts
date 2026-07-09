import "server-only";
import { randomUUID } from "node:crypto";
import { and, desc, eq, inArray } from "drizzle-orm";
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

/**
 * Move a subscription into dunning: mark past_due AND hold expires_at forward
 * to grace_until, so the resolver keeps the user's access alive through the
 * retry window (invoice.payment_failed). Never shortens an existing expiry.
 * The resolver is unchanged — this only pushes the clock. Reinstated to
 * `active` billing on the next invoice.paid via upsertSubscriptionEntitlement.
 */
export async function markSubscriptionPastDue(input: {
  stripeSubscriptionId: string;
  graceUntilMs: number;
  actor: MutationActor;
  origin?: string | null;
}): Promise<void> {
  if (!input.stripeSubscriptionId) {
    throw new Error("markSubscriptionPastDue: stripeSubscriptionId required");
  }
  const actor = requireActor(input.actor);
  const db = entitlementsDb();
  const now = Date.now();
  await db.transaction(async (tx) => {
    const rows = await tx
      .select({ id: entitlements.id, expiresAt: entitlements.expiresAt })
      .from(entitlements)
      .where(
        and(
          eq(entitlements.stripeSubscriptionId, input.stripeSubscriptionId),
          eq(entitlements.status, "active"),
        ),
      );
    for (const r of rows) {
      const held = Math.max(input.graceUntilMs, r.expiresAt ?? 0);
      await tx
        .update(entitlements)
        .set({
          billingState: "past_due",
          graceUntil: input.graceUntilMs,
          expiresAt: held,
          updatedAt: now,
        })
        .where(eq(entitlements.id, r.id));
      await appendEvent(tx, {
        action: "extend",
        entitlementId: r.id,
        actorId: actor.actorId,
        actorName: actor.actorName,
        reason: "past_due grace",
        before: { expiresAt: r.expiresAt },
        after: { billingState: "past_due", graceUntil: input.graceUntilMs, expiresAt: held },
        origin: input.origin ?? "stripe",
      });
    }
  });
}

/**
 * UPSERT an entitlement keyed on stripe_subscription_id, so a plan change
 * (customer.subscription.updated / invoice.paid) mutates the ONE existing row
 * in place instead of racing a second active row past the dedup index. If no
 * row exists for the subscription, it inserts a fresh active one. Tier is
 * re-validated on every call. Idempotent and order-independent: the webhook
 * can replay events safely.
 */
export async function upsertSubscriptionEntitlement(input: {
  userClerkId: string;
  stripeSubscriptionId: string;
  tier: EntitlementTier;
  source: EntitlementSource;
  actor: MutationActor;
  sourceRef?: string | null;
  expiresAtMs?: number | null;
  billingState?: string | null;
  stripePriceId?: string | null;
  stripeCustomerId?: string | null;
  origin?: string | null;
}): Promise<{ id: string; created: boolean }> {
  assertKnownTier(input.tier);
  if (!input.userClerkId) throw new Error("upsertSubscriptionEntitlement: userClerkId required");
  if (!input.stripeSubscriptionId) {
    throw new Error("upsertSubscriptionEntitlement: stripeSubscriptionId required");
  }
  const actor = requireActor(input.actor);
  await assertVelocity(actor);
  const db = entitlementsDb();
  const now = Date.now();

  return db.transaction(async (tx) => {
    const existing = await tx
      .select({
        id: entitlements.id,
        tier: entitlements.tier,
        expiresAt: entitlements.expiresAt,
        billingState: entitlements.billingState,
        stripePriceId: entitlements.stripePriceId,
        stripeCustomerId: entitlements.stripeCustomerId,
      })
      .from(entitlements)
      .where(eq(entitlements.stripeSubscriptionId, input.stripeSubscriptionId))
      .orderBy(desc(entitlements.createdAt))
      .limit(1);

    if (existing[0]) {
      const prev = existing[0];
      const nextExpiry = input.expiresAtMs ?? prev.expiresAt;
      const nextBilling = input.billingState ?? prev.billingState ?? "active";
      await tx
        .update(entitlements)
        .set({
          tier: input.tier,
          source: input.source,
          status: "active",
          expiresAt: nextExpiry,
          billingState: nextBilling,
          stripePriceId: input.stripePriceId ?? prev.stripePriceId,
          stripeCustomerId: input.stripeCustomerId ?? prev.stripeCustomerId,
          updatedAt: now,
        })
        .where(eq(entitlements.id, prev.id));
      await appendEvent(tx, {
        action: "extend",
        entitlementId: prev.id,
        userClerkId: input.userClerkId,
        actorId: actor.actorId,
        actorName: actor.actorName,
        reason: "subscription update",
        before: { tier: prev.tier, expiresAt: prev.expiresAt, billingState: prev.billingState },
        after: { tier: input.tier, expiresAt: nextExpiry, billingState: nextBilling },
        origin: input.origin ?? "stripe",
      });
      return { id: prev.id, created: false };
    }

    const id = genId();
    await tx.insert(entitlements).values({
      id,
      userClerkId: input.userClerkId,
      tier: input.tier,
      source: input.source,
      sourceRef: input.sourceRef ?? input.stripeSubscriptionId,
      expiresAt: input.expiresAtMs ?? null,
      status: "active",
      billingState: input.billingState ?? "active",
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripeCustomerId: input.stripeCustomerId ?? null,
      stripePriceId: input.stripePriceId ?? null,
      grantedBy: actor.actorId,
    });
    await appendEvent(tx, {
      action: "grant",
      entitlementId: id,
      userClerkId: input.userClerkId,
      actorId: actor.actorId,
      actorName: actor.actorName,
      reason: input.origin ?? "subscription",
      after: { tier: input.tier, source: input.source },
      origin: input.origin ?? "stripe",
    });
    return { id, created: true };
  });
}

/**
 * Re-point access after an account merge: move a person's ACTIVE entitlement
 * rows from a stranded (dead) Clerk id to their live id, and mark any rows
 * left behind on the dead id as such. Every move is one `repoint` event. The
 * historical (expired/revoked) rows stay under the dead id as the audit
 * skeleton; only live access follows the person.
 */
export async function repointAccess(input: {
  fromClerkId: string;
  toClerkId: string;
  reason: string;
  actor: MutationActor;
  origin?: string | null;
}): Promise<{ moved: number }> {
  const from = input.fromClerkId?.trim();
  const to = input.toClerkId?.trim();
  if (!from || !to) throw new Error("repointAccess: both from and to ids required");
  if (from === to) throw new Error("repointAccess: from and to are the same id");
  if (!input.reason?.trim()) throw new Error("repointAccess: reason required");
  const actor = requireActor(input.actor);
  await assertVelocity(actor);
  const db = entitlementsDb();
  const now = Date.now();

  return db.transaction(async (tx) => {
    const active = await tx
      .select({ id: entitlements.id })
      .from(entitlements)
      .where(and(eq(entitlements.userClerkId, from), eq(entitlements.status, "active")));
    if (active.length === 0) return { moved: 0 };

    await tx
      .update(entitlements)
      .set({ userClerkId: to, clerkIdDead: null, updatedAt: now })
      .where(and(eq(entitlements.userClerkId, from), eq(entitlements.status, "active")));

    // Mark whatever remains under the dead id (history) as stranded.
    await tx
      .update(entitlements)
      .set({ clerkIdDead: 1, updatedAt: now })
      .where(eq(entitlements.userClerkId, from));

    for (const r of active) {
      await appendEvent(tx, {
        action: "repoint",
        entitlementId: r.id,
        userClerkId: to,
        actorId: actor.actorId,
        actorName: actor.actorName,
        reason: input.reason,
        before: { userClerkId: from },
        after: { userClerkId: to },
        origin: input.origin ?? "hq",
      });
    }
    return { moved: active.length };
  });
}

/**
 * Record a `view_as` audit event. The console's read-only "view as" surface
 * is not a mutation, but looking at a person's access IS an accountable act,
 * so it leaves a ledger line. No state changes.
 */
export async function recordViewAs(input: {
  userClerkId: string;
  actor: MutationActor;
  origin?: string | null;
}): Promise<void> {
  const actor = requireActor(input.actor);
  if (!input.userClerkId) return;
  const db = entitlementsDb();
  await db.transaction(async (tx) => {
    await appendEvent(tx, {
      action: "view_as",
      userClerkId: input.userClerkId,
      actorId: actor.actorId,
      actorName: actor.actorName,
      reason: "read-only view",
      origin: input.origin ?? "hq",
    });
  });
}

/**
 * Record an `export` audit event when an operator exports a filtered roster
 * view. Exports move PII-adjacent data off-system, so they are logged. The
 * ledger line records the row count and filter, never the exported PII.
 */
export async function recordExport(input: {
  actor: MutationActor;
  rowCount: number;
  format: string;
  filterSummary?: string | null;
  origin?: string | null;
}): Promise<void> {
  const actor = requireActor(input.actor);
  const db = entitlementsDb();
  await db.transaction(async (tx) => {
    await appendEvent(tx, {
      action: "export",
      actorId: actor.actorId,
      actorName: actor.actorName,
      reason: `roster export (${input.format}, ${input.rowCount} rows)`,
      after: { rowCount: input.rowCount, format: input.format, filter: input.filterSummary ?? null },
      origin: input.origin ?? "hq",
    });
  });
}
