#!/usr/bin/env node
/**
 * venue-geo.mjs — the geometry behind the Greater Limerick venue universe.
 *
 * Produces the 45-minute drive-time ring ratified in D-012, and the verified
 * coordinates E10.06 requires and E13.17's personalised film renders depend on.
 * One geometry, two jobs: the venue universe and the film map (E13.03).
 *
 * Zero budget (D-015 Q5), so no paid routing or geocoding. Three keyless public
 * services do the work:
 *
 *   Nominatim (OpenStreetMap)  geocoding    1 request/second, ODbL
 *   Valhalla (OSM demo)        drive time   primary engine, models turn costs
 *   OSRM (public demo)         drive time   independent second opinion
 *
 * Two routing engines rather than one on purpose. A single engine gives a number
 * with no way to tell whether it is right; two give a spread, and the spread is
 * the honest error bar. Everything they return is cached to disk, so a rerun
 * costs nothing and the numbers do not drift under the analysis built on them.
 *
 * Note for anyone rerunning this: Windows curl fails the TLS handshake to both
 * routing hosts (Schannel SEC_E_ILLEGAL_MESSAGE). Node's fetch uses OpenSSL and
 * works. Use this script, not curl.
 *
 * Commands
 *   compare                      routes reference towns through both engines
 *   geocode   <in.json> <out>    resolves coordinates, flags what it could not
 *   drivetime <in.json> <out>    adds drive minutes, ring and cluster
 *
 * No personal data passes through this file. Venue business names, towns and
 * coordinates only.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const CACHE_DIR = join(ROOT, ".geo-cache");

/* ------------------------------------------------------------------ anchor */

/**
 * Limerick city centre, as the O'Connell Monument at the head of O'Connell
 * Street and The Crescent. Resolved from OpenStreetMap on 2026-08-03.
 *
 * Chosen because it is a named, permanent, unambiguous civic landmark on the
 * city's main thoroughfare. The two obvious alternatives — the OSM
 * administrative centroid (52.66125, -8.63012) and the OSM city place node
 * (52.65327, -8.61149) — sit 0.3 km and 1.5 km away respectively. Across the
 * whole ring that choice moves a venue's drive time by well under a minute, so
 * the anchor is documented for reproducibility rather than because it is
 * delicate. Changing it is a geography change and therefore change-controlled.
 */
export const ANCHOR = {
  name: "O'Connell Monument, The Crescent, Limerick",
  latitude: 52.6589231,
  longitude: -8.6317822,
  resolvedFrom: "https://nominatim.openstreetmap.org/search?q=O%27Connell+Monument%2C+Limerick",
  resolvedOn: "2026-08-03",
};

/**
 * Which engine is the number.
 *
 * Both engines route at free-flow speed limits: no live traffic, no time of day,
 * no bank-holiday Saturday queue through Adare. Valhalla additionally models
 * turn costs and junction delay, and across 16 reference towns it returns
 * consistently longer times than OSRM — median 1.12x, range 1.02x to 1.25x, with
 * the largest gaps on short urban-heavy routes, which is exactly where a
 * junction-blind engine should be most wrong.
 *
 * So Valhalla is the number and OSRM is the second opinion. No further
 * correction factor is applied. An earlier draft of this file multiplied by a
 * hand-set 1.18 "real-world" factor derived from remembered drive times; that
 * was fabricated precision (PROJECT.md principle 6) and it is gone. Both engines
 * still understate a real Saturday drive by an amount nobody here can quantify
 * without paid traffic data.
 *
 * That residual error is handled honestly — by widening the band that gets
 * checked by a human rather than by inventing a number. See BOUNDARY_BAND.
 */
export const ENGINES = {
  primary: "valhalla",
  crossCheck: "osrm",
  observedSpread: "Valhalla/OSRM median 1.12, range 1.02-1.25 across 16 reference towns (2026-08-03)",
  knownBias: "Both are free-flow. Real drive times are longer by an unquantified margin, larger on urban and single-carriageway routes.",
};

