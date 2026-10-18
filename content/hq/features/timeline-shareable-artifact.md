---
id: timeline-shareable-artifact
title: Signal Timeline shareable artifact
product: Signal Timeline
category: Core
status: In Progress
priority: High
effort: Large
impact: High
owner: Ethan
lastVerified: 2026-10-18
principleAlignment: 99
relatedCampaign: Founding Venue Programme
relatedMetric: Qualified Timeline views
---

## Current state

The final Master 3 package (canvas version 49, after the round-6 fixes) has
been ported to native React for the App candidate. The countdown, milestone
sequence, Coming up rows and phone list use real projected dates. Light and
dark themes, returning-guest hints, no-date states and post-event states are
included. A date passing does not mark an incomplete Task as done.

Source checks and visual qualification are ongoing. This replacement is not
live or fully accepted. The older artifact releases recorded below remain
historical evidence, not acceptance of Master 3. Current work remains in the
existing [Delivery #111](https://github.com/ethanmcn2013-droid/signal-studio-workspace/issues/111) lane.

The owner works at `app.signalstudio.ie/app/timeline`, which resolves directly
to the current project artifact with a project switcher and clear View, Edit,
and Preview and share modes. The recipient receives an unguessable `/s/*`
link without the app shell. Branded
`timeline.signalstudio.ie/s/*` links are preserved through the Studio
compatibility edge.

## Master 3 integration candidate · 18 October 2026

Owner-entered presentation settings cover the title treatment, event notes,
location consent and optional wedding, opening or school wording. Private
current preview reads the owner's current project; it does not publish the
project or expose guest sharing, follow controls or venue referrals. Published
pages continue to read a frozen, allowlisted projection. Editing current
settings must not silently change an existing publication.

Calendar choices distinguish a selected event from an all-dates calendar or
feed. Opening Google Calendar or downloading a file is not a claim that the
guest saved an event. No-date pages offer no fabricated calendar date.

The guest-services candidate includes double opt-in following, unsubscribe
and Undo, and date-based reminder selection. Following requires server
confirmation; a local form state is not proof of subscription or email
delivery. Provider acceptance is not inbox delivery. Unknown send outcomes
must not be retried automatically.

Timeline migration `0002_master3_presentation`, its encrypted backup and
restore custody, and guest-email runtime configuration are still pending
production receiving. The Timeline-only release adapter has local checks;
it is not evidence of a production apply. Dedicated Timeline credentials and
an independently received target hash are not yet configured for that path.
No live follow, reminder or delivery claim follows from this candidate.

Location, public notes and links enter the guest page only through the
explicit public presentation contract. Private Tasks bodies, account details
and guest email addresses stay outside the public projection. Full browser
and accessibility receiving, migration proof and configured-runtime checks
remain required before acceptance.

## Publication boundary

The share is a frozen, allowlisted projection. Private Notes, private Tasks,
internal descriptions, collaborators, comments, attachments, and unpublished
changes do not cross the boundary. Rotating or revoking the link invalidates
the old address. The response is noindex, noarchive, no-store, and no-referrer.

## View contract

A view means a qualified viewing session, not an HTTP request. The release
counts after the artifact remains visible for the qualification window,
deduplicates a publication within the session window, and stores only a
hashed receipt plus the publication aggregate. It does not retain the raw
share token, IP address, referrer, or user-agent.

## Historical release evidence

- Timeline PR #28: migration, adoption proof, backup, dry-run, production
  receipt, export, and erasure coverage.
- Tasks PR #46: artifact, owner studio, receipt qualification, 260 tests,
  six desktop/mobile browser checks, Axe, keyboard, privacy headers, and view
  isolation.
- Studio PR #90: exact branded wedding path repair and production smoke.

Those releases established the owner workspace and publication boundary.
The retired Timeline marketing page used that artifact contract as its
product proof.

## Tasks date-source repair (App candidate, 23 September 2026)

The integration candidate reads raw Tasks `due_at` as SQLite seconds when
reconciling Task milestones, yielding the intended UTC calendar date instead
of interpreting seconds as JavaScript milliseconds. Local SQLite fixtures
cover UTC day boundaries, Dublin daylight saving transitions, undated values
and a genuine pre-1970 date. A controlled isolated Preview readback also
confirmed a Kiritimati boundary case. This does not change the published
artifact contract or establish production reconciliation on the new source.

## World-class pass (Tasks dispatch T·107, 2026-07-29)

The Timeline product received the same four-wave design pass the Tasks board
received with T·106, across every surface: shared artifact, owner view,
curation, sharing manager, artifact studio, phone preview, and the loading,
error, and empty states.

Truth repairs shipped with it. The Today dash now rides the same collision
geometry as the milestone points, so it can no longer render to the right of
milestones weeks in the future when dates cluster. Review mode runs on one
suite clock, guarded by tests at the fixture and DTO level. The public share
page renders complete before JavaScript arrives, and reduced motion is
absolute from first paint. Error copy renders in a real colour; it had been
pointing at an undefined token and displaying as plain ink.

The owner side now speaks the design system: the curation surface moved from
inline styles to DS 2.0 tokens with the board's lane-tone grammar, an 11px
type floor, and 32px targets; the sharing manager traded ten stacked forms
for one ruled list; the owner view drops the duplicate wordmark behind an
"Owner view" strip; the anchor countdown is mounted in the plan header. Wide
rails title every milestone that fits, decided by edge-aware collision math.
Structural motion shipped in the ratified class only; fourteen discretionary
micro-interaction sites are catalogued in the Tasks repo's
docs/DELIGHT_CATALOG.md awaiting the reference review.

The hero on the Timeline marketing page carries a copy of the artifact
model; its Today-dash math was brought to parity in the same studio change
that records this entry.

## Artifact finish pass (Tasks dispatch T·127, 2026-07-31 to 2026-08-02)

A design review ran against the real render: the Mara and Finn fixture
measured at 360 to 1728 pixels, printed to A4, driven by keyboard, and
inspected as served HTML. It found three places where the artifact broke
its own promise, and all three were repaired in the same cycle. The
review is kept in the Tasks repo at `docs/TIMELINE_DESIGN_REVIEW.md`.

**The three repairs.** On the wedding day the headline clipped to
"Toda": the value `Today` measured 311px inside a 243px metric column and
was cut at the artifact edge. Every metric face now declares a width
class and is sized to fit its column by construction, so no reachable
value can clip at any width; `Today` now measures 218px in that column
at 1440. The completed ink was scaled by percent of count while the dots
sat at calendar-proportional positions, so the ink ended at 22% while the
second settled dot sat near 33%, stranded on the grey rail. The fill is
now drawn to the furthest completed dot on both axes, and the percentage
stays where it belongs, in the metric. And a pasted link unfurled with no
image and the layout's generic copy; it now carries a data-free card of
the product's own typography, recorded in
`timeline-unfurl-card-2026-07-31`.

**What the viewer meets first.** A couple's artifact opens on the
countdown, with progress one press away; other audience kinds keep
progress first. The milestone marks read as four states in one shape
language: a quiet hairline ring ahead, a solid ink bead settled, one full
solid indigo mark for the next milestone at full strength, and the same
solid mark drawn in ink when it runs late. Both calls are recorded in
`timeline-artifact-face-2026-07-31`. The rail also earns a calendar:
first-of-month ticks ride the same distortion mapping as the points, so
the months and the dots cannot disagree. Spans beyond fourteen months
thin to quarters and then to Januarys, January carries the year, and
labels yield near the Today chip, at the rail's edges, and wherever a
neighbour sits too close to read. The phone rail caps long empty
stretches through that same mapping and keeps the tick rhythm without the
text. Hidden horizontal overflow now earns edge fades and proximity snap.

**What the artifact leaves behind.** Print grows a second page: a ruled
index of every milestone, so the keepsake stops losing six of nine titles
to labels gated at 980px, and a static "22% complete · 79 days left" line
where an instruction to click used to print. Sharing prefers the platform
share sheet with a clipboard fallback, and a failed copy is now visible
rather than announced only to screen readers. The footer attribution
walks: "Made with Signal Timeline" links to the marketing page, closing
the loop `docs/COLLABORATION_LOOP.md` ratified and the artifact had been
dead-ending.

**Both facts, whichever face opens.** The countdown face now carries the
plan's other fact under it as a receipt, "2 of 9 settled", so the
artifact states progress and time remaining together no matter which side
it opens on. Print had already stated both. The detail panel's status
echo now reproduces the rail's three mark diameters, 0.55rem, 0.64rem and
0.88rem, not only its colours, so the mark you pressed is the mark the
panel shows.

**Governance and first run.** The artifact's own contract test had been
wired to no gate and was failing; it is repaired, extended to the new
invariants (completed frontier, metric scale, print, edge fades, footer
attribution, month ticks read from the model), and runs in
`test:timeline-owner`. The artifact display register is ratified once as
`--x-artifact-*` tokens and consumed by the artifact, the studio, and the
404. Separately, the flagship wedding template now declares an anchor
date and offsets, so a workspace created from it produces a dated first
artifact rather than eight undated milestones. That change and its limits
are recorded in `template-anchor-dates-2026-07-31`.
