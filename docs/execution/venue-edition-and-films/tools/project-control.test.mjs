// project-control.test.mjs — focused tests on the rules most likely to cause
// real damage: a task reaching Done without founder approval, a corrupted
// dependency graph, silent loss of imported scope, and non-deterministic reports.
//
//   node --test tools/project-control.test.mjs
//
// Read-only against the live PROJECT_STATE.json: every mutation happens on a
// deep clone.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import {
  ROOT, loadState, validate, derive, canonicalize, findCycles, daysBetween, addDays,
  renderBacklog, renderStatus, renderWeekly, TRANSITIONS, STATUSES, STATUS_CREDIT,
  EFFORT_SCALE, DECISION_CLASSES, ACTIVE_STATUSES, packetBlockers, renderPacket,
  migrateSessions, migrateSchedule, FREEZES,
} from "./project-control.mjs";

const base = loadState();
const clone = () => JSON.parse(JSON.stringify(base));
const task = (s, id) => s.tasks.find((t) => t.id === id);
const errorsOf = (s) => validate(s).errors;
const hasError = (s, fragment) => errorsOf(s).some((e) => e.includes(fragment));

// --- Import fidelity ------------------------------------------------------

test("the imported backlog is intact", () => {
  assert.equal(base.epics.length, 15, "15 epics were supplied");
  assert.equal(base.tasks.length, 211, "211 tasks were supplied");
  assert.equal(new Set(base.tasks.map((t) => t.id)).size, 211, "task ids are unique");
  for (const t of base.tasks) {
    assert.ok(t.title && t.title.trim().length > 0, `${t.id} has a title`);
    assert.ok(t.id.startsWith(t.epic), `${t.id} sits under its epic`);
    assert.ok(t.history.length >= 1, `${t.id} carries transition history`);
  }
});

test("every task title matches backlog.source.md character for character", () => {
  const src = readFileSync(join(ROOT, "backlog.source.md"), "utf8");
  const fromSource = new Map();
  for (const line of src.split(/\r?\n/)) {
    const m = /^\* (E\d{2}\.\d{2}) (.+?)\s*$/.exec(line);
    if (m) fromSource.set(m[1], m[2]);
  }
  assert.equal(fromSource.size, 211);
  for (const t of base.tasks) {
    assert.equal(t.title, fromSource.get(t.id), `${t.id} title is unmodified`);
  }
});

test("imported flags match the supplied statements, less documented changes", () => {
  const d = derive(base);
  // 120 at import. E03.12 was removed from the path by CR-001 / D-023: the
  // external legal and accounting review is unschedulable at zero budget, so an
  // unreachable task was left gating the path. Any OTHER movement in this number
  // is silent drift and fails here.
  assert.equal(d.totals.criticalPath, 119, "critical path: 120 at import, less E03.12 per D-023");
  assert.equal(task(base, "E03.12").criticalPath, false, "E03.12 left the path by decision, not by accident");
  assert.equal(task(base, "E03.12").status, "deferred", "and is deferred, not cancelled — the title still says a solicitor should look at this");
  assert.equal(d.totals.releaseBlocking, 54, "E05-E08 are the four Launch-blocking epics");
  // 20 at import: the four critical blocking rules and nothing else. E01.07 built
  // the rest of the graph on 2026-08-03 — 134 edges across 52 tasks, every one
  // carrying a written basis in `dependencyBasis`, explained in DEPENDENCY_MAP.md.
  // Any movement from 134 that is not accompanied by an update here is silent
  // drift and fails.
  assert.equal(d.totals.dependencyEdges, 134, "20 imported, plus E01.07's mapped graph");
  const withBasis = base.tasks.filter((t) => (t.dependencies || []).length > 0);
  for (const t of withBasis) {
    assert.ok(t.dependencyBasis, `${t.id} has dependencies but no recorded basis. An unsourced edge is a guess that stops work.`);
  }
});

