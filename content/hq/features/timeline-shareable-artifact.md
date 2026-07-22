---
id: timeline-shareable-artifact
title: Signal Timeline shareable artifact
product: Signal Timeline
category: Core
status: In Progress
priority: High
effort: Large
impact: High
owner: Ethan
principleAlignment: 99
relatedCampaign: Founding Venue Programme
relatedMetric: Qualified Timeline views
---

## Current state

Option D is the selected production direction. It is being implemented in the unified app as one horizontal, date-scaled line that makes completion legible before the viewer reads any copy. Milestones are points on the line. A separate Today dash shows the exact current position between them. The primary readout can move between completion and days remaining, and the next unfinished point is labelled **Our next milestone**.

This record does not claim a production release. The owner route, link-only artifact route, qualified-view receipt migration, compatibility redirect, and live verification are still in the release pass. Deployment URL, source revision, migration receipt, and post-release browser evidence remain pending.

## Two surfaces, one artifact

- The owner works inside the authenticated Signal Studio app and sees publishing controls, link management, qualified view count, and a real phone-width preview.
- A person with the unguessable share link sees only the Timeline artifact. There is no operating rail, account shell, product dashboard, public directory, or search-discoverable page.
- The desktop artifact and owner phone preview render the same Timeline component from the same publication data. The preview never records a view.

## Publication boundary

The share is a frozen, allowlisted projection. Private Notes, private Tasks, internal descriptions, collaborators, comments, attachments, and unpublished changes do not cross the boundary. Rotating or revoking the link invalidates the old address. Search engines are told not to index or archive the page, and the response does not send the bearer link through referral or general page analytics.

## View contract

A view means a real viewing session, not an HTTP request. The release design counts after the artifact has remained visible for the qualification window, deduplicates a publication within the session window, and stores only a hashed receipt plus the publication aggregate. It does not retain the raw share token, IP address, referrer, or user-agent. Metadata fetches, prefetches, owner previews, reload storms, and obvious automated requests must not inflate the owner number.

## Future story layer

Milestone photos are a recorded next state, not part of this release. An owner will be able to add a moment to a milestone, such as a venue-visit photo, so the Timeline can become a lasting story after the project ends. The future design must preserve explicit publication, consent, deletion, export, retention, and storage-cost boundaries before image upload is enabled.

## Release gate

Mark this feature Shipped only after the production migration has a backup and dry-run receipt, owner and anonymous journeys pass, link rotation and revocation are proven, the qualified count survives refresh and blocks duplicate sessions as designed, privacy headers are verified, and desktop plus phone evidence shows the artifact without the app rail.