/**
 * Anything in this band is close enough to 45 minutes that the model's error
 * could flip it either way. These venues are reported for confirmation before
 * anyone relies on the classification — a tractable human check on the handful
 * of accounts where it actually matters, instead of false confidence across all
 * of them.
 */
export const BOUNDARY_BAND = { lowMinutes: 38, highMinutes: 52 };

/** Reference towns spanning every corridor out of the city. */
const REFERENCE_TOWNS = [
  { town: "Adare, Co. Limerick", lat: 52.5643, lon: -8.7891 },
  { town: "Bunratty, Co. Clare", lat: 52.6989, lon: -8.8144 },
  { town: "Shannon, Co. Clare", lat: 52.7122, lon: -8.8656 },
  { town: "Killaloe, Co. Clare", lat: 52.8078, lon: -8.4383 },
  { town: "Nenagh, Co. Tipperary", lat: 52.8642, lon: -8.1969 },
  { town: "Charleville, Co. Cork", lat: 52.3547, lon: -8.6797 },
  { town: "Newcastle West, Co. Limerick", lat: 52.4489, lon: -9.0553 },
  { town: "Kilmallock, Co. Limerick", lat: 52.3997, lon: -8.5747 },
  { town: "Ennis, Co. Clare", lat: 52.8438, lon: -8.9864 },
  { town: "Tipperary town", lat: 52.4736, lon: -8.1611 },
  { town: "Gort, Co. Galway", lat: 53.0656, lon: -8.8203 },
  { town: "Glen of Aherlow, Co. Tipperary", lat: 52.4167, lon: -8.2167 },
  { town: "Mallow, Co. Cork", lat: 52.1367, lon: -8.6483 },
  { town: "Cashel, Co. Tipperary", lat: 52.5158, lon: -7.8875 },
  { town: "Mitchelstown, Co. Cork", lat: 52.2653, lon: -8.2664 },
  { town: "Listowel, Co. Kerry", lat: 52.4467, lon: -9.4844 },
];

/* ------------------------------------------------------------------- rings */

/**
 * D-012 ratifies a 45-minute ring. Inside it, 15 and 30 minute bands give the
 * cohort model something to rank on and give the film map (E13.03) its inner
 * geometry. The 45-60 band is not in the market — it is carried so the boundary
 * decision is visible rather than silent, and so a shortfall can be answered
 * with a costed option rather than a shrug.
 */
export function ringFor(minutes) {
  if (minutes == null) return null;
  if (minutes <= 15) return "15";
  if (minutes <= 30) return "30";
  if (minutes <= 45) return "45";
  if (minutes <= 60) return "borderline_45_60";
  return "out";
}

/** True where the model's known error could flip the ring either way. */
export function isNearBoundary(minutes) {
  return minutes != null && minutes >= BOUNDARY_BAND.lowMinutes && minutes <= BOUNDARY_BAND.highMinutes;
}

/**
 * Geographic clusters. These are how a founder actually thinks about a run of
 * venues — and how the film map groups its dots — so they follow the road
 * corridors out of the city rather than county lines.
 */
