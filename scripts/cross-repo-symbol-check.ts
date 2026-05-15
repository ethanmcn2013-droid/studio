#!/usr/bin/env tsx
/**
 * Cross-repo symbol check — proves whether a symbol (table name,
 * column, function, route, env var) is referenced anywhere in the
 * Signal Studio suite before it is declared dead and deleted.
 *
 * Why this exists (risk: cross-repo-migration-discipline):
 *   On 2026-05-12 an in-repo grep missed `log-cycle.ts`, a cross-repo
 *   writer, and it was nearly dropped as dead code. The standing rule
 *   (memory: feedback_cross_repo_grep) is: always grep across
 *   ~/Projects/personal/ before calling suite code dead. This script
 *   makes that rule a one-command, exit-coded check instead of a
 *   discipline anyone can forget.
 *
 * It is NOT a commit hook. Dead-code deletion is deliberate, not
 * continuous — this runs on demand, before the delete, as a gate the
 * operator/agent must clear:
 *
 *   pnpm check:dead "comp_codes"
 *   pnpm check:dead "sendExtractToTasks" "extract_body"
 *
 * Exit codes:
 *   0  — symbol found ONLY in the current repo (or nowhere): safe-ish
 *        to delete after local review.
 *   2  — symbol referenced in OTHER suite repos: NOT safe to delete
 *        without reconciling those references first.
 *   1  — usage error / environment problem.
 *
 * Searches every sibling repo under ~/Projects/personal/ (studio,
 * tasks, roadmap, analytics, notes). Excludes node_modules, .next,
 * .git, dist, out, _archive. Uses ripgrep if present, else `grep -r`.
 * Read-only: never writes, never stages, never blocks a commit.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const HOME = process.env.HOME ?? "";
const PERSONAL = path.join(HOME, "Projects", "personal");
const SUITE_REPOS = ["studio", "tasks", "roadmap", "analytics", "notes"];
const EXCLUDES = ["node_modules", ".next", ".git", "dist", "out", "_archive", "tsconfig.tsbuildinfo"];

function fail(msg: string): never {
  console.error(`cross-repo-symbol-check: ${msg}`);
  process.exit(1);
}

const symbols = process.argv.slice(2).filter((s) => s.trim().length > 0);
if (symbols.length === 0) {
  fail(
    'no symbols given.\n  usage: pnpm check:dead "<symbol>" ["<symbol>" ...]\n  e.g.   pnpm check:dead "comp_codes" "extract_body"',
  );
}

let currentRepo = "";
try {
  const root = execSync("git rev-parse --show-toplevel", { stdio: ["ignore", "pipe", "ignore"] })
    .toString()
    .trim();
  currentRepo = path.basename(root);
} catch {
  // Not in a git repo — treat all hits as "other".
  currentRepo = "";
}

const hasRg = (() => {
  try {
    execSync("rg --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();

function searchRepo(repoPath: string, symbol: string): string[] {
  if (!fs.existsSync(repoPath)) return [];
  const excludeArgs = hasRg
    ? EXCLUDES.map((e) => `--glob '!**/${e}/**'`).join(" ")
    : EXCLUDES.map((e) => `--exclude-dir='${e}'`).join(" ");
  // Fixed-string, not regex: a table/column/function name is literal.
  const cmd = hasRg
    ? `rg --fixed-strings --files-with-matches ${excludeArgs} -- ${JSON.stringify(symbol)} ${JSON.stringify(repoPath)}`
    : `grep -rlF ${excludeArgs} -- ${JSON.stringify(symbol)} ${JSON.stringify(repoPath)}`;
  try {
    const out = execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    return out ? out.split("\n").filter(Boolean) : [];
  } catch (e: unknown) {
    // ripgrep/grep exit 1 == no matches. That is not an error.
    const status = (e as { status?: number }).status;
    if (status === 1) return [];
    throw e;
  }
}

let referencedElsewhere = false;
let anyHit = false;

for (const symbol of symbols) {
  console.log(`\n── ${symbol} ──`);
  let symbolElsewhere = false;
  for (const repo of SUITE_REPOS) {
    const repoPath = path.join(PERSONAL, repo);
    const hits = searchRepo(repoPath, symbol);
    if (hits.length === 0) continue;
    anyHit = true;
    const isCurrent = repo === currentRepo;
    if (!isCurrent) {
      referencedElsewhere = true;
      symbolElsewhere = true;
    }
    const tag = isCurrent ? "(current repo)" : "← OTHER REPO";
    console.log(`  ${repo} ${tag}: ${hits.length} file(s)`);
    for (const h of hits) console.log(`    ${path.relative(PERSONAL, h)}`);
  }
  if (!anyHit) console.log("  no references anywhere in the suite.");
  else if (!symbolElsewhere) console.log("  only in the current repo.");
}

console.log("");
if (referencedElsewhere) {
  console.error(
    "REFERENCED IN OTHER SUITE REPOS — not safe to delete. Reconcile the cross-repo references above first.",
  );
  process.exit(2);
}
console.log("No cross-repo references. Safe to delete after local review (current repo only).");
process.exit(0);
