---
id: design-page-archived-2026-09-08
title: The public design page is archived behind the design-lab gate
category: Brand
date: 2026-09-08
status: Active
reviewDate: 2027-01-11
relatedObjects: [src/app/__design-lab/design/page.tsx, src/lib/design-lab-gate.ts, next.config.ts, src/app/sitemap.ts, src/lib/hq/make-labs.ts, content/hq/decisions/brand-guide-d01-committed.md]
---

## Decision

On 8 September 2026 the founder asked for the design page to stop being a
public page and to be archived for now. The page has moved, unchanged in
content, from `/design` to the design lab, behind the same gate as the
brand-guidelines review lab: it renders on local development, review deploys
and Vercel previews, and answers 404 on every production deployment and on
the canonical hosts. It is marked noindex.

`/design` now sends visitors to `/principles` with a temporary redirect, so
the decision stays easy to reverse, and `/brand` follows the same path
instead of chaining. The page left the site navigation, the products panel,
the footer, the 404 routes, the sitemap and the press page. Signal HQ's lab
gallery and the Atlas list it as parked, at its lab address.

## Reason

The founder's call. The archive keeps the dot narrative, the motion canon
and the print plates reviewable without presenting them as a public claim
while the estate is being rebuilt on the floor and the sheet.

## Reversal

Move the page back to `src/app/design/page.tsx`, remove the gate call and
the redirect, restore the links listed above, and return the lab entries to
live. Nothing else depends on the route.
