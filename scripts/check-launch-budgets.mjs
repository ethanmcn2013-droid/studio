import fs from "node:fs";

const budgets = JSON.parse(fs.readFileSync("contracts/launch-budgets.v1.json", "utf8"));
const required = ["webVitals", "authenticated", "data", "delivery", "accessibility"];
const measurementsPath = "docs/signal-studio-review/evidence/launch-budget-measurements.json";
const measurements = fs.existsSync(measurementsPath)
  ? JSON.parse(fs.readFileSync(measurementsPath, "utf8"))
  : {};
const missing = required.filter((key) => measurements[key] == null);
const failures = [];
if (measurements.webVitals?.lcpP75Ms > budgets.public.lcpP75Ms) failures.push("public LCP");
if (measurements.webVitals?.inpP75Ms > budgets.public.inpP75Ms) failures.push("public INP");
if (measurements.webVitals?.clsP75 > budgets.public.clsP75) failures.push("public CLS");
if (measurements.data?.queriesPerPage > budgets.data.queriesPerPage) failures.push("queries/page");
if (measurements.data?.crossProductTimeoutMs > budgets.data.crossProductTimeoutMs) failures.push("cross-product timeout");
const result = { ok: missing.length === 0 && failures.length === 0, missing, failures, budgetsVersion: budgets.version };
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 2;
