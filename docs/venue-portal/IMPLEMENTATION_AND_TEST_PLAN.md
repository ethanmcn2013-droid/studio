# Signal Studio Account · implementation phases and test plan (filed as "Venue Portal")

Naming: the **Signal Studio Account IS the Venue Portal** (**D-015 Q4**). One
surface, two names.

**This is the current test inventory of record. Roughly 45 cases.** It is not
historical and it is not superseded. Corrected against the ratified decision
record on 2026-08-03. Superseded text is struck through and marked
`[SUPERSEDED <id> · <date>]`; it is never deleted silently.

**Launch scope (D-027 point 4, 2026-08-03).** At launch the surface is
invitation administration only. Aggregate adoption evidence follows after
1 September, and the consent layer stays unwired. The phases below are not
rewritten. Phase C's Access work and the tenant-isolation, privacy and role
suites are launch-critical. The Usage and Reports work is post-launch.

**This is an audit, not a build (D-015 Q2).** The criteria below exist so that
existing implementation can be assessed against them. Existing implementation is
candidate evidence. It is never founder-approved completion.

## Architecture boundary

The Account is a read model over `signal-entitlements`. It does not create
a second entitlement authority and does not query product content.

```text
Notes / Tasks / Timeline / Signal
        committed meaningful action
                    |
                    v
        short-lived pseudonymous event
                    |
        sponsor attribution through the
       canonical redemption/activation chain
                    |
                    v
          daily aggregate projection
                    |
          versioned report snapshots
                    |
        Venue Portal read-only endpoints

Signal HQ Access ----------------------> canonical access mutations
Account requests ---------------------> HQ queue, never direct mutation
```

## Phase A. Product and privacy contract

This folder, the architecture decision, deterministic review prototype, HQ
decision, operator sign-off, OAuth status record, and test plan.

Exit gate:

- founder signs off the six decisions in `README.md`;
- no production route exists;
- no schema or product instrumentation change ships in this phase.

## Phase B. Instrumentation and projection

Status: approved to begin by founder sign-off on 25 July 2026.

1. Define a shared `venue-meaningful-action.v1` event schema.
2. Emit events server-side after committed, allowlisted actions.
3. Attribute only through the canonical entitlement/redemption/activation
   chain.
4. Add `sponsor_usage_daily` and `sponsor_report_snapshots` to
   `signal-entitlements`.
5. Add code delivery/expiry fields before representing those states.
6. Run a daily rollup with idempotency, late-arrival repair, coverage health,
   and deterministic backfill.
7. Apply raw-event and export retention.

Phase B exit gate:

- unit tests for each module's qualifying and excluded events;
- idempotency and failed-transaction tests;
- payload privacy test;
- attribution ambiguity test;
- aggregate reconciliation fixture;
- no user-facing portal route.

## Phase C. Read-only portal

1. Add sponsor membership and server-resolved sponsor context.
2. Build Overview, Access, Usage, Reports, and the privacy explainer in Venue
   settings.
3. Render deterministic fixtures first, then connect the aggregate projection.
4. Add audited Signal operator view-as.
5. Generate versioned monthly CSV and PDF snapshots.

Phase C exit gate:

- full role/capability matrix;
- cross-tenant suite;
- content-key and identifier leakage suite;
- screen/export parity;
- 390, 768, 1440 px review;
- keyboard, focus, semantics, contrast, reduced-motion, and screen-reader
  review;
- partial/unavailable/suppressed states;
- one venue pilot approved before production exposure.

## Phase D. Controlled actions

- portal member invites;
- request more codes;
- download/share unused codes;
- notification preferences;
- optional operational contact label only after lawful-basis review.

~~Allotment~~ Entitlement mode `[SUPERSEDED D-020 · 2026-08-03]`, mint, revoke,
entitlement, reconciliation, and view-as mutations remain Signal HQ actions.

## Phase E. Sales proof

- one venue pilot;
- monthly impact report;
- 30-day review of which metrics help a renewal conversation;
- remove metrics that invite surveillance or do not change a decision.

