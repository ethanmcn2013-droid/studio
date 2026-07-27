import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SPONSOR_REQUEST_KINDS, SPONSOR_REQUEST_STATES } from "./schema";

describe("sponsor_requests contract", () => {
  it("locks request kinds and states to the roles doc", () => {
    assert.deepEqual([...SPONSOR_REQUEST_KINDS], [
      "more_codes",
      "report",
      "support",
      "profile_change",
    ]);
    assert.deepEqual([...SPONSOR_REQUEST_STATES], [
      "open",
      "approved",
      "declined",
      "fulfilled",
      "canceled",
    ]);
  });
});
