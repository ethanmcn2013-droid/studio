---
id: closed-beta-clerk-restricted
title: Set Clerk sign-up mode to Restricted (invite-only) for the suite
status: open
priority: P0
blocking: false
phase: Phase 1
why: closes public account creation at the source — half of the closed-beta gate. The code /app allowlist is the other half and is already live.
href: /hq/health
date: 2026-07-04
---

## Context

Closed-beta access is belt-and-braces (operator decision 2026-07-04): Clerk
Restricted sign-up (no public accounts) PLUS a code allowlist gate on `/app`.
The code half shipped 2026-07-04: `requireAppAccess()` sends any account not on
`SIGNAL_ALLOWLIST` to `/waitlist`, and the founder (`ethanmcn2013@gmail.com`) is
hardcoded-allowed so a gate can never lock the operator out. This to-do is the
Clerk half — only the operator can flip it.

## Steps

1. Clerk dashboard -> the Signal Studio instance -> **User & Authentication ->
   Restrictions**.
2. Set **Sign-up mode: Restricted** (only invited users can create an account).
3. Grant access by sending a Clerk **invitation** (Users -> Invitations) to each
   beta email. The invite email links them into the sign-up flow with a ticket;
   non-invited visitors hitting `/sign-up` get Clerk's restricted state.
4. If the suite uses more than one Clerk instance (one per product), repeat for
   each. If it is a single shared instance, once is enough.
5. Keep the person's email in sync with `SIGNAL_ALLOWLIST` (see the sibling
   to-do) so they clear both halves of the gate.
