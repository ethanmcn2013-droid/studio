import "server-only";
import { and, asc, eq, isNull } from "drizzle-orm";
import type { entitlementsDb } from "@/lib/entitlements-db/client";
import { sponsorUsageEvents } from "@/lib/entitlements-db/schema";
import { usageErasureTombstones, usageSubjectWorkspaces } from "./storage-schema";
import { validateMeaningfulAction, type VenueMeaningfulActionV1 } from "./event-schema";
import { toLocalDate } from "./local-date";
import { digest, RETENTION_MS } from "@/lib/sponsored-use/service-auth";
import { parseClaimProof, type UsageClaimProof, type UsageEventProof } from "@/lib/sponsored-use/proof";
import { usageTransaction } from "./usage-transaction";

export type UsageDatabase = ReturnType<typeof entitlementsDb>;
export type CanonicalUsageIssuance = {
  issuanceId: string; licenseCodeId: string; codeFingerprint: string; sponsorId: string;
  environment: "internal_test" | "production"; issuedAt: number; timezone: string;
};
export type VerificationDependencies = {
  proof: (eventId: string, epoch: string) => Promise<UsageEventProof | null>;
  canonical: (proof: UsageClaimProof) => Promise<CanonicalUsageIssuance | null>;
  environment: "internal_test" | "production";
};
export function strictTaskEvent(payload: unknown, now: number): VenueMeaningfulActionV1 | null {
  const checked = validateMeaningfulAction(payload);
  if(!checked.ok) return null;
  const e = checked.event;
  return e.product === "tasks" && e.kind === "task_created" &&
    /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(e.eventId) &&
    Number.isSafeInteger(e.occurredAt) && e.occurredAt % 60_000 === 0 &&
    e.occurredAt > now - RETENTION_MS && e.occurredAt <= now + 300_000 ? e : null;
}
export async function verifiedEventSponsor(event: VenueMeaningfulActionV1, epoch: string, deps: VerificationDependencies) {
  const raw = await deps.proof(event.eventId, epoch);
  const proof = parseClaimProof(raw);
  if(!raw || !proof || raw.eventId !== event.eventId || raw.eventDigest !== digest(JSON.stringify(event)) ||
    proof.epoch !== epoch || proof.environment !== deps.environment ||
    proof.subjectIdHash !== event.subjectIdHash || proof.workspaceIdHash !== event.workspaceIdHash ||
    event.occurredAt < Math.floor(proof.grantStartsAt / 60_000) * 60_000 || event.occurredAt >= proof.grantEndsAt) return null;
  // App attests the *unrounded*, private committed instant is inside this exact
  // interval. Digest binding avoids losing valid first-minute work to rounding.
  const canonical = await deps.canonical(proof);
  if(!canonical || canonical.issuanceId !== proof.issuanceId || canonical.licenseCodeId !== proof.licenseCodeId ||
    canonical.codeFingerprint !== proof.codeFingerprint || canonical.sponsorId !== proof.sponsorId ||
    canonical.environment !== proof.environment || canonical.issuedAt !== proof.issuedAt) return null;
  return canonical;
}
function eventFromRow(row: typeof sponsorUsageEvents.$inferSelect): VenueMeaningfulActionV1 {
  return { eventId:row.eventId,instrumentationVersion:"instrumentation.v1",product:"tasks",kind:"task_created",
    occurredAt:row.occurredAt,subjectIdHash:row.subjectIdHash,workspaceIdHash:row.workspaceIdHash };
}
/** Initial delivery and repair have exactly one attribution implementation. */
export async function ingestVerifiedUsage(database: UsageDatabase, event: VenueMeaningfulActionV1,
  epoch: string, deps: VerificationDependencies, now: number): Promise<"stored" | "conflict" | "erased"> {
  const canonical = await verifiedEventSponsor(event, epoch, deps); // no network while holding SQLite writer
  const localDate = toLocalDate(event.occurredAt, canonical?.timezone);
  return usageTransaction(database, async tx => {
    const [erased] = await tx.select().from(usageErasureTombstones).where(and(
      eq(usageErasureTombstones.epoch, epoch), eq(usageErasureTombstones.subjectIdHash, event.subjectIdHash)));
    if(erased) return "erased";
    const [prior] = await tx.select().from(sponsorUsageEvents).where(eq(sponsorUsageEvents.eventId,event.eventId));
    if(prior && (prior.hashSaltEpoch !== epoch || JSON.stringify(eventFromRow(prior)) !== JSON.stringify(event) ||
      prior.product !== "tasks" || prior.kind !== "task_created" || prior.instrumentationVersion !== "instrumentation.v1")) return "conflict";
    // Exact replay cannot rewrite a verified historical fact. Current revocation
    // prevents initial/repair attribution; the erasure tombstone above dominates.
    if(prior?.sponsorId) return "stored";
    const attribution = { sponsorId:canonical?.sponsorId ?? null, attributionState: canonical ? "attributed" as const : "unattributed" as const,
      attributionReason:canonical ? null : "canonical-proof-unavailable", localDate };
    if(prior) {
      await tx.update(sponsorUsageEvents).set(attribution).where(eq(sponsorUsageEvents.eventId,event.eventId));
    } else {
      await tx.insert(sponsorUsageEvents).values({ ...event,...attribution,hashSaltEpoch:epoch,ingestedAt:now });
    }
    if(canonical) await tx.insert(usageSubjectWorkspaces).values({
      epoch,subjectIdHash:event.subjectIdHash,workspaceIdHash:event.workspaceIdHash,sponsorId:canonical.sponsorId,updatedAt:now,
    }).onConflictDoUpdate({ target:[usageSubjectWorkspaces.epoch,usageSubjectWorkspaces.subjectIdHash,usageSubjectWorkspaces.workspaceIdHash,usageSubjectWorkspaces.sponsorId],
      set:{ updatedAt:now } });
    return "stored";
  });
}
export async function repairVerifiedUsage(database: UsageDatabase, deps: VerificationDependencies, now: number): Promise<number> {
  const pending = await database.select().from(sponsorUsageEvents).where(isNull(sponsorUsageEvents.sponsorId))
    .orderBy(asc(sponsorUsageEvents.ingestedAt)).limit(100);
  let repaired = 0;
  for(const row of pending) {
    const event = strictTaskEvent(eventFromRow(row), now);
    if(!event) continue;
    await ingestVerifiedUsage(database,event,row.hashSaltEpoch,deps,now);
    const [after] = await database.select().from(sponsorUsageEvents).where(eq(sponsorUsageEvents.eventId,row.eventId));
    if(after?.sponsorId) repaired++;
  }
  return repaired;
}