test("every task is classified by how it gets decided", () => {
  const counts = { founder_only: 0, founder_choice: 0, execution: 0 };
  for (const t of base.tasks) {
    assert.ok(DECISION_CLASSES.includes(t.decisionClass), `${t.id} has a decisionClass`);
    counts[t.decisionClass]++;
  }
  assert.equal(counts.founder_only, 39);
  assert.equal(counts.founder_choice, 17);
  assert.equal(counts.execution, 155);
  assert.equal(counts.founder_only + counts.founder_choice + counts.execution, 211);
});

test("a founder-only task carries either its open question or the decision that answered it", () => {
  for (const t of base.tasks.filter((t) => t.decisionClass === "founder_only")) {
    assert.ok(
      (t.decisionQuestion && t.decisionQuestion.trim().length > 0) || t.answeredBy,
      `${t.id} states its question, or names the decision that closed it`,
    );
  }
  const s = clone();
  const t = task(s, "E02.01");
  t.decisionQuestion = null;
  t.answeredBy = null;
  assert.ok(hasError(s, "must carry either the question"), "a question that vanished with no answer is an error");
  t.answeredBy = "D-009";
  assert.deepEqual(errorsOf(s), [], "an answered question is not an open one");
});

test("an answered question leaves the founder queue but not the record", () => {
  const answered = base.tasks.filter((t) => t.answeredBy);
  assert.ok(answered.length > 0, "at least one question has been closed by a decision");
  for (const t of answered) {
    assert.equal(t.decisionClass, "founder_only", `${t.id} keeps founder_only: that this was Ethan's call is history`);
    assert.ok(t.notes.some((n) => n.note.includes(`Question closed by ${t.answeredBy}`)), `${t.id} records the question it used to ask`);
  }
  const md = renderWeekly(migrateSchedule(clone()), "2026-08-03T00:00:00Z");
  for (const t of answered) {
    assert.ok(!md.includes(`\`${t.id}\` ${t.decisionQuestion}`), `${t.id} is not reported as an open question`);
  }
});

test("an unknown decisionClass is rejected", () => {
  const s = clone();
  task(s, "E02.01").decisionClass = "someone_elses_problem";
  assert.ok(hasError(s, 'unknown decisionClass'));
});

// --- The Done contract ----------------------------------------------------

test("done is unreachable without explicit founder approval", () => {
  const s = clone();
  const t = task(s, "E01.01");
  // Every field set explicitly. Reading any of them off live state made this
  // pass only while nobody had finished E01.01, which is backwards.
  Object.assign(t, {
    status: "done", completedAt: "2026-08-02",
    acceptanceCriteria: ["something"], evidence: [{ at: "2026-08-02T00:00:00Z", ref: "x" }],
    founderSignOff: { state: "requested", note: null, date: null },
  });
  assert.ok(hasError(s, "Done requires explicit founder approval"));
});

test("done is rejected without evidence", () => {
  const s = clone();
  const t = task(s, "E01.01");
  Object.assign(t, {
    status: "done", completedAt: "2026-08-02",
    acceptanceCriteria: ["something"], evidence: [],
    founderSignOff: { state: "approved", note: "ok", date: "2026-08-02" },
  });
  assert.ok(hasError(s, "no recorded evidence"));
});

test("done is rejected without acceptance criteria", () => {
  const s = clone();
  const t = task(s, "E01.01");
  Object.assign(t, {
    status: "done", completedAt: "2026-08-02",
    acceptanceCriteria: [], evidence: [{ at: "2026-08-02T00:00:00Z", ref: "x" }],
    founderSignOff: { state: "approved", note: "ok", date: "2026-08-02" },
  });
  assert.ok(hasError(s, "no acceptance criteria"));
});

test("founder approval cannot be parked on a task that is not done", () => {
  const s = clone();
  const t = task(s, "E01.01");
  Object.assign(t, {
    status: "in_progress", completedAt: null,
    founderSignOff: { state: "approved", note: "ok", date: "2026-08-02" },
  });
  assert.ok(hasError(s, "Approval and Done move together"));
});

test("no transition path reaches done except from founder_review", () => {
  for (const [from, targets] of Object.entries(TRANSITIONS)) {
    if (from === "founder_review") continue;
    assert.ok(!targets.includes("done"), `${from} must not reach done directly`);
  }
  assert.ok(TRANSITIONS.founder_review.includes("done"));
});

