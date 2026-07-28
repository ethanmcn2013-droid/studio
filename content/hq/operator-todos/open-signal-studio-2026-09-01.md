---
id: open-signal-studio-2026-09-01
title: Open Signal Studio on 1 September
status: open
owner: founder
due: 2026-09-01
created: 2026-07-28
tags: [launch, access, auth]
---

## What

Flip Signal Studio from invite-only to open, on 1 September 2026.

## Why this is a to-do and not just a date

The gate is `src/lib/launch.ts`, byte-identical in `tasks` and `studio`. It
compares now against `LAUNCH_AT` (2026-09-01T00:00:00Z), so `/sign-in` and
`/sign-up` un-noindex themselves and the auth pages start offering "Create an
account" instead of "Join the waitlist" the moment the clock passes.

That works on request-rendered routes. It does **not** work on anything
statically generated: a marketing page built in August bakes the pre-launch
answer into the HTML and keeps serving it until something rebuilds it. The
date is the intent; a deploy is the mechanism.

## Steps

1. Redeploy `studio` and `tasks` on or just after 1 September. That alone
   flips every statically rendered surface.
2. Confirm `signalstudio.ie/sign-in` returns `index, follow` in its robots
   meta, and that the header reads "New here? Create an account".
3. Decide what the marketing CTAs become. They currently all point at the
   waitlist and that is enforced by
   `tasks/scripts/check-marketing-waitlist-contract.mjs`. Opening sign-in on
   marketing surfaces means relaxing that gate **deliberately**, which is
   what its own header comment asks for. Until then the CTAs stay as they
   are, which is the safe default.
4. Decide whether the allowlist in `src/lib/access-allowlist.ts` still gates
   `/app`. Launch day and open access are two separate switches on purpose:
   the site can open while the product stays allowlisted.

## Rehearsal

To see the post-launch site before the date, without changing code:

```
NEXT_PUBLIC_SIGNAL_LAUNCH_STATE=open
```

The same variable set to `pre` holds the site closed past the date if launch
slips, again without a code change.

## Done when

The auth routes are indexable, the marketing CTA decision in step 3 is made
and recorded, and this file is marked `status: done`.
