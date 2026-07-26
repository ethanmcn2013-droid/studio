---
id: signal-studio-account-v2
title: Signal Studio Account is the customer-facing account family.
status: Active
date: 2026-07-26
owner: founder
area: Signal Studio Account
---

## Decision

Establish Signal Studio Account as the current customer-facing account model
for Venue, Education, and Organisation editions.

Preserve Venue Portal Phase A documentation as historical evidence. Keep
Signal HQ Access as the only control plane for codes, payments, allotments,
redemptions, entitlements, revocation, and audited support.

The authenticated founder review route is `/hq/account-review`. The prior
`/hq/venue-portal-review` URL redirects so existing review links remain valid.

## Governing principle

Prove the benefit without exposing the work.

## Scope now

- Account V2 product contract and vocabulary
- Typed `AccountSnapshot` with complete, partial, suppressed, and unavailable
  Venue fixtures
- Three isolated Overview + report-preview design concepts for founder
  selection
- Review-only deterministic fixtures — no sponsor auth, live telemetry,
  entitlement mutation, real email, or private work access

## Selection

Founder selected **Account Brief** on 2026-07-26. Phase 3 Venue Edition and
Phase 4 edition proofs proceed from that direction only.

## Still closed

No sponsor authentication, live telemetry, entitlement mutation, real email,
or production customer route.
