import "server-only";
import { and, desc, eq, gt, gte, lte } from "drizzle-orm";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import {
  entitlements,
  entitlementEvents,
  grantBatches,
  isPaidVenue,
  licenseCodes,
  redemptions,
  sponsors,
  type EntitlementTier,
} from "@/lib/entitlements-db/schema";
import { TIER_RANK } from "@/lib/entitlements-db/tiers";

/**
 * Read layer for the Access console (/hq/entitlements). All reads hit the
 * shared signal-entitlements DB and degrade to a reachability flag rather
 * than throwing, so an unreachable DB shows a calm "can't reach" state
 * instead of a crashed room. No writes here — mutations go through the
 * entitlements-db writers, which carry the audit + blast-radius envelope.
 *
 * Console path note: the ratified spec named /hq/access, but that path is
 * the HQ login gate; the console lives at /hq/entitlements (founder decision
 * 2026-07-09), replacing the orphaned entitlements page. The hub is labelled
 * "Access".
 */

const DAY = 24 * 60 * 60 * 1000;

// ── Marketing-name tier pickers ─────────────────────────────────────────
// Operators pick a MARKETING name; the DB code + source are derived. The
// non-purchasable tiers (wedding, studio) are deliberately absent from
// free-hand grant selection — structural fat-finger prevention.
export type GrantTierOption = {
  marketing: string;
  tier: EntitlementTier;
  source: "compliments" | "student_edu" | "batch_grant";
  help?: string;
};

export const GRANT_TIER_OPTIONS: GrantTierOption[] = [
  { marketing: "Pro", tier: "workspace", source: "compliments", help: "Pro = workspace" },
  { marketing: "Event", tier: "event", source: "compliments" },
  { marketing: "Student", tier: "workspace", source: "student_edu", help: "Student = workspace" },
];

/** Marketing label for a DB tier code, for display. */
export const TIER_MARKETING_LABEL: Record<EntitlementTier, string> = {
  free: "Free",
  event: "Event",
  wedding: "Wedding",
  workspace: "Pro",
  studio: "Studio",
};

// ── Shared reachability wrapper ─────────────────────────────────────────
export type Reachable<T> = { ok: true; data: T } | { ok: false; error: string };

async function reach<T>(fn: () => Promise<T>): Promise<Reachable<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

// ── Today ───────────────────────────────────────────────────────────────
export type TodayWorklist = {
  reachable: boolean;
  error?: string;
  expiredOvernight: number;
  newRedemptions: number;
  venuesNearAllotment: Array<{ slug: string; name: string; remaining: number; allotment: number }>;
  inGraceExpiringSoon: number;
  driftSponsors: number;
};

export async function getAccessToday(): Promise<TodayWorklist> {
  const now = Date.now();
  const dayAgo = now - DAY;
  const r = await reach(async () => {
    const db = entitlementsDb();

    const expired = await db
      .select({ id: entitlements.id })
      .from(entitlements)
      .where(
        and(
          eq(entitlements.status, "active"),
          gte(entitlements.expiresAt, dayAgo),
          lte(entitlements.expiresAt, now),
        ),
      );

    const recentRedemptions = await db
      .select({ id: redemptions.id })
      .from(redemptions)
      .where(gt(redemptions.redeemedAt, dayAgo));

    const inGrace = await db
      .select({ id: entitlements.id })
      .from(entitlements)
      .where(
        and(
          eq(entitlements.status, "active"),
          eq(entitlements.billingState, "past_due"),
          gt(entitlements.expiresAt, now),
          lte(entitlements.expiresAt, now + 3 * DAY),
        ),
      );

    const venues = await db
      .select({
        slug: sponsors.slug,
        name: sponsors.name,
        codesIssued: sponsors.codesIssued,
        codeAllotment: sponsors.codeAllotment,
      })
      .from(sponsors);
    const near = venues
      .filter((v) => v.codeAllotment != null && v.codeAllotment > 0)
      .map((v) => ({
        slug: v.slug,
        name: v.name,
        allotment: v.codeAllotment as number,
        remaining: (v.codeAllotment as number) - v.codesIssued,
      }))
      .filter((v) => v.remaining <= Math.max(2, Math.ceil(v.allotment * 0.15)))
      .sort((a, b) => a.remaining - b.remaining);

    // Counter drift: codes_issued vs actual code rows.
    const codeRows = await db
      .select({ sponsorId: licenseCodes.sponsorId })
      .from(licenseCodes);
    const rowCount = new Map<string, number>();
    for (const c of codeRows) rowCount.set(c.sponsorId, (rowCount.get(c.sponsorId) ?? 0) + 1);
    const allVenues = await db
      .select({ id: sponsors.id, codesIssued: sponsors.codesIssued })
      .from(sponsors);
    const drift = allVenues.filter((v) => (rowCount.get(v.id) ?? 0) !== v.codesIssued).length;

    return {
      expiredOvernight: expired.length,
      newRedemptions: recentRedemptions.length,
      inGraceExpiringSoon: inGrace.length,
      venuesNearAllotment: near,
      driftSponsors: drift,
    };
  });

  if (!r.ok) {
    return {
      reachable: false,
      error: r.error,
      expiredOvernight: 0,
      newRedemptions: 0,
      venuesNearAllotment: [],
      inGraceExpiringSoon: 0,
      driftSponsors: 0,
    };
  }
  return { reachable: true, ...r.data };
}

