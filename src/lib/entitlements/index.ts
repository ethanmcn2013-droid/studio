import { and, eq, gt, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type EntitlementSource,
  type EntitlementTier,
  entitlements,
} from "@/lib/db/schema";

export type ResolvedEntitlement = {
  tier: EntitlementTier;
  source: EntitlementSource | null;
  sourceRef: string | null;
  expiresAt: number | null;
};

const TIER_RANK: Record<EntitlementTier, number> = {
  free: 0,
  event: 1,
  wedding: 2,
  workspace: 3,
  studio: 4,
};

const FREE_DEFAULT: ResolvedEntitlement = {
  tier: "free",
  source: null,
  sourceRef: null,
  expiresAt: null,
};

export async function getEntitlement(
  clerkId: string,
): Promise<ResolvedEntitlement> {
  if (!clerkId) return FREE_DEFAULT;

  const now = Date.now();

  const rows = await db
    .select({
      tier: entitlements.tier,
      source: entitlements.source,
      sourceRef: entitlements.sourceRef,
      expiresAt: entitlements.expiresAt,
    })
    .from(entitlements)
    .where(
      and(
        eq(entitlements.userClerkId, clerkId),
        eq(entitlements.status, "active"),
        or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, now)),
      ),
    );

  if (rows.length === 0) return FREE_DEFAULT;

  let best = rows[0];
  let bestRank = TIER_RANK[best.tier as EntitlementTier] ?? -1;
  for (let i = 1; i < rows.length; i++) {
    const rank = TIER_RANK[rows[i].tier as EntitlementTier] ?? -1;
    if (rank > bestRank) {
      best = rows[i];
      bestRank = rank;
    }
  }

  return {
    tier: best.tier as EntitlementTier,
    source: best.source as EntitlementSource,
    sourceRef: best.sourceRef,
    expiresAt: best.expiresAt,
  };
}
