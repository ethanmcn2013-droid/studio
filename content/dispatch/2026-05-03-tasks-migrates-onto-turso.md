## 2026-05-03 · ships · Tasks migrates onto Turso

**The substrate underneath the first product moves from a single
hosted Postgres into Turso's edge-replicated SQLite. The migration
ran behind a feature flag for two weeks; today the flag came off and
the old database went read-only. The user-facing difference is
nothing — which is the right amount.**

Why move it at all? Because the read path now travels milliseconds
instead of round-trips, and because the same substrate carries
Timeline, Signal, and Notes on the way in. Picking one substrate
that holds for the suite means the substrate gets tuned once, hard,
instead of four times, softly.
