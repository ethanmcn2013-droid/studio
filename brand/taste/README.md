# Signal Studio — taste calibration

The empirical half of the brand voice. `BRAND.md` §3 is the rules (the floor). This is the
**taste** (the shape) — your ear, encoded as ranked exemplars the `brand-voice` skill imitates.
It exists because the copy that drifted off-brand *passed every rule and was still wrong*. Rules
can't catch that. Your ratings can.

## The loop

1. **Rate.** Open `rater.html` in a browser. It shows two Signal Studio sentences and asks
   "which is more Signal Studio?" — `←` A, `→` B, `↓` both wrong. ~4 minutes, ~12–15 pairs a
   session. It picks the most *informative* next pair (active learning), so you're never
   wasting a rating on an obvious call. Your ratings autosave in the browser.
2. **Export.** Click **Export** → saves `judgements.jsonl`. Drop it in this folder.
3. **Compile.** `node compile-taste.mjs` → regenerates `TASTE.md` (what the skill reads) and
   `taste.json`. Done.
4. **Repeat monthly.** ~4 minutes a month keeps it alive. Recent ratings weigh more
   (90-day half-life), so your taste can evolve without a rewrite.

**Trust threshold:** the map is a *seed* until ~60 ratings across ~3 different days. `TASTE.md`
says so at the top until then. A one-session burst is a hypothesis, not a law.

## Files

| file | what | who edits |
|------|------|-----------|
| `items.json` | the sentence bank (~44 sentences across 7 axes, poles + borderlines + traps) | you, to add sentences |
| `rater.html` | the pairwise rater (Bradley-Terry + active learning, self-contained) | — |
| `bootstrap.jsonl` | obvious shipped-vs-retired poles, down-weighted priors so the seed is sane | rarely |
| `judgements.jsonl` | your exported ratings | the rater writes it |
| `compile-taste.mjs` | ratings → `taste.json` + `TASTE.md` | — |
| `TASTE.md` | the taste map the `brand-voice` skill reads | generated — don't hand-edit |

## How it connects to the rest

- The **`brand-voice` skill** (`~/.claude/skills/brand-voice/`) reads `TASTE.md` before writing
  load-bearing copy, and runs the mechanical lint `voice-check.mjs` for the deterministic tier.
- **Single source of truth is `studio/BRAND.md` §3.** This is derived data. When a lean here
  holds across sessions (e.g. "sharper wins on audience copy, softer on product copy"), promote
  it into §3 by hand — then everything re-reads it. Never let this file become a second rulebook.

## Adding sentences

Edit `items.json` (keep IDs stable), then re-embed into `rater.html`'s `ITEMS_EMBED` (or serve
the folder so the rater fetches `items.json` live). Rate the new ones; re-compile.

## The two-line workflow

```
node compile-taste.mjs          # after each rating session
# open rater.html               # to rate
```
