# Signal Studio Account · Phase A contract (filed as "Venue Portal")

Status: current contract of record for roles, permissions, privacy, retention
and the required test inventory. Founder-approved on 25 July 2026. Corrected
against the ratified decision record on 2026-08-03.

**Naming, settled.** The **Signal Studio Account IS the Venue Portal**. One
surface, two names (**D-015 Q4**, 2026-08-02, which resolves D-006). E07's task
titles keep the words "Venue Portal"; the surface they describe is the Account.
Nothing here is a second product, and no session should treat them as two.

**Why this folder still exists.** `docs/account/` carries the current
customer-facing model. This folder is not superseded and must not be deleted or
relocated: it is still the only written source for roles and permissions,
privacy and retention, and the ~45-case test inventory. It is retitled in place.

**How corrections are marked.** Nothing in this programme is superseded
silently. Text that a ratified decision has overtaken is struck through and
carries `[SUPERSEDED <decision id> · <date>]` on the same line. The old wording
stays readable so the change is auditable.

**Launch scope, narrower than this document.** **D-027 point 4** (2026-08-03):
*"The Venue Portal at launch is invitation administration only. Aggregate
adoption evidence follows after 1 September. The consent layer stays unwired for
now."* This narrows D-001 point 5. Everything in this folder that describes
usage, adoption, retention or reporting remains the destination and is not
rewritten. It is **post-launch**. The launch surface is the invitation
administration described in the Access sections.

The authenticated review route is `/hq/account-review`;
`/hq/venue-portal-review` redirects there. No sponsor-facing production route
exists.

Signal Studio has two venue-facing responsibilities. They stay separate:

1. **Signal HQ Access** is the founder/operator control plane. It owns venue
   onboarding, payment state, ~~allotments~~ entitlement mode `[SUPERSEDED D-020
   · 2026-08-03]`, code minting, redemptions, reconciliation, revocation,
   support view-as, and the append-only audit history.
2. **The Account (the surface E07 calls the Venue Portal)** is a read-mostly
   client surface. At launch it administers invitations. After 1 September it
   also shows whether sponsored access was redeemed and meaningfully used
   (D-027 point 4). It never grants workspace membership and never exposes
   private work.

The Account is not a fifth Signal Studio product. It is an account surface for
Venue Edition customers. Signal Studio remains one app with four products:
Signal Notes, Signal Tasks, Signal Timeline, and Signal.

## Locked Phase A decisions

- `signal-entitlements` remains the only access authority.
- A sponsor relationship is commercial metadata, not workspace membership.
- Navigation is **Overview, Access, Usage, Reports, Account**. `[CORRECTED
  2026-08-03: this document previously said "Venue settings". The shipped
  surface implements "Account". `src/app/hq/account-review/account-review.tsx`
  tab set, and `docs/account/VOCABULARY.md` maps "Venue settings" to "Account".
  The document is made to match the running code.]`
- Venue-facing usage is based on committed, meaningful product actions.
  Page loads do not count.
- Notes, task, project, briefing, comment, attachment, collaborator, and
  private Timeline content are forbidden in every payload.
- Usage output is aggregate. There is no "biggest user" or person ranking.
- Small usage groups are suppressed. Commercial access counts remain visible;
  behavioural usage counts require at least three eligible sponsored
  workspaces, and percentage cohorts require at least five. `[Thresholds
  ratified as 3 and 5 in D-011 point 3, which cites this document as its
  source. Not editable here.]`
- Missing or partial telemetry is shown as missing or partial. It is never
  coerced to zero.
- ~~Allotment changes remain operator-controlled in Signal HQ and write an audit
  event. A venue can request more, never grant itself more.~~ `[SUPERSEDED D-020
  · 2026-08-03]` **Entitlement is unlimited for a venue with a current
  licence.** A venue may create a sponsored workspace for any couple with a
  signed booking. There is no number for the venue to request and none for an
  operator to raise. Entitlement **mode** changes remain operator-controlled in
  Signal HQ and write an audit event. See "Unlimited entitlement" in
  [PRODUCT_CONTRACT.md](./PRODUCT_CONTRACT.md).
