import "server-only";
import { getCommercialClock } from "./commercial-clock";
import type { InboxData } from "@/lib/hq/inbox";
import type { PulseState } from "@/lib/hq/pulse";
import { formatEur, type TractionState } from "@/lib/hq/traction";

/** Mechanically derived triage. Missing proof never becomes a send instruction. */

export type VerdictLevel = "calm" | "one-thing" | "on-fire";

export type Verdict = {
  level: VerdictLevel;
  /** The resolved sentence. */
  headline: string;
  /** The single true next action. */
  action: string;
  actionHref?: string;
  /** The exact numbers that produced the verdict, the audit trail. */
  inputs: Array<{ label: string; value: string }>;
};

function tractionInputs(
  t: TractionState,
): Array<{ label: string; value: string }> {
  if (!t.available) return [{ label: "traction", value: "db unreachable" }];
  return [
    { label: "cash with matching receipts", value: formatEur(t.cashCollectedEur) },
    { label: "clock", value: t.burndown.state },
    { label: "receipt-matched venues", value: String(t.paidVenues) },
    { label: "unverified paid claims", value: String(t.unverifiedPaidVenues) },
    { label: "plan selected, unpaid", value: String(t.selectedUnpaidVenues) },
  ];
}

export function deriveVerdict(args: {
  inbox: InboxData;
  pulse: PulseState;
  traction: TractionState;
}): Verdict {
  const { inbox, pulse, traction } = args;

  const inputs: Array<{ label: string; value: string }> = [
    {
      label: "inbox",
      value: `${inbox.tierCounts.high} high · ${inbox.tierCounts.mid} mid · ${inbox.tierCounts.low} low`,
    },
    {
      label: "pulse",
      value:
        pulse.level === "clear"
          ? "clear"
          : `${pulse.counts.critical} critical · ${pulse.counts.watch} watch`,
    },
    ...tractionInputs(traction),
  ];

  const clock = traction.available ? traction.burndown : getCommercialClock();

  // ── on-fire, acute, costing you now ────────────────────────────────
  const topCritical = pulse.signals.find((s) => s.level === "critical");
  if (topCritical) {
    return {
      level: "on-fire",
      headline: `On fire: ${topCritical.label}.`,
      action: topCritical.detail,
      actionHref: topCritical.href,
      inputs,
    };
  }
  const topHigh = inbox.items.find((i) => i.tier === "high");
  if (topHigh) {
    return {
      level: "on-fire",
      headline: `Needs you now: ${topHigh.title}.`,
      action: topHigh.detail,
      actionHref: topHigh.href,
      inputs,
    };
  }

  // ── one-thing, the true bottleneck beats the loudest row ───────────
  if (traction.available && traction.unverifiedPaidVenues > 0) {
    return {
      level: "one-thing",
      headline: traction.unverifiedPaidVenues + " paid claims need evidence reconciliation.",
      action: "Match retained payment receipts to the current shared venue records. Legacy paid dates and plan selections do not pass paid proof.",
      actionHref: "/hq/reporting", inputs,
    };
  }
  if (clock.notStarted) {
    return {
      level: "one-thing",
      headline: clock.state === "prelaunch" ? "Internal preparation. Commercial evaluation has not started." : "The target date has been reached. Commercial evaluation remains unstarted.",
      action: clock.line,
      actionHref: "/hq/platform-readiness", inputs,
    };
  }
  const topMid = inbox.items.find((i) => i.tier === "mid");
  if (topMid) {
    return {
      level: "one-thing",
      headline: `One thing: ${topMid.title}.`,
      action: topMid.detail,
      actionHref: topMid.href,
      inputs,
    };
  }
  const topWatch = pulse.signals.find((s) => s.level === "watch");
  if (topWatch) {
    return {
      level: "one-thing",
      headline: `Watch: ${topWatch.label}.`,
      action: topWatch.detail,
      actionHref: topWatch.href,
      inputs,
    };
  }

  // ── calm, quiet is a valid state ──────────────────────────────────
  return {
    level: "calm",
    headline: "Nothing owes you an answer. Nothing is rotting.",
    action: "Read payment receipts and useful-work evidence separately. The historical cash target is not a new January commitment.",
    actionHref: "/hq/partners",
    inputs,
  };
}
