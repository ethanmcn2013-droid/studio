# Suite lifecycle coordinator — 2026-07-11

Studio now provides a deterministic lifecycle planner and idempotent executor
covering Notes, Tasks, Timeline, Signal, shared entitlements, derived
briefings, caches, logs, and backup rules. It requires immutable subject
identity and explicit workspace scope for workspace actions; email is not an
accepted key.

Receipts:

- Lifecycle coordinator tests: 4/4 pass.
- The delete plan covers all nine stores and includes backups/derived state.
- Duplicate operation keys are executed once.
- Production adapter wiring, retention policy publication, and destructive
  restore/deletion drills remain open.
