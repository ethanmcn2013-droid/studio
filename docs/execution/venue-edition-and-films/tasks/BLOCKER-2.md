# BLOCKER-2 — A couple can never get a Timeline workspace

**Task ID:** BLOCKER-2
**Epic:** E05 — the couple planning experience (production blocker, recorded in `evidence/E05-E06-audit.md`)
**Status:** Founder Review
**Executor:** claude_code
**Approver:** Ethan McNamara
**Spec written:** 2026-08-03

---

## Objective

Make a sponsored couple's Timeline exist and open on real milestones, closing
both halves of the second production blocker.

## Business reason

Timeline is the film's hero surface. "Before the Day" ends on a walkthrough
call to action, and the thing being walked through is the couple's Timeline.
A venue paying EUR 1,000 is buying something to give couples, and the most
visible part of that something rendered a permanent empty state whose advice
did nothing. Nothing else in E06 is demonstrable while a couple cannot reach a
Timeline at all.

## Intended outcome

A couple who redeems a venue code and opens Timeline lands in their own
Timeline workspace, bound to their Tasks workspace, showing six milestones
drawn from their wedding plan and ordered around their wedding date. Nothing
about it is public.

## Deliverables

- [x] `ensureTimelineWorkspaceForUser`, wired into `getCurrentWorkspace`
- [x] A written, in-code answer to *when* a couple's Timeline is created and why then
- [x] The wedding template declares Timeline points and wedding-relative dates
- [x] A contract test that fails before the change, registered in `pnpm test`
- [x] Unit tests for the slug derivation, registered in `pnpm test`

## Scope

Provisioning a private Timeline workspace and one bound project; declaring
which wedding-template tasks are milestones and when they fall.

## Non-goals

- **Publishing.** No publication, no share token, no public URL. Publishing
  stays a separate, deliberate act by the couple.
- **Running the milestone sync.** The plan page already has an autosync
  lifecycle; provisioning does not reach across to the Tasks database on a
  first-paint render.
- **Rewriting the wedding template's copy.** That is E05.03 and it is founder
  copy. No title, lane, priority or tag changed.
- **Dating the other twelve tasks.** Also E05.03. Six points were dated, and
  the contract test pins that the other twelve are still undated.
- **Anything venue-facing.** The venue's read paths are unchanged.

## Dependencies

