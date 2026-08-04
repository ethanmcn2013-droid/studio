# E01 governance assessment — what is genuinely complete and what is not

WP-03, 2026-08-03. Written against the exact words of each task title, because
that is the only definition of done that existed before this session.

**The failure this document exists to prevent:** marking governance done because
a file exists. Four E01 tasks were substantially delivered by the control system
already, and the temptation was to record them as complete and move on. They were
audited against criteria written first, by an agent instructed not to be
generous, and two of the four failed.

**Method.** For each task, derive acceptance criteria from the words of the
title. Every noun in a title is a requirement: E01.05 names eight fields, E01.09
names six categories, E01.12 names six sections. Test each against what actually
exists, with the file, the line or the command output. Then a verdict.

**Baseline at the start of this session:** 0 of 211 tasks carried a single
acceptance criterion. 0 carried a single piece of evidence. 1 had a task
specification. The claim that E01.05, E01.08, E01.09 and E01.12 were
"substantially delivered" was made entirely outside the control system, and the
control system corroborated it nowhere.

---

## Verdicts

| Task | Verdict | The short reason |
|---|---|---|
| E01.01 | **Built and verified** | Written, then adversarially fact-checked. 14 of 95 claims were wrong. All fixed |
| E01.02 | **Complete with a named gap** | Enforced by structure and prose; one test, not a hard constraint |
| E01.03 | **Complete** | Two milestones, ratified meaning, now actually rendered |
| E01.04 | **Complete but for one criterion** | Criterion 5 depends on E02.08, which does not exist yet |
| E01.05 | **Was not complete. Now built** | Two of eight named fields did not exist |
| E01.06 | **Complete, one judgement to confirm** | Two ratified lane changes had never reached state |
| E01.07 | **Was barely started. Now built** | 20 edges across 4 tasks became 134 across 52 |
| E01.08 | **Complete with named gaps** | The log is sound. It has no domain field, and nothing validates it |
| E01.09 | **Was not complete. Now complete with named gaps** | The launch category was empty |
| E01.10 | **Built, conditional on CR-002** | Five gates were headlines. Two epics are still ungated |
| E01.11 | **Was a note. Now operative** | The dates existed in one task note and no report |
| E01.12 | **Built, never yet run** | `status weekly` was a bare alias for `status overall` |

**Nothing here is Done.** Every task is at Founder Review. Twelve tasks, 90
acceptance criteria, 12 specifications, one verification run.

---

## E01.01 — the source-of-truth brief

**Built and verified.** `BRIEF.md` covers all five subjects the title names.

What makes this more than a document existing: it was checked by an adversarial
agent against primary sources, claim by claim. **95 claims checked, 14 wrong or
materially misleading.** Among them: it asserted it outranked `PROJECT.md`, which
would have installed a summary above the charter in the source-of-truth order; it
wrote "VAT inclusive" where D-021 ratified "inclusive of VAT at the prevailing
rate", which is the wording that discloses a future rate rise; it dropped D-009's
scope limiter from the price lock; it assigned both films wholly to the motion
lane, contradicting D-015 Q6; and it omitted every critical open risk while
claiming to state what was open.

All fourteen are fixed in v1.1 and a second adversarial pass was run against the
corrected version.

**The finding that matters most, and it is about the brief's own nature.**
Version 1.1 was accurate for roughly an hour. Two live product defects it listed
as open — R-015, the mint refusing the ratified access term, and R-016,
"unlimited" being unrepresentable — **were fixed in code by the parallel WP-01
session while this brief was being written.** I caught it by re-reading
`entitlements-db/codes.ts` and `venue-allotment.ts` rather than trusting my own
page, and corrected to version 1.2.

That is the exact failure this task exists to prevent, occurring inside the
session that built the prevention. The lesson is not "check harder": it is that a
source-of-truth page **needs a stated volatility boundary**. Version 1.2 now
carries one. The offer, the product model, the geography, the films and the dates
are stable and change only through decisions. **"What is open" is volatile and
must be checked against the code before it is quoted.**

Note also that `RAID.md`'s R-015 and R-016 entries still describe the pre-fix
state. Those belong to WP-01 and reconciling them is that session's close, not
mine: two lanes editing the same register entry is how a register stops being
trustworthy.

