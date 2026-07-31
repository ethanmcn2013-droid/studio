---
id: apply-sponsor-requests-migration
title: Apply the sponsor_requests migration on signal-entitlements
status: open
priority: P1
blocking: false
phase: Account V2
why: Until the table exists, the Account review records no request and the ask-for-more-access flow reports an error instead of persisting.
href: /hq/account-review
date: 2026-07-27
---

The Signal Studio Account review shipped with a request-more-access flow that
writes to a new `sponsor_requests` table on the `signal-entitlements` database.
The migration is additive and idempotent, and the room degrades safely without
it: the open-requests list renders empty and a write returns an error message
rather than failing the page. Nothing else in HQ depends on it.

**Superseded by the 2026-07-31 data-layer reset:** the new
`entitlements-prod` database is created from the regenerated
`drizzle-entitlements/0000_init.sql` baseline, which includes
`sponsor_requests` — no separate migration run remains. (Env names are now
`ENTITLEMENTS_DATABASE_URL` / `ENTITLEMENTS_AUTH_TOKEN`.)

## Steps

1. After the reset cutover deploys, open `/hq/account-review`, ask for more
   access on a test venue, and confirm the request records and appears in
   the open-requests list.
2. Mark this done.
