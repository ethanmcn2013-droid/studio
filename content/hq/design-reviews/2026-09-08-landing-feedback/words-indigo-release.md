# Muted indigo word strikes · 8 September 2026

Request: make the dashes through each banned word a muted indigo. This is a
continuation of the authorized landing page refinement and deployment.

Baseline: production source `388c849d813374269a37e89b94ab5d68d78b42b7`,
deployment `dpl_2U3BPZCj2qi55vmg3GbEenZE4Dyf` at <https://signalstudio.ie/>.

Only the background colour of `.nowords span::after` changes. It now mixes
65% of the canonical indigo accent with the existing ghost-ink neutral,
making a softer, less saturated indigo. All sixteen words share that rule.
Text colour, line dimensions, word wrapping, reveal timing and hover
retraction retain their existing declarations. No new test is needed for
this colour-only change; the repository's full release gates still apply.

Before screenshots and DOM measurements were captured from production at
1440 × 1100 and 390 × 844. The original strikes are rgb(17, 17, 17).

Local typecheck, all 464 tests, design-system drift check and production
build passed. The serial test runner and one build worker follow the earlier
receipts to fit workstation memory. The separate venue-term-parity source
script skips without an adjacent App checkout; no tests failed or skipped.

The actual production build was visually compared at 1440 × 1100 and
390 × 844. All sixteen lines resolve to
`color(srgb 0.492353 0.469412 0.880196)` (approximately RGB 126, 120, 224).
Word dimensions, text colours and wrapping match the baseline. Desktop
section height remains 1016.25px and neither viewport has horizontal overflow.
Hover retracts the line, then restores it; reduced motion shows all sixteen
strikes. Browser logs contain no errors or warnings.

Required CI and production verification remain pending. Evidence uses the
`words-indigo-` prefix and this directory's Git LFS rules for screenshots
and logs.
