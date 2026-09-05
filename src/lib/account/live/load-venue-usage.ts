import "server-only";
import { and, asc, eq, gte, lte } from "drizzle-orm";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import { sponsors, sponsorUsageDaily, sponsorWorkspaceLifecycle } from "@/lib/entitlements-db/schema";
import { isHqPasswordConfigured } from "@/lib/hq/auth";
import { loadVenueAccessSnapshot, type LoadVenueAccessResult } from "./load-venue-access";
import { projectVenueUsageSnapshot } from "./project-venue-usage";
import { assertSnapshotPrivacy } from "../privacy";
import { addLocalDays, isLocalDayClosed, toLocalDate } from "../instrumentation/local-date";
import type { StoredDailyRow, StoredLifecycleRow } from "../instrumentation/daily-metrics";
import type { UsageDatabase } from "../instrumentation/verified-ingest";
import type { AccountSnapshot } from "../types";

/** Called only after the existing HQ action/download authentication guard. */
export async function loadVenueUsageSnapshot(slug: string): Promise<LoadVenueAccessResult> {
  if(!isHqPasswordConfigured()) return {ok:false,error:"HQ access unavailable."};
  const access = await loadVenueAccessSnapshot(slug);
  if(!access.ok || process.env.SPONSOR_USAGE_EVENTS !== "1") return access;
  try {
    return {ok:true,snapshot:await overlayStoredUsage(entitlementsDb(),slug,access.snapshot,Date.now())};
  } catch {
    // Preserve truthful access; no SQL, bearer code or private projection leaks.
    return access;
  }
}
export async function overlayStoredUsage(database: UsageDatabase, slug: string, access: AccountSnapshot, now: number): Promise<AccountSnapshot> {
  const [venue] = await database.select({id:sponsors.id,timezone:sponsors.reportingTimezone}).from(sponsors).where(eq(sponsors.slug,slug));
  if(!venue) return access;
  const timezone = venue.timezone ?? "Europe/Dublin";
  let end = addLocalDays(toLocalDate(now,timezone),-1);
  if(!isLocalDayClosed(end,now,timezone)) end = addLocalDays(end,-1);
  const start = addLocalDays(end,-29);
  const data = await database.select().from(sponsorUsageDaily).where(and(eq(sponsorUsageDaily.sponsorId,venue.id),
    gte(sponsorUsageDaily.localDate,start),lte(sponsorUsageDaily.localDate,end))).orderBy(asc(sponsorUsageDaily.localDate));
  const epochs = new Set(data.map(r=>r.hashSaltEpoch));
  // No cross-epoch distinct count: an epoch break stays unavailable.
  if(epochs.size !== 1) return access;
  const epoch = [...epochs][0];
  const life = await database.select().from(sponsorWorkspaceLifecycle).where(and(
    eq(sponsorWorkspaceLifecycle.sponsorId,venue.id),eq(sponsorWorkspaceLifecycle.hashSaltEpoch,epoch)));
  const rows: StoredDailyRow[] = data.map(r=>({
    localDate:r.localDate,activeWorkspaces:r.activeWorkspaces,activeSubjects:r.activeSubjects,firstActionWorkspaces:r.firstActionWorkspaces,
    eligibleWorkspaces:r.eligibleWorkspaces,meaningfulActions:r.meaningfulActions,coverageMask:r.coverageMask,expectedMask:r.expectedMask,
    perProduct:{notes:null,tasks:{actions:r.tasksActions ?? 0,workspaces:r.tasksWorkspaces ?? 0},timeline:null,signal:null},
  }));
  const lifecycle: StoredLifecycleRow[] = life.map(r=>({workspaceIdHash:r.workspaceIdHash,firstActionLocalDate:r.firstActionLocalDate,
    lastActionLocalDate:r.lastActionLocalDate,productLastActionLocalDate:{tasks:r.tasksLastActionLocalDate ?? undefined},
    day30State:r.day30State,day30SealedAt:r.day30SealedAt}));
  const snapshot = projectVenueUsageSnapshot(access,{window:{start,end,trailing:true},rows,lifecycle,dataThrough:end});
  snapshot.coverage.detail += " Coverage is deliberate Tasks creation only. Other task actions and other products are not captured.";
  snapshot.productReach = snapshot.productReach.map(r=>r.product==="Tasks" ? {...r,supportingDetail:"Reached through deliberate task creation only"} : r);
  if(assertSnapshotPrivacy(snapshot).length) throw new Error("Usage projection unavailable");
  return snapshot;
}
