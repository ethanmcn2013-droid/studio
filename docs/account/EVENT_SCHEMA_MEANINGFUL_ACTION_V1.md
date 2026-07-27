# venue-meaningful-action.v1 — event contract

Status: **frozen for Phase B Sprint 1**
Date: 2026-07-27
Instrumentation version: `instrumentation.v1`
Metric dictionary: `venue-metrics.v1` → Account `account-metrics.v2`
Calendar default: `Europe/Dublin`

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
trimmed — a silent trim would let a future field leak by accident.

## Allowlisted kinds

| Product | Kinds |
| --- | --- |
| Notes | `note_created`, `note_materially_edited` |
| Tasks | `task_created`, `task_completed`, `task_reopened`, `task_reassigned`, `task_rescheduled`, `task_status_changed` |
| Timeline | `timeline_curated`, `timeline_visibility_changed`, `timeline_published` |
| Signal | `briefing_deliberately_opened`, `briefing_acknowledged` |

A kind must belong to its product. `task_created` from `notes` is rejected.

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
| First meaningful action | `adoption.firstUsefulAction` |
| Active sponsored workspaces in window | `adoption.activeRecently` |
| Day-30 retention band | `adoption.continuedAfter30Days` |
| Venue active days | `adoption.daysWithSponsoredUse` |
| Module adoption | `productReach[]` |
| Coverage envelope | `coverage.*` |

## Suppression

Enforced in the projector, never in the interface:

- behavioural values are withheld below **3** eligible sponsored workspaces;
- rates and cohort comparisons are withheld below **5**;
- missing modules or days render `partial`;
- no rows at all render `unavailable`.

None of these render as `0`. A zero is a claim that nothing happened; these
states say the opposite, that we do not know.

## Retention

Raw events are deleted after **35 days**. The daily projection survives; the
event stream does not. Late arrivals are repaired inside that window and ignored
outside it.
