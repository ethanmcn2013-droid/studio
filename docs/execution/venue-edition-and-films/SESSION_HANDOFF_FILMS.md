# Film session prompts — E13 and E14

Written 2026-08-04. Two separate sessions, one per film. **Both use `/panel` to grade
script and structure before anything is animated**, which is the point: a film you have
already storyboarded is expensive to re-cut, and both of these carry claims that a wrong
frame turns into a false statement to a venue.

Run them in **separate sessions**. They share a motion language (E13.02) but they are
different films with different audiences, and one session doing both will average them.

**Before either starts, know this:** these are the **Codex motion lane** under the
workspace contract. If Codex is running its own work on `signal-motion`, these sessions
must not undo it. Both prompts say so.

---

## Session A — E13 · Limerick First, the personalised venue invitation

```
You are running WP-20 on the Venue Edition and Films programme (VEF-2026): E13, the
"Limerick First" film. Fourteen tasks, E13.01 through E13.18 (E13.03, .04, .15, .16 are
already Done — the map system and render pipeline).

WHAT THIS FILM IS
A 35-45 second PERSONALISED invitation. Twenty-five versions, one per Cohort 1 venue. It
opens on the Greater Limerick map, animates all 25 cohort pins while keeping every venue
anonymous EXCEPT the recipient, highlights that one venue by name and location, states the
offer, and ends on the ask. It is the first thing a founding venue ever sees from Signal
Studio. It arrives cold.

START HERE
Read, in this order:
  studio/docs/execution/venue-edition-and-films/HANDOFF.md
  studio/docs/execution/venue-edition-and-films/PROJECT.md
  studio/docs/execution/venue-edition-and-films/DECISIONS.md — D-009, D-014, D-016, D-020,
    D-021, D-022, D-033, D-034, D-035
  studio/docs/execution/venue-edition-and-films/RAID.md — R-020, R-042, I-014
  studio/docs/execution/venue-edition-and-films/evidence/E09.11-copy-system.md — the
    approved copy system. §4.1's four permitted forms of the founding-rate lock are the
    canonical set. Use them verbatim.
  studio/docs/execution/venue-edition-and-films/evidence/E09.10-copy-hierarchy.md §6 — the
    four pre-approved answers to the questions venues ask.
  studio/docs/execution/venue-edition-and-films/evidence/E13.16-link-and-destination-contract.md
Then run /venue-briefing and open with --id=wp20-limerick-first.

THE POSITION EVERY FRAME MUST CARRY CORRECTLY
EUR 1,500 standard, EUR 1,000 for the Founding 25, both INCLUSIVE of VAT at the prevailing
rate. The founding rate is "EUR 500 a year less". The lock holds while the agreement
RENEWS CONTINUOUSLY — never "for life", "forever", "in perpetuity", "locked forever".
Numbers 01/25 to 25/25 assigned on CLEARED PAYMENT, not on signature. Fourteen-day hold.
Every couple with a booking, no seat count anywhere. Access term is eighteen months from
redemption OR three months past the wedding, whichever is LATER — never a flat eighteen
months.

The programme is the FOUNDING 25. A member is a FOUNDING VENUE. "Founding partner" was
retired by D-033 (R-042) — "partner" implies standing D-009 does not grant. If you find it
anywhere in the motion assets, it is a defect.

E13.08 IS THE DANGEROUS TASK. It animates EUR 1,500 down to EUR 1,000 and tests wordings
like "EUR 500 less" and "one-third off". A price animation that lands on a number without
its VAT-inclusive qualifier, or that implies permanence through motion rather than words,
is a false statement made visually. Motion can imply permanence — a lock closing, a seal
stamping, a number freezing — and E09.11 §4.1's wording rules govern the IMAGE as well as
the voiceover. Design the price sequence so the qualifier is on screen with the number, not
in a later frame.

E13.09 is the legally safe founding-rate-lock language for voiceover and on-screen. D-016
is a hard stop: nothing may state or imply legal approval, solicitor review, accountant
verification or unqualified GDPR compliance.

E13.05 keeps 24 of 25 venues ANONYMOUS while the recipient is named. Get this wrong and you
have shown a venue its competitors' names on a pin map. Treat the anonymity as a privacy
control, not a design choice, and prove it in the render QA (E13.17).

HOW TO WORK — THIS IS THE PART THAT MATTERS
1. START WITH THE SCRIPT AND STRUCTURE. E13.07 (the 35-45 second script and on-screen copy)
   and E13.10 (storyboard and frame-level motion plan) come before any animation. Nothing
   gets rendered until the script is graded.
2. RUN /panel ON THE SCRIPT AND STRUCTURE BEFORE ANIMATING. Convene at least: brand voice,
   motion, typography, and a commercial-accuracy seat that checks every claim against the
   ratified position. Bar: 9.5, "built by an award-winning studio and iterated for months".
   Remediate and re-review until every seat passes or the panel reports honestly why it
   cannot.
3. THEN /panel THE ANIMATIC (E13.11) before the final motion (E13.14).
4. Only then render. E13.17 renders and manually QAs all 25 videos; E13.18 prepares the
   Cohort 2-4 templates and archive structure.
5. Where a creative direction is genuinely open, run /lab and bring options rather than
   picking. Do not pre-shrink the ambition — include the bolder option.

LANE DISCIPLINE
This is the Codex motion lane. Work in signal-motion. Do NOT undo or rewrite in-flight
Codex work — check `git status` and recent commits before you touch anything, and if a file
is dirty under another session, leave it and say so.

WHAT COMES BACK
ONE consolidated recommendation packet (D-024):
  node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs packet E13 --write
  node studio/docs/execution/venue-edition-and-films/tools/verify-evidence.mjs E13
Move every task to Founder Review. MARK NOTHING DONE — approval is Ethan's and is explicit.
Push your branch; do not merge. Close with /venue-close and --id=wp20-limerick-first.
```

