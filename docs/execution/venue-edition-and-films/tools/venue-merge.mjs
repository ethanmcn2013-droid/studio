#!/usr/bin/env node
/**
 * venue-merge.mjs — consolidates the parallel research sweeps into one universe
 * and deduplicates it (E10.04, E10.05).
 *
 * Several researchers swept the same region by different methods on purpose:
 * by county, by venue type, by directory, by awards and press. That guarantees
 * overlap, and the overlap is the point — a venue found three independent ways
 * is corroborated, and a venue found once is a lead that still needs checking.
 *
 * The hard part is not the union. It is knowing that "Dromoland Castle Hotel",
 * "Dromoland Castle" and "Dromoland Castle, Newmarket-on-Fergus" are one
 * account, while "Bunratty Castle" and "Bunratty Castle Hotel" are two different
 * businesses on the same site. So the matcher proposes and records its
 * reasoning; it never silently collapses two names into one.
 *
 * E10.05 also asks for group, multi-property and rename detection, which is a
 * different problem from duplication: two properties of the same group are two
 * accounts with one buyer, and outreach that treats them as two independent
 * prospects reads as a mail merge.
 *
 * Commands
 *   merge  <discovery-dir> <out.json>   union, dedup, assign account IDs
 *   review <merged.json>                print what a human needs to look at
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The account-ID ledger.
 *
 * `private/venues.template.csv` says account_id is the join key to the CRM and
 * is never reused. Assigning IDs from sort position breaks that the first time a
 * venue is added: everything after the insertion point shifts by one, and
 * VEN-0007 silently becomes a different business — while the CRM, the outreach
 * tracker and any sent film still point at the old one.
 *
 * So assignments are written down and never recomputed. A venue keeps its ID for
 * the life of the programme; new venues take the next unused number; an ID whose
 * venue is later removed is retired rather than handed to someone else.
 */
const LEDGER_PATH = join(ROOT, "venue-universe", "account-ids.json");
const OVERRIDES_PATH = join(ROOT, "venue-universe", "overrides.json");

function loadLedger() {
  if (!existsSync(LEDGER_PATH)) return { nextNumber: 1, byNameKey: {}, retired: [] };
  return JSON.parse(readFileSync(LEDGER_PATH, "utf8"));
}

function assignIds(venues) {
  const ledger = loadLedger();
  const issuedThisRun = [];

  for (const v of venues) {
    const key = nameKey(v.venue_name) || v.venue_name.toLowerCase();
    if (ledger.byNameKey[key]) { v.account_id = ledger.byNameKey[key]; continue; }
    const id = `VEN-${String(ledger.nextNumber).padStart(4, "0")}`;
    ledger.nextNumber += 1;
    ledger.byNameKey[key] = id;
    v.account_id = id;
    issuedThisRun.push({ id, venue_name: v.venue_name });
  }

  // Anything in the ledger that no longer appears is retired, not freed.
  const present = new Set(venues.map((v) => nameKey(v.venue_name) || v.venue_name.toLowerCase()));
  const retired = Object.entries(ledger.byNameKey)
    .filter(([k]) => !present.has(k))
    .map(([k, id]) => ({ nameKey: k, id }));

  ledger.retired = [...new Map([...(ledger.retired || []), ...retired].map((r) => [r.id, r])).values()];
  ledger.updatedAt = "2026-08-03";
  writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2));

  return { issued: issuedThisRun.length, reused: venues.length - issuedThisRun.length, retired: retired.length };
}

/**
 * Reapply the durable human decisions in `venue-universe/overrides.json`.
 *
 * Merge, geocode and routing are all regenerable from the research sweeps, so a
 * rebuild must not quietly discard a judgement a person made. Twice already in
 * this work package a rerun destroyed hand-set values — researched coordinates
 * nulled by a failed geocode, and manual ring classifications wiped by the
 * routing pass. This is the fix that stops it being a third time.
 *
 * An override whose venue is no longer in the universe is reported as STALE
 * rather than ignored: it means the venue was renamed or dropped, and a decision
 * pointing at nothing is a decision that has silently stopped applying.
 */
