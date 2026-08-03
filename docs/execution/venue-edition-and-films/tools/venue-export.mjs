#!/usr/bin/env node
/**
 * venue-export.mjs — writes the operational venue file and the counts-only
 * report, and refuses to write either if personal data has crept in.
 *
 * The column set is fixed by `private/venues.template.csv` and deliberately has
 * no contact_name, email, phone, postal_address or linkedin_url. That is not an
 * oversight to be helpfully corrected: a second copy of contact data in a repo
 * is how a repo share becomes a data incident. Contacts live in the CRM and join
 * on account_id.
 *
 * This tool is the enforcement point. Every export is guarded, and an email
 * address, a phone number, a contact-shaped column or an out-of-list buyer_role
 * fails the write — not warns, fails. Nothing is written at all.
 *
 * The one heuristic that only warns is "a person's name in prose", and only when
 * checking already-rendered text, where field boundaries are gone and
 * "Contact House Hotel" is indistinguishable from "Contact Mary Boyle". On the
 * structured input, where the field is known, it is fatal like everything else.
 *
 * Commands
 *   csv     <venues.json> <out.csv>    the operational file (gitignored)
 *   report  <venues.json> <out.md>     counts only, safe to commit
 *   guard   <path>                     audit any file, every heuristic fatal
 */

import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/** Exactly the template's columns, in the template's order. */
export const COLUMNS = [
  "account_id", "venue_name", "cluster", "drive_time_ring", "latitude", "longitude",
  "venue_type", "rank_score", "cohort", "buyer_role", "contact_verified_on",
  "consent_public_naming", "consent_map_publication", "crm_stage", "conflict_flag",
  "fit_reason", "notes",
];

/** Columns that must never exist, whatever a future caller thinks it needs. */
const FORBIDDEN_COLUMNS = [
  "contact_name", "contact", "name_of_contact", "email", "email_address", "e_mail",
  "phone", "telephone", "mobile", "postal_address", "address", "linkedin",
  "linkedin_url", "twitter_handle", "personal_email", "direct_dial", "first_name",
  "last_name", "surname",
];

const BUYER_ROLES = ["owner", "general_manager", "wedding_manager", "sales_lead", "events_lead"];

/* ------------------------------------------------------------------ guard */

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
/** Irish mobile and landline shapes, plus +353. Deliberately broad. */
const PHONE = /(\+353[\s-]?\d[\d\s-]{6,})|(\b0(8[3-9]|6[1-9]|21|1)[\s-]?\d{3}[\s-]?\d{3,4}\b)/;
/**
 * "Contact Mary Boyle", "Ask for John Ryan" — a person attached to a venue.
 *
 * Case-insensitive on the lead-in, case-SENSITIVE on the name that follows: a
 * capitalised pair after "contact" is a person, "contact the wedding office" is
 * not. Spelled out per word rather than using the `i` flag, because the flag
 * would apply to the name pattern too and every "contact the wedding office" in
 * the file would fail the export.
 *
 * Common capitalised non-names that legitimately follow these words are excluded
 * so the guard stays believable. A guard that cries wolf gets switched off.
 */
const PERSON_HINT =
  /\b([Cc]ontact|[Aa]sk for|[Ss]peak to|[Aa]ttn|[Aa]ttention|c\/o|[Mm]anager is|[Oo]wner is|[Rr]un by|[Oo]wned by)\b[:\s]+(?!The\b|A\b|An\b|Their\b|Its\b|Head\b|General\b|Wedding\b|Events\b|Sales\b|Group\b|Front\b|Reception\b)[A-Z][a-z]+\s+[A-Z][a-z]+/;

/**
 * Scan raw text for anything that should not be in this tree.
 *
 * Returns findings as {line, kind} — never the matched value itself, because a
 * report that quotes the leaked email has leaked the email again.
 *
 * Two severities on purpose. Email addresses, phone numbers and forbidden
 * columns are unambiguous and fatal. The person-in-prose heuristic is fuzzy, and
 * once a row is flattened into a CSV line there are no field boundaries left to
 * judge it against — "Contact House Hotel" in a venue_name reads identically to
 * "Contact Mary Boyle" in a note. So at text level it warns, and the real
 * enforcement happens in `guardObjects`, which still has the fields.
 *
 * That split is deliberate. A guard that blocks a legitimate export is a guard
 * somebody switches off.
 */
