import "server-only";
import type { InboxData } from "@/lib/hq/inbox";
import type { PulseState } from "@/lib/hq/pulse";
import { formatEur, type TractionState } from "@/lib/hq/traction";

/**
 * Verdict, the one line the founder reads before anything else.
 *
 * HQ v3 (2026-05-16). The masthead used to show a flat 4-stat strip:
 * four equal-weight numbers, no triage, the single most important thing
 * (does anything need me?) rendered at the same weight as "atlas
 * entries drifted". The Verdict replaces it with one resolved sentence
 * and one action.
 *
 * Hard contract (strategy non-negotiable #1): the verdict is
 * MECHANICALLY DERIVED, never authored. Every sentence below is a pure
 * function of inbox + pulse + traction, and `inputs[]` carries the exact
 * numbers that produced it so the masthead can show its working in one
 * click. The moment this reads like prose instead of a computed
 * judgment it has become the System-tab fiction with better typography.
 *
 * Priority is the whole point, acute beats chronic:
 *   on-fire  , a critical Pulse signal or a high-tier Inbox item is
 *               costing you something now. Fix it.
 *   one-thing, nothing acute, but there is exactly one thing that
 *               matters. If €0 is collected and no venue is signed,
 *               that one thing is venue outreach, surfaced even though
 *               it is uncomfortable and is not a code task (strategy
 *               non-negotiable #3: the page must name the founder's own
 *               bottleneck, not the loudest list row).
 *   calm     , nothing owes an answer, nothing is rotting. The only
 *               number that matters is cash against the six-month clock.
 */

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
  const b = t.burndown;
  return [
    { label: "cash collected", value: formatEur(t.cashCollectedEur) },
    {
      label: "pace",
      value: b.notStarted
        ? "clock at day 0"
        : b.onPace
          ? `${formatEur(b.paceDeltaEur)} ahead`
          : `${formatEur(-b.paceDeltaEur)} behind`,
    },
    {
      label: "clock",
      value: `week ${b.weeksElapsed} of ${b.totalWeeks} · ${b.daysRemaining}d left`,
    },
    { label: "paid venues", value: String(t.paidVenues) },
    { label: "signed, unpaid", value: String(t.signedUnpaidVenues) },
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

  const businessNotStarted =
    traction.available &&
    traction.cashCollectedEur === 0 &&
    traction.paidVenues === 0 &&
    traction.signedUnpaidVenues === 0;

  const week =
    traction.available && !businessNotStarted
      ? ""
      : traction.available
        ? ` Week ${traction.burndown.weeksElapsed} of ${traction.burndown.totalWeeks}.`
        : "";

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
  if (businessNotStarted) {
    return {
      level: "one-thing",
      headline: `Nothing sold, no venue signed.${week}`,
      action:
        "Contact venues. The dashboard cannot move this number, outreach can. The prospect list is built and no outreach has been sent.",
      actionHref: "/hq/partners",
      inputs,
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
  const cashLine =
    traction.available && traction.cashCollectedEur > 0
      ? ` ${formatEur(traction.cashCollectedEur)} collected,${
          traction.burndown.onPace ? " on pace." : " behind the slope."
        }`
      : "";
  return {
    level: "calm",
    headline: "Nothing owes you an answer. Nothing is rotting.",
    action: `The only number that matters is cash against the six-month clock.${week}${cashLine}`,
    actionHref: "/hq/partners",
    inputs,
  };
}
