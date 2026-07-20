---
id: load-national-schools-book
title: Load the national schools book (4,722 schools) into production Turso
status: open
priority: P1
blocking: true
phase: Schools outreach
why: The schools book is built and merged in code, but the 4,722 school rows only reach the /hq/crm schools book once the import route runs against prod Turso.
href: /hq/crm?book=school
date: 2026-07-20
---

## What this is

The schools lead book went from 50 hand-seeded Limerick anchors to a national
list across four nations, each from its official register:

- Ireland — 721 post-primary schools, 100% official email (DoE 2025/26).
- Scotland — 362 secondary, 100% official email (gov.scot, 31 Jan 2026).
- England — 3,435 secondary, GIAS register (no email field; office address
  inferred from the official website and tagged `email-inferred`).
- Wales — 204 secondary, Welsh Gov register (no email/website; phone + address,
  tagged `email-missing` for LA enrichment).

Datasets live in `src/lib/hq/schools/*.json`; the loader is
`src/lib/hq/schools/index.ts`.

## Steps

1. Merge and deploy the branch `feat/outreach-schools-national` (this carries
   the schema columns `country`/`category`/`flags`, the schools book UI, and
   the datasets). Note: it was branched off `feat/hq-redesign-os` — rebase onto
   `main` first if the HQ redesign is not yet merged.

2. After deploy, run the bulk import once (idempotent, pipeline-safe — it runs
   its own DDL, retires the un-worked legacy Limerick anchor rows, and upserts
   every nation without clobbering worked pipeline):

   ```
   curl -X POST https://signalstudio.ie/api/internal/prospects/import-schools \
        -H "Authorization: Bearer $STUDIO_MIGRATE_SECRET"
   ```

   Expect a JSON summary: `schoolRows`, `byCountry`, `inserted`,
   `retiredLegacyAnchors`, `refreshed`, `filled`.

3. Confirm at `/hq/crm?book=school` — the country tabs should read
   Ireland 721 · England 3,435 · Scotland 362 · Wales 204.

Re-run the same curl after any future schools refresh to land it in production.

## Before the first send

- Ireland and Scotland emails are official and send-ready.
- England emails are inferred from the official website domain — run a
  verification pass (or send-time validation) before a bulk send; filter the
  `email-inferred` tag to isolate them.
- Wales rows carry no email — enrich from the local-authority or school site;
  filter the `email-missing` tag.
