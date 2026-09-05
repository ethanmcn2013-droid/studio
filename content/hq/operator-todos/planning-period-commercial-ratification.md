---
id: planning-period-commercial-ratification
title: Ratify the remaining commercial policy pack
status: open
priority: P0
effort: involved
blocking: true
phase: Commercial release
why: The eight August defaults remain ratified. Notice, failed-payment grace, cancellation/refund eligibility and effective-date procedure still need an explicit disposition before paid opening.
href: /hq/access
date: 2026-09-05
cleared: 2026-08-08 — Founder ratified all eight recommended defaults; the canonical commercial contract now encodes them.
---

## Current truth

`contracts/commercial-terms.v2.json` is canonical. Venue Edition, Founding 25,
the 548-day operational access term, and VAT-inclusive public pricing are
settled. The eight August defaults below remain historical decisions, not eight
new approval requests. This todo is reopened narrowly on 5 September for the
customer policy gaps that the typed contract does not settle. Its empty
`unresolved` array is not evidence of a complete cancellation/refund runbook.

## Remaining January policy disposition

| Question | Current boundary | Required record |
|---|---|---|
| Renewal notices and cancellation effective date | Annual prepayment and Founding continuous-renewal/no-lapse condition are settled. | Applicable agreement/plan, notice rule, effective date and who may act. No notice period is invented here. |
| Failed payment / grace / later return | No unpaid extension may be inferred from App code; a lapsed Founding agreement does not regain its old rate on return. | Whether any grace applies, its scope/duration, approved lapse process and customer wording. Currently unresolved. |
| Refund eligibility, partial refunds and proration | Current one-time refund handling revokes the affected access for any refunded amount. That behavior is not a general commercial refund policy. | Eligible cases, amount calculation, approver and access consequence for each agreement/plan. Currently unresolved. |
| Legal/tax questions arising from those choices | Existing VAT-inclusive prices stay unchanged; accountable-person status remains unconfirmed in the contract. | A precise founder/specialist answer where required, with source, policy version and effective date. No blanket approval claim. |

Use E02.04/E02.07 in `docs/execution/venue-edition-and-films/BACKLOG.md` as
cross-references. Do not reopen €1,500/€1,000 annual Venue pricing, the Pro
€12/€120 decision, Student/Event holds or the explicit limited pilot boundary.
The support procedure is `docs/guides/venue-payment.md`; cases remain policy
pending until the applicable question has an answer.

## August decisions, preserved history

1. **Pro annual:** choose €120/year (recommended) or €100/year, and decide
   whether Pro has any workspace limit.
2. **Student:** keep €9.99/year only with an eligibility check and annual
   re-verification, or remove it from conversion surfaces until that exists;
   also set its workspace limit.
3. **Committee Workspace:** retire the unvalidated €49/year offer
   (recommended), or define owner, renewal, editors, and viewers.
4. **Guests:** distinguish editing members, authenticated guests, and
   link-only viewers; confirm which may comment, edit, and invite.
5. **Event retention:** keep the workspace read-only after its 12-month active
   window (recommended) and remove read access after a refund.
6. **Schools:** keep school pricing as a manually quoted pilot until seat and
   support costs are known (recommended), or set the actual price and seats.
7. **Broad launch:** do not let 1 September open paid access automatically
   (recommended); treat it as a readiness review until legal and tax gates pass.
8. **Trial abuse:** use no open paid-feature trial during closed beta
   (recommended); grants are account-bound, time-limited comps with a reason.

## Done when

Each remaining January question has an explicit disposition with owner, source,
scope, version and effective date; the payment/support procedure and
pre-purchase terms agree. Record unresolved questions as unresolved rather than
marking this task done from a code path, a tabletop or the August clearance.
