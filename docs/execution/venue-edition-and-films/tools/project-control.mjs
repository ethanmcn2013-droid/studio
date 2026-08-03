#!/usr/bin/env node
// project-control.mjs — canonical state tool for VEF-2026 (Venue Edition and Films).
//
// PROJECT_STATE.json is the only place status facts live. BACKLOG.md and
// STATUS.md are generated from it and must never be hand-edited.
//
// Zero dependencies. Cross-platform (Windows/macOS/Linux). Node >= 18.
//
//   node tools/project-control.mjs help
//
// Every mutating command validates before and after, writes atomically, and
// regenerates the derived Markdown. Any validation failure exits non-zero and
// leaves PROJECT_STATE.json untouched.

import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync, unlinkSync, statSync } from "node:fs";
import { dirname, join, resolve, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, "..");
const STATE_PATH = join(ROOT, "PROJECT_STATE.json");

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

export const STATUSES = [
  "backlog", "ready", "in_progress", "internal_review",
  "founder_review", "done", "blocked", "deferred", "cancelled",
];
export const ACTIVE_STATUSES = STATUSES.filter((s) => s !== "deferred" && s !== "cancelled");
export const PRIORITIES = ["p0", "p1", "p2", "p3"];
export const SIGN_OFF_STATES = ["not_requested", "requested", "approved", "rejected"];
export const ESTIMATE_STATES = ["unestimated", "provisional", "approved"];
export const GATE_STATES = ["not_started", "in_progress", "ready_for_review", "passed", "failed", "waived"];
export const EFFORT_SCALE = [1, 2, 3, 5, 8, 13];
export const EXECUTORS = ["claude_code", "codex_motion", "founder", "external", "unassigned"];
// How a task gets decided. founder_only = only Ethan can answer it;
// founder_choice = Claude brings options, Ethan picks; execution = Claude or
// Codex does the work and Ethan approves the result.
export const DECISION_CLASSES = ["founder_only", "founder_choice", "execution"];

// Legal transitions. `done` is deliberately unreachable from `transition` —
// only `approve` (explicit founder sign-off) may set it.
export const TRANSITIONS = {
  backlog: ["ready", "blocked", "deferred", "cancelled"],
  ready: ["in_progress", "backlog", "blocked", "deferred", "cancelled"],
  in_progress: ["internal_review", "ready", "blocked", "deferred", "cancelled"],
  internal_review: ["founder_review", "in_progress", "blocked", "cancelled"],
  founder_review: ["done", "internal_review", "in_progress", "blocked"],
  blocked: ["backlog", "ready", "in_progress", "internal_review", "founder_review", "deferred", "cancelled"],
  deferred: ["backlog", "ready", "cancelled"],
  cancelled: ["backlog"],
  done: ["in_progress"], // reopen only, via `reopen`
};

// Deterministic status credit for the Delivery Progress Estimate.
// Documented in REPORTING.md. Only reported once the baseline is approved.
export const STATUS_CREDIT = {
  backlog: 0, ready: 0, blocked: 0, in_progress: 0.25,
  internal_review: 0.6, founder_review: 0.85, done: 1,
};

const WARN = "⚠";

// ---------------------------------------------------------------------------
// IO
// ---------------------------------------------------------------------------

export function loadState(path = STATE_PATH) {
  if (!existsSync(path)) fail(`PROJECT_STATE.json not found at ${path}. Run tools/import-backlog.mjs first.`);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    fail(`PROJECT_STATE.json is not valid JSON: ${e.message}`);
  }
}

function writeAtomic(path, contents) {
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, contents, "utf8");
  renameSync(tmp, path);
}

export function saveState(state, path = STATE_PATH) {
  writeAtomic(path, `${JSON.stringify(canonicalize(state), null, 2)}\n`);
}

function fail(msg) {
  releaseLock();
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Cross-session lock
//
// Atomic writes stop the file being corrupted. They do NOT stop a lost update:
// two sessions read the same state, both mutate, both write, and the second
// silently destroys the first one's work. With work packages running in
// parallel sessions that is a real and silent data-loss path, so every command
// that performs a read-modify-write takes this lock for the whole cycle.
// ---------------------------------------------------------------------------

const LOCK_PATH = join(ROOT, ".project-control.lock");
const LOCK_STALE_MS = 120_000;
const LOCK_WAIT_MS = 15_000;
let lockHeld = false;

function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

export function acquireLock(command, nowISO) {
  const deadline = Date.now() + LOCK_WAIT_MS;
  for (;;) {
    try {
      writeFileSync(LOCK_PATH, JSON.stringify({ pid: process.pid, command, at: nowISO }), { flag: "wx" });
      lockHeld = true;
      return;
    } catch (e) {
      if (e.code !== "EEXIST") throw e;
      // Staleness comes from the file's mtime, never from its contents. There
      // is a window between O_EXCL creation and the contents being written in
      // which a reader sees an empty file; treating that as "no holder" would
      // let it steal a live lock, which is exactly the lost update this
      // prevents. The contents are for the error message only.
      let ageMs;
      try { ageMs = Date.now() - statSync(LOCK_PATH).mtimeMs; } catch { continue; }
      if (ageMs > LOCK_STALE_MS) {
        // A crashed session left it behind. Break it and retry.
        try { unlinkSync(LOCK_PATH); } catch { /* someone else won the race */ }
        continue;
      }
      if (Date.now() > deadline) {
        let holder = {};
        try { holder = JSON.parse(readFileSync(LOCK_PATH, "utf8")); } catch { /* mid-write */ }
        fail(
          `Another session holds the project-state lock (pid ${holder.pid ?? "?"}, command "${holder.command ?? "?"}", since ${holder.at ?? "?"}).\n` +
          `  Waited ${LOCK_WAIT_MS / 1000}s. Re-run this command in a moment.\n` +
          `  If that session is gone, delete ${LOCK_PATH} — locks older than ${LOCK_STALE_MS / 1000}s are broken automatically.`
        );
      }
      sleepSync(250);
    }
  }
}

export function releaseLock() {
  if (!lockHeld) return;
  lockHeld = false;
  try { unlinkSync(LOCK_PATH); } catch { /* already gone */ }
}

process.on("exit", releaseLock);
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => { releaseLock(); process.exit(130); });
}

// Commands that read, mutate and write. Read-only commands skip the lock so a
// status check never blocks on a long-running session.
const MUTATING = new Set([
  "validate", "render", "transition", "ready", "start", "block", "unblock",
  "evidence", "criteria", "spec", "estimate", "executor", "focus", "review",
  "approve", "approve-batch", "reject", "reopen", "gate", "commercial", "film",
  "baseline", "session", "target", "freeze", "answered", "depend",
]);

// The six freeze dates ratified in D-008. They are a board field, not a forecast:
// a target date is set deliberately or it stays null. REPORTING.md section 8
// forbids computed per-task completion dates and this does not create one.
export const FREEZES = [
  { id: "offer", name: "Offer freeze", date: "2026-08-15", meaning: "Price, founding terms, entitlement and the founding-place mechanics stop changing. After this a change needs a change request." },
  { id: "ui", name: "UI freeze", date: "2026-08-20", meaning: "Couple experience, Timeline and Account surfaces stop changing visually. Bug fixes only." },
  { id: "copy", name: "Copy freeze", date: "2026-08-21", meaning: "Every venue-facing and couple-facing string is final, including the commercial pages." },
  { id: "capture", name: "Capture freeze", date: "2026-08-22", meaning: "Product footage for Before the Day is captured against a locked build. Nothing filmed after this is re-shot." },
  { id: "film_lock", name: "Film lock", date: "2026-08-28", meaning: "Both films are locked: no further edit, no further render, QA complete." },
  { id: "release_candidate", name: "Release candidate", date: "2026-08-30", meaning: "The build that goes live on 1 September exists and is the one being verified." },
];

// Stable key ordering so diffs stay readable and renders stay byte-identical.
const TASK_KEYS = [
  "id", "epic", "title", "status", "priority", "releaseBlocking", "criticalPath",
  "startNow", "effortPoints", "estimateStatus", "executor", "approver",
  "dependencies", "dependencyBasis", "blockedBy", "specPath", "acceptanceCriteria",
  "evidence", "targetDate", "targetBasis", "answeredBy", "founderSignOff", "createdAt", "updatedAt",
  "startedAt", "reviewAt", "completedAt", "source", "notes", "history",
];

