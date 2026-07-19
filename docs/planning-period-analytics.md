# Planning Period analytics

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
| onboarding_completed | context_type, workspace_count, activation_criteria_met |
| primary_date_added | context_type, date_label_kind |
| timeline_item_promoted | context_type, selected_field_count, audience_kind |
| audience_preview_opened | context_type, audience_kind, item_count |
| public_share_created | context_type, audience_kind, has_expiry |
| public_share_rotated | context_type, audience_kind |
| public_share_revoked | context_type, audience_kind |
| signal_scope_changed | from_scope, to_scope, context_type |
| period_signal_viewed | context_type, candidate_count, surfaced_count, empty |

Property allowlists are enforced before transport. Unknown object-shaped values are rejected rather than serialized.

## Activation definitions

- Teacher: school-year period, at least two class Workspaces, meaningful milestones in one class and a Class Timeline preview.
- Student: semester, at least three module Workspaces, one deadline/primary date, one Task and a semester Signal view.
- Wedding: Wedding Workspace and date, at least three milestones, Couple Timeline preview/share, and sponsored activation where the entry path is sponsored.

## Product-learning questions

Privacy-safe aggregates may answer:

- number of Workspaces created per context;
- onboarding start, resume and completion rates;
- whether owners return in a later week;
- whether an audience preview precedes share creation;
- whether period Signal is used and whether it is often empty;
- whether Workspaces have activity in a later calendar week.

No customer-facing analytics dashboard is part of this work.
