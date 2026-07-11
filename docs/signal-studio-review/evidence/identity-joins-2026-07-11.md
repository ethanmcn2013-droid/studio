# Immutable identity join verification — 2026-07-11

## Scope

Removed the remaining email-based authorization joins from Signal (Analytics)
and Signal Timeline (Roadmap). Cross-product Tasks reads now resolve only by
the immutable suite subject stored in `users.clerk_id`. Email remains available
for display and delivery, but cannot select a Tasks user or workspace.

## Changes

- Analytics `tasks-db-source` uses `WHERE clerk_id = ?` with the signed-in
  `userId`.
- Analytics workspace discovery uses only `users.clerk_id`; the legacy email
  and raw `users.id` fallbacks are removed.
- Timeline milestone sync and workspace preference reads use `clerk_id`.
- Timeline sync action passes the authenticated `requireUser()` subject rather
  than the workspace owner email.
- Negative tests cover email-only webhook races, duplicate email addresses,
  unknown subjects, and positive subject-linked reads.

## Verification receipts

| Surface | Command | Result |
| --- | --- | --- |
| Analytics | `npm exec tsc -- --noEmit --incremental false` | pass |
| Analytics | `npm exec tsx -- --test src/lib/data/source.test.ts src/lib/briefing/tasks-db-source.test.ts` | 14/14 pass |
| Analytics | `npm run build` | pass |
| Timeline | `corepack pnpm exec tsc --noEmit --incremental false` | pass |
| Timeline | `corepack pnpm exec tsx --test src/server/sync/tasks-milestone-source.test.ts` | 33/33 pass |
| Timeline | `corepack pnpm exec next build` | pass |

Implementation commits: `b98c4bd54e578940f31c3d3eef015fb518184628` (Analytics),
`4d7db80fcbea9fc339bebe8b0e606cb7e7b0c755` (Timeline).

## Remaining gate

Preview and production receipts remain open. The P0 ledger item stays
`verifying` until provider identity mapping, preview behavior, and production
membership/entitlement checks are demonstrated.
