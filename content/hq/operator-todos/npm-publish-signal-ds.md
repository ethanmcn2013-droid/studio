---
id: npm-publish-signal-ds
title: Create/auth an npm account so @signal/ds can publish as a public package
status: open
priority: P1
blocking: false
phase: SDS 2.0 rollout · Wave 0
why: Until npm auth exists, the five repos consume the design system via vendored token files — drift-gated but still copies; the package swap is one dependency line once publish works.
href: /hq
date: 2026-07-02
---

## Steps

1. Create (or sign into) an npm account for Signal Studio — `npm login` on the workstation is enough.
2. Decide the package name: `signal-ds` and `@signal-studio/ds` are both free (checked 2026-07-02). A scoped name needs the matching npm org created first.
3. Tell the agent — publishing (`npm publish --access public` from the `signal-design-system` repo) and swapping the five repos from vendored files to the dependency is agent work from there.

Approved at Checkpoint 4 of the design-system mandate (2026-07-02): public npm package is the chosen distribution; vendor-with-checksum is the sanctioned interim.
