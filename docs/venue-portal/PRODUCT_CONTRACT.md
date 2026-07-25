# Venue Portal product contract

## Job

A venue owner should be able to answer three questions without asking Signal
Studio for a manual report:

1. How much sponsored access did the venue have?
2. How much was issued and redeemed?
3. Was the sponsored benefit meaningfully used?

The portal does not answer what any couple wrote, planned, completed, or
discussed. It measures use of the benefit, not the content of the work.

## Audience

- **Venue owner.** Owns the commercial relationship and portal membership.
- **Venue manager.** Runs access and reads usage and reports.
- **Venue viewer.** Reads aggregate reporting.
- **Signal operator.** Supports the venue from Signal HQ through an audited
  view-as. This is not a venue role.

## Navigation

| Surface | Question answered | Phase C scope |
| --- | --- | --- |
| Overview | Is the benefit being taken up, and is anything wrong? | Term, allotment, redemption, aggregate use, coverage, attention items. |
| Access | Which codes are available, issued, redeemed, expired, or revoked? | Read-only code state and download/share of unused codes. |
| Usage | Which Signal Studio products are being meaningfully used? | Weekly active sponsored workspaces, active days, module adoption, activation and retention. |
| Reports | What can a venue owner forward or keep for renewal review? | Monthly CSV/PDF snapshot with definitions, window, coverage, and caveats. |
| Venue settings | Who can see the portal and how should it contact the venue? | Venue profile, portal roles, notices, privacy explainer. |

## Overview contract

The first screen shows:

- annual term and renewal date;
- codes allotted, issued, redeemed, and remaining;
- sponsored workspaces active in the last 30 days;
- redemption rate;
- venue-level active days in the last 30 and 90 days;
- last redemption;
- data-through timestamp and coverage state;
- attention items for low allotment, unused codes, a term ending within 60
  days, counter/reconciliation drift, or partial telemetry.

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
portal may display those states. Until then the portal says "delivery not
tracked" and does not infer delivery from a download.

Optional contact labels are not part of the default portal. They may appear
only when there is a documented operational need, a lawful basis, a retention
window, and an allowlisted projection. Email addresses and Clerk identifiers
never appear in venue exports.

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

The following never count:

- route loads, refreshes, heartbeat pings, focus events, prefetches;
- opening Settings, switching products, or viewing an empty surface;
- autosave retries that do not change persisted content;
- internal system, seed, migration, reconciliation, or demo actions;
- actions by Signal operators while using support view-as.

Meaningful events carry only a sponsor id, activation id, pseudonymous subject
and workspace keys, module, action kind, event time, source event id, and
instrumentation version. No private content, labels, titles, names, email,
dates belonging to a couple, or raw application payloads may enter the event.

## Honest degradation

Each period has one state:

- **Complete.** All four modules emitted the expected version for the full
  reporting window and the daily rollup closed successfully.
- **Partial.** One or more modules or days are missing. Observed counts may be
  shown as "at least N" only; rates and comparisons are withheld.
- **Unavailable.** No reliable event coverage exists. The portal shows access
  and redemption data but no behavioural usage value.

Missing data never becomes zero. A report snapshot records the coverage state,
instrumentation version, data-through timestamp, and metric dictionary
version.

## Privacy boundary

The Venue Portal may read only:

- sponsor commercial and term metadata;
- allotment ledger totals;
- canonical code and redemption state;
- sponsor activation state;
- daily sponsor aggregates and versioned report snapshots;
- portal membership, notification preferences, and operator-audited requests.

The portal must not query product content tables. It must not call a general
workspace export. Sponsor-facing responses are assembled through an explicit
allowlist. Any unknown field fails closed.

## Commercial boundary

The portal can prove access and observed product use. It cannot claim:

- return on investment;
- hours or money saved;
- wedding outcome quality;
- that a venue caused an action;
- that every couple used the benefit;
- a person, couple, or workspace ranking.

## Acceptance

Phase C is acceptable only when:

- an authorised venue owner can reconcile allotment, issued, redeemed, and
  remaining counts to Signal HQ;
- usage comes only from the meaningful-action allowlist;
- tenant-isolation tests prove a venue cannot address another sponsor id;
- payload tests fail if any forbidden content key or raw identifier appears;
- partial telemetry produces a partial state, never a false zero;
- allotment mutations remain impossible from the portal;
- every view works at 390 px and keyboard-only, and exports repeat the same
  definitions shown on screen.

