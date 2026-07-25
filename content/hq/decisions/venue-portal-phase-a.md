---
id: venue-portal-phase-a
title: Venue Portal proves access and aggregate use without opening private work.
status: Active
date: 2026-07-25
owner: founder
area: Venue Edition
---

## Decision

Keep Signal HQ Access and Venue Portal separate.

Signal HQ Access remains the only control plane for venue onboarding, payment,
allotments, codes, redemptions, entitlements, reconciliation, revocation, and
audited support. Venue Portal is a read-mostly client account surface over
commercial access metadata and aggregate meaningful use.

Meaningful use comes from committed, allowlisted actions in Signal Notes,
Signal Tasks, Signal Timeline, and Signal. Page visits do not count. Product
content, people, names, raw identifiers, and private workspace context never
enter the portal projection.

Behavioural values are withheld for groups smaller than three. Rates and
cohorts require five. Missing telemetry is partial or unavailable, never zero.
Venues can request more codes but cannot change their own allotment.

## Why

A venue needs proof that the benefit is being taken up. It does not need a
window into how any couple plans. This boundary gives renewal conversations
real access and use evidence without turning Signal Studio into surveillance.

It also keeps the load-bearing architecture intact:
`signal-entitlements` remains the one access authority, sponsorship remains
separate from membership, and the existing forbidden-content policy stays
closed.

## Scope

Phase A contains the product contract, metric dictionary, roles, privacy and
retention rules, venue-facing claims, deterministic wireframes, architecture
decision, and implementation/test plan under `docs/venue-portal/`.

Phase A itself creates no production route or usage instrumentation. Founder
sign-off and the resulting Phase B authority are recorded below.

## Approval

The founder approved all six Phase A statements on 25 July 2026 without
amendment. Phase B instrumentation and projection work is approved to begin.

The authenticated `/hq/venue-portal-review` route is a deterministic founder
review surface only. It is not sponsor authentication and is not a production
Venue Portal route. Client production exposure remains prohibited until:

- sponsor membership and tenant isolation are implemented and tested;
- production provider/auth behaviour is verified;
- privacy and suppression tests pass across screen and export formats; and
- one named venue pilot is approved.
