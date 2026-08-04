// venue-universe.test.mjs — tests on the two rules in WP-02 whose failure is
// expensive rather than annoying:
//
//   1. Personal contact data reaching the project tree (a repo share becomes a
//      data incident), and
//   2. A ranking model quietly screening venues out by size, which D-020
//      forbids in the founder's own words.
//
// Plus the geometry, because a wrong coordinate puts a real venue's name on the
// wrong dot in a film that gets emailed to that venue.
//
//   node --test tools/venue-universe.test.mjs
//
// Pure functions only. Nothing here touches the network or writes to the tree.

import test from "node:test";
import assert from "node:assert/strict";

import { guardText, COLUMNS } from "./venue-export.mjs";
import { ringFor, isNearBoundary, clusterFor, BOUNDARY_BAND, ANCHOR, ENGINES } from "./venue-geo.mjs";
import { MODELS, DIMENSIONS, scoreVenue, rank, assertNoVolumeScreen, buildCohorts, COHORT_SIZE } from "./venue-rank.mjs";

/* ------------------------------------------------------- data handling ---- */

test("the column set carries no contact field", () => {
  const banned = ["contact_name", "email", "phone", "postal_address", "address", "linkedin_url", "first_name", "last_name"];
  for (const b of banned) {
    assert.ok(!COLUMNS.includes(b), `${b} must never be a column — contacts live in the CRM, joined on account_id`);
  }
  assert.ok(COLUMNS.includes("account_id"), "account_id is the join key and must be present");
  assert.ok(COLUMNS.includes("buyer_role"), "the buyer is recorded as a role, never as a person");
});

test("the guard catches email addresses", () => {
  const g = guardText("account_id,venue_name\nVEN-1,Somewhere House bookings@somewhere.ie");
  assert.equal(g.clean, false);
  assert.ok(g.findings.some((f) => f.kind === "email address"));
});

test("the guard catches Irish phone numbers in several shapes", () => {
  for (const n of ["+353 61 396566", "061 396566", "087 123 4567", "+353-87-1234567"]) {
    const g = guardText(`account_id,notes\nVEN-1,${n}`);
    assert.equal(g.clean, false, `${n} should be caught`);
  }
});

test("the guard catches a forbidden column even when every row is empty", () => {
  const g = guardText("account_id,venue_name,email\nVEN-1,Somewhere House,");
  assert.equal(g.clean, false);
  assert.ok(g.findings.some((f) => f.kind.includes("forbidden column")));
});

test("the guard never echoes the value it found", () => {
  const secret = "bookings@somewhere.ie";
  const g = guardText(`account_id,notes\nVEN-1,${secret}`);
  const dump = JSON.stringify(g);
  assert.ok(!dump.includes(secret), "a report that quotes the leaked address has leaked it again");
});

test("business phrasing does not trip the guard, in either mode", () => {
  // A guard that blocks legitimate exports is a guard somebody switches off.
  const fine = [
    "contact the wedding office via the site form",
    "Owned by a Limerick family",
    "ask for the events desk",
    "Run by Sales Lead structure",
    "speak to the coordinator before quoting capacity",
  ];
  for (const line of fine) {
    for (const personHintFatal of [false, true]) {
      const g = guardText(`account_id,notes\nVEN-1,${line}`, "t", { personHintFatal });
      assert.equal(g.clean, true, `"${line}" must not be treated as personal data (fatal=${personHintFatal})`);
    }
  }
});

test("the known limit of the text guard is documented, not accidental", () => {
  // Once a row is flattened to CSV there are no fields left, so a venue whose
  // NAME begins "Contact ..." is indistinguishable from a note naming a person.
  // Export tolerates it (warns), audit does not (fails). Both are deliberate,
  // and this test exists so a future change to either is a decision.
  const line = "account_id,venue_name\nVEN-1,Contact House Hotel";

  const onExport = guardText(line, "t", { personHintFatal: false });
  assert.equal(onExport.clean, true, "an export must not be blocked by a venue's own name");
  assert.equal(onExport.warnings.length, 1, "but it is surfaced for review");

  const onAudit = guardText(line, "t", { personHintFatal: true });
  assert.equal(onAudit.clean, false, "a deliberate audit stays strict and accepts the false positive");
});

