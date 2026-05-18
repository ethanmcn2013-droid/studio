import { seedHqData } from "@/lib/hq/data";
import type { TractionState } from "@/lib/hq/traction";

/**
 * The proof gate — the only scoreboard the 2026-05-18 strategy review
 * permits us to build (decision #3). It exists to make the kill clock
 * *concrete* so it stops being "the absence of a decision wearing
 * discipline's clothes".
 *
 * The five metrics (spine §6, BUSINESS_PARTNER_REVIEW_2026_05.md):
 *   1. qualified replies   — derived from the Outbound CRM
 *   2. booked calls        — derived from the Outbound CRM
 *   3. paid pilots         — the proof gate; reuses TractionState (real sponsors DB)
 *   4. couples activated   — dark by design until #3 moves
 *   5. shared artifacts    — dark by design until #3 moves
 *
 * Why 4 and 5 are not instrumented: they are structurally downstream of a
 * paid pilot. Building event tracking for a state 60+ days away while zero
 * sends have happened is the productive-avoidance pattern the review
 * pre-refused (§3). They are represented honestly as deferred, not faked
 * as zero, and not built.
 *
 * Prospect data source: the committed `seedHqData.prospects` baseline —
 * the same source HQ Inbox already trusts server-side. The operator's
 * live edits live in the browser CRM (localStorage); this scoreboard
 * reads the committed record and says so.
 */

/** Concrete kill-clock dates from the 2026-05-18 review decision #4. */
const OUTREACH_START = "2026-05-25"; // first five SENT, not drafted
const TWENTY_SENT = "2026-06-08"; // 20 founder-signed outreaches sent
const CHECKPOINT = "2026-06-16"; // honest integrity checkpoint (not a kill point)
const EXPIRY = "2026-08-07"; // kill-clock expiry — 60 days from full send

const REPLIED = new Set(["Replied", "Demo Booked", "Pilot Active"]);
const CALLED = new Set(["Demo Booked", "Pilot Active"]);

function parseDay(s: string): number | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const t = Date.parse(`${s}T00:00:00Z`);
  return Number.isNaN(t) ? null : t;
}

function daysBetween(fromMs: number, toMs: number): number {
  return Math.round((toMs - fromMs) / 86_400_000);
}

export type MetricCell =
  | { kind: "live"; n: number; target: number; met: boolean; note: string }
  | { kind: "dark"; reason: string }
  | { kind: "unread"; reason: string };

export type ProofGate = {
  /** Server render time, day-resolution. */
  asOfDay: string;
  /** Recorded founder-signed sends (prospects with a logged contact date). */
  sent: number;
  /** Earliest logged send — the start event the 60-day clock hangs on. */
  firstSendDay: string | null;
  metrics: {
    qualifiedReplies: MetricCell;
    bookedCalls: MetricCell;
    paidPilots: MetricCell;
    couplesActivated: MetricCell;
    sharedArtifacts: MetricCell;
  };
  clock: {
    /** "inert" until the first send is logged — the review's core finding. */
    state: "inert" | "running" | "expired";
    /** One honest sentence the masthead-adjacent eye can read in full. */
    line: string;
    milestones: Array<{
      label: string;
      date: string;
      daysAway: number;
      done: boolean;
      missed: boolean;
    }>;
  };
};

