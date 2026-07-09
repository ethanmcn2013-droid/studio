import "server-only";
import { randomUUID } from "node:crypto";
import { and, count, eq, gt, isNull, sql } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { appendEvent } from "./audit";
import { assertBulkAllowed, reportAnomaly, requireActor, type MutationActor } from "./guard";
import {
  ENTITLEMENT_TIERS,
  entitlements,
  licenseCodes,
  redemptions,
  sponsors,
  type EntitlementSource,
  type EntitlementTier,
} from "./schema";

/**
 * Shared-DB code lifecycle: mint (race-safe allotment invariant), redeem
 * (reserve-then-commit, idempotent, one transaction), and reconcile
 * (orphan repair + drift report).
 *
 * The public redeem WRITE lives in the Tasks repo today; moving it here is
 * gated on the licensing-policy-ratification "redemption ownership" decision.
 * Until it moves, redeemLicenseCode is the ready target writer and
 * reconcileCodes is the load-bearing net that repairs any
 * code-redeemed-but-no-entitlement orphan the cross-repo write leaves behind.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const genEntId = () => `e-${randomUUID().replace(/-/g, "").slice(0, 16)}`;
const genCodeId = () => `lc-${randomUUID().replace(/-/g, "").slice(0, 16)}`;
const genRedId = () => `r-${randomUUID().replace(/-/g, "").slice(0, 16)}`;

// Public-redeem IP rate limit (durable — counts real redemptions, un-bypassable).
const num = (v: string | undefined, d: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : d;
};
export const REDEEM_IP_WINDOW_MS = num(process.env.ACCESS_REDEEM_IP_WINDOW_MS, 10 * 60_000);
export const REDEEM_IP_MAX = num(process.env.ACCESS_REDEEM_IP_MAX, 8);
/** Max orphans a single reconcile run will compensate (per-run blast cap). */
export const RECONCILE_MAX_PER_RUN = num(process.env.ACCESS_RECONCILE_MAX, 200);

function assertKnownTier(tier: string): asserts tier is EntitlementTier {
  if (!(ENTITLEMENT_TIERS as readonly string[]).includes(tier)) {
    reportAnomaly({ kind: "unknown_tier", detail: `code tier '${tier}'` });
    throw new Error(`mint/redeem: unknown tier '${tier}'`);
  }
}

// ── Mint ────────────────────────────────────────────────────────────────

/**
 * Mint license codes for a sponsor under a HARD allotment invariant enforced
 * by a race-safe conditional decrement:
 *   UPDATE sponsors SET codes_issued = codes_issued + N
 *     WHERE id=? AND codes_issued + N <= code_allotment
 * Zero rows updated => refuse (no headroom, or a null allotment = not
 * mint-eligible). The counter bump and the code inserts commit in ONE
 * transaction, so two concurrent mints can never both slip past the cap.
 * High-tier cohort codes carry a recipient_email_hash lock.
 */
export async function mintLicenseCodes(input: {
  sponsorId: string;
  codes: Array<{ code: string; recipientEmailHash?: string | null }>;
  tier: EntitlementTier;
  sourceType: EntitlementSource;
  actor: MutationActor;
  durationDays?: number | null;
  batchId?: string | null;
  origin?: string | null;
}): Promise<{ minted: number }> {
  const n = input.codes.length;
  if (n === 0) return { minted: 0 };
  assertKnownTier(input.tier);
  const actor = requireActor(input.actor);
  assertBulkAllowed(n);
  const db = entitlementsDb();
  const now = Date.now();

  return db.transaction(async (tx) => {
    const bumped = await tx
      .update(sponsors)
      .set({ codesIssued: sql`${sponsors.codesIssued} + ${n}`, updatedAt: now })
      .where(
        and(
          eq(sponsors.id, input.sponsorId),
          sql`${sponsors.codesIssued} + ${n} <= ${sponsors.codeAllotment}`,
        ),
      )
      .returning({ codesIssued: sponsors.codesIssued, codeAllotment: sponsors.codeAllotment });

    if (bumped.length === 0) {
      const s = await tx
        .select({
          codesIssued: sponsors.codesIssued,
          codeAllotment: sponsors.codeAllotment,
        })
        .from(sponsors)
        .where(eq(sponsors.id, input.sponsorId))
        .limit(1);
      if (s.length === 0) throw new Error(`mintLicenseCodes: no sponsor '${input.sponsorId}'`);
      const remaining = (s[0].codeAllotment ?? 0) - s[0].codesIssued;
      reportAnomaly({
        kind: "bulk_cap",
        actorId: actor.actorId,
        detail: `mint refused for ${input.sponsorId}: ${n} requested, ${remaining} remaining`,
      });
      throw new Error(
        `mint refused: would exceed allotment (${n} requested, ${remaining < 0 ? 0 : remaining} remaining)`,
      );
    }

    for (const c of input.codes) {
      const id = genCodeId();
      await tx.insert(licenseCodes).values({
        id,
        sponsorId: input.sponsorId,
        code: c.code.trim().toUpperCase(),
        status: "minted",
        sourceType: input.sourceType,
        tier: input.tier,
        durationDays: input.durationDays ?? null,
        batchId: input.batchId ?? null,
        recipientEmailHash: c.recipientEmailHash ?? null,
      });
      await appendEvent(tx, {
        action: "mint",
        sponsorId: input.sponsorId,
        batchId: input.batchId ?? null,
        actorId: actor.actorId,
        actorName: actor.actorName,
        reason: "mint",
        after: { code: c.code.trim().toUpperCase(), tier: input.tier },
        origin: input.origin ?? "hq",
      });
    }
    return { minted: n };
  });
}

