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

const METRIC_TONE: Record<string, string> = {
  moving: "done",
  flat: "quiet",
  blocked: "critical",
  unread: "quiet",
};

export default async function FoundersCirclePage() {
  await requireHqAccess();

  const [prospects, traction] = await Promise.all([getProspects(), getTraction()]);
  const report = getHqReport(prospects, traction);

  return (
    <div className="hqx-page">
      <header className="hqx-page-header">
        <span className="hqx-eyebrow">Board room · Signal Studio</span>
        <div className="hqx-page-header-row">
          <h1 className="hqx-title">Founders Circle</h1>
          <span className="hqx-pill" data-tone="accent">Shareholder-safe</span>
        </div>
        <p className="hqx-lede">
          A calm shareholder room: the current story, the five company numbers, the material
          progress and risk, and the next ask. Operator detail stays outside this room.
        </p>
      </header>

      <div className="hqx-banner" data-tone="accent">
        <span className="hqx-banner-mark" />
        <div className="hqx-banner-body">
          <span className="hqx-banner-kicker">Current read</span>
          <span className="hqx-banner-title">{report.headline}</span>
        </div>
        <Link href="/hq/reporting" className="hqx-btn hqx-btn--ghost">Source numbers →</Link>
      </div>

      <section className="hqx-section">
        <div className="hqx-section-head">
          <h2 className="hqx-section-title">The five numbers</h2>
          <Link href="/hq/financial-model" className="hqx-section-action">Model →</Link>
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
        <div className="hqx-section" style={{ gap: "var(--space-8)" }}>
          <section className="hqx-section">
            <div className="hqx-section-head">
              <h2 className="hqx-section-title">Material progress &amp; risk</h2>
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
              <h2 className="hqx-section-title">Board pack</h2>
              <span className="hqx-status"><span className="hqx-dot" />Material to share</span>
            </div>
            <div className="hqx-rows">
              {FOUNDER_CIRCLE_PACKS.map((pack) => (
                <Link key={pack.title} href={pack.href} className="hqx-row">
                  <span className="hqx-row-lead"><span className="hqx-row-marker" /></span>
                  <span className="hqx-row-body">
                    <span className="hqx-row-title">{pack.title}</span>
                    <span className="hqx-row-why">{pack.note}</span>
                  </span>
                  <span className="hqx-row-meta">
                    <span className="hqx-pill" data-tone={pack.status === "ready" ? "done" : "flight"}>{pack.status}</span>
                    <span className="hqx-ac-metatext">{pack.cadence}</span>
                    <span className="hqx-row-arrow" aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="hqx-aside">
          <div className="hqx-summary-card">
            <span className="hqx-summary-label">Reporting freshness</span>
            {report.sources.map((source) => (
              <div key={source.label} className="hqx-summary-row">
                <span className="hqx-summary-row-label">{source.label}</span>
                <Link href={source.href} className="hqx-summary-row-value" style={{ textDecoration: "none" }}>open →</Link>
              </div>
            ))}
          </div>

          <div className="hqx-summary-card">
            <span className="hqx-summary-label">Review principles</span>
            <p className="hqx-row-why" style={{ whiteSpace: "normal" }}>
              Polished enough to send, plain enough to trust.
            </p>
            {HQ_REVIEW_PRINCIPLES.map((p) => (
              <div key={p.role} className="hqx-summary-row">
                <span className="hqx-summary-row-label">{p.role}</span>
                <span className="hqx-summary-row-value" style={{ fontWeight: "var(--weight-regular)", color: "var(--ink-faint)", textAlign: "right", maxWidth: "60%" }}>{p.finding}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