// ── Roster ──────────────────────────────────────────────────────────────
export type RosterFilters = {
  tier?: string;
  source?: string;
  status?: string;
  billingState?: string;
  batchId?: string;
  limit?: number;
};

export type RosterRow = {
  id: string;
  userClerkId: string;
  tier: string;
  tierLabel: string;
  source: string;
  status: string;
  billingState: string | null;
  paid: boolean;
  expiresAt: number | null;
  batchId: string | null;
  grantedAt: number;
};

export async function getRoster(filters: RosterFilters = {}): Promise<Reachable<RosterRow[]>> {
  return reach(async () => {
    const db = entitlementsDb();
    const conds = [];
    if (filters.tier) conds.push(eq(entitlements.tier, filters.tier));
    if (filters.source) conds.push(eq(entitlements.source, filters.source));
    if (filters.status) conds.push(eq(entitlements.status, filters.status));
    if (filters.billingState) conds.push(eq(entitlements.billingState, filters.billingState));
    if (filters.batchId) conds.push(eq(entitlements.batchId, filters.batchId));
    const rows = await db
      .select()
      .from(entitlements)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(entitlements.createdAt))
      .limit(filters.limit ?? 200);
    return rows.map((r) => ({
      id: r.id,
      userClerkId: r.userClerkId,
      tier: r.tier,
      tierLabel: TIER_MARKETING_LABEL[r.tier as EntitlementTier] ?? r.tier,
      source: r.source,
      status: r.status,
      billingState: r.billingState,
      paid: r.billingState != null && r.billingState !== "none",
      expiresAt: r.expiresAt,
      batchId: r.batchId,
      grantedAt: r.grantedAt,
    }));
  });
}

// ── Person ──────────────────────────────────────────────────────────────
export type PersonView = {
  found: boolean;
  clerkId: string | null;
  resolvedTier: string;
  resolvedTierLabel: string;
  readOnly: boolean;
  rows: Array<{
    id: string;
    tier: string;
    tierLabel: string;
    source: string;
    status: string;
    billingState: string | null;
    sourceRef: string | null;
    batchId: string | null;
    grantedAt: number;
    expiresAt: number | null;
  }>;
  redemptions: Array<{ codeId: string; entitlementId: string | null; redeemedAt: number }>;
  timeline: Array<{
    id: string;
    action: string;
    actorName: string | null;
    reason: string | null;
    origin: string | null;
    createdAt: number;
  }>;
};

/** Resolve a lookup (Clerk id, email hash, or code) to a person view. Email
 *  is resolved upstream (Clerk id / email_hash); this reads the shared DB. */
