---
id: local-business-monthly-rhythm
title: Local business monthly rhythm workspace
targetSegment: Small-business operators (café, dental practice, local florist, salon)
status: Built
includedProducts: [Tasks, Notes, Timeline, Signal]
landingPageUrl: ""
relatedCampaign: TBD
activationGoal: Operator runs one real month through the workspace.
---

## Use Case

Four lanes — invoices, orders, admin, marketing — the actual monthly job of a small operator.

## Notes

Anchor template #5. Swapped from `small-business-marketing-month` 2026-05-12 — marketing-month is project-manager voice (category claim); monthly-rhythm is operator-real. The canonical four-layer source artefact is retained in Studio Git at revision `ed02bc831894eb93b36f69f5b820a4727a9e2bb3`, path `src/lib/templates/local-business-monthly-rhythm/` (18 task seeds plus Notes, Timeline and Signal hints). That directory is absent from current Studio source. App `pnpm sync:templates` reads the pinned historical revision to produce its committed Tasks and Timeline slices; the current Add project control applies only the Tasks starter.

The September App candidate offers **Start with Monthly business rhythm** inside Add project. It creates a separate, owned Project with 18 Tasks; dates remain unset for the person to choose. An uncertain reply retains the same request so retry opens the same Project. This control does not create Notes, Timeline or Signal content, publish a share, or invite anyone. Controlled authenticated Preview receiving on 23 September created exactly one owned Project with 18 undated Tasks, recovered a hidden committed reply through the same request, and reopened a seeded Task in a fresh phone-sized session. A separately reviewed deletion journey then removed that disposable Project. The mobile Project drawer entry is repaired in candidate `07ffb173`: authenticated 390px receiving passed Tasks to Projects to the drawer and monthly choice, with Escape restoring focus and no second creation submitted. Production release remains pending. The former `/templates` marketing card was retired with the public estate; there is no current public landing page for this pack.
