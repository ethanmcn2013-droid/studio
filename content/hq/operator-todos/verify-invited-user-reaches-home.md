---
id: verify-invited-user-reaches-home
title: Sign in as a non-allowlisted invited account and confirm Home, Briefing, Notes and Timeline load
status: open
priority: P1
effort: quick
blocking: false
phase: Phase 1
why: the /app gate fix is proven at the gate, not yet by a real second identity in production
href: /hq/health
date: 2026-08-12
---

## Why this is yours and not an agent's

The fix (app dispatch T·144, risk `app-access-gate-divergence`) is verified by
running both access gates in production mode against a real database with a real
`workspace_members` row, and by a source-level guard across the whole /app tree.
That proves the gates agree and admit the right identities.

What it does not prove is the user-visible end of it, because that needs a
second Clerk identity that is **not** on `SIGNAL_ALLOWLIST`. Only you can create
one. Your own account cannot show this: the founder is on the allowlist, which is
exactly why the fault survived three weeks unseen.

## Steps

1. After the app PR is merged and deployed, invite a throwaway address you
   control (not `ethanmcn2013@gmail.com`, and not on `SIGNAL_ALLOWLIST`) into
   any workspace.
2. Accept the invite from that account.
3. As that account, open in order: `/app/home`, `/app/home/briefing`,
   `/app/notes`, `/app/timeline`.
4. Each must render. None may redirect to `/waitlist`. Before this fix, all four
   did.
5. Also open `/app/signal`. It must land on `/app/home/briefing`, not
   `/waitlist`.
6. Record the result on the risk record. If all pass, move
   `app-access-gate-divergence` to `Resolved`. If any bounce, it stays open and
   the gate work is not finished.

## While you are there

Two judgement calls that are yours, both recorded on the risk and neither
blocking:

- The wide gate is still called `requireAppAccessTasks`, from when the repo was
  only Tasks. It now gates the whole suite. Renaming it is a clean, mechanical
  follow-up; say the word and it goes in the next cycle.
- Any read of invite-acceptance or redemption engagement between 21 July and
  12 August 2026 is understated, because those users could not get past the
  front door. Do not treat that window as a demand signal.
