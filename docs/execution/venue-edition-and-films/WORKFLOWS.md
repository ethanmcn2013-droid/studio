# WORKFLOWS — Venue Edition and Films (VEF-2026)

The procedures. The `/venue-*` skills are thin and point here, so the
procedures survive even if the skills are lost.

Command prefix throughout, run from the workspace root:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs
```

Written below as `PC`.

---

## 1. Task workflow

```
Backlog → Ready → In Progress → Internal Review → Founder Review → Done
                     ↕                ↕                ↕
                            Blocked / Deferred / Cancelled
```

**What Claude may do.** Move a task into Ready, In Progress, Internal Review or
Blocked when evidence supports it. Prepare a task for Founder Review.

**What Claude may never do.** Infer founder approval. Move a task to Done. Read
"looks finished" as "approved". The tool enforces this: `transition` refuses
`done`, and `approve` refuses anything not in Founder Review.

**Done requires all four:** agreed acceptance criteria, recorded evidence,
required verification passed, explicit founder approval. "The code exists", "the
document was written" and "tests passed" are none of these on their own.

**Blocked.** Record the blocker, the date, the blocking task or decision or
external dependency, and the best unblocked next action. `PC block <ID>
"reason" [--by=<id>]` does all four and prints the next actions.

**Deferred and cancelled.** Never deleted. History is preserved. They leave the
active denominator but stay in the register.

**Splits.** Keep the parent. Children take stable child IDs: `E05.05.1`,
`E05.05.2`. The imported master backlog is never renumbered. Log the split in
`CHANGELOG.md`.

**New scope.** Enters through a change request only. See §5.

**Reopening.** `PC reopen <ID> "reason"` requires a reason, logs the transition,
clears the sign-off and writes a `CHANGELOG.md` entry.

**WIP.** One primary focus task. No more than three In Progress. Exceeding it is
a validation error, not a warning; an exception must be recorded in
`wip.exceptions` with a reason. A batch of tightly related tasks may be executed
together when Ethan approves the batch, but each task keeps its own acceptance
criteria, evidence and sign-off.

---

## 2. Task-specification workflow

When Ethan asks to begin a task or a batch:

1. **Read the record.** `PROJECT.md`, `PROJECT_STATE.json` (via `PC task <ID>`),
   `STATUS.md`, `HANDOFF.md`, the relevant `DECISIONS.md` entries and the
   relevant `RAID.md` entries.
2. **Validate.** `PC validate`.
3. **Check dependencies.** `PC task <ID>` prints unmet dependencies and what the
   task blocks. Confirm they are complete, or that Ethan has explicitly waived
   them. A waiver is recorded, never assumed.
4. **Write the specification** into `tasks/<ID>.md` from `templates/TASK.md`,
   then `PC spec <ID> tasks/<ID>.md`.
5. The specification must contain: task ID and title; objective; business
   reason; intended outcome; deliverables; scope; non-goals; dependencies;
   inputs; implementation approach; acceptance criteria; validation plan;
   evidence required; risks; decisions required; founder sign-off section.
6. **Do not add scope while elaborating.** If the task obviously needs more than
   its title implies, that is a change request, not a bigger task.
7. **Present the plan before decision-heavy or high-impact work.** Anything
   touching price, legal language, privacy boundaries, production data, public
   surfaces or either film goes to Ethan as a plan first.
8. **Record the criteria and estimate:** `PC criteria <ID> "…"` (repeat),
   `PC estimate <ID> <points>`.
9. **Execute the approved scope.**
10. **Verify.** Run the checks the validation plan names. Capture output.
11. **Record evidence:** `PC evidence <ID> <path-or-url> "what it proves"`.
12. **Move to Founder Review, not Done:** `PC review <ID>`. It refuses if
    criteria or evidence are missing and prints the founder-review packet.

---

## 3. Work completed outside Claude

For anything Ethan or an external specialist did by hand.

1. Ask for, or inspect, the actual result or evidence. Do not proceed on a
   description of it.
2. Do not assume it satisfies the task.
3. Compare it against the task's acceptance criteria, line by line. If the task
   has no criteria yet, write them first and confirm them with Ethan.
4. Record what was completed and what remains, in the task notes.
5. Add evidence references: `PC evidence <ID> <ref> "note"`.
6. Move the task to the correct state — which may be In Progress if it is
   partial, not automatically Founder Review.
7. If complete, `PC review <ID>`. Move to Done only if Ethan explicitly approves
   in the same instruction.
8. External legal or accounting advice is recorded as **evidence and a decision
   input**, never as an invented conclusion. Never state that legal approved
   something when only a draft or internal review exists.

---

## 4. Founder approval

Approval is Ethan's, expressed explicitly. There is no implicit path.

```bash
PC review E01.01                                      # prepare the packet
PC approve E01.01 "Approved. Reason."                 # founder only
PC reject  E01.01 "What is wrong."                    # founder only
```

`approve` refuses when: the task is not in Founder Review; acceptance criteria
are missing; evidence is missing; or no approval note is given. It records the
note and date, sets Done, regenerates every report and logs the event.

Baseline approval is the same shape: `PC baseline approve "note"`.

Gate approval: `PC gate <id> passed "basis"` or `PC gate <id> waived "explicit
founder waiver"`. A waiver without a note is refused.

