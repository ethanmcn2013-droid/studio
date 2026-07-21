# MASTER PLAN — Signal Studio Premium Programme

Programme owner: Fable 5 lead session. Started 2026-07-21.
Mission: evolve Signal Studio into a genuinely premium work-management and marketing operating system. The Tasks hybrid Kanban board (T·99) is the quality benchmark; bring task detail, Projects, Settings, collaboration, onboarding, website motion, marketing tooling, and launch assets to or beyond that standard.

**Scope boundary:** standalone video production (signal-motion repo, Remotion films, wedding demo film) is OUT of this programme. The marketing-site Tasks hero (tasks repo homepage) IS in scope.

**Foundational constraint (D-000):** all product work targets `tasks` repo `main` and must merge forward cleanly into the founder-gated `migration/unified-app` branch (release-ready, unpushed, tasks.git; see `_migration-control/`). Never touch Stage-C territory (old-app redirects, `/app/account` redirects, `next.config.ts` redirect blocks in notes/roadmap/analytics repos) — those are owned by open operator decisions MIGRATION-P08-007/008.

## Ground truth that reshapes the original brief (Phase 0 findings)

| Brief assumption | Repository reality | Consequence |
|---|---|---|
| Build task hierarchy | `tasks.parent_task_id` exists, one level deep, DB-trigger-enforced; SubtasksSection in detail panel | Phase 1 hardens roll-ups + UX, no new migration for hierarchy itself |
| Build activity system | `activities` table + `getTaskConversationAction` exist | Extend event kinds, never create a second system |
| Build attachments | `attachments` table exists but bytes go to local disk (`.data/uploads/`) — documented durability gap | Phase 1 moves bytes to Vercel Blob; Resources model wraps attachments + external links |
| Build OAuth providers | Auth is Clerk 7.x; providers are Clerk-dashboard config | Phase 2 = Clerk provider enablement (operator gate) + Security & Login UI |
| "Nudge" is new | A rules-based nudge *engine* exists (`generate-nudges.ts`, inbox surfacing) — system-generated, not person-to-person | Human Nudge is a new, distinct feature; reuse notifications + prefs tables |
| The Hundred needs integrating into deck | Done: 100 webps in `studio/public/brand/assets/ads/w/`, Appendix A7 live in loan pack | Phase 8 deck scope shrinks to the Atlas slide pair |
| Atlas needs representation | `/hq/atlas-map` live on studio main, exactly the 7 lenses specified | Capture from product for deck; no new Atlas build |
| Timeline on old domain | `timeline.signalstudio.ie` live AND canonical in code; `roadmap.signalstudio.ie` ALSO serves 200 with no redirect (live-checked 2026-07-21) | Phase 8 = permanent redirect roadmap.→timeline., coordinated with P08 Stage C gate |
| Programs = collections of Projects | Data model: `workspaces` are the project-like unit; `planning_periods` group workspaces toward a horizon | Vocabulary mapping decided in D-011 |
| Marketing hero shows the product | Homepage hero is `TasksHeroTicker` (split-flap text) + `Hero` component — no realistic board | Phase 7 is a real rebuild, using hybrid components + demo fixtures |

## Phases, owners, gates

Model policy: Fable leads, integrates, reviews. Opus 4.8 for auth/permissions/migrations/security/storage-metering architecture and independent review. Sonnet 5 (or bounded-builder agents) for bounded components, tests, seeds, settings screens, hero implementation, docs. See DECISIONS.md D-002.

### Phase 1 — Platform foundations
Owner: Fable (architecture) + Opus (schema/roll-up/storage review) + Sonnet (implementation).
1.1 Activity model: extend `activities.kind` taxonomy (parent change, resource add/remove, nudge, invite, archive/restore); render cleanly in ConversationFeed.
1.2 Hierarchy: keep bounded one-level (D-004). Roll-up = completed leaf / total leaf, displayed as `n/m` + %. Parent-complete-with-open-children → explicit choice dialog. Tests: cycles (trigger), cross-workspace, archived children, concurrent updates.
1.3 Task Resources: new `resources` table (provider, type, external id, title, url, mime, size, thumb, added_by/at, counts_against_storage) unifying uploaded files (migrated `attachments` rows) + external links (Google/Figma/GitHub/URL). External metadata fetch is async + non-blocking; task loads without it.
1.4 Storage: move upload bytes to Vercel Blob (D-007); server-enforced config-driven quotas (Free 100MB/10MB-file, Pro 10GB/250MB-file — fallback defaults, no approved pricing numbers exist); warn 80%/95%, refuse 100%, deletes always allowed; recalculation job; orphan cleanup.
Gate: migrations reversible; existing data valid; Opus review of quota enforcement + upload races; tests green.

