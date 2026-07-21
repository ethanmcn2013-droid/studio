---
id: premium-blob-storage
title: Provision Vercel Blob on the tasks project for durable task-file uploads
status: open
priority: P1
blocking: true
phase: Premium Programme Phase 1
why: Attachment bytes currently write to local disk on Vercel (.data/uploads), which does not survive redeploys. Phase 1 moves uploads to Vercel Blob behind the existing storage seam; the store and its token are founder-provisioned infrastructure.
href: /hq/decisions
date: 2026-07-21
---

## Steps

1. Vercel -> tasks project -> Storage -> create a Blob store (EU region).
2. Confirm `BLOB_READ_WRITE_TOKEN` is attached to the tasks project (Production + Preview scope). The code will read only this standard variable.
3. Reply done on this todo; Phase 1 upload work ships dark until the token exists, so nothing breaks in the meantime.

## Notes

- Existing uploads on local disk may already be unrecoverable after past redeploys; the migration will mark missing bytes honestly rather than pretend recovery.
- Quotas ship config-driven (Free 100MB / 10MB-file, Pro 10GB / 250MB-file fallback defaults) and can be changed without a migration — flag if you want different numbers (DECISIONS D-007 in docs/execution/signal-studio/).
