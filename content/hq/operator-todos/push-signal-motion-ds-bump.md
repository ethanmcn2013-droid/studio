---
id: push-signal-motion-ds-bump
title: Push the staged signal-ds 2.1.0 bump for signal-motion once its film branch lands
status: open
priority: P2
effort: quick
blocking: false
phase: DS pivot 2026-08-22
why: The bump commit exists but cannot be pushed without leaking Ethan's unpushed film work; motion is the last repo still pinned to 2.0.1.
href: /hq
date: 2026-08-22
recommended: "After feat/meet-dot-film merges to master: git -C signal-motion push -u origin pivot/ds-bump-2-1, open PR into master, merge. If feat/meet-dot-film was rebased instead, re-create the branch: worktree off the new tip, change package.json signal-ds to 2.1.0, pnpm install, commit."
alternatives: ["Skip the pin bump until the next film cycle needs it — 2.0.1 tokens are byte-identical to 2.1.0, so nothing breaks by waiting"]
trigger: "When signal-motion's in-flight film branch (feat/meet-dot-film, tip a64a4ce) merges or rebases onto origin/master."
links: ["../decisions/ds-tokens-first-pivot-2026-08-22.md", "publish-signal-ds-2-2.md"]

---

## Context

The ds pivot bumped signal-motion's `signal-ds` pin from 2.0.1 to 2.1.0 and
verified it (install + typecheck pass; barrel now bundleable, retiring
MOT-009's blocker). The commit (`d96e776`, branch `pivot/ds-bump-2-1`) sits in
worktree `_wt-ds-pivot-motion` **based on a64a4ce — Ethan's local,
not-yet-pushed film work**. Pushing it now would publish that WIP to the
remote, which is why this step is founder-gated.

## Steps

1. Land `feat/meet-dot-film` on `master` (or rebase it).
2. Push the staged branch: `git -C "C:\Users\ethan\signal-studio-workspace\signal-motion" push -u origin pivot/ds-bump-2-1` and open a PR into `master`.
3. If the base moved such that the branch no longer merges cleanly, re-create the bump instead: new worktree off updated master → set `"signal-ds": "2.1.0"` in package.json → `pnpm install` → commit `build: advance signal-ds pin 2.0.1 -> 2.1.0`.
4. Optional film-lane cleanup, now unblocked: retire MOT-009's StaticWordmark adapter (2.1.0's ESM barrel is Remotion-bundleable) and drop the vestigial `styles.css` import if render smoke stays green.

## Done when

- `git -C signal-motion ls-remote origin refs/heads/pivot/ds-bump-2-1` (or its successor) exists, PR merged, and `signal-motion/package.json` on master pins `signal-ds@2.1.0` with render smoke green.
