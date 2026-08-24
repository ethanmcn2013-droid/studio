#!/usr/bin/env node
/**
 * venue-rank.mjs — the venue-ranking score (E10.03) and the cohort builder
 * (E10.12, E10.13, E10.14).
 *
 * E10.03's title names five dimensions: wedding focus, brand quality, likely
 * booking volume, decision accessibility and strategic fit. Scoring them is the
 * easy half. The hard half is what the score is FOR, and that is a genuinely
 * open founder choice, so this file implements four defensible answers and
 * ranks the same universe through all of them rather than picking one quietly.
 *
 *   convert    the 25 most likely to say yes
 *   reference  the 25 whose names make the next hundred easier
 *   learn      a stratified 25 that tells you which segment converts
 *   map        the 25 that form one dense constellation, not 25 scattered dots
 *
 * `compare` shows how far apart they actually land. Where they agree, there is
 * no decision to make. Where they diverge, that is the decision.
 *
 * Volume never screens. D-020 is explicit: a 40-wedding venue and a
 * 250-wedding venue both pay EUR 1,000 and both are wanted. Volume moves rank
 * in two of the four models and moves nothing in the other two, and no model
 * may exclude on it. `assertNoVolumeScreen` enforces that.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/* ------------------------------------------------------------- dimensions */

/**
 * Every dimension is scored 0-5 by the research pass, and every score carries a
 * written basis. A score without a basis is treated as unscored, not as zero —
 * absent evidence and bad evidence are different things and collapsing them is
 * how a ranking quietly becomes fiction.
 */
export const DIMENSIONS = {
  wedding_focus: {
    label: "Wedding focus",
    asks: "How central are weddings to this business?",
    scale: {
      5: "Weddings are the business. Dedicated wedding venue, one wedding a day, nothing else competes for the space.",
      4: "Weddings are the flagship revenue line and the site leads with them.",
      3: "Serious weddings operation alongside other trade, with a dedicated coordinator.",
      2: "Weddings are one of several equal lines. A function room that also does weddings.",
      1: "Occasional weddings. No dedicated wedding proposition.",
      0: "Not a wedding venue.",
    },
  },
  brand_quality: {
    label: "Brand quality",
    asks: "How well regarded and how well presented is this venue?",
    scale: {
      5: "Nationally known. Award-winning, beautifully presented, a name a couple recognises.",
      4: "Regionally strong. Excellent site and photography, real reputation.",
      3: "Solid and credible. Competent presentation, good local standing.",
      2: "Dated or thin presentation, but a real operating venue.",
      1: "Weak presentation that actively undersells the place.",
      0: "No discernible brand.",
    },
  },
  likely_volume: {
    label: "Likely annual weddings",
    asks: "Roughly how many weddings a year? Bands, never a screen.",
    scale: {
      5: "150+", 4: "80-150", 3: "40-80", 2: "20-40", 1: "Under 20 — eligibility question", 0: "Unknown",
    },
  },
  decision_access: {
    label: "Decision accessibility",
    asks: "How few steps to the person who can say yes to EUR 1,000?",
    scale: {
      5: "Owner-operated single property. The person who answers the phone can decide.",
      4: "Independent venue with a named general manager who holds budget.",
      3: "Independent, but the decision sits above the wedding coordinator.",
      2: "Small group. Decision likely at group level, but reachable.",
      1: "Large group or chain with central procurement.",
      0: "Unclear who could possibly decide.",
    },
  },
  strategic_fit: {
    label: "Strategic fit",
    asks: "How badly does this venue need what Venue Edition is?",
    scale: {
      5: "Planning runs on email, a Word document and a spreadsheet. The gap is obvious and painful.",
      4: "A PDF brochure and a coordinator's inbox. No couple-facing system at all.",
      3: "Some structure, no shared workspace. A checklist emailed at booking.",
      2: "Uses a third-party planning tool already, or a decent portal.",
      1: "Strong existing couple-facing system. Venue Edition displaces something that works.",
      0: "Unknown.",
    },
  },
};

/* ----------------------------------------------------------------- models */

