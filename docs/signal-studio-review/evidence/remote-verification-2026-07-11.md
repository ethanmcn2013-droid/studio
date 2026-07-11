# Remote verification receipts · 2026-07-11

Draft PR: https://github.com/ethanmcn2013-droid/studio/pull/45

Passing checks:

- `verify` workflow: https://github.com/ethanmcn2013-droid/studio/actions/runs/29161538107
- Existing `typecheck · test` workflow: https://github.com/ethanmcn2013-droid/studio/actions/runs/29161538114
- Second verification run: https://github.com/ethanmcn2013-droid/studio/actions/runs/29161536621
- Vercel preview deployment completed successfully on the PR.

The preview proves build/deploy behavior and route availability. It does not
prove authenticated production journeys, provider topology, or production
database migration state.

## Latest control-plane commit receipt

For commit `11154ea19a8f7d7441e417b9b0efee048b47c5d6`:

- `typecheck · test`: https://github.com/ethanmcn2013-droid/studio/actions/runs/29162242613
- `verify`: https://github.com/ethanmcn2013-droid/studio/actions/runs/29162240854
- `verify`: https://github.com/ethanmcn2013-droid/studio/actions/runs/29162242604
- Vercel preview: https://vercel.com/ethanmcn2013-1730s-projects/studio/JCnVtU1FxPP7sYDMwUE3ouZorZre

All four checks passed. The same production/provider limitations remain open.
