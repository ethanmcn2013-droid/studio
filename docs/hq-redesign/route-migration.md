# Signal HQ — Route Migration

_Phase 3 output. Principle: **no route is deleted or moved.** The redesign changes the shell and composition, not the URL space. Every existing deep link keeps working; navigation is reorganized around the routes, not by relocating them._

## New routes

| Route | Purpose | Back-compat |
|-------|---------|-------------|
| `/hq/action-center` | Unified "needs me": inbox + operator-todos + due/stale + readiness gates + pending decisions | Net-new. Old `/hq` still shows the same information (now summarized, linking here). No prior URL to preserve. |

## Changed behavior (not URLs)

| Concern | Before | After | Compatibility |
|---------|--------|-------|---------------|
| Global nav | Horizontal top bar, 9 links (3 in board mode) | Grouped left rail, 14 section entries + ⌘K | All 9 old links present in the rail. Deep links unchanged. |
| Today `/hq` | Long scroll: verdict + 90-row inbox + all hubs + audience paths | Verdict + top action + 5 numbers + workspace health + recent; long lists moved to Action Center | Same route, same data sources. Nothing removed — relocated with links. |
| Board mode | `boardMode` swaps top-nav to 3 links | Rail collapses to BOARD group | Same trigger (`pathname === '/hq/founders-circle'`), extended to the data-room. |
| Command palette | ~24 curated rooms | Full index (routes + assets + decisions), keywords/aliases, actions | Superset of the old list; every old command still resolves. |

## Route → group map (the IA spine)

- **TODAY**: `/hq`, `/hq/action-center`
- **Sell**: `/hq/crm`, `/hq/marketing`, `/hq/market-entry`, `/hq/plan`(+`/print`), `/hq/venue-kit`, `/hq/waitlist`
- **Make**: `/hq/design-rooms`, `/hq/cards`, `/hq/cafe-card`, `/hq/partner-card`, `/hq/poster`, `/hq/slide-30-review`, `/hq/product-hero-design-motion`, `/hq/socials`, `/hq/asset-command`, `/hq/demo-film`, `/hq/loading-review`, `/hq/experimentation-room`
- **Money**: `/hq/reporting`, `/hq/financial-model`, `/hq/cap-table`, `/hq/loan-pack`
- **Company**: `/hq/org`(+`[slug]`), `/hq/blueprint`, `/hq/incorporation`, `/hq/one-pagers`(+children)
- **Library**: `/hq/assets`, `/hq/design-rooms` (galleries)
- **Vault**: `/hq/vault`(+`[slug]`)
- **Atlas**: `/hq/atlas`(+`[slug]`), `/hq/atlas-map`
- **Board**: `/hq/founders-circle`, `/hq/data-room`, `/hq/deck`
- **Systems**: `/hq/entitlements`(+`[lookup]`), `/hq/experience-quality`, `/hq/platform-readiness`, `/hq/health`
- **System/gate**: `/hq/access`, `/hq/logout`
- **Redirect (kept)**: `/hq/partners` → `/hq/entitlements?tab=venues`

Every route in `current-inventory.md` appears above exactly once. Orphans (`/hq/health`, `/hq/waitlist`, `/hq/asset-command`, all `[slug]` details) are now reachable via their group's workspace landing + the palette.

## Redirects & aliases

- No new redirects required (no URLs move).
- `/hq/partners` redirect preserved as-is.
- The rail links to canonical routes; query-param entry points (`/hq/entitlements?tab=venues`, `/hq/crm?stage=demo_booked`) are preserved and still deep-linkable.

## Rollback

The redesign is additive at the shell layer: `HqShell` is swapped and `hq-os.css` is imported by `/hq/layout.tsx`. Reverting the layout + shell restores the old top-nav with zero data or route changes. New `/hq/action-center` can remain (harmless) or be removed independently.
