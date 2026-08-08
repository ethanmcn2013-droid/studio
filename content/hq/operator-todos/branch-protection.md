---
id: branch-protection
title: Decide protection policy for the private support repositories
status: done
priority: P2
effort: quick
blocking: false
phase: Repository governance
why: The two production repositories are public and can be protected after their existing CI failures are repaired; private support repositories still need a paid-plan or visibility decision.
href: /hq/experience-quality
date: 2026-08-08
cleared: 2026-08-08 — Founder chose to keep support repositories private with procedural enforcement; public-repository CI and protection remain agent-owned.
---

## Current topology

`app` and `studio` are the only production repositories and are public. Their
`main` branches currently have no protection, and both have pre-existing red CI
jobs; the agent queue owns repairing those jobs and enabling appropriate rules.

The private support repositories are `signal-motion`, `signal-directors`,
`signal-design-system`, `signal-review`, and `collateral`. GitHub will not
enforce private-repository branch protection on the current plan.

## One founder decision

Keep the support repositories private and accept procedural enforcement while
Ethan is the only committer (recommended), or approve the GitHub plan upgrade.
Do not make private creative or security repositories public merely to unlock a
branch rule.
