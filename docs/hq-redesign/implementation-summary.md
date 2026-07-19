# Signal HQ Redesign — Implementation Summary

_Branch `feat/hq-redesign-os`. A structural transformation of the Signal HQ founder operating system to the reference's calm three-column console, built on the existing Signal Design System._

## What changed

**A new operating shell.** The horizontal top-nav (9 lowercase links) is replaced by a persistent, grouped **left rail** (Today / Workspaces / Knowledge / Board / Systems), a sticky **utility bar** with breadcrumbs + status + ⌘K, and an optional **contextual right rail** — the reference's spatial model. A mobile drawer, an icon-collapse mode, and board-mode rail collapsing are all included.

**A metadata-driven IA.** `src/lib/hq/hq-nav.ts` is the single registry the rail, breadcrumbs, and active-state read from. Every one of the 51 routes maps to exactly one group; `resolveHqLocation()` powers breadcrumbs for deep/`[slug]` pages.

**A new Action Center** (`/hq/action-center`) unifies the ~90-item inbox, operator to-dos, and follow-ups into one normalized, prioritized queue (Critical / Due / Stale / Queued) with filters, workspace grouping, and progressive disclosure — drawn from the real sources, nothing invented.

**Rebuilt flagships.** Today (mission control, 10-second legibility), Founders Circle (composed board room), and Money/Reporting (workspace) are rebuilt on the new `.hqx-*` component system. All preserve their data sources and business logic verbatim — including Today's proof-gate state machine (inert/running/expired), which is re-framed but unchanged.

## Why the new architecture is more intuitive

- **A stable spatial spine** — the same grouped rail on every page builds muscle memory; the old flat bar couldn't scale past 9 of 51 routes.
- **Cadence-ordered** — daily work (Today, Action Center, workspaces) sits at the top; rare surfaces (Systems) are reachable, not resident.
- **No dead ends** — orphan routes (`/hq/health`, `/hq/waitlist`, all `[slug]` details) are now grouped and reachable via workspace + palette; any asset is ≤3 interactions away.
- **Calm by default, loud on demand** — the Action Center concentrates urgency so every other surface can stay quiet, the reference's core discipline.

## Important design decisions

1. **Extend the DS, don't fork it.** `src/ds/tokens.css` already encodes the reference's language (indigo accent, paper/ink neutrals, hairlines, base-4). No token values changed; a single HQ layer (`src/app/hq/hq-os.css`, `.hqx-*` prefix) adds shell + components on top.
2. **Ink for primary, indigo for the one moment.** Following the reference (black "Deploy" button; single purple accent), primary CTAs are ink/black and indigo is reserved for one earned accent per view (active rail icon, accent banners).
3. **Additive, non-destructive migration.** No route deleted or moved; legacy `.hq-*` styles remain so un-migrated pages keep working inside the new shell. Reverting the layout + shell restores the old nav with zero data changes.
4. **Light-locked.** No dark mode shipped (operator standing decision).

## Major files changed

| File | Change |
|------|--------|
| `src/components/hq/hq-shell.tsx` | Rewritten — three-column shell, rail, drawer, breadcrumbs, board mode |
| `src/lib/hq/hq-nav.ts` | **New** — IA registry + breadcrumb/active resolvers |
| `src/components/hq/hq-icons.tsx` | **New** — 20-icon inline stroke set |
| `src/app/hq/hq-os.css` | **New** — the `.hqx-*` design-system layer |
| `src/app/hq/layout.tsx` | Imports `hq-os.css` |
| `src/lib/hq/action-center.ts` | **New** — unified action model |
| `src/components/hq/hq-action-center.tsx` | **New** — filterable action UI |
| `src/app/hq/action-center/page.tsx` | **New** — Action Center route |
| `src/app/hq/page.tsx` | Rebuilt Today (proof-gate logic preserved) |
| `src/app/hq/founders-circle/page.tsx` | Rebuilt board room |
| `src/app/hq/reporting/page.tsx` | Rebuilt Money workspace |
| `scripts/hq-redesign/shot.mjs` | **New** — Playwright QA harness |
| `docs/hq-redesign/*` | Inventory, IA, design-system, route-migration, QA, this summary |

## Route changes & compatibility

- **New:** `/hq/action-center`. **No route deleted, moved, or aliased.** All deep links, query-param entry points, and the `/hq/partners` redirect are preserved. See `route-migration.md`.

## Validation results

- `pnpm typecheck` clean · `pnpm build` success (incl. `/hq/action-center`) · `pnpm test` 84/84.
- Auth gate verified: unauthenticated `/hq`, `/hq/action-center`, `/hq/founders-circle` all 307 → `/hq/access`.
- Responsive verified at 390 / 768 / 1024 / 1440 / 1728. Before/after screenshots in `docs/hq-redesign/screenshots/`.

## Remaining product decisions for the founder

1. **Roll the `.hqx-*` migration across the remaining ~40 route bodies?** (Mechanical; the shell already unifies them.) Recommended: yes, in tranches by workspace.
2. **Build dedicated workspace landing pages** (curated Sell/Make/Money/Company overviews) vs. keep pointing at the primary tool? Recommended: build landings once bodies are migrated.
3. **Adopt Action Center as the canonical "needs me" surface** and retire the legacy inbox/operator-todo sections elsewhere? Recommended: yes.
