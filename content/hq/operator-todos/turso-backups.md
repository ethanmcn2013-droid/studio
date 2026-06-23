---
id: turso-backups
title: Configure Turso backups / PITR for all 4 DBs and test a restore
status: open
priority: P1
blocking: false
phase: Phase 2
why: There is no proven recovery path today — a bad migration or accidental delete has no tested restore.
href: /hq/health
date: 2026-06-23
---

## Steps

1. Enable scheduled backups / point-in-time recovery on the Turso plan for notes, tasks, analytics, roadmap.
2. Document RTO/RPO in the atlas.
3. Run one restore drill against a throwaway DB and confirm the data comes back.
