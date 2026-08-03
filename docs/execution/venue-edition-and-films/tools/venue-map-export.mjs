#!/usr/bin/env node
/**
 * venue-map-export.mjs — builds the render payload for the film map (E13.03,
 * E13.04) and refuses to write it if a venue could be identified from it.
 *
 * WHY THIS TOOL EXISTS AT ALL. signal-motion renders the map, and signal-motion
 * may not read `private/venues.csv`: that file is gitignored, it holds real
 * organisations, and every fixture in that repository is declared
 * `fictional: true`. A committed venue dataset in a render repository is how a
 * repository share becomes a disclosure. So the film never carries the data —
 * this tool produces a payload at render time, the payload is passed on the
 * command line, and nothing about a real venue is ever committed.
 *
 * WHAT IS AND IS NOT PUBLISHABLE. `consent_public_naming` and
 * `consent_map_publication` are recorded per account. A name travels only when
 * `consent_map_publication` is the literal string `granted`. Every other value —
 * `unknown`, blank, `refused`, `pending`, anything a future column edit invents —
 * is not consent. Today no account has granted it, so today every pin in every
 * cohort is anonymous. That is the correct output of this tool, not a bug in it,
 * and the summary prints the count so nobody has to infer it.
 *
 * Counts and clusters are safe to report. A venue name is not. Nothing this tool
 * prints to stdout ever names a venue, including in its error messages — a guard
 * that quotes the leaked value has leaked it a second time.
 *
 * WHAT IS DELIBERATELY COARSE. Pin coordinates are rounded to four decimal
 * places, roughly eleven metres. That is more than enough to place a dot on a map
 * covering 155 km and far too little to be an address. The anchor is NOT rounded:
 * it is the O'Connell Monument, a public civic landmark and the ratified
 * projection origin under D-012, and signal-motion asserts it to every published
 * digit. Rounding it would silently move the origin of the whole map.
 *
 * COHORTS 3 AND 4. The ratified 45-minute ring does not contain four cohorts of
 * twenty-five. It contains 43 contactable accounts: cohort 1 fills at 25, cohort
 * 2 is 16, cohort 3 is 2, and there is no cohort 4. `venue-universe/03-UNIVERSE.md`
 * section 5 says to stop recording cohorts 3 and 4 as though they exist. This tool
 * refuses a cohort that is not in the file and warns, loudly, on the two that are
 * real but short. A pipeline that assumes four full cohorts renders fiction.
 *
 * Commands
 *   --cohort=<n>          required. The cohort to build a payload for.
 *   --out=<path>          default private/map-payload.json (gitignored).
 *
 *   node tools/venue-map-export.mjs --cohort=1
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { guardText } from "./venue-export.mjs";
import { ANCHOR, clusterFor, ringFor } from "./venue-geo.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const VENUES_CSV = join(ROOT, "private", "venues.csv");
const COHORTS_JSON = join(ROOT, "private", "cohort-convert.json");
const DEFAULT_OUT = join(ROOT, "private", "map-payload.json");

/* ----------------------------------------------------------------- contract */

/** The wire version. signal-motion's `src/fixtures/schemas/limerick-map.ts`
 *  parses against this exact literal, so changing it is a breaking change to the
 *  render and both sides move together. */
export const SCHEMA_VERSION = "signal-map-payload/v1";

/** Roughly 11 m of latitude. A map pin, not an address. */
export const COORDINATE_DECIMALS = 4;

/**
 * The only value of `consent_map_publication` that permits a name on the map.
 *
 * Compared as a literal string after trimming, and nothing else is treated as
 * consent. An `unknown`, a blank, a `pending`, a typo, or a column that a future
 * import fills with `TRUE` all mean the same thing here: no name.
 */
export const CONSENT_GRANTED = "granted";

/** Length of the hex digest carried in a pin id. 48 bits; collisions across a
 *  219-account universe are not a practical concern and are checked anyway. */
export const PIN_ID_HEX_LENGTH = 12;

/**
 * Domain separation for the pin hash, so a digest from this tool cannot be
 * confused with a digest of the same account id computed for another purpose.
 */
const PIN_ID_DOMAIN = `${SCHEMA_VERSION}/pin`;

