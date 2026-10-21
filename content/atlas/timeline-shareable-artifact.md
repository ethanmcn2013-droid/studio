---
title: Timeline shareable artifact
slug: timeline-shareable-artifact
lens: Data Flows
owner: Ethan
lastVerified: 2026-10-21
links: [five-products-as-a-system, turso-databases-and-reads, pricing-and-entitlements]
tags: [Timeline, publication, link-only, share token, qualified view, privacy, unified app, Master 3, guest follow, reminders]
references: [app/src/modules/timeline, app/src/app/s, app/drizzle-timeline/migration-ledger.json, app/drizzle-timeline/0002_master3_presentation.sql, app/src/modules/timeline/server/db/timeline-schema.ts, app/src/modules/timeline/server/guest-http.ts, app/src/modules/timeline/server/guest-notifications.ts, app/vercel.json, docs/architecture/ADR-006-planning-periods-and-audience-publication.md, content/hq/decisions/timeline-option-d-selected-2026-07-22.md]
summary: Frozen Timeline publications keep private work out; the merged Master 3 presentation and guest-follow implementation have received production migration and a controlled live owner/guest/self-email check.
status: live
pinned: false
execWhat: Owners share selected project dates on a standalone page. The new countdown is deployed, with one controlled Follow confirmation and Unfollow received.
execMatters: This is the suite's clearest travelling object. A couple, planner, client, friend, or colleague can see progress and the next milestone without joining the private workspace.
execRisk: The share link is a bearer secret. A weak projection can leak private work, and a request-based counter can overstate interest or retain unnecessary viewer data.
---

## WHAT

The artifact is a frozen, allowlisted publication of Timeline milestones.
The previously released artifact uses a horizontal date-scaled line. The
merged Master 3 replacement uses a countdown, ordered milestone sequence,
Coming up rows and a phone list, with real projected dates and separate
completion facts. A date passing does not complete an unfinished Task.
Master 3 migration and a controlled production owner/guest flow were received on 21 October. Only the
link-only public route may record a qualified view; private owner preview
does not publish or offer guest services.

## WHO

The Workspace owner creates, rotates, revokes, and previews the publication. A
recipient is an audience viewer, not a Workspace Member, collaborator, or
editing guest. Possession of the unguessable link grants read-only access to
that publication and nothing else.

## WHERE

- Owner entry: `app.signalstudio.ie/app/timeline`. With the portfolio enabled
  and available, the bare route or a workspace-only link shows All projects.
  Explicit Project or plan links open an existing authorized plan; otherwise
  the owner gets a creation empty state. Private current preview is separate
  and does not publish a Timeline.
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
- Source schedule: App `vercel.json`, `/api/timeline/reminders` daily at
  09:00 UTC (`0 9 * * *`), authenticated with `CRON_SECRET` bearer.
  The production schedule binding is received; an actual scheduled run and
  reminder delivery are not established.

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
   the public projection. Production apply was received on 21 October.
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

The current source schedules `/api/timeline/reminders` daily at 09:00 UTC
(`0 9 * * *`), authenticated with `CRON_SECRET` bearer. This is an admitted
temporary fallback for the private cohort on the existing hosting plan.
Each invocation attempts at most 20 globally due outbox rows, including rows
that become suppressed, failed or unknown; this is not 20 delivered messages.
Overflowing date reminders can expire and be suppressed. The schedule does
not promise prompt updates or coverage of every subscriber. Confirmation
email is sent synchronously by the Follow request. No five-minute schedule
or hosting purchase is part of this receiving.

## WHEN

Option D was selected on 22 July 2026. Timeline PR #28 applied the production
migration and Tasks PR #46 shipped the artifact and owner preview the same day.
The canonical owner entry was renamed to `/app/timeline` on 25 July 2026.

On 20 October 2026, [App PR #299](https://github.com/ethanmcn2013-droid/app/pull/299)
merged as `33a97e58eb2124745e635a6ce9b0d13c6e6b6350` (tree
`9530f2933974261f07c57dc30d18939198b97eb8`). Final PR Verify passed and
the normal Design capture recorded 204/204 cases. This qualifies the merged
source and rendered candidate, not production migration, deployment,
guest-email delivery or quality-council certification.

On 21 October, [production migration run 39578171064](https://github.com/ethanmcn2013-droid/app/actions/runs/39578171064)
applied `0002_master3_presentation` once from exact release
`cf6db6716df4a4db76cc8e8417a2d2b48aa14516`. The independently observed
production target hash matched. Encrypted backup artifact `12335715483` was
uploaded and acknowledged before apply. Restored-copy row/DDL, integrity and
foreign-key checks, rehearsal and its second no-op passed. Production
postchecks established the current ledger, the rehearsed schema fingerprint
and a second no-op. The backup remains encrypted; recovery still requires
the approved offline identity and restored-copy verification.

Combined App source `55772b2a9d968975f148f9dcf7b95c54d97ede9c` (tree
`080af0e3c4bc4991fc25dc8beafd3aeb52613f9b`) includes Home, Timeline and the
daily schedule fix. PR #301 head and merge checks passed. Final main Verify,
Design and drift subsequently passed; normal Design recorded 188/188 cases.

On 21 October, the canonical production deployment reached READY on exact
App source `55772b2a9d968975f148f9dcf7b95c54d97ede9c`. Provider receiving
confirmed the existing environment bindings and daily 09:00 UTC Timeline
schedule. The private owner preview rendered Master 3 and editable fields,
with privacy, social and location choices off by default. No original project
was edited. A disposable synthetic publication rendered the new guest
artifact. Exactly one approved self-test confirmation email arrived with
SPF, DKIM and DMARC passing; its confirmation link reached Following, and
the guest check showed the masked subscription and next date. Unfollow
completed. This is one controlled live flow, not scheduled reminder delivery,
all-subscriber coverage or wider programme acceptance.

The disposable publication's active links were all revoked; reopening the
guest address showed that the link had ended. Scoped read-only production
SQL confirmed the four new tables, one synthetic item, zero active test
links, one accepted confirmation send and a confirmed-then-unsubscribed
subscription. The original private project's active published-link count
remained zero. An unauthenticated reminder request returned 401. No second
email was sent. The existing archive UI is unreachable and deletion is
permanent, so the isolated synthetic project is retained privately with all
test links revoked and its follow unsubscribed.

The strict source-provenance failure remains recorded. A separately approved
source-equivalence exception covered 45 line-ending-only files and 312
generated extras, with no substantive changed or missing source; it does
not turn that strict failure into a pass. Generated evidence images
were not individually reviewed, and full deployment-lambda tracing was
unavailable. Clean-export custody remains a follow-up.

Remaining receiving stays in existing Delivery #111.

`lastVerified` records source, migration and the controlled live flow above.
The live status includes this bounded Master 3 receiving; it does not certify
reminder delivery, complete accessibility qualification or the wider programme.

## WHY

Signal Timeline earns its place in the suite when the output travels. A
recipient should grasp how far the project has moved before reading labels,
then open milestones for the story. The line is therefore the product, not a
decorative chart inside a dashboard.
