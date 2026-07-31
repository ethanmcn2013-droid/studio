# Signal Studio · infrastructure map

Canonical as of the 2026-07-31 data-layer reset. If reality and this file
disagree, fix one of them in the same change. App-side deploy detail lives
in the app repo's `DEPLOY.md`.

## Accounts

| Layer | Account | Holds |
|---|---|---|
| Vercel | team `ethanmcn2013-1730s-projects` (Hobby) | Projects `studio`, `tasks` (production), `signal-docs-hub` (CI-published decks), `signal-business-plan`, `signal-growth-plan` (doc sites), `ethanmcnamara`, `transactions-mirror` (personal) |
| Turso | `ethan387` (Free, group `default`) | The 11 databases below |
| Clerk | app “Signal Studio” | Auth for the unified app only; studio hosts the GDPR webhook receiver |
| Stripe | (founder dashboard) | Billing for the unified app; 5 prices, 1 env var each |
| Resend | domain `signalstudio.ie` | Transactional email from the app |
| GitHub | org `ethanmcn2013-droid` | Operating repos: `studio`, `tasks`, `signal-motion`, `signal-directors`, `signal-design-system`, `signal-review`, `collateral`. Legacy product repos are archived |
| Google Workspace | `signalstudio.ie` MX | Mailbox email (separate from Resend sending) |
| GA4 | property `G-YHBS152PJK` | Client-side analytics on both apps, no secret |

## Databases

One database per module, every one an independent top-level Turso database.
Preview siblings are independent databases too, never branches.

| Database | Owner (writes) | Readers | Schema baseline |
|---|---|---|---|
| `tasks-prod` / `tasks-preview` | app (`tasks` repo) | studio Today API (read-only token) | `tasks/drizzle` receipt-ledger, baseline 0014 + forwards |
| `notes-prod` / `notes-preview` | app · Notes module | studio Today API | `tasks/drizzle-notes/0000` |
| `timeline-prod` / `timeline-preview` | app · Timeline module | studio Today API | `tasks/drizzle-timeline/0000` |
| `signal-prod` / `signal-preview` | app · Signal module (briefing + preferences) | studio Today API | `tasks/drizzle-signal/0000` |
| `entitlements-prod` / `entitlements-preview` | app (Stripe webhook) + studio scripts | every product (read) | `studio/drizzle-entitlements/0000` |
| `studio-prod` (no preview, by design) | studio | — | `studio/drizzle/0000` |

## Env-var convention

`<MODULE>_DATABASE_URL` + `<MODULE>_AUTH_TOKEN`, where MODULE is one of
`TASKS · NOTES · TIMELINE · SIGNAL · ENTITLEMENTS · STUDIO`. The same names
are used in the app, in studio, in GitHub Actions, and in scripts — a
cross-product read uses the same variable name with a read-only token as the
value. Rules:

1. Never encode the vendor in a variable name (no `TURSO_*`).
2. Never alias — one name per credential, everywhere.
3. Vercel carries only variables the deployed code reads. If a variable is
   removed from code, it is removed from Vercel in the same cutover.
4. New module → new database pair + one env pair, following the table above.

## Cron

| App | Path | Schedule | Auth |
|---|---|---|---|
| studio | `/api/cron/sponsored-use` | daily 06:20 UTC | `CRON_SECRET` |
| app | `/api/cron/digest?send=1` | daily 09:00 UTC | `CRON_SECRET` |
| app → studio | `/api/internal/cron-ping` | after app crons | `STUDIO_CRON_PING_SECRET` = studio's `CRON_PING_SECRET` (one value, two names — rotate together) |
| tasks repo CI | `db-migration-drift` workflow | daily 07:00 UTC | Actions secrets `TASKS_DATABASE_URL` / `TASKS_AUTH_TOKEN` |

## Webhooks

| Provider | Endpoint | Secret |
|---|---|---|
| Clerk | `app.signalstudio.ie/api/webhooks/clerk` | `CLERK_WEBHOOK_SIGNING_SECRET` (app) |
| Clerk (user.deleted GDPR shredder) | `signalstudio.ie/api/webhooks/clerk` | `CLERK_WEBHOOK_SECRET` (studio) — was unset in prod before the reset; must be set for the shredder to be live |
| Stripe | `app.signalstudio.ie/api/webhooks/stripe` | `STRIPE_WEBHOOK_SECRET` (app) |

## Internal shared secrets

`CRON_SECRET` (each app), `CRON_PING_SECRET`/`STUDIO_CRON_PING_SECRET`
(pair), `NOTES_TO_TASKS_SECRET`, `NOTES_TO_TIMELINE_SECRET`,
`OUTBOX_DELIVERY_SECRET` + `SUITE_OUTBOX_CONSUMERS_JSON`,
`NOTES_CAPTURE_INBOUND_SECRET`, `PARTNER_STATS_SECRET` (studio↔app pair),
`SUITE_API_KEY` (Today API bearer), `STUDIO_OPS_SECRET`,
`STUDIO_MIGRATE_SECRET`, `SIGNAL_HQ_PASSWORD`, `EXPERIENCE_CAPTURE_PASSWORD`
(Actions). Regenerate all of them at any credential-hygiene pass; none is
held by a third party.

## Provisioned deliberately later (post-reset pass)

Sentry, PostHog, Upstash rate limiting, Anthropic in production — all
integrated in app code, none provisioned. Vercel Blob is required for task
attachments in production. Decide per service; delete the code path if the
answer is no.

## Rotation runbook

The founder-side steps live in
`content/hq/operator-todos/rotate-keys-post-reset.md`. Session-side:
regenerate internal secrets, set Vercel env (`vercel env`), set Actions
secrets (`gh secret set`), redeploy both apps, verify webhooks + crons, then
delete superseded values. Local plaintext `.env*` files are part of every
rotation: `studio/.env.local` and any worktree copies must be rewritten, and
retired ones deleted.

## Backups

`db-archive/<date>/` at the workspace root (git-ignored, outside every
repo) holds full SQL dumps of every database plus `MANIFEST.json` with
sizes, table counts, and hashes. The 2026-07-31 pre-reset dumps are the
restore point for everything the reset dropped; keep at least 30 days.
