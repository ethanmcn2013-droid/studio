# About page — current landing system

The About page extends the current landing page rather than its retired floor-and-sheet design. Its visual authority is `src/components/home/home.css`: shared dark/light palette, Geist, wrap width, gutters, button treatment, header and footer. About-specific layout rules are in `src/app/about/about.css` and use the existing `--lp-*` tokens.

The composition is a continuous floor: large left-aligned claim, existing introduction and company facts, open product rows, a quieter founder passage, hairline-separated refusals and contact. AboutShell shares HomeHeader with product links returning to the corresponding landing sections. Both surfaces use the same saved theme preference. Its small runtime handles themes and compact navigation without loading the landing product demonstrations.

All existing story copy, facts, metadata and contact attribution remain. The header logo owns the `.mark` class; prose must not reuse it. Keep `DESIGN.md` as the deprecated historical record, per the repository contract.

Verification includes desktop/mobile in both themes, nine widths down to 320px, reduced motion, forced colors, accessibility, no JavaScript, keyboard menu dismissal, enterprise and venue contact URLs. The existing About browser spec documents these behavioral requirements.
