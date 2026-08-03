import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { snapshotToCsv, snapshotToCsvRows } from "./csv";
import { VENUE_SUPPRESSED, VENUE_UNAVAILABLE } from "./fixtures";
import { snapshotToReportHtml } from "./pdf-html";
import { assertExportPayloadSafe, scanTextForPrivacyLeaks } from "./privacy";

describe("Account CSV export", () => {
  it("keeps withheld and unavailable numeric fields blank", () => {
    const suppressed = snapshotToCsvRows(VENUE_SUPPRESSED);
    const active = suppressed.find(
      (row) => row.metric_key === "adoption.active_recently",
    );
    assert.ok(active);
    assert.equal(active.value_state, "withheld");
    assert.equal(active.value, "");
    assert.equal(active.denominator, "");
    assert.equal(active.withheld_reason, "small_group");

    const unavailable = snapshotToCsvRows(VENUE_UNAVAILABLE);
    const first = unavailable.find(
      (row) => row.metric_key === "adoption.first_useful_action",
    );
    assert.ok(first);
    assert.equal(first.value_state, "unavailable");
    assert.equal(first.value, "");
    assert.ok(first.withheld_reason.length > 0);
  });

  it("labels every CSV with sample metadata and no privacy leaks", () => {
    const csv = snapshotToCsv(VENUE_SUPPRESSED);
    assert.match(csv, /SAMPLE · DETERMINISTIC REVIEW DATA/);
    assert.match(csv, /snapshot_id=venue-suppressed-2026-07-24/);
    assert.deepEqual(scanTextForPrivacyLeaks(csv), []);
  });
});

/* Every export is a fresh payload. The download route re-serialises a snapshot
 * that was checked at load time into bytes that were not, so the check runs
 * again on the artefact that actually leaves the server. */
describe("Export payload guard", () => {
  it("passes a clean snapshot in both export formats", () => {
    for (const snapshot of [VENUE_SUPPRESSED, VENUE_UNAVAILABLE]) {
      assert.deepEqual(
        assertExportPayloadSafe(snapshot, snapshotToCsv(snapshot)),
        [],
      );
      assert.deepEqual(
        assertExportPayloadSafe(snapshot, snapshotToReportHtml(snapshot)),
        [],
      );
    }
  });

  it("catches an identity that only appears once the body is rendered", () => {
    const poisoned = {
      ...VENUE_SUPPRESSED,
      account: { ...VENUE_SUPPRESSED.account, name: "events@ashford.example" },
    };
    const csv = snapshotToCsv(poisoned);
    assert.ok(assertExportPayloadSafe(poisoned, csv).length > 0);
    const html = snapshotToReportHtml(poisoned);
    assert.ok(assertExportPayloadSafe(poisoned, html).length > 0);
  });

  it("catches a leak present in the body but not in the object", () => {
    // A serialiser can compose a string from parts that were each clean.
    const leaks = assertExportPayloadSafe(
      VENUE_SUPPRESSED,
      "account_name,contact\nAshford Barn,owner@ashford.example\n",
    );
    assert.ok(leaks.length > 0);
  });
});
