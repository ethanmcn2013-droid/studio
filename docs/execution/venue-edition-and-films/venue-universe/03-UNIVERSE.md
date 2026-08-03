# The venue universe, and the market shortfall — E10.04, E10.05

**Status:** Founder Review · **Written:** 2026-08-03 · **Executor:** Claude Code
**Ratified input:** D-012 (geography, eligibility), D-017 (cohorts), D-020 (no volume screen)
**Risk raised:** R-038

E10.04 asks for a master researched universe of at least 125 accounts, **or a
formal document of the market shortfall if it does not exist.**

It does not exist. This is that document.

---

## 1. The number

| | |
|---|---|
| Raw records gathered across eleven research sweeps | **376** |
| Unique accounts after deduplication | **219** |
| Inside the ratified 45-minute ring | **70** |
| Inside the ring, an eligible venue type, not closed or sold | **50** |
| Inside the ring, eligible, **and confirmed trading** — the real number | **43** |
| — held pending a trading check | 7 |
| In the 45–60 minute band, eligible and trading (**not** in the market) | 16 |

**The contactable universe inside the ratified geography is 43 accounts, not
125.** With the 45–60 band added it would be 59. Neither reaches the target, and
neither is close.

The gap between 50 and 43 matters as much as the headline. Seven in-ring accounts
cannot be contacted until someone checks whether they are still trading — and of
six suspected closures put to a dedicated verification pass, **six were
confirmed**, including a lakeside estate closed for seven years whose website
still sells weddings.

### By county and type, inside the ring

| County | | Type | |
|---|---|---|---|
| Limerick | 27 | Hotel with a real weddings operation | 33 |
| Clare | 19 | Castle | 8 |
| Tipperary | 7 | Country house | 8 |
| Cork (Charleville only) | 1 | Estate | 3 |

Two things are worth noticing. The market is **hotel-dominated**, which shapes who
the Founding 25 can realistically be — no cohort built from this ring will not be.
And **north Tipperary and north Cork are nearly empty**: eight accounts between
them.

## 2. Why this is a finding and not a failed search

The instinct on seeing 43 is that the research was not thorough enough. The
negative results are the strongest part of this document, so here they are.

**Eleven independent sweeps, deliberately using different methods** so that no
single blind spot could hide a segment: four by county, one by venue type, one by
directory, one by awards and press, one over the existing repository, one
village-by-village, one over historic houses and Section 482 properties, and one
over the statutory planning registers.

**The village belt is empty.** A dedicated pass checked 61 named villages across
east and mid Clare, county Limerick and north Tipperary. **39 returned no wedding
venue at all.** Seventeen more contained only venues already found. Bruff, Croom,
Hospital, Caherconlish, Doon, Cappamore, Askeaton, Kildimo, Newport, Birdhill,
Silvermines, Tulla, Scariff, Broadford, Crusheen and Kilmaley have none between
them.

**The socials-only theory did not hold.** A pass specifically hunting venues that
market on Instagram and Facebook and appear in no directory found none inside the
ring. Every social account that surfaced belonged to a venue already in the
universe, or to a supplier rather than a venue.

**The barn segment does not exist here.** weddingsonline's own type pages report
zero barn venues in Clare, two in Limerick and one in Tipperary — and then return
no results for all three. Every named Irish barn venue found sits outside the ring.
**Do not plan for a barn cohort in the Founding 25.**

**The premium country-house seam is four venues deep.** Ireland's Blue Book has
four eligible members in the entire catchment. Hidden Ireland currently has **zero
member houses in Limerick or Clare** — its only member inside the ring is a single
Nenagh house.

**The Section 482 hypothesis was tested and failed.** All six named Limerick
historic-house leads — Ash Hill Towers, Kilpeacon, Odellville, Mount Trenchard,
Glenville and Glebe House — run no weddings operation. The complete Revenue
Section 482 list for the three counties was worked from the official PDF, and
every property is accounted for as either a venue or a sourced negative.

**The one directory that blocked automated access adds nothing.** WeddingDates
returned HTTP 403 to every fetch, and it was recovered through a real browser.
It is a **paid-subscription directory carrying 19 to 26 listings per county**, not
a census. Cross-checked against the universe: **zero new in-ring accounts.**