// ── Redeem ──────────────────────────────────────────────────────────────

export type RedeemResult =
  | { state: "redeemed"; entitlementId: string; created: boolean }
  | { state: "already_used_by_other" }
  | { state: "invalid" }
  | { state: "revoked" }
  | { state: "recipient_locked" }
  | { state: "rate_limited" };

/**
 * Redeem a code: reserve-then-commit in ONE transaction, idempotent on
 * (code, user). The reserve is a conditional flip minted->redeemed; only the
 * winner of the race proceeds to write the entitlement + redemption + event
 * together. A retry by the SAME user returns the existing entitlement rather
 * than minting a second. IP rate-limited and recipient-locked.
 */
export async function redeemLicenseCode(input: {
  code: string;
  userClerkId: string;
  actor: MutationActor;
  ipHash?: string | null;
  userAgent?: string | null;
  recipientEmailHash?: string | null;
  origin?: string | null;
}): Promise<RedeemResult> {
  const actor = requireActor(input.actor);
  const code = input.code.trim().toUpperCase();
  if (!code || !input.userClerkId) return { state: "invalid" };
  const db = entitlementsDb();
  const now = Date.now();

  if (input.ipHash) {
    const [row] = await db
      .select({ n: count() })
      .from(redemptions)
      .where(
        and(
          eq(redemptions.ipHash, input.ipHash),
          gt(redemptions.redeemedAt, now - REDEEM_IP_WINDOW_MS),
        ),
      );
    if ((row?.n ?? 0) >= REDEEM_IP_MAX) {
      reportAnomaly({ kind: "velocity", detail: `redeem ip cap: ${input.ipHash}` });
      return { state: "rate_limited" };
    }
  }

  return db.transaction(async (tx) => {
    const rows = await tx
      .select({
        id: licenseCodes.id,
        status: licenseCodes.status,
        tier: licenseCodes.tier,
        sourceType: licenseCodes.sourceType,
        durationDays: licenseCodes.durationDays,
        sponsorId: licenseCodes.sponsorId,
        batchId: licenseCodes.batchId,
        recipientEmailHash: licenseCodes.recipientEmailHash,
        redeemedByUserId: licenseCodes.redeemedByUserId,
      })
      .from(licenseCodes)
      .where(eq(licenseCodes.code, code))
      .limit(1);

    if (rows.length === 0) return { state: "invalid" };
    const lc = rows[0];
    if (lc.status === "revoked") return { state: "revoked" };

    if (lc.status === "redeemed") {
      // Idempotent: the same user re-redeeming gets their existing entitlement.
      if (lc.redeemedByUserId === input.userClerkId) {
        const existing = await tx
          .select({ entitlementId: redemptions.entitlementId })
          .from(redemptions)
          .where(and(eq(redemptions.codeId, lc.id), eq(redemptions.userClerkId, input.userClerkId)))
          .limit(1);
        if (existing[0]?.entitlementId) {
          return { state: "redeemed", entitlementId: existing[0].entitlementId, created: false };
        }
      }
      return { state: "already_used_by_other" };
    }

    if (lc.recipientEmailHash && lc.recipientEmailHash !== input.recipientEmailHash) {
      return { state: "recipient_locked" };
    }

    // Reserve: conditional flip. Losing the race yields zero rows.
    const reserved = await tx
      .update(licenseCodes)
      .set({
        status: "redeemed",
        redeemedByUserId: input.userClerkId,
        redeemedAt: now,
        updatedAt: now,
      })
      .where(and(eq(licenseCodes.id, lc.id), eq(licenseCodes.status, "minted")))
      .returning({ id: licenseCodes.id });
    if (reserved.length === 0) return { state: "already_used_by_other" };

    // Commit: entitlement + redemption + event, all in this transaction.
    assertKnownTier(lc.tier);
    const entId = genEntId();
    const expiresAt =
      lc.durationDays != null && lc.durationDays > 0 ? now + lc.durationDays * DAY_MS : null;
    await tx.insert(entitlements).values({
      id: entId,
      userClerkId: input.userClerkId,
      tier: lc.tier,
      source: lc.sourceType as EntitlementSource,
      sourceRef: `redeem:${lc.id}`,
      expiresAt,
      status: "active",
      billingState: "none",
      batchId: lc.batchId ?? null,
      grantedBy: actor.actorId,
    });
    await tx.insert(redemptions).values({
      id: genRedId(),
      codeId: lc.id,
      userClerkId: input.userClerkId,
      entitlementId: entId,
      ipHash: input.ipHash ?? null,
      userAgent: input.userAgent ?? null,
      redeemedAt: now,
    });
    await appendEvent(tx, {
      action: "redeem",
      entitlementId: entId,
      userClerkId: input.userClerkId,
      sponsorId: lc.sponsorId,
      batchId: lc.batchId ?? null,
      actorId: actor.actorId,
      actorName: actor.actorName,
      reason: "code redeemed",
      after: { code, tier: lc.tier },
      origin: input.origin ?? "redeem",
    });
    return { state: "redeemed", entitlementId: entId, created: true };
  });
}

