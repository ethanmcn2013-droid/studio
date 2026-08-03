/**
 * The venue capability matrix, and the boundary that matters most (E08.05).
 *
 * `roles.test.ts` checks the capabilities anybody thought to check.
 * This file checks the ones nobody thought to check, which is the whole
 * risk with a permission matrix: the cell that was never written down.
 *
 * Two guards:
 *
 *   1. **Every cell is asserted.** ROLE_MATRIX below is the complete
 *      role × capability truth table. Adding a role, or adding a
 *      capability, fails the build until the new cells are filled in
 *      deliberately. A capability that silently defaults to allowed is
 *      the failure this prevents.
 *
 *   2. **No venue role can ever hold a couple-content capability.** The
 *      venue sees aggregate access evidence and nothing else — not Notes,
 *      not Tasks, not an unpublished Timeline, not a briefing, not a
 *      comment, not an attachment, not a collaborator (D-011, D-027
 *      point 4). Today no such capability exists. This test makes adding
 *      one a build failure rather than a code review someone might miss.
 *
 * ── What these roles govern today, stated honestly ─────────────────────
 *
 * Nothing live. `roleCan` is imported only by the four /hq/account-review
 * panels, which are a founder-facing review fixture. There is no
 * venue-authenticated route anywhere in the product (R-043), so no venue
 * currently holds any of these roles. The matrix is the specification the
 * implementation must match when a venue account is built; it is not
 * evidence that one exists. E08.05's evidence document says the same
 * thing in the same words, deliberately.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  roleCan,
  roleDenialReason,
  ROLE_OPTIONS,
  ACCOUNT_CAPABILITIES,
  ACCOUNT_ROLES,
} from "./roles";
import type { AccountCapability } from "./roles";
import type { AccountRole } from "./types";

/**
 * The complete truth table. Every cell is a decision, written down once,
 * where a reviewer can read the whole thing at a glance.
 */
const ROLE_MATRIX: Record<AccountRole, Record<AccountCapability, boolean>> = {
  owner: {
    view_usage: true,
    view_reports: true,
    download_reports: true,
    manage_members: true,
    edit_reporting_preferences: true,
    request_access: true,
  },
  manager: {
    view_usage: true,
    view_reports: true,
    download_reports: true,
    manage_members: false,
    edit_reporting_preferences: true,
    request_access: true,
  },
  viewer: {
    view_usage: true,
    view_reports: true,
    download_reports: false,
    manage_members: false,
    edit_reporting_preferences: false,
    request_access: false,
  },
};

/**
 * The lists come from the PRODUCTION module, never from ROLE_MATRIX above.
 *
 * This is the whole difference between a guard and a decoration. Until
 * 2026-08-03 these two were `Object.keys(ROLE_MATRIX)`, so every test
 * below iterated the test's own hand-written copy of the capability list.
 * A mutation probe added a capability named `view_couple_notes` to
 * `roles.ts`, granted it to the owner role, and "declares no capability
 * that names couple content" passed green — the new capability simply was
 * not in the list being iterated.
 *
 * Reading the production list means an addition to `roles.ts` is seen
 * here whether or not anyone remembers to update ROLE_MATRIX, and the
 * first test below fails until they do.
 */
const ALL_ROLES: AccountRole[] = ACCOUNT_ROLES;
const ALL_CAPABILITIES: AccountCapability[] = [...ACCOUNT_CAPABILITIES];

describe("the recorded matrix matches the shipped module", () => {
  it("records every capability the module declares, and no extras", () => {
    const recorded = Object.keys(ROLE_MATRIX.owner).sort();
    assert.deepEqual(
      recorded,
      [...ALL_CAPABILITIES].sort(),
      "ROLE_MATRIX and ACCOUNT_CAPABILITIES have diverged. A capability " +
        "added to roles.ts without a deliberate row here is a permission " +
        "nobody decided — fill in the cell for every role.",
    );
  });

  it("records every role the module declares, and no extras", () => {
    assert.deepEqual(
      Object.keys(ROLE_MATRIX).sort(),
      [...ALL_ROLES].sort(),
      "ROLE_MATRIX and ACCOUNT_ROLES have diverged.",
    );
  });

  it("fills in every cell of the rectangle", () => {
    for (const role of ALL_ROLES) {
      for (const capability of ALL_CAPABILITIES) {
        assert.equal(
          typeof ROLE_MATRIX[role]?.[capability],
          "boolean",
          `${role} × ${capability} has no recorded decision. A missing cell ` +
            `reads as "allowed" to anyone skimming and as nothing to a test.`,
        );
      }
    }
  });
});

