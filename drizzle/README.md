# drizzle — baseline

Baselines were regenerated 2026-07-31 as part of the data-layer reset. New
databases are created from this baseline.

The seven historical hand-run migration scripts (`scripts/apply-venue-ledger.mjs`,
`scripts/backfill-access.mjs`, `scripts/migrate-access.mjs`,
`scripts/migrate-account-requests.mjs`, `scripts/migrate-entitlements-to-shared.mjs`,
`scripts/migrate-sponsor-usage.mjs`, `scripts/migrate-venue-access-18-months.mjs`)
predate it. `0000_init.sql` now captures the full, current
`src/lib/db/schema.ts` (7 tables: `entitlements`, `sponsors`, `license_codes`,
`redemptions`, `prospects`, `cron_runs`, `waitlist_entries`) in one clean
migration with a matching single-entry journal, replacing the prior
`0000`–`0004` migration chain.