// ── Reconcile ───────────────────────────────────────────────────────────

export type ReconcileReport = {
  orphansFound: number;
  orphansRepaired: number;
  drift: Array<{
    sponsorId: string;
    codesIssued: number;
    codeRows: number;
    ok: boolean;
  }>;
};

/**
 * Repair code-redeemed-but-no-entitlement orphans (the cross-repo write can
 * flip a code + write a redemption row without the shared entitlement) and
 * report per-sponsor counter drift (codes_issued vs actual license_codes
 * rows). Compensation is idempotent and capped per run; every repair writes a
 * reconcile event. Drift is surfaced, never silently auto-corrected — the
 * operator decides on the counter/allotment.
 */
export async function reconcileCodes(input: {
  actor: MutationActor;
  limit?: number;
}): Promise<ReconcileReport> {
  const actor = requireActor(input.actor);
  const db = entitlementsDb();
  const cap = Math.min(input.limit ?? RECONCILE_MAX_PER_RUN, RECONCILE_MAX_PER_RUN);
  const now = Date.now();

  // Orphans: a redemption row with no linked entitlement.
  const orphans = await db
    .select({
      redemptionId: redemptions.id,
      codeId: redemptions.codeId,
      userClerkId: redemptions.userClerkId,
      tier: licenseCodes.tier,
      sourceType: licenseCodes.sourceType,
      durationDays: licenseCodes.durationDays,
      sponsorId: licenseCodes.sponsorId,
      batchId: licenseCodes.batchId,
      redeemedAt: redemptions.redeemedAt,
    })
    .from(redemptions)
    .innerJoin(licenseCodes, eq(licenseCodes.id, redemptions.codeId))
    .where(isNull(redemptions.entitlementId))
    .limit(cap);

  let repaired = 0;
  for (const o of orphans) {
    if (!(ENTITLEMENT_TIERS as readonly string[]).includes(o.tier)) {
      reportAnomaly({ kind: "unknown_tier", detail: `orphan code tier '${o.tier}'` });
      continue;
    }
    const sourceRef = `redeem:${o.codeId}`;
    await db.transaction(async (tx) => {
      // Idempotency: an entitlement may already exist from a prior partial run.
      const existing = await tx
        .select({ id: entitlements.id })
        .from(entitlements)
        .where(and(eq(entitlements.userClerkId, o.userClerkId), eq(entitlements.sourceRef, sourceRef)))
        .limit(1);
      let entId = existing[0]?.id;
      if (!entId) {
        entId = genEntId();
        const base = o.redeemedAt ?? now;
        const expiresAt =
          o.durationDays != null && o.durationDays > 0 ? base + o.durationDays * DAY_MS : null;
        await tx.insert(entitlements).values({
          id: entId,
          userClerkId: o.userClerkId,
          tier: o.tier as EntitlementTier,
          source: o.sourceType as EntitlementSource,
          sourceRef,
          expiresAt,
          status: "active",
          billingState: "none",
          batchId: o.batchId ?? null,
          grantedBy: "reconcile-cron",
        });
        await appendEvent(tx, {
          action: "redeem",
          entitlementId: entId,
          userClerkId: o.userClerkId,
          sponsorId: o.sponsorId,
          batchId: o.batchId ?? null,
          actorId: actor.actorId,
          actorName: actor.actorName,
          reason: "reconcile: compensated code-redeemed-but-no-entitlement orphan",
          origin: "reconcile",
        });
      }
      await tx
        .update(redemptions)
        .set({ entitlementId: entId })
        .where(eq(redemptions.id, o.redemptionId));
    });
    repaired += 1;
  }

  // Drift: codes_issued counter vs actual license_codes row count per sponsor.
  const counters = await db
    .select({ sponsorId: sponsors.id, codesIssued: sponsors.codesIssued })
    .from(sponsors);
  const rowCounts = await db
    .select({ sponsorId: licenseCodes.sponsorId, n: count() })
    .from(licenseCodes)
    .groupBy(licenseCodes.sponsorId);
  const rowMap = new Map(rowCounts.map((r) => [r.sponsorId, r.n]));
  const drift = counters.map((c) => {
    const codeRows = rowMap.get(c.sponsorId) ?? 0;
    const ok = codeRows === c.codesIssued;
    if (!ok) {
      reportAnomaly({
        kind: "drift",
        detail: `sponsor ${c.sponsorId}: codes_issued=${c.codesIssued} but ${codeRows} code rows`,
      });
    }
    return { sponsorId: c.sponsorId, codesIssued: c.codesIssued, codeRows, ok };
  });

  return { orphansFound: orphans.length, orphansRepaired: repaired, drift };
}
