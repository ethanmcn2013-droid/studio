# atlas — maintainer notes

The atlas at `/hq/atlas` is repo-backed system documentation. One entry
per system, one markdown file per entry. The index and detail routes
read these files at request time — no rebuild for content changes.

## Who it's for

Two readers, two layers in the same document.

**The body** is for future-Ethan — the operator at 11pm six months
from now staring at a broken cross-repo flow he hasn't touched since
shipping. Dense, jargon-rich, file-path-first.

**The exec brief** at the top of every entry (three fields:
`execWhat`, `execMatters`, `execRisk`) is for leadership readers
who need to grasp the system in 30 seconds without acronyms or file
paths. Plain English. Two sentences max per field.

Same document, two voices. No separate exec-facing site, no second
maintainer-flow to keep in sync.

## Adding an entry

1. Pick a slug. Lowercase, kebab-case, matches the filename without `.md`.
2. Copy `plan-cycle.md` as a template — it's the one fully-written entry
   and shows the voice.
3. Fill in the frontmatter:

   ```yaml
   ---
   title: Short, human title
   slug: matches-filename
   lens: Products | Processes | Data Flows
   owner: Ethan
   lastVerified: 2026-05-14   # YYYY-MM-DD — bump every time you touch it
   links: [other-slug, another-slug]
   tags: [phase.md, log.jsonl, Stop hook]   # strings future-Ethan would type when lost
   references: [src/lib/...ts, content/atlas/...md, ENV_VAR_NAME]
   summary: One-line hook, ~140 chars, shows on the index row.
   status: stub | partial | complete
   pinned: false               # set true on at most one entry — the "start here"
   execWhat: One plain-English sentence. No acronyms, no file paths.
   execMatters: One sentence on why this system is load-bearing for the business.
   execRisk: One sentence on what fails if this breaks or doesn't exist.
   ---
   ```

   The three `exec*` fields render as a "for leadership · 30-second
   read" block above the body. Write them last — they're the
   distillation of everything in the body. If you can't write them
   without jargon, the body isn't done.

4. Body sections, fixed order:
   - `## WHAT` — one paragraph, plain English.
   - `## WHO` — owner + sub-owners.
   - `## WHERE` — file paths, URLs, repos.
   - `## HOW` — numbered flow or prose. Mermaid fences (` ```mermaid `) are
     parsed and labeled as diagram source. Client-side rendering of the
     diagram itself is a v2.
   - `## WHEN — current state` — live signals. The audit-tracking field.
   - `## WHY` — the constraint or decision that birthed this. The most
     important section. Future-you needs the why, not the what.

5. The renderer supports: H2/H3, paragraphs, ordered/unordered lists,
   `inline code`, fenced code, **bold**, _italic_, `[text](url)`.

## Status tiers

- **stub** — frontmatter only; body is placeholders. Visible but honest.
- **partial** — WHAT and WHERE written; HOW or WHY still missing.
- **complete** — every section earns its space; nothing is a placeholder.

Promote up as the entry fills in. The index renders the state inline
after the title, so the state is the page rather than a separate badge.

## Required even on stubs

Stubs without `links: []` and `tags: []` are dead matter. The atlas's
value is the graph and the lookup — an isolated stub does neither.
Declare both even when the body is empty.

A slug in `links:` that doesn't match an existing file is fine — it
marks something worth writing later.

## Stale-flagging

Entries with `lastVerified` older than 60 days surface as `stale` inline
after the title. The threshold is in `src/lib/atlas/loader.ts` as
`STALE_THRESHOLD_DAYS`. The flag is the entire forcing function. Bump
`lastVerified` after confirming the entry is correct, or fix what's
drifted.

## Pinning

Exactly one entry should carry `pinned: true`. It renders above the
list as "start here". Today that's `plan-cycle` — the entry that
explains the vocabulary every other entry depends on.

## When to add a new entry

Not by default. Add an entry only when you needed it and it wasn't
there. Completeness for its own sake reintroduces the documentation
doom-loop.

## Drift-trigger (studio-side shipped 2026-05-14)

The pre-commit hook lives at `.githooks/pre-commit` and runs
`scripts/atlas-drift-check.ts`. It's **opt-in** — to activate in your
local clone:

```sh
git config core.hooksPath .githooks
```

Once active, every commit that touches a file referenced by an atlas
entry's `references[]` will flag the entry in `content/atlas/_drift.json`
and stage the sidecar as part of the same commit. Bumping an entry's
`lastVerified` (or staging the entry's own .md) clears its slug from
the sidecar — the operator's confirmation that the entry is current.

The hook **never blocks commits**. Drift is a signal, not a gate.

Studio-side is shipped. The cross-repo fan-out (per-repo hooks in
tasks, roadmap, analytics, notes that write into studio's sidecar)
is a separate cycle. See `docs/ATLAS_DRIFT_TRIGGER.md` for the full
spec, the open questions, and the sign-off criterion.

## Not in v1 (don't build yet)

- **Cross-repo drift fan-out** — pre-commit hooks in the other four
  product repos that write into studio's sidecar. The studio script
  proves the shape; fan-out is mechanical.
- Natural-language query over the corpus.
- Client-side Mermaid rendering.
- Public-facing variant for hires or partners.
- Auto-derived stubs from repo scans (cron jobs, env vars, cross-repo
  writers as candidates).

These move from v2 to v1 only when v1 gets real use.
