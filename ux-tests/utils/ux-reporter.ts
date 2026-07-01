import fs from "node:fs";
import path from "node:path";
import type {
  FullConfig,
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";
import { loadPanel } from "./panel";
import type { UxScore } from "./scorecard";
import { SIGNAL_STUDIO_PRINCIPLES } from "./ux-lens";

type RecordedResult = {
  title: string;
  file: string;
  status: TestResult["status"];
  duration: number;
  annotations: Array<{ type: string; description?: string }>;
  errors: string[];
};

type RunSummary = {
  runId: string;
  startedAt: string;
  status: FullResult["status"];
  persona: string;
  browserProject: string;
  aiChangeMode: boolean;
  total: number;
  passed: number;
  failed: number;
  averageScore: number | null;
  failedJourneys: string[];
  qualityGateFailures: number;
  hardIssueCount: number;
  craftIssueCount: number;
  knownConsoleNoiseCount: number;
};

type Finding = {
  severity: keyof typeof SEVERITY_RANK;
  journey: string;
  title: string;
  detail: string;
};

const SEVERITY_RANK = {
  blocker: 4,
  high: 3,
  medium: 2,
  low: 1,
} as const;

class UxReporter implements Reporter {
  private startedAt = new Date();
  private results: RecordedResult[] = [];

  onBegin(_config: FullConfig) {
    this.startedAt = new Date();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({
      title: test.title,
      file: test.location.file,
      status: result.status,
      duration: result.duration,
      annotations: uniqueAnnotations([...test.annotations, ...result.annotations]),
      errors: result.errors
        .map((error) => error.message ?? error.value)
        .filter((message): message is string => Boolean(message))
        .map(cleanText),
    });
  }

  async onEnd(result: FullResult) {
    const reportDir = path.join(process.cwd(), "ux-tests", "reports");
    fs.mkdirSync(reportDir, { recursive: true });
    const runId =
      process.env.UX_RUN_ID ?? this.startedAt.toISOString().replace(/[:.]/g, "-");
    const summary = this.createSummary(result, runId);
    const previous = readPreviousSummary(reportDir);
    const reportPath = path.join(reportDir, `ux-report-${runId}.md`);

    fs.writeFileSync(reportPath, this.render(summary, previous), "utf8");
    writeSummaryFiles(reportDir, summary);
    // eslint-disable-next-line no-console
    console.log(`\nUX report: ${reportPath}`);
  }

  private createSummary(result: FullResult, runId: string): RunSummary {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.status === "passed").length;
    const failed = this.results.filter((r) => r.status !== "passed").length;
    const allScores = this.results.flatMap((record) => scoresOf(record.annotations));
    const allAnnotations = this.results.flatMap((record) => record.annotations);

    return {
      runId,
      startedAt: this.startedAt.toISOString(),
      status: result.status,
      persona: personaFromResults(this.results),
      browserProject: process.env.UX_PROJECT?.trim() || "desktop-chromium",
      aiChangeMode: process.env.UX_AI_CHANGE === "1",
      total,
      passed,
      failed,
      averageScore: averageScore(allScores),
      failedJourneys: this.results
        .filter((record) => record.status !== "passed")
        .map((record) => firstAnnotation(record.annotations, "journey") ?? record.title),
      qualityGateFailures: annotationsOf(allAnnotations, "ux-gate-fail").length,
      hardIssueCount: hardIssueCount(allAnnotations),
      craftIssueCount:
        annotationsOf(allAnnotations, "ux-craft-issue").length +
        annotationsOf(allAnnotations, "ux-craft-note").length,
      knownConsoleNoiseCount: annotationsOf(allAnnotations, "ux-console-known").length,
    };
  }

  private render(summary: RunSummary, previous: RunSummary | null) {
    const findings = prioritizedFindings(this.results);
    const lines = [
      "# Signal Studio UX Assurance Report",
      "",
      `- Test date/time: ${summary.startedAt}`,
      `- Persona used: ${summary.persona}`,
      `- Overall status: ${summary.status}`,
      `- Summary: ${summary.passed}/${summary.total} passed, ${summary.failed} failed`,
      `- UX score: ${formatScore(summary.averageScore)}`,
      `- Browser project: ${summary.browserProject}`,
      `- AI-change mode: ${summary.aiChangeMode ? "enabled" : "off"}`,
      `- Quality gate failures: ${summary.qualityGateFailures}`,
      `- Hard issues: ${summary.hardIssueCount}`,
      `- Craft notes/issues: ${summary.craftIssueCount}`,
      `- Known console noise: ${summary.knownConsoleNoiseCount}`,
      "",
      "## Executive Summary",
      "",
      `- Panel verdict: ${panelVerdict(summary)}`,
      `- Highest-leverage next fix: ${highestLeverageFix(findings)}`,
      `- Operator read: ${operatorRead(summary, previous)}`,
      "",
      "## Prioritized Findings",
      "",
      ...prioritizedFindingsBlock(findings),
      "",
      "## Change Since Previous Run",
      "",
      ...comparisonBlock(previous, summary),
      "",
      "## Evaluation Lens",
      "",
      ...SIGNAL_STUDIO_PRINCIPLES.map((principle) => `- ${principle}`),
      "",
      "## Panel",
      "",
      ...panelBlock(),
      "",
      "## Journeys",
      "",
    ];

    for (const record of this.results) {
      lines.push(...this.renderRecord(record));
    }

    return `${lines.join("\n")}\n`;
  }

  private renderRecord(record: RecordedResult) {
    const annotations = record.annotations;
    const journey = firstAnnotation(annotations, "journey") ?? record.title;
    const personaName = firstAnnotation(annotations, "persona") ?? "Unknown";
    const severity = highestSeverity(annotations, record.status);
    const scores = scoresOf(annotations);

    return [
      `### ${journey}`,
      "",
      `- Status: ${record.status}`,
      `- Persona: ${personaName}`,
      `- Severity: ${severity}`,
      `- Duration: ${Math.round(record.duration)}ms`,
      "",
      scorecardBlock(scores),
      listBlock("Passed Steps", annotationsOf(annotations, "ux-step-pass")),
      listBlock("Failed Steps", [
        ...annotationsOf(annotations, "ux-step-fail"),
        ...record.errors,
      ]),
      listBlock("Quality Gates", [
        ...annotationsOf(annotations, "ux-gate-fail"),
        ...annotationsOf(annotations, "ux-gate-pass"),
      ]),
      listBlock("Console Errors", annotationsOf(annotations, "ux-console-error")),
      listBlock(
        "Known Non-Actionable Console Noise",
        annotationsOf(annotations, "ux-console-known"),
      ),
      listBlock("Broken Links / Buttons / Forms / Routes", [
        ...annotationsOf(annotations, "ux-broken-route"),
        ...annotationsOf(annotations, "ux-broken-interactive"),
      ]),
      listBlock("UX Friction Notes", annotationsOf(annotations, "ux-friction")),
      listBlock("Suggested Fixes", annotationsOf(annotations, "ux-fix")),
      listBlock("Craft / Accessibility / Layout", [
        ...annotationsOf(annotations, "ux-layout-blocker"),
        ...annotationsOf(annotations, "ux-layout-note"),
        ...annotationsOf(annotations, "ux-accessibility-blocker"),
        ...annotationsOf(annotations, "ux-craft-issue"),
        ...annotationsOf(annotations, "ux-craft-note"),
      ]),
      listBlock("Performance", annotationsOf(annotations, "ux-performance")),
      listBlock("Scenario", [
        ...annotationsOf(annotations, "scenario-name"),
        ...annotationsOf(annotations, "scenario-goal"),
        ...annotationsOf(annotations, "scenario-starting-state"),
        ...annotationsOf(annotations, "scenario-step"),
        ...annotationsOf(annotations, "scenario-success-criteria"),
        ...annotationsOf(annotations, "ux-scenario-note"),
      ]),
      screenshotBlock(annotationsOf(annotations, "ux-screenshot")),
      "",
    ].flat();
  }
}

