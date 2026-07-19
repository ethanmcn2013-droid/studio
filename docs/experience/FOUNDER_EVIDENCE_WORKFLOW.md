# Founder evidence workflow

This workflow records Ethan McNamara in the `founder` approval role while preserving the exact rendered evidence that was reviewed. It never invents audit scores and never edits operator to-dos.

## Required config

Pass a JSON file with `schemaVersion: "signal-founder-evidence-config/1"`. It must contain:

- `approval.actor`: exactly `Ethan McNamara`
- `approval.approvedAt`: an ISO date-time
- `approval.approvalSource`: an existing repository-relative authorization receipt
- `approval.note`: the approval-history note
- `reviewSelections`: experience/state pairs, with optional breakpoint subsets
- `goldenSet.approvalTask`: the canonical approval task ID
- `goldenSet.scoredBy`, `scoredAt`, and `scoringSource`: the delegated specialist who supplied the scores, the review date, and an existing repository-relative score receipt
- `goldenSet.references`: one entry per golden experience, containing its state and an explicit 13-dimension `scoresByBreakpoint` map for each of `mobile`, `tablet`, `desktop`, and `wide`

There are no default scores. Missing dimensions, extra breakpoints, scores outside integer `0..4`, any category below `3`, or an overall score below `3.5` fail closed. Audit evidence is content-addressed as `...png#sha256=<64 hex characters>` and is also bound to the exact review ID; changing baseline bytes invalidates the proof.

## Run order

1. Prepare schema-valid review records for the exact passing candidates:

   ```powershell
   corepack pnpm experience:founder-evidence prepare-reviews --config <config.json>
   ```

2. Promote only those reviewed candidates through the existing baseline approval command. The approval command must copy the candidates before audit preparation can pass.

3. Prepare audits from the supplied score matrix:

   ```powershell
   corepack pnpm experience:founder-evidence prepare-audits --config <config.json>
   ```

4. Finalize the golden-set v2 references, registry overrides, and materialized registry:

   ```powershell
   corepack pnpm experience:founder-evidence finalize --config <config.json>
   ```

Add `--dry-run` to any stage to validate without writing. Finalization requires all four exact candidate hashes, copied baseline PNGs, matching founder review records, and matching passing audit records. Partial or stale evidence cannot approve the golden set.
