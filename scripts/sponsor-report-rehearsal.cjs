#!/usr/bin/env node
/* Local synthetic receiving rehearsal. No provider, production store or Preview. */
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
if (process.argv.includes("--help")) {
  process.stdout.write("Run: node scripts/sponsor-report-rehearsal.cjs [--serve] [output-directory]\n" +
    "Writes synthetic report.json, report.html, report.csv and evidence.json to D:/Codex-scratch/sponsor-reporting/evidence/receiving by default.\n" +
    "--serve opens a loopback-only report handler preview for 180 seconds and writes preview-url.txt.\n");
  process.exit(0);
}
const serve = process.argv.includes("--serve");
const outputArg = process.argv.slice(2).find(value => value !== "--serve");
const scratch = process.platform === "win32" && fs.existsSync("D:/Codex-scratch")
  ? "D:/Codex-scratch/sponsor-reporting" : path.join(os.tmpdir(), "sponsor-reporting");
const output = path.resolve(outputArg ?? path.join(scratch, "evidence", "receiving"));
const temporary = path.join(scratch, "tmp");
fs.mkdirSync(output, { recursive: true });
fs.mkdirSync(temporary, { recursive: true });
const env = { ...process.env, SPONSOR_REPORT_SPECIMEN_DIR: output,
  SPONSOR_REPORT_SERVE_MS: serve ? "180000" : "0", TMP: temporary, TEMP: temporary };
for (const key of ["ENTITLEMENTS_DATABASE_URL", "ENTITLEMENTS_AUTH_TOKEN", "DATABASE_URL", "TURSO_AUTH_TOKEN"])
  delete env[key];
const result = spawnSync(process.execPath, ["src/lib/sponsor-programme/receiving.test.cjs"],
  { cwd: root, env, stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) process.exitCode = result.status ?? 1;
else process.stdout.write(`Synthetic receiving specimens: ${output}\n`);
