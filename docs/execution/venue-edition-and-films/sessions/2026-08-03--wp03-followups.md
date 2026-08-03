# Session wp03-followups — 2026-08-03

Append-only record. Do not rewrite a closed session.

**Objective:** Action the approve-batch sweep guard; scope the design directions for I-009
**Opened:** 2026-08-03T01:22:22.685Z
**Closed:** 2026-08-03T01:22:32.871Z

## Summary

Actioned the founder's ruling on approve-batch --review: the sweep now prints every task it is about to approve grouped by epic, and refuses when it spans more than one until re-issued with --all-epics. Confirmation by re-issue rather than by prompt, because these sessions run unattended and a prompt would hang them. The check is an exported sweepScope function rather than inline code, so four behavioural tests cover it including one that reproduces the exact 00:52 fourteen-task shape. Separately, scoped I-009 into DESIGN_DOCKET.md: forty open tasks carrying a design decision collapse into seven real choices, four of which gate everything else. The Shared Timeline is first, because it carries the longest dependency chain in the programme and BASELINE_REVIEW section 9 found no candidate implementation for E06 at all. Recommended running /lab on the Timeline and the venue-branded welcome so the founder picks between built options on Wednesday rather than deciding from a blank page. Awaiting his go on that. 68 tests pass, validate clean, render --check clean.

## Tasks touched

- None.

## Status changes this session

- None.

## Evidence added

- None.

## Blockers

- `E03.01` Two blind derivations completed and agreed on 26 substantive points, but the reconciled role-map document was never written to disk and one of two adversarial reviewers returned UNSOUND. Two of its load-bearing factual premises were verified WRONG by the main session: the dietary-notes venue flow does not exist (R-017 corrected), and /p is deliberately search-indexable while the map assumes every published surface is token-bound (R-031). The derivations are sound reasoning on partly wrong facts. Needs a second pass on corrected premises before it can gate E03.04/05/06.

## Awaiting founder review

- None.

## Next action

`E03.02` Draft the annual Venue Edition agreement and commercial order form.
