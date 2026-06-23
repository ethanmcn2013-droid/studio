import type { Metadata } from "next";
import Link from "next/link";
import { CountUp } from "@/components/hq/count-up";
import { HqForcingFunction } from "@/components/hq/hq-forcing-function";
import { HqLaunchReadiness } from "@/components/hq/hq-launch-readiness";
import { HqOperatorTodos } from "@/components/hq/hq-operator-todos";
import { HqInbox } from "@/components/hq/hq-inbox";
import { HqMasthead } from "@/components/hq/hq-masthead";
import { HqProofGate } from "@/components/hq/hq-proof-gate";
import { HqPulse } from "@/components/hq/hq-pulse";
import { HqTraction } from "@/components/hq/hq-traction";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { getProspects } from "@/lib/hq/crm-db";
import { getInboxData } from "@/lib/hq/inbox";
import { getNextOutreachAction } from "@/lib/hq/next-action";
import {
  getHqSnapshot,
  HQ_AUDIENCE_PATHS,
  HQ_HUBS,
  HQ_REVIEW_PRINCIPLES,
} from "@/lib/hq/operating-system";
import { getLaunchReadiness } from "@/lib/hq/launch";
import { getOperatorTodos } from "@/lib/hq/operator-todos";
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
 * Signal HQ — the founder operating system. v5: HUBS + PROOF SPINE.
 *
 * ── THE SEAM CONTRACT — read before editing this file ───────────────
 * The founder view now has two jobs:
 *   1. orient any operator in the backend system in under 60 seconds;
 *   2. keep the proof gate close enough that polish cannot hide the
 *      commercial truth.
 *
 * The top half is hub IA, sourced from operating-system.ts. The bottom
 * half remains the proof spine over `proofGate.clock.state`. New backend
 * rooms belong in operating-system.ts + /hq/<route>; new proof mechanics
 * belong in proofgate.ts / pulse.ts / traction.ts. Keep the two layers
 * distinct.
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
  const commandCenter = (
    <>
      <section className="hq-os-brief" aria-labelledby="hq-os-title">
        <div className="hq-os-brief-top">
          <span className="hq-os-eyebrow">operating system</span>
          <span className="hq-os-stamp">
            generated {new Date(snapshot.generatedAt).toLocaleTimeString("en-IE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="hq-os-brief-grid">
          <div>
            <h1 id="hq-os-title" className="hq-os-title">
              Open the right room<span aria-hidden="true">.</span>
            </h1>
            <p className="hq-os-copy">
              The Vault holds every document the business runs on. CRM,
              Marketing, Assets, Reporting, and Founders Circle keep the
              operating work, company read, and board view in separate rooms.
            </p>
          </div>
          <div className="hq-os-next">
            <span className="hq-os-next-label">next action</span>
            <Link href={snapshot.leadHref} className="hq-os-next-link">
              {snapshot.leadAction}
            </Link>
            <p className="hq-os-next-note">{snapshot.leadContext}</p>
          </div>
        </div>
      </section>

      <section className="hq-os-metrics" aria-label="company metrics">
        {snapshot.metrics.map((metric) => (
          <Link
            key={metric.label}
            href={metric.href}
            className="hq-os-metric"
            data-tone={metric.tone ?? "quiet"}
          >
            <span className="hq-os-metric-label">{metric.label}</span>
            <CountUp className="hq-os-metric-value" value={metric.value} />
            <span className="hq-os-metric-note">{metric.note}</span>
          </Link>
        ))}
      </section>

      <HqLaunchReadiness readiness={readiness} />

      <HqOperatorTodos board={operatorTodos} />

      <section className="hq-hub-board" aria-labelledby="hq-hubs-title">
        <div className="hq-hub-head">
          <span className="hq-os-eyebrow">hubs</span>
          <h2 id="hq-hubs-title" className="hq-hub-title">
            The rooms
          </h2>
        </div>
        <div className="hq-hub-grid">
          {HQ_HUBS.map((hub) => (
            <Link key={hub.key} href={hub.href} className="hq-hub-card">
              <span className="hq-hub-label">{hub.label}</span>
              <span className="hq-hub-name">{hub.title}</span>
              <span className="hq-hub-summary">{hub.summary}</span>
              <span className="hq-hub-meta">
                {hub.primaryMetric} · {hub.secondaryMetric}
              </span>
              <span className="hq-hub-action">{hub.action} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="hq-audience-paths" aria-labelledby="audience-paths-title">
        <div className="hq-ledger-headline">
          <span className="hq-os-eyebrow">start here</span>
          <h2 id="audience-paths-title">No one has to learn the whole system first</h2>
        </div>
        <div className="hq-ledger">
          {HQ_AUDIENCE_PATHS.map((path) => (
            <Link key={path.audience} href={path.href} className="hq-ledger-row">
              <span className="hq-ledger-label">{path.audience}</span>
              <span className="hq-ledger-detail">
                <strong>{path.start}</strong>. {path.promise}
              </span>
              <span className="hq-ledger-arrow">open →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="hq-director-gate" aria-label="review principles">
        <div className="hq-director-intro">
          <span className="hq-os-eyebrow">review principles</span>
          <p>
            The bar is quiet: obvious on first read, commercially honest, and
            still Signal Studio.
          </p>
        </div>
        <div className="hq-director-list">
          {HQ_REVIEW_PRINCIPLES.map((director) => (
            <div key={director.role} className="hq-director-row">
              <span className="hq-director-role">{director.role}</span>
              <span className="hq-director-finding">{director.finding}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );

  if (proofGate.clock.state === "inert") {
    return (
      <div className="hq-spine hq-spine--os">
        {commandCenter}
        {masthead}
        <HqForcingFunction gate={proofGate} next={getNextOutreachAction(prospects)}>
          {scroll}
        </HqForcingFunction>
      </div>
    );
  }

  // running | expired — the earned scroll. proofgate.ts encodes the
  // expired distinction in clock.line + the stamp; no separate arm
  // needed until expired warrants its own §8 surface.
  return (
    <div className="hq-spine hq-spine--os">
      {commandCenter}
      {masthead}
      {scroll}
    </div>
  );
}
