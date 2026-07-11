import assert from "node:assert/strict";
import test from "node:test";
import { createSuiteTodayAssertion, verifySuiteTodayAssertion } from "./suite-assertion";

test("Today assertion derives the signed subject and email", () => {
  const token = createSuiteTodayAssertion("user_a", "secret", { email: "a@example.com", now: 1_000 });
  const claims = verifySuiteTodayAssertion(token, "secret", 1_001);
  assert.equal(claims.sub, "user_a");
  assert.equal(claims.email, "a@example.com");
});

test("Today assertion rejects tampering, wrong key, and expiry", () => {
  const token = createSuiteTodayAssertion("user_a", "secret", { email: "a@example.com", now: 1_000 });
  assert.throws(() => verifySuiteTodayAssertion(`${token}x`, "secret", 1_001));
  assert.throws(() => verifySuiteTodayAssertion(token, "wrong", 1_001));
  assert.throws(() => verifySuiteTodayAssertion(token, "secret", 1_301));
});
