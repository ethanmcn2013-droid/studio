# Cycle 8.2 — Sponsors + license codes + /redeem/[code] (handoff)

**Status:** code + migration + scripts + route shipped 2026-05-13. Operator-side tasks none — Cycle 8.2 closes here. Cycle 8.3 (auth + redemption-completion bridge) is next.

## What this cycle shipped

### Data layer (second migration on `ethanmcnamara-studio`)

Three new Turso tables — `sponsors`, `license_codes`, `redemptions` — applied via `turso db shell ethanmcnamara-studio < drizzle/0001_init_sponsors_license_codes_redemptions.sql`. Schema in `src/lib/db/schema.ts`.

- `sponsors.slug` is unique. Used in both code prefixes and partner URLs.
- `license_codes.code` is unique. Status enum: `minted | redeemed | revoked`.
- `redemptions` is an audit log — one row per successful redemption with optional IP hash + user agent for fraud detection (deferred to 8.3 when redemption-completion actually writes here).
- `license_codes.source_type` mirrors `entitlements.source` — bridges the code-issuance world to the entitlements world without coupling the schemas.
- `license_codes.duration_days` — null means no expiry (compliments); 365 for venue weddings; 90 for review access. The redemption flow (Cycle 8.3) reads this to compute `entitlements.expires_at`.

### Scripts

| Script | Purpose | Invocation |
|---|---|---|
| `scripts/create-sponsor.ts` | Create a sponsor record | `pnpm create:sponsor <slug> <name> <contact-email> [brand-meta-json]` |
| `scripts/issue-codes.ts` | Bulk-issue per-couple codes for a sponsor; prints CSV to stdout | `pnpm issue:codes <sponsor-slug> <count> [source-type] [tier] [duration-days]` |

Codes are generated from a no-ambiguity alphabet (`CODE_ALPHABET` in `issue-codes.ts` — excludes `0/O/1/I/L`), prefixed with up to 8 chars of the sponsor slug. Example: `LAMBSHIL-MP93X`. Easy to read aloud, hyphen-anchored.

### Test data left in prod

One sponsor + three codes are seeded in `ethanmcnamara-studio`:

```
sponsor: lambs-hill ("Lamb's Hill", hello@lambshill.example)
codes:
  LAMBSHIL-MP93X  (minted, wedding, venue_edition, 365 days)
  LAMBSHIL-7U2DF  (minted, wedding, venue_edition, 365 days)
  LAMBSHIL-M52XX  (minted, wedding, venue_edition, 365 days)
```

These are fine to leave for Cycle 8.3 testing. The Lamb's Hill sponsor record will get its real contact email and brand_meta updated in Cycle 8.5.

### `/redeem/[code]` route

Server component at `src/app/redeem/[code]/page.tsx`, backed by `src/lib/redeem/lookup.ts`. The lookup is extracted so Cycle 8.3 can import it Tasks-side without duplicating SQL.

**View states:**

1. **claimable + venue_edition** — venue eyebrow (mono, quiet, no logo per creative-director panel input), warm sponsor headline, "What's included" stack, claim CTA.
2. **claimable + compliments** — no eyebrow (personal gift register), warmer welcome headline.
3. **claimable + review_access** — "Review access" eyebrow, time-boxed framing.
4. **already_used** — names the sponsor in the resolution copy.
5. **revoked** — "This offer has ended."
6. **invalid** — "That code doesn't match anything."
7. **network_error** — friendly fallback with hello@signalstudio.ie escape hatch.

**Design preview via `?state=` query:**

Each state is reachable via `?state=` for visual review — code lookup is bypassed.

```
/redeem/ANY-CODE?state=claimable_venue_edition
/redeem/ANY-CODE?state=claimable_compliments
/redeem/ANY-CODE?state=claimable_review_access
/redeem/ANY-CODE?state=already_used
/redeem/ANY-CODE?state=revoked
/redeem/ANY-CODE?state=invalid
/redeem/ANY-CODE?state=network_error
```

**Robots:** `index: false, follow: false` on the route's metadata so the redemption pages don't get crawled.

**The CTA is a non-functional placeholder.** A small mono note reads: *"Sign-up wires in the next deploy."* Cycle 8.3 wires the actual sign-up bridge (Clerk-side, in Tasks's repo most likely).

## Verification done this turn

- `tsc --noEmit` clean
- `next build` clean (`/redeem/[code]` registered as `ƒ` dynamic route)
- `lookupRedemption('LAMBSHIL-MP93X')` returns the expected `claimable` shape end-to-end against prod
- `lookupRedemption('DOES-NOT-EXIST')` returns `invalid`
- Case-insensitive: `lookupRedemption('lambshil-mp93x')` matches and returns the canonical uppercase code

## What this cycle did NOT ship (Cycle 8.3 scope)

- **Clerk integration on studio** (or, equivalently, a signed-handoff token system so /redeem/ on studio can drop the redeemer into a Tasks sign-up flow). The "Claim your seat" CTA does nothing today.
- **Entitlement writing on redemption.** When a code is claimed, three things need to happen atomically: insert an `entitlements` row, update `license_codes.status` to `redeemed` (with `redeemed_by_user_id` + `redeemed_at`), insert a `redemptions` audit row. This is Cycle 8.3.
- **"Already on a paid plan" check.** Reachable only when an authenticated user redeems — wires with auth.
- **Workspace welcome card in Tasks.** *"Compliments of [VENUE_NAME]. Plan your wedding without the noise."* — Tasks-side, Cycle 8.3.
- **Skipping the welcome picker for venue-edition users.** Tasks-side, Cycle 8.3.

## Plan-doc update

`docs/VENUE_EDITIONS_PLAN.md` §6 Cycle 8.3 was already scoped to wire Tasks's first-touch experience. With this cycle done, 8.3 also absorbs the redemption-completion bridge (writing entitlements + flipping code status + creating the Clerk user from the redeem flow). Updated inline in the plan doc.

## Acceptance checklist

- [x] `sponsors`, `license_codes`, `redemptions` tables defined and indexes set
- [x] Migration `0001_init_sponsors_license_codes_redemptions.sql` generated and applied to prod
- [x] `scripts/create-sponsor.ts` runnable + tested (Lamb's Hill record live in prod)
- [x] `scripts/issue-codes.ts` runnable + tested (3 LAMBSHIL-XXXXX codes minted)
- [x] `lookupRedemption()` helper in `src/lib/redeem/lookup.ts` returns discriminated union
- [x] `/redeem/[code]` server component renders all 7 view shapes; `?state=` preview works
- [x] `tsc --noEmit` clean
- [x] `next build` clean
- [x] End-to-end smoke test: real prod code lookup returns claimable shape

**Cycle 8.2 is closed.** Cycle 8.3 next: wire Clerk + redemption-completion bridge + Tasks-side first-touch (skip welcome picker + workspace welcome card).