describe("venue capability matrix", () => {
  it("asserts every role × capability cell", () => {
    let cells = 0;
    for (const role of ALL_ROLES) {
      for (const capability of ALL_CAPABILITIES) {
        cells++;
        assert.equal(
          roleCan(role, capability),
          ROLE_MATRIX[role][capability],
          `${role} × ${capability} does not match the recorded matrix`,
        );
      }
    }
    assert.equal(
      cells,
      ALL_ROLES.length * ALL_CAPABILITIES.length,
      "the matrix is not rectangular",
    );
  });

  it("covers every role the UI can offer", () => {
    // ROLE_OPTIONS drives the role picker. A role offered in the UI but
    // absent from the matrix is a role whose permissions nobody decided.
    const offered = ROLE_OPTIONS.map((option) => option.value).sort();
    assert.deepEqual(
      offered,
      [...ALL_ROLES].sort(),
      "ROLE_OPTIONS and the capability matrix have diverged",
    );
  });

  it("has no role that can do nothing and none that is unbounded by accident", () => {
    for (const role of ALL_ROLES) {
      const granted = ALL_CAPABILITIES.filter((c) => roleCan(role, c));
      assert.ok(
        granted.length > 0,
        `${role} holds no capability at all — it is a role in name only`,
      );
    }
    // Only one role administers. Two administrators is a decision, not a
    // default, and it is not the recorded one.
    const admins = ALL_ROLES.filter((r) => roleCan(r, "manage_members"));
    assert.deepEqual(admins, ["owner"]);
  });

  it("gives a reason at every point of denial", () => {
    for (const role of ALL_ROLES) {
      for (const capability of ALL_CAPABILITIES) {
        const reason = roleDenialReason(role, capability);
        if (roleCan(role, capability)) {
          assert.equal(reason, null, `${role} × ${capability} denies a granted capability`);
        } else {
          assert.ok(
            reason && reason.length > 0,
            `${role} × ${capability} is denied with no explanation. A control ` +
              `that is disabled without a reason reads as a bug.`,
          );
        }
      }
    }
  });
});

describe("the venue never reaches couple content", () => {
  /**
   * A capability naming any of these is couple content or couple
   * identity, and no venue role may hold it. The list is the product
   * boundary written as strings so it can be enforced.
   */
  const COUPLE_CONTENT_TERMS = [
    "note",
    "task",
    "timeline",
    "signal",
    "briefing",
    "comment",
    "attachment",
    "collaborator",
    "guest",
    "content",
    "workspace",
    "dietary",
    "email",
    "identity",
  ];

  it("declares no capability that names couple content", () => {
    const offending = ALL_CAPABILITIES.filter((capability) =>
      COUPLE_CONTENT_TERMS.some((term) => capability.toLowerCase().includes(term)),
    );
    assert.deepEqual(
      offending,
      [],
      "A venue capability names couple content. The venue is shown aggregate " +
        "access evidence, never the couple's private planning work (D-011, " +
        "D-027 point 4). If this capability is genuinely needed, it is a " +
        "change request against the entitlement model, not a new row in a " +
        "permission matrix:\n  " + offending.join("\n  "),
    );
  });

  it("grants no venue role a capability outside the recorded set", () => {
    // Defence against the matrix being edited without this file: any
    // capability roleCan() answers `true` for must be one of the six.
    for (const role of ALL_ROLES) {
      for (const capability of ALL_CAPABILITIES) {
        if (!roleCan(role, capability)) continue;
        assert.ok(
          ALL_CAPABILITIES.includes(capability),
          `${role} was granted "${capability}", which is not in the recorded set`,
        );
      }
    }
  });
});
