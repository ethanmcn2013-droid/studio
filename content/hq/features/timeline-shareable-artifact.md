---
id: timeline-shareable-artifact
title: Signal Timeline shareable artifact
product: Signal Timeline
category: Core
status: Built
priority: High
effort: Large
impact: High
owner: Ethan
principleAlignment: 99
relatedCampaign: Founding Venue Programme
relatedMetric: Qualified Timeline views
---

## Current state

Option D is the selected and shipped public artifact. It renders one
horizontal, date-scaled line that makes completion legible before the viewer
reads copy. Milestones are points on the line. A separate Today dash shows the
current position between them. The primary readout can move between
completion and days remaining, and the next unfinished point is labelled
**Our next milestone**.

The owner works at `app.signalstudio.ie/app/timeline`, which resolves directly
to the current project artifact with a project switcher and clear View, Edit,
and Preview and share modes. The recipient receives an unguessable `/s/*`
link without the app shell. Branded
`timeline.signalstudio.ie/s/*` links are preserved through the Studio
compatibility edge.

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

## Release evidence

- Timeline PR #28: migration, adoption proof, backup, dry-run, production
  receipt, export, and erasure coverage.
- Tasks PR #46: artifact, owner studio, receipt qualification, 260 tests,
  six desktop/mobile browser checks, Axe, keyboard, privacy headers, and view
  isolation.
- Studio PR #90: exact branded wedding path repair and production smoke.

The owner workspace now opens on this component and preserves the publication
boundary. The Timeline marketing page also uses this artifact contract as its
product proof.

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
