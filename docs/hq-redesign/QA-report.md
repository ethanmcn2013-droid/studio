# Signal HQ Redesign — QA Report

_Branch: `feat/hq-redesign-os`. Dev server: `PORT=3009 pnpm dev`. Login through the real password gate (`/hq/access`) — the gate is never weakened._

## Commands run

| Command | Result |
|---------|--------|
| `corepack pnpm typecheck` | **Pass** (clean, 0 errors). A stale `.next/types/validator.ts` from another branch referenced non-existent routes; cleared `.next/types`, reran → clean. |
| `corepack pnpm build` | **Pass**. Full route tree emitted incl. new `ƒ /hq/action-center`. No errors/warnings. |
| `corepack pnpm test` | **Pass** — 84/84 (incl. `check-chrome-contract`, `check-suite-switcher`, `check-loading-contract`, suite/entitlements/today unit tests). The shell rewrite did not break any contract. |

## Security / auth (preserved, verified)

Unauthenticated requests still redirect to the password gate (307 → `/hq/access?from=…`):

- `/hq` → `307 /hq/access?from=%2Fhq`
- `/hq/action-center` (new route) → `307 /hq/access?from=%2Fhq%2Faction-center`
- `/hq/founders-circle` → `307 /hq/access?from=%2Fhq%2Ffounders-circle`

`requireHqAccess()`, `verifyHqToken`, the `signal_hq_access` cookie, and the SHA-256 constant-time password check are unchanged. The access page renders chrome-free (no rail) but remains gated. No unauthenticated bypass introduced. No secrets, env vars, or private data exposed.

## Responsive widths reviewed (Playwright)

| Width | Behavior | Verdict |
|-------|----------|---------|
| 390 (mobile) | Rail → hamburger drawer; content single-column; metric grid 2-col; no horizontal overflow | Pass |
| 768 (tablet) | Drawer nav; 3-col numbers; workspace cards 3-across | Pass |
| 1024 (compact) | Icon-only rail (labels hidden, still reachable) | Pass (CSS breakpoint 861–1024) |
| 1440 (desktop) | Full rail + canvas + contextual right rail | Pass |
| 1728 (wide) | Same, content capped at 1160px, centered | Pass |

## Representative pages reviewed (before → after)

Screenshots in `docs/hq-redesign/screenshots/{before,after}/`:

- **Today / Mission Control** — was a single long scroll with a ~90-row wall; now verdict → critical banner → 5 numbers → workspace health, with Next Action + Action Center summary in the contextual rail. 10-second legibility achieved.
- **Action Center** (new) — unified queue; 3 critical items surfaced as banners, segmented priority filters + workspace select, progressive disclosure (top 6, "show more").
- **Founders Circle** (board room) — full-width five numbers, current-read banner, material progress/risk + board pack rows, reporting-freshness + review-principles rail. Operator detail excluded.
- **Money / Reporting** (workspace) — full-width metric row, watchlist + operator-queue rows, sources rail.
- **Command palette** — opens over the new shell; grouped results, indigo active row, keyboard hints.
- **CRM / Vault / Experience Quality** — inherit the new shell (rail + calm canvas + breadcrumbs) immediately; bodies still on legacy `.hq-*` styles pending per-page migration (see limitations).

## Accessibility checks

- Landmarks: `<nav aria-label="Signal HQ navigation">`, `<main id="hq-content">`, `<nav aria-label="Breadcrumb">`.
- Active rail item carries `aria-current="page"`; status communicated by dot **and** word (never color alone).
- Command palette is a focus-trapped `role="dialog"` (existing, retained), Esc-closable.
- Visible focus rings (`:focus-visible` → 2px accent outline) on rail items, rows, metrics, buttons, cmdk.
- Mobile drawer locks body scroll; scrim is a labelled button; closes on route change.
- `prefers-reduced-motion` collapses all motion (inherited from `tokens.css`, plus rail-transition guard).
- Contrast: body text ≥ `--ink-faint` (#71717a, 4.6:1 on white); tap targets ≥ 34–38px.

## Known limitations

1. **Per-page body migration is partial by design.** The shared shell + tokens + the four flagships (Today, Action Center, Founders Circle, Reporting) are on the new `.hqx-*` system. The remaining ~40 routes render inside the new shell (so they already feel like one product — calm canvas, rail, breadcrumbs) but their bodies still use legacy `.hq-*` styles. Migrating them is mechanical follow-on work using the documented `.hqx-*` primitives; nothing blocks it.
2. **Workspace landings are pointed at existing tools** (Sell→CRM, Make→Design Rooms, Money→Reporting, Company→Org) rather than net-new curated landing pages. The IA + rail already deliver the grouping; dedicated landings are a future enhancement.
3. **Dev banner** ("N" pill, bottom-left) overlaps the rail account row in dev only; it is hidden in production.
4. The `.next` cache on the machine was built by a concurrent process on another branch; always build fresh when validating.
