# Cycle 8.5 — Lamb's Hill soft-launch retro

**Pilot start date:** TBD (the day Sinéad sends her first couple email)
**Retro date:** Pilot start + 14 days
**Retro owner:** Ethan
**Last filled:** (template — not yet retro'd)

This file is pre-staged. Fill it on the day, not before — a retro template you've pre-answered tells you what you expected to find, not what you actually found.

---

## At-a-glance numbers

Pull from `signalstudio.ie/hq/partners` and `pnpm partner:digest lambs-hill`:

| Metric | Value | Notes |
|---|---|---|
| Codes issued | 10 | Minted 2026-05-13 |
| Codes redeemed | _ / 10 | |
| Redemption rate | _% | redeemed / issued |
| Reached board | _ / redeemed | `entitlements.reached_board_at` count |
| Reached-board rate | _% | reached / redeemed — the "did the next person finish?" answer |
| Most recent redemption | _ | timestamp from comp_codes |
| Conversation booked back with Sinéad | yes / no | |

---

## The three questions

### 1. Did couples claim the codes?

What rate did you expect? What rate landed?

If lower than expected:
- Was the bottleneck the gift offer, the venue's email send rate, the couples' attention, or the redemption flow?
- Did Sinéad send all 10 emails, or fewer? (Honest answer matters — "I gifted four because the others felt premature" is data.)
- Were any redemption attempts blocked? (Check Sentry for `redeemCompCodeAction` errors with code tags.)

If higher than expected:
- Mint more. Don't make Sinéad ration.

---

### 2. Did couples reach the board?

This is the "next person finish" question — the column we built specifically to answer it.

If a couple redeemed but `reached_board_at` is null:
- They got past Clerk sign-up but didn't make it to `/app/board?welcome=venue`. Check Sentry tags for that user id.
- Or: they reached the board but the measurement helper errored before stamping. Pull the entitlement row and check.

If they all reached the board:
- That's the lowest-effort milestone. The harder one is whether they *used* it — see Question 3.

---

### 3. Did Sinéad like running this?

The relationship is sponsor → couple → us. The sponsor relationship has to survive past pilot for the motion to scale.

- Did Sinéad come back with questions? Frustrations? Did any couples write back to her with anything she found awkward to handle?
- Did the email template feel like her voice, or did she rewrite it? (If she rewrote it, save her version — it's better than ours.)
- Would she gift another batch if you offered? At what frequency does it stop feeling like a gift and start feeling like marketing?

---

## What broke (if anything)

| Symptom | When | Root cause | Fix shipped | Where logged |
|---|---|---|---|---|
| | | | | |

If nothing broke: write that explicitly, signed. *"Nothing broke — Ethan, 2026-MM-DD."* Pilot retros default to optimistic memory; the empty row protects against that.

---

## What we learned about couples

Open paragraph. The brand position is "project management without the project-manager voice." Did couples in this batch read it that way? Was anything in the redemption → workspace flow off-register for the audience?

Specific prompts:
- Did any couple use the welcome card's sponsor mention? Or did they immediately dismiss it and never reference Lamb's Hill again?
- Did the wedding-template seed tasks feel real, or did couples blow them away and start over?
- Did Sinéad get any "what is this?" replies, suggesting the venue framing didn't carry?

---

## What we learned about the venue motion

- Was a 10-code batch the right size? Too many sat unsent? Too few — Sinéad asked for more in week one?
- Was the email-handoff workflow (Sinéad copies and personalises each send) a friction or a feature?
- Could a venue further down the trust gradient (one Ethan hasn't met) run this same workflow with the same kit?

---

## Decisions made from this retro

Three columns: *Decision · Reason · Implementation owner / date*.

| | | |
|---|---|---|
| | | |

Add a row in `studio/src/lib/hq/data.ts` `decisions:` for any decision worth keeping visible cross-session.

---

## Next batch / next venue

Two questions, in order:

1. Mint another batch for Lamb's Hill? (Yes / No / Wait until conversations book with Sinéad's next 2 couples)
2. Approach venue #2? Which one, and what changes about the pitch given Lamb's Hill learnings?

Both answers live here, not in a separate file.

---

## Anti-pattern check

The retro fails if any of these are true. Add a row to each that applies:

- [ ] We wrote what we want to be true rather than what is.
- [ ] We blamed couples or Sinéad for friction that's actually ours to fix.
- [ ] We celebrated activity metrics (codes sent, redemptions) without checking outcome metrics (did couples actually use the workspace; did Sinéad want to do this again).
- [ ] We added scope ("Cycle 8.6 will fix this") instead of changing direction ("we were wrong about X").
