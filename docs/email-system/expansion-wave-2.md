# Email mockups · wave 2 ideation and selection

Date: 2026-07-16. Hairline is locked (decision:
`content/hq/decisions/email-direction-hairline-2026-07-16.md`), so new
mockups are designed for Hairline first. Candidates were drawn from the
95-message inventory's P0 and P1 rollout lists, the collaboration-loop
canon (the invite is the growth loop's hinge), and the venue wedge.

## Chosen for wave 2 · nine new mockups

| Template | Mode | Why now |
|---|---|---|
| `auth.verify-email` | utility | The first email most people ever get from us; today it is Clerk's, unbranded. |
| `access.waitlist-joined` | lifecycle | The known gap: the waitlist stores entries and says nothing back. First impression mail. |
| `welcome.first-workspace` | guided | The founder asked for a welcome distinct from the waitlist gate: day zero, account made, one next step. |
| `workspace.invitation` | guided | The most commercially important email in the suite: the collaboration loop's hinge. |
| `billing.receipt` | utility | The email people keep. Line items, exact totals, a place to file it. |
| `billing.renewal-upcoming` | utility | The trust move: say it before charging it. Quiet, no button. |
| `security.new-sign-in` | utility | Device, place, time, stated exactly; calm what-if line. |
| `data.export-ready` | utility | The deletion sequence's companion; the promise that leaving is easy, kept. |
| `venue.codes-ready` | operational | The venue wedge's working email: the code sheet that starts real couples. |

## Considered and deferred, with reasons

- Password reset, password changed, email-change pair: same register as
  verify-email and new-sign-in; mock once those two are approved.
- Payment method updated, card expiring: variants of the billing
  register already proven by payment-failed and renewal-upcoming.
- Signal briefing: a live production email in the analytics repo today;
  migrating it into Hairline is a real project (shared component
  package or duplication decision), tracked in decisions-required.
- Invitation reminder and expiry: sequenced behind the invitation
  design's approval; same skeleton.
- School pilot set: blocked by segment-sequencing-2026-05, unchanged.
- Dispatch issue redesign: already prototyped; awaiting the founder's
  Dispatch-edition decision before further investment.
- Venue post-call recap and founding-venue invitation: founder-mode
  letters; the venue-outreach prototype is the pattern, and these want
  real conversation content, not fixtures.

## Register notes for the new nine

Waitlist-joined deliberately has no button: the message is "we heard
you, we will write once, here is what happens", and its only link is
the Dispatch. Renewal-upcoming has no button either: telling someone
you are about to charge them and handing them a way out is the whole
message. Receipt introduces the system's one table beyond key-value
rows: line items with tabular totals. Venue codes-ready carries the
privacy boundary as furniture: every venue-facing message restates
that couples' planning stays theirs.
