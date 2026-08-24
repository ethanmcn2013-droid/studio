---
id: tenant-scope-detector-blind-spots
title: The only thing stopping a cross-tenant read is a text scanner, and it has been proven to miss.
category: Infrastructure
likelihood: Medium
impact: High
status: Monitoring
owner: Ethan
reviewDate: 2026-09-12
---

## The risk

Tasks runs on libSQL over Turso, which has no row-level security. Nothing in the
database stops workspace A reading workspace B. The entire boundary is a
`WHERE workspace_id = ?` on every query, and the only thing checking that the
predicate is present is `src/server/tenant-scope.test.mjs`, which reads source
code as text and looks for tokens.

A text scanner can be fooled, and twice now it has been. On 2026-08-03 a join's
ON clause containing `users.id` counted as proof of scope. On 2026-08-12 the
daily digest read every tenant's activity log with no workspace predicate at
all, and the gate reported it scoped on the strength of the `userId` inside
`.leftJoin(users, eq(activities.userId, users.id))`. The digest is emailed, so
another workspace's comment snippet and task title could leave the product.

The same query applied its 50-row limit across every tenant before any
per-user filtering, which dropped people's real mentions whenever other
workspaces were busier. That half needed no attacker and no coincidence.

## Mitigation

Both digest reads are scoped through `byWorkspace()`, the sanctioned choke
point that throws rather than build an unscoped query from an empty workspace
id, and the row limit now sits after the tenant predicate and the mention
match instead of before them.

The detector no longer accepts a tenant token that appears only inside a
`.leftJoin(...)` ON clause. This is a fact about SQL rather than a heuristic:
a left join preserves every row of the left table whatever the ON clause says,
so it cannot restrict anything. Inner joins are untouched, because an inner
join to the membership table genuinely does narrow the result.

The detector's own sensitivity suite, `tenant-scope-rules.test.mjs`, had never
run. It sat in the test command as an argument to a different script, without
the flag that runs it. It runs now, and brought 27 tests with it.

## Verification

App PR #128. A behavioural test seeds two tenants in a real database and
executes the digest query rather than inspecting it. Reverting the fix turns
three of its four assertions red with the exact failures claimed, and the
fourth is a control that runs the old form and proves it does leak. A sweep of
all four tenant surfaces reports no unscoped reads. Gates: typecheck clean,
1648 of 1648 tests passing, build clean.

## Remaining watch

The detector still cannot catch every shape. A read filtered by an id it was
handed, such as the digest's task-title lookup, passes on the by-authorized-id
model, and a text scanner cannot tell an id the caller authorised from one it
read off another tenant's row. Behavioural tests catch that class; the static
gate does not.

This is the detector's half of D-018 in the app repo, the defect class where
authorization is expressed as a row filter. The join case is worse than the
one D-018 describes, because a left join's ON clause is not even a filter. It
reads like proof of scope and restricts nothing.

Reopen this risk if a third false negative is found, if any new outbound path
compiles content from a tenant-keyed table, or when row-level security becomes
available and this whole control can be replaced with something the database
enforces rather than something a regex believes.
