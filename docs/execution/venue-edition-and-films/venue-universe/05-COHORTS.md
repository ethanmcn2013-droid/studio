# The cohorts — E10.12, E10.13, E10.14

**Status:** Founder Review · **Written:** 2026-08-03 · **Executor:** Claude Code
**Ratified input:** D-017 (25 at a time, sequential) · **Risk raised:** R-031, R-033

D-017 ratifies twenty-five founding places, twenty-five venues contacted per
cohort, released sequentially until twenty-five have signed and paid.

**Cohort 1 is built and fills to 25. Cohort 2 is built and comes up short.
Cohorts 3 and 4 do not exist inside the ratified ring.** That is reported here
rather than papered over, because a cohort padded from outside the ring would
quietly overturn D-012.

---

## 1. What a cohort is allowed to contain

A cohort is a **send list**, not a shortlist. Every account in it has to be
genuinely contactable on the day it is released, so three rules apply on top of
the ranking.

**One property per operator per cohort.** Two hotels in the same group means one
buyer receiving two personalised films in the same week — the exact impression a
personalised film exists to avoid. The second property drops to the next cohort;
it is never dropped from the universe. Four operators in this universe run more
than one property, and three of those ties were recorded as independent by the
first research pass and only found on a second look.

**Nothing unconfirmed goes in a cohort.** Any account whose trading status is not
confirmed is held in reserve until someone checks. Seven in-ring accounts are
currently held on this rule. It is not caution for its own sake — every one of
six suspected closures put to a dedicated verification pass came back
**confirmed**, including a lakeside estate that has been closed for seven years
while its website still sells weddings, and a hotel that ceased trading in
August 2025 with 48 job losses.

**Cohorts that do not exist are not invented.** A short cohort reports as short.

All three are enforced in `venue-rank.mjs` and covered by tests, so they hold on
a rebuild rather than depending on whoever runs it next.

## 2. Cohort 1

Twenty-five accounts, filled, ranked under the *Convert* model recommended in
`04-RANKING.md`. The full ordered list with drive times, clusters, scores and fit
sentences is in `private/venues.csv` and in the cohort file; it is not reproduced
here because this document is committed and venue names are only published as
participants with recorded consent (E10.14, E15.16).

**What it looks like in aggregate:**

- Spread across six clusters, weighted to west Limerick, Limerick city and the
  Lough Derg shore.
- Drive times from under a minute to the far edge of the ring.
- A mix of hotels with real weddings operations, country houses, castles and one
  exclusive-use estate — which reflects the market rather than a preference. The
  ring is hotel-dominated and no cohort built from it will not be.
- **Eighteen of the twenty-five are picked by all four ranking models.** Those need
  no decision from anyone; they are in Cohort 1 whatever the founder chooses. Only
  seven accounts across the whole comparison are picked by exactly one model.

**Seven accounts in Cohort 1 sit in the 38–52 minute confirmation band** and are
flagged `[confirm ring]`. They are in on the measurement, but the model's known
error could move them either way, and they should be confirmed before the send
rather than after.

## 3. Cohort 2

**Short.** It fills to **sixteen of twenty-five** from the contactable in-ring
universe. The remaining nine do not exist.

Cohort 2 is also visibly weaker than Cohort 1 — its lower half scores in the
teens and twenties, where Cohort 1's floor is in the sixties. That is not a
ranking artefact. It is what the bottom of a 43-account market looks like once
the top 25 are taken, and it is the clearest single argument that the shortfall
in `03-UNIVERSE.md` is real rather than conservative.

**Recommendation:** release Cohort 2 as a cohort of sixteen rather than waiting
to fill it, and treat the gap as information rather than as a task. Holding a
cohort open until it reaches 25 would delay the programme waiting for venues that
are not there.

## 4. Cohorts 3 and 4

**Cohort 3 does not exist inside the ratified ring.** After Cohorts 1 and 2 there
are exactly two contactable accounts left, from a total of 43.

**Cohort 4 does not exist at all.**

Two honest ways to fill them, both change-controlled and neither actioned:

- **The 45–60 minute band** holds sixteen contactable eligible accounts. Enough
  for most of one further cohort. Requires widening the ratified geography.
- **The seven accounts held on unconfirmed trading status**, if checking clears
  them. Some will; the verification pass suggests several will not — six of six
  suspected closures came back confirmed.

**Recommendation:** define Cohort 3 as *the 45–60 band, held in reserve, released
only on a founder decision to widen the ring* — and record Cohort 4 as **not
available**. That keeps `PROJECT_STATE.json` honest. The cohort-ready flags for 3
and 4 should not be set to true on the strength of a plan to find more venues.

**E10.13 therefore comes back partially delivered, by design**: Cohort 2 built and
short, Cohort 3 defined as contingent, Cohort 4 reported as not existing. Marking
it complete would mean claiming three cohorts exist.

## 5. The reserve and the register (E10.14)

The reserve holds every eligible in-ring account not placed in a cohort, plus the
accounts held on unconfirmed trading status, kept separately because they need a
phone call rather than a place in a queue.

Four fields carry the register E10.14 asks for, on **every** account:

| Field | Rule |
|---|---|
| `contact_verified_on` | Blank until contact details are independently verified from a current public source or a direct relationship. Never inferred. |
| `conflict_flag` | Group ownership, shared operator, rename, suspected duplicate. |
| `consent_public_naming` | **Defaults to `unknown`.** Research is not consent. |
| `consent_map_publication` | **Defaults to `unknown`.** Same rule. |

Both consent fields are `unknown` for all 219 accounts, and that is the correct
state, not an incomplete one. **No venue in this universe has consented to being
named publicly or placed on a published map.** E15.16 depends on that being true
and recorded rather than assumed, and the film map in E13.03 needs it settled
before any venue name appears on a public surface.

## 6. What is not in the cohorts, and why

**Contact details.** They live in the CRM, joined on `account_id`. The universe
file has no contact column and the export tool refuses to write one. Cohort
release therefore has a real dependency: a verified contact per account, done
through the CRM, before a send.

**Sequencing against the film.** E13.17 renders one personalised film per Cohort 1
venue and depends on these coordinates. **Thirty of the forty-three contactable
in-ring accounts have venue-precision coordinates; thirteen have only a town
centroid**, which is good enough to decide the ring and not good enough to put a
dot on a map beside a venue's name. Those thirteen need resolving before E13.17
renders, and that is a real gate, not a caveat.

A coordinate audit (`venue-coord-audit.mjs`) reverse-geocodes every in-ring point
and compares it with the town the research recorded. It found two coordinates
sitting on an industrial estate — one of which had put a venue from west Clare,
over an hour away, into Cohort 1 at 26.8 minutes — and one resolving into the
wrong county, about 100 km from its recorded address. All three are corrected and
the audit now runs clean at 0 wrong and 0 mismatched across 91 coordinates.
**Run it again before E13.17 renders anything.**
