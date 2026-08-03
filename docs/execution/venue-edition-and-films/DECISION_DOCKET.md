# DECISION DOCKET — Venue Edition and Films (VEF-2026)

> **STATUS 2026-08-02: Round 1 answered in full.** All 29 questions below were
> answered by the founder and recorded as D-008 to D-015; the tasks moved to
> Ready. Three follow-on conflicts were raised and closed as D-016 (no
> solicitor), D-017 (25 per cohort, not 50) and D-018 (no physical letters,
> digital venue packs). The baseline was approved as D-019.
>
> **Round 2 is now the live section**, and E02.12 (FD-03, the entitlement model)
> is in flight, returning as a choice rather than a question. This document is
> kept as written so the original questions and recommendations stay legible
> next to what was decided.

Every task in the 211-task backlog classified by **how it gets decided**, and
every question that is genuinely yours pulled out with a recommendation attached.

Created 2026-08-02. Regenerate the task lists with:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs status decisions
```

| Class | Count | What it means |
|---|---|---|
| `founder_only` | **39** | Only you can answer. Not derivable from code, research or precedent. |
| `founder_choice` | **17** | I bring 2–3 options with a recommendation. You pick. Not a question today. |
| `execution` | **155** | I or Codex do the work. You approve the result at Founder Review. |

Of the 39: **29 are answerable now**. 10 need work from me first, and asking
them today would get you a guess instead of a decision.

**How to answer:** reply with the exceptions only. "Round 1 as recommended
except E02.02, E10.01, E11.06 — here's what I want instead." Anything you skip
stays open, it does not default through.

---

# ROUND 1 — answerable now (29)

## Pack A · Governance (4)

**E01.04 · Scope exclusions.** Are internal venue operations, full-scale
schools, full-scale students and unrelated product expansion the complete
exclusion list?
→ **Recommend:** yes, plus one addition — *no bespoke development for individual
founding venues* (it is the most likely way this project quietly doubles).

**E01.06 · Epic lanes.** Claude Code: E01, E04–E10, E12. You: E02, E03, E11,
E15. Codex: E13, E14. External: E03.12.
→ **Recommend:** accept, with one change — **E11 drafting moves to Claude, you
keep execution.** Writing 15 sales assets is not the best use of the one
constraint in this project.

**E01.11 · The six freeze dates.** Offer-freeze, UI-freeze, copy-freeze,
capture-freeze, film-lock, release-candidate.
→ **Recommend:** offer 15 Aug · UI 20 Aug · copy 21 Aug · capture 22 Aug ·
film-lock 28 Aug · RC 30 Aug. These are aggressive and only hold if you answer
Round 1 this week. Tell me if you want them relaxed and I will move the release
definition rather than pretend.

**E01.12 · Weekly operating review.** Which day and time?
→ **Recommend:** Friday morning, folded into the existing Friday brief rather
than a new ritual.

## Pack B · The offer (6 of 11 — the rest are in Round 2)

**E02.01 · Ratify the founding offer.** 25 venues at €1,000 against a €1,500
standard. This reverses the Active 2026-07-11 decision (15 venues locking
€1,500, which explicitly argued *against* a founding discount).
→ **Recommend:** ratify as stated, and let me supersede the 2026-07-11 decision
file and version `commercial-terms.v1.json` in the same change. **This one
question unblocks 11 tasks and every commercial surface.** Nothing commercial
should be written until it lands.

**E02.02 · Price-reduction wording.** "€500 founding saving", "one-third
founding rate", or "33.3% founding reduction".
→ **Recommend:** **"€500 a year less, for as long as you stay."** Concrete beats
fractional, and "33.3%" reads like a supermarket. A venue owner does arithmetic
in euro, not percentages.

**E02.03 · What the €1,000 lock covers.** Base annual Venue Edition agreement
only, and for how long?
→ **Recommend:** base agreement only, locked for as long as the agreement
renews continuously without lapse. Avoid "for life" and "forever" — the same
trap already caught the €1,500 lock and is recorded in `commercial-truth.md`.

**E02.05 · Change of control.** What happens to the rate on venue sale,
acquisition, operator change, rebrand, merger or relocation?
→ **Recommend:** the rate follows the *property*, not the company, and survives
rebrand and ownership change while the agreement runs continuously. It does not
transfer to additional properties a new owner brings. Simple to explain, hard to
game.

**E02.09 · The founder-access benefit.** How much of your time is it worth?
→ **Recommend:** one 30-minute call per venue per year, plus a named email
route. Not standing access. This is the benefit most likely to eat your calendar
at 25 venues — 25 unbounded relationships is a full-time job.

**E02.10 · Programme terminology and numbering.** What is it called, and when
does a venue get its number?
→ **Recommend:** "Founding 25". Number assigned **on payment**, not on signature
— it is the only event that cannot be walked back, and it makes 01/25 mean
something.

**E02.11 · Founding-place holds.** How long is a place held before it expires?
→ **Recommend:** 14 days from proposal, once, extendable by you personally.
Long enough to be fair, short enough to be real.

## Pack C · Legal and lifecycle (4 of 6)

**E03.07 · Rights you ask for.** Venue logos, venue photographs, couple
photographs, film assets, public case-study material.
→ **Recommend:** ask venues for logo and name usage in the founding programme
and on the map. Ask couples for **nothing** by default — couple photographs stay
theirs, and any case-study use is a separate, specific, opt-in permission. The
trust story does not survive a rights grab in the terms.

**E03.08 · The couple access term.** Today's shipped answer is 18 months from
redemption, dropping to Free, and it is already migrated in code. The backlog
asks for a term relative to activation and wedding date instead.
→ **Recommend:** keep **18 months from redemption** as the commercial term, and
add "or 3 months past the wedding date, whichever is later" as a grace rule.
Keeps the shipped implementation, fixes the case that actually hurts — a couple
who redeems early and marries at month 20.

**E03.09 · Keepsake mode.** What it is, and what it never promises.
→ **Recommend:** free, read-only, indefinite *access while the service exists*,
with a one-click export the couple owns. Never the word "forever", never a
storage guarantee. The export is what makes the promise honest.

**E03.12 · The Irish legal and accounting review.** Who, when, what budget?
→ **No recommendation on who — that is your relationship.** On timing: commission
against **drafts, in the week of 11 August**, not against finals. This is the
single longest external lead time in the project and it gates the legal gate.

## Pack D · Product and privacy boundaries (3)

**E04.09 · Which wedding dates the venue may see.** The venue is the wedding
venue, so it already knows the date. The question is what the *portal* shows.
→ **Recommend:** show the wedding date only where the couple redeemed a code
from that venue, and never show date *changes* — a postponement is the couple's
news to share, not a dashboard event.

**E06.08 · Signal Studio attribution on a public keepsake.** How visible are we
on something that should feel like the couple's?
→ **Recommend:** one line in the footer, no logo, no badge, no "powered by" in
the viewport. The venue gets equal restraint. If it reads as marketing on
someone's wedding page, we have lost the thing we are selling.

**E07.12 · Small-cohort suppression thresholds.** Today's Phase A contract says
behavioural counts need ≥3 sponsored workspaces, percentages need ≥5.
→ **Recommend:** keep 3 and 5. They are already documented, already defensible,
and raising them makes early venues' portals empty, which is its own problem.

## Pack E · Demo and market (4)

**E09.06 · The canonical demo story.** Glenmara House, Mara and Finn.
→ **Recommend:** approve as-is. It already exists across the repo, it is
synthetic, and changing it means rebuilding fixtures across four products plus
the portal. Confirm you are happy with the names.

**E09.08 · Photography budget.** Licensed demonstration photographs for the
Timeline, the films and every commercial page.
→ **Recommend:** a ceiling you set. My estimate is €300–€600 for a coherent
licensed set. Free stock will read as free stock on a wedding keepsake, which is
the one place it cannot.

**E10.01 · The Greater Limerick boundary.** The public term and the exact edge.
→ **Recommend:** a 45-minute drive-time ring from Limerick city centre, described
publicly as "Limerick and the surrounding counties". It captures Clare, north
Kerry and east Limerick honestly and it is the same geometry the film map needs
(E13.03), so one decision serves both.

**E10.02 · Eligible venue types.** Who is in, and who is explicitly out.
→ **Recommend:** in — dedicated wedding venues, country houses, castles, hotels
with a real weddings operation, barn and estate venues. Out — restaurants,
pubs, marquee hire, town hotels doing occasional weddings, and anywhere under
roughly 20 weddings a year. Below that volume €1,000 a year cannot be justified
to them honestly, and a venue that cannot justify it will not renew.

## Pack F · Outreach (6)

**E11.03 · Weekly capacity.** How many venues can you personally run in a week,
end to end?
→ **No recommendation — this is your calendar.** For calibration: 25 venues at
one discovery call, one demo and one proposal each is roughly 40 hours of live
contact, before travel. Tell me the real number and the cohort cadence follows
from it.

**E11.04 · Sending identity and tracking.** Which domain, and do you track opens
and clicks?
→ **Recommend:** send from `signalstudio.ie` (DKIM is already pending in
`docs/DKIM_SETUP.md` and gates this). Track **link clicks on the personalised
film only**, no open pixels. Open tracking on a cold B2B email to 25 people you
want a trust relationship with is a bad trade.

**E11.06 · Physical and in-person.** Letters, leave-behinds, and driving to
venues?
→ **Recommend:** yes for Cohort 1 only, and treat it as the differentiator it
is. 25 letters is a day's work and a real advantage over an inbox. Say if you do
not want to drive and I will restructure E11.06 around post only.

**E11.13 · The stopping rule.** How many touches before you stop?
→ **Recommend:** film, then two follow-ups, then a final short note, then stop
and mark `later`. Four touches over three weeks. Then leave them alone — a
founding programme that pesters is not a founding programme.

**E11.14 · Slot holds, expiry, referrals, publicity.** Proposal expiry,
payment-to-lock, close-lost reasons, referral asks, publicity consent.
→ **Recommend:** proposal expires with the 14-day hold (E02.11); the place locks
on payment; ask for a referral only after the venue's first couple activates,
never at signature; publicity consent is always separate, opt-in and revocable.

## Pack G · Film (2)

**E14.13 · Price in "Before the Day".** Where does the €1,500/€1,000 appear, if
at all?
→ **Recommend:** **not in the film.** End on the walkthrough CTA. The film's job
is to make a venue owner want the conversation; the price belongs on the
proposal page where it can carry its conditions. Price on screen invites
arithmetic during the emotional beat.

**E15.13 · The custom-request line.** Where do you draw it on founding-venue
requests?
→ **Recommend:** requests are logged and shape the roadmap; nothing is built for
one venue. Say it explicitly in the Benefits Charter (E02.08) so the boundary is
a documented benefit, not a refusal later.

---

# ROUND 2 — I need to do work first (10)

Asking these today gets you a guess. Each says what unblocks it.

| Task | Question | Unblocked by |
|---|---|---|
| E02.04 | Missed payment, cancellation, lapse, reactivation | A contract draft (E03.02) to react to |
| E02.06 | What sits outside the locked base price | Same draft |
| E02.07 | Invoice timing, renewal notices, refunds | Same draft, plus the accountant's VAT view |
| E02.12 | Entitlement model and unit economics at €1,000 | I model cost per venue at 20/40/80 couples first |
| E03.10 | Venue change, separation, non-renewal, ownership | I enumerate the edge cases (E04.11) first |
| E03.11 | Retention, deletion, legal basis for cold outreach | The legal review (E03.12) |
| E07.04 | Ratify the adoption-funnel definitions | I propose definitions (E09.02) first |
| E07.07 | What replaces the 40/80 allotment language | Follows E02.12 |
| E13.09 | Founding-rate-lock language for voiceover | Follows E02.03 and the legal review |
| E15.01 | The go/no-go itself | At the gate, on evidence |

---

# MY OWN QUESTIONS (6)

Not backlog tasks. Things I need from you that the backlog does not ask.

**Q1 · What does "release on 1 September" actually mean?** The imported critical
path is 120 tasks and there are 30 days. My reading: 1 September means *ready to
contact Cohort 1*, and the Founding 25 completes over the following months.
→ **Recommend:** confirm that reading, or move the date through a change record.
Do not let the date decide by arriving.

**Q2 · Should the first pass over E04–E12 be an audit, not a build?** There is
substantial existing work — Venue Portal Phase A contracts, entitlements, access
migrations, redeem and invite routes, venue strategy documents, a metric
dictionary. None is founder-approved against this project's criteria, so none is
Done, but much of it may be most of the answer.
→ **Recommend:** yes. **This is the single largest lever on the 120-task
critical path.** One audit pass converting existing work into evidence could
retire a meaningful share of E04–E12 without building anything.

**Q3 · Estimation.** Estimate all 211 now, estimate progressively as specs are
written, or accept count-based reporting for the project?
→ **Recommend:** progressive. Estimating 211 titles in one sitting produces
confident numbers with nothing behind them.

**Q4 · Venue Portal or Signal Studio Account?** All 18 E07 tasks say "Venue
Portal". The repo says the customer-facing model became "Signal Studio Account",
founder-approved 25 July 2026, with `/hq/venue-portal-review` now redirecting.
→ **Recommend:** tell me whether that 25 July decision stands. If it does, E07's
titles keep their words but the surface is the Account, and I record it rather
than quietly renaming 18 tasks.

**Q5 · Total budget ceiling.** Legal and accounting review, photography, music
and sound licensing, print. Roughly €1,500–€3,000 all in, depending on the
solicitor.
→ **Recommend:** give me a ceiling I stop at without asking, and I will flag
anything above it.

**Q6 · Codex capacity for both films.** E13 and E14 are 36 tasks in the motion
lane, including a data-driven map system and a 25-render personalisation
pipeline.
→ **Recommend:** Codex takes the creative; **I take the parameterised render
pipeline and the map data** (E13.04, E13.15, E13.16), which are engineering
wearing a film costume. Confirm or tell me to leave the whole lane alone.

---

## What happens when you answer

1. I record each answer in `DECISIONS.md` with its D-number.
2. Anything that changes the offer, the term or the Keepsake promise also gets a
   change record and supersedes the conflicting 2026-07-11 decision file and
   `commercial-terms.v1.json` — properly, not silently.
3. Answered tasks move to Founder Review, and you approve them in one pass. That
   is roughly **29 of 211 tasks closed by one message.**
4. The baseline stops being Draft, and real percentages start meaning something.