/**
 * Four answers to "what is Cohort 1 for?". Each is defensible and they select
 * materially different venues. This is the open choice E10.03 carries, brought
 * as options rather than resolved silently.
 */
export const MODELS = {
  convert: {
    label: "Convert — the 25 most likely to say yes",
    thesis:
      "Founding places are only worth something once 25 are sold. Rank by probability of yes: reachable decision-makers who feel the problem. Get to 25 paid, then let the finished list do the reference work.",
    weights: { wedding_focus: 2, brand_quality: 1, likely_volume: 1, decision_access: 3, strategic_fit: 3 },
    risk: "A founding 25 with no recognisable names is harder to sell against next year, and the standard EUR 1,500 has to stand on its own.",
  },
  reference: {
    label: "Reference — the 25 whose names make the next hundred easier",
    thesis:
      "The founding cohort is a marketing asset for years. Rank by signalling value: the flagships, the award-winners, the names a couple already knows. A list led by the region's best venues sells itself.",
    weights: { wedding_focus: 2, brand_quality: 3, likely_volume: 3, decision_access: 1, strategic_fit: 1 },
    risk:
      "The slowest accounts to close, approached with untested copy, and D-020 already accepts a permanent loss of roughly EUR 750 a year on a 250-wedding venue. This model deliberately loads the cohort with those.",
  },
  learn: {
    label: "Learn — a stratified 25 that tells you which segment converts",
    thesis:
      "Nobody knows yet which venue type buys this. Send 25 across every segment, then let cohorts 2, 3 and 4 be built on evidence instead of a guess. The first cohort's job is information.",
    weights: { wedding_focus: 2, brand_quality: 2, likely_volume: 1, decision_access: 2, strategic_fit: 2 },
    stratify: true,
    risk: "Optimises for neither speed nor prestige. If the founder needs 25 sold rather than 25 understood, this is the wrong model.",
  },
  map: {
    label: "Map — the 25 that form one constellation",
    thesis:
      "The founding cohort is the opening beat of the film (E13.03) and the proof of 'Limerick and the surrounding counties'. Twenty-five dots clustered tight read as a place that adopted this. Twenty-five scattered dots read as a list. Venues in the same cluster also know each other, which is where referrals actually come from.",
    weights: { wedding_focus: 2, brand_quality: 2, likely_volume: 1, decision_access: 2, strategic_fit: 2 },
    clusterBonus: true,
    risk: "Deliberately passes over strong venues for being in the wrong place, and concentrates the cohort so a single bad regional reputation could travel.",
  },
};

/* ---------------------------------------------------------------- scoring */

export function scoreVenue(v, model) {
  const w = MODELS[model].weights;
  let total = 0, max = 0, unscored = [];
  for (const dim of Object.keys(DIMENSIONS)) {
    const s = v.scores?.[dim];
    const weight = w[dim];
    max += 5 * weight;
    if (s?.value == null || !s?.basis) { unscored.push(dim); continue; }
    total += s.value * weight;
  }
  return {
    raw: total,
    pct: max ? Number(((total / max) * 100).toFixed(1)) : null,
    unscored,
    confidence: unscored.length === 0 ? "full" : unscored.length <= 1 ? "partial" : "thin",
  };
}

/** Rewards venues sitting in a cluster that already has strong candidates. */
function clusterDensityBonus(venues) {
  const strength = new Map();
  for (const v of venues) {
    if (!v.cluster) continue;
    const s = scoreVenue(v, "convert").pct ?? 0;
    strength.set(v.cluster, (strength.get(v.cluster) || 0) + s);
  }
  const maxS = Math.max(1, ...strength.values());
  return (v) => (v.cluster ? ((strength.get(v.cluster) || 0) / maxS) * 15 : 0);
}

/**
 * Rank the universe through one model.
 *
 * Only venues inside the ring and eligible are ranked. That is a geography and
 * eligibility filter, both ratified in D-012 — it is not a volume screen, and
 * `assertNoVolumeScreen` proves the difference holds.
 */
/** A venue that has closed or been sold is not a prospect, whatever it scores. */
export const NOT_A_PROSPECT = ["closed", "sold"];

