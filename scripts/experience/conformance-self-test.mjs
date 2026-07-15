#!/usr/bin/env node
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const fixture = mkdtempSync(path.join(tmpdir(), "signal-ds-violation-"));
try {
  mkdirSync(path.join(fixture, "src"), { recursive: true });
  mkdirSync(path.join(fixture, "scripts", "ds"), { recursive: true });
  cpSync(path.join(root, "scripts", "ds", "ds-check.mjs"), path.join(fixture, "scripts", "ds", "ds-check.mjs"));
  writeFileSync(path.join(fixture, ".ds-grandfather.json"), "{}\n");
  writeFileSync(
    path.join(fixture, "src", "deliberate-token-violation.tsx"),
    'export const DeliberateViolation = () => <div style={{ color: "#7c5cff" }}>caught</div>;\n',
  );
  const result = spawnSync(process.execPath, ["scripts/ds/ds-check.mjs"], {
    cwd: fixture,
    encoding: "utf8",
  });
  const output = `${result.stdout}\n${result.stderr}`;
  if (result.status === 0 || !output.includes("banned colour #7c5cff")) {
    console.error(output);
    throw new Error("the deliberate token violation was not rejected");
  }
  console.log("experience:conformance-self-test: pass - deliberate retired token rejected");
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
