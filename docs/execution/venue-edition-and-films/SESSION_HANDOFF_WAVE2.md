# Wave 2 handoffs — ready to fire

**Do not start these until WP-01 has landed and its packet is approved.** All
three build on the entity model, the lifecycle state machine and the access-term
fix. Starting early means inventing an incompatible version of the same schema.

| Session | Package | Tasks | Waits on | Owns these files |
|---|---|---|---|---|
| 1 | WP-05 — Venue Portal audit and completion | 18 (E07) | WP-01 | `studio/src/lib/account/**`, `studio/src/app/hq/account-review/**`, `docs/venue-portal/**` |
| 2 | WP-06 — instrumentation, demo fixture, copy | 8 (E09 remainder) | WP-01, E09.01/02 | `app/src/**/analytics`, `app/src/server/demo/**`, `studio/scripts/**` |
| 3 | WP-12 — map system and render pipeline | 4 (E13.03, .04, .15, .16) | WP-02 | `signal-motion/src/**` |

**File ownership, learned the hard way in Wave 1.** Epic boundaries do not follow
file boundaries. These three touch different trees. If any session finds itself
about to edit a file outside its column above, it stops and says so rather than
editing.

**What the main session already absorbed**, so these packages do not redo it:
E03.01 (role map), E09.01, E09.02, E09.10, and the E11 drafting set
(E11.01, .02, .05, .07, .08, .09, .10, .11, .12, .15).

---

## Session 1 — WP-05 · Venue Portal audit and completion

```
You are running work package WP-05 on the Venue Edition and Films programme (VEF-2026).

START HERE
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md, WORKFLOWS.md,
DECISIONS.md (D-011, D-015 Q2 and Q4, D-020, D-024) and RAID.md (R-016, R-021).
Then run /venue-briefing. Open your session with --id=wp05-portal.

SCOPE
E07.01 through E07.18. E07.12's suppression thresholds are already ratified (3 for
behavioural counts, 5 for percentage cohorts, D-011) — implement, do not re-decide.

THIS IS AN AUDIT FIRST, NOT A BUILD (D-015 Q2)
Substantial Venue Portal work already exists: docs/venue-portal/PRODUCT_CONTRACT.md,
METRIC_DICTIONARY.md, PRIVACY_AND_RETENTION.md, ROLES_AND_PERMISSIONS.md, WIREFRAMES.md,
docs/architecture/ADR-007-venue-portal-phase-a.md, and a live authenticated review surface
at /hq/account-review. For each task: write acceptance criteria FIRST, assess what exists
against them, record what genuinely passes as evidence, and only build the gap. Existing
implementation is candidate evidence, never founder-approved completion.

THE NAMING FACT THAT TRIPS PEOPLE UP (D-015 Q4)
The Signal Studio Account IS the Venue Portal. One surface, two names. The 25 July 2026
decision stands. E07's task titles keep the words "Venue Portal"; the surface they
describe is the Account. Do not rename anything and do not treat these as two products.

R-016 IS IN SCOPE
"Unlimited" entitlement (D-020) is currently unrepresentable and the portal actively
contradicts the promise: src/lib/account/live/project-venue-access.ts computes
availableCount = allotment - codesIssued and raises a "No remaining allotment headroom"
attention item, and /hq/entitlements renders a "Venues near their allotment" list. A venue
sold "No seats. No per-couple maths." is currently shown a seat count. WP-01 owns the mint
path; you own the portal presentation. Coordinate through the packet, not by editing WP-01's
files.

HARD PRIVACY CONSTRAINTS
Notes, task, project, briefing, comment, attachment, collaborator and private Timeline
content are forbidden in every venue-facing payload. Usage is aggregate — no person
ranking, no "biggest user". Missing telemetry shows as missing, never coerced to zero.
Page loads are not use. E07.11's definitions come from the main session's E09.02 work at
evidence/E09.02-metric-definitions.md — use them, do not invent parallel ones.

HOW TO WORK
Autonomously. Subagents, /panel and iteration as you judge necessary. Where a design
direction is genuinely open, run /lab and bring options rather than picking silently.
Verify in a real browser, not by assertion.

WHAT COMES BACK
ONE consolidated recommendation packet (D-024). Generate it with:
  node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs packet E07 --write
Move every task to Founder Review. MARK NOTHING DONE. Close with
/venue-close and --id=wp05-portal.
```

---

## Session 2 — WP-06 · Instrumentation, demo fixture, copy

