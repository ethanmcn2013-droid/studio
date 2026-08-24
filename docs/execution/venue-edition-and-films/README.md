# Venue Edition and Films — project control (VEF-2026)

The operating system for one programme: sell, deliver and prove Venue Edition
to 25 founding Greater Limerick venues, with two films, on a finished product.

This directory is designed so that a Claude Code session that has never seen
this conversation can pick the project up from the files alone.

---

## What this is

| File | Role |
|---|---|
| `PROJECT.md` | The charter. Purpose, offer, scope, governance, gates, completion. Durable. |
| `PROJECT_STATE.json` | **Canonical.** The only place status facts live. |
| `PROJECT_STATE.schema.json` | The structural contract for that file. |
| `BACKLOG.md` | **Generated.** All 211 tasks by epic. |
| `STATUS.md` | **Generated.** The executive status report. |
| `HANDOFF.md` | **Generated** at session close. What the next session reads first. |
| `ROADMAP.md` | Phases, gates, dependencies, critical path, schedule risk. |
| `REPORTING.md` | Exactly what every number in `STATUS.md` means. |
| `DECISIONS.md` | Append-only decision register (D-001…). |
| `RAID.md` | Risks, assumptions, issues, dependencies (R/A/I/DEP-001…). |
| `CHANGELOG.md` | Baseline, scope, title, dependency and commercial changes. |
| `BASELINE_REVIEW.md` | What was imported, inferred, proposed and still needs deciding. |
| `DECISION_DOCKET.md` | Every task classified by how it gets decided, and the 39 questions that are yours, with recommendations. |
| `WORKFLOWS.md` | The procedures: task, sync, approval, change, session. |
| `backlog.source.md` | The verbatim founder-supplied backlog. The import record. |
| `tasks/` | Task specifications, created on demand. |
| `sessions/` | Append-only session records. |
| `evidence/` | Small evidence and evidence indexes. |
| `private/` | Template and handling guidance only. |
| `templates/` | Task, session, founder-review and change-request templates. |
| `tools/` | `project-control.mjs`, its tests, and the one-time importer. |

**Generated files are `BACKLOG.md`, `STATUS.md` and `HANDOFF.md`.** Never edit
status facts in them. Edit `PROJECT_STATE.json` through the tool, then render.

---

## The one command you need

All commands run from the workspace root
(`C:\Users\ethan\signal-studio-workspace`). The tool path is long; every
example below is complete and copy-pasteable.

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs help
```

Zero dependencies, Node 18+, works the same in PowerShell, Git Bash and CI.

---

## Begin a session

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs briefing
```

Or use the skill, which does the same thing plus reads the handoff and flags
stale work:

```
/venue-briefing
```

Then open a working session so the record is captured:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs session open "Draft the E01.01 source-of-truth brief"
```

## Start or resume a task

```
/venue-task E01.01
```

Or by hand:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs task E01.01
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs ready E01.01
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs start E01.01
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs criteria E01.01 "The brief names the current offer, product model, geography, both films and every superseded assumption."
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs evidence E01.01 docs/execution/venue-edition-and-films/tasks/E01.01.md
```

`start` refuses if dependencies are unmet (override with `--waive-deps` only on
an explicit founder waiver) and refuses to exceed three tasks In Progress.

## Sync work completed outside Claude

```
/venue-sync E03.02
```

Claude inspects the artifact, compares it against the acceptance criteria,
records what is done and what remains, adds evidence, and moves the task to the
correct state. It moves it to Founder Review, never Done, unless Ethan approves
in the same instruction.

## Request a status report

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs status
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs status launch
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs status commercial
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs status films
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs status blockers
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs status founder-review
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs status E07
```

Or `/venue-status <scope>`.

## Close a session

```
/venue-close
```

Or:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs session close "What happened and what is unresolved"
```

This validates, writes the append-only record in `sessions/`, regenerates
`STATUS.md`, `BACKLOG.md` and `HANDOFF.md`, and prints the single next action.
It never marks anything Done.

## Founder approval

Approval is Ethan's, expressed explicitly. Claude never runs these on inference.

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs review E01.01
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs approve E01.01 "Approved. The brief matches what I told the venues."
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs reject E01.01 "The geography section is still the old boundary."
```

`approve` refuses when acceptance criteria or evidence are missing, and refuses
any task not sitting in Founder Review. `/venue-approve <ID>` wraps the same
check.

Approving the project baseline:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs baseline approve "Baseline approved with the amendments in BASELINE_REVIEW.md."
```

## Validate and regenerate

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs validate
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs render
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs render --check
node --test studio/docs/execution/venue-edition-and-films/tools/project-control.test.mjs
```

## Verify claimed evidence before a packet reaches you

```bash
node studio/docs/execution/venue-edition-and-films/tools/verify-evidence.mjs --review
node studio/docs/execution/venue-edition-and-films/tools/verify-evidence.mjs E07
```

`validate` enforces that evidence **exists**. It cannot tell whether a
referenced file was ever actually written. A session that records
`evidence: docs/foo.md` and never writes `docs/foo.md` passes validation and
reaches Founder Review looking complete. This closes that gap: it resolves every
path-shaped evidence reference and fails on anything missing or empty.

It is honest about its limits. It **can** tell you a claimed file does not
exist. It **cannot** tell you whether the evidence supports the acceptance
criterion — that judgement stays with the packet and with you. Prose evidence
("pnpm test — 74/74 pass") is reported as unverifiable rather than silently
accepted.

Run it before generating any packet. Exit 1 means something claimed is not real.

> **Never restore `PROJECT_STATE.json` from a copy while sessions are running.**
> Overwriting the file reverts any concurrent session's work, and the lock
> cannot protect against a plain file copy. Do destructive testing in a sandbox
> copy of the whole directory instead.

`validate` exits non-zero on failure. `render --check` fails if a generated
file has drifted or been hand-edited. Run both before closing a session.

## Handle a project change

Any change to price, founding terms, venue count, geography, entitlement,
couple access term, the Keepsake promise, product or film scope, release date,
gates or the completion condition:

```
/venue-change
```

It produces a change record from `templates/CHANGE_REQUEST.md`, assesses
schedule, scope, dependency, commercial and gate impact, and stops for founder
approval before touching the baseline.

---

## Rules that do not bend

1. `PROJECT_STATE.json` is canonical. Generated files are never hand-maintained.
2. No task is Done without explicit founder approval.
3. Imported task IDs and titles are never renumbered or rewritten. Splits get
   child IDs (`E05.05.1`); nothing is deleted.
4. Old business plans, decks and prototypes never override a current decision.
   Conflicts get recorded, not reconciled by guesswork.
5. No credentials, contact data or private couple information in this tree.
6. Only the main session writes project-control files. Subagents report back.
