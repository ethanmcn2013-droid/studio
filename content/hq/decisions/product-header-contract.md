---
id: product-header-contract
title: Product pages use one sticky header contract with product-specific content slots.
category: Brand
date: 2026-07-01
status: Active
reviewDate: 2026-09-01
relatedObjects: [studio/DESIGN.md, studio/docs/SUITE.md, notes/src/components/marketing/notes-header.tsx]
---

## Decision

Product pages use a uniform sticky header contract across Signal Studio. The header shell is shared: sticky top chrome, fixed height, centered container, suite launcher or app switcher on the left, product identity in the middle of that lockup, and auth/account controls on the right.

Products may customize the content slot, page links, and material register when the product job demands it. They may not create separate header systems, product colors, animated nav gestures, or different geometry.

## Reason

Signal Studio is three products and one authenticated Home, held by one system.
Users should feel the surface hold still as they move from Notes to Tasks to
Timeline and back through Home. The product should change. The operating
chrome should not.

The review panel converged on the same rule from brand, design, and engineering: continuity belongs in the sticky header; product meaning belongs in the hero, the product surface, and the canonical product gesture.

## Implementation Rule

Public product marketing pages use `SuiteLauncher`. Authenticated app surfaces use `SuiteSwitcher`. Low-chrome public content surfaces are allowed only as explicit surface-level exceptions, not as a precedent for bespoke product headers.

Notes remains a controlled material exception. Its warmer notebook register can skin the header, but the shell follows the shared geometry.

As of 2026-07-02, the product chrome shell is fixed at 56px high, sticky top, `z-40`, full-bleed hairline, and a centered 1240px content grid on both public product pages and product app chrome. The suite launcher remains visible on mobile public headers; Sign in remains visible in the top row for signed-out users. Product-specific nav links may collapse into a menu, but they must not change the shell height, material, or left lockup.

As of 2026-07-04, the public product header is a single shared component, `src/components/chrome/suite-header.tsx`, copied byte-identical across tasks/analytics/roadmap/notes. It owns the shell, the left lockup, the desktop nav, and the mobile menu. Each product's marketing header (`site-nav.tsx`, or `notes-header.tsx` for Notes) is a thin wrapper that passes only its launcher, wordmark glyph, nav links, and account control through slots; auth wiring stays per-repo in the account slot. This closes the gap that let four bespoke headers drift: before this, the contract was geometry-only and permitted separate header systems, which produced three different hairline colors (one a green-grey leftover from the retired Notes register), two wordmark sizes, and four mobile-menu implementations. The hairline is now one neutral suite rule (`--suite-header-hairline`) everywhere. `scripts/check-chrome-contract.mjs` enforces all of it: each product header must use SuiteHeader, the shell carries the geometry and neutral hairline, and SuiteHeader is byte-identical across the four (sha-sealed, the same model as the SuiteLoader identity seal). The umbrella (signalstudio.ie) keeps its own top nav and is checked for geometry only.

As of 2026-07-06, the contract also fixes the nav *content*, not just the shell. The prior rule shared the shell but still let each product choose its own primary nav links, and they diverged badly: Signal ran Signal · Ten rules · Refusals · Pricing · About · Design; Tasks ran Demo · Anatomy · App · Pricing · Design; Timeline ran Pricing · About · Demo · Dispatch · Design; Notes ran nothing. Geometry and byte-seal held the frame identical while the words inside it drifted four ways — which is why "this keeps happening." The marketing header nav is now **exactly `Pricing · Design`, both umbrella links** (`signalstudio.ie/pricing`, `signalstudio.ie/design`). The product wordmark is home; everything else (Ten rules, Refusals, About, Demo, Anatomy, App, Dispatch) stays reachable from the footer and the page body where it earns the place, not the primary header. This supersedes the 2026-07-02 line "product-specific nav links may collapse into a menu" — there are no product-specific primary nav links anymore. `scripts/check-chrome-contract.mjs` now asserts the nav label set is exactly `[Pricing, Design]` for every product wrapper, so nav content can no longer drift, only be changed here on purpose.

As of 2026-08-04, the **authed app surface** uses the Studio Bar over a
three-product rail plus Home. Notes, Tasks, and Timeline are the product
destinations. Home owns orientation and the briefing. The historical
four-product geometry below remains provenance for how the shell was built,
not the current navigation contract. Product-local navigation, view controls,
filters, progress, and milestones stay out of the bar.

### Consolidation amendment · 2026-07-26

The migration is complete in topology. Notes, Tasks, Timeline, and Signal now
share one application frame at `app.signalstudio.ie`; no product copies app
chrome into a standalone repository. The shared frame owns account identity,
suite search, authorized context, the Studio bar, and the product rail in the
fixed order Notes, Tasks, Timeline, Signal. Product modules own their local
canvas and controls.

The current implementation must isolate module data failures. Loading Tasks
must not be a prerequisite for Notes capture, the Timeline owner artifact, or
the Signal briefing. Historical byte-seal and per-repository copy rules above
remain provenance for the visual contract, not the current implementation
mechanism.

### Mobile bounds amendment · 2026-07-30

The chrome holds its declared height at every width. A control inside the bar
may not exceed it (Tasks dispatch T·110). At 375px the Tasks bar was drawing
three 80px controls inside its 56px mobile shell: the account avatar, the
contextual create button, and the product wordmark. The avatar read as a large
black circle clipped by the right edge; the other two spilled invisible pointer
targets over the canvas below the bar.

The cause is a trap the other three products will hit as they copy this
contract. The suite spacing scale is semantic, not derived from pixels:
`tokens.css` maps step 8 to 40px, step 10 to 64px, and step 11 to 80px. In
stock Tailwind those same numeric utilities mean 32px, 40px, and 44px. Chrome
written as `h-11`, meaning "the 44px touch step," therefore renders at 80px.
**Chrome geometry that has to land on a real pixel value is written in pixels,
not in scale steps.** Semantic steps stay correct for spacing, where the scale
is the point.

Two consequences to carry into the remaining migrations. First, the numbers
quoted in the sections above describe intent, not measured output: the bar's
`h-10` reads as 64px live, not the 48px the 2026-07-17 section states, so
`scripts/check-chrome-contract.mjs` is asserting a token name rather than a
height. The contract's stated geometry and the rendered geometry should be
reconciled against measured values in a following pass, and the checker taught
to assert measured height. Second, floating chrome yields to the docked rail.
The in-development notice measures the mobile product rail and sits above it
rather than across the Notes, Tasks, Timeline, and Signal tabs, inside the
device safe area.

## Risks

Over-uniformity can flatten product meaning. The mitigation is to keep the hero and product body highly specific, while keeping the header quiet and consistent.

Bespoke headers are the larger risk. They make the suite feel like four unrelated products and weaken the brand promise that the system holds still while the work changes.