/**
 * The `pin_` prefix is load-bearing and is not decoration.
 *
 * `guardText` scans the rendered output for Irish phone numbers with
 * `\b0(8[3-9]|6[1-9]|21|1)...`. A bare hex digest that happened to come out as
 * twelve digits beginning `061` is a Limerick landline as far as that regex is
 * concerned, and a legitimate export would be refused with a message about
 * personal data that nobody could act on. A leading `pin_` removes the word
 * boundary before the digits, so the class of false positive cannot occur. A
 * guard that blocks a legitimate export is a guard somebody switches off.
 */
const PIN_ID_PREFIX = "pin_";

/**
 * Columns that must never exist, whatever a future caller thinks it needs.
 *
 * Duplicated from `venue-export.mjs`, which does not export its copy and which
 * this package may not modify. Kept in the same order and with the same entries
 * so a diff between the two files is a one-line read.
 */
const FORBIDDEN_COLUMNS = [
  "contact_name", "contact", "name_of_contact", "email", "email_address", "e_mail",
  "phone", "telephone", "mobile", "postal_address", "address", "linkedin",
  "linkedin_url", "twitter_handle", "personal_email", "direct_dial", "first_name",
  "last_name", "surname",
];

/**
 * Rings the map draws. `out` is absent on purpose: an account outside the market
 * has no dot on a cohort map, and a payload carrying one is a data fault rather
 * than something to render quietly.
 */
const IN_MARKET_RINGS = ["15", "30", "45", "borderline_45_60"];

/** The twelve ratified clusters, from `venue-geo.mjs`. `out_of_market` and
 *  `unclassified` are both faults in a cohort payload, so neither is listed. */
const CLUSTER_IDS = [
  "south_galway", "north_kerry", "limerick_city", "west_limerick", "east_limerick",
  "south_limerick", "shannon_estuary", "ennis_mid_clare", "lough_derg",
  "north_tipperary", "tipperary_aherlow", "north_cork",
];

/* ---------------------------------------------------------------------- csv */

/**
 * Parse the operational CSV. Quoted fields, doubled quotes, embedded commas and
 * newlines — `fit_reason` and `notes` are free prose and all three occur.
 *
 * Deliberately not a split on commas. The first venue whose notes contain a
 * comma would silently shift every column after it, and the column that would
 * shift into `consent_map_publication` is the one that decides whether a name
 * gets published.
 */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c !== '"') { field += c; continue; }
      if (text[i + 1] === '"') { field += '"'; i += 1; continue; }
      quoted = false;
      continue;
    }
    if (c === '"') { quoted = true; continue; }
    if (c === ",") { row.push(field); field = ""; continue; }
    if (c === "\n") { row.push(field); field = ""; rows.push(row); row = []; continue; }
    if (c === "\r") continue;
    field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1)
    .filter((r) => r.length > 1)
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

/* ------------------------------------------------------------------- pin id */

/**
 * A stable opaque id for one account.
 *
 * Never the venue name, and never the account id itself. `VEN-0002` through
 * `VEN-0220` are sequential, so publishing them would publish the research order
 * — which accounts were found first, and therefore which were ranked and
 * approached first. A truncated SHA-256 over a domain-separated string destroys
 * that ordering while staying stable across runs, so a pin keeps its identity
 * between a draft render and a final one.
 *
 * STATED PLAINLY: this is a pseudonym, not a secret. Anyone holding the account
 * id space can hash all 219 and invert it. That is acceptable because an account
 * id is itself a pseudonym that means nothing without the private CSV. It is not
 * acceptable to describe this as anonymisation, and this comment exists so nobody
 * later relies on it as though it were.
 */
export function pinIdFor(accountId) {
  const digest = createHash("sha256").update(`${PIN_ID_DOMAIN}:${accountId}`).digest("hex");
  return `${PIN_ID_PREFIX}${digest.slice(0, PIN_ID_HEX_LENGTH)}`;
}

/** Round to the published precision. `Number` drops the trailing zeros so the
 *  JSON carries a number, not a string, and 52.6 does not become 52.6000. */
export const roundCoordinate = (value) => Number(Number(value).toFixed(COORDINATE_DECIMALS));

/* ------------------------------------------------------------------- build */

/**
 * Build the payload for one cohort. Pure: takes parsed inputs, returns
 * `{ payload, findings, warnings, counts }` and writes nothing.
 *
 * Every fatal condition is collected rather than thrown on first sight, so a run
 * against a broken file reports all of it at once instead of one problem per
 * rerun.
 */
