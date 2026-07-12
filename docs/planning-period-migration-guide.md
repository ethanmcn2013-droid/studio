# Planning Period migration guide

## Scope

The migration is additive and preserves every existing Workspace ID, slug, Note, Task, Timeline item and public link. It does not force established users through onboarding and it does not make sponsorship imply ownership.

## Preconditions

1. Record database identity, schema version, row counts and a tested backup/restore receipt.
2. Confirm the Tasks deployment can accept both contract v1 and v2.
3. Run the migration against a restored realistic snapshot.
4. Enable no new feature flag until the preflight report contains no unexplained owner ambiguity.

## Additive phase

Create PlanningPeriod and onboarding/session tables. Add nullable Planning Period, context, primary-date, ordering, archive, revision and updated fields to Workspace. Create sponsorship activation and consent tables separately from Membership. Add indexes for owner plus archive plus position, period plus archive plus position, and current membership lookups.

Do not rebuild Workspace to make planning_period_id non-null in this release.

## Idempotent backfill

For each Workspace:

1. Use owner_user_id when it is present and backed by an owner Membership.
2. When it is missing, infer an owner only if exactly one owner Membership exists.
3. Create one deterministic Active work PlanningPeriod per unambiguous owner.
4. Assign each ungrouped Workspace to that owner’s default period without changing its ID or slug.
5. Record ambiguous, missing-owner and conflicting-owner Workspaces in the migration report. Do not merge, transfer or guess.
6. Leave already grouped Workspaces untouched so the process is repeatable.

The deterministic period key is derived from the immutable owner subject and a versioned namespace. It must not contain email or display name.

## Verification

- Existing deep links resolve to the same Workspace.
- Workspace and content row counts are unchanged.
- Every assigned Workspace belongs to the period owner or is listed as an exception.
- Collaborators see only Workspaces where they have current Membership, even when they can name a period ID.
- Sponsor rows produce no Membership rows.
- Archived and moved Workspaces remain tenant-scoped.
- Query plans use the new owner/period/membership indexes.
- Scenario fixtures cover multiple Workspaces, multiple owners, collaborators, a missing owner, duplicate names and archived records.

## Rollout

1. Deploy v2 contract readers while still writing v1-compatible fields.
2. Apply schema migration after backup and preflight.
3. Run backfill in report mode, review exceptions, then apply.
4. Deploy Tasks catalog reads and Your Work behind planning-periods.
5. Deploy Notes association and period Signal.
6. Deploy frozen Timeline projection and audience shares.
7. Enable contextual onboarding for internal accounts, then a small design-partner cohort.
8. Keep legacy Timeline links available until owners explicitly migrate or rotate them.

## Rollback and forward fix

Disable the new entry-point flags. Existing apps continue reading their prior fields, and additive tables/columns remain in place. Do not drop populated tables during incident response. Correct bad associations with an audited forward migration using immutable IDs. Restore from backup only for verified data corruption, following the existing recovery runbook.

## Production gate

No production migration is authorized by this document alone. Required receipts are a current backup/restore proof, provider identity verification, successful realistic-snapshot migration tests, zero unexplained owner conflicts, deployment rollback command and named operator.
