---
id: home-front-door
title: Home — the front door shows what is coming and how the week is going
product: Signal Studio (suite-wide)
category: Core
status: In Progress
priority: High
effort: Large
impact: High
owner: Ethan
principleAlignment: 94
relatedCampaign: Founder LinkedIn Build-in-Public
relatedMetric: Weekly active workspaces
---

## What it is

Home at `/app/home` is the signed-in front door. It replaces the former task-list Home (Late, Due today, Due this week, waiting groups and the Projects rail) with four sections in a fixed order:

1. **Next big day.** The soonest Project target date counts down, with a burn-up chart against a straight plan line, the gap when behind, stages on the baseline, one status, a next step (catch up, or what is due this week) and a link to the timeline. A pager moves through up to five dated Projects. A second Project behind plan is named in a "Needs a look" footnote.
2. **Done this week.** This week's finished tasks, day by day, beside the same days last week, with the comparison spelled out to the same weekday.
3. **Activity.** A year of finished work as a heatmap, switchable to weekly totals or to weekday by hour over the last eight weeks, with a weeks-in-a-row streak.
4. **Start cards.** Tasks, Projects, Files and Chat, each split into a count that opens the area and an action that starts something new. Without Chat, Notes takes its place.

## Rules it keeps

- Every figure comes from one model, so no two sections can disagree.
- Reads are scoped to the Projects the reader can open; review and demo mode never touch the database.
- A figure that could not be read shows a dash and says so; nothing is guessed.
- Done this week and Activity count work finished across the reader's Projects, not personal attribution.
- The Full Briefing is retired (founder decision, 2026-10-20). `/app/home/briefing` and legacy `/app/signal` links redirect to `/app/home`, and the daily briefing email is retired with it.

## Status

Internal candidate on app branch `design/home-bento`, from the agreed Home baseline. Not released: production receiving and an explicit release go-ahead remain separate. Evidence: the app's Home browser check (states, four sizes, light and dark, axe) and model and read tests.
