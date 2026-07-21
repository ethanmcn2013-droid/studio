# Phase 0 agent report — studio repo assets (repo-cartographer, 2026-07-21)

Audited at main @ cd4c159. Paths relative to `studio/`.

## The Hundred
Exactly 100 committed webps: `public/brand/assets/ads/w/ad-001..100.webp` + loupe `f/ad-001.webp`. No machine-readable metadata (channel/format/pillar) anywhere in-repo; deck copy says "five directions" but the grouping isn't encoded. Contact sheet lives in the loan pack section `id="appendix-assets"` (Appendix A7 "The Asset Bank", 13-col CSS grid, references all 100). Render pipeline (playwright .ad-canvas → sharp webp from Desktop "Signal Studio Launch Ads.zip") operated OUTSIDE the repo; outputs committed. `scripts/render-brand-assets.mjs` is wordmarks only.

## Decks
Native sources of truth: `public/brand/business-loan-pack-2026.html` (Business Plan 2026; appendices A1 HQ, A2 Reconciliation, A3 Governance, A4 Sources, A5 Operating costs, A6 Revenue at scale, A7 The Hundred; A5/A6 hydrate from `content/hq/finance/*-2026-07-20.json`; monthly run-rate €250.49) and `public/brand/market-entry-deck-2026.html`. Mirrors: growth.signalstudio.ie (market-entry, Vercel `signal-growth-plan`), plan.signalstudio.ie (loan pack, Vercel `signal-business-plan`) — publish `scripts/decks/publish-documents-decks.mjs` (deploy + byte-verify), verify `verify-documents-sync.mjs`, CI `.github/workflows/documents-decks-sync.yml` (VERCEL_TOKEN present; publishes on main push touching a deck). documents.signalstudio.ie is the hub. Never hand-edit mirrors (docs/DOCUMENTS_DECKS.md). Experience-materiality attestation gates registered experience PAGES (experience/registry.json system), not deck HTML — deck edits gate through the drift-verify CI.

## Atlas
LIVE on main: `src/app/hq/atlas-map/page.tsx` + `src/features/atlas/` (components/data/server/types). 7 lenses in `src/features/atlas/data/atlas-graph.ts` L259–302: Founder, Product, Design, Engineering, AI, Launch, Investor. Graph = 1 center + 8 domain nodes (product/design/engineering/ai/operations/metrics/business/launch), loads from content/hq/** at request time (load-snapshot.ts). `content/atlas/` = 12 system entries (3 lenses Products/Processes/Data Flows). No captured imagery of the map in-repo.

## HQ
Registry `src/lib/hq/rooms.ts`: 39 rooms — Sell(7) crm/venues/venue-kit/marketing/socials/market-entry/waitlist · Make(14) design-rooms/assets/slide-30-review/asset-command/experience-quality/one-pagers/demo-film/product-hero-design-motion/experimentation-room/loading-review/cards/poster/cafe-card/partner-card/email-lab · Money(8) reporting/financial-model/cap-table/deck/loan-pack/decks/data-room/plan · Company(11) vault/decisions/org/blueprint/atlas/atlas-map/incorporation/entitlements/health/platform-readiness · Board(1) founders-circle.
Open operator-todos (selected): migration-p08-001 approve cutover (P0) · p08-002 stage env vars (P0) · p08-003 GA4 continuity · p08-004 signal email home · p08-005 google oauth console · p08-006 marketing homes · p08-007 GDPR-before-redirects (P1 blocking) · p08-008 old-app redirect commits (P1 blocking) · migration-p06-001 signal-home · gdpr-data-lifecycle · eu-regions-dpas · publish-legal-docs · staging-turso-db (P0) · load-national-schools-book · select-timeline-design-direction · **seed-wedding-workspace** (P1 blocking — wedding seed not yet entered, six screenshots owed; data at public/brand/collateral/venue/wedding-seed.md) · register-ltd-ireland · branch-protection · closed-beta-clerk-restricted/allowlist-env · notes-hero-deploy · vercel-lab-preview-exposure · publish-signal-ds-2-1 (founder npm 2FA) · hero-direction-pick · stripe-tax-eu-vat · verify-clerk-prod-env · verify-sentry-dsns · turso-backups · uptime-monitoring · provision-upstash · ai-spend-budget · provision-tasks-resend-production · licensing/planning-period ratifications · collateral signoffs.

## Email / support
DKIM PENDING (docs/DKIM_SETUP.md — SPF+DMARC+MX verified 2026-05-09; TXT record not generated; founder Google Workspace Admin action). Canonical address `hello@signalstudio.ie`; **zero `support@` references**. Email design system: Hairline w/ indigo links (decision 2026-07-16), `src/emails/` (directions/components/17 templates/fixtures/registry/render+test), renders in docs/email-system/renders/, /hq/email-lab. Providers: Resend (Signal briefings live; tasks resend provisioning todo open); Clerk sends auth mail. No outreach send pipeline.

## Marketing raw material
content/hq/campaigns/ (collaboration-proof, student-projects, planner-pilot, founding-venue). docs/MARKETING_PLAN_6MO.md (2026-05-16, amended 2026-07-11): Venue Edition €1,500/yr fixed · Event €79 · Workspace €12/mo; Gate 0 = one venue pays; scenarios Floor €78k / Stretch €235k / Math €500k. Collateral web renders public/brand/collateral/{ambassador,identity,social,venue}; press kit docs/brand-guide/handoff/press-kit.md; signal-growth/ outbound scripts + year-one asset library. posts-week-1..8 live in the TASKS repo docs/.

## Analytics
docs/ANALYTICS.md: GA4 G-YHBS152PJK, `<GoogleTag/>` prod-only in each repo layout. No event taxonomy; consent gate open; p08-003 proposes GA4 `module` custom dimension (not implemented).

## Design system
Studio vendors signal-design-system@2.0.1 (50e7faf) → `src/ds/tokens.css`/`tailwind.css` via scripts/ds-vendor.mjs (+ scripts/ds/ds-check.mjs contract). 2.1.0 pushed in ds-foundation, NOT on npm (publish-signal-ds-2-1 todo, founder 2FA). studio/DESIGN.md deprecated 2026-07-02 → canonical in ds-foundation. Motion: GSAP 3.13 + ScrollTrigger + Lenis (AGENTS.md); no first-class motion-token file.

## Demo data
No wedding seed script in studio; seed data doc at public/brand/collateral/venue/wedding-seed.md (operator-todo open). docs/CYCLE_8_WEDDING_DEMO_SCRIPT.md = 60s hero FILM storyboard (Remotion target → excluded video scope), not a product seed. scripts/seed-entitlement.ts + create-sponsor.ts = entitlements only.

## Flags / uncertainties
- roadmap vs timeline hostname: all studio src references timeline.signalstudio.ie; 2026-07-11 topology inventory shows Vercel project `roadmap` prod URL roadmap.signalstudio.ie — both hosts live (resolved by live check: both 200, no redirect).
- Atlas-map merge has no CHANGELOG entry (present on main regardless).
- DKIM doc is a runbook, not a completion receipt.
