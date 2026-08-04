# REPORTING — methodology (VEF-2026)

Every number in `STATUS.md` is computed from `PROJECT_STATE.json` by
`tools/project-control.mjs`. No percentage is ever typed by hand. This file
defines what each number means, so a number can never mean something
convenient.

---

## 1. Verified completion — the headline

A task counts as completed only when **all four** hold:

1. its acceptance criteria have been satisfied;
2. evidence has been recorded;
3. required verification has passed;
4. Ethan has explicitly approved it, and its state is `done`.

`validate` refuses a `done` task that lacks founder approval, evidence or
acceptance criteria, so the headline cannot be inflated by editing state.

**Formula (once effort estimates are approved):**

```
verified completion = approved Done effort points / total active approved effort points
```

**Formula (before estimates are approved — where we are today):**

```
provisional completion = Done tasks / active tasks
```

Active means every task except `deferred` and `cancelled`. Deferred and
cancelled work leaves the denominator; it never leaves the record.

The provisional figure is labelled `provisional_task_count` in every report and
carries this sentence: every task counts equally, so it is not a measure of
effort remaining. E01.01 (write a brief) and E07.18 (complete portal
permissions, audit history, states, responsive, accessibility and end-to-end
reconciliation) currently count the same. That is the honest limitation of a
count-based measure and the reason the baseline is Draft.

`STATUS.md` always prints the numerator, the denominator, the unit and the
basis. A bare percentage is never reported.

## 2. Delivery progress estimate — secondary, and labelled

Reported only when the baseline is approved. It is an estimate, not verified
completion, and it is never the headline.

Deterministic status-credit model:

| Status | Credit |
|---|---|
| backlog | 0 |
| ready | 0 |
| blocked | 0 |
| in_progress | 0.25 |
| internal_review | 0.6 |
| founder_review | 0.85 |
| done | 1.0 |

Each task's credit is weighted by its approved effort points when estimates are
approved, and by 1 otherwise. Blocked work earns zero credit regardless of how
much was done before it blocked, because blocked work does not deliver.

Until the baseline is approved, `STATUS.md` prints: *not reported — a
status-credit estimate would imply a precision the baseline does not have.*

## 3. Effort estimates

Scale: 1, 2, 3, 5, 8, 13. Nothing else validates.

| Estimate status | Meaning |
|---|---|
| `unestimated` | No estimate exists. The default for all 211 imported tasks. |
| `provisional` | Claude's estimate, set while writing a task specification. |
| `approved` | Ethan has approved the number. |

Estimates are set when a task specification is written, not from the title. A
title tells you almost nothing about effort, and guessing from one is exactly
the fabricated precision this project forbids.

`baseline.estimatesApproved` is the switch that moves verified completion from
count-based to points-based. Setting it before a meaningful share of active
tasks carries approved points produces a worse number, not a better one.

## 4. Release readiness

Reported gate by gate, never rolled into one figure.

| Gate state | Meaning |
|---|---|
| `not_started` | No work has begun against its exit criteria. |
| `in_progress` | Work under way. |
| `ready_for_review` | Claude believes exit criteria are met. Founder decision pending. |
| `passed` | Founder passed it. Requires a pass date and a recorded basis. |
| `failed` | Reviewed and failed. |
| `waived` | Founder waived it. Requires an explicit recorded waiver. |

**A high overall task percentage never conceals a failed gate.** The go/no-go
milestone (E15.01) cannot pass unless all six gates are `passed` or `waived`.
`STATUS.md` prints the gate table above the current-work section for that reason.

## 5. Commercial outcome

Tracked separately from backlog completion and never blended into it. Backlog
percentage measures build progress. The Founding 25 tracker measures the actual
business outcome.

Tracked: founding target (25), founding places available, researched account
universe, cohort readiness (1–4), invitations issued, responses, qualified
meetings, demonstrations, proposals, signed agreements, paid agreements,
configured venue accounts, onboarded venues, first couple invitations, first
couple activations.

Stage definitions are strict:

- A **researched** venue is not a founding venue.
- An **invited** venue is not a signed venue.
- A **signed** venue is not paid until payment is confirmed.
- A **paid** venue is not onboarded until its account and first operating flow
  pass the onboarding definition (E15.10, E15.11).
- **25 invitations sent** and **25 paid and onboarded** are different rows and
  are never summarised as one.

The two bold rows in the generated table are paid agreements and onboarded
venues, because those are the ones that close the project.

**No venue names, contact names, emails, phone numbers or addresses appear in
project state or in any generated report.** Counts only. `validate` fails if
anything resembling an email address appears in the commercial tracker, and a
test asserts `STATUS.md` contains no email or phone pattern. Named account
records live in Signal HQ and the CRM, referenced by stable ID.

## 6. Film outcome

Each film carries an independent stage tracker. Reported as `n/m stages
complete` with the stage list, never as a percentage of the film.

A draft render does not make a film complete. `Limerick First` is complete when
all 25 Cohort 1 renders are QA'd and approved; `Before the Day` is complete when
the master, captions, cutdowns, product-accuracy QA, privacy QA and founder
approval are all done.

## 7. Health (RAG)

RAG is set deliberately with a factual reason attached, in
`project.health.reason`. The schema requires the reason. A rating without a
stated reason is not permitted.

Working definitions:

- **Green** — release gates are on track, no release-blocking task is blocked,
  no unresolved founder decision is gating critical-path work.
- **Amber** — a release-blocking task is blocked, or a founder decision is
  gating the critical path, or the baseline is unapproved.
- **Red** — the release date or the completion condition is not achievable
  without a change record.

## 8. What is deliberately not reported

- A single unexplained percentage.
- Any forecast completion date per task before estimates and dependencies are
  approved.
- Velocity or burndown. With 211 tasks, no history and one executor, both would
  be decoration.
- Confidence intervals. There is no data to support them.

## 9. Determinism

Given the same `PROJECT_STATE.json` and the same clock, `render` produces
byte-identical `BACKLOG.md` and `STATUS.md`. Tests assert this. `render --check`
re-renders against the last render's clock and fails if either file has drifted
or been hand-edited, which is how hand-editing a generated file gets caught.
