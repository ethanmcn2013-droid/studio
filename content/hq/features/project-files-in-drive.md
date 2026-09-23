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

The App implementation is in candidate `b164100a19880cb8ab1b9461bc6c4031c9aede5b`,
PR #182, with CI, Verify Tasks and Design quality checks passing. Isolated
Preview `dpl_DaKstaURXDtbYBZUTi27mwFn8DZc` is READY. **It is not a production
release.** Production still serves App `c65cb2d5` with Tasks schema through
`0027`; the eleven pending Tasks migrations and capability activation remain
release gates. Current delivery status and next proof are in private workspace
issue #32.

## What Preview has proved

Controlled, aligned owner and member accounts connected Drive, received exact
named-user folder access, uploaded and opened files, and kept the parent root
private. The lifecycle included provider-confirmed disconnect, same-account
reconnect and explicit restore, member removal with both Google and App refusal,
member return, promotion and an explicit storage-owner handover. A post-handover
database and direct Google read at source `96df1e1c` proved the four existing
resource identities, historical folder and grants survived; one new active
generation belonged to the successor. These were isolated Preview checks with
controlled accounts, not production or human-study proof.

Candidate `b164100a` adds one same-claim server check when the browser loses
Google's final upload acknowledgment. A controlled 150-byte upload completed
in Preview without a manual retry or second data PUT. The separate 50 MiB
candidate upload and exact provider-byte verification remain open. Historical
50 MiB provider evidence predates this acknowledgment correction and does not
substitute for that receiving check. Project deletion and eventual release are
separate gates.

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
- Delivery tracker: private workspace issue #32; production cutover is separate
  issue #23.