// Invariant, not a snapshot: this must hold for the life of the project, not
// just at import. It is the single most important rule in the system.
test("nothing in the live state is Done without approval, evidence and criteria", () => {
  for (const t of base.tasks.filter((x) => x.status === "done")) {
    assert.equal(t.founderSignOff.state, "approved", `${t.id}: done requires founder approval`);
    assert.ok(t.evidence.length > 0, `${t.id}: done requires evidence`);
    assert.ok(t.acceptanceCriteria.length > 0, `${t.id}: done requires acceptance criteria`);
    assert.ok(t.completedAt, `${t.id}: done requires a completion date`);
  }
  for (const t of base.tasks.filter((x) => x.founderSignOff.state === "approved")) {
    assert.equal(t.status, "done", `${t.id}: approval and Done move together`);
  }
});

test("an approved baseline names its approver and its date", () => {
  if (base.baseline.state !== "approved") return;
  assert.ok(base.baseline.approvedBy, "an approved baseline records who approved it");
  assert.match(base.baseline.approvedAt || "", /^\d{4}-\d{2}-\d{2}$/, "and when");
});

// --- Graph integrity ------------------------------------------------------

test("duplicate task ids are rejected", () => {
  const s = clone();
  s.tasks.push(JSON.parse(JSON.stringify(task(s, "E01.01"))));
  assert.ok(hasError(s, "Duplicate task id: E01.01"));
});

test("a dependency on a task that does not exist is rejected", () => {
  const s = clone();
  task(s, "E01.02").dependencies = ["E99.99"];
  assert.ok(hasError(s, 'dependency "E99.99" does not exist'));
});

test("dependency cycles are detected", () => {
  const s = clone();
  task(s, "E01.02").dependencies = ["E01.03"];
  task(s, "E01.03").dependencies = ["E01.04"];
  task(s, "E01.04").dependencies = ["E01.02"];
  assert.ok(hasError(s, "Dependency cycle"));
  assert.equal(findCycles(s.tasks).length >= 1, true);
});

test("self-dependency is rejected", () => {
  const s = clone();
  task(s, "E01.02").dependencies = ["E01.02"];
  assert.ok(hasError(s, "depends on itself"));
});

test("the real backlog has no cycles", () => {
  assert.deepEqual(findCycles(base.tasks), []);
});

test("malformed task ids are rejected", () => {
  const s = clone();
  task(s, "E01.02").id = "E1.2";
  assert.ok(hasError(s, "Malformed task id"));
});

test("a task cannot be filed under an epic it does not belong to", () => {
  const s = clone();
  task(s, "E01.02").epic = "E07";
  assert.ok(hasError(s, "does not sit under its epic"));
});

// --- Working rules --------------------------------------------------------

test("blocked without a recorded blocker is rejected", () => {
  const s = clone();
  task(s, "E01.02").status = "blocked";
  assert.ok(hasError(s, "blockedBy is empty"));
});

test("the WIP limit is enforced", () => {
  const s = clone();
  // Clear ambient exceptions: this test is about the rule, not about whatever
  // exception happens to be live in the project right now.
  s.wip.exceptions = [];
  for (const id of ["E01.01", "E01.02", "E01.03", "E01.04"]) task(s, id).status = "in_progress";
  assert.ok(hasError(s, "WIP limit exceeded"));
  s.wip.exceptions.push({ active: true, reason: "founder-approved batch", at: "2026-08-02T00:00:00Z" });
  assert.ok(!hasError(s, "WIP limit exceeded"), "a recorded exception downgrades it to a warning");
});

test("the cross-session lock is released and leaves no file behind", () => {
  assert.ok(!existsSync(join(ROOT, ".project-control.lock")), "no stale lock in the project directory");
});

test("effort points off the approved scale are rejected", () => {
  const s = clone();
  Object.assign(task(s, "E01.01"), { effortPoints: 4, estimateStatus: "provisional" });
  assert.ok(hasError(s, "not on the approved scale"));
  task(s, "E01.01").effortPoints = EFFORT_SCALE[3];
  assert.ok(!hasError(s, "not on the approved scale"));
});

