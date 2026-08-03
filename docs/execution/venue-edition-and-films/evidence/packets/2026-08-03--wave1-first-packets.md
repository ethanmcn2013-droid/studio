# Founder review packet — everything awaiting founder review

Generated 2026-08-03T00:51:38.714Z from PROJECT_STATE.json. 14 task(s).

**14 ready to approve · 0 not ready.**

Approving sets these tasks to Done and is the only thing that can. Nothing here is Done yet.

## Ready to approve

### `E01.01` Publish a one-page source-of-truth brief containing the current offer, product model, geography, films and superseded assumptions.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. BRIEF.md exists at the control root and covers all five subjects named in the task title: current offer, product model, geography, both films, superseded assumptions.
2. Every factual claim is traceable to D-001 to D-024, PROJECT.md or CR-001, and an independent adversarial fact-check found no wrong claim.
3. Every superseded position is named explicitly alongside the decision that replaced it. Nothing is superseded silently.
4. The brief distinguishes decisions that are recorded from decisions the repository has not yet implemented, and names the live product defects.
5. It is one page. Not a document set and not a second decision log.
6. It passes the mechanical brand-voice check with zero findings, and contains no em dash and no exclamation mark.
7. It states plainly what is still open, including the accepted exposures, rather than reading as if everything is settled.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- studio/docs/execution/venue-edition-and-films/BRIEF.md — The one-page brief. Offer, product model, geography, both films, superseded positions, what is open.
- studio/docs/execution/venue-edition-and-films/evidence/E01.01-superseded-ledger.md — The file-by-file list of surfaces still carrying a retired position, verified by grep on 2026-08-03.
- studio/docs/execution/venue-edition-and-films/evidence/E01.01-factcheck-v1.md — Adversarial fact-check of version 1.0: 95 claims checked, 14 wrong or misleading, all fixed in 1.1.
- studio/src/lib/entitlements-db/codes.ts:150-165 — R-015 re-verified 2026-08-03: the mint now accepts a computed duration. The brief was corrected to 1.2 within the session.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.01.md`

### `E01.02` Define the primary project objective as 25 signed and paid founding venues, rather than 25 invitations or expressions of interest.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. The primary objective is stated in a durable controlling document as 25 signed and paid founding venues, not 25 invitations or expressions of interest.
2. PROJECT_STATE.json carries invitationsIssued, signedAgreements, paidAgreements, configuredVenueAccounts and onboardedVenues as separate counters that no code path sums.
3. REPORTING.md defines each stage strictly: a researched venue is not a founding venue, an invited venue is not a signed venue, a signed venue is not paid until payment is confirmed.
4. The generated commercial report presents paid agreements and onboarded venues as the outcome rows, distinct from the activity rows.
5. The assessment states plainly which of the above is enforced by code or test and which rests on prose alone.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- studio/docs/execution/venue-edition-and-films/REPORTING.md#5 — Strict stage definitions: researched is not invited, invited is not signed, signed is not paid until confirmed.
- PROJECT_STATE.json#commercial — Five separate counters. No code path sums activity with outcome.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.02.md`

### `E01.03` Separate the 1 September release milestone from the final project-closure milestone of 25 paid and onboarded venues.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. Two distinct milestones exist: M5 release 2026-09-01, and M6 Founding 25 complete, with separate exit criteria.
2. What release means is written down and ratified by a founder decision rather than inferred.
3. M6 carries no target date, because dating an outcome-driven completion condition would be fabricated precision.
4. No generated report presents a single figure blending release readiness with Founding 25 completion.
5. The separation appears in BRIEF.md in plain English.
6. The link between this project's release date and the company launch gate is recorded, so the two 1 September dates are not treated as independent.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- PROJECT_STATE.json#milestones — M5 release 2026-09-01 and M6 undated project closure, with separate exit criteria.
- studio/docs/execution/venue-edition-and-films/STATUS.md#milestones — Milestones now render. They were in state and reported nowhere.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.03.md`