test("a real named person is caught in audit mode", () => {
  for (const line of ["Owned by Patrick Sheehan since 2019", "Contact Mary Boyle for weddings", "ask for John Ryan"]) {
    const g = guardText(`account_id,notes\nVEN-1,${line}`, "t", { personHintFatal: true });
    assert.equal(g.clean, false, `"${line}" must be caught`);
  }
});

/* ------------------------------------------------------------ geometry ---- */

test("the anchor is a fixed, documented point", () => {
  assert.equal(ANCHOR.latitude, 52.6589231);
  assert.equal(ANCHOR.longitude, -8.6317822);
  assert.ok(ANCHOR.resolvedFrom.startsWith("https://"), "the anchor records where it came from");
});

test("rings are assigned at the ratified 45-minute boundary", () => {
  assert.equal(ringFor(12), "15");
  assert.equal(ringFor(15), "15");
  assert.equal(ringFor(15.1), "30");
  assert.equal(ringFor(45), "45");
  assert.equal(ringFor(45.1), "borderline_45_60", "past 45 minutes is out of the market, not rounded in");
  assert.equal(ringFor(61), "out");
  assert.equal(ringFor(null), null, "an unrouted venue has no ring, it does not default to one");
});

test("the boundary band is wide enough to cover the model's known error", () => {
  // Both engines are free-flow, so the true time is longer by an unquantified
  // margin. The band is how that is handled honestly.
  assert.ok(BOUNDARY_BAND.lowMinutes < 45 && BOUNDARY_BAND.highMinutes > 45);
  assert.equal(isNearBoundary(44), true);
  assert.equal(isNearBoundary(47), true, "just outside still needs a human look");
  assert.equal(isNearBoundary(20), false);
  assert.equal(isNearBoundary(70), false);
  assert.ok(ENGINES.knownBias.length > 0, "the bias is stated, not hidden");
});

test("every cluster resolves for points across the ring", () => {
  const points = [
    [52.6638, -8.6267], [52.5643, -8.7891], [52.8438, -8.9864], [52.8642, -8.1969],
    [52.3547, -8.6797], [52.8078, -8.4383], [52.4736, -8.1611], [52.4489, -9.0553],
  ];
  for (const [lat, lon] of points) {
    const c = clusterFor(lat, lon, "45");
    assert.notEqual(c.id, "unclassified", `${lat},${lon} fell through every cluster`);
    assert.ok(c.label.length > 0);
  }
});

test("the market's clusters are not used to describe places outside it", () => {
  // The outer clusters are defined by exclusion, so applied to a Dublin or Mayo
  // record they match something. They previously did: every Leinster account
  // carried in from the old repository lists was tallied under south Galway.
  const dublin = [53.35, -6.26], mayo = [53.8, -9.5];
  for (const [lat, lon] of [dublin, mayo]) {
    assert.equal(clusterFor(lat, lon, "out").id, "out_of_market");
  }
  assert.equal(clusterFor(53.35, -6.26, "45").id !== "out_of_market", true,
    "a ring value is what gates it, so an in-ring point still clusters normally");
});

/* ------------------------------------------------------------- ranking ---- */

// `...over` last so a test can set any field, including ones this helper does
// not name. An earlier version listed the fields explicitly and silently dropped
// group_or_operator, which made the operator test pass against nothing.
const fixture = (over = {}) => ({
  account_id: "VEN-0001",
  venue_name: "Fixture House",
  drive_time_ring: "30",
  eligibility: "in",
  status_flag: "trading",
  cluster: "west_limerick",
  venue_type: "country_house",
  scores: Object.fromEntries(Object.keys(DIMENSIONS).map((d) => [d, { value: 3, basis: "fixture" }])),
  ...over,
});