export function rank(venues, model) {
  const eligible = venues.filter(
    (v) => ["15", "30", "45"].includes(v.drive_time_ring) && v.eligibility !== "out" && !NOT_A_PROSPECT.includes(v.status_flag),
  );
  const bonus = MODELS[model].clusterBonus ? clusterDensityBonus(eligible) : () => 0;

  const scored = eligible
    .map((v) => {
      const s = scoreVenue(v, model);
      return { ...v, score: s, ranked_value: (s.pct ?? 0) + bonus(v) };
    })
    .sort((a, b) => b.ranked_value - a.ranked_value);

  return MODELS[model].stratify ? stratify(scored) : scored;
}

/**
 * The learn model's stratified pick: take the strongest candidate from each
 * segment in turn before taking anyone's second, so all 25 sends span the market
 * rather than clustering on one venue type.
 */
function stratify(scored) {
  const segOf = (v) => `${v.venue_type || "unknown"}|${v.scores?.likely_volume?.value >= 4 ? "large" : v.scores?.likely_volume?.value >= 3 ? "mid" : "small"}`;
  const bySeg = new Map();
  for (const v of scored) {
    if (!bySeg.has(segOf(v))) bySeg.set(segOf(v), []);
    bySeg.get(segOf(v)).push(v);
  }
  const out = [], queues = [...bySeg.values()];
  while (out.length < scored.length) {
    let took = false;
    for (const q of queues) if (q.length) { out.push(q.shift()); took = true; }
    if (!took) break;
  }
  return out;
}

/**
 * D-020, enforced rather than remembered. No model may drop a venue for being
 * too big or too small once it is eligible and in the ring.
 */
export function assertNoVolumeScreen(venues) {
  const failures = [];
  const inRing = venues.filter((v) => ["15", "30", "45"].includes(v.drive_time_ring) && v.eligibility !== "out" && !NOT_A_PROSPECT.includes(v.status_flag));
  for (const model of Object.keys(MODELS)) {
    const ranked = rank(venues, model);
    if (ranked.length !== inRing.length) {
      failures.push(`${model}: ranked ${ranked.length} of ${inRing.length} eligible in-ring venues`);
    }
    for (const band of [5, 4, 3, 2]) {
      const present = inRing.filter((v) => v.scores?.likely_volume?.value === band).length;
      const kept = ranked.filter((v) => v.scores?.likely_volume?.value === band).length;
      if (present && kept !== present) failures.push(`${model}: dropped ${present - kept} venues in volume band ${band}`);
    }
  }
  return failures;
}

/* ---------------------------------------------------------------- cohorts */

export const COHORT_SIZE = 25;

/**
 * Build the cohorts (E10.12, E10.13, E10.14).
 *
 * D-017: twenty-five places, twenty-five venues contacted per cohort, released
 * sequentially until twenty-five have signed and paid. So a cohort is a send
 * list, not a shortlist, and every account in it has to be genuinely contactable
 * on the day it is released.
 *
 * Three rules the ranking alone will not give you:
 *
 * 1. **One property per operator per cohort.** Two hotels in the same group
 *    means one buyer receiving two personalised films in the same week, which is
 *    the exact impression a personalised film exists to avoid. The second
 *    property drops to the next cohort. It is not dropped from the universe.
 *
 * 2. **Nothing unconfirmed goes in a cohort.** A venue whose trading status is
 *    not `trading` is held in reserve until someone checks. R-033: a film sent
 *    to a venue that has closed is worse than no outreach.
 *
 * 3. **Cohorts that do not exist are not invented.** If the ring cannot fill
 *    four cohorts, the later ones come back short and say so. Padding them from
 *    the out-of-ring band would quietly overturn ratified geography.
 */
