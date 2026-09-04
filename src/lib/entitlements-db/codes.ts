import "server-only";
import { randomUUID } from "node:crypto";
import { and, count, eq, gt, gte, isNull, or, sql } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { appendEvent, type EntitlementsTx } from "./audit";
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
import { codeAuditProjection } from "./pure";
import {
  coupleAccessExpiryMs,
  extendedCoupleAccessExpiryMs,
  normaliseWeddingDateMs,
  venueEditionDurationRefusal,
} from "@/lib/venue-edition";
import { fairUseBreach, isUnlimitedSponsor } from "@/lib/venue-allotment";

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

/**
 * D-020 point 1 — "fair use notifies, never blocks". Emits an anomaly when an
 * unlimited sponsor's issuance crosses its ceiling, and returns. It has no
 * refusal path and must never grow one.
 *
 * Issuance is counted **within the current licence term**, because the ceiling
 * is derived from the venue's own ANNUAL wedding count (D-020 point 4).
 * Comparing an annual figure against the lifetime codes_issued counter would
 * fire on every venue in its second year, and an alert that cries wolf is an
 * alert nobody reads.
 */
async function reportFairUse(
  tx: EntitlementsTx,
  input: { sponsorId: string; requested: number; actorId: string },
): Promise<void> {
  const [s] = await tx
    .select({
      allotmentMode: sponsors.allotmentMode,
      fairUseCeiling: sponsors.fairUseCeiling,
      termStartsAt: sponsors.termStartsAt,
      slug: sponsors.slug,
    })
    .from(sponsors)
    .where(eq(sponsors.id, input.sponsorId))
    .limit(1);
  if (!s || !isUnlimitedSponsor(s) || s.fairUseCeiling == null) return;

  const [row] = await tx
    .select({ n: count() })
    .from(licenseCodes)
    .where(
      s.termStartsAt != null
        ? and(
            eq(licenseCodes.sponsorId, input.sponsorId),
            gte(licenseCodes.createdAt, s.termStartsAt),
          )
        : eq(licenseCodes.sponsorId, input.sponsorId),
    );

  const verdict = fairUseBreach({
    fairUseCeiling: s.fairUseCeiling,
    issuedInTerm: row?.n ?? 0,
    requested: input.requested,
  });
  if (!verdict?.breached) return;

  reportAnomaly({
    kind: "fair_use",
    actorId: input.actorId,
    detail: `${s.slug} issuance ${verdict.wouldReach} crosses its fair-use ceiling ${verdict.ceiling} this term. Issuing anyway — unlimited means unlimited.`,
  });
}

function assertKnownTier(tier: string): asserts tier is EntitlementTier {
  if (!(ENTITLEMENT_TIERS as readonly string[]).includes(tier)) {
    reportAnomaly({ kind: "unknown_tier", detail: `code tier '${tier}'` });
    throw new Error(`mint/redeem: unknown tier '${tier}'`);
  }
}

// ── Mint ────────────────────────────────────────────────────────────────

