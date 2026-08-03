# The ranking model, and the choice inside it — E10.03

**Status:** Founder Review · **Written:** 2026-08-03 · **Executor:** Claude Code
**Ratified input:** D-020 (volume never affects price) · **Serves:** E10.12, E10.13, E10.14

E10.03 names five dimensions: wedding focus, brand quality, likely booking
volume, decision accessibility and strategic fit. Scoring them is the easy half.

The hard half is what the score is *for*, and that is a real founder choice, not
an implementation detail. So four defensible answers are built and the same
universe is ranked through all of them. **Nothing is picked here.**

---

## 1. The five dimensions

Each scores **0–5**, and **every score carries a written basis naming what was
seen**. A score without a basis is treated as unscored rather than zero — absent
evidence and bad evidence are different things, and collapsing them is how a
ranking quietly becomes fiction. The scoring tool reports each venue's
confidence as `full`, `partial` or `thin` accordingly.

| Dimension | The question it answers |
|---|---|
| **Wedding focus** | How central are weddings to this business? |
| **Brand quality** | How well regarded and how well presented is it? |
| **Likely volume** | Roughly how many weddings a year? |
| **Decision accessibility** | How few steps to the person who can say yes to €1,000? |
| **Strategic fit** | How badly does this venue need what Venue Edition is? |

### On volume, specifically

D-020 is unambiguous, in the founder's own words: *"I don't care if they have
forty weddings or if they have two hundred and fifty weddings. They're locked in
at a thousand."*

So volume **never excludes**. It moves rank in two of the four models and moves
nothing in the other two, and no model may drop a venue for its size. This is not
left to memory — `assertNoVolumeScreen` fails the build if any model loses a
venue from any volume band, and a test holds it against a fixture spanning every
band.

Worth stating plainly, because it is the uncomfortable half: the *Reference*
model deliberately ranks up on volume, and D-020 already accepts a permanent loss
of roughly €750 a year on a 250-wedding venue (R-021). That model therefore loads
the founding cohort with the loss-making accounts on purpose. That is a coherent
commercial judgement — reference value bought at a known price — but it should be
made knowingly.

### On volume data quality

**Almost no venue in the ring publishes a weddings-per-year figure.** Every
volume score is an inference from space count, a stated one-wedding-a-day policy,
bedroom count, review counts, and how many years of forward brochures a venue
publishes. Each inference is written into the basis. No volume figure is
presented as fact.

## 2. The four models

Each is a different answer to *what is Cohort 1 for?*

### Convert — the 25 most likely to say yes
> Founding places are only worth something once 25 are sold. Rank by probability
> of yes: reachable decision-makers who feel the problem. Get to 25 paid, then let
> the finished list do the reference work.

Weights decision accessibility and strategic fit hardest.

**Risk:** a founding 25 with no recognisable names is harder to sell against next
year, and the standard €1,500 then has to stand on its own.

### Reference — the 25 whose names make the next hundred easier
> The founding cohort is a marketing asset for years. Rank by signalling value:
> the flagships, the award-winners, the names a couple already knows.

Weights brand quality and volume hardest.

**Risk:** the slowest accounts to close, approached with untested copy — and it
deliberately concentrates the cohort in the venues that cost most to serve.

### Learn — a stratified 25 that tells you which segment converts
> Nobody knows yet which venue type buys this. Send 25 across every segment, then
> build cohorts 2, 3 and 4 on evidence instead of a guess.

Balanced weights, then a stratified pick that takes the strongest candidate from
each segment in turn before taking anyone's second.

**Risk:** optimises for neither speed nor prestige. If the founder needs 25 sold
rather than 25 understood, this is the wrong model.

### Map — the 25 that form one constellation *(the deliberately bolder one)*
> The founding cohort is the opening beat of the film (E13.03) and the proof of
> "Limerick and the surrounding counties". Twenty-five dots clustered tight read
> as a place that adopted this. Twenty-five scattered dots read as a list. And
> venues in the same cluster know each other, which is where referrals actually
> come from.

Balanced weights plus a cluster-density bonus.

**Risk:** deliberately passes over strong venues for being in the wrong place, and
concentrates the cohort so one bad regional reputation could travel.

**Why it is worth taking seriously rather than dismissing:** it is the only model
that optimises the *film* rather than the spreadsheet, and the film is the entire
channel (D-013). Every other model treats the map as an output. This one treats it
as a design constraint, which — given E13.03 and E13.17 exist — it arguably is.

## 3. What the models actually disagree about

`venue-rank.mjs compare` reports the overlap between each pair of top-25s, which
venues every model picks, and which are picked by exactly one.

**Where all four agree, there is no decision to make.** Those venues are in Cohort
1 under any model, and they can be worked on immediately without waiting for this
choice.

**Where exactly one model picks a venue, that is the decision**, expressed as
names rather than as weights. That list is the thing to read — arguing about
whether decision accessibility deserves a weight of 3 or 2 is not a founder's
time well spent; looking at six specific venues and saying "yes, those belong" is.

## 4. What is deliberately not in the model

- **Nothing about how much a venue can afford.** Every founding venue pays
  €1,000. Ability to pay is not a ranking dimension and would be a proxy for the
  size screen D-020 forbids.
- **No auto-generated fit sentence.** E10.11's sentence is written per venue and
  must fail if it could be sent to another venue unedited. A template that passes
  that test does not exist.
- **No composite "quality score" published to a venue.** These are internal
  research judgements. Several are unflattering and all are inferences.

## 5. Recommendation

**Convert for Cohort 1, then reassess with real data.**

The reasoning is the shortfall in `03-UNIVERSE.md`. With 56 eligible accounts and
25 founding places, the programme needs roughly a 45% conversion rate. At that
level, optimising the first cohort for anything other than probability of yes is
a luxury the arithmetic does not support. *Reference* and *Map* both spend
conversion on a second objective, and there is none spare.

Two qualifications, both material:

1. **The disagreement between models is smaller than it looks**, because the
   universe is small. Fifty-six eligible accounts and a 25-place cohort means
   roughly half the market is in Cohort 1 whatever model runs. The choice
   determines the order and the last handful of places, not the bulk.

2. **The Map model deserves a second look after Cohort 1**, not before. If the
   response rate is healthy, the constellation argument becomes affordable, and
   it makes the film materially better. If the response rate is poor, the
   geography question in `03-UNIVERSE.md` §5 has to be answered first anyway.

If the founder prefers *Reference* — a defensible instinct, since a founding list
led by the region's best names is a genuine asset — the honest cost is: slower
close, higher chance of ending the year short of 25, and a cohort weighted toward
the accounts that lose money under the price lock. Worth it or not is a founder
judgement, not a modelling one.