export function buildCohorts(venues, model, { size = COHORT_SIZE } = {}) {
  const ranked = rank(venues, model);

  const contactable = ranked.filter((v) => v.status_flag === "trading" || v.status_flag == null);
  const unconfirmed = ranked.filter((v) => v.status_flag && v.status_flag !== "trading");
  void NOT_A_PROSPECT; // rank() has already dropped closed and sold accounts.

  const cohorts = [];
  const deferredByOperator = [];
  let pool = [...contactable];

  while (pool.length && cohorts.length < 4) {
    const cohort = [];
    const operatorsUsed = new Set();
    const passedOver = [];

    for (const v of pool) {
      if (cohort.length >= size) { passedOver.push(v); continue; }
      const op = (v.group_or_operator || "").trim().toLowerCase();
      if (op && op !== "null" && operatorsUsed.has(op)) {
        passedOver.push(v);
        deferredByOperator.push({ venue_name: v.venue_name, operator: v.group_or_operator, cohort: cohorts.length + 1 });
        continue;
      }
      if (op && op !== "null") operatorsUsed.add(op);
      cohort.push(v);
    }

    cohorts.push(cohort);
    pool = passedOver;
    if (!cohort.length) break;
  }

  return {
    model,
    cohorts: cohorts.map((c, i) => ({
      number: i + 1,
      size: c.length,
      short: Math.max(0, size - c.length),
      venues: c.map((v, j) => ({
        position: j + 1,
        account_id: v.account_id,
        venue_name: v.venue_name,
        cluster: v.cluster,
        drive_minutes: v.drive_minutes,
        venue_type: v.venue_type,
        buyer_role: v.buyer_role,
        score_pct: v.score.pct,
        score_confidence: v.score.confidence,
        near_boundary: v.near_boundary,
        fit_reason: v.fit_reason ?? null,
      })),
    })),
    reserve: pool.map((v) => ({ account_id: v.account_id, venue_name: v.venue_name, score_pct: v.score.pct })),
    heldUnconfirmed: unconfirmed.map((v) => ({ account_id: v.account_id, venue_name: v.venue_name, status: v.status_flag })),
    deferredByOperator,
    shortfall: {
      contactableAccounts: contactable.length,
      cohortsFullyFilled: cohorts.filter((c) => c.length === size).length,
      totalPlaced: cohorts.reduce((n, c) => n + c.length, 0),
      cohortsRequestedByBacklog: 4,
    },
  };
}

/* ---------------------------------------------------------------- compare */

function cmdCompare(inPath, outPath) {
  const venues = JSON.parse(readFileSync(inPath, "utf8"));
  const screenFailures = assertNoVolumeScreen(venues);

  const results = {};
  for (const m of Object.keys(MODELS)) results[m] = rank(venues, m);

  const top25 = Object.fromEntries(Object.entries(results).map(([m, r]) => [m, r.slice(0, 25).map((v) => v.account_id)]));
  const names = new Map(venues.map((v) => [v.account_id, v.venue_name]));

  const modelKeys = Object.keys(MODELS);
  const overlap = {};
  for (const a of modelKeys) for (const b of modelKeys) {
    if (a >= b) continue;
    const setB = new Set(top25[b]);
    overlap[`${a} vs ${b}`] = top25[a].filter((id) => setB.has(id)).length;
  }

  const inAll = top25[modelKeys[0]].filter((id) => modelKeys.every((m) => top25[m].includes(id)));
  const inOne = [...new Set(modelKeys.flatMap((m) => top25[m]))].filter(
    (id) => modelKeys.filter((m) => top25[m].includes(id)).length === 1,
  );

  console.log(`Universe ${venues.length} · eligible and in-ring ${results.convert.length}\n`);
  if (screenFailures.length) {
    console.log("VOLUME SCREEN CHECK FAILED (D-020):");
    screenFailures.forEach((f) => console.log(`  ${f}`));
  } else {
    console.log("Volume screen check: PASS. No model drops a venue for its size (D-020).");
  }

  console.log("\nTop-25 overlap between models:");
  for (const [k, n] of Object.entries(overlap)) console.log(`  ${k.padEnd(24)} ${n}/25`);

  console.log(`\nPicked by ALL four models (${inAll.length}) — no decision needed here:`);
  inAll.forEach((id) => console.log(`  ${names.get(id)}`));

  console.log(`\nPicked by exactly ONE model (${inOne.length}) — this is where the choice bites:`);
  inOne.forEach((id) => {
    const only = modelKeys.find((m) => top25[m].includes(id));
    console.log(`  ${(names.get(id) || id).padEnd(42)} ${only}`);
  });

  if (outPath) {
    writeFileSync(outPath, JSON.stringify({
      generated: "venue-rank.mjs compare",
      universeCount: venues.length,
      eligibleInRing: results.convert.length,
      volumeScreenCheck: screenFailures.length ? screenFailures : "pass",
      models: Object.fromEntries(Object.entries(MODELS).map(([k, m]) => [k, { label: m.label, thesis: m.thesis, risk: m.risk, weights: m.weights }])),
      top25: Object.fromEntries(Object.entries(top25).map(([m, ids]) => [m, ids.map((id) => ({ account_id: id, venue_name: names.get(id) }))])),
      overlap, unanimous: inAll.map((id) => ({ account_id: id, venue_name: names.get(id) })),
      contested: inOne.map((id) => ({ account_id: id, venue_name: names.get(id), onlyIn: modelKeys.find((m) => top25[m].includes(id)) })),
      fullRanking: Object.fromEntries(Object.entries(results).map(([m, r]) => [m, r.map((v, i) => ({ position: i + 1, account_id: v.account_id, venue_name: v.venue_name, pct: v.score.pct, confidence: v.score.confidence }))])),
    }, null, 2));
    console.log(`\n→ ${outPath}`);
  }
}


