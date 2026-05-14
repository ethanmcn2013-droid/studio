---
title: Cross-repo writers — the log-cycle pattern
slug: log-cycle-cross-repo-writer
lens: Processes
owner: Ethan
lastVerified: 2026-05-14
links: [plan-cycle, five-products-as-a-system, turso-databases-and-reads, analytics-daily-cron]
tags: [log-cycle.ts, cross-repo, ping, authed HTTP, cron staleness, Cycle 8.4.9]
references: [src/lib/log-cycle.ts, src/app/api/internal/cron-ping/]
summary: How a cycle in one repo writes a signal into another — authed HTTP ping, timeout, error-swallow, recipient owns the table.
status: stub
pinned: false
---

## WHAT

`log-cycle.ts` is the canonical cross-repo writer pattern. When one product's cycle produces a signal another product needs (analytics cron pinging studio with staleness, notes promotion writing into tasks, etc.), the caller fires an authed HTTP ping with a timeout and swallows errors. The recipient owns the table and the dashboard. Established Cycle 8.4.9 (analytics → studio cron staleness).

## WHO

_Stub. Fill in next cycle._

## WHERE

_Stub. Fill in next cycle._

## HOW

_Stub. Fill in next cycle._

## WHEN — current state

_Stub. Fill in next cycle._

## WHY

_Stub. Fill in next cycle._
