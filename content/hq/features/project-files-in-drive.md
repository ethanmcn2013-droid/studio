---
id: project-files-in-drive
title: Project files in the storage owner's Google Drive
product: tasks
status: In Progress
lastVerified: 2026-09-23
---

# Project files in the storage owner's Google Drive

A Project can name a **storage owner**: a member who connects Google Drive.
Signal Studio creates a Project folder inside that person's private `Signal
Studio` root and grants the Project's other members access to that folder. The
storage owner's credential writes the files; members do not each connect Drive.
Signal Studio keeps resource records and access relationships, while Google
holds the Drive file bytes. The connection requests only `drive.file`.

The founder-only candidate was App source
`b164100a19880cb8ab1b9461bc6c4031c9aede5b`; independent receiving review
accepted it for that candidate scope. At the 20:19 UTC checkpoint on 23
September, production had resumed on App
main `c0573fdbcb6e8eb938f6754143c57d289eeb3ccd`, deployment
`dpl_51aShrWTDHpVxNxBkGza1VSHWeC5`. The current checkpoint is the same App
source on deployment `dpl_3r7x5j88kecBCATCUTGzr9biPPzR` (20:55 UTC, 23
September). All six production aliases resolve to the current deployment;
three intended scheduled jobs are enabled. The protection inventory covers
25 hosts in total (six aliases and 19 generated hosts) and records 50 path
observations with no network errors.
Notes migration `0001`, Timeline adoption `0001`, and Tasks migrations
`0028`–`0038` are applied and current; original rows were preserved, integrity
and foreign-key checks passed, and a second migration run was a no-op. The
founder's existing Tasks board and four Timeline milestones were read after
resumption.

Production Drive is activated for bounded founder-controlled internal use.
The founder completed
the narrow `drive.file` consent and canonical callback, connected the account,
confirmed Project-folder setup while preserving the existing native file, and
verified exact downloaded bytes for an 88-byte native fallback file and an
87-byte Google Drive file on the prior dpl51 checkpoint; no fresh member Drive
read is claimed for dpl3r7. A delayed download event was reconciled without a
second upload. Earlier dpl51 checks covered the initial Clerk signup
restriction, the private App gate for a registered but unlisted user, and
refusal of a wrong-account Project invitation; a limited test invitation was
issued. A controlled second actor registered,
verified Google, and accepted a canary Project invitation. On dpl3r7, the
founder and that controlled actor exchanged messages in a Task Discussion and
Project room; the founder opened the exact new task comment from Inbox and
sent a room reply. This is a controlled two-account
production observation, not a wider-user study. The uploader avatar displayed
“Someone” on both files; this is an unresolved UI label observation, not
evidence about identity or access authority. Controlled production reconnect,
restore, and owner-handover checks have since been reported; final membership
removal and lifecycle closeout remain pending the detailed receiving record.
Public launch is not claimed;
direct messages, external delivery, and the four repair-only flags remain off.
A real next-day/24–48-hour elapsed-use observation is still outstanding.
Production receiving evidence is archived in workspace commit
`de6f6fe5b85c5578f00dd5386be1f41fe0f2323c`.

## What Preview has proved

Controlled owner and member accounts connected Drive, received exact named-user
folder access, uploaded and opened files, and kept each personal root private.
The lifecycle included provider-confirmed disconnect, same-account reconnect
and explicit restore, member removal with Google and App refusal, member return,
promotion and a storage-owner handover. At b164, a 150-byte upload and a
supported 50 MiB upload both completed after ambiguous browser acknowledgments
through the same saved claim. The 50 MiB upload used resumable chunks, not one
PUT. A source-pinned, read-only Google GET/Tasks SELECT receipt verified both
new bodies by SHA-256, their owner/folder/generation, and unchanged historical
rows.

The controlled Project was then deleted through the App. Exact reconciliation
found six Drive files still present with their expected contents, both folders
retained with owner-only ACLs, and personal roots still unshared. Project-scoped
rows and grants were gone; the native 104-byte private Blob cleanup receipt was
consumed and the Blob was no longer readable. Both users' Google connection
records remained. Five files were checked against previously recorded SHA-256
values; the historical 50 MiB file was checked against its previously pinned
Google MD5, with a fresh SHA-256 recorded as a new observation. This is the
bounded #32 cleanup acceptance on isolated Preview, not production or
human-study proof.

The browser sends configured Drive and Signal-native Blob bytes directly to
storage; application functions handle bounded metadata. The product's current
upload ceiling is 50 MiB, displayed as 50 MB. It is a limit, not a promise of
unlimited Drive storage or of Google's maximum file size. Files count against
the named storage owner's Google quota. Signal-native storage remains the
fallback when Drive is unavailable before delegation; an uncertain Drive claim
stays pending for reconciliation rather than silently creating a second copy.

## Custody and limits

The storage owner can see Project files and bears the Google quota. Losing
access, disconnecting or handing over requires explicit status and repair; an
owner change does not move historical Google files into the successor's Drive.
Signal Studio must preserve the old generation's resource identity and grants
until exact cleanup is authorized and proved. The feature is intended for
founder-only internal use at this checkpoint. No customer-wide availability,
unlimited capacity, or physical-phone acceptance is claimed here. Production
migrations are current, but this does not establish member Drive access, a
complete production lifecycle, or elapsed-use evidence.

## Related

- App source: `docs/projects/project-drive/` and PR #182.
- Founder decision: `content/hq/decisions/project-files-in-drive-2026-08-27.md`.
- Delivery tracker: private workspace issue #32 is Done; production cutover is
  separate issue #23, and elapsed-use observation is #24.
