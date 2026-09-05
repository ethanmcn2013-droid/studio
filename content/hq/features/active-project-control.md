---
id: active-project-control
title: Active Project control — the project you are in, in the permanent chrome
product: Signal Studio (suite-wide)
category: Foundation
status: Built
priority: High
effort: Large
impact: High
owner: Ethan
principleAlignment: 96
relatedCampaign: Founder LinkedIn Build-in-Public
relatedMetric: Cross-product orientation — can someone in Notes say which project they are in
---

## What it is

The project you are working in now has a permanent home in the Studio Bar's centre run —
the same place on every product, at every moment, including while the canvas underneath
is loading, empty or in error. Clicking it opens the list of your projects. On a phone it
reflows into a sticky strip beneath the bar and opens a bottom sheet reachable with a
thumb.

Selected live by the founder on 17 August as variant A of five studied in the WP5 lab.
The argument for it is constancy: you never look for it.

## Why it mattered

Project switching lived in the Tasks sidebar and the command palette — both inside one
product. Someone working in Notes had no way to see which project they were in, let alone
change it. Timeline had its own switcher with different behaviour. Home had none.

## What is careful about it

- **It asks before it can lose work.** The switch consults the surfaces you are in for
  unsaved-work claims and holds if any answer yes — an unsaved note is enough to stop it.
  The old browser-close warning never covered in-app navigation, so this closes a
  silent draft-loss gap rather than only adding a new control.
- **It never names a project it has not verified.** Until the server confirms which
  project this route resolved to, the control holds a fixed-width placeholder rather than
  painting a remembered value. A remembered cookie is not a project name.
- **Two projects with the same name stay listed and refuse selection**, saying why, rather
  than the app quietly picking one.
- **An archived project is intended to open read-only through its URL**, never
  through the switch. January acceptance must reconcile remaining task-action
  archive compatibility before treating that policy as universally enforced.

## Status

**Built, not shipped** — the collection's status set has no value for "behind a
flag", and extending a frozen set for one record is not worth it. The distinction is
here instead: built, tested and merged behind `SIGNAL_ACTIVE_PROJECT_V3_ENABLED`, which is off. Four
lanes shipped across 17 August: the guarded transition, the runtime boundary move, the
consolidated project service, and the chrome itself.

Building the chrome uncovered a platform gap worth recording: the route-snapshot publisher
had shipped in an earlier wave and was mounted by nothing, so the control could never have
left its placeholder. Both halves of that defect are fixed — the resolver now carries the
authorized project summary it had been discarding, and the snapshot is keyed by the route
rather than by the resolved project, so a bare entry can verify at all.

## January follow-up — 5 September 2026

Project continuity is now an active January workstream. The receiving App includes
independently verified Notes recovery and navigation-context repairs and exact Home
task destinations. Home remains an aggregate front door; its observations lead to
the owning object rather than implying that every observation belongs to one project.

The combined candidate repairs direct task/archive arrivals, project-specific room
content, route snapshot matching and realtime reconciliation. These are internal
candidate results, not a deployed rollout or full journey verdict. Final browser,
independent and receiving acceptance remain open. Exact scenarios and revisions
live in `docs/execution/january-2027/ACCEPTANCE.md`.