const CLUSTERS = [
  { id: "limerick_city", label: "Limerick city", test: (v) => v.lat > 52.6 && v.lat < 52.72 && v.lon > -8.72 && v.lon < -8.55 },
  { id: "west_limerick", label: "West Limerick and the Adare corridor", test: (v) => v.lon <= -8.72 && v.lat < 52.72 && v.lat > 52.3 },
  { id: "east_limerick", label: "East Limerick and the Slieve Felim foothills", test: (v) => v.lon >= -8.55 && v.lon < -8.2 && v.lat > 52.45 && v.lat < 52.72 },
  { id: "south_limerick", label: "South Limerick and the Cork border", test: (v) => v.lat <= 52.45 && v.lon > -8.9 && v.lon < -8.3 },
  { id: "shannon_estuary", label: "Shannon estuary and south Clare", test: (v) => v.lat >= 52.66 && v.lat < 52.82 && v.lon <= -8.72 },
  { id: "ennis_mid_clare", label: "Ennis and mid Clare", test: (v) => v.lat >= 52.78 && v.lon <= -8.72 },
  { id: "lough_derg", label: "Lough Derg and east Clare", test: (v) => v.lat >= 52.72 && v.lon > -8.72 && v.lon < -8.0 },
  { id: "north_tipperary", label: "North Tipperary", test: (v) => v.lat >= 52.72 && v.lon >= -8.4 },
  { id: "tipperary_aherlow", label: "Tipperary town and the Glen of Aherlow", test: (v) => v.lat < 52.72 && v.lon >= -8.2 },
  { id: "north_cork", label: "North Cork", test: (v) => v.lat < 52.4 && v.lon <= -8.3 },
  { id: "north_kerry", label: "North Kerry", test: (v) => v.lon < -9.2 },
  { id: "south_galway", label: "South Galway", test: (v) => v.lat >= 52.95 },
];

/**
 * Clusters describe the market, so they only apply inside it.
 *
 * The outer clusters are defined by being beyond the others — south Galway is
 * "north of everything else", north Kerry is "west of everything else" — which
 * works fine for a venue in the catchment and not at all for one in Dublin.
 * Applied blindly to the whole file, every Leinster account carried in from the
 * old repository lists landed in south Galway, and the cluster tally read as
 * though thirty venues sat around Gort.
 *
 * So a venue beyond the market is `out_of_market`, and the market's own
 * geography is not asked to describe places it was never drawn for.
 */
export function clusterFor(latitude, longitude, ring) {
  if (ring != null && !["15", "30", "45", "borderline_45_60"].includes(ring)) {
    return { id: "out_of_market", label: "Outside the market" };
  }
  const v = { lat: latitude, lon: longitude };
  // Order matters: the two outer clusters are tested first, because they are
  // defined by exclusion rather than by a box of their own.
  for (const c of [...CLUSTERS].sort((a, b) => (a.id === "south_galway" || a.id === "north_kerry" ? -1 : 0))) {
    if (c.test(v)) return { id: c.id, label: c.label };
  }
  return { id: "unclassified", label: "Unclassified" };
}

/* ------------------------------------------------------------------- cache */

function cacheGet(kind, key) {
  const path = join(CACHE_DIR, kind, `${encodeURIComponent(key).slice(0, 180)}.json`);
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, "utf8")); } catch { return null; }
}