### `E01.04` Lock project scope and explicitly exclude internal venue operations, full-scale schools, full-scale students and unrelated product expansion.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. PROJECT.md section 10 lists every ratified exclusion, including the founder's addition of no bespoke development for any individual founding venue.
2. D-008 records the founder's ratification of the exclusion list.
3. New scope has exactly one documented entry route, the change request, written in both PROJECT.md section 20 and WORKFLOWS.md section 5.
4. The change-request route has been exercised at least once in practice, not only documented.
5. The no-bespoke-development boundary is carried into the Founding Venue Benefits Charter scope per D-014, so it reads as a documented benefit rather than a later refusal.
6. The charter no longer contradicts any ratified decision, and every correction made to it is listed with the decision that required it.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- studio/docs/execution/venue-edition-and-films/PROJECT.md#10 — Charter revision 1.1: all five ratified exclusions present, plus D-018. Four contradictions with ratified decisions corrected.
- studio/docs/execution/venue-edition-and-films/evidence/change-requests/CR-001.md — The change-request route exercised in practice, not only documented.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.04.md`

### `E01.05` Create the project board with fields for epic, task ID, priority, status, owner, dependency, acceptance evidence and target date.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. All eight named fields exist on the project board: epic, task ID, priority, status, owner, dependency, acceptance evidence, target date.
2. Acceptance evidence appears on the generated board as a column, not only in the underlying data.
3. A target date exists as a per-task field, is nullable, and is never computed from anything.
4. validate refuses a target date with no recorded basis.
5. A test asserts every one of the eight fields is present, so a future render cannot drop one silently.
6. The board is generated from canonical state, and render --check fails if it is hand-edited.
7. The tension between the task title's target-date field and REPORTING.md section 8's refusal of forecast dates is resolved in writing rather than ignored.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- studio/docs/execution/venue-edition-and-films/BACKLOG.md — The board carrying all eight named fields, including the Target and Evidence columns that did not exist.
- tools/project-control.mjs#target — The target command and the validator rule refusing a date with no basis.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.05.md`

### `E01.06` Assign an accountable owner or lead agent to every epic while retaining founder approval over product, commercial and release decisions.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. All 15 epics carry an owner. No epic is unassigned.
2. All 211 tasks carry an executor and an approver. No task is unassigned.
3. D-008 point 2 is reflected in state: E11 drafting tasks sit with Claude Code and E11 execution remains the founder's.
4. D-015 Q6 is reflected in state: E13.04, E13.15 and E13.16 sit with Claude Code rather than the motion lane.
5. Founder approval authority is enforced in code: transition cannot set done, and approve refuses without criteria, evidence and founder-review status.
6. A test asserts that enforcement, so it cannot be removed silently.
7. The assessment names every epic or task whose recorded owner disagreed with the decision that assigned it, and what was done about it.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- PROJECT_STATE.json#tasks.executor — 15 of 15 epics owned, 211 of 211 tasks with an executor and approver, none unassigned.
- studio/docs/execution/venue-edition-and-films/DECISIONS.md#D-015 — D-015 Q6 applied: E13.04, E13.15 and E13.16 moved to Claude Code. They had never reached state.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.06.md`

### `E01.07` Build the complete dependency map and identify the product, legal, capture, film and outreach critical paths.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. Every task-level dependency traceable to a named source is recorded in PROJECT_STATE.json, not only in a document.
2. Every edge carries a written basis, and a test fails if any task has dependencies with no basis.
3. The graph is acyclic, asserted by validate and by a test.
4. The five named critical paths are each traced with their ordered chain, terminal deliverable, weakest link and a stated achievability verdict against the D-008 freeze dates.
5. No achievability verdict claims calendar precision, because no task carries an effort estimate.
6. Conflicts between the proposed graph and existing sources are recorded and not reconciled by guesswork.
7. Wiring the graph blocks no package that could previously proceed, and the dependency-satisfaction semantics that make this true are written down rather than assumed.
8. What could not be determined is listed explicitly rather than filled in with plausible edges.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- studio/docs/execution/venue-edition-and-films/DEPENDENCY_MAP.md — The five critical paths, the dependency-satisfaction rule, the conflicts recorded and the gaps listed.
- PROJECT_STATE.json#dependencies — 134 edges across 52 tasks, up from 20 across 4. Every edge carries a written basis. Acyclic.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.07.md`

