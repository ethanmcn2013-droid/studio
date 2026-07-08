---
id: apply-waitlist-db-migration
title: Apply the waitlist table migration to the Studio database.
owner: Ethan
status: Open
date: 2026-07-08
---

## Why

The waitlist page and server action are implemented, but the local Codex environment does not have `TURSO_STUDIO_DATABASE_URL` configured, so Drizzle cannot apply `drizzle/0004_waitlist_entries.sql` from this shell.

## Command

Set `TURSO_STUDIO_DATABASE_URL` and `TURSO_STUDIO_AUTH_TOKEN`, then run:

```powershell
.\node_modules\.bin\drizzle-kit.cmd push
```

## Done when

`waitlist_entries` exists in the Studio database and `/waitlist` submissions appear in `/hq/waitlist`.