---

## 5. Change control

Required for any change to: price · founding-rate terms · number of founding
venues · geographic boundary · entitlement model · couple access term ·
Keepsake promise · product scope · film scope · release date · launch gate ·
project completion condition.

1. Copy `templates/CHANGE_REQUEST.md` to `evidence/change-requests/CR-NNN.md`.
2. Fill in: requested change; reason; affected tasks; affected dependencies;
   affected copy or contracts; affected film or product assets; schedule impact;
   commercial impact; risk impact; recommendation.
3. Present it to Ethan. Stop there.
4. On approval: add a `DECISIONS.md` entry, append to `CHANGELOG.md`, then make
   the state changes.
5. The baseline is never silently edited.

---

## 6. Session workflow

**Open.**

```bash
PC briefing
PC session open "objective" --id=<claude-session-id>
```

Read `HANDOFF.md` first. The briefing flags stale In Progress tasks (started
more than seven days ago) and prints the recommended next three actions. Opening
a session has no other side effects.

**During.** Keep to one focus task (`PC focus <ID>`). Record evidence as it is
produced, not at the end. Never hand-edit `BACKLOG.md`, `STATUS.md` or
`HANDOFF.md`.

**Close.**

```bash
PC validate
PC session close "what happened and what is unresolved"
```

This writes the append-only record in `sessions/YYYY-MM-DD--<id>.md`,
regenerates `STATUS.md`, `BACKLOG.md` and `HANDOFF.md`, and prints one
unambiguous next action. It never marks anything Done.

The session record captures: objective, tasks touched, decisions made, changes
completed, verification, evidence created, blockers found, status changes,
founder review required, next action. Closed sessions are never rewritten.

---

## 7. Subagent rules

Subagents may be used for repository exploration, dependency analysis, code
review, research, test analysis, design or copy review, and independent QA.

They must not write `PROJECT_STATE.json`, `DECISIONS.md`, `RAID.md`,
`HANDOFF.md` or any session log. Two agents never mutate the same
project-control file. Subagents return findings; the main session reconciles and
writes.

---

## 8. Handling conflicting sources

Order of authority: explicit founder decisions in current approved documents →
latest approved `DECISIONS.md` entry → `PROJECT.md` → approved task specs →
`PROJECT_STATE.json` → repository implementation and verified evidence →
historical plans, decks, prototypes and archives.

When sources conflict: **do not silently reconcile, and do not guess which was
intended.** Record the conflict as a `proposed` decision in `DECISIONS.md` with
both positions quoted and sourced, identify the downstream impact, and put it to
Ethan only when a decision is genuinely required. D-003 to D-006 are the worked
examples.

---

## 9. Data handling

- No credentials, tokens or secrets in this tree, ever.
- No private couple information.
- No personal recipient data in generated reports. The commercial tracker is
  counts only, and `validate` fails if an email address appears in it.
- Venue names are not published as participants without approval.
- Signal HQ and the CRM are the source of truth for venue contacts. Reference
  stable account IDs; do not duplicate contact records here.
- `private/venues.csv` and anything else in `private/` except the README and the
  template are gitignored.
- Never mark a privacy, security, contract or accounting task complete without
  the required evidence.

---

## 10. The skills, and why they are thin

Seven project-level skills live at
`C:\Users\ethan\signal-studio-workspace\.claude\skills\venue-*\SKILL.md`:

| Skill | Purpose | Side effects |
|---|---|---|
| `/venue-briefing` | Open or resume a session | none |
| `/venue-status` | Report from canonical state | none |
| `/venue-task <ID>` | Inspect, plan, start or resume a task | state changes |
| `/venue-sync <ID>` | Reconcile work done outside Claude | state changes |
| `/venue-close` | Close a session | state changes |
| `/venue-approve <ID>` | Founder sign-off | **user-invoked only** |
| `/venue-change` | Formal change request | none until approved |

**Known limitation.** The workspace root is not a git repository, so
`.claude/skills/` is not version-controlled, and `studio/.gitignore` ignores
`.claude/` inside this repo. The skills are therefore deliberately thin: each is
roughly thirty lines that validate arguments and point back at this file and at
`project-control.mjs`. If they are lost, nothing procedural is lost with them —
this file and `README.md` hold the full procedures, and the skills can be
rewritten from §1–§9 in minutes.

Never operate this project *only* through the skills. Every skill's real work is
a documented command, and the commands are the contract.

## 11. Work packages and the recommendation packet (D-024)

A session running a work package from `WORK_PACKAGES.md` runs it to completion
and returns **one consolidated recommendation packet**, not a founder review per
task. Thirteen separate reviews for one package is the founder-capacity problem
(R-006) wearing a process costume.

