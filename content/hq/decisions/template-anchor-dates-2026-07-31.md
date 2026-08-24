---
id: template-anchor-dates-2026-07-31
title: A workspace template may declare the one date its customer already knows, and place its items against it
category: Product
date: 2026-07-31
status: Active
reviewDate: 2026-08-31
relatedObjects: [Signal Timeline, Signal Tasks, Timeline shareable artifact, templates-cross-suite-canonical]
---

## Decision

A workspace template may declare an anchor: the one date its customer
already knows before anything else is planned. A wedding day, an opening
night, a move-in. The anchor carries a label for the day itself, the
question instantiation asks, and an optional hint. Template items then
carry `anchorOffsetDays`, whole days counted back from that date. When a
workspace is created from such a template and the customer answers the
question, every offset becomes a real target date.

The flagship `wedding-planning-workspace` template is the first to
declare one: label "The wedding day", prompt "When is the wedding?", and
offsets on all eight milestones at -300, -150, -45, -30, -25, -6, -4 and
-2 days, which is the real cadence of the work. The venue is booked the
better part of a year out, layout settles once the season is known,
headcount and suppliers land in the last six weeks, and the final three
items are the week itself.

Three boundaries hold the mechanism honest:

- **The date stays optional.** An unanswered question seeds exactly as
  before: undated items, ordinal order, nothing lost that the customer
  had.
- **The offset wins over any hardcoded target date.** A template must not
  state the same timing twice, so the two fields are never combined.
- **These are UTC calendar days, never instants.** No local timezone can
  shift a milestone across midnight on the way into the seed.

## Reason

The flagship template seeded eight milestones with no dates at all. A
real venue's first artifact therefore had no anchor, no Today dash, no
countdown and flat ordinal spacing: none of the signature moves the
product is sold on. Meanwhile the fixture everyone reviews, ships and
demonstrates is fully dated and reads as intended. First-run reality did
not match the reviewed artifact, and the gap sat exactly where a new
customer forms their first impression.

The wedding date is the one fact a couple or a venue can always supply on
day one, usually before the venue is even booked. Asking for it at
instantiation costs one question and turns the seeded plan into a plan
already shaped like their year.

The mechanism is deliberately dumb: offsets and a date, resolved by a
pure function. Nothing infers, estimates or adjusts a date on the
customer's behalf, and every resulting milestone stays editable, which
the anchor's own hint says out loud.

Two supporting changes shipped with it. The template source lives in the
studio repo per `templates-cross-suite-canonical`, and the Timeline
module reads a generated roadmap slice. That slice carried a "refresh
with the sync script" banner while no generator actually wrote it, so
milestone seeds could drift from the studio source without anyone seeing
it. The sync script now generates the roadmap slice alongside the Tasks
slice.

## Alternatives considered

**Hardcoding dates in the template.** Simplest, and wrong for every
customer who is not getting married on the date in the file. It also ages
badly the moment the template outlives the year it was written in.

**Deriving dates from the workspace creation date.** Rejected. It invents
a date the customer never gave, then presents it with the same confidence
as one they did. A countdown to a fabricated day is worse than no
countdown.

**Leaving the template undated and asking owners to fill dates in
afterwards.** This is the state that produced the problem. Eight empty
date fields is work, and the artifact stays flat until all of it is done.

## Risks

An anchor asked for and skipped leaves the customer in the old flat
state, which is acceptable but invisible: they will not know the artifact
had a better first run available. Worth watching once real venues create
workspaces.

Offsets encode one cadence. A twelve-month engagement and a six-week
engagement both get the same shape, and the short one gets milestones
placed in the past. Every date remains editable, and the anchor hint says
so, but the pattern should be reviewed against real first-run plans
rather than assumed correct.

The offset-wins rule means a template author who sets both fields loses
the target date silently. The type comment states the rule; if more
templates declare anchors, it should become a check rather than a
convention.

## Notes

Shipped 2026-08-02 in Tasks dispatch T·127, from item P1-8 of the design
review at `docs/TIMELINE_DESIGN_REVIEW.md`, which had been deferred
because the fix is studio-side. Template types and the wedding seed live
in the studio repo; the resolver and its tests live in the Timeline
module in the app repo. Milestone offsets are seed defaults, not a claim
about any real couple's plan.
