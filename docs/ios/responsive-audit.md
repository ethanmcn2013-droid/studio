# iPhone-width responsive audit

Suite-wide audit of the four product `/app` surfaces against modern iPhone widths. Source for the iOS-prep cycle's Item 5; pairs with `~/Projects/personal/studio/scripts/responsive-audit.mjs` which Playwright-screenshots each surface at every documented width.

## Why this exists

Tasks T·58 (2026-05-15) caught a regression where the homepage cinematic demo was clipped on phones despite voice-checked QA having passed. Lesson recorded in memory: "voice-verified ≠ pixel-verified, always screenshot phone width." This audit closes the loop suite-wide and gives the operator a reusable script for ongoing checks.

Webview-wrapped iOS UI inherits the website's responsive bugs and magnifies them. Anything that clips at 390 in Safari also clips inside a Capacitor / native WebView at 390. Catching these before iOS submission is the gate.

## Widths covered

| Width | Device                                           | Why it's the test point                                          |
| ----- | ------------------------------------------------ | ---------------------------------------------------------------- |
| 320   | iPhone SE (1st gen, residual install base)        | The narrowest still-supported iPhone width. If 320 works, all work. |
| 375   | iPhone SE (2nd / 3rd), iPhone 13 mini             | Long-running mid-narrow target.                                  |
| 390   | iPhone 13/14/15 standard                         | The largest standard share.                                       |
| 393   | iPhone 14/15 Pro                                  | One pixel different from 390; catches Pro-Max-only padding bugs. |
| 414   | iPhone Plus, older Max                            | Pre-15 Plus targets.                                              |
| 430   | iPhone 14/15/16 Pro Max, Plus                     | The current widest standard iPhone.                                |

Plus orientation rotation when relevant (Timeline viewer benefits from landscape per the manifest `orientation: "any"` we shipped in Item 1).

## Static-audit findings (run 2026-05-20)

| Product   | Viewport meta | Safe-area-inset usage  | Fixed-width potential clips | Verdict |
| --------- | ------------- | ---------------------- | --------------------------- | ------- |
| Tasks     | viewportFit:"cover", themeColor:#fff ✓ | Multiple `env(safe-area-inset-bottom)` references (board + sidebar) ✓ | No hard `min-w-[Npx]` floors above 280px in /app surfaces | Clean |
| Timeline   | viewportFit:"cover", themeColor:#fff ✓ | `env(safe-area-inset-bottom)` on the responsive footer ✓ | One sm:-gated `min-w-[260px]` settings field (sm+ only) | Clean |
| Signal | viewportFit:"cover", themeColor:#fff ✓ | `env(safe-area-inset-bottom)` on the marketing footer ✓ | `min-w-[160px]` on a desktop nav popover (auto-hidden on phone) | Clean |
| Notes     | viewportFit:"cover", themeColor:#fff ✓ | **No env(safe-area-inset-*) anywhere** | No fixed/sticky bottom elements today, so no clip today | Watch — see future-proofing below |

### Notes — future-proofing for safe-area

Notes today has no fixed/sticky bottom element, so the absent safe-area-inset usage doesn't currently regress on a notched device. But the iOS suite app and any future Notes phone-composer will add one — when it lands, the home-indicator overlap will be silent until someone screenshots at 430×932 with the notch simulator turned on.

Recommended future-proofing (not applied in this cycle since it would touch the Notebook layout): when Notes adds any bottom-anchored UI, wrap with `style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}` matching the pattern Tasks/Timeline/Signal already use.

## Visual-audit findings (deferred to operator)

A full Playwright screenshot pass at all six widths × four products = 24 screenshots minimum, more with PWA-standalone and authed surfaces. The script at `~/Projects/personal/studio/scripts/responsive-audit.mjs` runs this end-to-end. Operator runs it because:

- Authenticated `/app` surfaces require a real Clerk session — one per product, since the four products run separate Clerk instances and a `__session` cookie from one does not cross-validate against the others. The script reads per-product session tokens from `CLERK_SESSION_TASKS`, `CLERK_SESSION_ROADMAP`, `CLERK_SESSION_ANALYTICS`, `CLERK_SESSION_NOTES` and skips authed surfaces for products without a token in env.
- Visual judgment ("does this look right") needs a human; the script captures evidence, doesn't judge it.

Default behaviour is public-only — no env or flags required. Run as:

```bash
node scripts/responsive-audit.mjs                  # public, prod
node scripts/responsive-audit.mjs --profile=local  # public, localhost
node scripts/responsive-audit.mjs --pwa            # also do a standalone-PWA pass
CLERK_SESSION_TASKS=... node scripts/responsive-audit.mjs --authed
```

The script flags any screenshot where the final URL doesn't match the requested surface (e.g. a redirect to `/sign-in` because the session token wasn't set or wasn't valid) by suffixing the filename with `-REDIRECT.png`. This prevents the silent-wrong-page-capture failure mode where an authed surface screenshot is actually the sign-in page.

