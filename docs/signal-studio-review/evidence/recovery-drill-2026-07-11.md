# Isolated recovery and rollback drill — 2026-07-11

Receipt:

```text
corepack pnpm recovery:drill
{"ok":true,"restoreRows":2,"rollbackRelease":"v1"}
```

The drill creates an isolated SQLite source, writes a two-row probe, exports
and restores it into a fresh database, then verifies the rows byte-for-byte. It
also switches a release pointer from `v2` back to `v1` and verifies the
rollback target. Temporary artifacts are uniquely named and production is not
touched.

Provider-native backup restore, production alias rollback, RPO/RTO timing, and
operator authorization remain open for the final gate.
