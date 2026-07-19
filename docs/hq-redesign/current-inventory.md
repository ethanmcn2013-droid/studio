# Signal HQ — Current Inventory

_Generated 2026-07-19 as Phase 1 of the HQ operating-system redesign. Source of truth: `src/app/hq/**`, `src/lib/hq/operating-system.ts`, `src/components/hq/hq-shell.tsx`, `src/components/hq/hq-command-palette.tsx`._

## Summary

- **51 routes** under `/hq` (including dynamic `[slug]` routes). All are **server-rendered** (0 `"use client"` pages; interactivity is islanded into components).
- Auth: every route is gated by `requireHqAccess()` / the `signal_hq_access` cookie. `/hq/access` is the password gate. The gate is preserved unchanged by this redesign.
- Navigation today is a **horizontal top bar** (9 operator links, or 3 in board mode) + a **command palette** (~24 curated rooms). ~16 real routes are unreachable from either and rely on direct links from parent pages.
- Content is markdown-driven: **~215 source docs** (`content/hq/**` 176, `content/vault` 27, `content/atlas` 12), plus live DB reads (prospects, sponsors, crons, access grants, experience-quality, waitlist).

## Route table (canonical)

| Path | What it is | Domain | Audience | Type | Live data |
|------|-----------|--------|----------|------|-----------|
| `/hq` | Today / mission control: verdict, proof gate, inbox, metrics, hubs | Today | operator | operational | yes |
| `/hq/access` | Password gate | System | all | gate | no |
| `/hq/crm` | Venue pipeline: prospects by stage, due-today, outreach ledger | Sell | operator | live | yes |
| `/hq/marketing` | Six-month marketing engine, ranked approaches | Sell | operator/mktg | working | yes |
| `/hq/market-entry` | 70-slide go-to-market deck (iframe) | Sell | founder/shareholder | static | no |
| `/hq/plan` · `/hq/plan/print` | 6-month plan deck + print export | Sell | founder/shareholder | working | no |
| `/hq/venue-kit` | Venue pitch pack (deck, pricing, outreach, script) | Sell | operator | room | no |
| `/hq/socials` | 12-post posting queue | Make | operator | room | no |
| `/hq/design-rooms` | Index of 6 decision rooms + 5 galleries | Make | operator | room | no |
| `/hq/cards` · `/hq/cafe-card` · `/hq/partner-card` · `/hq/poster` · `/hq/slide-30-review` · `/hq/product-hero-design-motion` | Design decision rooms | Make | operator | room | no |
| `/hq/experience-quality` | Quality control plane, 13-dimension gate, evidence wall | Make/System | operator | live | yes |
| `/hq/experimentation-room` | Lab registry (shipped/review/parked/building) | Make | operator | library | no |
| `/hq/asset-command` | Launch-asset operating layer, ranked priorities | Make | operator/mktg | working | yes |
| `/hq/assets` | Brand + sales asset library (grouped) | Make/Library | operator/mktg/shareholder | library | static |
| `/hq/one-pagers` (+ `/brand /tasks /notes /analytics /roadmap`) | Print-ready product one-pagers | Make/Library | operator/shareholder | library | no |
| `/hq/demo-film` | Hero product film scaffold | Make | operator | working | yes |
| `/hq/loading-review` | Loading-system review board | Make | operator | room | no |
| `/hq/reporting` | Five company numbers + watchlist + sources | Money | operator/shareholder | live | yes |
| `/hq/financial-model` | Cash projection, runway, LTV:CAC (plan vs actual) | Money | founder/shareholder | static+live | yes |
| `/hq/cap-table` | Ownership (Class A/B, 1M shares, pre-incorp) | Money/Board | founder/shareholder | static | no |
| `/hq/incorporation` | CRO runbook + timeline, gates €40k facility | Company/Board | founder/shareholder | static | yes |
| `/hq/loan-pack` | €40k lender business plan (iframe) | Money/Board | founder/shareholder | static | no |
| `/hq/deck` | Pitch deck (iframe) | Board | founder/shareholder | static | no |
| `/hq/founders-circle` | Shareholder-safe board room | Board | founder/shareholder/hire | board | yes |
| `/hq/data-room` | Diligence index, 7 sections, launch countdown | Board | founder/shareholder/hire | library | yes |
| `/hq/vault` · `/hq/vault/[slug]` | Document index (27 legal/founder/brand/ops docs) | Company/Library | operator/shareholder | library | yes (md) |
| `/hq/entitlements` · `/hq/entitlements/[lookup]` | Access console: grants, codes, venues, audit | System | operator | live | yes |
| `/hq/org` · `/hq/org/[slug]` | Executive Leadership Team, 17 directors, 5 clusters | Company | operator/hire | library | yes |
| `/hq/blueprint` | Founder OS zoomable map, 10 sections | Company | operator/shareholder/hire | library | yes |
| `/hq/atlas` · `/hq/atlas/[slug]` · `/hq/atlas-map` | Systems index + living operating map (7 lenses) | System | operator | library | yes (md) |
| `/hq/platform-readiness` | Remediation program tracker, P0 gates | System | operator | live | yes |
| `/hq/health` | Scheduled-job (cron) health monitor | System | operator | live | yes |
| `/hq/waitlist` | Waitlist ledger by segment | Money/Sell | operator | live | yes |
| `/hq/partners` | **Redirect** → `/hq/entitlements?tab=venues` | — | — | redirect | — |

## Orphans & discoverability gaps

Reachable only by direct link from a parent page, absent from top-nav **and** palette: `/hq/health`, `/hq/waitlist`, `/hq/asset-command`, plus all detail/`[slug]` pages and the six design rooms. **Finding:** the flat top-nav cannot scale to 51 routes; discoverability depends on tribal knowledge. This is the primary IA problem the redesign solves (grouped rail + workspace landings + upgraded command palette + search).

## Near-duplicates / shelf

- No true stubs. `/hq/partners` is a deprecated redirect (keep).
- Overlapping "asset" concepts: `/hq/assets` (library), `/hq/asset-command` (operating layer), `/hq/design-rooms` (decision rooms). The IA groups all three under **Make → Library**.
- `/hq/plan` vs `/hq/marketing` vs `/hq/market-entry` all live under **Sell**.

## Content sources

`content/hq/`: decisions (43), operator-todos (47), launch-readiness (15), features (10), content (10), risks (8), plus campaigns/segments/products/flows/templates. `content/vault/` (27), `content/atlas/` (12). These remain the source of truth — HQ renders them, per `CLAUDE.md`.
