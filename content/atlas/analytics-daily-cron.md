---
title: Analytics daily cron + briefing engine
slug: analytics-daily-cron
lens: Processes
owner: Ethan
lastVerified: 2026-05-15
links: [turso-databases-and-reads, five-products-as-a-system, log-cycle-cross-repo-writer]
tags: [vercel.json, 06:00 UTC, CRON_SECRET, RESEND_API_KEY, briefing, 6 triggers, RFC 8058, /api/cron/briefings, ping-studio, STUDIO_CRON_PING_SECRET]
references: [~/Projects/personal/analytics/vercel.json, ~/Projects/personal/analytics/src/app/api/cron/briefings/route.ts, ~/Projects/personal/analytics/src/lib/briefing/triggers.ts, ~/Projects/personal/analytics/src/lib/briefing/prose.ts, ~/Projects/personal/analytics/src/lib/briefing/voice.ts, ~/Projects/personal/analytics/src/lib/briefing/build.ts, ~/Projects/personal/analytics/src/lib/email/dispatch.ts, ~/Projects/personal/analytics/src/lib/ops/ping-studio.ts]
summary: Daily 06:00 UTC Vercel cron reads Tasks DB, runs 6-trigger attention engine with rotated phrasings, renders briefing to /app + email via Resend, pings Studio on success.
status: complete
pinned: false
execWhat: Every morning at 6am UTC, Analytics reads what each user has on their plate, picks at most three things worth their attention, and sends a short briefing by email and on the website.
execMatters: This is the product's heartbeat. The reason people open the email is that it never overdelivers — three items, not twelve — and the wording rotates so it doesn't sound like a template. The discipline of three is the difference between "I look at this every morning" and "I filter-folded it after a week."
execRisk: If the morning briefing stops arriving, retention drops within a week — the daily habit is the product. The pipeline has a self-check that pings the umbrella when it finishes; if the pings stop, the operator knows within hours.
---

## WHAT

Analytics ships one briefing per user per day. A Vercel cron at 06:00 UTC daily walks every user with a workspace, reads their Tasks DB via a scoped read-only token, runs the briefing engine (six triggers, per-user phrasing rotation, hard cap of three items), renders the result to both the `/app` web view and a Resend-dispatched email, then pings Studio's `/api/internal/cron-ping` with the run summary so HQ knows the engine ran.

```mermaid
flowchart LR
  C[Vercel cron 06:00 UTC] --> R[/api/cron/briefings]
  R -->|ro token| TD[Tasks DB read]
  R --> E[Briefing engine — 6 triggers]
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
- `~/Projects/personal/analytics/src/lib/briefing/triggers.ts` — the six triggers: `stuck-work`, `due-soon`, `just-shipped`, `overload`, `crowded-week`, `blocked-too-long`. Plan 6 spec'd ten; v1 shipped six, intentionally — overbuilt for an engine no user has stressed yet.
- `~/Projects/personal/analytics/src/lib/briefing/prose.ts` — the phrasing library (six triggers × three phrasings).
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
4. **Per user: run `buildBriefing`.** Walks the six triggers, scores each match, ranks Suggested Focus by `(cascade, irreversibility, proximity)`, picks at most three items per bucket (hard cap — never four). Phrasing rotation is a per-user-per-day index so the same phrasing doesn't fire two days running. Email dispatch is gated on `workspace`-tier+ — free users read the briefing on `/app` but the cron skips their email (the test-send action enforces the same gate).
5. **Per user: render.** The same `Briefing` payload renders two ways — `BriefingView` (RSC at `/app`) and `BriefingEmail` (Resend html). Empty-state and day-one share a single `BriefingEmpty` render.
6. **Per user: dispatch.** `dispatchBriefing` calls Resend with the rendered email and RFC 8058 List-Unsubscribe headers. A missing `RESEND_API_KEY` is a graceful skip in development but a **hard error in production** — a silent ok:true skip used to let the cron report green while zero emails went out. The unsubscribe token rotates only on confirmed send. The fanout is paced (2 at a time, ~1.1s between chunks) to stay under Resend's rate limit; a rate-limited user leaves `lastSentAt` unset and is retried next run.
7. **End of run: ping Studio.** `ping-studio.ts` POSTs to Studio's cron-ping receiver with `{ source: "analytics_daily", ranAt, considered, sent, skipped, failed, isMondayUtc, notes }` and `Authorization: Bearer ${STUDIO_CRON_PING_SECRET}`. Studio writes a `cron_runs` row visible in HQ. The ping is fire-and-forget — if it fails, the briefing still ran.

## WHEN — current state

- Live since 2026-05-10 (Cycle 6.5b).
- 06:00 UTC daily schedule. Mondays-only weekly variant was dropped — Vercel Hobby plan caps daily-cron count.
- Per-timezone scheduling exists in code (`localHourMatches()`) but is dormant. Restoring it requires Vercel Pro or an external cron triggering hourly with TZ-aware filtering inside the route.
- Required Vercel env: `CRON_SECRET`, `RESEND_API_KEY`, `TASKS_DATABASE_URL` + `TASKS_AUTH_TOKEN` (scoped read-only), `STUDIO_CRON_PING_URL`, `STUDIO_CRON_PING_SECRET`. All marked Sensitive in the Vercel dashboard.
- A·5 (2026-05-15, code-review remediation) hardened the failure modes without changing the cron's shape: RESEND-missing is now a hard prod error (was a silent green skip); the Bearer check short-circuits before constructing the expected header; `ping-studio.ts` refuses to send its bearer to any non-`signalstudio.ie` host; the fanout is rate-limit-paced. Also corrected this entry's long-standing "10 triggers" error — the engine has shipped **six** since v1 (the same 4-vs-6 drift A·5 fixed in the marketing copy lived here too).

## WHY

The product premise — attention clarity — only earns its keep if the briefing arrives every day without intervention. A cron is the cheapest reliable shape on Vercel. The 06:00 UTC choice is a compromise: it lands before EU mornings without compromising the US window, and Vercel Hobby allows exactly one daily cron, so no second window is available.

The ping-Studio loop is the established cross-repo pattern (see [[log-cycle-cross-repo-writer]]). It exists because a cron that runs in one product is invisible to the umbrella unless it phones home. Phoning home cost ~15 lines of code and one Studio table; not phoning home would have cost a separate dashboard that drifts.

The hard cap of three items is the moat. Every other "AI summary" product over-delivers; the discipline of three is the difference between a briefing that earns being opened and a briefing that gets filter-folded. The phrasing rotation prevents the engine from sounding like a template even though it is one.
