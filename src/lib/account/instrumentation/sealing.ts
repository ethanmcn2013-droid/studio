import { addLocalDays, diffLocalDays, isLocalDayClosed } from "./local-date";
import { EVENT_RETENTION_DAYS } from "./retention-window";

/**
 * Sealing the day-30 band.
 *
 * A workspace's band spans days 25 to 35 after its first action. It can only be
 * judged once day 35 has closed, and it can only be judged *correctly* while
 * the events covering those days still exist. Raw events are deleted at 35
 * days, so at the moment a band closes its oldest day is 10 days old — which is
 * inside retention, but only if this job actually runs.
 *
 * That gives a hard cadence. If sealing falls more than
 * `MAX_SEALING_GAP_DAYS` behind, bands start closing on days whose events are
 * already gone, and those cohorts seal `indeterminate` — excluded from both
 * numerator and denominator, permanently, because the evidence is unrecoverable.
 *
 * `indeterminate` is the honest outcome and never a zero. But it is a hole, so
 * this module reports an at-risk cadence loudly rather than discovering it in a
 * venue's report months later.
 */

export const DAY30_BAND = { earliest: 25, latest: 35 } as const;

/**
 * The band's oldest day is 10 days old when it closes, so there are 25 days of
 * slack against a 35-day retention. Alert well before that is spent.
 */
export const MAX_SEALING_GAP_DAYS = 20;

export type SealCandidate = {
  sponsorId: string;
  workspaceIdHash: string;
  hashSaltEpoch: string;
  firstActionLocalDate: string;
  /** Local dates this workspace acted on, as far as the projection still knows. */
  actionLocalDates: readonly string[];
};

export type SealVerdict = {
  workspaceIdHash: string;
  state: "returned" | "not_returned" | "indeterminate";
  reason?: "events-swept-before-sealing";
};

export function bandFor(firstActionLocalDate: string): { start: string; end: string } {
  return {
    start: addLocalDays(firstActionLocalDate, DAY30_BAND.earliest),
    end: addLocalDays(firstActionLocalDate, DAY30_BAND.latest),
  };
}

/** A band may only be judged once its last day has closed locally. */
export function isBandClosed(
  firstActionLocalDate: string,
  nowMs: number,
  timeZone?: string,
): boolean {
  return isLocalDayClosed(bandFor(firstActionLocalDate).end, nowMs, timeZone);
}

/**
 * Whether the evidence for a band still exists.
 *
 * If the band's earliest day is already older than retention, the events that
 * would prove a return have been swept and no verdict can be trusted.
 */
export function isEvidenceIntact(
  firstActionLocalDate: string,
  todayLocalDate: string,
): boolean {
  const { start } = bandFor(firstActionLocalDate);
  return diffLocalDays(start, todayLocalDate) <= EVENT_RETENTION_DAYS;
}

export function sealCandidate(
  candidate: SealCandidate,
  nowMs: number,
  todayLocalDate: string,
  timeZone?: string,
): SealVerdict | null {
  if (!isBandClosed(candidate.firstActionLocalDate, nowMs, timeZone)) return null;

  if (!isEvidenceIntact(candidate.firstActionLocalDate, todayLocalDate)) {
    return {
      workspaceIdHash: candidate.workspaceIdHash,
      state: "indeterminate",
      reason: "events-swept-before-sealing",
    };
  }

  const { start, end } = bandFor(candidate.firstActionLocalDate);
  const returned = candidate.actionLocalDates.some(
    (date) => date >= start && date <= end,
  );
  return {
    workspaceIdHash: candidate.workspaceIdHash,
    state: returned ? "returned" : "not_returned",
  };
}

export type CadenceHealth = {
  ok: boolean;
  gapDays: number;
  /** Bands that would seal indeterminate if the job ran no sooner than now. */
  atRisk: number;
};

/**
 * How healthy the sealing cadence is.
 *
 * `lastSealedAtMs` is null on a system that has never sealed, which is not a
 * fault on day one; it becomes one as soon as candidates exist.
 */
export function assessCadence(
  lastSealedAtMs: number | null,
  nowMs: number,
  candidates: readonly SealCandidate[],
  todayLocalDate: string,
): CadenceHealth {
  const gapDays =
    lastSealedAtMs == null
      ? Number.POSITIVE_INFINITY
      : Math.floor((nowMs - lastSealedAtMs) / 86_400_000);
  const atRisk = candidates.filter(
    (candidate) => !isEvidenceIntact(candidate.firstActionLocalDate, todayLocalDate),
  ).length;
  const withinCadence = gapDays <= MAX_SEALING_GAP_DAYS;
  return {
    ok: withinCadence && atRisk === 0,
    gapDays: Number.isFinite(gapDays) ? gapDays : -1,
    atRisk,
  };
}