- Phase A creates documents and a deterministic review prototype only. The
  prototype runs inside authenticated Signal HQ at `/hq/account-review`; this is
  founder review, not sponsor auth.

## Authenticated review surface

The Signal HQ review surface was expanded on 26 July 2026 so the product
contract can be tested as an actual account journey before any sponsor route
or production telemetry exists. Its deterministic fixture now covers:

- account standing, access position, and the next useful action;
- 30-day, 90-day, and term reporting windows;
- complete, partial, and suppressed data states;
- aggregate meaningful use and product-level drill-down;
- masked access-code status and filtering;
- ~~a controlled request-more-licences journey that cannot change allotment~~
  `[SUPERSEDED D-020 · 2026-08-03]` a request journey that cannot change
  entitlement, retained for support requests;
- frozen report preview and venue member, privacy, and support settings.

The surface passed the Studio contract suite, typecheck, production build,
targeted lint, and scripted desktop/mobile browser review with no console
errors or horizontal overflow. This is evidence about the review fixture, not
evidence that Phase B telemetry or Phase C sponsor authentication exists.

**Candidate evidence, not completion.** Under **D-015 Q2** the first pass over
E04 to E12 is an audit, not a build: existing implementation is candidate
evidence and is never founder-approved completion. Nothing in this section may
be read as a task being Done.

## Phase A artifacts

- [Product contract](./PRODUCT_CONTRACT.md)
- [Metric dictionary](./METRIC_DICTIONARY.md)
- [Roles and permissions](./ROLES_AND_PERMISSIONS.md)
- [Privacy, minimization, and retention](./PRIVACY_AND_RETENTION.md)
- [Venue-facing claims](./VENUE_FACING_CLAIMS.md)
- [Deterministic wireframes](./WIREFRAMES.md)
- [Implementation phases and test plan](./IMPLEMENTATION_AND_TEST_PLAN.md)
- [Architecture decision](../architecture/ADR-007-venue-portal-phase-a.md).
  **stale on naming and on status; see the note below**
- [Review prototype](./phase-a-wireframes.html)
- Current customer-facing model: [`docs/account/`](../account/README.md)

### ADR-007 is stale and is not this folder's to fix

`docs/architecture/ADR-007-venue-portal-phase-a.md` says the opposite of the
ratified naming: at line 32 it states "The portal is not a new product … It uses
the company name Signal Studio and the account label Venue Portal", which
D-015 Q4 replaces. It also still carries `Status: proposed for founder sign-off`
at line 3, although this README records the founder approving all six statements
on 25 July 2026, and its release gate at lines 98 to 103 blocks the phase the
programme is building now.

Superseding an ADR is a new ADR, not an edit. The correction is raised as a
boundary request for a superseding **ADR-009**, owned by architecture. Do not
patch ADR-007 in place.

## Sign-off

The founder approved all six statements on 25 July 2026:

1. The portal proves use without showing private work.
2. The metric definitions match the commercial promise. `[Partially overtaken:
   D-020 replaced the entitlement model the definitions were written against,
   and E09.02 (account-metrics.v2) reproposes the six adoption definitions. The
   metric dictionary in this folder is corrected below but its replacement is
   pending founder ratification in E07.04.]`
3. The suppression rules are acceptable for small pilots.
4. The retention windows are acceptable.
5. The permitted venue-facing claims are commercially useful and honest.
   `[Overtaken: E09.02 §8 replaces the allotment-era permitted sentences. See
   VENUE_FACING_CLAIMS.md.]`
6. Signal HQ remains the only place that changes access ~~or allotments~~
   `[SUPERSEDED D-020 · 2026-08-03]` or entitlement mode.

The completed sign-off is tracked in
`content/hq/operator-todos/venue-portal-phase-a-signoff.md`.

Phase C production exposure remains stopped until tenant isolation,
sponsor-membership authentication, privacy/export parity, and one named venue
pilot are proven.
