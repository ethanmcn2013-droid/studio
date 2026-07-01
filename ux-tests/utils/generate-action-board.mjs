import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const reportDir = path.join(process.cwd(), "ux-tests", "reports");
const runPrefix = valueAfter("--run");

if (!fs.existsSync(reportDir)) {
  console.error("No UX reports directory exists yet.");
  process.exit(1);
}

const summaries = readJsonFiles("ux-summary-", runPrefix);
const envSummaries = readJsonFiles("env-readiness-", runPrefix);
const reports = readReportFiles(runPrefix);
const firstPass = latestFile("first-pass-brief-", ".md", runPrefix);
const runId =
  runPrefix ??
  firstPass?.name.replace(/^first-pass-brief-/, "").replace(/\.md$/, "") ??
  "latest";

const findings = groupFindings(reports.flatMap((report) => extractFindings(report)));
const scores = summaries
  .filter((summary) => typeof summary.averageScore === "number")
  .map((summary) => ({
    runId: summary.runId,
    persona: summary.persona ?? "n/a",
    project: summary.browserProject ?? "n/a",
    score: summary.averageScore,
    status: summary.status ?? "unknown",
    failed: Number(summary.failed ?? 0),
    hardIssues: Number(summary.hardIssueCount ?? 0),
    gates: Number(summary.qualityGateFailures ?? 0),
  }))
  .sort((a, b) => a.score - b.score);

const totals = {
  runs: summaries.length,
  failedRuns: summaries.filter((summary) => summary.status !== "passed").length,
  hardIssues: summaries.reduce(
    (total, summary) => total + Number(summary.hardIssueCount ?? 0),
    0,
  ),
  gateFailures: summaries.reduce(
    (total, summary) => total + Number(summary.qualityGateFailures ?? 0),
    0,
  ),
  averageScore: average(scores.map((score) => score.score)),
};

const latestEnv = envSummaries.sort((a, b) =>
  String(b.generatedAt ?? "").localeCompare(String(a.generatedAt ?? "")),
)[0];

const board = {
  runId,
  generatedAt: new Date().toISOString(),
  decision: decisionFor(totals, latestEnv),
  totals,
  environment: latestEnv
    ? {
        runId: latestEnv.runId,
        profile: latestEnv.profile,
        status: latestEnv.status,
        missingRequiredFiles: latestEnv.missingRequiredFiles,
        missingRequiredEnv: latestEnv.missingRequiredEnv,
      }
    : null,
  lowestScoringRuns: scores.slice(0, 5),
  fixNow: findings
    .filter((finding) => ["blocker", "high"].includes(finding.severity))
    .slice(0, 12),
  improveNext: findings
    .filter((finding) => finding.severity === "medium")
    .slice(0, 12),
  watch: findings.filter((finding) => finding.severity === "low").slice(0, 12),
  sourceReports: reports.map((report) => report.name),
};

fs.mkdirSync(reportDir, { recursive: true });
const mdPath = path.join(reportDir, `ux-action-board-${runId}.md`);
const jsonPath = path.join(reportDir, `ux-action-board-${runId}.json`);
fs.writeFileSync(mdPath, renderMarkdown(board), "utf8");
fs.writeFileSync(jsonPath, JSON.stringify(board, null, 2), "utf8");
fs.writeFileSync(path.join(reportDir, "ux-action-board-latest.md"), renderMarkdown(board), "utf8");
fs.writeFileSync(
  path.join(reportDir, "ux-action-board-latest.json"),
  JSON.stringify(board, null, 2),
  "utf8",
);

console.log(`UX action board: ${mdPath}`);
console.log(`UX action board: ${jsonPath}`);