test("all five E10.03 dimensions are defined with a scale and a question", () => {
  for (const d of ["wedding_focus", "brand_quality", "likely_volume", "decision_access", "strategic_fit"]) {
    assert.ok(DIMENSIONS[d], `${d} is named in the task title and must exist`);
    assert.ok(DIMENSIONS[d].asks.length > 0);
    assert.equal(Object.keys(DIMENSIONS[d].scale).length, 6, "0-5 inclusive");
  }
});

test("a score without a written basis is unscored, not zero", () => {
  const v = fixture({ scores: { wedding_focus: { value: 5 }, brand_quality: { value: 5, basis: "site" } } });
  const s = scoreVenue(v, "convert");
  assert.ok(s.unscored.includes("wedding_focus"), "a value with no basis must not count");
  assert.equal(s.confidence, "thin");
});

test("every model states its thesis and its risk", () => {
  for (const [key, m] of Object.entries(MODELS)) {
    assert.ok(m.thesis.length > 40, `${key} needs a real thesis`);
    assert.ok(m.risk.length > 40, `${key} must own its downside — options without stated risks are not options`);
  }
});

test("no model screens a venue out by size — D-020", () => {
  // The founder's words: "I don't care if they have forty weddings or if they
  // have two hundred and fifty weddings. They're locked in at a thousand."
  const universe = [];
  for (let band = 1; band <= 5; band++) {
    for (let i = 0; i < 6; i++) {
      universe.push(fixture({
        account_id: `VEN-${band}${i}`,
        venue_name: `Band ${band} venue ${i}`,
        cluster: ["west_limerick", "lough_derg", "ennis_mid_clare"][i % 3],
        scores: {
          ...Object.fromEntries(Object.keys(DIMENSIONS).map((d) => [d, { value: (i % 5) + 1, basis: "fixture" }])),
          likely_volume: { value: band, basis: "fixture" },
        },
      }));
    }
  }
  assert.deepEqual(assertNoVolumeScreen(universe), [], "a model dropped venues by volume band");

  for (const model of Object.keys(MODELS)) {
    const ranked = rank(universe, model);
    for (let band = 1; band <= 5; band++) {
      const kept = ranked.filter((v) => v.scores.likely_volume.value === band).length;
      assert.equal(kept, 6, `${model} lost venues in volume band ${band}`);
    }
  }
});

test("geography and eligibility do filter, and that is not a volume screen", () => {
  const universe = [
    fixture({ account_id: "IN", drive_time_ring: "45" }),
    fixture({ account_id: "OUTSIDE", drive_time_ring: "borderline_45_60" }),
    fixture({ account_id: "BEYOND", drive_time_ring: "out" }),
    fixture({ account_id: "INELIGIBLE", eligibility: "out" }),
    fixture({ account_id: "CLOSED", status_flag: "closed" }),
  ];
  const ranked = rank(universe, "convert");
  assert.deepEqual(ranked.map((v) => v.account_id), ["IN"]);
});

test("the four models genuinely disagree, or they are not four options", () => {
  // Built so decision_access and brand_quality point in opposite directions:
  // the accessible venues are unknown, the famous ones are hard to reach.
  const universe = Array.from({ length: 40 }, (_, i) =>
    fixture({
      account_id: `VEN-${i}`,
      venue_name: `Venue ${i}`,
      cluster: ["west_limerick", "lough_derg", "ennis_mid_clare", "north_tipperary"][i % 4],
      venue_type: ["castle", "country_house", "hotel_weddings", "barn"][i % 4],
      scores: {
        wedding_focus: { value: (i % 5) + 1, basis: "f" },
        brand_quality: { value: (i % 6), basis: "f" },
        likely_volume: { value: (i % 6), basis: "f" },
        decision_access: { value: 5 - (i % 6), basis: "f" },
        strategic_fit: { value: 5 - (i % 5), basis: "f" },
      },
    }),
  );
  const top = (m) => new Set(rank(universe, m).slice(0, 25).map((v) => v.account_id));
  const convert = top("convert"), reference = top("reference");
  const shared = [...convert].filter((id) => reference.has(id)).length;
  assert.ok(shared < 25, "convert and reference selecting identically means the choice is not real");
});

