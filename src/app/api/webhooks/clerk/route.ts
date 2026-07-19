import "server-only";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import { processedWebhooks } from "@/lib/entitlements-db/schema";
import { shredPersonPII } from "@/lib/entitlements-db/gdpr";
import { systemActor } from "@/lib/entitlements-db/guard";
import {
  isFreshSvixTimestamp,
  svixExpectedSignature,
  svixMatches,
} from "@/lib/entitlements-db/pure";
import {
  RetryableWebhookError,
  runRetryableWebhook,
} from "@/lib/entitlements-db/webhook-lifecycle";

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
const MAX_WEBHOOK_BYTES = 1_000_000;

function verifySvix(secret: string, id: string, timestamp: string, body: string, header: string): boolean {
  return svixMatches(header, svixExpectedSignature(secret, id, timestamp, body));
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
  if (!isFreshSvixTimestamp(svixTimestamp, Date.now())) {
    return NextResponse.json({ ok: false, error: "stale-svix-timestamp" }, { status: 401 });
  }
  const declaredLength = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ ok: false, error: "payload-too-large" }, { status: 413 });
  }

  const raw = await req.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_WEBHOOK_BYTES) {
    return NextResponse.json({ ok: false, error: "payload-too-large" }, { status: 413 });
  }
  if (!verifySvix(secret, svixId, svixTimestamp, raw, svixSignature)) {
    return NextResponse.json({ ok: false, error: "bad-signature" }, { status: 401 });
  }

  let event: { type?: string; data?: { id?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  try {
    const outcome = await runRetryableWebhook({
      alreadyCompleted: () => wasProcessed(svixId),
      perform: async () => {
        if (event.type === "user.deleted" && event.data?.id) {
          return {
            shredded: await shredPersonPII({
              userClerkId: event.data.id,
              actor: systemActor("clerk-webhook"),
              reason: "clerk user.deleted",
              origin: "clerk",
            }),
          };
        }
        return { ignored: event.type ?? "unknown" };
      },
      markCompleted: () => markProcessed(svixId),
    });
    if (outcome.deduped) {
      return NextResponse.json({ ok: true, deduped: true });
    }
    return NextResponse.json({ ok: true, ...outcome.value });
  } catch (error) {
    const stage =
      error instanceof RetryableWebhookError ? error.stage : "perform";
    return NextResponse.json(
      {
        ok: false,
        error: stage === "complete" ? "dedup-write-failed" : "shred-failed",
      },
      { status: 500 },
    );
  }
}

async function wasProcessed(svixId: string): Promise<boolean> {
  const seen = await entitlementsDb()
    .select({ id: processedWebhooks.id })
    .from(processedWebhooks)
    .where(
      and(
        eq(processedWebhooks.source, "clerk"),
        eq(processedWebhooks.eventId, svixId),
      ),
    )
    .limit(1);
  return seen.length > 0;
}

async function markProcessed(svixId: string): Promise<void> {
  await entitlementsDb()
    .insert(processedWebhooks)
    .values({ id: `pw-${svixId}`, source: "clerk", eventId: svixId })
    .onConflictDoNothing();
}