export function canonicalize(state) {
  const out = { ...state };
  out.tasks = [...state.tasks]
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .map((t) => {
      const shaped = {};
      for (const k of TASK_KEYS) if (k in t) shaped[k] = t[k];
      for (const k of Object.keys(t)) if (!(k in shaped)) shaped[k] = t[k];
      return shaped;
    });
  out.epics = [...state.epics].sort((a, b) => (a.id < b.id ? -1 : 1));
  return out;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/;
const TASK_ID = /^E\d{2}(\.\d{2})(\.\d+)*$/;

export function validate(state) {
  const errors = [];
  const warnings = [];
  const E = (m) => errors.push(m);
  const W = (m) => warnings.push(m);

  for (const key of ["schemaVersion", "project", "baseline", "epics", "tasks", "releaseGates", "commercial", "films", "meta"]) {
    if (!(key in state)) E(`Missing top-level key: ${key}`);
  }
  if (errors.length) return { errors, warnings };

  for (const key of ["id", "name", "founder", "timezone", "releaseDate", "completionCondition"]) {
    if (!state.project[key]) E(`project.${key} is missing or empty.`);
  }
  if (state.project.releaseDate && !ISO_DATE.test(state.project.releaseDate)) {
    E(`project.releaseDate must be YYYY-MM-DD, got "${state.project.releaseDate}".`);
  }
  if (!["draft", "approved", "superseded"].includes(state.baseline?.state)) {
    E(`baseline.state must be draft|approved|superseded, got "${state.baseline?.state}".`);
  }
  if (state.baseline?.state === "approved" && !state.baseline.approvedBy) {
    E("baseline.state is approved but baseline.approvedBy is empty. Only the founder can approve a baseline.");
  }

  const epicIds = new Set(state.epics.map((e) => e.id));
  const ids = new Set();
  const byId = new Map();

  for (const t of state.tasks) {
    if (!TASK_ID.test(t.id || "")) { E(`Malformed task id: "${t.id}". Expected E<NN>.<NN> (children may add .<N>).`); continue; }
    if (ids.has(t.id)) { E(`Duplicate task id: ${t.id}.`); continue; }
    ids.add(t.id);
    byId.set(t.id, t);

    if (!t.title || !t.title.trim()) E(`${t.id}: title is empty. Imported titles must never be blanked.`);
    if (!epicIds.has(t.epic)) E(`${t.id}: epic "${t.epic}" is not a declared epic.`);
    if (!t.id.startsWith(t.epic)) E(`${t.id}: id does not sit under its epic "${t.epic}".`);
    if (!STATUSES.includes(t.status)) E(`${t.id}: invalid status "${t.status}". Allowed: ${STATUSES.join(", ")}.`);
    if (!PRIORITIES.includes(t.priority)) E(`${t.id}: invalid priority "${t.priority}".`);
    if (!SIGN_OFF_STATES.includes(t.founderSignOff?.state)) E(`${t.id}: invalid founderSignOff.state "${t.founderSignOff?.state}".`);
    if (!ESTIMATE_STATES.includes(t.estimateStatus)) E(`${t.id}: invalid estimateStatus "${t.estimateStatus}".`);
    if (t.executor && !EXECUTORS.includes(t.executor)) E(`${t.id}: unknown executor "${t.executor}".`);
    if (t.decisionClass && !DECISION_CLASSES.includes(t.decisionClass)) E(`${t.id}: unknown decisionClass "${t.decisionClass}".`);
    // A founder_only task carries either the open question or the decision that
    // closed it. decisionClass stays founder_only either way: that this was
    // Ethan's call is history worth keeping after the call is made.
    if (t.decisionClass === "founder_only" && !t.decisionQuestion && !t.answeredBy) {
      E(`${t.id}: founder_only tasks must carry either the question Ethan is being asked or the decision that answered it.`);
    }
    if (t.answeredBy && !/^(D-\d{3}|CR-\d{3})$/.test(t.answeredBy)) E(`${t.id}: answeredBy must name a decision like D-008, got "${t.answeredBy}".`);
    if (t.effortPoints !== null && !EFFORT_SCALE.includes(t.effortPoints)) {
      E(`${t.id}: effortPoints ${t.effortPoints} is not on the approved scale ${EFFORT_SCALE.join("/")}.`);
    }
    if (t.effortPoints === null && t.estimateStatus !== "unestimated") {
      E(`${t.id}: estimateStatus is "${t.estimateStatus}" but effortPoints is null.`);
    }
    for (const [field, re] of [["createdAt", ISO_DATE], ["updatedAt", ISO_DATE], ["startedAt", ISO_DATE], ["reviewAt", ISO_DATE], ["completedAt", ISO_DATE], ["targetDate", ISO_DATE]]) {
      const v = t[field];
      if (v !== null && v !== undefined && !re.test(v)) E(`${t.id}: ${field} must be YYYY-MM-DD or null, got "${v}".`);
    }
    // A target date is set deliberately or not at all. An undated target is a
    // guess wearing a date, which is the fabricated precision REPORTING.md
    // section 8 forbids.
    if (t.targetDate && !t.targetBasis) E(`${t.id}: targetDate is set but targetBasis is empty. Record why that date, or clear the date.`);
    if (!Array.isArray(t.history) || t.history.length === 0) E(`${t.id}: history must record at least the import transition.`);

    // The Done contract.
    if (t.status === "done") {
      if (t.founderSignOff?.state !== "approved") {
        E(`${t.id}: status is done but founderSignOff.state is "${t.founderSignOff?.state}". Done requires explicit founder approval.`);
      }
      if (!Array.isArray(t.evidence) || t.evidence.length === 0) {
        E(`${t.id}: status is done with no recorded evidence. Done requires evidence.`);
      }
      if (!Array.isArray(t.acceptanceCriteria) || t.acceptanceCriteria.length === 0) {
        E(`${t.id}: status is done with no acceptance criteria. Done requires agreed acceptance criteria.`);
      }
      if (!t.completedAt) E(`${t.id}: status is done with no completedAt date.`);
    }
    if (t.founderSignOff?.state === "approved" && t.status !== "done") {
      E(`${t.id}: founder approval is recorded but status is "${t.status}". Approval and Done move together.`);
    }
    if (t.status === "blocked" && (!Array.isArray(t.blockedBy) || t.blockedBy.length === 0)) {
      E(`${t.id}: status is blocked but blockedBy is empty. Record what is blocking it.`);
    }
    if (t.status !== "blocked" && Array.isArray(t.blockedBy) && t.blockedBy.length > 0) {
      W(`${t.id}: has blockedBy entries but status is "${t.status}".`);
    }
  }

  // Dependencies: existence, self-reference, cycles.
  for (const t of state.tasks) {
    for (const d of t.dependencies || []) {
      if (d === t.id) E(`${t.id}: depends on itself.`);
      else if (!ids.has(d)) E(`${t.id}: dependency "${d}" does not exist.`);
    }
  }
  for (const cycle of findCycles(state.tasks)) {
    E(`Dependency cycle: ${cycle.join(" -> ")}.`);
  }

  // Focus / WIP.
  if (state.focus?.taskId && !ids.has(state.focus.taskId)) E(`focus.taskId "${state.focus.taskId}" does not exist.`);
  const inProgress = state.tasks.filter((t) => t.status === "in_progress");
  const cap = state.wip?.maxInProgress ?? 3;
  if (inProgress.length > cap) {
    const justified = (state.wip?.exceptions || []).some((x) => x.active);
    const msg = `WIP limit exceeded: ${inProgress.length} tasks In Progress (limit ${cap}): ${inProgress.map((t) => t.id).join(", ")}.`;
    if (justified) W(`${msg} A recorded exception is active.`); else E(`${msg} Record an exception in wip.exceptions or move work out of In Progress.`);
  }

  // Gates.
  for (const g of state.releaseGates || []) {
    if (!GATE_STATES.includes(g.status)) E(`Release gate "${g.id}": invalid status "${g.status}".`);
    if (g.status === "passed" && !g.passedAt) E(`Release gate "${g.id}": passed with no passedAt date.`);
    if (g.status === "waived" && !g.waiver) E(`Release gate "${g.id}": waived with no recorded founder waiver.`);
  }

  // Epic task counts stay truthful after splits.
  for (const e of state.epics) {
    const actual = state.tasks.filter((t) => t.epic === e.id).length;
    if (e.taskCount !== actual) W(`Epic ${e.id}: taskCount ${e.taskCount} but ${actual} tasks present (run render to refresh).`);
  }

  // Confidentiality tripwire: generated reports must stay free of contact data.
  const blob = JSON.stringify(state.commercial || {});
  if (/@[\w.-]+\.\w+/.test(blob)) E("commercial contains what looks like an email address. Contact data belongs in the CRM, never in project state.");

  return { errors, warnings };
}

export function findCycles(tasks) {
  const graph = new Map(tasks.map((t) => [t.id, (t.dependencies || []).filter((d) => d !== t.id)]));
  const state = new Map();
  const cycles = [];
  const stack = [];
  function visit(id) {
    if (state.get(id) === "done") return;
    if (state.get(id) === "open") {
      const at = stack.indexOf(id);
      if (at !== -1) cycles.push([...stack.slice(at), id]);
      return;
    }
    state.set(id, "open");
    stack.push(id);
    for (const next of graph.get(id) || []) if (graph.has(next)) visit(next);
    stack.pop();
    state.set(id, "done");
  }
  for (const id of graph.keys()) visit(id);
  return cycles;
}

// ---------------------------------------------------------------------------
// Derivation
// ---------------------------------------------------------------------------

export function derive(state) {
  const tasks = state.tasks;
  const active = tasks.filter((t) => ACTIVE_STATUSES.includes(t.status));
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, tasks.filter((t) => t.status === s).length]));

  const doneTasks = tasks.filter((t) => t.status === "done");
  const approvedEstimated = active.filter((t) => t.estimateStatus === "approved");
  const approvedPointsTotal = approvedEstimated.reduce((n, t) => n + (t.effortPoints || 0), 0);
  const approvedPointsDone = doneTasks
    .filter((t) => t.estimateStatus === "approved")
    .reduce((n, t) => n + (t.effortPoints || 0), 0);

  const estimatesApproved = Boolean(state.baseline?.estimatesApproved) && approvedPointsTotal > 0;

  const verified = estimatesApproved
    ? { basis: "approved_effort_points", value: pct(approvedPointsDone, approvedPointsTotal), numerator: approvedPointsDone, denominator: approvedPointsTotal, unit: "points" }
    : { basis: "provisional_task_count", value: pct(doneTasks.length, active.length), numerator: doneTasks.length, denominator: active.length, unit: "tasks", provisional: true };

  const deliveryEstimate = state.baseline?.state === "approved"
    ? { available: true, value: pct(active.reduce((n, t) => n + (STATUS_CREDIT[t.status] ?? 0) * weight(t, estimatesApproved), 0), active.reduce((n, t) => n + weight(t, estimatesApproved), 0)) }
    : { available: false, reason: "Baseline is not approved. A status-credit estimate would imply a precision the baseline does not have." };

  const epics = state.epics.map((e) => {
    const et = tasks.filter((t) => t.epic === e.id);
    const ea = et.filter((t) => ACTIVE_STATUSES.includes(t.status));
    return {
      id: e.id,
      title: e.title,
      total: et.length,
      active: ea.length,
      done: et.filter((t) => t.status === "done").length,
      inFlight: et.filter((t) => ["in_progress", "internal_review", "founder_review"].includes(t.status)).length,
      blocked: et.filter((t) => t.status === "blocked").length,
      percent: pct(et.filter((t) => t.status === "done").length, ea.length),
    };
  });

  return {
    counts: byStatus,
    totals: {
      tasks: tasks.length,
      active: active.length,
      unestimated: active.filter((t) => t.estimateStatus === "unestimated").length,
      criticalPath: tasks.filter((t) => t.criticalPath).length,
      releaseBlocking: tasks.filter((t) => t.releaseBlocking).length,
      dependencyEdges: tasks.reduce((n, t) => n + (t.dependencies || []).length, 0),
    },
    verified,
    deliveryEstimate,
    epics,
    inProgress: tasks.filter((t) => t.status === "in_progress"),
    internalReview: tasks.filter((t) => t.status === "internal_review"),
    founderReview: tasks.filter((t) => t.status === "founder_review"),
    blocked: tasks.filter((t) => t.status === "blocked"),
    ready: tasks.filter((t) => t.status === "ready"),
  };
}

const weight = (t, useEstimates) => (useEstimates && t.estimateStatus === "approved" ? t.effortPoints || 0 : 1);
const pct = (n, d) => (d > 0 ? Math.round((n / d) * 1000) / 10 : 0);

export function daysBetween(fromISODate, toISODate) {
  const a = Date.parse(`${fromISODate.slice(0, 10)}T00:00:00Z`);
  const b = Date.parse(`${toISODate.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) throw new Error(`Bad date in daysBetween: ${fromISODate} -> ${toISODate}`);
  return Math.round((b - a) / 86400000);
}

export function addDays(isoDate, n) {
  const t = Date.parse(`${isoDate.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(t)) throw new Error(`Bad date in addDays: ${isoDate}`);
  return new Date(t + n * 86400000).toISOString().slice(0, 10);
}

// A dependency is satisfied at founder_review, not only at done.
//
// This is deliberate and it is load-bearing. Done requires explicit founder
// approval (D-001 point 20) and D-024 batches that approval to the end of a work
// package. If a successor could only start once its predecessor were approved,
// then wiring the real dependency graph would idle every parallel package behind
// one founder's queue, which is R-006 turned into a deadlock. A task in
// founder_review has agreed acceptance criteria, recorded evidence and passed
// verification: its content is settled and only the signature is outstanding.
//
// The cost is real and is named here rather than hidden: if the founder rejects
// a predecessor, successors started against it may need rework. `task <ID>`
// prints which dependencies are satisfied-but-unapproved so that exposure stays
// visible.
export const DEPENDENCY_SATISFIED_AT = ["founder_review", "done"];

export function dependencyState(state, task) {
  const byId = new Map(state.tasks.map((t) => [t.id, t]));
  const unmet = [];
  const unapproved = [];
  for (const d of task.dependencies || []) {
    const p = byId.get(d);
    if (!p || !DEPENDENCY_SATISFIED_AT.includes(p.status)) unmet.push(d);
    else if (p.status !== "done") unapproved.push(d);
  }
  return { unmet, unapproved };
}

function unblockedNext(state) {
  return state.tasks
    .filter((t) => ["backlog", "ready"].includes(t.status))
    .filter((t) => dependencyState(state, t).unmet.length === 0)
    .sort((a, b) => {
      const p = PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority);
      if (p !== 0) return p;
      if (a.criticalPath !== b.criticalPath) return a.criticalPath ? -1 : 1;
      return a.id < b.id ? -1 : 1;
    });
}

// ---------------------------------------------------------------------------
// Renderers
// ---------------------------------------------------------------------------

const GENERATED = (source) =>
  `<!-- GENERATED FILE — DO NOT EDIT -->\n> **Generated from PROJECT_STATE.json. Do not edit status data directly in this file.**\n> Regenerate with \`node ${source} render\`.\n`;

const TOOL_PATH = "studio/docs/execution/venue-edition-and-films/tools/project-control.mjs";

