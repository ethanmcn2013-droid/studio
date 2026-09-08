# About and Pricing on the floor · capture record

Review target: `src/app/about/` (page.tsx · about.css), `src/app/pricing/` (page.tsx · pricing.module.css · pricing-selection.tsx), `src/components/reveal/reveal-hero.tsx` (launch notice), `src/components/landing/site-footer.tsx` (company particulars).
Decision: `content/hq/decisions/about-pricing-on-the-floor-2026-09-08.md`.
Branch: `design/about-pricing-floor` from `main` at 72bea05d; captures taken from the uncommitted working tree that this branch's first commit records.

## Preview

- Command: `pnpm exec next dev -H 127.0.0.1 -p 4387` with `SIGNAL_ACCESS_MODE=review` and `NEXT_PUBLIC_SIGNAL_ACCESS_MODE=review` (the Playwright configuration's own server), from the worktree root.
- URL: `http://127.0.0.1:4387` · routes `/`, `/about`, `/pricing`.
- The dev banner ("In development, private preview with staged access.") is the review-mode banner; it does not render in production.

## Captures (2026-09-08)

Playwright Chromium 1.61, device scale 1, light scheme, en-GB. Each page was walked to the bottom so every sheet settled and the home scenes played, then captured at the top and as a full page.

| File | Route | Viewport |
|---|---|---|
| `home-1440-viewport.png` · `home-1440-full.png` | `/` | 1440×900 |
| `home-390-viewport.png` · `home-390-full.png` | `/` | 390×844 |
| `about-1440-viewport.png` · `about-1440-full.png` | `/about` | 1440×900 |
| `about-390-viewport.png` · `about-390-full.png` | `/about` | 390×844 |
| `pricing-1440-viewport.png` · `pricing-1440-full.png` | `/pricing` | 1440×900 |
| `pricing-390-viewport.png` · `pricing-390-full.png` | `/pricing` | 390×844 |

Measured at capture, both viewports, all three routes: horizontal overflow 0 px; no console or page errors; the footer carries the company particulars (Signal Studio Limited, company number 823488). Pricing's title holds two lines at 1440 and 390.

## HTTP checks

`/about` 200 · `/pricing` 200 · `/design` 307 → `/principles` · `/brand` 308 → `/principles` · `/__design-lab/design` 200 on the local review host and 404 with `Host: signalstudio.ie` · `/sitemap.xml` no longer lists `/design`.

## Browser specs

`tests/experience/about-redesign.spec.ts` (15 tests, rewritten to the floor structure), `tests/experience/pricing.spec.ts` (unchanged, 26 tests) and `tests/experience/marketing-delight.spec.ts` (About assertions updated) pass against this server. `tests/experience/brand-guidelines.spec.ts` passes when run alone; its reduced-motion chapter check trips under parallel load, and that page is untouched here.

## Found and fixed during capture

- Links that sit on the floor inherit the floor's paper text; the About product cards and the Pricing closing button rendered white on white until their colour rules were made three classes deep.
- Without JavaScript the reveal fallback needed `transition: none` as well as opacity and transform, or the first paint caught the sheets mid-fade.
