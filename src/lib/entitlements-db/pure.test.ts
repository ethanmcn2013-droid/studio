/**
 * Tests for the correctness-critical, DB-free access logic in pure.ts. These
 * exercise the SAME functions the resolver / audit writer / guard / Clerk
 * webhook call in production (they import from pure.ts), so a green run means
 * the real code path is covered.
 *
 * Run: npx tsx --test src/lib/entitlements-db/pure.test.ts
 */
import test from "node:test";
import assert from "node:assert/strict";

import {
  resolveTier,
  pickBest,
  chainHash,
  rowHashOf,
  verifyChainRows,
  checkBulk,
  parseRoster,
  resolveOperator,
  svixExpectedSignature,
  svixMatches,
  type ResolveRow,
  type ChainRow,
} from "./pure";

const NOW = 1_800_000_000_000;
const row = (over: Partial<ResolveRow>): ResolveRow => ({
  id: "e1",
  tier: "workspace",
  source: "compliments",
  sourceRef: "r",
  expiresAt: null,
  billingState: null,
  stripeCustomerId: null,
  ...over,
});

// ── resolveTier ─────────────────────────────────────────────────────────
test("resolveTier: no rows resolves to free, not read-only", () => {
  const r = resolveTier([], NOW);
  assert.equal(r.tier, "free");
  assert.equal(r.readOnly, false);
});

test("resolveTier: live higher tier beats live lower tier", () => {
  const r = resolveTier(
    [
      row({ id: "a", tier: "event", expiresAt: NOW + 1000 }),
      row({ id: "b", tier: "workspace", expiresAt: NOW + 1000 }),
    ],
    NOW,
  );
  assert.equal(r.tier, "workspace");
  assert.equal(r.readOnly, false);
});

test("resolveTier: expired rows are ignored for live resolution", () => {
  const r = resolveTier([row({ tier: "workspace", expiresAt: NOW - 1 })], NOW);
  assert.equal(r.tier, "free");
});

test("resolveTier: lapsed non-refunded Event keeps read-only access", () => {
  const r = resolveTier(
    [row({ id: "e", tier: "event", source: "event_pass", expiresAt: NOW - 1 })],
    NOW,
  );
  assert.equal(r.tier, "event");
  assert.equal(r.readOnly, true);
});

test("resolveTier: refunded lapsed Event loses read access", () => {
  const r = resolveTier(
    [
      row({
        id: "e",
        tier: "event",
        source: "event_pass",
        expiresAt: NOW - 1,
        billingState: "refunded",
      }),
    ],
    NOW,
  );
  assert.equal(r.tier, "free");
  assert.equal(r.readOnly, false);
});

test("resolveTier: a live tier is never downgraded by a lapsed Event", () => {
  const r = resolveTier(
    [
      row({ id: "w", tier: "workspace", expiresAt: NOW + 1000 }),
      row({ id: "e", tier: "event", source: "event_pass", expiresAt: NOW - 1 }),
    ],
    NOW,
  );
  assert.equal(r.tier, "workspace");
  assert.equal(r.readOnly, false);
});

// ── pickBest determinism ────────────────────────────────────────────────
test("pickBest: same tier breaks tie to the longest-lasting row", () => {
  const best = pickBest([
    { id: "a", tier: "workspace", expiresAt: NOW + 10 },
    { id: "b", tier: "workspace", expiresAt: NOW + 999 },
  ]);
  assert.equal(best.id, "b");
});

test("pickBest: null expiry (perpetual) outlasts any finite expiry", () => {
  const best = pickBest([
    { id: "a", tier: "workspace", expiresAt: NOW + 9_999_999 },
    { id: "b", tier: "workspace", expiresAt: null },
  ]);
  assert.equal(best.id, "b");
});

test("pickBest: equal expiry breaks tie by id ascending (deterministic)", () => {
  const forward = pickBest([
    { id: "z", tier: "workspace", expiresAt: NOW },
    { id: "a", tier: "workspace", expiresAt: NOW },
  ]);
  const reversed = pickBest([
    { id: "a", tier: "workspace", expiresAt: NOW },
    { id: "z", tier: "workspace", expiresAt: NOW },
  ]);
  assert.equal(forward.id, "a");
  assert.equal(reversed.id, "a");
});

// ── hash-chain ──────────────────────────────────────────────────────────
test("chainHash is order-independent and null-stable", () => {
  assert.equal(chainHash({ a: 1, b: null }), chainHash({ b: undefined, a: 1 }));
  assert.notEqual(chainHash({ a: 1 }), chainHash({ a: 2 }));
});

