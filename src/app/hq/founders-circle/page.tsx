import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { getProspects } from "@/lib/hq/crm-db";
import {
  FOUNDER_CIRCLE_PACKS,
  getHqReport,
  HQ_REVIEW_PRINCIPLES,
} from "@/lib/hq/operating-system";
import { getTraction } from "@/lib/hq/traction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Founders Circle · Signal HQ",
  description: "Shareholder-safe Signal Studio updates, metrics, and board pack.",
  robots: { index: false, follow: false },
};

export default async function FoundersCirclePage() {
  await requireHqAccess();

  const [prospects, traction] = await Promise.all([getProspects(), getTraction()]);
  const report = getHqReport(prospects, traction);
  const boardMetrics = report.metrics;

  return (
    <main id="main" className="hq-page hq-circle">
      <section className="hq-circle-hero" aria-labelledby="circle-title">
        <div className="hq-circle-mark" aria-hidden="true" />
        <span className="hq-circle-kicker">Signal Studio</span>
        <h1 id="circle-title" className="hq-circle-title">
          Founders Circle<span aria-hidden="true">.</span>
        </h1>
        <p className="hq-circle-copy">
          A calm shareholder room: the current story, the five company
          numbers, the material assets, and the decision gate.
        </p>
      </section>

      <section className="hq-circle-summary" aria-label="founder summary">
        <div className="hq-circle-summary-main">
          <span className="hq-page-eyebrow">current read</span>
          <p>{report.headline}</p>
          <Link href="/hq/reporting" className="hq-circle-primary">
            Open the source numbers →
          </Link>
        </div>
        <div className="hq-circle-proof">
          <span className="hq-page-eyebrow">shareholder view</span>
          <p>
            Operator detail stays outside this room. This view carries material
            progress, risk, and the board pack.
          </p>
        </div>
      </section>

      <section className="hq-report-board hq-report-board--circle" aria-label="board metrics">
        {boardMetrics.map((metric) => (
          <div key={metric.label} className="hq-report-metric" data-status={metric.status}>
            <span className="hq-report-label">{metric.label}</span>
            <span className="hq-report-value">{metric.value}</span>
            <span className="hq-report-target">{metric.target}</span>
          </div>
        ))}
      </section>

      <section className="hq-ledger-section" aria-labelledby="pack-title">
        <div className="hq-ledger-headline">
          <span className="hq-page-eyebrow">board pack</span>
          <h2 id="pack-title">Material to share</h2>
        </div>
        <div className="hq-ledger">
          {FOUNDER_CIRCLE_PACKS.map((pack) => (
            <Link key={pack.title} href={pack.href} className="hq-ledger-row">
              <span className="hq-ledger-label">{pack.title}</span>
              <span className="hq-ledger-detail">{pack.note}</span>
              <span className="hq-ledger-meta">
                {pack.status} · {pack.cadence}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="hq-director-gate hq-director-gate--circle" aria-label="circle review principles">
        <div className="hq-director-intro">
          <span className="hq-page-eyebrow">review principles</span>
          <p>
            The shareholder room must be polished enough to send and plain enough
            to trust.
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
    </main>
  );
}
