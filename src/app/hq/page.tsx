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
 * Signal HQ — the founder's mission control. v4: ONE STATE MACHINE.
 *
 * ── THE SEAM CONTRACT — read before editing this file ───────────────
 * Three sessions independently rewrote this page; that collision was the
 * real architecture problem, not the UI. The fix is this: HQ is a single
 * state machine over `proofGate.clock.state`. There is exactly one source
 * of clock truth (proofgate.ts, canonical) and one source of the next
 * venue (next-action.ts). New HQ work COMPOSES INTO THE SWITCH BELOW —
 * add a state arm, or add a derived component into an existing arm. Do
 * NOT rewrite this file as a flat scroll again; that is what kept
 * clobbering prior sessions' work. If you need a new top-level surface,
 * it is a /hq/<route>, reached from the masthead nav — not the spine.
 *
 *   inert    → forcing function: the gate IS the screen, the next send
 *              one tap away, the whole stack behind one disclosure.
 *   running  → the answer-first scroll: masthead verdict → proof gate
 *              (section 0, "has it moved") → inbox → pulse → traction.
 *   expired  → same scroll; the proof gate itself renders the expired
 *              clock line + "§8 kill/pivot due" (proofgate.ts owns that
 *              copy, so no separate component — honest, not duplicated).
 *
 * Everything derived from real sources every render — committed seed
 * baseline for derived truth, localStorage only for the four operator
 * surfaces CLAUDE.md names. Reference surfaces (atlas/health/
 * entitlements/partners/marketing/plan/one-pagers) live at their own
 * routes off the masthead, never in this spine.
 * ────────────────────────────────────────────────────────────────────
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

  // The scroll body, shared by running + expired. The proof gate is
  // section 0 — "has the only thing that matters moved" — above inbox,
  // because the review's finding is that product work was functioning as
  // avoidance of exactly this scoreboard.
  const scroll = (
    <>
      <HqProofGate gate={proofGate} />
      <HqInbox data={inbox} />
      <HqPulse state={pulse} />
      <HqTraction state={traction} />
    </>
  );

  // ── The state machine ──────────────────────────────────────────────
  if (proofGate.clock.state === "inert") {
    return (
      <div className="hq-spine">
        {masthead}
        <HqForcingFunction gate={proofGate} next={getNextOutreachAction()}>
          {scroll}
        </HqForcingFunction>
      </div>
    );
  }

  // running | expired — the earned scroll. proofgate.ts encodes the
  // expired distinction in clock.line + the stamp; no separate arm
  // needed until expired warrants its own §8 surface.
  return (
    <div className="hq-spine">
      {masthead}
      {scroll}
    </div>
  );
}
