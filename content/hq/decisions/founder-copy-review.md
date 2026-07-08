---
id: founder-copy-review
title: Build Founder Copy Review as a version-aware HQ system.
category: Brand
date: 2026-07-08
status: Active
reviewDate: 2026-08-08
relatedObjects: [Signal HQ, Founder Copy Review, Brand governance, Copy inventory]
---

## Decision

Build Founder Copy Review inside Signal HQ at `/hq/copy-review`. Approval is bound to the exact copy hash, not to the page slot forever.

## Reason

Signal Studio now has too many public, product, launch, pricing, and internal surfaces for manual page-by-page review. The brand needs a permanent queue that shows new and changed copy, keeps approved unchanged copy out of the way, and turns founder comments into reusable editorial memory.

## Alternatives considered

Use a new database immediately. Keep the system as a script-only report. Add a simple admin table. The first adds storage weight before the workflow is proven, the second misses the review flow, and the third would make a brand-quality system feel like admin software.

## Risks

The v1 scanner is heuristic and file-position ids can change during large refactors. The review ledger is repo-backed JSON, which is durable in the working tree but not a replacement for a deployed database if multiple people review from stateless runtime instances.

## Notes

The first version scans source, content, docs, growth notes, and static text assets into `content/hq/copy-review/inventory.json`. Founder state lives in `founder-state.json`. The route includes queue, diff, comments, guidance, Hall of Fame, weekly review, search, heatmap, and high-risk filters. Commands are documented in `docs/COPY_REVIEW.md`.
