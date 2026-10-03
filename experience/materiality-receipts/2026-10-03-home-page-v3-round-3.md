# Home page v3, round 3 · registry receipt

Branch `fix/home-v3-round3` (S·185) answered the third blind review of the
live home page. Seven registered Studio sources changed and one new route was
registered. Each hash was refreshed with the registry's own `hashFile`,
spliced into its committed entry; every refreshed entry's old hash matched the
file on `main` (0a295ccf), so each change is this branch's. Coverage values
were not moved on existing entries.

## Entries refreshed

- `studio.page.root` (`src/app/page.tsx`): the route reads nothing from the
  request. It exports a static viewport (the device's two floor colours) in
  place of `generateViewport`, renders only the public page, and no longer
  shows the footer mascot. `094e2e78fddf27c8` to `8969e65e34ac47b7`.
- `studio.page.press`, `studio.page.pricing`, `studio.page.principles`,
  `studio.page.privacy`, `studio.page.terms`: each gains
  `export const dynamic = "force-dynamic"` and a comment, so they render per
  request exactly as before now that the root layout no longer reads a
  request header. No visible change.
  Press `de378d3dc2ae2d6c` to `5a33d032bd77a1f8`; Pricing `fed9a1432c9f8834`
  to `3dc2ef033458f09d`; Principles `235f89a319e540b4` to `d35618ff83d7e5ab`;
  Privacy `b706e3cddb4c1e34` to `5e5bb3cc402e76e3`; Terms `cfc4fd3da0eadd93`
  to `c8fb1637f3c7de0e`.
- `studio.surface.site-navigation` (`src/components/layout/site-nav.tsx`):
  the site nav steps aside on `/launcher` as it does on `/`.
  `1c4b12301c5e809b` to `e3cfe2aff9e480c4`.

## Entry added

- `studio.page.launcher` (`src/app/launcher/page.tsx`, hash
  `ee6292fd8fa47089`): the signed-in variant of `/`, moved out of
  `src/app/page.tsx` unchanged. The proxy rewrites `/` to it for a session
  cookie or the `x-signal-authed` marker and redirects a direct request to
  `/`. Registered `live`, `registered`, with partial automated coverage (the
  browser spec checks it renders with no site nav and a white browser bar,
  by cookie and by marker).

## Changed, not registered

Everything under `src/components/home/` (the forms, the sample, the toast,
the whiteboard and its layout module, the capture registry and the boot
script), `src/app/layout.tsx` (no header read, the no-script floor),
`src/app/hq/layout.tsx` (`force-dynamic` for the HQ subtree),
`src/proxy.ts`, the footer mascot (`footer-dot.tsx`, `footer-dot.css`,
`src/lib/dot/render.ts`), the footer's registration line size
(`site-footer.css`), `scripts/build-landing-shots.mjs` and the rebuilt
captures in `public/landing/106ae2a981/`.

Contract pins that moved, each on purpose:
`src/app/pricing/pricing-contract.test.ts` (the story order: the same thing
in your words after the sample), `src/lib/ui-wave3-contract.test.ts` (the
no-script palette must equal the light palette; a new check that the root
layout and the home route read nothing from the request) and
`tests/experience/home.spec.ts` (the server's theme colours, the order, the
toast, the note under the form, the phone wall's height). Nothing in the
chrome, product-URL or Venue Edition contracts changed.

## Evidence

- Decision: `content/hq/decisions/home-page-v3-2026-10-02.md`, Round 3.
- Review: remote-redesign lab, `work/2026-10-01-landing-v3-2026-10/panel/round-3/`.
- Rendered result from the production build, at 390, 768, 1024, 1440 and
  1920 in both themes, and every section at 390 and 1440:
  `content/hq/design-reviews/2026-10-02-home-page-v3/round3-*.png`.
- Browser spec: `tests/experience/home.spec.ts`, 33 tests. New in this round:
  every capture follows the theme switch both ways; no capture is fetched on
  arrival; the hero and prompt forms (unique ids, hidden fields, the same
  checks, nothing sent); the closing form's error slot; the launcher by
  cookie and by marker and its internal route; `?theme=` dropped on the
  switch; the page with no script follows the device; Back to `/#join`; the
  sample's right-hand column and Undo and Redo; the phone sample holding
  still; whiteboard re-homing, Tidy closing up, the clean resting frame and
  the loose phone wall.

## What this receipt does not claim

A registry hash update is a record that the change was seen. Everything was
measured in Chromium, headless, on a local production build; no real phone,
Safari, Firefox, screen reader or Vercel deployment was used. Whether the
browser restores `/` from the back/forward cache could not be observed
headless; Chromium no longer gives a reason of the page's own for refusing it.
The waitlist forms were never submitted with a valid address. The mascot's
cost was measured on the development server with the mascot shown for the
measurement only, since no page shows it after this change.
