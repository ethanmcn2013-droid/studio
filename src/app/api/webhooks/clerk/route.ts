import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import { processedWebhooks } from "@/lib/entitlements-db/schema";
import { shredPersonPII } from "@/lib/entitlements-db/gdpr";
import { systemActor } from "@/lib/entitlements-db/guard";

/**
 * Clerk webhook receiver. Today it handles ONLY user.deleted, which triggers
 * a GDPR crypto-shred of that person's PII in the shared entitlements DB
 * (gdpr-data-lifecycle-policy). Signature is verified with Clerk's svix
 * scheme using node:crypto — no dependency added.
 *
 * Configure the Clerk dashboard webhook to POST here with the user.deleted
 * event and set CLERK_WEBHOOK_SECRET (whsec_...). The endpoint returns 2xx
 * fast and dedups on the svix message id.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function verifySvix(secret: string, id: string, timestamp: string, body: string, header: string): boolean {
  // Secret is "whsec_<base64>"; the signing key is the decoded base64 tail.
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${body}`)
    .digest("base64");
  const expectedBuf = Buffer.from(expected);
  // Header is a space-separated list of "v1,<sig>" entries; any match passes.
  for (const part of header.split(" ")) {
    const sig = part.includes(",") ? part.split(",")[1] : part;
    const sigBuf = Buffer.from(sig);
    if (sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf)) {
      return true;
    }
  }
  return false;
}

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "clerk-webhook-secret-not-configured" },
      { status: 500 },
    );
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ ok: false, error: "missing-svix-headers" }, { status: 400 });
  }

  const raw = await req.text();
  if (!verifySvix(secret, svixId, svixTimestamp, raw, svixSignature)) {
    return NextResponse.json({ ok: false, error: "bad-signature" }, { status: 401 });
  }

  let event: { type?: string; data?: { id?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  // Dedup on the svix message id (shared cross-product webhook table).
  try {
    const db = entitlementsDb();
    const seen = await db
      .select({ id: processedWebhooks.id })
      .from(processedWebhooks)
      .where(and(eq(processedWebhooks.source, "clerk"), eq(processedWebhooks.eventId, svixId)))
      .limit(1);
    if (seen.length > 0) return NextResponse.json({ ok: true, deduped: true });
    await db
      .insert(processedWebhooks)
      .values({ id: `pw-${svixId}`, source: "clerk", eventId: svixId })
      .onConflictDoNothing();
  } catch (err) {
    // A dedup-table failure must not drop the event; fall through and process.
    console.warn("[clerk webhook] dedup check failed:", err);
  }

  if (event.type === "user.deleted" && event.data?.id) {
    try {
      const result = await shredPersonPII({
        userClerkId: event.data.id,
        actor: systemActor("clerk-webhook"),
        reason: "clerk user.deleted",
        origin: "clerk",
      });
      return NextResponse.json({ ok: true, shredded: result });
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: err instanceof Error ? err.message : "shred-failed" },
        { status: 500 },
      );
    }
  }

  // Everything else: acknowledged, not acted on.
  return NextResponse.json({ ok: true, ignored: event.type ?? "unknown" });
}
