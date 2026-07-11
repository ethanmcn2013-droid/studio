import assert from "node:assert/strict";
import test from "node:test";
import { certifySuiteJourneys } from "./journey-certification";

test("all eight suite journey contracts pass", () => {
  const receipts = certifySuiteJourneys();
  assert.equal(receipts.length, 8);
  assert.ok(receipts.every((receipt) => receipt.passed), receipts.map((receipt) => `${receipt.id}:${receipt.detail}`).join("\n"));
});
