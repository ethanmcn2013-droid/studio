import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "..");
const contracts = [
  "suite-contracts.v1.json",
  "suite-contracts.v2.json",
  "commercial-terms.v1.json",
];
/**
 * Consumers of the suite contracts.
 *
 * Since the July 2026 consolidation there is one signed-in application, and it
 * lives in `tasks`. The former `notes`, `roadmap`, and `analytics` repositories
 * are provenance only, so their fixtures are frozen at whatever the contract
 * said when they stopped shipping. Checking them would report that history as
 * drift and train everyone to ignore this gate.
 */
const repoAliases = [["tasks", "tasks"]];
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
  `suite-contract-consumers: ok (unified app, suite v1+v2, commercial v1)`,
);

const readContract = JSON.parse(fs.readFileSync(path.join(process.cwd(), "contracts", "tasks-read-contract.v1.json"), "utf8"));
// Module paths in the unified app, not the pre-consolidation repo layout.
const readConsumers = [
  [["tasks"], "src/modules/signal/lib/briefing/tasks-read-contract.v1.json", "briefing"],
  [["tasks"], "src/modules/timeline/server/sync/tasks-read-contract.v1.json", "milestones"],
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

/**
 * venue-meaningful-action.v1 — the sponsored-use event contract.
 *
 * The emitter module is duplicated into the unified app because the two repos
 * deploy separately and there is no package registry in this suite. Duplication
 * without a gate is how two copies quietly diverge, so the machine-readable
 * contract is compared byte-for-byte here.
 */
const instrumentationContract = "venue-meaningful-action.v1.json";
const instrumentationCanonical = path.join(
  process.cwd(),
  "contracts",
  instrumentationContract,
);
if (fs.existsSync(instrumentationCanonical)) {
  const canonicalShape = JSON.stringify(
    JSON.parse(fs.readFileSync(instrumentationCanonical, "utf8")),
  );
  const consumer = path.join(
    root,
    "tasks",
    "src/lib/account/instrumentation",
    instrumentationContract,
  );
  if (!fs.existsSync(consumer)) {
    console.error(`tasks: missing ${instrumentationContract} fixture`);
    process.exit(1);
  }
  const consumerShape = JSON.stringify(JSON.parse(fs.readFileSync(consumer, "utf8")));
  if (consumerShape !== canonicalShape) {
    console.error(`tasks: ${instrumentationContract} differs from studio/contracts`);
    process.exit(1);
  }
  console.log("suite-contract-consumers: ok (venue-meaningful-action v1)");
}
