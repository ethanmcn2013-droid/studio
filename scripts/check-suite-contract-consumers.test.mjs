import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const studio = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(studio, "scripts/check-suite-contract-consumers.mjs");
const contracts = ["suite-contracts.v1.json", "suite-contracts.v2.json", "commercial-terms.v1.json", "commercial-terms.v2.json"];
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "signal-contract-gate-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const cwd = path.join(root, "studio");
  fs.mkdirSync(cwd);
  fs.cpSync(path.join(studio, "contracts"), path.join(cwd, "contracts"), { recursive: true });
  function write(repo, relative, value) {
    const file = path.join(repo, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(value));
  }
  function app(name = "app") {
    const repo = path.join(root, name);
    write(repo, "package.json", { name: "tasks" });
    for (const contract of contracts) write(repo, "src/lib/" + contract, JSON.parse(fs.readFileSync(path.join(cwd, "contracts", contract), "utf8")));
    const read = JSON.parse(fs.readFileSync(path.join(cwd, "contracts/tasks-read-contract.v1.json"), "utf8"));
    for (const [relative, operation] of [["signal/lib/briefing", "briefing"], ["timeline/server/sync", "milestones"]]) {
      write(repo, "src/modules/" + relative + "/tasks-read-contract.v1.json", { version: read.version, owner: read.owner, operation, timeoutMs: 2000, scope: "subject+workspace" });
    }
    write(repo, "src/lib/account/instrumentation/venue-meaningful-action.v1.json", JSON.parse(fs.readFileSync(path.join(cwd, "contracts/venue-meaningful-action.v1.json"), "utf8")));
    return repo;
  }
  function run(explicit) {
    const env = { ...process.env };
    delete env.APP_REPO_PATH;
    if (explicit !== undefined) env.APP_REPO_PATH = explicit;
    return spawnSync(process.execPath, [script], { cwd, env, encoding: "utf8" });
  }
  return { root, app, write, run };
}

test("default canonical App and legacy tasks layouts still validate every consumer", (t) => {
  const f = fixture(t);
  f.app("tasks");
  assert.equal(f.run().status, 0);
  f.app();
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /tasks-read-contract-consumers: ok \(2 consumers\)/);
  assert.match(result.stdout, /venue-meaningful-action v1/);
});

test("explicit release checkout overrides a drifted sibling and fails its own drift", (t) => {
  const f = fixture(t);
  const sibling = f.app();
  const selected = f.app("release candidate");
  f.write(sibling, "src/lib/commercial-terms.v2.json", { wrong: "main" });
  assert.equal(f.run().status, 1);
  assert.equal(f.run(selected).status, 0);
  f.write(selected, "src/lib/commercial-terms.v2.json", { wrong: "release" });
  const result = f.run(selected);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /fixture differs from studio\/contracts\/commercial-terms.v2.json/);
});

test("invalid explicit paths never fall back to a valid sibling", (t) => {
  const f = fixture(t);
  const app = f.app();
  const unrelated = path.join(f.root, "unrelated");
  fs.mkdirSync(unrelated);
  for (const candidate of ["", "../app", path.join(f.root, "missing"), path.join(app, "package.json"), unrelated]) {
    const result = f.run(candidate);
    assert.equal(result.status, 1, candidate);
    assert.match(result.stderr, /absolute App checkout|directory does not exist|Not a unified App checkout/);
  }
});

test("missing payment contracts, invalid read scope and instrumentation drift remain blocking", (t) => {
  const f = fixture(t);
  for (const [name, relative, value, expected] of [
    ["missing", "src/lib/commercial-terms.v2.json", null, /missing generated commercial-terms.v2/],
    ["scope", "src/modules/timeline/server/sync/tasks-read-contract.v1.json", { scope: "global" }, /invalid Tasks read contract fixture \(milestones\)/],
    ["events", "src/lib/account/instrumentation/venue-meaningful-action.v1.json", { drift: true }, /venue-meaningful-action.v1.json differs/],
  ]) {
    const app = f.app(name);
    if (value === null) fs.unlinkSync(path.join(app, relative));
    else f.write(app, relative, value);
    const result = f.run(app);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, expected);
  }
});
