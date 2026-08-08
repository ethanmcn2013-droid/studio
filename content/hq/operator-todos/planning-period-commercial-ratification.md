---
id: planning-period-commercial-ratification
title: Ratify the remaining commercial policy pack
status: done
priority: P0
effort: involved
blocking: true
phase: Commercial release
why: The current typed contract has eight genuine founder choices left; resolved Venue Edition terms and retired offers have been removed from this gate.
href: /hq/access
date: 2026-08-08
cleared: 2026-08-08 — Founder ratified all eight recommended defaults; the canonical commercial contract now encodes them.
---

## Current truth

`contracts/commercial-terms.v2.json` is canonical. Venue Edition, Founding 25,
the 548-day operational access term, and VAT-inclusive public pricing are
settled. This task contains only decisions that remain unresolved in that
contract; it supersedes the older licensing and trial-policy tasks.

## Decisions required

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

The eight answers are recorded, `commercial-terms.v2.json` is updated, and
checkout and public copy use only those settled terms.
