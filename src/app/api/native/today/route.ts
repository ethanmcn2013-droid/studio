import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { aggregateToday } from "@/server/today/aggregate";
import { shapeNativePayload } from "@/server/today/shape-native";
import type { TodayNativeRequest } from "@/server/today/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/native/today — iOS-shaped Today payload.
 *
 * Wraps `/api/today` with the iOS presentation layer per the IA spec
 * at `docs/strategy/IOS_TODAY_DOC_IA_2026_05_21.md` § 8b. The native
 * client does not own greeting strings, anchor-card selection, or
 * "should This Evening render right now" — server-decides everything.
 *
 * Auth: shared `SUITE_API_KEY` Bearer token, same pattern + timing-safe
 * compare as `/api/today`. The iOS app's backend proxy holds the key;
 * the native client never sees it. Migration target (named in
 * aggregate.ts) is Clerk session check once studio gains @clerk/nextjs.
 *
 * Body:
 *   {
 *     clerkId: "user_…",        // required
 *     email:   "you@example.ie",// required
 *     name?:   "Anya Smith",    // optional, drives first-name greeting
 *     timezone?: "Europe/Dublin",// optional, IANA; falls back to analytics.timezone, then UTC
 *     locale?: "en-IE"           // optional, BCP 47; defaults to en-IE
 *   }
 *
 * Returns: `TodayNativePayload` shaped per IA §8b.
 *
 * Doc: `docs/ios/today-native-api.md`.
 */
export async function POST(req: Request) {
  const expected = process.env.SUITE_API_KEY;
  if (!expected) {
    return NextResponse.json(
      { error: "server_misconfigured", hint: "SUITE_API_KEY not set" },
      { status: 503 },
    );
  }

  const authHeader = req.headers.get("authorization");
  const presented = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : null;
  if (!presented) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const expectedDigest = createHash("sha256").update(expected).digest();
  const presentedDigest = createHash("sha256").update(presented).digest();
  if (!timingSafeEqual(expectedDigest, presentedDigest)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: TodayNativeRequest;
  try {
    body = (await req.json()) as TodayNativeRequest;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!body?.clerkId || !body?.email) {
    return NextResponse.json(
      { error: "missing_fields", hint: "clerkId and email required" },
      { status: 400 },
    );
  }

  try {
    const raw = await aggregateToday({ clerkId: body.clerkId, email: body.email });
    const payload = shapeNativePayload(raw, body);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store, private",
      },
    });
  } catch (err) {
    console.error("[/api/native/today] shaping failed:", err);
    return NextResponse.json({ error: "shaping_failed" }, { status: 500 });
  }
}
