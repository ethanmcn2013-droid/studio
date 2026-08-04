/**
 * Signal HQ session-token contract (E08.05, R-043).
 *
 * These tests exist to hold three properties the v1 token did not have.
 * Each one is written so it FAILS against the v1 implementation
 * (`sha256("signal-hq-session:v1:" + password)`), which is what makes
 * them a guard rather than a description.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  createHqAccessToken,
  verifyHqToken,
  verifyHqPassword,
  isHqPasswordConfigured,
  HQ_ACCESS_MAX_AGE,
  HQ_SESSION_VERSION,
} from "./auth";

const PASSWORD = "correct-horse-battery-staple";

// auth.ts reads process.env on every call rather than at import time, so
// setting this at module scope is enough: it runs before any test body.
process.env.SIGNAL_HQ_PASSWORD = PASSWORD;

const TTL_MS = HQ_ACCESS_MAX_AGE * 1000;

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

test("a freshly minted token verifies", async () => {
  const token = await createHqAccessToken();
  assert.equal(await verifyHqToken(token), true);
});

test("the token is not derivable from the password alone", async () => {
  // The v1 defect, stated as a test. Anyone holding SIGNAL_HQ_PASSWORD
  // could compute the v1 cookie offline without ever hitting /hq/access.
  const v1 = await sha256Hex(`signal-hq-session:v1:${PASSWORD}`);
  assert.equal(
    await verifyHqToken(v1),
    false,
    "a v1-shaped token derived straight from the password must not verify",
  );

  // Two tokens minted a millisecond apart differ, so there is no single
  // constant value that is "the" cookie for this password.
  const a = await createHqAccessToken(PASSWORD, 1_700_000_000_000);
  const b = await createHqAccessToken(PASSWORD, 1_700_000_000_001);
  assert.notEqual(a, b);
});

test("expiry is carried inside the token, not only in the cookie max-age", async () => {
  const issuedAt = 1_700_000_000_000;
  const token = await createHqAccessToken(PASSWORD, issuedAt);

  assert.equal(await verifyHqToken(token, issuedAt + 1_000), true);
  assert.equal(await verifyHqToken(token, issuedAt + TTL_MS - 1_000), true);
  assert.equal(
    await verifyHqToken(token, issuedAt + TTL_MS + 1_000),
    false,
    "a token past its own TTL must be refused even if the browser still sends it",
  );
});

test("a future-dated token cannot buy an unbounded session", async () => {
  const now = 1_700_000_000_000;
  const farFuture = now + 365 * 24 * 60 * 60 * 1000;
  const token = await createHqAccessToken(PASSWORD, farFuture);
  assert.equal(await verifyHqToken(token, now), false);
});

test("the signature cannot be forged by editing the issue time", async () => {
  const issuedAt = 1_700_000_000_000;
  const token = await createHqAccessToken(PASSWORD, issuedAt);
  const [, , signature] = token.split(".");

  // Move the clock forward inside the token and keep the old signature.
  const forged = `${HQ_SESSION_VERSION}.${issuedAt + TTL_MS * 10}.${signature}`;
  assert.equal(await verifyHqToken(forged, issuedAt + TTL_MS * 10), false);
});

test("malformed, empty and wrong-version tokens fail closed", async () => {
  const issuedAt = 1_700_000_000_000;
  const good = await createHqAccessToken(PASSWORD, issuedAt);
  const [, , signature] = good.split(".");

  const cases: Array<[string, string]> = [
    ["", "empty"],
    ["...", "only separators"],
    [`v1.${issuedAt}.${signature}`, "wrong version"],
    [`${HQ_SESSION_VERSION}.${issuedAt}`, "missing signature"],
    [`${HQ_SESSION_VERSION}.${issuedAt}.${signature}.extra`, "extra segment"],
    [`${HQ_SESSION_VERSION}.not-a-number.${signature}`, "non-numeric issue time"],
    [`${HQ_SESSION_VERSION}. ${issuedAt}.${signature}`, "padded issue time"],
    [`${HQ_SESSION_VERSION}.1e15.${signature}`, "exponent-notation issue time"],
    [`${HQ_SESSION_VERSION}.0x10.${signature}`, "hex issue time"],
    [`${HQ_SESSION_VERSION}.-1.${signature}`, "negative issue time"],
    [`${HQ_SESSION_VERSION}.${issuedAt}.`, "empty signature"],
    [`${HQ_SESSION_VERSION}.${issuedAt}.${"0".repeat(64)}`, "wrong signature"],
  ];

  for (const [token, label] of cases) {
    assert.equal(
      await verifyHqToken(token, issuedAt + 1_000),
      false,
      `${label} must fail closed`,
    );
  }
});

test("no configured password means nothing verifies", async () => {
  const original = process.env.SIGNAL_HQ_PASSWORD;
  const token = await createHqAccessToken();
  try {
    delete process.env.SIGNAL_HQ_PASSWORD;
    assert.equal(isHqPasswordConfigured(), false);
    assert.equal(await verifyHqToken(token), false);
    assert.equal(await verifyHqPassword(""), false);
    assert.equal(await verifyHqPassword(PASSWORD), false);
  } finally {
    process.env.SIGNAL_HQ_PASSWORD = original;
  }
});

test("password check accepts the password and rejects near-misses", async () => {
  assert.equal(await verifyHqPassword(PASSWORD), true);
  assert.equal(await verifyHqPassword(PASSWORD + " "), false);
  assert.equal(await verifyHqPassword(PASSWORD.slice(0, -1)), false);
  assert.equal(await verifyHqPassword(""), false);
});

test("a token minted under one password does not verify under another", async () => {
  const token = await createHqAccessToken("a-different-password", Date.now());
  assert.equal(
    await verifyHqToken(token),
    false,
    "rotating SIGNAL_HQ_PASSWORD must invalidate outstanding sessions",
  );
});
