# BLOCKER-2 — a couple can now get a Timeline workspace, and it is not empty

**Date:** 2026-08-03 · **Package:** WP-14 (Wave 4) · **Branch:** `claude/wp14-timeline`
(app repo, worktree `_wt-wp14`, stacked on the approved-but-unmerged
`claude/wp08-couple`). **Not merged. Founder review required.**

Acceptance criteria were written before the assessment and are in
`tasks/BLOCKER-2.md`. Every claim below carries a path and a line as it stands
in that worktree, or a command and its real output.

---

## The blocker, restated accurately

The E05/E06 audit recorded two production blockers. The first, the `/app` gate,
was closed in Wave 3. The second was recorded as *"a couple can never get a
Timeline workspace"* and it has two halves, which matters because fixing either
alone leaves a couple with nothing.

**Half A — nothing creates a Timeline workspace.** `createWorkspaceAction`
(`src/modules/timeline/server/actions/workspaces.ts:93`) had zero callers across
`src`, `e2e`, `scripts` and `experience`. `getCurrentWorkspace`
(`server/auth.ts`) returned `workspaces[0] ?? null`, which in production was
null forever, so `/app/timeline` rendered a permanent empty state advising
"Create a workspace in Tasks first" — advice that did nothing, because creating
a Tasks workspace did not create a Timeline one.

**Half B — even a provisioned Timeline renders empty.** Timeline's milestone
source reads `WHERE t.is_milestone = 1 ... ORDER BY t.due_at`
(`src/modules/timeline/server/sync/tasks-milestone-source.ts:129-141`). The
shipped wedding template declares neither `milestone` nor `dueOffsetDays` on any
of its eighteen tasks.

**Correction carried forward.** `evidence/E05-E06-audit.md` attributes half B to
`applyTemplateToWorkspace` never setting `dueAt`. That is no longer true and was
already corrected by `evidence/E05.08-timeline-planning-boundary.md` §5:
`apply-template.ts:74-81` sets both `dueAt` (via `resolveTemplateDueAt`) and
`isMilestone`. The mechanism was built. What was missing was template data. That
correction makes half B much cheaper than the audit implied, and this work took
the corrected route.

---

## Criterion by criterion

### 1. `getCurrentWorkspace` provisions, and the provisioning function has a caller — **MET**

`src/modules/timeline/server/auth.ts`:

```ts
const workspaces = await getWorkspacesForUser(userId);
if (workspaces[0]) return workspaces[0];
return ensureTimelineWorkspaceForUser(userId);
```

`src/modules/timeline/server/provision-workspace.ts` is the new module.

**Proven by fail-before mutation, run verbatim.** With the call removed and the
import deleted — that is, with blocker 2 restored exactly as it was:

```
✖ getCurrentWorkspace actually calls the provisioning path (5.7776ms)
✖ the provisioning path is only taken when the user has no workspace (3.3701ms)
✔ provisioning creates nothing public (1.1089ms)
✔ the provisioned project is created unpublished (0.772ms)
✔ only an owner's workspace can be provisioned against (0.6576ms)
✔ the primary-workspace lookup fails closed (0.6279ms)
ℹ tests 6  ℹ pass 4  ℹ fail 2
```

Exactly the two wiring assertions went red. The file was restored from a copy
taken before the mutation and the test returned to 6 pass, 0 fail.

The test asserts against **source text on purpose** and says so in its own
header, for the same reason `src/server/app-gate-contract.test.mjs` does: this
defect was never a logic bug. `createWorkspaceAction` was correct all along and
simply had no caller. Only the wiring can catch that, so only the wiring is
asserted.

### 2. Provisioning is the fallback branch only — **MET**

Asserted by `the provisioning path is only taken when the user has no
workspace`, which pins the literal `if (workspaces[0]) return workspaces[0];`.
A user who already has a Timeline costs the same single query as before, and no
cross-database write lands on a normal page render.

### 3. Only an owned workspace is provisioned against — **MET**

