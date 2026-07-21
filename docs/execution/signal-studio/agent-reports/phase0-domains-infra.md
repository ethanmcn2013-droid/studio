# Phase 0 agent report — domains + suite infrastructure (repo-cartographer, 2026-07-21)

Static file inspection by agent; live HTTP checks executed by the lead session the same day.

## (a) Live domain truth (lead session, curl -sI, 2026-07-21)
All seven hosts return **200 with no redirect**: signalstudio.ie · tasks. · notes. · signal. · timeline. · **roadmap.** (legacy host still serving, no canonical redirect — Phase 8 finding) · documents.

## (b) Timeline (roadmap repo) canonical domain
Declared canonical: `https://timeline.signalstudio.ie` — roadmap/AGENTS.md L18; `src/lib/suite-contracts.v1.json` timeline.canonicalUrl; `src/lib/product-urls.ts` (NEXT_PUBLIC_TIMELINE_URL fallback); `src/app/layout.tsx` metadataBase. No sitemap.ts/robots.ts; NO middleware (compiled manifest empty); NO vercel.json; no redirects block in next.config.ts (security headers only); zero `roadmap.signalstudio.ie` alias/redirect rules in-repo. `NEXT_PUBLIC_TIMELINE_SITE_URL` in the migration runbook targets the unified tasks Vercel project, not this repo.

## (c) Per-repo infrastructure
- **roadmap**: Clerk 7.3.1, requireUser() server-side, demo/review synthetic identity. One Turso DB (TURSO_DATABASE_URL) with schema cross-written by tasks' log-cycle.ts; shared entitlements DB read-only; TASKS_DATABASE_URL read-only for milestone sync. Stripe columns exist in entitlements-shared schema but no SDK/webhooks here. No uploads.
- **tasks**: see phase0-tasks-architecture.md (Clerk; Stripe live-wired; local-disk uploads; vercel.json digest cron).
- **notes**: Clerk 7.3.3; one Turso DB; entitlements read-only; no Stripe; calendar-spawn cron 06:00 UTC (CRON_SECRET) — Google-Calendar feature FLAGGED OFF in prod, gated by P08-005/GDPR; NOTES_CAPTURE_INBOUND_SECRET email capture; no uploads.
- **analytics (= Signal product; "signal-dateline" dir does not exist)**: two Turso DBs (TURSO_ANALYTICS_DATABASE_URL + TURSO_DATABASE_URL prefs); Clerk 7.3.1; no Stripe; Resend briefings (RESEND_API_KEY); crons 06:00 briefings + 02:30 analytics; Upstash rate limiting; Sentry; **npm, not pnpm** (only non-pnpm repo). NOTE: .env.example says NEXT_PUBLIC_SITE_URL=analytics.signalstudio.ie vs suite-contracts signal.signalstudio.ie — env divergence to keep in mind.
- **studio**: no Clerk on public surfaces; HQ via SIGNAL_HQ_PASSWORD cookie; no Stripe SDK; writes shared entitlements DB (TURSO_STUDIO_*) via admin APIs; content = filesystem markdown; next.config.ts redirects: /students.html→/students, /brand→/design (permanent), /review→/hq/experience-quality (temp); no vercel.json.

## (d) Open migration-p08 domain/redirect/GDPR decisions (all open, dated 2026-07-21)
- **P08-001** (P0, blocking): approve staged cutover Stage A preview → B merge to tasks main → C redirects → D retirement; runbook `_migration-control/DEPLOYMENT_AND_ROLLBACK.md`.
- **P08-002** (P0, blocking): stage unified-app env vars on tasks Vercel project (incl. NEXT_PUBLIC_TIMELINE_SITE_URL=timeline.signalstudio.ie).
- **P08-007** (P1, blocking Stage C): GDPR — old `/app/account` routes stay UN-redirected until unified settings has per-module export+delete. Default: Stage C redirects everything except /app/account.
- **P08-008** (P1, blocking Stage C): the three old-app redirect commits (notes/timeline/signal `/app/:path*` → tasks.signalstudio.ie/app/<module>) DO NOT EXIST yet; must exclude marketing routes, never-retire routes (timeline public pages /:workspaceSlug and /s/:token; signal unsubscribe tokens), and account routes.
- P08-003 GA4 module dimension before Stage C · P08-004 Signal email stays on old deployment (recommended permanent) · P08-005 Google OAuth console only if Notes calendar ships · P08-006 marketing sites stay on subdomains.

**Collision rule for this programme**: Stage C is the only stage touching domain routing; any edit to old apps' next.config.ts redirect behaviour or /app/account routing collides with P08-007/008. Stage B has zero impact on other domains. Our Phase-8 roadmap.→timeline. host redirect is a different axis (legacy hostname → current hostname of the SAME product) but must be deployed consciously relative to Stage C and never bundled with it.
