import type { Metadata } from "next";
import Link from "next/link";
import { CountUp } from "@/components/hq/count-up";
import { HqForcingFunction } from "@/components/hq/hq-forcing-function";
import { HqLaunchReadiness } from "@/components/hq/hq-launch-readiness";
import { HqNeedsMe } from "@/components/hq/hq-needs-me";
import { HqOperatorTodos } from "@/components/hq/hq-operator-todos";
import { HqInbox } from "@/components/hq/hq-inbox";
import { HqMasthead } from "@/components/hq/hq-masthead";
import { HqProofGate } from "@/components/hq/hq-proof-gate";
import { HqPulse } from "@/components/hq/hq-pulse";
import { HqTraction } from "@/components/hq/hq-traction";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { buildAttentionQueue } from "@/lib/hq/attention";
import { getProspects } from "@/lib/hq/crm-db";
import { getInboxData } from "@/lib/hq/inbox";
import { getNextOutreachAction } from "@/lib/hq/next-action";
import { getHqSnapshot } from "@/lib/hq/operating-system";
import { activeRooms, HQ_GROUPS } from "@/lib/hq/rooms";
import { getLaunchReadiness } from "@/lib/hq/launch";
import { getOperatorTodos } from "@/lib/hq/operator-todos";
import { getProofGate } from "@/lib/hq/proofgate";
import { getPulseState } from "@/lib/hq/pulse";
import { getTodayData } from "@/lib/hq/today";
import { getTraction } from "@/lib/hq/traction";
import { deriveVerdict } from "@/lib/hq/verdict";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal HQ · Signal Studio",
  description: "Private operating dashboard for Signal Studio.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Today — the HQ front page. v6: NEEDS-ME + GROUPS + THE FULL READ.
 *
 * ── THE SEAM CONTRACT, read before editing this file ───────────────
 * Today answers four questions in order, and nothing else lives here
 * (docs/HQ_ARCHITECTURE.md §5.7):
 *   1. What is today about?          → masthead verdict
 *   2. How is the only thing that
 *      matters actually moving?      → the truth strip (one row, links out)
 *   3. What needs me, now?           → HqNeedsMe (≤7, admission-tested)
 *   4. Where is everything?          → five group cards from the registry
 * The deep spine (proof gate, inbox tiers, pulse, traction, launch
 * readiness, the full operator ledger) survives INTACT one disclosure
 * down in "the full read" — demoted, never deleted. The inert-state
 * forcing function keeps its screen-grade prominence: polish must not
 * hide the commercial truth.
 *
 * New rooms belong in src/lib/hq/rooms.ts (the registry renders here
 * automatically); new proof mechanics belong in proofgate.ts/pulse.ts/
 * traction.ts. Keep the layers distinct.
 * ────────────────────────────────────────────────────────────────────
 */
export default async function HqPage() {
  await requireHqAccess();

  const [today, inbox, traction, prospects] = await Promise.all([
    getTodayData(),
    getInboxData(),
    getTraction(),
    getProspects(),
  ]);
  const pulse = await getPulseState(today);
  const verdict = deriveVerdict({ inbox, pulse, traction });
  const proofGate = getProofGate(traction, prospects);
  const snapshot = getHqSnapshot(prospects, traction);
  const readiness = getLaunchReadiness(
    traction.available ? traction.paidVenues : null,
  );
  const operatorTodos = await getOperatorTodos();
  const attention = buildAttentionQueue(operatorTodos, inbox);

  const truthStrip = (
    <section className="hq-truth" aria-label="commercial truth">
      <p className="hq-truth-line">{proofGate.clock.line}</p>
      <div className="hq-truth-row">
        {snapshot.metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="hq-truth-cell"
            data-tone={metric.tone ?? "quiet"}
          >
            <span className="hq-truth-label">{metric.label}</span>
            <CountUp className="hq-truth-value" value={metric.value} />
            <span className="hq-truth-note">{metric.note}</span>
          </Link>
        ))}
        <Link href={snapshot.leadHref} className="hq-truth-cell" data-tone="accent">
          <span className="hq-truth-label">next action</span>
          <span className="hq-truth-value hq-truth-value--action">
            {snapshot.leadAction}
          </span>
          <span className="hq-truth-note">{snapshot.leadContext}</span>
        </Link>
      </div>
    </section>
  );

  const groups = (
    <section className="hq-groups" aria-labelledby="hq-groups-title">
      <div className="hq-needsme-head">
        <span className="hq-os-eyebrow">the rooms</span>
        <h2 id="hq-groups-title" className="hq-needsme-title">
          Five doors, every room behind one of them
        </h2>
      </div>
      <div className="hq-groups-grid">
        {HQ_GROUPS.map((group) => {
          const rooms = group.key === "board" ? [] : activeRooms(group.key);
          const lead = rooms[0];
          return (
            <Link key={group.key} href={group.route} className="hq-groups-card">
              <span className="hq-groups-card-label">{group.label}</span>
              <span className="hq-groups-card-gloss">{group.gloss}</span>
              <span className="hq-groups-card-meta">
                {group.key === "board"
                  ? "the shareholder-safe register"
                  : `${rooms.length} rooms${lead ? ` · ${lead.name.toLowerCase()} first` : ""}`}
              </span>
              <span className="hq-groups-card-action">open →</span>
            </Link>
          );
        })}
      </div>
      <p className="hq-groups-foot">
        Anything, anywhere: <kbd>⌘K</kbd> jumps to rooms, decisions, and
        documents by name.
      </p>
    </section>
  );

  // The deep spine — demoted behind one disclosure, never deleted.
  const fullRead = (
    <details className="hq-fullread">
      <summary className="hq-fullread-summary">
        <span className="hq-os-eyebrow">the full read</span>
        <span className="hq-fullread-hint">
          proof gate · inbox · pulse · traction · launch readiness · the
          operator ledger
        </span>
      </summary>
      <div className="hq-fullread-body">
        <HqProofGate gate={proofGate} />
        <HqInbox data={inbox} />
        <HqPulse state={pulse} />
        <HqTraction state={traction} />
        <HqLaunchReadiness readiness={readiness} />
        <HqOperatorTodos board={operatorTodos} />
      </div>
    </details>
  );

  // Inert clock = the gate IS the screen. The forcing function keeps its
  // prominence; the rest of Today waits behind it exactly as before.
  if (proofGate.clock.state === "inert") {
    return (
      <div className="hq-spine hq-spine--os">
        <HqMasthead
          phaseHeadline={today.phase.headline}
          generatedAt={today.generatedAt}
          verdict={verdict}
        />
        {truthStrip}
        <HqNeedsMe queue={attention} />
        <HqForcingFunction gate={proofGate} next={getNextOutreachAction(prospects)}>
          <HqInbox data={inbox} />
          <HqPulse state={pulse} />
          <HqTraction state={traction} />
        </HqForcingFunction>
        {groups}
        {fullRead}
      </div>
    );
  }

  return (
    <div className="hq-spine hq-spine--os">
      <HqMasthead
        phaseHeadline={today.phase.headline}
        generatedAt={today.generatedAt}
        verdict={verdict}
      />
      {truthStrip}
      <HqNeedsMe queue={attention} />
      {groups}
      {fullRead}
    </div>
  );
}
