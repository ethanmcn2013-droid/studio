---
id: agent-hq-sync
title: Claude Code and Codex must keep Signal HQ current.
category: Operations
date: 2026-05-11
status: Active
reviewDate: 2026-05-25
relatedObjects: [CLAUDE.md, CODEX.md, AGENTS.md, Signal HQ]
---

## Decision

Claude Code and Codex must keep Signal HQ current.

## Reason

Future coding sessions should not change product, brand, GTM, timeline, or launch state without updating the internal source of truth.

## Alternatives considered

Rely on chat history or memory between tools.

## Risks

Agents working in sibling repos may miss Studio updates unless the rule is repeated clearly.

## Notes

Root shims now point both tools back to the same HQ rule.
