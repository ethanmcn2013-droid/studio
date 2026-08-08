---
id: ai-spend-budget
title: Set an AI spend budget + alert (Anthropic / AI Gateway)
status: done
priority: P0
effort: quick
blocking: true
phase: Phase 1
why: streamText in tasks has no cost ceiling — a single actor can drive unbounded Anthropic spend.
href: /hq/reporting
date: 2026-06-23
cleared: 2026-08-08 — Founder ratified EUR 25/month, 50/80/100 percent alerts, and EUR 0.25/user/day; provider and code enforcement moved to the agent queue.
---

## Steps

1. Anthropic console -> Billing -> set a monthly usage limit + email alert threshold.
2. (Recommended) Route AI calls through Vercel AI Gateway for per-model budgets + spend alerts.
3. Decide the per-user daily token budget the code should enforce — eng wires the hard cap into `tasks/src/server/actions/ai.ts`.
