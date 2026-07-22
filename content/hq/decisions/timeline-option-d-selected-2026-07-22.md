---
id: timeline-option-d-selected-2026-07-22
title: Select Option D as the production direction for Signal Timeline.
category: Product
date: 2026-07-22
status: Active
reviewDate: 2026-08-22
relatedObjects: [Signal Timeline, Timeline shareable artifact, Audience Timeline, Collaboration Loop]
---

## Decision

Select Option D as the production direction for Signal Timeline. The defining object is a horizontal, date-scaled milestone line that communicates progress at a glance. It replaces dashboard-shaped public presentation with one artifact designed to be opened, understood, and shared.

## Reason

The founder selected Option D after reviewing the four design-lab directions and then refined its contract directly: lowercase `timeline` wordmark, completion and days-remaining lenses, a precise Today dash between milestones, **Our next milestone** language, a link-only viewing boundary, qualified view count for the owner, and the same artifact shown inside a phone preview before sharing.

The decision preserves Signal Timeline's one job: show where a project is going and how close it is to the destination without asking a viewer to decode an operating screen.

## Surface contract

- Owner controls live inside the authenticated unified app at the Timeline module.
- The shared artifact lives outside the app shell and is reachable only through its unguessable link.
- Shared pages are not listed, indexed, added to a sitemap, or discoverable through a public directory.
- The viewer never sees the black product rail or owner controls.
- The owner phone preview uses the production artifact component and never increments the view count.

## Data contract

Completion is completed milestones divided by all non-cancelled milestones. It is never a confidence score. Days remaining is derived from the published primary date. The share payload is allowlisted server-side; private source records do not become public because the client hides them.

Qualified views belong to the publication, survive token rotation, and are counted through a privacy-minimised receipt. Raw bearer tokens, IP addresses, referrers, and user-agents are not stored for this metric.

## Alternatives considered

Options A, B, and C remain preserved as design-lab evidence. They each improved particular owner or editorial surfaces, but none made project completion as immediate as the selected line. A hybrid dashboard was rejected because the shareable artifact should have one visual idea, not several competing panels.

## Risks

Motion can become decoration, milestone density can weaken the line, and a naive request counter can misstate audience interest. Reduced-motion behavior, mobile overflow, keyboard navigation, qualification rules, deduplication, and release receipts are therefore part of the decision rather than follow-up polish.

## Release boundary

Selection is final. Production release is not yet claimed. The implementation, migration, compatibility redirect, and live receipts remain in progress as of this record.