```
You are running work package WP-06 on the Venue Edition and Films programme (VEF-2026).

START HERE
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md, WORKFLOWS.md,
DECISIONS.md (D-012, D-015 Q2, D-021, D-024) and RAID.md (R-011, R-017).
Read evidence/E09.01-event-taxonomy.md and evidence/E09.02-metric-definitions.md — the
main session already produced these and they are the contract you instrument against.
Then run /venue-briefing. Open your session with --id=wp06-measurement.

SCOPE
E09.03, E09.04, E09.05, E09.07, E09.08, E09.09, E09.11, E09.12.
E09.01, E09.02, E09.06 and E09.10 are already done or in the main session's hands.

E09.07 IS THE CENTREPIECE: a deterministic Glenmara House and Mara-and-Finn
demonstration fixture across all four products AND the portal. It is what both films
capture and what every demo runs on, so determinism is the requirement — the same command
produces the same state every time. Build on the existing wedding template and fixtures
rather than a parallel set.

E09.08 — DEMONSTRATION IMAGERY IS AI-GENERATED (D-012), not licensed stock. Budget is
zero. The task's own requirement, that no unapproved real venue or couple material is
used, is satisfied by generation. R-011 is the risk: AI-looking faces in a wedding product
are the fastest route to "cheap", which the design register forbids outright. Prefer
environments, details, hands, tables, flowers, light over faces. No close-up generated
faces in either film or on the public Timeline demo. If a shot cannot be made to feel
real, cut it rather than ship it.

E09.11 and E09.12 — prices are VAT-INCLUSIVE (D-021). Never "for life" or "forever".
Nothing may state or imply legal approval (D-016). E09.12 has hard dependencies on
E02.01, E02.03, E02.12 and E03.09 — the tool will refuse to start it until they are Done.
That is deliberate: do not freeze commercial copy before the founding-rate, entitlement
and Keepsake rules are ratified AND recorded.

WATCH FOR R-017
Dietary and allergy notes are a first-class object in the shipped wedding template and are
Article 9 special-category data about guests who consented to nothing. Do not build a demo
fixture that normalises couple-entered guest health data flowing to the venue until the
role map (E03.01) settles it. Flag it in your packet if the fixture forces the question.

WHAT COMES BACK
ONE consolidated recommendation packet (D-024). MARK NOTHING DONE. Close with
/venue-close and --id=wp06-measurement.
```

---

## Session 3 — WP-12 · Map system and render pipeline

```
You are running work package WP-12 on the Venue Edition and Films programme (VEF-2026).

START HERE
Read studio/docs/execution/venue-edition-and-films/HANDOFF.md, PROJECT.md, WORKFLOWS.md
and DECISIONS.md (D-012, D-015 Q6, D-017, D-024). Then run /venue-briefing.
Open your session with --id=wp12-mapsystem.

SCOPE
E13.03, E13.04, E13.15, E13.16 — the engineering half of the Limerick First film.
Per D-015 Q6, Codex owns the film's creative; Claude owns the parameterised render
pipeline and the map data, because they are engineering wearing a film costume.
Do NOT touch E13.01, .02, .05-.14, .17, .18 — those are the motion lane's.

E13.03 — the stylised Greater Limerick map geometry, the River Shannon path, and the
15, 30 and 45-minute rings. D-012 sets the geography as a 45-minute drive-time ring from
Limerick city centre, and WP-02 produced the coordinates and drive-time rings for every
account. Use WP-02's data; do not re-derive geography.
E13.04 — the data-driven map composition consuming verified venue coordinates and cohort
metadata.
E13.15 — the parameterised rendering pipeline: venue name, coordinates, cohort, private
CTA data.
E13.16 — unique tracked links, thumbnails and landing destinations per render.

CONSTRAINTS
Cohorts are 25, released sequentially (D-017), so the pipeline renders 25 at a time and
must rerender cheaply — the price sequence and venue data both change late.
E13.05 keeps other venues ANONYMOUS except the private recipient until permission is
granted, so the composition must support anonymous pins. Consent status per venue comes
from WP-02's E10.14 work.
Tracked links: film link clicks only, no open pixels (D-013).

This work lives in signal-motion/. Read signal-motion/AGENTS.md and CLAUDE.md first — that
repo is the motion lane's home and has its own conventions. Do not restructure it.

WHAT COMES BACK
ONE consolidated recommendation packet (D-024). MARK NOTHING DONE. Close with
/venue-close and --id=wp12-mapsystem.
```

---

## After Wave 2

**Wave 3:** WP-07 (E08 engineering), WP-08 (E05 couple experience), WP-11 remainder.
**Wave 4:** WP-09 (E06 Timeline), WP-04 (E03 legal drafting — needs the role map approved),
WP-13 (E12 commercial pages).
**Wave 5:** WP-14 (E15 release verification).

Deactivate the Wave 1 WIP exception and record a Wave 2 one before starting.
