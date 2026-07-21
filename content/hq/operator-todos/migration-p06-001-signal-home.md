---
id: migration-p06-001-signal-home
title: Decide whether Signal becomes the unified app's home screen at cutover
status: done
priority: P1
blocking: false
phase: Consolidation Phase 6
why: The unified Signal Studio app needs a post-login landing. Keeping the Tasks board preserves today's workflow; switching to the Signal brief changes what every user sees first.
href: /hq/decisions
date: 2026-07-21
---

## Steps

1. Read the evaluation: `_migration-control/ARCHITECTURE_DECISIONS.md` AD-014 in the signal-studio-workspace (evidence: no existing cross-product home today; the brief requires onboarding and points idle users back to the board; the rail already puts Signal one click away).
2. Recommended default: keep `/app` landing on the Tasks board at launch. Revisit Signal-as-home (globally or as a per-user preference) once real usage data exists.
3. Other realistic options: (a) Signal brief becomes the landing for onboarded users only, board for everyone else; (b) per-user setting, default board.
4. Consequence of delay: none before cutover — the unified app ships with the recommended default until this is decided.
5. Latest useful decision point: production cutover of the consolidated app.

DONE: Recommended default shipped: /app lands on the board; Signal one click away on the rail.
