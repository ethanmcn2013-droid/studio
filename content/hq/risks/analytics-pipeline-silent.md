---
id: analytics-pipeline-silent
title: Signal daily briefing pipeline does not actually fire in production.
category: Product
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-05-23
---

## Mitigation

Re-confirmed 2026-05-16 during the atlas re-verification: Studio's `cron_runs` table has zero `analytics_daily` rows — the cron has never successfully fired in production. The code path is correct (verified end to end: `0 6 * * *` Vercel cron → timing-safe auth → `buildBriefing` → Resend dispatch → `pingStudio` → Studio `cron_runs`). It has never run because it is environment-gated, not code-broken.

Deliberately NOT cleared: "code is correct" is not "the briefing landed". This stays an open product risk until one real morning briefing is observed end to end. It is operator-gated.

Operator action (set on the **signal** Vercel project, Production): `CRON_SECRET` (any strong random string — gates the cron route), `RESEND_API_KEY` (from the Resend account — without it briefings are skipped and the run is marked not-ok), `STUDIO_CRON_PING_URL` = `https://signalstudio.ie/api/internal/cron-ping`, `STUDIO_CRON_PING_SECRET` (must equal Studio's `CRON_PING_SECRET`). Plus: generate DKIM in Google Workspace for the sending domain, and sign into Tasks once with Clerk so `listForUser` returns a real user. Step-by-step lives in the operator action pack. Then watch the 06:00 UTC run land before pointing new traffic at /app.

## Notes

Open, honest, operator-gated. Cleared only when a real briefing is observed end to end and HQ shows a green `analytics_daily` row.