function readJsonFiles(prefix, filterPrefix) {
  return fs
    .readdirSync(reportDir)
    .filter((name) => name.startsWith(prefix) && name.endsWith(".json"))
    .filter((name) => !filterPrefix || name.includes(filterPrefix))
    .map((name) => {
      const fullPath = path.join(reportDir, name);
      try {
        return JSON.parse(fs.readFileSync(fullPath, "utf8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function readReportFiles(filterPrefix) {
  return fs
    .readdirSync(reportDir)
    .filter((name) => name.startsWith("ux-report-") && name.endsWith(".md"))
    .filter((name) => !filterPrefix || name.includes(filterPrefix))
    .map((name) => ({
      name,
      text: fs.readFileSync(path.join(reportDir, name), "utf8"),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function latestFile(prefix, extension, filterPrefix) {
  const files = fs
    .readdirSync(reportDir)
    .filter((name) => name.startsWith(prefix) && name.endsWith(extension))
    .filter((name) => !filterPrefix || name.includes(filterPrefix))
    .map((name) => ({
      name,
      mtime: fs.statSync(path.join(reportDir, name)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime);
  return files[0] ?? null;
}

function extractFindings(report) {
  const block =
    /## Prioritized Findings\s+([\s\S]*?)(?:\n## |\n### |$)/.exec(report.text)?.[1] ?? "";
  return block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- **"))
    .map((line) => {
      const match = /^- \*\*(BLOCKER|HIGH|MEDIUM|LOW)\*\* ([\s\S]+)$/.exec(line);
      if (!match) {
        return {
          severity: "low",
          journey: report.name,
          title: "Unparsed finding",
          detail: line.replace(/^- /, ""),
          report: report.name,
        };
      }
      const parsed = parseFindingBody(match[2]);
      if (!parsed) {
        return {
          severity: match[1].toLowerCase(),
          journey: report.name,
          title: "Unparsed finding",
          detail: match[2],
          report: report.name,
        };
      }
      return {
        severity: match[1].toLowerCase(),
        journey: parsed.journey,
        title: parsed.title,
        detail: parsed.detail,
        report: report.name,
      };
    });
}

function groupFindings(items) {
  const groups = new Map();
  for (const item of items) {
    const key = [
      item.severity,
      item.journey,
      item.title,
      item.detail,
    ].join("\u0000");
    const existing = groups.get(key);
    if (existing) {
      if (!existing.reports.includes(item.report)) existing.reports.push(item.report);
    } else {
      groups.set(key, { ...item, reports: [item.report] });
    }
  }
  return [...groups.values()];
}

function parseFindingBody(body) {
  const detailIndex = body.indexOf(" - ");
  if (detailIndex === -1) return null;
  const beforeDetail = body.slice(0, detailIndex);
  const detail = body.slice(detailIndex + 3).trim();
  const titleIndex = beforeDetail.lastIndexOf(": ");
  if (titleIndex === -1) return null;
  return {
    journey: beforeDetail.slice(0, titleIndex).trim(),
    title: beforeDetail.slice(titleIndex + 2).trim(),
    detail,
  };
}

function renderMarkdown(board) {
  const lines = [
    "# Signal Studio UX Action Board",
    "",
    `- Generated: ${board.generatedAt}`,
    `- Run: ${board.runId}`,
    `- Decision: ${board.decision}`,
    `- Runs analyzed: ${board.totals.runs}`,
    `- Failed runs: ${board.totals.failedRuns}`,
    `- Average UX score: ${
      board.totals.averageScore === null
        ? "n/a"
        : `${board.totals.averageScore.toFixed(1)}/10`
    }`,
    `- Hard issues: ${board.totals.hardIssues}`,
    `- Quality gate failures: ${board.totals.gateFailures}`,
    "",
    "## Fix Now",
    "",
    ...findingLines(
      board.fixNow,
      "No blocker or high-severity findings in the analyzed reports.",
    ),
    "",
    "## Improve Next",
    "",
    ...findingLines(
      board.improveNext,
      "No medium-severity findings in the analyzed reports.",
    ),
    "",
    "## Watch",
    "",
    ...findingLines(board.watch, "No low-severity findings in the analyzed reports."),
    "",
    "## Lowest Scoring Runs",
    "",
    ...scoreLines(board.lowestScoringRuns),
    "",
    "## Environment",
    "",
    ...environmentLines(board.environment),
    "",
    "## Source Reports",
    "",
    ...board.sourceReports.map((name) => `- [${name}](${name})`),
    "",
  ];

  return `${lines.join("\n")}\n`;
}

function findingLines(findings, emptyMessage) {
  if (findings.length === 0) return [`- ${emptyMessage}`];
  return findings.map(
    (finding) => {
      const reports = finding.reports ?? [finding.report];
      const reportLinks = reports.map((report) => `[${report}](${report})`).join(", ");
      return `- **${finding.severity.toUpperCase()}** ${finding.journey}: ${finding.title} - ${finding.detail} Evidence: ${reports.length} report(s): ${reportLinks}`;
    },
  );
}

function scoreLines(items) {
  if (items.length === 0) return ["- No scored summaries found."];
  return [
    "| Run | Status | Persona | Project | Score | Failed | Gates | Hard Issues |",
    "| --- | --- | --- | --- | ---: | ---: | ---: | ---: |",
    ...items.map(
      (item) =>
        `| ${item.runId} | ${item.status} | ${item.persona} | ${item.project} | ${item.score.toFixed(1)}/10 | ${item.failed} | ${item.gates} | ${item.hardIssues} |`,
    ),
  ];
}

function environmentLines(environment) {
  if (!environment) return ["- No env readiness summary found for this run."];
  return [
    `- Profile: ${environment.profile}`,
    `- Status: ${environment.status}`,
    `- Missing required files: ${environment.missingRequiredFiles}`,
    `- Missing required env keys: ${environment.missingRequiredEnv}`,
    `- Report: [env-readiness-${environment.runId}.md](env-readiness-${environment.runId}.md)`,
  ];
}

function decisionFor(totals, environment) {
  if (totals.failedRuns > 0 || totals.hardIssues > 0 || totals.gateFailures > 0) {
    return "Fix first";
  }
  if (environment && environment.status !== "passed") {
    return "Mechanics passed, environment needs attention";
  }
  if ((totals.averageScore ?? 0) >= 8.5) {
    return "Ready for human taste review";
  }
  return "Improve before treating as proof";
}

function average(values) {
  if (values.length === 0) return null;
  return (
    Math.round(
      (values.reduce((total, value) => total + value, 0) / values.length) * 10,
    ) / 10
  );
}

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] ?? null;
}
