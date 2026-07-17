---
title: CRM lead books — prospects table, seed contract, migrate/sync route
slug: prospects-db-and-lead-books
lens: Processes
owner: Ethan
lastVerified: 2026-07-17
links: [turso-databases-and-reads]
tags: [prospects, lead books, /hq/crm, STUDIO_MIGRATE_SECRET, /api/internal/prospects/migrate, seed sync, lock-down]
references: [src/lib/db/schema.ts, src/lib/hq/data.ts, src/lib/hq/crm-utils.ts, src/lib/hq/crm-db.ts, src/app/api/internal/prospects/migrate/route.ts, src/app/hq/crm/page.tsx]
summary: The CRM's prospects live in Studio Turso as one table with a typed segment column (venue · student · school · smb). The committed seed in data.ts is the research source of truth; POST /api/internal/prospects/migrate (Bearer STUDIO_MIGRATE_SECRET) runs idempotent DDL then syncs seed → DB — inserting new ids, refreshing untouched rows, fill-empty-only on operator-touched rows, never writing stage/dates/outcome.
status: complete
pinned: false
execWhat: Every sales lead — venues, student societies, schools — lives in one database table, split into four books. Research updates are written into the codebase first, then one authorised call pushes them into the live CRM without disturbing any work the founder has already logged against a lead.
execMatters: The CRM can be enriched by research agents at any scale while the founder works the pipeline in parallel; neither side can overwrite the other. The lock-down scoreboard on /hq/crm only moves when a verified fact lands.
execRisk: If the sync route's secret leaks, someone could insert or overwrite lead research (not pipeline state) — rotate STUDIO_MIGRATE_SECRET in Vercel if in doubt. If schema.ts and the route's mirrored DDL drift apart, new columns silently miss production: change schema.ts first, mirror the DDL in the route, then re-run the route.

---

## WHAT

`prospects` (Studio Turso) is the single table behind `/hq/crm`. One row per lead, `segment` column keyed to the four lead books (`venue`, `student`, `school`, `smb`). Research facts (contact, email, phone, address, county, org_group, inbox_type, tier, notes…) come from the committed seed `src/lib/hq/data.ts`; pipeline state (stage, last_contacted_at, next_follow_up_at, outcome) belongs to the operator via the `/hq/crm` UI server actions in `crm-db.ts`.

## HOW IT MOVES

1. Research waves edit `seedHqData.prospects` in `data.ts` (verify-then-record: every fact carries its source + date in `source`/`notes`).
2. Merge to main → auto-deploy.
3. `POST /api/internal/prospects/migrate` with `Authorization: Bearer $STUDIO_MIGRATE_SECRET` (Vercel prod env, sensitive). The route:
   - runs idempotent DDL (CREATE TABLE/INDEX IF NOT EXISTS, guarded ADD COLUMNs);
   - inserts seed records missing from the table;
   - rows with `updated_at == created_at` (never operator-touched) take the seed's research fields wholesale;
   - operator-touched rows gain values only where the DB field is empty;
   - never writes stage, contact dates, or outcome (see `SEED_RESEARCH_FIELDS` in `crm-utils.ts`).
4. Response reports `{tableRows, seedRecords, inserted, refreshed, filled}`.

## WHY THIS SHAPE

Turso credentials are stored sensitive-only in Vercel, so `pnpm db:push` cannot run from a laptop without founder keys; the deployed app already holds them at runtime. The Bearer-secret internal route matches the entitlements ops-route pattern. Seed-as-source keeps every research fact reviewable in git before it reaches the live CRM.
