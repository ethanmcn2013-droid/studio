import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const id = "0003_usage_workspace_erasure";

export async function applyUsageWorkspaceErasureMigration(client) {
  const ledger = JSON.parse(readFileSync(resolve(root, "drizzle-entitlements/additive-ledger.json"), "utf8"));
  const entry = ledger.migrations.find(row => row.id === id);
  const journal = JSON.parse(readFileSync(resolve(root, "drizzle-entitlements/meta/_journal.json"), "utf8"));
  if (!entry || !journal.entries.some(row => row.tag === id && row.when === entry.journalWhen)) throw Error("Workspace erasure ledger mismatch");
  const source = readFileSync(resolve(root, entry.sql), "utf8").replace(/\r\n?/g, "\n");
  if (createHash("sha256").update(source).digest("hex") !== entry.sha256) throw Error("Workspace erasure migration hash mismatch");
  const tx = await client.transaction("write");
  try {
    const prerequisite = await tx.execute("SELECT id FROM signal_additive_migrations WHERE id='0002_usage_delivery'");
    if (prerequisite.rows.length !== 1) throw Error("Usage delivery migration required");
    const prior = await tx.execute({ sql: "SELECT sha256 FROM signal_additive_migrations WHERE id=?", args: [id] });
    if (prior.rows.length && prior.rows[0].sha256 !== entry.sha256) throw Error("Workspace erasure stored hash differs");
    if (!prior.rows.length) await tx.execute(source);
    const columns = (await tx.execute("PRAGMA table_info(usage_workspace_erasure_tombstones)")).rows;
    if (JSON.stringify(columns.map(row => row.name)) !== JSON.stringify(["epoch", "workspace_id_hash", "erased_at"]) ||
        JSON.stringify(columns.filter(row => Number(row.pk) > 0).sort((a, b) => Number(a.pk) - Number(b.pk)).map(row => row.name)) !==
          JSON.stringify(["epoch", "workspace_id_hash"]) || columns.some(row => Number(row.notnull) !== 1))
      throw Error("Workspace erasure schema proof failed");
    if (!prior.rows.length) await tx.execute({ sql: "INSERT INTO signal_additive_migrations(id,sha256,applied_at) VALUES(?,?,?)", args: [id, entry.sha256, Date.now()] });
    await tx.commit();
    return { id, state: prior.rows.length ? "already_applied" : "applied" };
  } catch (error) { await tx.rollback(); throw error; } finally { tx.close(); }
}

async function main() {
  const url = process.env.ENTITLEMENTS_DATABASE_URL ?? "";
  if (!url.startsWith("file:") || process.env.ENTITLEMENTS_AUTH_TOKEN) throw Error("Disposable local file database required");
  const { createClient } = await import("@libsql/client");
  const client = createClient({ url });
  try { console.log(await applyUsageWorkspaceErasureMigration(client)); } finally { client.close(); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  void main().catch(() => { console.error("Workspace erasure migration failed; no success claimed."); process.exitCode = 1; });
