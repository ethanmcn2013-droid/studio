# Lamb's Hill — pilot send (Cycle 8.5)

**Status:** Draft + pre-flight pack. **Send is gated** — Gate 0 fails the
live walk; Gates 1–4 are operator actions that follow.
**Recipient:** Sinéad at Lamb's Hill (the venue contact).
**Format:** Plain text email — paste body straight into Sinéad's chosen
mail client. Codes inline; CSV attached separately for her records.

---

## Runbook — clear these in order before the send

### Gate 0 · Engineering fix (blocks everything below)

**The cycle 8.5 live walk failed on 2026-05-14.** A fresh sign-up hitting
`tasks.signalstudio.ie/redeem/LAMBSHIL-M52XX` after Clerk verification
returns HTTP 500 from the Server Component render of the redeem page.
The idempotent-replay path on `LAMBSHIL-7U2DF` rendered the rose
success card but its "Open the workspace" link landed on `/welcome`,
which also 500s. Both surfaces are unusable to a real couple right now.

**Strongest hypothesis:** `applyTemplateAction` calls
`revalidatePath("/app", "layout")`. It is now invoked from inside a
Server Component render (the redeem action runs synchronously during
`/redeem/[code]/page.tsx` render, and the same call shape lives in the
`/welcome` venue short-circuit). Next.js 15 disallows `revalidatePath`
during route render — it has to fire from a Route Handler or a Server
Action invoked from the client. The 8.4.5 polish moved this code path
from `/welcome` (which still had the same problem latent) into the
redeem action, which is when the regression surfaced.

**Fix sketch (engineering, before send):**

```
# tasks/src/server/actions/comp.ts
# Inline the template apply without the revalidatePath call, or
# extract a no-revalidate variant of applyTemplateAction. The
# redeem path doesn't need a cache bust — the user is about to
# navigate, and the next render is dynamic anyway.

# tasks/src/app/welcome/page.tsx
# Same treatment for the venue short-circuit branch. Keep the
# branch as a safety net for users who land directly on /welcome
# with a venue entitlement, but stop calling revalidatePath from
# render.
```

After the fix, re-run the live walk per Gate 2 against a fresh seeded
LAMBSHIL code. Do not send Sinéad anything until that walk reports
"rose card → /app/board?welcome=venue&v=lambs-hill → wedding template
populated → venue welcome card visible" end-to-end.

### Gate 1 · Rotate the Clerk webhook signing secret + redeploy Tasks

The webhook secret on Tasks Vercel production was last set 2026-05-12 —
the value was pasted in chat that session, so it's exposed. Rotate
before the pilot goes live.

```sh
# 1. Clerk dashboard → Configure → Webhooks → endpoint pointing at
#    https://tasks.signalstudio.ie/api/webhooks/clerk → "..." menu
#    → Roll secret → copy the new whsec_...

# 2. From ~/Projects/personal/tasks
cd ~/Projects/personal/tasks
vercel env rm CLERK_WEBHOOK_SIGNING_SECRET production -y
vercel env add CLERK_WEBHOOK_SIGNING_SECRET production --sensitive
# paste new whsec_... value

# 3. Trigger a production deploy so the function picks up the new env
vercel deploy --prod --yes

# 4. Verify: Clerk dashboard → endpoint → Testing tab →
#    send a user.created test event → expect HTTP 200
```

Optional but recommended in the same window: rotate `CLERK_SECRET_KEY`
(also pasted in chat 2026-05-06). Same `env rm` / `env add` / deploy
pattern; new value from Clerk → API keys.

### Gate 2 · Walk one redemption end-to-end (post Gate 0 fix)

Re-run the live walk after Gate 0 ships. Use a seeded test code, not a
Sinéad-batch code. The seeded stock at this point is:

- `LAMBSHIL-MP93X` — **exhausted** as of 2026-05-14. Unclaim in Tasks
  Turso if you want to reuse it, otherwise skip.
- `LAMBSHIL-7U2DF` — **redeemed** by the cycle-8.5 walk on 2026-05-14.
  Same unclaim note.
- `LAMBSHIL-M52XX` — **claimable**. Use this one for the post-fix walk.

