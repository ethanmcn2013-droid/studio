# Planning Period verification record

Status: implementation in progress. This file records evidence; unchecked gates are not claims.

## Recorded clean baseline

On 2026-07-12, isolated worktrees from each remote main completed:

- type checking in Studio, Tasks, Timeline, Signal and Notes;
- existing unit/contract tests in all five deployables;
- production builds in all five deployables;
- design-system checks in all five deployables;
- migration-contract checks in Tasks, Timeline and Signal;
- Studio remediation and recovery checks.

Pre-existing failures were recorded separately: Studio, Tasks, Timeline and Signal have existing repository-wide lint errors; Notes has no lint script; Tasks parser expectations fail because the current fixture yields 8 rather than the stale expected corpus of at least 140. New and changed files remain responsible for focused lint quality.

## Required implementation evidence

- [ ] Contract v1 and v2 consumer parity.
- [ ] Additive migration and idempotent backfill against realistic fixtures.
- [ ] Existing Workspace IDs, slugs and content unchanged.
- [ ] Owner/collaborator/sponsor/audience/anonymous authorization matrix.
- [ ] Planning Period child listing independently Membership-filtered.
- [ ] Europe/Dublin DST and calendar rollover tests.
- [ ] Honest time, milestone and fixed-date states shown separately.
- [ ] Teacher six-class bulk onboarding and resume.
- [ ] Student four-module onboarding and period Signal.
- [ ] Sponsored wedding with no sponsor content query.
- [ ] Workspace context survives Notes to Tasks to Timeline.
- [ ] Frozen promotion excludes private description and attachment.
- [ ] Immediate revoked/rotated/expired audience-link behavior.
- [ ] Public API, HTML, RSC/hydration, metadata and log snapshots contain no private fields.
- [ ] No pupil entity or identifier is required or stored.
- [ ] Duplication resets completion and does not copy links, invites, audit or sponsor access.
- [ ] Keyboard-only principal flow and visible focus.
- [ ] Reduced-motion behavior.
- [ ] 320 px, phone, tablet, laptop, wide desktop and 200 percent zoom.
- [ ] Browser console and network inspection.
- [ ] Realistic 50-workspace and sponsor activation volume.
- [ ] Query-plan/N+1 inspection.
- [ ] Full format, lint, typecheck, unit, integration, E2E, accessibility, migration and build commands.

## Screenshot artifacts

Final artifacts must cover Your Work, teacher onboarding, semester setup, sponsored wedding setup, a class Workspace, Planning Period Signal, promotion preview, Class Timeline, projector mode, duplication/archive and mobile views. Screenshots supplement but do not replace automated tests.
