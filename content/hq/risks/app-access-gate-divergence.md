---
id: app-access-gate-divergence
title: Two access gates guard /app, and the stricter one is nested inside the wider one.
category: Product
likelihood: Low
impact: High
status: Monitoring
owner: Ethan
reviewDate: 2026-09-15
---

## Mitigation

Opened and mitigated 2026-08-12 (app dispatch T·145, app PR #130). The signed-in app has two
access checks. `requireAppAccess()` reads the closed-beta allowlist and nothing
else. `requireAppAccessTasks()` reads the allowlist first and then falls back to
a `workspace_members` row, which is the D-018 grant-on-accept rule: an owner
inviting someone, or a sponsored code being redeemed, is the operator granting
access. The second admits everyone the first admits, and more.

The /app layout was moved to the wider check on 2026-07-21 as part of the invite
security-hardening pack. Thirteen page files beneath it kept calling the narrow
one. The layout admitted an invited collaborator or a redeemed couple and the
page then redirected them to /waitlist, and because the page runs last it won.
Home, the Full Briefing, Notes, Timeline, the four Timeline sub-routes and the
three legacy /app/signal redirects were all unreachable for those users, whose
invite token had already been spent by then. Tasks was unaffected, because the
Tasks runtime shell had been wired to the wider check separately. Net effect for
three weeks: an invited collaborator could use Tasks and nothing else.

The direct cause was an architectural rule pointing the wrong way. AD-005
requires every module route page to re-check access for defence in depth, and
`scripts/check-module-boundaries.mjs` rule 3 enforced that by demanding
`requireAppAccess()` by name. Widening the layout therefore could not widen the
pages: the boundary gate would have rejected it. The rule created the divergence
and then held it in place.

Fixed and guarded in app PR (branch `fix/app-gate-parity`):

- All thirteen pages now call the membership-aware check. The unused
  `AppAccessGate` component, which held a fourteenth copy of the narrow check
  and was wired to nothing, is deleted.
- Rule 3 now demands the wide check and rejects the narrow one by name.
- `src/server/app-gate-parity.test.mjs` walks the whole /app tree and fails if
  any file reaches the allowlist-only gate, including under a rename, and
  self-tests its own detector so it cannot rot into a check that matches
  nothing.
- `src/server/app-gate-runtime.test.mjs` runs both gates in production mode
  against a real database holding a real membership row, and asserts where
  three identities land.

Why it went unseen for three weeks is the part worth carrying forward: the
founder is on the allowlist, so both gates admit the founder. No amount of using
the product would have surfaced it, and no reported symptom reached the
operator, because the affected users were bounced to a waiting-list page that
looks like a deliberate product state rather than a fault.

## Notes

Residual, and why this stays Monitoring rather than Resolved.

The guards cover `src/app/app/**` and `src/components/app/**`. Authenticated
surfaces outside that tree are not covered by the parity test, because /app is
where the two-gate divergence exists. If an authenticated surface is ever added
outside /app, the invariant it needs has to be stated for that tree too.

The wide gate is still named `requireAppAccessTasks`, from when this repo was
only Tasks. It now gates the whole suite and the name reads as though it does
not. The enforcement is deliberately name-independent, so this is a legibility
debt, not an active hazard. Renaming it is a clean follow-up.

Verification is at the level of the gate functions, not a real second identity
signing in to production. Confirming the user-visible fix end to end needs a
non-allowlisted Clerk account with a membership row, which only the operator can
create. Until that is done, the claim proven is that the gates agree and admit
the right three identities, not that a real invited collaborator has loaded
Home in production.

Related: `content/hq/risks/collaboration-hidden.md` grades whether the
collaboration loop acquires at volume. This record is narrower and mechanical:
whether the loop's users can get through the door at all. For three weeks they
could not, which means any read of invite-acceptance or redemption engagement
taken between 21 July and 12 August 2026 understates reality and should not be
treated as a signal about demand.
