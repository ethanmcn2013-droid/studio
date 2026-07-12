import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "..");
const contracts = [
  "suite-contracts.v1.json",
  "suite-contracts.v2.json",
  "commercial-terms.v1.json",
];
const repoAliases = [
  ["analytics", "signal"],
  ["tasks", "tasks"],
  ["roadmap", "timeline"],
  ["notes", "notes"],
];
const errors = [];
for (const contract of contracts) {
  const canonical = fs.readFileSync(path.join(process.cwd(), "contracts", contract), "utf8");
  const canonicalShape = JSON.stringify(JSON.parse(canonical));
  for (const [canonicalRepo, worktreeRepo] of repoAliases) {
    const repo = fs.existsSync(path.join(root, canonicalRepo))
      ? canonicalRepo
      : worktreeRepo;
    const file = path.join(root, repo, "src", "lib", contract);
    if (!fs.existsSync(file)) {
      errors.push(`${repo}: missing generated ${contract} fixture`);
      continue;
    }
    const fixtureShape = JSON.stringify(JSON.parse(fs.readFileSync(file, "utf8")));
    if (fixtureShape !== canonicalShape) {
      errors.push(`${repo}: fixture differs from studio/contracts/${contract}`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  `suite-contract-consumers: ok (${repoAliases.length} products, suite v1+v2, commercial v1)`,
);

const readContract = JSON.parse(fs.readFileSync(path.join(process.cwd(), "contracts", "tasks-read-contract.v1.json"), "utf8"));
const readConsumers = [
  [["analytics", "signal"], "src/lib/briefing/tasks-read-contract.v1.json", "briefing"],
  [["roadmap", "timeline"], "src/server/sync/tasks-read-contract.v1.json", "milestones"],
];
for (const [aliases, relative, operation] of readConsumers) {
  const repo = aliases.find((candidate) => fs.existsSync(path.join(root, candidate)));
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
