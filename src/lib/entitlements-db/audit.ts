import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { desc } from "drizzle-orm";
import { entitlementsDb } from "./client";
import {
  entitlementEvents,
  type EntitlementEventAction,
} from "./schema";

/**
 * Append-only audit ledger writer with a per-row hash-chain.
 *
 * The chain (`prev_hash` -> `row_hash`) is computed over NON-PII fields
 * only. entitlement_events never stores email/ip — those live on
 * entitlements/redemptions and are the only things GDPR crypto-shredding
 * touches — so shredding PII can never break the chain. Callers MUST
 * keep before_json/after_json free of PII (no email, no ip).
 *
 * appendEvent MUST run inside the same libSQL transaction as the state
 * mutation it records (pass the tx), so a state change can never commit
 * without its signed line. The physical append-only guarantee (no
 * UPDATE/DELETE) is enforced by SQLite triggers from migrate-access.mjs.
 */

type Db = ReturnType<typeof entitlementsDb>;
export type EntitlementsTx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export type AuditEventInput = {
  action: EntitlementEventAction;
  entitlementId?: string | null;
  userClerkId?: string | null;
  sponsorId?: string | null;
  batchId?: string | null;
  actorId?: string | null;
  actorName?: string | null;
  reason?: string | null;
  before?: unknown;
  after?: unknown;
  origin?: string | null;
  stripeEventId?: string | null;
};

const GENESIS = "genesis";

function chainHash(payload: Record<string, unknown>): string {
  // Deterministic key order so the same content always hashes the same.
  const ordered = Object.keys(payload)
    .sort()
    .reduce<Record<string, unknown>>((acc, k) => {
      acc[k] = payload[k] ?? null;
      return acc;
    }, {});
  return createHash("sha256").update(JSON.stringify(ordered)).digest("hex");
}

/**
 * Write one audit event inside the caller's transaction. Reads the
 * latest row_hash (within the same tx) to chain onto it, then inserts.
 */
export async function appendEvent(
  tx: EntitlementsTx,
  ev: AuditEventInput,
): Promise<string> {
  const last = await tx
    .select({ rowHash: entitlementEvents.rowHash })
    .from(entitlementEvents)
    .orderBy(desc(entitlementEvents.createdAt), desc(entitlementEvents.id))
    .limit(1);
  const prevHash = last[0]?.rowHash ?? GENESIS;

  const id = `ev-${randomUUID().replace(/-/g, "").slice(0, 18)}`;
  const createdAt = Date.now();
  const beforeJson = ev.before === undefined ? null : JSON.stringify(ev.before);
  const afterJson = ev.after === undefined ? null : JSON.stringify(ev.after);

  // Hash-chain over stable NON-PII fields only.
  const rowHash = chainHash({
    prevHash,
    id,
    entitlementId: ev.entitlementId ?? null,
    userClerkId: ev.userClerkId ?? null,
    sponsorId: ev.sponsorId ?? null,
    batchId: ev.batchId ?? null,
    actorId: ev.actorId ?? null,
    action: ev.action,
    reason: ev.reason ?? null,
    beforeJson,
    afterJson,
    origin: ev.origin ?? null,
    stripeEventId: ev.stripeEventId ?? null,
    createdAt,
  });

  await tx.insert(entitlementEvents).values({
    id,
    entitlementId: ev.entitlementId ?? null,
    userClerkId: ev.userClerkId ?? null,
    sponsorId: ev.sponsorId ?? null,
    batchId: ev.batchId ?? null,
    actorId: ev.actorId ?? null,
    actorName: ev.actorName ?? null,
    action: ev.action,
    reason: ev.reason ?? null,
    beforeJson,
    afterJson,
    origin: ev.origin ?? null,
    prevHash,
    rowHash,
    stripeEventId: ev.stripeEventId ?? null,
    createdAt,
  });

  return id;
}

/**
 * Verify the hash-chain integrity across the whole ledger (operator/CI
 * tool). Returns the first break, or null if intact. Read-only.
 */
export async function verifyLedgerChain(
  limit = 5000,
): Promise<{ ok: boolean; brokenAt?: string }> {
  const db = entitlementsDb();
  const rows = await db
    .select()
    .from(entitlementEvents)
    .orderBy(entitlementEvents.createdAt, entitlementEvents.id)
    .limit(limit);
  let prev = GENESIS;
  for (const r of rows) {
    if (r.prevHash !== prev) return { ok: false, brokenAt: r.id };
    const expect = chainHash({
      prevHash: r.prevHash,
      id: r.id,
      entitlementId: r.entitlementId,
      userClerkId: r.userClerkId,
      sponsorId: r.sponsorId,
      batchId: r.batchId,
      actorId: r.actorId,
      action: r.action,
      reason: r.reason,
      beforeJson: r.beforeJson,
      afterJson: r.afterJson,
      origin: r.origin,
      stripeEventId: r.stripeEventId,
      createdAt: r.createdAt,
    });
    if (expect !== r.rowHash) return { ok: false, brokenAt: r.id };
    prev = r.rowHash ?? GENESIS;
  }
  return { ok: true };
}
