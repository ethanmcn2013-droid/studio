import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

const baseRunId = process.env.UX_RUN_ID ?? `first-pass-${stamp()}`;
const reportsDir = path.join(process.cwd(), "ux-tests", "reports");
fs.mkdirSync(reportsDir, { recursive: true });

const envRunId = `${baseRunId}-env`;
console.log(`\n=== Environment readiness (${envRunId}) ===\n`);
const envResult = spawnSync(
  process.execPath,
  [
    "ux-tests/utils/env-readiness.mjs",
    "--profile",
    "ux-demo",
    "--fail-on-missing",
  ],
  {
    cwd: process.cwd(),
    env: { ...process.env, UX_RUN_ID: envRunId },
    stdio: "inherit",
  },
);

const phases = [
  {
    label: "desktop-ai",
    name: "Desktop AI-change review",
    args: ["--ai-change", "--persona", "student"],
  },
  {
    label: "mobile-wedding",
    name: "Mobile wedding venue review",
    args: ["--mobile", "--persona", "wedding-venue"],
  },
  {
    label: "scenario-student",
    name: "Student scenario engine review",
    args: ["--scenario", "full-workflow.student", "--persona", "student"],
  },
  {
    label: "scenario-founder",
    name: "Founder AI-change scenario review",
    args: [
      "--scenario",
      "founder-ai-change-review",
      "--persona",
      "small-business",
      "--ai-change",
    ],
  },
  {
    label: "keyboard-event",
    name: "Keyboard event-manager review",
    args: ["--keyboard", "--persona", "event-manager"],
  },
];

const summaries = [];
let exitCode = envResult.status === 0 ? 0 : envResult.status ?? 1;

for (const phase of phases) {
  const runId = `${baseRunId}-${phase.label}`;
  console.log(`\n=== ${phase.name} (${runId}) ===\n`);
  const result = spawnSync(
    process.execPath,
    ["ux-tests/run-ux-tests.mjs", ...phase.args],
    {
      cwd: process.cwd(),
      env: { ...process.env, UX_RUN_ID: runId },
      stdio: "inherit",
    },
  );

  if (result.status !== 0) {
    exitCode = result.status ?? 1;
  }

  const summaryPath = path.join(reportsDir, `ux-summary-${runId}.json`);
  const summary = fs.existsSync(summaryPath)
    ? JSON.parse(fs.readFileSync(summaryPath, "utf8"))
    : {
        runId,
        status: "missing-summary",
        total: 0,
        passed: 0,
        failed: 0,
        averageScore: null,
        qualityGateFailures: 0,
        hardIssueCount: 0,
      };
  summaries.push({ phase, runId, summary });
}

const briefPath = path.join(reportsDir, `first-pass-brief-${baseRunId}.md`);
const envSummaryPath = path.join(reportsDir, `env-readiness-${envRunId}.json`);
const envSummary = fs.existsSync(envSummaryPath)
  ? JSON.parse(fs.readFileSync(envSummaryPath, "utf8"))
  : null;
fs.writeFileSync(briefPath, renderBrief(baseRunId, summaries, envSummary), "utf8");
const galleryResult = spawnSync(
  process.execPath,
  ["ux-tests/utils/generate-screenshot-gallery.mjs", "--run", baseRunId],
  {
    cwd: process.cwd(),
    stdio: "inherit",
  },
);
if (galleryResult.status !== 0) exitCode = galleryResult.status ?? 1;

const actionBoardResult = spawnSync(
  process.execPath,
  ["ux-tests/utils/generate-action-board.mjs", "--run", baseRunId],
  {
    cwd: process.cwd(),
    stdio: "inherit",
  },
);
if (actionBoardResult.status !== 0) exitCode = actionBoardResult.status ?? 1;

const indexResult = spawnSync(process.execPath, ["ux-tests/utils/generate-report-index.mjs"], {
  cwd: process.cwd(),
  stdio: "inherit",
});
if (indexResult.status !== 0) exitCode = indexResult.status ?? 1;
console.log(`\nFirst-pass brief: ${briefPath}`);
process.exit(exitCode);