`getPrimaryTasksWorkspaceForUser`
(`src/modules/timeline/server/sync/tasks-workspace-context.ts`) filters
`wm.role = 'owner'` and `w.archived_at IS NULL`, bound to `u.clerk_id = ?`.
Without the ownership term, someone invited to another person's board would
have a Timeline provisioned over that person's plan. Asserted by `only an
owner's workspace can be provisioned against`.

A sponsored couple always satisfies it: `src/server/actions/comp.ts:206` calls
`ensureUserProvisioned(userId)` before inserting the entitlement, and
`src/server/db/ensure-user.ts:108` runs
`INSERT OR IGNORE INTO workspace_members (workspace_id, user_id, role)`. This is
the same chain Wave 3 traced to prove the `/app` gate fix covers redeemed
couples.

The tie-break when a user owns several is stated in the code rather than left
to `LIMIT 1`: a wedding workspace wins, then the oldest. It fails closed —
missing configuration, no row, or any error returns null and provisioning is
skipped rather than guessed at. Asserted by `the primary-workspace lookup fails
closed`.

### 4. Provisioning creates nothing public — **MET**

Asserted twice. `provisioning creates nothing public` scans the module (with
comments stripped, so a comment about publishing cannot satisfy it) for
`publishAudiencePublication`, `createAudiencePublication`,
`createNotesAudiencePublication`, `audienceShares`, `audience_shares`,
`timelinePublications`, `timeline_publications`, `mintToken` and `randomToken`.
None appears. `the provisioned project is created unpublished` pins
`publishedAt: null` on the `createProject` call — which matters, because
`createProjectAction` deliberately inherits the workspace's published state
(`server/actions/workspaces.ts:216-218`) and provisioning must not.

This is the criterion that made R-031 a real dependency rather than a formality.
Wave 3 left blocker 2 open precisely because seeding a Timeline before knowing
where the couple's artifact lives would have pre-empted the decision. D-033
answered it, and the answer is that provisioning creates **private planning
material and nothing else**.

### 5. The wedding template declares its Timeline points — **MET**

Six points, against the restraint bar of eight already pinned in
`src/lib/wedding-template-contract.test.ts`.

| Point | Offset from the wedding day | Lane today |
|---|---|---|
| Venue contract and deposit schedule recorded | −270 | done |
| Send menu decisions to catering | −42 | doing |
| Confirm final guest numbers | −21 | doing |
| Review seating chart with venue | −14 | review |
| Book final-week venue walkthrough | −7 | doing |
| Create post-wedding collection list | +14 | todo |

The declaration is `src/lib/wedding-template-timeline.ts`, applied at
`src/lib/templates.ts` where `SYNCED_TEMPLATES` is spliced. It is **not** in
`src/lib/templates.generated.ts`, which carries "AUTO-GENERATED, do not edit by
hand" and is rewritten by `pnpm sync:templates`. The bridge retires itself: if
the canonical studio template ever declares a milestone, `withWeddingTimelinePoints`
returns the template untouched and deleting the bridge changes nothing.

**Fail-before, run verbatim** against the template as it shipped:

```
✔ R-017 guard: no unreviewed special-category collection task ships
✔ restraint bar: the wedding template declares at most eight milestones
✖ audit pin (E05.03): the shipped wedding template declares ZERO milestones
✖ audit pin (E05.03): no task carries a wedding-relative due offset
✔ audit pin (E05.03): every 'due' value is a relative literal, never a date
✔ audit pin (E05.03): the template opens with 18 tasks, two already done
ℹ tests 6  ℹ pass 4  ℹ fail 2
```

Those two audit pins were written by Wave 3 to record that the template
declared nothing, and their own comment says "Update this when template content
lands." They were replaced by assertions of the new state plus three new guards,
which is the diff that records the change.

`every declared Timeline point still exists in the template` catches the one way
this breaks quietly: the bridge matches on exact task title, so a copy edit in
studio followed by a re-sync would silently drop a milestone.

### 6. A date is resolved, never fabricated — **MET**

