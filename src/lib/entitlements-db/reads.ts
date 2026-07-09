import "server-only";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { entitlements, type EntitlementTier } from "./schema";
import { resolveTier } from "./pure";

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

  // Pure resolver: live MAX-by-rank (untouched fail-open contract) plus the
  // additive read-only lapsed-Event branch. Tested directly in pure.test.ts.
  return resolveTier(rows, now);
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
