---
id: premium-auth-providers
title: Enable Google, Apple and GitHub sign-in in the Clerk dashboard
status: open
priority: P1
blocking: false
phase: Premium Programme Phase 2
why: Social sign-in for Tasks is a Clerk dashboard configuration, not code. The product work (sign-in surface, Security & Login settings, account linking UI) ships independently and lights up as each provider is enabled.
href: /hq/decisions
date: 2026-07-21
---

## Steps

1. Clerk dashboard -> the Tasks production instance -> SSO connections: enable Google, GitHub, and Apple.
2. GitHub: identity-only scopes (the default). Repository access, if ever wanted, is a separate future GitHub App — do not grant broader scopes here.
3. Apple requires an Apple Developer team + Services ID; if that account does not exist yet, enable Google + GitHub now and leave Apple for later — the UI degrades gracefully to whatever is enabled.
4. Confirm the production redirect/allowed-origin settings Clerk shows for each provider.
5. Reply done; no deploy is needed for providers to appear on Clerk-rendered surfaces.
