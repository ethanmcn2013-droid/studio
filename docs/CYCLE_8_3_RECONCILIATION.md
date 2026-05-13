# Cycle 8.3 — Reconciliation handoff (Option A)

**Status:** closed 2026-05-13. Studio + Tasks both shipping. End-to-end venue-redemption path live (modulo deploy).

## What I missed and the fix

Cycles 8.1 and 8.2 built parallel infrastructure (Turso `entitlements`, `sponsors`, `license_codes`, `redemptions` tables on studio + HMAC token utility + `/api/redeem` POST handler + planned cross-product identity work) for a problem Tasks already solved: comp-code redemption, entitlement writes, paywall checks. Grep on `tasks/` for "redeem" earlier in Plan 8 would have caught this; saved feedback memory `feedback_cross_repo_grep.md` exists exactly to prevent this and I failed to honor it.

The fix this cycle: **Tasks's `comp_codes` + `entitlements` remain the runtime source of truth.** Studio's `sponsors` + `license_codes` + `redemptions` are demoted to **sponsor audit only** (who issued what to whom, when). Studio's `entitlements` table is now unused — but kept in place rather than dropped, in case cross-product entitlements work in Cycle 9+ rehabilitates it. The HMAC token utility and `/api/redeem` POST handler were deleted. The `REDEMPTION_HANDOFF_SECRET` env var was removed from local + Vercel.

## The shipped flow

```
Couple opens email from Lamb's Hill
        │
        ▼
signalstudio.ie/redeem/LAMBSHIL-MP93X    ← STUDIO: co-branded landing
        │  (lookupRedemption resolves "claimable" via studio license_codes)
        ▼
"Claim your seat" CTA — direct link
        │
        ▼
tasks.signalstudio.ie/redeem/LAMBSHIL-MP93X    ← TASKS: redeemCompCodeAction
        │  - Sign-in if needed (Clerk on Tasks)
        │  - Look up comp_codes
        │  - Idempotency check on entitlements.notes
        │  - Insert entitlement {source:"comp", tier:"wedding", notes:"comp:LAMBSHIL-MP93X"}
        │  - Decrement comp_codes.redeemed counter (quantity:1 → exhausted after one)
        ▼
RedeemResultCard rendered (Tasks)
        │
        ▼
User clicks through to /app/board
        │
Webhook user.created has already provisioned users + workspaces row
        │
        ▼
/welcome page (first run)    ← TASKS: detectVenueWelcome runs
        │  - Finds wedding/comp entitlement
        │  - Parses comp_codes.notes JSON for sponsor identity
        │  - Calls applyTemplateAction("wedding-planning-workspace")
        │  - Updates workspaces SET template_id, active_domain='wedding'
        │  - Redirects to /app/board?welcome=venue
        ▼
/app/board?welcome=venue    ← TASKS: BoardPage server component
        │  - Re-runs detectVenueWelcome (cheap; 2 indexed lookups)
        │  - Renders VenueWelcomeCard with sponsor name
        ▼
"Compliments of Lamb's Hill. Your wedding workspace is ready."
        │  (client component, dismissible, localStorage-keyed per sponsor)
```

## Files touched

### Studio
| File | Change |
|---|---|
| `src/app/redeem/[code]/page.tsx` | CTA changed from form POST to direct anchor link to `${TASKS_URL}/redeem/[code]`; ManualProvisioningView removed; preview state set trimmed |
| `src/app/api/redeem/route.ts` | **Deleted** |
| `src/lib/redeem/token.ts` | **Deleted** |
| `scripts/issue-codes.ts` | Refactored to dual-write — studio `license_codes` (audit) AND Tasks `comp_codes` (runtime) per couple-code minted; sponsor identity embedded in comp_codes.notes as JSON |
| `.env.local` | Removed `REDEMPTION_HANDOFF_SECRET`; added `TASKS_DATABASE_URL` + `TASKS_AUTH_TOKEN` (read by `issue-codes.ts` for cross-DB write) |
| Vercel production | `REDEMPTION_HANDOFF_SECRET` removed |
| `docs/VENUE_EDITIONS_PLAN.md` | Cycle 8.3 section updated to reflect reconciliation |
| `.claude/state/phase.md` | Cycle 8.3 closure entry appended |

