# Signal Studio Account · deterministic wireframes (filed as "Venue Portal")

Naming: the **Signal Studio Account IS the Venue Portal** (**D-015 Q4**). One
surface, two names.

Review fixture: Glenmara House (D-012 point 1)
Data through: 24 July 2026
Metric dictionary: ~~`venue-metrics.v1`~~ `[SUPERSEDED · 2026-08-03]`
`account-metrics.v2`
Coverage: complete unless a frame says otherwise.

No name, email, workspace label, private content, or raw identifier appears in
the fixture.

**Corrected 2026-08-03.** ASCII frames cannot carry strikethrough, so every
correction below is stated in a note immediately above the frame it changes, and
the exact superseded line is quoted in the note. Nothing is deleted silently.

**Launch scope.** **D-027 point 4** puts Access, and only Access, inside the
1 September launch. The Usage, Reports and retention frames are the destination
and stay drawn. They are post-launch.

## Overview. Desktop

`[SUPERSEDED D-020 · 2026-08-03. The frame previously read
"│ 40 allotted        26 issued          18 redeemed        14 remaining        │"
and the attention item read "○ 14 codes remain. No action needed." There is no
allotment and no remainder to show. E09.02 §8 prohibits "codes remaining" and
"licences allotted" by name.]`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ signal studio.                              Glenmara House        Venue owner │
├──────────────────────────────────────────────────────────────────────────────┤
│ Overview     Access     Usage     Reports     Account                         │
├──────────────────────────────────────────────────────────────────────────────┤
│ Venue Edition                         Data through 24 Jul 2026 · Complete     │
│ 1 Aug 2026 – 31 Jul 2027              Renews in 11 months                    │
│                                                                              │
│ Unlimited          26 invited         18 opened their workspace              │
│ Every couple who books with you                                              │
│                                                                              │
│ 11 active sponsored workspaces        21 days with sponsored use · last 30   │
│ 18 of 26 have opened                  Last redemption · 24 Jul               │
│                                                                              │
│ Usage over 12 weeks                                                        │
│ ▁▂▃▃▄▅▅▆▅▇▆█                                                             │
│                                                                              │
│ Product use · last 30 days                                                   │
│ Notes  8       Tasks  10       Timeline  6       Signal  5                  │
│                                                                              │
│ Needs attention                                                              │
│ ○ Nothing needs your attention.                                              │
│ ○ Term is healthy. Reconciliation passed 24 Jul at 06:12.                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

`[CORRECTED 2026-08-03. The fifth navigation item read "Venue settings". The
shipped surface implements "Account". The tab set in
`src/app/hq/account-review/account-review.tsx`, and `docs/account/VOCABULARY.md`
locks the map "Venue settings → Account". The document is made to match the
running code.]`

Rules visible in this frame:

- invitation counts and behavioural usage are visually separated;
- coverage and data-through time sit next to usage;
- a share is written "18 of 26", never as a bare percentage;
- "active" refers to workspaces, not people;
- an unlimited entitlement renders the word `Unlimited` where a count would sit.
  It is not `0`, not blank, and not "Unavailable".

### The unlimited frame, in the three states it can take

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Unlimited                                                                    │
│ Every couple who books with you gets a workspace.                            │
│ 26 invited · 18 opened their workspace                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

The request control, the exhaustion message and any copy describing a quantity
left are absent from this frame. Not disabled. Absent.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Unavailable                                                                  │
│ We could not read this venue's entitlement.                                  │
│ 26 invited · 18 opened their workspace                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

A legacy row with no recorded entitlement figure renders `Unavailable`. It never
renders `0`, and it never produces an exhaustion message. Missing data is not
inactivity.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Not enough couples yet to report usage safely.                               │
│ Redemptions are visible. Usage appears once at least three couples are        │
│ eligible.                                                                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Overview. Mobile

`[SUPERSEDED D-020 · 2026-08-03. The frame previously read
"│ 40 allotted   26 issued      │" and "│ 18 redeemed   14 remaining   │".]`