## 3. What was NOT covered, stated plainly

- **The IHHA and Irish Georgian Society member lists** could not be reached —
  `ihha.ie` has an expired TLS certificate. This is the one source in the plan
  that remains unworked.
- **Council planning registers** were worked, in the end. All three counties
  publish through the national ePlan portal, whose description search is POST-only
  and had to be driven through a browser. Limerick returned **zero** wedding-venue
  applications in five years. That angle is now closed, and it closed downwards.
- **Regional press and supplier portfolios** (Limerick Leader, Clare Champion,
  Nenagh Guardian, photographer venue guides) hard-block automated fetch. A
  browser-driven pass over roughly five named URLs would likely add venues,
  weighted toward small independents.
- **The session-wide web-search budget (200 calls) was exhausted** partway
  through. Later sweeps worked around it with direct fetches and browser search,
  which produced stronger primary-source evidence but less breadth.

Best estimate of what a further pass would add: **five to fifteen accounts,
weighted toward small operations near the ~20-weddings floor.** That would take
the contactable universe to roughly 50–58. **It does not reach 125, and no
plausible amount of further searching does.**

The later sweeps are the evidence for that estimate. The village pass, the
historic-house pass and the planning-register pass between them added **seven new
accounts** to a universe of 212 — and each was aimed squarely at where undiscovered
venues were expected to be hiding. The returns had already flattened.

## 4. What the shortfall actually means

The cohort model is not broken. The arithmetic underneath it changes.

D-017 ratifies twenty-five founding places, twenty-five venues contacted per
cohort, released sequentially until twenty-five have signed and paid. Against 43
contactable accounts:

| | |
|---|---|
| Cohort 1 | **25 — fills** |
| Cohort 2 | 16, short by 9 |
| Cohort 3 | 2, short by 23 |
| Cohort 4 | none |

**One cohort fills. The second is two-thirds of a cohort, and the third is a
rounding error.** Forty-three sends is the entire addressable market.

That produces the number that matters:

> **Twenty-five founding venues out of 43 contactable accounts requires roughly a
> 58% conversion rate on cold email.**

For context, this is cold outreach to venue owners who have never heard of Signal
Studio, from a domain whose DKIM is still pending (R-010), asking for €1,000 a
year. A personalised film is a strong opener, but 58% would be an extraordinary
result — better than most warm inbound. If conversion lands at a more ordinary
10–15%, the ring yields **four to six founding venues, not twenty-five.**

**This is the real finding.** Not that the research came up short — that the
25-venue target and the 45-minute ring are in tension with each other, and one of
them has to give. That tension has existed since D-012 and D-017 were ratified;
it was simply invisible until the market was counted.

## 5. The options, costed

Every option here is change-controlled (`WORKFLOWS.md` §5), so none has been
actioned. Presented for approval or push-back.

**A — Widen the ring to 60 minutes.** Adds **16 contactable accounts** (universe
59, required conversion ~42%). Brings in Gort, Cashel, the Glen of Aherlow, Mallow and
Ennistymon. *Cost:* changes ratified geography (D-012), stretches the film map in
E13.03, and "Limerick and the surrounding counties" starts to strain when it
reaches Cashel and Mallow.

**B — Reduce the founding number.** Fifteen founding venues out of 43 needs ~35%
conversion; ten needs ~23%. *Cost:* changes the founding-25 model, which is on the
change-control list and is public-facing (`01/25` to `25/25` numbering). Worth
noting the superseded 2026-07-11 decision set fifteen, so this is a return to a
position the founder previously held rather than a new idea.

**C — Widen eligibility.** Admitting town hotels and restaurants with banqueting
would add accounts. *Cost:* D-012 excluded them for a stated reason — a venue that
cannot justify €1,000 will not renew — and it weakens the product story. **Not
recommended.**

**D — Smaller cohorts, more waves.** Cohorts of 15 across three waves reaches 45
sends. *Cost:* none to the model, but it does not create accounts. It reprofiles
the same 43 over a longer calendar and is a scheduling change, not a supply one.

**E — Accept two cohorts and let the data decide.** Lock Cohorts 1 and 2 from the
ring now, define Cohort 3 as the 45–60 band held in reserve, and decide the
geography question when Cohort 1's real conversion rate exists.

### Recommendation