export function buildPayload(venueRows, convert, cohortNumber) {
  const findings = [];
  const warnings = [];

  const cohort = (convert.cohorts ?? []).find((c) => c.number === cohortNumber);
  if (!cohort) {
    const present = (convert.cohorts ?? []).map((c) => c.number).join(", ");
    findings.push({
      where: `--cohort=${cohortNumber}`,
      kind:
        cohortNumber === 4
          ? "cohort 4 does not exist. The ratified 45-minute ring holds 43 contactable "
            + "accounts in total, which fills one cohort and part of a second. There is no "
            + "fourth cohort to render. See venue-universe/03-UNIVERSE.md section 5"
          : `no cohort ${cohortNumber} in cohort-convert.json (present: ${present || "none"})`,
    });
    return { payload: null, findings, warnings, counts: null };
  }

  if (cohort.short > 0) {
    warnings.push(
      `Cohort ${cohort.number} holds ${cohort.size} accounts and is short by ${cohort.short} `
      + `against the twenty-five D-017 ratifies. This payload draws ${cohort.size} pins. `
      + `Do not present it as a full cohort.`,
    );
  }
  const missingCohorts = [1, 2, 3, 4].filter(
    (n) => !(convert.cohorts ?? []).some((c) => c.number === n),
  );
  if (missingCohorts.length) {
    const plural = missingCohorts.length > 1;
    warnings.push(
      `Cohort${plural ? "s" : ""} ${missingCohorts.join(", ")} ${plural ? "do" : "does"} not exist `
      + `in the ratified ring. 03-UNIVERSE.md section 5 asks that ${plural ? "they" : "it"} stop being `
      + `recorded as though ${plural ? "they do" : "it does"}.`,
    );
  }

  const byAccount = new Map(venueRows.map((row) => [row.account_id, row]));
  const pins = [];
  const seenPinIds = new Set();

  for (const member of cohort.venues) {
    const accountId = member.account_id;
    const row = byAccount.get(accountId);
    if (!row) {
      findings.push({ where: `cohort position ${member.position}`, kind: "account is not in venues.csv" });
      continue;
    }

    const latitude = Number(row.latitude);
    const longitude = Number(row.longitude);
    if (row.latitude === "" || row.longitude === "" || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      findings.push({ where: `cohort position ${member.position}`, kind: "coordinates are missing or not numeric" });
      continue;
    }

    const ring = row.drive_time_ring;
    if (!IN_MARKET_RINGS.includes(ring)) {
      findings.push({
        where: `cohort position ${member.position}`,
        kind: `drive_time_ring "${ring || "(blank)"}" is not a ring this map draws`,
      });
      continue;
    }
    // The ring the CSV stores against the minutes the cohort file stores. These
    // are written by two different runs of two different tools, and a
    // disagreement means one of them is stale — which would put a dot in the
    // wrong band in a film sent to the venue on that dot.
    const derivedRing = ringFor(member.drive_minutes);
    if (derivedRing !== null && derivedRing !== ring) {
      findings.push({
        where: `cohort position ${member.position}`,
        kind: `drive_time_ring "${ring}" disagrees with ringFor(${member.drive_minutes}) = "${derivedRing}"`,
      });
      continue;
    }

    const cluster = row.cluster;
    if (!CLUSTER_IDS.includes(cluster)) {
      findings.push({
        where: `cohort position ${member.position}`,
        kind: `cluster "${cluster || "(blank)"}" is not one of the twelve ratified clusters`,
      });
      continue;
    }
    // Same reasoning, for the cluster: re-derived from the coordinate rather
    // than trusted from the column.
    const derivedCluster = clusterFor(latitude, longitude, ring);
    if (derivedCluster.id !== cluster) {
      findings.push({
        where: `cohort position ${member.position}`,
        kind: `cluster "${cluster}" disagrees with clusterFor(coordinate) = "${derivedCluster.id}"`,
      });
      continue;
    }

    const consent = (row.consent_map_publication ?? "").trim();
    const named = consent === CONSENT_GRANTED;
    const name = named ? row.venue_name : null;
    if (named && (!name || name.length === 0)) {
      findings.push({ where: `cohort position ${member.position}`, kind: "consent granted but the account has no name to publish" });
      continue;
    }

    const pinId = pinIdFor(accountId);
    if (seenPinIds.has(pinId)) {
      findings.push({ where: `cohort position ${member.position}`, kind: "pin id collision" });
      continue;
    }
    seenPinIds.add(pinId);

    pins.push({
      pinId,
      lat: roundCoordinate(latitude),
      lon: roundCoordinate(longitude),
      ring,
      cluster,
      named,
      name,
    });
  }

  const payload = {
    schemaVersion: SCHEMA_VERSION,
    generatedFor: { cohort: cohort.number, size: pins.length },
    // Full precision on purpose. See the header: this is the ratified projection
    // origin, not a venue, and signal-motion asserts it to every digit.
    anchor: { lat: ANCHOR.latitude, lon: ANCHOR.longitude },
    pins,
  };

  const counts = {
    requested: cohort.venues.length,
    written: pins.length,
    byRing: tally(pins, "ring", IN_MARKET_RINGS),
    byCluster: tally(pins, "cluster", CLUSTER_IDS),
    named: pins.filter((p) => p.named).length,
    consentGranted: cohort.venues.filter(
      (m) => (byAccount.get(m.account_id)?.consent_map_publication ?? "").trim() === CONSENT_GRANTED,
    ).length,
  };

  if (counts.written !== counts.requested) {
    findings.push({
      where: `cohort ${cohort.number}`,
      kind: `${counts.requested - counts.written} of ${counts.requested} accounts did not produce a pin`,
    });
  }

  return { payload, findings, warnings, counts };
}

