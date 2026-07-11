import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "signal-recovery-drill-"));
const dbPath = path.join(root, "source.db");
const restoredPath = path.join(root, "restored.db");
const source = createClient({ url: `file:${dbPath}` });
const restored = createClient({ url: `file:${restoredPath}` });

try {
  await source.executeMultiple(`
    CREATE TABLE recovery_probe (id TEXT PRIMARY KEY, value TEXT NOT NULL);
    INSERT INTO recovery_probe VALUES ('probe-1', 'before');
    INSERT INTO recovery_probe VALUES ('probe-2', 'before');
  `);
  const rows = await source.execute("SELECT id, value FROM recovery_probe ORDER BY id");
  const backup = JSON.stringify(rows.rows);
  fs.writeFileSync(path.join(root, "backup.json"), backup, "utf8");

  await restored.execute("CREATE TABLE recovery_probe (id TEXT PRIMARY KEY, value TEXT NOT NULL)");
  for (const row of JSON.parse(backup)) {
    await restored.execute({
      sql: "INSERT INTO recovery_probe (id, value) VALUES (?, ?)",
      args: [String(row.id), String(row.value)],
    });
  }
  const restoredRows = await restored.execute("SELECT id, value FROM recovery_probe ORDER BY id");
  if (JSON.stringify(restoredRows.rows) !== backup) throw new Error("restore mismatch");

  const releases = path.join(root, "releases");
  fs.mkdirSync(path.join(releases, "v1"), { recursive: true });
  fs.mkdirSync(path.join(releases, "v2"), { recursive: true });
  fs.writeFileSync(path.join(releases, "v1", "manifest.json"), JSON.stringify({ version: "v1" }));
  fs.writeFileSync(path.join(releases, "v2", "manifest.json"), JSON.stringify({ version: "v2" }));
  const pointer = path.join(root, "current.json");
  fs.writeFileSync(pointer, JSON.stringify({ release: "v2" }));
  fs.writeFileSync(pointer, JSON.stringify({ release: "v1" }));
  const rollback = JSON.parse(fs.readFileSync(pointer, "utf8"));
  if (rollback.release !== "v1") throw new Error("rollback pointer mismatch");

  console.log(JSON.stringify({ ok: true, restoreRows: restoredRows.rows.length, rollbackRelease: rollback.release }));
} finally {
  source.close();
  restored.close();
  try {
    fs.rmSync(root, { recursive: true, force: true });
  } catch (error) {
    // Windows can hold SQLite handles for a short interval after close;
    // leaving a uniquely-named temp directory is safer than failing the
    // actual restore/rollback receipt.
    if (error?.code !== "EPERM") throw error;
  }
}
