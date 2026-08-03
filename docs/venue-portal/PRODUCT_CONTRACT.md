# Signal Studio Account · product contract (filed as "Venue Portal")

Naming: the **Signal Studio Account IS the Venue Portal** (**D-015 Q4**). One
surface, two names. Corrected against the ratified decision record 2026-08-03.
Superseded text is struck through and marked `[SUPERSEDED <id> · <date>]`; it is
never deleted silently.

**Launch scope (D-027 point 4, 2026-08-03).** At launch the surface is
**invitation administration only**. Aggregate adoption evidence follows after
1 September. The consent layer stays unwired. The Usage, retention and reporting
contracts below are the destination and stay written; they are **post-launch**.

## Job

~~A venue owner should be able to answer three questions without asking Signal
Studio for a manual report:~~ `[NARROWED D-027 point 4 · 2026-08-03]`

**At launch**, a venue owner should be able to answer one question without
asking Signal Studio for anything:

1. Which couples have I invited, and what happened to each invitation?

**After 1 September**, the same surface adds:

2. ~~How much sponsored access did the venue have?~~ `[SUPERSEDED D-020 ·
   2026-08-03. There is no quantity of access to have. See "Unlimited
   entitlement" below.]` How many couples have opened their workspace?
3. Was the sponsored benefit meaningfully used?

The Account does not answer what any couple wrote, planned, completed, or
discussed. It measures use of the benefit, not the content of the work.

## Unlimited entitlement

**D-020** (2026-08-03) ratified the entitlement model: a venue with a current
paid licence may create a sponsored workspace for **any couple with a signed
booking at that venue**. No numeric entitlement appears in the commercial terms.

The sentence sold to a venue, quoted verbatim from the decision:

> Every couple who books their wedding with you gets a workspace, for as long as
> your licence is current. No seat count, no per-couple maths, nothing for your
> coordinator to track.

`[The quoted sentence names a RETIRED term because it is the sentence that
retires it. That belongs in the decision record, the agreement and the outreach
email. On the product surface the term does not appear at all, in either
direction: a denial still uses the word. See docs/account/VOCABULARY.md.]`

Consequences this contract must carry:

- **There is no budget and nothing to count down.** Any screen, export or
  report that renders a quantity left is wrong by construction.
- **The snapshot represents this as a value state, not as a number.**
  `MetricValue` carries a fifth discriminant, `unlimited`
  (`src/lib/account/types.ts:25-37`). It is not `0`, not `null`, not
  `unavailable`. `unavailable` means the number exists and we could not read it.
  `unlimited` means there is no number, and that is the answer.
- **On screen**, an unlimited entitlement renders the word `Unlimited` where a
  count would sit, and the surface suppresses the request control, the
  exhaustion message and any copy describing a quantity left.
- **In CSV**, the row is written with `value_state=unlimited` and a **blank**
  `value` cell (`src/lib/account/csv.ts`). The consumer contract is stated once,
  below, because a blank cell is otherwise read as missing data.
- **Fair use notifies, never blocks** (D-020 correction 1). Issuance above the
  internal ceiling alerts Signal HQ and keeps issuing. The internal ceiling
  appears only in internal operating documents. It never appears on a
  venue-facing surface, and a numeric pause must never appear beside the word
  unlimited.
- **A legacy row with no recorded entitlement figure is not zero.** Where the
  stored figure is absent, both entitlement metrics resolve to `unavailable`,
  never `0`, and no exhaustion message is produced. Missing data is not
  inactivity (ADR-007 rejects "silent zeroes during telemetry gaps" by name).

### CSV consumer contract for `value_state`

Every metric row carries `value_state`. A consumer must branch on it before
reading `value`.

| `value_state` | `value` cell | `denominator` | Meaning |
| --- | --- | --- | --- |
| `exact` | the number | present when the metric is a share | The number is known and complete. |
| `lower_bound` | the number | present when the metric is a share | At least this many. Coverage was partial. Never treat as a total. |
| `withheld` | **blank** | blank | A real number exists and is deliberately hidden to protect a small group. `withheld_reason` carries the reason. Never render 0. |
| `unavailable` | **blank** | blank | A number should exist and could not be produced. `withheld_reason` carries the reason. Never render 0. |
| `unlimited` | **blank** | blank | **There is no number, and that is the answer.** The entitlement is unlimited (D-020). Not missing, not suppressed, not zero. Render the word `Unlimited`, or omit the metric. Never render 0, never render an empty state that implies a gap in the data. |

A blank `value` cell therefore never means "we forgot". It means one of the last
three rows, and `value_state` says which.

## Audience

- **Venue owner.** Owns the commercial relationship and Account membership.
- **Venue manager.** Runs access and reads usage and reports.
- **Venue viewer.** Reads aggregate reporting.
- **Signal operator.** Supports the venue from Signal HQ through an audited
  view-as. This is not a venue role.

## Navigation

