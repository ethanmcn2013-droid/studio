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

**The ramp, answered by the founder 2026-08-03: 25 venues.**

Setting the count to 25 exposed two sequencing errors that were already in the
ramp and are worse at 25 than at 10:

1. Founding revenue was booked from index 1, which is July 2026. "Release on
   1 September" means ready to contact Cohort 1 (D-015 Q1), so no founding cash
   can land before index 3.
2. Standard-rate venues closed in parallel with founding places still open. A
   venue that says yes while places remain takes a founding place by definition,
   so it cannot bill at €1,500.

Both were corrected. `newFounding` runs 25 across indices 3 to 9; `newPaid` runs
52 from index 10, once the founding places are gone.

| | 10 founding, old shape | 25 founding, shape unchanged | **25 founding, corrected sequencing (shipped)** |
|---|---|---|---|
| Founding · paid venues | 10 · 78 | 25 · 78 | **25 · 52** |
| Year 1 revenue | €60,880 | €76,648 | **€36,496** |
| Horizon revenue | €130,840 | €147,136 | **€106,012** |
| Blended ACV | €1,443 | — | **€1,338** |
| Lowest cash | €4,500 | — | **€3,470** |
| Runway | 18 months | — | **18 months** |
| Default alive | true | — | **true** |

The middle column is what "25 founding venues" looks like with nothing else
touched. It is €40k higher in year one and it cannot happen, because it sells
venues before launch and at the wrong price.

### Final ramp, after the founder asked for realism

Two further corrections, on the founder's instruction to take the recommendation:

1. **Founding starts at one in September, not two.** Cohort 1 goes out on launch
   day. A venue still has to reply, take a call, receive a proposal, sit the
   14-day hold and clear a payment. October is the first realistic full month.
   25 places now run Sep '26 to Apr '27.
2. **The standard-rate ramp was cut from 52 venues to 21.** It previously ran
   faster per month than the founding motion did, immediately after the discount,
   the numbered place and the scarcity all went away, and with the 45-minute ring
   already spent. That is a hockey stick with no mechanism under it. The
   counter-argument is named in the code: by month 11 there are 25 live venues
   and real referrals, and if those convert this line is too low.

| | 25 founding, first pass | **25 founding, realism pass (shipped)** |
|---|---|---|
| Founding · paid venues | 25 · 52 | **25 · 21** |
| Year 1 revenue | €36,496 | **€28,876** |
| Horizon revenue | €106,012 | **€58,720** |
| Blended ACV | €1,338 | **€1,228** |
| LTV/CAC | 22.3 | **12.2** |
| Lowest cash | €3,470 | **€3,470** |
| Runway | 18 months | **18 months** |
| Default alive | true | **true** |

### How this is funded, corrected 2026-08-03

The opening balance is zero, and that is right. The company is mid-registration
with no bank account yet. **The founder pays the running costs personally until
the company earns enough to carry itself**, and from that point the company funds
itself.

The model had no way to represent that. A zero opening balance read as "no money
exists", which produced a phantom €1,530 shortfall, `defaultAlive: false` and a
recommendation to close a gap that was never open. That was a hole in the model,
not a finding about the business. It was recorded as R-037 and **withdrawn the
same day**.

`financial-model.ts` now models founder funding explicitly: any month the company
cannot cover, the founder tops it up to zero and the top-up is recorded.

| Month | Costs | Founder in | Company cash |
|---|---|---|---|
| Jun '26 | €500 | €500 | €0 |
| Jul '26 | €510 | €510 | €0 |
| Aug '26 | €520 | €520 | €0 |
| Sep '26 | €1,180 | — | €39,832 |

Two new outputs replace the phantom, and both are rendered on `/hq/financial-model`:

- **`founderCapitalEur` = €1,530.** What the founder is personally out of pocket.
- **`founderFundingEndsAt` = Aug '26.** The month the company stops needing him.
- `defaultAlive` is **true** and now means the company carries itself from its own
  revenue. `runwayMonths` is **15**: the horizon minus the months he funded.

Verified in the browser at `/hq/financial-model`: "€1.5k · Founder capital ·
founder cash in, through Aug '26" and "15 mo · Runway · months the company
carries itself".

### The facility: wrong number, and counted as money it is not

Two errors, both corrected by the founder on 2026-08-03.

**The amount.** `FIN_META.facilityEur` read **€40,000** with a comment claiming it
matched the loan pack. It did not. The pack asks for **€15,000** at 6% over 48
months (≈ €352.28/mo) and decomposes its closing position from a €15,000
drawdown. The pack was right and the model was wrong. Now €15,000.

**The certainty.** The model booked the facility as cash arriving in September.
The founder has not obtained it: *"I have not got it yet. I am just building the
presentation. I may not even get the funding, we will see how it turns out."*
A model whose headline cash depends on an unsecured loan is the kind of flattery
this model exists to refuse. `facilitySecured: false` is now respected, and
unsecured money contributes nothing to cash.

**The result is the reassuring part.** The plan does not depend on the loan.

| | founder capital | funded until | end cash |
|---|---|---|---|
| €40,000 facility (what the model claimed) | €1,530 | Aug '26 | €104,926 |
| €15,000 facility, if it lands | €1,530 | Aug '26 | €79,926 |
| **No facility, shipped as the base case** | **€1,698** | **Sept '26** | **€40,138** |

€168 of founder money separates the loan landing from it not landing, because
revenue starts covering costs from October either way. **The facility is a buffer,
not a lifeline, and the plan must never be presented as depending on it.** Flip
`facilitySecured` to true the day it is granted.

One consequence recorded in the code: post-launch marketing at €800/month was
commented "facility-funded". With no facility it comes out of revenue, roughly
€12,000 across the horizon. The model shows it is affordable, and it is still the
first line to cut if the venue ramp runs behind.

### The earlier "thin cash" reading, and why it was wrong

Month-by-month, the trough is at **index 2, August 2026, at €3,470, with zero
revenue booked to that point.** It sits before launch, before the first founding
payment and before the facility is drawn at index 3. It is three months of
pre-launch burn (€500, €510, €520) against `startingCashEur`.

`FIN_META.startingCashEur` is **5_000**, and the model labels it *"LIVE DATA: set
to the real opening bank balance. Conservative placeholder."* It has never been
set to the real number.

**So the €3,470 is a placeholder minus three months of burn, not a finding about
the venue programme.** Changing the ramp moves nothing: the figure is identical
across every ramp variant above. The two things that would move it are the real
opening balance, which only the founder knows, and `facilityDrawIndex`, which is
a financing decision. Both are recorded in the packet as founder items.
