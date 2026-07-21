# ASSET INVENTORY — Signal Studio Premium Programme (2026-07-21)

Workspace root: `C:\Users\ethan\signal-studio-workspace\`

## Repositories in scope
| Repo | Role | State 2026-07-21 |
|---|---|---|
| `tasks` | Main product (Tasks app + marketing site, tasks.signalstudio.ie). Host of unified app. | main @ 831ecb0; working checkout on `feat/tasks-hero-lab` @ 70375f5 (= main~2, shared with another process — do not disturb) |
| `studio` | Umbrella site + HQ + decks + brand + this execution system | main @ cd4c159 (clean) |
| `roadmap` | Timeline product (timeline.signalstudio.ie) | checkout on feat/timeline-hero-lab; main untouched by us |
| `notes` | Notes product | checkout on feat/notes-hero-lab |
| `analytics` | Signal product (signal.signalstudio.ie); npm not pnpm; Resend crons | main @ b3e29c0 |
| `ds-foundation` | @signal/ds 2.x source; studio vendors 2.0.1; 2.1.0 unpublished (founder npm 2FA gate) | main @ 52b2eb9 |
| `collateral` | Print/social collateral render pipeline | main @ ca7fd4c |
| `_migration-control` | Unified-app programme control repo (complete to founder gate) | HEAD 84febfa |
| `_wt-migration` | Worktree: `migration/unified-app` @ 7c8c24e — DO NOT MODIFY | founder-gated |
| **EXCLUDED**: `signal-motion` (Remotion films), all video-production work | — | — |

## Key product code (tasks repo)
- Hybrid board (quality benchmark): `src/components/hybrid/` (types, adapter, store, hybrid-store, hybrid-workspace, options/hybrid/option-hybrid.tsx); views mounted at `/app/board|list|timeline|calendar`; `src/lib/board-config.ts` (+tests).
- Task detail: `src/lib/tasks/use-task-panel.ts` (?task= soft-nav) + `src/components/app/detail-panel/task-detail-panel.tsx` (PanelShell/Header, FieldRows, ConversationFeed, DescriptionEditor, SubtasksSection, AttachmentsSection).
- Schema: `src/server/db/schema.ts`, migrations `drizzle/0000–0016` (baseline 0014). Hierarchy: `tasks.parent_task_id` + workspace-guard triggers. Audit: `activities`. Files: `attachments` (bytes → LOCAL DISK `.data/uploads/` — durability gap). Invites: `pending_invites`. Notifications: `notifications` + `notification_prefs`. Sharing: `share_links(+visits)`. Billing: `entitlements`, `comp_codes`, `processed_webhooks`, shared entitlements Turso DB dual-write. Cross-product: `suite_outbox`, `source_note_id`. KV: `meta`.
- Auth: Clerk 7.3.1 (`src/server/auth.ts`, `require-app-access.ts` allowlist → /waitlist). Billing: Stripe 22 (`src/server/stripe.ts`, `/api/checkout`, webhooks). Email: Resend. Realtime: SSE `/api/events` + `use-realtime-sync`. Nudge engine (system): `src/lib/nudges/generate-nudges.ts` → inbox.
- Marketing: `src/app/page.tsx` = TasksHeroTicker + Hero + Anatomy + CallToAction; chrome contracts in `scripts/check-*.mjs`; experience registry `experience/registry.json` + Playwright `experience/` + attestation scripts.
- Demo/seed: `src/server/demo/tasks-demo.ts` (in-memory Orchard venue fixture), `src/server/db/seed.ts` (seedIfEmpty), `seed-published-wedding.ts` (+ wedding template), access-mode env system (no feature flags by decision D17 of tasks/docs/decisions.md).
- Validation commands: `pnpm typecheck` · `pnpm lint` · `pnpm test` (contract scripts + node --test suites) · `pnpm build` · `pnpm experience:quality` (fixtures/validate/ds/playwright+attest) · `pnpm db:contract`.

## Marketing / company assets (studio repo)
- The Hundred: `public/brand/assets/ads/w/ad-001..100.webp` (+ `f/ad-001.webp` loupe). No machine-readable metadata (gap, Phase 6). Render pipeline lived outside the repo (Desktop "Signal Studio Launch Ads.zip" → playwright → sharp) — outputs are committed.
- Decks (native sources of truth): `public/brand/business-loan-pack-2026.html` (A1–A7; A7 = The Hundred), `public/brand/market-entry-deck-2026.html`. Mirrors growth./plan.signalstudio.ie via `scripts/decks/publish-documents-decks.mjs` + `.github/workflows/documents-decks-sync.yml` (VERCEL_TOKEN done).
- Atlas: `/hq/atlas-map` LIVE on main — `src/features/atlas/` + `content/atlas/` (12 entries), 7 lenses (Founder/Product/Design/Engineering/AI/Launch/Investor) in `src/features/atlas/data/atlas-graph.ts`. No captured imagery yet (Phase 8 capture from product).
- HQ: rooms registry `src/lib/hq/rooms.ts` (39 rooms); operator-todos ledger `content/hq/operator-todos/` (open items incl. migration-p06/p08 cluster, dkim, seed-wedding-workspace, publish-signal-ds-2-1).
- Email: `src/emails/` (17 Hairline templates, renders in `docs/email-system/renders/`), `/hq/email-lab`. DKIM PENDING (`docs/DKIM_SETUP.md`) — gates all sending. `hello@signalstudio.ie` is the only address; `support@` does not exist.
- Marketing raw material: `content/hq/campaigns/` (4), `docs/MARKETING_PLAN_6MO.md` (amended 2026-07-11; Venue €1,500/yr · Event €79 · Workspace €12/mo), collateral at `public/brand/collateral/`, posts-week-1..8 in tasks/docs/.
- Analytics: GA4 `G-YHBS152PJK` via `<GoogleTag />` prod-only, all repos; no event taxonomy yet; consent gate open (see gdpr operator-todos).
- DS: studio vendors `src/ds/tokens.css`/`tailwind.css` from signal-design-system@2.0.1 (regen `scripts/ds-vendor.mjs`); studio/DESIGN.md deprecated in favour of ds-foundation.

## Domains (live-checked 2026-07-21, all 200)
signalstudio.ie · tasks. · notes. · signal. · timeline. · roadmap. (NO redirect to timeline — Phase 8 work) · documents. — no redirect chains observed.

## Environments / external dependencies
Vercel (auto-deploy on main push; project↔domain map incl. roadmap-project quirk — see agent-reports/phase0-domains-infra.md). Turso per product + shared entitlements DB. Clerk (provider enablement = dashboard gate). Stripe (sandbox runbook docs/STRIPE_SETUP.md; live keys not fully set). Resend (Signal crons live; tasks provisioning todo open). Sentry. Upstash (Signal).

## Missing assets / gaps
- Machine-readable metadata for The Hundred (channel/format/pillar) — do not fabricate; record real gaps.
- Atlas capture imagery for the deck.
- support@ alias + DKIM.
- Fresh screenshot baseline of board/detail/projects/settings/heroes (interim evidence: `_migration-control/phase9-evidence/visual/` 44 screenshots + VISUAL_MATRIX.md, 2026-07-20-era).
- Approved storage-quota numbers (fallback defaults in use, D-007).
