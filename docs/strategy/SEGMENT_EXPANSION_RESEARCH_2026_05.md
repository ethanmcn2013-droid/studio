# Segment Expansion Research — May 2026

Status: RATIFIED 2026-05-16 — founder accepted the panel consensus in full. This is now a standing directional constraint, not a research note. Sequencing below is binding until a kill/pivot trigger or new evidence revises it.
Owner: founder
Question: should Signal Studio expand to teachers / students / small-business owners / contractors after the venue wedge, and does the "more teachers than hotels" scale argument hold?
Method: 6-lens agent panel (market-math · day-to-day utility · wedge & moat · brand fit · adoption reality · cost to serve), each scoring the same five segments, weddings as benchmark.
Spine: `BUSINESS_PARTNER_REVIEW_2026_05.md`. This doc is foresight, not a plan change — the 30-day venue focus is unchanged.

---

## The one-paragraph answer

There are far more teachers than hotels. That sentence is true and it is the most dangerous input in this analysis, because the number that matters is not population — it is *payable × adoptable × reachable-by-a-solo-founder × has-a-cohort-buyer*. On that number, venues beat teachers by an order of magnitude despite being a fraction of the headcount. Teachers fail four of six lenses: free incumbents (Notion is €0 for teachers vs our €144/yr), no buyer who can sign alone (schools are 18-month institutional procurement, not a venue owner over coffee), institutional tool mandates that confine us to the overflow scraps of the job, and an under-18 data-compliance regime a solo founder must not take on. Worse, chasing teachers structurally forces Signal Studio to become a self-serve funnel company — SEO, activation emails, conversion optimisation — which is the exact machinery the brand is a refusal of. The population argument inverts the moat. **The honest ranking after venues is: contractors (the only segment that replicates both wedge halves), then small-business (biggest raw revenue, but no compounding loop), then — far behind — students and teachers as brand/long-game, never as paid wedges.**

---

## Composite scorecard (0–5 per lens; 5 = best)

| Segment | Market math | Day-to-day utility | Wedge & moat | Brand fit | Adoption reality | Cheap to serve | **Composite** | Verdict |
|---|---|---|---|---|---|---|---|---|
| **Weddings / venues** (benchmark) | 4 | 5 | 5 | 5 | 5 | 5 | **4.8** | The proven wedge. Everything calibrates here. |
| **Contractors / trades** | 3 | 4 | 4 | 3.5 | 3 | 2 | **3.3** | Designated **second wedge** — only segment with a venue-shaped buyer + forwardable client artifact. Gated by mobile/offline. |
| **Small-business owners** | 4 | 4 | 3 | 4 | 3 | 3 | **3.5** | Biggest raw revenue ceiling, best full-suite daily fit — but **no cohort buyer**, grows linearly via a funnel. |
| **Students (postgrad/pro)** | 2 | 3.5 | 1 | 4 | 3 | 4 | **2.9** | Real utility for multi-stream postgrads; free by design → brand, not revenue. |
| **Students (general UG)** | 2 | 3.5 | 1 | 2.5 | 3 | 4 | **2.7** | Loses to free Notion before the voice can speak. Do not build a page for this slice. |
| **School teachers** | 2 | 2 | 2 | 3.5 | 2 | 4 / **1** | **2.3** | Large population, narrow adoptable surface. Pupil-data variant is a compliance trap (drop to 1). Not a paid wedge. |

Teachers' cost-to-serve is 4 *only* if scoped to adult teachers with zero pupil PII; it collapses to 1 the moment a child's name enters the product (FERPA + GDPR Art. 8 minor consent + safeguarding + per-school DPAs — unbounded recurring liability for a solo founder).

---

## The maths the founder asked for — population is the wrong axis

| Segment | TAM (UK+IE+US) | Realistic SAM (solo-founder reachable) | Pays from whose budget? | Price ceiling | Cohort buyer (one signature → many users)? | Revenue ceiling @ ~5% |
|---|---|---|---|---|---|---|
| Weddings/venues | ~10,000 premium venues | ~2,500 | Venue's commercial budget | €1,500–€4,000 / venue / yr | **Yes — the venue, signs in an afternoon** | €312K (→€937K @15%) |
| Teachers | ~5.2M | ~260,000 | Personal pocket (mostly already covered free) | €96/yr personal · €500/yr school | **No** — school = 18–24mo procurement | €748K *optimistic*, structurally unreachable solo |
| Students | ~25.5M | ~200,000 paying | Student's own / free-tier expectation | €60/yr or **€0** (we already give .edu free) | **No** — university = worse procurement | €480K *if not free* (it is free) |
| Small-business | ~11M | ~500,000 | **Business revenue (no free-plan expectation)** | €144/yr | **No** — acquired one at a time | **€3.6M–€7.2M** |
| Contractors/trades | ~1.5M | ~200,000 | Business revenue | €144/yr | **Partial** — a general contractor activating subs; client-facing build-Roadmap is the loop | €1.7M |

