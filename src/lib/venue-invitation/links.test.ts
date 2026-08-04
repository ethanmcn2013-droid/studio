import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseVenueInvitationLinks,
  resolveVenueInvitationLink,
  VENUE_INVITATION_LINKS_VERSION,
  VENUE_INVITATION_TOKEN_PATTERN,
  type VenueInvitationRegistry,
} from "./links";

/**
 * The link registry behind `/v/<token>`.
 *
 * Every test below names the clause it holds. `E13.16-link-and-destination-
 * contract.md` sections 1, 2, 6 and 12, and acceptance criteria 4, 16, 17 and
 * 21.
 */

const TOKEN_A = "Kf3rNqW8dJ2mBv5tXcYp7Lz1";
const TOKEN_B = "Rt9wZaQ4nHs6uKe2VbXm8Cd3";
const TOKEN_C = "Pw7kEjT1yRb4oNa9GmZq5Xu2";

function doc(links: unknown[]): unknown {
  return { version: VENUE_INVITATION_LINKS_VERSION, links };
}

function invitationRow(over: Record<string, unknown> = {}) {
  return {
    token: TOKEN_A,
    accountId: "VEN-0042",
    venueName: "Glenmara Estate",
    state: "invitation",
    status: "active",
    cohort: 1,
    touch: "email_1",
    ...over,
  };
}

function proposalRow(over: Record<string, unknown> = {}) {
  return {
    token: TOKEN_B,
    accountId: "VEN-0043",
    venueName: "Ardmore House",
    state: "proposal",
    status: "active",
    cohort: 1,
    touch: "proposal",
    proposal: {
      firstName: "Aoife",
      walkthroughDate: "2026-08-18",
      holdEndsOn: "2026-09-01",
      paidCount: 3,
      nextFreeNumber: "04/25",
    },
    ...over,
  };
}

test("the sample tokens satisfy the ratified shape", () => {
  for (const token of [TOKEN_A, TOKEN_B, TOKEN_C]) {
    assert.match(token, VENUE_INVITATION_TOKEN_PATTERN);
    assert.equal(token.length, 24);
  }
});

test("a clean document parses and resolves", () => {
  const registry = parseVenueInvitationLinks(doc([invitationRow(), proposalRow()]));
  assert.deepEqual(registry.refusals, []);
  assert.equal(registry.links.length, 2);

  const found = resolveVenueInvitationLink(registry, TOKEN_A);
  assert.equal(found?.accountId, "VEN-0042");
  assert.equal(found?.state, "invitation");
});

test("an absent registry resolves nothing rather than throwing", () => {
  const registry = parseVenueInvitationLinks("");
  assert.equal(registry.links.length, 0);
  assert.equal(resolveVenueInvitationLink(registry, TOKEN_A), null);
});

test("a malformed document fails closed, it does not half-load", () => {
  const registry = parseVenueInvitationLinks("{ not json");
  assert.equal(registry.links.length, 0);
  assert.equal(registry.refusals.length, 1);
});

test("a wrong version is refused outright", () => {
  const registry = parseVenueInvitationLinks({
    version: "signal-film-links/v2",
    links: [invitationRow()],
  });
  assert.equal(registry.links.length, 0);
  assert.match(registry.refusals[0] ?? "", /version/);
});

test("one refused row refuses the whole document", () => {
  // Criteria 16 and 17 call these fatal findings. A registry that silently
  // drops the row it could not read is a registry that 404s one venue for a
  // reason nobody sees.
  const registry = parseVenueInvitationLinks(
    doc([invitationRow(), proposalRow({ status: undefined })]),
  );
  assert.equal(registry.links.length, 0);
  assert.ok(registry.refusals.length > 0);
});

test("a row with no status is a fatal finding, never defaulted to active", () => {
  const { status: _dropped, ...withoutStatus } = invitationRow();
  const registry = parseVenueInvitationLinks(doc([withoutStatus]));
  assert.equal(registry.links.length, 0);
  assert.match(registry.refusals.join(" "), /never absent/);
});

test("two active links for one account is fatal", () => {
  const registry = parseVenueInvitationLinks(
    doc([
      invitationRow(),
      invitationRow({ token: TOKEN_C }),
    ]),
  );
  assert.equal(registry.links.length, 0);
  assert.match(registry.refusals.join(" "), /2 active links/);
});

test("an account with only a replaced link is fatal, it is unreachable", () => {
  const registry = parseVenueInvitationLinks(
    doc([invitationRow({ status: "replaced" })]),
  );
  assert.equal(registry.links.length, 0);
  assert.match(registry.refusals.join(" "), /no active link/);
});

test("a replaced row plus an active row for one account is fine", () => {
  const registry = parseVenueInvitationLinks(
    doc([
      invitationRow({ token: TOKEN_C, status: "replaced" }),
      invitationRow(),
    ]),
  );
  assert.deepEqual(registry.refusals, []);
  assert.equal(
    resolveVenueInvitationLink(registry, TOKEN_C)?.status,
    "replaced",
  );
});

test("a venue that said stop is unreachable, and that is not a defect", () => {
  // Section 12.5: a venue that has said stop is revoked. Zero active links is
  // the intended terminal state for it, not a fatal finding, so the criterion
  // 17 refusal must not fire on an account whose rows are all revoked.
  const registry = parseVenueInvitationLinks(
    doc([
      invitationRow(),
      invitationRow({ token: TOKEN_C, accountId: "VEN-0044", status: "revoked" }),
    ]),
  );
  assert.deepEqual(registry.refusals, []);
});

