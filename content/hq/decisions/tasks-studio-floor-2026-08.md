---
id: tasks-studio-floor-2026-08
title: Studio Floor is the Tasks design, and the palette is Ink, Indigo and White only
category: Product
date: 2026-08-18
status: Active
owner: founder
area: Design
reviewDate: 2027-02-18
relatedObjects: [app design/tasks-exploration, app docs/design/labs/tasks-2026-08/, app src/components/floor/, studio public/hq/labs/tasks-studio-floor/, signal-design-quality-operating-system]
---

## Decision

**Studio Floor is the design for Signal Tasks**, and it shipped to production
on 18 August 2026.

The direction was chosen by the founder from a four-way exploration and then
elevated over eleven rounds of a seven-seat quality panel. It replaces the
board interior, the chrome and the palette on every Tasks surface.

### What the direction locks

- **One spine.** The top Studio Bar and the projects sidebar stand down on
  Tasks. There is one capsule rail on the left, and it is the only spine.
  `/app/tasks` is a bare-chrome path for exactly this reason.
- **Three colours.** Ink `#111111`, Indigo `#4f46e5`, White `#ffffff`, and
  tints of those three at stated alpha. Nothing else. Status is carried by
  **ink density and fill, never by hue** — so the board has no amber lane, no
  green tick and no red overdue. This is a deliberate departure from the
  suite's status palette on this surface, and it is machine-checked.
- **One chip grammar.** Every time fact is a point in time; the fill states
  the condition. Filled means behind, outlined means due today, indigo means
  the next milestone, a hairline ring means a record (finished, or held).
- **One tab stop.** The whole board is a single roving group whose size does
  not grow with the work on it — five stops at rest and five at peak season.
- **Geist at 400 and 600 only**, on one declared tracking curve by size.

### What earned the decision

Eleven rounds, seven independent seats each round, every finding
adversarially verified by a separate agent instructed to refute it. **350
findings raised, 243 confirmed and fixed.** The lowest seat moved 6.3 → 8.1
against a 9.5 bar.

The gate was **not** met. It was not lowered to pass, and the artefact ships
at a stated 8.1–8.7 with the remaining distance recorded rather than hidden.

## What remains

Two to three focused days, none of it a redesign and none of it reopening
this decision:

- The filtered state — the board's primary Saturday move, still the one
  screen visibly undesigned. Half a day.
- Emptiness as a first-class state. Half a day.
- The 1000–1279px header band. Three hours.
- Keeping the focused card on screen through the flight. Three hours.
- The last of the copy, and two typographic passes. One day.

## Consequences

- **The suite chrome now has an exception.** Tasks does not wear the Studio
  Bar. Notes, Timeline, Home and Signal are untouched and still do. When the
  redesign reaches them this decision should be re-derived, not copied.
- **Design contracts were retired, not worked around.** The chrome contract
  and the board-pass-3 contract described the previous design and would have
  failed by construction. They were removed with founder authority as part of
  a redesign of the whole app. Every security, tenancy and authorisation test
  was left in place — none of them was in the way.
- **The board's three non-board views** (List, Schedule, Calendar) keep their
  previous interior inside the new shell until the redesign reaches them.
- The design master is the reference and the stylesheet is generated from it
  by `scripts/design/extract-floor-css.mjs`, so the shipped surface and the
  design cannot drift apart.

## Where the work lives

- **The vault:** `studio/public/hq/labs/tasks-studio-floor/` — the master, the
  interactive board, the eleven-round record and the session report, all
  self-hosted so they outlive any external link.
- **The exploration:** branch `design/tasks-exploration` in the `app` repo.
- **The gates:** `scripts/design/audit.mjs` (palette, weights, families, WCAG
  AA, hit targets, radii, motion) and `scripts/design/interaction-check.mjs`
  (192 behavioural assertions).
