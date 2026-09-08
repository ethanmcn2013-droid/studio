# Footer Dot and CRO follow-up · 8 September 2026

User request: make Dot 50% larger in the footer and ensure CRO number 823488
is visible. This continues the authorized landing deployment work.

Baseline: production commit `6989acd0946219d7b125c111d9c277e43d0135e0`, Vercel
deployment `dpl_ARMpx7Mg1QG4NgCpX4JjQ6sELQQQ`. Target: <https://signalstudio.ie/>.

## Diagnosis and change

The live footer already contained “Signal Studio Limited. Registered in
Ireland, company number 823488.” It was visible beneath copyright in 12px
text, without a CRO label. The live desktop capture and independent no-cache
HTML checks confirmed the number on the landing, pricing, about, notes and
privacy routes. There was no hidden CSS or missing shared-footer caller.

Both shared footer variants now say “Signal Studio Limited. Registered in
Ireland. CRO number: 823488.” Registration text is 13px, medium weight, and
uses the normal secondary text token. The number remains sourced from
`COMPANY_META.croNumber`, matching the user's supplied value.

Dot's stage changes from 80 × 86px to 120 × 129px: exactly 50% larger in both
dimensions. Its SVG retains the same proportions, animation and controls.
The left offset moves from -8px to -14px to preserve the visible circle's
alignment as the SVG's internal whitespace also scales. Desktop positioning
still uses the footer's existing gap; mobile remains in normal flow.

No favicon, timeline, environment or data change. Screenshots and bulk logs
use this directory's existing Git LFS rules.

## Verification before release

- All 460 tests passed using the serial package-script runner documented in
  `verification.md`; zero failed tests. The separate venue-term-parity source
  script skips because there is no adjacent App checkout.
- Typecheck, production build (34 static pages, one worker), design-system
  drift gate and Studio experience validation passed.
- Actual production build rendered at desktop 1440 × 1300, mobile 390 × 844,
  and the 1024px desktop breakpoint. Dot's visible diameter measures 85.71px,
  up from 57.14px: 1.5×. Registration text measures 13px, weight 500.
- Five desktop columns remain aligned; footer height changes only 1.625px
  for the larger registration text. Dot stays above the rule and below the
  social links. Mobile Dot fits in normal flow. No horizontal overflow.
- Pause/resume, reduced motion and the registration line on the Privacy
  page were checked. No unexplained browser console errors or warnings.
- Source and measured values: `footer-cro-metrics.json`. Before/after PNGs
  have prefix `footer-cro-`; gate logs have the same prefix.

## Production verification

All three required CI checks passed on source commit
`45e292259a2ee6cfabcec61dec9b4175077ef4e0`: verify, typecheck/test and design
quality. PR #182 was squash-merged through the normal protected workflow at
19:35:46 UTC. Production commit: `9a0b406a568c1d52e100413c7b0f2dd673a93770`.

Vercel deployment `dpl_B3YWBLUUVL5ivW65PVfTJFN4ryNj` became READY at
19:39:49 UTC and owns the production `signalstudio.ie` alias. Immutable URL:
<https://studio-f18f6yz9n-ethanmcn2013-1730s-projects.vercel.app>.

The live browser confirms Dot's 120 × 129px stage and 85.71px visible circle,
the explicit CRO number 823488, 13px medium registration text, five desktop
columns and no horizontal overflow at desktop or mobile sizes. Dot is visibly
animating. No console errors or warnings. Live evidence is retained in
`footer-cro-live-metrics.json` and the `footer-cro-live-*.png` captures.

Independent production smoke at 19:41:54 UTC: `/`, `/pricing`, `/about`,
`/notes`, `/tasks`, `/timeline`, `/privacy`, `/terms`, `/security`, and
`/accessibility` all return 200 and contain “CRO number: 823488.” in the
actual `.site-footer`, with no framework-error markers. The served CSS chunk
also confirms Dot's 120 × 129px dimensions.

Rollback target remains the preceding deployment
`dpl_ARMpx7Mg1QG4NgCpX4JjQ6sELQQQ` at `6989acd0`. No rollback was needed.
The task-owned local preview (PID 39092) is stopped after live verification.
