---
id: project-files-in-drive-2026-08-27
title: Board files live in the board owner's Google Drive, and uploads go browser-to-storage
category: Product
date: 2026-08-27
status: Active
reviewDate: 2026-11-27
relatedObjects: [project-files-in-drive, drive-refresh-token-custody, tasks, Access]
---

## Decision

Two decisions taken the same day, one of which was not on the agenda.

**A board's files are stored in the board owner's Google Drive.** A member with
`manageProject` connects their Drive; we create one folder per board inside a
`Signal Studio` folder in their My Drive and share that folder — only that
folder — with that board's members. The scope requested is `drive.file` and
nothing else, permanently.

**Uploads no longer cross our servers.** The browser asks for a session scoped
to one destination, one size and one content type, sends the bytes directly to
the provider, and a finalize step verifies what actually landed.

## Why the first one, over the review's advice

The connected-storage review recommended using Drive for references only,
arguing that uploading project files into a personal Drive breaks collaboration
because Drive ownership is per-person while a board is shared. Sharing the
board's folder with the board's members resolves exactly that, and occasional
request-access friction is normal in this market rather than a product failure.
The review's verdict is superseded on this point; its map of the codebase
stands.

## Why the second one, which was found rather than planned

WP-0 was scoped to make four contradictory file-size numbers agree. There was a
fifth, and it bound: Vercel refuses any function request body over 4.5 MB
before the framework or our code sees it. Our four numbers were 8 MB, 50 MB,
10 MB and 50 MB — every one of them above the platform's line and therefore
unreachable. A 5 MB PDF could not be attached at all.

The cheap answer was to cap everything at 4 MB. Honest, half a day, no risk —
and it would have left the fallback path able to carry almost nothing, at a
moment when that fallback is the thing the whole Drive design leans on.

The chosen answer moves the bytes instead, and it is worth more than the file
size it buys: it is the same shape Drive needs one provider later. Server mints
a scoped session, browser sends bytes to the provider, server verifies at
finalize and treats the returned id as a claim rather than as evidence. That
pattern is now built and tested before the feature that depends on it exists.

## Consequences we accept

- Every file is owned by the storage owner and counts against their Drive. They
  can see everything anyone attaches to that board. If they leave, revoke, or
  fill their Drive, the board loses its store. All of this is stated on screen
  and the storage owner is named permanently.
- What we tell customers about where their files live changes, and account
  deletion is constrained: we can delete our rows, but not files that now
  belong to somebody else. Privacy wording is an open founder decision.
- We must hold a Google refresh token, in a repository that has never contained
  any cryptography. Tracked as `drive-refresh-token-custody`.
- Signal-native storage stays as a live fallback, not a legacy path. The
  feature must be switchable off at any moment without a customer losing a
  file.

## Reversible, and how

Members get Drive `writer` by default rather than `reader` — reversible but
user-visible, so it changes only with a founder decision. Widening the OAuth
scope beyond `drive.file` is not a decision an engineer may take at all; CI
fails on any other Drive scope string appearing in the tree.
