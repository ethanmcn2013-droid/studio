---
id: consolidated-app-95-product-gate-2026-07-26
title: Hold every unified-app product to the 50-of-52 release gate
category: Product
date: 2026-07-26
status: Active
reviewDate: 2026-08-26
relatedObjects: [Signal Notes, Signal Tasks, Signal Timeline, Signal, Signal Experience Standard, app.signalstudio.ie]
---

## Decision

Signal Studio is one application at `app.signalstudio.ie`, with the fixed spine
`Notes -> Tasks -> Timeline -> Signal` and canonical entries `/app/notes`,
`/app/tasks`, `/app/timeline`, and `/app/signal`.

The current product-quality release requires every required
state-by-breakpoint council cell to score at least `50/52` across the canonical
13 dimensions, with no dimension below `3`. Cells and products are never
averaged together. Missing or stale evidence fails.

The accepted product directions are protected:

- Notes remains the private Hybrid capture notebook with exact,
  user-approved, idempotent Tasks extraction.
- Tasks remains the Hybrid execution workbench with one project truth across
  Board, List, Schedule, and Calendar.
- Timeline retains the selected Option D recipient artifact and frozen public
  DTO while the owner workflow frames the same artifact.
- Signal opens as the finite Quiet Briefing Ledger; progressive evidence depth
  remains subordinate and never becomes the default dashboard.

## Reason

Repository consolidation fixed the deployment model but left old route,
provider, review, and standalone-repository assumptions in the operating
record. A generic average could also let a strong desktop state hide a weak
mobile, empty, error, or restricted state. One current topology and one
fail-closed cell gate keep product quality, privacy, and release claims aligned.

## Release rule

Work follows the dependency sequence recorded in
`docs/experience/SUITE_95_PRODUCT_RELEASE_GATE.md`: route truth, shared frame,
fixture and calendar truth, Tasks, Notes, Timeline, Signal, then cohesion,
council, and release.

No score, deployment, provider journey, or product pass is asserted by this
decision. Evidence must be generated after the relevant source stabilizes and
must name any state, viewport, provider, or authenticated journey that was not
verified.

## Founder-only boundary

External account actions remain in the operator ledger. The current Google
provider matrix still requires the founder's independent-account sign-up,
sign-in, link, unlink, and attempted last-method-removal journey. GitHub and
Apple remain separate and disabled. Provider evidence may not be inferred from
source or dashboard configuration alone.

## Sources

- `docs/SUITE.md`
- `docs/architecture/SUITE_URL_AND_NAMING_CONTRACT.md`
- `docs/experience/SUITE_95_PRODUCT_RELEASE_GATE.md`
- `docs/shipped-state.md`
- `content/hq/operator-todos/premium-auth-providers.md`
- `content/hq/operator-todos/verify-clerk-prod-env.md`
