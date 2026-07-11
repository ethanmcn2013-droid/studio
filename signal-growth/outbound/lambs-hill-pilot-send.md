# Lamb's Hill — pilot send (Cycle 8.5)

**Status:** BLOCKED / SUPERSEDED 2026-07-11. Do not send this packet. Its ten codes were minted for 365 days under the retired free-pilot terms. The active Venue Edition is €1,500 per venue/year with 18-month couple access. Verify or migrate every unredeemed code to 548 days, then generate a new send packet from the active template before contacting Lamb's Hill.
**Recipient:** Sinéad at Lamb's Hill (the venue contact).
**Format:** Plain text email — paste body and code block straight into Sinéad's chosen mail client, attach CSV separately or inline.

---

## Subject

> Couples at Lamb's Hill now get Signal Studio free for the year

---

## Body (paste-ready)

```
Hi Sinéad,

Here's what we promised. Ten redemption codes for couples booking
their wedding at Lamb's Hill — each one gets them a year of Signal
Studio (tasks, notes, a shared timeline, a daily briefing of what
needs attention next), with your compliments. There's no cost to the
couple and no cost to you; the year-of-access is on us.

How it works on your side:

- Each code is single-use. One code per couple — please don't paste
  the same one into two emails.
- They redeem at signalstudio.ie/redeem/<CODE>. Their workspace
  activates the moment they sign up. Twelve months from then.
- We don't see who you give them to. The CSV stays on your side.

When you'd like to send one, here's a template you can lift —
written to sound like you, not us:

---

Subject: A year of Signal Studio, on us

Hi [first name],

A small gift from Lamb's Hill: a year of Signal Studio for your
wedding planning. Quiet, plain-English software for the work of
getting married — tasks, notes, a shared timeline, a daily briefing
of what needs attention next.

Your code below. Yours alone, activates once.

Code: [CODE]
Open: signalstudio.ie/redeem/[CODE]

Reply with any questions.

Sinéad
Lamb's Hill

---

The ten codes:

LAMBSHIL-UPNA2
LAMBSHIL-6UNHH
LAMBSHIL-RDHBG
LAMBSHIL-CXXQN
LAMBSHIL-53UMW
LAMBSHIL-MQWYV
LAMBSHIL-B34QB
LAMBSHIL-VCAXG
LAMBSHIL-DFZ8G
LAMBSHIL-43TY6

A few practical notes:

- If a couple writes back with a question about the software, they
  can reply to you and you can forward to me, or point them straight
  at hello@signalstudio.ie. Either works.
- Two weeks from now I'll check in to see how it's going — what
  worked, what felt off, whether the email template needs a different
  shape for your couples. Honest read appreciated, including if the
  answer is "they didn't bite."
- If you'd like another batch later, just say. I can mint them in a
  minute.

Thanks for being the first venue to try this. The whole point of
running it small like this is to learn from real couples before
scaling — so anything you notice, please pass on.

Ethan
```

---

## Operator checklist before sending

1. [ ] Both gates closed first — Clerk webhook signing secret rotated + redeployed (per `CYCLE_8_5_HANDOFF.md` Operator action #1), and one incognito redemption walked end-to-end (Operator action #2).
2. [ ] Test one of the new codes in incognito before Sinéad's send (mint produced a fresh batch — claim and verify the welcome card + template still render correctly, then have the orphan rolled back the same way the original LAMBSHIL-MP93X was).
3. [ ] Send from `hello@signalstudio.ie` (Google Workspace alias — DKIM still pending per `project_email.md`; check deliverability with a test send to your own inbox first).
4. [ ] Calendar reminders set: day 7 (2026-05-20) and day 14 (2026-05-27) — both light-touch check-ins. Retro at day 14 goes to `docs/CYCLE_8_5_LAMBS_HILL_RETRO.md`.

---

## Codes minted this turn (audit trail)

- Sponsor: Lamb's Hill (`lambs-hill`)
- Tier: wedding (Tasks-side) / venue_edition (studio source_type)
- Duration: 365 days per code
- Quantity: 10
- Dual-written: studio `license_codes` (audit) + tasks `comp_codes` (runtime)
- Date: 2026-05-13

Three additional LAMBSHIL test codes from Cycle 8.2 (`LAMBSHIL-MP93X`, `LAMBSHIL-7U2DF`, `LAMBSHIL-M52XX`) remain claimable — keep them as seeded-test stock, not included in Sinéad's batch.

---

## Why this shape

- **Plain-text email to Sinéad.** Same register as the couple-facing template — anything else would read as marketing-pretending-to-be-human, which is the trap.
- **"There's no cost to the couple and no cost to you."** Restates the actual ask in case her assumption was different. Cheap insurance.
- **Code list inline, not just CSV.** Sinéad copies one at a time per couple; an attachment forces a tab switch she doesn't need. CSV stays available for tracking on her end.
- **Two-week check-in by name, not "we'll be in touch."** Concrete date = real commitment. PM voice would say "circle back."
- **"Honest read appreciated, including if the answer is 'they didn't bite.'"** Invites the failure-mode response we need most. Sponsor relationships rot fastest when the principal is afraid to say it isn't working.

---

## What this draft DOESN'T do (deliberate non-builds)

- No Signal Studio logo, no HTML header. Plain text wins trust at this scale.
- No FAQ pre-empt list. Sinéad will surface the questions her couples actually ask.
- No "exclusive" or "limited time" framing. The program is small because it's a pilot, not because of scarcity theatre.
- No tracking pixel, no link-shim domain. Couples redeem at `signalstudio.ie/redeem/<CODE>` directly — no `t.signalstudio.ie/r/?u=...` middleware. The CSV is the source of truth for who has a code; we measure redemptions through Tasks's DB.
