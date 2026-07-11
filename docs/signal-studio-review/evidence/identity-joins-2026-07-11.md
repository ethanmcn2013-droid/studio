# Immutable identity join verification — 2026-07-11

## Scope

Removed the remaining email-based authorization joins from Signal (Analytics),
Signal Timeline (Roadmap), Tasks, and Notes. Cross-product Tasks reads now resolve only by
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
- Tasks' dormant milestone query and internal workspace-personalization route use
  `clerk_id`; the latter now requires an audience-bound signed assertion.
- Notes signs personalization requests with the immutable subject and dedicated
  audience; no email is sent to Tasks for authorization.
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
| Tasks | `corepack pnpm exec tsc --noEmit --incremental false` | pass |
| Tasks | `corepack pnpm exec next build` | pass |
| Notes | `corepack pnpm exec tsc --noEmit --incremental false` | pass |
| Notes | `corepack pnpm exec next build` | pass |
| Notes | `corepack pnpm exec tsx --test src/server/cross-product-assertion.test.ts src/lib/access-mode.test.ts` | 4/4 pass |

Implementation commits: `b98c4bd54e578940f31c3d3eef015fb518184628` (Analytics),
`4d7db80fcbea9fc339bebe8b0e606cb7e7b0c755` (Timeline),
`607cb83432da032e025a79a8b661f90dcbec6587` (Tasks), and
`015c343fc05fcb88831284bc30a87c79b06baed6` (Notes).

## Remaining gate

Preview and production receipts remain open. The P0 ledger item stays
`verifying` until provider identity mapping, preview behavior, and production
membership/entitlement checks are demonstrated.
