---
title: Project files in Google Drive
slug: project-files-in-drive
lens: Data Flows
owner: Ethan
lastVerified: 2026-09-03
links: [turso-databases-and-reads, pricing-and-entitlements, five-products-as-a-system]
tags: [Google Drive, drive.file, Connections, storage owner, project files, grant repair, migrations 0028 0029]
references: [../app/docs/projects/project-drive, ../app/src/server/connections, ../app/src/app/api/connections/google, ../app/src/app/api/cron/project-drive-grant-repair, ../app/vercel.json, content/hq/features/project-files-in-drive.md, content/hq/decisions/project-files-in-drive-2026-08-27.md]
summary: A board keeps file metadata in Signal Studio while a named member's Google Drive owns the bytes and exact access grants.
status: partial
pinned: false
execWhat: A board can keep its files in a named member's Google Drive while every board member opens them from Signal Studio. The product records the relationship and access receipts; Google owns the bytes.
execMatters: Connected storage removes a growing storage-cost line and makes files useful without asking every member to connect an account.
execRisk: If ownership, permission repair or deletion ordering fails, people can lose access or retain access longer than intended; launch therefore remains gated on migrations, privacy wording and a selected interface.
---

## WHAT

Each board nominates one storage owner. Signal Studio creates or reuses an
app-marked `Signal Studio` root in that person's Drive, creates one child folder
for the board, and shares only that child with the board's members. Tasks keeps
file metadata, immutable account/folder generations and exact grant receipts;
Google Drive keeps the file bytes.

Signal-native Blob storage remains the fallback. Turning connected storage off
does not strand files that were already stored there.

## WHO

The storage owner connects Google and owns the Drive folder. A member with the
board's management capability can select or hand over storage ownership; other
members receive access without seeing Google's consent screen. Ethan owns the
production migrations, privacy promise and launch decision.

## WHERE

- Product: `app.signalstudio.ie`, with the customer surface named
  **Connections**.
- Implementation and durable status: app PR #165 and
  `app/docs/projects/project-drive/`.
- OAuth callback:
  `/api/connections/google/callback`, derived only from the exact configured
  deployment URI.
- Repair route: `/api/cron/project-drive-grant-repair`, once daily on Vercel
  Hobby.
- Data contract: Tasks migrations 0028 and 0029; neither is applied to
  production as of this verification.

## HOW

1. The member authorizes exactly Google's `drive.file` scope. Signal Studio
   stores only an encrypted refresh token and an immutable connection
   generation.
2. Folder setup commits a durable operation before crossing the provider
   boundary. Exact permission ids and account/folder generations become the
   receipts for grant, revoke, erasure and repair.
3. A browser requests a destination-bound resumable session and sends bytes
   directly to Google. Finalization verifies the provider result before local
   metadata is trusted.
4. Membership changes enqueue exact grants or revocations. Immediate dispatch
   handles the normal path; the daily count-only cron drains interrupted or
   due work in bounded batches.
5. Handover creates the replacement folder and full access coverage before the
   new generation can report active. Old access is then revoked from exact
   receipts.
6. Project deletion first records a durable intent, re-proves authority and
   state, revokes only named-user permissions, then deletes local rows. It
   never deletes provider-owned Drive files or folders.

## WHEN — current state

The real two-account Drive lifecycle passed on 2 September 2026: the member
opened the board folder and file, could not open the parent, and lost both
child links after the exact permission was revoked. On 3 September, the
feature branch contains the encrypted credential substrate, schema, connection
lifecycle, folder/grant execution, membership hooks, handover, direct uploads,
project/account deletion and independent repair workers for revocation, grant
creation, folder provision/rename and exact Signal-native byte cleanup.

The branch is still a draft release candidate. The four repair workers are
independently default-off and have not been authorized for launch. Migrations
0028 and 0029 have not been applied to production. The privacy policy has not
been changed. The Connections production UI awaits the founder's choice among
A · Custodian, B · Ledger and C · Threshold.

## WHY

Signal Studio should own the relationship, not an ever-growing file store.
Personal Drive makes that commercially useful only if the ownership truth is
never hidden: one named person owns and can see the files, access follows the
board through exact receipts, and deleting Signal Studio data must not destroy
someone else's provider-owned documents.
