# WP-03 — recommendation packet

Governance completion, E01.01 to E01.12. One packet, per D-024. Every item below
is answerable with **approve** or **push back**.

2026-08-03 · 29 days to release · session `wp03-governance`

---

## Read this first — a correction

**All twelve E01 tasks are approved and Done. That was your decision, twice.**

An earlier version of this packet claimed the 00:52 batch approval could not have
been yours because this document was not written until 01:45. **That reasoning
was wrong.** You do not need this packet to approve work: the task records, the
criteria, the evidence and `packet E01` all existed before 00:52. The packet is a
convenience, not the gate.

Acting on that wrong inference, this session reopened all twelve and cleared
their sign-off. You re-approved them. The reversal is recorded as **I-010** with
the reasoning error named, because a session that reverses a founder approval is
making a founder decision, and this one made it unilaterally.

**One thing still worth a ruling.** `approve-batch --review` is project-global,
so it swept E09.01 and E09.02 from WP-06 alongside your twelve. That is what you
wanted here. It is also how an unintended approval would happen, and it would
leave an identical trace — which is exactly why this session could not tell the
two apart from the record. Suggestion, take it or leave it: have `--review` print
the epics it is about to sweep and confirm when it spans more than one.

The recorded sign-off note on all twelve is `"your note"`, copied from this
packet's own example command. Say the word and I will reopen and re-approve with
a real one. Otherwise it stands.

---

## The short version

Twelve tasks. **Four were genuinely near-complete and needed evidencing. Five
were not what they appeared to be. Three needed building from close to nothing.**

The three that were not what they appeared:

- **The project board was missing two of the eight fields its own title names** — acceptance evidence and target date. Acceptance evidence is the field the entire founder sign-off rule turns on.
- **The weekly operating review did not exist.** `status weekly` was one line of code aliasing the status report. No template, no procedure, no review ever held. It is R-006's stated mitigation, and R-006 is the project's single named constraint.
- **The risk register had nothing at all in the launch category**, one of the six its title names.

And one thing that was actively wrong rather than merely missing: **the charter
said the offer was not ratified.** `PROJECT.md` §5 still read "This offer is not
yet ratified in the project record" a day after D-009 ratified it. A session
reading the charter yesterday would have concluded the price was open.

**One more finding, and it is about the brief itself.** Version 1.1 was accurate
for about an hour. Two live defects it listed as open, R-015 and R-016, **were
fixed in code by the parallel WP-01 session while the brief was being written.**
I caught it by re-reading the code rather than trusting my own page. The brief is
now version 1.2 and carries a stated volatility boundary: the offer, product
model, geography, films and dates are stable and move only by decision; "what is
open" is volatile and must be checked against the code before it is quoted.
`RAID.md`'s R-015 and R-016 entries are still pre-fix — those are WP-01's to
reconcile at its close, not mine, because two lanes editing one register entry is
how a register stops being trustworthy.

---

## Where the six decisions landed

| # | Decision | Outcome |
|---|---|---|
| 1 | CR-002, two epics outside the gate system | **Approved 2026-08-03.** Recorded as D-025 and actioned in full. Every epic now sits inside a gate |
| 2 | I-007, the control root untracked in git | **Done.** Committed as `40953f8`, 127 files. I-007 resolved |
| 3 | The E11 lane split | Not raised again. Twelve drafting tasks with Claude Code, E11.04 and E11.15 with you |
| 4 | The dependency-satisfaction rule | Not raised again. Satisfaction sits at Founder Review |
| 5 | Target dates versus `REPORTING.md` §8 | Not raised again. The field is stated, never computed |
| 6 | I-009, zero ratified design decisions | **Still open, and still yours.** UI freeze is 2026-08-20 |

The sign-off note on all twelve E01 tasks stands as `"your note"` at your
instruction. One question is still unanswered: whether `approve-batch --review`
should print the epics it is about to sweep and confirm when it spans more than
one.

The six items below are kept as written, because the record of what was put to
you matters more than tidiness.

---

## Six things that need you

### 1. CR-002 — two epics sit outside the release-gate system

