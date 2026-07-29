# Marketing motion contract

Date: 2026-07-29
Applies to: the six public marketing surfaces in the marketing delight ledger

## Purpose

Motion on these pages must make state, continuity, responsiveness or product
explanation clearer. Delight is an outcome of precision, not an animation
category.

## Tokens

| Token | Duration | Use |
| --- | ---: | --- |
| `--marketing-motion-press` | 120ms | press acknowledgement |
| `--marketing-motion-fast` | 160ms | colour, border, opacity |
| `--marketing-motion-state` | 220ms | menu state and local disclosure |
| `--marketing-motion-settle` | 360ms | one-shot editorial or pricing settlement |

| Token | Value | Use |
| --- | --- | --- |
| `--marketing-ease-out` | `var(--ease-out)` | objects entering or responding |
| `--marketing-ease-move` | `var(--ease-in-out)` | spatial movement between known states |
| `--marketing-ease-hover` | `var(--ease-out)` | colour, border and opacity |

Rules:

- no `ease-in`;
- no `transition: all`;
- no scale from zero;
- no authored navigation delay;
- no transform beyond 12px for shared marketing chrome;
- stagger is 35–45ms and ends before it becomes a sequence to watch;
- entering and exiting are interruptible from the current rendered state.

## Page hierarchy

| Page | Dominant expressive moment | Supporting motion |
| --- | --- | --- |
| Notes | accepted Notes hero | product switcher, handoff, action feedback |
| Tasks | accepted Tasks hero | product switcher, handoff, action feedback |
| Timeline | accepted Timeline artifact | product switcher, handoff, action feedback |
| Signal | accepted editorial read | product switcher, handoff, action feedback |
| Pricing | product-mark suite acknowledgement | plan settlement and action feedback |
| About | founder-signature lineage | reading progress and product-row direction |

## Interaction rules

### Menus

- The control changes state immediately.
- The panel enters from the trigger's edge with 6–8px of travel.
- Exit is shorter and travels no more than 4px.
- Escape restores focus.
- ArrowDown from the Products trigger opens the panel and focuses its first
  product.
- A link activation never waits for the panel exit.

### Links and actions

- Text links use colour, border or arrow direction.
- Button-shaped links may compress to `0.98`.
- Row-shaped links may settle by 1px or `0.99`; they do not lift.
- Hover-only feedback is gated to `(hover: hover) and (pointer: fine)`.
- `:focus-visible` receives equivalent information without relying on hover.

### Scroll-linked and one-shot motion

- Scroll progress reflects scroll directly; it is never eased.
- Living Artifact remains coupled to its reviewed stage.
- Pricing and About one-shots fire once per page mount.
- Long-form paragraphs do not stagger or reveal.

## Reduced motion

`prefers-reduced-motion: reduce` does not mean “erase every transition.”

Keep:

- colour;
- border;
- opacity when it communicates presence;
- final state;
- focus indication;
- direct scroll progress.

Remove:

- authored travel;
- compression/scale;
- ambient loops;
- staggers and delays;
- scroll-coupled intermediate artifact states where a settled receipt is
  clearer.

## Interruption and performance

- Motion reads only transform and opacity during authored travel.
- No animation owns layout height after a panel is dismissed.
- Rapid open/close leaves one authoritative state.
- Observers disconnect after their one-shot has fired.
- No `will-change` remains on long-lived static content.
- Production verification checks that Pricing has zero infinite decorative
  animations after the suite acknowledgement has settled.