function cacheSet(kind, key, value) {
  const dir = join(CACHE_DIR, kind);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${encodeURIComponent(key).slice(0, 180)}.json`), JSON.stringify(value));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --------------------------------------------------------------- geocoding */

const UA = "SignalStudio-VEF2026-venue-research/1.0 (ethanmcn2013@gmail.com)";

/**
 * Resolve one venue to coordinates.
 *
 * Nominatim will happily return *something* for almost any query, and that is
 * the trap: searching "Adare Manor" returns a bar inside the estate. So every
 * result is checked before it is accepted — the returned name has to look like
 * the venue asked for, and the point has to land in the right county. Anything
 * that fails is returned unresolved with the reason, never quietly accepted.
 *
 * A wrong coordinate here puts a real venue's name on the wrong dot in a film
 * that gets emailed to that venue. Unresolved is cheap; wrong is not.
 */
export async function geocodeVenue({ venue_name, location_text, county }) {
  const key = `${venue_name}|${location_text || ""}|${county || ""}`;
  const cached = cacheGet("nominatim", key);
  if (cached) return cached;

  const attempts = [
    `${venue_name}, ${location_text || ""}, Ireland`,
    `${venue_name}, County ${county || ""}, Ireland`,
    `${venue_name}, Ireland`,
  ].filter((q) => q.replace(/[, ]/g, "").length > 4);

  let result = { resolved: false, reason: "no query matched", candidates: [] };

  for (const q of attempts) {
    await sleep(1100); // Nominatim asks for no more than one request a second.
    let rows;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1&extratags=1`,
        { headers: { "User-Agent": UA } },
      );
      if (!res.ok) { result = { resolved: false, reason: `HTTP ${res.status}`, candidates: [] }; continue; }
      rows = await res.json();
    } catch (e) {
      result = { resolved: false, reason: `fetch failed: ${e.message}`, candidates: [] };
      continue;
    }
    if (!rows.length) continue;

    const scored = rows.map((r) => ({
      lat: Number(r.lat),
      lon: Number(r.lon),
      name: r.name || "",
      display: r.display_name || "",
      osmType: r.osm_type,
      osmId: r.osm_id,
      klass: r.class,
      type: r.type,
      score: scoreCandidate(r, venue_name, county),
    })).sort((a, b) => b.score - a.score);

    const best = scored[0];
    if (best && best.score >= 2) {
      result = {
        resolved: true,
        latitude: Number(best.lat.toFixed(6)),
        longitude: Number(best.lon.toFixed(6)),
        matchedName: best.name,
        matchedDisplay: best.display,
        confidence: best.score >= 4 ? "verified" : "likely",
        query: q,
        source: `https://www.openstreetmap.org/${best.osmType}/${best.osmId}`,
        candidates: scored.slice(0, 3).map((c) => ({ name: c.name, score: c.score })),
      };
      break;
    }
    result = { resolved: false, reason: `best candidate scored ${best?.score ?? 0}`, query: q, candidates: scored.slice(0, 3).map((c) => ({ name: c.name, score: c.score })) };
  }

  cacheSet("nominatim", key, result);
  return result;
}

/**
 * Fall back to the venue's town when the venue itself will not resolve.
 *
 * A town centroid is entirely good enough to decide whether somewhere is inside
 * a 45-minute ring — the towns in this region are small and the error is a
 * minute or two. It is NOT good enough for E13.17, which renders a dot on a map
 * with the venue's name beside it and would put that dot in the middle of a
 * town square.
 *
 * So the two precisions are recorded in separate fields and never conflated.
 * `coord_precision: "town"` is usable for the ring and blocked for the film.
 */
export async function geocodeTown({ location_text, county }) {
  const town = (location_text || "").split(/[,(]/)[0].trim();
  if (!town) return { resolved: false, reason: "no town recorded" };

  const key = `town|${town}|${county || ""}`;
  const cached = cacheGet("nominatim", key);
  if (cached) return cached;

  await sleep(1100);
  let result = { resolved: false, reason: "town not found" };
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${town}, County ${county || ""}, Ireland`)}&format=json&limit=1`,
      { headers: { "User-Agent": UA } },
    );
    const rows = await res.json();
    if (rows.length) {
      result = {
        resolved: true,
        latitude: Number(Number(rows[0].lat).toFixed(6)),
        longitude: Number(Number(rows[0].lon).toFixed(6)),
        town,
        source: `https://www.openstreetmap.org/${rows[0].osm_type}/${rows[0].osm_id}`,
      };
    }
  } catch (e) { result = { resolved: false, reason: `fetch failed: ${e.message}` }; }

  cacheSet("nominatim", key, result);
  return result;
}

