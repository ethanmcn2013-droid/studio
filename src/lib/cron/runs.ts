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
};

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