**Honest note on scope.** The title says one page. The retired *positions* are in
the brief, which is what a brief is for. The file-by-file list of surfaces still
carrying them runs to about thirty paths and lives in
`E01.01-superseded-ledger.md`. Splitting them was a judgement: a thirty-row
remediation checklist inside a one-page brief would have destroyed the thing the
task asked for.

## E01.02 — the primary objective

**Complete with a named gap.**

Passes: the objective is stated as 25 signed and paid in `PROJECT.md` §2, §4 and
§22 and in `BRIEF.md`. `invitationsIssued`, `signedAgreements`, `paidAgreements`,
`configuredVenueAccounts` and `onboardedVenues` are five separate counters.
`REPORTING.md` §5 defines each stage strictly. Paid and onboarded render as the
outcome rows in both the status report and the new weekly review.

**The gap, stated plainly:** the separation is enforced by report *structure* and
by prose. One test now asserts the weekly review says the two are never summed.
**No test prevents a future code path from summing them.** The guard is that no
such path exists today, not that one could not be written.

## E01.03 — release milestone versus project closure

**Complete.** M5 (2026-09-01) and M6 (undated, outcome-driven) are separate with
separate exit criteria. D-015 Q1 ratifies what release means. D-007 records that
this release date is the same date as the company launch gate. No report blends
them.

One thing changed here: **the milestones were in state and rendered nowhere.**
`STATUS.md` now has a Milestones section, so the separation is visible rather
than merely true.

## E01.04 — scope lock and exclusions

**Complete but for one criterion.**

The audit found `PROJECT.md` §10 listing four exclusions when D-008 ratified
five. The fifth, no bespoke development for any individual founding venue, was
missing from the charter for a day. D-018's no-physical-letters exclusion was
also absent. Both are now in §10.

While fixing it, the charter turned out to contradict ratified decisions in three
more places, all now corrected in revision 1.1:

| Was | Now |
|---|---|
| "baseline **Draft, unapproved**" | Approved 0.1.0, 2026-08-02, D-019 |
| "**This offer is not yet ratified**… Ratification is E02.01, and until that lands, D-002 records the conflict" | Ratified by D-009. The conflict was D-003, not D-002 |
| Prices with no VAT position; geography "boundary to be defined in E10.01" | VAT-inclusive per D-021; the 45-minute ring per D-012 |
| Legal gate described as including "Irish review" | No solicitor, no accountant, per D-016 and CR-001 |

**That is the same disease as I-002, in the governance layer.** A session reading
§5 yesterday would have concluded the price was unratified.

**Criterion 5 is not met.** It requires the no-bespoke-development boundary to
appear in the Founding Venue Benefits Charter as a benefit rather than a later
refusal. E02.08 has not been written. This cannot be closed from inside E01.

## E01.05 — the project board

**Was not complete. Now built.**

The title names eight fields. Six existed: epic (as the section heading), task ID,
priority, status, owner (`executor`), dependency. Two did not.

- **Acceptance evidence** was not a board column at all. The nearest were `Spec` and `Sign-off`. The underlying field existed and was empty on all 211 tasks.
- **Target date** did not exist in any form. All 29 task fields were retrospective. The only `targetDate` in the schema was on milestones, null on five of six.

Both are built. The board now carries `Target` and `Evidence` columns and a test
asserts all eight fields are present.

**The tension worth naming.** `REPORTING.md` §8 explicitly refuses per-task
forecast completion dates, and the task title requires a target-date field. Both
survive because the field is **stated, never computed**: a date arrives only when
someone sets it with a reason, and `validate` refuses a date whose basis is
empty. If you would rather this project carried no per-task target dates at all,
the honest route is a change request against the title, not a field left empty.

## E01.06 — accountable owners

**Complete, with one judgement to confirm.**

All 15 epics carry an owner. All 211 tasks carry an executor and an approver. No
task is `unassigned`. Founder approval is enforced in code, not convention:
`transition` refuses `done`, `approve` refuses without criteria, evidence and
founder-review status, and tests assert both.

**Two ratified lane changes had never reached state:**

