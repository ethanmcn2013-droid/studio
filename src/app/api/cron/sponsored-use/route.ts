import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { runNightlyMaintenance } from "@/lib/account/instrumentation/nightly";
import { drizzleNightlyStore } from "@/lib/account/instrumentation/nightly-db";
import {
  DEFAULT_ACCOUNT_TIME_ZONE,
  toLocalDate,
} from "@/lib/account/instrumentation/local-date";
import { MAX_SEALING_GAP_DAYS } from "@/lib/account/instrumentation/sealing";

/**
 * Nightly sponsored-use maintenance.
 *
 * The four jobs run here in one handler rather than on four schedules, because
 * their order is load-bearing and independent crons could interleave:
 *
 *   1. repair the attribution of events that arrived before their redemption;
 *   2. roll up closed days into the daily projection;
 *   3. seal day-30 bands whose evidence is still present;
 *   4. only then sweep events past retention.
 *
 * Sweeping before the rollup would delete the evidence for a day nobody had
 * counted yet, and the events cannot be recovered. `runNightlyMaintenance`
 * makes that impossible rather than merely discouraged: it returns the order it
 * actually executed, and it refuses to sweep at all if a step in front of the
 * sweep failed. Holding events past retention is recoverable. Deleting
 * uncounted days is not.
 *
 * ## The sealing interlock, in the response and not in a runbook
 *
 * A day-30 band's earliest day is 10 days old when the band closes, against a
 * 35-day retention. If this job falls more than MAX_SEALING_GAP_DAYS behind,
 * bands start closing over days whose events are already gone, and those
 * cohorts seal `indeterminate` permanently. `sealing.cadence` and `alert` carry
 * that, and a breach answers 500 so the platform's own cron alerting fires. A
 * clock running against data that cannot be rebuilt is not a quiet warning.
 *
 * Auth is the same CRON_SECRET bearer the access-reconcile job uses.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authOk(req: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const presented = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function entitlementsConfigured(): boolean {
  return Boolean(process.env.ENTITLEMENTS_DATABASE_URL);
}

async function run(dryRun: boolean): Promise<NextResponse> {
  if (!entitlementsConfigured()) {
    // Not an error. Until the entitlements database is reachable there is
    // nothing to roll up, and a red cron every night trains people to ignore it.
    return NextResponse.json({
      ok: true,
      skipped: "entitlements-not-configured",
      note: "Apply the sponsored-use migration and set the entitlements credentials to enable this job.",
      sealingCadenceDays: MAX_SEALING_GAP_DAYS,
    });
  }

  const now = Date.now();
  const outcome = await runNightlyMaintenance(drizzleNightlyStore(), {
    now,
    todayLocalDate: toLocalDate(now, DEFAULT_ACCOUNT_TIME_ZONE),
    dryRun,
    timeZone: DEFAULT_ACCOUNT_TIME_ZONE,
  });

  const body = {
    ...outcome,
    sealingCadenceDays: MAX_SEALING_GAP_DAYS,
    // Stated every night, healthy or not, so nobody has to know the number.
    sealingInterlock:
      `The sealing job must run at least every ${MAX_SEALING_GAP_DAYS} days. ` +
      "Raw events are deleted at 35 days, and a band that closes after its " +
      "evidence was swept seals indeterminate and cannot be rebuilt.",
  };

  // A failed step or a breached cadence answers non-2xx so cron alerting fires.
  return NextResponse.json(body, { status: outcome.ok ? 200 : 500 });
}

export async function GET(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const dryRun = new URL(req.url).searchParams.get("dryRun") === "1";
  try {
    return await run(dryRun);
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "sponsored-use-cron-failed" },
      { status: 500 },
    );
  }
}
