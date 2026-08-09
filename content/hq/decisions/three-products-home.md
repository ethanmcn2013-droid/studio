---
id: three-products-home
title: Three products, with the daily signal inside Home
status: Active
date: 2026-08-04
reviewDate: 2027-02-04
owner: founder
area: product architecture
relatedObjects: [Signal Notes, Signal Tasks, Signal Timeline, Home, Full Briefing]
---

## Decision

Signal Studio is one application with three products in this order:

`Signal Notes -> Signal Tasks -> Signal Timeline`

Home is the authenticated front door. Today's Signal and the Full Briefing are
capabilities inside Home, not a fourth product. Signal remains the company,
brand, and outcome the system produces.

## Canonical routes

- Products: `/app/notes`, `/app/tasks`, `/app/timeline`.
- Home: `/app/home`.
- Full Briefing: `/app/home/briefing`.
- Public briefing story: `/features/daily-briefing`.
- `/app/signal*` and `/signal` are compatibility inputs that permanently
  redirect to the Home/briefing destinations. New UI and copy never emit them.

## Supersedes

This decision supersedes `four-products` and amends
`unified-app-url-and-naming-contract`. Historical four-product records remain
provenance only.

## Sources

- `docs/consolidation/signal-home-2026-08-04.md`
- App `docs/SUITE_URL_AND_NAMING_CONTRACT.md`
- `BRAND.md` section 1