`each Timeline point resolves a real due date from a wedding date` asserts, for
every milestone, that `resolveTemplateDueAt` returns a `Date` with an anchor of
`2027-09-18` and `null` with no anchor, and that the six sort into the intended
story order. The refusal is `src/lib/template-anchor.ts`'s own: with no wedding
date there is no due date and no fall back to "days from now", because Signal
reads `tasks.due_at` to build the couple's briefing and a date nobody chose
would surface as a date somebody must act on. A milestone with no date still
appears; the milestone query orders `due_at NULLS LAST`.

### 7. No special-category task is a milestone — **MET**

`no special-category task is a Timeline point` runs the milestone set through
the same `SPECIAL_CATEGORY_PATTERNS` the R-017 guard uses. "Collect final
dietary notes" ships in the template and is deliberately absent from the
declaration. R-017 is open; a milestone is the most visible thing in the product
and the thing a published Timeline is built from, so nothing on that list
becomes one while the handling decision is unmade.

### 8. E05.03 is not pre-empted — **MET**

`the twelve non-milestone tasks are still undated` asserts twelve tasks and that
every one resolves `null` even with a wedding date. No title, lane, priority or
tag changed anywhere. Dating the whole template is template copy and the
founder's to approve.

### 9. Every new test file is registered — **MET**

Wave 3 found three privacy tests that had never run in CI because nobody
registered them. Both new files were added to `package.json`'s `test` script in
the same change:

- `src/modules/timeline/server/timeline-provisioning-contract.test.mjs`, in the
  `node --test` `.mjs` segment beside `qualified-view-security.test.mjs`.
- `src/modules/timeline/lib/provision-slug.test.ts`, in the `node --import tsx`
  Timeline segment beside `reserved-slugs.test.ts`.

`src/lib/wedding-template-contract.test.ts` was already registered.

### 10. No claim of legal approval — **MET**

Nothing in the task specification, this document, or any string added to the
product states or implies legal approval, solicitor review or GDPR compliance
(D-016). No user-facing copy was added at all.

---

## Slug derivation, and why it is its own module

A Timeline workspace slug is the primary key of the Timeline `workspaces` table
**and** a public path segment (`/{slug}`), so it must be unique, 3–32
characters, and not one of the reserved route words. `deriveTimelineWorkspaceSlug`
(`src/modules/timeline/lib/provision-slug.ts`) is pure and takes `isTaken` as a
parameter, so the naming rule and the uniqueness rule sit together and are
testable without a database.

```
$ node --import tsx --test src/modules/timeline/lib/provision-slug.test.ts
✔ the Tasks workspace slug is used unchanged when it is free
✔ a taken slug falls through to a readable suffix, not a random one
✔ a reserved word is never returned
✔ a name too short to be a slug still yields a valid one
✔ an unusable name falls back to the workspace id, which always exists
✔ a very long name is clamped without leaving a trailing hyphen
✔ a long name whose suffixed form would overflow still stays valid
✔ it throws rather than returning nothing when every candidate is taken
✔ every candidate it can return passes isValidSlug
ℹ tests 9  ℹ pass 9  ℹ fail 0
```

It throws rather than returning null when it cannot name a workspace. A quiet
null is how blocker 2 stayed invisible for as long as it did.

---

## Verification run

```
$ npx tsc --noEmit --incremental false
(no output, exit 0)

$ node --test src/modules/timeline/server/timeline-provisioning-contract.test.mjs
ℹ tests 6  ℹ pass 6  ℹ fail 0

$ node --import tsx --test src/modules/timeline/lib/provision-slug.test.ts \
    src/lib/wedding-template-contract.test.ts src/lib/template-anchor.test.ts
ℹ tests 27  ℹ pass 27  ℹ fail 0

$ pnpm test:timeline-owner
ℹ tests 70  ℹ pass 70  ℹ fail 0

$ node scripts/check-module-boundaries.mjs
[module-boundaries] ok

$ node scripts/check-frame-headers.mjs
[frame-headers] ok (global DENY confirmed; /embed exception confirmed)

$ node scripts/check-migration-contract.mjs
migration-contract: ok (27 SQL files, 27 receipts, baseline 0014_current_schema_baseline)
```

