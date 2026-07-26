---
id: timeline-shareable-artifact
title: Signal Timeline shareable artifact
product: Signal Timeline
category: Core
status: Built
priority: High
effort: Large
impact: High
owner: Ethan
principleAlignment: 99
relatedCampaign: Founding Venue Programme
relatedMetric: Qualified Timeline views
---

## Current state

Option D is the selected and shipped public artifact. It renders one
horizontal, date-scaled line that makes completion legible before the viewer
reads copy. Milestones are points on the line. A separate Today dash shows the
current position between them. The primary readout can move between
completion and days remaining, and the next unfinished point is labelled
**Our next milestone**.

The owner works at `app.signalstudio.ie/app/timeline`. The recipient receives
an unguessable `/s/*` link without the app shell. Branded
`timeline.signalstudio.ie/s/*` links are preserved through the Studio
compatibility edge.

## Publication boundary

The share is a frozen, allowlisted projection. Private Notes, private Tasks,
internal descriptions, collaborators, comments, attachments, and unpublished
changes do not cross the boundary. Rotating or revoking the link invalidates
the old address. The response is noindex, noarchive, no-store, and no-referrer.

## View contract

A view means a qualified viewing session, not an HTTP request. The release
counts after the artifact remains visible for the qualification window,
deduplicates a publication within the session window, and stores only a
hashed receipt plus the publication aggregate. It does not retain the raw
share token, IP address, referrer, or user-agent.

## Release evidence

- Timeline PR #28: migration, adoption proof, backup, dry-run, production
  receipt, export, and erasure coverage.
- Tasks PR #46: artifact, owner studio, receipt qualification, 260 tests,
  six desktop/mobile browser checks, Axe, keyboard, privacy headers, and view
  isolation.
- Studio PR #90: exact branded wedding path repair and production smoke.

The owner-workspace redesign is a separate review track. It must preserve this
component and publication boundary.
