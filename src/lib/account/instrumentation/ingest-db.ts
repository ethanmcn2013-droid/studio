import "server-only";

import { and, eq, isNull, lt, sql } from "drizzle-orm";

import { entitlementsDb } from "@/lib/entitlements-db/client";
import {
  licenseCodes,
  redemptions,
  sponsorUsageEvents,
} from "@/lib/entitlements-db/schema";

import { toRedemptionLinks, type IngestDeps, type RawRedemptionRow } from "./ingest";

/**
 * The server half of ingest: the reads and writes that need a database.
 *
 * The pure half lives in `ingest.ts` and carries every decision worth testing,
 * which is why this file holds no logic beyond shaping rows.
 */

/** Raw events are held for 35 days. The projection survives; the stream does not. */
export const EVENT_RETENTION_DAYS = 35;

/**
 * The attribution chain, read as rows.
 *
 * `redemptions -> license_codes -> sponsors`. Revoked codes still count for the
 * window they covered: the recipient genuinely had access then, and rewriting
 * history when a code is later revoked would make past reports disagree with
 * themselves.
 */
export async function loadRedemptionRows(): Promise<RawRedemptionRow[]> {
  const rows = await entitlementsDb()
    .select({
      userClerkId: redemptions.userClerkId,
      sponsorId: licenseCodes.sponsorId,
      redeemedAt: redemptions.redeemedAt,
      sourceType: licenseCodes.sourceType,
    })
    .from(redemptions)
    .innerJoin(licenseCodes, eq(licenseCodes.id, redemptions.codeId));

  return rows.map((row) => ({
    userClerkId: row.userClerkId,
    sponsorId: row.sponsorId,
    redeemedAt: row.redeemedAt,
    // Seed and demo chains are excluded by attribution, not counted and hidden.
    origin: row.sourceType === "seed" || row.sourceType === "demo" ? "seed" : "production",
  }));
}

export async function loadRedemptionLinks(salt: string) {
  return toRedemptionLinks(await loadRedemptionRows(), salt);
}

/** Replaying an eventId lands on the same row rather than beside it. */
export function drizzleEventInsert(): IngestDeps["insert"] {
  return async (row) => {
    await entitlementsDb()
      .insert(sponsorUsageEvents)
      .values(row)
      .onConflictDoNothing({ target: sponsorUsageEvents.eventId });
  };
}

export type SweepResult = { deleted: number; cutoff: number; dryRun: boolean };

/**
 * Delete events past the retention horizon.
 *
 * The rollup must have already read a day before its events are swept; the
 * caller is responsible for that ordering, and the 35-day horizon is generous
 * enough that a late repair still has room.
 */
export async function sweepExpiredEvents(
  nowMs: number,
  options: { dryRun?: boolean } = {},
): Promise<SweepResult> {
  const cutoff = nowMs - EVENT_RETENTION_DAYS * 86_400_000;
  const db = entitlementsDb();

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(sponsorUsageEvents)
    .where(lt(sponsorUsageEvents.occurredAt, cutoff));

  if (options.dryRun) return { deleted: Number(count), cutoff, dryRun: true };

  await db.delete(sponsorUsageEvents).where(lt(sponsorUsageEvents.occurredAt, cutoff));
  return { deleted: Number(count), cutoff, dryRun: false };
}

/**
 * Re-attribute rows that arrived before their redemption was visible.
 *
 * Only `no-redemption` rows are retried. A row rejected for ambiguity or for a
 * non-production origin was rejected on the facts, and re-running it would only
 * produce the same answer more slowly.
 */
export async function repairUnattributed(
  links: ReadonlyArray<{ subjectIdHash: string; sponsorId: string; redeemedAt: number; endedAt?: number | null }>,
): Promise<number> {
  const db = entitlementsDb();
  let repaired = 0;
  for (const link of links) {
    const result = await db
      .update(sponsorUsageEvents)
      .set({ sponsorId: link.sponsorId, attributionState: "attributed", attributionReason: null })
      .where(
        and(
          isNull(sponsorUsageEvents.sponsorId),
          eq(sponsorUsageEvents.attributionReason, "no-redemption"),
          eq(sponsorUsageEvents.subjectIdHash, link.subjectIdHash),
        ),
      );
    repaired += Number(result.rowsAffected ?? 0);
  }
  return repaired;
}