export function getProofGate(traction: TractionState): ProofGate {
  const now = Date.now();
  const asOfDay = new Date(now).toISOString().slice(0, 10);
  const prospects = seedHqData.prospects ?? [];

  // A "send" is a logged contact date. Status is engagement, not the act.
  const sendDays: number[] = [];
  let sent = 0;
  let qualifiedReplies = 0;
  let bookedCalls = 0;
  for (const p of prospects) {
    const d = parseDay(p.lastContacted);
    if (d != null) {
      sent += 1;
      sendDays.push(d);
    }
    if (REPLIED.has(p.status)) qualifiedReplies += 1;
    if (CALLED.has(p.status)) bookedCalls += 1;
  }
  const firstSendMs = sendDays.length ? Math.min(...sendDays) : null;
  const firstSendDay =
    firstSendMs != null ? new Date(firstSendMs).toISOString().slice(0, 10) : null;

  // Metric 3 — the proof gate. Reuse the real sponsors-DB read.
  let paidPilots: MetricCell;
  let couplesActivated: MetricCell;
  if (!traction.available) {
    paidPilots = { kind: "unread", reason: traction.reason };
    couplesActivated = { kind: "unread", reason: traction.reason };
  } else {
    paidPilots = {
      kind: "live",
      n: traction.paidVenues,
      target: 1,
      met: traction.paidVenues >= 1,
      note:
        traction.paidVenues >= 1
          ? `cash in the door · ${traction.signedUnpaidVenues} signed-unpaid is pipeline, not money`
          : traction.signedUnpaidVenues > 0
            ? `0 paid · ${traction.signedUnpaidVenues} signed, not yet paid — pipeline, not the gate`
            : "0 paid · the one number that decides the next 60 days",
    };
    // Metric 4 only becomes a real question once a pilot pays. Until then
    // it is honestly dark — not zero, not built.
    couplesActivated =
      traction.paidVenues >= 1
        ? {
            kind: "live",
            n: traction.couplesSeeded,
            target: 0,
            met: traction.couplesSeeded > 0,
            note: "codes redeemed · activation thresholds open once a pilot is live",
          }
        : {
            kind: "dark",
            reason: "opens when a pilot pays — deferred by the same logic as the product freeze",
          };
  }

  const milestones = [
    {
      label: "outreach-start (first five sent)",
      date: OUTREACH_START,
      daysAway: daysBetween(now, parseDay(OUTREACH_START)!),
      done: sent >= 5,
      missed: sent < 5 && now > parseDay(OUTREACH_START)!,
    },
    {
      label: "20 sent",
      date: TWENTY_SENT,
      daysAway: daysBetween(now, parseDay(TWENTY_SENT)!),
      done: sent >= 20,
      missed: sent < 20 && now > parseDay(TWENTY_SENT)!,
    },
    {
      label: "integrity checkpoint",
      date: CHECKPOINT,
      daysAway: daysBetween(now, parseDay(CHECKPOINT)!),
      done: false,
      missed: false,
    },
    {
      label: "kill-clock expiry",
      date: EXPIRY,
      daysAway: daysBetween(now, parseDay(EXPIRY)!),
      done: false,
      missed: now > parseDay(EXPIRY)!,
    },
  ];

  let state: ProofGate["clock"]["state"];
  let line: string;
  if (firstSendMs == null) {
    state = "inert";
    const dToStart = daysBetween(now, parseDay(OUTREACH_START)!);
    line =
      dToStart >= 0
        ? `Clock is inert — the 60-day window has not started because zero sends are logged. ${dToStart} day${dToStart === 1 ? "" : "s"} until the outreach-start deadline (${OUTREACH_START}). The clock starts the day a founder-signed email is sent, not the day it is drafted.`
        : `Clock is inert and the outreach-start deadline (${OUTREACH_START}) has passed with zero sends. This is not discipline — it is the decision not made.`;
  } else if (now > parseDay(EXPIRY)!) {
    state = "expired";
    line = `60-day window expired ${EXPIRY}. First send was ${firstSendDay}, ${sent} sent total. Spine §8 kill/pivot evaluation is due.`;
  } else {
    state = "running";
    const dToExpiry = daysBetween(now, parseDay(EXPIRY)!);
    line = `Running since first send ${firstSendDay}. ${sent} sent, ${qualifiedReplies} qualified ${qualifiedReplies === 1 ? "reply" : "replies"}, ${bookedCalls} booked ${bookedCalls === 1 ? "call" : "calls"}. ${dToExpiry} day${dToExpiry === 1 ? "" : "s"} to the ${EXPIRY} expiry.`;
  }

  return {
    asOfDay,
    sent,
    firstSendDay,
    metrics: {
      qualifiedReplies: {
        kind: "live",
        n: qualifiedReplies,
        target: 1,
        met: qualifiedReplies >= 1,
        note: "a real decision-maker engaging on substance — not a thanks-not-now",
      },
      bookedCalls: {
        kind: "live",
        n: bookedCalls,
        target: 1,
        met: bookedCalls >= 1,
        note: "a scheduled conversation with someone who can sign",
      },
      paidPilots,
      couplesActivated,
      sharedArtifacts: {
        kind: "dark",
        reason: "opens when a pilot pays — deferred by the same logic as the product freeze",
      },
    },
    clock: { state, line, milestones },
  };
}
