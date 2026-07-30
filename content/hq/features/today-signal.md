---
id: today-signal
title: Today Signal briefing
product: Signal
category: Integration
status: Built
priority: High
effort: Large
impact: High
owner: Ethan
principleAlignment: 96
relatedCampaign: Public Timeline Content Campaign
relatedMetric: Weekly active workspaces
---

## Notes

The ecosystem's daily state of work. The live Briefing remains Signal's default and keeps its hard three-item discipline. The separate `signal-progressive-depth` feature adds Overview, Trends, and Evidence beneath it behind a production-off flag; it does not replace this artifact.

### The read shows its working (Tasks T·111, 30 July 2026)

The Briefing now publishes what it examined, not only what it surfaced. Every read carries four numbers that reconcile in front of the reader: items read, items that crossed a rule, items shown, and items cleared, with read equal to flagged plus cleared exactly. Work held back by the three-item cap is never counted as cleared, and synthetic cluster rows are never counted as source items, because they are readings of work already counted. The presentation contract enforces those invariants itself rather than trusting its callers, after two of them broke it.

Rows are grammatical. A task title is the reader's own words, so it is a headline and never a clause: the page used to compose an imperative title into "Approve the final seating plan is 2 days overdue". The title and the observation are now separate fields, and the same rule reaches upstream blocker names, which are counted rather than named when a question or a shout cannot sit inside a sentence.

Sections are Now and Next, and each row sits on the marketing hero's three columns with its action at the right edge, so the product and its hero read as the same object. Tone is present at rest rather than only under a pointer.

Method note worth keeping: two five-seat design panels raised the surface from 6.9 to 7.7 out of ten and found roughly seventy grounded defects, but the automated axe pass caught a WCAG failure all ten reviewers missed. The ordinal rail had been ported faithfully from the hero at 1.47:1 against paper, which is a stylistic choice on a marketing page and a hard failure on a product surface. Design review and measured evidence are not substitutes for each other.

Honest edge: the unmounted analytics shell is untouched and still awaits its wire-or-retire decision, and the flag-gated Evidence drawer was verified from source and an isolated harness rather than live.
