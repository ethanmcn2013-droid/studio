# Weekly operating review — <YYYY-MM-DD>

> Copy to `sessions/weekly/<YYYY-MM-DD>-review.md`. Generate the numbers first:
>
> ```bash
> node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs status weekly
> ```
>
> The command produces the six sections from canonical state. **Do not retype
> its numbers.** Paste them, then add only what a person can add: the judgement,
> the decisions taken, and what changes next week.

**Held:** <date> · **Present:** Ethan McNamara · **Cadence:** Friday morning, folded into the Friday brief (D-008 clause 4)

---

## The generated review

<paste the full output of `status weekly` here, unedited>

---

## What the numbers do not say

Three or four lines. The things a report cannot know: what felt slower than it
looks, what is about to become a problem, where an estimate was optimistic.

## Decisions taken this week

| Decision | Recorded as | Command run |
|---|---|---|
| | | |

A decision that was discussed and not recorded did not happen. Approvals go
through `approve` or `approve-batch`, gate movements through `gate`, scope
through a change request. **This document records nothing by itself.**

## What changes next week

Three items maximum, each with an owner and a date. Anything longer is a backlog,
and there is already one of those.

1.
2.
3.

## Registers read with human eyes

`project-control.mjs` never reads `DECISIONS.md` or `RAID.md`, so nothing
validates either of them. Tick these deliberately.

- [ ] `RAID.md` — is every category in the index still populated? Has anything gone critical without a target date?
- [ ] `DECISIONS.md` — is anything ratified in conversation this week still unwritten?
- [ ] Freeze dates — is the next one still achievable, and if not, is a change request open?