function annotationsOf(
  annotations: Array<{ type: string; description?: string }>,
  type: string,
) {
  return annotations
    .filter((annotation) => annotation.type === type)
    .map((annotation) => annotation.description)
    .filter((description): description is string => Boolean(description));
}

function firstAnnotation(
  annotations: Array<{ type: string; description?: string }>,
  type: string,
) {
  return annotations.find((annotation) => annotation.type === type)?.description;
}

function personaFromResults(results: RecordedResult[]) {
  return (
    process.env.UX_PERSONA ??
    firstAnnotation(results.flatMap((r) => r.annotations), "persona-slug") ??
    "student"
  );
}

function listBlock(title: string, items: string[]) {
  if (items.length === 0) return [`#### ${title}`, "", "- None recorded.", ""];
  return [
    `#### ${title}`,
    "",
    ...items.map((item) => `- ${truncate(cleanText(item), 1_200)}`),
    "",
  ];
}

function scorecardBlock(scores: UxScore[]) {
  if (scores.length === 0) {
    return ["#### UX Scorecard", "", "- No score annotations recorded.", ""];
  }

  return [
    "#### UX Scorecard",
    "",
    "| Dimension | Score | Note |",
    "| --- | ---: | --- |",
    ...scores.map(
      (score) =>
        `| ${tableCell(score.label)} | ${score.score.toFixed(1)}/10 | ${tableCell(
          truncate(cleanText(score.note), 300),
        )} |`,
    ),
    `| **Average** | **${formatScore(averageScore(scores))}** | |`,
    "",
  ];
}

