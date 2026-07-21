---
id: premium-task-detail-review
title: Review the task-detail lab and accept or redirect the direction
status: open
priority: P1
blocking: true
phase: Premium Programme Phase 3
why: The new task-detail experience (resizable panel + focus mode over one composition) is built as a lab and judged strong by the lead against the current form-like panel. Per the lab-parity standard the production port waits for your side-by-side acceptance.
href: /hq/decisions
date: 2026-07-21
---

## How to review

1. Local: in the tasks repo worktree `_wt-premium-p1` run `pnpm dev -p 4399`, open http://localhost:4399/lab/task-detail. Or use the Vercel preview on tasks PR #44 (branch feat/premium-foundations) at `/lab/task-detail`.
2. Compare with the live board panel: open a task on /app/board next to it.
3. Try: click cards, drag the panel's left edge, press e for focus mode, j/k to move between tasks, Esc to close.
4. Screenshots (lead's acceptance set): studio repo docs/execution/signal-studio/evidence/phase3-lab/.

## What you are deciding

- Panel + expand-to-focus as the model (replaces the scrimmed fixed panel).
- Document-first hierarchy: brief reads like a page; metadata sits in a quiet rail.
- Open questions listed in the lab README (src/components/lab/task-detail/README.md), notably: status-switcher placement in the header, default panel width, activity filter default.

Reply with accepted, accepted-with-notes, or redirect. The production port (1:1) starts on acceptance; Contact and Amount fields and the quick status switcher are already on the port checklist.