| Dependency | State | Waived? |
|---|---|---|
| R-031 (does the couple's artifact belong on `/p`) | done — D-033, Option B | no |
| E05 blocker 1, the `/app` gate | done — `evidence/E05-production-blocker-app-gate.md` | no |
| E05.03 wedding template content | open | no — this task deliberately touches no copy |

## Inputs

- `evidence/E05-E06-audit.md` — blocker 2 as originally recorded. **Candidate
  evidence, and partly superseded**: it attributes the empty Timeline to
  `applyTemplateToWorkspace` never setting `dueAt`, which is no longer true.
- `evidence/E05.08-timeline-planning-boundary.md` — corrects that attribution
  and measures the template: 18 tasks, 0 milestones declared, 0 due offsets.
  This is the accurate statement of the second half.
- `evidence/E05-production-blocker-app-gate.md` — closes blocker 1 and states
  why blocker 2 was left open: the seeding decision was blocked on R-031.
- D-033 — R-031 decided as Option B, which unblocks the seeding question.

## Implementation approach

Two halves, both required, because either alone leaves a couple with nothing.

**Half A, the template.** `applyTemplateToWorkspace` already writes
`isMilestone` and a resolved `dueAt`; the mechanism has been built for some
time. The shipped wedding template declares neither on any of its eighteen
tasks. The canonical template lives in the studio repository and
`src/lib/templates.generated.ts` is a generated artifact marked "do not edit by
hand", so the declaration lives in a bridge module,
`src/lib/wedding-template-timeline.ts`, applied where the synced templates are
spliced. The bridge is written to retire itself: if the canonical template ever
declares a milestone of its own, the bridge returns it untouched.

**Half B, provisioning.** On first visit to Timeline, not at redemption.
Redemption runs inside a Server Component render and writes to the Tasks
database only; Timeline is a separate libSQL database. A couple must never lose
an entitlement because a second database was slow. Lazy per-layer seeding on
first visit is also the convention already written into
`workspaces.template_id`'s own schema comment, and it is idempotent, so it
repairs every couple who has already redeemed rather than only the next one.

## Acceptance criteria

1. `getCurrentWorkspace` provisions a Timeline workspace for a user who owns a
   Tasks workspace and has none, and the provisioning function has a caller —
   proven by a contract test that goes red when the call is removed.
2. Provisioning is the fallback branch only. A user who already has a Timeline
   workspace costs the same one query as before.
3. Only a workspace the user OWNS is provisioned against. Membership of
   someone else's board never creates a Timeline over their plan.
4. Provisioning creates nothing public: no publication, no share token, and the
   project it creates is explicitly unpublished.
5. The wedding template declares between one and eight Timeline milestones, and
   every declared point still matches a task title in the template.
6. Each milestone resolves a real `due_at` from a wedding date and resolves
   `null` without one, so no date is ever fabricated.
7. No task on the R-017 special-category list is a milestone.
8. The twelve non-milestone tasks remain undated, so this task has not
   pre-empted E05.03.
9. Every new test file is registered in `package.json`'s `test` script.
10. Nothing in this task states or implies legal approval or GDPR compliance.

## Validation plan

- `node --test src/modules/timeline/server/timeline-provisioning-contract.test.mjs`
  with a fail-before mutation restoring the blocker.
- `node --import tsx --test src/lib/wedding-template-contract.test.ts` with a
  fail-before run against the pre-change template.
- `node --import tsx --test src/modules/timeline/lib/provision-slug.test.ts`.
- `pnpm typecheck`, `pnpm test`, `pnpm test:timeline-owner`,
  `node scripts/check-module-boundaries.mjs`,
  `node scripts/check-migration-contract.mjs`.

## Evidence required

`evidence/BLOCKER-2-timeline-workspace-provisioning.md`, criterion by criterion,
with commands and their real output including the fail-before runs.

## Risks

- **Behaviour is not proven end to end.** The contract test asserts wiring and
  refusals from source text, and says so in its own header. Proving that a
  real couple lands in a real Timeline needs two live libSQL databases and a
  Clerk subject, and no such fixture exists in this repository. Recorded, not
  papered over. This is the same class of gap as the 128 Playwright tests that
  all run in demo mode.
- **The bridge matches on exact task title.** If studio edits the wedding
  template copy and re-syncs, a point stops applying. Criterion 5's test is the
  only thing that catches it, which is why it exists.
- **`SIGNAL_AUDIENCE_TIMELINE_ENABLED`.** Publishing a Timeline is behind that
  environment flag. Provisioning is not, so a couple gets a private Timeline
  either way, but they cannot publish it until the flag is set in production.
  Unchanged by this task and stated so it is not discovered later.

## Decisions required

1. **The bridge, or the canonical template.** The milestone declaration lives
   in the app repository because the generated artifact cannot hold it. The
   durable home is `studio/src/lib/templates/wedding-planning-workspace/`, which
   this work package had no worktree for. Approve the bridge as shipped, or
   direct the same six points into the canonical template and let the bridge
   retire itself.
2. **The six points themselves.** They are a product judgement about what a
   couple's Timeline opens on: the venue contract at 270 days out, menu
   decisions at 42, guest numbers at 21, the seating chart at 14, the final-week
   walkthrough at 7, and one point 14 days after the day so the Timeline does
   not end on the wedding.

---

## Founder sign-off

**Do not fill this in on Claude's behalf.**

- [ ] Acceptance criteria met
- [ ] Evidence reviewed
- [ ] Verification passed
- [ ] Approved

**Approved by:**
**Date:**
**Note:**
