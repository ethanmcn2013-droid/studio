---
id: timeline-artifact-face-2026-07-31
title: A couple's artifact opens on the countdown, and the next milestone is a solid indigo mark
category: Product
date: 2026-07-31
status: Active
reviewDate: 2026-08-31
relatedObjects: [Signal Timeline, Timeline shareable artifact, timeline-option-d-selected-2026-07-22, Collaboration Loop]
---

## Decision

Two operator calls on what the shared artifact says first. Both refine
the Option D artifact contract from within it. Neither reopens it:
`timeline-option-d-selected-2026-07-22` stands as written, including its
lens model, its Today dash, and its **Our next milestone** language.

**The face.** A publication whose audience kind is `couple` and whose
primary date is still ahead opens on the countdown, "79 days left".
Progress stays one press away on the same lens, and the countdown face
carries "2 of 9 settled" as a receipt under it, so whichever side the
artifact opens on, it states the plan's other fact too. Every other
audience kind keeps progress first.

**The mark.** The next milestone is a full solid indigo mark at full
strength: 0.88rem, no border, the accent colour, larger than the 0.64rem
settled beads and the 0.55rem hairline rings ahead of it. There is no
hollow ring. It carries the rail's one spent motion, a single ring of
light that breathes outward once after the points settle and then rests.
It never loops, and reduced motion removes it. An overdue milestone is
the same solid mark drawn in ink. Shape parity between the two is the
point: lateness changes the colour of the moment, never its importance.
The status text and the detail panel say a milestone is late; the
geometry does not demote it.

## Reason

For a couple's guests the number that matters is days left, not
milestones complete. The artifact opened on "Milestones complete · 22%",
which is planning trivia on a page shared with grandparents, and the
countdown sat behind an 11px mono line in the faintest ink on the page
that nothing identified as pressable. The number the artifact exists to
say was one unlabelled press away, and most viewers would never find it.
Audience kind is already published with the artifact, so defaulting by
kind costs one line of state and no new data crossing the boundary.

The mark follows from how the page is read. An artifact gets one first
impression per viewer, usually on a phone, usually inside a chat app, and
the first question it answers is what happens next. That answer deserves
the only earned indigo object on the rail. A hollow ring reads as absence
next to solid settled beads, which inverts the meaning: the one point the
viewer came for would look the least finished on the line. Drawing
overdue as the same solid mark keeps the rail to four states in one shape
language, so a late milestone reads as the next milestone running late
rather than as a different kind of object.

## Alternatives considered

**A hollow indigo ring for the next milestone.** The conventional
choice, and it keeps ink density low. Rejected because on a rail where
settled points are solid, hollow is the weakest mark on the line, and the
next milestone is the strongest fact on it.

**A diagonal tick for the overdue state.** Built earlier in the cycle,
then cut. A separate shape made lateness a category rather than a
colour. It read as an error badge on a page a couple sends to guests, and
it sorted the moment out of the plan's own sequence.

**Defaulting the countdown for every audience kind.** Rejected. A class
or project timeline is read for how far the work has moved, and many have
no future primary date at all, so that face would open empty.

## Risks

The countdown default depends on the audience kind being right at publish
time. The publish form used to default to Class in a product whose wedge
is weddings; the default now derives from the workspace template, so a
wedding workspace publishes as Couple. If that derivation breaks, a
couple's artifact opens on the wrong face without saying so. The
artifact contract test pins the default face and the four mark states,
and runs in `test:timeline-owner`.

The ring of light is motion on the most public surface in the suite. It
runs once, is capped, and is absolute under reduced motion, per
`motion-proof-first-canon`. Any future addition to the rail's motion
budget should be measured against it, not added beside it.

## Notes

Shipped 2026-07-31 in Tasks dispatch T·127, alongside the design review
at `docs/TIMELINE_DESIGN_REVIEW.md` (items P1-1 and the elevation pass).
The mark geometry lives in `timeline-artifact.module.css` under "The mark
system". The detail panel's status echo reproduces the same three
diameters, so the panel and the rail cannot disagree about which mark was
pressed. Print states both metric faces statically and is unaffected by
the default.
