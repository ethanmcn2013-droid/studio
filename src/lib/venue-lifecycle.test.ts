import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BRANDING_REMOVAL_DEADLINE_MS,
  COUPLE_ACCESS_STATES,
  INVITATION_STATES,
  LIFECYCLE_FIXTURES,
  LIFECYCLE_FIXTURE_NOW_MS,
  SPONSORSHIP_STATES,
  accessAfterSponsorshipEvent,
  brandingRemovalDeadlineMs,
  canIssueNewSponsorship,
  deriveCoupleAccessState,
  isInvitationTerminal,
  lifecycleFixture,
  nextCoupleAccessState,
  nextInvitationState,
  nextSponsorshipState,
  sponsorBrandingVisible,
  type CoupleAccessState,
  type SponsorshipEvent,
} from "./venue-lifecycle";

/* ── E04.03 · invitation states ──────────────────────────────────────────── */

describe("invitation states", () => {
  it("covers exactly the seven states in the task title", () => {
    assert.deepEqual(
      [...INVITATION_STATES],
      ["created", "sent", "opened", "redeemed", "expired", "revoked", "replaced"],
    );
  });

  it("walks the happy path", () => {
    let state = nextInvitationState("created", "deliver")!;
    assert.equal(state, "sent");
    state = nextInvitationState(state, "open")!;
    assert.equal(state, "opened");
    state = nextInvitationState(state, "redeem")!;
    assert.equal(state, "redeemed");
    assert.equal(isInvitationTerminal(state), true);
  });

  it("tolerates a re-send and a re-open, because both are ordinary", () => {
    assert.equal(nextInvitationState("sent", "deliver"), "sent");
    assert.equal(nextInvitationState("opened", "open"), "opened");
    assert.equal(nextInvitationState("opened", "deliver"), "sent");
  });

  it("refuses to revoke a redeemed code", () => {
    // Revoking here would strand the entitlement it already produced, which
    // the access axis forbids outright.
    assert.equal(nextInvitationState("redeemed", "revoke"), null);
    assert.equal(nextInvitationState("redeemed", "replace"), null);
    assert.equal(nextInvitationState("redeemed", "expire"), null);
  });

  it("lets a venue reissue against an expired or revoked code", () => {
    assert.equal(nextInvitationState("expired", "replace"), "replaced");
    assert.equal(nextInvitationState("revoked", "replace"), "replaced");
  });

  it("treats replaced as terminal", () => {
    assert.equal(isInvitationTerminal("replaced"), true);
    for (const event of ["deliver", "open", "redeem", "expire", "revoke", "replace"] as const) {
      assert.equal(nextInvitationState("replaced", event), null, event);
    }
  });
});

/* ── E04.07 · couple access ──────────────────────────────────────────────── */

describe("couple access states", () => {
  it("has no separate post-wedding state", () => {
    assert.deepEqual([...COUPLE_ACCESS_STATES], ["invited", "active", "keepsake", "deleted"]);
  });

  it("walks invited to keepsake", () => {
    let state: CoupleAccessState = "invited";
    state = nextCoupleAccessState(state, "redeem")!;
    assert.equal(state, "active");
    state = nextCoupleAccessState(state, "term_ends")!;
    assert.equal(state, "keepsake");
  });

  it("never expires Keepsake on a clock", () => {
    assert.equal(nextCoupleAccessState("keepsake", "term_ends"), null);
    assert.equal(nextCoupleAccessState("keepsake", "redeem"), null);
  });

  it("reaches deletion from every live state, and nothing from deletion", () => {
    for (const from of ["invited", "active", "keepsake"] as const) {
      assert.equal(nextCoupleAccessState(from, "erase"), "deleted", from);
    }
    assert.equal(nextCoupleAccessState("deleted", "erase"), null);
    assert.equal(nextCoupleAccessState("deleted", "redeem"), null);
  });
});

describe("deriveCoupleAccessState", () => {
  const now = Date.parse("2027-06-01T12:00:00.000Z");

  it("derives from the entitlement row rather than a stored state", () => {
    assert.equal(
      deriveCoupleAccessState({ redeemedAtMs: null, expiresAtMs: null, nowMs: now }),
      "invited",
    );
    assert.equal(
      deriveCoupleAccessState({
        redeemedAtMs: now - 1000,
        expiresAtMs: now + 1000,
        nowMs: now,
      }),
      "active",
    );
    assert.equal(
      deriveCoupleAccessState({
        redeemedAtMs: now - 2000,
        expiresAtMs: now - 1000,
        nowMs: now,
      }),
      "keepsake",
    );
  });

  it("treats an expiry exactly at now as ended, matching the access gate", () => {
    // The resolver's live filter is `expiresAt > now`, so the boundary has to
    // agree or a snapshot and the gate would disagree for one instant.
    assert.equal(
      deriveCoupleAccessState({ redeemedAtMs: now - 1, expiresAtMs: now, nowMs: now }),
      "keepsake",
    );
  });

  it("treats a null expiry as still active, never as ended", () => {
    assert.equal(
      deriveCoupleAccessState({ redeemedAtMs: now - 1, expiresAtMs: null, nowMs: now }),
      "active",
    );
  });

  it("erasure outranks everything", () => {
    assert.equal(
      deriveCoupleAccessState({
        redeemedAtMs: now - 2000,
        expiresAtMs: now + 100_000,
        erasedAtMs: now - 10,
        nowMs: now,
      }),
      "deleted",
    );
  });
});

/* ── E04.06 · sponsorship, and the invariant ─────────────────────────────── */

