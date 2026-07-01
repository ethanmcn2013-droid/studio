import fs from "node:fs";
import path from "node:path";

const reportDir = path.join(process.cwd(), "ux-tests", "reports");

if (!fs.existsSync(reportDir)) {
  console.error("No UX reports directory exists yet.");
  process.exit(1);
}

const files = fs
  .readdirSync(reportDir)
  .filter((name) => /\.(md|json)$/.test(name))
  .map((name) => {
    const fullPath = path.join(reportDir, name);
    return {
      name,
      mtime: fs.statSync(fullPath).mtime,
      kind: kindOf(name),
      summary: summaryFor(name, fullPath),
    };
  })
  .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

const indexMd = path.join(reportDir, "index.md");
const indexHtml = path.join(reportDir, "index.html");
fs.writeFileSync(indexMd, renderMarkdown(files), "utf8");
fs.writeFileSync(indexHtml, renderHtml(files), "utf8");

console.log(`Report index: ${indexMd}`);
console.log(`Report index: ${indexHtml}`);

function kindOf(name) {
  if (name.startsWith("first-pass-brief-")) return "first-pass brief";
  if (name.startsWith("ux-action-board-")) return "action board";
  if (name.startsWith("env-source-candidates-")) return "env source candidates";
  if (name.startsWith("ux-report-")) return "journey report";
  if (name.startsWith("ux-summary-")) return "run summary";
  if (name.startsWith("env-readiness-")) return "env readiness";
  return "artifact";
}

function summaryFor(name, fullPath) {
  if (name.endsWith(".json")) {
    try {
      const parsed = JSON.parse(fs.readFileSync(fullPath, "utf8"));
      const status = parsed.status ? `status ${parsed.status}` : null;
      const score =
        typeof parsed.averageScore === "number"
          ? `score ${parsed.averageScore.toFixed(1)}/10`
          : null;
      const missing =
        typeof parsed.missingRequiredEnv === "number"
          ? `${parsed.missingRequiredEnv} missing env`
          : null;
      return [status, score, missing].filter(Boolean).join(", ");
    } catch {
      return "";
    }
  }

  const text = fs.readFileSync(fullPath, "utf8");
  const status = /- Overall status: ([^\n]+)/.exec(text)?.[1];
  const score = /- (?:Average )?UX score: ([^\n]+)/.exec(text)?.[1];
  const decision = /- Decision: ([^\n]+)/.exec(text)?.[1];
  return [status ? `status ${status}` : null, score ? `score ${score}` : null, decision]
    .filter(Boolean)
    .join(", ");
}

function renderMarkdown(entries) {
  const lines = [
    "# Signal Studio UX Report Index",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "| Updated | Kind | File | Summary |",
    "| --- | --- | --- | --- |",
    ...entries.map(
      (entry) =>
        `| ${entry.mtime.toISOString()} | ${entry.kind} | [${entry.name}](${entry.name}) | ${escapeTable(entry.summary)} |`,
    ),
    "",
  ];
  return `${lines.join("\n")}\n`;
}

function renderHtml(entries) {
  const rows = entries
    .map(
      (entry) => `<tr>
  <td>${escapeHtml(entry.mtime.toISOString())}</td>
  <td>${escapeHtml(entry.kind)}</td>
  <td><a href="${encodeURI(entry.name)}">${escapeHtml(entry.name)}</a></td>
  <td>${escapeHtml(entry.summary)}</td>
</tr>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Signal Studio UX Report Index</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 32px; color: #171717; background: #f7f6f2; }
    h1 { font-size: 24px; letter-spacing: -0.02em; }
    table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #ddd8cc; }
    th, td { padding: 10px 12px; border-bottom: 1px solid #ebe7dc; text-align: left; font-size: 13px; vertical-align: top; }
    th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #666; background: #fbfaf7; }
    a { color: #252525; font-weight: 600; }
    p { color: #666; }
  </style>
</head>
<body>
  <h1>Signal Studio UX Report Index</h1>
  <p>Generated ${escapeHtml(new Date().toISOString())}</p>
  <table>
    <thead><tr><th>Updated</th><th>Kind</th><th>File</th><th>Summary</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>
`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeTable(value) {
  return String(value).replace(/\|/g, "\\|");
}
