import { createHash } from "node:crypto";
import type { Client, Transaction, InValue } from "@libsql/client";
import { canonicalJson, contentHashFor } from "../account/instrumentation/freeze";
import { computeReport, type ComputeInput } from "./compute";
import { parseSponsorReport } from "./validation";
import { REPORT_POLICY, type Programme, type SponsorReport } from "./contract";

export type ReportDatabase = Pick<Client, "execute" | "transaction">;
export type Capability = "report_read" | "report_export" | "invitation_admin";
export class ReportError extends Error {
  constructor(public readonly code: "forbidden" | "not_found" | "not_ready" | "restricted" | "conflict" | "unavailable") { super(code); }
}
export const unitKeyFor = (licenseCodeId: string) => createHash("sha256").update(`sponsor-unit:v1:${licenseCodeId}`).digest("hex");
export async function readProgramme(db: Pick<Client, "execute">, id: string): Promise<Programme> {
  const row = (await db.execute({ sql: "SELECT * FROM sponsor_programmes WHERE id=?", args: [id] })).rows[0];
  if (!row) throw new ReportError("not_found");
  if (row.policy_version !== REPORT_POLICY) throw new ReportError("restricted");
  return { id: String(row.id), sponsorId: String(row.sponsor_id), kind: row.kind as Programme["kind"],
    timezone: String(row.timezone), agreementVersion: String(row.agreement_version),
    measurementStartsOn: String(row.measurement_starts_on), status: row.status as Programme["status"], feedbackCollection: row.feedback_collection as Programme["feedbackCollection"] };
}
export async function requireCapability(db: Pick<Client, "execute">, programmeId: string, subject: string, capability: Capability, now: number) {
  const rows = await db.execute({ sql: "SELECT 1 FROM sponsor_programme_members WHERE programme_id=? AND subject_id=? AND capability=? AND revoked_at IS NULL AND expires_at>?", args: [programmeId, subject, capability, now] });
  if (!rows.rows.length) throw new ReportError("forbidden");
}
/** Private service writer. Inputs must come from complete verified claim enumeration. */
export async function publishReport(db: ReportDatabase, input: ComputeInput, validateCustody?: (tx: Transaction) => Promise<void>): Promise<SponsorReport> {
  const tx = await db.transaction("write");
  try {
    const programme = await readProgramme(tx, input.programme.id);
    if (programme.status !== "internal" || canonicalJson(programme) !== canonicalJson(input.programme)) throw new ReportError("restricted");
    const prior = (await tx.execute({ sql: "SELECT * FROM sponsor_programme_reports WHERE programme_id=? AND claim_month=?", args: [programme.id, input.claimMonth] })).rows[0];
    if (prior) {
      if (prior.state !== "released" || Number(prior.expires_at) <= input.now) throw new ReportError("restricted");
      const report = decodeReport(prior.payload_json, prior.content_hash);
      await tx.commit(); return report;
    }
    await validateCustody?.(tx);
    // The only randomized release computation occurs after immutable-prior lookup,
    // under the same writer transaction as its disclosure reservation.
    const computed = computeReport(input);
    if (Object.values(computed.report.metrics).some(m => m.state === "not_yet_observable")) throw new ReportError("not_ready");
    // Only one immutable cohort publication and one lifetime disclosure per gift.
    const disclosureKeys = [...computed.unitKeys.map(k => `gift:${k}`), ...computed.scopeKeys.map(k => `scope:${k}`)];
    for (const key of disclosureKeys) {
      const seen = await tx.execute({ sql: "SELECT 1 FROM sponsor_programme_release_units WHERE sponsor_id=? AND unit_key=?", args: [programme.sponsorId, key] });
      if (seen.rows.length) throw new ReportError("conflict");
    }
    const previous = (await tx.execute({ sql: "SELECT claim_month,epoch,state FROM sponsor_programme_reports WHERE programme_id=? ORDER BY claim_month DESC LIMIT 1", args: [programme.id] })).rows[0];
    const pinnedEpoch = (await tx.execute({ sql: "SELECT epoch FROM sponsor_programme_reports WHERE programme_id=? AND epoch IS NOT NULL LIMIT 1", args: [programme.id] })).rows[0]?.epoch;
    if (pinnedEpoch && computed.sourceEpoch && pinnedEpoch !== computed.sourceEpoch) throw new ReportError("conflict");
    if (previous && (previous.state !== "released" || String(previous.claim_month) >= input.claimMonth ||
      (previous.epoch && computed.sourceEpoch && previous.epoch !== computed.sourceEpoch))) throw new ReportError("conflict");
    const payload = canonicalJson(computed.report);
    const id = `spr_${programme.id}_${input.claimMonth}`;
    await tx.execute({ sql: "INSERT INTO sponsor_programme_reports VALUES (?,?,?,?,?,?,?,?,?,?,?)", args: [id, programme.id, programme.sponsorId, input.claimMonth, REPORT_POLICY, computed.sourceEpoch, "released", payload, contentHashFor(payload), input.now, input.now + 365 * 86400000] });
    for (const key of disclosureKeys) await tx.execute({ sql: "INSERT INTO sponsor_programme_release_units VALUES (?,?,?)", args: [programme.sponsorId, key, id] });
    await tx.commit(); return computed.report;
  } catch (error) { await tx.rollback(); throw error; } finally { tx.close(); }
}
function decodeReport(payload: InValue | undefined, hash: InValue | undefined): SponsorReport {
  if (typeof payload !== "string" || contentHashFor(payload) !== hash) throw new ReportError("restricted");
  try { return parseSponsorReport(JSON.parse(payload)); }
  catch { throw new ReportError("restricted"); }
}
export async function getReport(db: ReportDatabase, programmeId: string, month: string, subject: string, exportRequested: boolean, now: number): Promise<SponsorReport> {
  // Authorization and snapshot read share a read transaction, so role removal cannot race a stale cache.
  const tx = await db.transaction("read");
  try {
    await requireCapability(tx, programmeId, subject, exportRequested ? "report_export" : "report_read", now);
    const programme = await readProgramme(tx, programmeId);
    if (programme.status !== "internal") throw new ReportError("restricted");
    const row = (await tx.execute({ sql: "SELECT payload_json,content_hash,state,expires_at FROM sponsor_programme_reports WHERE programme_id=? AND claim_month=?", args: [programmeId, month] })).rows[0];
    if (!row) throw new ReportError("not_found");
    if (row.state !== "released" || Number(row.expires_at) <= now) throw new ReportError("restricted");
    const report = decodeReport(row.payload_json, row.content_hash);
    if (report.programmeId !== programmeId || report.cohort.month !== month) throw new ReportError("restricted");
    await tx.commit(); return report;
  } catch (error) { await tx.rollback(); throw error; } finally { tx.close(); }
}
export async function restrictProgrammeFamily(tx: Pick<Transaction, "execute">, sponsorIds: readonly string[]) {
  for (const sponsorId of new Set(sponsorIds)) {
    await tx.execute({ sql: "UPDATE sponsor_programmes SET status='restricted' WHERE sponsor_id=?", args: [sponsorId] });
    await tx.execute({ sql: "UPDATE sponsor_programme_reports SET state='restricted',payload_json=NULL WHERE sponsor_id=?", args: [sponsorId] });
    for (const table of ["sponsor_programme_contributions", "sponsor_programme_coverage"]) {
      await tx.execute({ sql: `DELETE FROM ${table} WHERE programme_id IN (SELECT id FROM sponsor_programmes WHERE sponsor_id=?)`, args: [sponsorId] });
    }
    await tx.execute({ sql: "DELETE FROM sponsor_programme_release_units WHERE sponsor_id=?", args: [sponsorId] });
    await tx.execute({ sql: "DELETE FROM sponsor_programme_feedback WHERE programme_id IN (SELECT id FROM sponsor_programmes WHERE sponsor_id=?)", args: [sponsorId] });
  }
}
