# Home page v3, round 2 · registry receipt

Branch `design/home-v3-round2` (S·184) rebuilt the public home page from six
blind reviews of the live page. One registered Studio source changed, and its
materiality hash in the registry was refreshed with the registry's own
`hashFile`, spliced into the committed entry. Nothing else in the registry
moved.

## Entry refreshed

- `studio.page.root` (`src/app/page.tsx`): only the comment that describes
  the signed-out page changed in this file. The page it renders changed a
  great deal, in `src/components/home/`, which the registry does not hash.
  `5316f65851ef54cc` to `094e2e78fddf27c8`.

## Changed, not registered

Everything under `src/components/home/`: the page order, the three-step
Friday story, the frames' sizing, the runtime, the style sheet, the waitlist
form's optional question and note, the whiteboard's layout module
(`whiteboard-layout.ts`) and the capture registry (`shots.json`,
`shot-manifest.json`). `public/landing/` is rebuilt by
`scripts/build-landing-shots.mjs` into one content-hashed folder. Four
contract tests that pin home page strings moved with the page:
`src/lib/product-urls.test.ts` (links may now go to `/privacy` and to the
company's email address), `src/app/pricing/pricing-contract.test.ts` (the
story order), `src/lib/ui-wave3-contract.test.ts` (a new check that the print
palette equals the light palette) and `tests/experience/home.spec.ts`.

## Evidence

- Decision: `content/hq/decisions/home-page-v3-2026-10-02.md`, Round 2.
- Reviews and fix plan: remote-redesign lab,
  `work/2026-10-01-landing-v3-2026-10/panel/round-2/`.
- Rendered result, from the production build: first screen and every section
  at 1440 dark, 1440 light and 390 dark, and before and after proofs for the
  structural defects,
  `content/hq/design-reviews/2026-10-02-home-page-v3/round2-home-*.png`.
- Browser spec: `tests/experience/home.spec.ts`, 22 tests. New in this round:
  deep links, reload position, the page's height before script, theme
  persistence and first paint, the story step from scroll position, tabs that
  never show an empty plate, header opacity, the whiteboard's height,
  transforms, pause and non-drag move, touch target sizes, forced colours,
  print, no script, focus under the header, the struck words, and axe at
  WCAG 2.2 AA with best practice at zero violations.

## What this receipt does not claim

A registry hash update is a record that the change was seen. Coverage values
were not raised or lowered. Everything was measured in Chromium, headless; no
real phone, Safari, Firefox, screen reader or Windows High Contrast theme was
used. The waitlist form was never submitted with a valid address. A web font
that arrives after the first frame can still re-wrap a line and change the
page's height by a line or two; scroll anchoring holds the view when it does,
and deep links and reloads were measured landing correctly on a cold cache.
