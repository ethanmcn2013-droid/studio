# sessions/

Append-only session history. One file per substantive session, named
`YYYY-MM-DD--<short-session-id>.md`, using the Claude session ID where
available.

Written automatically by:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs session close "summary"
```

The tool refuses to overwrite an existing record. If you need a second session
on the same day, open it with a distinct `--id`.

## What each record holds

Session objective · tasks touched · files inspected · decisions made · changes
completed · tests and verification · evidence created · blockers found · status
changes · founder review required · next action.

## Rules

- **Never rewrite a closed session.** If something recorded turns out to be
  wrong, correct it in the next session's record, naming the earlier one.
- `HANDOFF.md` is the current-state summary and is replaced each close. This
  directory is the history and is not.
- A session that ended without a clean close is recorded by hand from
  `../templates/SESSION.md`.