function applyOverrides(venues) {
  if (!existsSync(OVERRIDES_PATH)) return { applied: 0, unmatched: [] };
  const o = JSON.parse(readFileSync(OVERRIDES_PATH, "utf8"));
  const byName = new Map(venues.map((v) => [v.venue_name, v]));
  const byKey = new Map(venues.map((v) => [nameKey(v.venue_name), v]));
  const find = (name) => byName.get(name) || byKey.get(nameKey(name));

  let applied = 0;
  const unmatched = [];

  for (const [section, entries] of Object.entries(o)) {
    if (section.startsWith("_")) continue;
    for (const [name, patch] of Object.entries(entries)) {
      const v = find(name);
      if (!v) { unmatched.push(`${section}/${name}`); continue; }
      for (const [k, val] of Object.entries(patch)) {
        if (k === "reason" || k === "decided_by" || k === "decided_on") continue;
        v[k] = val;
      }
      v.override_reason = patch.reason ?? v.override_reason;
      v.override_source = `overrides.json/${section}`;
      if (section === "eligibility") v.eligibility_confidence = "verified";
      applied++;
    }
  }
  return { applied, unmatched };
}

/* ------------------------------------------------------------ name keys */

/**
 * Only genuinely generic words. An earlier version also stripped manor, castle,
 * house, lodge, arms and court — which collapsed "Adare Manor" and "Dunraven
 * Arms, Adare" to the same key, and "Bunratty Castle Hotel" and "Bunratty Manor
 * Hotel" to the same key. Those are four different businesses. In Irish venue
 * names the building type IS the distinguishing word, so it stays.
 */
const NOISE = new Set([
  "the", "and", "of", "at", "an", "a", "co", "county", "ireland",
  "hotel", "hotels", "spa", "resort", "leisure", "centre", "center", "club",
  "suites", "ltd", "limited", "venue", "weddings", "wedding", "collection",
]);

/** Everything distinctive in a name. "The Old Ground Hotel" -> "old ground". */
export function nameKey(name) {
  return stripParenthetical(name)
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((w) => w && !NOISE.has(w))
    .join(" ")
    .trim();
}

/** "Castlefergus Lodge (Ballyhannon Castle)" -> "Castlefergus Lodge". */
function stripParenthetical(name) {
  return (name || "").replace(/\s*\([^)]*\)\s*$/, "").trim();
}

/** The alternate name a researcher tucked into parentheses, if any. */
function parentheticalOf(name) {
  const m = (name || "").match(/\(([^)]+)\)\s*$/);
  return m ? m[1].trim() : null;
}

/**
 * A researcher's `possible_duplicate_of` note is either "same place" or "looks
 * similar, definitely not". Both are worth more than anything the string matcher
 * can work out on its own, so both are honoured.
 */
