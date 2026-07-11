# Founder decisions required

Only product/company judgments are listed here. Engineering defaults are already made in the target architecture.

| Decision | Options | Technical consequences | Product/commercial consequences | Recommended default | Deadline/dependency |
|---|---|---|---|---|---|
| Packaging at launch | Suite-only; separate products; mixed | Determines entitlement and checkout presentation, not identity shape | Affects clarity and willingness to trial one product | Mixed: one account/workspace, suite entitlement by default, product-level entitlement capability retained | Before checkout/pricing launch |
| Billing unit | Workspace; user; hybrid | Controls subscription owner and entitlement resolver | Workspace aligns with collaborative work and venue/event offers | Workspace-level subscription with optional product overlays; avoid per-seat v1 | Before Stripe production enablement |
| Timeline visibility promise | Public-by-default only; optional private later | Changes tenant/privacy model and sharing controls | Current refusal is differentiating but limits some buyers | Keep public-by-default v1 refusal; revisit only with user evidence | Before broad Timeline marketing |
| Signal name comprehension | Keep Signal; qualify as Daily Signal; rename | Affects navigation and marketing, not core architecture | Risk of company/product confusion | Keep `Signal`, always nested visibly under Signal Studio; usability-test the label | Before final launch copy |
| Tasks local “Timeline” label | Keep; rename “Schedule”; other | UI-only unless semantics change | Can confuse local view with Signal Timeline | Test with non-technical users; default to “Schedule” if it is only a date view | Before shared switcher launch |
| Cross-product search/notifications | Central now; product-local; later | Central service/read model adds scope | May improve suite feel but can blur focused products | Defer; first prove links and context preservation | Post-launch |
| Retention and deletion policy | Minimal legal retention; longer audit retention; customer-selectable | Drives crypto-shred, backup, audit, and DSAR design | Trust/legal promise | Ratify GDPR lifecycle already proposed; publish plain-language policy | P0 before paid launch |
| Production launch cohort | Broad; invite-only; venue/wedding pilot | Determines operational load and acceptable P1 risk | Controls learning speed and trust exposure | Invite-only wedding/venue cohort after all P0 gates | After readiness sign-off |
