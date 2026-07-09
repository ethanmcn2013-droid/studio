---
id: apply-waitlist-db-migration
title: Apply the waitlist table migration to the Studio database.
owner: Ethan
status: done
date: 2026-07-08
---

Done 2026-07-09: the `waitlist_entries` table was created in the prod Studio DB via a one-time HQ-gated migration route, and a live signup was verified into `/hq/waitlist`. Submissions now persist.

## Why

The waitlist page and server action are implemented, but the local Codex environment does not have `TURSO_STUDIO_DATABASE_URL` configured, so Drizzle cannot apply `drizzle/0004_waitlist_entries.sql` from this shell.

## Command

Set `TURSO_STUDIO_DATABASE_URL` and `TURSO_STUDIO_AUTH_TOKEN`, then run:

```powershell
.\node_modules\.bin\drizzle-kit.cmd push
```

## Done when

`waitlist_entries` exists in the Studio database and `/waitlist` submissions appear in `/hq/waitlist`.
