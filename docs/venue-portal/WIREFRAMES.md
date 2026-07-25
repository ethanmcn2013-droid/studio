# Venue Portal deterministic wireframes

Review fixture: Glenmara House  
Data through: 24 July 2026  
Metric dictionary: `venue-metrics.v1`  
Coverage: complete unless a frame says otherwise.

No name, email, workspace label, private content, or raw identifier appears in
the fixture.

## Overview. Desktop

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ signal studio.                              Glenmara House        Venue owner │
├──────────────────────────────────────────────────────────────────────────────┤
│ Overview     Access     Usage     Reports     Venue settings                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ Venue Edition                         Data through 24 Jul 2026 · Complete     │
│ 1 Aug 2026 — 31 Jul 2027              Renews in 11 months                    │
│                                                                              │
│ 40 allotted        26 issued          18 redeemed        14 remaining        │
│                                                                              │
│ 11 active sponsored workspaces        21 active days · last 30               │
│ 69.2% redemption rate                 Last redemption · 24 Jul               │
│                                                                              │
│ Usage over 12 weeks                                                        │
│ ▁▂▃▃▄▅▅▆▅▇▆█                                                             │
│                                                                              │
│ Product use · last 30 days                                                   │
│ Notes  8       Tasks  10       Timeline  6       Signal  5                  │
│                                                                              │
│ Needs attention                                                              │
│ ○ 14 codes remain. No action needed.                                         │
│ ○ Term is healthy. Reconciliation passed 24 Jul at 06:12.                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

Rules visible in this frame:

- access counts and behavioural usage are visually separated;
- coverage and data-through time sit next to usage;
- a percentage always sits with its numerator/denominator elsewhere on the
  same screen;
- "active" refers to workspaces, not people.

## Overview. Mobile

```text
┌──────────────────────────────┐
│ signal studio.               │
│ Glenmara House               │
│ [Overview]  Access  Usage →  │
├──────────────────────────────┤
│ Venue Edition                │
│ 1 Aug 2026 — 31 Jul 2027     │
│                              │
│ 40 allotted   26 issued      │
│ 18 redeemed   14 remaining   │
│                              │
│ 11 active workspaces         │
│ Last 30 days                 │
│                              │
│ 21 active days               │
│ Last 30 days                 │
│                              │
│ Data through 24 Jul          │
│ Complete coverage            │
│                              │
│ Product use                  │
│ Notes        8               │
│ Tasks       10               │
│ Timeline     6               │
│ Signal       5               │
└──────────────────────────────┘
```

The tab strip scrolls horizontally, keeps a 44 px target, and does not truncate
the active label.

## Access

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Access                                      14 unused codes                   │
│ [Download unused codes]                    Request more codes                │
├──────────────────────────────────────────────────────────────────────────────┤
│ Code          State       Issued       Redeemed       Expires                │
│ GH-••••-21    Redeemed    03 Jul       05 Jul         —                      │
│ GH-••••-22    Delivered   03 Jul       —              31 Aug                 │
│ GH-••••-23    Minted      03 Jul       —              31 Aug                 │
│ GH-••••-08    Revoked     14 Jun       —              —                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Delivery state is not available until delivered_at is instrumented.          │
└──────────────────────────────────────────────────────────────────────────────┘
```

Only venue owners and managers can reveal or download an unused code value.
The default table masks it. Reports never contain code values.

## Usage

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Usage                                Last 30 days ▾   Complete · through 24 Jul│
├──────────────────────────────────────────────────────────────────────────────┤
│ 11 active sponsored workspaces      21 venue active days                    │
│ 73 meaningful actions               15 activated this term                  │
│                                                                              │
│ Activation                                                                  │
│ Issued 26 ── Redeemed 18 ── First meaningful action 15 ── Active in 30d 11 │
│                                                                              │
│ Retention                                                                   │
│ Day 7      10 / 12 eligible · 83.3%                                         │
│ Day 30      9 / 12 eligible · 75.0%                                         │
│ Day 90      Not enough closed cohorts yet                                   │
│                                                                              │
│ Definitions                                                                 │
│ Meaningful use is a committed action. Visits do not count. Private work is  │
│ never included.                                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Partial coverage

```text
┌────────────────────────────────────────────────────────────┐
│ Usage coverage is partial                                  │
│ Signal events are missing for 22–24 Jul.                   │
│ We observed at least 8 active sponsored workspaces.        │
│ Rates and comparisons are withheld until coverage closes.  │
│ Data through 21 Jul 2026 · 27 of 30 days covered           │
└────────────────────────────────────────────────────────────┘
```

The missing product is named. A partial observed count says "at least." The UI
does not show a down arrow, zero, change rate, or comparison.

## Small group

```text
┌────────────────────────────────────────────────────────────┐
│ Not enough data to report usage safely yet.                │
│ Redemptions remain available. Behavioural usage appears    │
│ after at least three sponsored workspaces are eligible.    │
└────────────────────────────────────────────────────────────┘
```

The suppressed number is absent from the DOM, accessible name, export, and
support view-as.

## Reports

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Reports                                                                      │
│ July 2026 · Complete · venue-metrics.v1                     [PDF] [CSV]       │
│ June 2026 · Partial, 27/30 covered                          [PDF] [CSV]       │
│ May 2026 · Small group, usage withheld                      [PDF] [CSV]       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Every export repeats the period, timezone, definitions, data-through time,   │
│ coverage, suppression, and content/privacy statement.                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Venue settings

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Venue settings                                                               │
│ Glenmara House · Venue Edition                                               │
│                                                                              │
│ Portal members                                                               │
│ Venue owner      1 active                                                    │
│ Venue manager    2 active                                                    │
│ Venue viewer     1 active                                                    │
│                                                                              │
│ Privacy                                                                      │
│ The portal shows access and aggregate use. It never shows notes, tasks,      │
│ project names, briefings, private timelines, comments, files, or members.    │
└──────────────────────────────────────────────────────────────────────────────┘
```

