/**
 * Pure sponsorship policy for the shared entitlements store.
 *
 * A sponsor activation is an association and a commercial record. It is never
 * a Tasks membership and never grants access to workspace content. Consumers
 * must build sponsor responses through `projectSponsorActivation`, which uses
 * an explicit field allowlist and never spreads a database row into a DTO.
 */

export const SPONSOR_CONSENT_POLICY_VERSION = "sponsor-metadata.v1";

/** Metadata the sponsor may see without an owner consent grant. */
export const SPONSOR_DEFAULT_FIELDS = [
  "activation.id",
  "activation.state",
  "activation.invitation_state",
  "activation.invitation_sent_at",
  "activation.invitation_accepted_at",
  "activation.invitation_declined_at",
  "activation.revoked_at",
  "entitlement.tier",
  "entitlement.valid_from",
  "entitlement.valid_until",
  "sponsor.id",
  "sponsor.organization",
  "sponsor.local_reference",
  "sponsor.season_reference",
  "consent.receipt_version",
  "consent.receipt_at",
] as const;

/**
 * The complete set of owner-controlled fields a sponsor may receive. A
 * canonical workspace id is only an association key; exposing it does not
 * create membership or make any workspace route readable.
 */
export const SPONSOR_CONSENT_FIELDS = [
  "workspace.id",
  "workspace.label",
  "workspace.primary_date",
  "wedding.ceremony",
] as const;

/** Content and relationship fields which consent can never override. */
export const SPONSOR_FORBIDDEN_FIELD_PREFIXES = [
  "notes",
  "tasks",
  "timeline.private",
  "comments",
  "attachments",
  "collaborators",
  "members",
  "workspace.members",
] as const;

export type SponsorDefaultField = (typeof SPONSOR_DEFAULT_FIELDS)[number];
export type SponsorConsentField = (typeof SPONSOR_CONSENT_FIELDS)[number];
export type SponsorProjectionField = SponsorDefaultField | SponsorConsentField;

export type SponsorCapability =
  | "activation_metadata:read"
  | "consented_workspace_metadata:read"
  | "workspace_membership:create"
  | "workspace_membership:read"
  | "workspace_content:read"
  | "notes:read"
  | "tasks:read"
  | "private_timeline:read"
  | "comments:read"
  | "attachments:read"
  | "collaborators:read";

export type SponsorPolicyDecision = Readonly<{
  allowed: boolean;
  reason: string;
}>;

/** Default-deny capability check for every sponsor-facing entrypoint. */
export function decideSponsorCapability(
  capability: string,
): SponsorPolicyDecision {
  if (
    capability === "activation_metadata:read" ||
    capability === "consented_workspace_metadata:read"
  ) {
    return {
      allowed: true,
      reason: "Limited to the sponsor metadata projection.",
    };
  }

  return {
    allowed: false,
    reason: "Sponsorship never grants membership or workspace content access.",
  };
}

export type SponsorProjectionSource = Readonly<{
  ownerSubjectId: string;
  activation: Readonly<{
    id: string;
    state: string;
    invitationState: string;
    invitationSentAt: number | null;
    invitationAcceptedAt: number | null;
    invitationDeclinedAt: number | null;
    revokedAt: number | null;
  }>;
  entitlement: Readonly<{
    tier: string;
    validFrom: number | null;
    validUntil: number | null;
  }>;
  sponsor: Readonly<{
    id: string;
    organization: string;
    localReference: string | null;
    seasonReference: string | null;
  }>;
  workspace: Readonly<{
    id: string | null;
    label: string | null;
    primaryDate: string | null;
    ceremony: string | null;
  }>;
}>;

export type SponsorConsentGrantRecord = Readonly<{
  id: string;
  activationId: string;
  field: string;
  policyVersion: string;
  receiptVersion: string;
  receiptHash: string;
  receiptAt: number;
  grantedByOwnerSubjectId: string;
  grantedAt: number;
  revokedByOwnerSubjectId: string | null;
  revokedAt: number | null;
}>;

export type SponsorProjection = Readonly<
  Partial<Record<SponsorProjectionField, string | number | null>>
>;

const defaultFieldSet = new Set<string>(SPONSOR_DEFAULT_FIELDS);
const consentFieldSet = new Set<string>(SPONSOR_CONSENT_FIELDS);

export function isForbiddenSponsorField(field: string): boolean {
  return SPONSOR_FORBIDDEN_FIELD_PREFIXES.some(
    (prefix) =>
      field === prefix ||
      field.startsWith(`${prefix}.`) ||
      field.endsWith(`.${prefix}`) ||
      field.includes(`.${prefix}.`),
  );
}

export function isSponsorConsentField(
  field: string,
): field is SponsorConsentField {
  return consentFieldSet.has(field);
}

/**
 * Validate requested fields before looking at data. Unknown fields fail
 * closed, and forbidden content paths get a specific error for audit logs.
 */
