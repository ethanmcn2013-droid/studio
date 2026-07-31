# Cycle 3: Shared Update Artefact

Cycle 3 turns the collaboration growth loop into a visible output.

The first built artefact is the Signal Timeline shared update page:

`/[workspace]/update`

## Purpose

Give someone a short, plain-language state of the work before asking them to open a full workspace, learn a tool, or create an account.

This is the first practical proof of:

Workspace created -> collaborators invited -> work becomes clearer -> shareable output created -> new creator discovered.

## What It Shows

The shared update should answer:

- What is the current state?
- What is happening now?
- What is held up?
- What comes next?
- What changed?
- Where does the plan stand?

It should not expose private notes, internal work, or unrelated workspace context.

## Source Tracking

V1 links carry:

| Field | Example |
| --- | --- |
| source | timeline_share |
| segment | weddings |
| role | viewer |
| campaign | collaboration_proof |
| artefact | shared_update |

These fields are intentionally simple. The first goal is to make the share path real, not to build a full attribution system.

## Discovery Surface

The page includes a tasteful "Created with Signal Studio" link.

The CTA should feel like attribution, not an advert interrupting the work.

## Acceptance Test

A viewer opens a shared update and understands the state of the work in under 60 seconds.

For the first demo, use:

`/tasks/update?source=roadmap_share&segment=general&role=viewer&campaign=collaboration_proof&artefact=shared_update`

For the weddings/events wedge, adapt the same pattern into a planning update that a venue, planner, couple, or supplier can forward.

## Next Iteration

- Add owner-controlled visibility and revocation.
- Track shared-update views and creator conversions.
- Add a wedding/events version with venue meeting context.
- Connect the shared update to Today Signal once Signal is ready.
