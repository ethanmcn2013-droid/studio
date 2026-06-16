import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getInboxData } from "@/lib/hq/inbox";
import { getPulseState } from "@/lib/hq/pulse";
import { getTodayData } from "@/lib/hq/today";
import { getTraction } from "@/lib/hq/traction";
import { deriveVerdict } from "@/lib/hq/verdict";

export const dynamic = "force-dynamic";

/**
 * GET /hq/status — the one line the company is in, right now.
 *
 * Powers the living status dot in the HQ nav (src/components/hq/hq-status-dot).
 * Returns the same mechanically-derived verdict the masthead shows, so the
 * dot is never authored — it is the verdict, miniaturised and made global.
 *
 * Lives UNDER /hq (not /api) on purpose: the HQ access cookie is scoped to
 * `path=/hq`, so an /api/* endpoint would never receive it. A route handler
 * here is auth-reachable with the existing cookie and no contract change.
 *
 * Gated by the HQ access cookie: a 401 here simply leaves the dot in its
 * neutral idle state (it never guesses a verdict it can't read).
 */
export async function GET() {
  const token = (await cookies()).get(HQ_ACCESS_COOKIE)?.value ?? "";
  if (!token || !(await verifyHqToken(token))) {
    return NextResponse.json({ error: "locked" }, { status: 401 });
  }

  try {
    const [today, inbox, traction] = await Promise.all([
      getTodayData(),
      getInboxData(),
      getTraction(),
    ]);
    const pulse = await getPulseState(today);
    const verdict = deriveVerdict({ inbox, pulse, traction });

    return NextResponse.json(
      {
        level: verdict.level,
        headline: verdict.headline,
        action: verdict.action,
        actionHref: verdict.actionHref ?? null,
        generatedAt: today.generatedAt,
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "unreadable" }, { status: 503 });
  }
}
