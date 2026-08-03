# WP-10 verification — real output

**Date:** 2026-08-03 · **Package:** WP-10 · Run from `studio/`.

Every block below is captured output, not a description of it.

---

## Typecheck

```
$ npx tsc --noEmit
exit=0
```

## Build

```
$ npx next build
✓ Compiled successfully
...
├ ƒ /venues
├ ƒ /venues/demo
...
ƒ  (Dynamic)  server-rendered on demand
exit=0
```

## Contract gates

```
$ node scripts/check-venue-edition-contract.mjs
[venue-edition-contract] ok
exit=0

$ node scripts/check-suite-contract-consumers.mjs
suite-contract-consumers: ok (unified app, suite v1+v2, commercial v1+v2)
tasks-read-contract-consumers: ok (2 consumers)
suite-contract-consumers: ok (venue-meaningful-action v1)
exit=0

$ node scripts/check-content-truth.mjs
[content-truth] ok
exit=0
```

The second gate printed three "missing generated fixture" errors and then
crashed on an undefined path before this package. It had been dead since the
July infrastructure reset renamed `tasks/` to `app/`. All three of its sections
now run.

## The commercial contract test

```
$ npx tsx --test src/lib/commercial-terms.test.ts
✔ exports only verified consumer prices as usable amounts
✔ keeps unresolved commercial choices explicit
✔ encodes the ratified Founding 25 position
✔ refuses permanence wording anywhere in the contract
✔ states entitlement as unlimited and never as a count
✔ states venue pricing as VAT-inclusive
✔ carries the couple access grace rule, not just the floor
ℹ tests 7
ℹ pass 7
ℹ fail 0
```

Two of those tests existed before. Five are new, and the permanence test is the
one that matters: it fails the build if "for life", "forever", "lifetime" or "in
perpetuity" reaches the commercial contract.

## Full studio suite

```
$ npm test
[product-marketing-contract] ok (hero + handoff ring + waitlist close, four heroes wired, compact mobile footer)
[suite-switcher-contract] ok
[chrome-contract] ok (studio)
[loading-contract] ok (studio)
[venue-edition-contract] ok
[venue-term-parity] ok (7498cee02c07)
[content-truth] ok
ℹ tests 16   ℹ pass 16   ℹ fail 0     (migration tests)
ℹ tests 374  ℹ pass 374  ℹ fail 0     (unit + contract tests)
ℹ tests 22   ℹ pass 22   ℹ fail 0     (entitlement codes)
TEST_EXIT=0
```

412 tests, zero failures. The suite includes WP-01's concurrent R-015 and R-016
work, so this is a green run of both packages together rather than of WP-10 in
isolation.

## The live page, rendered

The dev server served `/venues` and the page was read back from the browser. No
console errors.

```
$ node scripts/check-venue-edition-contract.mjs   # gate covering src/app/venues/page.tsx
[venue-edition-contract] ok
```

Rendered text, pricing section:

> **THE VENUE EDITION**
> Paid once a year. The couple never sees a price.
>
> €1,500 per venue, per year, prepaid. Every couple with a booking gets the full
> suite. No seats. No per-couple maths. The venue pays so the couple never has to
> think about it.
>
> The first twenty-five venues pay €1,000. That is €500 a year less, for as long
> as you stay. The rate holds while the agreement keeps renewing, and there is no
> clause that expires it into a higher number.
>
> Both prices include VAT at the prevailing rate. The number you see is the
> number you pay.
>
> THE FOUNDING 25 · **€1,000** · per venue, per year · prepaid · VAT included
> AFTER THE TWENTY-FIVE · **€1,500** · per venue, per year · prepaid · VAT included

Rendered text, founding section:

> **WHAT FOUNDING MEANS**
> Twenty-five places. You shape what gets built.
>
> **€500 a year less** — €1,000 a year instead of €1,500, for as long as you stay.
> The rate holds while the agreement keeps renewing. Not an introductory price
> that climbs.
>
> **A number that means something** — Twenty-five places, 01/25 to 25/25. Your
> number is assigned when your payment clears, not when you sign. It is the one
> step nobody can walk back.
>
> **A short conversation, once a year** — Thirty minutes with Ethan on what the
> planning year looks like from your side, plus an email address that reaches him.
> Not a standing meeting.
>
> **First look at what is next** — Founding venues see new work before anyone
> else, and can say what should change while it still can. Your requests are
> written down and shape the roadmap. Nothing gets built for one venue.

Closing:

> We are taking twenty-five founding venues.
> No deck, no demo gate. A short conversation about whether this fits. Places are
> held for fourteen days and assigned when payment clears, so nobody is left
> wondering where they stand.

**Not captured: a screenshot.** The browser pane is not displayed in this
non-interactive session, so the page never composited a frame and
`computer{action:"screenshot"}` timed out. Viewport reported 0×0. The rendered
text above and the diff in the packet are the evidence instead. If a visual check
is wanted before approving the copy, run `/venues` locally and look at it.

**The page is not deployed.** No deploy, no publish, no push.

## Financial model, before and after

Run against the real module, not computed by hand. Only `foundingVenueEur`
changed between the two runs.

| | founding at €1,500 | founding at €1,000 |
|---|---|---|
| Year 1 revenue | €65,880 | **€60,880** |
| Horizon revenue (18mo) | €135,840 | **€130,840** |
| Blended ACV | €1,500 | **€1,443** |
| LTV | €4,050 | **€3,896** |
| LTV/CAC | 28.7 | **27.6** |
| Lowest cash | €4,500 | €4,500 |
| Runway | 18 months | 18 months |
| Default alive | true | **true** |

The plan stays default-alive and the runway does not move, because the founding
revenue lands after the facility draw. The cost of the founding rate in this
model is €5,000, not a cash-flow problem.

**One thing the model does not say.** Its ramp schedules **10** founding venues
(`FIN_RAMP.newFounding` sums to 10), not 25. The programme has 25 places and the
project closes only when all 25 are paid. Left unchanged and raised in the
packet, because the model's own header says every figure in it is an assumption
the founder owns.
