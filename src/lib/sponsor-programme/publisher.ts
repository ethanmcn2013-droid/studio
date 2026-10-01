import type { Client } from "@libsql/client";
import type { JobDependencies } from "../account/instrumentation/usage-jobs";
import { canonicalJson } from "../account/instrumentation/freeze";
import { toLocalDate } from "../account/instrumentation/local-date";
import { reportWindow } from "./compute";
import { publishReport, readProgramme, ReportError, restrictProgrammeFamily, unitKeyFor, type ReportDatabase } from "./storage";
import type { ClaimUnit, Contribution, Feedback } from "./contract";

async function sourceSnapshot(db: Pick<Client, "execute">, programmeId: string, start: string, end: string, now: number) {
  const contributions = await db.execute({ sql: "SELECT unit_key,local_date,epoch FROM sponsor_programme_contributions WHERE programme_id=? AND local_date>=? AND local_date<=? AND expires_at>? ORDER BY unit_key,local_date,epoch,subject_hash", args: [programmeId, start, end, now] });
  const coverage = await db.execute({ sql: "SELECT local_date,epoch,evidence_ref FROM sponsor_programme_coverage WHERE programme_id=? AND local_date>=? AND local_date<=? ORDER BY local_date", args: [programmeId, start, end] });
  const feedback = await db.execute({ sql: "SELECT unit_key,useful FROM sponsor_programme_feedback WHERE programme_id=? AND claim_month=? AND expires_at>? ORDER BY unit_key", args: [programmeId, start.slice(0, 7), now] });
  return { contributions: contributions.rows, coverage: coverage.rows, feedback: feedback.rows };
}
/** Complete canonical App proof + same shared entitlement ledger; no side entitlement store. */
export async function publishCanonicalReport(db: ReportDatabase, deps: JobDependencies, programmeId: string, month: string, epoch: string, now: number) {
  if (!/^[a-f0-9]{8}$/.test(epoch) || deps.environment !== "internal_test") throw new ReportError("unavailable");
  const programme = await readProgramme(db, programmeId);
  const window = reportWindow(month);
  // Widen instants by 24h, then filter by venue-local date in computeReport.
  const proofs = await deps.eligible(programme.sponsorId, epoch, Date.parse(window.cohort.start) - 86400000, Date.parse(window.followupThrough) + 2 * 86400000);
  const claims: ClaimUnit[] = proofs.map(p => ({ unitKey: unitKeyFor(p.licenseCodeId), scopeHash: p.workspaceIdHash, epoch: p.epoch,
    claimedOn: toLocalDate(p.grantStartsAt, programme.timezone), accessStartsOn: toLocalDate(p.grantStartsAt, programme.timezone),
    accessEndsOn: toLocalDate(p.grantEndsAt - 1, programme.timezone), measurementAllowed: p.measurementAllowed !== false }));
  if (claims.some(c => !c.measurementAllowed)) {
    const tx = await db.transaction("write");
    try { await restrictProgrammeFamily(tx, [programme.sponsorId]); await tx.commit(); }
    catch (error) { await tx.rollback(); throw error; } finally { tx.close(); }
    throw new ReportError("restricted");
  }
  const snapshot = await sourceSnapshot(db, programmeId, window.cohort.start, window.followupThrough, now);
  const matchingEpochs = snapshot.contributions.every(row => row.epoch === epoch) && snapshot.coverage.every(row => row.epoch === epoch);
  const contributions: Contribution[] = snapshot.contributions.map(row => ({ unitKey: String(row.unit_key), localDate: String(row.local_date) }));
  const feedback: Feedback[] | undefined = programme.feedbackCollection === "enabled" ? snapshot.feedback.map(row => ({ unitKey: String(row.unit_key), useful: row.useful === 1 })) : undefined;
  return publishReport(db, {
    programme, claimMonth: month, now, dataThrough: toLocalDate(now, programme.timezone), claims,
    claimsComplete: matchingEpochs, contributions,
    coveredDates: new Set(snapshot.coverage.map(row => String(row.local_date))), feedback,
  }, async tx => {
    // Erasure and retention must not race a pre-transaction contribution snapshot.
    const current = await sourceSnapshot(tx, programmeId, window.cohort.start, window.followupThrough, now);
    if (canonicalJson(current) !== canonicalJson(snapshot)) throw new ReportError("conflict");
  });
}
