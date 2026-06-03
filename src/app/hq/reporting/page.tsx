import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { getProspects } from "@/lib/hq/crm-db";
import { getHqReport } from "@/lib/hq/operating-system";
import { getTraction } from "@/lib/hq/traction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reporting — Signal HQ",
  description: "Simple founder and shareholder metrics for Signal Studio.",
  robots: { index: false, follow: false },
};

export default async function ReportingPage() {
  await requireHqAccess();

  const [prospects, traction] = await Promise.all([getProspects(), getTraction()]);
  const report = getHqReport(prospects, traction);

  return (
    <main id="main" className="hq-page">
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">Signal HQ · Reporting</span>
        <h1 className="hq-page-title">Five numbers and the source<span aria-hidden="true">.</span></h1>
        <p className="hq-page-intro">{report.headline}</p>
      </header>

      <section className="hq-report-board" aria-label="key metrics">
        {report.metrics.map((metric) => (
          <div key={metric.label} className="hq-report-metric" data-status={metric.status}>
            <span className="hq-report-label">{metric.label}</span>
            <span className="hq-report-value">{metric.value}</span>
            <span className="hq-report-target">target · {metric.target}</span>
            <span className="hq-report-source">{metric.source}</span>
          </div>
        ))}
      </section>

      <section className="hq-ledger-section" aria-labelledby="ops-metrics-title">
        <div className="hq-ledger-headline">
          <span className="hq-page-eyebrow">operator queue</span>
          <h2 id="ops-metrics-title">Not a board metric</h2>
        </div>
        <div className="hq-ledger">
          {report.operationalMetrics.map((metric) => (
            <Link key={metric.label} href="/hq/crm" className="hq-ledger-row">
              <span className="hq-ledger-label">{metric.label}</span>
              <span className="hq-ledger-detail">
                {metric.value} · target {metric.target} · {metric.source}
              </span>
              <span className="hq-ledger-arrow">open crm →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="hq-ledger-section" aria-labelledby="watchlist-title">
        <div className="hq-ledger-headline">
          <span className="hq-page-eyebrow">watchlist</span>
          <h2 id="watchlist-title">What can mislead the room</h2>
        </div>
        <div className="hq-ledger">
          {report.watchlist.map((item) => (
            <Link key={item.label} href={item.href} className="hq-ledger-row">
              <span className="hq-ledger-label">{item.label}</span>
              <span className="hq-ledger-detail">{item.detail}</span>
              <span className="hq-ledger-arrow">open →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="hq-ledger-section" aria-labelledby="sources-title">
        <div className="hq-ledger-headline">
          <span className="hq-page-eyebrow">sources</span>
          <h2 id="sources-title">Where the numbers come from</h2>
        </div>
        <div className="hq-ledger">
          {report.sources.map((source) => (
            <Link key={source.label} href={source.href} className="hq-ledger-row">
              <span className="hq-ledger-label">{source.label}</span>
              <span className="hq-ledger-detail">{source.detail}</span>
              <span className="hq-ledger-arrow">open →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
