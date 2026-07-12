# Planning Period security review

Status: implementation review complete for the Planning Period change set on `feat/planning-periods-v1` across Studio, Tasks, Timeline, Signal, and Notes.

This is a scoped adversarial review of the new Planning Period, sponsorship, suite-context, Notes promotion, and Audience Timeline boundaries. It is not a claim that every historical line in all five repositories received a new exhaustive security audit.

## Security invariants

- Current Workspace membership is authority. Planning Period ownership, cached suite context, sponsorship, and local cross-product state are never substitutes.
- Sponsor activation is an entitlement association, not Workspace membership or content access.
- Notes-to-Tasks assertions bind subject, note, audience, and explicit destination; Tasks re-checks current membership.
- Tasks-to-Timeline provenance is reauthorized immediately before create, publish, and rotate mutations.
- Audience publications are frozen, explicit, allowlisted projections. Private descriptions, attachments, comments, Notes, people, and internal source identifiers are excluded.
- Audience tokens are 256-bit random values, SHA-256-only at rest, returned once, rate-limited, and immediately revocable.
- Audience pages are dynamic, noindex, no-referrer, browser-revalidated, and explicitly `no-store` at CDN layers.
- Archive, move, reorder, duplicate, and restore operations bind authorization at the database mutation sink.
- Demo/review modes use synthetic data and do not contact Clerk from the keyless browser shell.

## Threat boundaries reviewed

| Boundary | Attacker/control considered | Evidence |
| --- | --- | --- |
| Browser to Planning actions | IDs, names, positions, archive/move/duplicate choices | current-membership queries, mutation-bound SQL predicates, affected-row checks |
| Sponsor to couple Workspace | sponsor metadata and activation state | explicit consent receipt; no membership/content relation |
| Notes to Tasks | HMAC assertion, note id, destination, idempotent retry | membership-first receiver and opaque denial |
| Tasks to Timeline | stale local owner state and source provenance | fresh Tasks authority around mutation callback |
| Anonymous viewer to Audience link | bearer token, cache/referrer/indexing, DTO serialization | hash-only token lookup, exact DTO, final active receipt, response headers |
| Studio operator to entitlement migration | duplicate paid access rows | fail-closed reconciliation gate; no automatic deletion |
| Analytics/logging | names, content, tokens, identifiers | bounded event vocabulary and scrubbed payload tests |

## Validated findings and fixes

### 1. Stale Tasks authority could publish an Audience link

- ID: `TL-AUD-AUTHZ-001`
- Pre-fix path: a user remained a local Timeline owner after Tasks membership removal, then invoked Audience create, publish, or rotate for Tasks-derived data.
- Impact: bounded title/date/completion data could be made public through a new bearer URL after source authority ended.
- Final severity: `medium / P2` before remediation.
- Fix: `timeline/src/server/audience-authority.ts` performs a fresh Tasks membership check and encloses each protected mutation callback. Manual-local Timelines remain usable but cannot claim Tasks provenance.
- Proof: Timeline authority and security tests pass 9/9; removed membership prevents every callback and raw URL.

### 2. Planning mutation authorization was detached from SQL sinks

- ID: `TASKS-PLANNING-RACE-002`
- Pre-fix path: membership could be removed between an ownership check and move, reorder, archive, or restore.
- Fix: shared current-owner membership predicates are included in every update and zero affected rows fail closed.
- Proof: removed-owner writes affect zero rows; current-owner writes succeed.
- Policy outcome: fixed authorization hardening; the narrow race and bounded lifecycle impact do not remain a final reportable vulnerability.

### 3. Removed members could influence Workspace-name collision feedback

- ID: `TASKS-PLANNING-ENUM-001`
- Pre-fix path: a bulk-create collision query could include names from Workspaces where membership had ended.
- Fix: collision candidates now originate only from current Workspace memberships.
- Proof: removed names disappear while current names remain.
- Policy outcome: fixed low-impact metadata boundary; not retained as a final vulnerability.

