# Signal Studio Atlas — Technical Plan

_Phase 0 deliverable. Stack inferred from the repo — nothing assumed._

---

## 1. Stack (as found)

- **Next.js 16.2** App Router, **React 19.2**, **TypeScript 5**.
- **Tailwind v4** (`@tailwindcss/postcss`) + vendored design tokens at
  `src/ds/tokens.css` (imported in `globals.css`). Utility classes bind to CSS
  custom properties (`text-ink`, `text-ink-soft`, `text-ink-quiet`,
  `border-border-soft`, `var(--accent)`, `var(--tracking-eyebrow)`, `.h-section`).
- **Fonts:** Geist Sans + Geist Mono via `next/font` (CSS vars `--font-geist-*`).
- **Motion:** GSAP (lazy, hero only) + CSS scroll-driven reveals. Motion tokens
  `--motion-fast|base`, `--ease-out`; all collapse under `prefers-reduced-motion`.
- **Package manager:** pnpm 10. Scripts: `typecheck` (`tsc --noEmit`), `build`
  (`next build`), `lint` (`next lint`), plus contract checks in `test`.
- **Path alias:** `@/* → ./src/*`.
- **HQ auth:** cookie `HQ_ACCESS_COOKIE` + `verifyHqToken`, redirect
  `/hq/access`; all `/hq/*` pages `export const dynamic = "force-dynamic"` and
  inherit `HqShell` (env strip + nav + global `⌘K` palette).
- **Real data layer:** `readHqSection(section)` and per-section loaders in
  `src/lib/hq/*` parse `content/hq/**` markdown into typed entries;
  `getOperatorTodos()`, `getLaunchReadiness()`; atlas registry at
  `src/lib/atlas/loader.ts` reads `content/atlas/**`.

## 2. Graph technology — decision

**Chosen: hand-built SVG connection layer + absolutely-positioned HTML nodes.**

| Option | Verdict | Why |
|---|---|---|
| **SVG + HTML overlay (chosen)** | ✅ | Zero new deps; nodes are real `<button>`s (a11y + keyboard for free); connections are static geometry we style by class; motion under our control; the repo already ships this pattern (`hq/blueprint-canvas.tsx`). |
| React Flow / XYFlow | ❌ v1 | Not installed. Heavy for a fixed 9-node map; brings pan/zoom/handles we don't need yet; a11y is bolt-on. Reconsider only if Phase 2 needs true infinite canvas. |
| D3 | ❌ | Force layout is the opposite of "stable spatial memory"; large surface for a static graph. |
| Mermaid (installed) | ❌ for the map | Great for the registry's flowcharts (already used there), but not interactive/focusable enough for the Atlas. |

Positions are **fixed** (an octagonal orbit) — deliberately, so the map has
spatial memory and never reflows on lens change.

## 3. Server / client split

```
/hq/atlas-map/page.tsx        (server) — auth gate, force-dynamic
  └─ loadAtlasSnapshot()      (server) — reads content/hq/**, computes live figures
  └─ <AtlasExperience         (client island) — receives {graph, snapshot}
        graph={ATLAS_GRAPH}      props are plain serializable data
        snapshot={snapshot} />
```

- **Server** does all filesystem/markdown work and the scoring math, then passes
  a plain, serializable model to one client island. No data libs reach the client.
- **Client** owns interaction state only: `activeLens`, `focusedId`, `hoveredId`,
  `searchOpen`. Everything else is derived.

## 4. File plan

```
docs/atlas/                         # Phase 0 (this)
  research.md  prd.md  information-architecture.md  technical-plan.md  design-direction.md

src/features/atlas/
  types.ts                          # AtlasObject, AtlasConnection, AtlasLens, AtlasSnapshot, ...
  data/atlas-graph.ts               # curated nodes + connections + lens config + positions
  utils/atlas-scoring.ts            # pure: weighted composite, health, formatting (unit-testable)
  server/load-snapshot.ts           # 'server-only'; reads content/hq/**; builds AtlasSnapshot
  components/
    atlas-experience.tsx            # 'use client' root; state + keyboard; composes the rest
    atlas-canvas.tsx                # spatial orbit; renders connections + nodes; responsive
    atlas-connection-layer.tsx      # SVG paths, highlight on focus
    atlas-node.tsx                  # a focusable node button
    atlas-lens-switcher.tsx         # segmented control (radiogroup)
    atlas-mission-control.tsx       # founder strip (real figures)
    atlas-detail-panel.tsx          # right-side object panel
    atlas-investor-snapshot.tsx     # thesis + evidence, print-friendly
    atlas-search.tsx                # '/' object/lens search overlay
  atlas.css                         # scoped styles (imported by globals.css)

src/app/hq/atlas-map/page.tsx       # route
```

