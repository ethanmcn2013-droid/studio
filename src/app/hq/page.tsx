import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HqForcingFunction } from "@/components/hq/hq-forcing-function";
import { HqInbox } from "@/components/hq/hq-inbox";
import { HqMasthead } from "@/components/hq/hq-masthead";
import { HqProofGate } from "@/components/hq/hq-proof-gate";
import { HqPulse } from "@/components/hq/hq-pulse";
import { HqTraction } from "@/components/hq/hq-traction";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getInboxData } from "@/lib/hq/inbox";
import { getNextOutreachAction } from "@/lib/hq/next-action";
import { getProofGate } from "@/lib/hq/proofgate";
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
 * Signal HQ — the founder's mission control. HQ v3, 2026-05-16.
 *
 * One scrolling page, ordered by urgency, answering the questions a
 * sole operator actually asks, in order:
 *
 *   0. What's the verdict?           → Masthead (one derived sentence
 *                                      + the one action; inputs one
 *                                      click away — never authored)
 *   1. What needs me right now?      → Inbox  (human-decision only)
 *   2. Is anything on fire/rotting?  → Pulse  (system-decay only)
 *   3. Are we winning?               → Traction (+ the six-month
 *                                      burndown — the one temporal
 *                                      element on the one number)
 *
 * Everything is derived from real sources every render — no
 * localStorage, no seed prose, no manual upkeep. The old "System"
 * disclosure (a 1,906-line legacy dashboard the code itself called
 * fiction) was deleted in v3: the genuine reference surfaces live at
 * their own routes (atlas, health, entitlements, partners, plan) and
 * the masthead nav points there. Restraint is the brand — debt behind a
 * fold is still debt.
 *
 * v3.1 (2026-05-18) — state-gated. The v3 scroll is the *running* state.
 * While the proof-gate clock is inert (zero sends logged) the page is a
 * forcing function, not a dashboard: the gate IS the screen, the next
 * physical send is one tap, and the whole v3 scroll collapses behind a
 * disclosure the operator must choose to open. A dashboard that reports
 * the gate can be read and closed; this cannot. The page reverts to the
 * full scroll the moment the clock leaves "inert" — dwell is earned
 * then, not before. This is the only HQ change consistent with the
 * 2026-05-18 product freeze: it pushes toward the gate, not away.
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
  const proofGate = getProofGate(traction);

  const masthead = (
    <HqMasthead
      phaseHeadline={today.phase.headline}
      generatedAt={today.generatedAt}
      verdict={verdict}
    />
  );

  // Inert clock → forcing function. The masthead stays (identity + the
  // nav out to the reference surfaces); everything below the gate is
  // collapsed behind the forcing function's own disclosure.
  if (proofGate.clock.state === "inert") {
    return (
      <div className="hq-spine">
        {masthead}
        <HqForcingFunction gate={proofGate} next={getNextOutreachAction()}>
          <HqProofGate gate={proofGate} />
          <HqInbox data={inbox} />
          <HqPulse state={pulse} />
          <HqTraction state={traction} />
        </HqForcingFunction>
      </div>
    );
  }

  // Running / expired → the earned v3 scroll.
  return (
    <div className="hq-spine">
      {masthead}
      <HqProofGate gate={proofGate} />
      <HqInbox data={inbox} />
      <HqPulse state={pulse} />
      <HqTraction state={traction} />
    </div>
  );
}
