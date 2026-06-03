# Signal Studio Valuation Framework
## The Quarterly Signal Studio Valuation (SSV)
*Version 1.0 — 2026-05-31*

---

## Purpose

Class B Founder Circle shares participate in the value of Signal Studio — in dividends, and in the proceeds of any future sale. For that participation to mean anything, the value of the business must be measured honestly, on a fixed schedule, using a formula that cannot be inflated by optimism.

This document defines that formula. It is struck once per quarter, reported to every Founder Circle member, and used as the reference value for any share buy-back or right-of-first-refusal transaction.

**Design principle:** the valuation is anchored to things that have already happened — revenue earned, profit banked, cash in the account — not to growth that has been promised. Potential is real, but it is not counted here. Only the trailing record is.

**Grounded in the actual model.** Signal Studio's revenue comes from three real streams set out in the 12-month business plan: the Venue Edition (€1,500–€4,000 per venue per year, prepaid), Workspace subscriptions (€12/month), and one-time Event purchases (€79). The plan's Year-1 target is €150,000 of revenue by May 2027 against a deliberately lean cost base (≈€15,000), at a gross margin above 90%. The SSV reads from whatever of that has actually been booked at each quarter close — never from the target itself.

---

## What the formula measures

Three tangible quantities, each taken from the business's own accounts at the quarter close:

| Input | Definition | Source |
|-------|------------|--------|
| **ARR** | Annualised Recurring Revenue. Active recurring subscriptions normalised to twelve months (Workspace monthly × 12, Workspace annual at face, Venue Editions at annual face). One-time Event sales are excluded. | Stripe + entitlements ledger at quarter close |
| **OE** | Owner Earnings (trailing twelve months). Operating profit after all real operating costs and corporation tax, before any discretionary growth reinvestment. | Trailing four quarters of accounts |
| **NET CASH** | Cash and cash equivalents, plus trade receivables, less trade payables and any debt. | Bank + ledger at quarter close |

TTM Revenue (trailing-twelve-month total revenue, recurring **and** one-time) is also recorded, because it sets the reality cap below.

---

## The formula

```
                ┌                                             ┐
   SSV  =       │  α · (R · ARR)   +   β · (E · OE)            │   +   NET CASH
                └                                             ┘

   bounded below by NET CASH
   bounded above by  (5.0 · TTM REVENUE)  +  NET CASH
```

### The recurring-revenue multiple — R

Recurring revenue is the durable asset, so it carries the larger weight. The multiple is built from a fixed base and adjusted only by **measured** quality, never by forecast.

```
   R  =  3.0   (base)
        + 0.5  if trailing gross margin ≥ 80%
        + 0.5  if trailing 12-month revenue retention ≥ 100%
        − 0.5  if trailing 12-month revenue retention < 85%

   R is bounded to the range  2.0  …  4.5
```

Gross margin and retention are both things that have already occurred and can be read off the accounts. Nothing in R is a projection.

### The earnings multiple — E

```
   E  =  3.5   (fixed)

   If OE ≤ 0, the earnings term is zero (E · OE is set to 0).
```

A fixed, conservative multiple of trailing owner earnings. Small software businesses change hands in the region of 3–5× owner earnings; 3.5× sits deliberately at the careful end.

### The weights — α and β

```
   If OE > 0:     α = 0.5,   β = 0.5      (revenue and earnings blended evenly)

   If OE ≤ 0:     α = 0.7,   β = 0        (pre-profit: revenue only, with a 30% haircut)
```

Blending the two terms — rather than adding a full revenue multiple to a full earnings multiple — avoids counting the same euro of value twice. In pre-profit quarters the business is valued on recurring revenue alone, discounted, because a business that does not yet turn a profit is worth less than one that does.

### The two guards

- **Floor.** SSV is never less than NET CASH. The business is always worth at least the cash it could be wound down to.
- **Reality cap.** SSV never exceeds five times trailing-twelve-month revenue, plus net cash. This is the discipline line: the valuation cannot drift away from the revenue the business has actually earned, no matter how the multiples move.

