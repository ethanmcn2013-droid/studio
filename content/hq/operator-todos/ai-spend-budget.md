---
id: ai-spend-budget
title: Set an AI spend budget + alert (Anthropic / AI Gateway)
status: open
priority: P0
blocking: true
phase: Phase 1
why: streamText in tasks has no cost ceiling — a single actor can drive unbounded Anthropic spend.
href: /hq/reporting
date: 2026-06-23
---

## Steps

1. Anthropic console -> Billing -> set a monthly usage limit + email alert threshold.
2. (Recommended) Route AI calls through Vercel AI Gateway for per-model budgets + spend alerts.
3. Decide the per-user daily token budget the code should enforce — eng wires the hard cap into `tasks/src/server/actions/ai.ts`.
