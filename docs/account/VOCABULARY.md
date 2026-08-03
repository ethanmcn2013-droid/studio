# Signal Studio Account vocabulary (the surface E07 calls the Venue Portal)

Naming: the **Signal Studio Account IS the Venue Portal** (**D-015 Q4**). One
surface, two names. Corrected 2026-08-03.

## Locked customer-facing map

| Internal or prior wording | Customer-facing wording |
| --- | --- |
| Signal HQ | Signal Studio |
| Active and reconciled | Account active |
| Canonical code rows | Access totals checked |
| Partial coverage | Reporting incomplete |
| Suppression state | Small-group privacy protection |
| Metric dictionary | How reporting works |
| Venue settings | Account |
| Venue active days | Days with sponsored use |
| Venue Portal | Signal Studio Account |
| Licences (customer UI) | Access |
| Access code · licence code | **Invitation** |
| Codes issued | **Invitations sent** |
| Codes redeemed | **Opened their workspace** |
| Minted, not yet delivered | **Ready to send** |
| Meaningful actions | **Days with a recorded action** |
| First meaningful action | **Started planning** |
| Day-30 retention band | **Came back around a month later** |

Signal HQ Access remains the internal control-plane name.

`[ADDED 2026-08-03. The last seven rows follow D-020 and E09.02 §8. "Days with a
recorded action" replaces "meaningful actions" because a Tier 1 row count is
action-days, not actions: the event id is day-bucketed, and any surface saying
"meaningful actions" overstates precision (E09.02 §9.0 point 3).]`

## Retired vocabulary

These words are prohibited on every customer-facing surface, by name, under
**D-020** and **E09.02 §8**. They are listed so the retirement is auditable.

| Retired | Why | Say instead |
| --- | --- | --- |
| ~~allotment~~, ~~allotted~~ | `[SUPERSEDED D-020 · 2026-08-03]` There is no budget. | Nothing. State the entitlement, not a quantity. |
| ~~seat~~, ~~seat count~~ | `[SUPERSEDED D-020 · 2026-08-03]` The venue was sold on there being none. | Nothing. Do not deny it either: a denial still uses the word. |
| ~~codes remaining~~ | `[SUPERSEDED D-020 · 2026-08-03]` Nothing to subtract from. | "Invitations ready to send", when there are unsent ones. |
| ~~licences allotted~~ | `[SUPERSEDED D-020 · 2026-08-03]` | "Unlimited". |
| ~~low allotment~~ | `[SUPERSEDED D-020 · 2026-08-03]` | Nothing. There is no low state. |
| ~~headroom~~, ~~headroom is exhausted~~ | `[SUPERSEDED D-020 · 2026-08-03]` | Nothing. |
| ~~“X of your 60”~~ | `[SUPERSEDED D-020 · 2026-08-03]` | "18 of 26 invitations redeemed". |
| ~~for life~~, ~~forever~~, ~~lifetime~~, ~~guaranteed~~ | `[D-009 point 3, D-001 point 16, R-008]` | "for as long as your agreement renews without lapse". |

Denying a retired word still uses it. A sentence that says there is no such
count to manage fails a literal sweep for the retired term and puts the idea in
the reader's head. Say nothing about it at all. `[SUPERSEDED D-020 · 2026-08-03. The live surface currently carries exactly
this denial.]`

## The one entitlement sentence

> Every couple who books their wedding with you gets a workspace, for as long as
> your licence is current. No per-couple maths. Nothing for your coordinator to
> track.

`[SUPERSEDED D-020 · 2026-08-03. The decision's own wording names the retired
term explicitly, because it is the sentence that retires it. That belongs in the
decision record and the agreement. On the product surface, the term does not
appear at all, in any direction.]`

## Value states, in customer words

| State | What the customer sees |
| --- | --- |
| `exact` | The number. |
| `lower_bound` | "At least 8". |
| `withheld` | "Not enough couples yet to report usage safely." |
| `unavailable` | "Not available for this period." |
| `unlimited` | "Unlimited." |

None of these renders as `0`. A zero is a claim that nothing happened. These
states say the opposite: that there is no number, or that we do not know.

## Navigation labels

Overview · Access · Usage · Reports · Account

## Edition descriptors

- Venue Edition
- Education Edition
- Organisation Edition

## Permanent review indicator

`Deterministic sample · not sponsor data`

Every sample report page and CSV metadata row must also carry:

`SAMPLE · DETERMINISTIC REVIEW DATA.`