---

## Worked examples

*All figures illustrative. Not a projection, not a promise. They demonstrate the mechanics only.*

### Example A — Pre-launch / Year 1 (no profit yet)

```
   ARR ............................. €22,000
   OE (trailing) ................... −€4,000   →  earnings term = 0
   NET CASH ........................ €6,000
   TTM revenue ..................... €24,000

   OE ≤ 0  →  α = 0.7, β = 0
   R = 3.0 (base; not enough trailing history to add quality points)

   SSV = 0.7 · (3.0 · 22,000) + 0 + 6,000
       = 0.7 · 66,000 + 6,000
       = 46,200 + 6,000
       = €52,200

   Reality cap = 5.0 · 24,000 + 6,000 = €126,000   (not binding)
   Floor       = €6,000                            (not binding)

   ── Signal Studio Valuation: €52,200
   ── Founding Member's 10%:    €5,220
```

### Example B — Modest Year 2 (first profitable year)

```
   ARR ............................. €70,000
   OE (trailing) ................... €38,000
   NET CASH ........................ €9,000
   TTM revenue ..................... €80,000
   Gross margin .................... 92%      → +0.5
   Revenue retention ............... 104%     → +0.5

   OE > 0  →  α = 0.5, β = 0.5
   R = 3.0 + 0.5 + 0.5 = 4.0
   E = 3.5

   Revenue term  = 4.0 · 70,000 = 280,000
   Earnings term = 3.5 · 38,000 = 133,000

   SSV = 0.5 · 280,000 + 0.5 · 133,000 + 9,000
       = 140,000 + 66,500 + 9,000
       = €215,500

   Reality cap = 5.0 · 80,000 + 9,000 = €409,000   (not binding)

   ── Signal Studio Valuation: €215,500
   ── Founding Member's 10%:    €21,550
```

### Example C — Growth Year 3

```
   ARR ............................. €135,000
   OE (trailing) ................... €99,000
   NET CASH ........................ €20,000
   TTM revenue ..................... €150,000
   Gross margin .................... 94%      → +0.5
   Revenue retention ............... 108%     → +0.5

   R = 4.0,  E = 3.5,  α = β = 0.5

   Revenue term  = 4.0 · 135,000 = 540,000
   Earnings term = 3.5 · 99,000  = 346,500

   SSV = 0.5 · 540,000 + 0.5 · 346,500 + 20,000
       = 270,000 + 173,250 + 20,000
       = €463,250

   Reality cap = 5.0 · 150,000 + 20,000 = €770,000   (not binding)

   ── Signal Studio Valuation: €463,250
   ── Founding Member's 10%:    €46,325
```

---

## Schedule

- The valuation is struck at each quarter close: **31 December, 31 March, 30 June, 30 September**.
- It is reported to every Founder Circle member with that quarter's report, issued on the **15th of the following month**.
- The **inaugural valuation** is struck at the first quarter close after the grant — **31 December 2026** — and reported on **15 January 2027**.

---

## How the valuation is used

1. **Information.** Every member is told the current SSV each quarter, with the inputs that produced it.
2. **Buy-back reference.** If a member offers shares back to the company, or the company exercises its right of first refusal, the price is the member's percentage of the most recent SSV, unless an independent valuation is jointly commissioned.
3. **Sale reference.** In an actual sale of the business, the real transaction price governs — not the SSV. The SSV is the interim measure between sales, not a substitute for a real offer.

---

## What is deliberately excluded

- **Growth potential, pipeline, and projections.** Not counted. Only trailing performance.
- **Brand and goodwill beyond the cap.** The reality cap prevents intangible optimism from inflating the number.
- **Founder time valued below market.** Owner Earnings is taken after real costs; it is not flattered by pretending the founder works for free.

The result is a number that is consistently conservative and consistently honest. It will, in good years, understate what a buyer might pay. That is the intended direction of the error.

---

*Companion documents: FORMULA.md (dividend calculation) · DIVIDEND-PHILOSOPHY.md (governing principles).*