function tally(rows, key, order) {
  const t = {};
  for (const row of rows) t[row[key]] = (t[row[key]] || 0) + 1;
  return order.filter((k) => t[k]).map((k) => [k, t[k]]);
}

/* ------------------------------------------------------------------- guard */

/**
 * The fatal guard. Modelled on `venue-export.mjs`: findings are returned as
 * `{where, kind}` and never carry the offending value, every one of them is
 * fatal, and a single finding means nothing is written at all.
 *
 * Three layers, because they catch different mistakes:
 *   structure   the payload's own invariants — a name where there must not be
 *               one, a missing coordinate, a duplicate pin
 *   keys        a forbidden contact column that arrived as an object key,
 *               anywhere at any depth
 *   text        the serialised bytes, scanned for an email address or a phone
 *               number by the same regexes the CSV export uses
 */
export function guardPayload(payload) {
  const findings = [];

  if (payload.schemaVersion !== SCHEMA_VERSION) {
    findings.push({ where: "schemaVersion", kind: `expected ${SCHEMA_VERSION}` });
  }
  if (payload.generatedFor.size !== payload.pins.length) {
    findings.push({
      where: "generatedFor.size",
      kind: `${payload.generatedFor.size} declared against ${payload.pins.length} pins`,
    });
  }
  if (payload.anchor.lat !== ANCHOR.latitude || payload.anchor.lon !== ANCHOR.longitude) {
    findings.push({ where: "anchor", kind: "is not the ratified projection origin" });
  }

  const seen = new Set();
  payload.pins.forEach((pin, i) => {
    const where = `pins[${i}]`;
    if (!pin.named && pin.name !== null) {
      findings.push({ where, kind: "carries a name while named is false" });
    }
    if (pin.named && (typeof pin.name !== "string" || pin.name.length === 0)) {
      findings.push({ where, kind: "named is true with no name" });
    }
    if (!Number.isFinite(pin.lat) || !Number.isFinite(pin.lon)) {
      findings.push({ where, kind: "coordinates are missing" });
    }
    if (!IN_MARKET_RINGS.includes(pin.ring)) findings.push({ where, kind: "ring is not drawn by this map" });
    if (!CLUSTER_IDS.includes(pin.cluster)) findings.push({ where, kind: "cluster is not a ratified cluster" });
    if (typeof pin.pinId !== "string" || !pin.pinId.startsWith(PIN_ID_PREFIX)) {
      findings.push({ where, kind: "pin id is not in the expected opaque form" });
    }
    if (seen.has(pin.pinId)) findings.push({ where, kind: "duplicate pin id" });
    seen.add(pin.pinId);
  });

  // Forbidden contact columns, at any depth, as keys or as string values.
  const walkKeys = (value, path) => {
    if (Array.isArray(value)) return value.forEach((v, i) => walkKeys(v, `${path}[${i}]`));
    if (value === null || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (FORBIDDEN_COLUMNS.includes(key.toLowerCase())) {
        findings.push({ where: `${path}.${key}`, kind: `forbidden contact field "${key}"` });
      }
      walkKeys(child, `${path}.${key}`);
    }
  };
  walkKeys(payload, "payload");

  const serialised = JSON.stringify(payload, null, 2);
  for (const column of FORBIDDEN_COLUMNS) {
    if (new RegExp(`"${column}"\\s*:`, "i").test(serialised)) {
      findings.push({ where: "serialised payload", kind: `forbidden contact field "${column}"` });
    }
  }
  const text = guardText(serialised, "map-payload");
  for (const f of text.findings) findings.push({ where: `serialised line ${f.line}`, kind: f.kind });

  return { findings, serialised, clean: findings.length === 0 };
}

