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
cleared: 2026-08-08 — Founder kept support repositories private with procedural enforcement; app and studio main now require PRs, verified checks, linear history, resolved conversations, and block force-push/deletion.
---

## Current topology

`app` and `studio` are the only production repositories and are public. Their
`main` branches are protected with the green verified checks appropriate to
each repository. Studio's separate experience-registry debt remains explicit
in the agent queue and is not allowed to weaken those rules.

The private support repositories are `signal-motion`, `signal-directors`,
`signal-design-system`, `signal-review`, and `collateral`. GitHub will not
enforce private-repository branch protection on the current plan.

## One founder decision

Keep the support repositories private and accept procedural enforcement while
Ethan is the only committer (recommended), or approve the GitHub plan upgrade.
Do not make private creative or security repositories public merely to unlock a
branch rule.
