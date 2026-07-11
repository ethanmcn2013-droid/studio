import fs from "node:fs";
import path from "node:path";

const workspace = path.resolve(process.cwd(), "..");
const files = [
  ["analytics", "src/lib/briefing/tasks-db-source.ts"],
  ["analytics", "src/lib/data/source.ts"],
  ["roadmap", "src/server/sync/tasks-milestone-source.ts"],
  ["roadmap", "src/server/sync/tasks-workspace-prefs.ts"],
  ["tasks", "src/server/db/queries.ts"],
  ["tasks", "src/app/api/internal/workspace-personalization/route.ts"],
  ["notes", "src/server/tasks-personalization.ts"],
];
const forbidden = [
  /SELECT\s+id\s+FROM\s+users\s+WHERE\s+email\s*=/i,
  /WHERE\s+email\s*=\s*\?/i,
  /getMilestonesForEmail/,
  /\?email=/,
  /eq\(users\.email/,
];

const violations = [];
for (const [repo, relative] of files) {
  const file = path.join(workspace, repo, relative);
  const source = fs.readFileSync(file, "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(source)) violations.push(`${repo}/${relative}: ${pattern}`);
  }
}

if (violations.length) {
  console.error("Forbidden email authorization joins found:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}
console.log(`identity-joins: ok (${files.length} surfaces checked)`);
