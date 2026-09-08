# Floor pages, company particulars and the design page archive · registry receipt

Branch `design/about-pricing-floor` (S·171) changed thirteen registered Studio
sources, and the materiality hashes in the registry were refreshed to match
them by a deterministic `experience:discover` run, spliced into the committed
registry entry by entry. Nothing else in the registry moved; the sibling
product entries this machine cannot re-derive were left exactly as committed.

## Entries refreshed

- `studio.page.root`, `studio.page.about`, `studio.page.pricing`: the floor
  and the sheet, and the launch notice. Coverage on these three is complete,
  and the About and Pricing browser specs were rerun against the review server
  (see `content/hq/design-reviews/about-pricing-floor-2026-09-08/`).
- `studio.page.terms`, `studio.page.privacy`: the operator and the data
  controller are now Signal Studio Limited, company number 823488.
- `studio.page.dispatch`, `studio.page.press`, `studio.state.root-not-found`,
  `studio.surface.site-navigation`, `studio.surface.products-mega-panel`:
  links to the archived design page repointed to `/principles`; no layout
  change.
- `studio.page.hq-cap-table`, `studio.page.hq-incorporation`: standfirsts now
  read incorporated rather than pre-incorporation.
- `studio.page.design-lab-brand-guidelines`: the lab gate moved into the
  shared `design-lab-gate` helper; behaviour unchanged.
- `studio.page.design` was re-registered as `studio.page.design-lab-design`
  at `/__design-lab/design` with its prior partial coverage values; its
  override key and every plan, review and golden-set reference moved with it.

## What this receipt does not claim

A registry hash update is a record that the change was seen, not design
approval. Coverage values were not raised anywhere. The partial-coverage
entries above still need rendered, accessibility and fixture evidence before
any certification claim.
