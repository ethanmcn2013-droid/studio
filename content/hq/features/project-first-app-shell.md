---
id: project-first-app-shell
title: Project-first app shell and tool navigation
product: Signal Studio (suite-wide)
category: Integration
status: In Progress
priority: High
effort: Large
impact: High
owner: Ethan
relatedCampaign: None assigned
relatedMetric: Not assigned
---

## What it is

An App candidate that makes the signed-in shell a clear path into work: Home,
Analytics and Files lead; Projects, Tasks and Timeline sit together under
Workspace; and More groups existing tools with clearly marked future tools.
Project rows retain their existing project context and routes. This builds on
the navigation documented in the Atlas entry [Core navigation in the unified
app](../../atlas/unified-app-core-navigation.md) and the decision [Core work,
with the daily signal inside Home](../decisions/three-products-home.md).

The Wedding hub is a project finder for existing, authorized Wedding projects
and their available Guestlist. Seating and Budget remain marked as coming
soon. Development groups the existing Automations tool. Teacher and Student
entries make the planned tool paths visible without presenting unfinished
tools as working destinations. These are tools and groupings inside Signal
Studio, not new products.

More can be customized and its sections collapsed. More visibility choices
are saved in the current browser; they are not account-synced preferences.
Hiding an entry changes its navigation visibility, not its data. Hiding a
parent group preserves its child choices. Task discussions are absent from
the general chat list, but remain in their task context; nothing is deleted.

## Boundaries

- The candidate preserves existing Project membership and authorization. The
  Wedding finder uses the existing Wedding classification and member-visible
  Projects; it does not change eligibility or access rules.
- Project folders continue to follow the existing task/file model. This does
  not create a second Drive integration or alter the storage-owner contract in
  [Project files in the storage owner's Google Drive](project-files-in-drive.md).
- Self-chat remains private to its owner. Migration 43 was applied through the
  guarded encrypted-backup workflow on 15 October 2026. The new chat still
  needs application release and authenticated persistence verification.
- Physical-device dictation is unverified. Custom reports, an AI assistant,
  uploads, a complete Whiteboard, and Teacher or Student verticals are not
  delivered by this candidate.

## Current status

The candidate is App PR [#284](https://github.com/ethanmcn2013-droid/app/pull/284)
at source `7d3443db`. It is not live: merge to App main, deployment, and live
receiving have not been established here. The selected 17 outcomes and later
founder-approved sidebar refinements are part of this candidate's scope; this
record does not turn them into a release claim.

## Next proof

Complete revision-bound review and receiving for the exact candidate, then
verify the intended release and its live behavior before changing this record
to a shipped state. Keep the older core-navigation decision and the existing
Project Drive feature as their own records.
