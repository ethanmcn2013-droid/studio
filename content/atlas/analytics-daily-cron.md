---
title: Analytics daily cron + briefing engine
slug: analytics-daily-cron
lens: Processes
owner: Ethan
lastVerified: 2026-05-18
links: [turso-databases-and-reads, five-products-as-a-system, log-cycle-cross-repo-writer]
tags: [vercel.json, 06:00 UTC, CRON_SECRET, RESEND_API_KEY, briefing, 6 triggers, RFC 8058, /api/cron/briefings, ping-studio, STUDIO_CRON_PING_SECRET, CRON_PING_SECRET]
references: [~/Projects/personal/analytics/vercel.json, ~/Projects/personal/analytics/src/app/api/cron/briefings/route.ts, ~/Projects/personal/analytics/src/lib/briefing/triggers.ts, ~/Projects/personal/analytics/src/lib/briefing/prose.ts, ~/Projects/personal/analytics/src/lib/briefing/voice.ts, ~/Projects/personal/analytics/src/lib/briefing/build.ts, ~/Projects/personal/analytics/src/lib/email/dispatch.ts, ~/Projects/personal/analytics/src/lib/ops/ping-studio.ts, src/app/api/internal/cron-ping/route.ts]
summary: Daily 06:00 UTC Vercel cron reads Tasks DB, runs 6-trigger attention engine with rotated phrasings, renders briefing to /app + email via Resend, pings Studio on success. Wired end-to-end; has not yet fired in prod (zero analytics_daily cron_runs rows).
status: complete
pinned: false
execWhat: Every morning at 6am UTC, Analytics reads what each user has on their plate, picks at most three things worth their attention, and sends a short briefing by email and on the website.
execMatters: This is the product's heartbeat. The reason people open the email is that it never overdelivers — three items, not twelve — and the wording rotates so it doesn't sound like a template. The discipline of three is the difference between "I look at this every morning" and "I filter-folded it after a week."
execRisk: If the morning briefing stops arriving, retention drops within a week — the daily habit is the product. The pipeline has a self-check that pings the umbrella when it finishes; if the pings stop — or never start — the operator knows from the HQ Today block. As of this verification the cron has never fired in production: Studio has zero `analytics_daily` rows, so the round-trip is proven in code but not in the wild.

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

- `~/Projects/personal/analytics/vercel.json` — declares the cron: `{ "crons": [{ "path": "/api/cron/briefings", "schedule": "0 6 * * *" }] }`.
- `~/Projects/personal/analytics/src/app/api/cron/briefings/route.ts` — receives the cron call. Exports both `GET` (Vercel cron invokes via GET) and `POST` (manual triggers/tests); both share the same auth + fanout. Bearer `CRON_SECRET` auth, `maxDuration = 60`.
- `~/Projects/personal/analytics/src/lib/briefing/triggers.ts` — the six triggers: `stuck-work`, `due-soon`, `just-shipped`, `overload`, `crowded-week`, `blocked-too-long`. Plan 6 spec'd ten; v1 shipped six, intentionally — overbuilt for an engine no user has stressed yet.
- `~/Projects/personal/analytics/src/lib/briefing/prose.ts` — the phrasing library. `LIBRARY: Record<TriggerKind, Phrasing[]>` — three phrasings per trigger; `phraseFor()` selects by rotation index.
- `~/Projects/personal/analytics/src/lib/briefing/voice.ts` — `selfPhrasings` (you-detection) + `focusPhrasings` (action register for Suggested Focus).
- `~/Projects/personal/analytics/src/lib/briefing/build.ts` — assembles the briefing payload. Entry point is `buildBriefing(source, { userId, email }, now)` — there is no `buildBriefingForUser`; the route calls `buildBriefing` directly.
- `~/Projects/personal/analytics/src/lib/email/dispatch.ts` — Resend wrapper; graceful no-key skip in dev, **hard `ok:false` error in production** when `RESEND_API_KEY` is unset.
- `~/Projects/personal/analytics/src/lib/ops/ping-studio.ts` — fires the cross-repo signal to Studio at the end of each run. Refuses to send its bearer to any non-`signalstudio.ie` https host (credential safety); 2s timeout; never throws.
- `~/Projects/personal/studio/src/app/api/internal/cron-ping/route.ts` — the receiver. Bearer `CRON_PING_SECRET` (Studio-side env), timing-safe. Validates `source` against `CRON_RUN_SOURCES` (`["analytics_daily"]`) and writes a row to the `cron_runs` table.

## HOW

The cron path is a single handler (GET for Vercel, POST for manual). It runs to completion in one Vercel function invocation.