CSS: one scoped stylesheet `src/features/atlas/atlas.css`, appended to
`globals.css` via `@import` (matches how `ds/tokens.css` is imported), namespaced
under `.atlas-*` so nothing leaks. Utility classes used where they exist; custom
properties reused (no new color values).

## 5. Data-binding contract (defensive)

- Frontmatter values may be strings or numbers → coerce with a `num()` helper;
  missing → `null`, never `NaN`.
- Every loader call is wrapped so a missing/renamed section yields an empty list
  and an honest placeholder, **never a thrown render**. (`load-snapshot` is
  fail-open by design; the founder's map must not 500 because a file moved.)
- Launch composite = `Σ(score·weight) / Σ(weight)` over `launch-readiness/*`,
  rounded. Product maturity = mean of `products/*.maturity`. Critical risks =
  risks with `impact: High` and status in `{Needs attention, Blocked}`. Open
  decisions = `decisions/*` with `status: Active`. Blocking to-dos =
  `getOperatorTodos().blockingCount`.
- "As-of" date = max of the source dates touched (reviewDates / dates /
  lastVerified), formatted; falls back to "recently".

## 6. Motion & performance

- Only `opacity` and `transform` transition, 140–220ms `--ease-out`. No JS
  per-frame animation; the SVG is static geometry restyled by className.
- Full `@media (prefers-reduced-motion: reduce)` branch: transitions → `none`,
  states apply instantly.
- Responsive: `≥ 860px` spatial orbit; below, a single-column node flow with the
  SVG layer hidden (no canvas math on phones). Handled by a `matchMedia` hook +
  CSS, rendered once (no double render).
- The route is `force-dynamic` (like all HQ) — fine; the work is a handful of
  small markdown reads already cached per-request by the loaders.

## 7. Accessibility implementation

- Canvas is a `role="group"` with `aria-label`; each node a `<button>` with an
  accessible name including its health ("Launch System, needs attention").
- Roving tab / arrow-key movement between nodes; `Enter` focuses; `Esc` clears.
- Lens switcher = `role="radiogroup"`; options `aria-checked`.
- Detail panel = `<aside aria-label>`; focus moves in on open, restores on close;
  `Esc` closes; it never fully occludes the map (drawer, not modal, on desktop).
- Health encoded with text + shape, not color alone.
- Focus-visible rings via the existing focus treatment.

## 8. Integration points (minimal, safe)

- Add one entry to `hq-command-palette.tsx` ROOMS: `Atlas map → /hq/atlas-map`
  (keeps `⌘K` as the single global palette; the Atlas's own `/` search is scoped).
- No changes to the existing `/hq/atlas` registry, its loaders, or its links.
- No schema changes to `content/hq/**`. (Open question Q1 proposes _adding_
  optional numeric scores later; the Atlas already reads them if present.)

## 9. Verification

`pnpm typecheck` → `pnpm build`. Manual: keyboard-only pass, reduced-motion pass
(emulate), narrow-viewport pass, and a check that every rendered number traces to
a real source file. Note: the repo `test` script runs contract checks unrelated
to this feature; we will not weaken them.

## 10. Rejected / deferred

- Infinite-canvas pan/zoom (Phase 2+). v1 encodes zoom _levels_ conceptually.
- Object history/timeline (Phase 2) — data model leaves room (`lastReviewed`,
  future `history[]`).
- X-Ray mode (Phase 2/3) — the two-layer model (product vs engineering systems)
  already anticipates it via the Engineering domain's registry links.
- PDF export (Phase 4) — v1 ships print-friendly CSS for the Investor Snapshot as
  a down-payment.
