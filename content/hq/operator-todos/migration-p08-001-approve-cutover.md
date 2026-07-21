---
id: migration-p08-001-approve-cutover
title: Approve the staged cutover plan and pick the window
status: open
priority: P0
blocking: true
phase: Consolidation Phase 8
why: The unified app is release-ready; nothing ships until you approve the staged plan (preview -> merge -> redirects -> retirement) and choose the window.
href: /hq/decisions
date: 2026-07-21
---

## Steps

1. Read the runbook: signal-studio-workspace/_migration-control/DEPLOYMENT_AND_ROLLBACK.md (Stages A-D, abort criteria, rollback).
2. Recommended default: Stage A (preview) immediately; Stage B (merge to tasks main) after Phase 9 staging checks pass; Stage C redirects 3-7 days later.
3. Reply with approval + window, or amendments.