test("an estimate status without points is rejected", () => {
  const s = clone();
  task(s, "E01.01").estimateStatus = "approved";
  assert.ok(hasError(s, "effortPoints is null"));
});

test("an invalid status is rejected", () => {
  const s = clone();
  task(s, "E01.01").status = "nearly_done";
  assert.ok(hasError(s, 'invalid status "nearly_done"'));
});

test("a waived release gate requires a recorded founder waiver", () => {
  const s = clone();
  s.releaseGates[0].status = "waived";
  assert.ok(hasError(s, "waived with no recorded founder waiver"));
  s.releaseGates[0].waiver = { note: "founder accepts the risk", date: "2026-08-30", by: "founder" };
  assert.ok(!hasError(s, "waived with no recorded founder waiver"));
});

test("a passed gate requires a pass date", () => {
  const s = clone();
  s.releaseGates[0].status = "passed";
  assert.ok(hasError(s, "passed with no passedAt"));
});

test("an approved baseline requires an approver", () => {
  const s = clone();
  s.baseline.state = "approved";
  s.baseline.approvedBy = null;
  assert.ok(hasError(s, "Only the founder can approve a baseline"));
});

test("contact data cannot be smuggled into the commercial tracker", () => {
  const s = clone();
  s.commercial.note = "chase gm@someveune.ie";
  assert.ok(hasError(s, "looks like an email address"));
});

// --- Reporting ------------------------------------------------------------

test("verified completion stays count-based until effort estimates are approved", () => {
  const d = derive(base);
  const activeCount = base.tasks.filter((t) => ACTIVE_STATUSES.includes(t.status)).length;
  if (!base.baseline.estimatesApproved) {
    assert.equal(d.verified.basis, "provisional_task_count");
    assert.equal(d.verified.provisional, true);
    assert.equal(d.verified.denominator, activeCount, "the denominator is the active task count, never the total");
  }
  assert.equal(d.verified.numerator, base.tasks.filter((t) => t.status === "done").length);
});

test("the delivery estimate is suppressed while the baseline is a draft", () => {
  const s = clone();
  s.baseline.state = "draft";
  assert.equal(derive(s).deliveryEstimate.available, false, "no status-credit estimate against a draft baseline");
  s.baseline.state = "approved";
  s.baseline.approvedBy = "Ethan McNamara";
  assert.equal(derive(s).deliveryEstimate.available, true, "available once the baseline is approved");
});

test("verified completion switches to approved effort points once the baseline says so", () => {
  const s = clone();
  s.baseline.estimatesApproved = true;
  // Reduce to a two-task world so the arithmetic is about the formula, not
  // about however much of the real backlog happens to be approved today.
  s.tasks = s.tasks.filter((t) => ["E01.01", "E01.02"].includes(t.id));
  s.epics = s.epics.filter((e) => e.id === "E01");
  s.epics[0].taskCount = 2;
  s.focus = { taskId: null, setAt: null, note: "n/a" };
  for (const id of ["E01.01", "E01.02"]) Object.assign(task(s, id), {
    effortPoints: 3, estimateStatus: "approved", dependencies: [], dependencyBasis: null,
    status: "founder_review", completedAt: null,
    founderSignOff: { state: "requested", note: null, date: null },
  });
  Object.assign(task(s, "E01.01"), {
    status: "done", completedAt: "2026-08-02",
    acceptanceCriteria: ["done properly"], evidence: [{ at: "2026-08-02T00:00:00Z", ref: "evidence/x.md" }],
    founderSignOff: { state: "approved", note: "approved", date: "2026-08-02" },
  });
  assert.deepEqual(errorsOf(s), []);
  const d = derive(s);
  assert.equal(d.verified.basis, "approved_effort_points");
  assert.equal(d.verified.numerator, 3);
  assert.equal(d.verified.denominator, 6);
  assert.equal(d.verified.value, 50);
});

test("the status-credit model never credits backlog, ready or blocked work", () => {
  for (const s of ["backlog", "ready", "blocked"]) assert.equal(STATUS_CREDIT[s], 0);
  assert.equal(STATUS_CREDIT.done, 1);
  assert.ok(STATUS_CREDIT.founder_review < 1, "founder review is not completion");
});