export function guardText(text, label = "input", { personHintFatal = false } = {}) {
  const findings = [], warnings = [];
  text.split(/\r?\n/).forEach((line, i) => {
    if (EMAIL.test(line)) findings.push({ line: i + 1, kind: "email address" });
    if (PHONE.test(line)) findings.push({ line: i + 1, kind: "phone number" });
    if (PERSON_HINT.test(line)) (personHintFatal ? findings : warnings).push({ line: i + 1, kind: "possible named person" });
  });
  const header = text.split(/\r?\n/)[0]?.toLowerCase() || "";
  for (const c of FORBIDDEN_COLUMNS) {
    if (header.split(",").map((h) => h.trim()).includes(c)) findings.push({ line: 1, kind: `forbidden column "${c}"` });
  }
  return { label, findings, warnings, clean: findings.length === 0 };
}

/**
 * Fields holding a business identifier rather than prose. An email or a phone
 * number in one of these is still a finding, but the person-in-prose pattern is
 * not run against them — a venue is entitled to be called Ryan's or Contact
 * House without failing an export.
 */
const IDENTIFIER_FIELDS = new Set(["venue_name", "account_id", "cluster", "venue_type", "buyer_role", "crm_stage", "group_or_operator"]);

function guardObjects(venues) {
  const findings = [];
  venues.forEach((v, i) => {
    for (const [k, val] of Object.entries(v)) {
      if (FORBIDDEN_COLUMNS.includes(k.toLowerCase())) findings.push({ line: i + 1, kind: `forbidden field "${k}"` });
      if (typeof val !== "string") continue;
      if (EMAIL.test(val)) findings.push({ line: i + 1, kind: `email address in "${k}"` });
      if (PHONE.test(val)) findings.push({ line: i + 1, kind: `phone number in "${k}"` });
      if (!IDENTIFIER_FIELDS.has(k) && PERSON_HINT.test(val)) findings.push({ line: i + 1, kind: `named person in "${k}"` });
    }
    if (v.buyer_role && !BUYER_ROLES.includes(v.buyer_role)) {
      findings.push({ line: i + 1, kind: `buyer_role "${v.buyer_role}" is not one of the five permitted roles` });
    }
  });
  return findings;
}

/* -------------------------------------------------------------------- csv */

