# WP-10 — Commercial record reconciliation

**One packet, nine tasks, D-024.** Every item below is answerable with **approve**
or **push back**. Nothing is Done. The live page is not deployed.

**Date:** 2026-08-03 · **Session:** `2872be93-wp10` · 29 days to release
**Tasks in Founder Review:** E02.01, E02.02, E02.03, E02.05, E02.08, E02.09,
E02.10, E02.11, E02.12
**Mechanical packet:** `evidence/packets/2026-08-03--E02.01.md`
**Full surface ledger:** `evidence/E02.01-commercial-surface-reconciliation.md`
**Captured verification:** `evidence/wp10-verification.md`

---

## 1 · What was done

The ratified position now exists in one place and propagates from it.

**The record.** A new dated HQ decision, `venue-edition-founding-25-2026-08-03`,
carries €1,500 standard and €1,000 for the Founding 25, both VAT-inclusive, plus
the lock scope, the change-of-control rule, founder access, the numbering rule
and the entitlement model. The 2026-07-11 decision is marked Superseded with a
pointer banner. **Its body was not rewritten.**

**The machine contract.** `commercial-terms.v2.json`, alongside v1 rather than
replacing it, following the `suite-contracts` precedent. Cohort 25, founding rate
€1,000, VAT-inclusive basis, unlimited entitlement, fair use that notifies rather
than blocks, the 14-day hold, numbering assigned on payment, and a
`forbiddenWording` list. `venue_activation_allowance` and
`venue_calendar_month_semantics` moved out of `unresolved` with a stated basis.
The app fixture is synced.

**Two new documents.** The Founding Venue Benefits Charter (E02.08): six benefits,
each with its boundary stated in the same section, including "nothing is built for
one venue" as a benefit rather than a later refusal. The Programme Mechanics
(E02.10, E02.11): a say/never-say terminology table with the reason for each ban,
the numbering rule, the place state machine, the close condition, and eleven
decided edge cases.

**Around thirty files corrected**, from the live `/compare` copy and the HQ
dashboard strings to the send-ready outreach and eleven strategy documents.

**Three defects found and fixed on the way.** They are the part of this package I
would read first.

1. **`mark-venue-paid.ts` recorded the wrong cash amount.** It wrote
   `VENUE_EDITION_ANNUAL_PRICE_CENTS` for both plans, so every founding venue
   paying €1,000 would have entered the cash ledger at €1,500. It now takes the
   amount from the plan.
2. **`check-suite-contract-consumers.mjs` had been dead since the July reset.** It
   looked for a `../tasks` directory that was renamed to `app`, reported "missing
   generated fixture", then crashed on an undefined path. All three of its
   sections checked nothing. Fixed, and all three now run.
3. **`check-venue-edition-contract.mjs` was passing through a whole commercial
   change.** It only forbade the *pre*-July-11 price band, so it reported ok while
   roughly 140 files published the July-11 position. It now fails on the retired
   cohort size and on any permanence wording.

---

## 2 · What was verified, with real output

Full captured output is in `evidence/wp10-verification.md`. Headlines:

- `npx tsc --noEmit` → exit 0
- `npx next build` → compiled, `/venues` builds
- `npm test` → **412 tests, 0 failures**, seven contract gates green. That run
  includes WP-01's concurrent work, so it is a green run of both packages together.
- `commercial-terms.test.ts` → 7 tests, 5 of them new. One fails the build if
  "for life", "forever", "lifetime" or "in perpetuity" reaches the commercial
  contract. That trap has already caught this price lock once.
- `/venues` rendered from the dev server, read back, no console errors.
- The financial model was run at both prices rather than reasoned about.

**One thing I could not produce: a screenshot.** The browser pane is not displayed
in this session, so the page never composited a frame and the screenshot timed
out. The rendered text and the diff are in the packet instead. If you want to
look at it before approving the copy, run the dev server and open `/venues`.

**The financial model, measured both ways:**

| | founding at €1,500 | founding at €1,000 |
|---|---|---|
| Year 1 revenue | €65,880 | **€60,880** |
| Horizon revenue | €135,840 | **€130,840** |
| Blended ACV | €1,500 | **€1,443** |
| Lowest cash | €4,500 | €4,500 |
| Runway | 18 months | 18 months |
| Default alive | true | **true** |

The founding rate costs €5,000 in this model and does not touch runway, because
the founding revenue lands after the facility draw.

---

## 3 · What needs you

### 3.1 · The live page copy — this is the hard stop

`src/app/venues/page.tsx` is edited, built, rendered and **not deployed**. The
diff and the rendered text are in this session and in the verification evidence.

What changed: the eyebrow and title become "The Founding 25"; the pricing block
becomes two tiers with €1,000 leading and €1,500 secondary, both marked VAT
included; "the first fifteen venues" becomes twenty-five; the founding benefits
gain the numbering rule and the roadmap boundary; the couple term gains the
grace rule; "We are taking a founding group of fifteen venues" becomes
twenty-five, with the 14-day hold and payment-assignment stated so nobody is left
guessing where they stand.

**Deliberately not added: a remaining-places counter.** The mechanics document
says every published claim about places must be true when it is sent. A static
page cannot do that honestly. It belongs on the proposal, wired to cleared
payments.

> **Recommendation: approve the copy, then deploy.** The page currently publishes
> a retired offer to the public, and that is the live half of I-002.

### 3.2 · One thing I did that the brief told me not to

