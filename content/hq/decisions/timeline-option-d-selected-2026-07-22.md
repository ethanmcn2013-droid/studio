---
id: timeline-option-d-selected-2026-07-22
title: Select Option D as the production direction for the public Signal Timeline artifact.
category: Product
date: 2026-07-22
status: Active
reviewDate: 2026-08-22
relatedObjects: [Signal Timeline, Timeline shareable artifact, Audience Timeline, Collaboration Loop]
---

## Decision

Option D is the production direction for the public Signal Timeline artifact.
Its defining object is a horizontal, date-scaled milestone line that
communicates progress at a glance. It replaces dashboard-shaped public
presentation with one artifact designed to be opened, understood, and shared.

This decision is about the recipient artifact. The authenticated owner
workflow remains a separate product surface and may continue to improve
without redesigning the selected artifact.

## Reason

The founder selected Option D after reviewing the design directions and then
refined its contract directly: lowercase `timeline` wordmark, completion and
days-remaining lenses, a precise Today dash between milestones, **Our next
milestone** language, a link-only viewing boundary, qualified view count for
the owner, and the same artifact shown inside a phone preview before sharing.

## Surface contract

- Owner controls live inside the unified app at
  `app.signalstudio.ie/app/timeline`.
- The shared artifact lives outside the app shell at an unguessable `/s/*`
  link.
- `timeline.signalstudio.ie/s/*` remains the branded public compatibility
  origin while the unified app serves the artifact.
- Shared pages are not listed, indexed, added to a sitemap, or discoverable
  through a public directory.
- The viewer never sees the product rail or owner controls.
- The owner phone preview uses the production artifact component and never
  increments the view count.

## Data contract

Completion is completed milestones divided by all non-cancelled milestones.
It is never a confidence score. Days remaining is derived from the published
primary date. The share payload is allowlisted server-side; private source
records do not become public because the client hides them.

Qualified views belong to the publication, survive token rotation, and are
counted through a privacy-minimised receipt. Raw bearer tokens, IP addresses,
referrers, and user-agents are not stored for this metric.

## Release record

- Timeline PR
  [#28](https://github.com/ethanmcn2013-droid/timeline/pull/28) applied the
  qualified-view migration and recorded the production receipt.
- Tasks PR
  [#46](https://github.com/ethanmcn2013-droid/tasks/pull/46) shipped the
  artifact, owner preview, view qualification, privacy boundary, and browser
  evidence.
- The Studio compatibility edge preserves branded `/s/*` and
  `/the-wedding` paths while the unified app serves the artifact.

The public artifact is selected and shipped. The owner experience is being
reviewed independently; that review must not reopen or dilute this artifact
contract.

## Future story layer

Milestone photos are a recorded next state, not part of this release. They
require explicit publication, consent, deletion, export, retention, and
storage-cost boundaries before image upload is enabled.
