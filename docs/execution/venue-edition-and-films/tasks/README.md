# tasks/

Task specifications, one file per task, named `<TASK_ID>.md`.

**There are deliberately no files here yet.** 211 empty stubs would be noise,
and an empty spec looks like a started task. A file is created only when a task
is being prepared, executed, reviewed, blocked in a way that needs real
documentation, or specifically asked for.

## Creating one

1. Copy `../templates/TASK.md` to `<TASK_ID>.md`.
2. Use the exact title from `../BACKLOG.md`, character for character.
3. Register it:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs spec E01.01 tasks/E01.01.md
```

`BACKLOG.md` then shows a spec tick against that task.

## Rules

- The specification does not add scope. If the task needs more than its title
  implies, raise a change request.
- Acceptance criteria live in both places: written here for context, and
  recorded in project state with `criteria <ID> "…"` so `validate` can enforce
  the Done contract.
- Split children get their own files: `E05.05.1.md`, `E05.05.2.md`. The parent
  file stays.
- A specification is not approval. Only `approve` marks a task Done.