```text
┌──────────────────────────────┐
│ signal studio.               │
│ Glenmara House               │
│ [Overview]  Access  Usage →  │
├──────────────────────────────┤
│ Venue Edition                │
│ 1 Aug 2026 – 31 Jul 2027     │
│                              │
│ Unlimited                    │
│ Every couple who books       │
│                              │
│ 26 invited                   │
│ 18 opened their workspace    │
│                              │
│ 11 active workspaces         │
│ Last 30 days                 │
│                              │
│ 21 days with sponsored use   │
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

`[SUPERSEDED D-020 · 2026-08-03. The header previously read
"│ Access                                      14 unused codes                   │"
and the control read "Request more codes".]`

**This is the launch surface (D-027 point 4).**

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Access                                      8 invitations ready to send       │
│ [Download unsent invitations]              Ask us a question                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ Invitation    State       Sent         Redeemed       Expires                │
│ GH-••••-21    Redeemed    03 Jul       05 Jul         –                      │
│ GH-••••-22    Sent        03 Jul       –              31 Aug                 │
│ GH-••••-23    Ready       03 Jul       –              31 Aug                 │
│ GH-••••-08    Revoked     14 Jun       –              –                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Delivery is not tracked for invitations sent before 3 Jul.                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

The count in the header is the number of minted invitations not yet sent. It is
**not** a remainder against a budget, and it disappears when there are none.

`delivered_at` and `expires_at` are deliberately un-backfilled. A row with no
delivery timestamp says delivery is not tracked. It never says "not sent", and
the loader must select both columns or the ladder collapses and an expired
invitation renders as ready to send.

Only venue owners and managers can reveal or download an unsent invitation
value. The default table masks it. Reports never contain invitation values.

## Usage

`[Post-launch, D-027 point 4. Corrected 2026-08-03: "73 meaningful actions"
overstates precision. A Tier 1 row count is action-days, not actions (E09.02
§9.0 point 3). "Issued 26" is relabelled "Invited 26". The Day 7 and Day 90 rows
are not in `account-metrics.v2`, which ratifies one band.]`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Usage                                Last 30 days ▾   Complete · through 24 Jul│
├──────────────────────────────────────────────────────────────────────────────┤
│ 11 active sponsored workspaces      21 days with sponsored use              │
│ 73 days with a recorded action      15 started planning this term           │
│                                                                              │
│ Adoption                                                                    │
│ Invited 26 ── Opened 18 ── Started planning 15 ── Active in 30d 11          │
│                                                                              │
│ Continuation                                                                │
│ Around a month   9 of 12 in the March group                                 │
│                  Not enough couples yet in later groups                      │
│                                                                              │
│ Definitions                                                                 │
│ Meaningful use is a committed action. Visits do not count. Private work is  │
│ never included.                                                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

Every share is written with its denominator. "9 of 12", never "75%" alone.

## Partial coverage

```text
┌────────────────────────────────────────────────────────────┐
│ Usage coverage is partial                                  │
│ Signal events are missing for 22–24 Jul.                   │
│ At least 8 couples used Signal Studio in this period.      │
│ Rates and comparisons are withheld until coverage closes.  │
│ Data through 21 Jul 2026 · 27 of 30 days covered           │
└────────────────────────────────────────────────────────────┘
```

The missing product is named. A partial observed count says "at least". The UI
does not show a down arrow, zero, change rate, or comparison.

A metric that was **never wired** says so separately, and does not borrow the
partial-coverage frame. `suppression_reason: not_instrumented` is a different
state from `incomplete_telemetry`: one says nothing was built, the other says
something broke.

## Small group

```text
┌────────────────────────────────────────────────────────────┐
│ Not enough couples yet to report usage safely.             │
│ Redemptions are visible. Usage appears once at least       │
│ three couples are eligible.                                │
└────────────────────────────────────────────────────────────┘
```

The suppressed number is absent from the DOM, accessible name, export, and
support view-as.

## Reports

`[Post-launch, D-027 point 4. Corrected 2026-08-03: the dictionary stamp read
`venue-metrics.v1`.]`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Reports                                                                      │
│ July 2026 · Complete · account-metrics.v2                   [PDF] [CSV]       │
│ June 2026 · Partial, 27/30 covered                          [PDF] [CSV]       │
│ May 2026 · Small group, usage withheld                      [PDF] [CSV]       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Every export repeats the period, timezone, definitions, data-through time,   │
│ coverage, suppression, and content/privacy statement.                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

Each row is addressable. Opening June opens June, and the export route carries
the period it was asked for.

## Venue settings

`[CORRECTED 2026-08-03. The navigation label is **Account**. This heading keeps
its original text so existing anchors stay valid. The frame below shows the
Account panel.]`

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Account                                                                      │
│ Glenmara House · Venue Edition                                               │
│                                                                              │
│ Account members                                                              │
│ Venue owner      1 active                                                    │
│ Venue manager    2 active                                                    │
│ Venue viewer     1 active                                                    │
│                                                                              │
│ Your name in your couples' workspaces                                        │
│ Glenmara House                                                               │
│ Your name appears on the welcome card. Nothing else does.                    │
│                                                                              │
│ Privacy                                                                      │
│ The Account shows access and aggregate use. It never shows notes, tasks,     │
│ project names, briefings, private timelines, comments, files, or members.    │
└──────────────────────────────────────────────────────────────────────────────┘
```

`[D-027 point 3 · 2026-08-03: venue branding at launch is the venue's NAME ONLY.
No logo upload, no venue-written welcome message, and no control that implies
either exists. The frame states the boundary rather than offering a control that
would break it.]`

**Request history shows real requests or nothing.** A frame that renders a
fixture request list against a live venue shows that venue support conversations
that never happened.