test("deferred and cancelled work leaves the denominator but not the record", () => {
  const before = derive(base).totals.active;
  const s = clone();
  task(s, "E05.01").status = "deferred";
  task(s, "E05.02").status = "cancelled";
  const d = derive(s);
  assert.equal(d.totals.tasks, 211, "nothing is deleted");
  assert.equal(d.totals.active, before - 2, "both leave the active denominator");
});

// --- Parallel sessions -----------------------------------------------------

test("legacy single-session state migrates into the open list without losing it", () => {
  const s = clone();
  delete s.session.open;
  s.session.active = { id: "legacy-1", objective: "old shape", openedAt: "2026-08-02T00:00:00Z" };
  migrateSessions(s);
  assert.equal(s.session.open.length, 1, "the in-flight session survives the migration");
  assert.equal(s.session.open[0].id, "legacy-1");
  assert.ok(!("active" in s.session), "the single slot is gone");
});

test("migrating state with no session at all yields an empty list", () => {
  const s = clone();
  delete s.session.open;
  delete s.session.active;
  migrateSessions(s);
  assert.deepEqual(s.session.open, []);
});

test("several sessions can be open at once", () => {
  const s = clone();
  migrateSessions(s);
  s.session.open = [
    { id: "wp01", objective: "a", openedAt: "2026-08-03T00:00:00Z" },
    { id: "wp02", objective: "b", openedAt: "2026-08-03T00:01:00Z" },
    { id: "wp03", objective: "c", openedAt: "2026-08-03T00:02:00Z" },
  ];
  assert.deepEqual(validate(s).errors, [], "parallel sessions are legal state");
  // Closing one must leave the others untouched.
  s.session.open = s.session.open.filter((x) => x.id !== "wp02");
  assert.deepEqual(s.session.open.map((x) => x.id), ["wp01", "wp03"]);
});

// --- The founder-review packet (D-024) -------------------------------------

test("a task is only approvable with criteria, evidence and founder_review status", () => {
  const s = clone();
  const t = task(s, "E01.01");
  // Blanked deliberately. Reading these three fields off live state made the
  // test pass only while nobody had worked on E01.01, which is backwards.
  Object.assign(t, { status: "in_progress", acceptanceCriteria: [], evidence: [] });
  assert.deepEqual(packetBlockers(t).sort(), ["no acceptance criteria", "no evidence", `status is "${t.status}", not founder_review`].sort());
  t.acceptanceCriteria = ["done properly"];
  t.evidence = [{ at: "2026-08-03T00:00:00Z", ref: "x" }];
  t.status = "founder_review";
  assert.deepEqual(packetBlockers(t), [], "all three satisfied");
  t.evidence = [];
  assert.deepEqual(packetBlockers(t), ["no evidence"], "evidence alone is enough to block");
});

test("the packet separates approvable from not-approvable and never claims Done", () => {
  const s = clone();
  const good = task(s, "E01.02");
  Object.assign(good, {
    status: "founder_review",
    acceptanceCriteria: ["the objective is stated as 25 signed and paid venues"],
    evidence: [{ at: "2026-08-03T00:00:00Z", ref: "evidence/brief.md", note: "the brief" }],
    reviewAt: "2026-08-03",
  });
  const bad = task(s, "E01.01");
  Object.assign(bad, { status: "in_progress", acceptanceCriteria: [], evidence: [] });
  const md = renderPacket(s, [good, bad], "E01", "2026-08-03T00:00:00Z");
  assert.match(md, /1 ready to approve · 1 not ready/);
  assert.match(md, /Nothing here is Done yet/);
  assert.match(md, /approve-batch "your approval note" E01\.02/, "gives the exact command for the approvable one only");
  assert.ok(md.includes("E01.01"), "the blocked task is still listed");
  assert.ok(md.includes("no acceptance criteria"), "and says why it is blocked");
});

test("the packet is deterministic for the same state and clock", () => {
  const at = "2026-08-03T00:00:00Z";
  const ts = [task(base, "E01.01"), task(base, "E01.02")];
  assert.equal(renderPacket(base, ts, "E01", at), renderPacket(clone(), ts, "E01", at));
});