/** Name overlap plus county agreement. Deliberately strict. */
function scoreCandidate(row, venueName, county) {
  const norm = (s) => (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const stop = new Set(["the", "hotel", "house", "and", "of", "at", "co", "county", "ireland", "resort", "spa"]);
  const want = norm(venueName).split(" ").filter((w) => w.length > 2 && !stop.has(w));
  const got = new Set(norm(`${row.name} ${row.display_name}`).split(" "));

  let score = 0;
  const hits = want.filter((w) => got.has(w)).length;
  if (want.length) score += (hits / want.length) * 4;

  const display = norm(row.display_name);
  if (county && display.includes(norm(county))) score += 1;
  else if (county) score -= 1.5;

  // A point that is a whole building, estate or tourism feature beats a node
  // that happens to be a bar, car park or bench inside one.
  if (["tourism", "building", "leisure", "historic", "amenity"].includes(row.class)) score += 0.5;
  if (["bar", "pub", "restaurant", "cafe", "parking", "bench", "toilets"].includes(row.type)) score -= 1.5;
  if (row.osm_type === "way" || row.osm_type === "relation") score += 0.5;

  return Number(score.toFixed(2));
}

/* -------------------------------------------------------------- drive time */

const OSRM = "https://router.project-osrm.org";
const VALHALLA = "https://valhalla1.openstreetmap.de";

/** One OSRM route. Cross-check engine. */
async function osrmRoute(anchor, p) {
  const key = `${anchor.longitude},${anchor.latitude};${p.longitude},${p.latitude}`;
  const cached = cacheGet("osrm", key);
  if (cached) return cached;
  let out = { minutes: null, km: null, error: null };
  try {
    const res = await fetch(`${OSRM}/route/v1/driving/${key}?overview=false`);
    const d = await res.json();
    if (d.code === "Ok" && d.routes?.[0]) {
      out = { minutes: d.routes[0].duration / 60, km: d.routes[0].distance / 1000, error: null };
      cacheSet("osrm", key, out);
    } else out.error = d.code || `HTTP ${res.status}`;
  } catch (e) { out.error = `fetch failed: ${e.message}`; }
  return out;
}

/** One Valhalla route. Primary engine — models turn costs and junction delay. */
async function valhallaRoute(anchor, p) {
  const key = `${anchor.longitude},${anchor.latitude};${p.longitude},${p.latitude}`;
  const cached = cacheGet("valhalla", key);
  if (cached) return cached;
  let out = { minutes: null, km: null, error: null };
  try {
    const res = await fetch(`${VALHALLA}/route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locations: [
          { lat: anchor.latitude, lon: anchor.longitude },
          { lat: p.latitude, lon: p.longitude },
        ],
        costing: "auto",
        units: "kilometers",
      }),
    });
    const d = await res.json();
    if (d.trip?.summary) {
      out = { minutes: d.trip.summary.time / 60, km: d.trip.summary.length, error: null };
      cacheSet("valhalla", key, out);
    } else out.error = d.error || `HTTP ${res.status}`;
  } catch (e) { out.error = `fetch failed: ${e.message}`; }
  return out;
}

/**
 * How far apart the two engines have to be before it means something.
 *
 * A percentage on its own is useless here. A city-centre venue routed at 2.1
 * minutes by one engine and 1.3 by the other is a 62% "disagreement" that says
 * nothing except that both engines think it is very close. The first version of
 * this check flagged 26 venues including Adare Manor and Dromoland on exactly
 * that basis.
 *
 * So a flag needs a real absolute gap as well as a proportional one.
 */
const DISAGREEMENT = { minRatio: 0.25, minMinutes: 8 };

/**
 * What the surviving disagreements turned out to be — and why the primary
 * engine is overridden for them.
 *
 * Once the threshold was fixed, every remaining flagged venue was the same kind
 * of place: Adare Manor, Dromoland Castle, Glenstal Abbey, Glin Castle, Lough
 * Cutra Castle, Ballyneety and Ballykisteen. Large estates reached by a long
 * private avenue.
 *
 * Valhalla models access restrictions and crawls those driveways at a heavy
 * penalty, so it reports Adare Manor at 27 minutes where OSRM reports 18.5. The
 * real drive is about twenty. Valhalla is not wrong about the road; it is
 * answering a different question from the one being asked. "Forty-five minutes
 * from Limerick" means public-road time to the venue, not time to the front door
 * including the avenue.
 *
 * So where the engines disagree materially, the lower figure becomes the ring
 * number and BOTH are kept. Every such venue is also forced into the
 * human-confirmation list whatever band it lands in, because an override is
 * exactly the kind of judgement that should not pass silently — it changes the
 * in/out call for at least two accounts.
 */
const ESTATE_OVERRIDE_NOTE =
  "engines disagreed materially (long private avenue); using the lower, public-road figure and flagging for confirmation";

/**
 * Drive time from the anchor through both engines.
 *
 * Returns the primary figure, the cross-check, and whether they disagree enough
 * to suspect the coordinate rather than the routing.
 */
export async function driveTimeFrom(anchor, points) {
  const out = [];
  for (const [i, p] of points.entries()) {
    const v = await valhallaRoute(anchor, p);
    await sleep(250);
    const o = await osrmRoute(anchor, p);
    await sleep(250);

    const primary = v.minutes ?? o.minutes ?? null;
    const both = v.minutes != null && o.minutes != null;
    out.push({
      minutes: primary == null ? null : Number(primary.toFixed(1)),
      km: v.km ?? o.km ?? null,
      valhallaMinutes: v.minutes == null ? null : Number(v.minutes.toFixed(1)),
      osrmMinutes: o.minutes == null ? null : Number(o.minutes.toFixed(1)),
      engineUsed: v.minutes != null ? "valhalla" : o.minutes != null ? "osrm (valhalla failed)" : null,
      engineDisagreement: both
        ? Math.abs(v.minutes - o.minutes) / Math.min(v.minutes, o.minutes) > DISAGREEMENT.minRatio
          && Math.abs(v.minutes - o.minutes) > DISAGREEMENT.minMinutes
        : null,
      error: primary == null ? `valhalla: ${v.error} · osrm: ${o.error}` : null,
    });
    if ((i + 1) % 25 === 0) console.error(`  routed ${i + 1}/${points.length}`);
  }
  return out;
}

/* ---------------------------------------------------------------- commands */

async function cmdCompare() {
  console.log(`Anchor: ${ANCHOR.name} (${ANCHOR.latitude}, ${ANCHOR.longitude})`);
  console.log(`Primary engine: ${ENGINES.primary} · cross-check: ${ENGINES.crossCheck}\n`);
  const rows = await driveTimeFrom(ANCHOR, REFERENCE_TOWNS.map((t) => ({ latitude: t.lat, longitude: t.lon })));
  const ratios = [];
  console.log("Town                            Valh   OSRM  ratio     km  ring");
  console.log("-".repeat(70));
  REFERENCE_TOWNS.forEach((t, i) => {
    const r = rows[i];
    if (r.minutes == null) { console.log(`${t.town.padEnd(30)}  ROUTE FAILED (${r.error})`); return; }
    if (r.valhallaMinutes && r.osrmMinutes) ratios.push(r.valhallaMinutes / r.osrmMinutes);
    const ring = ringFor(r.minutes);
    const mark = isNearBoundary(r.minutes) ? " ←check" : "";
    console.log(
      `${t.town.padEnd(30)} ${String(r.valhallaMinutes).padStart(5)} ${String(r.osrmMinutes).padStart(6)} ` +
      `${(r.valhallaMinutes / r.osrmMinutes).toFixed(3).padStart(6)} ${r.km.toFixed(1).padStart(6)}  ${ring}${mark}`,
    );
  });
  const s = [...ratios].sort((a, b) => a - b);
  console.log("-".repeat(70));
  console.log(`Valhalla/OSRM: median ${s[Math.floor(s.length / 2)].toFixed(3)} · range ${s[0].toFixed(3)}-${s.at(-1).toFixed(3)}`);
  console.log(`Boundary band flagged for human confirmation: ${BOUNDARY_BAND.lowMinutes}-${BOUNDARY_BAND.highMinutes} min.`);
  console.log(`Known bias: ${ENGINES.knownBias}`);
}

async function cmdGeocode(inPath, outPath) {
  const venues = JSON.parse(readFileSync(inPath, "utf8"));
  const out = [];
  let fromResearch = 0, fromNominatim = 0, kept = 0, townLevel = 0, unresolved = 0;

  for (const [i, v] of venues.entries()) {
    if (v.latitude != null && v.longitude != null && v.coord_confidence === "verified") {
      out.push(v); fromResearch++; continue;
    }
    const g = await geocodeVenue(v);

    // A failed lookup must never destroy a coordinate a researcher already
    // sourced from the venue's own site or an OSM entry. Nominatim not finding
    // "Cloghan Castle, Kilchreest" is a fact about Nominatim, not about the
    // coordinate someone already checked.
    const hadCoords = v.latitude != null && v.longitude != null;
    if (!g.resolved && hadCoords) {
      out.push({
        ...v,
        coord_confidence: v.coord_confidence ?? "likely",
        coord_precision: "venue",
        coord_source: v.coord_source ?? "supplied by research sweep",
        coord_note: `kept the researched coordinate; geocoder could not confirm it (${g.reason})`,
      });
      kept++;
    } else if (g.resolved) {
      out.push({
        ...v,
        latitude: g.latitude,
        longitude: g.longitude,
        coord_confidence: g.confidence,
        coord_precision: "venue",
        coord_source: g.source,
        coord_matched_name: g.matchedName,
        coord_note: hadCoords && (Math.abs(v.latitude - g.latitude) > 0.02 || Math.abs(v.longitude - g.longitude) > 0.02)
          ? `geocoder disagreed with the researched coordinate by more than ~2 km — check before relying on it`
          : null,
        coord_researched_alternative: hadCoords ? { latitude: v.latitude, longitude: v.longitude } : null,
      });
      fromNominatim++;
    } else {
      const t = await geocodeTown(v);
      if (t.resolved) {
        out.push({
          ...v,
          latitude: t.latitude,
          longitude: t.longitude,
          coord_confidence: "town_only",
          coord_precision: "town",
          coord_source: t.source,
          coord_note: `venue would not resolve (${g.reason}); using the centroid of ${t.town}. Good enough for the ring, NOT good enough for a film render.`,
        });
        townLevel++;
      } else {
        out.push({ ...v, latitude: null, longitude: null, coord_confidence: "unresolved", coord_precision: null, coord_source: null, coord_note: `${g.reason}; town fallback also failed (${t.reason})` });
        unresolved++;
      }
    }
    if ((i + 1) % 20 === 0) console.error(`  geocoded ${i + 1}/${venues.length}`);
  }

  writeFileSync(outPath, JSON.stringify(out, null, 2));
  const ok = out.filter((v) => v.latitude != null).length;
  const disputed = out.filter((v) => v.coord_note?.includes("disagreed")).length;
  console.log(`Coordinates: ${ok}/${out.length}`);
  console.log(`  already verified   ${fromResearch}`);
  console.log(`  from the geocoder  ${fromNominatim}`);
  console.log(`  research kept      ${kept}  (geocoder could not confirm, coordinate preserved)`);
  console.log(`  town centroid only ${townLevel}  (usable for the ring, blocked for E13.17 film renders)`);
  console.log(`  unresolved         ${unresolved}`);
  console.log(`  venue-precision    ${out.filter((v) => v.coord_precision === "venue").length}  <- the number E13.17 actually needs`);
  if (disputed) console.log(`  DISPUTED           ${disputed}  (geocoder and researcher >2 km apart — check these)`);
  console.log(`→ ${outPath}`);
}

async function cmdDriveTime(inPath, outPath) {
  const venues = JSON.parse(readFileSync(inPath, "utf8"));
  const located = venues.filter((v) => v.latitude != null && v.longitude != null);
  console.error(`Routing ${located.length} located venues of ${venues.length}...`);
  const rows = await driveTimeFrom(ANCHOR, located);
  const byId = new Map();
  located.forEach((v, i) => byId.set(v.account_id ?? v.venue_name, rows[i]));

  const out = venues.map((v) => {
    const r = byId.get(v.account_id ?? v.venue_name);
    if (!r || r.minutes == null) {
      // Do not wipe a classification someone already made by hand. A venue with
      // no coordinate but a recorded reason for being out stays out; this pass
      // has nothing to add to it, so it leaves it alone.
      return {
        ...v,
        drive_minutes: null,
        drive_time_ring: v.drive_time_ring ?? null,
        cluster: v.cluster ?? null,
        near_boundary: null,
        road_km: null,
        drive_time_note: v.drive_time_note ?? r?.error ?? "no coordinates",
      };
    }
    // See ESTATE_OVERRIDE_NOTE. A material disagreement means a private avenue,
    // so the lower figure is the one that answers "how far is this from
    // Limerick" — and the venue goes to a human either way.
    const overridden = r.engineDisagreement && r.valhallaMinutes != null && r.osrmMinutes != null;
    const minutes = overridden ? Math.min(r.valhallaMinutes, r.osrmMinutes) : r.minutes;

    return {
      ...v,
      drive_minutes: minutes,
      drive_minutes_valhalla: r.valhallaMinutes,
      drive_minutes_osrm: r.osrmMinutes,
      drive_engine: overridden ? "osrm (estate override)" : r.engineUsed,
      drive_engine_disagreement: r.engineDisagreement,
      drive_time_note: overridden ? ESTATE_OVERRIDE_NOTE : (v.drive_time_note ?? null),
      drive_time_ring: ringFor(minutes),
      near_boundary: isNearBoundary(minutes) || Boolean(overridden),
      cluster: clusterFor(v.latitude, v.longitude, ringFor(minutes)).id,
      cluster_label: clusterFor(v.latitude, v.longitude, ringFor(minutes)).label,
      road_km: Number(r.km.toFixed(1)),
    };
  });
  writeFileSync(outPath, JSON.stringify(out, null, 2));

  const counts = {};
  for (const v of out) counts[v.drive_time_ring ?? "unknown"] = (counts[v.drive_time_ring ?? "unknown"] || 0) + 1;
  console.log(`Drive times computed. → ${outPath}`);
  for (const k of ["15", "30", "45", "borderline_45_60", "out", "unknown"]) {
    if (counts[k]) console.log(`  ${k.padEnd(18)} ${counts[k]}`);
  }
  console.log(`  in the ring (<=45)  ${out.filter((v) => ["15", "30", "45"].includes(v.drive_time_ring)).length}`);
  console.log(`  near boundary       ${out.filter((v) => v.near_boundary).length}  (${BOUNDARY_BAND.lowMinutes}-${BOUNDARY_BAND.highMinutes} min, confirm before relying on these)`);
  const dis = out.filter((v) => v.drive_engine_disagreement);
  if (dis.length) console.log(`  engine disagreement ${dis.length}  → likely bad coordinates: ${dis.map((v) => v.venue_name).join(", ")}`);
}


/* ----------------------------------------------------------------- main */

/**
 * Only dispatch when this file IS the command. Without this, importing it from
 * a test runs the CLI, hits the usage branch and exits the test process.
 */
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const [, , cmd, a, b] = process.argv;
  if (cmd === "compare") await cmdCompare();
  else if (cmd === "geocode") await cmdGeocode(a, b);
  else if (cmd === "drivetime") await cmdDriveTime(a, b);
  else { console.error(`Unknown command "${cmd ?? ""}". Try: compare | geocode <in> <out> | drivetime <in> <out>`); process.exit(1); }
}
