#!/usr/bin/env node
/**
 * venue-coord-audit.mjs — checks that a geocoded coordinate is actually where
 * the research said the venue is.
 *
 * The geocoder will confidently return something for almost any query, and the
 * scoring in `venue-geo.mjs` only checks that the name overlaps and the county
 * matches. That is not enough. "Smithstown Castle, Kilshanny, Co. Clare"
 * resolved to Smithstown Industrial Estate in Shannon — right county, right
 * first word, wrong side of the county, and it put a venue over an hour away
 * into Cohort 1 at 26.8 minutes.
 *
 * So this reverses every coordinate back to a place name and compares it with
 * the town the research recorded. A mismatch is not automatically wrong — a
 * venue in a townland outside a village legitimately reverses to a different
 * name — but it is always worth a human look, and it is the only check that
 * catches a plausible-looking coordinate in the wrong place.
 *
 * E13.17 renders a personalised film per venue from these coordinates. A wrong
 * one puts a real venue's name on the wrong dot in a film emailed to them.
 *
 *   node tools/venue-coord-audit.mjs <universe.json> [out.json]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const UA = "SignalStudio-VEF2026-venue-research/1.0 (ethanmcn2013@gmail.com)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const normalise = (s) =>
  (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

/** Place-name words from a free-text location, minus the county boilerplate. */
function townTokens(text) {
  const stop = new Set(["co", "county", "ireland", "near", "the", "and", "at", "on", "in", "of", "about", "between", "a", "an"]);
  return new Set(
    normalise(text).split(" ").filter((w) => w.length > 3 && !stop.has(w)),
  );
}

async function reverse(lat, lon) {
  await sleep(1100);
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=14&addressdetails=1`,
    { headers: { "User-Agent": UA } },
  );
  if (!res.ok) return null;
  return res.json();
}

async function main(inPath, outPath) {
  const venues = JSON.parse(readFileSync(inPath, "utf8"));
  // Only the accounts the ring decision and the film actually depend on.
  const subjects = venues.filter(
    (v) => v.latitude != null && ["15", "30", "45", "borderline_45_60"].includes(v.drive_time_ring),
  );

  console.error(`Auditing ${subjects.length} coordinates...`);
  const findings = [];

  for (const [i, v] of subjects.entries()) {
    const r = await reverse(v.latitude, v.longitude);
    if (!r || r.error) { findings.push({ ...ref(v), verdict: "unresolved", detail: "reverse geocode failed" }); continue; }

    const place = r.display_name || "";
    const addr = r.address || {};
    const said = townTokens(v.location_text);
    const got = townTokens(`${place} ${addr.town || ""} ${addr.village || ""} ${addr.city || ""} ${addr.suburb || ""} ${addr.county || ""}`);

    const shared = [...said].filter((t) => got.has(t));
    const industrial = /industrial|business park|retail park|trading estate/i.test(place);

    let verdict = "ok", detail = null;
    if (industrial) {
      // Some venues genuinely sit on or beside an industrial estate — an airport
      // hotel in Shannon is the obvious case — so this is only decisive when
      // nobody has already checked the point by hand.
      const checked = v.coord_locked || v.override_source?.includes("coordinates");
      verdict = checked ? "ok" : "WRONG";
      detail = checked
        ? null
        : "coordinate sits on an industrial or retail estate, not a venue";
    } else if (said.size && shared.length === 0) {
      verdict = "MISMATCH";
      detail = `research says "${v.location_text}", coordinate is in "${(addr.town || addr.village || addr.city || addr.county || place).slice(0, 50)}"`;
    }
    if (verdict !== "ok") findings.push({ ...ref(v), verdict, detail, resolvesTo: place.slice(0, 90) });

    if ((i + 1) % 25 === 0) console.error(`  ${i + 1}/${subjects.length}`);
  }

  const wrong = findings.filter((f) => f.verdict === "WRONG");
  const mismatch = findings.filter((f) => f.verdict === "MISMATCH");

  console.log(`Audited ${subjects.length} in-ring and borderline coordinates.`);
  console.log(`  definitely wrong  ${wrong.length}`);
  console.log(`  name mismatch     ${mismatch.length}  (often a townland, always worth a look)`);
  console.log(`  unresolved        ${findings.filter((f) => f.verdict === "unresolved").length}`);
  for (const f of [...wrong, ...mismatch]) {
    console.log(`\n  [${f.verdict}] ${f.venue_name}  (${f.drive_minutes} min, ${f.coord_precision})`);
    console.log(`      ${f.detail}`);
    console.log(`      resolves to: ${f.resolvesTo}`);
  }

  if (outPath) { writeFileSync(outPath, JSON.stringify(findings, null, 2)); console.log(`\n-> ${outPath}`); }
  return wrong.length;
}

const ref = (v) => ({
  account_id: v.account_id,
  venue_name: v.venue_name,
  location_text: v.location_text,
  latitude: v.latitude,
  longitude: v.longitude,
  drive_minutes: v.drive_minutes,
  coord_precision: v.coord_precision,
});

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const [, , a, b] = process.argv;
  if (!a) { console.error("Usage: venue-coord-audit.mjs <universe.json> [out.json]"); process.exit(1); }
  await main(a, b);
}
