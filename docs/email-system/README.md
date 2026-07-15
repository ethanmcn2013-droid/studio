# Signal Studio email design system · review guide

Built 2026-07-16 on branch `feat/email-design-system`. Three materially
different email-system directions (Hairline, Broadsheet, Letterhead),
eight representative emails each, one shared component set and fixture
set, a local Email Lab for comparison, and the film-system documentation
that the outreach emails depend on. Nothing sends email; nothing is
deployed.

## Review in two minutes

```
cd _wt-email-system
corepack pnpm install   # already done if node_modules exists
corepack pnpm dev
```

Open http://localhost:3000/hq/email-lab and sign in at `/hq/access` with
the HQ password (`SIGNAL_HQ_PASSWORD` in `.env.local`; copy it from the
main studio checkout if this worktree has none).

In the Lab you can: switch the eight emails and three directions, compare
all three side by side, toggle desktop and mobile widths, light and dark,
block images, read the plain-text twin, see subject, preheader, sender,
classification, tracking policy, the exact template file, and every
provisional claim. "Open full page" gives the raw render.

No dev server handy: the same renders are committed under
`docs/email-system/renders/` (24 html, 24 plain-text, 28 png screenshots).

## Reading order for the decision

1. `comparison.md` · scores and the recommendation (Hairline, narrowly).
2. The Lab, or `renders/png/`, judging each direction on: sign-in code,
   deletion scheduled, venue outreach.
3. `decisions-required.md` · nine founder decisions, none blocking review.
4. `design-exploration.md` · the five theses and the critique pass.
5. `commercial-truth.md` · what the copy is allowed to claim and why.
6. `email-inventory.md` · all 95 messages the suite may ever need.
7. `sender-architecture.md` and `email-principles.md` · durable rules.
8. `../film-system/` · the common film system and the three briefs
   (venues locked, students provisional, schools blocked by
   segment-sequencing-2026-05).

## Code map

```
src/emails/
  directions.ts       the three directions as presentation tokens
  components/         EmailShell, header/footer, actions, panels, imagery,
                      signature · content-free layout only
  templates/          the eight emails · all customer-facing copy lives here
  fixtures.ts         fictional, deterministic fixture data + edge cases
  registry.tsx        metadata: subjects, senders, tracking, assumptions
  render.ts           the single render entry point (html + plain text)
  render.test.ts      validation harness (part of pnpm test)
src/app/hq/email-lab/ the Lab page and its render route
scripts/render-email-assets.mjs      poster + product-still PNGs
scripts/screenshot-email-renders.ts  committed review artifacts
public/email-assets/                 poster-venues, poster-schools, product-still
```

## Validation

`corepack pnpm typecheck` · `corepack pnpm lint` · `corepack pnpm test`
(includes the email harness: 24+ renders, plain-text twins, alt text,
no scripts, voice absolutes, edge fixtures) · `corepack pnpm build`.
Results as of 2026-07-16 are recorded in the final task report. External
email-client testing (Litmus or Email on Acid) was not available; the
strongest local checks were run instead and client-specific caveats are
noted in `email-principles.md`.
