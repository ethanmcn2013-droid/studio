# Venue Portal privacy, minimization, and retention

## Principle

A venue bought access. It did not buy visibility into a couple's work.

The Venue Portal therefore reports the commercial lifecycle and aggregate use
of sponsored access. It never reports the contents of a sponsored workspace
and never makes sponsorship equivalent to membership.

## Data classes

| Class | Examples | Portal treatment |
| --- | --- | --- |
| Commercial access metadata | Term, allotment, code state, redemption time, entitlement tier, activation state. | Allowed for the owning sponsor. Code values are limited to owner/manager and excluded from reports. |
| Aggregate usage | Active sponsored workspace count, venue active days, module adoption, cohort counts. | Allowed after suppression and coverage rules. |
| Consented workspace metadata | Workspace label, primary date, ceremony. | Existing owner-consent policy can allow named fields, but v1 Portal does not request or render them. |
| Private product content | Note body, task title, project name, private Timeline item, briefing prose, comments, attachments. | Always forbidden. Consent cannot override this boundary. |
| Relationship data | Collaborators, members, invitees, user email, Clerk id. | Forbidden from venue payloads and exports. |
| Operational portal identity | Venue portal member role and status. | Sponsor-scoped; email resolved live from Clerk. |

## Collection rules

Meaningful-action events are emitted on the server after a successful
transaction. They contain:

- sponsor id;
- sponsor activation id;
- pseudonymous subject and workspace keys derived with a rotating keyed hash;
- module and allowlisted action kind;
- occurred-at time rounded to the minute;
- deterministic source event id for idempotency;
- instrumentation version.

They do not contain:

- names, email, phone, IP, user agent, Clerk id, raw workspace id;
- a note, task, project, briefing, comment, attachment, or title;
- due dates, wedding dates, ceremony details, labels, or collaborator counts;
- before/after application payloads;
- operator support activity, demo data, seed data, or system migrations.

The aggregation job receives the minimum event shape, joins sponsor attribution
through the existing entitlement/redemption/activation chain, and writes only
venue/date aggregates and frozen cohort counts.

## Projection

The Phase B projection is additive to the canonical `signal-entitlements`
store:

### `sponsor_usage_daily`

- `sponsor_id`, `local_date`
- `metric_dictionary_version`, `instrumentation_version`
- active sponsored workspace count
- active subject count
- meaningful-action counts by module
- distinct workspace counts by module
- first-action and cohort eligible/retained counts
- `coverage_state`, covered/missing module mask
- `data_through`, `generated_at`

Primary key: `(sponsor_id, local_date, metric_dictionary_version)`.

### `sponsor_report_snapshots`

- sponsor, period start/end, timezone;
- metric and instrumentation versions;
- immutable aggregate payload;
- coverage and suppression metadata;
- generated time and export object reference;
- generator actor/origin and content hash.

The payload schema has no person, workspace, content, or code-value fields.

### Short-lived source events

Raw pseudonymous events are retained for 35 days to repair late delivery and
rebuild a monthly rollup. Day-90 cohort counts are closed incrementally into
the aggregate projection; raw events are not kept for 100 days merely to
support a chart.

## Retention

| Data | Retention | End action |
| --- | --- | --- |
| Short-lived pseudonymous usage event | 35 days | Hard delete after the rollup and late-arrival window. |
| Daily sponsor usage aggregate | 24 months after period end | Delete or irreversibly fold into annual sponsor totals. |
| Report snapshot and export | 24 months after report end, unless the venue requests earlier deletion | Delete export object and snapshot payload; retain only audit proof of generation/deletion. |
| Portal invitation | 30 days after expiry if never accepted | Delete token and invitation metadata. |
| Revoked portal membership | 24 months after revocation | Crypto-shred the identity subject; retain non-PII audit skeleton. |
| Sponsor request note | 24 months after closure | Delete free text; retain request kind, state, actor class, and timestamps. |
| Code/redemption/access audit | Existing access policy | PII hashes 24 months after entitlement end or erasure; anonymised financial/audit skeleton 6 years. |

These windows inherit the active GDPR lifecycle decision. A future policy
change updates that decision first.

## Small-group protection

- Behavioural counts are withheld below 3 eligible sponsored workspaces.
- **The behavioural floor is two-sided.** A count is also withheld when fewer
  than 3 eligible workspaces fall outside it. A venue knows which couples it
  invited, so "1 of 40" describes one identifiable couple and "39 of 40" names
  the one who did not. Both are withheld. Recorded as R-027 and fixed in
  `src/lib/account/instrumentation/suppression.ts`.
- The withheld state never distinguishes "too low" from "too high". A surface
  that renders "fewer than 3" has made the disclosure the floor prevents.
- Rates, medians, and retention cohorts are withheld below 5 eligible
  activations. A rate is a single value carrying its own numerator and
  denominator (`RateValue`); nothing can assemble a percentage from two
  separate metrics. Recorded as R-028.
- Suppression applies to screen, CSV, PDF, API, email, and support view-as.
- The response contains a suppression reason, never the hidden number.
- Commercial access counts such as allotment and redemptions remain visible
  because they are the direct contract record, not behavioural observation.

## Tenant boundary

Every read begins with the authenticated portal member and resolves their
active `sponsor_id` server-side. Queries then require that sponsor id. A client
cannot select an arbitrary sponsor id.

The projection job uses the same sponsor id from the canonical activation
chain. Unknown or ambiguous attribution is recorded as unattributed telemetry
and excluded from venue metrics. It is never guessed into a sponsor.

## Required privacy tests

1. **Forbidden-key payload test.** Recursively reject keys or values matching
   Notes, Tasks content, private Timeline, briefing prose, comments,
   attachments, collaborators, raw user/workspace ids, emails, or code values.
2. **Tenant-isolation test.** Sponsor A credentials cannot read Sponsor B's
   screen, export, request, member, or snapshot by path, query, or body change.
3. **Projection allowlist test.** Unknown database columns never spread into a
   portal DTO.
4. **Small-group test.** Counts below 3 and rates below 5 are absent from every
   output format.
5. **Coverage test.** Missing module/day coverage produces partial or
   unavailable, never zero.
6. **View-as test.** Operator support events do not enter usage and cannot reach
   product content.
7. **Erasure test.** Identity/pseudonym destruction leaves aggregate and
   non-PII audit records valid.
8. **Retention test.** Expired raw events and exports are deleted on schedule
   and the deletion is observable in the audit health report.

