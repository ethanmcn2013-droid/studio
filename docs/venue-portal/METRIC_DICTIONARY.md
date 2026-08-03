# Signal Studio Account · metric dictionary (filed as "Venue Portal")

## SUPERSEDED · `venue-metrics.v1` is no longer the dictionary of record

**Superseded 2026-08-03 by D-032 R9.** The metric dictionary of record is
**`account-metrics.v2`**, and it lives at
[`docs/execution/venue-edition-and-films/evidence/E09.02-metric-definitions.md`](../execution/venue-edition-and-films/evidence/E09.02-metric-definitions.md).
Read that document for any metric definition. Where this file and that one
disagree, that one wins.

**This file is deliberately not deleted.** It remains the only written source
for parts of the roles, the privacy treatment and the required-test inventory,
and several other documents cite it by path. Deleting it would take those with
it. What it must not do any longer is answer the question "what does this metric
mean".

**How to read what follows.** Metric definitions here are historical. Privacy
rules, required tests and the coverage envelope are still live and still
correct. Struck-through rows were retired by a named decision and are kept as
the record of what changed.

Naming: the **Signal Studio Account IS the Venue Portal** (**D-015 Q4**).

Dictionary version: ~~`venue-metrics.v1`~~ `[SUPERSEDED D-032 R9 · 2026-08-03]`
**`account-metrics.v2`**
Calendar: venue-configured IANA timezone, default `Europe/Dublin`
Windows: inclusive of the report end date; daily rollups close after 06:00 in
the venue timezone.

## Dictionary version: the three that were live at once, and how it ended

**This document was versioned `venue-metrics.v1`. Every export in shipped code
stamps `account-metrics.v2`.** The exports therefore carried a version string
that named no shipped document. The header above is corrected so the name and
the document agree.

Three dictionaries were live simultaneously and disagreed. **D-032 R9 closed
it on 2026-08-03**, in one change:

| Dictionary | Where | Standing |
| --- | --- | --- |
| `account-metrics.v2` | `$VEF/evidence/E09.02-metric-definitions.md` | **RATIFIED 2026-08-03 · D-032 R9. The dictionary of record.** Seven adoption definitions: the original six plus `daysWithSponsoredUse` at §7A (D-032 R11). |
| `venue-metrics.v1` | this file | **SUPERSEDED 2026-08-03 · D-032 R9.** Was the dictionary of record. Retained for roles, privacy and the test inventory. Its allotment-era metrics were already retired by D-020. |
| A third activation definition | `studio/docs/planning-period-analytics.md` | **SUPERSEDED as a definition of "activation" · 2026-08-03 · D-032 R9.** The four-condition bundle survives under a new name, marked founder-only, because it measures something real about product learning. It is no longer called activation and it never reaches a venue-facing surface. |

**"Activation" now means exactly one thing**, on any venue-facing surface, and
it means E09.02 §2: a first useful action, subject to the withdrawal list.

## The denominator rule, before anything else (E09.02 §1)

Every ratio below draws its denominator from **invitations Signal Studio issued
and redemptions Signal Studio recorded**. Never from bookings.

- **Invitations issued** is the denominator for the redemption step only.
- **Invitations redeemed** is the denominator for everything after redemption.

**Booking-attributed denominators are prohibited.** Adopting "couples with a
signed booking at this venue" would require Signal Studio to know each couple's
contractual status with their venue, put `bookingStatus` into the data model,
and hand the venue a per-couple reconciliation surface. A signed booking is a
venue-side eligibility statement Signal never audits per couple. The denominator
label always reads "invitations redeemed", never "your couples".

Both denominators are Tier 2 commercial facts: reconcilable, and blind to
booking status by construction.

## Access and activation

`[D-020 · 2026-08-03: the entitlement model is unlimited. There is no allotment,
no remainder and no headroom. The first and fourth rows are retired. E09.02 §8
names "codes remaining" and "licences allotted" as prohibited by name.]`

