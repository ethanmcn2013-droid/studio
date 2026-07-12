# Planning Period privacy and permission matrix

## Actors

- Owner: owns a Workspace and its private product content.
- Collaborator: has current Membership and explicit capabilities.
- Sponsor: provides or administers an entitlement activation. A Sponsor is not a Member.
- Audience: holds an active token for one frozen public publication.
- Anonymous: has neither authenticated Membership nor an active token.

All denials use a non-enumerating not-found response unless a signed-in owner needs a specific recoverable explanation. UI visibility is never an authorization control.

| Resource or action | Owner | Collaborator | Sponsor | Audience | Anonymous |
| --- | --- | --- | --- | --- | --- |
| List own Planning Periods | Yes | Only periods containing independently authorized Workspaces | No | No | No |
| Read a private Workspace | Yes | With current workspace.read | No | No | No |
| Rename/archive/move Workspace | Yes | Only with workspace.manage | No | No | No |
| Read private Notes or Tasks | Yes | With explicit product capability | No | No | No |
| Create or revoke sponsor activation | With entitlement policy | No | Sponsor can administer its own activation state | No | No |
| Read default activation metadata | Yes | No | Own activation only | No | No |
| Read consented activation fields | Yes | No | Only fields on a live versioned consent grant | No | No |
| Promote a private item | Yes | With object.share and same-Workspace access | No | No | No |
| Edit frozen Timeline projection | Yes | With object.share | No | No | No |
| Create/rotate/revoke Audience link | Yes | With object.share | No | No | No |
| Read Audience Timeline | Owner preview | Token-bound DTO only | Token-bound DTO only | Token-bound DTO only | Active token only |
| Read source relationship or private fields | Internal owner surface only | If authorized privately | Never | Never | Never |

## Sponsor metadata

Default sponsor allowlist:

- activation ID and state;
- invitation state and timestamps;
- entitlement tier and validity;
- sponsoring organization ID;
- sponsor-local reference;
- consent receipt version and timestamp.

Workspace label, primary date and ceremony information require a separate field-level consent grant. Couple or class names, private dates, Notes, Tasks, unpublished Timeline content, collaborators, attachments and internal source IDs are excluded by default. Consent is versioned and revocable. Revocation affects subsequent sponsor reads immediately.

Sponsor-authored season grouping may organize activations by the sponsor’s own key. It does not reveal or create owner Planning Periods.

## Audience DTO

The public loader selects projection columns explicitly and validates an exact DTO before rendering:

- version;
- audience kind;
- public publication and item surrogate IDs;
- explicitly chosen public label;
- optional explicitly chosen owner display label;
- optional primary date label and calendar date;
- last-updated instant;
- Today calendar date;
- sections containing public ID, title, optional date and state.

Forbidden in API, HTML, RSC/hydration, metadata and logs: Workspace/user/source IDs, owner email, sponsor or Membership data, Note/Task descriptions, attachments, comments, provenance, audit payloads and internal metadata.

## Public-link controls

- 256-bit base64url token; only its SHA-256 hash is stored.
- Raw token returned once and excluded from logs, errors, analytics and referrers.
- Server validation on every request; private, no-store response.
- Atomic rotate and revoke with calm invalid, expired and revoked states.
- noindex/nofollow, no third-party analytics, no comments or reactions.
- Rate limiting at resolve and mutation boundaries.
- Metadata is generated only after token validation and only from the DTO.

## Required regression cases

Test owner, collaborator, sponsor, audience and anonymous reads and writes. Include moved, archived and duplicated Workspaces; revoked/rotated/expired links; invitation reuse; cross-tenant IDs; mass-assigned owner fields; source divergence; cache behavior; HTML/RSC/metadata/log leak snapshots; and sponsor consent revocation.

The school pilot remains gated on this matrix, public-payload adversarial tests, legal/DPIA review and verified provider identity. Signal Studio must not claim unqualified GDPR compliance.
