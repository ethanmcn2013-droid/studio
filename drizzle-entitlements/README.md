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

## 0001_account_metrics_v2_and_drift_closure — NOT YET APPLIED, NOT YET APPROVED

Generated 2026-08-03 by `drizzle-kit generate --config=drizzle-entitlements.config.ts`
while correcting the retired metric-dictionary name for E09.03. It contains more
than its first half implies, and the extra is the point.

**What was intended.** `METRIC_DICTIONARY_VERSION` was pinned to
`venue-metrics.v1`, the dictionary written for the retired 15-venue
code-allotment model that D-020 abolished. E09.01 §0 retires that name and makes
`account-metrics.v2` canonical. The pin was the column DEFAULT on
`sponsor_usage_daily.metric_dictionary_version`, which is also part of that
table's composite primary key, so every row inserted without an explicit version
was keyed under the retired dictionary. `sponsor_report_snapshots` carried the
same DEFAULT and was not on the list anyone was working from.

**What the generator also found, and this is the finding.** Six columns exist in
`schema.ts` and in no migration at all, so a database built from
`0000_init.sql` cannot run the shipped code:

| Column | Depended on by |
|---|---|
| `entitlements.wedding_date` | `entitlements-db/codes.ts` writes it; D-010's access-term rule (18 months from redemption or 3 months past the wedding, whichever is later) cannot be computed without it. This is the R-015 blocker. |
| `sponsors.allotment_mode` | `venue-allotment.ts` `isUnlimitedSponsor()` reads it; it is the column the whole D-020 / R-016 "unlimited is representable" correction rests on. |
| `sponsors.founding_number`, `sponsors.founding_number_assigned_at` | The Founding 25 number, assigned on payment (D-009.6). |
| `sponsors.annual_wedding_count`, `sponsors.fair_use_ceiling` | Fair-use notification under D-020. |

These are drift closure, not new decisions: every one is already declared in the
approved `schema.ts` and already read or written by shipped code. But
`allotment_mode` lands with `NOT NULL DEFAULT 'limited'`, and the HQ onboarding
form defaults the same field to `unlimited`, so applying this migration makes a
default visible that two places currently disagree about.

**Before this is applied.** It needs a founder decision, and it needs the
receipt-backed `db-migrate` path rather than a hand run. It also drops and
recreates 44 indexes, because a SQLite column-default change is a table rebuild,
so a half-completed run leaves the database without its indexes. Nothing in this
change set has been applied to any database.
