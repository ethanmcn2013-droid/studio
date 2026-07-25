# Venue Portal metric dictionary

Dictionary version: `venue-metrics.v1`  
Calendar: venue-configured IANA timezone, default `Europe/Dublin`  
Windows: inclusive of the report end date; daily rollups close after 06:00 in
the venue timezone.

## Access and activation

| Metric | Definition | Source | Window | Privacy and quality rule | Required test |
| --- | --- | --- | --- | --- | --- |
| Licences allotted | The active term's operator-approved `code_allotment`. | `sponsors`, `allotment_ledger` | Current term | Visible to the owning sponsor. Must reconcile to `SUM(allotment_ledger.delta)`. | Mismatched ledger and sponsor counter produces `needs_attention`, not a value presented as reconciled. |
| Codes issued | Canonical code rows minted against the active term, including redeemed and revoked rows because issue consumed allotment. | `license_codes`, sponsor term | Current term | No code values in aggregate payloads or reports. | Two concurrent mint requests cannot exceed allotment; count matches canonical rows. |
| Codes redeemed | Distinct canonical code rows with one successful redemption in the active term. | `redemptions`, `license_codes` | Current term | Commercial metadata; no user id in portal payload. | Same-user retry remains one redemption; cross-user reuse is rejected. |
| Codes remaining | `max(0, licences_allotted - codes_issued)`. | Derived | Now | If reconciliation drift exists, show "Needs reconciliation" rather than a number. | Revoked codes do not silently restore headroom. |
| Redemption rate | `codes_redeemed / codes_issued * 100`. Null when no codes were issued. | Derived | Current term | Display denominator next to percentage. | Zero issued yields "Not available", not 0%. |
| Last redemption | Most recent successful redemption timestamp. | `redemptions` | Current term | Venue-local date only; no person. | A failed or repeated redemption does not change it. |
| First meaningful action | First qualifying product event after redemption for the sponsored activation. | Short-lived event stream | Lifetime of activation | Stored into aggregate projection without content. | System/demo/view-as/page-load events cannot satisfy it. |
| Activated sponsored workspace | A redeemed activation with at least one first meaningful action. | Activation projection | Current term | Commercial count visible; no workspace label. | Replaying the source event is idempotent. |
| Activation rate | `activated_sponsored_workspaces / codes_redeemed * 100`. | Derived | Current term | Withhold if coverage is partial or denominator is 0. | Missing telemetry returns null plus coverage state. |

## Usage

| Metric | Definition | Source | Window | Privacy and quality rule | Required test |
| --- | --- | --- | --- | --- | --- |
| Active sponsored workspaces | Distinct sponsored activations with at least one meaningful action in the window. | Daily rollup | 7, 30, or 90 days | Suppress when fewer than 3 eligible sponsored workspaces. Never show names. | One workspace with ten actions counts once. Cross-sponsor activations never join. |
| Weekly active sponsored workspaces | Active sponsored workspaces grouped by venue-local ISO week. | Daily rollup | Last 12 complete weeks | Same suppression per point; incomplete week labelled partial. | Boundary actions land in the correct venue-local week. |
| Venue active days | Distinct venue-local dates where at least one sponsored activation recorded a meaningful action. | Daily rollup | 30 or 90 days | Aggregate only; suppressed below 3 eligible workspaces. | Multiple modules on one date count one day. |
| Meaningful actions | Count of idempotent qualifying committed actions. | Daily rollup | 7, 30, or 90 days | Aggregate only; never used as a productivity score. | Duplicate source event id and failed transaction do not increment. |
| Module adoption | Distinct active sponsored workspaces with at least one qualifying action in Notes, Tasks, Timeline, or Signal. | Daily rollup | 30 or 90 days | A module point below 3 is suppressed. No cross-module content. | One activation can count in several modules, once per module. |
| First-action conversion time | Median elapsed whole hours from redemption to first meaningful action for activations in the cohort. | Versioned cohort rollup | Redemption cohort month | At least 5 eligible activations. Exclude missing-coverage activations and show excluded count. | Clock skew and pre-redemption events are rejected. |

## Retention

| Metric | Definition | Source | Window | Privacy and quality rule | Required test |
| --- | --- | --- | --- | --- | --- |
| Day-7 retention | Share of activated sponsored workspaces with a meaningful action on any day 5 through 9 after first action. | Versioned cohort rollup | Closed cohorts only | At least 5 eligible activations; denominator shown. | A cohort is not eligible until day 9 closes. |
| Day-30 retention | Share with a meaningful action on any day 25 through 35 after first action. | Versioned cohort rollup | Closed cohorts only | At least 5 eligible activations; denominator shown. | A cohort is not eligible until day 35 closes. |
| Day-90 retention | Share with a meaningful action on any day 80 through 100 after first action. | Versioned cohort rollup | Closed cohorts only | At least 5 eligible activations; denominator shown. | A cohort is not eligible until day 100 closes. |

Retention windows are bands rather than a single calendar day so ordinary
weekly use is not mislabelled as churn. Percentages are recomputed from frozen,
versioned cohort counts; the portal never retains a venue-readable row per
person or workspace.

## Meaningful-action event allowlist

| Product | Event kinds | Commit rule | Explicit exclusions |
| --- | --- | --- | --- |
| Signal Notes | `note_created`, `note_materially_edited` | The note write committed and changed persisted user content. | Open, search, selection, autosave retry, archive view, system migration. |
| Signal Tasks | `task_created`, `task_completed`, `task_reopened`, `task_reassigned`, `task_rescheduled`, `task_status_changed` | The task mutation committed and changed a named field or state. | Board/list/calendar view, filter, sort, drag canceled before commit, system seed. |
| Signal Timeline | `timeline_curated`, `timeline_visibility_changed`, `timeline_published` | The owner mutation or publication committed. | Viewing private or public Timeline, preview refresh, background source sync with no owner change. |
| Signal | `briefing_deliberately_opened`, `briefing_acknowledged` | A user explicitly opened a generated briefing or acknowledged it; one open per briefing per subject per day. | Automatic app landing, prefetch, email delivery, refresh, operator view-as. |

## Coverage fields carried with every usage response

- `metric_dictionary_version`
- `instrumentation_version`
- `window_start`
- `window_end`
- `data_through`
- `coverage_state`: `complete | partial | unavailable`
- `covered_modules`
- `missing_modules`
- `covered_days`
- `expected_days`
- `suppression_reason`: `small_group | incomplete_telemetry | none`

No usage metric may render without this envelope.