function panelBlock() {
  const members = loadPanel();
  if (members.length === 0) {
    return ["- No panel metadata found."];
  }

  return members.flatMap((member) => [
    `- **${member.name}**: ${member.primary_question}`,
    `  World-class bar: ${member.world_class_bar}`,
  ]);
}

function comparisonBlock(previous: RunSummary | null, current: RunSummary) {
  if (!previous) {
    return ["- No previous UX summary found. This run establishes the baseline."];
  }

  const passDelta = signed(current.passed - previous.passed);
  const failDelta = signed(current.failed - previous.failed);
  const scoreDelta =
    current.averageScore === null || previous.averageScore === null
      ? "n/a"
      : signed(Math.round((current.averageScore - previous.averageScore) * 10) / 10);
  const previousFailures = new Set(previous.failedJourneys);
  const newFailures = current.failedJourneys.filter(
    (journey) => !previousFailures.has(journey),
  );

  return [
    `- Previous run: ${previous.startedAt} (${previous.status}, ${previous.persona}, ${previous.browserProject})`,
    `- Pass delta: ${passDelta}; fail delta: ${failDelta}; score delta: ${scoreDelta}`,
    `- Previous quality gate failures: ${previous.qualityGateFailures}; current: ${current.qualityGateFailures}`,
    `- New failing journeys: ${newFailures.length ? newFailures.join(", ") : "none"}`,
  ];
}

function screenshotBlock(paths: string[]) {
  if (paths.length === 0) {
    return ["#### Screenshots", "", "- None recorded.", ""];
  }
  return [
    "#### Screenshots",
    "",
    ...paths.map((screenshotPath, index) => {
      const label = `Screenshot ${index + 1}`;
      return `- [${label}](${screenshotPath})`;
    }),
    "",
  ];
}

function highestSeverity(
  annotations: Array<{ type: string; description?: string }>,
  status: TestResult["status"],
) {
  const explicit = annotationsOf(annotations, "ux-severity")
    .filter((value): value is keyof typeof SEVERITY_RANK => value in SEVERITY_RANK)
    .sort((a, b) => SEVERITY_RANK[b] - SEVERITY_RANK[a])[0];
  if (explicit) return explicit;
  return status === "passed" ? "low" : "blocker";
}

function scoresOf(annotations: Array<{ type: string; description?: string }>) {
  return annotationsOf(annotations, "ux-score")
    .map(parseScore)
    .filter((score): score is UxScore => Boolean(score));
}

function parseScore(value: string): UxScore | null {
  try {
    const parsed = JSON.parse(value) as Partial<UxScore>;
    if (
      !parsed ||
      typeof parsed.dimension !== "string" ||
      typeof parsed.label !== "string" ||
      typeof parsed.score !== "number" ||
      typeof parsed.note !== "string"
    ) {
      return null;
    }
    return parsed as UxScore;
  } catch {
    return null;
  }
}

function averageScore(scores: UxScore[]) {
  if (scores.length === 0) return null;
  const sum = scores.reduce((total, score) => total + score.score, 0);
  return Math.round((sum / scores.length) * 10) / 10;
}

function hardIssueCount(annotations: Array<{ type: string; description?: string }>) {
  return [
    "ux-console-error",
    "ux-broken-route",
    "ux-broken-interactive",
    "ux-layout-blocker",
    "ux-accessibility-blocker",
  ].reduce((total, type) => total + annotationsOf(annotations, type).length, 0);
}

function prioritizedFindings(results: RecordedResult[]): Finding[] {
  const findings: Finding[] = [];

  for (const record of results) {
    const journey = firstAnnotation(record.annotations, "journey") ?? record.title;

    for (const error of record.errors) {
      findings.push({
        severity: "blocker",
        journey,
        title: "Test error",
        detail: error,
      });
    }

    for (const gate of annotationsOf(record.annotations, "ux-gate-fail")) {
      findings.push({
        severity: "blocker",
        journey,
        title: "Quality gate failed",
        detail: gate,
      });
    }

    for (const consoleError of annotationsOf(record.annotations, "ux-console-error")) {
      findings.push({
        severity: "high",
        journey,
        title: "Browser console error",
        detail: consoleError,
      });
    }

    for (const issue of [
      ...annotationsOf(record.annotations, "ux-broken-route"),
      ...annotationsOf(record.annotations, "ux-broken-interactive"),
      ...annotationsOf(record.annotations, "ux-layout-blocker"),
      ...annotationsOf(record.annotations, "ux-accessibility-blocker"),
    ]) {
      findings.push({
        severity: "high",
        journey,
        title: "Hard UX issue",
        detail: issue,
      });
    }

    for (const score of scoresOf(record.annotations).filter((item) => item.score < 7)) {
      findings.push({
        severity: "medium",
        journey,
        title: `${score.label} below world-class bar`,
        detail: `${score.score.toFixed(1)}/10. ${score.note}`,
      });
    }

    for (const issue of annotationsOf(record.annotations, "ux-craft-issue")) {
      findings.push({
        severity: "medium",
        journey,
        title: "Craft issue",
        detail: issue,
      });
    }

    for (const friction of annotationsOf(record.annotations, "ux-friction")) {
      findings.push({
        severity: highestSeverity(record.annotations, record.status),
        journey,
        title: "UX friction",
        detail: friction,
      });
    }
  }

  return findings
    .sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity])
    .slice(0, 20);
}

