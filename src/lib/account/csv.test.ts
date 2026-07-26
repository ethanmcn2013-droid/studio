import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { snapshotToCsv, snapshotToCsvRows } from "./csv";
import { VENUE_SUPPRESSED, VENUE_UNAVAILABLE } from "./fixtures";
import { scanTextForPrivacyLeaks } from "./privacy";

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
