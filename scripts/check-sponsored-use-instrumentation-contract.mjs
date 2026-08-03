#!/usr/bin/env node
/**
 * Source-level guard on the sponsored-use ingest and nightly handlers.
 *
 * The properties below are the ones that go wrong silently. A regression in any
 * of them produces no test failure elsewhere, no error at runtime, and no
 * symptom until a venue is shown a number that is wrong or a night's evidence
 * has already been deleted.
 *
 * Run: node scripts/check-sponsored-use-instrumentation-contract.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const ROOT = process.cwd();
const APP = join(ROOT, "..", "app");

const read = (p) => readFileSync(join(ROOT, p), "utf8");
const failures = [];

function check(label, condition, detail = "") {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const ingest = read("src/app/api/internal/sponsored-use/route.ts");
const cron = read("src/app/api/cron/sponsored-use/route.ts");
const opsGrant = read("src/app/api/internal/entitlements/grant/route.ts");
const schema = read("src/lib/account/instrumentation/event-schema.ts");

console.log("ingest route authentication");
check(
  "bearer compared in constant time, like the neighbouring internal routes",
  /timingSafeEqual/.test(ingest) && /Bearer/i.test(ingest),
);
check(
  "refuses when the secret is unset, so an unconfigured deploy is closed",
  /if \(!expected\) return false/.test(ingest),
);
check(
  "the neighbouring ops routes use the same mechanism",
  /timingSafeEqual/.test(opsGrant),
);
check(
  // The name may appear in a comment explaining why it is not used. It may not
  // appear as a read.
  "does NOT reuse STUDIO_OPS_SECRET, which grants and expires entitlements",
  !/process\.env\.STUDIO_OPS_SECRET/.test(ingest),
  "a leak from the product deployment would be able to mint access",
);
check(
  "uses its own credential",
  ingest.includes("SPONSOR_USAGE_INGEST_SECRET"),
);

console.log("\ningest rejects rather than strips");
check(
  "the parsed body goes to validation untouched",
  /ingestMeaningfulAction\(body,/.test(ingest),
  "a reshape here would silently restore the trimming the contract forbids",
);
check(
  "no field-by-field pick of the event before validation",
  !/const \{\s*eventId/.test(ingest),
);
check(
  "forbidden keys are rejected at every depth, not removed",
  /return \{ ok: false, reason: `forbidden field/.test(schema) &&
    /findForbiddenKey\(nested, depth \+ 1\)/.test(schema),
);
check(
  "a refusal answers 4xx so the sink counts it rather than retrying forever",
  /status: outcome\.reason === "salt-unavailable" \? 503 : 400/.test(ingest),
);
check(
  "a missing salt stores nothing at all",
  /salt-unavailable/.test(ingest) && /salt\.length >= 16/.test(ingest),
);

console.log("\nnightly ordering");
check(
  "the cron handler runs the sequence, it does not call the sweep itself",
  /runNightlyMaintenance/.test(cron),
);
check(
  "the handler no longer reaches for sweepExpiredEvents directly",
  !/sweepExpiredEvents/.test(cron),
  "an unguarded sweep is the one change that destroys evidence",
);
check(
  "the comment that justified the unguarded sweep is gone",
  !/safe\s+to run today/.test(cron),
  "it was true only while the events table was empty",
);
check(
  "the sealing interlock is in the response, not only in a document",
  /sealingInterlock/.test(cron) && /MAX_SEALING_GAP_DAYS/.test(cron),
);
check(
  "a breached cadence or a failed step answers non-2xx so alerting fires",
  /status: outcome\.ok \? 200 : 500/.test(cron),
);

console.log("\nthe duplicated contract stays in step across both repos");
const appSchemaPath = join(APP, "src/lib/account/instrumentation/event-schema.ts");
if (!existsSync(appSchemaPath)) {
  console.log("  skip the app repo is not checked out beside studio");
} else {
  const digest = (s) => createHash("sha256").update(s).digest("hex");
  const appSchema = readFileSync(appSchemaPath, "utf8");
  check(
    "app and studio event-schema.ts are byte-identical",
    digest(appSchema) === digest(schema),
    "the app emits against it and studio ingests against it; a one-sided " +
      "change lets a product emit something ingest silently rejects",
  );
  const contract = JSON.parse(
    readFileSync(
      join(APP, "src/lib/account/instrumentation/venue-meaningful-action.v1.json"),
      "utf8",
    ),
  );
  const kindsFromSource = Object.fromEntries(
    [...schema.matchAll(/^\s{2}(notes|tasks|timeline|signal):\s*\[([^\]]*)\]/gms)].map(
      ([, product, body]) => [
        product,
        [...body.matchAll(/"([a-z_]+)"/g)].map((m) => m[1]),
      ],
    ),
  );
  for (const product of ["notes", "tasks", "timeline", "signal"]) {
    check(
      `${product} kinds match between the schema and the JSON contract`,
      JSON.stringify(kindsFromSource[product]) ===
        JSON.stringify(contract.kinds[product]),
      `${JSON.stringify(kindsFromSource[product])} vs ${JSON.stringify(contract.kinds[product])}`,
    );
  }
  check(
    "the retired kind is allowlisted nowhere",
    !JSON.stringify(contract.kinds).includes("timeline_visibility_changed") &&
      !/^\s+"timeline_visibility_changed"/m.test(schema),
  );
}

console.log("\nthe retired dictionary name is not pinned in code");
const pins = [
  ["src/lib/entitlements-db/schema.ts", read("src/lib/entitlements-db/schema.ts")],
  ["src/lib/account/instrumentation/event-schema.ts", schema],
];
for (const [name, source] of pins) {
  check(
    `${name} does not pin venue-metrics.v1`,
    !/METRIC_DICTIONARY_VERSION = "venue-metrics\.v1"/.test(source),
  );
}

/**
 * The name also survives as a SQL column DEFAULT, which is worse than a constant:
 * a row inserted without an explicit version silently lands under the retired
 * dictionary. Two paths create these tables — the drizzle baseline plus its
 * forward migration, guarded by check-entitlements-migrations.mjs, and this
 * hand-run script wired to `npm run account:migrate-usage`. The first guard cannot
 * see the second path, which is how both defaults survived a sweep that reported
 * clean. Verified 2026-08-03 (Wave 2, WP-06).
 */
const sqlPins = [
  "scripts/migrate-sponsor-usage.mjs",
  "drizzle-entitlements/0001_account_metrics_v2_and_drift_closure.sql",
];
for (const name of sqlPins) {
  let source;
  try {
    source = read(name);
  } catch {
    // A path that has not landed yet is not a failure; a path that has landed
    // and carries the retired default is.
    continue;
  }
  check(
    `${name} does not default a column to venue-metrics.v1`,
    !/DEFAULT\s+'venue-metrics\.v1'/i.test(source),
  );
}

console.log("");
if (failures.length > 0) {
  console.error(`${failures.length} check(s) failed:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("sponsored-use instrumentation contract holds.");