## Required test inventory

### Schema and projection

- migration is additive and idempotent;
- existing entitlement resolver results remain unchanged;
- one source event increments one aggregate exactly once;
- source event replay is a no-op;
- late event updates only its affected day and dependent frozen cohort;
- coverage state moves complete -> partial when a module/day is missing;
- aggregate values reconcile to deterministic source fixtures;
- raw source events older than 35 days are removed.

### Tenant isolation

- request identity resolves one active sponsor context;
- sponsor id in URL/query/body cannot override context;
- owner, manager, viewer, and operator cannot read another sponsor;
- export object references are sponsor-scoped and short-lived;
- report snapshot id is not a bearer token.

### Privacy

- portal query layer has no import from product content repositories/tables;
- DTOs are field-by-field, never row-spread;
- forbidden-key recursive matcher covers content and identifiers;
- private fixture strings never appear in JSON, HTML, CSV, PDF, logs, traces,
  analytics, or error messages;
- suppression is identical across formats;
- operator view-as never generates usage.

### Metrics

- venue timezone day/week boundaries;
- leap day and daylight-saving transitions;
- denominator zero returns null;
- cohort eligibility waits until its band closes;
- one workspace with many actions is one active workspace;
- module adoption deduplicates by activation/module/window;
- automatic Signal landing does not count as a deliberate briefing open;
- ~~reconciliation drift blocks "remaining" and raises attention~~ `[SUPERSEDED
  D-020 · 2026-08-03. There is no remainder to block]` reconciliation drift
  raises attention and blocks any reconciled claim.

### Entitlement, added 2026-08-03 (D-020, R-016)

- an unlimited entitlement renders `unlimited`, never a number and never `0`;
- an absent stored entitlement figure renders `unavailable`, never `0`, and
  produces no exhaustion message and no request prompt;
- CSV writes `value_state=unlimited` with a blank `value` cell, in every export
  format;
- the request control, the exhaustion message and any copy describing a
  quantity left are absent from an unlimited venue's surface, not merely
  disabled;
- a venue-facing string sweep returns zero unmarked hits for "allotment",
  "seat", "codes remaining" and "licences allotted";
- the entitlement-mode default is the same in the database column, the library
  constant and the HQ onboarding form.

### Wedding dates, added 2026-08-03 (D-011 point 1)

- a wedding date reaches a venue only where that venue's code was redeemed by
  that couple, proven server-side against the canonical redemption chain;
- **no date change is ever rendered**: no previous date, no delta, no
  "postponed" flag, no change count, no edit timestamp, no derived attention
  item, in any format including exports, accessibility text and support view-as;
- a client-supplied sponsor id cannot widen the projection.

### Denominators, added 2026-08-03 (E09.02 §1)

- the redemption denominator query touches no booking, contract or wedding-date
  column, proven by a schema-level test;
- every share renders with its denominator; a bare percentage fails the test.

### Roles and actions

- capability matrix is table-driven;
- final venue owner cannot be removed;
- revoked member session is rejected;
- a request cannot mutate entitlement `[was "allotment", SUPERSEDED D-020 · 2026-08-03]`;
- a mutation resolves its sponsor server-side and ignores any client-supplied
  sponsor id;
- fulfilled request references an audited HQ ledger event.

### Experience

- deterministic content at 390, 768, and 1440 px;
- no horizontal overflow;
- targets at least 44 px;
- logical heading and landmark order;
- visible keyboard focus and menu escape behaviour;
- report tables have headers and non-colour status text;
- suppressed and partial states are announced accessibly.

## Production stop conditions

Stop rather than expose a route if:

- a portal query would need private product content;
- tenant isolation cannot be proven;
- the entitlement authority is ambiguous;
- provider/auth membership cannot be verified;
- telemetry completeness cannot be represented honestly;
- the existing sponsor consent policy would need to permit a forbidden field;
- Phase A founder sign-off remains open.

