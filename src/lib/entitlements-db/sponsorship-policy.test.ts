import assert from "node:assert/strict";
import test from "node:test";

import {
  SPONSOR_CONSENT_FIELDS,
  SPONSOR_CONSENT_POLICY_VERSION,
  SPONSOR_DEFAULT_FIELDS,
  SPONSOR_FORBIDDEN_FIELD_PREFIXES,
  decideSponsorCapability,
  projectSponsorActivation,
  type SponsorConsentGrantRecord,
  type SponsorProjectionSource,
} from "./sponsorship-policy";

const NOW = 1_800_000_000_000;
const HASH = "a".repeat(64);

const source = (state = "active"): SponsorProjectionSource => ({
  ownerSubjectId: "subject_owner_1",
  activation: {
    id: "activation_1",
    state,
    invitationState: "accepted",
    invitationSentAt: NOW - 5_000,
    invitationAcceptedAt: NOW - 4_000,
    invitationDeclinedAt: null,
    revokedAt: state === "revoked" ? NOW : null,
  },
  entitlement: {
    tier: "wedding",
    validFrom: NOW - 10_000,
    validUntil: NOW + 10_000,
  },
  sponsor: {
    id: "sponsor_1",
    organization: "The Venue",
    localReference: "booking-24",
    seasonReference: "2027",
  },
  workspace: {
    id: "workspace_private_1",
    label: "Alex and Sam",
    primaryDate: "2027-06-14",
    ceremony: "14:00, private garden",
  },
});

const grant = (
  field: string,
  overrides: Partial<SponsorConsentGrantRecord> = {},
): SponsorConsentGrantRecord => ({
  id: `grant_${field}`,
  activationId: "activation_1",
  field,
  policyVersion: SPONSOR_CONSENT_POLICY_VERSION,
  receiptVersion: "receipt-v1",
  receiptHash: HASH,
  receiptAt: NOW - 1_000,
  grantedByOwnerSubjectId: "subject_owner_1",
  grantedAt: NOW - 1_000,
  revokedByOwnerSubjectId: null,
  revokedAt: null,
  ...overrides,
});

test("default projection contains exactly the safe sponsor metadata", () => {
  const projection = projectSponsorActivation(source(), []);
  assert.deepEqual(
    Object.keys(projection).sort(),
    [...SPONSOR_DEFAULT_FIELDS].sort(),
  );
  assert.equal(projection["activation.id"], "activation_1");
  assert.equal(projection["sponsor.organization"], "The Venue");
  assert.equal(projection["entitlement.tier"], "wedding");
  assert.equal(projection["consent.receipt_version"], null);
});

test("default projection excludes workspace id, couple or class label, dates, and ceremony", () => {
  const projection = projectSponsorActivation(source(), []);
  for (const field of SPONSOR_CONSENT_FIELDS) {
    assert.equal(Object.hasOwn(projection, field), false);
  }
  assert.equal(JSON.stringify(projection).includes("Alex and Sam"), false);
  assert.equal(JSON.stringify(projection).includes("workspace_private_1"), false);
});

test("extra raw content on an input object is never spread into the projection", () => {
  const input = {
    ...source(),
    notes: [{ body: "private note" }],
    tasks: [{ title: "private task" }],
    privateTimeline: [{ title: "not published" }],
    comments: ["private comment"],
    attachments: ["private.pdf"],
    collaborators: ["person@example.test"],
  };
  const projection = projectSponsorActivation(input, []);
  const serialized = JSON.stringify(projection);
  for (const secret of [
    "private note",
    "private task",
    "not published",
    "private comment",
    "private.pdf",
    "person@example.test",
  ]) {
    assert.equal(serialized.includes(secret), false);
  }
});

test("active owner consent reveals only the specifically requested field", () => {
  const grants = [
    grant("workspace.label"),
    grant("workspace.primary_date", {
      id: "grant_date",
      receiptAt: NOW - 500,
      receiptVersion: "receipt-v2",
    }),
  ];
  const projection = projectSponsorActivation(
    source(),
    grants,
    ["workspace.label"],
  );
  assert.equal(projection["workspace.label"], "Alex and Sam");
  assert.equal(Object.hasOwn(projection, "workspace.primary_date"), false);
  assert.equal(projection["consent.receipt_version"], "receipt-v2");
  assert.equal(projection["consent.receipt_at"], NOW - 500);
});

test("every consentable field requires its own active owner grant", () => {
  const grants = SPONSOR_CONSENT_FIELDS.map((field, index) =>
    grant(field, { id: `grant_${index}` }),
  );
  const projection = projectSponsorActivation(
    source(),
    grants,
    SPONSOR_CONSENT_FIELDS,
  );
  assert.equal(projection["workspace.id"], "workspace_private_1");
  assert.equal(projection["workspace.label"], "Alex and Sam");
  assert.equal(projection["workspace.primary_date"], "2027-06-14");
  assert.equal(projection["wedding.ceremony"], "14:00, private garden");
});

