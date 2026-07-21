---
id: premium-inapp-themes
title: Decide whether the Tasks product app may offer user-selected dark and premium themes
status: open
priority: P3
blocking: false
phase: Premium Programme Phase 4
why: The light-lock (2026-07) bans dark on Signal Studio marketing and HQ surfaces. Whether the signed-in product app may offer an opt-in dark or premium theme is a separate product decision (DECISIONS D-013). Phase 4 builds the token plumbing either way; dark stays unexposed behind preference until you sign off here.
href: /hq/decisions
date: 2026-07-21
---

## Decision needed

May the Tasks product app (signed-in /app surfaces only) expose user-selected themes beyond system/light — specifically an opt-in dark theme and curated premium themes?

- Marketing pages, HQ, and every public surface stay light-locked regardless of this decision.
- Phase 4 ships the token plumbing with system and light enabled; dark exists in code but is not selectable.
- Saying yes flips a preference flag; saying no costs nothing (the plumbing still serves theme tokens for light).

## Steps

1. Read D-013 in `docs/execution/signal-studio/DECISIONS.md`.
2. Reply here with: dark allowed in-app yes/no, and whether premium themes should gate on a paid tier.
