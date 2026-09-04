# Paired release contracts

2026-09-04. Lead implementation following HQ repair 27016169.

The access-term parity checker named a missing legacy App path and skipped App when run in isolated Studio worktrees. It now selects the real venue-access-term implementation through an absolute APP_REPO_PATH, refuses missing explicit/CI vectors, and compares the same canonical vectors run in each repository. App commit 0731ab91 adds those vectors and tests without changing runtime terms.

Observed locally against App 0731ab91: all suite/commercial/read/meaningful-action contracts match; golden vector digest 7498cee02c07 matches; 792 differential access-term cases and 30 App term/vector tests pass; the four consumer CLI regression tests pass. Focused lint and diff whitespace checks pass.

Both Studio workflows fetch the matching App release branch, record its exact revision, enforce consumer parity and run tests using it, then remove only that isolated checkout before scanning/building Studio. App CI likewise selects matching Studio release for access-term tests. Production branches keep main as the paired source.

Integration dependency: current App release 31c6646c predates commercial-v2 and vector updates, so this Studio candidate must remain a draft until the verified App candidate is integrated. A red paired gate is required in the meantime, not a waiver. Runtime billing, provider settlement and launch acceptance are separate.