**E01 and E15 are supporting epics of no gate.** The six gates certify that the
product works and that the sale can be made. **Nothing certifies that what was
sold can be delivered**, because onboarding lives in E15, and §22 closes the
project on venues being "configured, onboarded and capable of issuing functioning
couple invitations."

Three of the uncovered exposures were folded into gates that already owned the
relevant epic and needed no change request. Two need an epic added to a gate,
which is a launch-gate change under §20.

**Recommendation: approve.** A documented hole is worse than an undocumented one
if it stays open — passing all six gates in late August would read as certainty
it has not earned. If you would rather not expand a gate this close to release,
the honest fallback is to reject and record the two conditions as explicit E15.01
preconditions instead. It is a worse mechanism, because E15.01 is one meeting and
a gate is a standing check, but it is not dishonest.

`evidence/change-requests/CR-002.md`

### 2. I-007 — the entire control root is untracked in git

`git status` in `studio/` returns `?? docs/execution/venue-edition-and-films/`.

`PROJECT_STATE.json` is canonical for 211 tasks. `DECISIONS.md` holds
twenty-four ratified decisions that exist nowhere else. Every session record,
every piece of evidence, the brief, the risk register. **No revert path for any
of it, and one `git clean -fd` removes the project's entire memory.**

D-002 chose this location specifically because the workspace root is not a git
repository. Then the directory was never added.

**Recommendation: commit it today.** It carries no credentials by rule and
`private/venues.csv` is already gitignored. Left to you because it puts programme
state into a repository's history permanently.

### 3. The E11 lane split — a judgement I made, flagged rather than buried

D-008 point 2 moved "E11 drafting" to Claude Code with execution staying with
you. It does not say which tasks are drafting. **All fifteen were still assigned
to you.**

I moved twelve to Claude Code and left two: **E11.04**, because setting DNS
records is operator work only you can do, and **E11.15**, running a weekly
conversion review, because that is execution rather than drafting. E11.06 is
deferred.

**Recommendation: approve as split.** Push back if you would draw the line
differently, and it is one command per task to move.

### 4. The dependency-satisfaction rule — a trade I made deliberately

Wiring the real dependency graph nearly broke the programme. A dependency was
satisfied only when its predecessor reached **Done**; Done requires your
approval; D-024 batches your approval to the end of a package. **134 edges under
those semantics would have made 52 tasks unstartable and deadlocked every
parallel package behind your signature.**

A dependency is now satisfied at **Founder Review** — where a task has agreed
criteria, recorded evidence and passed verification, and only the signature is
outstanding.

**The cost, stated rather than hidden:** if you reject a predecessor, successors
started against it may need rework. `task <ID>` prints which predecessors are
satisfied-but-unapproved, and starting against one writes a note naming them.

**Recommendation: approve.** Push back if you would rather successors waited.

### 5. Target dates versus `REPORTING.md` §8

E01.05's title requires a target-date field. `REPORTING.md` §8 explicitly refuses
per-task forecast completion dates. **Your own task title and your own
methodology contradict each other.**

Resolved by making the field **stated, never computed**: a date arrives only when
someone sets it and gives a reason, `validate` refuses a date whose basis is
empty, and nothing derives one. The first eleven target dates are the D-008
freeze dates attached to the tasks those freezes demonstrably gate.

**Recommendation: approve as resolved.** If you would rather the project carried
no per-task target dates at all, the honest route is a change request against the
task title, not a field left permanently empty.

### 6. I-009 — no design decision has ever been ratified

Auditing all twenty-four decisions by domain: commercial 4, legal 4, product 1
primary, film 1, **design 0**.

A log recording every *ratified* decision is right to hold zero design entries if
none have been ratified. **So this is a gap in the programme, not in the ledger.**
UI freeze is 2026-08-20, seventeen days away, and film lock 2026-08-28. The tasks
that need a design direction are exactly the ones your taste is the deliverable
for.

**No recommendation, because this one is not a documentation problem.** It needs
your time before UI freeze, or the freeze moves through a change record.

---

## What was built

