---
id: spacing-scale-namespace-collision-2026-07-30
title: Fix tap targets at the call site now, un-remap the spacing namespace as its own pass
category: Product
date: 2026-07-30
status: Active
reviewDate: 2026-08-30
relatedObjects: [Signal Design System, Signal Tasks, Signal Notes, Signal Timeline, Signal, signal-ds]
---

## Decision

The design system remaps Tailwind's numeric spacing namespace onto its semantic
step scale. `tokens.css` sets `--space-11: 80px`; the generated `tailwind.css`
maps `--spacing-11` onto it. The override covers indices 1 through 12 only, so 13
and up fall through to stock Tailwind's `index * 4px`. Both scales are therefore
live at once.

Two consequences follow from that, and neither is fixable by documentation:

- Value collisions. `p-10` and `p-16` are both 64px. `p-11` and `p-20` are both
  80px. `p-12` and `p-24` are both 96px.
- Non-monotonicity. `min-h-11` is 80px while `min-h-14` is 56px and `min-h-16` is
  64px, so a higher index can render smaller.

Two separate changes were split out of this, deliberately:

1. **Tap targets are fixed at the call site, now.** `11` is the standard Tailwind
   idiom for the 44px WCAG 2.5.5 and iOS HIG minimum. All 52 index-11 sizing
   utilities in Tasks were touch-target patterns; none was an intentional 80px
   block, and the `pointer-coarse:` variants prove the intent, since that variant
   exists only for touch input. Those sites now carry explicit `[44px]` values,
   which are correct under either scale because 44px is an absolute accessibility
   floor rather than a rhythm choice. Shipped in Tasks as T·112.

2. **Un-remapping the namespace is its own pass, not part of the above.** The
   root-cause fix is to stop emitting `--spacing-*` from
   `signal-ds/scripts/build-tailwind.mjs`, leaving the numeric namespace to
   Tailwind and keeping the step scale reachable as `var(--space-N)`. That
   resizes roughly 501 uses across 108 files in Tasks alone, and Notes, Timeline
   and Signal vendor the same tokens. It gets its own pass per product, behind a
   preview deploy, with measured before and after per surface.

Container heights that ride the numeric chrome scale are explicitly out of scope
for change 1. The Tasks Studio Bar shell keeps `md:h-10` because dropping the
shell to a literal 40px while its contents are still inflated by the same remap
would leave those controls flush against the bar edges. Shell and contents move
together, in change 2.

## Reason

The scale did not merely surprise readers; it silently violated four governance
artifacts that state a pixel intent in prose and encode it as a token that does
not deliver it.

- `tasks/scripts/check-chrome-contract.mjs` asserts the Studio Bar contains
  `h-10` with the message "slim 40px bar". That token computes to 64px, and the
  bar measures 1280x64 on desktop. The gate is green because it greps the class
  name and never the computed value.
- Two Tasks accessibility contract tests asserted `min-h-11` and
  `pointer-coarse:h-11` under messages promising 44px. Rendered 80px.
- The design system's own generator comment describes the output as "utilities:
  p-1 … p-12 on the base-4 scale". The values are all divisible by four but are
  not `index * 4`, which is what every reader assumes.

Corroborating signals: the Tasks Studio Bar reads
`h-14 md:h-10 md:pointer-coarse:h-11`, which as Tailwind numbers means 56px on
phones, 40px on desktop, 44px on a desktop touchscreen, and as design system
numbers means 56px then 64px then 80px, making the desktop bar taller than the
mobile one. The same file reaches for `w-[60px]` and `w-[248px]` whenever an
exact pixel was needed, so the numeric scale was already not trusted for exact
values. And `min-h-[44px]` was in the repo before this pass, on a control sitting
in the same row as two `min-h-11` siblings.

Measured impact before the fix, on the review server with Playwright: 72 of 124
index-11 control instances at `min-height: 80px`. On a phone the Studio Bar
wordmark was an 80px box inside a 56px bar, which is a layout break rather than
only a hit-target problem.

Splitting the two changes keeps an accessibility correction from riding along
with a 501-site visual change across four products. The first is unambiguous and
safe under either scale. The second needs a visual pass and an operator decision.

## Consequences

- Tasks carries `scripts/check-tap-target-scale.mjs` in `pnpm test`, failing the
  build on any new index-11 sizing utility, with a shrink-only ledger for the one
  Signal-owned file excluded from this pass.
- Contract assertions in Tasks now name the literal 44px rather than the token,
  so a drifting token value cannot pass a green gate.
- The class-name-grep pattern used by `check-chrome-contract.mjs` and the
  accessibility contract tests is now known to be unsound for pixel claims. Those
  gates should assert computed pixels, which is folded into change 2.
- `tasks/docs/SPACING_SCALE_COLLISION.md` holds the compiled evidence, the
  reproduction recipe using Tailwind's own compiler, and the proposed generator
  change. Read it before starting change 2.
- Open at time of writing: whether change 2 proceeds, and whether the Signal
  briefing ledger's four remaining 80px controls are fixed in the Signal surface's
  own pass or picked up earlier.
