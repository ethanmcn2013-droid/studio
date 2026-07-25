# Venue Portal Phase A

Status: product and privacy contract ready for founder sign-off. No production
route exists.

Signal Studio has two venue-facing responsibilities. They stay separate:

1. **Signal HQ Access** is the founder/operator control plane. It owns venue
   onboarding, payment state, allotments, code minting, redemptions,
   reconciliation, revocation, support view-as, and the append-only audit
   history.
2. **Venue Portal** is a read-mostly client surface. It shows a venue whether
   sponsored access was issued, redeemed, and meaningfully used. It never
   grants workspace membership and never exposes private work.

The portal is not a fifth Signal Studio product. It is an account surface for
Venue Edition customers. Signal Studio remains one app with four products:
Signal Notes, Signal Tasks, Signal Timeline, and Signal.

## Locked Phase A decisions

- `signal-entitlements` remains the only access authority.
- A sponsor relationship is commercial metadata, not workspace membership.
- Portal navigation is Overview, Access, Usage, Reports, Venue settings.
- Venue-facing usage is based on committed, meaningful product actions.
  Page loads do not count.
- Notes, task, project, briefing, comment, attachment, collaborator, and
  private Timeline content are forbidden in every portal payload.
- Usage output is aggregate. There is no "biggest user" or person ranking.
- Small usage groups are suppressed. Commercial access counts remain visible;
  behavioural usage counts require at least three eligible sponsored
  workspaces, and percentage cohorts require at least five.
- Missing or partial telemetry is shown as missing or partial. It is never
  coerced to zero.
- Allotment changes remain operator-controlled in Signal HQ and write an audit
  event. A venue can request more, never grant itself more.
- Phase A creates documents and a deterministic review prototype only. It
  creates no public or authenticated production route.

## Phase A artifacts

- [Product contract](./PRODUCT_CONTRACT.md)
- [Metric dictionary](./METRIC_DICTIONARY.md)
- [Roles and permissions](./ROLES_AND_PERMISSIONS.md)
- [Privacy, minimization, and retention](./PRIVACY_AND_RETENTION.md)
- [Venue-facing claims](./VENUE_FACING_CLAIMS.md)
- [Deterministic wireframes](./WIREFRAMES.md)
- [Implementation phases and test plan](./IMPLEMENTATION_AND_TEST_PLAN.md)
- [Architecture decision](../architecture/ADR-007-venue-portal-phase-a.md)
- [Review prototype](./phase-a-wireframes.html)

## Sign-off gate

Phase B may begin only after the founder approves all six statements:

1. The portal proves use without showing private work.
2. The metric definitions match the commercial promise.
3. The suppression rules are acceptable for small pilots.
4. The retention windows are acceptable.
5. The permitted venue-facing claims are commercially useful and honest.
6. Signal HQ remains the only place that changes access or allotments.

The standing sign-off is tracked in
`content/hq/operator-todos/venue-portal-phase-a-signoff.md`.

