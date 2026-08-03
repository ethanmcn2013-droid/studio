import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "..");
const contracts = [
  "suite-contracts.v1.json",
  "suite-contracts.v2.json",
  "commercial-terms.v1.json",
  "commercial-terms.v2.json",
];
/**
 * Consumers of the suite contracts.
 *
 * Since the July 2026 consolidation there is one signed-in application. It was
 * called `tasks`; the July 2026 infrastructure reset renamed the directory to
 * `app`. The former `notes`, `roadmap`, and `analytics` repositories are
 * provenance only, so their fixtures are frozen at whatever the contract said
 * when they stopped shipping. Checking them would report that history as drift
 * and train everyone to ignore this gate.
 *
 * The alias below carried the old name on both sides, so after the rename this
 * gate reported "missing generated fixture" for every contract and stopped
 * checking anything. Found while shipping commercial-terms.v2 (VEF-2026 WP-10).
 */
const repoAliases = [["tasks", "app"]];
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
  `suite-contract-consumers: ok (unified app, suite v1+v2, commercial v1+v2)`,
);

const readContract = JSON.parse(fs.readFileSync(path.join(process.cwd(), "contracts", "tasks-read-contract.v1.json"), "utf8"));
// Module paths in the unified app, not the pre-consolidation repo layout.
const readConsumers = [
  [["app", "tasks"], "src/modules/signal/lib/briefing/tasks-read-contract.v1.json", "briefing"],
  [["app", "tasks"], "src/modules/timeline/server/sync/tasks-read-contract.v1.json", "milestones"],
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
  const appRepo = fs.existsSync(path.join(root, "app")) ? "app" : "tasks";
  const consumer = path.join(
    root,
    appRepo,
    "src/lib/account/instrumentation",
    instrumentationContract,
  );
  if (!fs.existsSync(consumer)) {
    console.error(`${appRepo}: missing ${instrumentationContract} fixture`);
    process.exit(1);
  }
  const consumerShape = JSON.stringify(JSON.parse(fs.readFileSync(consumer, "utf8")));
  if (consumerShape !== canonicalShape) {
    console.error(`${appRepo}: ${instrumentationContract} differs from studio/contracts`);
    process.exit(1);
  }
  console.log("suite-contract-consumers: ok (venue-meaningful-action v1)");
}
