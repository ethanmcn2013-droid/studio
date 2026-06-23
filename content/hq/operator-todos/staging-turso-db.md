---
id: staging-turso-db
title: Provision a separate staging/preview Turso DB per app
status: open
priority: P0
blocking: true
phase: Phase 1
why: Preview deploys currently share the production database — a preview branch can corrupt prod data.
href: /hq/health
date: 2026-06-23
---

## Steps

1. Turso dashboard -> create a `*-preview` database for each app: notes, tasks, analytics, roadmap.
2. Generate an auth token for each preview DB.
3. Vercel -> each project -> Settings -> Environment Variables -> set the Preview-scoped `*_DATABASE_URL` / `*_AUTH_TOKEN` (e.g. `TASKS_DATABASE_URL`) to the preview DB.
4. Redeploy a preview branch and confirm writes land in the preview DB, not prod.
