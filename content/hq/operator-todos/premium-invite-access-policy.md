---
id: premium-invite-access-policy
title: Policy notice — accepted workspace invites now grant app access during closed beta
status: open
priority: P1
blocking: false
phase: Premium Programme Phase 2
why: Security review found invited collaborators were silently trapped, membership written and invite burned but bounced to /waitlist by the allowlist. Decision D-018 makes an accepted invite imply access (the allowlist remains the wall against public self-signup). This notice is for awareness and an easy reverse switch, not a blocker.
href: /hq/decisions
date: 2026-07-21
---

## What changed

Signing in after accepting a valid workspace invite now passes the closed-beta gate: access = allowlisted email OR at least one workspace membership. Removing a member (or their last membership) removes their access again.

## Why

Invites only come from people already inside the beta. Blocking their invitees breaks the collaboration loop (venue invites couple; couple could never open the board) during exactly the window the loop is being proven.

## To reverse

Say the word and the membership clause comes out of the Tasks access check; invites then fail closed at accept with a clear closed-beta message instead of burning the token. Detail: docs/execution/signal-studio/DECISIONS.md D-018.