**E, then A or B on evidence.**

Cohort 1 does not need this decision. It is fully buildable from the ratified ring
today, and the twenty-five best accounts are the same twenty-five under every
option. Deciding geography or the founding number now means deciding on an
assumed conversion rate; deciding after Cohort 1 means deciding on a measured one.
The information is four to six weeks away and it costs nothing to wait for it.

What that requires: **stop recording Cohorts 3 and 4 as though they exist.** They
are in `PROJECT_STATE.json` as cohort-ready flags, and E10.13 asks for all three.
E10.13 comes back **partially delivered by design** — Cohort 2 built, Cohort 3
defined as a contingent reserve, Cohort 4 reported as not existing.

## 6. The universe file

`private/venues.csv`, gitignored, generated by `venue-export.mjs`. Seventeen
columns exactly as `private/venues.template.csv` specifies, and **no contact
column of any kind** — contacts live in the CRM and join on `account_id`.

Account IDs are issued from a persistent ledger (`account-ids.json`) and are
never reused. Human decisions live in `overrides.json` and are reapplied after
every rebuild, so regenerating the universe cannot silently discard a judgement.

### Deduplication (E10.05)

157 duplicate records folded into 219 unique accounts. The matcher is
deliberately conservative — a false merge deletes a real prospect and nobody
notices, a false split shows up as two similar rows and is fixed in seconds.

It resolves in this order: an explicit "keep separate" instruction from a
researcher, which vetoes everything · identical name · shared website domain · a
researcher's positive identification · identical distinctive name key · then
token overlap, which only ever proposes.

That order was wrong at first and it mattered. The hints were checked before
everything else, so an *ambiguous* note — "almost certainly a directory data
error for the same Ennis property" — returned "not the same" and blocked two
records with an identical name and an identical domain from merging, leaving two
accounts sharing one CRM join key. The build now refuses to write a duplicate ID
at all.

Real cases it caught: **The Rine = The Inn at Dromoland = the old Clare Inn**, one
property under three names all still live in directories · **Killaloe Hotel & Spa
= the former Kincora Hall** · **The Dunraven, Adare = Dunraven Arms Hotel** ·
**Fitzgeralds Woodlands = Woodlands Hotel & Spa**. And two it correctly refused to
merge: **Bunratty Castle Hotel** and **Bunratty Castle & Folk Park** are different
businesses in one village, as are **Dromoland Castle** and **The Rine** on one
estate.

**Two pairs remain for human review**, down from twenty-eight before the matcher
was corrected and twelve pairs were confirmed by hand. Both are genuine judgement
calls and both sit outside the ring.

### Groups and multi-property operators

Four operators run more than one property in the universe, and **three of those
ties were recorded as independent by the first research pass** — found only when a
second pass read the group's own site. One of them, a six-property group, owns
three in-ring accounts including two of the largest.

This cuts both ways, and the packet says so: it drops decision accessibility for
all three, and it means one group conversation could land three founding venues at
once. This matters
operationally, not just tidily: **two properties of one group means one buyer
receiving two personalised films in the same week**, which is precisely the
impression a personalised film exists to avoid. The cohort builder enforces one
property per operator per cohort and defers the second, and a test holds it.

### Not confirmed trading

**41 accounts** are flagged, seven of them inside the ring. Several are live commercial traps: a lakeside estate
reported in receivership whose website still sells weddings, a hotel described in
its own sale listing as not trading that a 2026 blog still recommends, and a
500-capacity Ennis hotel stating on its own wedding page that it is not currently
taking wedding bookings. All are held out of every cohort until checked (R-040).

## 7. Reproducing it

```bash
node tools/venue-merge.mjs merge <discovery-dir> merged.json
node tools/venue-geo.mjs geocode merged.json geocoded.json
node tools/venue-geo.mjs drivetime geocoded.json routed.json
node tools/venue-rank.mjs compare routed.json compare.json
node tools/venue-rank.mjs cohorts routed.json <model> cohorts.json
node tools/venue-export.mjs csv routed.json ../private/venues.csv
node tools/venue-export.mjs report routed.json counts-only.md
```

`node --test tools/venue-universe.test.mjs` covers the rules whose failure is
expensive: no contact data reaching the tree, and no ranking model screening a
venue out by size.
