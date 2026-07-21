# Phase 0 agent report — tasks repo architecture (repo-cartographer, 2026-07-21)

Audited at feat/tasks-hero-lab @ 70375f5 (= main~2). Paths relative to `tasks/`.

## 1. Stack
pnpm 11.9.0 · Next.js 16.2.4 (read `node_modules/next/dist/docs/` before coding — AGENTS.md mandate) · React 19.2.4 · Tailwind v4 · TypeScript/ESLint 9 · Playwright 1.61.
Deps: @clerk/nextjs ^7.3.1 · @libsql/client ^0.17.3 · drizzle-orm ^0.45.2 (+drizzle-kit 0.31.10) · motion ^12.38 · lenis ^1.3.23 · ai ^6 + @ai-sdk/anthropic · stripe ^22.1 · resend ^6.12 · svix · chrono-node · geist · react-markdown+remark-gfm · papaparse · qrcode.
**No Radix/Headless UI, no DnD library** — board uses native HTML5 drag events; dialog/popover primitives hand-rolled in `src/components/primitives/`.

## 2. Database (Turso/libSQL prod, file:tasks.db dev; drizzle sqlite)
Client `src/server/db/index.ts` — fail-closed in Vercel deploys without `TASKS_DATABASE_URL`/`TASKS_AUTH_TOKEN` unless demo mode. 17 migrations (0000–0016; baseline snapshot 0014; 0016 = tasks.archived_at, applied to prod). Schema `src/server/db/schema.ts`:
- **tasks**: id, workspace_id, title, description, lane (todo/doing/review/done; 5th status "waiting" persists as raw text — column unconstrained), priority p0–p3, assignees JSON, due + due_at, estimate, tags JSON, idle_days, blocked_by JSON (dependency graph), recurrence JSON, start_day, duration_days, position (float gap-order), **parent_task_id** (one level; DB triggers `tasks_parent_workspace_guard_insert/update` enforce parent = top-level + same workspace), external_contact_name/email, cents, source_note_id (+extract body/sha), board_column_key, is_milestone, archived_at, created/updated_at.
- **workspaces**: slug, name, owner_user_id, planning_period_id, context_type, primary_date(+label), position, archived_at, revision, active_domain, primary_use_case, onboarding_completed_at, template_id, published_at.
- **workspace_members**: (workspace_id,user_id) PK, role owner|member.
- **users**: id, clerk_id unique, email, handle, name, color, initials. `ensureUserProvisioned()` idempotent on every authed request.
- **comments** / **activities** (kind + JSON payload — the audit trail) / **attachments** (filename, stored_path, mime, size; bytes on LOCAL DISK `.data/uploads/<ws>/<task>/` — durability gap named in docs/data-model.md; seam = `uploadsRoot()` + `GET /api/attachments/[id]`).
- **pending_invites**: token PK, workspace_id, email, invited_by, created/expires/accepted_at, accepted_by.
- **notifications** + **notification_prefs** (daily_digest, mentions, comment_replies).
- **entitlements** (tier resolution `getEffectiveTier(userId, workspaceId)`; studio tier ws=NULL) · **comp_codes** · **processed_webhooks** (Stripe idempotency).
- **share_links** (+share_link_visits): token, view, mode, revoked_at, expires_at — public read-only.
- **user_preferences** · **planning_periods** (context_type school_year/semester/wedding_season/general; CHECK constraints) · **planning_onboarding_sessions** · **workspace_sponsorships** (venue edition) · **suite_outbox** (cross-product event outbox) · **meta** KV (board:<ws>:columns) · roadmap_items/blockers/action_items (GTM surfaces).

## 3. Auth
Clerk; `src/server/auth.ts` (getCurrentUser/getActiveWorkspace/listMyWorkspaces); active ws via `tasks_active_ws` cookie validated against membership. Closed beta: `src/server/require-app-access.ts` + `src/lib/access-allowlist.ts` → /waitlist. OAuth providers = Clerk dashboard config (not in repo).

## 4. Billing
Stripe deep: `src/server/stripe.ts` (null-safe singleton), `/api/checkout` cross-product entry, webhooks `/api/webhooks/stripe` (checkout.completed, sub updated/deleted) + idempotency + dual-write to shared entitlements Turso DB. Prices: WORKSPACE_MONTHLY €12, EVENT_ONETIME €89, STUDIO_MONTHLY, WEDDING_ONETIME. Runbook docs/STRIPE_SETUP.md (live keys not set as of last audit).

## 5. Storage
No S3/Blob. `uploadAttachmentAction` (src/server/actions/attachments.ts) → local disk. Replace-seam documented.

