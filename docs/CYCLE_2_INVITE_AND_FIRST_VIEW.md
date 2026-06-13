# Cycle 2: Invite And Collaborator First View

Cycle 2 turns the collaboration loop into a concrete access model.

The goal is not "team management." The goal is that someone invited into a Signal workspace understands what matters before they configure anything.

## Cycle Goal

Define:

- who can be invited
- what each role can safely see
- what each role can safely do
- what an invited person sees first
- which shared artefacts can travel outside the workspace
- how invite and share links should carry source tracking

## Roles

| Role | Plain name | Purpose | Default access |
| --- | --- | --- | --- |
| Creator | Workspace creator | Starts the workspace, invites people, controls sharing, and owns the rhythm. | Full workspace control. |
| Collaborator | Invited collaborator | Does real work without setup or admin decisions. | Workspace access plus assigned/shared work updates. |
| Guest | Guest | Opens a clear page or output without becoming a full user first. | Selected shared output only. |
| Client / supplier | Client / supplier | Understands what is needed from them in a real-world coordination flow. | Focused access to relevant tasks, decisions, follow-ups, or updates. |
| Viewer | Viewer | Reads a public or owner-controlled artefact and may become a creator later. | Read-only access to a specific output. |

## Permission Principles

- The creator controls visibility.
- Guests should receive value before sign-up.
- Collaborators can update work that involves them.
- Viewers cannot browse private workspace context.
- Private notes are never published by accident.
- Invite and share links should be revocable.
- Source tracking should not expose private user data.

## Collaborator First View

The first view should answer five questions:

| Section | Question | Source |
| --- | --- | --- |
| What matters now | What needs my attention? | Signal |
| My work | What do I own? | Tasks |
| What changed | What moved since I last looked? | Updates / Timeline |
| What was decided | What did we agree? | Notes |
| Where this is going | What happens next? | Timeline |

This view should appear before a dense list, board, or timeline.

## First Wedding/Events Acceptance Test

A venue coordinator invites a couple into a wedding planning workspace.

The couple should see:

- the next planning milestone
- their own follow-ups
- what the venue or planner owns
- recent decisions
- open questions
- anything waiting on them
- a short Today Signal briefing

The couple should not need to:

- choose a view
- learn a status system
- configure notifications
- understand product boundaries
- browse internal venue notes

## First Shareable Artefacts

Prioritise these three:

1. Planning timeline
2. Venue meeting follow-up
3. Today Signal briefing

Each artefact needs:

- owner-controlled visibility
- clear title
- plain-language status
- source tracking
- tasteful "Created with Signal Studio"
- one next action

## Source Tracking

V1 source fields:

| Field | Example |
| --- | --- |
| source | invite, timeline_share, note_followup, briefing_share, template |
| segment | weddings, students, freelancers |
| role | creator, collaborator, guest, viewer |
| campaign | founding_venue, planner_pilot, collaboration_proof |
| artefact | planning_timeline, venue_followup, today_signal |

Do not overbuild attribution before the first share path works.

## Build Order

1. Finalise role names and safe defaults.
2. Design collaborator first view for the wedding workspace.
3. Define invite email and destination screen.
4. Build the first shareable artefact model.
5. Add source tracking fields.
6. Create the first demo path: venue invites couple.

