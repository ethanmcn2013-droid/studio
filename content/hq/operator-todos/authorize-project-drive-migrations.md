---
id: authorize-project-drive-migrations
title: Authorize the Project Drive production migrations
status: open
priority: P0
effort: quick
blocking: true
phase: Project Drive launch
why: The feature branch depends on migrations 0028 and 0029, and production must not receive them without the founder's explicit go-ahead.
href: /hq/features
date: 2026-09-03
---

## Decision

Explicitly authorize or defer applying Tasks migrations 0028 and 0029 to the
production database. Neither migration is applied now. Approval is for the
repository's receipt-backed migration workflow only; it is not approval for an
ad-hoc SQL push.

Once authorized, Codex or Claude must take a verified backup, pass the isolated
dry run and migration contract, apply through the approved `db-migrate`
workflow, retain its receipt, and prove production reports `current` before the
feature can launch.
