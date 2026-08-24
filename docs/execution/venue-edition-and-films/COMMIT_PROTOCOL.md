# Commit protocol for parallel sessions

Written 2026-08-03, after wave 1 ran four packages concurrently in one working
tree and came within one careless command of losing all of it.

`WORKFLOWS.md` governs project state. This governs git. They are different
problems: the tool takes a cross-session lock on `PROJECT_STATE.json`, and
nothing at all was protecting the files.

---

## What actually went wrong

Four sessions ran WP-01, WP-02, WP-03 and WP-10 at the same time. At the point
someone finally looked:

- **129 files uncommitted**, spanning all four packages, in one shared tree.
- **On `feat/homepage-reduction-relay`**, a branch belonging to unrelated
  homepage work. Nobody chose it; it was just what was checked out.
- **8 commits local-only.** Nothing had been pushed. A disk failure or a stray
  `git reset --hard` would have taken the entire wave.
- **35 commits behind `origin/main`**, and drifting further every hour.
- 1.2 MB of browser-automation logs and screenshots staged alongside real work.

Nothing was lost. That was luck, not process.

---

## The rules

### 1 · A wave gets its own branch, cut from `main` on the day it starts

```bash
git fetch origin && git checkout -b venue/wave-N origin/main
```

Never inherit whatever branch happens to be checked out. A wave branch cut from
current `main` cannot be 35 commits stale on day one, and the eventual merge is
a review rather than an archaeology exercise.

### 2 · A session commits its own scope before it closes

**A closed session with uncommitted work is the loss condition.** The session
record says the work happened; the tree is the only place the work exists.

Commit files your package owns, by path, never `git add -A` while others are
live. If two packages genuinely share a file, say so in the message.

### 3 · Push immediately after committing

```bash
git push origin venue/wave-N
```

A commit that has never left the machine is a backup that does not exist. This
is the single highest-value habit in this document, and it costs three seconds.

### 4 · Destructive git is forbidden while any session is open

Never run `git checkout .`, `git reset --hard`, `git clean`, `git stash`, or
`git checkout <branch>` without first confirming no other session is open:

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs session list
```

Those commands rewrite the working tree, and another session's in-flight edits
are invisible to you. `session list` returning "No open sessions" is the only
safe window for anything structural.

### 5 · Back up before git surgery, not after

Any merge, rebase, branch switch or history edit gets a snapshot first:

```bash
BK=../_backup-$(date -u +%Y%m%dT%H%M%SZ) && mkdir -p "$BK/files"
git status --porcelain -uall > "$BK/status.txt"
while IFS= read -r l; do f="${l:3}"; [ -f "$f" ] && \
  { mkdir -p "$BK/files/$(dirname "$f")"; cp "$f" "$BK/files/$f"; }; \
done < <(git status --porcelain -uall)
```

Use `-uall`. Plain `--porcelain` collapses an untracked directory into one line,
so its contents are silently skipped: that is how the entire project-control
tree nearly missed the wave-1 backup. Gitignored files are not touched by git
operations, but copy `.geo-cache` and anything else expensive to regenerate
separately if it matters.

### 6 · Do not resolve another lane's conflicts

The wave-1 merge of `origin/main` conflicted in four UI files and `CLAUDE.md`,
all belonging to unrelated work. **The merge was aborted rather than guessed
at.** Hand a conflict to whoever owns the file. A merge resolved by someone who
has not read the code is a silent loss dressed as a success.

### 7 · `PROJECT_STATE.json` is never hand-edited or hand-merged

`project-control.mjs` owns it and holds a lock. If it conflicts in a merge, take
one side whole and re-run the tool. Never resolve it line by line.

### 8 · Write LF

Editing on Windows through Python or some editors rewrites a whole file to CRLF,
which turns a 20-line change into a 500-line diff and buries the real edit. If a
diff is suspiciously large, check line endings before reading further:

```bash
python3 -c "import io,sys;r=io.open(sys.argv[1],'rb').read();print('CRLF',r.count(b'\r\n'),'LF',r.count(b'\n'))" <file>
```

### 9 · Commit source, not artifacts

Browser logs, screenshots and scratch output belong in `.gitignore`.
`.playwright-cli/` and `/output/` were added on 2026-08-03 for exactly this.

---

## What a session does at close

1. `session list` to see who else is live.
2. Commit your package's files, by path.
3. Push.
4. `/venue-close` with your own `--id`.

In that order. State written after the close is state lost, and work left
uncommitted at close is work nobody else can see.