// --- Determinism ----------------------------------------------------------

test("renders are byte-identical for the same state and clock", () => {
  const at = "2026-08-02T12:00:00Z";
  assert.equal(renderBacklog(base), renderBacklog(clone()));
  assert.equal(renderStatus(base, at), renderStatus(clone(), at));
});

test("canonicalize gives a stable task order regardless of input order", () => {
  const s = clone();
  s.tasks.reverse();
  assert.deepEqual(
    canonicalize(s).tasks.map((t) => t.id),
    canonicalize(base).tasks.map((t) => t.id)
  );
});

test("generated files carry the do-not-edit warning", () => {
  assert.ok(renderBacklog(base).includes("Do not edit status data directly in this file"));
  assert.ok(renderStatus(base, "2026-08-02T12:00:00Z").includes("GENERATED FILE"));
  for (const f of ["BACKLOG.md", "STATUS.md"]) {
    assert.ok(readFileSync(join(ROOT, f), "utf8").includes("GENERATED FILE"), `${f} on disk is marked generated`);
  }
});

test("no generated report leaks a venue name or contact detail", () => {
  const status = renderStatus(base, "2026-08-02T12:00:00Z");
  assert.ok(!/@[\w.-]+\.\w{2,}/.test(status), "no email addresses in STATUS.md");
  assert.ok(!/\+353|\b08[3-9]\s?\d/.test(status), "no phone numbers in STATUS.md");
});

// --- Small units ----------------------------------------------------------

test("daysBetween counts calendar days", () => {
  assert.equal(daysBetween("2026-08-02", "2026-09-01"), 30);
  assert.equal(daysBetween("2026-09-01", "2026-08-02"), -30);
  assert.equal(daysBetween("2026-08-02T09:00:00Z", "2026-08-03"), 1);
});

test("every declared status has a transition rule", () => {
  for (const s of STATUSES) assert.ok(Array.isArray(TRANSITIONS[s]), `${s} has a transition rule`);
});

test("the live state validates clean", () => {
  assert.deepEqual(validate(base).errors, []);
});

// --- The board fields E01.05 names, and the schedule E01.11 sets ------------

