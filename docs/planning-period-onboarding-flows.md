# Contextual onboarding flows

## Shared model

Onboarding chooses a Planning Period and Workspace context; it does not assign a permanent user role. The same account may create school, college, wedding and general work.

Each flow stores a resumable server-side session with owner subject, context, current step, schema version, safe structured draft, created Workspace IDs and updated/expiry instants. Draft analytics contain counts and enums only. Names, pasted lines, dates tied to people and Task or Note text are excluded.

Bulk entry is normalised line by line, trims whitespace, removes blank lines and presents duplicates before commit. Users can remove or reorder proposed rows and undo the draft before final confirmation. The final create is transactional and idempotent.

Every flow supports skip, return later and a direct arrival into the selected real Workspace. A user never has to configure every Workspace before beginning.

## Teacher

1. Confirm or edit a suggested school-year name and calendar dates. The suggestion is not country policy.
2. Paste or rapidly enter class names. Copy says Class names, not pupil names.
3. Review, deduplicate, reorder and confirm the class list.
4. Add optional important dates such as midterm, mocks, examination or another named date.
5. Choose one class to shape first.
6. Add a small Covered, Now and Next milestone set.
7. Preview the frozen Class Timeline fields and audience boundary.
8. Arrive in the chosen Class Workspace.

No pupil account, name, email, identifier, attendance, grade or submission is requested or stored.

Teacher activation means one school-year period, at least two class Workspaces, meaningful milestones in one class and a Class Timeline preview. The production proposition may use six classes as its demonstrated scale without making six a requirement.

## Student

1. Name and date the semester.
2. Paste modules in bulk.
3. Review, deduplicate, reorder and confirm. Every module is a separate Workspace.
4. Add known assessments, examinations or a primary date.
5. Choose the module needing attention first.
6. Create the first real Task.
7. View semester Signal, capped at three explainable items.
8. Arrive in the selected Module Workspace.

Student activation means one semester, at least three module Workspaces, one deadline or primary date, one Task and one semester Signal view.

## Wedding and sponsored activation

1. Validate the venue entitlement or continue without a sponsor.
2. Confirm a couple-selected public/private wedding label.
3. Add the wedding date and optional ceremony information.
4. Review initial milestones.
5. Preview the frozen Couple Timeline fields.
6. Arrive in the private Wedding Workspace.

The couple owns the Workspace. The sponsor relation contains activation and entitlement metadata, not Membership. Venue-facing reads expose only default activation metadata plus fields covered by a live consent receipt.

Wedding activation means sponsored access is activated where applicable, a Wedding Workspace and date exist, at least three milestones exist, and the Couple Timeline has been previewed or shared.

## Interruption and failure

- Save after every meaningful step with optimistic version checking.
- A stale tab receives a recoverable conflict message and reload option.
- Failed final creation retains the reviewed draft and does not leave a partial class/module set.
- If the catalog resolver is unavailable, existing private capture remains available and association can be retried.
- Expired drafts are recoverable for a documented retention window or can be discarded explicitly.

## Accessibility and responsive contract

- Native labels, inputs, buttons and links; associated inline errors.
- Full keyboard flow, visible focus, logical order and focus restoration after dialogs.
- Screen-reader status for save, dedupe, create and preview changes.
- Reorder buttons are always available; drag and drop is optional.
- Touch targets are at least 44 by 44 CSS pixels.
- Reduced motion removes spatial transitions without hiding state.
- Core actions remain available at 320 CSS pixels, 200 percent zoom, tablet and desktop without horizontal page scrolling.
