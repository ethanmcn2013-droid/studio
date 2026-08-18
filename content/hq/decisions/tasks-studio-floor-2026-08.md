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

**Nothing. All five items closed 18 August 2026** and live in production.
Each was verified rather than declared:

- **The filtered state.** A column that answers nothing collapses to its
  dimmed head, so the answer is what the eye lands on rather than one card
  marooned in a field of full-height empty rules.
- **Emptiness as a first-class state.** One centred sentence and one action,
  in place of four identical Add rows over a white void.
- **The 1000–1279px header band.** Measured, not guessed: with the labels
  forced on, the gap between the facts and the controls is 121px at 1100 and
  21px at 1000, so the old threshold was stripping the words off the controls
  120px before anything needed the room. It moved to 1020. Below it the count
  now hides with the word it counts — "Planning 5" collapsing to an icon and
  a bare 5 left a number with nothing naming what there were five of.
- **Keeping the focused card on screen through the flight.** Resolved by
  deciding it should not always be the focused card. On a wide board the
  completed card is visible and focus follows it; on a narrow one it lands a
  column off screen, so focus stays with the work — the nearest card still
  in view. Following it would have cost the operator their place in the
  column they are working down; leaving focus on an invisible card is a
  focus-visibility failure. The card that left is still reachable: the strip
  names it and Ctrl+Z reverses it, neither of which depends on focus.
- **The last of the copy, and two typographic passes.** The filter strip was
  composing from one comma list — "Showing the 2 tasks overdue" — and the
  obvious repair produced "the 4 due today tasks". They are three grammars:
  an adjective before the noun, a predicate and a qualifier after it. All
  eight combinations were rendered and read. When nothing matches there are
  no "others" to hide, only the whole board. The two typographic items were
  already true and are now proven: no title produces a single-word last line
  at any of ten widths from 1440 to 390, and the Done tick resolves to the
  ink-2 the panel asked for.

Two defects found while closing these, neither on the list, both fixed:

- **A serious WCAG failure the panel missed and axe caught in one pass.** The
  roving tab stop lives on the cards, so on a narrow board the four columns
  not holding it had no keyboard route into their scrollers at all. The
  recorded lesson stands: panels and measurement are not substitutes.
- **The spine dropped the workspace when crossing products.** The suite
  sidebar the Floor replaced was where every cross-product link picked up its
  workspace; the spine linked to a bare `/app/timeline`, so a person stepping
  across landed in the right product with no idea which wedding they were
  looking at.

The 9.5 gate is still **not** met, and this does not claim it is. The score
stands where the eleventh round left it.

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
