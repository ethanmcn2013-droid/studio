---
id: venue-editions-mechanic
title: Ship the Founding Venue Programme as Venue Editions — sponsored per-couple redemption codes, 18-month duration…
category: Product
date: 2026-05-13
status: Active
reviewDate: 2026-06-30
relatedObjects: [Founding Venue Programme, Lamb's Hill, docs/VENUE_EDITIONS_PLAN.md, docs/CYCLE_8_5_HANDOFF.md, Tasks comp_codes table]
---

## Decision

Ship the Founding Venue Programme as Venue Editions — sponsored per-couple redemption codes, 18-month duration, co-branded eyebrow only, auto-drop to Free at month 18.

## Reason

A sponsor-pays mechanic puts the venue in front of the couple as the gift-giver rather than positioning Signal Studio as the marketer — venue keeps the relationship, couple keeps the workspace, and the brand stays out of the way during the moment of delight. Per-couple codes (not bulk seats) preserve sponsor-aware welcome and per-redemption attribution. Eyebrow-only co-brand (not logos) holds BRAND.md's anti-theatre register. The founder extended couple access to 18 months on 2026-07-01; a quiet prompt before auto-drop avoids the indefinite-grace-period failure mode of comp programs.

## Alternatives considered

Bulk seat allocation (sponsor buys 10 seats, distributes themselves — loses attribution + welcome personalization); permanent free tier for venue couples (no graceful transition path); venue-logo co-branding (clashes with anti-theatre register).

## Risks

Day-330 prompt copy hasn't been written yet — risk that the auto-drop feels abrupt. 40% audience-share guardrail is named but not yet enforced in code (Lamb's Hill scale is fine; revisit at venue #3). Studio's entitlements + redemptions tables are unused after 8.3 reconciliation (Tasks's comp_codes is the runtime source) — kept for now, decision parked for Cycle 9+.

## Notes

Cycle 8.0 decisions lock (naming, eyebrow-only co-brand, unlimited allocation, per-couple CLI codes, 5 canonical redemption error strings) captured here for HQ; duration was amended to an 18-month auto-drop on 2026-07-01. Full spec at docs/VENUE_EDITIONS_PLAN.md. Soft launch (Cycle 8.5) gated on Clerk webhook secret rotation + in-browser walk before Sinéad gets the 10-code CSV.
