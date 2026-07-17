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

Signal Studio is four products, one system. Users should feel the surface hold still as they move from Notes to Tasks to Timeline to Signal. The product should change. The operating chrome should not.

The review panel converged on the same rule from brand, design, and engineering: continuity belongs in the sticky header; product meaning belongs in the hero, the product surface, and the canonical product gesture.

## Implementation Rule

Public product marketing pages use `SuiteLauncher`. Authenticated app surfaces use `SuiteSwitcher`. Low-chrome public content surfaces are allowed only as explicit surface-level exceptions, not as a precedent for bespoke product headers.

Notes remains a controlled material exception. Its warmer notebook register can skin the header, but the shell follows the shared geometry.

As of 2026-07-02, the product chrome shell is fixed at 56px high, sticky top, `z-40`, full-bleed hairline, and a centered 1240px content grid on both public product pages and product app chrome. The suite launcher remains visible on mobile public headers; Sign in remains visible in the top row for signed-out users. Product-specific nav links may collapse into a menu, but they must not change the shell height, material, or left lockup.

As of 2026-07-04, the public product header is a single shared component, `src/components/chrome/suite-header.tsx`, copied byte-identical across tasks/analytics/roadmap/notes. It owns the shell, the left lockup, the desktop nav, and the mobile menu. Each product's marketing header (`site-nav.tsx`, or `notes-header.tsx` for Notes) is a thin wrapper that passes only its launcher, wordmark glyph, nav links, and account control through slots; auth wiring stays per-repo in the account slot. This closes the gap that let four bespoke headers drift: before this, the contract was geometry-only and permitted separate header systems, which produced three different hairline colors (one a green-grey leftover from the retired Notes register), two wordmark sizes, and four mobile-menu implementations. The hairline is now one neutral suite rule (`--suite-header-hairline`) everywhere. `scripts/check-chrome-contract.mjs` enforces all of it: each product header must use SuiteHeader, the shell carries the geometry and neutral hairline, and SuiteHeader is byte-identical across the four (sha-sealed, the same model as the SuiteLoader identity seal). The umbrella (signalstudio.ie) keeps its own top nav and is checked for geometry only.

As of 2026-07-06, the contract also fixes the nav *content*, not just the shell. The prior rule shared the shell but still let each product choose its own primary nav links, and they diverged badly: Signal ran Signal · Ten rules · Refusals · Pricing · About · Design; Tasks ran Demo · Anatomy · App · Pricing · Design; Timeline ran Pricing · About · Demo · Dispatch · Design; Notes ran nothing. Geometry and byte-seal held the frame identical while the words inside it drifted four ways — which is why "this keeps happening." The marketing header nav is now **exactly `Pricing · Design`, both umbrella links** (`signalstudio.ie/pricing`, `signalstudio.ie/design`). The product wordmark is home; everything else (Ten rules, Refusals, About, Demo, Anatomy, App, Dispatch) stays reachable from the footer and the page body where it earns the place, not the primary header. This supersedes the 2026-07-02 line "product-specific nav links may collapse into a menu" — there are no product-specific primary nav links anymore. `scripts/check-chrome-contract.mjs` now asserts the nav label set is exactly `[Pricing, Design]` for every product wrapper, so nav content can no longer drift, only be changed here on purpose.

As of 2026-07-17, the **authed app surface** graduates from the marketing shell to the **Studio Bar** (founder direction, Tasks dispatch T·94; promoted from the Option B design lab). The app chrome is a 48px neutral-charcoal bar plus a 60px product rail forming one L-shaped Signal Studio frame around the white canvas. Bar grid, aligned to the shell below it: 60px Signal Studio mark cell over the rail; 248px workspace-switcher cell over the sidebar; scope capsule (planning period › workspace, the one off-white element); universal "Search, jump or create…" command field on Cmd/Ctrl+K; reserved restrained Signal-pulse slot (never a generic notification bell); contextual create; account. The rail carries the four products in the canonical tile geometry with the current product lit indigo. Product-local navigation, view controls, filters, progress, and milestones stay out of the bar. Tasks ships it first; the other three products migrate to the same bar, and this section is the contract they copy. The marketing header contract above is unchanged. The tasks repo's `scripts/check-chrome-contract.mjs` now asserts the Studio Bar geometry (48px, charcoal token, z-40, grid cells, pulse slot) in place of the app-chrome SuiteHeader rule; SuiteSwitcher remains the rule only for products that have not yet migrated.

## Risks

Over-uniformity can flatten product meaning. The mitigation is to keep the hero and product body highly specific, while keeping the header quiet and consistent.

Bespoke headers are the larger risk. They make the suite feel like four unrelated products and weaken the brand promise that the system holds still while the work changes.