export function renderBacklog(state) {
  const d = derive(state);
  const L = [];
  L.push("# BACKLOG — Venue Edition and Films (VEF-2026)");
  L.push("");
  L.push(GENERATED(TOOL_PATH));
  L.push(`State as at ${state.meta.lastUpdatedAt} · baseline **${state.baseline.state}** (${state.baseline.version})`);
  L.push("");
  L.push(`${d.totals.tasks} tasks across ${state.epics.length} epics · ${d.totals.criticalPath} on the imported critical path · ${d.totals.releaseBlocking} release-blocking · ${d.totals.unestimated} unestimated.`);
  L.push("");
  L.push("Legend: **CP** imported critical path · **RB** release-blocking · **SN** start-now · **FD** founder decision, only Ethan can answer it · **FC** Claude brings options, Ethan picks · spec ✓ when a task specification exists · **Evidence** is the count of recorded evidence references · **Target** is a deliberately set date, never a forecast · sign-off is the founder state.");
  L.push("");
  L.push(`Board fields, per E01.05: epic (section heading) · task ID · priority · status · owner (executor) · dependency · acceptance evidence · target date.`);
  L.push("");

  for (const e of state.epics) {
    const stat = d.epics.find((x) => x.id === e.id);
    L.push(`## ${e.id} — ${e.title}`);
    L.push("");
    if (e.note) L.push(`_${e.note}_`);
    L.push("");
    L.push(`Lane: \`${e.executor}\` · ${stat.done}/${stat.active} done (${stat.percent}%) · ${stat.inFlight} in flight · ${stat.blocked} blocked`);
    L.push("");
    L.push("| ID | Title | Status | Pri | Flags | Executor | Depends on | Target | Evidence | Blocker | Spec | Sign-off |");
    L.push("|---|---|---|---|---|---|---|---|---|---|---|---|");
    for (const t of state.tasks.filter((x) => x.epic === e.id)) {
      const dec = t.decisionClass === "founder_only" ? "FD" : t.decisionClass === "founder_choice" ? "FC" : null;
      const flags = [t.criticalPath ? "CP" : null, t.releaseBlocking ? "RB" : null, t.startNow ? "SN" : null, dec].filter(Boolean).join(" ") || "—";
      const deps = (t.dependencies || []).join(", ") || "—";
      const blocker = (t.blockedBy || []).map((b) => b.reason || b).join("; ") || "—";
      const ev = (t.evidence || []).length ? `${t.evidence.length}` : "—";
      L.push(`| ${t.id} | ${escapePipes(t.title)} | ${t.status} | ${t.priority} | ${flags} | ${t.executor} | ${deps} | ${t.targetDate || "—"} | ${ev} | ${escapePipes(blocker)} | ${t.specPath ? "✓" : "—"} | ${t.founderSignOff.state} |`);
    }
    L.push("");
  }
  return `${L.join("\n")}\n`;
}

const escapePipes = (s) => String(s).replace(/\|/g, "\\|");

export function renderStatus(state, now) {
  const d = derive(state);
  const today = now.slice(0, 10);
  const days = daysBetween(today, state.project.releaseDate);
  const L = [];

  L.push("# STATUS — Venue Edition and Films (VEF-2026)");
  L.push("");
  L.push(GENERATED(TOOL_PATH));
  L.push(`**Report generated:** ${now} (project timezone ${state.project.timezone})`);
  L.push(`**State last updated:** ${state.meta.lastUpdatedAt} · session \`${state.meta.lastUpdatedSession || "—"}\``);
  L.push(`**Release date:** ${state.project.releaseDate} · **${days} days remaining**`);
  L.push(`**Project completion condition:** ${state.project.completionCondition}`);
  L.push("");

  L.push("## Health");
  L.push("");
  L.push(`**${state.project.health.rag.toUpperCase()}** — ${state.project.health.reason}`);
  L.push("");
  L.push(`**Current phase:** ${state.project.currentPhase}`);
  const gateNow = (state.releaseGates || []).find((g) => g.status !== "passed" && g.status !== "waived");
  L.push(`**Current release gate:** ${gateNow ? `${gateNow.name} (${gateNow.status})` : "all gates passed or waived"}`);
  L.push(`**Baseline:** ${state.baseline.state} (${state.baseline.version})${state.baseline.state !== "approved" ? " — percentages below are provisional" : ""}`);
  L.push("");

  L.push("## Completion");
  L.push("");
  const v = d.verified;
  L.push(`**Verified completion: ${v.value}%** — ${v.numerator} of ${v.denominator} ${v.unit}.`);
  L.push(`Basis: \`${v.basis}\`. ${v.provisional ? "Provisional, count-based: no effort estimates are approved, so every task counts equally. This is not a measure of effort remaining." : "Approved effort points."}`);
  L.push("");
  L.push(`**Delivery progress estimate:** ${d.deliveryEstimate.available ? `${d.deliveryEstimate.value}% (estimate, not verified completion — status-credit model in REPORTING.md)` : `not reported — ${d.deliveryEstimate.reason}`}`);
  L.push("");
  L.push(`**Unestimated active tasks:** ${d.totals.unestimated} of ${d.totals.active}.`);
  L.push("");
  L.push("A task counts as complete only when its acceptance criteria are met, evidence is recorded, verification passed, and the founder has explicitly approved it.");
  L.push("");

  L.push("## Task counts by status");
  L.push("");
  L.push("| Status | Count |");
  L.push("|---|---|");
  for (const s of STATUSES) L.push(`| ${s} | ${d.counts[s]} |`);
  L.push(`| **total** | **${d.totals.tasks}** |`);
  L.push("");

  L.push("## Progress by epic");
  L.push("");
  L.push("| Epic | Title | Done/Active | % | In flight | Blocked |");
  L.push("|---|---|---|---|---|---|");
  for (const e of d.epics) L.push(`| ${e.id} | ${escapePipes(e.title)} | ${e.done}/${e.active} | ${e.percent}% | ${e.inFlight} | ${e.blocked} |`);
  L.push("");

  L.push("## Release-gate readiness");
  L.push("");
  L.push("A high task percentage never overrides a failed gate. The go/no-go milestone cannot pass unless every gate has passed or carries a documented founder waiver.");
  L.push("");
  L.push("| Gate | Owner | Status | Exit criteria | Supporting epics | Blockers | Passed |");
  L.push("|---|---|---|---|---|---|---|");
  for (const g of state.releaseGates) {
    L.push(`| ${g.name} | ${g.owner} | **${g.status}** | ${(g.exitCriteria || []).length} | ${g.supportingEpics.join(", ")} | ${g.blockers.length || "—"} | ${g.passedAt || "—"} |`);
  }
  L.push("");

  L.push("## Milestones");
  L.push("");
  L.push("The release milestone and the completion condition are separate and never reported as one figure (E01.03).");
  L.push("");
  L.push("| Milestone | Target | Status | Exit criteria |");
  L.push("|---|---|---|---|");
  for (const m of state.milestones || []) {
    L.push(`| ${m.id} ${escapePipes(m.name)} | ${m.targetDate || "outcome-driven, undated"} | ${m.status} | ${(m.exitCriteria || []).length} |`);
  }
  L.push("");

  L.push("## Freeze dates");
  L.push("");
  L.push("Ratified in D-008. Moving one is change control, not an edit.");
  L.push("");
  L.push("| Freeze | Date | Days left | What stops changing |");
  L.push("|---|---|---|---|");
  for (const f of state.freezes || []) {
    const left = daysBetween(today, f.date);
    L.push(`| ${f.name} | ${f.date} | ${left < 0 ? `**passed ${-left}d ago**` : left} | ${escapePipes(f.meaning)} |`);
  }
  L.push("");

  L.push("## Current work");
  L.push("");
  const focus = state.focus?.taskId ? state.tasks.find((t) => t.id === state.focus.taskId) : null;
  L.push(`**Focus task:** ${focus ? `${focus.id} — ${focus.title} (${focus.status})` : `none — ${state.focus?.note || "not set"}`}`);
  L.push("");
  L.push(`**In progress (${d.inProgress.length}/${state.wip.maxInProgress}):**`);
  L.push(...listOrNone(d.inProgress));
  L.push("");
  L.push(`**Internal review (${d.internalReview.length}):**`);
  L.push(...listOrNone(d.internalReview));
  L.push("");
  L.push(`**Awaiting founder review (${d.founderReview.length}):**`);
  L.push(...listOrNone(d.founderReview));
  L.push("");
  L.push(`**Blocked (${d.blocked.length}):**`);
  L.push(...(d.blocked.length ? d.blocked.map((t) => `- \`${t.id}\` ${t.title}\n  - Blocked by: ${(t.blockedBy || []).map((b) => b.reason || b).join("; ")}`) : ["- None."]));
  L.push("");

  L.push("## Founder decisions required");
  L.push("");
  const decisions = [];
  if (state.baseline.state !== "approved") decisions.push("Approve or amend the project baseline (BASELINE_REVIEW.md). Everything downstream is provisional until this happens.");
  for (const t of d.founderReview) decisions.push(`Approve or reject \`${t.id}\` — ${t.title}`);
  for (const g of state.releaseGates.filter((x) => x.status === "ready_for_review")) decisions.push(`Release gate "${g.name}" is ready for review.`);
  L.push(...(decisions.length ? decisions.map((x, i) => `${i + 1}. ${x}`) : ["- None."]));
  L.push("");

  L.push("## Completed since the last report");
  L.push("");
  const recent = state.tasks
    .filter((t) => t.status === "done" && t.completedAt)
    .sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1))
    .slice(0, 10);
  L.push(...(recent.length ? recent.map((t) => `- ${t.completedAt} \`${t.id}\` ${t.title}`) : ["- Nothing completed yet. No task has been founder-approved."]));
  L.push("");

  L.push("## Three highest-value next actions");
  L.push("");
  const next = unblockedNext(state).slice(0, 3);
  if (state.baseline.state !== "approved") {
    L.push("1. Founder: approve or amend the baseline in BASELINE_REVIEW.md. No task should start against an unapproved baseline except the governance tasks that create it.");
    next.slice(0, 2).forEach((t, i) => L.push(`${i + 2}. \`${t.id}\` ${t.title} (${t.priority}${t.criticalPath ? ", critical path" : ""})`));
  } else {
    next.forEach((t, i) => L.push(`${i + 1}. \`${t.id}\` ${t.title} (${t.priority}${t.criticalPath ? ", critical path" : ""})`));
  }
  L.push("");

  L.push("## Critical-path condition");
  L.push("");
  const cp = state.tasks.filter((t) => t.criticalPath);
  const cpDone = cp.filter((t) => t.status === "done").length;
  const cpBlocked = cp.filter((t) => t.status === "blocked");
  L.push(`${cpDone}/${cp.length} critical-path tasks complete. ${cpBlocked.length} blocked${cpBlocked.length ? `: ${cpBlocked.map((t) => t.id).join(", ")}` : "."}`);
  L.push("");
  L.push("Chain: E01 governance → E02 offer → E03 legal → E04 architecture → E05/E06/E07 product, Timeline, portal → E08/E09 engineering, data, copy → E14.15 product capture → E13.17/E14.18 film lock → E12.14 commercial pages → E15.01 go/no-go → E15.07 Cohort 1 → E15.15–E15.17 to 25 paid.");
  L.push("");

  L.push("## Founding 25 — commercial outcome");
  L.push("");
  L.push("Tracked separately from backlog completion. Sending 25 invitations is not the outcome; 25 signed, paid and onboarded venues is.");
  L.push("");
  const c = state.commercial;
  L.push("| Measure | Value |");
  L.push("|---|---|");
  L.push(`| Founding target | ${c.target.foundingVenues} |`);
  L.push(`| Founding places available | ${c.foundingPlacesAvailable} |`);
  L.push(`| Researched account universe | ${c.researchedAccountUniverse} |`);
  L.push(`| Cohorts ready | ${Object.entries(c.cohortReady).filter(([, v2]) => v2).map(([k]) => k).join(", ") || "none"} |`);
  L.push(`| Invitations issued | ${c.invitationsIssued} |`);
  L.push(`| Responses | ${c.responses} |`);
  L.push(`| Qualified meetings | ${c.qualifiedMeetings} |`);
  L.push(`| Demonstrations | ${c.demonstrations} |`);
  L.push(`| Proposals | ${c.proposals} |`);
  L.push(`| Signed agreements | ${c.signedAgreements} |`);
  L.push(`| **Paid agreements** | **${c.paidAgreements} / ${c.target.foundingVenues}** |`);
  L.push(`| Configured venue accounts | ${c.configuredVenueAccounts} |`);
  L.push(`| **Onboarded venues** | **${c.onboardedVenues} / ${c.target.foundingVenues}** |`);
  L.push(`| First couple invitations | ${c.firstCoupleInvitations} |`);
  L.push(`| First couple activations | ${c.firstCoupleActivations} |`);
  L.push("");

  L.push("## Film deliverable state");
  L.push("");
  for (const key of Object.keys(state.films)) {
    const f = state.films[key];
    const stages = Object.entries(f.stages);
    const complete = stages.filter(([, s]) => s === "complete").length;
    L.push(`### ${f.name} (${f.epic}, lane \`${f.lane}\`)`);
    L.push("");
    L.push(`${complete}/${stages.length} stages complete. A draft render is not a complete film.`);
    L.push("");
    L.push(stages.map(([k, s]) => `\`${k}\`: ${s}`).join(" · "));
    L.push("");
  }

  L.push("## Session");
  L.push("");
  L.push(`**Open sessions:** ${(state.session.open || []).length ? state.session.open.map((s) => `${s.id} (${s.objective})`).join(" · ") : "none"}`);
  L.push(`**Last closed session:** ${state.session.lastClosed ? `${state.session.lastClosed.id} (${state.session.lastClosed.closedAt}) → \`${state.session.lastClosed.record}\`` : "none"}`);
  L.push("");
  L.push("## Next recommended project-management action");
  L.push("");
  L.push(state.baseline.state !== "approved"
    ? "Put BASELINE_REVIEW.md in front of the founder and get an explicit approve/amend on the baseline, the six open founder decisions and the proposed priorities. Until then no percentage in this report should be treated as a commitment."
    : "Keep the focus task moving, clear anything in Founder Review, and re-run `render` before closing the session.");
  L.push("");
  return `${L.join("\n")}\n`;
}

const listOrNone = (arr) => (arr.length ? arr.map((t) => `- \`${t.id}\` ${t.title}${t.executor ? ` — ${t.executor}` : ""}`) : ["- None."]);