### 4. Idempotent Notes replay could return metadata after removal

- ID: `NSEC-FD-001`
- Pre-fix path: Tasks looked up an existing promoted Task before current membership, returning Task id/URL and Workspace name/slug.
- Fix: receiver checks membership before replay lookup and returns an opaque 401 on denial.
- Proof: removed member receives exactly `denied`, with no serialized Task or Workspace metadata.
- Policy outcome: fixed bounded replay metadata issue; not retained as a final vulnerability.

### 5. Access migration automatically reconciled duplicate entitlements

- ID: `STUDIO-ENTITLEMENT-DEDUP-001`
- Pre-fix path: the migration kept `MAX(rowid)` and deleted sibling entitlement records before adding a unique index.
- Fix: duplicates are reported and the migration exits; rows and index state remain untouched pending backed-up manual reconciliation.
- Proof: temporary-database migration tests pass 2/2.
- Policy outcome: operator-only data-integrity hardening rather than an application-attacker vulnerability. It remains a release gate.

## Public payload verification

The Class Timeline fixture was exercised through the real `/s/[token]` and `/s/[token]/present` routes.

- Rendered HTML and hydration data did not contain the publication id, Tasks Workspace id, source relations, source digests, share row id, private descriptions, attachments, comments, or Note content.
- The browser made no cross-origin resource requests and logged no application warning or error after the keyless demo-shell correction.
- The route returned `X-Robots-Tag: noindex, nofollow, noarchive`, `Referrer-Policy: no-referrer`, `CDN-Cache-Control: no-store`, and `Vercel-CDN-Cache-Control: no-store`. Next's dynamic page layer emits browser `no-cache, must-revalidate`, which forces revalidation instead of reuse.
- Revoking the database share row made the same bearer URL render “This link is no longer active” on the next two uncached requests.
- Reduced-motion emulation reported zero active animations and a maximum transition duration of 0.01 ms.

## Regression coverage

Focused security validation:

- Studio migration: 2/2.
- Tasks membership, mutation, and replay: 11/11.
- Timeline Audience authorization and projection contracts: 9/9.

Full branch verification:

- Studio: 122/122 assertions; typecheck, design-system check, and 41-page production build pass.
- Tasks: 72/72 tests plus four contracts; typecheck, design-system check, migration contract, changed-file lint, and 56-page build pass.
- Timeline: 106/106 tests plus four contracts; typecheck, design-system check, migration contract, and 19-page build pass.
- Signal: 179 unique runtime tests; typecheck, design-system check, migration contract, and 35-page build pass.
- Notes: 14/14 tests plus four contracts; typecheck, design-system check, and 17-page build pass.

Historical full-repository lint debt remains at unchanged lines in Studio, Timeline, and Signal; branch-introduced lint findings were fixed or shown to be inherited. Tasks changed-file lint is clean. Notes has no lint script.

## Residual release gates

1. Run production migration preflight against backed-up databases; reconcile duplicate entitlements explicitly before creating unique indexes.
2. Configure and verify live Tasks membership adapters and cross-product assertion secrets in preview before enabling flags.
3. Configure and verify the new signed Tasks v2 Planning Period catalog endpoint in preview so Notes can resolve live period/workspace destinations.
4. Configure and verify the new signed Notes-to-Timeline receiver in preview, including one-time URL and duplicate-promotion behavior.
5. Exercise owner, collaborator, sponsor, removed-member, and anonymous journeys against preview identities and provider-backed data.
6. Preserve deploy logs, provider backups, migration receipts, and revoked-token smoke evidence before production rollout.

## Release conclusion

The reviewed code paths, including the signed Tasks catalog and Notes-to-Timeline receiver, are safe to merge behind disabled/default-off flags. They are not yet approved for production migration or flag enablement until the residual operator and live-integration configuration gates above have receipts.
