import type { UsageTransaction } from '../account/instrumentation/usage-transaction';
import { sql } from "drizzle-orm";
import type { CanonicalUsageIssuance } from "../account/instrumentation/verified-ingest";
import type { VenueMeaningfulActionV1 } from "../account/instrumentation/event-schema";
import { CONTRIBUTION_RETENTION_DAYS } from "./contract";
import { unitKeyFor } from "./storage";

async function installed(tx: UsageTransaction) {
  const result = await tx.all(sql`SELECT name FROM sqlite_master WHERE type='table' AND name='sponsor_programmes'`);
  return result.length > 0;
}
/** Called only inside the existing verified-ingest writer transaction. */
export async function recordProgrammeContribution(tx: UsageTransaction, canonical: CanonicalUsageIssuance,
  event: VenueMeaningfulActionV1, epoch: string, localDate: string) {
  if (canonical.environment !== "internal_test") return;
  if (!await installed(tx)) return; // Additive deployment; never creates schema during ingestion.
  await tx.run(sql`INSERT OR IGNORE INTO sponsor_programme_contributions
    (programme_id,unit_key,epoch,workspace_hash,subject_hash,local_date,expires_at)
    SELECT id,${unitKeyFor(canonical.licenseCodeId)},${epoch},${event.workspaceIdHash},${event.subjectIdHash},${localDate},${event.occurredAt + CONTRIBUTION_RETENTION_DAYS * 86400000}
    FROM sponsor_programmes WHERE sponsor_id=${canonical.sponsorId} AND status='internal'
    AND kind='venue' AND measurement_starts_on<=${localDate}`);
}
/** Whole-family withdrawal: no changed counts or replacement report after erasure. */
export async function invalidateProgrammeReports(tx: UsageTransaction, sponsorIds: readonly string[]) {
  if (!await installed(tx)) return;
  for (const sponsorId of new Set(sponsorIds)) {
    await tx.run(sql`UPDATE sponsor_programmes SET status='restricted' WHERE sponsor_id=${sponsorId}`);
    await tx.run(sql`UPDATE sponsor_programme_reports SET state='restricted',payload_json=NULL WHERE sponsor_id=${sponsorId}`);
    await tx.run(sql`DELETE FROM sponsor_programme_contributions WHERE programme_id IN (SELECT id FROM sponsor_programmes WHERE sponsor_id=${sponsorId})`);
    await tx.run(sql`DELETE FROM sponsor_programme_coverage WHERE programme_id IN (SELECT id FROM sponsor_programmes WHERE sponsor_id=${sponsorId})`);
    await tx.run(sql`DELETE FROM sponsor_programme_feedback WHERE programme_id IN (SELECT id FROM sponsor_programmes WHERE sponsor_id=${sponsorId})`);
    await tx.run(sql`DELETE FROM sponsor_programme_release_units WHERE sponsor_id=${sponsorId}`);
  }
}
export async function retainProgrammeContributions(tx: UsageTransaction, now: number) {
  if (!await installed(tx)) return;
  // Expired contributions cannot substantiate future complete coverage.
  await tx.run(sql`DELETE FROM sponsor_programme_coverage WHERE EXISTS
    (SELECT 1 FROM sponsor_programme_contributions c WHERE c.programme_id=sponsor_programme_coverage.programme_id
    AND c.local_date=sponsor_programme_coverage.local_date AND c.expires_at<=${now})`);
  await tx.run(sql`DELETE FROM sponsor_programme_contributions WHERE expires_at<=${now}`);
  await tx.run(sql`DELETE FROM sponsor_programme_feedback WHERE expires_at<=${now}`);
  await tx.run(sql`UPDATE sponsor_programme_reports SET state='restricted',payload_json=NULL WHERE expires_at<=${now}`);
}

