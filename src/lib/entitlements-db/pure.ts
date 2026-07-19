import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { TIER_RANK } from "./tiers";
import type { EntitlementTier } from "./schema";

/**
 * Pure, DB-free decision logic shared by the entitlements writers/resolver
 * and exercised directly by tests. No "server-only", no Drizzle, no I/O —
 * just the correctness-critical rules: tier resolution + tie-break, the audit
 * hash-chain, the bulk blast-radius check, operator-roster parsing, and svix
 * signature verification. Keeping these here means the tests hit the REAL
 * code path the server runs, not a copy.
 */

// ── Tier resolution ─────────────────────────────────────────────────────

export type ResolveRow = {
  id: string;
  tier: string;
  source: string | null;
  sourceRef: string | null;
  expiresAt: number | null;
  billingState: string | null;
  stripeCustomerId: string | null;
};

export type ResolvedTier = {
  tier: EntitlementTier;
  source: string | null;
  sourceRef: string | null;
  expiresAt: number | null;
  stripeCustomerId: string | null;
  readOnly: boolean;
};

export const FREE_RESOLVED: ResolvedTier = {
  tier: "free",
  source: null,
  sourceRef: null,
  expiresAt: null,
  stripeCustomerId: null,
  readOnly: false,
};

/** Billing states that void even read access on a lapsed Event. */
export const READ_VOIDING_BILLING_STATES = ["refunded", "disputed", "canceled"];

/**
 * Deterministic pick among rows of equal top rank: highest tier wins; ties
 * broken by the longest-lasting row (null expiry = furthest), then id asc.
 */
export function pickBest<T extends { tier: string; expiresAt: number | null; id: string }>(
  rows: T[],
): T {
  let best = rows[0];
  let bestRank = TIER_RANK[best.tier as EntitlementTier] ?? -1;
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const rank = TIER_RANK[r.tier as EntitlementTier] ?? -1;
    if (rank > bestRank) {
      best = r;
      bestRank = rank;
      continue;
    }
    if (rank === bestRank) {
      const a = r.expiresAt ?? Number.POSITIVE_INFINITY;
      const b = best.expiresAt ?? Number.POSITIVE_INFINITY;
      if (a > b || (a === b && r.id < best.id)) best = r;
    }
  }
  return best;
}

/**
 * Resolve the highest tier from a user's ACTIVE rows (status filtering is the
 * caller's job). Live MAX-by-rank is the untouched fail-open contract; a
 * lapsed-but-not-refunded Event additively resolves to a read-only Event.
 */
export function resolveTier(rows: ResolveRow[], now: number): ResolvedTier {
  const live = rows.filter((r) => r.expiresAt == null || r.expiresAt > now);
  if (live.length > 0) {
    const best = pickBest(live);
    if ((TIER_RANK[best.tier as EntitlementTier] ?? -1) > 0) {
      return {
        tier: best.tier as EntitlementTier,
        source: best.source,
        sourceRef: best.sourceRef,
        expiresAt: best.expiresAt,
        stripeCustomerId: best.stripeCustomerId,
        readOnly: false,
      };
    }
  }
  const lapsed = rows
    .filter(
      (r) =>
        r.source === "event_pass" &&
        r.expiresAt != null &&
        r.expiresAt <= now &&
        (r.billingState == null || !READ_VOIDING_BILLING_STATES.includes(r.billingState)),
    )
    .sort((a, b) => (b.expiresAt ?? 0) - (a.expiresAt ?? 0))[0];
  if (lapsed) {
    return {
      tier: "event",
      source: lapsed.source,
      sourceRef: lapsed.sourceRef,
      expiresAt: lapsed.expiresAt,
      stripeCustomerId: lapsed.stripeCustomerId,
      readOnly: true,
    };
  }
  return FREE_RESOLVED;
}

// ── Audit hash-chain ────────────────────────────────────────────────────

/** Deterministic SHA-256 over sorted keys (null-normalized). */
export function chainHash(payload: Record<string, unknown>): string {
  const ordered = Object.keys(payload)
    .sort()
    .reduce<Record<string, unknown>>((acc, k) => {
      acc[k] = payload[k] ?? null;
      return acc;
    }, {});
  return createHash("sha256").update(JSON.stringify(ordered)).digest("hex");
}

export const GENESIS = "genesis";

