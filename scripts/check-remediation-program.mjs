#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const ledgerPath = path.join(root, "docs", "signal-studio-review", "remediation-program.yaml");
const raw = fs.readFileSync(ledgerPath, "utf8");
let ledger;
try {
  ledger = JSON.parse(raw);
} catch (error) {
  throw new Error(`Ledger must remain JSON-compatible YAML: ${error.message}`);
}

const allowedStatuses = new Set(["planned", "active", "blocked", "verifying", "complete"]);
const allowedPriorities = new Set(["P0", "P1", "P2", "P3"]);
const evidenceClasses = ledger.requiredEvidenceClasses ?? ["tests", "builds", "previews", "production"];
const errors = [];
const items = Array.isArray(ledger.items) ? ledger.items : [];
const ids = new Set();

if (!items.length) errors.push("ledger.items must contain at least one item");
if (!Number.isInteger(ledger.reportedCompletion)) errors.push("reportedCompletion must be an integer percentage");

for (const item of items) {
  if (!item.id || ids.has(item.id)) errors.push(`duplicate or missing item id: ${item.id ?? "<missing>"}`);
  ids.add(item.id);
  for (const field of ["phase", "title", "products", "priority", "status", "owner", "dependencies", "acceptance", "evidence", "rollback", "founder_gate"]) {
    if (!(field in item)) errors.push(`${item.id}: missing ${field}`);
  }
  if (!allowedStatuses.has(item.status)) errors.push(`${item.id}: invalid status ${item.status}`);
  if (!allowedPriorities.has(item.priority)) errors.push(`${item.id}: invalid priority ${item.priority}`);
  for (const dependency of item.dependencies ?? []) {
    if (!items.some((candidate) => candidate.id === dependency)) errors.push(`${item.id}: unknown dependency ${dependency}`);
  }
  for (const evidenceClass of evidenceClasses) {
    if (!Array.isArray(item.evidence?.[evidenceClass])) errors.push(`${item.id}: evidence.${evidenceClass} must be an array`);
  }
  if (item.status === "blocked" && item.priority !== "P2" && item.priority !== "P3" && !item.founder_gate) {
    errors.push(`${item.id}: blocked P0/P1 items must have founder_gate=true or an HQ operator to-do reference`);
  }
  if (item.status === "complete") {
    for (const evidenceClass of evidenceClasses) {
      if (!item.evidence[evidenceClass].length) errors.push(`${item.id}: complete items require ${evidenceClass} evidence`);
    }
    for (const dependency of item.dependencies ?? []) {
      const dependencyItem = items.find((candidate) => candidate.id === dependency);
      if (dependencyItem?.status !== "complete") errors.push(`${item.id}: dependency ${dependency} is not complete`);
    }
  }
}

const completed = items.filter((item) => item.status === "complete").length;
const calculated = items.length ? Math.round((completed / items.length) * 100) : 0;
if (ledger.reportedCompletion !== calculated) {
  errors.push(`reportedCompletion=${ledger.reportedCompletion} does not match calculated=${calculated}`);
}

for (const item of items) {
  for (const verification of item.verification ?? []) {
    if (!verification.command || verification.status === "skipped") continue;
    if (process.argv.includes("--run-commands") && item.status === "complete") {
      const result = spawnSync(verification.command, { cwd: root, shell: true, encoding: "utf8" });
      if (result.status !== 0) errors.push(`${item.id}: verification command failed: ${verification.command}`);
    }
  }
}

const byPhase = Object.groupBy ? Object.groupBy(items, (item) => item.phase) : items.reduce((acc, item) => {
  (acc[item.phase] ??= []).push(item);
  return acc;
}, {});
const byPriority = Object.groupBy ? Object.groupBy(items, (item) => item.priority) : items.reduce((acc, item) => {
  (acc[item.priority] ??= []).push(item);
  return acc;
}, {});

if (errors.length) {
  console.error(JSON.stringify({ ok: false, errors, calculated, reported: ledger.reportedCompletion }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  program: ledger.program,
  completion: calculated,
  total: items.length,
  completed,
  openP0: (byPriority.P0 ?? []).filter((item) => item.status !== "complete").map((item) => item.id),
  byPhase: Object.fromEntries(Object.entries(byPhase).map(([phase, phaseItems]) => [phase, {
    total: phaseItems.length,
    completed: phaseItems.filter((item) => item.status === "complete").length,
  }])),
  evidenceRoot: ledger.evidenceRoot,
}, null, 2));
