import fs from "node:fs";
import path from "node:path";

const reportDir = path.join(process.cwd(), "ux-tests", "reports");

if (!fs.existsSync(reportDir)) {
  console.error("No UX reports directory exists yet.");
  process.exit(1);
}

const reports = fs
  .readdirSync(reportDir)
  .filter((name) => /^ux-report-.+\.md$/.test(name))
  .map((name) => ({
    name,
    path: path.join(reportDir, name),
    mtime: fs.statSync(path.join(reportDir, name)).mtimeMs,
  }))
  .sort((a, b) => b.mtime - a.mtime);

if (reports.length === 0) {
  console.error("No UX reports found yet.");
  process.exit(1);
}

const latest = reports[0];
console.log(latest.path);
console.log("");
console.log(fs.readFileSync(latest.path, "utf8"));
