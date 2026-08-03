# Signal Studio Account (the surface E07 calls the Venue Portal)

Status: Account Brief selected. Full Venue Edition review system plus
Education/Organisation proofs, plus HQ live Venue access preview.
Not a sponsor production route. Corrected against the ratified decision record
on 2026-08-03.

**Naming, settled.** The **Signal Studio Account IS the Venue Portal**
(**D-015 Q4**, 2026-08-02, which resolves D-006). One surface, two names. E07's
task titles keep the words "Venue Portal"; the surface they describe is this
one. No task is renamed and no session should treat these as two products.

Signal Studio Account is the customer-facing account family for commercial
editions:

- Venue Edition
- Education Edition
- Organisation Edition

**Launch scope (D-027 point 4, ratified 2026-08-03).** *"The Venue Portal at
launch is invitation administration only. Aggregate adoption evidence follows
after 1 September. The consent layer stays unwired for now."* This narrows D-001
point 5. The five questions below stay written because they are the
destination. Only the first two are inside the 1 September launch.

It answers five questions without exposing private work:

1. Is our Signal Studio access in good standing? **[launch]**
2. ~~How much access have we distributed?~~ `[REPHRASED D-020 · 2026-08-03.
   there is no quantity of access to distribute.]` Which couples have we
   invited, and what happened to each invitation? **[launch]**
3. Are recipients reaching meaningful use? **[post-launch]**
4. Is that use continuing? **[post-launch]**
5. What evidence can we take into a renewal, governance, or internal review?
   **[post-launch]**

The governing principle:

> Prove the benefit without exposing the work.

## Relationship to Venue Portal Phase A

`docs/venue-portal/` is **not superseded and must not be deleted or relocated**.
It is still the only written source for roles and permissions, privacy and
retention, and the roughly 45-case test inventory. It carries the founder
sign-off evidence of 25 July 2026. It has been retitled in place so that it is
unambiguous that it specifies this surface.

Signal Studio Account is the current customer-facing model. It preserves those
protections and expands the product family language, navigation, and review
architecture.

**ADR-007 is stale.** `docs/architecture/ADR-007-venue-portal-phase-a.md` says
the opposite of the ratified naming and still carries `Status: proposed for
founder sign-off` although the Phase A README records the founder approving all
six statements on 25 July 2026. Superseding an ADR is a new ADR, not an edit.
This is raised as a boundary request for a superseding ADR-009, owned by
architecture. Do not patch ADR-007 in place.

**Audit, not build (D-015 Q2).** The first pass over E04 to E12 converts
existing work into evidence against written acceptance criteria before anything
new is built. Existing implementation is candidate evidence. It is never
founder-approved completion, and nothing on this surface is Done until the
founder says so.

## Control plane

Signal HQ Access remains the only control plane for codes, payments,
~~allotments~~ entitlement mode `[SUPERSEDED D-020 · 2026-08-03]`, redemptions,
entitlements, revocation, and audited support.

This review environment must not introduce sponsor authentication, live
telemetry, production sponsor routes, entitlement mutations, real emails,
scheduled deliveries, or access to private customer work.

## Authenticated review

Founder review lives at `/hq/account-review`.

`/hq/venue-portal-review` redirects to the Account review so existing links
remain valid.

## Delivery sequence

1. **Account V2 contract**. Complete.
2. **Three design concepts**. Complete; founder selected **Account Brief**.
3. **Selected Venue Edition system**. Complete; Overview, Access, Usage, Reports, Account.
4. **Cross-edition proofs**. Complete; Education and Organisation vocabulary proofs.
5. **HQ live Venue access preview**. Complete (see [LIVE_HQ_PREVIEW.md](./LIVE_HQ_PREVIEW.md)).
6. **Phase B instrumentation**. Planned (see [PHASE_B_INSTRUMENTATION_PLAN.md](./PHASE_B_INSTRUMENTATION_PLAN.md)); not built. Account Usage carries no production telemetry until it is.

Sample PDF/CSV assets live in `private/account-samples/` and are served only
from the authenticated `/hq/account-review/download` route. Live access CSV/HTML
exports use the same route with `source=live`.

## Artifacts

- [Product contract](./PRODUCT_CONTRACT.md)
- [Vocabulary](./VOCABULARY.md)
- [Concept selection](./CONCEPT_SELECTION.md)
- [HQ live preview](./LIVE_HQ_PREVIEW.md)
- [Phase B instrumentation plan](./PHASE_B_INSTRUMENTATION_PLAN.md)
- [Quality lift 9.5](./QUALITY_LIFT_9_5.md)
- Phase A contract, still current for roles, privacy, retention and the test
  inventory: [../venue-portal/README.md](../venue-portal/README.md)
