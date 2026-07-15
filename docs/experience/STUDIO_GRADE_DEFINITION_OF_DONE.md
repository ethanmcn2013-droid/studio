# Studio-grade Definition of Done

“Studio grade” is a release claim backed by complete evidence. It is not a synonym for implemented, registered, green CI, visually attractive, or approved by an agent.

## Per-audit gate

An audit for one experience, state, and breakpoint passes only when:

- it identifies a registered experience and canonical state/breakpoint;
- all 13 canonical dimensions are present as integer scores from 0 through 4;
- every dimension is at least 3;
- the mean is at least 3.5, rounded to two decimals;
- at least one rendered evidence reference is present;
- the reviewer and review date are recorded; and
- no linked release-blocking finding remains unresolved and unexcepted.

The exact anchors are in [Audit Rubric](./AUDIT_RUBRIC.md).

## Experience-level gate

A registered experience is Studio grade only when all of the following are true:

### Inventory and intent

- [ ] Stable ID, source system, experience class, route or trigger, source, journey, archetype, job, action, roles, tier, and owners are correct.
- [ ] Required states reflect the real job, including error, restricted, reduced-motion, keyboard-only, and dense/long-content variants where applicable.
- [ ] All four canonical breakpoints are required and evidenced.
- [ ] The materiality hash matches the discovered source.

### Coverage and deterministic evidence

- [ ] Fixture, screenshot, accessibility, and automated-test coverage are complete for the changed experience.
- [ ] Navigation succeeds and the HTTP response is successful.
- [ ] Horizontal overflow is zero at every required breakpoint.
- [ ] Serious and critical Axe violations are zero.
- [ ] Page errors are zero.
- [ ] Candidate, baseline, and diff references are recorded where visual comparison applies.
- [ ] Performance evidence and perceived-wait behavior cover the primary job, not only initial page load.

Console errors are evidence and must be triaged, but the current capture implementation does not automatically fail on them. Missing baselines are also recorded without making capture `pass` false. Both still prevent a complete Studio-grade evidence claim until reviewed or resolved.

### Judgment and resolution

- [ ] Every required state/breakpoint has a complete 13-dimension audit.
- [ ] Deterministic-plus-human dimensions include human review evidence.
- [ ] Every open finding has severity, impact, recommendation, owner, confidence, and source.
- [ ] Resolved findings carry resolution evidence and a resolution date.
- [ ] Visual changes have a matching review with `approved` or `resolved` status.
- [ ] No expired exception, stale baseline ID, broken source, or unknown reference remains.

### Approval and freshness

- [ ] The golden reference, when claimed, belongs to a founder-approved golden set.
- [ ] Baseline approval records the approver and exact capture environment.
- [ ] Evidence was regenerated after the latest material change.
- [ ] The generated report says `baseline-held`, not merely structurally valid.
- [ ] The experience's registry status and baseline reference are updated from evidence, never assertion.

## Hard blockers

Any one of these blocks Studio-grade completion regardless of aggregate score:

1. An unregistered/obsolete experience, broken source, duplicate ID/source, invalid schema, or missing canonical metadata.
2. Any dimension below 3, mean below 3.5, missing dimension, non-integer score, incorrect mean/pass flag, or missing rendered evidence.
3. An unresolved release-blocking finding without a valid accepted exception.
4. A failed capture: navigation failure, non-success HTTP response, horizontal overflow, serious/critical Axe issue, or page error.
5. A changed screenshot without a matching approved/resolved review.
6. New open `release-blocking` or `high` debt not present in the approved baseline and not covered by a time-boxed approved exception.
7. A material source change without complete fixture, screenshot, and accessibility coverage.
8. An expired, incomplete, unknown, or unapproved exception.
9. A required state/breakpoint with no current audit or baseline evidence.
10. A provisional golden set presented as approved reference quality.

## Exceptions

An exception is a temporary risk decision, not a score adjustment. It must include a stable ID, rationale, owner, scope, approval source, expiry date, and remediation plan. Expired exceptions fail validation. The accepted finding remains visible, and the exception must be removed when remediation lands.

The baseline debt list in [`baseline.json`](../../experience/baseline.json) is a ratchet, not an exception mechanism: existing IDs may remain temporarily and may only shrink. New high-risk debt requires an exception rather than a baseline expansion.

## Claim ladder

Use the narrowest true claim:

| Evidence | Permitted claim |
|---|---|
| Registry entry exists | Registered |
| Candidate capture passes deterministic checks | Deterministically captured |
| One audit variant passes | This state/breakpoint passes its audit |
| All required variants and blockers pass | This experience is Studio grade |
| Approved golden set and every critical/core experience passes | The reviewed customer-product, company-public, or founder-operator scope is Studio grade |

Inventory counts, merged code, green schema validation, and provisional golden references are never launch-readiness claims.
