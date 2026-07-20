---
id: documents-decks-vercel-token
title: Add VERCEL_TOKEN GitHub secret to auto-publish the documents.signalstudio.ie deck mirrors
status: done
priority: P1
blocking: false
phase: Phase 1
why: Until the token is set, the growth./plan. mirrors only auto-republish when someone runs the publish script by hand — a deck change on main will not propagate to documents.signalstudio.ie automatically.
href: /hq/market-entry
date: 2026-07-20
---

The funding decks now have one source of truth (`public/brand/*.html`) and the
`documents-decks-sync` GitHub Action republishes the `growth.` and `plan.`
mirrors on every deck change — but the `publish` job needs a Vercel token to
deploy. Without it, the job prints a warning and skips (the mirrors stay
correct, they just will not auto-update).

## Steps

1. Create a Vercel access token (scoped to the `ethanmcn2013-1730s-projects`
   team): Vercel dashboard -> Settings -> Tokens -> Create.
2. Add it as a GitHub Actions secret named `VERCEL_TOKEN` on the `studio` repo:
   `gh secret set VERCEL_TOKEN --repo ethanmcn2013-droid/studio` (paste the token).
3. Confirm: re-run the latest `documents-decks-sync` workflow, or push a trivial
   change to a deck, and check the `publish` job deploys and prints `ALL IN SYNC`.
4. Verify live: `curl -s -L https://growth.signalstudio.ie/ | grep -c csheet`
   should match the canonical deck.
