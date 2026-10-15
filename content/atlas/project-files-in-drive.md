---
title: Project files in the storage owner's Google Drive
slug: project-files-in-drive
lens: Data Flows
owner: Ethan
lastVerified: 2026-10-15
links: [turso-databases-and-reads, app-backend-reliability-and-signal-reads]
tags: [App, Tasks, Google Drive, files, authorization, custody, recovery]
references: [app/src/server/connections/drive-connections.ts, app/src/server/connections/drive-grants.ts, app/src/server/connections/drive-uploads.ts, app/src/server/crypto/secret-box.ts, content/hq/features/project-files-in-drive.md, content/hq/risks/drive-refresh-token-custody.md]
summary: "Google holds Drive file bytes under the named storage owner; Signal keeps resource and access records. Source controls and bounded accepted lifecycle receipts do not establish wider release or today's live provider state."
status: partial
pinned: false
execWhat: A Project's storage owner connects Google Drive. Members use the Project folder without each connecting their own Drive.
execMatters: People can work with shared Project files while the owner keeps the files in their own Google account and bears its storage quota.
execRisk: A durable Google credential needs protected keys and truthful revocation status. Owner changes do not move historical files; uncertain operations need reconciliation.
---

## What moves where

A Project names a storage owner who connects Google Drive. Signal creates the
Project folder under that person's private Signal Studio root and grants
named Project members access. The owner's credential writes the files; members
do not each connect Drive. Google holds the file bytes. Signal's Tasks store
keeps resource identity, folder/account generations, access relationships and
operation state. The browser sends configured Drive or Signal-native Blob
bytes directly to storage; application functions handle bounded metadata.

The requested OAuth scope is exactly `drive.file`. That scope does not replace
Signal's Project authorization, exact-folder checks or named-user permissions.
The documented upload ceiling is 50 MiB, displayed as 50 MB; it does not promise
unlimited storage. Drive files count against their named owner's Google quota.
An uncertain delegated upload stays pending for reconciliation rather than
silently producing another copy. Signal-native storage is the fallback before
Drive delegation.

## Source ownership and credential lifecycle

Source was inspected at App
[`380ab1c7c999dc014a8101b8a466a610712d1f92`](https://github.com/ethanmcn2013-droid/app/tree/380ab1c7c999dc014a8101b8a466a610712d1f92).
`src/server/connections/drive-connections.ts` owns connection generations,
summary and personal disconnect; `drive-grants.ts` and `drive-uploads.ts`
handle their respective provider operations. `crypto/secret-box.ts` seals
refresh tokens with versioned, context-bound AES-256-GCM envelopes; access
tokens are minted per request. Source inspection is not a fresh deployment,
key rotation or recovery attestation.

Disconnect retires local use and separately records provider revocation.
Current source preserves pending requests across reload, fences reconnect
while pending and retries the same generation. Missing keys or provider
failure remain unconfirmed. The earlier PR178 finding at `27af50c0`—where a
fresh disconnected status lost this distinction—is retained as historical
evidence, with the current source repair described in the
[custody risk](/hq/risks/drive-refresh-token-custody).

A storage-owner handover changes future storage; it does not move historical
Google files into the successor's account. Old file identity, account
generation and grants need their own authorized cleanup. Project deletion
and personal Google disconnect are different operations: accepted scoped
Project cleanup retained Drive files while removing Project grants.

## Accepted evidence and its boundary

Private Delivery [issue32's accepted receipt](https://github.com/ethanmcn2013-droid/signal-studio-workspace/issues/32#issuecomment-5800113552)
records the controlled founder-only Preview at App
`b164100a19880cb8ab1b9461bc6c4031c9aede5b`, deployment
`dpl_DaKstaURXDtbYBZUTi27mwFn8DZc`. It covers two-account lifecycle,
ambiguous-upload confirmation and scoped Project cleanup. Six Drive files
were retained with content checks, folders became owner-only, Project
rows/grants were removed and the private native Blob became unreadable.
Earlier steps keep their original source labels; this receipt did not
activate production Drive.

The existing [feature record](/hq/features/project-files-in-drive) separately
records later bounded founder-controlled production consent, exact file-byte
checks, reconnect/restore, handover and member-removal observations, with
migrations through `0038`. Receiving evidence is preserved in private workspace
commit `de6f6fe5b85c5578f00dd5386be1f41fe0f2323c` and
`docs/execution/production-sprint-2026-09/timeline-context-release-06dace/`.
These are historical accepted observations, not a claim that their named
deployment remains current today.

The system record remains partial: no new provider session, live revocation,
key/restore exercise, wider-user or physical-phone acceptance was performed
for this update. Real elapsed-use evidence remains distinct from fixtures and
source tests. Notes calendar-token exposure remains separate in the custody
risk. Delivery owns current priority, release authority and next proof; this
Atlas entry adds context and changes no release hold or provider setting.
