---
id: branch-protection
title: Approve branch protection on main + serialize the autonomous committer
status: open
priority: P1
blocking: false
phase: Phase 2
why: Auto-deploy on push-to-main plus a concurrent autonomous committer means surprise prod changes and commit collisions.
href: /hq/health
date: 2026-06-23
---

## Steps

1. GitHub -> each repo -> protect `main` (require CI: typecheck + tests + isolation + build).
2. Add the Vercel preview -> manual-promote step for production.
3. Coordinate the other autonomous process so commits do not collide.
