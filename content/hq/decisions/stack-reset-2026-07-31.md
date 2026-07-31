---
id: stack-reset-2026-07-31
title: Reset the data layer before launch — one name per database, one env convention, fresh baselines.
category: Operations
date: 2026-07-31
status: Active
reviewDate: 2026-08-31
relatedObjects: [docs/INFRASTRUCTURE.md, db-archive/2026-07-31, tasks PR claude/stack-reset-data-layer, studio PR claude/stack-reset-data-layer]
---

## Decision

With zero external users, rebuild the entire Turso layer under content-true
names and collapse four generations of env-var conventions to one:
`<MODULE>_DATABASE_URL` + `<MODULE>_AUTH_TOKEN`.

- Databases become `tasks / notes / timeline / signal / entitlements`
  `-prod|-preview` + `studio-prod` — 11 independent databases, no branch
  lineage, replacing the 13 `signal-*` ones (D2: bare names, no prefix).
- `signal-prefs` folds into the Signal database (D3).
- Data carried over: the live board, the wedding Timeline artifact,
  sponsor/licensing state. Notes and Signal start fresh (D1). Everything
  was dumped first.
- The empty GTM `/roadmap` scaffolding (three tables, never populated,
  unreachable on production hosts) is retired rather than promoted —
  operator-todos in this repo are the one founder checklist (D9).
- Vercel: eight dead projects deleted; junk and legacy env vars purged.
  GitHub: 21 legacy/dead repos archived (D4, D5).
- Unprovisioned services (Sentry, PostHog, Upstash, Anthropic-in-prod)
  defer to a post-reset pass; Blob is provisioned so attachments work
  (D6). The Slack directors bot retires outright.
- The `tasks` repo renames to `app` after the cutover (D8).
- Every dashboard-held key rotates (see rotate-keys-post-reset); several
  values found in plaintext on disk rotate first.

## Why

Every database name was one product-rename behind the company, the same
physical database answered to as many as four different env names, two
production tables existed in no migration file, and misnamed pairs pointed
at the wrong databases. Cheapest possible moment: no users, no external
integrations depending on the old names.

## Revisit when

The post-reset pass decides each unprovisioned service, or any new module
needs a database (follow the naming rules in docs/INFRASTRUCTURE.md).