function renderBrief(runId, entries, envSummary) {
  const failed = entries.filter((entry) => entry.summary.status !== "passed");
  const averageScores = entries
    .map((entry) => entry.summary.averageScore)
    .filter((score) => typeof score === "number");
  const average =
    averageScores.length > 0
      ? Math.round(
          (averageScores.reduce((total, score) => total + score, 0) /
            averageScores.length) *
            10,
        ) / 10
      : null;
  const hardIssues = entries.reduce(
    (total, entry) => total + Number(entry.summary.hardIssueCount ?? 0),
    0,
  );
  const gateFailures = entries.reduce(
    (total, entry) => total + Number(entry.summary.qualityGateFailures ?? 0),
    0,
  );

  const lines = [
    "# Signal Studio UX First-Pass Brief",
    "",
    `- Run id: ${runId}`,
    `- Generated: ${new Date().toISOString()}`,
    `- Overall status: ${failed.length === 0 ? "passed" : "failed"}`,
    `- Average UX score: ${average === null ? "Not scored" : `${average.toFixed(1)}/10`}`,
    `- Hard issues: ${hardIssues}`,
    `- Quality gate failures: ${gateFailures}`,
    `- Env readiness: ${envSummary?.status ?? "not run"}`,
    "",
    "## Read This First",
    "",
    failed.length === 0
      ? "- The first-pass matrix passed. Start with the lowest-scoring report sections, then inspect screenshots for taste."
      : `- ${failed.length} first-pass phase(s) failed. Open those reports before reviewing lower-priority craft notes.`,
    hardIssues === 0
      ? "- No hard route, console, accessibility, or layout blockers were recorded."
      : "- Hard blockers are present. Treat this as a fix-first pass.",
    gateFailures === 0
      ? "- Quality gates passed across the matrix."
      : "- One or more quality gates failed. Do not treat the suite as product proof yet.",
    envSummary?.status === "passed"
      ? "- Local UX demo environment readiness passed."
      : "- Local UX demo environment readiness did not pass. Fix that before trusting browser results.",
    "",
    "## Environment Readiness",
    "",
    envSummary
      ? `- Status: ${envSummary.status}`
      : "- Status: missing readiness summary",
    envSummary
      ? `- Missing required files: ${envSummary.missingRequiredFiles}`
      : "- Missing required files: unknown",
    envSummary
      ? `- Missing required env keys: ${envSummary.missingRequiredEnv}`
      : "- Missing required env keys: unknown",
    envSummary
      ? `- Report: [env-readiness-${envSummary.runId}.md](env-readiness-${envSummary.runId}.md)`
      : "- Report: none",
    "",
    "## Visual Review",
    "",
    `- Screenshot gallery: [screenshot-gallery-${runId}.html](screenshot-gallery-${runId}.html)`,
    `- Action board: [ux-action-board-${runId}.md](ux-action-board-${runId}.md)`,
    "",
    "## Phase Summary",
    "",
    "| Phase | Status | Persona | Project | Passed | Failed | Score | Gates | Hard Issues | Report |",
    "| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- |",
    ...entries.map(({ phase, runId: phaseRunId, summary }) => {
      const report = `ux-report-${phaseRunId}.md`;
      const score =
        typeof summary.averageScore === "number"
          ? `${summary.averageScore.toFixed(1)}/10`
          : "n/a";
      return `| ${phase.name} | ${summary.status} | ${summary.persona ?? "n/a"} | ${summary.browserProject ?? "n/a"} | ${summary.passed ?? 0} | ${summary.failed ?? 0} | ${score} | ${summary.qualityGateFailures ?? 0} | ${summary.hardIssueCount ?? 0} | [report](${report}) |`;
    }),
    "",
    "## First-Pass Decision",
    "",
    decisionLine(failed.length, hardIssues, gateFailures, average),
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function decisionLine(failedCount, hardIssues, gateFailures, average) {
  if (failedCount > 0 || hardIssues > 0 || gateFailures > 0) {
    return "- Decision: fix first. The bot found enough risk that the screenshots should be used for diagnosis, not confidence.";
  }
  if ((average ?? 0) >= 8.5) {
    return "- Decision: ready for human taste review. The mechanical checks are clean, so use the screenshots and scorecards to refine polish.";
  }
  return "- Decision: usable but not world-class yet. Improve the lowest scorecard dimensions before treating this as external proof.";
}