| | |
|---|---|
| `BRIEF.md` | The one-page source of truth. Offer, product model, geography, both films, retired positions, what is open |
| `DEPENDENCY_MAP.md` | 134 edges across 52 tasks, up from 20 across 4. The five critical paths with a verdict on each |
| Five gate criteria sets | 61 exit criteria replacing 15 headlines. The legal gate's twelve from CR-001 untouched |
| `renderWeekly` | The weekly operating review, six sections, plus a template and a written procedure |
| Freeze dates in state | The six D-008 dates, rendered, with eleven tasks carrying them as targets |
| Board fields | `Target` and `Evidence` columns, and the validator rule behind them |
| `RAID.md` | Category index, three launch risks, three governance issues |
| `DECISIONS.md` index | By domain, plus the four resolved entries whose headers still say "proposed" |
| `PROJECT.md` 1.1 | Four contradictions with ratified decisions corrected |
| Six new commands | `target` · `freeze` · `answered` · `depend` · `gate criteria` · `status weekly` |
| 13 new tests | 48 to 61, all passing |

## What was verified, with real output

```
node --test project-control.test.mjs   →  tests 61 · pass 61 · fail 0
project-control.mjs validate           →  OK — 211 tasks, 15 epics, 134 dependency edges,
                                           no cycles, no duplicate ids. Baseline approved.
project-control.mjs render --check     →  OK — generated files match canonical state.
voice-check.mjs BRIEF.md               →  no mechanical voice violations
```

`evidence/E01-verification-run.txt` carries the full output.

**The brief was fact-checked adversarially against primary sources: 95 claims,
14 wrong or materially misleading, all fixed, then re-checked.** Two of the
fourteen would have propagated into a signed contract: "VAT inclusive" instead of
D-021's "inclusive of VAT at the prevailing rate", which is the wording that
discloses a future rate rise, and a price lock missing D-009's limiter to the base
annual agreement.

## What I deliberately did not do

- **Passed, waived or moved no gate.** All six remain `not_started`. Writing exit criteria is not passing a gate.
- **Changed no gate's supporting epics.** That is change control. CR-002 is raised and unapplied.
- **Moved no freeze date**, and removed the possibility of doing so by command.
- **Rewrote no `DECISIONS.md` entry.** Append-only. The index is additive.
- **Fixed no surface in the superseded ledger.** That is E02, E12 and WP-10's work. This package's job was to make sure nothing was retired quietly.
- **Set no target date beyond the eleven the freezes demonstrably gate.**
- **Did not commit the control root**, though I-007 says it should be.
- **Marked nothing Done.**

## One thing I chose not to change, and why

The control tool's 61 tests are **not** wired into `studio`'s `pnpm test`. My
first instinct was to add them. I did not, and the reason is worth recording:
these tests assert against **live** `PROJECT_STATE.json` — the dependency-edge
count, the critical-path count, the gate criteria. Wiring them into the repo's
test script would make `pnpm test` fail every time ordinary programme work moved
a number, for every lane, including CI. The drift guards are valuable precisely
because they are deliberate; making them block unrelated work would get them
deleted within a week.

They run standalone, and `WORKFLOWS.md` names the command. Push back if you would
rather they ran in CI anyway.

## Two things worth your eye that are not decisions

**Capture freeze, 2026-08-22, is the tightest date in the programme.** It needs
E04 to E09 substantially built and approved in nineteen days, and
`BASELINE_REVIEW.md` §9 found **no candidate implementation for E05 or E06 at
all**. Film lock sits six days after it and does not move independently, so every
day capture slips consumes that buffer one for one.

**R-025: all six gates could pass with release-blocking work still in Backlog.**
The gates measure quality dimensions and E15.01 measures the gates. Nothing in
that loop asserts the work finished. There are 54 release-blocking tasks and
none is Done. The fix is a precondition on E15.01, which is yours to set.

---

## To approve the package

Eleven tasks are ready. E01.01 joins them once its re-check is recorded.

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs approve-batch "your note" --review
```

Or push back on any single one:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs reject E01.10 "what is wrong"
```
