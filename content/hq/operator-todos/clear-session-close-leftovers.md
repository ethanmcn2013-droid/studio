---
id: clear-session-close-leftovers
title: Clear the 2026-08-12 session-close leftovers on the dev machine
status: open
priority: P2
blocking: false
effort: quick
phase: Phase 2
why: Two emptied worktree directories hold Windows file locks until the next reboot, and two prepared task chips sit unstarted; five minutes of clicking finishes the tidy-up the session could not.
href: /hq
date: 2026-08-12
---

## Steps

1. After the next reboot, delete the two husk directories (their git
   registrations are already pruned and every branch is merged and deleted):
   `C:\Users\ethan\signal-studio-workspace\_wt-motion-wave7` and
   `C:\Users\ethan\signal-studio-workspace\_wt-estate-studio`.
2. In the Claude Code session list, start (or dismiss) the two prepared
   chips: **"Fix EASE_OUT mismatch in src/lib/motion.ts"** (the JS motion
   helper and the CSS `--ease-out` token disagree about the app's main
   easing curve, so JS-driven and CSS-driven animation move differently)
   and **"Reconcile blanket reduced-motion rule with authored variants"**
   (a global `!important` rule silently flattens every carefully authored
   reduced-motion variant; behaviour is compliant, but authored intent and
   shipped behaviour disagree).
