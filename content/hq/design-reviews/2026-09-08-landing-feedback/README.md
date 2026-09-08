# Landing feedback · 8 September 2026

Task branch: `fix/landing-timeline-dot-favicon`, based on Studio `e1589703`.
The paired App favicon change is `d840b869` in draft PR
<https://github.com/ethanmcn2013-droid/app/pull/173>.
This is an internal implementation and review, with no production deployment.

## Requested changes

The timeline frame should be longer and remain at full width as its content
changes orientation. Dot Studio should animate in the footer's lower-left
gap. Browser favicons should agree across the product system and have a
regression guard.

The timeline now uses one centered width, capped at 1680px with 48px viewport
gutters, and the existing content width below 1024px. Its entrance does not
scale the frame. The Across/Down sequence changes content and height without
changing frame width, horizontal position, or shadow. The vertical layer has
natural height instead of stretching to the old stack height. Mobile header
controls wrap inside the panel. Reduced motion renders the completed scene
with no decorative ring pulse.

The footer uses Dot Studio v2's existing rigid circle and asymmetric eyes
from `feat/dot-studio` at `c2ee2fd8`. Its small CSS performance includes gaze,
blink, hop and wink. The landing opts in; the shared footer's other callers
keep their existing content. Dot pauses when offscreen, when the document is
hidden, when the user pauses it, and under reduced motion.

## Visual evidence

Captured from the actual Next page at <http://127.0.0.1:3100/> on 8 September
2026, around 18:35–18:50 UTC. Desktop viewport 1440 × 1300; mobile 390 × 844.
Earlier desktop baseline captures used a 1440 × 1100 viewport. PNG evidence
is retained through Git LFS. `before-*` captures precede all source edits;
`after-*` captures show the revised timeline and integrated footer.

- [Before: Across](before-desktop-across.png) and [Down](before-desktop-down.png).
- [After: Across](after-desktop-across.png) and [Down](after-desktop-down.png).
- [Footer before](before-desktop-footer.png) and [after](after-desktop-footer.png).
- [Mobile before](before-mobile-down.png), [after](after-mobile-down.png),
  [all vertical dates](after-mobile-down-dates.png), and [footer](after-mobile-footer.png).

At desktop, the baseline frame narrowed from 1384px to 820px, making the
header wrap. The revised frame remains 1392px wide at x=16.5px in the start,
Across, Down and settled states. Its height moves from 900.23px to 1095.23px
and back. At mobile, width remains 331px at x=22px, with height moving from
1099.36px to 1432.36px. Document scroll width equals client width in both
viewports. These figures are recorded in the two timeline metrics files.

The desktop footer remains 740px tall before and after. Dot's 80 × 86px
stage occupies the existing left gap. Pause/resume was exercised through
the real button. Scrolling to the top sets `data-running=false`. Reduced
motion was toggled live for Dot, then the page was reloaded to verify the
timeline's completed state, count of 79, and absent ring animation. All
temporary viewport and motion emulation was reset afterward.

Browser console: no errors observed. The one warning is Motion's expected
notice that reduced motion was enabled during the preference check. The
favicon, browser icon, install icon, Apple icon, and mirrored static ICO
each returned HTTP 200 with the expected image content type.

## Favicon scope and remaining reference

Both repositories contained the legacy Next triangle in `favicon.ico`
despite branded generated icon routes. The fallback now renders the same
existing SuiteMark as those routes. Static brand pages use a relative copy
that also works in the deck publisher's independent hosts. The default test
gate checks the artwork seal, actual generated image responses, all ICO
sizes, and static copies. It was verified to reject the old triangle.

The user referenced `C:/Users/mcnamet/Desktop/ceo1.html#changed`; this machine
has the Ethan workspace, and that file and browser tab were unavailable.
No exact visual match to that reference is claimed. The current committed
indigo dot and ring is preserved pending the user's clarification. A fresh
unmerged App branch with different artwork was found and left untouched.
See [the favicon contract](../../../../docs/FAVICONS.md).

## Checks and preview

Scoped footer checks, the product/chrome contracts, and favicon tests pass.
The initial Studio typecheck passed. Initial full tests and production build
hit Windows memory/child-process exhaustion; those failures are retained
without being labelled source regressions or passes. Final gate results are
recorded in [the verification receipt](verification.md).

The design detector's warnings in the existing landing stylesheet concern
incumbent spring tokens and layout transitions. This refinement preserves
the selected design; the requested height transition is deliberate. The
footer detector reported no findings. An independent code review found no
new timeline width, height-fit, or replay issue.

Preview command (adapted from the workspace launch configuration):
`node node_modules/next/dist/bin/next dev --turbopack --hostname 127.0.0.1 --port 3100`.
Run from this worktree. The first preview's PIDs were 37424/27348 and were
stopped after browser checks to free memory for the full gate. See the final
verification receipt for the resumed preview process and exact source state.
