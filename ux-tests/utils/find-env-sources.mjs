import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const studioRoot = path.resolve(__dirname, "..", "..");
const workspaceRoot = path.resolve(studioRoot, "..");
const reportDir = path.join(studioRoot, "ux-tests", "reports");
const requirementsPath = path.join(studioRoot, "ux-tests", "env", "requirements.json");
const args = process.argv.slice(2);
const runId =
  process.env.UX_RUN_ID ??
  `env-sources-${new Date().toISOString().replace(/[:.]/g, "-")}`;
const maxDepth = Number(valueAfter("--max-depth") ?? 7);
const roots = rootsFromArgs();
const requiredKeys = productionKeys();

const findings = [];
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  scan(root, 0);
}

const uniqueFindings = dedupe(findings).sort((a, b) => a.path.localeCompare(b.path));
fs.mkdirSync(reportDir, { recursive: true });
const jsonPath = path.join(reportDir, `env-source-candidates-${runId}.json`);
const mdPath = path.join(reportDir, `env-source-candidates-${runId}.md`);
fs.writeFileSync(
  jsonPath,
  JSON.stringify(
    {
      runId,
      generatedAt: new Date().toISOString(),
      searchedRoots: roots,
      requiredKeys,
      candidates: uniqueFindings,
    },
    null,
    2,
  ),
  "utf8",
);
fs.writeFileSync(mdPath, renderMarkdown(uniqueFindings), "utf8");

console.log(`Env source candidates: ${mdPath}`);
console.log(`Candidates found: ${uniqueFindings.length}`);
const realCandidates = uniqueFindings.filter((finding) => !finding.documentationOnly);
console.log(`Real env candidates: ${realCandidates.length}`);
for (const finding of realCandidates.slice(0, 20)) {
  console.log(`${finding.path} (${finding.keys.join(", ")})`);
}

function scan(dir, depth) {
  if (depth > maxDepth || shouldSkipDir(dir)) return;
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(fullPath, depth + 1);
      continue;
    }
    if (!entry.isFile() || !isCandidateFile(entry.name)) continue;
    const keys = keysInFile(fullPath);
    if (keys.length > 0) {
      findings.push({ path: fullPath, keys, documentationOnly: isDocumentationOnly(fullPath) });
    }
  }
}

function keysInFile(file) {
  let stat;
  try {
    stat = fs.statSync(file);
  } catch {
    return [];
  }
  if (stat.size > 1_000_000) return [];

  const matched = new Set();
  try {
    const text = fs.readFileSync(file, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const key = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/.exec(line)?.[1];
      if (key && requiredKeys.includes(key)) matched.add(key);
    }
  } catch {
    return [];
  }
  return [...matched].sort();
}

function rootsFromArgs() {
  const explicit = valuesAfter("--root").map((value) => path.resolve(value));
  if (explicit.length > 0) return explicit;

  const home = os.homedir();
  return [
    workspaceRoot,
    path.join(home, "OneDrive"),
    path.join(home, "SignalHQ"),
    path.join(home, "signal-studio-demo"),
    path.join(home, "Documents"),
    path.join(home, "Desktop"),
  ].filter(
    (root, index, list) =>
      root && list.indexOf(root) === index && fs.existsSync(root),
  );
}

function productionKeys() {
  const requirements = JSON.parse(fs.readFileSync(requirementsPath, "utf8"));
  const products = requirements.profiles?.production?.products ?? {};
  return [
    ...new Set(
      Object.values(products).flatMap((product) => [
        ...(product.requiredEnv ?? []),
        ...(product.recommendedEnv ?? []),
      ]),
    ),
  ].sort();
}

function isCandidateFile(name) {
  const lower = name.toLowerCase();
  return (
    lower.startsWith(".env") ||
    lower.includes("env") ||
    lower.includes("secret") ||
    lower.includes("credential") ||
    lower.includes("key")
  );
}

function isDocumentationOnly(file) {
  const lower = path.basename(file).toLowerCase();
  return lower.endsWith(".example") || lower.includes("example");
}

function shouldSkipDir(dir) {
  const name = path.basename(dir).toLowerCase();
  return [
    ".git",
    ".next",
    ".turbo",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "playwright-report",
  ].includes(name);
}

function dedupe(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = item.path;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function renderMarkdown(candidates) {
  const realCandidates = candidates.filter((candidate) => !candidate.documentationOnly);
  const documentationOnly = candidates.filter((candidate) => candidate.documentationOnly);
  const lines = [
    "# Signal Studio Env Source Candidates",
    "",
    `- Generated: ${new Date().toISOString()}`,
    `- Run: ${runId}`,
    "",
    "This report is redacted. It lists file paths and matching key names only, never values.",
    "",
    "## Real Candidates",
    "",
  ];

  if (realCandidates.length === 0) {
    lines.push("- No candidate files containing expected production key names were found.");
  } else {
    lines.push("| File | Matching Keys |", "| --- | --- |");
    for (const candidate of realCandidates) {
      lines.push(
        `| ${candidate.path.replace(/\|/g, "\\|")} | ${candidate.keys.join(", ")} |`,
      );
    }
  }

  lines.push(
    "",
    "## Documentation-Only Matches",
    "",
  );

  if (documentationOnly.length === 0) {
    lines.push("- No documentation-only env examples found.");
  } else {
    lines.push("| File | Matching Keys |", "| --- | --- |");
    for (const candidate of documentationOnly) {
      lines.push(
        `| ${candidate.path.replace(/\|/g, "\\|")} | ${candidate.keys.join(", ")} |`,
      );
    }
  }

  lines.push(
    "",
    "## Usage",
    "",
    "Pass a real env file into the readiness checker:",
    "",
    "```bash",
    'node ux-tests/utils/env-readiness.mjs --profile production --env-file "C:\\path\\to\\.env"',
    "```",
    "",
  );

  return `${lines.join("\n")}\n`;
}

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index === -1 ? null : args[index + 1] ?? null;
}

function valuesAfter(flag) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag && args[index + 1]) values.push(args[index + 1]);
  }
  return values;
}
