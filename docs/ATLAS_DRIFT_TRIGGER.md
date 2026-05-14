# Atlas drift-trigger — v2 spec

The pull-based 60-day stale flag isn't enough. It fires on calendar age,
not truth age — an atlas entry can be wrong on day 2 if the underlying
file changed. This document specifies the v2 piece that closes the gap:
a **write-trigger** that flags entries when files they reference mutate
in git.

Strategy's audit (2026-05-14) named this the load-bearing piece between
"a private notebook with a route" and "a world-class internal product."
Without it, the atlas competes with auto-memory — which updates every
cycle for free — and loses within ~8 weeks.

This is a v2 cycle, scheduled after the stub-filling pass.

---

## Goal

When any file listed in an atlas entry's `references[]` mutates in git,
the entry surfaces a `drifted` flag (distinct from `stale`) in the
index, the row state-note, and the detail page. The drifted file paths
render in a banner above Related, naming exactly what changed since
`lastVerified`.

The flag is a forcing function — clearing it requires either confirming
the entry is still correct (bump `lastVerified`) or rewriting it to
match the new reality.

---

## Where the trigger fires

The trigger is **per-repo**, not centralized. Each of the five product
repos (studio + tasks + roadmap + analytics + notes) gets a pre-commit
hook that runs against its own staged files and writes drift into the
canonical sidecar at:

```
~/Projects/personal/studio/content/atlas/_drift.json
```

The studio repo's atlas loader already reads this sidecar
(`src/lib/atlas/loader.ts` → `readDriftSidecar`). Missing file or
missing slug means no drift, by design.

### Sidecar shape

```json
{
  "<slug>": {
    "drifted": ["path/relative/to/repo-root.ts", "ENV_VAR_NAME"],
    "updatedAt": "2026-05-14T19:42:00Z",
    "byCommit": "abc1234"
  }
}
```

Top-level keys are atlas entry slugs. `drifted` lists the references
that mutated. `updatedAt` is provenance. `byCommit` is the commit SHA
that triggered the flag — useful for `git show` to read the diff.

---

## How the per-repo trigger works

Each product repo gets a script at `scripts/atlas-drift-check.ts` and
a git pre-commit hook that runs it.

### Pre-commit hook (per repo)

```bash
#!/usr/bin/env bash
# .git/hooks/pre-commit (or managed via husky / simple-git-hooks)
exec node scripts/atlas-drift-check.mjs
```

### `scripts/atlas-drift-check.ts` (per repo)

Pseudocode:

```ts
// 1. Read all atlas entries from
//    ~/Projects/personal/studio/content/atlas/*.md
// 2. For each entry, normalize its references[] into a set of
//    repo-relative paths that could exist in THIS repo.
//    References use leading "~/Projects/personal/<repo>/" prefix —
//    only references matching THIS repo's path are checked here.
// 3. Run `git diff --cached --name-only` to get staged files.
// 4. For each entry whose normalized references overlap with the
//    staged file set, mark the entry as drifted.
// 5. Read the existing sidecar at
//    ~/Projects/personal/studio/content/atlas/_drift.json
//    (or {} if missing).
// 6. Merge the new drift entries — union, not replace — so drift
//    detected in one repo doesn't clear drift detected in another.
// 7. Write the sidecar back. Commit it as part of the same commit
//    that mutated the source files (the hook stages it explicitly
//    via `git add`).
// 8. Print a one-line summary so the operator sees that drift was
//    flagged before the commit lands.
```

The hook **never blocks commits**. It records the drift. Blocking would
turn the atlas into bureaucracy; recording turns it into a signal.

### Clearing drift

When an operator confirms an entry is still correct or rewrites it to
match, they bump `lastVerified: YYYY-MM-DD` in the entry's frontmatter.
The hook treats a bumped `lastVerified` as an implicit clear — it
removes the slug from the sidecar.

---

## Why this shape (and not the others considered)

**GitHub Actions on push (instead of pre-commit hook):** rejected.
Atlas reads on dev should reflect local working state, not just
pushed state. Most cycle work is local-first.

