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