/* -------------------------------------------------------------------- main */

function parseArgs(argv) {
  const args = { cohort: null, out: DEFAULT_OUT };
  for (const arg of argv) {
    const cohort = /^--cohort=(.+)$/.exec(arg);
    if (cohort) { args.cohort = Number(cohort[1]); continue; }
    const out = /^--out=(.+)$/.exec(arg);
    if (out) { args.out = out[1]; continue; }
    if (arg.startsWith("--")) { args.unknown = arg; }
  }
  return args;
}

function refuse(findings) {
  console.error(`REFUSED. ${findings.length} finding(s). Nothing was written.`);
  findings.slice(0, 30).forEach((f) => console.error(`  ${f.where}: ${f.kind}`));
  if (findings.length > 30) console.error(`  ... and ${findings.length - 30} more`);
  process.exit(1);
}

function main(argv) {
  const args = parseArgs(argv);
  if (args.unknown) {
    console.error(`Unknown option ${args.unknown}.`);
    console.error("Usage: node tools/venue-map-export.mjs --cohort=<n> [--out=<path>]");
    process.exit(1);
  }
  if (args.cohort === null || !Number.isInteger(args.cohort)) {
    console.error("--cohort=<n> is required.");
    console.error("Usage: node tools/venue-map-export.mjs --cohort=<n> [--out=<path>]");
    process.exit(1);
  }

  const venueRows = parseCsv(readFileSync(VENUES_CSV, "utf8"));
  const convert = JSON.parse(readFileSync(COHORTS_JSON, "utf8"));

  const { payload, findings, warnings, counts } = buildPayload(venueRows, convert, args.cohort);
  if (!payload) refuse(findings);
  if (findings.length) refuse(findings);

  const guard = guardPayload(payload);
  if (!guard.clean) refuse(guard.findings);

  // The consent invariant, asserted rather than assumed. Today this is
  // 0 === 0: no account has granted map publication, so no pin carries a name.
  // If that ever stops matching the column, the export stops.
  if (counts.named !== counts.consentGranted) {
    refuse([{
      where: "consent",
      kind: `${counts.named} named pins against ${counts.consentGranted} accounts with consent granted`,
    }]);
  }

  writeFileSync(args.out, `${guard.serialised}\n`);

  console.log(`Wrote ${counts.written} pins → ${args.out}`);
  console.log(`Schema: ${SCHEMA_VERSION}. Cohort ${payload.generatedFor.cohort}. Guard: clean.`);
  console.log("");
  console.log("Pins by ring");
  counts.byRing.forEach(([k, n]) => console.log(`  ${k.padEnd(18)} ${n}`));
  console.log("Pins by cluster");
  counts.byCluster.forEach(([k, n]) => console.log(`  ${k.padEnd(18)} ${n}`));
  console.log("Consent");
  console.log(`  named pins         ${counts.named}`);
  console.log(`  consent granted    ${counts.consentGranted}`);
  console.log(
    counts.named === 0
      ? "  Every pin is anonymous. No account has granted map publication."
      : "  Named pins carry a name only where consent_map_publication is granted.",
  );
  console.log(`  coordinates rounded to ${COORDINATE_DECIMALS} decimal places`);

  if (warnings.length) {
    console.log("");
    console.log("Warnings");
    warnings.forEach((w) => console.log(`  ${w}`));
  }
}

/**
 * Only dispatch when this file IS the command. Without this, importing it from a
 * test runs the CLI, hits the usage branch and exits the test process.
 */
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main(process.argv.slice(2));
