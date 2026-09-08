# Footer Dot full film · 8 September 2026

Request: make Dot another 5% larger, play its complete film in the footer,
and run the film 40% faster. This continues the authorized landing deployment.

Baseline: production `9a0b406a568c1d52e100413c7b0f2dd673a93770`, deployment
`dpl_B3YWBLUUVL5ivW65PVfTJFN4ryNj`. Target: <https://signalstudio.ie/>.

## Motion and implementation

Dot performs its complete authored story in the footer's existing gap. Its
stage stays fixed while the artwork moves. The one animation clock runs only
while visible, preserves position through pause and visibility changes, and
shows a still pose for reduced motion. No new animation dependency is added.

The canonical Dot Studio v2 film is the 1,845-frame, 60fps sequence from
`feat/dot-studio` commit `c2ee2fd8273cdeca58f18b04f4ba45606dc39984`.
The original model, choreography, renderer and player are reused. Its artwork
palette is retained verbatim as data, without introducing site UI colours.
The footer renders the complete transparent SVG film, including satellites,
bead, all orbital layers and the closing return. The previous short CSS idle
loop is removed. The opaque MP4 master is not used as a footer matte.

At 1.4× speed, 30.75 seconds of film take 21.9642857 seconds per loop. The
stage grows from 120 × 129px to 126 × 135.45px, retaining the 140-unit SVG
framing: Dot's resting diameter grows from 85.714px to exactly 90px.

## Independent fidelity review

- All 1,845 film frames plus the endpoint have deep-equal poses and byte-for-
  byte identical transparent SVG compared with the canonical film source.
- Another 4,404 mood/performance frames match; 6,250 comparisons in total.
- Geometry sampled at 240Hz (7,381 samples) spans x ±73.952 and y -77.033
  through +67.187 units, including stroke widths. At the footer's scale,
  maximum side overflow is 3.556px and there is no vertical overflow. Visible
  SVG overflow preserves the entire artwork.
- Independent lifecycle review found no lost pause position, duplicate clock,
  hidden-tab catch-up, or reduced-motion issue.
- Four new tests cover all film frames, transparency and eye containment;
  every chapter at 1.4× and the exact loop seam; pause/visibility suspension;
  and reduced motion. They are part of the normal package test command.

## Release verification

- All 464 tests passed: 16 migration, 410 main-suite and 38 entitlement tests.
  The serial package-script runner avoids the workstation's parallel-process
  memory limit. The separate venue-term-parity source script skips because
  there is no adjacent App checkout; there are no skipped or failed tests.
- Typecheck, design-system drift check, Studio experience validation and the
  production build passed. The build generated 34 static pages with one worker.
- The actual production build was inspected at 1440 × 1300, 1024 × 900 and
  390 × 844. Dot's resting body is 90px wide. Desktop footer height remains
  741.625px; the five columns and explicit CRO number 823488 are preserved.
- A 24-second browser observation captured 300 samples, the closing return
  and loop, and measured playback at 1.39918× (rounded frame sampling). Stage
  width and height stayed fixed throughout. The browser rounds 135.45px to
  135.4375px at layout precision. No horizontal overflow at any checked width.
- Desktop orbit screenshot at film time 19.913s shows all front/back layers
  without a background or clipping. Mobile and the desktop breakpoint were
  visually inspected. Pause freezes both time and markup; reduced motion
  shows a static 90px Dot. Offscreen suspension and resumption also passed.
- No browser errors or warnings were recorded.

Required CI and live verification remain pending. Gate logs and before/after
screenshots use the `footer-film-` prefix and this directory's Git LFS rules.
