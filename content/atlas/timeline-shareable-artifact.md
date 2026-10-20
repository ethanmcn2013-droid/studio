---
title: Timeline shareable artifact
slug: timeline-shareable-artifact
lens: Data Flows
owner: Ethan
lastVerified: 2026-10-20
links: [five-products-as-a-system, turso-databases-and-reads, pricing-and-entitlements]
tags: [Timeline, publication, link-only, share token, qualified view, privacy, unified app, Master 3, guest follow, reminders]
references: [app/src/modules/timeline, app/src/app/s, app/drizzle-timeline/migration-ledger.json, app/drizzle-timeline/0002_master3_presentation.sql, app/src/modules/timeline/server/db/timeline-schema.ts, app/src/modules/timeline/server/guest-http.ts, app/src/modules/timeline/server/guest-notifications.ts, app/vercel.json, docs/architecture/ADR-006-planning-periods-and-audience-publication.md, content/hq/decisions/timeline-option-d-selected-2026-07-22.md]
summary: Frozen Timeline publications keep private work out; the merged Master 3 presentation and guest-follow implementation await production migration and deployment.
status: live
pinned: false
execWhat: Owners share selected project dates on a standalone page. The new countdown and guest-follow implementation is merged, with production receiving still pending.
execMatters: This is the suite's clearest travelling object. A couple, planner, client, friend, or colleague can see progress and the next milestone without joining the private workspace.
execRisk: The share link is a bearer secret. A weak projection can leak private work, and a request-based counter can overstate interest or retain unnecessary viewer data.
---

## WHAT

The artifact is a frozen, allowlisted publication of Timeline milestones.
The previously released artifact uses a horizontal date-scaled line. The
merged Master 3 replacement uses a countdown, ordered milestone sequence,
Coming up rows and a phone list, with real projected dates and separate
completion facts. A date passing does not complete an unfinished Task.
Master 3 migration and production deployment remain pending. Only the
link-only public route may record a qualified view; private owner preview
does not publish or offer guest services.

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
  App `drizzle-timeline/migration-ledger.json`, with database ledger
  `signal_timeline_schema_migrations`; the schema lives in App
  `src/modules/timeline/server/db/timeline-schema.ts`.
- Guest HTTP and worker composition: App
  `src/modules/timeline/server/guest-http.ts` and `guest-notifications.ts`.
- Source schedule: App `vercel.json`, `/api/timeline/reminders` every five
  minutes (`*/5 * * * *` UTC), authenticated with `CRON_SECRET` bearer.
  Deployment and scheduled execution of this new route are not yet received.

## HOW

1. The owner publishes a server-generated allowlist. Private Notes, Tasks,
   descriptions, comments, files, and Membership data are excluded by
   construction.
2. The server stores only a hash of the high-entropy token. Rotation
   invalidates the old token; revocation stops access immediately.
3. The shared route renders without Clerk, the app rail, general page
   analytics, or third-party scripts. It sends noindex, noarchive, no-store,
   and no-referrer controls.
4. A pasted link unfurls as a data-free product image, carrying no names,
   dates, milestone titles or progress. The merged Master 3 source updates
   its presentation; it does not make the image a private-data preview.
   Metadata fetches never count as views.
5. The browser posts a viewing receipt only after the artifact remains visible
   for the qualification window. The server deduplicates the publication
   session and increments the aggregate once.
6. The owner route reads the aggregate and shows the production renderer at
   desktop and phone widths. It never fires the viewing receipt.
7. The merged `0002_master3_presentation` migration adds four tables:
   `timeline_project_presentation` holds private owner settings;
   `timeline_publication_presentation` holds frozen published settings;
   `timeline_guest_subscriptions` holds confirmation, unsubscribe and bounded
   Undo state; `timeline_guest_deliveries` is the durable notification outbox.
   The subscription's email address is private delivery data, never part of
   the public projection. This is the source schema, not a production apply.
8. Following requires explicit server confirmation. Signed personal view and
   unsubscribe links require `TIMELINE_FOLLOW_SIGNING_SECRET`; the source
   checks email, signing, scheduler and production rate-limit readiness.
   Naming the secret does not prove deployed configuration. Calendar links
   and downloads do not prove a guest saved a date.
9. The bearer-authenticated reminder worker cleans expired subscriptions,
   queues due reminders and claims pending outbox rows before physical send.
   It rechecks subscription and live-publication authority before sending,
   suppresses ineligible delivery and does not replay sending or unknown
   outcomes. Provider acceptance is not inbox delivery. None of these source
   behaviors establishes an observed production scheduler or email receipt.

## WHEN

Option D was selected on 22 July 2026. Timeline PR #28 applied the production
migration and Tasks PR #46 shipped the artifact and owner preview the same day.
The canonical owner entry was renamed to `/app/timeline` on 25 July 2026.

On 20 October 2026, [App PR #299](https://github.com/ethanmcn2013-droid/app/pull/299)
merged as `33a97e58eb2124745e635a6ce9b0d13c6e6b6350` (tree
`9530f2933974261f07c57dc30d18939198b97eb8`). Final PR Verify passed and
the normal Design capture recorded 204/204 cases. This qualifies the merged
source and rendered candidate, not production migration, deployment,
guest-email delivery or quality-council certification. The production runtime
checkpoint remains App `2afe37a44fb5d56d83c26dee318327a000d793f6`; Ping
private access is on and its current Timeline is unpublished. Migration
`0002_master3_presentation`, encrypted backup/restore custody and configured
runtime receiving remain pending in existing Delivery #111.

`lastVerified` records review of this merged source and its pending release
boundary. The live status above refers to the older published-artifact
capability; it does not label Master 3 live.

## WHY

Signal Timeline earns its place in the suite when the output travels. A
recipient should grasp how far the project has moved before reading labels,
then open milestones for the story. The line is therefore the product, not a
decorative chart inside a dashboard.
