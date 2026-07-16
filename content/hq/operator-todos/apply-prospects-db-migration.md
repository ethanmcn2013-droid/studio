---
id: apply-prospects-db-migration
title: Push the prospects table (with lead-book columns) to production Turso
status: open
priority: P1
blocking: false
phase: Venue outreach
why: Until the table exists, /hq/crm reads the committed seed and every edit made in the browser (stage moves, dossier saves, logged sends) fails to persist.
href: /hq/crm
date: 2026-07-16
---

## Steps

1. From the studio repo with production `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` in the environment, run `pnpm db:push`.
2. Confirm the `prospects` table exists with the new columns (`segment`, `phone`, `address`, `county`, `org_group`, `inbox_type`, `tier`).
3. Load `/hq/crm` once — `getProspects()` auto-seeds the 59 committed leads (50 venues, 3 student anchors, 6 school anchors) on first read.
4. Change one stage and reload to confirm persistence.

If the table already exists from an earlier push (pre-book schema), `pnpm db:push` adds the new columns; existing rows keep working — legacy segment strings normalise to the venue book at read time.