const ANTI_MERGE = /\b(do not merge|dont merge|don't merge|keep separate|separate property|different property|not this one|a different)\b/i;
const PRO_MERGE = /\b(same property|same site|same venue|alternate name|alternate directory name|former|previous name|pre-rebrand|shorter (trading|directory) name|also appear|duplicate)\b/i;

export function hintPolarity(hint) {
  if (!hint || hint === "null") return null;
  if (ANTI_MERGE.test(hint)) return "anti";
  if (PRO_MERGE.test(hint)) return "pro";
  return "unclear";
}

/** The full normalised name, noise words kept. Distinguishes Bunratty Castle from Bunratty Castle Hotel. */
function fullKey(name) {
  return (name || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function tokenOverlap(a, b) {
  const A = new Set(nameKey(a).split(" ").filter(Boolean));
  const B = new Set(nameKey(b).split(" ").filter(Boolean));
  if (!A.size || !B.size) return 0;
  const shared = [...A].filter((t) => B.has(t)).length;
  return shared / Math.min(A.size, B.size);
}

function sameTown(a, b) {
  const t = (s) => (s || "").toLowerCase().split(/[,/]/)[0].trim();
  return t(a) && t(a) === t(b);
}

/**
 * The registrable domain of a venue's own website — the single most reliable
 * identity signal available. Two records pointing at the same domain are the
 * same business, whatever the directories chose to call it. This is what
 * separates "Castle Oaks House Hotel" and "Castle Oaks House Hotel & Estate"
 * (one domain, one account) from "Bunratty Castle Hotel" and "Bunratty Castle &
 * Folk Park" (two domains, two businesses, one village).
 *
 * Aggregator and social domains are ignored, because every venue in the file
 * shares those and merging on them would collapse the universe to one row.
 */
const NON_IDENTIFYING = /(weddingsonline|weddingpages|weddingdates|bridebook|hitched|onefabday|mrs2be|facebook|instagram|tripadvisor|booking\.com|google|wikipedia|expedia|yelp|linkedin|youtube)/i;

export function siteDomain(url) {
  if (!url || url === "null") return null;
  try {
    const host = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase().replace(/^www\./, "");
    if (NON_IDENTIFYING.test(host)) return null;
    // Keep the registrable part: two labels, or three for .co.uk / .com.au style.
    const parts = host.split(".");
    if (parts.length > 2 && /^(co|com|org|net|gov|ac)$/.test(parts.at(-2))) return parts.slice(-3).join(".");
    return parts.slice(-2).join(".");
  } catch { return null; }
}

/* ------------------------------------------------------------ matching */

/**
 * Decide whether two records are the same account.
 *
 * Deliberately conservative. A false merge silently deletes a real prospect from
 * the universe and nobody notices; a false split shows up as two similar rows
 * and gets fixed in ten seconds. So anything short of a confident match is
 * recorded as a review item rather than actioned.
 */
export function matchStrength(a, b) {
  // A researcher who read both pages beats any string comparison. Check the
  // explicit hints first, in both directions, and let a "do not merge" veto.
  for (const [x, y] of [[a, b], [b, a]]) {
    const hint = x.possible_duplicate_of;
    if (!hint || hint === "null") continue;
    const names = [y.venue_name, parentheticalOf(y.venue_name), ...(y.alternate_names || [])].filter(Boolean);
    const hintsAtY = names.some((n) => nameKey(hint).includes(nameKey(n)) || nameKey(n).includes(nameKey(hint)));
    if (!hintsAtY) continue;
    const polarity = hintPolarity(hint);
    if (polarity === "anti") return { same: false, confidence: 0, reason: `researcher says keep separate: "${hint}"`, vetoed: true };
    if (polarity === "pro") return { same: true, confidence: 0.95, reason: `researcher identified the same property: "${hint}"` };
    return { same: false, confidence: 0.8, reason: `researcher flagged a possible duplicate: "${hint}"` };
  }

  // Names, including anything a researcher parked in parentheses.
  const aNames = [a.venue_name, parentheticalOf(a.venue_name)].filter(Boolean);
  const bNames = [b.venue_name, parentheticalOf(b.venue_name)].filter(Boolean);

  for (const an of aNames) for (const bn of bNames) {
    if (fullKey(an) === fullKey(bn)) return { same: true, confidence: 1, reason: "identical name" };
  }

  // Same website, same business. Checked before the name heuristics because it
  // beats all of them.
  const aDomain = siteDomain(a.website), bDomain = siteDomain(b.website);
  if (aDomain && bDomain) {
    if (aDomain === bDomain) return { same: true, confidence: 0.97, reason: `same website domain (${aDomain})` };
    // Two different real domains is strong evidence of two businesses, even when
    // the names look alike. Say so rather than sending it to review.
    if (tokenOverlap(a.venue_name, b.venue_name) >= 0.75) {
      return { same: false, confidence: 0.2, reason: `similar names but different domains (${aDomain} vs ${bDomain}) — two businesses` };
    }
  }

  for (const an of aNames) for (const bn of bNames) {
    const ak = nameKey(an), bk = nameKey(bn);
    if (!ak || !bk || ak !== bk) continue;
    // "Dromoland Castle" vs "Dromoland Castle Hotel" — same distinctive tokens,
    // different generic words. Same place unless the towns genuinely disagree.
    const townsConflict = a.location_text && b.location_text && !sameTown(a.location_text, b.location_text)
      && !(a.location_text.toLowerCase().includes(ak) || b.location_text.toLowerCase().includes(bk));
    return townsConflict
      ? { same: false, confidence: 0.6, reason: `same key "${ak}" but recorded in different towns — review` }
      : { same: true, confidence: 0.9, reason: `same distinctive name key "${ak}"` };
  }

  const overlap = Math.max(...aNames.flatMap((an) => bNames.map((bn) => tokenOverlap(an, bn))));
  if (overlap >= 0.75 && sameTown(a.location_text, b.location_text)) {
    return { same: false, confidence: 0.7, reason: `${Math.round(overlap * 100)}% name overlap in the same town — review` };
  }
  if (overlap >= 0.6) {
    return { same: false, confidence: 0.4, reason: `${Math.round(overlap * 100)}% name overlap — probably different` };
  }
  return { same: false, confidence: 0, reason: "different" };
}

/* -------------------------------------------------------------- merging */

const RICHNESS_FIELDS = [
  "wedding_offer_summary", "package_structure", "capacity", "onsite_accommodation",
  "likely_annual_weddings", "couple_planning_experience", "digital_experience_note",
  "buyer_role", "website", "latitude",
];

const richness = (v) => RICHNESS_FIELDS.filter((f) => v[f] != null && v[f] !== "" && v[f] !== "null").length;

/**
 * Fold duplicate records into one, keeping the fullest value per field and
 * recording every disagreement rather than picking a winner quietly. A capacity
 * listed as 70 by one source and 200 by another is a fact about the sources, not
 * a number to average.
 */
function fold(records) {
  const ordered = [...records].sort((a, b) => richness(b) - richness(a));
  const out = { ...ordered[0] };
  const conflicts = [];
  const sources = new Set(), foundVia = new Set();

  for (const r of ordered) {
    for (const s of r.sources || []) sources.add(s);
    if (r._slice) foundVia.add(r._slice);
    for (const [k, val] of Object.entries(r)) {
      if (val == null || val === "" || val === "null") continue;
      if (out[k] == null || out[k] === "" || out[k] === "null") { out[k] = val; continue; }
      const differs = String(out[k]).trim().toLowerCase() !== String(val).trim().toLowerCase();
      if (differs && ["capacity", "likely_annual_weddings", "venue_type", "status_flag", "buyer_role", "eligibility", "county"].includes(k)) {
        conflicts.push(`${k}: "${out[k]}" vs "${val}"`);
      }
    }
  }

  out.sources = [...sources];
  out.found_via = [...foundVia];
  out.corroboration = foundVia.size;
  out.merged_from = records.length;
  out.field_conflicts = [...new Set(conflicts)];
  out.alternate_names = [...new Set(records.map((r) => r.venue_name))].filter((n) => n !== out.venue_name);
  return out;
}

/* --------------------------------------------------------------- groups */

/**
 * Group and multi-property detection. Two properties under one operator are two
 * accounts and one buyer — outreach that treats them as unrelated prospects
 * reads as a mail merge, which is exactly the impression this product cannot
 * afford to give.
 */
function detectGroups(venues) {
  const byOperator = new Map();
  for (const v of venues) {
    const op = (v.group_or_operator || "").trim();
    if (!op || op.toLowerCase() === "null" || op.toLowerCase() === "none") continue;
    const key = nameKey(op) || op.toLowerCase();
    if (!byOperator.has(key)) byOperator.set(key, { operator: op, members: [] });
    byOperator.get(key).members.push(v.venue_name);
  }
  return [...byOperator.values()].filter((g) => g.members.length > 1);
}

/* ---------------------------------------------------------------- merge */

function cmdMerge(dir, outPath) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  const all = [];
  const provenance = [];

  for (const f of files) {
    const raw = JSON.parse(readFileSync(join(dir, f), "utf8"));
    const venues = raw.venues || [];
    provenance.push({ file: f, slice: raw.slice || f, count: venues.length, coverage_note: raw.coverage_note || null });
    for (const v of venues) all.push({ ...v, _slice: raw.slice || f, _file: f });
  }

  // Single-pass clustering. Each record joins the first cluster it confidently
  // matches; near-misses are logged for a human instead of guessed at.
  const clusters = [];
  const reviewPairs = [];
  for (const v of all) {
    let placed = false;
    for (const c of clusters) {
      const m = matchStrength(c[0], v);
      if (m.same) { c.push(v); placed = true; break; }
      if (m.confidence >= 0.5) {
        reviewPairs.push({ a: c[0].venue_name, b: v.venue_name, confidence: m.confidence, reason: m.reason, files: [c[0]._file, v._file] });
      }
    }
    if (!placed) clusters.push([v]);
  }

  const merged = clusters.map(fold).sort((a, b) =>
    (a.county || "").localeCompare(b.county || "") || a.venue_name.localeCompare(b.venue_name));

  const idStats = assignIds(merged);
  const overrideStats = applyOverrides(merged);

  const groups = detectGroups(merged);
  const dedupedAway = all.length - merged.length;

  const result = {
    generated_by: "venue-merge.mjs merge",
    provenance,
    account_ids: idStats,
    overrides: overrideStats,
    raw_records: all.length,
    unique_accounts: merged.length,
    duplicates_folded: dedupedAway,
    corroboration: {
      three_or_more_sweeps: merged.filter((v) => v.corroboration >= 3).length,
      two_sweeps: merged.filter((v) => v.corroboration === 2).length,
      single_sweep: merged.filter((v) => v.corroboration === 1).length,
    },
    review_required: {
      near_miss_pairs: dedupe(reviewPairs),
      field_conflicts: merged.filter((v) => v.field_conflicts?.length).map((v) => ({ account_id: v.account_id, venue_name: v.venue_name, conflicts: v.field_conflicts })),
      duplicate_hints_from_researchers: merged.filter((v) => v.possible_duplicate_of && v.possible_duplicate_of !== "null")
        .map((v) => ({ account_id: v.account_id, venue_name: v.venue_name, hint: v.possible_duplicate_of })),
      groups_and_multi_property: groups,
      not_trading: merged.filter((v) => ["closed", "sold", "rebranded", "unclear"].includes(v.status_flag))
        .map((v) => ({ account_id: v.account_id, venue_name: v.venue_name, status: v.status_flag })),
    },
    venues: merged,
  };

  writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`Files merged:        ${files.length}`);
  console.log(`Account IDs:         ${idStats.reused} kept, ${idStats.issued} newly issued, ${idStats.retired} retired`);
  console.log(`Human overrides:     ${overrideStats.applied} applied${overrideStats.unmatched.length ? `, ${overrideStats.unmatched.length} STALE: ${overrideStats.unmatched.join(", ")}` : ""}`);
  console.log(`Raw records:         ${all.length}`);
  console.log(`Unique accounts:     ${merged.length}`);
  console.log(`Duplicates folded:   ${dedupedAway}`);
  console.log(`Corroborated 3+:     ${result.corroboration.three_or_more_sweeps}`);
  console.log(`Corroborated 2:      ${result.corroboration.two_sweeps}`);
  console.log(`Single sweep only:   ${result.corroboration.single_sweep}`);
  console.log(`Near-miss pairs:     ${result.review_required.near_miss_pairs.length}  (human review)`);
  console.log(`Field conflicts:     ${result.review_required.field_conflicts.length}`);
  console.log(`Groups detected:     ${groups.length}`);
  console.log(`Not trading:         ${result.review_required.not_trading.length}`);
  console.log(`→ ${outPath}`);
}

function dedupe(pairs) {
  const seen = new Set(), out = [];
  for (const p of pairs) {
    const k = [p.a, p.b].sort().join("|");
    if (seen.has(k)) continue;
    seen.add(k); out.push(p);
  }
  return out.sort((x, y) => y.confidence - x.confidence);
}

function cmdReview(inPath) {
  const d = JSON.parse(readFileSync(inPath, "utf8"));
  const r = d.review_required;
  const section = (title, rows, fmt) => {
    console.log(`\n## ${title} (${rows.length})`);
    if (!rows.length) return console.log("  none");
    rows.slice(0, 40).forEach((x) => console.log("  " + fmt(x)));
    if (rows.length > 40) console.log(`  ... and ${rows.length - 40} more`);
  };
  console.log(`Universe: ${d.unique_accounts} accounts from ${d.raw_records} raw records.`);
  section("Possible duplicates — same account or two businesses?", r.near_miss_pairs,
    (p) => `${p.a}  ~  ${p.b}   [${p.reason}]`);
  section("Groups and multi-property operators — one buyer, several accounts", r.groups_and_multi_property,
    (g) => `${g.operator}: ${g.members.join(" · ")}`);
  section("Researcher duplicate hints", r.duplicate_hints_from_researchers, (h) => `${h.venue_name} → ${h.hint}`);
  section("Not confirmed trading — do not contact before checking", r.not_trading, (n) => `${n.venue_name} [${n.status}]`);
  section("Conflicting facts between sources", r.field_conflicts,
    (c) => `${c.venue_name}: ${c.conflicts.join(" | ")}`);
}

/* ----------------------------------------------------------------- main */

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const [, , cmd, a, b] = process.argv;
  if (cmd === "merge") cmdMerge(a, b);
  else if (cmd === "review") cmdReview(a);
  else { console.error("Usage: merge <discovery-dir> <out.json> | review <merged.json>"); process.exit(1); }
}
