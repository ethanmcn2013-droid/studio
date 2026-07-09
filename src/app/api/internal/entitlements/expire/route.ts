import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { expireSharedEntitlement } from "@/lib/entitlements-db/writes";
import { opsCurlActor } from "@/lib/entitlements-db/guard";

/**
 * Operator expire endpoint (2026-05-14).
 *
 * Marks an entitlement expired in signal-entitlements. Used when a
 * comp grant should be revoked, a paid grant disputed, or a test
 * row cleaned up.
 *
 *   curl -X POST https://signalstudio.ie/api/internal/entitlements/expire \
 *        -H "Authorization: Bearer $STUDIO_OPS_SECRET" \
 *        -H "Content-Type: application/json" \
 *        -d '{"sourceRef":"manual-2026-05-14"}'
 *
 * Match by stripeSubscriptionId OR sourceRef. The first match wins.
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

type ExpirePayload = {
  sourceRef?: string | null;
  stripeSubscriptionId?: string | null;
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

  let body: ExpirePayload;
  try {
    body = (await req.json()) as ExpirePayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  if (!body.sourceRef && !body.stripeSubscriptionId) {
    return NextResponse.json(
      { ok: false, error: "sourceRef OR stripeSubscriptionId required" },
      { status: 400 },
    );
  }

  try {
    await expireSharedEntitlement({
      sourceRef: body.sourceRef ?? null,
      stripeSubscriptionId: body.stripeSubscriptionId ?? null,
      actor: opsCurlActor(),
      origin: "studio-ops",
    });
    return NextResponse.json({ ok: true });
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