- **D-015 Q6** names E13.04, E13.15 and E13.16 as Claude Code's, "engineering wearing a film costume". All three were still `codex_motion`. Fixed — the decision named the task IDs, so there was nothing to interpret.
- **D-008 point 2** moved E11 drafting to Claude Code with execution staying with Ethan. All 15 E11 tasks were still `founder`.

**The judgement, flagged rather than buried.** D-008 does not say which E11 tasks
are drafting. Twelve were moved to Claude Code. **E11.04** stays with you because
setting DNS records is operator work, and **E11.15**, running a weekly conversion
review, is execution rather than drafting. E11.06 is deferred. Push back if you
would split it differently.

## E01.07 — the dependency map

**Was barely started. Now built.**

Before: 20 edges across 4 tasks, in a 211-task programme. After: **134 edges
across 52 tasks**, each carrying a written basis, verified acyclic.
`DEPENDENCY_MAP.md` traces the five named paths.

**The material finding, which nearly caused real damage.** A dependency was
satisfied only when its predecessor reached Done. Done requires founder approval.
D-024 batches approval to the end of a work package. **Wiring the real graph
under those semantics would have made 52 tasks unstartable and deadlocked every
parallel package behind one person's queue.** Satisfaction now moves to Founder
Review, where a task has criteria, evidence and passed verification and only the
signature is outstanding.

The cost is stated rather than hidden: a rejection can cause rework downstream.
`task <ID>` prints satisfied-but-unapproved predecessors and starting against one
writes a note naming them.

**What the map says, and it is not comfortable.** Four of the five critical paths
are the same underlying risk with different names. Product, capture and film
share a root and a convergence; outreach shares the product requirement through
E15. Only legal is separable. **Capture freeze on 2026-08-22 is the tightest date
in the programme** — it needs E04 to E09 substantially built and approved in
nineteen days, and `BASELINE_REVIEW.md` §9 found no candidate implementation for
E05 or E06 at all.

## E01.08 — the decision log

**Complete with named gaps.**

`DECISIONS.md` is append-only, 24 entries, each carrying date, status,
decision-maker, affects, decision and rationale. Supersession chains are used
correctly. An index by domain now exists.

**Gap 1 — domain counts, including a zero.** Commercial 4, legal 4, product 1
primary, film 1, **design 0**. A log recording every *ratified* decision is right
to hold zero design entries if none have been ratified, so this is a gap in the
programme rather than in the ledger. It is recorded as **I-009** because UI freeze
is 2026-08-20 and film lock 2026-08-28.

**Gap 2 — no domain field on entries.** The index is navigation added on top.
"Show me the design decisions" is answerable now, but by a hand-maintained table.

**Gap 3 — four entries still headed "proposed, founder decision required" that
are resolved** (D-003, D-004, D-005, D-006). The log is append-only so the
headers stand; the index maps each to the decision that closed it. Without that,
a session obeying the brief would have found four demands for founder decisions
on price, access term, entitlement and naming, all settled.

**Gap 4 — nothing validates this file.** `project-control.mjs` never reads it.

## E01.09 — the risk and issue register

**Was not complete. Now complete with named gaps.**

The title names six categories. Five were populated. **Launch was empty.**
Searching for launch, go-live, go/no-go, rollback or cutover returned a
dependency, an issue and an email-deliverability risk that merely triggers on
launch day. Nothing covered release-day failure, production cutover, rollback,
first-invitation failure or onboarding load.

Launch exposure was being carried by the six release gates, **and a gate records
the state required to pass, not what could go wrong.** Three risks now exist:
R-023 (release day fails on deployment configuration), R-024 (the first venue
onboarding is improvised), R-025 (all six gates pass with release-blocking work
still in Backlog).

Three issues were opened by the same audit: **I-007** (the entire control root is
untracked in git), **I-008** (two epics sit outside the gate system), **I-009**
(no design decision has ever been ratified).

**Gap 1 — `Type:` is still uncontrolled free text**, 17 distinct strings across 22
risks. That is precisely why launch could go missing unnoticed. The category
index is the controlled vocabulary now, but it is a table, not a constraint.