describe("sponsorship states", () => {
  it("issuance stops when the licence ends, and only issuance", () => {
    assert.equal(canIssueNewSponsorship("active"), true);
    assert.equal(canIssueNewSponsorship("pending"), true);
    assert.equal(canIssueNewSponsorship("ended"), false);
    assert.equal(canIssueNewSponsorship("released"), false);
    assert.equal(canIssueNewSponsorship("revoked"), false);
  });

  it("shows venue branding only on an active link", () => {
    assert.equal(sponsorBrandingVisible("active"), true);
    for (const state of ["pending", "released", "ended", "revoked"] as const) {
      assert.equal(sponsorBrandingVisible(state), false, state);
    }
  });

  it("gives branding removal a checkable 24-hour deadline", () => {
    const released = Date.parse("2027-06-01T12:00:00.000Z");
    assert.equal(BRANDING_REMOVAL_DEADLINE_MS, 24 * 60 * 60 * 1000);
    assert.equal(
      new Date(brandingRemovalDeadlineMs(released)).toISOString(),
      "2027-06-02T12:00:00.000Z",
    );
  });

  it("treats revocation as terminal", () => {
    for (const event of ["redeem", "release", "licence_lapses", "revoke"] as const) {
      assert.equal(nextSponsorshipState("revoked", event), null, event);
    }
  });
});

describe("the survival invariant (D-020 point 2)", () => {
  it("no sponsorship event moves the access state, for any combination", () => {
    const events: SponsorshipEvent[] = ["redeem", "release", "licence_lapses", "revoke"];
    for (const accessState of COUPLE_ACCESS_STATES) {
      for (const event of events) {
        assert.equal(
          accessAfterSponsorshipEvent({ accessState, event }),
          accessState,
          `${event} must not move access from ${accessState}`,
        );
      }
    }
  });

  it("a licence lapse leaves an active couple active", () => {
    // The promise made in writing to every founding venue.
    assert.equal(
      accessAfterSponsorshipEvent({ accessState: "active", event: "licence_lapses" }),
      "active",
    );
    assert.equal(nextSponsorshipState("active", "licence_lapses"), "ended");
  });

  it("a release leaves the couple's content exactly where it was", () => {
    assert.equal(
      accessAfterSponsorshipEvent({ accessState: "active", event: "release" }),
      "active",
    );
    assert.equal(
      accessAfterSponsorshipEvent({ accessState: "keepsake", event: "release" }),
      "keepsake",
    );
  });
});

/* ── E04.12 · deterministic fixtures ─────────────────────────────────────── */

describe("lifecycle fixtures", () => {
  it("covers every state on all three axes", () => {
    const invitations = new Set(LIFECYCLE_FIXTURES.map((f) => f.invitation));
    const access = new Set(LIFECYCLE_FIXTURES.map((f) => f.access));
    const sponsorship = new Set(LIFECYCLE_FIXTURES.map((f) => f.sponsorship));
    for (const state of INVITATION_STATES) {
      assert.equal(invitations.has(state), true, `no fixture for invitation '${state}'`);
    }
    for (const state of COUPLE_ACCESS_STATES) {
      assert.equal(access.has(state), true, `no fixture for access '${state}'`);
    }
    for (const state of SPONSORSHIP_STATES) {
      assert.equal(sponsorship.has(state), true, `no fixture for sponsorship '${state}'`);
    }
  });

  it("has unique ids and a stated purpose on every fixture", () => {
    const ids = LIFECYCLE_FIXTURES.map((f) => f.id);
    assert.equal(new Set(ids).size, ids.length, "duplicate fixture id");
    for (const f of LIFECYCLE_FIXTURES) {
      assert.ok(f.proves.length > 20, `${f.id} does not say what it proves`);
    }
  });

  it("every fixture's declared access state matches its own data", () => {
    for (const f of LIFECYCLE_FIXTURES) {
      assert.equal(
        deriveCoupleAccessState({
          redeemedAtMs: f.redeemedAtMs,
          expiresAtMs: f.expiresAtMs,
          erasedAtMs: f.erasedAtMs,
          nowMs: LIFECYCLE_FIXTURE_NOW_MS,
        }),
        f.access,
        `${f.id} claims '${f.access}' but its dates say otherwise`,
      );
    }
  });

  it("is pinned to a fixed clock", () => {
    assert.equal(
      new Date(LIFECYCLE_FIXTURE_NOW_MS).toISOString(),
      "2027-06-01T12:00:00.000Z",
    );
  });

  it("R-015: the long-lead fixture outlasts its own wedding", () => {
    const f = lifecycleFixture("active-long-lead")!;
    assert.ok(f.weddingDateMs != null && f.expiresAtMs != null);
    assert.ok(
      f.expiresAtMs! > f.weddingDateMs!,
      "the fixture that exists to prove R-015 does not prove it",
    );
    // And the shipped flat term would not have.
    assert.ok(f.redeemedAtMs! + 548 * 24 * 60 * 60 * 1000 < f.weddingDateMs!);
  });

  it("carries a fixture where the licence ended and access did not", () => {
    const f = lifecycleFixture("active-licence-ended")!;
    assert.equal(f.sponsorship, "ended");
    assert.equal(f.access, "active");
  });

  it("carries a fixture where the venue released and access did not move", () => {
    const f = lifecycleFixture("active-released")!;
    assert.equal(f.sponsorship, "released");
    assert.equal(f.access, "active");
    assert.equal(sponsorBrandingVisible(f.sponsorship), false);
  });
});
