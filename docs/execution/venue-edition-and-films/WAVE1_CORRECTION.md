# Wave 1 correction — one file collision, issued 2026-08-03

**Paste one of the two blocks below into the matching running session. Do it
before either session edits `studio/src/lib/venue-edition.ts`.**

## What I got wrong

`SESSION_HANDOFF_WAVE1.md` says Wave 1 has "no shared files". That is false for
exactly one file.

`studio/src/lib/venue-edition.ts` holds two constants that two different packages
were both told to change:

| Line | Constant | Package | Why |
|---|---|---|---|
| 2 | `VENUE_EDITION_ANNUAL_PRICE_EUR = 1_500` | **WP-10** | No founding rate, D-009/D-021 |
| 6 | `VENUE_EDITION_COUPLE_ACCESS_DAYS = 548` | **WP-01** | R-015 access-term fix, D-022 |

Different lines, same file. Two sessions reading and writing it concurrently
lose one another's edit — the same lost-update failure the project-state lock
now prevents, except source files have no such lock.

Eight files import this module, including `codes.ts` and `OnboardVenueForm.tsx`,
both of which are already WP-01 territory. That makes WP-01 the natural owner.

## The fix

**WP-01 owns `studio/src/lib/venue-edition.ts` for the whole of Wave 1.**
WP-10 does not touch it, and instead hands the price change to WP-01 and records
it in its packet.

No other Wave 1 collision exists: WP-10's other surfaces
(`content/hq/decisions/`, `contracts/commercial-terms.v1.json`,
`src/app/venues/page.tsx`, `src/lib/hq/financial-model.ts`,
`docs/strategy/VENUE_EDITION_STRATEGY.md`) are untouched by WP-01, and WP-02 and
WP-03 touch no source code at all.

---

## Paste into Session 1 (WP-01)

```
CORRECTION to your package scope, issued by the main session.

You now also own studio/src/lib/venue-edition.ts for the whole of Wave 1. WP-10 was
mistakenly told to edit the same file and has been told to stand down from it.

In addition to the R-015 change at line 6 (VENUE_EDITION_COUPLE_ACCESS_DAYS), make the
commercial-constants change at line 2:

  VENUE_EDITION_ANNUAL_PRICE_EUR = 1_500 currently has no founding rate.
  Per D-009 and D-021 the module needs: a standard annual price of EUR 1,500 and a
  founding rate of EUR 1,000, BOTH VAT-INCLUSIVE, with the existing
  venueEditionAnnualAmountCents(plan) function returning the founding amount for
  plan === "founding" rather than the standard amount. Pilot stays null.

Check every consumer before you change the signature — eight files import this module:
src/app/hq/entitlements/actions.ts, src/app/hq/entitlements/OnboardVenueForm.tsx,
src/app/layout.tsx, src/app/redeem/[code]/page.tsx, src/app/weddings/page.tsx,
src/lib/entitlements-db/codes.ts, src/lib/entitlements-db/venues.ts, and
src/lib/hq/financial-model.ts. src/app/weddings/page.tsx and src/app/layout.tsx are
public surfaces — if your change alters what they render, prepare the diff and STOP
rather than shipping it; a live public page is a founder decision.

Do NOT touch src/app/venues/page.tsx, contracts/commercial-terms.v1.json,
content/hq/decisions/ or src/lib/hq/financial-model.ts. Those stay with WP-10.

Record this scope change in your packet.
```

---

## Paste into Session 4 (WP-10)

```
CORRECTION to your package scope, issued by the main session.

STAND DOWN from studio/src/lib/venue-edition.ts. Do not edit it. WP-01 is running
concurrently and already owns that file for the R-015 access-term fix, and two sessions
editing one file lose each other's work.

WP-01 has been given the price-constant change (VENUE_EDITION_ANNUAL_PRICE_EUR and
venueEditionAnnualAmountCents) as part of its scope.

Everything else in your package is unchanged and has no collision:
  content/hq/decisions/venue-edition-fixed-price-2026-07-11.md  (supersede, do not edit)
  contracts/commercial-terms.v1.json                            (new version)
  src/app/venues/page.tsx                                       (LIVE — diff and stop)
  src/lib/hq/financial-model.ts
  docs/strategy/VENUE_EDITION_STRATEGY.md
  E02.08 Benefits Charter, E02.10 and E02.11 mechanics

In your packet, record the venue-edition.ts change as handed to WP-01 with the exact
values you would have written, so it can be checked against what WP-01 actually shipped.
```

---

## Rule this establishes

Before any future wave: **map the files each package writes, not just the epics
it owns.** Two packages that own different epics can still own the same module,
and epic boundaries do not follow file boundaries. Added to `WORKFLOWS.md` §11.
