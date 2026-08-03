# Venue Portal Phase A

Status: historical Phase A contract. Founder-approved on 25 July 2026.

The current customer-facing model is **Signal Studio Account**. See
[`docs/account/`](../account/README.md). The authenticated review route is now
`/hq/account-review`; `/hq/venue-portal-review` redirects there.

Phase B instrumentation may begin under the Account contract. No
sponsor-facing production route exists.

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
  workspaces, and percentage cohorts require at least five. The behavioural
  floor is two-sided: a count is withheld when it is too small and when it
  leaves too few workspaces outside it (R-027).
- Missing or partial telemetry is shown as missing or partial. It is never
  coerced to zero.
- Allotment changes remain operator-controlled in Signal HQ and write an audit
  event. A venue can request more, never grant itself more.
- Phase A creates documents and a deterministic review prototype only. The
  prototype also runs inside authenticated Signal HQ at
  `/hq/venue-portal-review`; this is founder review, not sponsor auth.

## Authenticated review surface

The Signal HQ review surface was expanded on 26 July 2026 so the product
contract can be tested as an actual account journey before any sponsor route
or production telemetry exists. Its deterministic fixture now covers:

- account standing, licence position, and the next useful action;
- 30-day, 90-day, and term reporting windows;
- complete, partial, and suppressed data states;
- aggregate meaningful use and product-level drill-down;
- masked access-code status and filtering;
- a controlled request-more-licences journey that cannot change allotment;
- frozen report preview and venue member, privacy, and support settings.

The surface passed the Studio contract suite, typecheck, production build,
targeted lint, and scripted desktop/mobile browser review with no console
errors or horizontal overflow. This is evidence about the review fixture, not
evidence that Phase B telemetry or Phase C sponsor authentication exists.

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

## Sign-off

The founder approved all six statements on 25 July 2026:

1. The portal proves use without showing private work.
2. The metric definitions match the commercial promise.
3. The suppression rules are acceptable for small pilots.
4. The retention windows are acceptable.
5. The permitted venue-facing claims are commercially useful and honest.
6. Signal HQ remains the only place that changes access or allotments.

The completed sign-off is tracked in
`content/hq/operator-todos/venue-portal-phase-a-signoff.md`.

Phase C production exposure remains stopped until tenant isolation,
sponsor-membership authentication, privacy/export parity, and one named venue
pilot are proven.