// ---------------------------------------------------------------------------
// Founder-review packet (D-024)
//
// A work package returns ONE consolidated packet, not a review per task. This
// generates it from canonical state so every package comes back in the same
// shape and can be approved in one pass.
// ---------------------------------------------------------------------------

export function packetBlockers(t) {
  const problems = [];
  if (t.acceptanceCriteria.length === 0) problems.push("no acceptance criteria");
  if (t.evidence.length === 0) problems.push("no evidence");
  if (t.status !== "founder_review") problems.push(`status is "${t.status}", not founder_review`);
  return problems;
}

// E01.12. The weekly operating review, D-008 clause 4: Friday morning, folded
// into the existing Friday brief. Six named sections plus a seven-day horizon.
// It is deliberately NOT renderStatus: a status report says where the project
// is, an operating review says what needs a decision this week.
export function renderWeekly(state, now) {
  const d = derive(state);
  const today = now.slice(0, 10);
  const horizon = addDays(today, 7);
  const days = daysBetween(today, state.project.releaseDate);
  const L = [];

  L.push(`# WEEKLY OPERATING REVIEW — ${today}`);
  L.push("");
  L.push(`Release ${state.project.releaseDate} · **${days} days remaining** · health **${state.project.health.rag.toUpperCase()}**`);
  L.push(`Verified completion ${d.verified.value}% (${d.verified.numerator}/${d.verified.denominator} ${d.verified.unit}, basis \`${d.verified.basis}\`)`);
  L.push("");
  L.push("Six sections, per E01.12. Read it in that order: what is stuck, what needs you, what we can prove, what is rotting, where the business actually is, and what happens next week.");
  L.push("");

  // 1. Blockers
  L.push("## 1. Blockers");
  L.push("");
  if (d.blocked.length) {
    for (const t of d.blocked) L.push(`- \`${t.id}\` ${t.title} — ${(t.blockedBy || []).map((b) => b.reason || b).join("; ")}`);
  } else {
    L.push("- No task is in the blocked state.");
  }
  const stale = state.tasks.filter((t) => t.status === "in_progress" && t.startedAt && daysBetween(t.startedAt, today) > 7);
  L.push("");
  L.push(stale.length
    ? `**Stale In Progress (over 7 days):** ${stale.map((t) => `\`${t.id}\` since ${t.startedAt}`).join(" · ")}`
    : "**Stale In Progress (over 7 days):** none.");
  L.push("");

  // 2. Decisions
  L.push("## 2. Decisions");
  L.push("");
  const awaiting = d.founderReview;
  L.push(`**Awaiting founder approval:** ${awaiting.length}`);
  awaiting.forEach((t) => L.push(`- \`${t.id}\` ${t.title}`));
  const unanswered = state.tasks.filter((t) => t.decisionClass === "founder_only" && t.decisionQuestion && !["done", "deferred", "cancelled"].includes(t.status));
  L.push("");
  L.push(`**Open questions only the founder can answer:** ${unanswered.length}`);
  unanswered.slice(0, 12).forEach((t) => L.push(`- \`${t.id}\` ${t.decisionQuestion}`));
  if (unanswered.length > 12) L.push(`- …and ${unanswered.length - 12} more. Full list: \`status decisions\`.`);
  L.push("");

  // 3. Evidence
  L.push("## 3. Evidence");
  L.push("");
  const withEvidence = state.tasks.filter((t) => (t.evidence || []).length > 0);
  const active = state.tasks.filter((t) => !["deferred", "cancelled"].includes(t.status));
  const withCriteria = state.tasks.filter((t) => (t.acceptanceCriteria || []).length > 0);
  L.push(`| Measure | Count |`);
  L.push(`|---|---|`);
  L.push(`| Active tasks | ${active.length} |`);
  L.push(`| Carrying acceptance criteria | ${withCriteria.length} |`);
  L.push(`| Carrying recorded evidence | ${withEvidence.length} |`);
  L.push(`| Carrying a task specification | ${state.tasks.filter((t) => t.specPath).length} |`);
  L.push("");
  const recent = [];
  for (const t of state.tasks) for (const e of t.evidence || []) if (e.at && e.at.slice(0, 10) >= addDays(today, -7)) recent.push(`- \`${t.id}\` ${e.ref}${e.note ? ` — ${e.note}` : ""}`);
  L.push(`**Evidence recorded in the last 7 days:** ${recent.length}`);
  recent.slice(0, 15).forEach((r) => L.push(r));
  if (recent.length > 15) L.push(`- …and ${recent.length - 15} more.`);
  L.push("");
  L.push("A task in flight with no acceptance criteria has no agreed definition of done. That is the number to watch on this line.");
  L.push("");

  // 4. Quality
  L.push("## 4. Quality");
  L.push("");
  L.push("| Signal | State |");
  L.push("|---|---|");
  L.push(`| Tasks In Progress with zero acceptance criteria | ${d.inProgress.filter((t) => !(t.acceptanceCriteria || []).length).length} |`);
  L.push(`| Tasks in Founder Review with zero evidence | ${d.founderReview.filter((t) => !(t.evidence || []).length).length} |`);
  L.push(`| Tasks Done without founder approval | ${state.tasks.filter((t) => t.status === "done" && t.founderSignOff?.state !== "approved").length} (validate refuses any) |`);
  L.push(`| Release gates with fewer than 8 exit criteria | ${(state.releaseGates || []).filter((g) => (g.exitCriteria || []).length < 8).map((g) => g.id).join(", ") || "none"} |`);
  L.push(`| Unestimated active tasks | ${d.totals.unestimated} of ${d.totals.active} |`);
  L.push("");
  L.push("**Registers this tool does not validate:** `DECISIONS.md` and `RAID.md` are hand-maintained. Nothing renders, drift-checks or tests them, so a missing risk category or an unrecorded decision is invisible to every other number on this page. Read them with your own eyes once a week.");
  L.push("");

  // 5. Pipeline
  L.push("## 5. Pipeline");
  L.push("");
  const c = state.commercial;
  L.push("| Stage | Count |");
  L.push("|---|---|");
  L.push(`| Researched account universe | ${c.researchedAccountUniverse} |`);
  L.push(`| Invitations issued | ${c.invitationsIssued} |`);
  L.push(`| Responses | ${c.responses} |`);
  L.push(`| Proposals | ${c.proposals} |`);
  L.push(`| Signed agreements | ${c.signedAgreements} |`);
  L.push(`| **Paid agreements** | **${c.paidAgreements}** of ${c.target.foundingVenues} |`);
  L.push(`| **Onboarded venues** | **${c.onboardedVenues}** of ${c.target.foundingVenues} |`);
  L.push("");
  L.push("The two bold rows are the project. Invitations issued is activity, not outcome, and the two are never summed.");
  L.push("");

  // 6. Next seven days
  L.push("## 6. The next seven days");
  L.push("");
  L.push(`Window: ${today} to ${horizon}.`);
  L.push("");
  const freezesDue = (state.freezes || []).filter((f) => f.date >= today && f.date <= horizon);
  L.push(`**Freezes landing this week:** ${freezesDue.length ? freezesDue.map((f) => `${f.name} ${f.date}`).join(" · ") : "none"}`);
  const nextFreeze = (state.freezes || []).filter((f) => f.date >= today).sort((a, b) => (a.date < b.date ? -1 : 1))[0];
  if (nextFreeze) L.push(`**Next freeze after that:** ${nextFreeze.name}, ${nextFreeze.date}, in ${daysBetween(today, nextFreeze.date)} days.`);
  L.push("");
  const dated = state.tasks.filter((t) => t.targetDate && t.targetDate <= horizon && !["done", "deferred", "cancelled"].includes(t.status)).sort((a, b) => (a.targetDate < b.targetDate ? -1 : 1));
  L.push(`**Tasks with a target date on or before ${horizon}:** ${dated.length}`);
  dated.forEach((t) => L.push(`- \`${t.id}\` ${t.targetDate}${t.targetDate < today ? " **(overdue)**" : ""} — ${t.title}`));
  if (!dated.length) L.push("- None. A target date is set deliberately; an empty list means nothing has been committed to this week, not that there is no work.");
  L.push("");
  L.push("**Highest-value unblocked next actions:**");
  const next = unblockedNext(state).slice(0, 5);
  next.length ? next.forEach((t) => L.push(`- \`${t.id}\` ${t.title}`)) : L.push("- None available. Clear a blocker or a founder review.");
  L.push("");
  L.push("---");
  L.push("");
  L.push("This review changes no state. It is a read. Decisions taken here are recorded with `approve`, `gate`, `target` or a change request, not by having been discussed.");
  return `${L.join("\n")}\n`;
}

export function renderPacket(state, tasks, label, now) {
  const ready = tasks.filter((t) => packetBlockers(t).length === 0);
  const notReady = tasks.filter((t) => packetBlockers(t).length > 0);
  const L = [];

  L.push(`# Founder review packet — ${label}`);
  L.push("");
  L.push(`Generated ${now} from PROJECT_STATE.json. ${tasks.length} task(s).`);
  L.push("");
  L.push(`**${ready.length} ready to approve · ${notReady.length} not ready.**`);
  L.push("");
  L.push("Approving sets these tasks to Done and is the only thing that can. Nothing here is Done yet.");
  L.push("");

  if (ready.length) {
    L.push("## Ready to approve");
    L.push("");
    for (const t of ready) {
      L.push(`### \`${t.id}\` ${t.title}`);
      L.push("");
      L.push(`Executor: ${t.executor} · ${t.criticalPath ? "critical path · " : ""}${t.releaseBlocking ? "release-blocking · " : ""}in review since ${t.reviewAt || "—"}`);
      L.push("");
      L.push("**Acceptance criteria**");
      t.acceptanceCriteria.forEach((c, i) => L.push(`${i + 1}. ${c}`));
      L.push("");
      L.push("**Evidence**");
      t.evidence.forEach((e) => L.push(`- ${e.ref}${e.note ? ` — ${e.note}` : ""}`));
      if (t.specPath) L.push(`- Specification: \`${t.specPath}\``);
      L.push("");
    }
  }

  if (notReady.length) {
    L.push("## Not ready — cannot be approved");
    L.push("");
    L.push("| Task | Title | Missing |");
    L.push("|---|---|---|");
    for (const t of notReady) L.push(`| \`${t.id}\` | ${escapePipes(t.title)} | ${packetBlockers(t).join("; ")} |`);
    L.push("");
  }

  L.push("## Your decision");
  L.push("");
  if (ready.length) {
    L.push("Approve all of the above in one command:");
    L.push("");
    L.push("```bash");
    L.push(`node ${TOOL_PATH} approve-batch "your approval note" ${ready.map((t) => t.id).join(" ")}`);
    L.push("```");
    L.push("");
    L.push("Or push back on any single one:");
    L.push("");
    L.push("```bash");
    L.push(`node ${TOOL_PATH} reject ${ready[0].id} "what is wrong"`);
    L.push("```");
  } else {
    L.push("Nothing in this package is ready for approval. See the table above.");
  }
  L.push("");
  return `${L.join("\n")}\n`;
}

