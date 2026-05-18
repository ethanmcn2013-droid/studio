import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HqForcingFunction } from "@/components/hq/hq-forcing-function";
import { HqInbox } from "@/components/hq/hq-inbox";
import { HqMasthead } from "@/components/hq/hq-masthead";
import { HqPulse } from "@/components/hq/hq-pulse";
import { HqTraction } from "@/components/hq/hq-traction";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getInboxData } from "@/lib/hq/inbox";
import {
  getNextOutreachAction,
  getOutreachClock,
} from "@/lib/hq/next-action";
import { getPulseState } from "@/lib/hq/pulse";
import { getTodayData } from "@/lib/hq/today";
import { getTraction } from "@/lib/hq/traction";
import { deriveVerdict } from "@/lib/hq/verdict";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal HQ — Signal Studio",
  description: "Private operating dashboard for Signal Studio.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Signal HQ — the founder's mission control.
 *
 * The running state is the urgency-ordered scroll: Masthead (one derived
 * verdict + the one action, inputs a click away, never authored) →
 * Inbox (human-decision only) → Pulse (system-decay only) → Traction
 * (+ the six-month burndown). Everything derived from real sources every
 * render — no localStorage, no seed prose, no manual upkeep. The genuine
 * reference surfaces live at their own routes (atlas, health,
 * entitlements, partners, plan); the masthead nav points there.
 *
 * v3.1 (2026-05-18) — state-gated, and self-contained. While the outreach
 * clock is inert (zero founder-signed sends logged) the page is a forcing
 * function, not a dashboard: the clock IS the screen, the next physical
 * send is one tap, and the whole scroll collapses behind a disclosure the
 * operator must choose to open. A dashboard that reports the gate can be
 * read and closed; this cannot. It reverts to the full scroll the moment
 * a send is logged — dwell is earned then, not before.
 *
 * The clock is derived in next-action.ts from the committed prospects
 * baseline against the ratified review dates — deliberately NOT coupled to
 * the parallel-session proof-gate module, so this ships standalone. This
 * is the only HQ change consistent with the 2026-05-18 product freeze: it
 * pushes toward the outreach gate, not away from it.
 */
export default async function HqPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) {
    redirect("/hq/access");
  }

  const [today, inbox, traction] = await Promise.all([
    getTodayData(),
    getInboxData(),
    getTraction(),
  ]);
  const pulse = await getPulseState(today);
  const verdict = deriveVerdict({ inbox, pulse, traction });
  const clock = getOutreachClock();

  const masthead = (
    <HqMasthead
      phaseHeadline={today.phase.headline}
      generatedAt={today.generatedAt}
      verdict={verdict}
    />
  );

  const stack = (
    <>
      <HqInbox data={inbox} />
      <HqPulse state={pulse} />
      <HqTraction state={traction} />
    </>
  );

  // Inert clock → forcing function. The masthead stays (identity + the
  // nav out to the reference surfaces); the whole stack collapses behind
  // the forcing function's own disclosure.
  if (clock.inert) {
    return (
      <div className="hq-spine">
        {masthead}
        <HqForcingFunction clock={clock} next={getNextOutreachAction()}>
          {stack}
        </HqForcingFunction>
      </div>
    );
  }

  // Running / expired → the earned scroll.
  return (
    <div className="hq-spine">
      {masthead}
      {stack}
    </div>
  );
}
