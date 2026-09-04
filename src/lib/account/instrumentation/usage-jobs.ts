import "server-only";
import { and, asc, eq, gte, isNull, lte, sql } from "drizzle-orm";
import { sponsors, sponsorUsageEvents, sponsorUsageDaily, sponsorWorkspaceLifecycle } from "@/lib/entitlements-db/schema";
import type { UsageClaimProof } from "@/lib/sponsored-use/proof";
import { addLocalDays, isLocalDayClosed, toLocalDate } from "./local-date";
import { rollupDaily } from "./rollup";
import { repairVerifiedUsage, type UsageDatabase, type VerificationDependencies } from "./verified-ingest";
import { retainUsage } from "./usage-erasure";
import { usageTransaction } from "./usage-transaction";
import { usageErasureTombstones } from "./storage-schema";

export type JobDependencies = VerificationDependencies & {
  /** Complete bounded canonical claim enumeration, not an event-sender count.
   * Throw on partial pages/outage; never present partial enumeration as exact. */
  eligible: (sponsorId:string,epoch:string,start:number,end:number) => Promise<UsageClaimProof[]>;
};
export async function closeUsageDays(database: UsageDatabase, deps: JobDependencies, now: number) {
  try { return await persistClosedUsageDays(database, deps, now); }
  finally {
    // A failed repair/denominator must not extend personal-event retention.
    // Lost coverage stays missing rather than retaining raw events indefinitely.
    await retainUsage(database, now);
  }
}
async function persistClosedUsageDays(database: UsageDatabase, deps: JobDependencies, now: number) {
  await repairVerifiedUsage(database,deps,now);
  const venues = await database.select({id:sponsors.id,timezone:sponsors.reportingTimezone}).from(sponsors).orderBy(asc(sponsors.id)).limit(101);
  if(venues.length > 100) throw new Error("Usage job requires bounded venue partition");
  let days = 0;
  for(const venue of venues) {
    const timezone = venue.timezone ?? "Europe/Dublin";
    // Leave a full minute margin for rounded retention boundaries.
    const start = now-34*86400000;
    const rows = await database.select().from(sponsorUsageEvents).where(and(
      eq(sponsorUsageEvents.sponsorId,venue.id),gte(sponsorUsageEvents.occurredAt,start),lte(sponsorUsageEvents.occurredAt,now)));
    const groups = new Map<string, Set<string>>();
    const populations = new Map<string,UsageClaimProof[]>();
    for(const row of rows) {
      if(!isLocalDayClosed(row.localDate,now,timezone)) continue;
      const epochs = groups.get(row.localDate) ?? new Set<string>(); epochs.add(row.hashSaltEpoch);groups.set(row.localDate,epochs);
    }
    for(const [date,epochs] of [...groups].sort()) {
      // Existing daily PK cannot hold two epochs. Rotation is missing coverage,
      // not a merged count or a replacement of one population with another.
      if(epochs.size !== 1) {
        await database.delete(sponsorUsageDaily).where(and(eq(sponsorUsageDaily.sponsorId,venue.id),eq(sponsorUsageDaily.localDate,date)));
        continue;
      }
      const epoch = [...epochs][0];
      let claims = populations.get(epoch);
      if(!claims) { claims=await deps.eligible(venue.id,epoch,start,now);populations.set(epoch,claims); }
      const population=claims;
      // Fetch again inside writer transaction: erase cannot win between a raw
      // snapshot and persistence and resurrect erased lifecycle facts.
      await usageTransaction(database, async tx => {
        const erased = new Set((await tx.select().from(usageErasureTombstones).where(eq(usageErasureTombstones.epoch,epoch))).map(row=>row.subjectIdHash));
        const eligible = new Set(population.filter(c => !erased.has(c.subjectIdHash) && c.sponsorId===venue.id && c.epoch===epoch &&
          toLocalDate(c.grantStartsAt,timezone)<=date && toLocalDate(c.grantEndsAt-1,timezone)>=date).map(c=>c.workspaceIdHash)).size;
        const events = await tx.select().from(sponsorUsageEvents).where(and(eq(sponsorUsageEvents.sponsorId,venue.id),
          eq(sponsorUsageEvents.localDate,date),eq(sponsorUsageEvents.hashSaltEpoch,epoch)));
        if(events.length===0) {
          await tx.delete(sponsorUsageDaily).where(and(eq(sponsorUsageDaily.sponsorId,venue.id),eq(sponsorUsageDaily.localDate,date)));
          return;
        }
        const previous = await tx.select().from(sponsorWorkspaceLifecycle).where(and(
          eq(sponsorWorkspaceLifecycle.sponsorId,venue.id),eq(sponsorWorkspaceLifecycle.hashSaltEpoch,epoch)));
        const output = rollupDaily({sponsorId:venue.id,hashSaltEpoch:epoch,dates:[date],
          events:events.map(e=>({...e,sponsorId:venue.id,product:"tasks" as const})),
          coveredProducts:["tasks"],expectedProducts:["notes","tasks","timeline","signal"],
          knownWorkspaces:new Set(previous.filter(p=>p.firstActionLocalDate<date).map(p=>p.workspaceIdHash)),eligibleByDate:{[date]:eligible}});
        const row = output.daily[0];
        const values = {
          sponsorId:venue.id,localDate:date,hashSaltEpoch:epoch,timezone,
          activeWorkspaces:row.activeWorkspaces,activeSubjects:row.activeSubjects,firstActionWorkspaces:row.firstActionWorkspaces,
          eligibleWorkspaces:eligible,meaningfulActions:row.meaningfulActions,
          tasksActions:row.perProduct.tasks?.actions ?? 0,tasksWorkspaces:row.perProduct.tasks?.workspaces ?? 0,
          notesActions:null,notesWorkspaces:null,timelineActions:null,timelineWorkspaces:null,signalActions:null,signalWorkspaces:null,
          coverageMask:2,expectedMask:15,dataThrough:now,computedAt:now,
        };
        const [priorDay] = await tx.select().from(sponsorUsageDaily).where(and(eq(sponsorUsageDaily.sponsorId,venue.id),eq(sponsorUsageDaily.localDate,date)));
        if(priorDay && priorDay.hashSaltEpoch !== epoch) { await tx.delete(sponsorUsageDaily).where(and(eq(sponsorUsageDaily.sponsorId,venue.id),eq(sponsorUsageDaily.localDate,date))); return; }
        await tx.insert(sponsorUsageDaily).values(values).onConflictDoUpdate({
          target:[sponsorUsageDaily.sponsorId,sponsorUsageDaily.localDate,sponsorUsageDaily.metricDictionaryVersion],
          set:{...values,revision:sql`${sponsorUsageDaily.revision}+1`,lastRepairedAt:now},
        });
        for(const delta of output.lifecycle) {
          const prior = previous.find(p=>p.workspaceIdHash===delta.workspaceIdHash);
          const first = prior && prior.firstActionLocalDate<delta.firstActionLocalDate ? prior.firstActionLocalDate : delta.firstActionLocalDate;
          const last = prior && prior.lastActionLocalDate>delta.lastActionLocalDate ? prior.lastActionLocalDate : delta.lastActionLocalDate;
          await tx.insert(sponsorWorkspaceLifecycle).values({sponsorId:venue.id,workspaceIdHash:delta.workspaceIdHash,hashSaltEpoch:epoch,
            firstActionLocalDate:first,lastActionLocalDate:last,tasksLastActionLocalDate:last,updatedAt:now})
            .onConflictDoUpdate({target:[sponsorWorkspaceLifecycle.sponsorId,sponsorWorkspaceLifecycle.workspaceIdHash,sponsorWorkspaceLifecycle.hashSaltEpoch],
              set:{firstActionLocalDate:first,lastActionLocalDate:last,tasksLastActionLocalDate:last,updatedAt:now}});
        }
      });
      days++;
    }
    // Silence must close as unknown even when no later event triggers a daily
    // rollup. CAS only existing unsealed rows, so erasure cannot be undone.
    const open = await database.select().from(sponsorWorkspaceLifecycle).where(and(
      eq(sponsorWorkspaceLifecycle.sponsorId,venue.id),isNull(sponsorWorkspaceLifecycle.day30SealedAt)));
    for(const row of open) if(isLocalDayClosed(addLocalDays(row.firstActionLocalDate,35),now,timezone))
      await database.update(sponsorWorkspaceLifecycle).set({day30State:"indeterminate",day30SealedAt:now}).where(and(
        eq(sponsorWorkspaceLifecycle.sponsorId,venue.id),eq(sponsorWorkspaceLifecycle.workspaceIdHash,row.workspaceIdHash),
        eq(sponsorWorkspaceLifecycle.hashSaltEpoch,row.hashSaltEpoch),isNull(sponsorWorkspaceLifecycle.day30SealedAt)));
  }
  return {days};
}
