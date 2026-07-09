---
id: licensing-policy-ratification
title: Ratify the licensing policy calls (comp, venue, student, chargeback, Event, redemption ownership).
status: open
priority: P1
blocking: true
phase: Phase 1
why: These are policy decisions only the founder can make, and several gate how the access rows and flows are built.
href: /hq
date: 2026-07-09
---

## Why

The access architecture is decided; these are the founder-only policy calls it sits on. Each one changes how a table, a flow, or a safeguard is built, so they should be ratified before the relevant phase.

## Steps

1. **Comp policy.** Confirm comps are grant overlays (`billing_state='none'`), default expiry 12 months, and perpetual grants require a written reason. (Not 100%-off Stripe subs.)
2. **Venue allotment.** Confirm paid venues must have a non-null allotment, and whether issuing is hard-blocked when the paid term lapses or only warns (revenue vs goodwill for founding venues).
3. **Student verification.** Choose the verification method at purchase and the graduation / re-verification policy for the EUR 9.99 tier.
4. **Chargeback clawback.** If a venue charges back, do we auto-revoke couples who already redeemed, or only flag them for a decision (the couples did nothing wrong).
5. **Event read-only.** Confirm an expired Event stays read-only forever, but a refunded Event loses read access.
6. **Redemption ownership (the biggest correctness dependency).** Decide: does the couple-redemption write move from Tasks into a shared-DB writer this cycle, or do we ship the reconcile-and-repair contract first and consolidate later.
7. **Data residency.** Confirm the Turso region(s) and any EU data-residency requirement for entitlements + audit data.

## Done when

Each call above is recorded so the corresponding phase can build against a settled policy.
