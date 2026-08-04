import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getEditionProof,
  VENUE_COMPLETE,
  VENUE_FIXTURES,
  VENUE_PARTIAL,
  VENUE_SUPPRESSED,
  VENUE_UNAVAILABLE,
} from "./fixtures";
import {
  formatMetricValue,
  metricNumericOrNull,
  rateNumericOrNull,
} from "./format";
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
      rateNumericOrNull(VENUE_PARTIAL.adoption.continuedAfter30Days),
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
    assert.equal(VENUE_COMPLETE.adoption.continuedAfter30Days.state, "rate");
    if (VENUE_COMPLETE.adoption.continuedAfter30Days.state === "rate") {
      assert.equal(VENUE_COMPLETE.adoption.continuedAfter30Days.numerator, 9);
      assert.equal(
        VENUE_COMPLETE.adoption.continuedAfter30Days.denominator,
        12,
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