### `E01.08` Create a decision log recording every ratified commercial, legal, product, design and film decision.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. A single append-only log records every ratified decision, with no existing entry rewritten by this task.
2. Every decision carries date, status, decision-maker, what it affects, the decision and its rationale.
3. The log is navigable by the five domains the title names without reading it end to end.
4. Coverage per domain is counted and stated honestly, including any domain with zero entries.
5. Entries whose headers are stale relative to a later decision are identified at the top, so nobody acts on a resolved question as if it were open.
6. Superseding chains are explicit: a decision that changes another names it.
7. Change requests are registered alongside decisions with their status.
8. Where coverage reveals a gap in the programme rather than in the log, it is recorded as a RAID entry and not disguised as a documentation problem.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- studio/docs/execution/venue-edition-and-films/DECISIONS.md#index — The domain index, the four resolved-but-still-proposed entries, and the change-request register.
- studio/docs/execution/venue-edition-and-films/RAID.md#I-009 — Zero ratified design decisions with UI freeze 17 days out. A programme gap, not a ledger gap.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.08.md`

### `E01.09` Create a project risk and issue register covering commercial, product, privacy, delivery, founder-capacity and launch risks.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. The register covers all six named categories: commercial, product, privacy, delivery, founder-capacity and launch. No category is empty.
2. Risks and issues are separately tracked with stable IDs, and nothing is deleted.
3. Every entry carries type, probability, impact, severity, owner, trigger, mitigation, affects, status and a last-reviewed date.
4. A controlled vocabulary maps the six categories to entries, so an empty category is visible rather than only inferable by reading the whole file.
5. Risks accepted by founder decision are recorded as accepted with the founder's position, not quietly closed.
6. Where an exposure is carried by the release gates rather than by the register, that is stated, because a gate records required state and not what could go wrong.
7. The register's own limitations are recorded: that no tool validates the file, and that its escalation rule is not cross-checked against task blockers.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- studio/docs/execution/venue-edition-and-films/RAID.md#category-index — The six named categories mapped to entries. Launch was empty before 2026-08-03.
- studio/docs/execution/venue-edition-and-films/RAID.md#R-023 — R-023, R-024 and R-025: the launch risks the gates could not carry.
- studio/docs/execution/venue-edition-and-films/RAID.md#I-007 — I-007: the entire control root is untracked in git. Verified by git status, not inferred.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.09.md`

### `E01.10` Define six formal release gates: commercial, legal, product, data, creative and sales-readiness.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. All six gates have exit criteria, a named owner and a defined state model.
2. Each of the five non-legal gates carries at least eight criteria, each specific enough for someone who was not in the room to check.
3. Every criterion names the evidence that would satisfy it, and names the task ID where it maps to one.
4. No criterion can be satisfied by assertion. Phrases like complete to the agreed standard do not appear.
5. Every criterion is consistent with the ratified constraints and none assumes spend, professional review or capability the decisions removed.
6. The legal gate's twelve criteria from CR-001 are unchanged.
7. The creative gate's criteria are verifiable by the lane that did not produce the work.
8. A test asserts the minimum criteria count and length per gate, so a gate cannot quietly revert to headlines.
9. Every epic is either covered by a gate or declared as deliberately uncovered with a change request open against it.
10. Criteria are recorded through the tool, under the lock and the validator, not by hand-editing canonical state.
11. The criteria of a passed or waived gate cannot be rewritten.
12. Risks on the register that no gate criterion covered are identified, and each is either folded into a gate that already owns the epic or raised as a change request.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- studio/docs/execution/venue-edition-and-films/evidence/gates/commercial.json — 12 exit criteria replacing 3 headlines.
- studio/docs/execution/venue-edition-and-films/evidence/gates/product.json — 12 exit criteria replacing 3 headlines.
- studio/docs/execution/venue-edition-and-films/evidence/gates/data.json — 12 exit criteria replacing 3 headlines.
- studio/docs/execution/venue-edition-and-films/evidence/gates/creative.json — 13 exit criteria, every one verifiable by the lane that did not produce the work.
- studio/docs/execution/venue-edition-and-films/evidence/gates/sales_readiness.json — 12 exit criteria replacing 3 headlines.
- studio/docs/execution/venue-edition-and-films/evidence/change-requests/CR-002.md — The two epics no gate covers. Raised, not applied: changing a gate is change control.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.10.md`

### `E01.11` Set the offer-freeze, UI-freeze, copy-freeze, capture-freeze, film-lock and release-candidate dates.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. All six dates are recorded in canonical state exactly as D-008 ratified them: offer 2026-08-15, UI 2026-08-20, copy 2026-08-21, capture 2026-08-22, film lock 2026-08-28, release candidate 2026-08-30.
2. Each carries the decision that set it and a sentence saying what stops changing on that date.
3. They appear in the generated status report with days remaining, and a passed freeze is marked as passed rather than shown as a negative number.
4. The weekly operating review names any freeze landing inside its seven-day window and the next one after it.
5. The tasks each freeze gates carry it as a target date with a recorded basis.
6. No command can move a freeze date. Moving one requires a change request.
7. A test asserts the six dates match D-008 exactly, so drift fails rather than passes.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- PROJECT_STATE.json#freezes — The six D-008 dates as first-class records, each naming its source and what stops changing.
- studio/docs/execution/venue-edition-and-films/STATUS.md#freeze-dates — The freeze table with days remaining. The dates previously appeared in no report.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.11.md`

