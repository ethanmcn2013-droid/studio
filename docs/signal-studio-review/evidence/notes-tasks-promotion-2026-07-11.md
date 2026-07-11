# Notes → Tasks promotion contract — 2026-07-11

Notes promotion is now explicit, signed, and retry-safe:

- Notes discovers the caller's Tasks workspaces through an audience-bound
  assertion; no email is used.
- The selected destination workspace is included in both the signed assertion
  and request body.
- Tasks verifies immutable subject membership in that exact workspace.
- A retry targeting another workspace is rejected rather than silently moved.
- `source_note_id` has a reviewed unique index, preventing duplicate tasks
  under concurrent retries.
- The response continues to return the canonical task URL, workspace name, and
  creation receipt.

Receipts:

- Notes typecheck and production build pass.
- Tasks typecheck and production build pass.
- Notes assertion tests: 4/4 pass.
- Tasks contract tests: 2/2 pass.
- Implementation commits: Notes `8fe4d9f227ba5023a15002e7f3c633252db73f26`,
  Tasks `1f8296808b837f51b671ad9b1947cfb136b7d750`.

Preview and production journey receipts remain open.
