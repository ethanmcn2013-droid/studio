/**
 * Authorization coverage guard — Signal HQ and the venue/couple boundary
 * (E08.04, E08.05).
 *
 * Two boundaries are protected here, both by source inspection. Neither
 * needs a database and neither needs the Next server, so this runs under
 * plain `node --test`.
 *
 *   1. **Every /hq surface is gated.** The edge gate in `src/proxy.ts`
 *      covers `/hq/:path*`, and each page re-checks. This test fails if
 *      the edge gate is removed or narrowed, and fails if a new page or
 *      route handler appears without its own check and without a written
 *      reason on the allowlist.
 *
 *   2. **The venue-facing read path cannot reach couple content.** The
 *      venue's view is built only from the entitlements database. The app
 *      database — Notes, Tasks, Timeline, Signal, everything the couple
 *      writes — is reachable from studio through `TASKS_DATABASE_URL`,
 *      and this test fails if any venue-facing module ever reaches for it.
 *      That reachability is exactly why the boundary needs a mechanism
 *      and not a convention.
 *
 * Run: node --test src/lib/hq/hq-authorization.test.mjs
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url)); // src/lib/hq
const repoRoot = join(here, "..", "..", ".."); // repo root
const hqDir = join(repoRoot, "src", "app", "hq");

function rel(file) {
  return relative(repoRoot, file).replaceAll("\\", "/");
}

function collect(dir, match) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...collect(full, match));
    else if (match(name)) out.push(full);
  }
  return out;
}

// ── 1a. The edge gate still exists and still covers the whole subtree ───

test("the proxy still gates the whole /hq subtree", () => {
  const proxyPath = join(repoRoot, "src", "proxy.ts");
  assert.ok(existsSync(proxyPath), "src/proxy.ts is gone — HQ has no edge gate");
  const src = readFileSync(proxyPath, "utf8");

  assert.ok(
    src.includes('"/hq/:path*"'),
    "the proxy matcher must still include /hq/:path* — without it the edge " +
      "gate never runs and HQ falls back to per-page checks alone.",
  );
  assert.ok(
    src.includes("verifyHqToken"),
    "the proxy must verify the session token through verifyHqToken. String " +
      "equality against a recomputed value is what E08.05 removed: it only " +
      "worked because the v1 token was derivable from the password.",
  );
  assert.ok(
    !/accessCookie\s*===\s*\(?await createHqAccessToken/.test(src),
    "the proxy must not compare the cookie against a freshly derived token",
  );
});

// ── 1b. Every /hq page and route handler is gated, or waived in writing ─

/**
 * Surfaces that legitimately carry no session check, each with the reason.
 * A new entry here is a decision someone has to defend in review; the
 * absence of an entry is a build failure.
 */
const UNGATED_ALLOWLIST = {
  "src/app/hq/access/page.tsx":
    "the sign-in form itself. Gating it would lock everyone out.",
  "src/app/hq/partners/page.tsx":
    "a bare redirect() to /hq/entitlements?tab=venues, which is gated. It " +
    "reads nothing and renders nothing.",
};

const GATE_TOKENS = [
  "verifyHqToken",
  "requireHqAccess",
  "HQ_ACCESS_COOKIE",
];

test("every /hq page and route handler is gated or explicitly waived", () => {
  const files = collect(
    hqDir,
    (name) => name === "page.tsx" || name === "route.ts",
  );

  assert.ok(
    files.length >= 50,
    `only found ${files.length} /hq surfaces — the scanner is broken, not the app`,
  );

  const ungated = [];
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    if (GATE_TOKENS.some((token) => src.includes(token))) continue;
    const key = rel(file);
    if (key in UNGATED_ALLOWLIST) continue;
    ungated.push(key);
  }

  assert.deepEqual(
    ungated,
    [],
    "These /hq surfaces carry no session check of their own. The edge gate " +
      "in proxy.ts still covers them, but defence in depth is the point: a " +
      "matcher change, a rewrite or a direct RSC invocation must not be the " +
      "only thing between an operator surface and the public. Add the check, " +
      "or add the file to UNGATED_ALLOWLIST with the reason:\n  " +
      ungated.join("\n  "),
  );

  // A stale allowlist entry is worse than none: it reads as a reviewed
  // decision about a file that no longer exists.
  const present = new Set(files.map(rel));
  const stale = Object.keys(UNGATED_ALLOWLIST).filter((k) => !present.has(k));
  assert.deepEqual(
    stale,
    [],
    `UNGATED_ALLOWLIST names files that no longer exist:\n  ${stale.join("\n  ")}`,
  );
});