```sh
# Manual incognito walk (recommended over Playwright for this gate —
# the operator's eyes catch register issues an automated walk won't):
#
# 1. Incognito → https://signalstudio.ie/redeem/LAMBSHIL-M52XX
#    Expect: "Lamb's Hill" eyebrow, "Lamb's Hill is sponsoring your
#    access to Signal Studio." H1, "Claim your seat" full-width pill.
#
# 2. Click → bounces to
#    https://tasks.signalstudio.ie/sign-up?redirect_url=%2Fredeem%2FLAMBSHIL-M52XX
#    Expect: "Lamb's Hill" eyebrow + "Almost there. Lamb's Hill is
#    covering your year." + Code line ABOVE the Clerk SignUp form.
#
# 3. Sign up with ethanmcn2013+lambstest-postfix@gmail.com
#    (or any +clerk_test alias if the dev Clerk instance still allows
#    the 424242 shortcut).
#
# 4. After Clerk hands you back to /redeem/LAMBSHIL-M52XX, expect the
#    rose success card with "You're on Wedding suite until [date]."
#    No "comp:LAMBSHIL-M52XX" string visible in the body. (Polish
#    follow-up — the result card currently leaks the entitlement
#    notes field on the idempotent-replay path. Cosmetic, not a
#    pilot blocker, but worth a one-line filter before scale.)
#
# 5. Click "Open the workspace". Expect direct land on
#    /app/board?welcome=venue&v=lambs-hill with NO intermediate
#    /welcome render. Network tab should show one 200 on /app/board.
#
# 6. Confirm the "Compliments of Lamb's Hill" welcome card is
#    visible at the bottom of the board.
#
# 7. Confirm the wedding template tasks are populated.
#
# Then verify the operator surface picked it up:
cd ~/Projects/personal/studio
pnpm partner:digest lambs-hill
# Expect: "1 couple has redeemed", reached_board_at populated.
#
# And visit https://signalstudio.ie/hq/partners (HQ-gated) — Lamb's
# Hill row should show codes_issued / redeemed / active_30d / most
# recent timestamp.
```

### Gate 3 · Finalize DKIM in Google Workspace Admin Console

`dig +short TXT google._domainkey.signalstudio.ie` returns empty on
2026-05-14. DKIM signing is not yet enabled — emails from
`hello@signalstudio.ie` will be sent unsigned, which lands the first
batch in Gmail Promotions or Spam for many couples.

```
1. Google Workspace Admin Console → Apps → Google Workspace → Gmail →
   Authenticate Email → Select domain "signalstudio.ie"
2. Click "Generate New Record" → 2048-bit, selector "google"
3. Copy the TXT value (long string starting with v=DKIM1; k=rsa; p=...)
4. Publish the TXT record:
   - Host:   google._domainkey
   - Type:   TXT
   - Value:  <paste from step 3>
   (DNS is on Vercel — add via Vercel dashboard → signalstudio.ie →
   DNS Records → Add → TXT.)
5. Wait ~30 minutes for propagation. Re-run:
   dig +short TXT google._domainkey.signalstudio.ie
   The value should match what you copied in step 3.
6. Back in Admin Console → Authenticate Email → click "Start Authentication"
   to enable signing for outgoing mail.
```

### Gate 4 · Operator test send to your own inbox

Before pasting Sinéad's address into the To: line, send the same email
to `ethanmcn2013@gmail.com` from `hello@signalstudio.ie`. Open it in
Gmail and confirm:

- DKIM passes (Gmail "Show original" → DKIM: PASS).
- Plain text renders, no HTML chrome.
- The inline code list is readable in mono.
- No spam-folder routing.

If the test send lands in Promotions, give it ~12h after Gate 3 to
fully propagate before retrying. If it still lands in Promotions, send
the first batch from your personal Gmail with a one-line note that
hello@ is the reply address — pragmatism beats deliverability theatre
for n=1.

---

## After all gates clear — the send itself

### Subject

> Couples at Lamb's Hill now get Signal Studio free for the year

### Body (paste-ready)

