import Link from "next/link";
import type { PulseLevel } from "@/lib/hq/pulse";

/**
 * HQ Masthead — the one line you read before anything else.
 *
 * Phase headline (the operator's own words, from phase.md) sits large.
 * Below it a single mono status strip answers, at a glance: does
 * anything need me, is anything on fire, is the map stale, when did I
 * last work. Everything here is derived. Same register as the atlas:
 * paper white, ink, one indigo, hairlines, no card chrome.
 */

export type MastheadStatus = {
  inbox: number;
  inboxHigh: number;
  pulseLevel: PulseLevel;
  pulseCritical: number;
  driftCount: number;
  cadenceDays: number | null;
};

const PULSE_WORD: Record<PulseLevel, string> = {
  clear: "clear",
  watch: "watch",
  critical: "on fire",
};

export function HqMasthead({
  phaseHeadline,
  generatedAt,
  status,
}: {
  phaseHeadline: string;
  generatedAt: string;
  status: MastheadStatus;
}) {
  const stamp = new Date(generatedAt).toLocaleTimeString("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="hq-mast" aria-label="signal hq">
      <div className="hq-mast-top">
        <span className="hq-mast-eyebrow">
          signal hq<span className="hq-mast-dot" aria-hidden="true">.</span>{" "}
          mission control
        </span>
        <span className="hq-mast-stamp">derived {stamp}</span>
      </div>

      <h1 className="hq-mast-headline">
        {phaseHeadline === "—" ? "No phase recorded yet." : phaseHeadline}
      </h1>

      <div className="hq-mast-strip" role="list">
        <span className="hq-mast-stat" role="listitem">
          <span
            className="hq-mast-stat-dot"
            data-on={status.inbox > 0 ? "true" : "false"}
            aria-hidden="true"
          />
          <span className="hq-mast-stat-num">{status.inbox}</span>
          <span className="hq-mast-stat-label">
            {status.inbox === 1 ? "needs you" : "need you"}
            {status.inboxHigh > 0 ? ` · ${status.inboxHigh} high` : ""}
          </span>
        </span>

        <span className="hq-mast-stat" role="listitem">
          <span
            className="hq-mast-stat-dot"
            data-level={status.pulseLevel}
            aria-hidden="true"
          />
          <span className="hq-mast-stat-num">{PULSE_WORD[status.pulseLevel]}</span>
          <span className="hq-mast-stat-label">
            pulse
            {status.pulseCritical > 0 ? ` · ${status.pulseCritical} critical` : ""}
          </span>
        </span>

        <span className="hq-mast-stat" role="listitem">
          <span className="hq-mast-stat-num">{status.driftCount}</span>
          <span className="hq-mast-stat-label">
            atlas {status.driftCount === 1 ? "entry" : "entries"} drifted
          </span>
        </span>

        <span className="hq-mast-stat" role="listitem">
          <span className="hq-mast-stat-num">
            {status.cadenceDays === null
              ? "—"
              : status.cadenceDays < 1
                ? "today"
                : `${Math.round(status.cadenceDays)}d`}
          </span>
          <span className="hq-mast-stat-label">since last session</span>
        </span>
      </div>

      <nav className="hq-mast-nav" aria-label="hq surfaces">
        <Link href="/hq/atlas" className="hq-mast-link">
          atlas
        </Link>
        <Link href="/hq/health" className="hq-mast-link">
          health
        </Link>
        <Link href="/hq/entitlements" className="hq-mast-link">
          entitlements
        </Link>
        <Link href="/hq/partners" className="hq-mast-link">
          partners
        </Link>
        <Link href="/hq/plan" className="hq-mast-link">
          marketing plan
        </Link>
      </nav>
    </header>
  );
}
