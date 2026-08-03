# Venue renewal and lapse runbook

**Owner:** Ethan McNamara · **Written:** 2026-08-03 · **Covers:** E08.03

This is the operating procedure for annual Venue Edition renewals. It is written
for one person running twenty-five manually invoiced venues.

## What is automatic, and what is not

Read this section before any other. It is the whole shape of the process.

| Step | State today |
|---|---|
| Deriving each venue's renewal date and billing state | Built. `venueRenewalWorklist()` |
| Refusing a wrong-plan or duplicate payment | Built. `recordAnnualPrepayment()` |
| Assigning the founding number on cleared payment | Built. Same writer |
| Keeping the historical price per term | Built. Append-only `sponsor_price_agreements` |
| Raising an invoice | **Not built.** Invoiced out of band |
| Taking a payment | **Not built.** No payment provider for venues |
| Sending the renewal notice | **Not built.** The template exists, no sender does |
| Sending the failed-payment notice | **Not built.** Same |
| Automatic dunning or retry | **Not built.** No such code exists |
| Moving a venue to grace or lapsed on a schedule | **Not built.** State is derived on read |

There is no Stripe path for venue money. `src/server/stripe.ts` carries the
workspace, studio, wedding and event tiers and has no venue price id, so no
venue payment reaches the webhook. There is no email sender in this repository
at all: `src/emails/templates/renewal-upcoming.tsx` and
`src/emails/templates/payment-failed.tsx` are finished, registered and
render-tested, and nothing sends them.

Nothing on any venue-facing surface may describe renewal as automatic.

## The one number that is not decided

The renewal notice lead time and the grace window are **proposed, not ratified**.
They live in `VENUE_RENEWAL_POLICY` in `src/lib/venue-billing.ts` as 30 days and
30 days, carrying `ratified: false`.

`renewalPolicyPublicationRefusal()` returns a refusal string for as long as that
flag is false. The proposed numbers may appear on internal operator surfaces,
labelled proposed. They may not appear in an agreement, an order form, a renewal
email or the portal, because a number a venue reads in a contract is a number
Signal Studio is held to. See the founder question in `tasks/E08.03.md`.

The state machine is correct for any values of the two, because both are
parameters rather than constants. Ratifying them is a one-line change and no
rework.

## Weekly: work the renewal list

Run the worklist and act on each row. There is one action per venue and never
more than one.

```
venueRenewalWorklist()   // src/lib/entitlements-db/venue-billing.ts
```

| State | What it means | Action |
|---|---|---|
| `current` | Inside the term, before the notice window | None |
| `renewal_due` | Inside the notice window | Send the renewal notice by hand. Record that it was delivered |
| `grace` | Term ended, agreement has **not** lapsed | Chase the payment. The founding lock still holds |
| `lapsed` | Past the grace window | Record the lapse. See below |
| `never_paid` | Paying plan, no cleared payment | Nothing was renewed and nothing broke. This is a first payment, not a lapse. No founding number is held |
| `term_end_unknown` | Paid, no term end recorded | Fix the data. Do not invent a renewal date |
| `not_a_paying_plan` | Pilot or none | None |

Delivery is recorded, never assumed. An email nobody can prove was delivered is
not a notice.

## On cleared payment

Run this on cleared payment. Never on signature.

```
pnpm tsx scripts/mark-venue-paid.ts <sponsor-slug> <founding|paid>
```

It records one append-only annual term, refreshes the venue's current position,
writes an audit line, refreshes the studio-local row HQ Traction reads, and on a
founding plan assigns the founding number. It refuses the other plan's price in
either direction, and running it twice for the same term does nothing the second
time.

Do not pass `--vat-rate` unless the VAT treatment has actually been determined.
Omitting it records the rate as not determined, which is the honest state until
the Revenue MyEnquiries submission at
`docs/execution/venue-edition-and-films/evidence/E02.07-revenue-myenquiries-submission.md`
is filed and answered. Recording an undetermined rate as zero is a claim, and it
is exactly how the retrospective correction R-014 requires becomes impossible.

## What a lapse does, and the part that must never move

A lapse is derived from the term and the grace window. It is never declared by
hand: `recordVenueLapse()` refuses to record one the dates do not support.

On a lapse:

1. **New issuance stops.** The venue cannot create further sponsored workspaces.
2. **Every couple workspace already redeemed is untouched.** Full term, plus
   Keepsake, whatever happens to the licence. This is D-020 point 2 and Signal
   Studio states it unprompted in the outreach email and in the agreement.
   `recordVenueLapse()` does not write to entitlements, does not shorten any
   expiry, and a test asserts a couple's access is byte-for-byte unchanged
   across a lapse.
3. **The founding lock breaks.** D-009 point 3: the lock holds while the
   agreement renews continuously without lapse.
4. **The founding number is kept.** E02.10: a number is never reused. The venue
   keeps it historically and its place shows as closed, not open. Only a
   reversed payment withdraws a number, through `withdrawFoundingNumber()`.
5. **Venue branding comes off released workspaces within 24 hours.**
   `BRANDING_REMOVAL_DEADLINE_MS` in `src/lib/venue-lifecycle.ts`.

No copy anywhere may suggest a couple can lose access because a venue did not
pay. It is not true, and the code is built so it cannot become true.

## A venue that lapses and wants to come back

Stop and ask Ethan. Whether a returning founding venue is re-offered EUR 1,000
or moves to the standard EUR 1,500 has never been decided.
`foundingRateOnReturn()` returns an explicit unsettled marker rather than an
answer, and `recordAnnualPrepayment()` refuses the term rather than choosing.

## Changing a venue's plan

The writer refuses it. A venue holding the Founding 25 rate cannot have its
renewal recorded as a standard term while the lock is held, because that would
end the lock with no lapse on record. Moving a standard venue into the Founding
25 is refused too, as a founder decision rather than a recording step.

## Prices

EUR 1,500 standard and EUR 1,000 for the Founding 25, annually prepaid, both
inclusive of VAT at the prevailing rate (D-021). The founding rate is EUR 500 a
year less. The lock holds for as long as the agreement renews continuously.

Permanence wording is forbidden on every surface. The banned-term list is in
`FOUNDING_25_PROGRAMME_MECHANICS.md` and it is enforced by
`scripts/check-venue-edition-contract.mjs`, which reads this file.
