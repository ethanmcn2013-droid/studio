---
id: vercel-lab-preview-exposure
title: Review the Vercel preview changes made to show the HQ lab gallery
status: open
priority: P2
blocking: false
phase: Phase 1
why: preview protection was relaxed on three projects to make the /hq/design-rooms lab cards publicly viewable — keep or revert per your risk appetite.
href: /hq/design-rooms
date: 2026-07-20
---

To make every card in the Lab gallery (`/hq/design-rooms`) open a live visual
instead of a GitHub link, a few Vercel settings were changed on 2026-07-20.
None touch production data; all are reversible. Decide keep-or-revert for each,
then mark this done.

## What changed

1. **roadmap + analytics — preview protection OFF.** Vercel Authentication was
   disabled on both projects so the Notes/Timeline/Signal hero-lab preview URLs
   open without a Vercel login. Side effect: every *other* preview URL of those
   two projects is now public too (production is unaffected — it is separately
   gated by the app's own auth). Notes was already public.

2. **analytics — demo-mode preview env.** Added `NEXT_PUBLIC_DEMO_MODE=true` and
   `DEMO_MODE=true` (plain, preview target) so the stale Signal lab branch boots
   without Clerk keys. Affects preview builds only.

3. **studio — surgical bypass for the umbrella card only.** Studio previews stay
   protected (studio is the HQ/financials repo). A Vercel Protection Bypass for
   Automation secret was generated and stored as the `UMBRELLA_PREVIEW_BYPASS`
   env var (production, encrypted). `resolveLabHref()` appends it to the single
   Daily Signal card link so it opens without a login. The secret is never in
   git — only in the Vercel env and the (gated) rendered HQ page. Caveat: a
   Vercel bypass secret is project-wide, so anyone who can read that one link
   could in principle reach other studio previews with it.

## Steps

1. Decide whether roadmap + analytics previews should stay public. To re-protect:
   Vercel → each project → Settings → Deployment Protection → Vercel
   Authentication → Standard Protection. (Re-protecting breaks the public lab
   links; the founder can still open them while logged into Vercel.)
2. Decide whether to keep the analytics demo-mode preview env vars. Remove in
   Vercel → analytics → Settings → Environment Variables if not wanted.
3. Decide whether to keep the studio umbrella bypass. To revoke: Vercel → studio
   → Settings → Deployment Protection → Protection Bypass for Automation → revoke
   the `umbrella daily-signal HQ lab card` secret, and delete the
   `UMBRELLA_PREVIEW_BYPASS` env var. (The umbrella card then falls back to the
   protected preview — founder-viewable only.)
4. Mark this done once you have kept or reverted each.