// ── 1c. Nobody reimplements the session token ──────────────────────────

test("the session token is minted in exactly one place", () => {
  const sources = [
    ...collect(join(repoRoot, "src"), (n) => n.endsWith(".ts") || n.endsWith(".tsx")),
  ].filter((f) => !f.includes(".test."));

  const offenders = [];
  for (const file of sources) {
    const key = rel(file);
    if (key === "src/lib/hq/auth.ts") continue;
    const src = readFileSync(file, "utf8");
    // A second implementation of the token derivation would be invisible
    // to auth.ts's tests and would keep the v1 defect alive in one corner.
    if (src.includes("signal-hq-session:")) offenders.push(key);
  }

  assert.deepEqual(
    offenders,
    [],
    "Only src/lib/hq/auth.ts may construct the HQ session token. A second " +
      "derivation is a second security posture nobody is testing:\n  " +
      offenders.join("\n  "),
  );
});

// ── 2. The venue-facing read path cannot reach couple content ──────────

/**
 * Studio can reach the app database. `src/lib/hq/product-analytics.ts` and
 * `src/server/today/aggregate.ts` both open it through `TASKS_DATABASE_URL`
 * for the founder's own dashboards. That is allowed and is not venue-facing.
 *
 * These paths ARE venue-facing — they build what a venue is shown — and
 * must resolve from the entitlements database only.
 */
const VENUE_FACING_ROOTS = [
  "src/lib/account",
  "src/app/hq/account-review",
];

const APP_DATABASE_TOKENS = [
  "TASKS_DATABASE_URL",
  "TASKS_AUTH_TOKEN",
  "product-analytics",
  "server/today/aggregate",
];

test("no venue-facing module can reach the app database", () => {
  const offenders = [];
  let scanned = 0;

  for (const root of VENUE_FACING_ROOTS) {
    const dir = join(repoRoot, root);
    assert.ok(existsSync(dir), `${root} moved — update this guard`);
    for (const file of collect(
      dir,
      (n) => (n.endsWith(".ts") || n.endsWith(".tsx")) && !n.includes(".test."),
    )) {
      scanned++;
      const src = readFileSync(file, "utf8");
      for (const token of APP_DATABASE_TOKENS) {
        if (src.includes(token)) offenders.push(`${rel(file)} → ${token}`);
      }
    }
  }

  assert.ok(scanned >= 20, `only scanned ${scanned} venue-facing files — guard is broken`);
  assert.deepEqual(
    offenders,
    [],
    "A venue-facing module reached for the app database. Notes, Tasks, an " +
      "unpublished Timeline and a briefing are the couple's private work and " +
      "the venue never sees them (D-011, D-027 point 4). The venue's view is " +
      "built from the entitlements database only:\n  " +
      offenders.join("\n  "),
  );
});

/**
 * The projector is the last place couple content could enter the venue's
 * view, and it is pure, so the guard can be exact: the module that builds
 * the snapshot must not import a database client at all. It receives rows;
 * it never fetches them.
 */
test("the venue snapshot projector fetches nothing", () => {
  const projector = join(
    repoRoot,
    "src/lib/account/live/project-venue-access.ts",
  );
  assert.ok(existsSync(projector), "the venue projector moved — update this guard");
  const src = readFileSync(projector, "utf8");

  for (const forbidden of ["entitlementsDb", "drizzle", "@libsql", "fetch("]) {
    assert.ok(
      !src.includes(forbidden),
      `project-venue-access.ts must stay a pure projection over rows it is ` +
        `handed. Found "${forbidden}". A projector that can fetch is a ` +
        `projector that can widen its own scope.`,
    );
  }
});
