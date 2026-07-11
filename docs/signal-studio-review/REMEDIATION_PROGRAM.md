# Remediation program operating guide

The authoritative status is `remediation-program.yaml`. It is JSON-compatible
YAML by design so the Studio repo can validate it without adding a parser
dependency. Do not maintain a second checklist in chat, a PR description, or a
product-specific README.

## Operating rules

1. Work from a dedicated branch or isolated worktree.
2. Preserve unrelated dirty work and active worktrees.
3. Add evidence before changing an item to `verifying`.
4. Only the validator may decide the program percentage.
5. P0/P1 blockers require an HQ operator to-do when founder action is needed.
6. A security or data-integrity veto blocks release until its exact acceptance condition is met.
7. Cross-product changes deploy producer compatibility before consumer cleanup.

## Evidence classes

- `tests`: focused, regression, contract, authorization, or journey tests.
- `builds`: typecheck, lint, production build, migration dry run, or CI output.
- `previews`: preview URL, browser evidence, or shadow parity result.
- `production`: production smoke, provider verification, rollback/restore drill, or monitoring receipt.

## Status meanings

`planned` is not started. `active` is being implemented. `blocked` requires a
documented dependency or founder gate. `verifying` has implementation evidence
but has not passed all acceptance gates. `complete` requires the full evidence
contract and a passing validator run.
