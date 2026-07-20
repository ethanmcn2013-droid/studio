# documents.signalstudio.ie — the deck mirror contract

**The funding decks have exactly one source of truth: `public/brand/`.**

| Canonical (edit here)                         | Behind HQ / direct                                        | Public mirror              |
|-----------------------------------------------|-----------------------------------------------------------|----------------------------|
| `public/brand/market-entry-deck-2026.html`    | `/hq/market-entry`, `signalstudio.ie/brand/…` (public)    | `growth.signalstudio.ie`   |
| `public/brand/business-loan-pack-2026.html`   | `/hq/loan-pack`, `signalstudio.ie/brand/…` (**gated**)    | `plan.signalstudio.ie`     |

`documents.signalstudio.ie` is the hub that links to `growth.` and `plan.`

## The rule

The `growth.` and `plan.` sites are **dumb static mirrors**. Never hand-edit
them, and never edit a `deploy-*` folder — those are retired. Change the deck in
`public/brand/`, merge to `main`, and the mirror republishes itself.

Why mirrors and not a rewrite/proxy: the business-loan deck is intentionally
gated on the main site (`CONFIDENTIAL_BRAND_PATHS` in `src/proxy.ts`), but must
be openly viewable on the shared documents hub. A copy keeps the main site gated
while the hub stays public. The mirror is byte-identical to the canonical deck.

## How it stays in sync

- **`scripts/decks/publish-documents-decks.mjs`** — copies each canonical deck +
  exactly the assets it references into a staging dir and deploys it to its
  Vercel project (`signal-growth-plan`, `signal-business-plan`), then verifies
  the live mirror byte-matches the canonical. Run locally after `vercel login`,
  or in CI with `VERCEL_TOKEN`.
- **`scripts/decks/verify-documents-sync.mjs`** — drift guard. Offline: every
  asset a canonical deck references must exist in `public/brand` (run on every
  PR). `--live`: each live mirror must byte-match its canonical deck.
- **`.github/workflows/documents-decks-sync.yml`** — runs `verify` on every PR
  touching `public/brand/**`, and `publish` on every push to `main` that changes
  a canonical deck or its assets. Publish needs the `VERCEL_TOKEN` secret (see
  `content/hq/operator-todos/documents-decks-vercel-token.md`).

## Adding a deck

Add it to `TARGETS` in `scripts/decks/documents-targets.mjs` (domain ← deck ←
Vercel project id). Both scripts and the workflow pick it up automatically.