test("the project board carries all eight fields E01.05 names", () => {
  const md = renderBacklog(migrateSchedule(clone()));
  const header = md.split("\n").find((l) => l.startsWith("| ID | Title |"));
  assert.ok(header, "the board renders a task table");
  for (const col of ["ID", "Status", "Pri", "Executor", "Depends on", "Target", "Evidence"]) {
    assert.ok(header.includes(`| ${col} |`), `board column "${col}" is present`);
  }
  // Epic is the section heading rather than a column, which is still the field.
  assert.match(md, /^## E01 — /m, "tasks are grouped under their epic");
});

test("a target date without a basis is rejected", () => {
  const s = migrateSchedule(clone());
  const t = task(s, "E01.01");
  t.targetDate = "2026-08-15";
  t.targetBasis = null;
  assert.ok(hasError(s, "targetDate is set but targetBasis is empty"), "a date with no reason is a guess wearing a date");
  t.targetBasis = "offer freeze, D-008";
  assert.deepEqual(errorsOf(s), []);
});

test("a malformed target date is rejected", () => {
  const s = migrateSchedule(clone());
  const t = task(s, "E01.02");
  t.targetDate = "15 August";
  t.targetBasis = "because";
  assert.ok(hasError(s, "targetDate must be YYYY-MM-DD"));
});

test("the six ratified freeze dates are present and correct", () => {
  const s = migrateSchedule(clone());
  const got = Object.fromEntries(s.freezes.map((f) => [f.id, f.date]));
  assert.deepEqual(got, {
    offer: "2026-08-15",
    ui: "2026-08-20",
    copy: "2026-08-21",
    capture: "2026-08-22",
    film_lock: "2026-08-28",
    release_candidate: "2026-08-30",
  }, "exactly the dates ratified in D-008");
  for (const f of s.freezes) {
    assert.equal(f.source, "D-008", `${f.id} names the decision that set it`);
    assert.ok(f.meaning && f.meaning.length > 20, `${f.id} says what stops changing`);
  }
});

test("freeze dates and milestones reach the generated status report", () => {
  const md = renderStatus(migrateSchedule(clone()), "2026-08-03T00:00:00Z");
  assert.match(md, /## Freeze dates/, "freeze dates are reported, not buried in a task note");
  assert.match(md, /## Milestones/, "milestones are reported");
  assert.match(md, /2026-08-15/, "the offer freeze is visible");
  assert.match(md, /outcome-driven, undated/, "M6 is not given a fabricated date");
});

// --- The weekly operating review E01.12 names ------------------------------

test("the weekly review is not the status report wearing a different name", () => {
  const s = migrateSchedule(clone());
  const at = "2026-08-03T00:00:00Z";
  assert.notEqual(renderWeekly(s, at), renderStatus(s, at), "weekly and overall are different documents");
});

test("the weekly review carries all six sections E01.12 names", () => {
  const md = renderWeekly(migrateSchedule(clone()), "2026-08-03T00:00:00Z");
  for (const [n, heading] of [[1, "Blockers"], [2, "Decisions"], [3, "Evidence"], [4, "Quality"], [5, "Pipeline"], [6, "The next seven days"]]) {
    assert.ok(md.includes(`## ${n}. ${heading}`), `section ${n} "${heading}" is present`);
  }
});

test("the weekly review's horizon is seven days and it never blends activity with outcome", () => {
  const s = migrateSchedule(clone());
  const md = renderWeekly(s, "2026-08-03T00:00:00Z");
  assert.match(md, /Window: 2026-08-03 to 2026-08-10/, "a real seven-day window");
  assert.match(md, /\| \*\*Paid agreements\*\* \|/, "outcome rows are marked as the outcome");
  assert.match(md, /never summed/, "the activity/outcome separation is stated where it could be lost");
});

test("the weekly review is deterministic for the same state and clock", () => {
  const at = "2026-08-03T00:00:00Z";
  assert.equal(renderWeekly(migrateSchedule(clone()), at), renderWeekly(migrateSchedule(clone()), at));
});

test("addDays counts calendar days in both directions", () => {
  assert.equal(addDays("2026-08-03", 7), "2026-08-10");
  assert.equal(addDays("2026-08-03", -7), "2026-07-27");
  assert.equal(addDays("2026-08-31", 1), "2026-09-01");
});

// --- Every release gate is a gate, not a headline (E01.10) ------------------

test("every release gate carries exit criteria that could actually fail it", () => {
  for (const g of base.releaseGates) {
    assert.ok((g.exitCriteria || []).length >= 8, `gate "${g.id}" has ${(g.exitCriteria || []).length} exit criteria; a launch gate needs at least 8`);
    assert.ok(g.owner, `gate "${g.id}" names an owner`);
    for (const c of g.exitCriteria) {
      assert.ok(c.length > 40, `gate "${g.id}" criterion is too short to be checkable: "${c}"`);
    }
  }
});

// E01 (governance) and E15 (release and onboarding) are supporting epics of no
// gate. That is a real hole, not an oversight of this test: the six gates
// certify that the product works and the sale can be made, and nothing
// certifies that what was sold can be delivered. Changing a gate's supporting
// epics is change control under PROJECT.md section 20, so it is raised as
// CR-002 rather than fixed here. This test exists to stop the hole growing and
// to fail the moment CR-002 is actioned, forcing the list to be emptied.
const KNOWN_UNGATED = ["E01", "E15"];

test("no epic falls outside the gate system except the two declared in CR-002", () => {
  const covered = new Set(base.releaseGates.flatMap((g) => g.supportingEpics));
  const uncovered = base.epics.map((e) => e.id).filter((id) => !covered.has(id));
  assert.deepEqual(uncovered, KNOWN_UNGATED,
    `Gate coverage changed. Uncovered epics are now [${uncovered.join(", ")}], declared is [${KNOWN_UNGATED.join(", ")}]. ` +
    "If CR-002 was approved, empty KNOWN_UNGATED. If an epic slipped out of a gate, put it back.");
});