The session works autonomously: research, ideation, labs, panels, subagents,
drafting, engineering, verification. It resolves its own blockers rather than
escalating them. Where a design direction is genuinely open it runs `/lab`,
picks nothing, and brings the options into the packet.

The packet states: what was done · what was verified and how, with real output ·
the recommendations with a stated preference on each · anything needing a founder
decision · anything deliberately not done. Every item answerable with **approve**
or **push back**.

### Generating the packet

The packet is generated from canonical state, not hand-written, so every package
comes back in the same shape:

```bash
PC packet E04                 # one package
PC packet --review            # everything currently awaiting founder review
PC packet E04 --write         # saves to evidence/packets/
```

It separates approvable tasks from blocked ones, says exactly why each blocked
task is blocked, and prints the one command that approves the lot:

```bash
PC approve-batch "your approval note" E04.01 E04.02 ...
PC approve-batch "your approval note" --review
```

`approve-batch` is **founder-only**. It refuses the entire batch if any task
lacks criteria, evidence, or founder_review status — so a partial approval can
never happen by accident. `--partial` approves only the eligible ones, and says
which it skipped. Each task still gets its own recorded sign-off, date and
history entry; the shared note is the founder's words, recorded against all of
them.

Unchanged: every task keeps its own acceptance criteria, evidence and sign-off
state; **no task reaches Done without explicit founder approval**; anything on
the change-control list stops the session BEFORE it is actioned; irreversible or
externally visible actions stop.

**Before launching a wave, map the FILES each package writes, not just the epics
it owns.** Epic boundaries do not follow file boundaries: Wave 1 shipped with
WP-01 and WP-10 both told to edit `studio/src/lib/venue-edition.ts`, because one
owned the access-term constant and the other owned the price constant in the same
module. Source files have no lock, so concurrent edits lose work silently. One
package owns a file for the duration of a wave; the others hand it their change
and record it in their packet.

Parallel sessions need a `wip.exceptions` entry covering the wave. It relaxes the
concurrency cap and nothing else. `project-control.mjs` takes a cross-session
lock, so concurrent state writes queue rather than clobber.

## 12. The weekly operating review (E01.12)

**Friday morning, folded into the existing Friday brief.** D-008 clause 4 chose
that deliberately over a new ritual: the founder is the constraint, and a
separate meeting spends the thing that is scarce.

```bash
PC status weekly
```

That is a different document from `status overall`. `overall` says where the
project is. **The weekly review says what needs a decision this week.** It
carries the six sections E01.12 names, in this order:

1. **Blockers** — blocked tasks, and anything In Progress for more than seven days.
2. **Decisions** — what is awaiting approval, and every open question only Ethan can answer. A question a decision already closed does not appear: run `answered <ID> <D-nnn>` when that happens.
3. **Evidence** — how much of the active backlog carries acceptance criteria, evidence and a specification, plus everything recorded in the last seven days. **A task in flight with no acceptance criteria has no agreed definition of done.** That is the number to watch.
4. **Quality** — In Progress without criteria, Founder Review without evidence, gates with thin exit criteria, unestimated work. Plus the standing reminder that `DECISIONS.md` and `RAID.md` are validated by nothing.
5. **Pipeline** — the Founding 25 tracker. Paid and onboarted are the two bold rows; invitations issued is activity and is never summed with them.
6. **The next seven days** — freezes landing inside the window, every task with a target date on or before it, overdue ones marked, and the highest-value unblocked actions.

**Procedure.** Run the command. Copy `templates/WEEKLY_REVIEW.md` to
`sessions/weekly/<YYYY-MM-DD>-review.md`, paste the generated output unedited,
and add only judgement: what the numbers do not say, what was decided, and the
three things that change next week.

**The review changes no state.** It is a read. A decision taken in it exists only
once it is recorded with `approve`, `approve-batch`, `gate`, `target` or a change
request. Discussing something is not recording it.

**Target dates.** `target <ID> <YYYY-MM-DD> "basis"` is the only way a task
appears in section 6. A basis is mandatory, and no date is ever computed:
`REPORTING.md` §8 refuses forecast completion dates and this does not create one.
An empty section 6 means nothing was committed to this week, which is a finding
in itself.

---

## 13. Relationship to the wider Signal Studio contract

This project sits inside the workspace operating contract (`AGENTS.md`) and the
Signal Studio HQ rules (`studio/CLAUDE.md`). Those still apply:

- Founder- or operator-gated work also gets an operator-todo in
  `studio/content/hq/operator-todos/<id>.md`. This project's founder-review queue
  does not replace that ledger for account provisioning, API keys, production env
  vars, legal publication or cost limits.
- Released, operator-visible movement gets a dispatch entry in the owning repo's
  `CHANGELOG.md` in the house shape. This project's own `CHANGELOG.md` is the
  project's baseline and scope log, not a substitute for the dispatch.
- Strategic HQ content changes go to the HQ source files, not to the rendered
  dashboard.
- Motion work belongs to Codex in `signal-motion`. Do not rewrite the other
  lane's in-flight work.
