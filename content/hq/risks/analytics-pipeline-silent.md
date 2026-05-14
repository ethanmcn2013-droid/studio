---
id: analytics-pipeline-silent
title: Analytics daily briefing pipeline does not actually fire in production.
category: Product
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-05-19
---

## Mitigation

Dispatch correctness bug fixed 2026-05-12 (token rotation moved into Resend success branch, cron auth timing-safe, mock fallback removed). Remaining operator work: set CRON_SECRET + RESEND_API_KEY on the analytics Vercel project; generate DKIM in Google Workspace; sign into Tasks once with Clerk so listForUser returns a real user. Then watch one morning briefing land end-to-end before pointing new traffic at /app.
