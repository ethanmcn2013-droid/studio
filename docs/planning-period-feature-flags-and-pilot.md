# Planning Period feature flags and pilot

## Mechanism

Use the smallest server-side environment-controlled flag reader in each deployable. Public client variables may affect presentation only; server authorization and data access never depend on a client-supplied flag.

| Capability | Environment key | Default |
| --- | --- | --- |
| Planning Period catalog and Your Work | SIGNAL_PLANNING_PERIODS_ENABLED | off in production, on in test |
| Contextual onboarding | SIGNAL_CONTEXTUAL_ONBOARDING_ENABLED | off in production |
| Planning Period Signal | SIGNAL_PERIOD_SIGNAL_ENABLED | off in production |
| Audience Timeline | SIGNAL_AUDIENCE_TIMELINE_ENABLED | off in production |
| School design-partner pilot | SIGNAL_SCHOOL_PILOT_ENABLED | off |
| Lifecycle duplication/roll-forward | SIGNAL_LIFECYCLE_DUPLICATION_ENABLED | off |
| Legacy Timeline public links | SIGNAL_LEGACY_TIMELINE_ENABLED | current behavior during migration |

Flags hide new entry points and writes. They do not delete data, invalidate existing Membership, revoke an existing share or block an established user from prior product flows.

## Entitlement

Pilot access is a time-bounded capability in the existing entitlement system. Do not hardcode free accounts, school email domains, seat counts or prices. Entitlement source, effective instant, expiry, status and immutable provenance are retained. A pilot entitlement does not create Membership or sponsor content access.

## Cohort sequence

1. Local and automated fixtures.
2. Internal owner accounts.
3. Named design partners with explicit time-bounded entitlements.
4. Small school cohort after privacy and legal gates.
5. Broader rollout only after migration, activation, retention and support evidence.

## Required release gates

- provider subject and Tasks Membership authority verified in production;
- successful snapshot migration and restore receipt;
- privacy/permission matrix approved;
- school DPIA/legal review complete;
- public DTO leak tests pass across API, HTML, RSC, metadata and logs;
- link rotation/revocation and cache behavior proven;
- keyboard, screen-reader, reduced-motion, mobile and 200 percent zoom checks pass;
- no pupil data required or stored;
- incident rollback owner and command documented.

Do not describe the pilot as generally available and do not claim unqualified GDPR compliance.
