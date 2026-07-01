# Signal Studio — Production Readiness Audit

**Date:** 2026-06-18
**Auditor brief:** Senior full-stack production-readiness audit ahead of a 1 September launch.
**Scope audited:** `studio` (umbrella), `tasks`, `notes`, `roadmap` (Timeline), `analytics` (Signal). Evidence gathered by direct code inspection of the five workspace clones on 2026-06-18.
**Verdict in one line:** This is a **real application, not a demo** — real auth (Clerk), real persisted data (Turso/libSQL via Drizzle), real migrations, real Stripe entitlements. But the *operational* layers (CI gates, env validation, observability, backups, rate-limit coverage) are **uneven across the five repos**, and several only exist in `tasks`. That unevenness — not the product code — is the launch risk.

**Production readiness score: 64 / 100.** (Rationale at the end.)

---

## How to read this

Every finding is bucketed:

- **A — Must fix before September 1** (launch blocker or near-blocker)
- **B — Should fix soon after launch**
- **C — Nice-to-have later**
- **D — Not needed yet** (explicitly de-scoped so it doesn't get gold-plated)

Risk levels: **Low / Medium / High / Critical**. "Can implement now" = I (Claude) can do it in-repo without an operator-only credential or dashboard action.

A recurring theme: **`tasks` is the reference implementation.** It has CI, the strongest Sentry coverage, e2e tests, a `vercel.json`, and a `DEPLOY.md`. The fastest path to suite readiness is to **port the `tasks` operational baseline to the other four repos**, not to invent anything new.

---

## 1. Frontend

**What I found.** UI quality is high and consistent — shared brand system, reduced-motion fallbacks, accessibility pages, real empty/loading states (e.g. `analytics` shipped byte-identical loading boundaries and a quiet-day empty state; `notes` has demo-mode seeds). The umbrella homepage hero overflow bug was fixed today (`reveal-loading-showcase.tsx`) and a conversion CTA added. Mobile nav uses a proper flex/hamburger pattern (no layout merge bug).

**Gaps.**
- Cross-product **visual consistency is strong but not contract-enforced** — there is no visual-regression test, so drift between the four product chromes is caught by eye only.
- Accessibility is page-documented but **not CI-checked** (no axe/pa11y in any pipeline).

**Bucket:** B. **Risk:** Low–Medium. **Areas:** all five `src/components`, `src/app/accessibility`.
**Fix:** add `@axe-core/playwright` to the `tasks` e2e and replicate; add a Playwright screenshot baseline for the four hero/marketing pages. **Can implement now:** Yes (tests), but wiring to CI needs the CI itself to exist in the other repos (see §7).

---

## 2. Backend / API logic

**What I found.** Actions are backed by **real server-side logic**, not optimistic UI fakes. `notes/src/server/actions/notes.ts` reads/writes Turso through Drizzle with `requireUser()` gating every call. Clean separation: `server-only` imports, server actions, `src/server/*` data layer.

**Gaps.**
- **No server-side input-validation schema layer** (no zod/valibot at the action boundary that I could find). Validation is ad hoc. For form/payload inputs this is a Medium correctness/abuse risk.
- Error semantics are inconsistent across repos (`notes` has a tagged `UnauthorizedError`; not every repo mirrors that).

**Bucket:** B (validation: borderline A for any public-write endpoint). **Risk:** Medium. **Areas:** `*/src/server/actions/*`.
**Fix:** introduce a thin `zod` parse at each server action entry; standardise the error taxonomy. **Can implement now:** Yes.

---

## 3. Database & storage

**What I found.** Turso/libSQL (SQLite-compatible) via Drizzle ORM in every repo. **Schemas and migrations are real and versioned** — e.g. `tasks/drizzle/0000…0007`, `roadmap/drizzle/0000…0006`, `notes/drizzle/0001…0005`. Data models exist for users, notes, tasks, timelines/roadmaps, briefings, workspaces, entitlements, sponsors, license codes, cron runs. Data persists correctly.

**Gaps.**
- **`roadmap` requires a manual production migration** (`roadmap/drizzle/migrate-prod.sql`: "Run this ONCE manually before deploying"). Manual = human-error and drift risk; there is no record that it ran in prod.
- **No automated, verified backup/restore** for Turso (see §13). SQLite-family + a single primary = a real data-loss surface if not backed up.
- SQLite has **no row-level security** — tenant isolation is 100% application-layer (see §4). A single missing `WHERE userId = ?` is a cross-tenant leak with no database safety net.

**Bucket:** A (manual migration + backup), C (RLS is structural, mitigated by §4). **Risk:** High. **Areas:** `roadmap/drizzle/migrate-prod.sql`, all `drizzle.config.ts`.
**Fix:** convert the manual roadmap migration into a tracked Drizzle migration + a deploy step that runs `drizzle-kit migrate`; turn on Turso point-in-time backup and rehearse a restore. **Can implement now:** Migration conversion — Yes. Backups — operator action (Turso dashboard/CLI).

---

## 4. Authentication & permissions

**What I found — this is a strength.** `notes/src/server/auth.ts` uses **Clerk** server-side; `requireUser()` throws `UnauthorizedError` when there is no session and is called before every read/write. Queries are **user-scoped**: `where(and(eq(notes.id, id), eq(notes.userId, userId)))` on mutations, `eq(notes.userId, userId)` on reads. Demo/review mode short-circuits to an in-memory seed so the real DB is never touched by the synthetic user. `proxy.ts` in each app gates authed vs unauthed rendering.

**Gaps.**
- Isolation is **enforced by convention, not by a guard rail.** There is no automated test asserting "user A cannot read user B's rows," and no DB-level RLS to catch a missed scope. This is the single most important thing to *prove* before launch.
- Workspace/team permission checks should be audited the same way (roadmap/tasks have workspace concepts).

**Bucket:** A. **Risk:** High (Critical if any unscoped query exists). **Areas:** every `src/server/actions/*` and `src/server/*` query.
**Fix:** (1) a cross-tenant isolation **integration test per product** that seeds two users and asserts no leakage; (2) a lint/grep guard in CI that flags a Drizzle `.where(` on a user-owned table that omits the user/workspace predicate. **Can implement now:** Yes — and I recommend this as the #1 immediate change.

---

## 5. Hosting & deployment

**What I found.** Vercel hosts all five (Next.js 16, Turbopack). `tasks` and `analytics`/`notes`/`roadmap` carry `vercel.json`; subdomains are live (`tasks.`, `notes.`, `signal.`, `timeline.`, plus the umbrella). Preview deploys come free from Vercel's GitHub app.

**Gaps.**
- **Production deploys are ungated on four of five repos.** Only `tasks` has CI (§7); for `studio`, `notes`, `roadmap`, `analytics` a push to `main` goes **straight to production** via Vercel with no lint/typecheck/test gate. A broken commit ships.
- **No env-var validation at boot** (see §6) means a missing Vercel env surfaces as a runtime 500, not a failed build.
- Operator-pending env items historically tracked in `docs/OPERATOR_ACTIONS_*` (Upstash for Timeline rate-limit, `CRON_SECRET`, `RESEND_API_KEY`, DKIM, `NOTES_CAPTURE_INBOUND_SECRET`) — **confirm each is set in the right Vercel project before launch.**

**Bucket:** A. **Risk:** High. **Areas:** all repos' Vercel settings, `.github/workflows` (absent in 4/5).
**Fix:** add the `tasks` CI workflow to the other four repos (lint + typecheck + test) as a required check; add env validation. **Can implement now:** CI workflows — Yes. Vercel required-checks + env vars — operator.

---

## 6. Cloud / compute

**What I found.** Nothing fragile or local-only in the request path — all serverless on Vercel + Turso. Background work exists: `notes` ships a **calendar cron** ("Hobby-plan compliant, daily"); `analytics` has a daily briefing cron (`analytics_daily`); studio has cron-run tracking tables (`drizzle/0002_init_cron_runs.sql`).

**Gaps.**
- Crons depend on secrets (`CRON_SECRET`) and Hobby-plan limits (one daily invocation). If launch traffic needs more frequent jobs, the Hobby cadence is a ceiling.
- **No env validation** (no `createEnv`/zod/t3-env in any repo) — a cron with a missing secret fails silently at runtime.

**Bucket:** B (env validation borderline A). **Risk:** Medium. **Areas:** `notes` + `analytics` cron routes, all `process.env` reads.
**Fix:** add a single validated `env.ts` (zod) per repo, imported at the top of the app and cron routes so boot fails loudly on a missing secret. **Can implement now:** Yes.

---

## 7. CI/CD & version control

**What I found.** **`tasks` only** has GitHub Actions: `ci.yml` (lint → typecheck → parser unit test, with `concurrency` cancel-in-progress and `npm ci`) and `deploy.yml` (an intentional **no-op stub** — Vercel's GitHub app handles deploys). Git hygiene is good (atomic, well-messaged commits; `.env*` is gitignored in every repo; no committed secrets found).

**Gaps.**
- **Four of five repos have no CI at all.** No automated safety net before production.
- **No rollback runbook.** Vercel's "promote previous deployment" exists but isn't documented as the rollback path; DB migrations are forward-only with no documented down-path.
- e2e smoke (`tasks/e2e`) is **not run in CI** (needs a running dev server) — it's a manual pre-launch step.

**Bucket:** A. **Risk:** High. **Areas:** `.github/workflows/` (missing in studio/notes/roadmap/analytics).
**Fix:** copy `tasks/.github/workflows/ci.yml` into the other four (adjust the test step per repo's test script); write a one-page `ROLLBACK.md` (revert commit → Vercel instant rollback → migration caveats). **Can implement now:** Yes — high value, low effort.

---

## 8. Security & data access

**What I found — mostly good.** No `.env` files committed; `.env*` is gitignored. No live secrets in tracked source (the one `sk_live|whsec_` grep hit in `tasks` is a **false positive** — it's a security-checklist seed string telling you to grep the bundle). Secrets are server-side via `server-only`. Clerk handles auth tokens.

**Gaps.**
- **CSP is in Report-Only mode across the products** (per suite docs) — it observes but does not enforce. Promote to enforce before launch once the report stream is clean.
- **No RLS** (structural, see §3/§4) — app-layer isolation is the only guard.
- **No automated "no secret in client bundle" check** despite the checklist calling for it — make it a CI step (`grep` the `.next/static` output).

**Bucket:** A (CSP enforce + isolation test), B (bundle-secret check). **Risk:** High. **Areas:** each `next.config.ts` headers, CI.
**Fix:** flip CSP to enforce per product after verifying the Report-Only stream; add the bundle-secret grep to CI; ship the §4 isolation tests. **Can implement now:** Yes (CSP code + CI checks); the report-stream review is a judgment call to do per product.

---

## 9. Rate limiting

**What I found.** Uneven. Refs to Upstash/ratelimit: `roadmap` (4), `studio` (3), `tasks` (2), `notes` (1), **`analytics`/Signal (0 — none).** Timeline's rate limiting historically depends on an **operator-provisioned Upstash** instance (without it, writes were documented as failing/limited in prod).

**Gaps.**
- **Signal (`analytics`) has no rate limiting** on any endpoint — if it exposes a public briefing/API route, it is unprotected against abuse.
- Auth endpoints are Clerk-hosted (Clerk rate-limits its own), but **app-level public endpoints** (capture email, public timelines, briefing) need coverage.
- Verify the TimelineUpstash instance is actually provisioned in Vercel (long-standing operator action).

**Bucket:** A for any public write endpoint; B for the rest. **Risk:** Medium–High. **Areas:** `analytics/src` routes; `roadmap` Upstash binding.
**Fix:** add a shared Upstash rate-limit wrapper to Signal's public routes; confirm Timeline's Upstash binding. **Can implement now:** Code — Yes. Upstash provisioning — operator.

---

## 10. Caching & CDN

**What I found.** Vercel's edge CDN fronts everything; Next 16 handles static assets and ISR/route caching. Marketing pages are largely static/server-rendered.

**Assessment:** **Adequate for launch.** No bespoke caching layer is needed at expected launch volume.

**Bucket:** D (now) / C (later). **Risk:** Low. **Fix:** revisit `Cache-Control` on the public timeline/briefing routes if they become hot. **Can implement now:** Yes, if/when needed — not now.

---

## 11. Load balancing & scaling

**What I found.** Serverless functions scale horizontally on Vercel automatically; the bottleneck is **Turso** (single primary per DB) and any unbounded query.

**What actually matters for launch:**
- **100 users:** no problem.
- **1,000 users:** fine, assuming indexed hot queries (`tasks/drizzle/0003_hot_indexes.sql` exists — good sign; verify the others have indexes on `userId`/`workspaceId`).
- **10,000 users:** Turso write throughput on the busiest DB and any N+1 in list views become the limiters; consider Turso embedded replicas / read replicas. Not a Sept-1 concern at realistic early volume.

**Bucket:** C/D. **Risk:** Low for launch. **Areas:** Drizzle indexes across repos.
**Fix:** confirm `userId`/`workspaceId` indexes exist on the large tables in every repo (only `tasks` clearly shows a hot-index migration). **Can implement now:** Yes (add index migrations).

---

## 12. Observability & logs

**What I found.** Uneven, mirroring §9. Sentry refs: **`tasks` (12 — strong)**, `studio` (4), `roadmap` (1), **`notes` (0), `analytics`/Signal (0).** Vercel gives you function logs and (per the privacy page) cookieless Vercel Analytics for traffic.

**Gaps.**
- **Notes and Signal have no error tracking.** A user-impacting failure there is invisible until a user reports it. For Notes (capture is the core promise) this is a Medium–High blind spot.
- No uptime monitor / alerting on the cron jobs (did the daily briefing actually send?).

**Bucket:** A (Sentry in Notes + Signal), B (cron alerting). **Risk:** High. **Areas:** `notes`, `analytics` instrumentation.
**Fix:** add `@sentry/nextjs` to Notes and Signal (copy the `tasks` setup); add a dead-man's-switch / log assertion on cron success. **Can implement now:** Yes (code + config); the Sentry DSN env is an operator paste.

---

## 13. Availability & recovery

**What I found.** This is the **weakest area.** I found **no automated backup or documented restore plan** for the Turso databases in any repo. Dependency posture: if Vercel is down, the apps are down; if Turso is down, data is unreachable; if Clerk is down, no one can sign in. These are reasonable SaaS dependencies — but there is no documented degradation/runbook.

**Gaps.**
- **No verified backup → no restore.** A bad migration or accidental delete is currently unrecoverable beyond Turso's own retention defaults.
- No status/incident page or documented failure modes.

**Bucket:** A (backup + restore rehearsal). **Risk:** Critical (data loss is unrecoverable and irreversible). **Areas:** Turso config (operator).
**Fix:** enable Turso scheduled backups / point-in-time restore on every prod DB; **rehearse one restore** before launch; write `RECOVERY.md` listing each provider's failure mode and the response. **Can implement now:** `RECOVERY.md` and the migration safety net — Yes. Enabling backups — operator (Turso).

---

## Production readiness score: 64 / 100

| Dimension | Weight | Score | Note |
|---|---|---|---|
| Product/frontend quality | 15 | 14 | Genuinely strong, consistent, accessible |
| Backend correctness & persistence | 15 | 12 | Real, but no validation layer |
| Auth & tenant isolation | 20 | 14 | Real Clerk + scoping; **unproven by tests, no RLS** |
| Data safety (migrations + backup) | 15 | 6 | Manual roadmap migration; **no verified backup** |
| Deploy safety (CI/CD, env, rollback) | 15 | 7 | CI on 1/5; ungated prod; no env validation |
| Observability | 10 | 5 | Strong in tasks, **absent in Notes/Signal** |
| Rate limiting / abuse | 5 | 3 | Uneven; Signal unprotected |
| Scaling/caching readiness | 5 | 3 | Fine for launch volume |
| **Total** | **100** | **64** | Real app; operational layers uneven |

A 64 means: **the product is launchable, the operations are not yet trustworthy.** The product code would not embarrass you. The thing that could hurt you is an unbacked-up database, an ungated deploy shipping a regression, or a cross-tenant leak you can't see because Notes has no Sentry. Close those and you are comfortably in the 80s.

---

## Launch-blocker list (the only things that truly gate September 1)

1. **Verified Turso backup + one rehearsed restore** on every production DB. *(Critical — irreversible data loss.)* — operator + me (`RECOVERY.md`).
2. **Cross-tenant isolation test per product** proving user A cannot read user B. *(High.)* — me.
3. **CI gate on all five repos** (lint + typecheck + test) as a required check before prod. *(High.)* — me (workflows) + operator (Vercel required checks).
4. **Sentry in Notes and Signal.** *(High — core flows currently blind.)* — me + operator (DSN).
5. **Timeline manual migration → tracked migration**, and confirm it has run in prod. *(High.)* — me.
6. **Confirm operator env items are set** (Upstash for Timeline, `CRON_SECRET`, `RESEND_API_KEY`, Sentry DSNs, `NOTES_CAPTURE_INBOUND_SECRET`). *(High.)* — operator.
7. **Rate-limit Signal's public endpoints.** *(Medium–High.)* — me + operator (Upstash binding).
8. **Promote CSP from Report-Only to enforce** once the report stream is clean. *(High.)* — me + judgment.

If only #1 and #2 get done, do those two — they cover the two irreversible risks (lost data, leaked data).

---

## Practical implementation plan (sequenced, ~1 week of focused work)

**Day 1 — make deploys safe.** Port `tasks/.github/workflows/ci.yml` to studio, notes, roadmap, analytics. Add a validated `env.ts` (zod) to each. Add the "no secret in client bundle" grep to CI.

**Day 2 — prove isolation.** Write a two-user cross-tenant integration test per product; add a CI grep guard for unscoped `.where(` on user-owned tables. Fix anything it surfaces.

**Day 3 — stop data loss.** Enable Turso backups on all prod DBs; rehearse a restore; convert `roadmap/migrate-prod.sql` to a tracked Drizzle migration; write `ROLLBACK.md` + `RECOVERY.md`.

**Day 4 — see failures.** Add Sentry to Notes and Signal; add cron success assertions / a dead-man's switch; verify the daily briefing actually sends.

**Day 5 — close abuse + headers.** Rate-limit Signal's public routes; confirm TimelineUpstash; flip CSP to enforce per product after reviewing reports.

**Buffer — operator items.** Confirm every Vercel env var and required-check is set; run the `tasks` e2e against a preview URL once.

---

## Minimum viable production architecture for Signal Studio

```
                       ┌──────────────────────────────────────────┐
   Users ──HTTPS──►    │  Vercel Edge (CDN + WAF + rate-limit)     │
                       │  Next.js 16 (App Router, proxy.ts auth)   │
                       └───────────────┬──────────────────────────┘
                                       │ server actions / route handlers
                        ┌──────────────┼───────────────────────────┐
                        ▼              ▼                ▼           ▼
                    Clerk          Turso/libSQL     Upstash      Stripe
                  (identity,       (Drizzle, per-   (rate-limit  (entitlements,
                   sessions)        product DB,     + cache)      Venue Edition)
                                    user-scoped)
                        │              │
                        │              └── Scheduled backups + PITR  ← (gap to close)
                        │
                   Sentry (errors, ALL products)  ← (gap: Notes/Signal)
                   Vercel Analytics (cookieless traffic)
                   GitHub Actions CI gate, ALL repos  ← (gap: 4/5 missing)
```

**The MVP contract, stated plainly:** every product gets (1) a CI gate, (2) validated env at boot, (3) user-scoped queries proven by a test, (4) Sentry, (5) rate-limited public endpoints, (6) a backed-up DB with a rehearsed restore. Four of those six are already true in `tasks`. The work is making them true everywhere.

---

## Prioritized code changes I recommend making immediately

1. **`env.ts` (zod) per repo** — fail boot on missing secrets. *(I can do this now.)*
2. **CI workflow per repo** — copy from `tasks`. *(Now.)*
3. **Cross-tenant isolation tests** — `notes`, `tasks`, `roadmap`, `analytics`. *(Now — highest value.)*
4. **Unscoped-query CI grep guard.** *(Now.)*
5. **Convert `roadmap/migrate-prod.sql` → tracked Drizzle migration.** *(Now.)*
6. **`@sentry/nextjs` wiring in Notes + Signal.** *(Now; DSN is an operator paste.)*
7. **Rate-limit wrapper on Signal public routes.** *(Now; Upstash binding is operator.)*
8. **`ROLLBACK.md` + `RECOVERY.md`.** *(Now.)*

---

## Progress — started same day (2026-06-18)

Two of the launch blockers were started immediately:

**Blocker #3 — CI gate on all five repos: DONE (pending operator wiring).**
A `ci.yml` now exists in `studio`, `notes`, `roadmap`, `analytics`, and a
corrected one in `tasks` (its old workflow used `npm ci` but the repo is
pnpm-only — it could not have installed). Required gates: **typecheck +
test**, both verified green locally across all five. Lint runs as an
informational (non-blocking) step because it is currently red/broken in
several repos (roadmap ~18 errors, analytics ~11, and Next 16 removed
`next lint` in studio) — clearing that lint debt is a fast follow. **Operator
action:** mark the `verify` check **Required** on the `main` branch in each
repo's GitHub settings so a red gate actually blocks merge.

Along the way this surfaced and fixed a real bug: the `check-suiteloader-identity.sh`
guard's sealed `CANONICAL_SHA` was stale — **studio was failing its own
canonical identity check** — so the `test` gate was red across the whole
suite. All five `SuiteLoader.tsx` files are byte-identical (`aaa5246…`); the
constant was re-sealed to match.

**Blocker #2 — cross-tenant isolation tests: DONE (all four products).**
A static isolation guard now ships in **notes** (`src/server/cross-tenant-isolation.test.mjs`,
wired into `pnpm test` → CI). It scans every server-side data-access file
and fails if a read/mutation of an owner-scoped table is neither tenant-scoped
nor carries an explicit `isolation-ok:` justification. It already proved its
worth: it flagged the fleet-wide calendar-spawn cron (correctly global — now
documented with a waiver) and confirmed every tenant-facing notes query is
scoped.

**Update — all four products now have isolation guards (shipped).** Each was
tailored to that product's real isolation model rather than forced into one
shape:
- **notes** — inline scope guard (per-user `WHERE user_id`). Waived the
  fleet-wide calendar-spawn cron.
- **analytics (Signal)** — inline scope guard (`clerkId`/`userId`). Waived the
  CRON_SECRET-guarded daily-briefing fanout.
- **roadmap (Timeline)** — public-by-default guard (`workspaceSlug`/
  `ownerUserId`/`published` are scope-equivalent). Waived `getWorkspace(slug)`
  (public read by design — no private workspaces) and two owner-scoped
  account-deletion cascade deletes.
- **tasks** — **access-guard-aware** guard (tasks isolates via a validated
  active workspace + query-by-id, not inline scope). Asserts the choke points
  hold: `getActiveWorkspace` validates cookie membership before honoring it,
  `getCurrentUser` fails closed in production, and every mutating action
  resolves the tenant through those helpers.

**Secondary finding — RESOLVED 2026-06-19:** the GTM-roadmap actions in
`tasks/src/server/actions/roadmap.ts` are now gated operator-only via a shared
`requireAdmin()` (`src/server/admin.ts`, `ADMIN_USER_IDS` allowlist, fail-closed),
factored out of the comp-code minter that already used it. **Operator: set
`ADMIN_USER_IDS`** (your Clerk user id) in the Tasks Vercel project — until then the
roadmap editor is locked to everyone in production (safe default). Original finding
kept below for the record.

**Secondary finding surfaced by the tasks guard (NEW, for triage):**
`tasks/src/server/actions/roadmap.ts` exposes 7 `"use server"` actions
(`cycleTimelineStatusAction`, `setTimelineNoteAction`, …) that mutate the
GLOBAL GTM-roadmap tables (`roadmap_items`/`blockers`/`action_items`, parsed
from `docs/gtm-plan.md`) **by id with no authentication at all**. This is not
a cross-tenant leak — the data is shared operator/marketing state, not per-user
— but any caller who can reach the action can flip the status or notes of the
shared `/roadmap` view. **Risk: Low–Medium** (integrity/defacement of an
internal-ish surface). **Recommended fix:** decide who may edit the GTM
roadmap (almost certainly operator-only) and gate these actions accordingly —
at minimum `getCurrentUser()`, ideally an operator check. Left for an operator
product call, not fixed unilaterally.

**Blocker #4 — Sentry in Notes + Signal: DONE.** Both repos now carry the
Tasks reference setup verbatim — `instrumentation.ts` (server + edge +
`onRequestError`), `instrumentation-client.ts` (browser), and a PII scrubber
(`sendDefaultPii:false`, cookies/IP/Clerk tokens stripped). All DSN-gated, so
they no-op until the operator pastes the project DSNs into Vercel. Signal's
init runs on the Node runtime, so the daily-briefing cron's failures are now
captured (closing the silent-cron blind spot). CSP extended with Sentry ingest
hosts in both (Notes enforces CSP, so this was required, not optional). Both
typecheck + production-build clean.

Net: CI is in place everywhere; cross-tenant isolation has an automated
per-model guard on all four products; and error tracking now covers the whole
suite (Tasks, Notes, Signal strong; Studio + Timeline already had partial).
The remaining blockers are the operator-gated ones: **verified backups + a
rehearsed restore** (the one Critical, irreversible risk), making the CI
`verify` check **Required**, rate-limiting Signal's public endpoints, and
flipping CSP to enforce.

---

## Progress — 2026-06-19 (second pass)

Three more areas closed, mostly in code:

- **Recovery (blocker #1 groundwork): `studio/docs/RECOVERY.md`** — suite backup/
  restore runbook (DB inventory, provider failure modes, PITR + daily-dump strategy,
  restore procedure, rehearsal checklist). The enabling steps (enable Turso PITR,
  rehearse one restore) remain operator actions — that's still the one open Critical
  risk. Also documented Timeline's real migration workflow (`roadmap/drizzle/
  MIGRATIONS.md`) and annotated `migrate-prod.sql` as `ALREADY APPLIED — DO NOT RUN`
  (it deploys via `drizzle-kit push`, so there was no journal to "convert" it into).

- **Rate limiting (audit §9): DONE for Signal.** A gated Upstash sliding-window
  limiter (`analytics/src/lib/ratelimit.ts`) — no-ops/allows until Upstash is
  provisioned, fails open on Redis errors. Applied to `/api/unsubscribe/[token]`
  (60/min per IP) and `/api/account/delete` (5/min per user). Operator: provision
  Upstash for the Signal project to switch it on.

- **Env validation (audit §6): DONE across all five repos.** Each has a `src/env.ts`
  that checks the vars the app cannot run without and fails loudly **at boot** in
  real production (skips demo/review/dev), instead of 500ing at runtime. Per-repo
  shape: tasks/notes/Signal throw on missing DB + Clerk; Timeline throws on its DB
  (Clerk recommended — public timelines need no auth); **Studio is warn-only by
  design** (the public marketing umbrella must stay up even if HQ's DB is
  misconfigured). Dependency-free (no zod). Wired via `instrumentation.ts`.

- **GTM-roadmap authz (secondary finding): DONE.** `tasks/actions/roadmap.ts` is now
  operator-gated via `requireAdmin()` (`ADMIN_USER_IDS`). Operator: set that env.

- **CSP reporting (precursor to §8 enforce): DONE for the four Report-Only repos.**
  The Report-Only policies were reporting to nowhere — there was no evidence any was
  clean. Each of tasks/Signal/Studio/Timeline now has a `/api/csp-report` collector
  (logs one `[csp-report]` line per violation) wired via `report-uri` + `report-to` +
  a `Reporting-Endpoints` header (tasks also allowlists the route in `proxy.ts`).
  **This de-risks the enforce flip:** watch the function logs for `[csp-report]` for a
  week; once clean, flip `Content-Security-Policy-Report-Only` → `Content-Security-Policy`
  per product. (Notes already enforces; it could get the same collector to catch real
  blocks — a quick follow-up.)

Net after this pass: of the launch blockers, **#2 isolation, #3 CI, #4 observability,
§6 env validation, §9 rate-limiting (Signal), the GTM-roadmap authz gate, and CSP
reporting are done in code.** What remains is genuinely operator-gated: **verified Turso
backups + one rehearsed restore** (the only Critical, irreversible risk), pasting the
**Sentry DSNs** / provisioning **Upstash** / setting **`ADMIN_USER_IDS`** in Vercel,
marking the CI **`verify` check Required**, and **flipping CSP to enforce** once the
collector shows a clean week. The code armor is on; the remaining work is dashboard
configuration and one rehearsed restore.

---

— End of audit. Brutally honest summary: **you built a real product, not a polished demo. What you have not yet built is the boring operational armor that keeps a real product from losing or leaking data on a bad day. That armor is ~a week of work, most of it portable from `tasks`.**
