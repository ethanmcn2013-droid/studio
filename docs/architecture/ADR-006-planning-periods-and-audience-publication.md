# ADR-006: Planning Periods and audience publication

- Status: accepted
- Date: 2026-07-12
- Owners: Signal Studio suite architecture
- Contract: contracts/suite-contracts.v2.json
- Compatibility: contract v1 remains accepted during rollout

## Context

Signal Studio currently has four incompatible meanings of current work. Notes is user-scoped, Tasks has a validated active Workspace cookie, Timeline chooses an owner’s first local workspace, and Signal mixes one linked Workspace with an all-membership query. Adding context labels to those implementations would preserve the ambiguity and create cross-tenant publication risks.

The suite also needs to distinguish a commercial sponsor from a content collaborator. A school or venue may fund access without becoming entitled to a teacher’s or couple’s private work.

## Decision

### Authority and ownership

Tasks is the temporary runtime authority for PlanningPeriod, Workspace and Membership. Studio owns the immutable suite contract plus entitlement and sponsorship policy. Product content remains with the product that creates it:

- Notes owns private Notes.
- Tasks owns Tasks and workspace tenancy.
- Timeline owns independently editable safe Timeline publications and audience shares.
- Signal owns derived candidates, ranking and explanations.

This is a bridge to a shared platform service, not a second permanent source of truth. Consumer repositories store canonical IDs as projections and re-authorize against Tasks for current access. They do not recreate Workspace membership rules.

### Planning Period

PlanningPeriod is a finite user-owned horizon with an immutable ID, owner suite subject, name, context type, start and end calendar dates, IANA timezone, archive state, position and revision.

Contexts are school_year, semester, wedding_season and general. Workspace contexts are class, module, wedding and project. Context is never an account role and never grants a capability.

Calendar dates use YYYY-MM-DD. Audit timestamps use UTC instants. Date arithmetic is based on local calendar dates in the selected timezone, not elapsed milliseconds.

### Membership and listing

Period ownership is not a shortcut to child access. Every Workspace returned from a period query is independently filtered through current Membership. Background jobs and sibling reads re-check current membership; event claims are not authorization.

### Sponsorship

Sponsorship is orthogonal to Membership. Creating a sponsor activation:

- does not create Membership;
- does not grant workspace.read or object.read;
- may expose entitlement, invitation and activation state;
- may expose additional metadata only through a versioned, field-level and revocable consent receipt.

A venue’s sponsor-authored wedding season grouping is not a PlanningPeriod containing couple-owned Workspaces. A sponsor can collaborate only after a separate explicit invitation and acceptance.

### Cross-product transport

- User commands use an audience-bound signed assertion and idempotency key.
- Current catalog reads use a Tasks-owned API or a least-privilege read contract and re-authorize every request.
- Outbox events are invalidation and change hints, never authorization or private-content replication.
- Private product content remains in its owning database.

The existing single-delivery Tasks outbox is not promoted into a general fan-out bus in this release.

### Context preservation

Suite context v2 adds planningPeriodId while retaining workspaceId, projectId, objectRef, sourceProduct and returnUrl. A destination validates the subject and Membership before applying context. A product with no equivalent local object opens the canonical Workspace home and retains a safe return link.

### Signal

Signal accepts a discriminated Workspace or Planning Period scope. It loads bounded candidates only from currently authorized Workspaces, ranks them with stable deterministic rules and returns no more than three total. Each result carries a plain-language reason. Empty scope returns no fabricated recommendation.

### Timeline publication

The legacy slug-based Timeline remains available behind a legacy policy during migration. It is not reclassified as a Class or Couple Timeline.

New audience publication is a separate frozen safe projection:

- Promotion copies only fields selected in a preview; the default is title, date and completion state.
- Descriptions, attachments, comments, Note bodies and hidden metadata never cross the boundary.
- Later private changes mark the projection as divergent but do not silently update it.
- The owner can explicitly update, edit independently, unpublish or revoke.
- Source relationships remain internal and never appear in the public DTO.

Audience shares use 32 cryptographically random bytes. Only a SHA-256 token hash is stored. The raw token is shown once, excluded from logs and analytics, and may be rotated or revoked atomically. The audience route validates on every request, is private/no-store, noindex/nofollow and returns a strict allow-listed DTO.

### Feature rollout

Planning periods, contextual onboarding, period Signal, audience Timeline, school pilot and lifecycle duplication are independent server-side environment flags. Disabling a flag hides new entry points but never removes existing data or access.

## Rejected alternatives

- A new permanent platform database in this release: there is no deployed shared service or verified provider-wide identity boundary yet.
- Studio as PlanningPeriod data owner: Studio is not the current membership authority.
- Copying PlanningPeriod logic into every product: this creates drift and competing authorization decisions.
- Extending the legacy public-by-slug Timeline: its full internal rows and publication semantics cannot satisfy link-only strict projection.
- Sponsor-owned periods for customer work: this would conflate payment with content authority.
- A composite on-track score: it obscures time, completed work and fixed dates and invents certainty.

## Consequences

This decision adds a temporary Tasks dependency for current catalog reads. Consumers must tolerate resolver unavailability without exposing data; Notes capture remains available without association, while cross-workspace switching degrades calmly. Production rollout remains gated on provider identity verification, migration preflight, privacy review and public-payload adversarial tests.
