import "server-only";
import { NextResponse } from "next/server";
import { aggregateToday } from "@/server/today/aggregate";
import type { TodayRequest } from "@/server/today/types";
import { verifySuiteTodayAssertion } from "@/server/auth/suite-assertion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/today · Signal Studio cross-suite Today aggregation.
 *
 * Auth: a short-lived HMAC assertion in the Bearer slot, signed with
 * `SUITE_API_KEY`. This is a server-to-server
 * endpoint, the iOS native app reaches it via its own backend proxy
 * (which has the key in env), and the web suite-wide Today widget
 * reaches it from its own server. NEVER expose the key to the
 * browser bundle or to client-side JS in the iOS WebView.
 *
 * Body: optional presentation fields only. The user identity is derived from
 * the verified assertion; caller-supplied clerkId/email are ignored.
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

  let assertion: ReturnType<typeof verifySuiteTodayAssertion>;
  try {
    assertion = verifySuiteTodayAssertion(presented, expected);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Partial<TodayRequest>;
  try {
    body = (await req.json()) as TodayRequest;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const request: TodayRequest = { clerkId: assertion.sub, email: assertion.email ?? "" };
  if (!request.email) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const result = await aggregateToday(request);
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
