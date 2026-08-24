# drizzle-entitlements — baseline

Baselines were regenerated 2026-07-31 as part of the data-layer reset. New
databases are created from this baseline.

The seven historical hand-run migration scripts (`scripts/apply-venue-ledger.mjs`,
`scripts/backfill-access.mjs`, `scripts/migrate-access.mjs`,
`scripts/migrate-account-requests.mjs`, `scripts/migrate-entitlements-to-shared.mjs`,
`scripts/migrate-sponsor-usage.mjs`, `scripts/migrate-venue-access-18-months.mjs`)
predate it — they were applied by hand against the live database before this
baseline existed, which is why the old `0000_init.sql` had drifted from the
production schema. `0000_init.sql` now captures the full, current
`src/lib/entitlements-db/schema.ts` (15 tables) in one clean migration with a
matching single-entry journal.
