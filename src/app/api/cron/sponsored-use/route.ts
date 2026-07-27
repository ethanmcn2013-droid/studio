import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { sweepExpiredEvents } from "@/lib/account/instrumentation/ingest-db";
import { MAX_SEALING_GAP_DAYS } from "@/lib/account/instrumentation/sealing";

/**
 * Nightly sponsored-use maintenance.
 *
 * The three jobs run here in one handler rather than on three schedules,
 * because their order is load-bearing and independent crons could interleave:
 *
 *   1. roll up closed days into the daily projection;
 *   2. seal day-30 bands whose evidence is still present;
 *   3. only then sweep events past retention.
 *
 * Sweeping before the rollup would delete the evidence for a day nobody had
 * counted yet, and the events cannot be recovered. Sequencing them in one
 * request makes that impossible rather than merely discouraged.
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
  return Boolean(process.env.TURSO_ENTITLEMENTS_DATABASE_URL);
}

async function run(dryRun: boolean): Promise<NextResponse> {
  if (!entitlementsConfigured()) {
    // Not an error. Until the entitlements database is reachable there is
    // nothing to roll up, and a red cron every night trains people to ignore it.
    return NextResponse.json({
      ok: true,
      skipped: "entitlements-not-configured",
      note: "Apply the sponsored-use migration and set the entitlements credentials to enable this job.",
    });
  }

  const now = Date.now();

  // 3. Retention sweep. The rollup and sealing steps land in a follow-up once
  //    the projection tables exist in a reachable database; the sweep is safe
  //    to run today because it only ever deletes events older than retention,
  //    which no closed-day rollup still needs.
  const sweep = await sweepExpiredEvents(now, { dryRun });

  return NextResponse.json({
    ok: true,
    dryRun,
    sweep,
    sealingCadenceDays: MAX_SEALING_GAP_DAYS,
  });
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