`[D-032 R12 · 2026-08-03: every metric in this table is an **access metric**.
Access metrics carry **no cohort floor** and are emitted exactly at any cohort
size. See "The suppression floors" below for the ratified basis. "Activated
sponsored workspace" and "Activation rate" are the exceptions: they are
behavioural and withhold at 3 and 5 respectively.]`

| Metric | Definition | Source | Window | Privacy and quality rule | Required test |
| --- | --- | --- | --- | --- | --- |
| ~~Licences allotted~~ `[SUPERSEDED D-020 · 2026-08-03]` | ~~The active term's operator-approved `code_allotment`.~~ Replaced by **Entitlement**: a state, not a count. Renders `Unlimited` for a venue on the unlimited mode. Where a legacy row records no figure, renders `unavailable`, never `0`. | `sponsors.allotment_mode` | Current term | Never rendered as a number for an unlimited venue. Never rendered as `0` for an absent figure. | An absent stored figure produces `unavailable` and no exhaustion message. |
| Invitations issued | Canonical code rows minted against the active term, including redeemed and revoked rows. | `license_codes`, sponsor term | Current term | No code values in aggregate payloads or reports. | Count matches canonical rows. Concurrent mints under an unlimited entitlement both succeed. |
| Invitations redeemed | Distinct canonical code rows with one successful redemption in the active term. | `redemptions`, `license_codes` | Current term | Commercial metadata; no user id in venue payload. | Same-user retry remains one redemption; cross-user reuse is rejected. |
| ~~Codes remaining~~ `[SUPERSEDED D-020 · 2026-08-03]` | ~~`max(0, licences_allotted - codes_issued)`.~~ **Retired. There is nothing to subtract from.** This formula is the specification that produced the live "No remaining allotment headroom" attention item and the fabricated zero on the legacy-null path. It must not be reimplemented. |. |. |. | A sweep of venue-facing copy returns zero hits for "codes remaining". |
| Redemption rate | `invitations_redeemed / invitations_issued`, shown as "18 of 24". Null when nothing was issued. | Derived | Current term | **Always shown with its denominator. Never a bare percentage.** | Zero issued yields "Not available", not 0%. |
| Last redemption | Most recent successful redemption timestamp. | `redemptions` | Current term | Venue-local date only; no person. | A failed or repeated redemption does not change it. |
| First useful action | First qualifying Tier 1 product event after redemption for the sponsored activation. | Short-lived event stream → daily projection | Whole activation | Stored into aggregate projection without content. Never a date, never per couple. | System/demo/view-as/page-load events cannot satisfy it. `reached_board_at` is disqualified: it is stamped on a page render. |
| Activated sponsored workspace | A redeemed activation with at least one first useful action. | Activation projection | Current term | Commercial count visible; no workspace label. | Replaying the source event is idempotent. |
| Activation rate | `activated_sponsored_workspaces / invitations_redeemed`, shown with its denominator. | Derived | Current term | Withhold if coverage is partial or the denominator is 0. | Missing telemetry returns null plus coverage state. |

**`[RATIFIED D-032 R9 · 2026-08-03]`** E09.02 §9.2 asked whether the bar for a
first useful action stays at **one committed action** or rises. **One committed
action** is ratified.

**`[RATIFIED D-032 R10 · 2026-08-03]`** One qualifying action, and
`timeline_unpublished` does not qualify. An unpublish is a couple withdrawing a
share, so it can never be the moment the venue's gift landed. See E09.02 §2,
"The withdrawal list".

## Usage