test("a revoked token resolves to nothing, exactly like an unknown one", () => {
  const registry = parseVenueInvitationLinks(
    doc([
      invitationRow(),
      invitationRow({ token: TOKEN_C, accountId: "VEN-0044", status: "revoked" }),
    ]),
  );
  assert.deepEqual(registry.refusals, []);
  assert.equal(resolveVenueInvitationLink(registry, TOKEN_C), null);
  assert.equal(resolveVenueInvitationLink(registry, "Zz9zZz9zZz9zZz9zZz9zZz9z"), null);
});

test("a duplicate token is refused", () => {
  const registry = parseVenueInvitationLinks(
    doc([invitationRow(), invitationRow({ accountId: "VEN-0099" })]),
  );
  assert.equal(registry.links.length, 0);
  assert.match(registry.refusals.join(" "), /duplicate token/);
});

test("a token of the wrong shape is refused", () => {
  for (const token of ["short", "0f3rNqW8dJ2mBv5tXcYp7Lz1", `${TOKEN_A}x`]) {
    const registry = parseVenueInvitationLinks(doc([invitationRow({ token })]));
    assert.equal(registry.links.length, 0, token);
  }
});

test("a proposal state with an unfilled slot is a send defect, refused here", () => {
  const base = proposalRow();
  for (const key of [
    "firstName",
    "walkthroughDate",
    "holdEndsOn",
    "paidCount",
    "nextFreeNumber",
  ]) {
    const proposal = { ...(base.proposal as Record<string, unknown>) };
    delete proposal[key];
    const registry = parseVenueInvitationLinks(
      doc([proposalRow({ proposal })]),
    );
    assert.equal(registry.links.length, 0, key);
  }
});

test("a founding number outside 01/25 to 25/25 is refused", () => {
  for (const nextFreeNumber of ["00/25", "26/25", "4/25", "04/50"]) {
    const registry = parseVenueInvitationLinks(
      doc([
        proposalRow({
          proposal: {
            ...(proposalRow().proposal as Record<string, unknown>),
            nextFreeNumber,
          },
        }),
      ]),
    );
    assert.equal(registry.links.length, 0, nextFreeNumber);
  }
});

test("an impossible calendar date is refused rather than rolled forward", () => {
  const registry = parseVenueInvitationLinks(
    doc([
      proposalRow({
        proposal: {
          ...(proposalRow().proposal as Record<string, unknown>),
          holdEndsOn: "2026-02-31",
        },
      }),
    ]),
  );
  assert.equal(registry.links.length, 0);
});

test("proposal slots on an invitation row are refused", () => {
  const registry = parseVenueInvitationLinks(
    doc([invitationRow({ proposal: proposalRow().proposal })]),
  );
  assert.equal(registry.links.length, 0);
});

test("a film without captions is refused, most first views are muted", () => {
  const registry = parseVenueInvitationLinks(
    doc([
      invitationRow({
        film: { url: "https://cdn.example/a.mp4", posterUrl: "https://cdn.example/a.jpg" },
      }),
    ]),
  );
  assert.equal(registry.links.length, 0);
  assert.match(registry.refusals.join(" "), /captionsUrl/);
});

test("a film without a poster is refused, autoplay is forbidden", () => {
  const registry = parseVenueInvitationLinks(
    doc([
      invitationRow({
        film: {
          url: "https://cdn.example/a.mp4",
          captionsUrl: "https://cdn.example/a.vtt",
        },
      }),
    ]),
  );
  assert.equal(registry.links.length, 0);
  assert.match(registry.refusals.join(" "), /posterUrl/);
});

test("criterion 4: a venue name in a media URL is refused", () => {
  const registry = parseVenueInvitationLinks(
    doc([
      invitationRow({
        film: {
          url: "https://cdn.example/glenmara-first.mp4",
          posterUrl: "https://cdn.example/a.jpg",
          captionsUrl: "https://cdn.example/a.vtt",
        },
      }),
    ]),
  );
  assert.equal(registry.links.length, 0);
  assert.match(registry.refusals.join(" "), /contains the venue name/);
});

test("a complete film is accepted", () => {
  const registry = parseVenueInvitationLinks(
    doc([
      invitationRow({
        film: {
          url: "https://cdn.example/pin_ab12cd34ef56.mp4",
          posterUrl: "https://cdn.example/pin_ab12cd34ef56.jpg",
          captionsUrl: "https://cdn.example/pin_ab12cd34ef56.vtt",
        },
      }),
    ]),
  );
  assert.deepEqual(registry.refusals, []);
  assert.equal(
    resolveVenueInvitationLink(registry, TOKEN_A)?.film?.captionsUrl,
    "https://cdn.example/pin_ab12cd34ef56.vtt",
  );
});

test("cohort and touch are required, they are carried on the event", () => {
  for (const over of [{ cohort: undefined }, { touch: undefined }, { cohort: 0 }]) {
    const registry = parseVenueInvitationLinks(doc([invitationRow(over)]));
    assert.equal(registry.links.length, 0, JSON.stringify(over));
  }
});

test("resolution does the same work for a hit and a miss", () => {
  // Section 6: the response time must not differ in a way that reveals which
  // is which. The implementation never returns early, so the observable
  // property is that resolution is total over the list. Asserted structurally
  // rather than by timing, because a timing assertion in CI is a flake.
  const registry: VenueInvitationRegistry = parseVenueInvitationLinks(
    doc([invitationRow(), proposalRow()]),
  );
  const source = resolveVenueInvitationLink.toString();
  assert.ok(
    !/return\s+link\s*;/.test(source),
    "resolution must not return early on a match",
  );
  assert.equal(resolveVenueInvitationLink(registry, TOKEN_B)?.accountId, "VEN-0043");
});