```
Hi Sinéad,

Here's what we promised. Ten redemption codes for couples booking
their wedding at Lamb's Hill — each one gets them a year of Signal
Studio (tasks, notes, a shared timeline, a daily briefing of what
needs attention next), with your compliments. There's no cost to
the couple and no cost to you. The year of access is on us.

How it works on your side.

Each code is single-use. One code per couple. Don't paste the same
one into two emails.

They redeem at signalstudio.ie/redeem/<CODE>. Their workspace
activates the moment they sign up. Twelve months from then.

We don't see who you give them to. The CSV stays on your side.

When you'd like to send one, here's a template you can lift. It's
written to sound like you, not like us.

---

Subject: A year of Signal Studio, on us

Hi [first name],

A small gift from Lamb's Hill. A year of Signal Studio for your
wedding planning. Quiet, plain-English software for the work of
getting married. Tasks, notes, a shared timeline, a daily briefing
of what needs attention next.

Your code below. Yours alone, activates once.

Code: [CODE]
Open: signalstudio.ie/redeem/[CODE]

Reply with any questions.

Sinéad
Lamb's Hill

---

The ten codes.

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

A few practical notes.

If a couple writes back with a question about the software, they
can reply to you and you can forward to me, or point them straight
at hello@signalstudio.ie. Either works.

Two weeks from now I'll check in to see how it's going. What
worked, what felt off, whether the template needs a different
shape for your couples. Honest read appreciated, including if the
answer is "they didn't bite."

If you'd like another batch later, just say. I can mint them in a
minute.

Thanks for being the first venue to try this. The whole point of
running it small is to learn from real couples before scaling, so
anything you notice, please pass on.

Ethan
```

### Calendar reminders (set the moment you hit send)

- **Day 7 — 2026-05-22** — light-touch check-in. *"How's the first
  batch landing? Any couples redeem yet?"*
- **Day 14 — 2026-05-29** — retro check-in + start writing
  `studio/docs/CYCLE_8_5_LAMBS_HILL_RETRO.md`.

---

## Codes minted (audit trail)

- Sponsor: Lamb's Hill (`lambs-hill`)
- Tier: wedding (Tasks-side) / venue_edition (studio source_type)
- Duration: 365 days per code
- Quantity: 10
- Dual-written: studio `license_codes` (audit) + tasks `comp_codes` (runtime)
- Mint date: 2026-05-13
- CSV: `signal-growth/outbound/lambs-hill-batch-1.csv`

Three additional LAMBSHIL test codes from Cycle 8.2 (`LAMBSHIL-MP93X`,
`LAMBSHIL-7U2DF`, `LAMBSHIL-M52XX`) are seeded-test stock — never
included in Sinéad's batch. As of the 2026-05-14 walk, MP93X is
exhausted, 7U2DF is redeemed, M52XX is claimable.

---

## Why this shape

- **Plain-text email to Sinéad.** Same register as the couple-facing
  template. Anything else reads as marketing-pretending-to-be-human,
  which is the trap.
- **"There's no cost to the couple and no cost to you."** Restates the
  actual ask in case her assumption is different. Cheap insurance.
- **Code list inline, not just CSV.** Sinéad copies one at a time per
  couple. An attachment forces a tab switch she doesn't need. CSV
  stays attached for her own tracking.
- **Two-week check-in by name, not "we'll be in touch."** Concrete
  date is a real commitment. PM voice would say "circle back."
- **"Honest read appreciated, including if the answer is 'they didn't
  bite.'"** Invites the failure-mode response we need most. Sponsor
  relationships rot fastest when the principal is afraid to say it
  isn't working.

---

## What this draft deliberately does not do

- No Signal Studio logo, no HTML header. Plain text wins trust at this
  scale.
- No FAQ pre-empt list. Sinéad will surface the questions her couples
  actually ask.
- No "exclusive" or "limited time" framing. The program is small
  because it's a pilot, not because of scarcity theatre.
- No tracking pixel, no link-shim domain. Couples redeem at
  `signalstudio.ie/redeem/<CODE>` directly — no `t.signalstudio.ie/r/?u=...`
  middleware. The CSV is the source of truth for who has a code; we
  measure redemptions through Tasks's DB.

---

## Voice notes (BRAND.md §3 register)

- Declarative. Periods, not em-dashes or colons mid-sentence.
- No exclamation marks. Anywhere.
- Plain English at ~7th-grade reading level.
- "Quiet, plain-English software for the work of getting married" is
  the load-bearing sentence in the couple-facing template. Tested
  against the §3 banned list (no "AI," "intelligent," "seamless,"
  "transform," "stakeholder," etc.) — clean.
- "Activates once" pre-empts the per-couple confusion in fewer words
  than a paragraph would.
- "Sinéad / Lamb's Hill" sign-off is hers, not ours. Borrowing it once
  is the whole point of the Venue Edition motion.
