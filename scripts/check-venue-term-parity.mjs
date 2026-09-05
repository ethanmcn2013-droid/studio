#!/usr/bin/env node
/**
 * The Venue Edition couple access term (R-015 · D-010 · D-022) is implemented
 * twice on purpose:
 *
 *   studio/src/lib/venue-edition.ts        — the shared entitlements store
 *   app/src/lib/venue-access-term.ts      — the production redemption write
 *
 * A fix applied to only one of them changes nothing a couple experiences, or
 * worse, gives two different answers to "when does their access end". The
 * golden-vector file is the contract between them: each repo runs its own
 * implementation against its own copy, and this check fails when the copies
 * drift apart.
 *
 * APP_REPO_PATH selects the paired checkout. An explicit missing consumer or
 * an unpaired CI run fails. Local single-repo reads retain an explicit skip.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const mine = path.join(root, "src/lib/venue-edition-term.vectors.json");
const explicitApp = process.env.APP_REPO_PATH;
if (explicitApp !== undefined && (!explicitApp || !path.isAbsolute(explicitApp))) {
  console.error("[venue-term-parity] APP_REPO_PATH must be absolute");
  process.exit(1);
}
const app = explicitApp ?? path.resolve(root, "../app");
const theirs = path.join(app, "src/lib/venue-edition-term.vectors.json");

const canonical = (file) =>
  createHash("sha256")
    .update(readFileSync(file, "utf8").replace(/^﻿/, "").replace(/\r\n?/g, "\n"))
    .digest("hex");

if (!existsSync(mine)) {
  console.error("[venue-term-parity] failed");
  console.error(`- missing ${mine}`);
  process.exit(1);
}

if (!existsSync(theirs)) {
  if (explicitApp !== undefined || process.env.CI) {
    console.error("[venue-term-parity] required App vectors are missing: " + theirs);
    process.exit(1);
  }
  console.log("[venue-term-parity] skipped — app repo not present beside studio");
  process.exit(0);
}

const a = canonical(mine);
const b = canonical(theirs);
if (a !== b) {
  console.error("[venue-term-parity] failed");
  console.error("- studio and app carry different access-term vectors.");
  console.error(`  studio src/lib/venue-edition-term.vectors.json  ${a}`);
  console.error(`  app    src/lib/venue-edition-term.vectors.json  ${b}`);
  console.error(
    "  Copy the intended version across, then run both suites. One repo alone is never the answer.",
  );
  process.exit(1);
}

console.log(`[venue-term-parity] ok (${a.slice(0, 12)})`);
