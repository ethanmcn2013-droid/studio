import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const FULFILMENT_MIGRATION = "0001_venue_fulfilment";
const root = fileURLToPath(new URL("../", import.meta.url));
const canonical = value => value.replace(/\r\n?/g, "\n");
function migrationSource() {
  const ledger = JSON.parse(readFileSync(resolve(root, "drizzle-entitlements/additive-ledger.json"), "utf8"));
  const entry = ledger.migrations.find(row => row.id === FULFILMENT_MIGRATION);
  const journal = JSON.parse(readFileSync(resolve(root, "drizzle-entitlements/meta/_journal.json"), "utf8"));
  if (!entry || !journal.entries.some(row => row.tag === entry.id && row.when === entry.journalWhen)) throw new Error("Additive ledger/journal mismatch.");
  const source = canonical(readFileSync(resolve(root, entry.sql), "utf8"));
  if (createHash("sha256").update(source).digest("hex") !== entry.sha256) throw new Error("Migration hash mismatch.");
  return { entry, source };
}
/** Existing tables are prerequisites; the frozen baseline is never replayed.
 * This runner is local-only. Production needs a separate target/backup receipt. */
export async function applyVenueFulfilmentMigration(client) {
  const { entry, source } = migrationSource();
  for (const table of ["sponsors", "license_codes", "entitlement_events"]) {
    const rows = await client.execute({sql:"SELECT name FROM sqlite_master WHERE type='table' AND name=?",args:[table]});
    if (rows.rows.length !== 1) throw new Error("Shared baseline prerequisites are missing.");
  }
  const tx = await client.transaction("write");
  try {
    await tx.execute("CREATE TABLE IF NOT EXISTS signal_additive_migrations (id text PRIMARY KEY NOT NULL, sha256 text NOT NULL, applied_at integer NOT NULL)");
    const prior = await tx.execute({sql:"SELECT sha256 FROM signal_additive_migrations WHERE id=?",args:[entry.id]});
    if (prior.rows.length && prior.rows[0].sha256 !== entry.sha256) throw new Error("Stored additive migration hash differs.");
    if (!prior.rows.length) {
      for (const statement of source.split("--> statement-breakpoint").map(value=>value.trim()).filter(Boolean)) await tx.execute(statement);
    }
    for (const [table, required] of [
      ["venue_sponsor_mirrors", ["sponsor_id","studio_sponsor_id","sponsor_slug"]],
      ["venue_fulfilment_requests", ["id","manifest_json","manifest_hash","revision","readback_json","fulfilled_at"]],
    ]) {
      const columns = (await tx.execute("PRAGMA table_info("+table+")")).rows.map(row=>String(row.name));
      if (required.some(column=>!columns.includes(column))) throw new Error("Additive schema proof failed.");
    }
    for (const name of ["venue_sponsor_mirrors_immutable","venue_fulfilment_manifest_immutable"]) {
      const rows=await tx.execute({sql:"SELECT name FROM sqlite_master WHERE type='trigger' AND name=?",args:[name]});
      if(rows.rows.length!==1)throw new Error("Immutable manifest proof failed.");
    }
    if (!prior.rows.length) await tx.execute({sql:"INSERT INTO signal_additive_migrations (id,sha256,applied_at) VALUES (?,?,?)",args:[entry.id,entry.sha256,Date.now()]});
    await tx.commit();
    return { id: entry.id, state: prior.rows.length ? "already_applied" : "applied" };
  } catch (error) { await tx.rollback(); throw error; } finally { tx.close(); }
}
async function main() {
  const url=process.env.ENTITLEMENTS_DATABASE_URL ?? "";
  if (!url.startsWith("file:") || process.env.ENTITLEMENTS_AUTH_TOKEN) throw new Error("Local-only migration: use an explicitly supplied disposable file database without a token.");
  const { createClient }=await import("@libsql/client");
  const client=createClient({url});
  try { console.log(await applyVenueFulfilmentMigration(client)); } finally { client.close(); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main().catch(() => { console.error("Additive migration failed; no success claimed. Check the local target and retained ledger."); process.exitCode = 1; });
}