/* ----------------------------------------------------------------- main */

/**
 * Only dispatch when this file IS the command. Without this, importing it from
 * a test runs the CLI, hits the usage branch and exits the test process.
 */
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

function cmdCohorts(inPath, model, outPath) {
  const venues = JSON.parse(readFileSync(inPath, "utf8"));
  if (!MODELS[model]) { console.error(`Unknown model "${model}". One of: ${Object.keys(MODELS).join(", ")}`); process.exit(1); }
  const r = buildCohorts(venues, model);

  console.log(`Model: ${MODELS[model].label}`);
  console.log(`Contactable, eligible, in-ring accounts: ${r.shortfall.contactableAccounts}
`);
  for (const c of r.cohorts) {
    console.log(`Cohort ${c.number}: ${c.size}/${COHORT_SIZE}${c.short ? `  SHORT BY ${c.short}` : ""}`);
    c.venues.forEach((v) => console.log(`  ${String(v.position).padStart(2)}. ${v.venue_name.padEnd(44)} ${String(v.drive_minutes).padStart(5)}m  ${String(v.score_pct).padStart(5)}%  ${v.cluster}${v.near_boundary ? "  [confirm ring]" : ""}`));
    console.log("");
  }
  console.log(`Reserve: ${r.reserve.length}`);
  console.log(`Held, trading status unconfirmed: ${r.heldUnconfirmed.length}`);
  if (r.deferredByOperator.length) {
    console.log(`
Deferred to a later cohort so one operator is not contacted twice in a week:`);
    r.deferredByOperator.forEach((d) => console.log(`  ${d.venue_name} (${d.operator}) — would have been cohort ${d.cohort}`));
  }
  const filled = r.shortfall.cohortsFullyFilled;
  if (filled < 4) {
    console.log(`
SHORTFALL: ${filled} of 4 cohorts can be filled to ${COHORT_SIZE} from the ratified ring.`);
    console.log(`Placed ${r.shortfall.totalPlaced} accounts across ${r.cohorts.length} cohorts. The rest do not exist inside the ring.`);
  }
  if (outPath) { writeFileSync(outPath, JSON.stringify(r, null, 2)); console.log(`
-> ${outPath}`); }
}

if (isMain) {
  const [, , cmd, a, b, c] = process.argv;
  if (cmd === "compare") cmdCompare(a, b);
  else if (cmd === "cohorts") cmdCohorts(a, b, c);
  else { console.error(`Unknown command "${cmd ?? ""}". Try: compare <venues.json> [out.json] | cohorts <venues.json> <model> [out.json]`); process.exit(1); }
}
