import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "..");
// CI can select its matching release checkout explicitly. Never fall back to
// another checkout when an explicit path is invalid or its contracts drift.
function resolveAppRepo() {
  const explicit = process.env.APP_REPO_PATH;
  const candidate = explicit === undefined
    ? path.join(root, fs.existsSync(path.join(root, "app")) ? "app" : "tasks")
    : explicit;
  if (!candidate || !path.isAbsolute(candidate)) {
    throw new Error("APP_REPO_PATH must be an absolute App checkout path.");
  }
  if (!fs.existsSync(candidate) || !fs.statSync(candidate).isDirectory()) {
    throw new Error(`App checkout directory does not exist: ${candidate}`);
  }
  const resolved = fs.realpathSync(candidate);
  const manifest = path.join(resolved, "package.json");
  if (!fs.existsSync(manifest) ||
      !["app", "tasks"].includes(JSON.parse(fs.readFileSync(manifest, "utf8")).name) ||
      !fs.existsSync(path.join(resolved, "src", "modules", "signal")) ||
      !fs.existsSync(path.join(resolved, "src", "modules", "timeline"))) {
    throw new Error(`Not a unified App checkout: ${resolved}`);
  }
  return resolved;
}
let appRepo;
try {
  appRepo = resolveAppRepo();
} catch (error) {
  console.error(`suite-contract-consumers: ${error.message}`);
  process.exit(1);
}
console.log(`suite-contract-consumers: App source ${appRepo}`);
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
 * The default is the canonical sibling app/ layout, with tasks/ retained only
 * as a legacy fallback. APP_REPO_PATH selects the same checkout for every gate.
 */
const errors = [];
for (const contract of contracts) {
  const canonical = fs.readFileSync(path.join(process.cwd(), "contracts", contract), "utf8");
  const canonicalShape = JSON.stringify(JSON.parse(canonical));
  const file = path.join(appRepo, "src", "lib", contract);
  if (!fs.existsSync(file)) {
    errors.push(`${appRepo}: missing generated ${contract} fixture`);
    continue;
  }
  const fixtureShape = JSON.stringify(JSON.parse(fs.readFileSync(file, "utf8")));
  if (fixtureShape !== canonicalShape) {
    errors.push(`${appRepo}: fixture differs from studio/contracts/${contract}`);
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
  ["src/modules/signal/lib/briefing/tasks-read-contract.v1.json", "briefing"],
  ["src/modules/timeline/server/sync/tasks-read-contract.v1.json", "milestones"],
];
for (const [relative, operation] of readConsumers) {
  const file = path.join(appRepo, relative);
  if (!fs.existsSync(file)) {
    console.error(`${appRepo}: missing Tasks read contract fixture (${operation})`);
    process.exit(1);
  }
  const fixture = JSON.parse(fs.readFileSync(file, "utf8"));
  if (fixture.version !== readContract.version || fixture.owner !== readContract.owner || fixture.operation !== operation || fixture.timeoutMs !== 2000 || fixture.scope !== "subject+workspace") {
    console.error(`${appRepo}: invalid Tasks read contract fixture (${operation})`);
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
