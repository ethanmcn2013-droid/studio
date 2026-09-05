import { computeOutreachSummary } from "@/lib/hq/crm-utils";
import { COMMERCIAL_TERMS } from "@/lib/commercial-terms";
import { getCommercialClock } from "./commercial-clock";
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

/** Contact metadata stays distinct from an authorised send receipt. */
export function eligibleVenueContacts(dbProspects: DbProspect[] | undefined, now = Date.now()) {
  const asOfDay = new Date(now).toISOString().slice(0, 10);
  return dbProspects?.filter((p) => {
    const day = p.lastContactedAt;
    if (!day || !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
        day < COMMERCIAL_TERMS.launchProgramme.firstOutreachDate || day > asOfDay) return false;
    const parsed = Date.parse(`${day}T00:00:00Z`);
    return Number.isFinite(parsed) && new Date(parsed).toISOString().slice(0, 10) === day;
  });
}

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
  const eligible = eligibleVenueContacts(dbProspects, now);
  const { sent, firstSendDay, qualifiedReplies, bookedCalls } = computeOutreachSummary(eligible ?? [], "venue");
  const commercialClock = getCommercialClock(now);
  const contactMetric = (n: number, note: string): MetricCell => dbProspects === undefined
    ? { kind: "unread", reason: "Live CRM unavailable. Committed examples are excluded." }
    : { kind: "live", n, target: 1, met: n >= 1, note };
  const paidPilots: MetricCell = traction.available ? {
    kind: "live", n: traction.paidVenues, target: 1, met: traction.paidVenues >= 1,
    note: `current shared payment receipts · ${traction.unverifiedPaidVenues} legacy or unmatched paid claims excluded · ${traction.selectedUnpaidVenues} selected a plan without payment`,
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
      state: commercialClock.state,
      line: `${commercialClock.line} CRM contact dates do not establish launch approval or actual authorised sends.`,
      milestones: [{
        label: "user launch and first outreach target", date: launchDay,
        daysAway: Math.ceil((Date.parse(`${launchDay}T00:00:00Z`) - now) / 86400000),
        done: false, missed: false,
      }],
    },
  };
}
