import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const SPONSOR_PROGRAMME_MIGRATION = "0004_sponsor_programme";
const root = fileURLToPath(new URL("../", import.meta.url));
const canonical = value => value.replace(/\r\n?/g, "\n");

function migrationSource() {
  const ledger = JSON.parse(readFileSync(resolve(root, "drizzle-entitlements/additive-ledger.json"), "utf8"));
  const entry = ledger.migrations.find(row => row.id === SPONSOR_PROGRAMME_MIGRATION);
  const journal = JSON.parse(readFileSync(resolve(root, "drizzle-entitlements/meta/_journal.json"), "utf8"));
  if (!entry || !journal.entries.some(row => row.tag === entry.id && row.when === entry.journalWhen)) {
    throw new Error("Sponsor programme additive ledger/journal mismatch.");
  }
  const source = canonical(readFileSync(resolve(root, entry.sql), "utf8"));
  if (createHash("sha256").update(source).digest("hex") !== entry.sha256) {
    throw new Error("Sponsor programme migration hash mismatch.");
  }
  return { entry, source };
}

const expectedTables = {
  sponsor_programmes: {
    columns: ["id", "sponsor_id", "kind", "timezone", "agreement_version", "measurement_starts_on", "status", "policy_version", "feedback_collection"],
    types: ["TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT"], nullable: ["id"],
    pk: ["id"], fks: [["sponsor_id", "sponsors", "id"]],
  },
  sponsor_programme_members: {
    columns: ["programme_id", "subject_id", "capability", "expires_at", "revoked_at"],
    types: ["TEXT", "TEXT", "TEXT", "INTEGER", "INTEGER"], nullable: ["revoked_at"],
    pk: ["programme_id", "subject_id", "capability"], fks: [["programme_id", "sponsor_programmes", "id"]],
  },
  sponsor_programme_contributions: {
    columns: ["programme_id", "unit_key", "epoch", "workspace_hash", "subject_hash", "local_date", "expires_at"],
    types: ["TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "INTEGER"], nullable: [],
    pk: ["programme_id", "unit_key", "epoch", "subject_hash", "local_date"], fks: [["programme_id", "sponsor_programmes", "id"]],
  },
  sponsor_programme_coverage: {
    columns: ["programme_id", "local_date", "epoch", "evidence_ref"],
    types: ["TEXT", "TEXT", "TEXT", "TEXT"], nullable: [],
    pk: ["programme_id", "local_date"], fks: [["programme_id", "sponsor_programmes", "id"]],
  },
  sponsor_programme_reports: {
    columns: ["id", "programme_id", "sponsor_id", "claim_month", "policy_version", "epoch", "state", "payload_json", "content_hash", "released_at", "expires_at"],
    types: ["TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "TEXT", "INTEGER", "INTEGER"], nullable: ["id", "epoch", "payload_json"],
    pk: ["id"], fks: [["programme_id", "sponsor_programmes", "id"]],
  },
  sponsor_programme_release_units: {
    columns: ["sponsor_id", "unit_key", "report_id"],
    types: ["TEXT", "TEXT", "TEXT"], nullable: [],
    pk: ["sponsor_id", "unit_key"], fks: [["report_id", "sponsor_programme_reports", "id"]],
  },
  sponsor_programme_invitations: {
    columns: ["programme_id", "license_code_id", "issued_at", "issuance_evidence", "delivered_at", "delivery_evidence"],
    types: ["TEXT", "TEXT", "INTEGER", "TEXT", "INTEGER", "TEXT"], nullable: ["delivered_at", "delivery_evidence"],
    pk: ["programme_id", "license_code_id"], fks: [["programme_id", "sponsor_programmes", "id"], ["license_code_id", "license_codes", "id"]],
  },
  sponsor_programme_feedback: {
    columns: ["programme_id", "unit_key", "claim_month", "useful", "submitted_at", "expires_at"],
    types: ["TEXT", "TEXT", "TEXT", "INTEGER", "INTEGER", "INTEGER"], nullable: [],
    pk: ["programme_id", "unit_key"], fks: [["programme_id", "sponsor_programmes", "id"]],
  },
};

async function proveSchema(client) {
  for (const [table, expected] of Object.entries(expectedTables)) {
    const columns = (await client.execute(`PRAGMA table_info(${table})`)).rows;
    if (JSON.stringify(columns.map(row => row.name)) !== JSON.stringify(expected.columns)) {
      throw new Error(`Sponsor programme schema proof failed: ${table} columns.`);
    }
    if (JSON.stringify(columns.map(row => String(row.type).toUpperCase())) !== JSON.stringify(expected.types)) {
      throw new Error(`Sponsor programme schema proof failed: ${table} column types.`);
    }
    if (columns.some(row => Number(row.notnull) !== (expected.nullable.includes(row.name) ? 0 : 1))) {
      throw new Error(`Sponsor programme schema proof failed: ${table} nullability.`);
    }
    const expectedDefaults = table === "sponsor_programmes" ? {
      policy_version: "'sponsor-cohort.v1'", feedback_collection: "'disabled'",
    } : {};
    if (columns.some(row => String(row.dflt_value ?? "") !== String(expectedDefaults[row.name] ?? ""))) {
      throw new Error(`Sponsor programme schema proof failed: ${table} defaults.`);
    }
    const pk = columns.filter(row => Number(row.pk) > 0).sort((a, b) => Number(a.pk) - Number(b.pk)).map(row => row.name);
    if (JSON.stringify(pk) !== JSON.stringify(expected.pk)) throw new Error(`Sponsor programme schema proof failed: ${table} primary key.`);
    const fks = (await client.execute(`PRAGMA foreign_key_list(${table})`)).rows
      .map(row => [row.from, row.table, row.to]).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    const expectedFks = [...expected.fks].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
    if (JSON.stringify(fks) !== JSON.stringify(expectedFks)) throw new Error(`Sponsor programme schema proof failed: ${table} foreign keys.`);
  }
  const index = (await client.execute("PRAGMA index_info(sponsor_programme_contribution_expiry)")).rows;
  if (index.length !== 1 || index[0].name !== "expires_at") throw new Error("Sponsor programme expiry index proof failed.");
  const programmeSql = (await client.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='sponsor_programmes'")).rows[0]?.sql ?? "";
  const feedbackSql = (await client.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='sponsor_programme_feedback'")).rows[0]?.sql ?? "";
  const memberSql = (await client.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='sponsor_programme_members'")).rows[0]?.sql ?? "";
  const reportSql = (await client.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='sponsor_programme_reports'")).rows[0]?.sql ?? "";
  if (!programmeSql.includes("'venue','student','teacher','individual'") || !programmeSql.includes("'internal','disabled','restricted'") ||
      !programmeSql.includes("'sponsor-cohort.v1'") || !memberSql.includes("'report_read','report_export','invitation_admin'") ||
      !programmeSql.includes("'disabled','enabled'") || !reportSql.includes("'released','restricted'") || !feedbackSql.includes("useful IN (0,1)")) {
    throw new Error("Sponsor programme policy constraint proof failed.");
  }
  const reportIndexes = (await client.execute("PRAGMA index_list(sponsor_programme_reports)")).rows;
  let hasUniqueClaimMonth = false;
  for (const idx of reportIndexes.filter(row => Number(row.unique) === 1)) {
    const names = (await client.execute(`PRAGMA index_info('${String(idx.name).replaceAll("'", "''")}')`)).rows.map(row => row.name);
    if (JSON.stringify(names) === JSON.stringify(["programme_id", "claim_month"])) hasUniqueClaimMonth = true;
  }
  if (!hasUniqueClaimMonth) throw new Error("Sponsor programme unique report-period proof failed.");
}

export async function applySponsorProgrammeMigration(client) {
  const { entry, source } = migrationSource();
  const ledger = JSON.parse(readFileSync(resolve(root, "drizzle-entitlements/additive-ledger.json"), "utf8"));
  const tx = await client.transaction("write");
  try {
    const receipts = await tx.execute("SELECT id,sha256 FROM signal_additive_migrations WHERE id IN ('0001_venue_fulfilment','0002_usage_delivery','0003_usage_workspace_erasure') ORDER BY id");
    if (receipts.rows.length !== 3) throw new Error("Venue fulfilment and usage migrations are required.");
    for (const receipt of receipts.rows) {
      const expected = ledger.migrations.find(row => row.id === receipt.id);
      if (!expected || expected.sha256 !== receipt.sha256) throw new Error("A prerequisite additive migration receipt does not match its ledger.");
    }
    const prior = await tx.execute({ sql: "SELECT sha256 FROM signal_additive_migrations WHERE id=?", args: [entry.id] });
    if (prior.rows.length && prior.rows[0].sha256 !== entry.sha256) throw new Error("Stored sponsor programme migration hash differs.");
    if (!prior.rows.length) {
      for (const table of [...Object.keys(expectedTables), "sponsor_programme_contribution_expiry"]) {
        const found = await tx.execute({ sql: "SELECT name FROM sqlite_master WHERE name=?", args: [table] });
        if (found.rows.length) throw new Error("Sponsor programme objects exist without a migration receipt; refusing schema adoption.");
      }
      for (const statement of source.split("--> statement-breakpoint").map(value => value.trim()).filter(Boolean)) await tx.execute(statement);
    }
    await proveSchema(tx);
    if (!prior.rows.length) await tx.execute({ sql: "INSERT INTO signal_additive_migrations (id,sha256,applied_at) VALUES (?,?,?)", args: [entry.id, entry.sha256, Date.now()] });
    await tx.commit();
    return { id: entry.id, state: prior.rows.length ? "already_applied" : "applied" };
  } catch (error) { await tx.rollback(); throw error; } finally { tx.close(); }
}

async function main() {
  const url = process.env.ENTITLEMENTS_DATABASE_URL ?? "";
  if (!url.startsWith("file:") || process.env.ENTITLEMENTS_AUTH_TOKEN) throw new Error("Local-only migration: use an explicitly supplied disposable file database without a token.");
  const { createClient } = await import("@libsql/client");
  const client = createClient({ url });
  try { console.log(await applySponsorProgrammeMigration(client)); }
  finally { client.close(); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main().catch(() => { console.error("Sponsor programme migration failed; no success claimed. Check the local target and retained ledger."); process.exitCode = 1; });
}
