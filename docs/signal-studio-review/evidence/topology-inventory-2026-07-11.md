# Secret-free topology inventory · 2026-07-11

This is a source-level inventory. It intentionally records variable names and
provider references only, never values, tokens, private keys, or personal data.

## Repositories and branches

| Surface | Repository root | Branch at inventory | Deployment evidence |
|---|---|---|---|
| Studio | `studio/` | `feat/remediation-program` | Next/Vercel configuration in repo |
| Notes | `notes/` | `feat/notes-hero-lab` | Next/Vercel configuration in repo |
| Tasks | `tasks/` | `feat/tasks-hero-lab` | Next/Vercel configuration in repo |
| Timeline | `roadmap/` | `feat/timeline-hero-lab` | Next app; Vercel mapping requires provider verification |
| Signal | `analytics/` | `main` | Next/Vercel configuration in repo |
| Design foundation | `ds-foundation/` | `fix/package-name-canon` | Package source; no deployment |

Active product worktrees and dirty files were observed in Tasks, Notes, and
Timeline. They remain outside the remediation commits.

## Canonical hosts

- `signalstudio.ie`
- `tasks.signalstudio.ie`
- `timeline.signalstudio.ie`
- `signal.signalstudio.ie`
- `notes.signalstudio.ie`

All five returned HTTPS HTTP 200 during the review, but this does not prove an
authenticated journey or production provider configuration.

## Authentication and service variables referenced by source

| Boundary | Names observed | Current source-level conclusion |
|---|---|---|
| Clerk | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SIGNING_SECRET` | Product apps use Clerk; provider application count and cookie domain remain unknown |
| Studio Today | `SUITE_API_KEY` | Routes now verify signed assertions, but provider-side key separation and JTI replay storage remain open |
| Notes→Tasks | `NOTES_TO_TASKS_SECRET`, `TASKS_API_URL` | Notes now signs subject/note assertions; shared-secret rotation and replay store remain open |
| Turso | Product-specific `TURSO_*_DATABASE_URL` and `*_AUTH_TOKEN`; shared entitlement names | Database topology/token permissions/backups require provider verification |
| Stripe | Stripe webhook variables in Tasks source | Tasks is the intended paid-access writer; live configuration requires verification |
| Sentry | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` | Instrumentation exists unevenly; live projects/alerts require verification |
| Upstash | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Timeline/Signal rate limits are configuration-dependent; production provisioning requires verification |
| Cron | `CRON_SECRET`, `CRON_PING_SECRET`, `STUDIO_OPS_SECRET`, `STUDIO_CRON_PING_SECRET` | Routes exist; live secret coverage and alerting require verification |

## Source-level open topology questions

1. Are all product Clerk applications the same production instance/custom domain?
2. Does the cross-subdomain cookie/session actually work for one account across all five hosts?
3. Which Turso database is authoritative for each product, which tokens are read-only, and are restore drills current?
4. Which Vercel projects map to each domain, and which environment variables exist in Preview and Production?
5. Are Stripe, Resend, Sentry, Upstash, cron, DNS, and branch protection controls enabled in production?

## Next evidence required

Provider-console screenshots or exported configuration summaries with values
redacted, plus a signed operator receipt in this directory. Until then, the
corresponding P0 ledger items remain open.
