---
title: Timeline shareable artifact
slug: timeline-shareable-artifact
lens: Data Flows
owner: Ethan
lastVerified: 2026-07-22
links: [five-products-as-a-system, turso-databases-and-reads, pricing-and-entitlements]
tags: [Timeline, publication, link-only, share token, qualified view, privacy, unified app]
references: [../tasks/src/modules/timeline, ../tasks/src/app/s, ../roadmap/drizzle, docs/architecture/ADR-006-planning-periods-and-audience-publication.md, content/hq/decisions/timeline-option-d-selected-2026-07-22.md]
summary: Owners publish a frozen Timeline projection; anyone with its unguessable link sees the standalone artifact, while a privacy-minimised receipt records qualified views.
status: partial
pinned: false
execWhat: Signal Timeline turns selected project milestones into one shareable horizontal line. The owner manages the publication inside the unified app; the recipient gets a standalone page with no app rail or account requirement.
execMatters: This is the suite's clearest travelling object. A couple, planner, client, friend, or colleague can see progress and the next milestone without joining the private workspace.
execRisk: The share link is a bearer secret. A weak projection can leak private work, and a request-based counter can overstate interest or retain unnecessary viewer data.
---

## WHAT

The artifact is a frozen, allowlisted publication of Timeline milestones. It renders as one horizontal, date-scaled line with completed distance, milestone points, a Today dash, the next milestone, and a completion or days-remaining lens. The same renderer appears in the owner studio and its phone preview; only the link-only route may record a qualified view.

## WHO

The Workspace owner creates, rotates, revokes, and previews the publication. A recipient is an audience viewer, not a Workspace Member, collaborator, or editing guest. Possession of the unguessable link grants read-only access to that publication and nothing else.

## WHERE

- Owner module: `app.signalstudio.ie/app/plan` and its audience publication routes in the unified app.
- Shared artifact: `/s/<unguessable token>` outside the authenticated app shell.
- Compatibility edge: `timeline.signalstudio.ie/s/<token>` forwards to the unified app artifact without exposing an index or directory.
- Canonical Timeline publication schema: the Timeline migration ledger under `roadmap/drizzle/`, mirrored by the Timeline module runtime inside Tasks.

The final production URL, source revision, migration receipt, and live smoke receipt are pending until this release completes.

## HOW

1. The owner selects milestone content and publishes a server-generated allowlist. Private Notes, Tasks, descriptions, comments, files, and Membership data are excluded by construction.
2. The server stores only a hash of the high-entropy token. A lookup hashes the presented token and resolves an active publication. Rotation invalidates the old token; revocation stops access immediately.
3. The shared route renders without Clerk, the app rail, general page analytics, or third-party scripts. It sends noindex, noarchive, no-store, and no-referrer controls.
4. The browser posts a viewing receipt only after the artifact remains visible for the qualification window. The server validates the request, deduplicates the publication session, and increments the publication aggregate once.
5. The owner route reads the aggregate and shows the production renderer at desktop and phone widths. It never fires the viewing receipt.

## WHEN — current state

Option D was selected on 2026-07-22. Production implementation is in progress in an isolated branch across the unified app, the canonical Timeline migration ledger, and the Studio compatibility edge. The former public-by-slug Timeline model is historical and does not satisfy this contract. Do not describe the new artifact as deployed until migration, release, and browser receipts are attached.

Milestone photo memories are a future extension. They require a separate consent, upload, retention, export, deletion, and cost design before implementation.

## WHY

Signal Timeline earns its place in the suite when the output travels. A recipient should grasp how far the project has moved before reading labels, then open milestones for the story. The line is therefore the product, not a decorative chart inside a dashboard.

The link-only boundary is deliberate. It gives the owner a useful page to send without creating an indexed public profile or asking every recipient to make an account. Qualified, privacy-minimised views give the owner evidence that the artifact was seen without turning a personal planning page into surveillance.
