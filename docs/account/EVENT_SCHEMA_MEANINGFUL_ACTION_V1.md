# venue-meaningful-action.v1 · event contract (Signal Studio Account, the surface E07 calls the Venue Portal)

Naming: the **Signal Studio Account IS the Venue Portal** (**D-015 Q4**). One
surface, two names.

Status: **frozen for Phase B Sprint 1** · corrected 2026-08-03
Date: 2026-07-27
Instrumentation version: `instrumentation.v1`
Metric dictionary: ~~`venue-metrics.v1`~~ `[SUPERSEDED · 2026-08-03]`
**`account-metrics.v2`**, which is what all shipped code stamps
Calendar default: `Europe/Dublin`

**Post-launch (D-027 point 4, 2026-08-03).** The adoption-evidence layer this
event feeds follows after 1 September. The contract stays frozen and written.

This is the only shape a product may emit to describe sponsored use. It carries
no content, no identity, and no destination. It says that a person who holds
sponsored access committed a real action in a product, and nothing else.

## Shape

```ts
type VenueMeaningfulActionV1 = {
  eventId: string;                     // idempotency key, unique per action
  instrumentationVersion: "instrumentation.v1";
  product: "notes" | "tasks" | "timeline" | "signal";
  kind: string;                        // allowlisted, see below
  occurredAt: number;                  // ms since epoch, UTC
  subjectIdHash: string;               // salted, opaque
  workspaceIdHash: string;             // salted, opaque
};
```

Exactly these seven fields. An event carrying any other key is rejected, not
trimmed. A silent trim would let a future field leak by accident.

## Allowlisted kinds

| Product | Kinds |
| --- | --- |
| Notes | `note_created`, `note_materially_edited` |
| Tasks | `task_created`, `task_completed`, `task_reopened`, `task_reassigned`, `task_rescheduled`, `task_status_changed` |
| Timeline | `timeline_created`, `timeline_curated`, `timeline_published`, `timeline_unpublished` **(unpublish only; never a first useful action, D-032 R10)** |
| Signal | `briefing_deliberately_opened`, `briefing_acknowledged` **(no call site)** |

A kind must belong to its product. `task_created` from `notes` is rejected.

**Two determinations of fact, added 2026-08-03 (E09.02 §9.0 points 4 and 5).
Not open for choice.**

1. **`timeline_unpublished` fires on unpublish, and only on unpublish**
   (`app/src/modules/timeline/server/actions/workspaces.ts:653`). Counting it as
   sharing counts a couple taking their Timeline down as putting it up. It must
   appear in **no** sharing computation. E09.02 acceptance criterion 8 forbids
   it. It was named `timeline_visibility_changed`; that name is now reserved and
   rejected by name.
2. **`briefing_acknowledged` has no call site anywhere in the repository.** Any
   metric built on it is permanently zero, and leaving it allowlisted makes the
   coverage mask look healthier than it is.

**`[RESOLVED D-032 R10 · 2026-08-03]`** E09.02 §2 defined first useful action as
**any qualifying Tier 1 event of any kind**, and nothing excluded
`timeline_unpublished` from it, so as written a couple taking their Timeline
down became an activation. **It is now excluded**, on the same reasoning that
keeps it out of every sharing computation: a withdrawal is not an arrival. The
rule is `FIRST_USEFUL_ACTION_EXCLUDED_KINDS` and
`qualifiesAsFirstUsefulAction()` in this schema file, mirrored byte-for-byte
between `app/` and `studio/`, and the rollup asks it rather than restating it.
The kind remains allowlisted use.

**`[RATIFIED D-032 R9 · 2026-08-03]`** E09.02 §9.8 asked whether
`briefing_acknowledged` stays allowlisted while unwired. **Ratified: removed
until it has a call site, with the removal recorded so E09.03 restores it
deliberately.**

`[STANDING GAP · 2026-08-03. The allowlist has not been changed yet. Removing a
kind alters the emitted-event contract in both repos and
`venue-meaningful-action.v1.json` with it, which belongs to E09.03's change
rather than to the ratification pass. Until then the coverage envelope reports
Signal as one of two kinds instrumented. Recorded, not silently reconciled.]`

