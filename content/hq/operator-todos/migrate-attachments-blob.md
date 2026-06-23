---
id: migrate-attachments-blob
title: Provision Vercel Blob for Tasks attachments (local FS is ephemeral)
status: open
priority: P0
blocking: true
phase: Phase 1
why: Tasks writes uploaded files to the local filesystem (.data/uploads) — ephemeral and per-instance on Vercel serverless, so uploads vanish or 404 on the next request. The feature is broken in prod.
href: /hq/health
date: 2026-06-23
---

## Context

`tasks/src/server/actions/attachments.ts` writes bytes with `writeFile` to
`process.cwd()/.data/uploads/...` and the download route streams them back
from disk. On Vercel the filesystem is read-only except `/tmp`, which is
ephemeral and not shared across instances — so a file uploaded on one
invocation is gone (or 404s) on the next. The code already anticipates this:
its header comment says "the future S3 / Vercel Blob swap will reimplement"
the storage contract.

## Steps (operator)

1. Vercel -> Storage -> Blob -> create a store; connect it to the **tasks** project.
2. Confirm `BLOB_READ_WRITE_TOKEN` is injected into the tasks project (all environments).
3. (Decision) Approve a per-workspace storage quota policy (eng will enforce it on upload).

## Then (eng, unblocked by the above)

- Swap the storage adapter in `attachments.ts` from `node:fs` to `@vercel/blob`
  (`put`/`del`); store the returned blob URL/pathname in `attachments.storedPath`.
- Update the download route + the account-erasure unlink path to use blob `del`.
- Until provisioned, treat the attachments feature as not production-ready.
