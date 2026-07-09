import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { reconcileCodes } from "@/lib/entitlements-db/codes";
import { retentionSweep } from "@/lib/entitlements-db/gdpr";
import { systemActor } from "@/lib/entitlements-db/guard";

/**
 * Nightly access maintenance: repair code-redeemed-but-no-entitlement
 * orphans, refresh counter drift, and crypto-shred PII past its retention
 * window. Runs under the reconcile-cron system actor (velocity-exempt, its
 * own per-run caps). Auth: CRON_SECRET bearer (Vercel Cron sends it).
 *
 * The endpoint is ready now; enabling the schedule (vercel.json crons) is the
 * operator step.
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

async function run(): Promise<NextResponse> {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "cron-secret-not-configured" }, { status: 500 });
  }
  const actor = systemActor("reconcile-cron");
  const reconcile = await reconcileCodes({ actor });
  const retention = await retentionSweep({ actor });
  return NextResponse.json({ ok: true, reconcile, retention });
}

export async function GET(req: Request) {
  if (!authOk(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    return await run();
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}

// Allow POST too, so a manual operator trigger can use either verb.
export async function POST(req: Request) {
  return GET(req);
}
