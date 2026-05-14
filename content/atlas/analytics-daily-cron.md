---
title: Analytics daily cron + briefing engine
slug: analytics-daily-cron
lens: Processes
owner: Ethan
lastVerified: 2026-05-14
links: [turso-databases-and-reads, five-products-as-a-system, log-cycle-cross-repo-writer]
tags: [vercel.json, 06:00 UTC, CRON_SECRET, RESEND_API_KEY, briefing, 10 triggers, RFC 8058, /api/cron/briefings, ping-studio, STUDIO_CRON_PING_SECRET]
references: [~/Projects/personal/analytics/vercel.json, ~/Projects/personal/analytics/src/app/api/cron/briefings/route.ts, ~/Projects/personal/analytics/src/lib/briefing/triggers.ts, ~/Projects/personal/analytics/src/lib/briefing/prose.ts, ~/Projects/personal/analytics/src/lib/briefing/voice.ts, ~/Projects/personal/analytics/src/lib/briefing/build.ts, ~/Projects/personal/analytics/src/lib/email/dispatch.ts, ~/Projects/personal/analytics/src/lib/ops/ping-studio.ts]
summary: Daily 06:00 UTC Vercel cron reads Tasks DB, runs 10-trigger attention engine with rotated phrasings, renders briefing to /app + email via Resend, pings Studio on success.
status: complete
pinned: false
execWhat: Every morning at 6am UTC, Analytics reads what each user has on their plate, picks at most three things worth their attention, and sends a short briefing by email and on the website.
execMatters: This is the product's heartbeat. The reason people open the email is that it never overdelivers — three items, not twelve — and the wording rotates so it doesn't sound like a template. The discipline of three is the difference between "I look at this every morning" and "I filter-folded it after a week."
execRisk: If the morning briefing stops arriving, retention drops within a week — the daily habit is the product. The pipeline has a self-check that pings the umbrella when it finishes; if the pings stop, the operator knows within hours.
---

## WHAT

Analytics ships one briefing per user per day. A Vercel cron at 06:00 UTC daily walks every user with a workspace, reads their Tasks DB via a scoped read-only token, runs the briefing engine (10 triggers, per-user phrasing rotation, hard cap of three items), renders the result to both the `/app` web view and a Resend-dispatched email, then pings Studio's `/api/internal/cron-ping` with the run summary so HQ knows the engine ran.

```mermaid
flowchart LR
  C[Vercel cron 06:00 UTC] --> R[/api/cron/briefings]
  R -->|ro token| TD[Tasks DB read]
  R --> E[Briefing engine — 10 triggers]
  E --> W[/app render]
  E --> M[Resend email]
  R --> P[ping-studio]
  P --> S[Studio /api/internal/cron-ping]
```

## WHO

Ethan owns the engine, the prose libraries, the cron, and the receiver. No external operators. Resend handles email delivery; Vercel handles cron scheduling. Both are infrastructure, not owners.

## WHERE

- `~/Projects/personal/analytics/vercel.json` — declares the cron: `{ "path": "/api/cron/briefings", "schedule": "0 6 * * *" }`.
- `~/Projects/personal/analytics/src/app/api/cron/briefings/route.ts` — receives the cron call. Bearer `CRON_SECRET` auth required.
- `~/Projects/personal/analytics/src/lib/briefing/triggers.ts` — the 10 triggers (overdue, blocked, slow-burn, decelerating, etc.).
- `~/Projects/personal/analytics/src/lib/briefing/prose.ts` — the phrasing library (~55 lines across 10 triggers × 3-7 variants).
- `~/Projects/personal/analytics/src/lib/briefing/voice.ts` — `selfPhrasings` (you-detection) + `focusPhrasings` (action register for Suggested Focus).
- `~/Projects/personal/analytics/src/lib/briefing/build.ts` — assembles the briefing payload (entry point: `buildBriefingForUser`).
- `~/Projects/personal/analytics/src/lib/email/dispatch.ts` — Resend wrapper; graceful no-key fallback for local dev.
- `~/Projects/personal/analytics/src/lib/ops/ping-studio.ts` — fires the cross-repo signal to Studio at the end of each run.
- `~/Projects/personal/studio/src/app/api/internal/cron-ping/route.ts` — the receiver. Writes a row to `cron_runs` table with source `analytics_daily`.

## HOW

The cron path is a single GET handler. It runs to completion in one Vercel function invocation.

1. **Vercel hits `/api/cron/briefings`** at 06:00 UTC. The route validates `Authorization: Bearer ${CRON_SECRET}` and 401s anything else.
2. **List users.** Analytics's own Turso DB holds the workspace mapping (which Tasks user-id maps to which Tasks workspace). Iterate.
3. **Per user: read Tasks DB.** Uses the scoped read-only token (write attempts blocked at the Turso layer). Returns a `TaskRead[]` list with canonicalized lanes (todo/doing/review/done → next/in-flight/in-flight/shipped; blocked is derived from `blockedBy`).
4. **Per user: run `buildBriefingForUser`.** Walks the 10 triggers, scores each match, ranks Suggested Focus, picks at most three items (hard cap — never four). Phrasing rotation is per-user-per-trigger, persisted in the Analytics DB so the same phrasing doesn't fire twice in a row.
5. **Per user: render.** The same `Briefing` payload renders two ways — `BriefingView` (RSC at `/app`) and `BriefingEmail` (Resend html). Empty-state and day-one share a single `BriefingEmpty` render.
6. **Per user: dispatch.** `dispatchBriefing` calls Resend with the rendered email, RFC 8058 List-Unsubscribe headers, and a graceful skip when `RESEND_API_KEY` is missing.
7. **End of run: ping Studio.** `ping-studio.ts` POSTs to Studio's cron-ping receiver with `{ source: "analytics_daily", ranAt, considered, sent, skipped, failed, isMondayUtc, notes }` and `Authorization: Bearer ${STUDIO_CRON_PING_SECRET}`. Studio writes a `cron_runs` row visible in HQ. The ping is fire-and-forget — if it fails, the briefing still ran.

## WHEN — current state

- Live since 2026-05-10 (Cycle 6.5b).
- 06:00 UTC daily schedule. Mondays-only weekly variant was dropped — Vercel Hobby plan caps daily-cron count.
- Per-timezone scheduling exists in code (`localHourMatches()`) but is dormant. Restoring it requires Vercel Pro or an external cron triggering hourly with TZ-aware filtering inside the route.
- Required Vercel env: `CRON_SECRET`, `RESEND_API_KEY`, `TASKS_RO_TOKEN`, `STUDIO_CRON_PING_URL`, `STUDIO_CRON_PING_SECRET`. All five marked Sensitive in the Vercel dashboard.

## WHY

The product premise — attention clarity — only earns its keep if the briefing arrives every day without intervention. A cron is the cheapest reliable shape on Vercel. The 06:00 UTC choice is a compromise: it lands before EU mornings without compromising the US window, and Vercel Hobby allows exactly one daily cron, so no second window is available.

The ping-Studio loop is the established cross-repo pattern (see [[log-cycle-cross-repo-writer]]). It exists because a cron that runs in one product is invisible to the umbrella unless it phones home. Phoning home cost ~15 lines of code and one Studio table; not phoning home would have cost a separate dashboard that drifts.

The hard cap of three items is the moat. Every other "AI summary" product over-delivers; the discipline of three is the difference between a briefing that earns being opened and a briefing that gets filter-folded. The phrasing rotation prevents the engine from sounding like a template even though it is one.
