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

The migration cannot run from this machine. `TURSO_ENTITLEMENTS_DATABASE_URL`
and `TURSO_ENTITLEMENTS_AUTH_TOKEN` are not present in the local environment,
so the script exits with `SKIP` before touching anything.

## Steps

1. Set `TURSO_ENTITLEMENTS_DATABASE_URL` and `TURSO_ENTITLEMENTS_AUTH_TOKEN`
   in the environment you run the migration from.
2. Preview it first: `node scripts/migrate-account-requests.mjs --dry-run`.
3. Apply it: `node scripts/migrate-account-requests.mjs`.
4. Open `/hq/account-review`, ask for more access on a test venue, and confirm
   the request records and appears in the open-requests list.
5. Mark this done.

Re-running is safe. The script creates the table only if it is absent.
