# Cycle 8.5 — Handoff (resume here next session)

**Last updated:** 2026-05-13 (end of session)
**Status:** Plan 8 through Cycle 8.4 is shipped + deployed + pushed. Cycle 8.5 (Lamb's Hill provision + soft launch) is the next cycle. One operator action and one in-browser walk gate it.

---

## At-a-glance — where Plan 8 is

| Cycle | Status | Notes |
|---|---|---|
| 8.0 — Decisions lock | Closed 2026-05-13 | `docs/VENUE_EDITIONS_PLAN.md` is the canonical source |
| 8.1 — Entitlements layer | Closed 2026-05-13 | Studio Drizzle/Turso + `getEntitlement` shipped; table now unused (kept) |
| 8.2 — Sponsors + /redeem/[code] | Closed 2026-05-13 | 7 view states, 3 LAMBSHIL codes seeded |
| 8.3 — Bridge to Tasks (reconciled) | Closed 2026-05-13 | Used Tasks's existing comp_codes; studio CTA → tasks.signalstudio.ie/redeem |
| 8.3 — Live-walk follow-up #1 | Closed 2026-05-13 | Fixed prod 500 on /redeem/[code] (sign-up gate) |
| 8.3 — Live-walk follow-up #2 | Closed 2026-05-13 | Fixed three bugs surfaced by first real walk: missing webhook secret + ws-legacy fallback writes + idempotency reorder |
| 8.4 — Operator surface | Closed 2026-05-13 | /pricing quiet line, /hq/partners view, partner-digest CLI |
| **8.5 — Lamb's Hill provision + soft launch** | **NEXT** | Send Sinéad the email template + first batch CSV; 14-day window |
| 8.6 — Comp Program split track | Deferred | Built after venue motion proves out |

---

## What's deployed and live

- `signalstudio.ie/pricing` — quiet "Planning a wedding? Ask your venue." line under Event tier.
- `signalstudio.ie/redeem/LAMBSHIL-MP93X` (also `-7U2DF` and `-M52XX`) — co-branded landing.
- `signalstudio.ie/hq/partners` — HQ-gated operator view with codes_issued / redeemed / active_30d / most_recent + totals.
- `tasks.signalstudio.ie/redeem/[code]` — sign-up gate + redemption + welcome short-circuit.
- All 3 LAMBSHIL test codes are **claimable** (orphaned redemption from first walk was rolled back).
- Both studio + tasks repos: git matches deployed state (last commits pushed end-of-session).

---

## Critical: where the Clerk webhook stands

The Clerk webhook endpoint was created mid-session at `https://tasks.signalstudio.ie/api/webhooks/clerk` in the **Development instance** of the Clerk app for Tasks (`guided-weevil-50.clerk.accounts.dev`). `CLERK_WEBHOOK_SIGNING_SECRET` is set on Tasks's Vercel production but **the function is still running with the old env** because Vercel's Hobby daily deploy limit was hit and no redeploy could land.

**The pilot still works** because of the fallback `ensureUserProvisioned` helper that ships in `tasks/src/server/db/ensure-user.ts`. Sign-ups provision their own users + workspaces + workspace_members rows from the Clerk id alone. The webhook only adds email + name + handle on top.

### Operator action #1 (next session, ~5 min)

Rotate the webhook signing secret in Clerk dashboard (the one set tonight is exposed in this session's chat transcript), then redeploy:

1. Clerk dashboard → Configure → Webhooks → endpoint `gsRNXc` (or whichever points at tasks.signalstudio.ie/api/webhooks/clerk) → click the "..." or "Roll secret" option next to the signing secret → confirm rotation.
2. Copy the new `whsec_...` value.
3. From the `~/Projects/personal/tasks` repo:
   ```sh
   vercel env rm CLERK_WEBHOOK_SIGNING_SECRET production -y
   vercel env add CLERK_WEBHOOK_SIGNING_SECRET production --sensitive
   # paste new whsec_... value
   vercel deploy --prod --yes
   ```
4. Verify by going back to Clerk dashboard → endpoint → Testing tab → send a `user.created` test event → expect HTTP 200.
5. (Optional but recommended) Also rotate `CLERK_SECRET_KEY` since that one was pasted in chat too. Same `env rm` / `env add` / redeploy pattern, value comes from API keys page in Clerk dashboard.

---

## Critical: the in-browser walk that hasn't been completed yet

You walked once tonight and hit the bugs that have since been fixed. The post-fix walk hasn't happened.

### Operator action #2 (next session, ~5 min)

Walk through an end-to-end redemption with a fresh email in incognito to validate the corrected flow.

Checklist:

1. Incognito window → `https://signalstudio.ie/redeem/LAMBSHIL-MP93X`
2. Click "Claim your seat" → expect bounce to `tasks.signalstudio.ie/sign-up?redirect_url=%2Fredeem%2FLAMBSHIL-MP93X`
3. Sign up with a fresh email (e.g. `ethanmcn2013+lambstest1@gmail.com`)
4. After Clerk hands you back to `/redeem/LAMBSHIL-MP93X` you should briefly see the green "You're on Wedding suite until [date]" success card.
5. Click "Open the workspace" → expect `/welcome` → expect short-circuit → land on `/app/board?welcome=venue&v=lambs-hill`
6. Confirm the "Compliments of Lamb's Hill" card is visible at the bottom of the board.
7. Confirm the wedding template is populated (tasks visible on the board).

Then verify the operator surface caught it:

8. Run `cd ~/Projects/personal/studio && pnpm partner:digest lambs-hill` — should now read "1 couple has redeemed (33%)" with a fresh timestamp.
9. Visit `signalstudio.ie/hq/partners` (sign in with HQ password) — Lamb's Hill row should show 3 / 1 / 1 / "X minutes ago".

If anything in steps 1–9 breaks, name the symptom and we debug before sending Lamb's Hill anything.

### Failure-mode cheatsheet

- **HTTP 500 on /redeem/[code]**: action throwing again. Tail Vercel logs.
- **Lands on /app/board with no welcome card**: detectVenueWelcome returned null. Probably the entitlement.notes lookup or comp_codes.notes JSON lookup. Query the DB for the entitlement row.
- **Lands on /app/board with empty workspace**: wedding template didn't apply. /welcome short-circuit was skipped — check that the result card link points at /welcome.
- **"Setting up your account" interstitial sticks**: ensureUserProvisioned didn't write or workspace_members lookup is still empty. Check Tasks DB.

---

## Cycle 8.5 itself (after validation)

Once the walk passes, send Sinéad at Lamb's Hill the operator handoff:

1. Mint the first batch of 10 codes:
   ```sh
   cd ~/Projects/personal/studio
   pnpm issue:codes lambs-hill 10
   ```
   This dual-writes to studio license_codes + Tasks comp_codes and emits a CSV.

2. Compose the email to Sinéad. Suggested shape:
   - Subject: *Couples at Lamb's Hill now get Signal Studio free for the year*
   - Body: short paragraph explaining the program, the redemption link template, and the CSV attached.
   - Attach the CSV from step 1.

3. Set a 14-day soft-launch window. Log day 0 / day 7 / day 14 check-in calendar items.

4. At day 14, write the retro to `studio/docs/CYCLE_8_5_LAMBS_HILL_RETRO.md`.

---

## Open architectural questions parked for Cycle 9+

- **Drop studio's `entitlements` table** — currently unused since 8.3 reconciliation. Kept for now (empty cost is zero; cross-product identity may want it). Revisit when Cycle 9 is scoped.
- **Studio's `redemptions` audit table** — sits empty. Tasks → studio webhook would populate it. `/hq/partners` reads Tasks directly anyway, so no acute need.
- **Read-only Turso token for runtime reads** — currently `/hq/partners` and `partner-digest.ts` use the write-capable `TASKS_AUTH_TOKEN` that `issue-codes.ts` needs. Security hygiene followup.
- **Migrate Tasks from `pk_test_` (Development) to `pk_live_` (Production) Clerk instance** — currently running a dev Clerk instance against real prod traffic. Pilot-safe but worth fixing before scaling. Separate signing keys, separate webhook endpoint, separate user database in Clerk's storage.
- **Pre-auth code validation on Tasks /redeem** — typo'd codes currently push couples through Clerk sign-up before failing. Polish.
- **Add Venue Editions to studio HQ data.ts** — per Plan 8 closure criteria. Genuine omission. Worth doing in Cycle 8.5 when the program goes properly live.

---

## File index — load these next session for context

- `docs/VENUE_EDITIONS_PLAN.md` — full plan, all cycles
- `docs/CYCLE_8_3_RECONCILIATION.md` — the parallel-infrastructure lesson
- `docs/CYCLE_8_5_HANDOFF.md` — this file
- `.claude/state/phase.md` — rolling status (auto-injected at session start)
- `~/Projects/personal/tasks/CHANGELOG.md` — the three 2026-05-13 entries narrate the bridge saga
- `~/Projects/personal/studio/CHANGELOG.md` — operator-surface + plan-8 entries

---

## One-line resume prompt

> Resume Plan 8 — Cycle 8.5. Read `docs/CYCLE_8_5_HANDOFF.md` first.
> Two operator actions pending before the cycle can start: (1) rotate the
> Clerk webhook signing secret and redeploy Tasks to bring the webhook
> online; (2) walk one redemption end-to-end in incognito to validate the
> corrected post-Clerk flow. Then mint 10 codes for Lamb's Hill and send
> Sinéad the email + CSV.