The `--pwa` pass overrides `navigator.standalone = true` (so JS-feature-gated PWA code paths render) but **does NOT** emulate the `@media (display-mode: standalone)` CSS media query — Playwright/Chromium has no override for that media feature. Any UI gated on the CSS rule (rather than the JS property) won't render under the `-pwa` screenshots. Worth running a real installed PWA pass on a physical phone before iOS submission for the surfaces that use standalone-only CSS rules.

Operator output target: `~/Projects/personal/studio/.responsive-audit/<run-id>/<product>-<surface>-<width>[-pwa][-REDIRECT].png` — gitignored by default.

### Scope-of-coverage caveat

Apple Review tests the authed `/app` surfaces — they create an account inside the app and verify the work-surface renders correctly. The static audit above covers the *codebase* surface (CSS / viewport / safe-area patterns); the Playwright script covers the *rendered* surface but only for the surfaces where the operator has provided a session token in env. **Treat the static audit as a partial App Store pre-gate, not a complete one.** A full pre-gate requires the operator to run the script with at least one `CLERK_SESSION_<PRODUCT>` env for each of the four products and visually inspect each authed surface at 390 and 430.

## iPhone-specific gotchas this audit cannot static-detect

The following only surface under live render — the Playwright script catches them, the static grep cannot:

- **Dynamic Island intrusion** — content under the top 59px on iPhone 14/15 Pro is occluded. `viewport-fit: cover` + `env(safe-area-inset-top)` on the top nav is the fix; all four products use `viewport-fit: cover` already.
- **Home-indicator overlap** — the bottom 34pt is the swipe-up gesture zone. Anything tappable there is unreliable.
- **iOS Safari URL-bar collapse** — viewport height changes as the user scrolls; 100vh references mid-scroll can over-shoot. Prefer `100dvh` (dynamic viewport height) or explicit `min-h-screen` with `viewport-fit: cover`.
- **Touch target ≥ 44pt** — Apple HIG floor. Currently Clerk's social buttons use `!min-h-[48px]` (above the floor) per all four products' `socialButtonsBlockButton` override. Suite-wide tap targets should match.
- **iOS Safari input zoom on focus** — any input with `font-size < 16px` triggers auto-zoom. Tasks/Timeline have `!text-[16px]` on `formFieldInput`; Notes/Signal should match if their inputs sit under 16px.
- **PWA install vs Safari tab** — the manifest's `display: "standalone"` (we ship this) changes URL-bar presence. The audit script's `--pwa` pass exercises the JS path (`navigator.standalone`); the CSS `@media (display-mode: standalone)` path still requires a physical installed-PWA pass before iOS submission.

## Suite-wide patterns that survive

- All five sites set `viewportFit: "cover"`. This is what makes `env(safe-area-inset-*)` meaningful — without it, iOS pads the viewport itself and the env vars return 0.
- All five set `themeColor: "#ffffff"` to prevent the dark-flash transition between products on cross-domain navigation (R18 fix from the 2026-05-17 recording remediation wave).
- The Clerk appearance overrides use `!min-h-[48px] !text-[16px]` on form fields across Tasks/Timeline/Signal. iPhone Safari's input auto-zoom is suppressed and the WCAG 2.5.5 tap target floor (44px) is exceeded.

## Operator follow-up

| What                                                  | Owner                  | Close condition                                                                                |
| ----------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| Run `scripts/responsive-audit.mjs` on prod URLs       | Operator               | Captures the 24-screenshot baseline at six widths × five sites; default is public-only.        |
| Provision `CLERK_SESSION_<PRODUCT>` env per product   | Operator               | One `__session` cookie value per product (Tasks/Timeline/Signal/Notes); enables authed pass. |
| Visually inspect every captured PNG, flag `-REDIRECT` | Operator + ux-director | No `-REDIRECT.png` files for authed surfaces; no visible clipping at 390 or 430.                |
| Apply safe-area-inset to Notes' bottom composer       | Senior-engineer        | When Notes adds any bottom-anchored UI element; not needed today; ticketed on Notes elevation cycle. |
| Re-run audit on every cycle that touches `/app`       | Senior-engineer        | Tasks T·58's lesson — "voice-verified ≠ pixel-verified" — applies to every responsive surface. |

## Reverification

| Date       | What changed                                                                              | Updater                |
| ---------- | ----------------------------------------------------------------------------------------- | ---------------------- |
| 2026-05-20 | Initial audit. Static grep across all 5 sites. Operator-runnable Playwright script shipped. | Agentic iOS prep cycle |
| 2026-05-20 | Panel review: cookie injection refactored to per-product env keys (multi-Clerk-instance correctness); `--public-only` is now an explicit accepted flag (no-op since it's the default); `--pwa` standalone-context pass added; scope-of-coverage caveat added making explicit that authed `/app` surfaces are the App Store gate target; redirect-detection adds `-REDIRECT.png` suffix to prevent silent wrong-page captures. | Agentic iOS prep cycle |
