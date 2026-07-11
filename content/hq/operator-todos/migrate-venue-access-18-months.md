---
id: migrate-venue-access-18-months
title: Apply the Venue Edition 18-month access migration
status: open
priority: P0
blocking: true
phase: Venue Edition fixed-price correction
why: Existing 365-day couple codes and redeemed entitlements do not yet match the ratified 18-month promise.
href: /hq/entitlements
date: 2026-07-11
---

## Steps

1. Set write-capable credentials for Tasks, the shared entitlements store, and the Studio local mirror in the operator shell.
2. Run `pnpm venue:migrate-access-18mo` and confirm it reports 23 codes with digest `8ca762af65e0281b6a8688406e7b95b6f0ff66a05ef3dd9788e15e8c0d4abf46`.
3. Run `pnpm venue:migrate-access-18mo --apply` only after the dry-run reports that pinned set and exact parity across all three stores.
4. Save the post-commit verification output, then rerun the dry-run and confirm it reports a verified no-op.

The command is dry-run by default and refuses any unexpected code, entitlement, duration, or mirror state.