/**
 * Mint license codes for a sponsor.
 *
 * A **limited** sponsor keeps the HARD allotment invariant, enforced by a
 * race-safe conditional bump:
 *   UPDATE sponsors SET codes_issued = codes_issued + N
 *     WHERE id=? AND codes_issued + N <= code_allotment
 * Zero rows updated => refuse (no headroom, or a null allotment = not
 * mint-eligible).
 *
 * An **unlimited** sponsor (R-016, under D-020) is the ratified Venue Edition
 * entitlement — every couple who books, for as long as the licence is
 * current — and the cap clause simply does not apply. The mode test lives
 * INSIDE the same conditional UPDATE rather than in a read-then-write, so the
 * statement stays a single atomic claim and two concurrent mints still cannot
 * both slip past a limited sponsor's cap.
 *
 * Crossing an unlimited sponsor's fair-use ceiling ALERTS and proceeds
 * (D-020 point 1). Nothing here may ever refuse on that number: a numeric
 * pause must not exist behind a promise that says unlimited.
 *
 * The counter bump and the code inserts commit in ONE transaction. High-tier
 * cohort codes carry a recipient_email_hash lock.
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
  if (input.sourceType === "venue_edition") {
    // R-015 / D-022 point 4. This used to demand exactly 548 days, which made
    // the ratified grace term unmintable. It now accepts any computed
    // duration at or above the floor and refuses anything below it.
    const refusal =
      input.tier !== "wedding"
        ? `Venue Edition codes must use the wedding tier (got '${input.tier}')`
        : venueEditionDurationRefusal(input.durationDays);
    if (refusal) {
      reportAnomaly({
        kind: "invalid_terms",
        detail: `venue_edition code terms '${input.tier}/${input.durationDays ?? "null"}'`,
      });
      throw new Error(refusal);
    }
  }
  const actor = requireActor(input.actor);
  if (input.sourceType === "venue_edition" || input.batchId?.startsWith("vi-") ||
      input.codes.some(row => row.code.toUpperCase().startsWith("VENUE-"))) {
    throw new Error("Venue codes require the recoverable fulfilment service. Raw issuance is closed.");
  }
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
          or(
            eq(sponsors.allotmentMode, "unlimited"),
            sql`${sponsors.codesIssued} + ${n} <= ${sponsors.codeAllotment}`,
          ),
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

    await reportFairUse(tx, {
      sponsorId: input.sponsorId,
      requested: n,
      actorId: actor.actorId,
    });

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
        after: codeAuditProjection(id, input.tier),
        origin: input.origin ?? "hq",
      });
    }
    return { minted: n };
  });
}

// ── Redeem ──────────────────────────────────────────────────────────────

/**
 * The one place redemption expiry is decided, shared by `redeemLicenseCode`
 * and the orphan reconciler so the two can never diverge.
 *
 * Venue Edition rows carry the ratified term (D-010, D-022):
 * `max(redemption + 548 days, wedding date + 90 days)`. Everything else keeps
 * the flat duration it always had, and a null duration still means no expiry.
 */