| Metric | Definition | Source | Window | Privacy and quality rule | Required test |
| --- | --- | --- | --- | --- | --- |
| Active sponsored workspaces | Distinct sponsored activations with at least one meaningful action in the window. | Daily rollup | 7, 30, or 90 days | Suppress when fewer than 3 eligible sponsored workspaces. Never show names. | One workspace with ten actions counts once. Cross-sponsor activations never join. |
| Weekly active sponsored workspaces | Active sponsored workspaces grouped by venue-local ISO week. | Daily rollup | Last 12 complete weeks | Same suppression per point; incomplete week labelled partial. | Boundary actions land in the correct venue-local week. |
| Days with sponsored use | Distinct venue-local dates where at least one sponsored activation recorded a meaningful action. | Daily rollup | 30 or 90 days | Aggregate only; suppressed below 3 eligible workspaces. | Multiple modules on one date count one day. |
| Meaningful action days | Count of idempotent qualifying committed action **days**. | Daily rollup | 7, 30, or 90 days | Aggregate only; never used as a productivity score. | Duplicate source event id and failed transaction do not increment. |
| Module adoption | Distinct active sponsored workspaces with at least one qualifying action in Notes, Tasks, Timeline, or Signal. | Daily rollup | 30 or 90 days | A module point below 3 is suppressed. Counts do not sum to a total, and a suppressed product is not inferable from its neighbours. | One activation can count in several modules, once per module. |
| First-action conversion time | Median elapsed whole hours from redemption to first useful action. | Versioned cohort rollup | Redemption cohort month | ~~Venue-visible.~~ `[SUPERSEDED E09.02 §2 · 2026-08-03]` **Founder-only.** The median hours-from-redemption figure resolves toward individuals in small cohorts. At least 5 eligible activations. | Clock skew and pre-redemption events are rejected. The figure appears in no venue-facing payload, export or accessibility text. |

`[CORRECTED 2026-08-03: "Venue active days" is renamed to "Days with sponsored
use" to match `docs/account/VOCABULARY.md` and the shipped label. "Meaningful
actions" is renamed to "Meaningful action days": E09.02 §9.0 point 3 determines
that a Tier 1 row count is action-**days**, not actions, because the event id is
day-bucketed. Any surface saying "meaningful actions" overstates precision.]`

**`daysWithSponsoredUse` was live in code and absent from E09.02.** It is
declared at `src/lib/account/types.ts:108`, computed, rendered on screen and
printed into the PDF, and it appeared nowhere among E09.02's original six
definitions.

`[RESOLVED D-032 R11 · 2026-08-03. **Adopted as the seventh definition**, at
E09.02 §7A, with a written rule. It is an aggregate over dates, bounded by the
length of the window rather than by the size of the cohort, so it cannot resolve
toward an individual and E09.02 §2's founder-only bar does not reach it. It
carries the same coverage and suppression treatment as the other behavioural
metrics: withheld below 3, `lower_bound` with its denominator on partial
coverage, `unavailable` and never `0` when no day was measured. It is no longer
a "supporting metric only".]`

## Retention

`[E09.02 §4 ratifies ONE band, not three. The three rows below are retained as
the historical Phase A specification and are marked accordingly. Do not
implement three bands against a proposal that defines one.]`

| Metric | Definition | Source | Window | Privacy and quality rule | Required test |
| --- | --- | --- | --- | --- | --- |
| **30-day continuation** (E09.02 §4, the proposed single band) | For a closed cohort grouped by the venue-local date of first useful action: the share that recorded at least one Tier 1 action on **any venue-local day 25 through 35** after day 0. Eleven days wide. | Frozen cohort rollup, sealed nightly | Closed cohorts only | Withheld below 5 eligible activations. **Shown as "9 of 12", never "75%" alone.** Excluded workspaces are counted and shown when a coverage gap, a salt rotation, or a late sealing run touches the band. | A cohort is not eligible until day 35 has fully elapsed for every member. Percentages recompute from frozen counts. |
| ~~Day-7 retention~~ `[NOT IN account-metrics.v2 · 2026-08-03]` | ~~Share of activated sponsored workspaces with a meaningful action on any day 5 through 9 after first action.~~ | Versioned cohort rollup | Closed cohorts only | At least 5 eligible activations; denominator shown. | A cohort is not eligible until day 9 closes. |
| ~~Day-90 retention~~ `[NOT IN account-metrics.v2 · 2026-08-03]` | ~~Share with a meaningful action on any day 80 through 100 after first action.~~ | Versioned cohort rollup | Closed cohorts only | At least 5 eligible activations; denominator shown. | A cohort is not eligible until day 100 closes. |

