# Production mode guard verification — 2026-07-11

All four user-facing products now resolve `demo` and `review` to `production`
when `VERCEL_ENV=production` (or when `NODE_ENV=production` without a Vercel
environment). This prevents an explicit demo flag or legacy demo flag from
activating seeded data on a production domain.

| Product | Verification | Result |
| --- | --- | --- |
| Signal | `corepack pnpm exec tsx --test src/lib/access-mode.test.ts` | pass (existing guard) |
| Notes | `corepack pnpm exec tsx --test src/lib/access-mode.test.ts` | pass (existing guard) |
| Tasks | `corepack pnpm exec tsx --test src/lib/access-mode.test.ts` | 1/1 pass |
| Timeline | `corepack pnpm exec tsx --test src/lib/access-mode.test.ts` | 1/1 pass |

TypeScript checks passed for Tasks and Timeline. Production builds passed for
Tasks and Timeline in the same verification run. Provider preview and
production-domain receipts remain open, so `SS-P1-006` stays `verifying`.