### `E01.12` Establish a weekly operating review covering blockers, decisions, evidence, quality, pipeline and the next seven days.

Executor: claude_code · in review since 2026-08-03

**Acceptance criteria**
1. The review carries all six named sections: blockers, decisions, evidence, quality, pipeline and the next seven days.
2. It is demonstrably not the status report under another name, asserted by a test.
3. Its horizon is genuinely seven days, and it names freezes and target dates landing inside that window.
4. Its decisions section reports only questions that are actually open. A question closed by a decision does not appear.
5. Its pipeline section never sums activity with outcome; paid and onboarded are marked as the outcome rows.
6. Its evidence section reports how much active work carries acceptance criteria, because work in flight with no criteria has no agreed definition of done.
7. Its quality section states plainly that DECISIONS.md and RAID.md are validated by nothing, so those are read with human eyes.
8. The cadence is recorded and the review changes no state: decisions taken in it exist only once recorded by a command or a change request.
9. A template and a written procedure exist, so the review survives without the person who designed it.
10. The output is deterministic for the same state and clock.

**Evidence**
- studio/docs/execution/venue-edition-and-films/evidence/E01-governance-assessment.md — Criterion-by-criterion assessment against the task title, with the verdict and every named gap.
- studio/docs/execution/venue-edition-and-films/evidence/E01-verification-run.txt — Real command output: 61 tests pass, validate clean at 134 edges and no cycles, render --check clean.
- tools/project-control.mjs#renderWeekly — The six named sections. status weekly was a bare alias for status overall.
- studio/docs/execution/venue-edition-and-films/templates/WEEKLY_REVIEW.md — The template: generated numbers plus the three things only a person can add.
- studio/docs/execution/venue-edition-and-films/WORKFLOWS.md#12 — The written procedure, so the review survives without the session that designed it.
- Specification: `studio/docs/execution/venue-edition-and-films/tasks/E01.12.md`

### `E09.01` Publish the Venue Edition event taxonomy and metric data dictionary.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. The event taxonomy is published as account-metrics.v2: three tiers that never merge, the meaningful-action allowlist with its commit rules, the extended forbidden-field list, and the venue-local day boundary stated unambiguously.
2. Six measurement traps are recorded as determinations of fact, including that timeline_visibility_changed fires only on unpublish and that briefing_acknowledged has no call site.

**Evidence**
- evidence/E09.01-event-taxonomy.md — The published taxonomy
- RAID.md#R-030 — Nothing has ever been measured from a real couple's action: sink is a no-op, emission off in prod, migration unapplied, cron 401

### `E09.02` Define first useful action, recent use, 30-day continuation, product reach, Timeline creation and Timeline sharing.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. First useful action, recent use, 30-day continuation, product reach, Timeline creation and Timeline sharing are each defined precisely enough that two people computing them get the same number, with the event or table each comes from.
2. Every ratio is drawn from invitations Signal issued and redemptions Signal recorded, never from venue bookings, so no definition requires couple-level booking attribution.

**Evidence**
- evidence/E09.02-metric-definitions.md — The definitions, with the ten founder choices separated from the determinations of fact
- RAID.md#R-027 — Two independent reviewers found the suppression floor guards the population, not the count — verified in suppression.ts:33-41

## Your decision

Approve all of the above in one command:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs approve-batch "your approval note" E01.01 E01.02 E01.03 E01.04 E01.05 E01.06 E01.07 E01.08 E01.09 E01.10 E01.11 E01.12 E09.01 E09.02
```

Or push back on any single one:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs reject E01.01 "what is wrong"
```

