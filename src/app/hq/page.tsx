import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HqDashboard } from "@/components/hq/hq-dashboard";
import { HqInbox } from "@/components/hq/hq-inbox";
import { HqMasthead, type MastheadStatus } from "@/components/hq/hq-masthead";
import { HqPulse } from "@/components/hq/hq-pulse";
import { HqTraction } from "@/components/hq/hq-traction";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getHqDashboardMarkdown } from "@/lib/hq/dashboard-data";
import { getInboxData } from "@/lib/hq/inbox";
import { getPulseState } from "@/lib/hq/pulse";
import { getTodayData } from "@/lib/hq/today";
import { getTraction } from "@/lib/hq/traction";

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
 * Signal HQ — the founder's mission control.
 *
 * One scrolling page, ordered by urgency, answering four questions in
 * the order a sole operator actually asks them:
 *
 *   1. What needs me right now?      → Inbox
 *   2. Is anything on fire/rotting?  → Pulse
 *   3. Are we winning?               → Traction
 *   4. What's the state of things?   → System (reference, collapsed)
 *
 * Everything above System is derived from real sources every render —
 * no localStorage, no seed prose, no manual upkeep. System is the old
 * dashboard, demoted to reference: the fiction surfaces (synthetic
 * readiness scorecards, editable fake metrics) are gone; the genuine
 * strategic content (products, loop, pipeline, decisions) stays one
 * disclosure-click away.
 */
export default async function HqPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) {
    redirect("/hq/access");
  }

  const [today, inbox, markdown, traction] = await Promise.all([
    getTodayData(),
    getInboxData(),
    getHqDashboardMarkdown(),
    getTraction(),
  ]);
  const pulse = await getPulseState(today);

  const lastResponseAt = today.sessionPulse.lastResponseAt;
  const cadenceDays = lastResponseAt
    ? Math.max(
        0,
        (Date.now() - new Date(lastResponseAt).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const status: MastheadStatus = {
    inbox: inbox.items.length,
    inboxHigh: inbox.tierCounts.high,
    pulseLevel: pulse.level,
    pulseCritical: pulse.counts.critical,
    driftCount: today.atlasDrift.driftedSlugs.length,
    cadenceDays,
  };

  return (
    <div className="hq-spine">
      <HqMasthead
        phaseHeadline={today.phase.headline}
        generatedAt={today.generatedAt}
        status={status}
      />
      <HqInbox data={inbox} />
      <HqPulse state={pulse} />
      <HqTraction state={traction} />

      <details className="hq-system">
        <summary className="hq-system-summary">
          <span className="hq-system-eyebrow">system · reference</span>
          <span className="hq-system-hint">
            products, the loop, pipeline, proof, decisions — open when you
            need the detail
          </span>
        </summary>
        <div className="hq-system-body">
          <HqDashboard markdown={markdown} />
        </div>
      </details>
    </div>
  );
}