export type ChainRow = {
  id: string;
  entitlementId: string | null;
  userClerkId: string | null;
  sponsorId: string | null;
  batchId: string | null;
  actorId: string | null;
  action: string;
  reason: string | null;
  beforeJson: string | null;
  afterJson: string | null;
  origin: string | null;
  prevHash: string | null;
  rowHash: string | null;
  stripeEventId: string | null;
  createdAt: number;
};

/** Recompute a row's hash from its non-PII fields (must match writer order). */
export function rowHashOf(prevHash: string, r: Omit<ChainRow, "prevHash" | "rowHash">): string {
  return chainHash({
    prevHash,
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
}

/** Verify an ordered slice of the ledger. Returns the first break, or ok. */
export function verifyChainRows(rows: ChainRow[]): { ok: boolean; brokenAt?: string } {
  let prev = GENESIS;
  for (const r of rows) {
    if (r.prevHash !== prev) return { ok: false, brokenAt: r.id };
    if (rowHashOf(r.prevHash, r) !== r.rowHash) return { ok: false, brokenAt: r.id };
    prev = r.rowHash ?? GENESIS;
  }
  return { ok: true };
}

// ── Bulk blast-radius check ─────────────────────────────────────────────

export function checkBulk(
  count: number,
  hardCap: number,
  twoPersonThreshold: number,
  approvals: number,
): { allowed: boolean; reason?: string } {
  if (!Number.isInteger(count) || count < 0) {
    return { allowed: false, reason: `invalid count ${count}` };
  }
  if (count > hardCap) {
    return { allowed: false, reason: `${count} exceeds hard cap ${hardCap}` };
  }
  if (count > twoPersonThreshold && approvals < 2) {
    return { allowed: false, reason: `${count} needs a second approver (threshold ${twoPersonThreshold})` };
  }
  return { allowed: true };
}

// ── Operator roster ─────────────────────────────────────────────────────

export type RosterEntry = { id: string; name: string };

export function parseRoster(raw: string | undefined): RosterEntry[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const i = pair.indexOf(":");
      return i === -1
        ? { id: pair, name: pair }
        : { id: pair.slice(0, i).trim(), name: pair.slice(i + 1).trim() };
    })
    .filter((e) => e.id);
}

/** Resolve a named operator against an optional roster. Fail-closed. */
export function resolveOperator(
  input: { id?: string | null; name?: string | null },
  roster: RosterEntry[],
): { ok: true; id: string; name: string } | { ok: false; reason: string } {
  const id = input.id?.trim() ?? "";
  const name = input.name?.trim() ?? "";
  if (!id || !name) return { ok: false, reason: "a named operator (id + name) is required" };
  if (roster.length > 0) {
    const match = roster.find((e) => e.id === id);
    if (!match) return { ok: false, reason: `'${id}' is not in the operator roster` };
    return { ok: true, id: match.id, name: match.name };
  }
  return { ok: true, id, name };
}

// ── svix signature (Clerk webhooks) ─────────────────────────────────────

/** Base64 HMAC-SHA256 of `${id}.${timestamp}.${body}` under a whsec_ key. */
export function svixExpectedSignature(
  secret: string,
  id: string,
  timestamp: string,
  body: string,
): string {
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  return createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64");
}

/** Does the space-separated `v1,<sig>` header contain a match for `expected`? */
export function svixMatches(header: string, expected: string): boolean {
  const expectedBuf = Buffer.from(expected);
  for (const part of header.split(" ")) {
    const sig = part.includes(",") ? part.split(",")[1] : part;
    const sigBuf = Buffer.from(sig);
    if (sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf)) return true;
  }
  return false;
}

/** Reject replayed or implausibly future Svix deliveries before body work. */
export function isFreshSvixTimestamp(
  seconds: string,
  nowMs: number,
  toleranceSeconds = 300,
): boolean {
  if (!/^\d{10,13}$/.test(seconds)) return false;
  const parsed = Number(seconds);
  if (!Number.isSafeInteger(parsed) || toleranceSeconds < 0) return false;
  const timestampMs = seconds.length === 13 ? parsed : parsed * 1000;
  return Math.abs(nowMs - timestampMs) <= toleranceSeconds * 1000;
}

/** Audit records identify the database row, never the bearer license code. */
export function codeAuditProjection(
  codeId: string,
  tier: string,
): Readonly<{ codeId: string; tier: string }> {
  if (!codeId || !tier) throw new TypeError("code audit fields are required");
  return { codeId, tier };
}
