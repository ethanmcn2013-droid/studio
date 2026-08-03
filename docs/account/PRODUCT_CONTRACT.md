# Signal Studio Account · product contract (the surface E07 calls the Venue Portal)

Naming: the **Signal Studio Account IS the Venue Portal** (**D-015 Q4**). One
surface, two names. Corrected against the ratified decision record 2026-08-03.
Superseded text is struck through and marked `[SUPERSEDED <id> · <date>]`; it is
never deleted silently.

**Launch scope (D-027 point 4, 2026-08-03).** At launch this surface is
**invitation administration only**. Aggregate adoption evidence follows after
1 September. The consent layer stays unwired. Questions 3, 4 and 5 below stay
written because they are the destination. They are post-launch.

## Job

A commercial customer should answer five questions without a manual report and
without seeing private work:

1. Is our Signal Studio access in good standing? **[launch]**
2. ~~How much access have we distributed?~~ `[REPHRASED D-020 · 2026-08-03]`
   Which recipients have we invited, and what happened to each invitation?
   **[launch]**
3. Are recipients reaching meaningful use? **[post-launch]**
4. Is that use continuing? **[post-launch]**
5. What evidence can we take into a renewal, governance, or internal review?
   **[post-launch]**

## Product family

| Edition | Recipient noun | Default reporting period | Privacy posture |
| --- | --- | --- | --- |
| Venue Edition | Couples or clients | Access term | Aggregate sponsored use |
| Education Edition | Students | Academic year or programme term | Institution/programme aggregates only |
| Organisation Edition | People | Contract year | Organisation aggregates only |

Education must never introduce student drill-down or filters that could
reconstruct small cohorts.

## Navigation

Overview · Access · Usage · Reports · Account

This matches the shipped tab set in
`src/app/hq/account-review/account-review.tsx`. Where the Phase A contract said
"Venue settings", the fifth item is **Account**, and `VOCABULARY.md` locks the
map.

## Snapshot contract

One typed `AccountSnapshot` drives the visual UI, accessibility text, PDF, and
CSV. Metric values are discriminated:

- `exact`
- `lower_bound`
- `withheld` (no hidden raw value)
- `unavailable` (no hidden raw value)
- **`unlimited`** (no number exists; this is the answer, not a gap)

`[ADDED D-020 · 2026-08-03. The fifth discriminant landed in
`src/lib/account/types.ts:25-37` and was missing from this list. It is not a
null, not a sentinel and not `unavailable`. `unavailable` says a number exists
and we could not read it. `unlimited` says there is no number to read.]`

Coverage states:

- `complete`
- `partial`
- `suppressed`
- `unavailable`

Critical honesty rules:

- Incomplete reporting is never presented as zero.
- **An absent stored entitlement figure is never presented as zero either.** A
  legacy row with no recorded figure renders `unavailable`, produces no
  exhaustion message, and prompts no request.
- Access totals may remain exact when behavioural reporting is incomplete.
- Comparisons require complete coverage for both periods and compatible
  definition versions.
- Withheld values never appear in DOM attributes, tooltips, accessible labels,
  exports, or print output as numeric evidence.
- **Every share renders with its denominator.** "9 of 12", never "75%" alone.
  `MetricValue` carries `denominator` and the renderer must read it.

## Unlimited entitlement, and the CSV consumer contract

**D-020** (2026-08-03): a venue with a current paid licence may create a
sponsored workspace for any couple with a signed booking at that venue. No
numeric entitlement appears in the commercial terms. There is no budget, so
there is nothing on this surface to count down.

On screen an unlimited entitlement renders the word `Unlimited`. The request
control, the exhaustion message and any copy describing a quantity left are
**absent**, not disabled.

In CSV, every metric row carries `value_state`. A consumer must branch on it
before reading `value`:

| `value_state` | `value` cell | Meaning |
| --- | --- | --- |
| `exact` | the number | Known and complete. |
| `lower_bound` | the number | At least this many. Coverage was partial. Never a total. |
| `withheld` | **blank** | A real number exists and is hidden to protect a small group. `withheld_reason` says why. Never render 0. |
| `unavailable` | **blank** | A number should exist and could not be produced. `withheld_reason` says why. Never render 0. |
| `unlimited` | **blank** | **There is no number, and that is the answer.** The entitlement is unlimited. Not missing, not suppressed, not zero. Render the word `Unlimited`, or omit the metric. |

A blank `value` cell never means "we forgot". It means one of the last three
rows, and `value_state` says which. Implemented at
`src/lib/account/csv.ts`.

**Fair use notifies, never blocks** (D-020 correction 1). The internal issuance
ceiling appears only in internal operating documents. A numeric pause must never
appear beside the word unlimited on any customer-facing surface.

## Denominators

Every ratio draws its denominator from **invitations Signal Studio issued and
redemptions Signal Studio recorded** (E09.02 §1).

- **Invitations issued** for the redemption step only.
- **Invitations redeemed** for everything after redemption.

**Booking-attributed denominators are prohibited.** A signed booking is a
customer-side eligibility statement Signal never audits per recipient. The
denominator label reads "invitations redeemed", never "your couples". The
redemption denominator query touches no booking, contract or wedding-date
column, and that is proven by a schema-level test.

## Wedding dates (Venue Edition only)

**D-011 point 1, ratified 2026-08-02.** A couple's wedding date is shown to a
venue **only where the couple redeemed a code from that venue**.

**Date changes are never shown.** A postponement is the couple's news to share,
not a dashboard event. The surface renders the current date or nothing, and
never a previous date, a delta, a "postponed" flag, a change count, an edit
timestamp, or anything derived from a change, in any format.

Not built for 1 September: D-027 point 4 leaves the consent layer unwired, so
the field is not rendered until it is.

## Branding boundary

**D-027 point 3, ratified 2026-08-03: venue branding at launch is the venue's
NAME ONLY.** No logo. No venue-written welcome message. This is a standing copy
constraint across every surface, not only this one.

## Brand language retained

- “The benefit, in use.”
- “Use, without surveillance.”
- “Aggregate use only. Private work is never included.”

## Boundary with Signal HQ Access

Signal HQ Access owns mutation and support. Signal Studio Account is
read-mostly proof of benefit. Account members may request support and reports.
They cannot grant access, and under an unlimited entitlement there is nothing
for them to request more of.

Every mutation on this surface resolves its sponsor server-side from the
authenticated member. A client-supplied sponsor id is ignored.

## Review-only scope

The authenticated HQ surface is a deterministic review prototype. Sample PDF
and CSV assets, when generated, must say:

`SAMPLE · DETERMINISTIC REVIEW DATA.`

They must be stored outside the public directory and served only through an
authenticated, allowlisted HQ download route.

**A review surface must never present fixture data as a customer's real data.**
When the data source is live, every panel is live or says it is unavailable. A
fixture fallback behind a live selection, or a fixture list rendered beside live
figures, tells a customer something about themselves that is not true.

**Existing implementation is candidate evidence, never approval (D-015 Q2).**
A capability demonstrated from a fixture is not a capability. Anyone approving
from a screen share of this surface must be told which panels are live.
