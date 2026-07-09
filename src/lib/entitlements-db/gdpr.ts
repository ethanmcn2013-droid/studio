import "server-only";
import { and, eq, isNotNull, ne } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { appendEvent } from "./audit";
import { requireActor, type MutationActor } from "./guard";
import { entitlements, licenseCodes, redemptions } from "./schema";

/**
 * GDPR crypto-shred + retention (decided in gdpr-data-lifecycle-policy).
 *
 * PII is stored only as salted hashes (email_hash, recipient_email_hash,
 * ip_hash) plus the free-text user_agent. Shredding nulls those, leaving an
 * anonymized financial/audit skeleton (tier, dates, amounts, the
 * pseudonymous Clerk id) that is retained for the 6-year window. The
 * append-only entitlement_events hash-chain excludes PII by construction, so
 * shredding can never break tamper-evidence — the shred is itself recorded as
 * a `shred` event.
 */

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
/** PII is purged 24 months after a person's access ends. */
export const PII_RETENTION_MS = 24 * MONTH_MS;

export type ShredResult = { entitlements: number; redemptions: number; codes: number };

/**
 * Crypto-shred one person's PII across the shared DB, keeping the anonymized
 * skeleton. Triggered by a Clerk user.deleted webhook or an erasure request.
 * Idempotent: re-running finds nothing left to null.
 */
export async function shredPersonPII(input: {
  userClerkId: string;
  actor: MutationActor;
  reason?: string;
  origin?: string | null;
}): Promise<ShredResult> {
  if (!input.userClerkId) throw new Error("shredPersonPII: userClerkId required");
  const actor = requireActor(input.actor);
  const db = entitlementsDb();
  const now = Date.now();

  return db.transaction(async (tx) => {
    const entRows = await tx
      .select({ id: entitlements.id })
      .from(entitlements)
      .where(eq(entitlements.userClerkId, input.userClerkId));
    const redRows = await tx
      .select({ id: redemptions.id })
      .from(redemptions)
      .where(eq(redemptions.userClerkId, input.userClerkId));
    const codeRows = await tx
      .select({ id: licenseCodes.id })
      .from(licenseCodes)
      .where(eq(licenseCodes.redeemedByUserId, input.userClerkId));

    // Null the PII hashes; keep the skeleton (tier, dates, amounts). clerk_id
    // stays as the pseudonymous join key and is marked dead.
    await tx
      .update(entitlements)
      .set({ emailHash: null, clerkIdDead: 1, updatedAt: now })
      .where(eq(entitlements.userClerkId, input.userClerkId));
    await tx
      .update(redemptions)
      .set({ ipHash: null, userAgent: null })
      .where(eq(redemptions.userClerkId, input.userClerkId));
    await tx
      .update(licenseCodes)
      .set({ recipientEmailHash: null, updatedAt: now })
      .where(eq(licenseCodes.redeemedByUserId, input.userClerkId));

    await appendEvent(tx, {
      action: "shred",
      userClerkId: input.userClerkId,
      actorId: actor.actorId,
      actorName: actor.actorName,
      reason: input.reason ?? "gdpr crypto-shred",
      // NON-PII counts only; no email/ip ever enters the ledger.
      after: {
        entitlements: entRows.length,
        redemptions: redRows.length,
        codes: codeRows.length,
      },
      origin: input.origin ?? "gdpr",
    });

    return { entitlements: entRows.length, redemptions: redRows.length, codes: codeRows.length };
  });
}

export type RetentionResult = { candidates: number; shredded: number };

/**
 * Retention sweep for the reconcile cron: shred PII for anyone whose access
 * ended more than PII_RETENTION_MS ago and who still holds a PII hash. A
 * person is a candidate only when they have NO active row and their newest
 * row ended before the cutoff. Capped per run; each shred is audited.
 */
export async function retentionSweep(input: {
  actor: MutationActor;
  limit?: number;
  olderThanMs?: number;
}): Promise<RetentionResult> {
  const actor = requireActor(input.actor);
  const cap = input.limit ?? 200;
  const cutoff = Date.now() - (input.olderThanMs ?? PII_RETENTION_MS);
  const db = entitlementsDb();

  // Candidate rows: still hold an email_hash and are not active.
  const rows = await db
    .select({
      userClerkId: entitlements.userClerkId,
      status: entitlements.status,
      expiresAt: entitlements.expiresAt,
      grantedAt: entitlements.grantedAt,
      emailHash: entitlements.emailHash,
    })
    .from(entitlements)
    .where(and(isNotNull(entitlements.emailHash), ne(entitlements.status, "active")));

  // Group by person; keep only those with NO active row and a newest end
  // before the cutoff. (A person's active row elsewhere excludes them.)
  const byUser = new Map<string, { anyActive: boolean; newestEnd: number }>();
  const allByUser = await db
    .select({
      userClerkId: entitlements.userClerkId,
      status: entitlements.status,
      expiresAt: entitlements.expiresAt,
      grantedAt: entitlements.grantedAt,
    })
    .from(entitlements);
  for (const r of allByUser) {
    const end = r.expiresAt ?? r.grantedAt;
    const cur = byUser.get(r.userClerkId) ?? { anyActive: false, newestEnd: 0 };
    cur.anyActive = cur.anyActive || r.status === "active";
    cur.newestEnd = Math.max(cur.newestEnd, end);
    byUser.set(r.userClerkId, cur);
  }

  const candidates = Array.from(new Set(rows.map((r) => r.userClerkId))).filter((id) => {
    const agg = byUser.get(id);
    return agg && !agg.anyActive && agg.newestEnd < cutoff;
  });

  let shredded = 0;
  for (const id of candidates.slice(0, cap)) {
    await shredPersonPII({
      userClerkId: id,
      actor,
      reason: "gdpr retention: access ended beyond the PII retention window",
      origin: "reconcile",
    });
    shredded += 1;
  }

  return { candidates: candidates.length, shredded };
}