### Tasks
| File | Change |
|---|---|
| `src/server/db/venue-welcome.ts` | New helper — `detectVenueWelcome(userId)` joins entitlement → comp_code → sponsor JSON, returns `{ code, sponsorName, sponsorSlug }` or null |
| `src/app/welcome/page.tsx` | First-run path now checks `detectVenueWelcome` before existing pendingTemplate logic. On hit: applies wedding template + updates workspace + redirects to `/app/board?welcome=venue` |
| `src/components/welcome/venue-welcome-card.tsx` | New client component — fixed-bottom dismissible card with sponsor name; localStorage-keyed dismissal per sponsor slug |
| `src/app/app/board/page.tsx` | Reads `?welcome=venue`; if present, calls `detectVenueWelcome` and renders the card |
| `src/components/welcome/welcome-picker.tsx` | Replaced `"Pick a starter so you have something to play with"` → `"Pick a starter. Your workspace fills with a real example to edit."`; replaced `"Loaded · ready to open"` → `"Your starter is in"`; replaced the gloss subhead too |

### Tasks data (in prod)
| Data | Status |
|---|---|
| 3 LAMBSHIL comp_codes | Backfilled into Tasks's `comp_codes` table with sponsor JSON notes (`tier=wedding, quantity=1, duration_days=365`) |

## Verification

- Studio: `tsc --noEmit` clean (after clearing `.next/types` of stale validator referencing deleted /api/redeem); `next build` clean
- Tasks: `tsc --noEmit` clean (passes silently); `pnpm build` clean (route map shows /welcome, /app/board, /redeem/[code] all present)
- Backfill verified: `SELECT * FROM comp_codes WHERE code LIKE 'LAMBSHIL-%'` returns 3 rows with sponsor JSON notes
- End-to-end live test: **deferred** — requires production deploys of both repos to walk a real LAMBSHIL code through Clerk sign-up

## Acceptance for Cycle 8.3

- [x] Architecture A (reconciliation, use Tasks's existing system) committed
- [x] Studio bridge work rolled back (token util + API route deleted, env var removed from local + Vercel)
- [x] Studio /redeem/ CTA wired to Tasks /redeem/[code]
- [x] issue-codes.ts dual-writes (verified with backfill against 3 existing codes)
- [x] Tasks detectVenueWelcome helper
- [x] Tasks welcome page short-circuits to /app/board for venue redemptions
- [x] Tasks workspace welcome card with sponsor name + dismissal
- [x] Techy copy strings replaced
- [x] Both repos typecheck + build clean

## What's NOT done (deferred)

- **Production deploys of both repos.** Holding until the end-to-end test plan is run locally OR you're ready to ship a real venue test.
- **Vercel env vars on Tasks for cross-DB write.** Not needed — issue-codes.ts runs locally from studio (operator-only), not from a deployed surface.
- **Cross-product entitlements** for compliments/review-access reaching Notes/Roadmap/Analytics. Cycle 9+ scope. Today, those redemptions still go through Tasks's flow and grant a Tasks-only entitlement; using studio tier in those other products will read as Free until cross-product identity ships.
- **Signal HQ data.ts entry.** Will write when Cycle 8.5 launches with Lamb's Hill (visible stakeholder scope).

## Open architectural debt

- Studio's `entitlements` table is now unused. Decision needed Cycle 9+: drop it (and own that cross-product entitlements live in Tasks's DB), or keep it and build the cross-product identity layer that reads it.
- Studio's `sponsors` + `license_codes` + `redemptions` are audit-only. Need to decide if they're load-bearing for partner dashboards (Cycle 8.4) or duplicative with Tasks's comp_codes count.
- The dual-write in `issue-codes.ts` is fragile — if the studio insert succeeds but the Tasks insert fails, the code is in audit but not runtime. Wrap in a try/catch with rollback in Cycle 8.4 if any meaningful volume materialises.

## Next: Cycle 8.4

Operator surface — `/pricing` quiet line, `/hq/partners` read-only view, monthly digest script. Per the plan, this is when studio first reads `entitlements`/`license_codes`/`redemptions` from a production route. Worth pausing then to revisit whether to drop studio's `entitlements` table (per the architectural debt above).
