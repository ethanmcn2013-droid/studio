import "server-only";
import { and, eq, lt } from "drizzle-orm";
import { sponsorUsageEvents, sponsorWorkspaceLifecycle, sponsorUsageDaily, sponsorReportSnapshots } from "@/lib/entitlements-db/schema";
import { usageErasureTombstones, usageWorkspaceErasureTombstones, usageSubjectWorkspaces } from "./storage-schema";
import type { UsageDatabase } from "./verified-ingest";
import { RETENTION_MS } from "@/lib/sponsored-use/service-auth";
import { usageTransaction, type UsageTransaction } from "./usage-transaction";
import { invalidateProgrammeReports, retainProgrammeContributions } from "@/lib/sponsor-programme/integration";

export type UsageReportInvalidator = (tx: UsageTransaction, sponsorIds: readonly string[]) => Promise<void>;

async function invalidateStoredUsage(tx: UsageTransaction, sponsorIds: readonly string[], epoch: string,
  invalidateReports?: UsageReportInvalidator) {
  for (const sponsorId of sponsorIds) {
    // Raw events expire before the aggregate. Once a person's contribution is
    // erased, a historical daily count cannot be reconstructed as exact.
    await tx.delete(sponsorUsageDaily).where(and(eq(sponsorUsageDaily.sponsorId, sponsorId),
      eq(sponsorUsageDaily.hashSaltEpoch, epoch)));
    await tx.delete(sponsorReportSnapshots).where(eq(sponsorReportSnapshots.sponsorId, sponsorId));
  }
  if (sponsorIds.length) {
    await invalidateProgrammeReports(tx, sponsorIds);
    await invalidateReports?.(tx, sponsorIds);
  }
}

export async function eraseUsageSubject(database: UsageDatabase, epoch: string, subjectIdHash: string, now: number,
  invalidateReports?: UsageReportInvalidator) {
  return usageTransaction(database, async tx => {
    await tx.insert(usageErasureTombstones).values({epoch,subjectIdHash,erasedAt:now}).onConflictDoNothing();
    const affected = await tx.select().from(usageSubjectWorkspaces).where(and(
      eq(usageSubjectWorkspaces.epoch,epoch),eq(usageSubjectWorkspaces.subjectIdHash,subjectIdHash)));
    const raw = await tx.select({sponsorId:sponsorUsageEvents.sponsorId}).from(sponsorUsageEvents).where(and(
      eq(sponsorUsageEvents.hashSaltEpoch,epoch),eq(sponsorUsageEvents.subjectIdHash,subjectIdHash)));
    const sponsorIds = [...new Set([...affected.map(row=>row.sponsorId),...raw.map(row=>row.sponsorId).filter((id):id is string=>id!==null)])];
    for (const row of affected) {
      await tx.delete(sponsorWorkspaceLifecycle).where(and(eq(sponsorWorkspaceLifecycle.sponsorId,row.sponsorId),
        eq(sponsorWorkspaceLifecycle.hashSaltEpoch,epoch),eq(sponsorWorkspaceLifecycle.workspaceIdHash,row.workspaceIdHash)));
    }
    await tx.delete(sponsorUsageEvents).where(and(eq(sponsorUsageEvents.hashSaltEpoch,epoch),eq(sponsorUsageEvents.subjectIdHash,subjectIdHash)));
    await tx.delete(usageSubjectWorkspaces).where(and(eq(usageSubjectWorkspaces.epoch,epoch),eq(usageSubjectWorkspaces.subjectIdHash,subjectIdHash)));
    await invalidateStoredUsage(tx, sponsorIds, epoch, invalidateReports);
    return sponsorIds;
  });
}

export async function eraseUsageWorkspace(database: UsageDatabase, epoch: string, workspaceIdHash: string, sponsorId: string, now: number,
  invalidateReports?: UsageReportInvalidator) {
  return usageTransaction(database, async tx => {
    await tx.insert(usageWorkspaceErasureTombstones).values({epoch,workspaceIdHash,erasedAt:now}).onConflictDoNothing();
    const indexed = await tx.select().from(usageSubjectWorkspaces).where(and(
      eq(usageSubjectWorkspaces.epoch,epoch),eq(usageSubjectWorkspaces.workspaceIdHash,workspaceIdHash)));
    const raw = await tx.select({sponsorId:sponsorUsageEvents.sponsorId}).from(sponsorUsageEvents).where(and(
      eq(sponsorUsageEvents.hashSaltEpoch,epoch),eq(sponsorUsageEvents.workspaceIdHash,workspaceIdHash)));
    // The signed App grant supplies sponsorId even when this Project never
    // emitted an action, so a prior eligible-only report is still restricted.
    const sponsorIds = [...new Set([sponsorId,...indexed.map(row=>row.sponsorId),...raw.map(row=>row.sponsorId).filter((id):id is string=>id!==null)])];
    await tx.delete(sponsorUsageEvents).where(and(eq(sponsorUsageEvents.hashSaltEpoch,epoch),
      eq(sponsorUsageEvents.workspaceIdHash,workspaceIdHash)));
    await tx.delete(usageSubjectWorkspaces).where(and(eq(usageSubjectWorkspaces.epoch,epoch),
      eq(usageSubjectWorkspaces.workspaceIdHash,workspaceIdHash)));
    await tx.delete(sponsorWorkspaceLifecycle).where(and(eq(sponsorWorkspaceLifecycle.hashSaltEpoch,epoch),
      eq(sponsorWorkspaceLifecycle.workspaceIdHash,workspaceIdHash)));
    await invalidateStoredUsage(tx, sponsorIds, epoch, invalidateReports);
    return sponsorIds;
  });
}

export async function retainUsage(database: UsageDatabase, now: number) {
  const old = new Date(now); old.setUTCMonth(old.getUTCMonth()-24);
  await usageTransaction(database, async tx => {
    await tx.delete(sponsorUsageEvents).where(lt(sponsorUsageEvents.occurredAt,now-RETENTION_MS));
    await tx.delete(usageErasureTombstones).where(lt(usageErasureTombstones.erasedAt,now-RETENTION_MS-300_000));
    await tx.delete(usageWorkspaceErasureTombstones).where(lt(usageWorkspaceErasureTombstones.erasedAt,old.getTime()));
    await tx.delete(usageSubjectWorkspaces).where(lt(usageSubjectWorkspaces.updatedAt,old.getTime()));
    await tx.delete(sponsorWorkspaceLifecycle).where(lt(sponsorWorkspaceLifecycle.updatedAt,old.getTime()));
    await tx.delete(sponsorUsageDaily).where(lt(sponsorUsageDaily.localDate,old.toISOString().slice(0,10)));
    await tx.delete(sponsorReportSnapshots).where(lt(sponsorReportSnapshots.periodEnd,old.toISOString().slice(0,10)));
    await retainProgrammeContributions(tx,now);
  });
}
