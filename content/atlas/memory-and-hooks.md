---
title: Memory and hooks — the operating contract
slug: memory-and-hooks
lens: Processes
owner: Ethan
lastVerified: 2026-05-14
links: [plan-cycle, brand-enforcement]
tags: [SessionStart, UserPromptSubmit, Stop, MEMORY.md, STATUS block, role routing, phase.md]
references: [~/.claude/CLAUDE.md, ~/.claude/hooks/, ~/.claude/state/phase.md, ~/.claude/projects/-Users-ethanmcnamara/memory/MEMORY.md]
summary: SessionStart injects phase context; UserPromptSubmit injects role hint; Stop validates the STATUS block and appends the log. Auto-memory persists facts across cycles.
status: stub
pinned: false
---

## WHAT

The Claude Code harness has three hooks (SessionStart, UserPromptSubmit, Stop), an operating contract in `~/.claude/CLAUDE.md`, and a file-backed auto-memory system at `~/.claude/projects/-Users-ethanmcnamara/memory/`. Together they enforce the role-routing table, the locked STATUS block format, and the per-project phase vocabulary — making cycles reliably shaped across sessions.

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
