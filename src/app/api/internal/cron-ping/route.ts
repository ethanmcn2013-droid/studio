import "server-only";
import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { cronRuns, CRON_RUN_SOURCES, type CronRunSource } from "@/lib/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PingBody = {
  source?: string;
  ranAt?: number;
  ok?: boolean;
  considered?: number;
  sent?: number;
  skipped?: number;
  failed?: number;
  isMondayUtc?: boolean;
  notes?: string;
};

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.CRON_PING_SECRET ?? "";
  const expected = `Bearer ${secret}`;
  if (
    !secret ||
    auth.length !== expected.length ||
    !timingSafeEqual(Buffer.from(auth), Buffer.from(expected))
  ) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: PingBody;
  try {
    body = (await req.json()) as PingBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body.source || !CRON_RUN_SOURCES.includes(body.source as CronRunSource)) {
    return NextResponse.json({ ok: false, error: "invalid_source" }, { status: 400 });
  }
  if (typeof body.ranAt !== "number" || typeof body.ok !== "boolean") {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  try {
    await db.insert(cronRuns).values({
      id: randomUUID(),
      source: body.source,
      ranAt: body.ranAt,
      ok: body.ok ? 1 : 0,
      considered: body.considered ?? null,
      sent: body.sent ?? null,
      skipped: body.skipped ?? null,
      failed: body.failed ?? null,
      isMondayUtc: typeof body.isMondayUtc === "boolean" ? (body.isMondayUtc ? 1 : 0) : null,
      notes: body.notes ?? null,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "insert_failed", detail: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
