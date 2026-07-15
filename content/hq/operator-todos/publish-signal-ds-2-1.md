---
id: publish-signal-ds-2-1
title: Authenticate npm and publish signal-ds 2.1.0
status: open
priority: P1
blocking: true
phase: Experience Quality OS release
why: Publishing a public npm package requires the founder's npm credentials and 2FA approval, which are intentionally unavailable to the repository and this operator session.
href: /hq
date: 2026-07-15
action: "Run npm login for the signalstudio npm account, then publish the verified signal-ds 2.1.0 package."
product: "Signal Design System"
recommended: "Authenticate only in a trusted local terminal, confirm npm whoami returns signalstudio, rerun npm run check and npm pack --dry-run, then publish signal-ds@2.1.0 with public access."
alternatives: ["Create a short-lived granular npm automation token scoped only to signal-ds and revoke it immediately after publishing.", "Keep 2.1.0 Git-only and continue using the vendored design-system copies until the next controlled release window."]
default: "The 2.1.0 source is versioned and pushed, but npm publication is withheld; customer applications continue using their verified vendored copies."
consequence: "The strengthened package contract is available in Git but consumers cannot install 2.1.0 from npm, so the remaining vendored-copy migration stays deferred."
trigger: "Before any repository replaces its vendored src/ds copy with the signal-ds npm dependency."
links: ["../../../docs/experience/DESIGN_QUALITY_CI.md", "npm-publish-signal-ds.md", "../../../../../../ds-foundation/CHANGELOG.md", "../../../../../../ds-foundation/package.json"]
---

## Completion evidence

- `npm whoami` returns the intended publisher identity.
- `npm run check` and `npm pack --dry-run --json` pass from the exact committed release tree.
- `npm view signal-ds@2.1.0 version` returns `2.1.0` after publication.
- The package URL and immutable version are recorded here; no token or 2FA material is committed.