export async function getPerson(clerkId: string): Promise<Reachable<PersonView>> {
  return reach(async () => {
    const db = entitlementsDb();
    const rows = await db
      .select()
      .from(entitlements)
      .where(eq(entitlements.userClerkId, clerkId))
      .orderBy(desc(entitlements.createdAt));

    if (rows.length === 0) {
      return {
        found: false,
        clerkId: null,
        resolvedTier: "free",
        resolvedTierLabel: "Free",
        readOnly: false,
        rows: [],
        redemptions: [],
        timeline: [],
      };
    }

    const now = Date.now();
    const live = rows.filter(
      (r) =>
        r.status === "active" && (r.expiresAt == null || r.expiresAt > now),
    );
    let bestTier: EntitlementTier = "free";
    for (const r of live) {
      const rank = TIER_RANK[r.tier as EntitlementTier] ?? -1;
      if (rank > (TIER_RANK[bestTier] ?? -1)) bestTier = r.tier as EntitlementTier;
    }

    const reds = await db
      .select({
        codeId: redemptions.codeId,
        entitlementId: redemptions.entitlementId,
        redeemedAt: redemptions.redeemedAt,
      })
      .from(redemptions)
      .where(eq(redemptions.userClerkId, clerkId))
      .orderBy(desc(redemptions.redeemedAt));

    const events = await db
      .select({
        id: entitlementEvents.id,
        action: entitlementEvents.action,
        actorName: entitlementEvents.actorName,
        reason: entitlementEvents.reason,
        origin: entitlementEvents.origin,
        createdAt: entitlementEvents.createdAt,
      })
      .from(entitlementEvents)
      .where(eq(entitlementEvents.userClerkId, clerkId))
      .orderBy(desc(entitlementEvents.createdAt))
      .limit(200);

    return {
      found: true,
      clerkId,
      resolvedTier: bestTier,
      resolvedTierLabel: TIER_MARKETING_LABEL[bestTier],
      readOnly: false,
      rows: rows.map((r) => ({
        id: r.id,
        tier: r.tier,
        tierLabel: TIER_MARKETING_LABEL[r.tier as EntitlementTier] ?? r.tier,
        source: r.source,
        status: r.status,
        billingState: r.billingState,
        sourceRef: r.sourceRef,
        batchId: r.batchId,
        grantedAt: r.grantedAt,
        expiresAt: r.expiresAt,
      })),
      redemptions: reds,
      timeline: events,
    };
  });
}

// ── Batches ─────────────────────────────────────────────────────────────
export type BatchView = {
  id: string;
  slug: string;
  label: string;
  kind: string;
  tier: string;
  tierLabel: string;
  allotment: number | null;
  granted: number;
  reason: string;
  perpetual: boolean;
  closedAt: number | null;
};

export async function getBatches(): Promise<Reachable<BatchView[]>> {
  return reach(async () => {
    const db = entitlementsDb();
    const batches = await db.select().from(grantBatches).orderBy(desc(grantBatches.createdAt));
    const grantRows = await db
      .select({ batchId: entitlements.batchId })
      .from(entitlements)
      .where(eq(entitlements.status, "active"));
    const grantedByBatch = new Map<string, number>();
    for (const g of grantRows) {
      if (g.batchId) grantedByBatch.set(g.batchId, (grantedByBatch.get(g.batchId) ?? 0) + 1);
    }
    return batches.map((b) => ({
      id: b.id,
      slug: b.slug,
      label: b.label,
      kind: b.kind,
      tier: b.tier,
      tierLabel: TIER_MARKETING_LABEL[b.tier as EntitlementTier] ?? b.tier,
      allotment: b.allotment,
      granted: grantedByBatch.get(b.id) ?? 0,
      reason: b.reason,
      perpetual: b.perpetual === 1,
      closedAt: b.closedAt,
    }));
  });
}

// ── Venues ──────────────────────────────────────────────────────────────
export type VenueView = {
  id: string;
  slug: string;
  name: string;
  venuePlan: string;
  paid: boolean;
  termEndsAt: number | null;
  annualAmountCents: number | null;
  allotment: number | null;
  minted: number;
  redeemed: number;
  remaining: number | null;
  drift: boolean;
};

export async function getVenues(): Promise<Reachable<VenueView[]>> {
  return reach(async () => {
    const db = entitlementsDb();
    const rows = await db.select().from(sponsors).orderBy(desc(sponsors.createdAt));
    const codes = await db
      .select({ sponsorId: licenseCodes.sponsorId, status: licenseCodes.status })
      .from(licenseCodes);
    const mintedBy = new Map<string, number>();
    const redeemedBy = new Map<string, number>();
    for (const c of codes) {
      mintedBy.set(c.sponsorId, (mintedBy.get(c.sponsorId) ?? 0) + 1);
      if (c.status === "redeemed") {
        redeemedBy.set(c.sponsorId, (redeemedBy.get(c.sponsorId) ?? 0) + 1);
      }
    }
    return rows.map((s) => {
      const minted = mintedBy.get(s.id) ?? 0;
      return {
        id: s.id,
        slug: s.slug,
        name: s.name,
        venuePlan: s.venuePlan,
        paid: isPaidVenue(s),
        termEndsAt: s.termEndsAt,
        annualAmountCents: s.annualAmountCents,
        allotment: s.codeAllotment,
        minted,
        redeemed: redeemedBy.get(s.id) ?? 0,
        remaining: s.codeAllotment != null ? s.codeAllotment - s.codesIssued : null,
        drift: minted !== s.codesIssued,
      };
    });
  });
}

export function formatCents(cents: number | null): string {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
}
