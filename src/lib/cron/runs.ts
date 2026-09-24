import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cronRuns, type CronRun, type CronRunSource } from "@/lib/db/schema";

export type CronHealthStatus = "green" | "amber" | "red" | "never";

export interface CronHealth {
  source: CronRunSource;
  status: CronHealthStatus;
  lastRun: CronRun | null;
  hoursSinceLastRun: number | null;
  expectedCadenceHours: number;
}

const EXPECTED_CADENCE_HOURS: Record<CronRunSource, number> = {
  analytics_daily: 24,
  tasks_digest: 24,
  app_analytics_snapshots: 24,
  app_drive_grant_repair: 24,
};

/**
 * The scheduled jobs HQ monitors: the App's three Vercel crons. The plan is
 * Hobby, so each fires at some point within its scheduled hour.
 */
export const MONITORED_CRON_JOBS: ReadonlyArray<{
  source: CronRunSource;
  label: string;
  schedule: string;
}> = [
  { source: "app_analytics_snapshots", label: "App · analytics snapshots", schedule: "02:30 UTC daily, within the hour" },
  { source: "app_drive_grant_repair", label: "App · Drive grant repair", schedule: "03:15 UTC daily, within the hour" },
  { source: "tasks_digest", label: "App · daily digest", schedule: "09:00 UTC daily, within the hour" },
];

const AMBER_AFTER_HOURS = 12;
const RED_AFTER_HOURS = 26;

export async function getLatestCronRun(
  source: CronRunSource,
): Promise<CronRun | null> {
  try {
    const rows = await db
      .select()
      .from(cronRuns)
      .where(eq(cronRuns.source, source))
      .orderBy(desc(cronRuns.ranAt))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getCronHealth(source: CronRunSource): Promise<CronHealth> {
  const lastRun = await getLatestCronRun(source);
  const expectedCadenceHours = EXPECTED_CADENCE_HOURS[source];

  if (!lastRun) {
    return {
      source,
      status: "never",
      lastRun: null,
      hoursSinceLastRun: null,
      expectedCadenceHours,
    };
  }

  const hoursSinceLastRun = (Date.now() - lastRun.ranAt) / (60 * 60 * 1000);

  let status: CronHealthStatus;
  if (lastRun.ok === 0) {
    status = "red";
  } else if (hoursSinceLastRun > RED_AFTER_HOURS) {
    status = "red";
  } else if (hoursSinceLastRun > AMBER_AFTER_HOURS) {
    status = "amber";
  } else {
    status = "green";
  }

  return {
    source,
    status,
    lastRun,
    hoursSinceLastRun,
    expectedCadenceHours,
  };
}
