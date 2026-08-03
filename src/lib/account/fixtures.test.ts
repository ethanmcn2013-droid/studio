import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { snapshotToCsvRows } from "./csv";
import {
  getEditionProof,
  VENUE_COMPLETE,
  VENUE_FIXTURES,
  VENUE_PARTIAL,
  VENUE_SUPPRESSED,
  VENUE_UNAVAILABLE,
  VENUE_UNLIMITED,
  VENUE_UNRECORDED,
} from "./fixtures";
import { formatMetricValue, metricNumericOrNull } from "./format";
import { snapshotToReportHtml } from "./pdf-html";
import { assertSnapshotPrivacy, walkMetricValues } from "./privacy";

describe("Signal Studio Account fixtures", () => {
  for (const [key, snapshot] of Object.entries(VENUE_FIXTURES)) {
    it(`${key} passes privacy and integrity assertions`, () => {
      const errors = assertSnapshotPrivacy(snapshot);
      assert.deepEqual(errors, []);
      assert.equal(snapshot.sampleLabel, "SAMPLE · DETERMINISTIC REVIEW DATA.");
      assert.equal(snapshot.definitionVersion, "account-metrics.v2");
    });
  }

  it("partial keeps access exact and behavioural rates unavailable", () => {
    assert.equal(VENUE_PARTIAL.access.redeemed.state, "exact");
    assert.equal(VENUE_PARTIAL.adoption.activeRecently.state, "lower_bound");
    assert.equal(VENUE_PARTIAL.adoption.continuedAfter30Days.state, "withheld");
    assert.equal(
      formatMetricValue(VENUE_PARTIAL.adoption.activeRecently),
      "9+",
    );
    assert.equal(
      metricNumericOrNull(VENUE_PARTIAL.adoption.continuedAfter30Days),
      null,
    );
  });

  it("suppressed never contradicts a tiny eligible cohort", () => {
    assert.equal(VENUE_SUPPRESSED.access.redeemed.state, "exact");
    assert.ok(
      VENUE_SUPPRESSED.access.redeemed.state === "exact" &&
        VENUE_SUPPRESSED.access.redeemed.value < 3,
    );
    walkMetricValues(VENUE_SUPPRESSED, (metric, path) => {
      if (path.startsWith("adoption.first") || path.startsWith("productReach")) {
        assert.equal(metric.state, "withheld");
      }
    });
  });

  it("unavailable keeps access visible and behavioural values unavailable", () => {
    assert.equal(VENUE_UNAVAILABLE.access.allotted.state, "exact");
    assert.equal(VENUE_UNAVAILABLE.adoption.activeRecently.state, "unavailable");
    assert.equal(
      metricNumericOrNull(VENUE_UNAVAILABLE.adoption.activeRecently),
      null,
    );
  });

  it("complete exposes comparable continuation with denominator", () => {
    assert.equal(VENUE_COMPLETE.adoption.continuedAfter30Days.state, "exact");
    if (VENUE_COMPLETE.adoption.continuedAfter30Days.state === "exact") {
      assert.equal(
        VENUE_COMPLETE.adoption.continuedAfter30Days.denominator,
        12,
      );
    }
  });

  /* Until these two existed, every review sample carried an exact cap, so no
   * deterministic artefact exercised the branch a real founding venue takes,
   * nor the legacy branch that used to fabricate a zero. */
  it("unlimited shows no count where a count would be a lie", () => {
    assert.equal(VENUE_UNLIMITED.access.allotted.state, "unlimited");
    assert.equal(VENUE_UNLIMITED.access.available.state, "unlimited");
    assert.equal(VENUE_UNLIMITED.adoption.allotted.state, "unlimited");
    assert.equal(metricNumericOrNull(VENUE_UNLIMITED.access.available), null);
    assert.equal(formatMetricValue(VENUE_UNLIMITED.access.allotted), "Unlimited");
    assert.deepEqual(VENUE_UNLIMITED.access.attention, []);
    assert.equal(VENUE_UNLIMITED.nextAction.id, "issue-next");
    assert.doesNotMatch(JSON.stringify(VENUE_UNLIMITED), /allotment|seat/i);
  });

  it("unlimited exports a blank value cell, never a zero", () => {
    const rows = snapshotToCsvRows(VENUE_UNLIMITED);
    for (const key of ["access.covered", "access.available"]) {
      const row = rows.find((r) => r.metric_key === key);
      assert.ok(row, key);
      assert.equal(row.value_state, "unlimited");
      assert.equal(row.value, "");
      assert.equal(row.denominator, "");
    }
  });

  it("unrecorded is unavailable in both positions, never zero", () => {
    assert.equal(VENUE_UNRECORDED.access.allotted.state, "unavailable");
    assert.equal(VENUE_UNRECORDED.access.available.state, "unavailable");
    assert.equal(VENUE_UNRECORDED.adoption.allotted.state, "unavailable");
    assert.equal(metricNumericOrNull(VENUE_UNRECORDED.access.allotted), null);
    // Issued and redeemed are facts about what happened and stay exact.
    assert.equal(VENUE_UNRECORDED.access.issued.state, "exact");
    assert.notEqual(VENUE_UNRECORDED.nextAction.id, "request-more");
    assert.doesNotMatch(JSON.stringify(VENUE_UNRECORDED), /exhausted/i);
  });

  it("unrecorded exports a blank value cell with its reason", () => {
    const rows = snapshotToCsvRows(VENUE_UNRECORDED);
    const row = rows.find((r) => r.metric_key === "access.covered");
    assert.ok(row);
    assert.equal(row.value_state, "unavailable");
    assert.equal(row.value, "");
    assert.ok(row.withheld_reason.length > 0);
  });

  it("every fixture survives the print path with its sample mark intact", () => {
    // generate-samples.ts refuses to write a PDF whose rendered text has lost
    // the watermark, so this is the same gate, run without a browser.
    for (const [key, snapshot] of Object.entries(VENUE_FIXTURES)) {
      const html = snapshotToReportHtml(snapshot);
      assert.ok(
        html.includes("SAMPLE · DETERMINISTIC REVIEW DATA."),
        `${key} lost the sample mark`,
      );
    }
  });

  it("edition proofs carry distinct vocabulary without student drill-down", () => {
    const education = getEditionProof("education");
    const organisation = getEditionProof("organisation");
    assert.equal(education.account.recipientNounPlural, "students");
    assert.equal(organisation.account.recipientNounPlural, "people");
    assert.match(education.privacyReceipt.body, /No student drill-down/);
    assert.equal(
      education.coverage.periodLabel,
      "Academic year or programme term",
    );
    assert.equal(organisation.coverage.periodLabel, "Contract year");
  });
});
