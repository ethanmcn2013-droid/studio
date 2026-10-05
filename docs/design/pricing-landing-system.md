# Pricing page — current landing system

Pricing extends the current landing page visual world. `src/components/home/home.css` owns the shared dark/light palette, Geist typography, wrap and gutter rhythm, navigation, focus treatment, and footer environment. `MarketingShell` renders the shared `HomeHeader` and applies the saved landing theme preference; `src/app/pricing/pricing.module.css` owns the Pricing composition. Keep `DESIGN.md` as the deprecated historical record and this page document as a route-specific description, not a second token authority.

The page reads as one continuous surface: a spacious two-line opening, quiet commitments, hairline-led sections, an interactive plan ledger, a product proof sequence, plain answers, and a final decision area. Dark is the default; light uses the same semantic roles and structure. Indigo is reserved for emphasis, selected states, and calls to action. Surfaces shift by tone and fine borders rather than ornamental effects.

## Colors and theme

Use the shared landing tokens: `--lp-floor`, `--lp-floor-2`, and `--lp-raised` for base, secondary, and raised surfaces; `--lp-text`, `--lp-text-2`, and `--lp-text-3` for descending text emphasis; `--lp-line` and `--lp-line-strong` for separators and component boundaries; `--lp-signal` for filled actions and `--lp-signal-ink` for text emphasis, labels, and selected indicators. Theme-specific values come from `home.css`; Pricing components should consume these semantic properties rather than define a parallel palette. The selected plan and hover state use the shared raised surface, with signal ink for the selected cue.

## Typography

The shared landing surface uses Geist through `var(--font-sans)` with the landing page’s legibility settings. Pricing keeps a compact, tracked uppercase eyebrow, a large tightly tracked hero (`clamp(3rem, 6.5vw, 6rem)` on wide screens), and restrained section headings (`clamp(1.75rem, 3.3vw, 3rem)`). Supporting copy uses the shared secondary text color and generous line height. Plan names and prices gain weight through size and weight, not a separate display face. Use the existing typography and relative `rem` sizing; do not introduce a decorative serif or a new font scale.

## Layout and responsive behavior

The Pricing content is centered in a maximum 75rem shell, with 3rem side gutters on wide screens, 1.5rem below 48em and 1rem below 25em. The hero has generous top and bottom space; major sections use 6rem vertical padding, reduced to 4rem on narrow screens. The introduction and closing area move from split columns to a single column. The plan ledger presents five aligned information columns on wide screens; at tablet widths it tightens, and below 48em it becomes stacked selectable rows with their detail panel beneath. Below 25em, plan rows and comparison details become single-column. Feature comparison changes from a wide table to expandable plan details on mobile. Proof steps likewise collapse to one column before phone widths.

## Components and shape

The plan ledger has one clear outer boundary, clipped corners, and thin row dividers; selection is shown with the raised surface and signal-colored action text. Its expanded detail panel uses an inset floor, a top rule, and a three-part desktop grid for summary, facts, and decision, becoming two columns and then one column as space narrows. Proof cards and timeline receipts use quiet raised surfaces, thin boundaries, and consistent rounded corners. Calls to action use the landing signal fill, white text, and a compact rounded rectangle; hover deepens the same signal. Focus-visible controls use a 2px signal-ink outline with offset. Under forced colors, native system highlight and button colors retain visibility. Reduced-motion preferences remove the detail-panel arrival animation.

## Commercial behavior preserved

The visual treatment does not define or replace commercial terms. Plan names, prices, billing cadence, eligibility, limits, access, VAT notes, savings, and waitlist destinations continue to come from the existing commercial presentation and plan data. Plan selection reveals the corresponding facts and decision action; comparison disclosures remain available on mobile. Keep all claims, source data, routes, and selection behavior in their existing implementation when changing presentation.

## Do's and Don'ts

- Do reuse `MarketingShell`, `HomeHeader`, the shared landing theme, and `--lp-*` roles.
- Do keep the page open, typographic, and organized with alignment, spacing, and hairline rules.
- Do preserve the wide ledger to compact selectable rows and expandable mobile comparison behavior.
- Do keep price and entitlement copy data-driven from the existing commercial definitions.
- Don’t introduce an independent palette, font system, or competing header.
- Don’t treat this visual document as authority for prices, eligibility, legal terms, or access claims.
