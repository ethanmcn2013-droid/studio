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
accepted it for #22. Production has since resumed on App main
`c0573fdbcb6e8eb938f6754143c57d289eeb3ccd`, deployment
`dpl_65msoCrXoErhwZRMr47cfn9ekTSb`, at 19:43:45 UTC on 23 September. All six
production aliases resolve to that deployment. Notes migration `0001`, Timeline
adoption `0001`, and Tasks migrations `0028`–`0038` are applied and current;
original rows were preserved, integrity and foreign-key checks passed, and a
second migration run was a no-op. The founder's existing Tasks board and four
Timeline milestones were read in the resumed production app. This does not
mean Drive is enabled: Drive and conversations remain off while provider keys
and runtime activation are outstanding. Issue #23 remains In Progress (10 of
12 accepted packets); #24 still needs a real next-day/24–48-hour observation.
Issue #32, the bounded Drive lifecycle and cleanup acceptance, is Done, but
does not close those remaining release gates.

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
unlimited capacity, production migration or physical-phone acceptance is
claimed here.

## Related

- App source: `docs/projects/project-drive/` and PR #182.
- Founder decision: `content/hq/decisions/project-files-in-drive-2026-08-27.md`.
- Delivery tracker: private workspace issue #32 is Done; production cutover is
  separate issue #23, and elapsed-use observation is #24.
