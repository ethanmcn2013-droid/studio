import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.cwd(), "..");
const products = [
  ["notes", "next.config.ts", false],
  ["tasks", "next.config.ts", true],
  ["roadmap", "next.config.ts", true],
  ["analytics", "next.config.ts", true],
];
for (const [repo, file, rollbackSwitch] of products) {
  const source = fs.readFileSync(path.join(root, repo, file), "utf8");
  if (!source.includes("Content-Security-Policy")) throw new Error(`${repo}: missing CSP header`);
  if (rollbackSwitch && !source.includes("SIGNAL_ENFORCE_CSP")) throw new Error(`${repo}: missing CSP rollback switch`);
  if (!source.includes("/api/csp-report")) throw new Error(`${repo}: missing CSP report endpoint`);
}
console.log("csp-contract: ok (4 products)");
