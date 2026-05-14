import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { writeSharedEntitlement } from "@/lib/entitlements-db/writes";
import {
  ENTITLEMENT_SOURCES,
  ENTITLEMENT_TIERS,
  type EntitlementSource,
  type EntitlementTier,
} from "@/lib/entitlements-db/schema";

/**
 * Operator grant endpoint (2026-05-14).
 *
 * Writes an entitlement row directly to signal-entitlements. Bypasses
 * Stripe — used for support cases where a real grant didn't propagate,
 * or for pilot users we want on a tier without making them pay.
 *
 *   curl -X POST https://signalstudio.ie/api/internal/entitlements/grant \
 *        -H "Authorization: Bearer $STUDIO_OPS_SECRET" \
 *        -H "Content-Type: application/json" \
 *        -d '{"userClerkId":"user_xxx","tier":"workspace","source":"compliments","sourceRef":"manual-2026-05-14","durationDays":365}'
 *
 * Idempotent on (userClerkId, source, sourceRef) — re-running the
 * same curl no-ops the second insert and returns created=false. Use
 * a unique sourceRef for distinct grants.
 *
 * Audit: every grant is recorded in metadata with origin='studio-ops'
 * so the source of off-Stripe grants is grep-able in the shared DB.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authOk(req: Request): boolean {
  const expected = process.env.STUDIO_OPS_SECRET;
  if (!expected) return false;
  const presented = (req.headers.get("authorization") ?? "").replace(
    /^Bearer\s+/i,
    "",
  );
  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

type GrantPayload = {
  userClerkId?: string;
  tier?: string;
  source?: string;
  sourceRef?: string | null;
  durationDays?: number | null;
  metadata?: Record<string, unknown>;
};

export async function POST(req: Request) {
  if (!process.env.STUDIO_OPS_SECRET) {
    return NextResponse.json(
      { ok: false, error: "studio-ops-secret-not-configured" },
      { status: 500 },
    );
  }
  if (!authOk(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: GrantPayload;
  try {
    body = (await req.json()) as GrantPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  if (!body.userClerkId || typeof body.userClerkId !== "string") {
    return NextResponse.json(
      { ok: false, error: "userClerkId required" },
      { status: 400 },
    );
  }
  if (!body.tier || !ENTITLEMENT_TIERS.includes(body.tier as EntitlementTier)) {
    return NextResponse.json(
      {
        ok: false,
        error: `tier must be one of ${ENTITLEMENT_TIERS.join(" | ")}`,
      },
      { status: 400 },
    );
  }
  if (
    !body.source ||
    !ENTITLEMENT_SOURCES.includes(body.source as EntitlementSource)
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: `source must be one of ${ENTITLEMENT_SOURCES.join(" | ")}`,
      },
      { status: 400 },
    );
  }

  const expiresAtMs =
    body.durationDays != null && body.durationDays > 0
      ? Date.now() + body.durationDays * 24 * 60 * 60 * 1000
      : null;

  try {
    const result = await writeSharedEntitlement({
      userClerkId: body.userClerkId,
      tier: body.tier as EntitlementTier,
      source: body.source as EntitlementSource,
      sourceRef: body.sourceRef ?? null,
      expiresAtMs,
      metadata: {
        ...(body.metadata ?? {}),
        origin: "studio-ops",
        grantedAt: new Date().toISOString(),
      },
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 },
    );
  }
}