/* ------------------------------------------------------------- cohorts ---- */

const universeOf = (n, over = () => ({})) =>
  Array.from({ length: n }, (_, i) => fixture({
    account_id: `VEN-${String(i).padStart(4, "0")}`,
    venue_name: `Venue ${i}`,
    scores: Object.fromEntries(Object.keys(DIMENSIONS).map((d) => [d, { value: (i * 7) % 6, basis: "f" }])),
    ...over(i),
  }));

test("cohorts fill to 25 and run in rank order", () => {
  const r = buildCohorts(universeOf(60), "convert");
  assert.equal(r.cohorts[0].size, COHORT_SIZE);
  assert.equal(r.cohorts[1].size, COHORT_SIZE);
  const pcts = r.cohorts[0].venues.map((v) => v.score_pct);
  assert.deepEqual(pcts, [...pcts].sort((a, b) => b - a), "cohort 1 must be in descending rank order");
});

test("one operator never appears twice in the same cohort", () => {
  // Two hotels in one group means one buyer getting two personalised films in
  // the same week, which is the exact impression the film exists to avoid.
  const r = buildCohorts(universeOf(60, (i) => ({ group_or_operator: i % 2 === 0 ? "Big Group" : null })), "convert");
  for (const c of r.cohorts) {
    const ops = c.venues.map((v) => v.venue_name);
    assert.equal(new Set(ops).size, ops.length);
  }
  const first = r.cohorts[0];
  const grouped = first.venues.filter((v) => Number(v.account_id.slice(4)) % 2 === 0);
  assert.ok(grouped.length <= 1, "at most one property of the same operator per cohort");
  assert.ok(r.deferredByOperator.length > 0, "the deferrals are reported, not silently dropped");
});

test("a deferred group property is moved, never lost", () => {
  const universe = universeOf(30, (i) => ({ group_or_operator: i < 10 ? "One Group" : null }));
  const r = buildCohorts(universe, "convert");
  const placed = new Set(r.cohorts.flatMap((c) => c.venues.map((v) => v.account_id)));
  r.reserve.forEach((v) => placed.add(v.account_id));
  assert.equal(placed.size, 30, "every contactable account is either in a cohort or in reserve");
});

test("a venue whose trading status is unconfirmed never enters a cohort", () => {
  // R-033: a film sent to a venue that has closed is worse than no outreach.
  const universe = universeOf(40, (i) => ({ status_flag: i < 12 ? "unclear" : "trading" }));
  const r = buildCohorts(universe, "convert");
  const inCohorts = r.cohorts.flatMap((c) => c.venues.map((v) => v.account_id));
  assert.equal(inCohorts.length, 28);
  assert.equal(r.heldUnconfirmed.length, 12);
});

test("a short cohort reports the shortfall instead of padding it", () => {
  // The universe genuinely does not fill four cohorts. Saying otherwise, or
  // topping up from outside the ratified ring, would overturn D-012 quietly.
  const r = buildCohorts(universeOf(38), "convert");
  assert.equal(r.cohorts[0].size, 25);
  assert.equal(r.cohorts[1].size, 13);
  assert.equal(r.cohorts[1].short, 12);
  assert.equal(r.shortfall.cohortsFullyFilled, 1);
  assert.equal(r.shortfall.totalPlaced, 38);
  assert.equal(r.shortfall.cohortsRequestedByBacklog, 4);
});

test("out-of-ring venues are never used to top up a short cohort", () => {
  const universe = [
    ...universeOf(10),
    ...universeOf(40).map((v, i) => ({ ...v, account_id: `OUT-${i}`, drive_time_ring: "borderline_45_60" })),
  ];
  const r = buildCohorts(universe, "convert");
  const ids = r.cohorts.flatMap((c) => c.venues.map((v) => v.account_id));
  assert.ok(ids.every((id) => !id.startsWith("OUT-")), "the 45-60 band is outside the market and stays outside");
  assert.equal(ids.length, 10);
});
