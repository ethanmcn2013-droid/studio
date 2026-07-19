import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { getProspects } from "@/lib/hq/crm-db";
import { getHqReport } from "@/lib/hq/operating-system";
import { getTraction } from "@/lib/hq/traction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reporting · Signal HQ",
  description: "Simple founder and shareholder metrics for Signal Studio.",
  robots: { index: false, follow: false },
};

const METRIC_TONE: Record<string, string> = {
  moving: "done",
  flat: "quiet",
  blocked: "critical",
  unread: "quiet",
};

export default async function ReportingPage() {
  await requireHqAccess();

  const [prospects, traction] = await Promise.all([getProspects(), getTraction()]);
  const report = getHqReport(prospects, traction);

  return (
    <div className="hqx-page">
      <header className="hqx-page-header">
        <span className="hqx-eyebrow">Money · Reporting</span>
        <div className="hqx-page-header-row">
          <h1 className="hqx-title">Five numbers and the source</h1>
          <Link href="/hq/financial-model" className="hqx-btn hqx-btn--ghost">Financial model →</Link>
        </div>
        <p className="hqx-lede">{report.headline}</p>
      </header>

      <section className="hqx-section">
        <div className="hqx-section-head">
          <h2 className="hqx-section-title">Key metrics</h2>
          <span className="hqx-status"><span className="hqx-dot" />No vanity layer</span>
        </div>
        <div className="hqx-metric-row hqx-metric-row--5">
          {report.metrics.map((metric) => (
            <div key={metric.label} className="hqx-metric" data-tone={METRIC_TONE[metric.status] ?? "quiet"}>
              <span className="hqx-metric-label">{metric.label}</span>
              <span className="hqx-metric-value">{metric.value}</span>
              <span className="hqx-metric-note">target {metric.target}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="hqx-layout">
        <div className="hqx-section" style={{ gap: "var(--space-7)" }}>
          <section className="hqx-section">
            <div className="hqx-section-head">
              <h2 className="hqx-section-title">Watchlist</h2>
              <span className="hqx-section-action">What can mislead the room</span>
            </div>
            <div className="hqx-rows">
              {report.watchlist.map((item) => (
                <Link key={item.label} href={item.href} className="hqx-row" data-priority="stale">
                  <span className="hqx-row-lead"><span className="hqx-row-marker" /></span>
                  <span className="hqx-row-body">
                    <span className="hqx-row-title">{item.label}</span>
                    <span className="hqx-row-why">{item.detail}</span>
                  </span>
                  <span className="hqx-row-meta"><span className="hqx-row-arrow" aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          </section>

          <section className="hqx-section">
            <div className="hqx-section-head">
              <h2 className="hqx-section-title">Operator queue</h2>
              <span className="hqx-section-action">Not a board metric</span>
            </div>
            <div className="hqx-rows">
              {report.operationalMetrics.map((metric) => (
                <Link key={metric.label} href="/hq/crm" className="hqx-row" data-priority="due">
                  <span className="hqx-row-lead"><span className="hqx-row-marker" /></span>
                  <span className="hqx-row-body">
                    <span className="hqx-row-title">{metric.label}</span>
                    <span className="hqx-row-why">{metric.value} · target {metric.target} · {metric.source}</span>
                  </span>
                  <span className="hqx-row-meta"><span className="hqx-ac-metatext">CRM</span><span className="hqx-row-arrow" aria-hidden="true">→</span></span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="hqx-aside">
          <div className="hqx-summary-card">
            <span className="hqx-summary-label">Sources</span>
            <p className="hqx-row-why" style={{ whiteSpace: "normal" }}>Where every number comes from.</p>
            {report.sources.map((source) => (
              <div key={source.label} className="hqx-summary-row">
                <span className="hqx-summary-row-label">{source.label}</span>
                <Link href={source.href} className="hqx-summary-row-value" style={{ textDecoration: "none" }}>open →</Link>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
