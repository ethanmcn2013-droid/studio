import type { Metadata } from "next";
import Link from "next/link";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { requireHqAccess } from "@/lib/hq/access-guard";
import {
  COMPANY_META,
  incorporationProgress,
  INCORP_NOT_NEEDED,
  INCORP_TIMELINE,
  INCORPORATION_PHASES,
  type IncorpStep,
} from "@/lib/hq/company";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Incorporation pack · Signal HQ",
  description:
    "The CRO incorporation runbook for Signal Studio Limited, phased checklist, timeline, and what gates the €40k facility. Pre-incorporation.",
  robots: { index: false, follow: false },
};

/**
 * /hq/incorporation, the incorporation runbook as a live checklist.
 * Transcribed from the vault runbook; honest that incorporation is targeted
 * July 2026 and gates the facility. Decisions confirmed, filing pending.
 */
export default async function IncorporationPage() {
  await requireHqAccess();

  const progress = incorporationProgress();

  return (
    <main id="main" className="hq-page">
      <HqPageHeader
        slug="incorporation"
        title={`Incorporating ${COMPANY_META.legalName}.`}
        standfirst={`The CRO runbook as a live checklist; filing is targeted ${COMPANY_META.incorporationTarget} and gates the €40k facility.`}
        meta={
          <span className="hq-co-status" data-status={COMPANY_META.status}>
            {COMPANY_META.statusLabel} · {progress.done}/{progress.total} decisions confirmed
          </span>
        }
      />

      {/* Company facts */}
      <section className="hq-co-facts" aria-label="company facts">
        <Fact label="Type" value={COMPANY_META.type} />
        <Fact label="Director" value={COMPANY_META.director} />
        <Fact label="Secretary" value={COMPANY_META.secretary} />
        <Fact label="Registered office" value={COMPANY_META.registeredOffice} />
      </section>

      {/* Timeline */}
      <section className="hq-co-block" aria-label="timeline">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">timeline · against the real deadlines</span>
        </div>
        <div className="hq-fm-scroll">
          <table className="hq-fm-table hq-co-table">
            <thead>
              <tr>
                <th scope="col">Milestone</th>
                <th scope="col">Target</th>
                <th scope="col">Why it gates</th>
              </tr>
            </thead>
            <tbody>
              {INCORP_TIMELINE.map((t) => (
                <tr key={t.milestone}>
                  <th scope="row">{t.milestone}</th>
                  <td className="hq-co-target">{t.target}</td>
                  <td className="hq-co-gates">{t.gates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Phased checklist */}
      <section className="hq-co-block" aria-label="incorporation phases">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">the runbook</span>
          <p>Five phases from confirmed decisions to recurring housekeeping.</p>
        </div>
        <div className="hq-incorp">
          {INCORPORATION_PHASES.map((phase) => (
            <div key={phase.id} className="hq-incorp-phase">
              <div className="hq-incorp-phase-head">
                <h3 className="hq-incorp-phase-title">{phase.title}</h3>
                <p className="hq-incorp-phase-blurb">{phase.blurb}</p>
              </div>
              <ul className="hq-incorp-steps" role="list">
                {phase.steps.map((step) => (
                  <Step key={step.label} step={step} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* What you don't need */}
      <section className="hq-co-block" aria-label="not needed">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">what you do not need</span>
          <p>The refusals that keep a solo LTD simple.</p>
        </div>
        <ul className="hq-co-notneeded">
          {INCORP_NOT_NEEDED.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>

      <footer className="hq-dr-foot">
        <Link href="/hq/cap-table" className="hq-dr-back">← cap table</Link>
        <span className="hq-dr-source">
          source ·{" "}
          <Link href="/hq/vault/legal-cro-incorporation" className="hq-co-srclink">
            CRO incorporation runbook
          </Link>{" "}
          · revised {COMPANY_META.revisedOn}
        </span>
      </footer>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="hq-co-fact">
      <span className="hq-co-fact-label">{label}</span>
      <span className="hq-co-fact-value">{value}</span>
    </div>
  );
}

function Step({ step }: { step: IncorpStep }) {
  return (
    <li className="hq-incorp-step" data-status={step.status}>
      <span className="hq-incorp-step-mark" aria-hidden="true">
        {step.status === "done" ? "✓" : ""}
      </span>
      <span className="hq-incorp-step-label">
        {step.label}
        {step.note ? <span className="hq-incorp-step-note"> · {step.note}</span> : null}
      </span>
      <span className="hq-incorp-step-status">{step.status === "future" ? "later" : step.status}</span>
    </li>
  );
}
