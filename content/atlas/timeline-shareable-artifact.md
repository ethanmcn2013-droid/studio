---
title: Timeline shareable artifact
slug: timeline-shareable-artifact
lens: Data Flows
owner: Ethan
lastVerified: 2026-08-02
links: [five-products-as-a-system, turso-databases-and-reads, pricing-and-entitlements]
tags: [Timeline, publication, link-only, share token, qualified view, privacy, unified app]
references: [../tasks/src/modules/timeline, ../tasks/src/app/s, ../roadmap/drizzle, docs/architecture/ADR-006-planning-periods-and-audience-publication.md, content/hq/decisions/timeline-option-d-selected-2026-07-22.md]
summary: Owners publish a frozen Timeline projection; anyone with its unguessable link sees the standalone artifact, while a privacy-minimised receipt records qualified views.
status: live
pinned: false
execWhat: Signal Timeline turns selected project milestones into one shareable horizontal line. The owner manages publication inside the unified app; the recipient gets a standalone page with no app rail or account requirement.
execMatters: This is the suite's clearest travelling object. A couple, planner, client, friend, or colleague can see progress and the next milestone without joining the private workspace.
execRisk: The share link is a bearer secret. A weak projection can leak private work, and a request-based counter can overstate interest or retain unnecessary viewer data.
---

## WHAT

The artifact is a frozen, allowlisted publication of Timeline milestones. It
renders as one horizontal, date-scaled line with completed distance,
milestone points, a Today dash, the next milestone, and a completion or
days-remaining lens. The same renderer appears in the owner studio and its
phone preview; only the link-only route may record a qualified view.

## WHO

The Workspace owner creates, rotates, revokes, and previews the publication. A
recipient is an audience viewer, not a Workspace Member, collaborator, or
editing guest. Possession of the unguessable link grants read-only access to
that publication and nothing else.

## WHERE

- Owner module: `app.signalstudio.ie/app/timeline`.
- Audience management: `app.signalstudio.ie/app/timeline/audience`.
- Shared artifact: `/s/<unguessable token>` outside the authenticated app
  shell.
- Branded compatibility edge: `timeline.signalstudio.ie/s/<token>`.
- Canonical publication schema: the Timeline migration ledger under
  `roadmap/drizzle/`, consumed by the Timeline module runtime inside Tasks.

## HOW

1. The owner publishes a server-generated allowlist. Private Notes, Tasks,
   descriptions, comments, files, and Membership data are excluded by
   construction.
2. The server stores only a hash of the high-entropy token. Rotation
   invalidates the old token; revocation stops access immediately.
3. The shared route renders without Clerk, the app rail, general page
   analytics, or third-party scripts. It sends noindex, noarchive, no-store,
   and no-referrer controls.
4. A pasted link unfurls as a data-free card. The image is the Timeline
   wordmark, the rail motif, and one indigo mark, identical for every
   publication and carrying no names, dates, milestone titles, or progress.
   Beside it the unfurl shows the publication label and a per-kind
   description. Metadata fetches never count as views.
5. The browser posts a viewing receipt only after the artifact remains visible
   for the qualification window. The server deduplicates the publication
   session and increments the aggregate once.
6. The owner route reads the aggregate and shows the production renderer at
   desktop and phone widths. It never fires the viewing receipt.

## WHEN

Option D was selected on 22 July 2026. Timeline PR #28 applied the production
migration and Tasks PR #46 shipped the artifact and owner preview the same day.
The canonical owner entry was renamed to `/app/timeline` on 25 July 2026.

The owner workflow is under a new local review pass. That work may improve how
owners switch projects, curate milestones, and reach sharing controls, but it
does not change the selected public artifact.

## WHY

Signal Timeline earns its place in the suite when the output travels. A
recipient should grasp how far the project has moved before reading labels,
then open milestones for the story. The line is therefore the product, not a
decorative chart inside a dashboard.