function prioritizedFindingsBlock(findings: Finding[]) {
  if (findings.length === 0) {
    return ["- No prioritized findings. Keep watching trend and screenshots."];
  }

  return findings.map(
    (finding) =>
      `- **${finding.severity.toUpperCase()}** ${finding.journey}: ${finding.title} - ${truncate(
        cleanText(finding.detail),
        300,
      )}`,
  );
}

function panelVerdict(summary: RunSummary) {
  if (summary.failed > 0 || summary.qualityGateFailures > 0 || summary.hardIssueCount > 0) {
    return "Not ready. Fix blockers before trusting the experience.";
  }
  if ((summary.averageScore ?? 0) >= 8.5) {
    return "Ready for a serious first-pass review. The bot found no hard breakage and the experience is scoring in the world-class band.";
  }
  if ((summary.averageScore ?? 0) >= 7.5) {
    return "Usable, but below the taste bar. Prioritize the lowest-scoring dimensions before showing this as proof.";
  }
  return "Below the bar. Treat this as a product refinement run, not release evidence.";
}

function highestLeverageFix(findings: Finding[]) {
  if (findings.length === 0) return "No urgent fix surfaced in this run.";
  const first = findings[0];
  return `${first.journey}: ${first.title} - ${truncate(cleanText(first.detail), 180)}`;
}

function operatorRead(summary: RunSummary, previous: RunSummary | null) {
  if (!previous) {
    return "Baseline established. Run again after the next meaningful product change to see movement.";
  }
  const scoreDelta =
    summary.averageScore === null || previous.averageScore === null
      ? null
      : Math.round((summary.averageScore - previous.averageScore) * 10) / 10;
  if (summary.failed > previous.failed) {
    return "Regression detected: more failing journeys than the previous run.";
  }
  if (scoreDelta !== null && scoreDelta < -0.3) {
    return `Taste regression detected: score moved ${scoreDelta}. Review screenshots and low dimensions.`;
  }
  if (summary.failed === 0 && summary.qualityGateFailures === 0) {
    return "Healthy for daily founder use. Review prioritized findings, then inspect screenshots for taste.";
  }
  return "Mechanically useful, but needs follow-up on gates or findings before it becomes product proof.";
}

function formatScore(score: number | null) {
  return score === null ? "Not scored" : `${score.toFixed(1)}/10`;
}

function readPreviousSummary(reportDir: string): RunSummary | null {
  const latest = path.join(reportDir, ".history", "latest.json");
  if (!fs.existsSync(latest)) return null;
  try {
    return JSON.parse(fs.readFileSync(latest, "utf8")) as RunSummary;
  } catch {
    return null;
  }
}

function writeSummaryFiles(reportDir: string, summary: RunSummary) {
  const historyDir = path.join(reportDir, ".history");
  fs.mkdirSync(historyDir, { recursive: true });

  fs.writeFileSync(
    path.join(reportDir, `ux-summary-${summary.runId}.json`),
    JSON.stringify(summary, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(historyDir, "latest.json"),
    JSON.stringify(summary, null, 2),
    "utf8",
  );

  const historyPath = path.join(historyDir, "history.json");
  let history: RunSummary[] = [];
  if (fs.existsSync(historyPath)) {
    try {
      history = JSON.parse(fs.readFileSync(historyPath, "utf8")) as RunSummary[];
    } catch {
      history = [];
    }
  }
  const nextHistory = [
    ...history.filter((entry) => entry.runId !== summary.runId),
    summary,
  ].slice(-50);
  fs.writeFileSync(historyPath, JSON.stringify(nextHistory, null, 2), "utf8");
}

function uniqueAnnotations(
  annotations: Array<{ type: string; description?: string }>,
) {
  const seen = new Set<string>();
  const unique: Array<{ type: string; description?: string }> = [];
  for (const annotation of annotations) {
    const key = `${annotation.type}\u0000${annotation.description ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(annotation);
  }
  return unique;
}

function cleanText(value: string) {
  return value
    .replace(/\u001b\[[0-9;]*m/g, "")
    .replace(/\r/g, "")
    .trim();
}

function truncate(value: string, max: number) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 15).trimEnd()}... [truncated]`;
}

function tableCell(value: string) {
  return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function signed(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

export default UxReporter;