### Phase 2 — Collaboration: Nudge, invites, auth
Owner: Fable + Opus (invite security, Clerk linking) + Sonnet (UI).
2.1 Human Nudge: on tasks with another active assignee; notification (in-app via `notifications`, email via Resend respecting `notification_prefs`); 1 per sender/assignee/task/24h; activity event; polite copy per brand-voice; last-nudged indicator; mute; first-run tip.
2.2 Invites: harden existing `pending_invites` (resend, revoke, expiry states, duplicate handling, role select, audit events); person-plus affordance. Task-level guests: only if RBAC holds server-side — otherwise flag off + documented gap (existing `share_links` cover read-only sharing today).
2.3 Auth providers: enable Google/Apple/GitHub in Clerk (OPERATOR GATE: Clerk dashboard). Code: provider buttons, account-linking flows via Clerk, unlink guard (≥1 method), reauth for sensitive changes.
2.4 Security & Login settings section (Clerk sessions API: active sessions, sign-out-others, connected methods).
Gate: server-side permission tests on invite/guest endpoints (direct URL + API, not UI hiding); Opus security review; no high-severity findings.

### Phase 3 — Task detail + context actions
Owner: Fable (design direction + final acceptance) + Sonnet (build) + visual-qa evidence.
3.1 Chosen model (D-003, validated in TASK_DETAIL_EXPLORATIONS.md): premium resizable side panel evolving the existing `?task=` soft-nav panel, plus full-page focus route `/app/task/[id]` (stable deep link), full-screen sheet on mobile. Keyboard j/k between tasks; autosave drafts; optimistic + rollback; skeletons matching layout; permission/deleted/archived states.
3.2 Information architecture per brief §10.1 (header/breadcrumb/status/title/primary action; brief; subtasks; resources; comments; supporting metadata rail; filtered activity).
3.3 Context-action system: one reusable primitive (D-005: adopt Radix menu primitives, wrapped and Signal-styled) serving right-click + visible ••• + keyboard + touch long-press; task-card grouping Open/Workflow/Organisation/Destructive; never the only route to an action; native menu preserved in editable text.
Gate: deep links; board position preserved on close; automated a11y zero serious/critical + manual keyboard walkthrough; visual evidence desktop/mobile; Fable acceptance against the board's visual grammar.

### Phase 4 — Projects, Settings, Billing, Themes
Owner: Fable (IA) + Sonnet (screens) + Opus (billing webhooks review).
4.1 Projects: workspaces-presented-as-Projects (D-011): overview page (summary, description, owner, team, status vs task-progress distinction, target date, current milestone-tasks, key resources, recent activity, next action); lifecycle; empty states that teach; planning periods presented as Programs only where they exist.
4.2 Settings: gear icon entry; split current single-page `/app/settings` into Account / Appearance / Personalisation / Notifications / Security & Login / Connected Apps / Storage / Billing / Privacy & Data / Workspace / Support.
4.3 Billing: Stripe Customer Portal (short-lived server sessions; existing webhooks + `processed_webhooks` idempotency retained); sandbox-verified.
4.4 Themes: token-driven system/light/dark + curated premium themes, no hydration flash, per-user persistence. NOTE founder light-lock applies to marketing/HQ surfaces; in-app dark is a distinct decision — get founder sign-off via operator-todo before enabling dark beyond preview (D-013).
Gate: billing portal works in Stripe sandbox; settings IA consistent desktop/mobile; contrast validation per theme; regression checks.

### Phase 5 — Personality, education, celebrations
Owner: Sonnet (build) + Fable (copy review with brand-voice skill).
Message catalogue + eligibility (truthful, ≤1/session, local-time aware, disableable); versioned tip registry (once per version, ≤1/session, weekly cap, context-triggered, revisitable in Help); milestones 100/250/500/1000 completed tasks — user-level, server-side exactly-once, no confetti, reduced-motion.
Gate: truthfulness tests (no claim without activity evidence); copy passes brand-voice audit; prefs respected.

