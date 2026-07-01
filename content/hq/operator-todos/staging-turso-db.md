---
id: staging-turso-db
title: Provision a separate staging/preview Turso DB per app
status: open
priority: P0
blocking: true
phase: Phase 1
why: Preview deploys have no DB — the fail-closed guard throws, so Tasks/Signal/Roadmap previews never build and remote UI verification is blocked. Prod creds exist but are Production-scoped only.
href: /hq/health
date: 2026-06-23
---

## Steps

1. Turso dashboard -> Account -> **Platform API Tokens** -> create a token (and note the org slug). This is the one credential an agent cannot self-serve; with it, the rest is scriptable.
2. Create six isolated `*-preview` databases (see map below).
3. Mint an auth token per preview DB.
4. Apply schema to each: run the repo's `drizzle-kit push` against the new preview URL/token (fresh/empty tables are fine — apps boot on an empty schema).
5. Vercel -> each project -> Settings -> Environment Variables -> add the **Preview-scoped** `*_DATABASE_URL` / `*_AUTH_TOKEN` pointing at the preview DBs.
6. Redeploy a preview branch and confirm writes land in the preview DB, not prod.

## Findings (2026-07-01)

Traced the full runtime env map. **No secret is missing** — every Turso
credential already exists in Vercel but is scoped to **Production only, never
Preview**. Each app fail-closes on Vercel without its DB URL, e.g.
`tasks/src/server/db/index.ts:31` and `analytics/src/server/db/index.ts:15`
throw when `VERCEL === "1"` and the DB URL is absent. That is the exact reason
Codex reported Tasks and Signal previews as "env-blocked."

Isolation was chosen over pointing preview at prod. The code comment in
`tasks/src/server/db/index.ts` currently *assumes* preview shares the prod DB —
that assumption is being deliberately dropped so a preview branch can never
mutate prod data.

### Six isolated preview DBs and where each is Preview-scoped

| Preview DB | Preview env vars it feeds | Projects (Preview scope) |
|---|---|---|
| `entitlements-preview` (shared) | `TURSO_ENTITLEMENTS_DATABASE_URL` / `_AUTH_TOKEN` | tasks, analytics, notes, roadmap |
| `tasks-preview` | `TASKS_DATABASE_URL` / `_AUTH_TOKEN` | tasks, analytics, roadmap (both cross-read the tasks DB) |
| `signal-preview` | `TURSO_DATABASE_URL` / `_AUTH_TOKEN` | analytics |
| `analytics-preview` | `TURSO_ANALYTICS_DATABASE_URL` / `_AUTH_TOKEN` | analytics |
| `notes-preview` | `TURSO_DATABASE_URL` / `_AUTH_TOKEN` | notes |
| `roadmap-preview` | `TURSO_DATABASE_URL` / `_AUTH_TOKEN` | roadmap |

### Executable path once the Platform token exists

An agent with the Platform API token + org slug can do steps 2-5 unattended
over the Turso HTTP API (`api.turso.tech`) plus `vercel env add <NAME> preview`,
using the authed CLI user `ethanmcn2013-1730`. No Turso CLI install is required
(none is present on the Windows host).

### Related, tracked separately (not part of this gate)

Notes preview already **builds** — it is blocked only by Vercel **Deployment
Protection (SSO)**, not by the DB. Fix: notes project -> Settings -> Deployment
Protection -> enable **Protection Bypass for Automation**, then fetch previews
with the `x-vercel-protection-bypass` header. Logged here only as a pointer.
