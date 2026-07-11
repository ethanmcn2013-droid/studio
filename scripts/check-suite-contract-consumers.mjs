import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "..");
const canonicalPath = path.join(process.cwd(), "contracts", "suite-contracts.v1.json");
const canonical = fs.readFileSync(canonicalPath, "utf8");
const consumers = ["analytics", "tasks", "roadmap", "notes"];
const errors = [];
for (const repo of consumers) {
  const file = path.join(root, repo, "src", "lib", "suite-contracts.v1.json");
  if (!fs.existsSync(file)) {
    errors.push(`${repo}: missing generated contract fixture`);
    continue;
  }
  if (fs.readFileSync(file, "utf8") !== canonical) {
    errors.push(`${repo}: fixture differs from studio/contracts/suite-contracts.v1.json`);
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`suite-contract-consumers: ok (${consumers.length} products)`);

const readContract = JSON.parse(fs.readFileSync(path.join(process.cwd(), "contracts", "tasks-read-contract.v1.json"), "utf8"));
const readConsumers = [
  ["analytics", "src/lib/briefing/tasks-read-contract.v1.json", "briefing"],
  ["roadmap", "src/server/sync/tasks-read-contract.v1.json", "milestones"],
];
for (const [repo, relative, operation] of readConsumers) {
  const file = path.join(root, repo, relative);
  if (!fs.existsSync(file)) {
    console.error(`${repo}: missing Tasks read contract fixture`);
    process.exit(1);
  }
  const fixture = JSON.parse(fs.readFileSync(file, "utf8"));
  if (fixture.version !== readContract.version || fixture.owner !== readContract.owner || fixture.operation !== operation || fixture.timeoutMs !== 2000 || fixture.scope !== "subject+workspace") {
    console.error(`${repo}: invalid Tasks read contract fixture`);
    process.exit(1);
  }
}
console.log("tasks-read-contract-consumers: ok (2 consumers)");
