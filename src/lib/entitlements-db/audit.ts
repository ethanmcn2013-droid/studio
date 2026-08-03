import "server-only";
import { randomUUID } from "node:crypto";
import { desc } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { GENESIS, rowHashOf, verifyChainRows } from "./pure";
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
 * without its signed line.
 *
 * PHYSICAL APPEND-ONLY IS A PROPERTY OF THE DATABASE, NOT OF THIS FILE.
 * This header used to state that no UPDATE or DELETE is possible because
 * `migrate-access.mjs` installs SQLite triggers. That was true of the one
 * database that script was run against by hand, and false everywhere else:
 * the 2026-07-31 reset regenerated `drizzle-entitlements/0000_init.sql` from
 * `schema.ts` with drizzle-kit, drizzle cannot express a trigger, and the
 * baseline therefore creates `entitlement_events` as an ordinary table.
 *
 * What is true, per database:
 *   - the hash chain always DETECTS an edit after the fact;
 *   - nothing PREVENTS one unless `entitlement_events_no_update` and
 *     `entitlement_events_no_delete` are installed on that database.
 *
 * Install them with `pnpm audit:triggers`; check with `pnpm
 * audit:triggers:verify`, which exits non-zero when they are absent.
 * `pnpm entitlements:integrity` reports their absence as a failing run, and
 * `pnpm recovery:drill` proves they survive a restore, because a restore
 * that replays rows and drops triggers looks completely correct (E08.08).
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

  // Hash-chain over stable NON-PII fields only (pure.rowHashOf keeps writer
  // and verifier in lockstep).
  const rowHash = rowHashOf(prevHash, {
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
  return verifyChainRows(rows);
}
