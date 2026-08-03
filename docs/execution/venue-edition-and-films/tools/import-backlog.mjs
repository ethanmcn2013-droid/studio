#!/usr/bin/env node
// import-backlog.mjs — one-time importer for VEF-2026.
//
// Reads backlog.source.md (the verbatim founder-supplied master backlog) and
// writes PROJECT_STATE.json. Titles come from the source file and are never
// rewritten here. All other imported metadata (critical path, release-blocking,
// dependencies, start-now) is declared in the PROVENANCE tables below, each
// carrying the verbatim sentence it was derived from.
//
// This is an import tool, not a maintenance tool. It refuses to overwrite an
// existing PROJECT_STATE.json unless --force is passed, because re-running it
// would destroy live status, evidence and history.
//
//   node tools/import-backlog.mjs [--force] [--now=2026-08-02T00:00:00Z]
//
// Cross-platform, zero dependencies, Node >= 18.

import { readFileSync, writeFileSync, existsSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SOURCE = join(ROOT, "backlog.source.md");
const OUT = join(ROOT, "PROJECT_STATE.json");

const args = process.argv.slice(2);
const force = args.includes("--force");
const nowArg = args.find((a) => a.startsWith("--now="));
const NOW = nowArg ? nowArg.slice("--now=".length) : new Date().toISOString();
const TODAY = NOW.slice(0, 10);

const SOURCE_TAG = "master-backlog-2026-08-02";

// ---------------------------------------------------------------------------
// PROVENANCE — every derived flag below quotes the sentence it came from.
// Anything NOT quotable from the source is a proposal and lives in
// BASELINE_REVIEW.md, never in this file.
// ---------------------------------------------------------------------------

// "Launch-blocking." appears verbatim in the epic notes for E05, E06, E07, E08.
const RELEASE_BLOCKING_EPICS = ["E05", "E06", "E07", "E08"];

// "Start now." / "Starts immediately in parallel." in the epic notes.
const START_NOW_EPICS = ["E01", "E02", "E03", "E10"];
// "E13-E14 pre-production: scripts, storyboards and map-system development can
// begin, but final product capture cannot." -> pre-production tasks only.
const START_NOW_TASKS = [
  "E13.01", "E13.02", "E13.03", "E13.07", "E13.10",
  "E14.01", "E14.02", "E14.03", "E14.04", "E14.05",
];

// "The actual critical path" list, transcribed exactly.
const CRITICAL_PATH_RANGES = [
  ["E01.01", "E01.11"],
  ["E02.01", "E02.12"],
  ["E03.01", "E03.12"],
  ["E04.01", "E04.10"],
  ["E05.01", "E05.12"], // "E05, E06 and E07: finish the couple experience..."
  ["E06.01", "E06.12"],
  ["E07.01", "E07.18"],
  ["E08.01", "E08.12"], // "E08 and E09: complete billing, security..."
  ["E09.01", "E09.12"],
  ["E14.15", "E14.15"],
  ["E13.17", "E13.17"],
  ["E14.18", "E14.18"],
  ["E12.14", "E12.14"],
  ["E15.01", "E15.01"],
  ["E15.07", "E15.07"],
  ["E15.15", "E15.17"],
];

// Imported task-level dependencies. Only the four "Critical blocking rules"
// name concrete, resolvable preconditions. Everything else stayed a proposal.
const IMPORTED_DEPENDENCIES = {
  // "Do not freeze commercial copy before the founding-rate, entitlement and
  // keepsake rules are ratified."
  "E09.12": {
    deps: ["E02.01", "E02.03", "E02.12", "E03.09"],
    rule: "Do not freeze commercial copy before the founding-rate, entitlement and keepsake rules are ratified.",
  },
  // "Do not capture final product footage before the couple experience,
  // Timeline, Venue Portal and demo data are visually locked."
  "E14.15": {
    deps: ["E05.12", "E06.12", "E07.18", "E09.09", "E09.12"],
    rule: "Do not capture final product footage before the couple experience, Timeline, Venue Portal and demo data are visually locked.",
  },
  // "Do not produce final personalised films before the venue coordinates,
  // names, links and outreach cohorts are verified."
  "E13.17": {
    deps: ["E10.06", "E10.08", "E10.12", "E13.15", "E13.16"],
    rule: "Do not produce final personalised films before the venue coordinates, names, links and outreach cohorts are verified.",
  },
  // "Do not send the first commercial invitation before contracts, billing,
  // reporting, privacy documentation, support and the full live journey have
  // passed QA."
  "E15.07": {
    deps: ["E15.01", "E15.02", "E15.03", "E15.04", "E15.05", "E15.06"],
    rule: "Do not send the first commercial invitation before contracts, billing, reporting, privacy documentation, support and the full live journey have passed QA.",
  },
};

// Epic-level gating sentences, imported verbatim. Not expanded into task edges:
// expanding them would invent controlling dependencies the source did not state.
const EPIC_GATING = {
  E01: "Start now. Blocks every other workstream.",
  E02: "Start now. Blocks contracts, portal language, films, pricing pages and outreach.",
  E03: "Start now. Blocks live sales and live couple access.",
  E04: "Begins once E02 and E03 core decisions are stable. Blocks implementation and portal accuracy.",
  E05: "Launch-blocking. Final film capture cannot begin until this epic passes.",
  E06: "Launch-blocking and central to the main film.",
  E07: "Launch-blocking. This is not deferred until after sales.",
  E08: "Launch-blocking. Runs in parallel with product completion.",
  E09: "Blocks trustworthy portal reports, product capture and final scripts.",
  E10: "Starts immediately in parallel. Does not wait for product completion.",
  E11: "Templates can begin early. Final system depends on offer and asset lock.",
  E12: "Final versions depend on E02, E03, E09 and the product UI lock.",
  E13: "Pre-production starts now. Final rendering requires E02, E09 and E10.",
  E14: "Final product capture is blocked by E05-E09.",
  E15: "Begins after all six release gates pass. Continues after launch until project closure.",
};

// Proposed executor lane per epic. PROPOSED, not approved — see BASELINE_REVIEW.
// Lanes follow the workspace contract: Claude Code owns product/infra/ops,
// Codex owns motion (signal-motion).
const EPIC_EXECUTOR = {
  E01: "claude_code", E02: "founder", E03: "founder", E04: "claude_code",
  E05: "claude_code", E06: "claude_code", E07: "claude_code", E08: "claude_code",
  E09: "claude_code", E10: "claude_code", E11: "founder", E12: "claude_code",
  E13: "codex_motion", E14: "codex_motion", E15: "founder",
};
const TASK_EXECUTOR = {
  "E03.12": "external", // "Obtain documented Irish legal and accounting review"
};

// ---------------------------------------------------------------------------
// Parse
// ---------------------------------------------------------------------------

function parseSource(text) {
  const lines = text.split(/\r?\n/);
  const epics = [];
  const tasks = [];
  let current = null;
  let inBacklog = false;

  for (const line of lines) {
    const epicMatch = /^## (E\d{2}) — (.+?)\s*$/.exec(line);
    if (epicMatch) {
      inBacklog = true;
      current = { id: epicMatch[1], title: epicMatch[2], note: null };
      epics.push(current);
      continue;
    }
    if (/^## /.test(line) && !epicMatch) {
      // any other H2 ends the epic run
      if (inBacklog) current = null;
      continue;
    }
    if (!current) continue;
    const noteMatch = /^_(.+)_\s*$/.exec(line);
    if (noteMatch && current.note === null) {
      current.note = noteMatch[1];
      continue;
    }
    const taskMatch = /^\* (E\d{2}\.\d{2}) (.+?)\s*$/.exec(line);
    if (taskMatch) {
      tasks.push({ id: taskMatch[1], epic: current.id, title: taskMatch[2] });
    }
  }
  return { epics, tasks };
}

function inRanges(id) {
  return CRITICAL_PATH_RANGES.some(([a, b]) => id >= a && id <= b);
}

function priorityFor(task) {
  // Proposed priority model, documented in BASELINE_REVIEW.md and REPORTING.md.
  if (task.criticalPath && START_NOW_EPICS.includes(task.epic)) return "p0";
  if (task.criticalPath || task.releaseBlocking) return "p1";
  if (task.startNow) return "p1";
  return "p2";
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

function build() {
  const raw = readFileSync(SOURCE, "utf8");
  const { epics, tasks: parsed } = parseSource(raw);

  if (epics.length === 0 || parsed.length === 0) {
    throw new Error("Parsed 0 epics or 0 tasks — backlog.source.md format changed.");
  }

  const seen = new Set();
  const tasks = parsed.map((t) => {
    if (seen.has(t.id)) throw new Error(`Duplicate task id in source: ${t.id}`);
    seen.add(t.id);
    const releaseBlocking = RELEASE_BLOCKING_EPICS.includes(t.epic);
    const criticalPath = inRanges(t.id);
    const startNow = START_NOW_EPICS.includes(t.epic) || START_NOW_TASKS.includes(t.id);
    const dep = IMPORTED_DEPENDENCIES[t.id];
    const shaped = {
      id: t.id,
      epic: t.epic,
      title: t.title,
      status: "backlog",
      priority: "p2",
      releaseBlocking,
      criticalPath,
      startNow,
      effortPoints: null,
      estimateStatus: "unestimated",
      executor: TASK_EXECUTOR[t.id] || EPIC_EXECUTOR[t.epic] || "unassigned",
      approver: "founder",
      dependencies: dep ? dep.deps.slice() : [],
      dependencyBasis: dep ? dep.rule : null,
      blockedBy: [],
      specPath: null,
      acceptanceCriteria: [],
      evidence: [],
      founderSignOff: { state: "not_requested", note: null, date: null },
      createdAt: TODAY,
      updatedAt: TODAY,
      startedAt: null,
      reviewAt: null,
      completedAt: null,
      source: SOURCE_TAG,
      notes: [],
      history: [
        { at: NOW, from: null, to: "backlog", by: "import", note: "Imported from master backlog." },
      ],
    };
    shaped.priority = priorityFor(shaped);
    return shaped;
  });

  const byId = new Map(tasks.map((t) => [t.id, t]));
  for (const t of tasks) {
    for (const d of t.dependencies) {
      if (!byId.has(d)) throw new Error(`Imported dependency ${t.id} -> ${d} does not exist.`);
    }
  }

  const epicRecords = epics.map((e) => ({
    id: e.id,
    title: e.title,
    note: e.note,
    gating: EPIC_GATING[e.id] || null,
    executor: EPIC_EXECUTOR[e.id] || "unassigned",
    taskCount: tasks.filter((t) => t.epic === e.id).length,
  }));

  return { epics: epicRecords, tasks };
}

const gate = (id, name, owner, exitCriteria, epics) => ({
  id, name, owner,
  status: "not_started",
  exitCriteria,
  supportingEpics: epics,
  blockers: [],
  evidence: [],
  founderDecision: null,
  passedAt: null,
  waiver: null,
});

function assemble() {
  const { epics, tasks } = build();

  const state = {
    schemaVersion: "1.0.0",
    project: {
      id: "VEF-2026",
      name: "Venue Edition and Films",
      company: "Signal Studio",
      founder: "Ethan McNamara",
      finalApprover: "Ethan McNamara",
      timezone: "Europe/Dublin",
      controlRoot: "studio/docs/execution/venue-edition-and-films",
      releaseDate: "2026-09-01",
      releaseMilestoneName: "Working release — 1 September 2026",
      completionCondition:
        "25 Greater Limerick founding venues are signed, paid, configured, onboarded and capable of issuing functioning couple invitations.",
      currentPhase: "Phase 0 — Baseline and governance",
      health: {
        rag: "amber",
        reason:
          "Baseline is Draft and unapproved; 211 tasks are unestimated; the founding-rate change from the 2026-07-11 decision (15 venues at EUR 1,500 locked) to 25 venues at EUR 1,000 is unratified and contradicts live commercial surfaces.",
        setAt: NOW,
      },
    },
    baseline: {
      version: "0.1.0-draft",
      state: "draft",
      approvedBy: null,
      approvedAt: null,
      estimatesApproved: false,
      progressMethodology: "provisional_task_count",
      note: "Provisional equal weighting by task count. No effort estimates approved. Not a verified-completion basis.",
    },
    focus: { taskId: null, setAt: null, note: "No focus task. Baseline approval comes first." },
    session: { active: null, lastClosed: null },
    wip: { primaryFocus: 1, maxInProgress: 3, exceptions: [] },
    milestones: [
      {
        id: "M1",
        name: "Baseline approved",
        targetDate: null,
        status: "open",
        exitCriteria: [
          "BASELINE_REVIEW.md read and answered by the founder.",
          "Founder decisions FD-01..FD-06 resolved or explicitly deferred.",
          "Effort estimates approved or explicitly deferred to a later baseline.",
        ],
      },
      {
        id: "M2",
        name: "Offer, legal and lifecycle locked",
        targetDate: null,
        status: "open",
        exitCriteria: ["E01, E02, E03 complete and founder-approved.", "Commercial and legal gates passed."],
      },
      {
        id: "M3",
        name: "Product, portal and data locked",
        targetDate: null,
        status: "open",
        exitCriteria: ["E04-E09 complete and founder-approved.", "Product and data gates passed.", "UI, copy and demo freeze in force."],
      },
      {
        id: "M4",
        name: "Films locked",
        targetDate: null,
        status: "open",
        exitCriteria: ["E13.17 and E14.18 complete and founder-approved.", "Creative gate passed."],
      },
      {
        id: "M5",
        name: "Release — 1 September 2026",
        targetDate: "2026-09-01",
        status: "open",
        exitCriteria: ["All six release gates passed or explicitly waived by the founder.", "E15.01 go/no-go review complete."],
      },
      {
        id: "M6",
        name: "Founding 25 complete — project closure",
        targetDate: null,
        status: "open",
        exitCriteria: [
          "25 venues signed, paid, configured and onboarded.",
          "Each onboarded venue capable of issuing a functioning couple invitation.",
          "E15.17 and E15.18 complete and founder-approved.",
        ],
      },
    ],
    releaseGates: [
      gate("commercial", "Commercial", "founder",
        ["Offer, founding rate and entitlement ratified.", "Renewal, lapse and continuity rules ratified.", "Founding-place mechanics defined."],
        ["E02"]),
      gate("legal", "Legal", "founder",
        ["Agreement, founding schedule, DPA and couple terms drafted and reviewed.", "Documented Irish legal and accounting review obtained.", "Keepsake and retention model ratified."],
        ["E03"]),
      gate("product", "Product", "claude_code",
        ["Couple journey, shared Timeline and Venue Portal complete to the agreed standard.", "Lifecycle architecture implemented.", "Design-system review passed and visual baselines locked."],
        ["E04", "E05", "E06", "E07"]),
      gate("data", "Data, security and reliability", "claude_code",
        ["Tenant isolation, authorisation and token security verified.", "Backups, restore and incident response verified.", "Instrumentation and reconciled reporting verified."],
        ["E08", "E09"]),
      gate("creative", "Creative", "codex_motion",
        ["Limerick First Cohort 1 renders QA'd.", "Before the Day master, captions and cutdowns QA'd.", "Product-accuracy and privacy QA passed on both films."],
        ["E13", "E14"]),
      gate("sales_readiness", "Sales readiness", "founder",
        ["Cohort 1 locked with verified contacts and coordinates.", "CRM, sequences, proposal and objection library ready.", "Commercial pages QA'd."],
        ["E10", "E11", "E12"]),
    ],
    commercial: {
      target: { foundingVenues: 25, standardAnnualEur: 1500, foundingAnnualEur: 1000, geography: "Greater Limerick" },
      foundingPlacesAvailable: 25,
      researchedAccountUniverse: 0,
      cohortReady: { cohort1: false, cohort2: false, cohort3: false, cohort4: false },
      invitationsIssued: 0,
      responses: 0,
      qualifiedMeetings: 0,
      demonstrations: 0,
      proposals: 0,
      signedAgreements: 0,
      paidAgreements: 0,
      configuredVenueAccounts: 0,
      onboardedVenues: 0,
      firstCoupleInvitations: 0,
      firstCoupleActivations: 0,
      note: "Counts only. No venue names or contact details are permitted in this file or in any generated report.",
    },
    films: {
      limerick_first: {
        name: "Limerick First — Founding Invitation Film",
        epic: "E13",
        lane: "codex_motion",
        stages: {
          creative_brief: "not_started", script: "not_started", legal_copy: "not_started",
          storyboard: "not_started", map_data: "not_started", map_system: "not_started",
          animatic: "not_started", voiceover: "not_started", music_and_sound: "not_started",
          master_composition: "not_started", personalisation_pipeline: "not_started",
          cohort_1_renders: "not_started", qa: "not_started", approval: "not_started",
          release_readiness: "not_started",
        },
      },
      before_the_day: {
        name: "Before the Day — Venue Edition Film",
        epic: "E14",
        lane: "codex_motion",
        stages: {
          creative_brief: "not_started", narrative: "not_started", script: "not_started",
          storyboard: "not_started", product_ui_lock: "not_started", demo_data_lock: "not_started",
          capture_plan: "not_started", product_capture: "not_started",
          timeline_hero_sequence: "not_started", portal_sequence: "not_started",
          voiceover: "not_started", music_and_sound: "not_started", edit: "not_started",
          captions: "not_started", aspect_ratio_versions: "not_started",
          product_accuracy_qa: "not_started", privacy_qa: "not_started",
          founder_approval: "not_started", release_readiness: "not_started",
        },
      },
    },
    sequencingDirectives: {
      startImmediately: [
        "E01-E03: project governance, offer rules, legal and lifecycle decisions.",
        "E10: research and rank the venue account universe.",
        "E13-E14 pre-production: scripts, storyboards and map-system development can begin, but final product capture cannot.",
        "E04-E09: product, portal, reporting, engineering and demo-data completion.",
      ],
      criticalBlockingRules: [
        "Do not freeze commercial copy before the founding-rate, entitlement and keepsake rules are ratified.",
        "Do not capture final product footage before the couple experience, Timeline, Venue Portal and demo data are visually locked.",
        "Do not produce final personalised films before the venue coordinates, names, links and outreach cohorts are verified.",
        "Do not send the first commercial invitation before contracts, billing, reporting, privacy documentation, support and the full live journey have passed QA.",
        "Launch day is a release milestone. The project remains open until all 25 founding venues are paid and onboarded.",
      ],
    },
    epics,
    tasks,
    references: {
      charter: "PROJECT.md",
      backlogSource: "backlog.source.md",
      decisions: "DECISIONS.md",
      raid: "RAID.md",
      changelog: "CHANGELOG.md",
      handoff: "HANDOFF.md",
      baselineReview: "BASELINE_REVIEW.md",
      reporting: "REPORTING.md",
      roadmap: "ROADMAP.md",
      workflows: "WORKFLOWS.md",
      evidenceDir: "evidence/",
      sessionsDir: "sessions/",
      tasksDir: "tasks/",
    },
    counts: {},
    meta: {
      lastValidatedAt: null,
      lastRenderedAt: null,
      lastUpdatedAt: NOW,
      lastUpdatedSession: "731291e9-setup",
      importedAt: NOW,
      importSource: SOURCE_TAG,
    },
  };

  return state;
}

// ---------------------------------------------------------------------------

if (existsSync(OUT) && !force) {
  console.error(
    `Refusing to overwrite ${OUT}.\n` +
    "This is a one-time import tool. Re-running it destroys live status, evidence and history.\n" +
    "Pass --force only if you genuinely intend to discard the current project state."
  );
  process.exit(1);
}

const state = assemble();
const tmp = `${OUT}.tmp`;
writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`, "utf8");
renameSync(tmp, OUT);

const cp = state.tasks.filter((t) => t.criticalPath).length;
const rb = state.tasks.filter((t) => t.releaseBlocking).length;
const deps = state.tasks.reduce((n, t) => n + t.dependencies.length, 0);
console.log(
  `Imported ${state.epics.length} epics, ${state.tasks.length} tasks ` +
  `(critical path ${cp}, release-blocking ${rb}, dependency edges ${deps}) -> PROJECT_STATE.json`
);
