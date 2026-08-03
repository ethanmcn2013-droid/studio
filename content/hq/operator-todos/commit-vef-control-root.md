---
id: commit-vef-control-root
title: Commit the Venue Edition control root to git. It is entirely untracked.
status: done
priority: P0
blocking: false
phase: Phase 1
why: PROJECT_STATE.json, DECISIONS.md and every session record for a 211-task programme are untracked. One git clean removes the project's entire memory.
href: /hq
date: 2026-08-03
---

## Why

`git status` in `studio/` returns:

```
?? docs/execution/venue-edition-and-films/
```

The whole control root is untracked. That directory holds:

- `PROJECT_STATE.json`, canonical for 211 tasks, their criteria, evidence and sign-off state
- `DECISIONS.md`, twenty-four ratified decisions that exist nowhere else
- `RAID.md`, `BRIEF.md`, `DEPENDENCY_MAP.md`, `PROJECT.md`
- every session record and every piece of evidence produced by four parallel work packages

**There is no revert path for any of it.** A mistaken `git clean -fd`, a fresh
clone, or a branch operation that discards untracked files removes the entire
programme's memory in one step.

D-002 chose this location specifically because "the workspace root is not a git
repository, so a control system placed there would not be version-controlled."
The reasoning was right. The directory was then never added.

## Why it needs the founder

Committing puts programme state into the repository's history permanently,
including the commercial position, the risk register and the decision log. That
is a founder call, not an agent's.

## What to check first

- The tree carries no credentials by rule (`PROJECT.md` §21).
- `private/venues.csv` is already gitignored; confirm before committing.
- Generated reports are counts-only and a test asserts no contact data appears.

## Done

Committed 2026-08-03 on the founder's instruction. 125 files tracked: the
canonical state, the decision log, the risk register, the brief, the dependency
map, every session record and every piece of evidence.

Two exclusions confirmed before the commit: `private/*` stays gitignored apart
from its README and template, and the geocoding cache under `.geo-cache/` was
added to `.gitignore` because it is regenerable and several of its filenames,
built from venue names and addresses, exceed the path limit.

Scanned before committing: no credentials, no API keys, no venue contact data,
no phone numbers. The only real email address in the tree is the founder's own,
used as the required Nominatim API contact in `tools/venue-geo.mjs:191`.

Recorded as **I-007** in
`docs/execution/venue-edition-and-films/RAID.md`.
