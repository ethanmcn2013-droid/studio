import "server-only";
import { and, eq, lt } from "drizzle-orm";
import { sponsorUsageEvents, sponsorWorkspaceLifecycle, sponsorUsageDaily, sponsorReportSnapshots } from "@/lib/entitlements-db/schema";
import { usageErasureTombstones, usageSubjectWorkspaces } from "./storage-schema";
import type { UsageDatabase } from "./verified-ingest";
import { RETENTION_MS } from "@/lib/sponsored-use/service-auth";
import { usageTransaction } from "./usage-transaction";
export async function eraseUsageSubject(database: UsageDatabase, epoch: string, subjectIdHash: string, now: number) {
  await usageTransaction(database, async tx => {
    await tx.insert(usageErasureTombstones).values({epoch,subjectIdHash,erasedAt:now})
      .onConflictDoNothing();
    const affected = await tx.select().from(usageSubjectWorkspaces).where(and(
      eq(usageSubjectWorkspaces.epoch,epoch),eq(usageSubjectWorkspaces.subjectIdHash,subjectIdHash)));
    for(const row of affected) {
      // A shared workspace's lifecycle cannot retain a fact contributed by an
      // erased actor. Remove conservatively; future legitimate work rebuilds it.
      await tx.delete(sponsorWorkspaceLifecycle).where(and(eq(sponsorWorkspaceLifecycle.sponsorId,row.sponsorId),
        eq(sponsorWorkspaceLifecycle.hashSaltEpoch,epoch),eq(sponsorWorkspaceLifecycle.workspaceIdHash,row.workspaceIdHash)));
    }
    await tx.delete(sponsorUsageEvents).where(and(eq(sponsorUsageEvents.hashSaltEpoch,epoch),eq(sponsorUsageEvents.subjectIdHash,subjectIdHash)));
    await tx.delete(usageSubjectWorkspaces).where(and(eq(usageSubjectWorkspaces.epoch,epoch),eq(usageSubjectWorkspaces.subjectIdHash,subjectIdHash)));
  });
}
export async function retainUsage(database: UsageDatabase, now: number) {
  const old = new Date(now); old.setUTCMonth(old.getUTCMonth()-24);
  await usageTransaction(database, async tx => {
    await tx.delete(sponsorUsageEvents).where(lt(sponsorUsageEvents.occurredAt,now-RETENTION_MS));
    await tx.delete(usageErasureTombstones).where(lt(usageErasureTombstones.erasedAt,now-RETENTION_MS-300_000));
    await tx.delete(usageSubjectWorkspaces).where(lt(usageSubjectWorkspaces.updatedAt,old.getTime()));
    await tx.delete(sponsorWorkspaceLifecycle).where(lt(sponsorWorkspaceLifecycle.updatedAt,old.getTime()));
    await tx.delete(sponsorUsageDaily).where(lt(sponsorUsageDaily.localDate,old.toISOString().slice(0,10)));
    await tx.delete(sponsorReportSnapshots).where(lt(sponsorReportSnapshots.periodEnd,old.toISOString().slice(0,10)));
  });
}
