# Who counts as a venue — E10.02

**Status:** Founder Review · **Written:** 2026-08-03 · **Executor:** Claude Code
**Ratified input:** D-012 (types), D-020 (no volume screen) · **Serves:** E10.04, E10.12–E10.14

D-012 ratified the venue types. This turns that list into a rule a researcher can
apply to a website in ninety seconds and get the same answer as the next
researcher, records the two places where the existing repository record
contradicts it, and states the one judgement call that is genuinely the
founder's.

---

## 1. The rule

**In:**

| Type | What it means in practice |
|---|---|
| `dedicated_wedding_venue` | Weddings are the business. Nothing else competes for the room. |
| `country_house` | A private or semi-private house that hosts weddings, usually exclusive-use. |
| `castle` | A castle or tower house operating as a wedding venue or castle hotel. |
| `hotel_weddings` | A hotel with a **real** weddings operation — a dedicated coordinator, a wedding page, a package structure. |
| `barn` | A converted barn, stone courtyard or farm building operating as a venue. |
| `estate` | An estate or demesne hosting weddings **on its own grounds**, including under its own marquee. |

**Out:**

| Excluded | Why |
|---|---|
| Restaurants | No ceremony or reception capacity as a venue in its own right. |
| Pubs | Same. |
| Marquee hire | A supplier, not a venue. See the distinction below. |
| Town hotels doing occasional weddings | A function room that occasionally holds a wedding is not a weddings operation. |
| Under roughly 20 weddings a year | D-012: below that, EUR 1,000 a year cannot be justified to them honestly, and a venue that cannot justify it will not renew. |

## 2. The three tests that settle almost every case

**The marquee test.** A company that brings a marquee to your field is out. An
estate that puts a marquee on its own lawn and sells the whole day is in. The
question is not "is there a marquee", it is **who owns the ground and who sells
the day**.

**The coordinator test.** Does one identifiable role own weddings — a wedding
manager, an events lead, a coordinator? If weddings are handled by whoever is on
reception, it is a function room, not a weddings operation. This is the test that
separates `hotel_weddings` from an excluded town hotel, and it is answerable from
a website in under a minute.

**The calendar test.** Does the venue talk about wedding *dates* — availability,
one wedding a day, a season, a booking window? A venue running twenty-plus
weddings a year always does, because scarcity is its main sales pressure. A venue
that does four a year never mentions dates at all.

## 3. The 20-wedding floor, and how not to misuse it

The floor is real: D-012 sets it and it stays. But it is the **most dangerous
number in this document**, for two reasons.

**It is almost never published.** Across the whole research sweep, essentially no
venue in the ring states a weddings-per-year figure. Every volume number in the
universe file is an inference from capacity, space count and a stated
one-wedding-a-day policy. So a hard screen on an inferred number would exclude
real prospects on the strength of a guess.

**It looks like the volume screen D-020 forbids, and it is not.** D-020 is
unambiguous — *"I don't care if they have forty weddings or if they have two
hundred and fifty weddings. They're locked in at a thousand."* No venue is
excluded for being too big, and none is ranked out for being small. The 20 floor
exists only to answer *is this a wedding business at all*, which is a different
question from *how big is it*.

**So the floor is applied as a question, not a filter:** where the evidence
suggests under twenty, the account is marked `eligibility: borderline` with the
reason recorded, and it stays in the universe. Nothing is deleted on an inference.
`venue-rank.mjs` enforces the other half — `assertNoVolumeScreen` fails the build
if any ranking model drops a venue from any volume band, and it is covered by a
test.

## 4. Two conflicts with the existing record — recorded, not reconciled

Per `WORKFLOWS.md` §8, these are logged with both positions rather than silently
resolved.

**Conflict A — the volume threshold.**
`studio/docs/strategy/VENUE_EDITION_STRATEGY.md` sets a qualification threshold at
**roughly 40 weddings a year**. D-012 sets it at **roughly 20**.

*Resolution:* D-012 governs. It is the later ratified decision and PROJECT.md §15
puts approved decisions above historical strategy documents. No founder call is
needed; the strategy document is stale and is listed for correction in the packet.
The practical difference is large — a 40 floor would remove a substantial part of
the country-house and small-estate segment, which is exactly the segment where
strategic fit is strongest.

**Conflict B — owner-operator, and this one is a real founder call.**
`VENUE_EDITION_STRATEGY.md` requires **"an owner-operator who can sign alone"**.
D-012's eligible-types list includes **"hotels with a real weddings operation"**,
many of which are group-owned and cannot sign alone.

These cannot both hold. The strategy document would exclude a large share of the
in-ring universe, including most of the Limerick city hotel supply, which the
research shows is where a disproportionate amount of the county's wedding volume
actually sits.

*Recommendation, for approval or push-back:* **D-012 governs — group-owned hotels
stay eligible — and the owner-operator preference moves from a filter to a ranking
input.** That is exactly what `decision_access` already does in the scoring model:
an owner-operated single property scores 5, a chain with central procurement
scores 1. The insight in the strategy document is right; encoding it as an
exclusion rather than a weight is what is wrong. Nothing is thrown away and
nothing is silently overridden.

## 5. What the rule is not

- **Not a quality bar.** A dated website is not a disqualification; it is a
  strategic-fit signal, and often a positive one.
- **Not a size bar.** See §3.
- **Not a geography bar.** Geography is `drive_time_ring`, decided separately in
  `01-GEOGRAPHY.md`. A venue can be eligible and outside the ring; those two
  facts stay in separate columns so neither hides the other.
- **Not permanent.** Status is re-checked at contact time. The research found
  venues that have closed, been sold, been rebranded or gone dark, and one that
  is mid-refurbishment with an unresolved reopening date. `status_flag` carries
  that, and anything not `trading` is held back from outreach until confirmed.