**A single shared script across all 5 repos:** rejected. The studio
repo doesn't have visibility into other repos' staged files. A shared
script would require either a monorepo (out of scope) or running the
check as a cron against all five working trees (fragile, async).

**Watching `git mtime` directly without a hook:** rejected. mtime
isn't a true mutation signal — `git checkout` updates it. Diff-against-
HEAD is the only reliable shape.

**Storing drift in each entry's frontmatter:** rejected. That would
require the trigger to *edit the entry* on every commit, which would
churn diffs and make `git blame` useless. Sidecar is opt-in, readable,
and disposable.

---

## Sequencing

1. **Loader sidecar reader** — ✓ shipped 2026-05-14.
   `readDriftSidecar` in `src/lib/atlas/loader.ts`, surfaced in
   `AtlasEntry.isDrifted` + `driftedRefs[]`, drift sinks in sort,
   drift banner renders above Related on the detail page.
2. **Studio repo: `scripts/atlas-drift-check.ts`** — ✓ shipped
   2026-05-14. Reads staged files via `git diff --cached --name-only`,
   matches against entry `references[]`, merges into the sidecar,
   stages the sidecar so it travels with the same commit. Clear path:
   staging the entry's own .md removes its slug. The hook never
   blocks commits — drift is a signal.
3. **Studio pre-commit wiring** — ✓ shipped 2026-05-14.
   `.githooks/pre-commit` invokes `npx tsx scripts/atlas-drift-check.ts`.
   Activation is one line: `git config core.hooksPath .githooks`. No
   husky / simple-git-hooks dep added — the script runs via tsx (already
   a devDependency) and the hook is just a 12-line bash file.
4. **End-to-end verified 2026-05-14.** Staging `BRAND.md` flagged both
   `brand-enforcement` and `signal-studio-umbrella` (both reference it);
   staging an entry's own .md cleared the slug; the sidecar auto-staged
   for the commit; the hook printed a one-line summary.
5. **Roll to the other four repos** — not started. Each gets its own
   copy of the script (paths in the script's `REPO_ROOT` already
   generalize), its own `.githooks/pre-commit`, and the same activation
   step. Open call: do they write into studio's sidecar via shared
   path (`~/Projects/personal/studio/content/atlas/_drift.json`) or
   into per-repo sidecars that studio aggregates? Lean toward the
   shared path for v2.1, per-repo for v2.2 if the shared path
   becomes a bottleneck.
6. **Test the sidecar collision case** — not started. The studio
   script's merge logic (union, not replace) is in place but unverified
   against a second repo writing concurrently. Real test belongs in the
   fan-out cycle.

---

## Open questions for the v2 cycle

- **What if a reference points outside the five product repos?** Some
  entries reference `~/.claude/state/phase.md`, hooks, memory — those
  files mutate every session but the cycle pattern hasn't changed.
  Either exclude `~/.claude/` from drift detection, or fire drift only
  on path changes that are *also* tracked in some git repo. Lean
  toward the second.
- **Sidecar in git or `.gitignore`'d?** **Decision (2026-05-14): in
  git.** The studio-side script auto-stages it as part of the
  triggering commit; the sidecar then travels with the PR/commit that
  caused the drift, which makes drift state reviewable rather than
  silent. Cross-repo runs (Tasks/Roadmap/Analytics/Notes) write to the
  studio working tree but skip the auto-stage — the studio operator
  picks it up next time, which is the right ownership split.
- **What about the entitlements-shared module?** It's duplicated across
  all 5 repos. A change to it should drift any entry referencing it.
  The script needs to dedupe by entry, not by repo, so this works
  naturally.

---

## Sign-off criterion

The drift-trigger is shipped when:

- Editing `~/Projects/personal/analytics/src/lib/briefing/triggers.ts`
  flags `analytics-daily-cron` as drifted on the next commit.
- Editing `~/Projects/personal/notes/src/server/actions/notes.ts`
  flags `log-cycle-cross-repo-writer` as drifted.
- Bumping `lastVerified` in either entry clears the flag.
- The drift banner renders in the entry detail page with the right
  paths listed.
- The index row state-note shows `— drifted` and sorts the entry
  above non-drifted entries within its lens.

Anything less is a partial ship.
