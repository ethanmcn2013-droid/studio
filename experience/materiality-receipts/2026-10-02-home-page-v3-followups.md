# Home page v3 follow-ups · registry receipt

Branch `fix/home-v3-followups` (S·182) changed two registered Studio sources,
and their materiality hashes in the registry were refreshed with the
registry's own `hashFile`, spliced into the committed registry entry by
entry. Nothing else in the registry moved. `studio.page.about` was not
touched by this branch and its hash, which already differed on `main`, was
left exactly as committed.

## Entries refreshed

- `studio.page.root` (`src/app/page.tsx`): the route now exports
  `generateViewport`, so the signed-out home page sends its floor colour as
  the browser theme colour (`?theme=`, else the device setting). The signed-in
  launcher branch returns nothing and keeps the layout's white. The rendered
  page is unchanged. `824df8d54bebcf99` to `5316f65851ef54cc`.
- `studio.page.pricing` (`src/app/pricing/page.tsx`): the product proof tells
  the home page's sample day, Friday 25 September at The Orchard, instead of
  the July review day. Same structure, same three steps and timeline receipt;
  only the sample words changed. `de65f7a096f55a77` to `c1993f2f16079243`.

## Changed, not registered

The site description, Open Graph description and structured-data description
in `src/app/layout.tsx`, the manifest description in `src/app/manifest.ts` and
the footer line in `src/components/landing/site-footer.tsx` now use sentences
from the home page. The registry does not hash these files.

## Evidence

- Decision: `content/hq/decisions/home-page-v3-2026-10-02.md`.
- Pricing proof before and after, at 390 and 1440:
  `content/hq/design-reviews/2026-10-02-home-page-v3/followup-*.png`.
- Browser spec: `tests/experience/home.spec.ts` gained one test for the
  browser theme colour in both themes, through the toggle, after leaving by a
  link, and on the signed-in launcher.

## What this receipt does not claim

A registry hash update is a record that the change was seen. Coverage values
were not raised or lowered. The shared review registry
(`src/lib/review-suite-presentation.ts`) still carries the July review day,
because it mirrors the app's fixture; Pricing no longer shows that day. No
real device was used: the theme colour was read from the page's tags in
Chromium, not from a phone's browser bar.
