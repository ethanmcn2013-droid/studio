# Cycle 8.4.9 — Cron staleness signal · operator handoff

Closed 2026-05-13.

## What shipped

**Studio** (`~/Projects/personal/studio`):
- `src/lib/db/schema.ts` — `cronRuns` table + `CronRunSource` enum (currently one value: `analytics_daily`)
- `drizzle/0002_init_cron_runs.sql` — migration
- `src/app/api/internal/cron-ping/route.ts` — POST endpoint, Bearer-authed via `CRON_PING_SECRET`, inserts a `cron_runs` row
- `src/lib/cron/runs.ts` — `getLatestCronRun(source)` + `getCronHealth(source)` with `green | amber | red | never` status thresholds (green < 12h, amber 12–26h, red > 26h or `ok=0`)
- `src/app/hq/health/page.tsx` — server-rendered `/hq/health` page, HQ-cookie-gated, same chrome pattern as `/hq/partners`

**Analytics** (`~/Projects/personal/analytics`):
- `src/lib/ops/ping-studio.ts` — `pingStudio(payload)` helper with 2s AbortController timeout, never throws
- `src/app/api/cron/briefings/route.ts` — added `pingStudio()` call after counts are aggregated, before the JSON response

Both repos: `tsc --noEmit` clean.

## What is gated on operator actions

The system gracefully no-ops without env vars (analytics's `pingStudio` returns early if either env var is missing; studio's endpoint rejects unauthed requests). To make the signal actually flow:

### 1. Apply the migration to prod Turso (studio)

```bash
turso db shell ethanmcnamara-studio < ~/Projects/personal/studio/drizzle/0002_init_cron_runs.sql
```

Verify:
```bash
turso db shell ethanmcnamara-studio "SELECT name FROM sqlite_master WHERE type='table' AND name='cron_runs';"
turso db shell ethanmcnamara-studio "SELECT name FROM sqlite_master WHERE type='index' AND name='cron_runs_source_ran_at_idx';"
```

### 2. Generate `CRON_PING_SECRET` and set it on studio Vercel

```bash
# Generate a 64-hex secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Then set on studio Vercel production
vercel env add CRON_PING_SECRET production --sensitive
# Paste the value when prompted
```

Also add to studio's `.env.local` for local dev.

### 3. Set `STUDIO_CRON_PING_URL` and `STUDIO_CRON_PING_SECRET` on analytics Vercel

```bash
vercel env add STUDIO_CRON_PING_URL production
# Value: https://signalstudio.ie/api/internal/cron-ping
vercel env add STUDIO_CRON_PING_SECRET production --sensitive
# Same value as studio's CRON_PING_SECRET
```

Also add to analytics's `.env.local`.

### 4. Redeploy both

Both repos need a redeploy to pick up the new env vars. The analytics cron runs daily at 06:00 UTC — first signal arrives the morning after redeploy.

## Smoke test (after all 4 operator actions)

Manually invoke the analytics cron via the existing `/api/cron/briefings` handler with the proper `CRON_SECRET` Bearer (separate from `CRON_PING_SECRET`):

```bash
curl -X POST https://analytics.signalstudio.ie/api/cron/briefings \
  -H "authorization: Bearer $ANALYTICS_CRON_SECRET"
```

Then load `https://signalstudio.ie/hq/health` — should show green status with last-run timestamp matching the test invocation.

## What this does NOT do

- No alerting (email/Slack ping when red). v1 is dashboard-poll only. Add when there's a forcing function (first real cron failure that didn't surface).
- No multi-source view yet. Only `analytics_daily` reports. Add `tasks_*` or `roadmap_*` sources when those products grow scheduled jobs.
- No historical view. `/hq/health` shows only the latest run per source. Add a small last-7-runs sparkline when cadence drift becomes a question.
- No staleness alert on `/hq` main dashboard. The signal only shows on the `/hq/health` route. Could fold a status pill into the main dashboard overview tab as a follow-on.

## Reversal

If this turns out to be over-built:
- Drop the route + helper + endpoint + schema entry
- Migration is additive (CREATE TABLE), so no schema rollback needed
- Analytics-side `pingStudio` import is one line; remove it + delete the helper file
