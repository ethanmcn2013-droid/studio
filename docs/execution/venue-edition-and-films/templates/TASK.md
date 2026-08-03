# <TASK_ID> — <exact task title from BACKLOG.md>

> Copy to `tasks/<TASK_ID>.md`, then run
> `node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs spec <TASK_ID> tasks/<TASK_ID>.md`.
>
> The title must match `BACKLOG.md` character for character. If the title is
> wrong, that is a change request, not an edit.

**Task ID:** <TASK_ID>
**Epic:** <E__ — epic title>
**Status:** <from BACKLOG.md>
**Executor:** <claude_code | codex_motion | founder | external>
**Approver:** Ethan McNamara
**Spec written:** <YYYY-MM-DD>

---

## Objective

One sentence. What this task produces.

## Business reason

Why this matters to 25 signed, paid and onboarded founding venues. If it does
not connect, question whether the task belongs in this project.

## Intended outcome

What is true after this is done that is not true now.

## Deliverables

- [ ] …

## Scope

What is inside this task.

## Non-goals

What is deliberately not in this task. Be specific — this is the guard against
scope creep during elaboration.

## Dependencies

| Dependency | State | Waived? |
|---|---|---|
| <ID or external> | <done / open> | <no / founder waiver + date> |

## Inputs

Existing material to read first: repository paths, decisions, RAID entries,
prior artifacts. Say plainly which are candidate evidence and which are
superseded.

## Implementation approach

How this will be done. For decision-heavy or high-impact work, this section is
presented to Ethan before execution.

## Acceptance criteria

Testable. Each one becomes a `criteria` entry in project state.

1. …
2. …

## Validation plan

The exact checks to run and what passing looks like.

## Evidence required

What will be recorded as proof, and where it lives.

- …

## Risks

New or amplified risks. Cross-reference `RAID.md` IDs where they exist.

## Decisions required

Anything Ethan must decide before or during this task. If there are none, say
"None".

---

## Founder sign-off

**Do not fill this in on Claude's behalf.**

- [ ] Acceptance criteria met
- [ ] Evidence reviewed
- [ ] Verification passed
- [ ] Approved

**Approved by:**
**Date:**
**Note:**

Recorded with:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs approve <TASK_ID> "note"
```
