#!/usr/bin/env node
// verify-evidence.mjs — mechanical check that claimed evidence is real.
//
//   node tools/verify-evidence.mjs [E07 | E04.01 ... | --review] [--strict]
//
// The Done contract enforces that evidence EXISTS. It cannot tell whether the
// evidence supports the claim, and it cannot tell whether a referenced file was
// ever actually written. A session that says "evidence: docs/foo.md" and never
// wrote docs/foo.md passes `validate` and reaches Founder Review looking
// complete. This closes the mechanical half of that gap before a packet is put
// in front of the founder.
//
// It deliberately lives in its OWN FILE rather than inside project-control.mjs,
// because work-package sessions edit that module concurrently and two writers on
// one file lose each other's work.
//
// Exit 0 = every mechanical check passed. Exit 1 = something claimed does not
// exist. Read-only: it never mutates project state.

import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, resolve, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const WORKSPACE = resolve(ROOT, "../../../..");   // studio/docs/execution/<proj> -> workspace root
const STATE = join(ROOT, "PROJECT_STATE.json");

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const pos = args.filter((a) => !a.startsWith("--"));

const state = JSON.parse(readFileSync(STATE, "utf8"));

function selectTasks() {
  if (args.includes("--review")) return state.tasks.filter((t) => t.status === "founder_review");
  if (!pos.length) return state.tasks.filter((t) => ["founder_review", "internal_review"].includes(t.status));
  const out = [];
  for (const a of pos) {
    if (/^E\d{2}$/.test(a)) out.push(...state.tasks.filter((t) => t.epic === a));
    else {
      const t = state.tasks.find((x) => x.id === a);
      if (!t) { console.error(`Unknown task id "${a}".`); process.exit(1); }
      out.push(t);
    }
  }
  return [...new Map(out.map((t) => [t.id, t])).values()].sort((a, b) => (a.id < b.id ? -1 : 1));
}

// An evidence ref is treated as a path claim when it looks like one. A plain
// prose note ("pnpm test — 74/74 pass") is a claim about the world that this
// tool cannot check, and is reported separately rather than silently accepted.
const looksLikePath = (ref) => /^[\w./\\-]+\.(md|json|mjs|js|ts|tsx|csv|png|jpg|svg|html|sql|yml|yaml|txt|pdf)(#.*)?$/i.test(ref.trim());
const looksLikeUrl = (ref) => /^https?:\/\//i.test(ref.trim());

function resolveClaim(ref) {
  const clean = ref.trim().split("#")[0];
  const candidates = isAbsolute(clean)
    ? [clean]
    : [join(ROOT, clean), join(WORKSPACE, clean), join(WORKSPACE, "studio", clean)];
  for (const c of candidates) {
    if (existsSync(c)) {
      const st = statSync(c);
      return { found: true, at: c, empty: st.isFile() && st.size === 0 };
    }
  }
  return { found: false, tried: candidates };
}

const tasks = selectTasks();
if (!tasks.length) { console.log("No tasks matched."); process.exit(0); }

let hardFails = 0;
let softFlags = 0;
const report = [];

for (const t of tasks) {
  const problems = [];
  const notes = [];

  if (t.acceptanceCriteria.length === 0) problems.push("no acceptance criteria");
  if (t.evidence.length === 0) problems.push("no evidence recorded");

  // Fewer evidence items than criteria is not proof of a gap, but it is the
  // shape a thin claim takes, so it is surfaced rather than assumed fine.
  if (t.acceptanceCriteria.length > 0 && t.evidence.length > 0 && t.evidence.length < t.acceptanceCriteria.length) {
    notes.push(`${t.acceptanceCriteria.length} criteria but only ${t.evidence.length} evidence item(s)`);
  }

  for (const e of t.evidence) {
    const ref = String(e.ref || "");
    if (!ref.trim()) { problems.push("an evidence entry has an empty ref"); continue; }
    if (looksLikeUrl(ref)) { notes.push(`URL evidence not checked: ${ref}`); continue; }
    if (!looksLikePath(ref)) { notes.push(`prose evidence, not machine-checkable: "${ref.slice(0, 70)}"`); continue; }
    const r = resolveClaim(ref);
    if (!r.found) problems.push(`CLAIMED FILE DOES NOT EXIST: ${ref}`);
    else if (r.empty) problems.push(`claimed file is EMPTY: ${ref}`);
  }

  if (t.specPath) {
    const r = resolveClaim(t.specPath);
    if (!r.found) problems.push(`specPath does not exist: ${t.specPath}`);
  }

  if (problems.length) hardFails++;
  if (notes.length) softFlags++;
  if (problems.length || notes.length) report.push({ t, problems, notes });
}

console.log(`Evidence verification — ${tasks.length} task(s) checked\n`);

if (!report.length) {
  console.log("PASS. Every claimed file exists and every task carries criteria and evidence.");
  process.exit(0);
}

for (const { t, problems, notes } of report) {
  console.log(`${t.id} [${t.status}] ${t.title.slice(0, 68)}`);
  for (const p of problems) console.log(`   ✗ ${p}`);
  for (const n of notes) console.log(`   · ${n}`);
  console.log("");
}

console.log(`${hardFails} task(s) with problems, ${softFlags} with items a human still has to judge.`);
console.log("");
console.log("What this tool can and cannot tell you:");
console.log("  CAN  — a claimed file does not exist, or exists and is empty.");
console.log("  CANNOT — whether the evidence actually supports the acceptance criterion.");
console.log("           That judgement is the founder-review packet's job, and yours.");

if (hardFails > 0 || (strict && softFlags > 0)) process.exit(1);
process.exit(0);
