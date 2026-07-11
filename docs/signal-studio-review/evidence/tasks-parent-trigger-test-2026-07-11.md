# Tasks parent-workspace trigger test · 2026-07-11

The migration was applied to an isolated temporary libSQL database.

- A same-workspace top-level parent and child insert succeeded.
- A child insert using a foreign workspace parent was rejected by the trigger.
- The temporary database was removed after the test.

This proves the migration SQL behavior. It does not prove the production
database has been audited or migrated; that remains the P0 operator gate.