export function assertSponsorProjectionFields(
  fields: readonly string[],
): asserts fields is readonly SponsorProjectionField[] {
  for (const field of fields) {
    if (isForbiddenSponsorField(field)) {
      throw new Error(`Sponsor field '${field}' is always forbidden.`);
    }
    if (!defaultFieldSet.has(field) && !consentFieldSet.has(field)) {
      throw new Error(`Sponsor field '${field}' is not allowlisted.`);
    }
  }
}

function assertValidGrant(grant: SponsorConsentGrantRecord): void {
  if (isForbiddenSponsorField(grant.field)) {
    throw new Error(`Stored sponsor consent field '${grant.field}' is forbidden.`);
  }
  if (!isSponsorConsentField(grant.field)) {
    throw new Error(`Stored sponsor consent field '${grant.field}' is not allowlisted.`);
  }
  if (grant.policyVersion !== SPONSOR_CONSENT_POLICY_VERSION) {
    throw new Error(`Unsupported sponsor consent policy '${grant.policyVersion}'.`);
  }
  if (!/^(?:sha256:)?[a-f0-9]{64}$/i.test(grant.receiptHash)) {
    throw new Error("Sponsor consent receipt must carry a SHA-256 hash.");
  }
  if (!grant.receiptVersion.trim() || !Number.isFinite(grant.receiptAt)) {
    throw new Error("Sponsor consent receipt version and timestamp are required.");
  }
}

function defaultProjection(
  source: SponsorProjectionSource,
  receipt: SponsorConsentGrantRecord | undefined,
): Record<SponsorDefaultField, string | number | null> {
  return {
    "activation.id": source.activation.id,
    "activation.state": source.activation.state,
    "activation.invitation_state": source.activation.invitationState,
    "activation.invitation_sent_at": source.activation.invitationSentAt,
    "activation.invitation_accepted_at": source.activation.invitationAcceptedAt,
    "activation.invitation_declined_at": source.activation.invitationDeclinedAt,
    "activation.revoked_at": source.activation.revokedAt,
    "entitlement.tier": source.entitlement.tier,
    "entitlement.valid_from": source.entitlement.validFrom,
    "entitlement.valid_until": source.entitlement.validUntil,
    "sponsor.id": source.sponsor.id,
    "sponsor.organization": source.sponsor.organization,
    "sponsor.local_reference": source.sponsor.localReference,
    "sponsor.season_reference": source.sponsor.seasonReference,
    "consent.receipt_version": receipt?.receiptVersion ?? null,
    "consent.receipt_at": receipt?.receiptAt ?? null,
  };
}

function consentedValue(
  source: SponsorProjectionSource,
  field: SponsorConsentField,
): string | null {
  switch (field) {
    case "workspace.id":
      return source.workspace.id;
    case "workspace.label":
      return source.workspace.label;
    case "workspace.primary_date":
      return source.workspace.primaryDate;
    case "wedding.ceremony":
      return source.workspace.ceremony;
  }
}

/**
 * Build a sponsor DTO from named fields only. Active owner consent is required
 * for every workspace field. Revoking either the activation or its grant takes
 * effect on the next call; callers must not cache this projection.
 */
export function projectSponsorActivation(
  source: SponsorProjectionSource,
  grants: readonly SponsorConsentGrantRecord[],
  requestedFields: readonly string[] = [],
): SponsorProjection {
  assertSponsorProjectionFields(requestedFields);

  const matching = grants.filter(
    (grant) => grant.activationId === source.activation.id,
  );
  for (const grant of matching) {
    assertValidGrant(grant);
    if (grant.grantedByOwnerSubjectId !== source.ownerSubjectId) {
      throw new Error("Sponsor consent must be granted by the activation owner.");
    }
    if ((grant.revokedAt == null) !== (grant.revokedByOwnerSubjectId == null)) {
      throw new Error("Sponsor consent revocation requires owner and timestamp.");
    }
    if (
      grant.revokedByOwnerSubjectId != null &&
      grant.revokedByOwnerSubjectId !== source.ownerSubjectId
    ) {
      throw new Error("Sponsor consent must be revoked by the activation owner.");
    }
  }

  const activeGrants = matching.filter(
    (grant) =>
      grant.revokedAt == null &&
      grant.revokedByOwnerSubjectId == null,
  );

  const activeByField = new Map<SponsorConsentField, SponsorConsentGrantRecord>();
  for (const grant of activeGrants) {
    const field = grant.field as SponsorConsentField;
    if (activeByField.has(field)) {
      throw new Error(`Multiple active sponsor consent grants for '${field}'.`);
    }
    activeByField.set(field, grant);
  }

  const latestReceipt = [...activeGrants].sort(
    (left, right) => right.receiptAt - left.receiptAt,
  )[0];
  const projection: Partial<
    Record<SponsorProjectionField, string | number | null>
  > = defaultProjection(source, latestReceipt);

  const activationAllowsConsent =
    source.activation.state === "active" && source.activation.revokedAt == null;
  if (!activationAllowsConsent) return Object.freeze(projection);

  for (const field of new Set(requestedFields)) {
    if (!isSponsorConsentField(field)) continue;
    if (!activeByField.has(field)) continue;
    projection[field] = consentedValue(source, field);
  }

  return Object.freeze(projection);
}