function expiryForRedemption(input: {
  sourceType: string;
  durationDays: number | null;
  redeemedAtMs: number;
  weddingDateMs: number | null;
}): number | null {
  if (input.sourceType === "venue_edition") {
    return coupleAccessExpiryMs({
      redeemedAtMs: input.redeemedAtMs,
      weddingDateMs: input.weddingDateMs,
      mintedDurationDays: input.durationDays,
    });
  }
  return input.durationDays != null && input.durationDays > 0
    ? input.redeemedAtMs + input.durationDays * DAY_MS
    : null;
}

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
  /**
   * R-015 · D-022 point 1. The couple's wedding day, `YYYY-MM-DD` or a UTC
   * epoch. Optional: if it is genuinely unknown at redemption the term falls
   * back to the 548-day floor and `setCoupleWeddingDate` recomputes the moment
   * it is set.
   */
  weddingDate?: string | number | null;
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
    // New Venue capacity is redeemed only by App's atomic comp claim.
    if (lc.batchId?.startsWith("vi-")) return { state: "invalid" };
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
    const weddingDate =
      lc.sourceType === "venue_edition"
        ? normaliseWeddingDateMs(input.weddingDate ?? null)
        : null;
    const expiresAt = expiryForRedemption({
      sourceType: lc.sourceType,
      durationDays: lc.durationDays,
      redeemedAtMs: now,
      weddingDateMs: weddingDate,
    });
    await tx.insert(entitlements).values({
      id: entId,
      userClerkId: input.userClerkId,
      tier: lc.tier,
      source: lc.sourceType as EntitlementSource,
      sourceRef: `redeem:${lc.id}`,
      expiresAt,
      weddingDate,
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
      after: codeAuditProjection(lc.id, lc.tier),
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
    // Never infer a second positive grant from a runtime status mirror.
    if (o.batchId?.startsWith("vi-")) continue;
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
        // Same rule as the redeem path. A compensated venue_edition orphan has
        // no wedding date to hand — the couple supplied it to Tasks, not to
        // this reconciler — so it lands on the floor and is corrected upward
        // by setCoupleWeddingDate. Access can only move later, so the repair
        // is never the thing that shortens a term.
        const expiresAt = expiryForRedemption({
          sourceType: o.sourceType,
          durationDays: o.durationDays,
          redeemedAtMs: base,
          weddingDateMs: null,
        });
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

// ── Wedding date (R-015 · D-022 point 3) ────────────────────────────────

export type WeddingDateResult =
  | { state: "updated"; entitlementId: string; expiresAt: number | null; extendedBy: number }
  | { state: "unchanged"; entitlementId: string; expiresAt: number | null }
  | { state: "not_found" }
  | { state: "not_sponsored" }
  | { state: "invalid_date" };

/**
 * Record or change a couple's wedding date and recompute their access term.
 *
 * The one invariant this function exists to hold: **access only ever moves
 * later.** A postponement extends it automatically — postponements are common
 * and a couple must never have to ask. A correction that would pull the date
 * back leaves the expiry exactly where it was.
 *
 * That is deliberate, and it does mean a couple who mistypes 2028 and fixes it
 * to 2027 keeps the longer term. Granting a few extra months of a product the
 * venue has already paid for is a far cheaper error than taking access away
 * from someone who has started planning inside it.
 *
 * The audit event records the expiry change only. The wedding date itself is
 * personal data and the ledger's before/after payloads are explicitly
 * PII-free (see audit.ts) — a date tied to an entitlement id would breach
 * that, and the current value is already on the row for anyone entitled to
 * read it.
 */
export async function setCoupleWeddingDate(input: {
  entitlementId: string;
  weddingDate: string | number | null;
  actor: MutationActor;
  origin?: string | null;
}): Promise<WeddingDateResult> {
  const actor = requireActor(input.actor);
  const weddingDate = normaliseWeddingDateMs(input.weddingDate);
  if (input.weddingDate != null && weddingDate == null) {
    return { state: "invalid_date" };
  }
  const db = entitlementsDb();

  return db.transaction(async (tx) => {
    const [row] = await tx
      .select({
        id: entitlements.id,
        userClerkId: entitlements.userClerkId,
        source: entitlements.source,
        sourceRef: entitlements.sourceRef,
        grantedAt: entitlements.grantedAt,
        expiresAt: entitlements.expiresAt,
        weddingDate: entitlements.weddingDate,
        batchId: entitlements.batchId,
      })
      .from(entitlements)
      .where(eq(entitlements.id, input.entitlementId))
      .limit(1);

    if (!row) return { state: "not_found" };
    if (row.source !== "venue_edition") return { state: "not_sponsored" };

    // The minted duration is the venue's own floor when it knew a long-lead
    // date at issue time. Recovered through the redeem source ref.
    let mintedDurationDays: number | null = null;
    const codeId = row.sourceRef?.startsWith("redeem:")
      ? row.sourceRef.slice("redeem:".length)
      : null;
    if (codeId) {
      const [lc] = await tx
        .select({ durationDays: licenseCodes.durationDays })
        .from(licenseCodes)
        .where(eq(licenseCodes.id, codeId))
        .limit(1);
      mintedDurationDays = lc?.durationDays ?? null;
    }

    const nextExpiry = extendedCoupleAccessExpiryMs({
      currentExpiresAtMs: row.expiresAt,
      redeemedAtMs: row.grantedAt,
      weddingDateMs: weddingDate,
      mintedDurationDays,
    });

    const dateChanged = (row.weddingDate ?? null) !== weddingDate;
    const expiryChanged = (row.expiresAt ?? null) !== (nextExpiry ?? null);
    if (!dateChanged && !expiryChanged) {
      return { state: "unchanged", entitlementId: row.id, expiresAt: row.expiresAt };
    }

    await tx
      .update(entitlements)
      .set({ weddingDate, expiresAt: nextExpiry, updatedAt: Date.now() })
      .where(eq(entitlements.id, row.id));

    if (expiryChanged) {
      await appendEvent(tx, {
        action: "extend",
        entitlementId: row.id,
        userClerkId: row.userClerkId,
        batchId: row.batchId ?? null,
        actorId: actor.actorId,
        actorName: actor.actorName,
        reason: "wedding date recorded: access term recomputed, never shortened",
        before: { expiresAt: row.expiresAt },
        after: { expiresAt: nextExpiry },
        origin: input.origin ?? "wedding-date",
      });
    }

    return {
      state: "updated",
      entitlementId: row.id,
      expiresAt: nextExpiry,
      extendedBy: (nextExpiry ?? 0) - (row.expiresAt ?? 0),
    };
  });
}