## 6. Product UI
- Hybrid layer `src/components/hybrid/`: types.ts (5 statuses queued/active/review/waiting/done; 4 views), adapter.ts (Task↔LabTask, lane↔status), store.tsx (lab reducer), hybrid-store.tsx (production-backed same interface → server actions + optimistic TasksProvider), hybrid-workspace.tsx (mount), options/hybrid/option-hybrid.tsx (BoardView/ListView/TimelineView from option-a, CalendarView + WorkspaceBrief from option-b, PlanningRail from option-c).
- Views: /app/board|list|timeline|calendar → `<HybridWorkspace view=…/>`.
- **Task detail**: soft-nav `?task=<id>` param — `src/lib/tasks/use-task-panel.ts` (pushState/replaceState + synthetic popstate); panel `src/components/app/detail-panel/task-detail-panel.tsx` mounted in /app layout; fetches conversation via getTaskConversationAction (5s timeout+retry); subcomponents PanelShell/PanelHeader/FieldRows/ConversationFeed/ContactEditor/CentsEditor/DescriptionEditor/RepeatButton/SubtasksSection/AttachmentsSection.
- Projects: `studio-bar/projects-sidebar.tsx` + getProjectsTreeData (periods→workspaces→counts). Settings: single tabbed page /app/settings (workspace, members, billing, notifications, danger). Archived: /app/archived.
- Chrome: studio-bar.tsx (48px) + studio-rail.tsx (60px) in /app layout, auth cells hydrate under Suspense.
- board-config.ts: pure ColumnConfig model (system/custom/order/colors/descriptions; ≤20 custom, name ≤80, desc ≤160) persisted in meta KV; actions src/server/actions/board.ts.

## 7. Collaboration
Members/roles; pending_invites (list action in settings actions); share_links + /share/[token]; guest dir src/components/app/guest/ (roles per docs/COLLABORATION_LOOP.md — enforcement partially in progress); notifications (anti-noise stance: mentions + blocks only; daily digest broadcast); **nudge engine** `src/lib/nudges/generate-nudges.ts` = rules-based system nudges (idle-doing/review, past-due, blocker-cleared, review-pile, doing-empty; + llm-narration kind from src/server/ai.ts) surfaced in /app/inbox — NOT person-to-person; comments+activities merged by getTaskConversationAction; realtime SSE /api/events + use-realtime-sync (client-id echo suppression).

## 8. Marketing site
/ = TasksHeroTicker + Hero + Anatomy + CallToAction in SiteNavServer/SiteFooter + SuiteArrows. TasksHeroTicker (`src/components/marketing/tasks-hero-ticker.tsx`): pure DOM/setTimeout split-flap text animation (txr-* classes, reduced-motion guard, in-flow). Pricing → permanentRedirect to signalstudio.ie/pricing. /waitlist = static invite-only page. CTA contract: scripts/check-marketing-waitlist-contract.mjs.

## 9–10. Analytics / flags
GA4 G-YHBS152PJK prod-only (google-tag.tsx in root layout); no event tracking beyond page_view + signup_completed reference; no consent gate (Consent Mode v2 pending). NO feature-flag system (docs/decisions.md D17) — access-mode env system (SIGNAL_ACCESS_MODE demo/review, blocked in prod deployments).

## 11. Validation
typecheck `tsc --noEmit --incremental false` · lint `eslint` · test = contract scripts (suite-switcher, chrome, waitlist, loading, suiteloader-identity) + node --test .mjs suites (cross-tenant-isolation, tenant-scope, security-regression, notes-extract, outbox, planning, suite-context, stripe, share-revocation) + tsx tests (cross-product-assertion, membership-regression, idempotency, board-config, board-colors, board-lanes, tags, edition, dayparts, public-task, sentry-scrub…) · experience:quality = self-test→fixtures→validate→ds:check→playwright(port 4342 demo build)+attest · db:contract/migrate/bootstrap/status/seed · test:smoke marketing golden path. Registry experience/registry.json; receipts experience/evidence-runs/. NOTE: capture.mjs harness lives in the STUDIO repo, not tasks.

## 12. Demo/seed
src/server/demo/tasks-demo.ts (in-memory Orchard venue fixture, DEMO_WORKSPACE_SLUG the-orchard, stateless=self-resetting); src/server/db/seed.ts seedIfEmpty; seed-published-wedding.ts (/p/wedding-2026-public via wedding-3-month-countdown template); sync:templates script.

## 13. Deployment
Vercel, tasks.signalstudio.ie, push-to-main deploys. vercel.json cron: /api/cron/digest 09:00 UTC. Env: TASKS_DATABASE_URL/AUTH_TOKEN, CLERK keys (required, fail-closed); STRIPE_*, CRON_SECRET, RESEND_API_KEY (recommended); SIGNAL_ACCESS_MODE, SIGNAL_ENFORCE_CSP, SENTRY, NOTES_TO_TASKS_SECRET.

## migration/unified-app structural delta (worktree _wt-migration)
1. `src/modules/{notes,timeline,signal}` each with app/components/lib/server + barrel. 2. New routes /app/notes, /app/plan(+[projectSlug]/audience), /app/brief (each requireAppAccess-gated). 3. Four extra drizzle configs (notes/timeline/signal-analytics/signal-prefs). 4. New contract scripts check-module-boundaries/route-manifest(103)/frame-headers + ~25 module test files in pnpm test. 5. Extra local DBs (analytics/notes/roadmap.db) — multiple Turso DBs, zero schema changes.
