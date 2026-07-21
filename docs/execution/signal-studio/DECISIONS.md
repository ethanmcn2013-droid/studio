# DECISIONS — Signal Studio Premium Programme

Format: id · date · status (decided / provisional / open) · decision, alternatives, rationale, consequences, reversal.

## D-000 · 2026-07-21 · decided · Build on tasks main, merge-forward with unified-app
The programme implements on `tasks` repo `main`. The founder-gated `migration/unified-app` branch (release-ready, 31 unpushed commits, same repo, Tasks is its host module) must be able to merge our work forward: avoid restructuring the app shell, `src/app/app/` route topology, storage keys, or chrome components the migration owns; keep new code in new modules/tables where possible. Alternatives: build on the migration branch (rejected — unpushed, founder may not approve), fork (rejected — drift). Reversal: if cutover lands mid-programme, rebase remaining phases onto the unified app; module boundaries make this mechanical.

## D-001 · 2026-07-21 · decided · Execution system lives in studio repo
`studio/docs/execution/signal-studio/` — studio is the umbrella where cross-product operating docs, HQ, and decision ledgers already live; the programme spans tasks+studio+roadmap. Pointer added to `studio/CLAUDE.md`; a pointer in `tasks/CLAUDE.md` rides the first Phase-1 PR (the shared tasks checkout sits on another process's branch today; do not dirty it for a docs line). Committed direct to studio main per that repo's convention for docs/HQ content.

## D-002 · 2026-07-21 · decided · Model delegation policy
Fable: strategy, cross-repo architecture, IA, design direction, integration, final review, disagreement resolution. Opus 4.8: auth/permissions/RBAC, destructive migrations, storage metering, billing webhooks, hierarchy roll-up semantics, invitation security, security reviews, independent review of critical work. Sonnet/bounded agents: bounded components, tests, fixtures, settings screens, themes, seeds, hero implementation, docs, visual-QA iterations. No agent's "done" is accepted without diff inspection + verification run.

## D-003 · 2026-07-21 · provisional (validate at Phase 3 entry) · Task-detail interaction model = Hybrid C
Evolve the existing `?task=` soft-nav panel (src/lib/tasks/use-task-panel.ts + detail-panel/) into a premium resizable side panel, and add a full-page focus route `/app/task/[id]` as the stable deep link; mobile gets a full-screen sheet. Rationale: preserves board context and the shipped soft-nav architecture (search-param panel already survives back/forward), gives long-form work a real page, and the deep-link route can render the panel state on direct load. Alternatives evaluated in TASK_DETAIL_EXPLORATIONS.md (A side-sheet-only: weak for long briefs; B full-page-only: breaks board flow for rapid triage). Reversal: the panel and page share one TaskDetail composition; dropping either shell is cheap.

## D-004 · 2026-07-21 · decided · Hierarchy stays bounded at one level
DB triggers already enforce parent = top-level, same workspace. Keep it: understandable, matches the board's card grammar, avoids recursive roll-up cost. Roll-up = completed leaf tasks / total leaf tasks, shown as `n/m` + percentage; cancelled/archived children excluded from denominator (documented in UI); completing a parent with open children raises an explicit choice (complete children / keep open); no silent auto-complete. Reversal: widen the trigger + recursive CTE roll-up later; schema needs no change.

## D-005 · 2026-07-21 · provisional · Context-menu primitive = Radix menus, wrapped
The stack has no menu primitive (no Radix/Headless; hand-rolled primitives dir). Brief forbids casually hand-rolling focus management. Adopt `@radix-ui/react-dropdown-menu` + `react-context-menu` as the only Radix deps, wrapped in one Signal-styled `ContextActions` component (single action-registry drives right-click, visible •••, keyboard menu key, command-menu, touch). Alternatives: hand-roll (a11y risk), react-aria (heavier adoption), Base UI (younger). Validate bundle impact at Phase 3; reversal: the wrapper isolates the dependency.

## D-006 · 2026-07-21 · decided · Resources model
New `resources` table unifying uploads + external links (provider, resource_type, external_id, title, url, mime_type, size_bytes, thumbnail_meta, added_by, added_at, refreshed_at, access_state, counts_against_storage). Existing `attachments` rows migrate in (reversible: table retained until Phase 9). External links never count against storage; provider metadata fetch is async and never blocks task load. Google integration Phase-1 scope: paste-link + provider-aware card; Google Picker + "create Doc/Sheet/Slides" is a later phase behind incremental per-file OAuth; no embedded editing. Signal Studio is the index and context layer, not the editor.

## D-007 · 2026-07-21 · decided · Storage = Vercel Blob; quotas config-driven
Move upload bytes from local disk (documented durability gap, data-model.md) to Vercel Blob via the existing `uploadsRoot()`/streaming-read seam. Quotas in one config module (no UI hard-coding): Free 100MB total / 10MB per file; Pro 10GB / 250MB — FALLBACK defaults; no approved pricing numbers exist in MARKETING_PLAN_6MO (€12 workspace tier has no storage line). Warn 80/95%, refuse at 100%, deletion/download always allowed, server-side validation, per-workspace metering with recalculation job. OPERATOR note: Blob store provisioning on the tasks Vercel project. Reversal: seam-level swap, table unchanged.

## D-008 · 2026-07-21 · decided · Nudge is a human feature, distinct from the nudge engine
`generate-nudges.ts` (rules-based, system-generated, inbox) keeps its role. Human Nudge: sender→assignee, per-task, 1/24h/sender/assignee/task, in-app notification + email per `notification_prefs`, activity event, mute control, no guilt copy ("Ethan sent a gentle reminder about '…'"). Icon: subtle reminder glyph, not the bell (bell = notifications).

## D-009 · 2026-07-21 · decided · Invite scope order
Workspace invites first (harden existing `pending_invites`). "Project invite" == workspace invite (D-011 vocabulary). Task-level guests only with real server-side enforcement (`requireAppAccess` + membership checks on every route/action, tested via direct URL/API); if not achievable in Phase 2, flag off + record exact remaining work — no UI-hiding-as-security. `share_links` remain the read-only public path.

## D-010 · 2026-07-21 · decided · Auth strategy = Clerk-native
Enable Google, Apple, GitHub in Clerk dashboard (OPERATOR GATE — needs dashboard access; identity-only GitHub scopes). Code work: sign-in surface, Security & Login settings (connected methods, add/remove with ≥1-method guard, active sessions, sign-out-others, reauth for sensitive ops) on Clerk's user API. No custom OAuth handling; no account merging beyond Clerk's verified-email linking.

## D-011 · 2026-07-21 · decided · Product vocabulary mapping
Projects = Tasks workspaces (presented through the projects sidebar and new Project Overview). Programs = planning periods (grouping workspaces toward a horizon) — surfaced only where the user has one; jargon stays out of first-run. Project status (declared) and task progress (computed) are separate fields, never conflated.

## D-012 · 2026-07-21 · provisional (RFC decides, Phase 6) · Marketing Engine home
Recommendation: operator-first Marketing Home inside studio /hq, consolidating existing rooms (crm, marketing, socials, campaigns content, email-lab) and giving The Hundred machine-readable metadata; product-facing marketing surfaces come later. Alternative: build into the tasks product app now (rejected for MVP — audience is the founder/operator; the product's paying users are venue/wedding/workspace customers, not marketing teams yet).

## D-013 · 2026-07-21 · open (founder) · In-app dark theme vs light-lock
The founder light-lock (feedback memory, 2026-07) bans dark on Signal Studio marketing/HQ surfaces. Whether the *product app* may offer user-selected dark/premium themes is a distinct question. Phase 4 builds the token plumbing regardless (system/light shipped); dark/premium themes stay behind preference + operator-todo sign-off before exposure. Operator-todo to be filed at Phase 4 entry.

## D-014 · 2026-07-21 · decided · Timeline domain strategy
Ground truth (live-checked 2026-07-21): `timeline.signalstudio.ie` serves 200 and is canonical throughout code; `roadmap.signalstudio.ie` also serves 200 with no redirect. Work: add permanent 308 redirect roadmap.→timeline. (path+query preserved) in the roadmap repo + sitemap/robots/OG audit. EXTERNAL GATES: Vercel domain confirmation; deploy coordinated so it cannot be confused with Stage-C /app redirects owned by MIGRATION-P08-008 (we never author those). Rollback: remove redirect; both hostnames keep serving.

## D-015 · 2026-07-21 · decided · Demo-data replacement procedure
Idempotent seed command with explicit workspace/user argument, dry-run, `--confirm`, environment guard (refuses prod without checkpoint), deterministic ids, self-cleaning of only its own data. Wedding dataset is synthetic (safe demo identities; no real guest data), builds on the existing wedding template + demo fixtures. Deleting the founder's real demo-account data in prod = DESTRUCTIVE GATE: dry-run count + export snapshot + explicit checkpoint first. Never touches other users, shared data, templates, billing, audit records.

## D-016 · 2026-07-21 · decided · Atlas + deck representation
Deck already carries The Hundred (A7). Add a slide pair: one primary simplified product-family slide, one appendix Atlas slide captured from the live `/hq/atlas-map` (real content, 7 lenses). Native HTML deck only (`public/brand/business-loan-pack-2026.html`); mirrors update through `scripts/decks/publish-documents-decks.mjs` + CI; every changed slide rendered and inspected before completion is claimed.

## D-017 · 2026-07-21 · provisional (validate at Phase 7 entry) · Hero motion language
The hero must demonstrate the real hybrid board: real tokens, representative `hybrid/` components with demo fixtures (never live data), collaboration narrative with causality, calm settle into a production-realistic final frame. Current `TasksHeroTicker` (split-flap wordmark) may remain as the typographic opener *above* the board demonstration or be retired — decide against the page as a whole at Phase 7 with the brand register in hand. Constraints: static poster, reduced-motion, mobile-light, lazy-load, zero CLS, off-viewport pause; no new heavy animation framework without a recorded reason (stack: `motion` 12 + CSS).

## Assumption corrections (brief §3)
- A3: "Programs are collections of Projects" → mapped to planning_periods/workspaces (D-011).
- A4: Timeline is its own product (roadmap repo); domain already migrated in code; only the legacy-hostname redirect remains (D-014).
- A5/A6/A7: The Hundred and Atlas already exist and are integrated further than assumed.
- A9: native loan deck = HTML source, confirmed; mirrors are locked byte-identical copies.
