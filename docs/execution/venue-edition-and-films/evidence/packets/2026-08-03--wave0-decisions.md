# Founder review packet — everything awaiting founder review

Generated 2026-08-03T00:14:33.945Z from PROJECT_STATE.json. 9 task(s).

**9 ready to approve · 0 not ready.**

Approving sets these tasks to Done and is the only thing that can. Nothing here is Done yet.

## Ready to approve

### `E03.07` Define rights and permissions for venue logos, venue photographs, couple photographs, film assets and public case-study material.

Executor: founder · critical path · in review since 2026-08-03

**Acceptance criteria**
1. Rights are defined: venues asked for logo and name usage in the founding programme and on the map; couples asked for nothing by default; any case-study use is separate, specific and opt-in.

**Evidence**
- DECISIONS.md#D-010 — Founder decision D-010, recorded 2026-08-02/03

### `E03.08` Define the active planning term relative to activation date, wedding date, postponement and post-wedding access.

Executor: founder · critical path · in review since 2026-08-03

**Acceptance criteria**
1. The active planning term is defined: 18 months from redemption, or 3 months past the wedding date, whichever is later, with postponement recomputing later and never earlier (D-022). Implementation is E04.07.

**Evidence**
- DECISIONS.md#D-010 — Founder decision D-010, recorded 2026-08-02/03

### `E03.09` Ratify the free Keepsake mode, read-only rules, storage boundary, export rights and deletion controls.

Executor: founder · critical path · in review since 2026-08-03

**Acceptance criteria**
1. Keepsake is ratified: free, read-only, indefinite access while the service exists, one-click export the couple owns, no storage guarantee and never the word forever.

**Evidence**
- DECISIONS.md#D-010 — Founder decision D-010, recorded 2026-08-02/03

### `E06.08` Define restrained venue attribution and Signal Studio attribution across shared artifacts.

Executor: claude_code · critical path · release-blocking · in review since 2026-08-03

**Acceptance criteria**
1. Attribution is defined: one footer line on a public keepsake, no logo, no badge, no powered-by in the viewport, and the venue gets equal restraint.

**Evidence**
- DECISIONS.md#D-011 — Founder decision D-011, recorded 2026-08-02/03

### `E09.06` Lock the canonical demo story for the venue, couple and wedding journey.

Executor: claude_code · critical path · in review since 2026-08-03

**Acceptance criteria**
1. The canonical demo story is locked: Glenmara House, Mara and Finn, synthetic, already present across the repo.

**Evidence**
- DECISIONS.md#D-012 — Founder decision D-012, recorded 2026-08-02/03

### `E11.03` Define cohort-release cadence, weekly account capacity and the rule for releasing the next 25.

Executor: founder · in review since 2026-08-03

**Acceptance criteria**
1. Cohort cadence is defined: 25 places, 25 venues contacted per cohort, released sequentially until 25 have signed and paid. Channel is email only.

**Evidence**
- DECISIONS.md#D-017 — Founder decision D-017, recorded 2026-08-02/03

### `E11.13` Define the follow-up sequence, no-response sequence and respectful stopping rule.

Executor: founder · in review since 2026-08-03

**Acceptance criteria**
1. The follow-up and stopping rule is defined: film, two follow-ups, one final short note, then stop and mark later. Four touches.

**Evidence**
- DECISIONS.md#D-013 — Founder decision D-013, recorded 2026-08-02/03

### `E11.14` Define founding-slot holds, proposal expiry, payment-to-lock procedure, close-lost reasons, referral asks and publicity consent.

Executor: founder · in review since 2026-08-03

**Acceptance criteria**
1. Slot mechanics are defined: proposal expires with the 14-day hold, the place locks on payment, referral asked only after the venue first couple activates, publicity consent always separate, opt-in and revocable.

**Evidence**
- DECISIONS.md#D-013 — Founder decision D-013, recorded 2026-08-02/03

### `E14.13` Decide the exact placement of the standard price, founding rate and final walkthrough CTA.

Executor: codex_motion · in review since 2026-08-03

**Acceptance criteria**
1. Price placement is decided: no price in Before the Day; the film ends on the walkthrough CTA and the price lives on the proposal page where it can carry its conditions.

**Evidence**
- DECISIONS.md#D-014 — Founder decision D-014, recorded 2026-08-02/03

## Your decision

Approve all of the above in one command:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs approve-batch "your approval note" E03.07 E03.08 E03.09 E06.08 E09.06 E11.03 E11.13 E11.14 E14.13
```

Or push back on any single one:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs reject E03.07 "what is wrong"
```