---

## Session B — E14 · Before the Day, the Venue Edition film

```
You are running WP-21 on the Venue Edition and Films programme (VEF-2026): E14, the
"Before the Day" film. Seventeen tasks, E14.01 through E14.18.

WHAT THIS FILM IS
A 60-75 second film about the product, not the offer. Its arc runs from fragmented planning
— messages, email, phone notes, journals — to one calm sponsored workspace. Its central
insight, which E14.04 must lock: THE WEDDING HAPPENS AT THE VENUE, BUT THE COUPLE PLANS IT
EVERYWHERE ELSE. It follows ONE wedding decision (E14.05) travelling through Notes, Tasks,
Timeline and Signal, shows the venue-branded welcome, and ends on the privacy boundary and
the Venue Portal as the quiet trust layer.

START HERE
Same reading list as Session A, plus:
  studio/docs/execution/venue-edition-and-films/evidence/E05.01-couple-journey-map.md
  studio/docs/execution/venue-edition-and-films/evidence/E05-E06-audit.md
  studio/docs/execution/venue-edition-and-films/evidence/E12.07-venue-privacy-page.md
Then /venue-briefing, open with --id=wp21-before-the-day.

THE RULE THAT GOVERNS THIS FILM, AND IT IS DIFFERENT FROM E13's
E14.15 says: produce the product-capture plan and record ONLY AFTER the UI, copy and data
are final. This film shows the actual product. Every frame is a claim that the product looks
and behaves that way.

So before you capture anything, verify what actually ships. The programme has repeatedly
found the record ahead of the code, and a film is the most expensive place to discover it:
 - The KEEPSAKE DOES NOT EXIST in the app. `grep -rni keepsake` returns zero. E14 must not
   show a Keepsake screen.
 - There is NO VENUE-AUTHENTICATED ROUTE (R-043). The Venue Portal has no venue login. If
   E14.12 shows a venue signing in to a portal, it is showing something that does not exist.
   Show what does: Signal HQ administering, and the venue receiving evidence.
 - The couple's SEARCH-VISIBILITY OPT-IN has no storage yet (R-031, D-033). Wedding
   workspaces are noindex by default and that default is currently the whole behaviour.
 - The ACCESS TERM is max(redemption + 548 days, wedding date + 90 days) — but R-015 records
   that no wedding date reaches that rule in production today, so every couple currently
   lands on the 548-day floor. Do not animate a term the product does not compute.
 - The venue-branded welcome (E14.11) is E05.02, which is FOUNDER-CREATIVE and not yet
   built. Confirm its state before designing a sequence around it.
Any capability not yet built must be stated as not yet built (D-016), and the cleanest way
to honour that in a film is not to show it.

WHAT THE FILM MUST NEVER SHOW
The venue seeing private couple planning content. Not Notes, not Tasks, not an unpublished
Timeline, not a briefing. That boundary is the thing being sold, and E14.12 should make it
legible as a selling point rather than a disclaimer. Venue branding is the VENUE NAME ONLY,
said once, quietly — not a logo, not a colour, not a message the venue writes.

The couple never sees a price (D-001).

HOW TO WORK
1. SCRIPT AND STRUCTURE FIRST. E14.01 the creative brief, E14.02 the narrative arc, E14.04
   the central insight, E14.05 the one decision that travels. These four decide whether the
   film is good. Nothing is captured until they are graded.
2. RUN /panel ON THE SCRIPT AND STRUCTURE BEFORE ANY CAPTURE. Seats: brand voice, narrative
   or story structure, motion, typography, product accuracy (checks every shown screen
   against what ships), and privacy (checks no frame implies the venue sees planning
   content). Bar 9.5. Remediate and re-review until every seat passes.
3. THEN /panel the storyboard and animatic (E14.14) before capture (E14.15).
4. Only then capture and edit: E14.06 Notes, E14.07 Tasks, E14.08 the Timeline hero and the
   map-pin-to-milestone transition, E14.09 the "We said yes" through wedding-day beats,
   E14.10 the Signal briefing, E14.16 sound and edit, E14.17 masters and captions, E14.18
   final brand, product-accuracy, privacy, audio, caption and encoding QA.
5. Run /lab where a direction is genuinely open. Include the bolder option.

LANE DISCIPLINE
Codex motion lane, signal-motion. Do not undo in-flight Codex work.

WHAT COMES BACK
ONE packet (D-024): packet E14 --write, then verify-evidence E14. MARK NOTHING DONE. Push;
do not merge. Close with /venue-close and --id=wp21-before-the-day.
```

---

## Why both prompts front-load `/panel`

E13 and E14 fail in opposite directions and the panel catches each.

**E13 fails commercially.** It is 25 personalised videos carrying a price, a lock and a
number. A wrong frame is a false statement to a venue that has not spoken to anyone yet,
replicated 25 times, and a re-render is cheap only before the storyboard is locked.

**E14 fails factually.** It shows the product, and this programme has repeatedly found the
written record ahead of the running code — a Keepsake that does not exist, a venue portal
with no venue login, an access term nothing computes. A film that shows those is a promise
the product cannot keep, and it is the single most expensive artefact to correct after the
fact.

In both cases the cheapest moment to find the problem is in the script, which is why the
panel runs there and not at the animatic.