| Surface | Question answered | Scope |
| --- | --- | --- |
| Overview | Is the benefit being taken up, and is anything wrong? | Term, invitation position, aggregate use, coverage, attention items. |
| Access | Which invitations are available, issued, redeemed, expired, or revoked? | Invitation administration. **This is the launch surface.** |
| Usage | Which Signal Studio products are being meaningfully used? | Post-launch (D-027 point 4). Active sponsored workspaces, days with sponsored use, product reach, first useful action and continuation. |
| Reports | What can a venue owner forward or keep for renewal review? | Post-launch. Monthly CSV/PDF snapshot with definitions, window, coverage, and caveats. |
| **Account** | Who can see the Account and how should it contact the venue? | Venue profile, Account roles, notices, privacy explainer. |

`[CORRECTED 2026-08-03: the fifth item read "Venue settings". The shipped
surface implements "Account". The tab set in
`src/app/hq/account-review/account-review.tsx` is Overview, Access, Usage,
Reports, Account, and `docs/account/VOCABULARY.md` locks the customer-facing
map "Venue settings → Account". The document is made to match the running
code.]`

## Overview contract

The first screen shows:

- annual term and renewal date;
- ~~codes allotted, issued, redeemed, and remaining~~ `[SUPERSEDED D-020 ·
  2026-08-03]` invitations issued and redeemed, and the entitlement rendered as
  `Unlimited` where a venue is on the unlimited mode;
- sponsored workspaces active in the last 30 days `[post-launch, D-027 point 4]`;
- redemption rate, always shown with its denominator `[post-launch]`;
- venue-level days with sponsored use in the last 30 and 90 days `[post-launch]`;
- last redemption;
- data-through timestamp and coverage state;
- attention items for unused invitations, a term ending within 60 days,
  counter/reconciliation drift, or partial telemetry. ~~low allotment~~
  `[SUPERSEDED D-020 · 2026-08-03. There is no low state to warn about.]`

Every usage card carries its reporting window. Every card derived from product
events carries its telemetry state.

## Access contract

Code state is derived, not guessed:

1. `revoked` when the canonical code row is revoked.
2. `redeemed` when a canonical redemption exists.
3. `expired` when the code remains unredeemed after its expiry.
4. `delivered` when a delivery timestamp exists.
5. `minted` otherwise.

The current canonical schema proves minted, redeemed, and revoked. Delivered
and expired require additive `delivered_at` and `expires_at` fields before the
surface may display those states. Until then the surface says "delivery not
tracked" and does not infer delivery from a download.

**Standing note, 2026-08-03.** The columns now exist
(`src/lib/entitlements-db/schema.ts:405-410`) and are **deliberately
un-backfilled**. They must never be defaulted to a value. A row with no
`delivered_at` is a row whose delivery was not tracked, not a row that was never
delivered. Any loader that omits these columns collapses the ladder and renders
an expired invitation as available, which reads as safe to send.

Optional contact labels are not part of the default surface. They may appear
only when there is a documented operational need, a lawful basis, a retention
window, and an allowlisted projection. Email addresses and Clerk identifiers
never appear in venue exports.

### Denominators, and the one that is forbidden

**E09.02 §1.** Every ratio on this surface draws its denominator from
**invitations Signal Studio issued and redemptions Signal Studio recorded**.
Never from bookings.

- **Invitations issued** is the denominator for the redemption step only.
- **Invitations redeemed** is the denominator for everything after redemption,
  because a couple who never redeemed has no workspace and cannot be expected to
  act in one.

**Booking-attributed denominators are prohibited.** "Couples with a signed
booking at this venue" would require Signal Studio to know, per couple, whether
a booking exists, is signed and is current. That converts Signal from a
processor of pseudonymous aggregates into a processor of couples' contractual
status with their venue, puts `bookingStatus` into the data model, and hands the
venue a per-couple reconciliation surface. A signed booking is a **venue-side
eligibility statement that Signal never audits per couple**. The venue asserts
it when it invites. Signal issues the invitation, counts invitations, counts
redemptions, and stops.

The denominator label always reads "invitations redeemed", never "your couples".
A venue is told once, plainly, that a low percentage can mean couples are not
using it or that the venue invited couples who were not ready, and that Signal
cannot tell those apart and will not pretend to.

## Usage contract

Usage starts with a server-side event after a committed product action. The
accepted v1 actions are:

- Notes: note created, or an existing note's body materially edited.
- Tasks: task created, completed, reopened, reassigned, rescheduled, or its
  status materially changed.
- Timeline: owner project/timeline item curated, visibility changed, or a
  public artifact published.
- Signal: a generated briefing deliberately opened, or acknowledged. Automatic
  landing, refresh, prefetch, and background delivery do not count.

**Two corrections to this allowlist, determined as fact, not open for choice
(E09.02 §9.0 points 4 and 5):**

- `timeline_visibility_changed` **fires on unpublish and only on unpublish**
  (`app/src/modules/timeline/server/actions/workspaces.ts:653`). It cannot mean
  sharing, and it must appear in no sharing computation.
- `briefing_acknowledged` has **no call site anywhere**. Any metric built on it
  is permanently zero. Whether it stays allowlisted while unwired is E09.02 §9.8,
  an open founder call.