**Gap 2 — the register's own escalation rule is not exercised.** Its header says a
genuinely blocking entry is also recorded as a task blocker. `status blockers`
returns none while R-015 sits at certain and critical. Defensible, since R-015's
fix is routed into E04.07 scope, but nothing cross-checks the two.

## E01.10 — the six release gates

**Built, and conditional on CR-002.**

The legal gate already carried CR-001's twelve criteria and is untouched. **The
other five carried three one-line headlines each.** "Couple journey, shared
Timeline and Venue Portal complete to the agreed standard" is not an exit
criterion; it is a wish with a checkbox. All five are rewritten: 12, 12, 12, 13
and 12 criteria, each naming the evidence that satisfies it and the task IDs it
maps to.

A test now asserts at least eight criteria per gate, each over 40 characters, so
a gate cannot quietly revert to headlines.

**The structural finding.** Mapping six gates against fifteen epics: **E01 and
E15 are supporting epics of no gate.** The gates certify that the product works
and the sale can be made. **Nothing certifies that what was sold can be
delivered.** Three uncovered exposures were folded into gates that already owned
the relevant epic — the launch-day deploy steps into data criterion 12, the
freeze dates into commercial criterion 12, and A-002's parameterised price
sequence into creative criterion 12. The remaining two need an epic added to a
gate, which is a launch-gate change under `PROJECT.md` §20, so **CR-002** is
raised and not applied.

**Say this plainly: writing exit criteria is not passing a gate.** All six gates
remain `not_started`. Twelve criteria per gate against 29 days is demanding on
purpose. If one cannot be met, the honest outcome is a documented waiver against
a named criterion.

## E01.11 — the six freeze dates

**Was a note. Now operative.**

D-008 set the dates on 2026-08-02. They then lived in one note on one task and in
the decision log, and appeared in no report, no board and no command. A freeze
date nobody can see is a date nobody meets.

They are now first-class records naming their source, each with a sentence saying
what stops changing. They render in `STATUS.md` with days remaining, the weekly
review flags any landing inside seven days, and eleven tasks the freezes
demonstrably gate carry them as target dates.

`freeze` reports and **refuses to move a date**. The guard against a session
quietly rescheduling a freeze is that no command exists to do it.

## E01.12 — the weekly operating review

**Built, and never yet run.**

`status weekly` was `if (scope === "overall" || scope === "weekly")` — a bare
alias. Its output differed from `status overall` by one timestamp line. There was
no template, no record, no procedure in `WORKFLOWS.md`, and no weekly review had
ever been held. Of the six sections the title names, three were entirely absent:
evidence, quality, and the next seven days.

It is now a distinct document with all six sections, a template, and
`WORKFLOWS.md` §12. Tests assert the six sections, the seven-day window,
determinism, and that it is not the status report under another name.

Building it surfaced two defects in the data it reads:

1. **The founder's decision queue was overstated by four.** E01.04, E01.06, E01.11 and E01.12 still carried open questions that D-008 answered on 2026-08-02. An `answered <ID> <D-nnn>` command now closes a question without erasing it: `decisionClass` stays `founder_only`, because that this was your call is history worth keeping.
2. **The seven-day section could not be computed at all**, because no task carried a target date. That is why E01.05 and E01.12 were built together rather than separately.

**The honest caveat: no weekly review has been held.** The mechanism exists and
the cadence is ratified. The first one is Friday 2026-08-07. Section 6 currently
lists no tasks, which is accurate rather than broken: nothing has a target date
inside seven days and the first freeze is twelve days out.

---

## What this session deliberately did not do

- **Did not pass, waive or move any gate.** All six stay `not_started`.
- **Did not change any gate's supporting epics.** That is change control. CR-002 is raised and unapplied.
- **Did not move a freeze date**, and removed the possibility of doing so by command.
- **Did not rewrite any `DECISIONS.md` entry.** The log is append-only. The index is additive.
- **Did not mark anything Done.**
- **Did not fix any surface in the superseded ledger.** That is E02, E12 and WP-10's work. This package's job was to make sure nothing was retired quietly.
- **Did not set target dates beyond the eleven the freezes demonstrably gate.** Guessing the rest would be the fabricated precision the project forbids.
- **Did not commit the control root to git**, though I-007 says it should be. It puts programme state into a repository's history permanently, which is a founder decision.
