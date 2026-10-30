# Retired product names · registry receipt

Branch `fix/retire-product-names-everywhere` (S·205) changed four registered
Studio sources. Their materiality hashes were refreshed from a deterministic
`experience:discover` run and spliced into the committed registry entry by
entry. No other entry moved; sibling product entries this machine cannot
re-derive were left exactly as committed.

## Entries refreshed

- `studio.page.terms`, `studio.page.privacy`: the product is named as one
  app instead of Signal Notes, Signal Tasks and Signal Timeline. Every
  commitment is unchanged; the updated dates move to 30 October 2026.
- `studio.page.press`: boilerplates rewritten around the one app, and the
  three-product list replaced by a plain "What it does" list.
- `studio.page.redeem-by-code`: the included list and the three claim lines
  describe the whole app rather than three products. No layout change.

All four pages sit behind the launch boundary. Press, Terms and Privacy were
rendered locally with the boundary off at 1280px: no page errors and no
retired product names in the main content.

## What this receipt does not claim

A registry hash update is a record that the change was seen, not design
approval. Coverage values were not raised. The entries above still need
rendered, accessibility and fixture evidence before any certification claim.