## Forbidden fields

Never present, at any nesting depth:

`title`, `name`, `body`, `content`, `text`, `description`, `note`, `comment`,
`email`, `emailAddress`, `phone`, `url`, `href`, `path`, `slug`, `filename`,
`attachment`, `clerkId`, `userId`, `workspaceId`, `subjectId`, `code`,
`accessCode`, `token`, `secret`, `ip`, `userAgent`.

The raw `workspaceId` and `subjectId` are forbidden precisely because their
hashed forms are the supported carrier. If the hash is unavailable, the event is
not emitted.

## Emission rule

Emit **after** the transaction that performed the action commits, never before
and never inside it. A rolled-back action must produce no event. A page view is
not an action. Opening a briefing counts only when the open was deliberate, in
the sense the metric dictionary already defines.

Emission is behind `SPONSOR_USAGE_EVENTS=1` and is off in production until
Sprint 2 exit.

## Identity hashing

`subjectIdHash` and `workspaceIdHash` are `sha256(salt + ":" + id)`, truncated
to 32 hex characters, where the salt is `SPONSOR_USAGE_HASH_SALT` and is not
committed. The hash is stable so a workspace can be counted once across a
window, and opaque so the Account surface can never resolve it back to a person.

Rotating the salt intentionally breaks continuity. That is a deliberate cost:
counts before and after a rotation must not be compared, and the rollup treats a
salt change as a coverage break rather than a drop in activity.

## Mapping into the Account snapshot

| Dictionary metric | Account field |
| --- | --- |
| First useful action | `adoption.firstUsefulAction` |
| Recent use (30 complete days) | `adoption.activeRecently` |
| 30-day continuation (days 25 to 35) | `adoption.continuedAfter30Days` |
| Days with sponsored use | `adoption.daysWithSponsoredUse` (**`account-metrics.v2` §7A**) |
| Product reach | `productReach[]` |
| Coverage envelope | `coverage.*` |

**`daysWithSponsoredUse` was live and undefined.** It is declared at
`src/lib/account/types.ts:108`, computed, rendered on screen and printed into
the PDF, and it appeared nowhere among E09.02's original six definitions.

`[RESOLVED D-032 R11 · 2026-08-03. **Adopted as the seventh definition**, at
E09.02 §7A. The unit is days, not workspaces and not actions. It is an aggregate
over dates and cannot resolve toward an individual, so E09.02 §2's founder-only
bar does not reach it. It carries the same coverage and suppression treatment as
the other behavioural metrics.]`

**Every share carries its denominator, drawn from invitations issued and
redemptions recorded, never from bookings** (E09.02 §1). "9 of 12", never "75%"
alone.

## Suppression

Enforced in the projector, never in the interface:

- behavioural values are withheld below **3** eligible sponsored workspaces;
- rates and cohort comparisons are withheld below **5**;
- missing modules or days render `partial`;
- no rows at all render `unavailable`.

The 3 and 5 thresholds are ratified in **D-011 point 3** and are not editable
here.

`suppression_reason` carries **four** values, not three:
`small_group | incomplete_telemetry | not_instrumented | none`.

`[ADDED 2026-08-03. `not_instrumented` is required by E09.02 §3 and is already
emitted by `src/lib/account/instrumentation/coverage.ts:110-112`. It is the
state where a metric was never wired, as distinct from `incomplete_telemetry`,
where it was wired and the data has a gap. Conflating them tells a customer that
something broke when in fact it was never built.]`

None of these render as `0`. A zero is a claim that nothing happened; these
states say the opposite, that we do not know.

A fifth value state exists and is not a suppression: **`unlimited`** (D-020).
There is no number, and that is the answer. It is not `withheld`, not
`unavailable`, and never `0`.

## Retention

Raw events are deleted after **35 days**. The daily projection survives; the
event stream does not. Late arrivals are repaired inside that window and ignored
outside it.