Read the cohort-buyer column, not the TAM column. The venue wedge works because one signature activates ~30–80 couples and every forwarded Roadmap exposes the brand to a non-user. Teachers and students have no such buyer and no such loop. Small-business has the biggest pot but every customer is won individually (linear, funnel-dependent). Trades is the only non-wedding segment where both wedge halves — a buyer who activates others, and a forwardable client artifact — are at least partially present. (Figures: researcher lens, cited sources in panel transcript; revenue ceilings are Fermi, conversion rates illustrative not modelled.)

---

## Do these segments have genuine day-to-day utility? (the founder's literal question)

| Segment | Honest answer | Which products actually have a job |
|---|---|---|
| Weddings | Yes — but one-and-done by design | Tasks ✓ · Roadmap ✓ (forward to venue/family) · Notes ✓ · Analytics ~ (too thin/short) |
| **Teachers** | **Mostly no** for a full-suite play | Tasks ~ (personal marking/admin overflow only) · Roadmap ✗ (no audience) · Notes ~ (SEN/lesson capture) · Analytics ✗ (teaching load is calendar-baseline, not anomaly the briefing fires on). The job they have lives in school-mandated systems they can't leave; we get the sticky-note residue. |
| Students (postgrad) | Yes, for multi-stream postgrads | Tasks ✓ · Notes ✓ (lecture→task) · Roadmap ~ (thesis timeline w/ supervisor) · Analytics ~ (fires in crunch, dead in holidays) |
| Small-business | Yes — strongest non-wedding full-suite fit | Tasks ✓ · Notes ✓ · Analytics ✓ (highest task density) · Roadmap ~ (project-shaped subset). Breaks at crew scale (no manager view). |
| Contractors | Yes — clearest non-wedding Roadmap use | Tasks ✓ (job=workspace) · Roadmap ✓ (forward build phases to homeowner) · Notes ~ · Analytics ~. Gated by phone-first/offline reality. |

---

## The dissent that matters most (named, not softened)

"There are more teachers than hotels" leads somewhere strictly *worse* than fewer hotels. A large, low-money, no-cohort-buyer segment forces conversion on volume instead of on a signature — which means building the self-serve funnel (SEO, free-tier onboarding, activation emails, conversion optimisation). Every one of those is the machinery BRAND.md §2.2–§2.3 defines the company *against*. The venue wedge fails cheaply and reversibly (a 60-day kill trigger). The teacher motion fails *expensively and identity-destroyingly*: by the time the funnel's poor conversion is visible, the company has already become a funnel company. The population argument doesn't just underperform — it makes the company optimise the one thing the moat is the absence of. Refuse it as a wedge.

---

## Recommendation & sequencing

1. **Now → +30 days: venues only.** No new segment work. Do not pre-empt the §8 kill/pivot gate. This research changes nothing about the current focus.
2. **If venues prove (≥1 paid pilot, couples activate): contractors is the second wedge** — not teachers, not small-business. It is the only segment that replicates the venue's buyer+loop shape. Test the "general-contractor-activates-subs" buyer *early*, because that is exactly where it is most likely to break (subs are transient across GCs; weaker captivity than a couple to one wedding).
3. **Small-business: opportunistic inbound, not a planned wedge.** Best raw numbers, but no loop → linear funnel growth that strains the brand. Revisit only if a cohort buyer surfaces (hospitality group, clinic network).
4. **Students & teachers: organic positioning surface only.** Keep them in BRAND.md §2.1 as audience truth; no outbound, no demos, no pilots, no dedicated paid push. Split the student archetype: postgrad/professional is the real fit; general undergraduate quietly loses to free Notion — do not build a page for it.
5. **Compliance fence (decide before any school/classroom word ships):** age-fence the entitlement source to adults, zero pupil PII. This is a positioning decision, not a code change.

The forcing line: the founder is reasoning from population size. The company should reason from *who can sign, who actually adopts, and what compounds*. On all three, the order is venues → trades → (everything else, much later).
