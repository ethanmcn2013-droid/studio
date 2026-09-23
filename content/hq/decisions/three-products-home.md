---
id: three-products-home
title: Core work, with the daily signal inside Home
status: Active
date: 2026-08-04
reviewDate: 2027-02-04
owner: founder
area: product architecture
relatedObjects: [Signal Notes, Signal Tasks, Signal Timeline, Home, Projects, Full Briefing]
---

## Decision

The 2026-08-04 product-line taxonomy described one application with three
products in this order:

`Signal Notes -> Signal Tasks -> Signal Timeline`

Home is the authenticated front door. Today's Signal and the Full Briefing are
capabilities inside Home, not a fourth product. Signal remains the company,
brand, and outcome the system produces.

## Core navigation amendment · 2026-09-23

The signed-in primary navigation follows the work people do: **Home, Projects,
Tasks, Timeline**, in that order. Home orients the person; Projects, Tasks and
Timeline form the core work path. Projects is the explicit place to understand
and choose a project, not a fourth product. Notes is a private tool under
**More** with the existing work and account utilities. Moving Notes out of the
primary row changes its placement, not its privacy, canonical route, or the
deliberate Notes-to-Tasks handoff.

The same four destinations apply to the shared desktop and phone navigation,
the Tasks runtime, and the standalone Tasks Floor. A contextual link may carry
an authorized Project in its URL, but only an explicit Project selection may
change the person's active Project preference. A first-time person with no
Project gets a setup path; an unavailable Project link keeps its own error
state. This follows `contextual-links-are-navigation` rather than weakening it.

This is the approved navigation direction. [App PR 183](https://github.com/ethanmcn2013-droid/app/pull/183)
at `bd805961` was independently reviewed and received by the integration
candidate, now at `07ffb173`; that candidate has not been merged to App main
or deployed to production. Controlled isolated Preview journeys subsequently
covered real-account Project selection and core routing, while local and
deployed checks covered desktop, phone, More and keyboard return. These are
candidate and Preview receipts, not a production release claim.

## Canonical routes

- Private Notes tool: `/app/notes`.
- Core work routes: `/app/tasks`, `/app/timeline`.
- Home: `/app/home`.
- Projects: `/app/project` (a work context, not a product).
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
