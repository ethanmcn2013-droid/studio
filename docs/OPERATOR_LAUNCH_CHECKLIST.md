# Operator Launch Checklist

**Updated:** 2026-06-20 · **Owner:** Ethan
**What this is:** the dashboard/credential actions that close out the production-readiness
audit (`docs/PRODUCTION_READINESS_AUDIT_2026-06-18.md`). All of these are things only you
can do — the code side is done. Ordered by priority. Check them off as you go.

> ⚠️ **Read this first — env validation now fails a misconfigured prod boot.**
> Each product now validates its environment at boot (`src/env.ts`). If a **required**
> var is missing in a real-production deploy, the app **refuses to boot** (visible build/
> deploy failure) instead of 500ing later. So §1 (env vars) isn't optional polish — a
> deploy with missing DB/Clerk keys will not come up. See the per-project table in §1.

---

## 0 · 🔴 CRITICAL — back up the databases (irreversible risk)

The one thing that can cause **permanent** loss. Nothing else on this list is irreversible.
Full runbook: `docs/RECOVERY.md`.

- [ ] Enable **Turso point-in-time restore (PITR)** on every production DB (Turso dashboard →
      each database → Backups). Inventory of which DBs in `RECOVERY.md` §2.
- [ ] Stand up a **daily logical dump** job (Vercel cron or GitHub Action) → durable storage,
      ≥ 14-day retention. Snippet in `RECOVERY.md` §3.
- [ ] **Rehearse ONE restore** into a throwaway DB and record the elapsed time. *A backup you
      have never restored is not a backup.* — `RECOVERY.md` §4.

---

## 1 · Environment variables (required, or prod won't boot)

Set these in each Vercel **project** → Settings → Environment Variables (Production). Mark
secrets as **Sensitive**.

| Project | Required (boot fails without) | Recommended (feature degrades) |
|---|---|---|
| **Tasks** | `TASKS_DATABASE_URL`, `TASKS_AUTH_TOKEN`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CRON_SECRET`, `RESEND_API_KEY` |
| **Notes** | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | `CRON_SECRET`, `NOTES_CAPTURE_INBOUND_SECRET` |
| **Signal** (analytics) | `TURSO_ANALYTICS_DATABASE_URL`, `TURSO_ANALYTICS_AUTH_TOKEN`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | `TURSO_DATABASE_URL` (prefs), `RESEND_API_KEY`, `CRON_SECRET` |
| **Timeline** (roadmap) | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | Clerk keys (owner sign-in), `TURSO_ENTITLEMENTS_*` |
| **Studio** | *(warn-only — never blocks the marketing site)* | `TURSO_STUDIO_DATABASE_URL/_AUTH_TOKEN`, `TURSO_ENTITLEMENTS_*` |

- [ ] Confirm every **Required** cell above is set in the matching Vercel project.
- [ ] Confirm the **Recommended** ones for features you're launching (email, billing, crons).

---

## 2 · Turn on what's already wired (DSN-/token-gated, no code change)

- [ ] **Sentry — Notes + Signal.** Paste the project DSNs: `SENTRY_DSN`,
      `NEXT_PUBLIC_SENTRY_DSN` (and `SENTRY_ENVIRONMENT=production`,
      `NEXT_PUBLIC_SENTRY_ENVIRONMENT=production`). Until set, the SDK no-ops.
      *(Tasks/Studio/Timeline already had Sentry.)*
- [ ] **Upstash — Signal.** Provision Upstash Redis (Vercel → Integrations → Upstash) and
      add `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` to the Signal project. This
      switches on rate limiting for `/api/unsubscribe/[token]` + `/api/account/delete`.
      Until set, the limiter allows everything (fails open).
- [ ] **`ADMIN_USER_IDS` — Tasks.** Set to your Clerk user id (comma-separated for more than
      one operator). Until set, the GTM-roadmap editor (`/roadmap`) is locked to everyone in
      production — fail-closed, but you won't be able to edit it.

---

## 3 · Make CI actually block (1 minute per repo)

CI (`verify`: typecheck + test) runs on every push/PR to `main` in all five repos, but a
red run only *reports* — it doesn't block a merge until you mark it required.

- [ ] For each repo (studio, tasks, notes, roadmap, analytics): GitHub → Settings → Branches
      → Branch protection for `main` → require status check **`verify`** to pass before merge.

---

## 4 · Promote CSP to enforce (after a clean week)

Every product now has a `/api/csp-report` collector. Report-Only currently *observes*;
enforce *blocks*. Don't flip blind — use the data.

- [ ] Watch the Vercel function logs of each product for **`[csp-report]`** lines.
- [ ] For each real violation, add the blocked host to that product's CSP allowlist in
      `next.config.ts` (the `csp` array). Redeploy, confirm the line stops.
- [ ] Once a product logs no violations for ~a week, flip its header from
      `Content-Security-Policy-Report-Only` → `Content-Security-Policy` in `next.config.ts`.
      *(Tell me a product is clean and I'll make the one-line change.)*
- [ ] **Notes already enforces** — treat any `[csp-report]` line there as a live user-facing
      block to fix now.

---

## 5 · Pre-launch smoke (worth doing once)

- [ ] Run the Tasks e2e golden-path against a preview URL (`tasks/e2e`, see `tasks/DEPLOY.md`).
- [ ] Click through each product signed-out and signed-in; confirm no console CSP errors.
- [ ] Trigger the Signal daily-briefing cron once and confirm an email arrives (and that a
      failure would now show in Sentry).

---

### Reference
- Backup/restore detail → `docs/RECOVERY.md`
- Full findings + scores → `docs/PRODUCTION_READINESS_AUDIT_2026-06-18.md`
- Timeline migration workflow → `roadmap/drizzle/MIGRATIONS.md`

When §0 (backups + one rehearsed restore), §1 (required env), and §3 (CI required) are
checked, the suite's launch-blocking risks are closed.