Retention windows are bands rather than a single calendar day so ordinary
weekly use is not mislabelled as churn. Percentages are recomputed from frozen,
versioned cohort counts; the surface never retains a venue-readable row per
person or workspace.

**Continuation is not churn, and its complement is not "abandoned".** A couple
planning a wedding well over a year out has genuinely quiet months. It is not
"still active today" (that is recent use). It is one cohort: cohorts are not
summed or averaged into a headline, and they are **not comparable between
venues**. No league table, no benchmark, no "above average for your size".

**Expect this metric to be legitimately unavailable for most venues for most of
year one.** A venue with 20 weddings a year will rarely have five workspaces
first-acting in the same cohort. That is a true statement about small venues,
not a defect.

**Both calls here are ratified. `[D-032 R9 · 2026-08-03]`**

- **E09.02 §9.4**. **Days 25 to 35.** Eleven days wide.
- **E09.02 §9.9**. **Option A.** The row is shown with "not enough couples yet"
  rather than hidden, because a venue discovering a hidden metric later reads as
  concealment.

## Meaningful-action event allowlist

| Product | Event kinds | Commit rule | Explicit exclusions |
| --- | --- | --- | --- |
| Signal Notes | `note_created`, `note_materially_edited` | The note write committed and changed persisted user content. | Open, search, selection, autosave retry, archive view, system migration. |
| Signal Tasks | `task_created`, `task_completed`, `task_reopened`, `task_reassigned`, `task_rescheduled`, `task_status_changed` | The task mutation committed and changed a named field or state. | Board/list/calendar view, filter, sort, drag canceled before commit, system seed. |
| Signal Timeline | `timeline_created`, `timeline_curated`, `timeline_published`, `timeline_unpublished` **(unpublish only, see below)** | The owner mutation or publication committed. | Viewing private or public Timeline, preview refresh, background source sync with no owner change. |
| Signal | `briefing_deliberately_opened`, `briefing_acknowledged` **(no call site, see below)** | A user explicitly opened a generated briefing or acknowledged it; one open per briefing per subject per day. | Automatic app landing, prefetch, email delivery, refresh, operator view-as. |

**Two determinations of fact (E09.02 §9.0 points 4 and 5). Not open.**

1. ~~`timeline_visibility_changed` counts as qualifying Timeline usage in the
   ordinary sense.~~ `[CORRECTED E09.01 §3.4 · 2026-08-03]`
   **The kind fires on unpublish, and only on unpublish**
   (`app/src/modules/timeline/server/actions/workspaces.ts:653`). Counting it as
   sharing counts a couple taking their Timeline down as putting it up. It must
   appear in **no** sharing computation. E09.02 acceptance criterion 8 forbids
   it. It is renamed `timeline_unpublished`; the old name is reserved and
   rejected by name.
2. **`briefing_acknowledged` has no call site anywhere in the repository.** Any
   metric built on it is permanently zero, and leaving it allowlisted makes the
   coverage mask look healthier than it is.

**`[RESOLVED D-032 R10 · 2026-08-03]`** E09.02 §2 defined first useful action as
**any qualifying Tier 1 event of any kind**, and `timeline_unpublished` is an
allowlisted Tier 1 kind that fires on unpublish only. §7 and §9.0 point 4
forbade reading it as sharing, but nothing excluded it from first useful action,
so as written a couple taking their Timeline down became an activation.
**It is now excluded**, on the same reasoning: a withdrawal is not an arrival.
The rule is `FIRST_USEFUL_ACTION_EXCLUDED_KINDS` in
`src/lib/account/instrumentation/event-schema.ts`, mirrored byte-for-byte into
`app/`, and the rollup asks it rather than restating it. It remains allowlisted
use and still counts toward recent use, product reach and the day's
meaningful-action count.