The following never count:

- route loads, refreshes, heartbeat pings, focus events, prefetches;
- opening Settings, switching products, or viewing an empty surface;
- autosave retries that do not change persisted content;
- internal system, seed, migration, reconciliation, or demo actions;
- actions by Signal operators while using support view-as.

Meaningful events carry only a sponsor id, activation id, pseudonymous subject
and workspace keys, module, action kind, event time, source event id, and
instrumentation version. No private content, labels, titles, names, email, or
raw application payloads may enter the event.

~~No … dates belonging to a couple … may enter the event.~~ `[CORRECTED D-011
point 1 · 2026-08-02. See "Wedding dates" below. The event payload rule is
unchanged: no date enters the pseudonymous event. What changed is that a wedding
date may be **projected to the venue** under a redemption condition, which this
line previously read as a blanket prohibition and which would have caused an
implementer to refuse to build D-011 point 1.]`

### Wedding dates (D-011 point 1)

**Ratified 2026-08-02.** A couple's wedding date is shown to a venue **only
where the couple redeemed a code from that venue**. It is not shown to any other
venue, at any cohort size, under any coverage state.

**Date changes are never shown.** A postponement is the couple's news to share,
not a dashboard event. The surface renders the current date or nothing. It must
not render a previous date, a delta, a "moved from", a change count, an
edit timestamp, or an attention item derived from a change.

This is the one couple-owned field the Account may carry, and it is carried
because the venue has an operational reason to hold the date of a wedding it is
hosting. It does not open a general consent projection: **D-027 point 4 leaves
the consent layer unwired**, so the mechanism this depends on is not built for
1 September and the field is not rendered until it is.

## Honest degradation

Each period has one state:

- **Complete.** All four modules emitted the expected version for the full
  reporting window and the daily rollup closed successfully.
- **Partial.** One or more modules or days are missing. Observed counts may be
  shown as "at least N" only; rates and comparisons are withheld.
- **Suppressed.** A real value exists and is withheld to protect a small group.
- **Unavailable.** No reliable event coverage exists. The surface shows access
  and redemption data but no behavioural usage value.

`[CORRECTED 2026-08-03: this document listed three states. The shipped
`CoverageState` has four. `complete | partial | suppressed | unavailable`
(`src/lib/account/types.ts:10-14`). And the shipped `MetricValue` has five
discriminants: `exact`, `lower_bound`, `withheld`, `unavailable`, `unlimited`
(`types.ts:25-37`). The older set had no equivalent for `suppressed`,
`lower_bound`, `withheld` or `unlimited`. The document is made to match the
running code.]`

Missing data never becomes zero. A report snapshot records the coverage state,
instrumentation version, data-through timestamp, and metric dictionary
version.

## Privacy boundary

The Account may read only:

- sponsor commercial and term metadata;
- ~~allotment ledger totals~~ `[SUPERSEDED D-020 · 2026-08-03]` entitlement mode
  and, where one is recorded, the historic ledger, for reconciliation only;
- canonical code and redemption state;
- sponsor activation state;
- daily sponsor aggregates and versioned report snapshots;
- Account membership, notification preferences, and operator-audited requests.

The Account must not query product content tables. It must not call a general
workspace export. Venue-facing responses are assembled through an explicit
allowlist. Any unknown field fails closed.

**The allowlist is enforced by an assertion on every payload path, not on one.**
A payload that is rebuilt, overlaid or re-serialised is a new payload and is
re-asserted. See the boundary requests recorded against this audit.

## Commercial boundary

The Account can prove access and observed product use. It cannot claim:

- return on investment;
- hours or money saved;
- wedding outcome quality;
- that a venue caused an action;
- that every couple used the benefit;
- a person, couple, or workspace ranking.

## Branding boundary (D-027 point 3)

**Venue branding at launch is the venue's NAME ONLY.** No logo. No
venue-written welcome message. This is a standing copy constraint: no sales
asset, agreement, proposal page, film line, venue pack, Account string or
outreach email may imply that a venue's logo or its own words appear in the
couple's workspace. What ships is the name, in the form already in the product.

## Acceptance

The surface is acceptable only when:

- an authorised venue owner can reconcile issued and redeemed counts to Signal
  HQ, and an unlimited entitlement reconciles as `unlimited` rather than as a
  number;
- usage comes only from the meaningful-action allowlist;
- tenant-isolation tests prove a venue cannot address another sponsor id;
- payload tests fail if any forbidden content key or raw identifier appears, on
  **every** payload path including exports and overlays;
- partial telemetry produces a partial state, never a false zero;
- an absent stored entitlement figure produces `unavailable`, never `0`, and
  never an exhaustion message;
- entitlement mutations remain impossible from the Account;
- every venue-facing string passes the D-020 vocabulary sweep;
- every view works at 390 px and keyboard-only, and exports repeat the same
  definitions shown on screen.

**Nothing above is Done until the founder says so.** Under D-015 Q2 this
document's job is to state criteria so existing implementation can be assessed
against them. Existing implementation is candidate evidence, never approval.
