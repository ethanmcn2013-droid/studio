# Signal Studio · infrastructure map

Canonical as of the 2026-08-09 Wave 0 deployment rebaseline. If reality and this file
disagree, fix one of them in the same change. App-side deploy detail lives
in the app repo's `DEPLOY.md`.

Scoped receiving update, 21 October 2026: Timeline migration `0002` was
received in production through run `39578171064`. Encrypted backup artifact
`12335715483` was uploaded and acknowledged before apply; the independent
production target hash matched. Restore/rehearsal checks and production
current-ledger, schema-fingerprint and second no-op checks passed. Application
deployment subsequently reached READY on the canonical alias. Combined App source `55772b2a9d968975f148f9dcf7b95c54d97ede9c`
(tree `080af0e3c4bc4991fc25dc8beafd3aeb52613f9b`) includes the daily schedule
fix. PR #301 head and merge checks passed; final main Verify, Design and
drift subsequently passed, with 188/188 normal Design cases.
The strict provenance failure remains recorded under a separately approved
source-equivalence exception: 45 line-ending-only files and 312 generated
extras, with no substantive changed or missing source. The canonical provider
bindings were received; scheduled execution and reminder delivery remain
unproven. The controlled guest flow confirmed and then unsubscribed one
self-test subscription; all test publication links were revoked. Scoped
read-only production SQL confirmed the four tables and these effects.
Unauthenticated reminder access returned 401. No second email was sent.
The temporary migration credential was removed from the owned GitHub secret
and private handoff after receiving. Its provider-issued expiry remains
22 October at 09:29 UTC; no account-wide token invalidation or existing App
credential rotation was performed.
Other infrastructure facts retain their prior verification dates.

## Accounts

| Layer | Account | Holds |
|---|---|---|
| Vercel | team `ethanmcn2013-1730s-projects` (Hobby) | Production projects `studio` and `app`; document/personal projects remain separate and are outside the suite release loop |
| Turso | `ethan387` (Free, group `default`) | The 11 databases below |
| Clerk | app “Signal Studio” | Auth for the unified app only; studio hosts the GDPR webhook receiver |
| Stripe | (founder dashboard) | Billing for the unified app; 5 prices, 1 env var each |
| Resend | domain `signalstudio.ie` | Transactional email from the app |
| GitHub | org `ethanmcn2013-droid` | Production repos: `studio`, `app`; supporting repos include `signal-motion`, `signal-directors`, `signal-design-system`, `signal-review`, and `collateral`. Legacy product repos are archived |
| Google Workspace | `signalstudio.ie` MX | Mailbox email (separate from Resend sending) |
| GA4 | property `G-YHBS152PJK` | Client-side analytics on both apps, no secret |

## Databases

One database per module, every one an independent top-level Turso database.
Preview siblings are independent databases too, never branches.

| Database | Owner (writes) | Readers | Schema baseline |
|---|---|---|---|
| `tasks-prod` / `tasks-preview` | app repo · Tasks product | studio Today API (read-only token) | `app/drizzle` receipt-ledger, baseline 0014 + forwards |
| `notes-prod` / `notes-preview` | app repo · Notes product | studio Today API | `app/drizzle-notes/0000` |
| `timeline-prod` / `timeline-preview` | app repo · Timeline product | studio Today API | `app/drizzle-timeline/migration-ledger.json`: `0000` baseline + forwards; `0002_master3_presentation` production apply received 2026-10-21; preview state not established |
| `signal-prod` / `signal-preview` | app repo · Home briefing capability and preferences (legacy database name) | studio Today API | `app/drizzle-signal/0000` |
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
| app (production schedule binding received) | `/api/timeline/reminders` | temporary private-cohort fallback: daily 09:00 UTC, `0 9 * * *` | `CRON_SECRET` bearer |
| app → studio | `/api/internal/cron-ping` | after app crons | `STUDIO_CRON_PING_SECRET` = studio's `CRON_PING_SECRET` (one value, two names — rotate together) |
| app repo CI | `db-migration-drift` workflow | daily 07:00 UTC | Actions secrets `TASKS_DATABASE_URL` / `TASKS_AUTH_TOKEN` |

The merged Timeline worker cleans expired subscriptions, schedules due
reminders and dispatches a bounded durable outbox with subscription and
publication reauthorization. A deployed schedule alone would not prove a
successful worker run or email delivery; no new Studio cron-ping heartbeat is
claimed. Each invocation attempts at most 20 globally due outbox rows,
including suppression, failure and unknown outcomes; this is not a count of
delivered messages. Overflowing date reminders can expire and be suppressed.
There is no prompt-update or all-subscriber coverage promise. Follow
confirmation email is synchronous; no five-minute schedule or purchase is
claimed. Its four additive tables are documented in
`content/atlas/turso-databases-and-reads.md` and
`content/atlas/timeline-shareable-artifact.md`.

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

The merged Timeline guest-follow source additionally requires
`TIMELINE_FOLLOW_SIGNING_SECRET` for personal subscriber links. This records
the required name only; deployed configuration and guest-email runtime
receiving includes one approved self-test confirmation, confirmation-link
subscription and Unfollow. This is not a scheduled reminder or general
delivery guarantee. No value belongs in this document.

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