function resolvePacketTasks(state, args, flags) {
  if (flags.includes("--review")) return state.tasks.filter((t) => t.status === "founder_review");
  const out = [];
  for (const a of args) {
    if (/^E\d{2}$/.test(a)) out.push(...state.tasks.filter((t) => t.epic === a));
    else out.push(mustTask(state, a));
  }
  return [...new Map(out.map((t) => [t.id, t])).values()].sort((a, b) => (a.id < b.id ? -1 : 1));
}

// ---------------------------------------------------------------------------
// Command helpers
// ---------------------------------------------------------------------------

function mustTask(state, id) {
  const t = state.tasks.find((x) => x.id === id);
  if (!t) {
    const near = state.tasks.filter((x) => x.id.startsWith(id.slice(0, 3))).slice(0, 5).map((x) => x.id);
    fail(`Unknown task id "${id}".${near.length ? ` Did you mean one of: ${near.join(", ")}?` : ""}`);
  }
  return t;
}

function guardValid(state, when) {
  const { errors } = validate(state);
  if (errors.length) {
    console.error(`Validation failed ${when}:`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

// Work packages run in parallel sessions, so `session.active` (one slot) became
// a real blocker: the second session could not open, and its close would have
// written its summary into the first session's record. Sessions are now a list.
// Legacy single-session state migrates transparently on first touch.
export function migrateSessions(state) {
  if (!Array.isArray(state.session.open)) {
    state.session.open = state.session.active ? [state.session.active] : [];
  }
  if ("active" in state.session) delete state.session.active;
  return state;
}

// E01.05 named a target-date board field and E01.11 set six freeze dates. Both
// lived only in a task note, so nothing could report against them. Seeded from
// D-008; changing one is change control, not an edit.
export function migrateSchedule(state) {
  if (!Array.isArray(state.freezes)) {
    state.freezes = FREEZES.map((f) => ({ ...f, source: "D-008", status: "open" }));
  }
  for (const t of state.tasks) {
    if (!("targetDate" in t)) t.targetDate = null;
    if (!("targetBasis" in t)) t.targetBasis = null;
  }
  return state;
}

function commit(state, now, sessionId, renderAfter = true) {
  migrateSessions(state);
  migrateSchedule(state);
  state.meta.lastUpdatedAt = now;
  if (sessionId) state.meta.lastUpdatedSession = sessionId;
  guardValid(state, "after mutation (nothing was written)");
  state.meta.lastValidatedAt = now;
  for (const e of state.epics) e.taskCount = state.tasks.filter((t) => t.epic === e.id).length;
  const d = derive(state);
  state.counts = { byStatus: d.counts, totals: d.totals, verifiedCompletion: d.verified };
  saveState(state);
  if (renderAfter) doRender(state, now);
}

function doRender(state, now) {
  state.meta.lastRenderedAt = now;
  writeAtomic(join(ROOT, "BACKLOG.md"), renderBacklog(state));
  writeAtomic(join(ROOT, "STATUS.md"), renderStatus(state, now));
  saveState(state);
}

function historyPush(task, now, from, to, note, by = "claude_code") {
  task.history.push({ at: now, from, to, by, note: note || null });
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const HELP = `project-control.mjs — canonical state tool for VEF-2026

  validate                              Validate PROJECT_STATE.json. Non-zero exit on failure.
  render [--check]                      Regenerate BACKLOG.md and STATUS.md. --check fails on drift.
  briefing                              Session-opening briefing. Read-only.
  status [scope]                        overall|weekly|launch|commercial|films|blockers|founder-review|decisions|E07
  task <ID>                             Show one task in full.
  next [n]                              Highest-value unblocked tasks.
  transition <ID> <status> ["note"]     Move a task. Cannot set done.
  ready <ID> ["note"]                   Shorthand for transition <ID> ready.
  start <ID> ["note"]                   Shorthand for transition <ID> in_progress. Enforces the WIP limit.
  block <ID> "reason" [--by=<ID|ext>]   Record a blocker and move to blocked.
  unblock <ID> ["note"] [--to=<status>] Clear blockers and resume.
  evidence <ID> <ref> ["note"]          Add an evidence reference (path, URL, receipt, test id).
  criteria <ID> "criterion"             Add an acceptance criterion.
  spec <ID> <path>                      Attach a task-specification path.
  estimate <ID> <points> [--approved]   Set effort points (1|2|3|5|8|13).
  executor <ID> <lane>                  claude_code|codex_motion|founder|external|unassigned
  target <ID> <YYYY-MM-DD|none> "why"   Set or clear a task's target date. A basis is mandatory.
  freeze [id]                           Show the six ratified freeze dates (D-008). Read-only.
  answered <ID> <D-nnn> ["note"]        Close a founder question a decision already answered.
  depend <ID> <PRED,...|none> "basis"   Add dependency edges. Basis mandatory, cycles refused.
  focus <ID|none>                       Set the single primary focus task.
  review <ID> ["note"]                  Prepare founder review. Refuses if criteria or evidence are missing.
  packet <E04|IDs...> [--review]        Consolidated founder-review packet (D-024). --write saves it.
  approve <ID> "founder note"           FOUNDER ONLY. Records sign-off and moves to Done.
  approve-batch "note" <IDs...>         FOUNDER ONLY. Approves a whole package in one pass.
                                        --review targets everything in founder_review.
                                        Refuses the whole batch if any task is not approvable
                                        (--partial approves only the eligible ones).
  reject <ID> "reason"                  Founder rejection. Returns the task to in_progress.
  reopen <ID> "reason"                  Reopen a Done task.
  gate <id> <state> ["note"]            Set a release gate. waived requires a founder note.
  gate <id> criteria <file.json>        Replace a gate's exit criteria from a JSON array.
  commercial <field> <value>            Update a Founding 25 counter.
  film <film> <stage> <state>           limerick_first|before_the_day · not_started|in_progress|complete
  baseline approve "note"               FOUNDER ONLY. Approves the project baseline.
  session open "objective" --id=<id>    Open a working session. Several may be open at once.
  session list                          Show every open session.
  session close ["summary"] --id=<id>   Close YOUR session. --id required when several are open.
  help

Global: --now=<ISO> pins the clock (used by tests and for deterministic renders).
Founder-only commands (approve, reject, baseline approve, gate ... waived) represent
explicit founder instruction. Claude must never run them on inference.
`;

function main(argv) {
  const flags = argv.filter((a) => a.startsWith("--"));
  const pos = argv.filter((a) => !a.startsWith("--"));
  const flag = (name) => {
    const f = flags.find((x) => x.startsWith(`--${name}=`));
    return f ? f.slice(name.length + 3) : undefined;
  };
  const has = (name) => flags.includes(`--${name}`);
  const now = flag("now") || new Date().toISOString();
  const today = now.slice(0, 10);
  const cmd = pos[0];

  if (!cmd || cmd === "help" || has("help")) { console.log(HELP); return; }

  // Take the lock BEFORE the read, so the whole read-modify-write cycle is
  // atomic against other sessions. Released on exit, including on failure.
  if (MUTATING.has(cmd)) acquireLock(cmd, now);

  const state = loadState();
  migrateSessions(state);
  const sessionId = flag("id") || state.session.open[0]?.id || null;

  switch (cmd) {
    case "validate": {
      const { errors, warnings } = validate(state);
      for (const w of warnings) console.log(`${WARN} ${w}`);
      if (errors.length) {
        console.error(`\nFAILED — ${errors.length} error(s):`);
        for (const e of errors) console.error(`  - ${e}`);
        process.exit(1);
      }
      const d = derive(state);
      console.log(`OK — ${d.totals.tasks} tasks, ${state.epics.length} epics, ${d.totals.dependencyEdges} dependency edges, no cycles, no duplicate ids.`);
      console.log(`Baseline ${state.baseline.state}. ${warnings.length} warning(s).`);
      state.meta.lastValidatedAt = now;
      saveState(state);
      return;
    }

    case "render": {
      guardValid(state, "before render");
      if (has("check")) {
        // Reproduce exactly what the last `render` wrote: same state, same clock.
        const at = state.meta.lastRenderedAt;
        if (!at) fail("Nothing has been rendered yet. Run `render` first.");
        const b = renderBacklog(state);
        const s = renderStatus(state, at);
        const drift = [];
        if (!existsSync(join(ROOT, "BACKLOG.md")) || readFileSync(join(ROOT, "BACKLOG.md"), "utf8") !== b) drift.push("BACKLOG.md");
        if (!existsSync(join(ROOT, "STATUS.md")) || readFileSync(join(ROOT, "STATUS.md"), "utf8") !== s) drift.push("STATUS.md");
        if (drift.length) { console.error(`Generated files are stale or hand-edited: ${drift.join(", ")}. Run render.`); process.exit(1); }
        console.log("OK — generated files match canonical state.");
        return;
      }
      doRender(state, now);
      console.log("Rendered BACKLOG.md and STATUS.md from PROJECT_STATE.json.");
      return;
    }

    case "briefing": {
      guardValid(state, "before briefing");
      const d = derive(state);
      const days = daysBetween(today, state.project.releaseDate);
      const stale = state.tasks.filter((t) => t.status === "in_progress" && t.startedAt && daysBetween(t.startedAt, today) > 7);
      console.log(`# ${state.project.name} (${state.project.id}) — briefing ${today}`);
      console.log(`Release ${state.project.releaseDate} · ${days} days remaining · phase: ${state.project.currentPhase}`);
      console.log(`Health ${state.project.health.rag.toUpperCase()} — ${state.project.health.reason}`);
      console.log(`Baseline ${state.baseline.state} (${state.baseline.version})`);
      console.log(`\nVerified completion ${d.verified.value}% (${d.verified.numerator}/${d.verified.denominator} ${d.verified.unit}, basis ${d.verified.basis})`);
      console.log(`Delivery estimate: ${d.deliveryEstimate.available ? `${d.deliveryEstimate.value}%` : d.deliveryEstimate.reason}`);
      const gateNow = state.releaseGates.find((g) => !["passed", "waived"].includes(g.status));
      console.log(`Current gate: ${gateNow ? `${gateNow.name} (${gateNow.status})` : "all passed"}`);
      console.log(`\nFocus: ${state.focus.taskId || `none — ${state.focus.note}`}`);
      console.log(`In progress ${d.inProgress.length} · internal review ${d.internalReview.length} · founder review ${d.founderReview.length} · blocked ${d.blocked.length}`);
      if (stale.length) console.log(`${WARN} Stale In Progress (>7 days): ${stale.map((t) => `${t.id} since ${t.startedAt}`).join(", ")}`);
      console.log(`\nFounder decisions required:`);
      if (state.baseline.state !== "approved") console.log("  - Approve or amend the project baseline (BASELINE_REVIEW.md).");
      d.founderReview.forEach((t) => console.log(`  - ${t.id} awaiting approval`));
      if (state.baseline.state === "approved" && d.founderReview.length === 0) console.log("  - None.");
      console.log(`\nFounding 25: ${state.commercial.paidAgreements} paid / ${state.commercial.onboardedVenues} onboarded of ${state.commercial.target.foundingVenues} · universe ${state.commercial.researchedAccountUniverse}`);
      for (const k of Object.keys(state.films)) {
        const f = state.films[k];
        const stages = Object.values(f.stages);
        console.log(`Film ${f.name}: ${stages.filter((s) => s === "complete").length}/${stages.length} stages complete`);
      }
      console.log(`\nRecommended next three:`);
      unblockedNext(state).slice(0, 3).forEach((t, i) => console.log(`  ${i + 1}. ${t.id} (${t.priority}${t.criticalPath ? ", CP" : ""}) ${t.title}`));
      console.log(`\nRead first: HANDOFF.md · BASELINE_REVIEW.md · STATUS.md`);
      return;
    }

    case "status": {
      guardValid(state, "before status");
      const scope = pos[1] || "overall";
      const d = derive(state);
      if (scope === "overall") { console.log(renderStatus(state, now)); return; }
      if (scope === "weekly") { console.log(renderWeekly(state, now)); return; }
      if (scope === "commercial") { console.log(JSON.stringify(state.commercial, null, 2)); return; }
      if (scope === "films") { console.log(JSON.stringify(state.films, null, 2)); return; }
      if (scope === "launch") {
        for (const g of state.releaseGates) console.log(`${g.status.padEnd(16)} ${g.name} (owner ${g.owner}) — epics ${g.supportingEpics.join(", ")}`);
        console.log(`\nGo/no-go (E15.01) can pass only when every gate is passed or waived.`);
        return;
      }
      if (scope === "blockers") {
        if (!d.blocked.length) { console.log("No blocked tasks."); return; }
        d.blocked.forEach((t) => console.log(`${t.id} ${t.title}\n  blocked by: ${(t.blockedBy || []).map((b) => b.reason || b).join("; ")}`));
        return;
      }
      if (scope === "decisions") {
        const only = state.tasks.filter((t) => t.decisionClass === "founder_only");
        const choice = state.tasks.filter((t) => t.decisionClass === "founder_choice");
        console.log(`FOUNDER DECISIONS — ${only.length} questions only Ethan can answer, ${choice.length} where Claude brings options.\n`);
        console.log(`## Questions for the founder (${only.length})\n`);
        let epic = "";
        for (const t of only) {
          if (t.epic !== epic) { epic = t.epic; console.log(`\n${epic} — ${state.epics.find((e) => e.id === epic).title}`); }
          console.log(`  ${t.id} [${t.status}] ${t.decisionQuestion}`);
        }
        console.log(`\n## Claude brings options, Ethan picks (${choice.length})\n`);
        console.log(`  ${choice.map((t) => t.id).join(", ")}`);
        console.log(`\nSee DECISION_DOCKET.md for the questions with recommendations.`);
        return;
      }
      if (scope === "founder-review") {
        if (!d.founderReview.length) { console.log("Nothing awaiting founder review."); return; }
        d.founderReview.forEach((t) => console.log(`${t.id} ${t.title}\n  criteria ${t.acceptanceCriteria.length} · evidence ${t.evidence.length} · since ${t.reviewAt}`));
        return;
      }
      if (/^E\d{2}$/.test(scope)) {
        const e = d.epics.find((x) => x.id === scope);
        if (!e) fail(`Unknown epic "${scope}".`);
        console.log(`${e.id} — ${e.title}: ${e.done}/${e.active} done (${e.percent}%), ${e.inFlight} in flight, ${e.blocked} blocked`);
        state.tasks.filter((t) => t.epic === scope).forEach((t) => console.log(`  ${t.id} [${t.status}] ${t.title}`));
        return;
      }
      fail(`Unknown status scope "${scope}". Try overall|weekly|launch|commercial|films|blockers|founder-review|E07.`);
      return;
    }

    case "task": {
      const t = mustTask(state, pos[1] || "");
      console.log(JSON.stringify(t, null, 2));
      const { unmet, unapproved } = dependencyState(state, t);
      console.log(`\nDependencies unmet: ${unmet.length ? unmet.join(", ") : "none"}`);
      if (unapproved.length) console.log(`Satisfied but not yet approved: ${unapproved.join(", ")} (in founder review; a rejection there lands here)`);
      if (t.dependencyBasis) console.log(`Dependency basis: ${t.dependencyBasis}`);
      const dependents = state.tasks.filter((x) => (x.dependencies || []).includes(t.id)).map((x) => x.id);
      console.log(`Blocks: ${dependents.length ? dependents.join(", ") : "nothing recorded"}`);
      return;
    }

    // E01.07. Dependencies were previously import-only: 20 edges across 4 tasks
    // in a 211-task programme. Every edge added here carries a written basis.
    case "depend": {
      const t = mustTask(state, pos[1] || "");
      const spec = pos[2];
      if (!spec) fail(`Usage: depend <ID> <PRED,PRED,...|none> "basis"`);
      if (spec === "none") {
        t.dependencies = [];
        t.dependencyBasis = null;
        t.updatedAt = today;
        commit(state, now, sessionId);
        console.log(`${t.id}: dependencies cleared.`);
        return;
      }
      const basis = pos[3];
      if (!basis) fail(`A dependency edge needs a basis. Usage: depend ${t.id} <PRED,...> "why". An unsourced edge is a guess that stops work.`);
      const preds = spec.split(",").map((s) => s.trim()).filter(Boolean);
      const ids = new Set(state.tasks.map((x) => x.id));
      for (const p of preds) {
        if (!ids.has(p)) fail(`Dependency "${p}" does not exist.`);
        if (p === t.id) fail(`${t.id} cannot depend on itself.`);
      }
      const before = [...(t.dependencies || [])];
      t.dependencies = [...new Set([...before, ...preds])].sort();
      t.dependencyBasis = t.dependencyBasis && t.dependencyBasis !== basis ? `${t.dependencyBasis} · ${basis}` : basis;
      t.updatedAt = today;
      const cycles = findCycles(state.tasks);
      if (cycles.length) fail(`That edge creates a cycle: ${cycles[0].join(" -> ")}. Nothing was written.`);
      commit(state, now, sessionId);
      console.log(`${t.id}: depends on ${t.dependencies.join(", ")}`);
      return;
    }

    case "next": {
      const n = Number(pos[1] || 5);
      unblockedNext(state).slice(0, n).forEach((t, i) => console.log(`${i + 1}. ${t.id} (${t.priority}${t.criticalPath ? ", CP" : ""}${t.releaseBlocking ? ", RB" : ""}) ${t.title}`));
      return;
    }

    case "ready":
    case "start":
    case "transition": {
      const id = pos[1];
      const target = cmd === "transition" ? pos[2] : cmd === "ready" ? "ready" : "in_progress";
      const note = cmd === "transition" ? pos[3] : pos[2];
      if (!id || !target) fail(`Usage: ${cmd} <ID>${cmd === "transition" ? " <status>" : ""} ["note"]`);
      const t = mustTask(state, id);
      if (!STATUSES.includes(target)) fail(`Invalid status "${target}". Allowed: ${STATUSES.join(", ")}.`);
      if (target === "done") fail("`transition` cannot set done. Done requires explicit founder approval: use `approve <ID> \"note\"`.");
      if (target === "blocked") fail("Use `block <ID> \"reason\"` so the blocker is recorded.");
      if (t.status === target) fail(`${id} is already ${target}.`);
      if (!TRANSITIONS[t.status].includes(target)) {
        fail(`Illegal transition ${t.status} -> ${target} for ${id}. Legal from ${t.status}: ${TRANSITIONS[t.status].join(", ")}.`);
      }
      if (target === "in_progress") {
        const { unmet, unapproved } = dependencyState(state, t);
        if (unmet.length && !has("waive-deps")) {
          fail(`${id} has unmet dependencies: ${unmet.join(", ")}. Take them to founder review, or pass --waive-deps with a note recording the founder's waiver.`);
        }
        if (unmet.length) t.notes.push({ at: now, note: `Dependency waiver: ${unmet.join(", ")}. ${note || ""}`.trim() });
        if (unapproved.length) {
          t.notes.push({ at: now, note: `Started against unapproved predecessors: ${unapproved.join(", ")}. They are in founder review, not Done. A rejection there may mean rework here.` });
          console.log(`${WARN} ${id} starts against ${unapproved.join(", ")}, which are in founder review rather than approved.`);
        }
        if (!t.startedAt) t.startedAt = today;
      }
      const from = t.status;
      t.status = target;
      t.updatedAt = today;
      historyPush(t, now, from, target, note);
      commit(state, now, sessionId);
      console.log(`${id}: ${from} -> ${target}.`);
      const d = derive(state);
      if (d.inProgress.length === state.wip.maxInProgress) console.log(`${WARN} WIP now at the limit (${state.wip.maxInProgress}).`);
      return;
    }

    case "block": {
      const id = pos[1];
      const reason = pos[2];
      if (!id || !reason) fail('Usage: block <ID> "reason" [--by=<task-id|external ref>]');
      const t = mustTask(state, id);
      const by = flag("by") || null;
      if (by && /^E\d{2}\.\d{2}/.test(by) && !state.tasks.find((x) => x.id === by)) fail(`--by "${by}" looks like a task id but does not exist.`);
      t.blockedBy.push({ at: now, reason, by, clearedAt: null });
      const from = t.status;
      t.status = "blocked";
      t.updatedAt = today;
      historyPush(t, now, from, "blocked", reason);
      commit(state, now, sessionId);
      console.log(`${id}: ${from} -> blocked. Reason: ${reason}`);
      console.log("Best unblocked next actions:");
      unblockedNext(state).slice(0, 3).forEach((x, i) => console.log(`  ${i + 1}. ${x.id} ${x.title}`));
      return;
    }

    case "unblock": {
      const id = pos[1];
      const t = mustTask(state, id || "");
      if (t.status !== "blocked") fail(`${id} is ${t.status}, not blocked.`);
      const to = flag("to") || (t.startedAt ? "in_progress" : "ready");
      if (!TRANSITIONS.blocked.includes(to)) fail(`Cannot resume into "${to}".`);
      // Blockers are cleared from the live field but never lost: they move into notes.
      for (const b of t.blockedBy) {
        t.notes.push({ at: now, note: `Blocker cleared: ${b.reason}${b.by ? ` (by ${b.by})` : ""}` });
      }
      t.blockedBy = [];
      t.status = to;
      t.updatedAt = today;
      historyPush(t, now, "blocked", to, pos[2] || "Blocker cleared.");
      commit(state, now, sessionId);
      console.log(`${id}: blocked -> ${to}.`);
      return;
    }

    case "evidence": {
      const id = pos[1];
      const ref = pos[2];
      if (!id || !ref) fail('Usage: evidence <ID> <path-or-url-or-note> ["note"]');
      const t = mustTask(state, id);
      t.evidence.push({ at: now, ref, note: pos[3] || null, addedBy: "claude_code" });
      t.updatedAt = today;
      commit(state, now, sessionId);
      console.log(`${id}: evidence recorded (${t.evidence.length} total).`);
      return;
    }

    case "criteria": {
      const id = pos[1];
      const text = pos[2];
      if (!id || !text) fail('Usage: criteria <ID> "acceptance criterion"');
      const t = mustTask(state, id);
      t.acceptanceCriteria.push(text);
      t.updatedAt = today;
      commit(state, now, sessionId);
      console.log(`${id}: ${t.acceptanceCriteria.length} acceptance criteria.`);
      return;
    }

    case "spec": {
      const t = mustTask(state, pos[1] || "");
      if (!pos[2]) fail("Usage: spec <ID> <path-relative-to-project-root>");
      t.specPath = pos[2];
      t.updatedAt = today;
      commit(state, now, sessionId);
      console.log(`${t.id}: spec -> ${t.specPath}`);
      return;
    }

    case "estimate": {
      const t = mustTask(state, pos[1] || "");
      const points = Number(pos[2]);
      if (!EFFORT_SCALE.includes(points)) fail(`Effort points must be one of ${EFFORT_SCALE.join(", ")}.`);
      t.effortPoints = points;
      t.estimateStatus = has("approved") ? "approved" : "provisional";
      t.updatedAt = today;
      commit(state, now, sessionId);
      console.log(`${t.id}: ${points} points (${t.estimateStatus}).`);
      if (t.estimateStatus === "approved") console.log("Note: approved estimates change the verified-completion denominator only once baseline.estimatesApproved is true.");
      return;
    }

    case "executor": {
      const t = mustTask(state, pos[1] || "");
      if (!EXECUTORS.includes(pos[2])) fail(`Executor must be one of ${EXECUTORS.join(", ")}.`);
      t.executor = pos[2];
      t.updatedAt = today;
      commit(state, now, sessionId);
      console.log(`${t.id}: executor ${t.executor}`);
      return;
    }

    // A founder question that has been answered must stop being reported as
    // open. Four E01 tasks were answered by D-008 on 2026-08-02 and still
    // appeared in the founder's queue, which inflates the one number the
    // founder-capacity risk (R-006) is measured by.
    case "answered": {
      const t = mustTask(state, pos[1] || "");
      const by = pos[2];
      if (!by) fail(`Usage: answered <ID> <D-nnn|CR-nnn> ["note"]. Name the decision that answered it.`);
      if (!/^(D-\d{3}|CR-\d{3})$/.test(by)) fail(`Expected a decision id like D-008 or CR-001, got "${by}".`);
      if (!t.decisionQuestion) fail(`${t.id} has no open question to close.`);
      const q = t.decisionQuestion;
      t.decisionQuestion = null;
      t.answeredBy = by;
      t.notes.push({ at: now, note: `Question closed by ${by}: "${q}"${pos[3] ? ` — ${pos[3]}` : ""}` });
      t.updatedAt = today;
      commit(state, now, sessionId);
      console.log(`${t.id}: question closed by ${by}. It no longer appears in the founder queue.`);
      return;
    }

    // E01.05's eighth board field. A target date is stated, never computed:
    // REPORTING.md section 8 refuses forecast dates, and a basis is mandatory so
    // a date can never arrive without a reason attached.
    case "target": {
      const t = mustTask(state, pos[1] || "");
      const val = pos[2];
      if (!val) fail('Usage: target <ID> <YYYY-MM-DD|none> "why that date"');
      if (val === "none") {
        t.targetDate = null;
        t.targetBasis = null;
        t.updatedAt = today;
        commit(state, now, sessionId);
        console.log(`${t.id}: target date cleared.`);
        return;
      }
      if (!ISO_DATE.test(val)) fail(`Target date must be YYYY-MM-DD or "none", got "${val}".`);
      const basis = pos[3];
      if (!basis) fail(`A target date needs a basis. Usage: target ${t.id} ${val} "why that date". A date without a reason is a guess wearing a date.`);
      t.targetDate = val;
      t.targetBasis = basis;
      t.updatedAt = today;
      commit(state, now, sessionId);
      const left = daysBetween(today, val);
      console.log(`${t.id}: target ${val} (${left < 0 ? `${-left} days overdue` : `${left} days`}) — ${basis}`);
      return;
    }

    case "freeze": {
      migrateSchedule(state);
      if (!pos[1]) {
        for (const f of state.freezes) console.log(`${f.id.padEnd(18)} ${f.date}  ${daysBetween(today, f.date)}d  ${f.name} — ${f.meaning}`);
        return;
      }
      const f = state.freezes.find((x) => x.id === pos[1]);
      if (!f) fail(`Unknown freeze "${pos[1]}". Known: ${state.freezes.map((x) => x.id).join(", ")}.`);
      // Freeze dates are ratified in D-008. PROJECT.md section 20 puts the
      // release date under change control and these are its scaffolding, so the
      // tool records a move but never pretends one was authorised here.
      if (!pos[2]) { console.log(`${f.id} ${f.date} — ${f.meaning} (source ${f.source}, status ${f.status})`); return; }
      fail(`Freeze dates are ratified in D-008. Moving one is change control: raise a change request (templates/CHANGE_REQUEST.md), get founder approval, then edit state. This command reports; it does not move a freeze.`);
      return;
    }

    case "focus": {
      if (pos[1] === "none") {
        state.focus = { taskId: null, setAt: now, note: pos[2] || "Cleared." };
      } else {
        const t = mustTask(state, pos[1] || "");
        state.focus = { taskId: t.id, setAt: now, note: pos[2] || null };
      }
      commit(state, now, sessionId);
      console.log(`Focus: ${state.focus.taskId || "none"}`);
      return;
    }

    case "review": {
      const t = mustTask(state, pos[1] || "");
      const problems = [];
      if (t.acceptanceCriteria.length === 0) problems.push("no acceptance criteria recorded (`criteria <ID> \"...\"`)");
      if (t.evidence.length === 0) problems.push("no evidence recorded (`evidence <ID> <ref>`)");
      if (!["in_progress", "internal_review"].includes(t.status)) problems.push(`status is "${t.status}"; expected in_progress or internal_review`);
      if (problems.length) fail(`${t.id} is not ready for founder review:\n  - ${problems.join("\n  - ")}`);
      const from = t.status;
      t.status = "founder_review";
      t.founderSignOff = { state: "requested", note: pos[2] || null, date: null };
      t.reviewAt = today;
      t.updatedAt = today;
      historyPush(t, now, from, "founder_review", pos[2] || "Prepared for founder review.");
      commit(state, now, sessionId);
      console.log(`${t.id}: ${from} -> founder_review. Founder approval is required before Done.`);
      console.log(`\nFounder-review packet — ${t.id} ${t.title}`);
      console.log(`Acceptance criteria:`);
      t.acceptanceCriteria.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
      console.log(`Evidence:`);
      t.evidence.forEach((e) => console.log(`  - ${e.ref}${e.note ? ` (${e.note})` : ""}`));
      console.log(`\nApprove with: node ${TOOL_PATH} approve ${t.id} "your approval note"`);
      return;
    }

    case "packet": {
      const tasks = resolvePacketTasks(state, pos.slice(1), flags);
      if (!tasks.length) fail("No tasks matched. Usage: packet <E04|E04.01 E04.02 ...> [--review] [--write]");
      const label = flag("label") || (flags.includes("--review") ? "everything awaiting founder review" : pos.slice(1).join(", "));
      const md = renderPacket(state, tasks, label, now);
      if (has("write")) {
        const dir = join(ROOT, "evidence", "packets");
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        const name = `${now.slice(0, 10)}--${(flag("label") || pos[1] || "review").replace(/[^\w.-]+/g, "-")}.md`;
        writeAtomic(join(dir, name), md);
        console.log(`Written: evidence/packets/${name}`);
      } else {
        console.log(md);
      }
      return;
    }

    case "approve-batch": {
      // FOUNDER ONLY. One note covers the batch; every task still gets its own
      // recorded sign-off, date and history entry.
      const note = pos[1];
      if (!note) fail('Usage: approve-batch "founder approval note" <ID...> [--review] [--partial]');
      const ids = pos.slice(2);
      const tasks = has("review") ? state.tasks.filter((t) => t.status === "founder_review") : resolvePacketTasks(state, ids, []);
      if (!tasks.length) fail("No tasks matched. Nothing approved.");

      const blocked = tasks.filter((t) => packetBlockers(t).length > 0);
      if (blocked.length && !has("partial")) {
        console.error(`Refusing the whole batch — ${blocked.length} of ${tasks.length} task(s) are not approvable:`);
        for (const t of blocked) console.error(`  - ${t.id}: ${packetBlockers(t).join("; ")}`);
        console.error("\nFix them, drop them from the list, or pass --partial to approve only the eligible ones.");
        console.error("Nothing was approved.");
        releaseLock();
        process.exit(1);
      }
      const approving = tasks.filter((t) => packetBlockers(t).length === 0);
      if (!approving.length) fail("Nothing in the batch is approvable. Nothing approved.");

      for (const t of approving) {
        t.status = "done";
        t.founderSignOff = { state: "approved", note, date: today };
        t.completedAt = today;
        t.updatedAt = today;
        historyPush(t, now, "founder_review", "done", note, "founder");
      }
      appendChangelog(now, `Batch approved — ${approving.length} task(s)`, `${approving.map((t) => `\`${t.id}\` ${t.title}`).join("\n")}\n\nFounder note: ${note}`);
      commit(state, now, sessionId);
      const d = derive(state);
      console.log(`APPROVED ${approving.length} task(s) on ${today}:`);
      approving.forEach((t) => console.log(`  ${t.id} — ${t.title}`));
      if (blocked.length) console.log(`\nSkipped ${blocked.length} (--partial): ${blocked.map((t) => t.id).join(", ")}`);
      console.log(`\nVerified completion now ${d.verified.value}% (${d.verified.numerator}/${d.verified.denominator} ${d.verified.unit}, ${d.verified.basis}).`);
      return;
    }

    case "approve": {
      const t = mustTask(state, pos[1] || "");
      const note = pos[2];
      if (!note) fail('Founder approval requires a note: approve <ID> "what you approved and on what basis".');
      if (t.status !== "founder_review") fail(`${t.id} is "${t.status}". Only a task in founder_review can be approved. Run \`review ${t.id}\` first.`);
      if (t.acceptanceCriteria.length === 0) fail(`${t.id} has no acceptance criteria. Refusing approval.`);
      if (t.evidence.length === 0) fail(`${t.id} has no recorded evidence. Refusing approval.`);
      t.status = "done";
      t.founderSignOff = { state: "approved", note, date: today };
      t.completedAt = today;
      t.updatedAt = today;
      historyPush(t, now, "founder_review", "done", note, "founder");
      commit(state, now, sessionId);
      console.log(`${t.id}: DONE — founder-approved ${today}.`);
      return;
    }

    case "reject": {
      const t = mustTask(state, pos[1] || "");
      const reason = pos[2];
      if (!reason) fail('Usage: reject <ID> "reason"');
      if (t.status !== "founder_review") fail(`${t.id} is "${t.status}", not awaiting founder review.`);
      t.status = "in_progress";
      t.founderSignOff = { state: "rejected", note: reason, date: today };
      t.updatedAt = today;
      historyPush(t, now, "founder_review", "in_progress", `Rejected: ${reason}`, "founder");
      commit(state, now, sessionId);
      console.log(`${t.id}: returned to in_progress. ${reason}`);
      return;
    }

    case "reopen": {
      const t = mustTask(state, pos[1] || "");
      const reason = pos[2];
      if (!reason) fail('Usage: reopen <ID> "reason" — reopening a Done task always needs a reason.');
      if (t.status !== "done") fail(`${t.id} is "${t.status}", not done.`);
      t.status = "in_progress";
      t.founderSignOff = { state: "not_requested", note: `Reopened: ${reason}`, date: null };
      t.completedAt = null;
      t.updatedAt = today;
      historyPush(t, now, "done", "in_progress", `Reopened: ${reason}`, "founder");
      appendChangelog(now, `Task reopened — ${t.id}`, `${t.title}\n\nReason: ${reason}`);
      commit(state, now, sessionId);
      console.log(`${t.id}: reopened. Logged in CHANGELOG.md.`);
      return;
    }

    case "gate": {
      const g = state.releaseGates.find((x) => x.id === pos[1]);
      if (!g) fail(`Unknown gate "${pos[1]}". Gates: ${state.releaseGates.map((x) => x.id).join(", ")}.`);

      // E01.10. Exit criteria go in through the tool, under the lock and the
      // validator, rather than by hand-editing canonical state.
      if (pos[2] === "criteria") {
        const path = pos[3];
        if (!path) fail(`Usage: gate ${g.id} criteria <path-to-json-array>`);
        const abs = isAbsolute(path) ? path : resolve(process.cwd(), path);
        if (!existsSync(abs)) fail(`No such file: ${abs}`);
        let list;
        try { list = JSON.parse(readFileSync(abs, "utf8")); } catch (e) { fail(`Could not parse ${abs}: ${e.message}`); }
        if (!Array.isArray(list) || !list.length) fail("Expected a non-empty JSON array of criterion strings.");
        if (list.some((c) => typeof c !== "string" || c.length < 40)) {
          fail("Every criterion must be a string of at least 40 characters. A launch gate cannot turn on a headline.");
        }
        if (["passed", "waived"].includes(g.status)) {
          fail(`Gate "${g.id}" is already ${g.status}. Changing the exit criteria of a decided gate is change control, not an edit.`);
        }
        const before = (g.exitCriteria || []).length;
        g.exitCriteria = list;
        appendChangelog(now, `Release gate ${g.name} exit criteria rewritten`, `${before} → ${list.length} criteria. Source: ${path}.`);
        commit(state, now, sessionId);
        console.log(`Gate ${g.id}: ${before} → ${list.length} exit criteria.`);
        return;
      }

      const target = pos[2];
      if (!GATE_STATES.includes(target)) fail(`Gate state must be one of ${GATE_STATES.join(", ")}.`);
      if (target === "passed" && !pos[3]) fail("Passing a gate requires a founder note recording the basis.");
      if (target === "waived" && !pos[3]) fail("Waiving a gate requires an explicit founder waiver note.");
      g.status = target;
      if (target === "passed") { g.passedAt = today; g.founderDecision = pos[3]; }
      if (target === "waived") { g.waiver = { note: pos[3], date: today, by: "founder" }; }
      appendChangelog(now, `Release gate ${g.name} -> ${target}`, pos[3] || "");
      commit(state, now, sessionId);
      console.log(`Gate ${g.id}: ${target}.`);
      return;
    }

    case "commercial": {
      const field = pos[1];
      const value = pos[2];
      if (!(field in state.commercial)) fail(`Unknown commercial field "${field}". Fields: ${Object.keys(state.commercial).join(", ")}.`);
      if (typeof state.commercial[field] !== "number") fail(`"${field}" is not a counter. Edit structured fields deliberately, not through this command.`);
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0) fail(`Value must be a non-negative number, got "${value}".`);
      const prev = state.commercial[field];
      state.commercial[field] = n;
      if (field === "paidAgreements") state.commercial.foundingPlacesAvailable = Math.max(0, state.commercial.target.foundingVenues - n);
      commit(state, now, sessionId);
      console.log(`commercial.${field}: ${prev} -> ${n}`);
      return;
    }

    case "film": {
      const f = state.films[pos[1]];
      if (!f) fail(`Unknown film "${pos[1]}". Films: ${Object.keys(state.films).join(", ")}.`);
      if (!(pos[2] in f.stages)) fail(`Unknown stage "${pos[2]}". Stages: ${Object.keys(f.stages).join(", ")}.`);
      if (!["not_started", "in_progress", "complete"].includes(pos[3])) fail("Stage state must be not_started|in_progress|complete.");
      f.stages[pos[2]] = pos[3];
      commit(state, now, sessionId);
      console.log(`${pos[1]}.${pos[2]} -> ${pos[3]}`);
      return;
    }

    case "baseline": {
      if (pos[1] !== "approve") fail("Usage: baseline approve \"founder note\"");
      if (!pos[2]) fail("Baseline approval requires a founder note.");
      state.baseline.state = "approved";
      state.baseline.approvedBy = state.project.founder;
      state.baseline.approvedAt = today;
      state.baseline.version = state.baseline.version.replace("-draft", "");
      appendChangelog(now, "Baseline approved", pos[2]);
      commit(state, now, sessionId);
      console.log(`Baseline ${state.baseline.version} approved by ${state.baseline.approvedBy} on ${today}.`);
      return;
    }

    case "session": {
      const sub = pos[1];
      migrateSessions(state);

      if (sub === "list") {
        if (!state.session.open.length) { console.log("No open sessions."); return; }
        for (const s of state.session.open) console.log(`${s.id.padEnd(24)} opened ${s.openedAt}  ${s.objective}`);
        return;
      }

      if (sub === "open") {
        const objective = pos[2];
        if (!objective) fail('Usage: session open "objective" [--id=<claude-session-id>]');
        const id = flag("id") || `s-${today}`;
        if (state.session.open.some((s) => s.id === id)) {
          fail(`Session "${id}" is already open (since ${state.session.open.find((s) => s.id === id).openedAt}). Use a distinct --id.`);
        }
        state.session.open.push({ id, objective, openedAt: now, tasksTouched: [], statusChanges: [] });
        commit(state, now, id, false);
        const others = state.session.open.filter((s) => s.id !== id);
        console.log(`Session ${id} open: ${objective}`);
        if (others.length) console.log(`${WARN} ${others.length} other session(s) also open: ${others.map((s) => s.id).join(", ")}. Close yours with --id=${id}.`);
        return;
      }

      if (sub === "close") {
        // Parallel work packages mean several sessions are open at once. Close
        // the one you own, never "the" one — closing someone else's writes your
        // summary into their record.
        const wanted = flag("id");
        if (!wanted && state.session.open.length > 1) {
          fail(
            `${state.session.open.length} sessions are open: ${state.session.open.map((s) => s.id).join(", ")}.\n` +
            "  Pass --id=<your-session-id> so you close your own, not another session's."
          );
        }
        const s = wanted ? state.session.open.find((x) => x.id === wanted) : state.session.open[0];
        if (!s) {
          fail(wanted
            ? `No open session with id "${wanted}". Open sessions: ${state.session.open.map((x) => x.id).join(", ") || "none"}.`
            : "No open session. Open one with `session open \"objective\"`.");
        }
        const summary = pos[2] || "";
        const file = `${today}--${s.id}.md`;
        const path = join(ROOT, "sessions", file);
        if (!existsSync(join(ROOT, "sessions"))) mkdirSync(join(ROOT, "sessions"), { recursive: true });
        if (existsSync(path)) fail(`Session record ${file} already exists. Session records are append-only; use a distinct --id.`);
        const touched = [...new Set(state.tasks.filter((t) => t.history.some((h) => h.at >= s.openedAt)).map((t) => t.id))];
        const d = derive(state);
        writeAtomic(path, sessionRecord(state, s, { summary, touched, now, today, d }));
        state.session.lastClosed = { id: s.id, closedAt: now, record: `sessions/${file}`, objective: s.objective };
        state.session.open = state.session.open.filter((x) => x.id !== s.id);
        commit(state, now, s.id);
        // HANDOFF.md is the single "what next" file. While other sessions are
        // still running it would be a lie the moment they write, so it is only
        // rewritten by the last session to close.
        const stillOpen = state.session.open;
        if (stillOpen.length === 0) {
          writeAtomic(join(ROOT, "HANDOFF.md"), handoff(state, { session: s, summary, touched, now, today, d }));
        }
        console.log(`Session ${s.id} closed. Record: sessions/${file}. STATUS.md and BACKLOG.md regenerated.`);
        if (stillOpen.length) {
          console.log(`${WARN} HANDOFF.md not rewritten — ${stillOpen.length} session(s) still open: ${stillOpen.map((x) => x.id).join(", ")}. The last one to close writes it.`);
        } else {
          console.log("HANDOFF.md regenerated — you were the last session open.");
        }
        const nx = unblockedNext(state)[0];
        console.log(`Next action for the following session: ${state.baseline.state !== "approved" ? "founder approval of the baseline" : nx ? `${nx.id} ${nx.title}` : "none"}`);
        return;
      }
      fail("Usage: session open \"objective\" | session close [\"summary\"] [--id=<id>] | session list");
      return;
    }

    default:
      fail(`Unknown command "${cmd}". Run \`help\`.`);
  }
}

function appendChangelog(now, headline, body) {
  const path = join(ROOT, "CHANGELOG.md");
  const entry = `\n## ${now.slice(0, 10)} · ${headline}\n\n${body || "(no note)"}\n`;
  const existing = existsSync(path) ? readFileSync(path, "utf8") : "# CHANGELOG — Venue Edition and Films (VEF-2026)\n";
  writeAtomic(path, existing.trimEnd() + "\n" + entry);
}

function sessionRecord(state, s, ctx) {
  const { summary, touched, now, today, d } = ctx;
  return [
    `# Session ${s.id} — ${today}`,
    "",
    "Append-only record. Do not rewrite a closed session.",
    "",
    `**Objective:** ${s.objective}`,
    `**Opened:** ${s.openedAt}`,
    `**Closed:** ${now}`,
    "",
    "## Summary",
    "",
    summary || "(none recorded)",
    "",
    "## Tasks touched",
    "",
    touched.length ? touched.map((id) => {
      const t = state.tasks.find((x) => x.id === id);
      return `- \`${id}\` ${t.title} — now **${t.status}**`;
    }).join("\n") : "- None.",
    "",
    "## Status changes this session",
    "",
    (() => {
      const rows = [];
      for (const t of state.tasks) {
        for (const h of t.history) {
          if (h.at >= s.openedAt) rows.push(`- \`${t.id}\` ${h.from || "—"} → ${h.to} (${h.by})${h.note ? ` — ${h.note}` : ""}`);
        }
      }
      return rows.length ? rows.join("\n") : "- None.";
    })(),
    "",
    "## Evidence added",
    "",
    (() => {
      const rows = [];
      for (const t of state.tasks) for (const e of t.evidence) if (e.at >= s.openedAt) rows.push(`- \`${t.id}\` ${e.ref}${e.note ? ` — ${e.note}` : ""}`);
      return rows.length ? rows.join("\n") : "- None.";
    })(),
    "",
    "## Blockers",
    "",
    d.blocked.length ? d.blocked.map((t) => `- \`${t.id}\` ${(t.blockedBy || []).map((b) => b.reason).join("; ")}`).join("\n") : "- None.",
    "",
    "## Awaiting founder review",
    "",
    d.founderReview.length ? d.founderReview.map((t) => `- \`${t.id}\` ${t.title}`).join("\n") : "- None.",
    "",
    "## Next action",
    "",
    (() => {
      if (state.baseline.state !== "approved") return "Founder: approve or amend the baseline in BASELINE_REVIEW.md.";
      const n = unblockedNext(state)[0];
      return n ? `\`${n.id}\` ${n.title}` : "No unblocked task available — clear a blocker or a founder review.";
    })(),
    "",
  ].join("\n");
}

function handoff(state, ctx) {
  const { session, summary, touched, now, today, d } = ctx;
  const days = daysBetween(today, state.project.releaseDate);
  const next = state.baseline.state !== "approved"
    ? "Founder: approve or amend the baseline in `BASELINE_REVIEW.md`. Until that happens, only E01 governance work should proceed."
    : (() => { const n = unblockedNext(state)[0]; return n ? `Start \`${n.id}\` — ${n.title} (\`node ${TOOL_PATH} task ${n.id}\`)` : "Clear a blocker or a founder review; nothing is startable."; })();

  return [
    "# HANDOFF — Venue Edition and Films (VEF-2026)",
    "",
    "<!-- GENERATED FILE — DO NOT EDIT -->",
    "> **Written by `project-control.mjs session close`. Replaced each session; the append-only history lives in `sessions/`.**",
    "",
    `**Latest completed session:** ${session.id} (closed ${now}) → \`sessions/${today}--${session.id}.md\``,
    `**Objective was:** ${session.objective}`,
    "",
    `**Release:** ${state.project.releaseDate} · ${days} days remaining · baseline **${state.baseline.state}** · health **${state.project.health.rag.toUpperCase()}**`,
    `**Verified completion:** ${d.verified.value}% (${d.verified.numerator}/${d.verified.denominator} ${d.verified.unit}, ${d.verified.basis})`,
    "",
    "## Current focus task",
    "",
    state.focus.taskId ? `\`${state.focus.taskId}\` — ${state.tasks.find((t) => t.id === state.focus.taskId)?.title}` : `None. ${state.focus.note || ""}`,
    "",
    "## What changed",
    "",
    summary || "(no summary recorded)",
    "",
    touched.length ? touched.map((id) => `- \`${id}\` → ${state.tasks.find((t) => t.id === id).status}`).join("\n") : "- No task state changed.",
    "",
    "## Verification performed",
    "",
    (() => {
      const rows = [];
      for (const t of state.tasks) for (const e of t.evidence) if (e.at >= session.openedAt) rows.push(`- \`${t.id}\` ${e.ref}`);
      return rows.length ? rows.join("\n") : "- None this session.";
    })(),
    "",
    "## Unresolved",
    "",
    `- Tasks in progress: ${d.inProgress.length ? d.inProgress.map((t) => t.id).join(", ") : "none"}`,
    `- Internal review: ${d.internalReview.length ? d.internalReview.map((t) => t.id).join(", ") : "none"}`,
    `- Unestimated active tasks: ${d.totals.unestimated}`,
    "",
    "## Blockers",
    "",
    d.blocked.length ? d.blocked.map((t) => `- \`${t.id}\` ${(t.blockedBy || []).map((b) => b.reason).join("; ")}`).join("\n") : "- None.",
    "",
    "## Founder review required",
    "",
    // null is dropped below; "" is a real blank line and is kept.
    state.baseline.state !== "approved" ? "- **Project baseline** — `BASELINE_REVIEW.md`" : null,
    d.founderReview.length ? d.founderReview.map((t) => `- \`${t.id}\` ${t.title}`).join("\n") : "- No task awaiting approval.",
    "",
    "## Exact next action",
    "",
    next,
    "",
    "## Read these first next session",
    "",
    "1. `HANDOFF.md` (this file)",
    "2. `STATUS.md`",
    "3. `BASELINE_REVIEW.md` (until the baseline is approved)",
    "4. `PROJECT.md` for the charter, `DECISIONS.md` for what is settled",
    "5. `WORKFLOWS.md` for the task, sync, approval and change procedures",
    "",
  ].filter((l) => l !== null).join("\n") + "\n";
}

// Only run the CLI when invoked directly, so the test file can import this module.
const entry = process.argv[1] ? resolve(process.argv[1]) : "";
if (entry && entry === resolve(fileURLToPath(import.meta.url))) {
  main(process.argv.slice(2));
}