1. **Vercel hits `/api/cron/briefings`** at 06:00 UTC. The route short-circuits to 401 if `CRON_SECRET` is unset (so a missing secret can never be compared against a literal `"Bearer "`), then timing-safe-compares `Authorization: Bearer ${CRON_SECRET}` (length-checked first).
2. **List users.** Analytics's own Turso DB holds `userPreferences` (cadence + lastSentAt + workspace mapping). It selects `cadence='daily'` rows always, and `cadence='weekly'` rows additionally on UTC Mondays. An idempotency cutoff skips any row sent to in the last 20h, so a double-fire (Vercel retry, manual re-trigger, deploy rotation) doesn't spam subscribers; the 20h threshold is < 24h so a daily run that slips a few hours still goes out.
3. **Per user: read Tasks DB.** `getBriefingSource()` selects `tasksDbSource` when `TASKS_DATABASE_URL` + `TASKS_AUTH_TOKEN` are set, otherwise `emptySource` (no mock data in prod). The scoped token is read-only (write attempts blocked at the Turso layer). Lanes are canonicalized (todo/doing/review/done → next/in-flight/in-flight/shipped; blocked derived from `blockedBy`).
4. **Per user: gate, then build.** `resolveEntitlement(userId)` + `fetchFirstName()` run in parallel. Email dispatch is gated on `tierAtLeast(tier, "workspace")` — free users see the briefing on `/app` but the cron returns a `free-tier-no-email` skip without building/sending. For paid users it runs `buildBriefing(source, {userId,email}, now)` — walks the six triggers, ranks Suggested Focus, picks at most three items per bucket (hard cap — never four), rotates phrasing per-user-per-day.
5. **Per user: render + dispatch.** `dispatchBriefing` renders `BriefingEmail` (html) + plain-text, generates a fresh unsubscribe token (written to the DB only on confirmed Resend success — a send failure leaves the prior token valid), sets RFC 2369 + RFC 8058 `List-Unsubscribe` / `List-Unsubscribe-Post` / `List-Id` headers, and stamps `lastSentAt` on success. An empty briefing is a `skipped: empty-briefing` (brand promise). A missing `RESEND_API_KEY` is a graceful skip in dev but `{ ok:false, error:"RESEND_API_KEY missing in production" }` when `NODE_ENV==="production"` — a silent ok:true skip used to let the cron report green while zero emails went out. Fanout is paced (`CONCURRENCY=2`, `CHUNK_PAUSE_MS=1100`) to stay under Resend's ~2 req/s; a rate-limited user leaves `lastSentAt` unset and is retried next run.
6. **End of run: ping Studio.** `pingStudio` POSTs `{ source: "analytics_daily", ranAt, ok, considered, sent, skipped, failed, isMondayUtc }` with `Authorization: Bearer ${STUDIO_CRON_PING_SECRET}` to `STUDIO_CRON_PING_URL`. `ok` is `failed === 0 && warnings.length === 0` (a missing-RESEND warning marks the run not-ok even though no row failed). Studio's receiver validates against its own `CRON_PING_SECRET`, validates the source enum + payload types, and inserts a `cron_runs` row visible in HQ. The ping is fire-and-forget — if it fails or times out (2s), the briefing still ran.

## WHEN — current state

- Wired end-to-end since 2026-05-10 (Cycle 6.5b). **Has not yet fired in production** — Studio holds zero `analytics_daily` rows in `cron_runs`, so the schedule, fanout, and ping round-trip are proven in code and tests but not yet observed live. Until the first real run lands a row, the HQ Today block shows no Analytics cron heartbeat.
- 06:00 UTC daily schedule. Mondays-only weekly variant fires inside the same daily run (weekly-cadence rows are added on UTC Mondays) — there is no second cron; Vercel Hobby caps the daily-cron count at one.
- Per-timezone scheduling is not in this route. (`localHourMatches()` from the 6.5b design is dormant elsewhere; restoring per-TZ delivery needs Vercel Pro or an external hourly trigger with TZ-aware filtering.)
- Required Vercel env (analytics): `CRON_SECRET`, `RESEND_API_KEY`, `TASKS_DATABASE_URL` + `TASKS_AUTH_TOKEN` (scoped read-only), `STUDIO_CRON_PING_URL`, `STUDIO_CRON_PING_SECRET`. Studio side: `CRON_PING_SECRET` (the receiver's bearer). All marked Sensitive in the Vercel dashboard.
- A·5 (2026-05-15, code-review remediation) hardened the failure modes without changing the cron's shape: RESEND-missing is now a hard prod error (was a silent green skip); the Bearer check short-circuits before constructing the expected header; `ping-studio.ts` refuses to send its bearer to any non-`signalstudio.ie` host; the fanout is rate-limit-paced. Also corrected this entry's long-standing "10 triggers" error — the engine has shipped **six** since v1 (the same 4-vs-6 drift A·5 fixed in the marketing copy lived here too).
- 2026-05-16 reverification: corrected the `build.ts` entry point (`buildBriefing`, not `buildBriefingForUser` — the route imports `buildBriefing`); corrected the ping payload to include the `ok` field (computed `failed===0 && warnings.length===0`); documented the 20h idempotency cutoff; named the receiver's `CRON_PING_SECRET`; and added the honest caveat that the cron has never fired in prod. Trigger set, schedule, prose shape (3 per trigger), tier gate, and the ping round-trip are otherwise accurate as documented.

## WHY

The product premise — attention clarity — only earns its keep if the briefing arrives every day without intervention. A cron is the cheapest reliable shape on Vercel. The 06:00 UTC choice is a compromise: it lands before EU mornings without compromising the US window, and Vercel Hobby allows exactly one daily cron, so no second window is available.

The ping-Studio loop is the established cross-repo pattern (see [[log-cycle-cross-repo-writer]]). It exists because a cron that runs in one product is invisible to the umbrella unless it phones home. Phoning home cost ~15 lines of code and one Studio table; not phoning home would have cost a separate dashboard that drifts. The flip side, surfaced by this verification: until a real run lands a `cron_runs` row, "no heartbeat" and "engine fine, just hasn't fired yet" look identical in HQ — the absence of a row is itself the signal to check the schedule is live in prod.

The hard cap of three items is the moat. Every other "AI summary" product over-delivers; the discipline of three is the difference between a briefing that earns being opened and a briefing that gets filter-folded. The phrasing rotation prevents the engine from sounding like a template even though it is one.
