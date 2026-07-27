---
id: log-cycle-timeline-db-credentials
title: Provide the shared roadmap database credentials for log-cycle
status: open
priority: P2
blocking: false
why: The end-of-cycle ritual cannot record a cycle, so the public roadmap has been missing entries since T·84 in June.
href: /hq/atlas
date: 2026-07-27
---

The Tasks contract ends every cycle by running `scripts/log-cycle.mjs`, which
writes a row into the shared Timeline database so the public roadmap stays
accurate across products. That command has been failing since 2026-06-09 with
`TURSO_DATABASE_URL not set`, so cycles T·84 onward were never logged.

Nothing in the product is blocked. The consequence is narrow and external: the
roadmap page under-reports what has shipped.

## Steps

1. Put `TURSO_DATABASE_URL`, and the auth token if the endpoint needs one, into
   `tasks/.env.local`. This is the shared Timeline database, not the Tasks
   application database.
2. Confirm it works on one cycle:
   `node scripts/log-cycle.mjs --cycle 105 --title "Delight Layer" --date 2026-07-27 --description "..."`.
3. Decide whether to backfill T·84 through T·104 or to log only from T·105
   forward. Backfilling is honest but noisy; starting fresh is defensible if
   the roadmap is framed as recent movement.
4. Mark this done once a cycle records successfully.

The original failure note is archived at
`tasks/docs/archive/LOG-CYCLE-T84-BLOCKED.md`.