The brief said supersede the 2026-07-11 decision and **do not edit it in place**.
I edited one line of it: `status: Active` → `status: Superseded`, plus a pointer
banner above the body. The argument, the reasoning and every figure are untouched.

Why: `status` is how the HQ dashboard decides what is current, and it is the
house convention for exactly this (`analytics-restart-trigger.md` is the
precedent). Left as Active, `/hq` would show two contradictory Active pricing
decisions, which is the failure I-002 exists to close.

> **Recommendation: keep it.** If you disagree, reverting is one line, and the
> superseding decision stands on its own either way.

### 3.3 · The founding ramp in the financial model

`FIN_RAMP.newFounding` schedules **10** founding venues. The programme has 25
places, and the project does not close until all 25 are paid. I changed the price
and left the ramp alone, because the model's own header says every figure in it is
an assumption you own.

At 25 founding venues instead of 10, founding revenue is €25,000 rather than
€10,000, and the 15 venues move out of the standard-rate ramp.

> **Recommendation: change it to 25.** The programme's own definition of done is
> 25 paid venues, so a model that schedules 10 is forecasting a different
> programme. I did not do it unilaterally because it moves your revenue numbers.

### 3.4 · The lender pack is externally distributed and its arithmetic is now wrong

`public/brand/business-loan-pack-2026.html` underwrites on flat €1,500 venue
revenue: "18 venues × €1,500 = €27,000", and every ARR projection follows. At the
founding rate the first 25 produce €25,000 rather than €37,500, and VAT-inclusive
pricing takes roughly 19% off again if Signal Studio is an accountable person.

The market-entry deck and the pitch deck have the same problem, 23 and 7 hits
respectively.

> **Recommendation: tell me whether the loan pack has already gone to a lender.**
> If it has, correcting it is a disclosure decision, not a file edit, and it is
> yours. If it has not, I can correct all three decks in a follow-up.

### 3.5 · The staged outreach was aimed at the wrong region

`venue-edition-A1-staged.md` holds five ready-to-send emails naming Clontarf
Castle, Harvey's Point, The Montenotte, the Imperial and Waterford Castle. Those
are Dublin, Donegal, Cork and Waterford. D-012 limits founding outreach to a
45-minute ring from Limerick city centre.

I corrected the prices and counts so nothing states a retired number, and added a
**DO NOT SEND** banner rather than making wrong-region emails look ready to go.

> **Recommendation: confirm the hold.** Re-targeting belongs to WP-02's venue
> universe and WP-11's sequences, not here.

### 3.6 · A P0 operator-todo states a retired fact while gating checkout

`content/hq/operator-todos/planning-period-commercial-ratification.md` is open,
P0, `blocking: true`, and says "Venue Edition EUR 1,500/year for the founding 15"
under "already evidenced". It gates checkout and broad launch.

> **Recommendation: let me rewrite it against v2 in a follow-up.** I left it alone
> because operator-todos are your ledger of what you are blocking, and rewriting
> one to say it is satisfied is not a call an agent should make.

### 3.7 · Three smaller ones

- **Structured data.** `src/app/layout.tsx` publishes a site-wide JSON-LD `Offer`
  at €1,500 and the gate forbids `priceSpecification`. Publishing the standard
  price is honest. Adding the founding rate needs that forbid relaxed.
  **Recommendation: leave it, and let E12.04 decide.**
- **Adare Manor.** `docs/PITCH_ADARE_MANOR_RYDER_CUP_2027.md` pitches founding
  logic to a venue outside Greater Limerick. Whether it consumes one of the 25 is
  undefined. **Recommendation: it is a separate tier, not a founding place.**
- **`revenue-model-datapack-2026-07-20.json`.** One confirmation needed on whether
  any `/hq` surface still reads it, which decides live contract versus snapshot.

---

## 4 · What was deliberately not done

- **`src/lib/venue-edition.ts`.** Handed to WP-01 on instruction. The exact values
  WP-10 would have written are recorded in the ledger, section B. Checked against
  the working tree: **WP-01 wrote exactly those values.** Three WP-10 files now
  import them, so a divergence breaks the build rather than passing silently.
- **E02.12's product half.** The contract says unlimited. The product cannot
  issue it yet: the mint refuses a null allotment and the HQ onboarding form
  defaults to 10 (R-016). That is WP-01's, and it is stated on the face of the
  task. **Approving E02.12 approves the commercial record, not a working
  product.**
- **E02.04, E02.06, E02.07.** Founder-only and waiting on WP-04 and the Revenue
  reply. Untouched.
- **The append-only history.** Changelog, dispatch entries, dated decision
  records, cash ledgers, archived SQL. Editing those would destroy the only proof
  the change happened.
- **Section C of the ledger**, roughly 110 files: the public decks, the film and
  demo scripts, the atlas entries, the dated audits. Each has a named owner and a
  trigger. None were silently skipped.

---

## 5 · How to approve

All nine, in one command. **Pass the IDs, not `--review`:**

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs approve-batch "your reason here" E02.01 E02.02 E02.03 E02.05 E02.08 E02.09 E02.10 E02.11 E02.12
```

Or push back on any single item above and I will rework it.

> **Corrected 2026-08-03, after this bit me.** The first version of this line said
> `approve-batch "note" --review`. `--review` approves **everything** sitting in
> the founder-review queue, not just this package's tasks. With four work packages
> running in parallel it took 32 tasks across E01, E02 and E04 in one command,
> under the literal note `"your note"`. Always pass explicit IDs, and always write
> a real note: the note is the only record of *why* something was approved, and
> PROJECT.md §18 makes it one of the four conditions for Done.