**`[RATIFIED D-032 R9 · 2026-08-03]`** E09.02 §9.8 asked whether
`briefing_acknowledged` stays allowlisted while unwired. **Ratified: it comes
off the allowlist until it has a call site, and the removal is recorded so
E09.03 restores it deliberately.**

`[STANDING GAP · 2026-08-03. The allowlist has not yet been changed. Removing a
kind alters the emitted-event contract in both repos plus
`venue-meaningful-action.v1.json`, which is E09.03's change to make rather than
a documentation pass. Until then the coverage envelope continues to report
Signal as one of two kinds instrumented, which is the honest reading either way.
Recorded, not silently reconciled.]`

## Coverage fields carried with every usage response

- `metric_dictionary_version`
- `instrumentation_version`
- `window_start`
- `window_end`
- `data_through`
- `coverage_state`: `complete | partial | suppressed | unavailable`
- `covered_modules`
- `missing_modules`
- `covered_days`
- `expected_days`
- `suppression_reason`: `small_group | incomplete_telemetry | not_instrumented | none`

No usage metric may render without this envelope.

`[CORRECTED 2026-08-03. Two fixes. (1) `coverage_state` had three values; the
shipped `CoverageState` has four and includes `suppressed`
(`src/lib/account/types.ts:10-14`). (2) `suppression_reason` was missing the
fourth value `not_instrumented`, which E09.02 §3 requires and which the shipped
`instrumentation/coverage.ts:110-112` already emits. `not_instrumented` is the
state where the metric was never wired, as distinct from `incomplete_telemetry`,
where it was wired and the data has a gap. Conflating them tells a venue that
something broke when in fact it was never built.]`

## Values that are not numbers

A metric value carries a state. Five states exist
(`src/lib/account/types.ts:25-37`), and a consumer must branch on the state
before reading a value:

- `exact`. The number is known and complete.
- `lower_bound`. At least this many. Coverage was partial. Never a total.
- `withheld`. A real number exists and is hidden to protect a small group. The
  hidden number does not leak through tooltips, accessibility text or exports.
- `unavailable`. A number should exist and could not be produced.
- `unlimited`. **There is no number, and that is the answer.** The entitlement
  is unlimited (D-020). Not missing, not suppressed, not zero.

In CSV, the last three write a **blank** `value` cell. A blank cell never means
"we forgot"; `value_state` says which of the three it is. The consumer contract
is set out in full in [PRODUCT_CONTRACT.md](./PRODUCT_CONTRACT.md).

**No metric renders `0` for an absent value.** E09.02 acceptance criterion 3
requires `assertNoZeroForAbsent()` to throw on any attempt.

## The founder calls: complete register, all closed

**Nothing on this page is open. `[D-032 · 2026-08-03]`** E09.02 §9 separated
**determinations of fact**, which were never open, from **ten genuine choices**.
Ethan approved the Wave 2 packet in full, which adopts E09.02 as proposed. Every
recommendation below became the decision on 2026-08-03.

**Reopening any of them is a change request** under `/venue-change`, not a
document edit.