function buildChain(n: number): ChainRow[] {
  const rows: ChainRow[] = [];
  let prev = "genesis";
  for (let i = 0; i < n; i++) {
    const base = {
      id: `ev${i}`,
      entitlementId: `e${i}`,
      userClerkId: "user_1",
      sponsorId: null,
      batchId: null,
      actorId: "op",
      action: "grant",
      reason: null,
      beforeJson: null,
      afterJson: null,
      origin: "test",
      stripeEventId: null,
      createdAt: NOW + i,
    };
    const rowHash = rowHashOf(prev, base);
    rows.push({ ...base, prevHash: prev, rowHash });
    prev = rowHash;
  }
  return rows;
}

test("verifyChainRows: an intact chain verifies", () => {
  assert.deepEqual(verifyChainRows(buildChain(4)), { ok: true });
});

test("verifyChainRows: a tampered payload is caught", () => {
  const chain = buildChain(4);
  chain[2] = { ...chain[2], reason: "tampered" };
  const res = verifyChainRows(chain);
  assert.equal(res.ok, false);
  assert.equal(res.brokenAt, "ev2");
});

test("verifyChainRows: a broken prev-link is caught", () => {
  const chain = buildChain(4);
  chain[3] = { ...chain[3], prevHash: "wrong" };
  const res = verifyChainRows(chain);
  assert.equal(res.ok, false);
  assert.equal(res.brokenAt, "ev3");
});

// ── bulk cap ────────────────────────────────────────────────────────────
test("checkBulk: within limits is allowed", () => {
  assert.equal(checkBulk(10, 500, 50, 1).allowed, true);
});

test("checkBulk: over the hard cap is refused", () => {
  assert.equal(checkBulk(501, 500, 50, 5).allowed, false);
});

test("checkBulk: over the two-person threshold needs a second approver", () => {
  assert.equal(checkBulk(60, 500, 50, 1).allowed, false);
  assert.equal(checkBulk(60, 500, 50, 2).allowed, true);
});

test("checkBulk: negative or non-integer counts are refused", () => {
  assert.equal(checkBulk(-1, 500, 50, 1).allowed, false);
  assert.equal(checkBulk(1.5, 500, 50, 1).allowed, false);
});

// ── operator roster ─────────────────────────────────────────────────────
test("parseRoster: parses id:Name pairs and id-only entries", () => {
  assert.deepEqual(parseRoster("op1:Ada Lovelace, op2"), [
    { id: "op1", name: "Ada Lovelace" },
    { id: "op2", name: "op2" },
  ]);
  assert.deepEqual(parseRoster(undefined), []);
});

test("resolveOperator: fail-closed without id or name", () => {
  assert.equal(resolveOperator({ id: "", name: "x" }, []).ok, false);
  assert.equal(resolveOperator({ id: "x", name: "" }, []).ok, false);
});

test("resolveOperator: no roster accepts any named operator", () => {
  const r = resolveOperator({ id: "op", name: "Op" }, []);
  assert.equal(r.ok, true);
});

test("resolveOperator: with a roster, only listed operators pass", () => {
  const roster = [{ id: "op1", name: "Ada" }];
  assert.equal(resolveOperator({ id: "op1", name: "whatever" }, roster).ok, true);
  const miss = resolveOperator({ id: "ghost", name: "Ghost" }, roster);
  assert.equal(miss.ok, false);
});

test("resolveOperator: roster resolves the canonical name", () => {
  const r = resolveOperator({ id: "op1", name: "typo" }, [{ id: "op1", name: "Ada" }]);
  assert.equal(r.ok && r.name, "Ada");
});

// ── svix signature ──────────────────────────────────────────────────────
test("svix: a signature the scheme produces is accepted, others rejected", () => {
  // whsec_ + base64 key. Signature is over "id.timestamp.body".
  const secret = "whsec_" + Buffer.from("super-secret-signing-key").toString("base64");
  const id = "msg_123";
  const ts = "1800000000";
  const body = '{"type":"user.deleted","data":{"id":"user_x"}}';
  const sig = svixExpectedSignature(secret, id, ts, body);

  assert.equal(svixMatches(`v1,${sig}`, sig), true);
  assert.equal(svixMatches(`v1,${sig} v2,other`, sig), true); // multiple entries
  assert.equal(svixMatches("v1,not-the-signature", sig), false);
  // A different body must not verify against the same signature.
  const other = svixExpectedSignature(secret, id, ts, body + "x");
  assert.notEqual(other, sig);
});
