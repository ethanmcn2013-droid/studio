---
id: notes-hero-deploy
title: Approve the Notes hero for deploy (The Notebook, after Round C)
status: open
priority: P1
blocking: false
phase: P1 punch-list
why: the Notes hero lab is review-only by standing rule; nothing reaches notes.signalstudio.ie without your gate.
href: https://notes.signalstudio.ie
date: 2026-07-06
---

## Context

Notes hero parity (punch-list #8) lives on `feat/notes-hero-lab` and is being
iterated actively (Round A/B councils done; a Round C on "The Notebook" — chip/
header overlap, type dwell, outro wordmark handoff — is in flight). The bar is
the Signal "The Brief" hero's council scores. Per the standing rule this branch
is review-only: it does not deploy without your explicit sign-off.

Note: the marketing header on notes `main` already shipped today (it gained the
Pricing · Design nav contract). This to-do is only about the **hero lab** branch.

## Steps

1. Review the latest Notebook build on the lab `/lab` route (ask for a fresh
   screen recording or panel scorecard).
2. If it clears the Signal-hero bar, say ship — eng merges the lab branch to
   notes `main` and verifies on notes.signalstudio.ie.
3. If not, say what's short and it goes another round.
