# Venue Portal roles and permissions

Portal membership is separate from sponsor activation and separate from every
Signal Studio workspace role. A venue member never becomes a member of a
sponsored workspace by joining the portal.

## Roles

| Role | Plain responsibility | Boundary |
| --- | --- | --- |
| Venue owner | Controls portal members, reads all venue reporting, downloads reports, and makes requests. | Cannot change allotments, revoke entitlements, inspect people, or enter a sponsored workspace. |
| Venue manager | Reads Overview, Access, Usage, and Reports; downloads unused codes; makes requests. | Cannot manage portal members or change venue identity. |
| Venue viewer | Reads aggregate Overview, Usage, and Reports. | Cannot download codes, view code-level state, manage members, or make requests. |
| Signal operator | Supports the venue from Signal HQ through an audited view-as. | Not stored as a venue portal member. Cannot use view-as to reach workspace content. |

## Capability matrix

| Capability | Owner | Manager | Viewer | Signal operator |
| --- | :---: | :---: | :---: | :---: |
| Read term and allotment totals | Yes | Yes | Yes | HQ |
| Read aggregate usage and coverage | Yes | Yes | Yes | HQ |
| Read reports | Yes | Yes | Yes | HQ |
| Export reports | Yes | Yes | Yes | HQ, audited |
| Read unused code values | Yes | Yes | No | HQ, audited |
| Download/share unused codes | Yes | Yes | No | HQ, audited |
| Request more codes | Yes | Yes | No | Approve in HQ |
| Manage portal members | Yes | No | No | Support in HQ |
| Edit venue profile and notices | Yes | No | No | Support in HQ |
| Change allotment | No | No | No | HQ mutation, audited |
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

The portal may create a request. It may not perform the requested access
mutation. The optional `sponsor_requests` table carries:

- sponsor and requesting member;
- kind: `more_codes | report | support | profile_change`;
- requested quantity for `more_codes`;
- plain operational note with a short maximum length;
- state: `open | approved | declined | fulfilled | canceled`;
- operator actor and decision reason;
- created, decided, fulfilled timestamps.

Approving more codes remains a Signal HQ action that writes the
`allotment_ledger` and `entitlement_events` in the same transaction. Marking a
request approved without that ledger write does not change the allotment.

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