| Call | Question | Ratified answer | Status |
| --- | --- | --- | --- |
| 9.1 | The recent-use window: 30 complete days, 28, or 14. | **30 complete days** | RATIFIED D-032 R9 |
| 9.2 | The bar for a first useful action: one committed action, or higher. | **One committed action** | RATIFIED D-032 R9 |
| 9.3 | The bar for Timeline creation: one curation, or the four-condition bundle in `planning-period-analytics.md`. | **One curation venue-facing.** The bundle is renamed, marked founder-only and never reaches a venue-facing surface. | RATIFIED D-032 R9 |
| 9.4 | The continuation band: days 25 to 35, exact day 30, or 21 to 40. | **Days 25 to 35** | RATIFIED D-032 R9 |
| 9.5 | Whether product reach is venue-visible per product, or collapsed to one sentence. | **Collapsed to one sentence.** The four numbers stay founder-only. | RATIFIED D-032 R9 |
| 9.6 | Whether "ever shared" is venue-visible, or only "currently shared". | **Currently shared only** | RATIFIED D-032 R9 |
| 9.7 | Whether public-Timeline viewer counts reach the venue at all. | **Founder-only** until E06.07 answers it | RATIFIED D-032 R9 |
| 9.8 | Whether `briefing_acknowledged` stays allowlisted while it has no call site. | **Removed** until it has one, with the removal recorded so E09.03 restores it deliberately. The allowlist change itself is E09.03's, and has not landed. | RATIFIED D-032 R9 |
| 9.9 | Whether continuation is shown before a cohort reaches five. | **Shown**, with "not enough couples yet" | RATIFIED D-032 R9 |
| 9.10 | Whether Keepsake workspaces are excluded from the recent-use denominator. | **Excluded**, with the excluded count shown | RATIFIED D-032 R9 |

**The two items that sat outside the ten are also closed:**

1. **`timeline_unpublished` and first useful action.** **Excluded.** A
   withdrawal is not an arrival. `[RATIFIED D-032 R10 · 2026-08-03]`
2. **`daysWithSponsoredUse`.** **Adopted as the seventh definition**, at E09.02
   §7A, with a written rule. `[RATIFIED D-032 R11 · 2026-08-03]`

## The suppression floors `[RATIFIED D-032 R12 · 2026-08-03]`

The floors are asymmetric on purpose, and the asymmetry now has a ratified
basis.

| Class | Examples | Floor |
| --- | --- | --- |
| Behavioural counts | First useful action, recent use, Timeline creation, product reach, days with sponsored use | Withheld below **3** eligible sponsored workspaces |
| Rates and cohorts | 30-day continuation, any percentage form, any median | Withheld below **5** |
| **Access metrics** | Covered, available, issued, redeemed | **None. Emitted exactly at any cohort size.** |

**The basis.** Access counts are the direct contract record between Signal
Studio and the venue: what Signal issued on the venue's own instruction and what
came back. Behavioural counts are observation of couples, and the floors of 3
and 5 exist to stop a number resolving toward one identifiable couple's conduct.
That risk is not present in a count of invitations the venue itself asked us to
send. So a venue with one redeemed invitation is told **one**.

The 3 and 5 are ratified in D-011 point 3 and are not editable here. The access
floor is ratified in D-032 R12. The rule lives in code as
`ACCESS_METRIC_MIN_WORKSPACES`, `COHORT_FLOOR` and `presentAccess()` in
`src/lib/account/instrumentation/suppression.ts`; `presentAccess()` takes no
cohort argument, so a behavioural floor cannot be applied to a contract fact by
accident.

**No floor is not no honesty contract.** An absent access figure still renders
`unavailable` and never `0`, and an unlimited entitlement still renders
`unlimited` and never a number (D-020).

## Determinations of fact

**Never open, and unchanged by any of the above** (E09.02 §9.0): a page load can
never be activation; the denominator cannot be booking-attributed; a Tier 1 row
count is action-days; `timeline_unpublished` fires on unpublish;
`briefing_acknowledged` has no call site; unfiled Notes and unlinked Timelines
are coverage, never zero; a salt rotation is a coverage break; access-term end
and Keepsake entry are not computable today (R-015); the suppression thresholds
are 3 and 5 (D-011 point 3, not reopened); and nothing in E09.02 has ever been
computed from a real couple's action.

**That last point still holds after ratification.** D-032 R9 ratifies
definitions. It does not ratify measurements, and no number in
`account-metrics.v2` has yet been computed from anything a couple did.
