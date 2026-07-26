# Signal Studio Account

Status: Account Brief selected. Full Venue Edition review system plus
Education/Organisation proofs, plus HQ live Venue access preview.
Not a sponsor production route.

Signal Studio Account is the customer-facing account family for commercial
editions:

- Venue Edition
- Education Edition
- Organisation Edition

It answers five questions without exposing private work:

1. Is our Signal Studio access in good standing?
2. How much access have we distributed?
3. Are recipients reaching meaningful use?
4. Is that use continuing?
5. What evidence can we take into a renewal, governance, or internal review?

The governing principle:

> Prove the benefit without exposing the work.

## Relationship to Venue Portal Phase A

`docs/venue-portal/` remains the historical Phase A contract and founder
sign-off evidence. That work established the privacy boundary, metric honesty
rules, and the separation from Signal HQ Access.

Signal Studio Account is the current customer-facing model. It preserves those
protections and expands the product family language, navigation, and review
architecture.

## Control plane

Signal HQ Access remains the only control plane for codes, payments,
allotments, redemptions, entitlements, revocation, and audited support.

This review environment must not introduce sponsor authentication, live
telemetry, production sponsor routes, entitlement mutations, real emails,
scheduled deliveries, or access to private customer work.

## Authenticated review

Founder review lives at `/hq/account-review`.

`/hq/venue-portal-review` redirects to the Account review so existing links
remain valid.

## Delivery sequence

1. **Account V2 contract** — complete.
2. **Three design concepts** — complete; founder selected **Account Brief**.
3. **Selected Venue Edition system** — Overview, Access, Usage, Reports, Account.
4. **Cross-edition proofs** — Education and Organisation vocabulary proofs.
5. **HQ live Venue access preview** — complete (see [LIVE_HQ_PREVIEW.md](./LIVE_HQ_PREVIEW.md)).
6. **Phase B instrumentation** — planned (see [PHASE_B_INSTRUMENTATION_PLAN.md](./PHASE_B_INSTRUMENTATION_PLAN.md)); not executed in this branch.

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
- Historical Phase A: [../venue-portal/README.md](../venue-portal/README.md)