### Phase 6 — Marketing Engine
Owner: Fable (RFC + boundaries) + Opus (domain model review) + Sonnet (MVP build).
RFC FIRST (location decision D-012 provisional: operator-first in studio /hq, consolidating existing rooms — crm/marketing/socials/campaigns content — into a coherent Marketing Home; product-facing later). Entities: Campaign, Content Item, Asset, Channel, Launch, Checklist, Experiment, Metric, Brand/Press Resource. The Hundred becomes a real, searchable 100-item collection (assets exist; add machine-readable metadata — do not fabricate; record gaps). Integrate-don't-rebuild for scheduling/email/analytics. AI assists never publish autonomously.
Gate: RFC approved against repo evidence; one end-to-end workflow demonstrated; empty/loading/error/permission states complete.

### Phase 7 — Marketing-site Tasks hero
Owner: Fable (motion direction) + Sonnet (implementation) + visual-qa.
Replace/augment the current text-ticker + Hero with an authentic board demonstration: real tokens and representative hybrid components + demo fixtures (never production state); narrative per brief §14.2 (task arrives → assignee → comment → subtasks → roll-up → resource → deliberate move → calm settle); static poster, reduced-motion variant, lighter mobile variant, lazy-loaded, zero CLS, pauses off-viewport. Chrome/waitlist/experience-materiality contracts must stay green (`experience:fixtures:write` + attestation flow after any registered-page edit).
Gate: final frame ≈ real board; sequence visually inspected across breakpoints + Safari/Chrome/Firefox; CPU + bundle measured; contracts green.

### Phase 8 — Demo data, Timeline domain, support, deck
Owner: Fable + Opus (destructive-workflow guard review).
8.1 Wedding demo seed: idempotent command (explicit workspace arg, dry-run, confirm flag, env guard, deterministic ids, self-cleaning); synthetic identities only; builds on existing wedding template/fixtures; any production deletion requires dry-run count + snapshot + DESTRUCTIVE CHECKPOINT.
8.2 Timeline domain: prepare `roadmap.signalstudio.ie` → `timeline.signalstudio.ie` 308 redirect (path+query preserved) in roadmap repo; EXTERNAL GATE: DNS/Vercel domain verification + coordination with P08 Stage C (never author Stage-C /app redirects — P08-008 owns those).
8.3 Support: `support@signalstudio.ie` prep only — DKIM is pending (docs/DKIM_SETUP.md) and gates all sending; UI references stay behind config until the alias receives a test message. OPERATOR GATE: Google Workspace alias + DKIM TXT.
8.4 Loan deck: A7 done; add Atlas slide pair ("simple on top / serious underneath": one primary simplified suite slide + one appendix Atlas capture from live /hq/atlas-map); native HTML deck only; publish via existing `scripts/decks/` pipeline; render + inspect every changed slide.
Gate: seed verified non-destructive; redirects staged not deployed; deck mirrors byte-verified.

### Phase 9 — Hardening, release, final review
Full workflow matrix (brief §16.1), responsive/browser matrix, Opus security review, performance profile (board, panel open, project pages, hero CPU), Fable cross-product design review (remove what fails the "experientially necessary" test), staged flag-based release, FINAL_REPORT.md.

## Dependency graph
Phase 1 → 2 (resources/activity feed feed Nudge+invite events) → 3 (panel integrates resources/subtasks/nudge/menu) → 4 (settings hosts storage/billing/security sections built in 1–2) → 5 (independent after 3) 
Phase 6 independent of 1–5 (studio repo) — may run parallel after Phase 0.
Phase 7 independent (marketing surface) — may run parallel; benefits from 3's visual grammar.
Phase 8 independent; 8.2/8.3 externally gated.
Phase 9 last.

## Acceptance standard (every phase)
WCAG 2.2 AA, zero serious/critical automated findings; motion tokens + reduced-motion; no second analytics vendor; privacy-safe event payloads; brand-voice for all user-facing copy; light-lock on marketing/HQ surfaces; lab-parity standard — visual acceptance is side-by-side against the real board, not spec bullets.