test("requesting a field without its consent grant leaves it absent", () => {
  const projection = projectSponsorActivation(
    source(),
    [grant("workspace.label")],
    ["workspace.id", "workspace.label"],
  );
  assert.equal(Object.hasOwn(projection, "workspace.id"), false);
  assert.equal(projection["workspace.label"], "Alex and Sam");
});

test("grant revocation removes the field immediately", () => {
  const active = grant("workspace.label");
  assert.equal(
    projectSponsorActivation(source(), [active], ["workspace.label"])[
      "workspace.label"
    ],
    "Alex and Sam",
  );

  const revoked = {
    ...active,
    revokedByOwnerSubjectId: "subject_owner_1",
    revokedAt: NOW,
  };
  const after = projectSponsorActivation(
    source(),
    [revoked],
    ["workspace.label"],
  );
  assert.equal(Object.hasOwn(after, "workspace.label"), false);
  assert.equal(after["consent.receipt_version"], null);
});

test("a pending, ended, or revoked activation cannot reveal consented fields", () => {
  for (const state of ["pending", "ended", "revoked"]) {
    const projection = projectSponsorActivation(
      source(state),
      [grant("workspace.label")],
      ["workspace.label"],
    );
    assert.equal(Object.hasOwn(projection, "workspace.label"), false);
  }
});

test("mass-assigned forbidden content fields are all rejected", () => {
  const forbidden = SPONSOR_FORBIDDEN_FIELD_PREFIXES.flatMap((prefix) => [
    prefix,
    `${prefix}.anything`,
    `workspace.${prefix}`,
    `workspace.${prefix}.anything`,
  ]);
  assert.throws(
    () => projectSponsorActivation(source(), [], forbidden),
    /always forbidden/,
  );
});

test("unknown fields fail closed", () => {
  assert.throws(
    () => projectSponsorActivation(source(), [], ["workspace.owner_email"]),
    /not allowlisted/,
  );
});

test("a forbidden field persisted as a grant is rejected even when not requested", () => {
  assert.throws(
    () => projectSponsorActivation(source(), [grant("tasks.items")]),
    /Stored sponsor consent field 'tasks.items' is forbidden/,
  );
});

test("invalid or stale receipts fail closed", () => {
  assert.throws(
    () =>
      projectSponsorActivation(source(), [
        grant("workspace.label", { receiptHash: "not-a-hash" }),
      ]),
    /SHA-256/,
  );
  assert.throws(
    () =>
      projectSponsorActivation(source(), [
        grant("workspace.label", { policyVersion: "sponsor-metadata.v0" }),
      ]),
    /Unsupported sponsor consent policy/,
  );
});

test("only the activation owner can grant or revoke consent", () => {
  assert.throws(
    () =>
      projectSponsorActivation(source(), [
        grant("workspace.label", {
          grantedByOwnerSubjectId: "subject_someone_else",
        }),
      ]),
    /granted by the activation owner/,
  );
  assert.throws(
    () =>
      projectSponsorActivation(source(), [
        grant("workspace.label", {
          revokedByOwnerSubjectId: "subject_someone_else",
          revokedAt: NOW,
        }),
      ]),
    /revoked by the activation owner/,
  );
});

test("an incomplete revocation receipt fails closed", () => {
  assert.throws(
    () =>
      projectSponsorActivation(source(), [
        grant("workspace.label", {
          revokedByOwnerSubjectId: "subject_owner_1",
          revokedAt: null,
        }),
      ]),
    /requires owner and timestamp/,
  );
});

test("duplicate active grants for one field fail closed", () => {
  assert.throws(
    () =>
      projectSponsorActivation(
        source(),
        [
          grant("workspace.label", { id: "grant_1" }),
          grant("workspace.label", { id: "grant_2" }),
        ],
        ["workspace.label"],
      ),
    /Multiple active sponsor consent grants/,
  );
});

test("sponsor capabilities allow metadata but deny membership and every content class", () => {
  assert.equal(decideSponsorCapability("activation_metadata:read").allowed, true);
  assert.equal(
    decideSponsorCapability("consented_workspace_metadata:read").allowed,
    true,
  );
  for (const capability of [
    "workspace_membership:create",
    "workspace_membership:read",
    "workspace_content:read",
    "notes:read",
    "tasks:read",
    "private_timeline:read",
    "comments:read",
    "attachments:read",
    "collaborators:read",
    "future_content:read",
  ]) {
    const decision = decideSponsorCapability(capability);
    assert.equal(decision.allowed, false);
    assert.match(decision.reason, /never grants membership or workspace content/);
  }
});