const esc = (v) => {
  if (v == null) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function cmdCsv(inPath, outPath) {
  const venues = JSON.parse(readFileSync(inPath, "utf8"));
  const findings = guardObjects(venues);
  if (findings.length) {
    console.error(`REFUSED. ${findings.length} personal-data finding(s) in ${inPath}:`);
    findings.slice(0, 20).forEach((f) => console.error(`  row ${f.line}: ${f.kind}`));
    console.error("\nContact data belongs in the CRM, joined on account_id. Nothing was written.");
    process.exit(1);
  }

  const rows = [COLUMNS.join(",")];
  for (const v of venues) rows.push(COLUMNS.map((c) => esc(v[c])).join(","));
  const csv = rows.join("\n") + "\n";

  const g = guardText(csv, outPath);
  if (!g.clean) {
    console.error(`REFUSED. Rendered CSV still trips the guard:`);
    g.findings.forEach((f) => console.error(`  line ${f.line}: ${f.kind}`));
    process.exit(1);
  }

  writeFileSync(outPath, csv);
  console.log(`Wrote ${venues.length} rows → ${outPath}`);
  console.log(`Guard: clean. Columns: ${COLUMNS.length}, forbidden columns present: 0.`);
  if (g.warnings.length) {
    console.log(`Review (not fatal): ${g.warnings.length} line(s) matched the person-in-prose heuristic.`);
    g.warnings.slice(0, 10).forEach((w) => console.log(`  line ${w.line}: ${w.kind}`));
  }
}

/* ----------------------------------------------------------------- report */

function tally(venues, key, order) {
  const t = {};
  for (const v of venues) { const k = v[key] ?? "unknown"; t[k] = (t[k] || 0) + 1; }
  const keys = order ? order.filter((k) => t[k]) : Object.keys(t).sort((a, b) => t[b] - t[a]);
  return keys.map((k) => [k, t[k]]);
}

function cmdReport(inPath, outPath) {
  const venues = JSON.parse(readFileSync(inPath, "utf8"));
  const inRing = venues.filter((v) => ["15", "30", "45"].includes(v.drive_time_ring));
  const eligible = inRing.filter((v) => v.eligibility !== "out" && v.status_flag !== "closed");

  const L = [];
  L.push("# Venue universe — counts only\n");
  L.push("<!-- GENERATED by venue-export.mjs. Counts only, by design. No venue is named here. -->");
  L.push("> Generated from the operational file. This report never names a venue and never");
  L.push("> carries contact data. Venue names are published as participants only with");
  L.push("> recorded consent (E10.14, E15.16).\n");
  L.push(`**Universe researched:** ${venues.length}`);
  L.push(`**Inside the 45-minute ring:** ${inRing.length}`);
  L.push(`**Inside the ring and eligible:** ${eligible.length}`);
  L.push(`**Near the boundary (38-52 min), needing confirmation:** ${venues.filter((v) => v.near_boundary).length}\n`);

  const sections = [
    ["By drive-time ring", "drive_time_ring", ["15", "30", "45", "borderline_45_60", "out"]],
    ["By cluster", "cluster", null],
    ["By venue type", "venue_type", null],
    ["By likely buyer role", "buyer_role", BUYER_ROLES],
    ["By cohort", "cohort", ["1", "2", "3", "4", "reserve"]],
    ["By eligibility", "eligibility", ["in", "borderline", "out"]],
    ["By trading status", "status_flag", ["trading", "rebranded", "sold", "unclear", "closed"]],
  ];
  for (const [title, key, order] of sections) {
    const rows = tally(venues, key, order);
    if (!rows.length) continue;
    L.push(`## ${title}\n`);
    L.push("| Value | Count |");
    L.push("|---|---|");
    rows.forEach(([k, n]) => L.push(`| ${k} | ${n} |`));
    L.push("");
  }

  const withCoords = venues.filter((v) => v.latitude != null && v.longitude != null);
  const verified = venues.filter((v) => v.coord_confidence === "verified");
  L.push("## Coordinate quality\n");
  L.push("E13.17 renders a personalised film per venue from these coordinates, so this");
  L.push("table is a release gate, not metadata.\n");
  L.push("| Measure | Count |");
  L.push("|---|---|");
  L.push(`| Coordinates resolved | ${withCoords.length} / ${venues.length} |`);
  L.push(`| Verified confidence | ${verified.length} |`);
  L.push(`| Likely confidence | ${venues.filter((v) => v.coord_confidence === "likely").length} |`);
  L.push(`| Unresolved | ${venues.length - withCoords.length} |`);
  L.push(`| Routing engines disagreed (suspect coordinate) | ${venues.filter((v) => v.drive_engine_disagreement).length} |`);
  L.push("");

  const md = L.join("\n");
  const g = guardText(md, outPath);
  if (!g.clean) {
    console.error("REFUSED. Generated report trips the guard:");
    g.findings.forEach((f) => console.error(`  line ${f.line}: ${f.kind}`));
    process.exit(1);
  }
  writeFileSync(outPath, md);
  console.log(`Wrote counts-only report → ${outPath}`);
}


/* ----------------------------------------------------------------- main */

/**
 * Only dispatch when this file IS the command. Without this, importing it from
 * a test runs the CLI, hits the usage branch and exits the test process.
 */
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const [, , cmd, a, b] = process.argv;
  if (cmd === "csv") cmdCsv(a, b);
else if (cmd === "report") cmdReport(a, b);
else if (cmd === "guard") {
  const g = guardText(readFileSync(a, "utf8"), a, { personHintFatal: true });
  if (g.clean) console.log(`${a}: clean.`);
  else { console.error(`${a}: ${g.findings.length} finding(s)`); g.findings.forEach((f) => console.error(`  line ${f.line}: ${f.kind}`)); process.exit(1); }
  } else { console.error("Usage: csv <in.json> <out.csv> | report <in.json> <out.md> | guard <path>"); process.exit(1); }
}
