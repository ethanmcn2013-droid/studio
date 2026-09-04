import { computeOutreachSummary } from "@/lib/hq/crm-utils";
import { COMMERCIAL_TERMS } from "@/lib/commercial-terms";
import type { DbProspect } from "@/lib/db/schema";
import type { TractionState } from "@/lib/hq/traction";

export type MetricCell =
  | { kind: "live"; n: number; target: number; met: boolean; note: string }
  | { kind: "dark"; reason: string }
  | { kind: "unread"; reason: string };

export type ProofGate = {
  asOfDay: string;
  sent: number;
  /** Earliest eligible recorded contact, not proof of first-send time. */
  firstSendDay: string | null;
  metrics: {
    qualifiedReplies: MetricCell;
    bookedCalls: MetricCell;
    paidPilots: MetricCell;
    codesRedeemed: MetricCell;
    couplesActivated: MetricCell;
    sharedArtifacts: MetricCell;
  };
  clock: {
    state: "prelaunch" | "inert" | "running" | "expired";
    line: string;
    milestones: Array<{
      label: string; date: string; daysAway: number; done: boolean; missed: boolean;
    }>;
  };
};

/** January supersedes the May deadlines. No date opens access or passes a gate.
 * CRM contact history is not an immutable send ledger, so it cannot establish
 * the old full-cohort kill clock. Missing sources are unread, never seed counts.
 */
export function getProofGate(
  traction: TractionState,
  dbProspects?: DbProspect[],
  now = Date.now(),
): ProofGate {
  const asOfDay = new Date(now).toISOString().slice(0, 10);
  const launchDay = COMMERCIAL_TERMS.launchProgramme.firstOutreachDate;
  const eligible = dbProspects?.filter((p) => {
    const day = p.lastContactedAt;
    if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day) || day < launchDay || day > asOfDay) return false;
    const parsed = Date.parse(`${day}T00:00:00Z`);
    return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === day;
  });
  const { sent, firstSendDay, qualifiedReplies, bookedCalls } = computeOutreachSummary(eligible ?? [], "venue");
  const prelaunch = asOfDay < launchDay;
  const contactMetric = (n: number, note: string): MetricCell => dbProspects === undefined
    ? { kind: "unread", reason: "Live CRM unavailable. Committed examples are excluded." }
    : { kind: "live", n, target: 1, met: n >= 1, note };
  const paidPilots: MetricCell = traction.available ? {
    kind: "live", n: traction.paidVenues, target: 1, met: traction.paidVenues >= 1,
    note: `recorded paid venues · ${traction.signedUnpaidVenues} selected a paid plan without recorded payment · legacy evidence audit remains open`,
  } : { kind: "unread", reason: traction.reason };
  // codesRedeemed is an all-source code count. couplesSeeded is an entitlement
  // count. Neither is a count of couples doing useful work.
  const codesRedeemed: MetricCell = traction.available ? {
    kind: "live", n: traction.codesRedeemed, target: 0, met: false,
    note: "all sources · access redemption only · not couples or useful actions",
  } : { kind: "unread", reason: traction.reason };

  return {
    asOfDay, sent, firstSendDay,
    metrics: {
      qualifiedReplies: contactMetric(qualifiedReplies, "venue CRM stages with a recorded contact on or after January 21"),
      bookedCalls: contactMetric(bookedCalls, "venue CRM stages with a recorded contact on or after January 21"),
      paidPilots, codesRedeemed,
      couplesActivated: { kind: "unread", reason: "Useful activation is unverified here. Redemption, access grants and page visits do not prove a committed useful action." },
      sharedArtifacts: { kind: "unread", reason: "Actual sharing is unverified here. Demo artifacts and page views are excluded." },
    },
    clock: {
      state: prelaunch ? "prelaunch" : sent > 0 ? "running" : "inert",
      line: prelaunch
        ? `Internal testing. User launch and first outreach target ${launchDay}. Both require a recorded manual go/no-go; the date opens neither.`
        : sent > 0
          ? `${sent} venue contacts recorded on or after ${launchDay}. CRM contact dates alone do not establish launch approval or the full-cohort evaluation clock.`
          : `January target ${launchDay}. No eligible venue contacts are recorded${dbProspects === undefined ? " because the live CRM is unavailable" : ""}. Confirm the manual launch and outreach decisions before sending.`,
      milestones: [{
        label: "user launch and first outreach target", date: launchDay,
        daysAway: Math.ceil((Date.parse(`${launchDay}T00:00:00Z`) - now) / 86400000),
        done: false, missed: false,
      }],
    },
  };
}
