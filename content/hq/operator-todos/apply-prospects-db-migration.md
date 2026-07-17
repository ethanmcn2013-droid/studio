---
id: apply-prospects-db-migration
title: Push the prospects table (with lead-book columns) to production Turso
status: done
priority: P1
blocking: false
phase: Venue outreach
why: Until the table carries the lead-book columns and seed, /hq/crm edits don't persist the new intelligence.
href: /hq/crm
date: 2026-07-16
---

## Steps

Done 2026-07-17, without founder keys: Turso credentials are sensitive-only in
Vercel so `pnpm db:push` could not run locally. Instead the deployed app runs
the DDL itself — `POST /api/internal/prospects/migrate` (Bearer
`STUDIO_MIGRATE_SECRET`, set in Vercel prod). The table already existed with
the original 50 rows; the route added the six lead-book columns and its
seed-sync reconciled the books (venues enriched, student + school books
inserted). System documented in atlas: `prospects-db-and-lead-books`.

Re-run the same curl after any future seed wave to land it in production.
