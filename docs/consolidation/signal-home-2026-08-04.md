# Signal → Home consolidation — studio evidence record (2026-08-04)

Approved-baseline reference for the 17 surfaces re-baselined in the
`signal-home-ship` branch (PR #142). Signal left the product line, not
the product: the public site presents three products — Notes, Tasks,
Timeline — with the daily briefing as a system capability built into
Home. Full programme record: `app` repo,
`docs/projects/signal-home-consolidation/` (PROJECT, DECISIONS,
MIGRATION, CONTENT-INVENTORY, QA, LAUNCH-ASSET-CHANGES).

## What changed per surface

Copy-level migration to the three-product model (no layout rebuilds
except where stated): about, press, proof, terms, students, teachers,
weddings, work, redeem-by-code, dispatch (preamble only),
hq-one-pagers-brand, venues (one comment), venues-demo (step 4 copy +
CTA). Pricing: the four-card suite grid became a deliberate 3-up grid
plus an included "And your daily signal." band; tier copy, FAQs and the
compare table follow. products-mega-panel: three products, 3-up grid,
briefing capability row. signal: the product page is now a permanent
redirect to /features/daily-briefing. features-daily-briefing: new
feature page carrying the briefing story (canonical set, in sitemap).

## Verification (measured on this branch, 2026-08-04)

- `pnpm test` (product-marketing, suite-switcher, chrome, loading,
  venue-edition contracts): all ok.
- `pnpm exec tsc --noEmit`: clean. `pnpm build`: 49/49 pages.
- Browser: `/signal` 301s to `/features/daily-briefing`; homepage hero
  sequence ends "your daily signal"; relay Act IV is Home with the
  Today's Signal preview; pricing shows three cards + briefing band
  (screenshots in the session record).
- Four-product sweep: `grep -ri "four products|fourth product"` over
  `src/app` and `src/components` returns no live product-lineup claims.
- Validator parity: the experience gate's failure set on this branch
  equals the origin/main pre-existing set (measured on a detached
  worktree, same method as the 2026-08-04 venues re-baseline) — this
  branch's own 17 surfaces are the ones it clears, and it touches no
  other lane's registry entries.