```
$ pnpm test
(15 segments, 1097 assertions across the reported segments, exit 0)

$ pnpm test; echo $?
0
```

**Reported honestly, including the intermediate red.** An earlier run of the
full chain during this session failed on
`src/modules/timeline/server/couple-artifact-boundary.test.ts:367`
("E06.02 · image and short-story states have no representation at any layer").
That file is untracked in this worktree and belongs to a **concurrent work
package writing into the same worktree at the same time** (see the note below);
it was an audit pin of that package's own, mid-change. It was green by the time
of the run recorded above. Neither the failure nor the fix belongs to this work,
and the final result is a snapshot of a tree two sessions are editing, which is
why the exit code is quoted rather than described.

---

## Honest note: two agents in one worktree

This package was told its worktree was `_wt-wp14`. A second Wave 4 package was
evidently told the same thing, and was writing into it live during this
session — `src/lib/public-analytics-boundary.ts`, `src/lib/wedding-workspace.ts`,
`src/lib/image/`, `src/lib/keepsake/`, `src/modules/timeline/lib/viewer-count.ts`,
`drizzle/0027_workspace_search_visibility.sql` and a rewrite of
`next.config.ts` all appeared in a tree that was clean when this session started.

Two consequences, both material:

1. **R-031 and R-032 were built twice.** Both sessions independently wrote a
   couple-facing analytics boundary, a per-route CSP and a `0027` migration
   adding a search-visibility column — under two different column names,
   `search_indexing_opted_in_at` and `search_visibility_opted_in_at`. Two
   columns for one control is a real defect, so **this package withdrew its
   own**: the duplicate SQL file, receipt, ledger entry, journal entry and
   schema column were removed, and `node scripts/check-migration-contract.mjs`
   confirms the ledger is coherent at 27 files and 27 receipts with the other
   session's `0027` registered. The same was done for the analytics module.
2. **BLOCKER-2 is the only item in this package's brief that no other session
   touched**, and it is the only one this document claims. R-031 and R-032 as
   they now stand in the tree are the other package's work and need that
   package's evidence, not this one's.

**One thing the reconciliation must check.** At the close of this session the
tree carried the other package's `/p` robots disallow, `/p` and `/share` CSP
exclusion, `<GoogleTag>` refusal and Settings changes, but **no `0027`
migration and no search-visibility column on `workspaces`** — both existed
earlier in the session and were withdrawn. `pnpm typecheck` and `pnpm test` are
green, so nothing references a missing column today, but "wedding workspaces
ship noindex by default with an explicit couple opt-in" cannot be satisfied
without somewhere to record the opt-in. Whoever reconciles the two branches
should confirm that column lands exactly once, under exactly one name.

The orchestrator should reconcile the two before either branch is merged. This
is recorded here rather than in a chat message because the next person reading
this tree will otherwise find two implementations of one decision and no
explanation.

---

## What is not proven, stated plainly

**Behaviour end to end.** No test in this repository puts a real subject through
redemption, into the `/app` gate, into Timeline, and out to six rendered
milestones. That needs two live libSQL databases and a Clerk session; the
Playwright suite runs entirely in demo mode (`browser-contract.json` sets
`accessMode: "demo"`), and `critical-fixtures.json`'s own `operatorBlocked`
array records that authenticated states need a review tenant that does not
exist. What is proven is the wiring, the refusals, the ownership filter, the
fail-closed behaviour, the template declaration and the date resolution. The
last mile is a manual run against a real account and it has not been done.

**`SIGNAL_AUDIENCE_TIMELINE_ENABLED`.** Publishing a Timeline is behind that
environment flag (`audience-timeline.ts:49`). Provisioning is not, so a couple
gets a private Timeline whether or not it is set, but they cannot publish one
until it is set in production. Unchanged by this work and restated so it is not
discovered on 1 September.
