---
id: project-files-in-drive
title: Project files in the board owner's Google Drive
product: tasks
status: In Progress
lastVerified: 2026-08-27
---

# Project files in the board owner's Google Drive

A board nominates a **storage owner** — a member who connects their Google
Drive. Signal Studio creates one folder per board inside a `Signal Studio`
folder in their My Drive and shares *that folder only* with that board's
members. Every upload is written with the storage owner's credential, and the
browser sends the bytes straight to Google. Members never see a consent screen.
We hold the metadata and the relationship; Google holds the bytes.

Founder decision 2026-08-27. Plan, decisions and status live in the app repo at
`docs/projects/project-drive/`.

## Where it stands

| WP | Package | Status |
|---|---|---|
| 0 | Fix the floor | **Done** — app PR #159 |
| 1 | Spike the Drive chain | Blocked on Google Cloud credentials |
| 2–8 | Secrets, schema, connection, sharing, upload, surfaces, resilience | Not started |

## WP-0 found two things worth knowing outside the repo

**Settings was telling every customer that uploads did not work.** The line
"File uploads are not yet active on this workspace" rendered unconditionally,
with no demo-mode branch, above a usage bar that was quietly counting real
files. `BLOB_READ_WRITE_TOKEN` had been provisioned for twenty-four days.
Uploads worked the whole time. Anyone who read that panel and decided not to
try attaching a file was turned away by copy, not by a limit.

**The advertised file size was unreachable, and so were the other three.**
Vercel refuses any function request body over 4.5 MB before the framework sees
it. The app's own settings said 8 MB, 50 MB, 10 MB and 50 MB in four places;
all four sat above the platform's line. A 5 MB PDF could not be attached at
all, and failed with an error the app never saw.

Both are fixed. Uploads now go from the browser straight to storage, so 50 MB
is a number we can keep, and the four numbers derive from one constant that CI
will not let drift.

## What this changes commercially

- **Storage stops being a cost line that scales with customers.** Files sit in
  a member's own Drive and count against their quota, not ours.
- **The 50 MB ceiling disappears for Drive-backed boards** at WP-6. Against
  Drive's own documented 5 TB per-file maximum, "how big a file can I attach"
  stops being a question we have to answer.
- **It is a real reason to connect an account**, which is a different product
  posture from a tool that only holds its own data.

## What has to be said out loud, not buried

Files live in a named person's personal Drive. That person can see everything
anyone attaches to that board, the files count against their quota, and if they
leave or revoke, the board loses its store. The product states this on screen
and names the storage owner permanently; it is not a detail to discover later.

It also changes what we tell customers about where their files are, and it
constrains account deletion: we can delete our rows, but we must not delete
files that now belong to somebody else. Founder decisions, tracked as Q6 in the
project's status board.

## Related

- Decision: `content/hq/decisions/project-files-in-drive-2026-08-27.md`
- Risk: `content/hq/risks/drive-refresh-token-custody.md`
- App dispatch: T·153, 2026-08-27
