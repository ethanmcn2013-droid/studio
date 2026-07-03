import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { aggregateToday } from "@/server/today/aggregate";
import type { TodayRequest } from "@/server/today/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/today · Signal Studio cross-suite Today aggregation.
 *
 * Auth: shared `SUITE_API_KEY` Bearer token. This is a server-to-server
 * endpoint, the iOS native app reaches it via its own backend proxy
 * (which has the key in env), and the web suite-wide Today widget
 * reaches it from its own server. NEVER expose the key to the
 * browser bundle or to client-side JS in the iOS WebView.
 *
 * Body: { clerkId, email }, the user to aggregate Today data for.
 * The caller is trusted to have authenticated the user before
 * hitting this endpoint; this route only verifies the suite key.
 *
 * Returns: TodayResponse with per-product slices + a `reads` health
 * map flagging which product reads were skipped, succeeded, or failed.
 *
 * Why a separate shared-key Bearer rather than Clerk middleware in
 * studio: Studio doesn't run Clerk today (it's the marketing /
 * password-gated-HQ surface). Wiring Clerk into studio is a separate
 * cycle. Until then, a shared-key SSR proxy is the iOS-friendly
 * pattern with the lowest blast radius.
 *
 * The 4 Turso read tokens (TASKS_TURSO_*, NOTES_TURSO_*, ROADMAP_TURSO_*,
 * ANALYTICS_TURSO_*) are read inside the aggregator; missing pairs
 * gracefully degrade per-product, never abort the whole response.
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

  // Constant-time compare without leaking the length-mismatch bit.
  // Hash both sides to a fixed-length sha256 digest then compare.
  // Hashing collapses the length distinguishability that a raw
  // timingSafeEqual would still leak through the length pre-check.
  const expectedDigest = createHash("sha256").update(expected).digest();
  const presentedDigest = createHash("sha256").update(presented).digest();
  if (!timingSafeEqual(expectedDigest, presentedDigest)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: TodayRequest;
  try {
    body = (await req.json()) as TodayRequest;
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
    const result = await aggregateToday(body);
    return NextResponse.json(result, {
      headers: {
        // Don't cache: the aggregation is per-user and time-sensitive.
        "Cache-Control": "no-store, private",
      },
    });
  } catch (err) {
    console.error("[/api/today] aggregation failed:", err);
    return NextResponse.json(
      { error: "aggregation_failed" },
      { status: 500 },
    );
  }
}
