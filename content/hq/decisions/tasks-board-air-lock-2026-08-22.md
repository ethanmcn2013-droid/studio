---
id: tasks-board-air-lock-2026-08-22
title: The Tasks board locks to A·Air, and the standing design gates retire
category: Product
date: 2026-08-22
status: Active
owner: founder
area: Design
reviewDate: 2027-02-22
relatedObjects: [app src/components/floor/floor-preset.ts, app docs/design/FLOOR_CANON.md, app docs/design/labs/tasks-2026-08/customizer.html]
---

## Decision

**The Tasks board's appearance is the founder-chosen A · Air configuration of
the Tasks Design Console — flat cards, soft radius, compact density, subtle
indigo accents, calm type scale** (three overrides on the A preset: radius,
density, type). It shipped to production on 22 August 2026 as `FLOOR_PRESET`
in `src/components/floor/floor-preset.ts`, applied to the workspace root as
five data-attributes and realised entirely by option blocks that already lived
in `floor.module.css`. There is no runtime switching and no user setting; this
is what the board looks like. Fidelity was verified by computed-style probe:
production equals the design master value for value.

## The gates retire

In the same decision the founder retired the standing design/UI/UX constraint
machinery to clear the way for redesigns. Deleted with their enforcement chains:

- `.ds-grandfather.json` + `scripts/ds/ds-check.mjs` + the CI drift-gate steps
  (the hex/easing ratchet)
- `scripts/check-chrome-contract.mjs`, `scripts/check-loading-contract.mjs`
- `docs/design/TASKS_DELIGHT_MOTION_CONTRACT.md`
- `docs/DELIGHT_CATALOG.md`
- `src/components/hybrid/board-pass3-contract.test.mjs`
- `experience/council-reviews/baselines/wave-0-b0.json` (the Wave-0 external
  baseline; its pinned review predates the redesign and could no longer verify)

What survives deliberately: the URL/naming contract, the database release gate,
HQ sync, the experience/ evidence machinery itself, the quality council in
receipt-pending mode (NOT CERTIFIED until its receipt set lands — honest
verdicts only), and `app docs/design/FLOOR_CANON.md` as the one-page canon.

## Consequences

- Redesigns are now gated by taste, the north star, and this page — not by
  ratchets. The panel ritual remains available when a surface claims the bar.
- The console presets remain reversible: every axis's CSS is intact; changing a
  value in `floor-preset.ts` re-skins the board.
- The design master carries an unfixed mobile finding: at compact density its
  fixed header height crushes the stacked mobile layout at 390px. The app port
  fixes it locally; the master file is left as an historical record.
