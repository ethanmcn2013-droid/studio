# Signal Studio Account · privacy, minimization, and retention (filed as "Venue Portal")

Naming: the **Signal Studio Account IS the Venue Portal** (**D-015 Q4**). One
surface, two names.

**This is the current privacy and retention contract of record.** It is not
historical and it is not superseded. Corrected against the ratified decision
record on 2026-08-03. Superseded text is struck through and marked
`[SUPERSEDED <id> · <date>]`; it is never deleted silently.

**Suppression thresholds are not editable in this document.** D-011 point 3
ratifies 3 and 5 and cites this document as its source. Editing the numbers here
would edit the document a ratified decision points at.

## Principle

A venue bought access. It did not buy visibility into a couple's work.

The Account therefore reports the commercial lifecycle and aggregate use
of sponsored access. It never reports the contents of a sponsored workspace
and never makes sponsorship equivalent to membership.

## Data classes

| Class | Examples | Portal treatment |
| --- | --- | --- |
| Commercial access metadata | Term, ~~allotment~~ entitlement mode `[SUPERSEDED D-020 · 2026-08-03]`, code state, redemption time, entitlement tier, activation state. | Allowed for the owning sponsor. Code values are limited to owner/manager and excluded from reports. |
| Aggregate usage | Active sponsored workspace count, days with sponsored use, module adoption, cohort counts. | Allowed after suppression and coverage rules. |
| Consented workspace metadata | Workspace label, ceremony details. | Existing owner-consent policy can allow named fields, but the Account does not request or render them. |
| **Wedding date** | The couple's wedding date. | **Allowed, narrowly. See "Wedding dates" below.** `[CORRECTED D-011 point 1 · 2026-08-02. This row previously sat inside "Consented workspace metadata" as "primary date", which this document said the Account "does not request or render". An implementer reading only this document would have refused to build D-011 point 1.]` |
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

**This list governs the pseudonymous event, and only the event.** No date of any
kind enters a meaningful-action event, and that is unchanged. It is **not** a
statement about what the Account may project to a venue from the canonical
entitlement store. Read as a blanket prohibition it contradicts D-011 point 1,
which is ratified. See "Wedding dates" below. `[CLARIFIED D-011 point 1 ·
2026-08-02]`

The aggregation job receives the minimum event shape, joins sponsor attribution
through the existing entitlement/redemption/activation chain, and writes only
venue/date aggregates and frozen cohort counts.

## Wedding dates

**D-011 point 1, ratified 2026-08-02.** A couple's wedding date is shown to a
venue **only where the couple redeemed a code from that venue**. It is shown to
no other venue, at any cohort size, under any coverage state.

**Date changes are never shown.** A postponement is the couple's news to share,
not a dashboard event.

That second rule appears in no other document in this programme and is written
here so it cannot be lost. In practice it means the surface renders the current
date or nothing, and never renders:

- a previous date;
- a delta, a "moved from", or a "postponed" flag;
- a change count or an edit timestamp;
- an attention item, notification or report line derived from a change;
- a change in an export, an accessibility label, or a support view-as.

The projection is per-venue and per-redemption. The condition is checked
server-side against the canonical redemption chain, never from a client-supplied
sponsor id.

**Not built for 1 September.** The mechanism this depends on is the consent
projection, and **D-027 point 4** (2026-08-03) states the consent layer stays
unwired for now. Until it is wired, the field is not rendered. Recording the
rule now is what stops it being implemented wrongly later.

**Standing conflict, recorded not reconciled.** `E04.09`'s task record notes the
governing gate as still open. The authority order (WORKFLOWS §8) puts the
ratified decision above this document, which is why the correction is made here
rather than the other way round.

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
- Rates, medians, and retention cohorts are withheld below 5 eligible
  activations.
- Suppression applies to screen, CSV, PDF, API, email, and support view-as.
- The response contains a suppression reason, never the hidden number.
- Commercial access counts such as ~~allotment~~ `[SUPERSEDED D-020 ·
  2026-08-03]` covered, available, invitations issued and redemptions remain
  visible **at any cohort size**, because they are the direct contract record,
  not behavioural observation.

### The asymmetry, and its basis `[RATIFIED D-032 R12 · 2026-08-03]`

`[This section previously read "The asymmetry has no ratified basis and is an
open question... Decision owner: founder. Recorded, not resolved." D-032 R12
resolved it on 2026-08-03. What follows is a rule, not a proposal.]`

**Behavioural counts are withheld below 3 eligible sponsored workspaces. Rates,
medians and retention cohorts are withheld below 5. Access metrics carry no
cohort floor and are emitted exactly at any cohort size.**

The basis, written here so it does not have to be reconstructed:

**Access counts are the direct contract record between Signal Studio and the
venue.** Covered, available, issued and redeemed describe what Signal issued on
the venue's own instruction and what came back. They are the venue's own
commercial facts. The venue can already reconcile them against its own records,
and it would be entitled to ask for them in writing.

**Behavioural counts are observation of couples.** The floors of 3 and 5 exist
for one reason: to stop a number resolving toward one identifiable couple's
conduct inside a small group. That risk is not present in a count of invitations
the venue itself asked us to send. Nothing about how a couple behaved is
recoverable from "you invited 1, 1 opened their workspace".

So a venue with one redeemed invitation is shown **one**. Withholding it would
protect nobody, because no couple is described by it, and it would make the
commercial record unreconcilable. That is a real cost paid for no privacy gain.

**D-011 point 3 remains the source of the 3 and the 5 and is unchanged.** It was
silent on access metrics; D-032 R12 supplies the missing rule rather than
altering either threshold.

**What the asymmetry does not relax.** No floor is not no honesty contract. An
absent access figure renders `unavailable` and never `0`. An unlimited
entitlement renders `unlimited` and never a number (D-020). No access metric may
carry a code value, a person, or a workspace label.

**Where the rule lives.** `ACCESS_METRIC_MIN_WORKSPACES`, `COHORT_FLOOR` and
`presentAccess()` in `src/lib/account/instrumentation/suppression.ts`.
`presentAccess()` deliberately takes no cohort argument, so a behavioural floor
cannot be applied to a contract fact by accident, and a reader can see from the
signature that no floor exists to apply.

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
4a. **Access-floor test** `[ADDED D-032 R12 · 2026-08-03]`. An access metric
   renders exactly at a cohort of one, in every output format, while the
   behavioural counts on the same surface stay withheld. An absent access
   metric still renders `unavailable` and never `0`.
5. **Coverage test.** Missing module/day coverage produces partial or
   unavailable, never zero.
6. **View-as test.** Operator support events do not enter usage and cannot reach
   product content.
7. **Erasure test.** Identity/pseudonym destruction leaves aggregate and
   non-PII audit records valid.
8. **Retention test.** Expired raw events and exports are deleted on schedule
   and the deletion is observable in the audit health report.

