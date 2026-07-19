import type { Metadata } from "next";
import Link from "next/link";
import { CountUp } from "@/components/hq/count-up";
import { HqForcingFunction } from "@/components/hq/hq-forcing-function";
import { HqProofGate } from "@/components/hq/hq-proof-gate";
import { HqPulse } from "@/components/hq/hq-pulse";
import { HqTraction } from "@/components/hq/hq-traction";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { buildActionCenter } from "@/lib/hq/action-center";
import { getProspects } from "@/lib/hq/crm-db";
import { getInboxData } from "@/lib/hq/inbox";
import { getNextOutreachAction } from "@/lib/hq/next-action";
import { getHqSnapshot } from "@/lib/hq/operating-system";
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
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

/**
 * Signal HQ · Today / Mission Control (redesign v6).
 *
 * The page answers "what's the state of the business?" in ten seconds:
 * verdict → the one critical thing → five numbers → workspace health, with
 * the Action Center and next action in the contextual rail. The proof spine
 * (proof gate / pulse / traction) is preserved verbatim below as the
 * commercial-truth section — the inert/running/expired state machine is
 * unchanged, only re-framed. Long queues now live in /hq/action-center.
 */
export default async function HqPage() {
  await requireHqAccess();

  const [today, inbox, traction, prospects, operatorTodos] = await Promise.all([
    getTodayData(),
    getInboxData(),
    getTraction(),
    getProspects(),
    getOperatorTodos(),
  ]);
  const pulse = await getPulseState(today);
  const verdict = deriveVerdict({ inbox, pulse, traction });
  const proofGate = getProofGate(traction, prospects);
  const snapshot = getHqSnapshot(prospects, traction);
  const readiness = getLaunchReadiness(traction.available ? traction.paidVenues : null);
  const actions = buildActionCenter(inbox, operatorTodos);

  const generated = new Date(snapshot.generatedAt).toLocaleTimeString("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const workspaceHealth: Array<{ name: string; href: string; note: string; tone: string; value: string }> = [
    {
      name: "Sell",
      href: "/hq/crm",
      value: `${snapshot.founderSends} sends`,
      note: `${snapshot.dueToday} due or stale · ${snapshot.qualifiedReplies} replies`,
      tone: snapshot.dueToday > 0 ? "flight" : snapshot.founderSends > 0 ? "done" : "blocked",
    },
    {
      name: "Make",
      href: "/hq/design-rooms",
      value: "Design + assets",
      note: "Decision rooms and the launch asset bank",
      tone: "accent",
    },
    {
      name: "Money",
      href: "/hq/reporting",
      value: snapshot.cashCollected,
      note: snapshot.paidVenues === null ? "ledger unread" : `${snapshot.paidVenues} paid venues · 10 by M3`,
      tone: snapshot.paidVenues && snapshot.paidVenues > 0 ? "done" : "flight",
    },
    {
      name: "Company",
      href: "/hq/org",
      value: `${operatorTodos.openCount} to-dos`,
      note: `${operatorTodos.blockingCount} blocking · 17 directors`,
      tone: operatorTodos.blockingCount > 0 ? "blocked" : "done",
    },
  ];

  const commercialTruth =
    proofGate.clock.state === "inert" ? (
      <HqForcingFunction gate={proofGate} next={getNextOutreachAction(prospects)}>
        <HqProofGate gate={proofGate} />
        <HqPulse state={pulse} />
        <HqTraction state={traction} />
      </HqForcingFunction>
    ) : (
      <>
        <HqProofGate gate={proofGate} />
        <HqPulse state={pulse} />
        <HqTraction state={traction} />
      </>
    );

  return (
    <div className="hqx-page">
      <header className="hqx-page-header">
        <span className="hqx-eyebrow">Mission control · generated {generated}</span>
        <div className="hqx-page-header-row">
          <h1 className="hqx-title">Today</h1>
          <span
            className="hqx-status"
            data-tone={verdict.level === "on-fire" ? "blocked" : verdict.level === "one-thing" ? "flight" : "done"}
          >
            <span className="hqx-dot" />
            {verdict.level === "on-fire" ? "On fire" : verdict.level === "one-thing" ? "One thing" : "Calm"}
          </span>
        </div>
        <p className="hqx-lede">{verdict.headline}</p>
      </header>

      {/* The one thing */}
      {actions.top ? (
        <div className="hqx-banner" data-tone={actions.top.priority === "critical" ? "critical" : "accent"}>
          <span className="hqx-banner-mark" />
          <div className="hqx-banner-body">
            <span className="hqx-banner-kicker">
              {actions.top.priority === "critical" ? "Needs you now" : "Next action"} · {actions.top.workspace}
            </span>
            <span className="hqx-banner-title">{actions.top.title}</span>
            <span className="hqx-banner-text">{actions.top.why}</span>
          </div>
          <Link href={actions.top.href ?? "/hq/action-center"} className="hqx-btn hqx-btn--primary">
            Open
          </Link>
        </div>
      ) : null}

      <div className="hqx-layout">
        <div className="hqx-section" style={{ gap: "var(--space-8)" }}>
          {/* Five company numbers */}
          <section className="hqx-section">
            <div className="hqx-section-head">
              <h2 className="hqx-section-title">The numbers</h2>
              <Link href="/hq/reporting" className="hqx-section-action">Reporting →</Link>
            </div>
            <div className="hqx-metric-row hqx-metric-row--3">
              {snapshot.metrics.map((metric) => (
                <Link key={metric.label} href={metric.href} className="hqx-metric" data-tone={metric.tone ?? "quiet"}>
                  <span className="hqx-metric-label">{metric.label}</span>
                  <CountUp className="hqx-metric-value" value={metric.value} />
                  <span className="hqx-metric-note">{metric.note}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Workspace health */}
          <section className="hqx-section">
            <div className="hqx-section-head">
              <h2 className="hqx-section-title">Workspaces</h2>
              <Link href="/hq/action-center" className="hqx-section-action">Action Center →</Link>
            </div>
            <div className="hqx-health-grid">
              {workspaceHealth.map((w) => (
                <Link key={w.name} href={w.href} className="hqx-health-card">
                  <div className="hqx-health-top">
                    <span className="hqx-health-name">{w.name}</span>
                    <span className="hqx-status" data-tone={w.tone}><span className="hqx-dot" /></span>
                  </div>
                  <span className="hqx-metric-value" style={{ fontSize: "1.15rem" }}>{w.value}</span>
                  <span className="hqx-health-note">{w.note}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Founder to-dos — only the founder can move these */}
          <section className="hqx-section">
            <div className="hqx-section-head">
              <h2 className="hqx-section-title">Only you can move these</h2>
              <Link href="/hq/action-center" className="hqx-section-action">
                {operatorTodos.openCount} founder to-dos · {operatorTodos.blockingCount} blocking →
              </Link>
            </div>
            {operatorTodos.openCount === 0 ? (
              <div className="hqx-empty">
                <span className="hqx-empty-title">Nothing gated on you</span>
                <span>No open founder to-dos. Every blocker is cleared.</span>
              </div>
            ) : (
              <div className="hqx-rows">
                {operatorTodos.todos
                  .filter((t) => t.status === "open")
                  .slice(0, 6)
                  .map((todo) => (
                    <Link
                      key={todo.id}
                      href={todo.href ?? "/hq/action-center"}
                      className="hqx-row"
                      data-priority={todo.priority === "P0" ? "critical" : todo.priority === "P1" ? "due" : "queued"}
                    >
                      <span className="hqx-row-lead"><span className="hqx-row-marker" /></span>
                      <span className="hqx-row-body">
                        <span className="hqx-row-title">{todo.title}</span>
                        <span className="hqx-row-why">{todo.why}</span>
                      </span>
                      <span className="hqx-row-meta">
                        {todo.blocking ? <span className="hqx-pill" data-tone="blocked">blocking</span> : null}
                        <span className="hqx-ac-metatext">{todo.priority}</span>
                        <span className="hqx-row-arrow" aria-hidden="true">→</span>
                      </span>
                    </Link>
                  ))}
              </div>
            )}
          </section>

          {/* Commercial truth — the preserved proof spine */}
          <section className="hqx-section" aria-label="Commercial truth">
            <div className="hqx-section-head">
              <h2 className="hqx-section-title">Commercial truth</h2>
              <span className="hqx-status" data-tone={proofGate.clock.state === "running" ? "done" : "flight"}>
                <span className="hqx-dot" />{proofGate.clock.state}
              </span>
            </div>
            <div className="hqx-proofwrap">{commercialTruth}</div>
          </section>
        </div>

        {/* Contextual rail */}
        <aside className="hqx-aside">
          <div className="hqx-summary-card">
            <span className="hqx-summary-label">Next action</span>
            <Link href={snapshot.leadHref} className="hqx-h2" style={{ textDecoration: "none", color: "var(--ink)" }}>
              {snapshot.leadAction}
            </Link>
            <p className="hqx-row-why" style={{ whiteSpace: "normal" }}>{snapshot.leadContext}</p>
            <Link href={snapshot.leadHref} className="hqx-btn hqx-btn--ghost" style={{ marginTop: "var(--space-2)" }}>
              Go →
            </Link>
          </div>

          <div className="hqx-summary-card">
            <span className="hqx-summary-label">Action Center · {actions.total} open</span>
            <div>
              <div className="hqx-summary-row">
                <span className="hqx-summary-row-label"><span className="hqx-dot" style={{ background: "var(--status-blocked)" }} />Critical</span>
                <span className="hqx-summary-row-value">{actions.counts.critical}</span>
              </div>
              <div className="hqx-summary-row">
                <span className="hqx-summary-row-label"><span className="hqx-dot" style={{ background: "var(--status-flight)" }} />Due now</span>
                <span className="hqx-summary-row-value">{actions.counts.due}</span>
              </div>
              <div className="hqx-summary-row">
                <span className="hqx-summary-row-label"><span className="hqx-dot" style={{ background: "var(--ink-faint)" }} />Going stale</span>
                <span className="hqx-summary-row-value">{actions.counts.stale}</span>
              </div>
              <div className="hqx-summary-row">
                <span className="hqx-summary-row-label"><span className="hqx-dot" style={{ background: "var(--ink-ghost)" }} />Queued</span>
                <span className="hqx-summary-row-value">{actions.counts.queued}</span>
              </div>
            </div>
            <Link href="/hq/action-center" className="hqx-btn hqx-btn--ghost">Open Action Center →</Link>
          </div>

          <div className="hqx-summary-card">
            <span className="hqx-summary-label">Launch · {readiness.launchLabel}</span>
            <span className="hqx-h2">{readiness.launched ? "Launched" : `${readiness.daysRemaining} days`}</span>
            <p className="hqx-row-why" style={{ whiteSpace: "normal" }}>
              {readiness.cleared} of {readiness.total} gates clear.
            </p>
            <Link href="/hq/platform-readiness" className="hqx-section-action">Readiness →</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
