---
id: signal-progressive-depth
title: Signal progressive depth
product: Signal
category: Core
status: Built
priority: High
effort: Large
impact: High
owner: Ethan
principleAlignment: 98
relatedCampaign: Wedding Demo Video Series
relatedMetric: Briefings that lead to a useful action
---

## Notes

Signal keeps Briefing as the default, with zero to three grounded observations, then adds Overview, Trends, and a shared Evidence drawer beneath it. Overview is recommended before customization. Trends shows one metric at a time. Evidence exposes the deterministic rule, comparison basis, coverage, and permitted Notes, Tasks, decisions, dependencies, and Timeline milestones behind the claim.

Version-one customization stops at hide, pin, reorder, and restore. There is no blank dashboard builder, custom formula layer, employee score, or generated dashboard.

Implementation is built behind the centralized `SIGNAL_ANALYTICS_V1_ENABLED` flag and rebased onto current Signal main. Production remains off by default while live tenant, provider, source-link, and scheduler receipts are gathered. This record is not a launch claim.
