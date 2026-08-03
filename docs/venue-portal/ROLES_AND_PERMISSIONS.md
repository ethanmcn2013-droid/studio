# Signal Studio Account · roles and permissions (filed as "Venue Portal")

Naming: the **Signal Studio Account IS the Venue Portal** (**D-015 Q4**). One
surface, two names.

**This is the current roles and permissions contract of record.** It is not
historical and it is not superseded. Corrected against the ratified decision
record on 2026-08-03. Superseded text is struck through and marked
`[SUPERSEDED <id> · <date>]`; it is never deleted silently.

**Nothing in this matrix is implemented behind a venue identity today.** There
is no venue-authenticated identity anywhere in the repository. The review
surface is gated by a single shared HQ password and the role is client state
chosen from a dropdown. Every sentence below of the form "the venue does X" is
today "one holder of one shared password does X, on any venue". This matrix is
the specification the Phase C work is built against, not a description of what
runs. Recorded, not overstated.

Account membership is separate from sponsor activation and separate from every
Signal Studio workspace role. A venue member never becomes a member of a
sponsored workspace by joining the Account.

## Roles

| Role | Plain responsibility | Boundary |
| --- | --- | --- |
| Venue owner | Controls Account members, reads all venue reporting, downloads reports, and makes requests. | Cannot change ~~allotments~~ entitlement mode `[SUPERSEDED D-020 · 2026-08-03]`, revoke entitlements, inspect people, or enter a sponsored workspace. |
| Venue manager | Reads Overview, Access, Usage, and Reports; downloads unused codes; makes requests. | Cannot manage Account members or change venue identity. |
| Venue viewer | Reads aggregate Overview, Usage, and Reports. | Cannot download codes, view code-level state, manage members, or make requests. |
| Signal operator | Supports the venue from Signal HQ through an audited view-as. | Not stored as a venue portal member. Cannot use view-as to reach workspace content. |

## Capability matrix

| Capability | Owner | Manager | Viewer | Signal operator |
| --- | :---: | :---: | :---: | :---: |
| Read term and ~~allotment totals~~ entitlement position `[SUPERSEDED D-020 · 2026-08-03]` | Yes | Yes | Yes | HQ |
| Read aggregate usage and coverage | Yes | Yes | Yes | HQ |
| Read reports | Yes | Yes | Yes | HQ |
| Export reports | Yes | Yes | Yes | HQ, audited |
| Read unused code values | Yes | Yes | No | HQ, audited |
| Download/share unused codes | Yes | Yes | No | HQ, audited |
| ~~Request more codes~~ Request support or a report `[SUPERSEDED D-020 · 2026-08-03. Under an unlimited entitlement there is nothing to request more of. The request journey is retained for support and report requests.]` | Yes | Yes | No | Answer in HQ |
| Manage Account members | Yes | No | No | Support in HQ |
| Edit venue profile and notices | Yes | No | No | Support in HQ |
| ~~Change allotment~~ Change entitlement mode `[SUPERSEDED D-020 · 2026-08-03]` | No | No | No | HQ mutation, audited |
| Mint/revoke codes | No | No | No | HQ mutation, audited |
| View a person or couple | No | No | No | Only access provenance in HQ; no private work |
| Create workspace membership | No | No | No | No |
| Read Notes, Tasks, private Timeline, Signal content, comments, attachments, or collaborators | No | No | No | No |

## Membership lifecycle

The future `sponsor_members` projection is additive to `signal-entitlements`:

- `id`
- `sponsor_id`
- `identity_subject_id` as an opaque Clerk subject
- `role`: `owner | manager | viewer`
- `status`: `invited | active | suspended | revoked`
- `invited_by_subject_id`
- `invited_at`, `accepted_at`, `suspended_at`, `revoked_at`
- `created_at`, `updated_at`

It does not store email. Clerk resolves the visible email at render time. Every
membership mutation writes a non-PII audit event with actor, sponsor, role,
reason, before/after state, and time.

Rules:

- a sponsor must always retain at least one active owner;
- an invitation is sponsor-scoped and single-use;
- accepting an invitation never creates a workspace membership;
- suspending or revoking a member invalidates portal sessions immediately;
- a member can belong to more than one venue, but each request resolves one
  active sponsor context and re-authorises it server-side;
- Signal operator view-as requires operator identity, reason, sponsor id,
  expiry, and `view_as` audit event.

## Request model

The Account may create a request. It may not perform the requested access
mutation. The `sponsor_requests` table carries:

- sponsor and requesting member;
- kind: ~~`more_codes`~~ `[SUPERSEDED D-020 · 2026-08-03]` `| report | support | profile_change`;
- ~~requested quantity for `more_codes`~~ `[SUPERSEDED D-020 · 2026-08-03. There is no quantity to request.]`;
- plain operational note with a short maximum length;
- state: `open | approved | declined | fulfilled | canceled`;
- operator actor and decision reason;
- created, decided, fulfilled timestamps.

~~Approving more codes remains a Signal HQ action that writes the
`allotment_ledger` and `entitlement_events` in the same transaction. Marking a
request approved without that ledger write does not change the allotment.~~
`[SUPERSEDED D-020 · 2026-08-03]` Changing a venue's **entitlement mode** remains
a Signal HQ action that writes `entitlement_events`. Marking a request approved
without that write changes nothing.

**The request path is not scoped to the acting venue today.** The shipped server
action takes a caller-supplied sponsor id and writes against it after checking
only that the caller holds the HQ session cookie. This matrix requires the
server to resolve the sponsor from the authenticated member and to ignore any
client-supplied id. Recorded as the standing requirement on every mutation added
to this surface.

**Divergence with the shipped role table, recorded not reconciled.**
`src/lib/account/roles.ts:20-26` grants **Manager** a capability called
`edit_reporting_preferences`. This matrix has no reporting-preferences row, and
its nearest row, "Edit venue profile and notices", is Owner Yes / Manager No /
Viewer No. Either the matrix gains a row or the code loses the grant.
**Decision owner: founder.** Not resolved here, because neither side is
ratified.

## Authorisation tests

- each role is exercised against each capability;
- direct object references with another `sponsor_id` return not found;
- changing the client-provided sponsor id cannot change the server-resolved
  sponsor context;
- a revoked member's existing session loses access;
- the final owner cannot be removed;
- view-as cannot call workspace, membership, content, or mutation endpoints;
- report download and code download are re-authorised at request time and
  recorded.

