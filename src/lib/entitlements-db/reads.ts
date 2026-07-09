import "server-only";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { entitlements, type EntitlementTier } from "./schema";
import { TIER_RANK } from "./tiers";

export type ResolvedEntitlement = {
  tier: EntitlementTier;
  source: string | null;
  sourceRef: string | null;
  expiresAt: number | null;
  stripeCustomerId: string | null;
  /**
   * True when the resolved access is read-only rather than full. Today the
   * only read-only case is a LAPSED (not refunded/disputed) Event pass: the
   * one-time Event keeps read access to its own content after the pass
   * expires, so an expired-Event is distinguishable from never-paid-free. A
   * refunded/disputed Event loses read too (status flips off active). Every
   * live entitlement is readOnly:false. Callers that gate WRITE access MUST
   * check `readOnly === false`, not just the tier.
   */
  readOnly: boolean;
};

const FREE_DEFAULT: ResolvedEntitlement = {
  tier: "free",
  source: null,
  sourceRef: null,
  expiresAt: null,
  stripeCustomerId: null,
  readOnly: false,
};

/** Billing states that void even read access on a lapsed Event. */
const READ_VOIDING_BILLING_STATES = ["refunded", "disputed", "canceled"];

/**
 * Resolve the highest active tier a Clerk user holds across the suite.
 * Reads from the shared signal-entitlements DB.
 *
 * Failure mode: returns `free` on any DB error. Entitlements MUST NOT take a
 * product down. Callers that need to distinguish "user is on free" from "DB
 * unreachable" should call resolveEntitlementOrThrow.
 */
export async function resolveEntitlement(
  clerkId: string,
): Promise<ResolvedEntitlement> {
  if (!clerkId) return FREE_DEFAULT;
  try {
    return await resolveEntitlementOrThrow(clerkId);
  } catch {
    return FREE_DEFAULT;
  }
}

/**
 * Deterministic pick among active rows: highest tier rank wins; ties broken
 * by the longest-lasting row (null expiry = furthest), then by id ascending.
 * Without this, same-rank ties resolved on non-deterministic DB row order.
 */
function pickBest<
  T extends { tier: string; expiresAt: number | null; id: string },
>(rows: T[]): T {
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

export async function resolveEntitlementOrThrow(
  clerkId: string,
): Promise<ResolvedEntitlement> {
  if (!clerkId) return FREE_DEFAULT;
  const now = Date.now();
  const db = entitlementsDb();
  // ONE query for all active rows (revoked/expired-status still excluded).
  // Live-ness (expiry) is partitioned in JS so the never-paid-free hot path
  // stays a single round-trip. The live MAX-by-rank below is byte-identical
  // to the prior contract; the lapsed branch is purely additive.
  const rows = await db
    .select({
      id: entitlements.id,
      tier: entitlements.tier,
      source: entitlements.source,
      sourceRef: entitlements.sourceRef,
      expiresAt: entitlements.expiresAt,
      billingState: entitlements.billingState,
      stripeCustomerId: entitlements.stripeCustomerId,
    })
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userClerkId, clerkId),
        eq(entitlements.status, "active"),
      ),
    );

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

  // Live resolution is free. Additive: a lapsed-but-not-refunded Event pass
  // keeps READ access to its own content (readOnly). This never elevates a
  // live tier — it only fires when nothing live outranks free.
  const lapsed = rows
    .filter(
      (r) =>
        r.source === "event_pass" &&
        r.expiresAt != null &&
        r.expiresAt <= now &&
        (r.billingState == null ||
          !READ_VOIDING_BILLING_STATES.includes(r.billingState)),
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

  return FREE_DEFAULT;
}

/**
 * Fetch the full active-entitlement list for a user. Used by HQ dashboards,
 * settings/plan pages, admin tooling. Read-only.
 */
export async function listEntitlements(clerkId: string) {
  if (!clerkId) return [];
  const now = Date.now();
  const db = entitlementsDb();
  return db
    .select()
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userClerkId, clerkId),
        eq(entitlements.status, "active"),
        or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now)),
      ),
    );
}
