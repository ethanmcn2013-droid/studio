# Planning Period analytics

**Standing:** internal product-learning analytics. **Founder-only throughout.**
Nothing defined in this document reaches a venue-facing surface, and nothing in
it is a metric in `account-metrics.v2`. The metric dictionary of record is
[`E09.02-metric-definitions.md`](./execution/venue-edition-and-films/evidence/E09.02-metric-definitions.md).

`[D-032 R9 · 2026-08-03. The section formerly titled "Activation definitions" is
renamed to "Period-setup completeness" so that the word "activation" means
exactly one thing on any venue-facing surface. The definition itself is kept.]`

## Data rule

Use the existing first-party event transport. Properties are limited to enums, counts, booleans, coarse step IDs, product IDs and opaque internal owner-scoped identifiers where operationally necessary.

Never send Note or Task text, class/module/couple names, pasted values, pupil data, public-link tokens, email, ceremony information or exact sponsor metadata. Audience Timeline pages have no third-party behavioral tracking.

## Event taxonomy

| Event | Minimum safe properties |
| --- | --- |
| planning_period_created | context_type, source, workspace_count |
| planning_period_archived | context_type, active_workspace_count |
| workspace_bulk_created | context_type, count, duplicate_count |
| workspace_moved | context_type, same_period_context |
| workspace_duplicated | context_type, copied_task_count, copied_timeline_structure, copied_collaborators |
| onboarding_started | context_type, entry_point, schema_version |
| onboarding_resumed | context_type, step_id |
| onboarding_completed | context_type, workspace_count, activation_criteria_met **(period-setup completeness, not `account-metrics.v2` activation)** |
| primary_date_added | context_type, date_label_kind |
| timeline_item_promoted | context_type, selected_field_count, audience_kind |
| audience_preview_opened | context_type, audience_kind, item_count |
| public_share_created | context_type, audience_kind, has_expiry |
| public_share_rotated | context_type, audience_kind |
| public_share_revoked | context_type, audience_kind |
| signal_scope_changed | from_scope, to_scope, context_type |
| period_signal_viewed | context_type, candidate_count, surfaced_count, empty |

Property allowlists are enforced before transport. Unknown object-shaped values are rejected rather than serialized.

## Period-setup completeness (founder-only) `[RENAMED D-032 R9 · 2026-08-03]`

`[This section was titled "Activation definitions". It defined a four-condition
bundle and called the result activation. `account-metrics.v2` defines
activation as a first useful action: one committed action, subject to the
withdrawal list (E09.02 §2). Two live definitions of one word is how two people
report two numbers and both are right. **D-032 R9 keeps this definition and
renames it**, because it measures something real about product learning that the
adoption metric does not: whether an owner finished setting a period up.]`

**Founder-only. It never reaches a venue-facing surface**, in any form: not on
screen, not in a CSV or PDF export, not in an API payload, not in an email, not
in accessibility text, and not in support view-as. It is a product-learning
figure, and it is not evidence of adoption.

**The word "activation" is not used for it.** On any venue-facing surface,
activation means E09.02 §2 and nothing else.

Period setup is complete when:

- **Teacher:** school-year period, at least two class Workspaces, meaningful
  milestones in one class and a Class Timeline preview.
- **Student:** semester, at least three module Workspaces, one deadline or
  primary date, one Task and a semester Signal view.
- **Wedding:** Wedding Workspace and date, at least three milestones, and a
  Couple Timeline preview or share.

`[The wedding condition previously ended "and sponsored activation where the
entry path is sponsored". That clause is removed: it made a product-learning
measure depend on the venue entitlement chain, which is the coupling that let
the two definitions be mistaken for each other in the first place. Sponsored
adoption is measured by `account-metrics.v2`, from meaningful-action events,
and by nothing else.]`

**A note on the event property.** `onboarding_completed` carries
`activation_criteria_met`. The property name is unchanged here because renaming
a transported property is an instrumentation change with its own migration, not
a documentation edit. It refers to the conditions above. It is not the
`account-metrics.v2` activation and must never be projected as one.

## Product-learning questions

Privacy-safe aggregates may answer:

- number of Workspaces created per context;
- onboarding start, resume and completion rates;
- whether owners return in a later week;
- whether an audience preview precedes share creation;
- whether period Signal is used and whether it is often empty;
- whether Workspaces have activity in a later calendar week.

No customer-facing analytics dashboard is part of this work.
