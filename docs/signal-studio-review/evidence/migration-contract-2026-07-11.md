# Migration contract verification — 2026-07-11

Tasks no longer runs `drizzle-kit push --force` as part of normal development.
The normal path is reviewed SQL via `pnpm db:migrate`; fresh disposable local
databases use `pnpm db:bootstrap`. The forceful command remains available only
as an explicitly named `db:push:unsafe` escape hatch.

Receipt: `corepack pnpm db:contract` → `migration-contract: ok`.

The repository workflow runs this contract check before typecheck, tests, and
build. Production migration, backup, dry-run, invariant, and rollback receipts
remain open in `SS-P4-001`.
