# ADR-007: Venue Portal is a privacy-bounded read model over Signal HQ Access

- Status: proposed for founder sign-off
- Date: 2026-07-25
- Owners: Signal Studio suite architecture
- Authority: `signal-entitlements`
- Phase: A, product and privacy contract only

## Context

Venue Edition customers need to know whether sponsored access was issued,
redeemed, and used. Signal HQ already owns the access lifecycle, while the
canonical entitlements store already separates sponsorship from workspace
membership and forbids sponsors from product content.

Giving a venue a filtered workspace view would collapse payment, membership,
and content authority. Counting route visits would produce a weak usage claim.
Keeping only sponsor/day totals would protect privacy but makes activation and
retention definitions impossible unless cohort counts are closed while source
events still exist.

## Decision

Build two separate surfaces:

- Signal HQ Access remains the operator control plane and the only writer for
  venue, allotment, code, redemption, entitlement, reconciliation, and
  support-view state.
- Venue Portal becomes a sponsor-authenticated, read-mostly projection of
  commercial access metadata and privacy-protected aggregate usage.

The portal is not a new product and does not receive a product route in Phase
A. It uses the company name Signal Studio and the account label Venue Portal.

Usage comes from an allowlist of committed product actions. Page loads do not
count. Short-lived pseudonymous source events roll into sponsor/day and frozen
cohort aggregates in `signal-entitlements`. Raw events expire after 35 days.
Daily aggregates and report snapshots carry metric, instrumentation, coverage,
and suppression versions.

The portal never queries product content. Notes, Tasks content, private
Timeline, Signal briefing prose, comments, attachments, collaborators,
members, raw user/workspace identifiers, and code values in reports are
forbidden. Behavioural values are suppressed below three eligible sponsored
workspaces; rates and cohorts are suppressed below five.

Venue members are sponsor-scoped owners, managers, or viewers. Signal operator
view-as remains an HQ capability, always audited. A portal request can enter
the HQ queue but cannot change an allotment or entitlement.

## Data consequences

Reuse:

- `sponsors`
- `allotment_ledger`
- `license_codes`
- `redemptions`
- `entitlements`
- `entitlement_events`
- `sponsor_activations`
- `sponsor_consent_grants`

Add only in later phases:

- `sponsor_members`
- `sponsor_usage_daily`
- `sponsor_report_snapshots`
- optional `sponsor_requests`
- nullable code delivery/expiry fields required to prove those states.

No new entitlement resolver, sponsor authority, workspace membership, or
product content copy is created.

## Rejected alternatives

- **Venue membership in sponsored workspaces.** Rejected because sponsorship
  is not content authority.
- **A second portal database as the access authority.** Rejected because it
  would conflict with `signal-entitlements`.
- **Named couple or workspace usage rows.** Rejected as surveillance and
  unnecessary for renewal proof.
- **Client-side page-view analytics.** Rejected because visits are not
  meaningful use and are easy to miscount.
- **Indefinite event retention.** Rejected because aggregate reporting does
  not justify a long-lived behavioural trail.
- **Silent zeroes during telemetry gaps.** Rejected because missing data is not
  inactivity.

## Consequences

Small pilots may see redemptions before they see behavioural reporting. That is
an intentional privacy cost. Retention cohorts must close incrementally before
short-lived events expire. Product teams must instrument server-side committed
actions and version them. Reports remain honest during gaps but may be less
visually complete.

## Release gate

Phase B cannot start until the founder signs off the product contract, metric
dictionary, roles, privacy/retention, claims, and deterministic wireframes.
No production Portal route may exist until Phase C tenant-isolation,
forbidden-payload, auth-role, suppression, and incomplete-telemetry tests pass.

