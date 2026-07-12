# Shipped state — the reality anchor

This file is the source for current public product, access and commercial claims. A reachable deployment is not the same as general availability. A merged implementation is not the same as a provider-verified production journey.

## State vocabulary

- Deployed: the production URL responds.
- Private preview: authenticated or code-based access exists, but the complete user journey is not certified for broad use.
- Staged access: selected people receive access in controlled batches.
- Generally available: broad conversion, billing, support and recovery gates have passed.

Never shorten deployed or private preview to Live when the claim could imply general availability.

**Last verified:** 2026-07-12.

Evidence used in this verification:

- remote-main source and clean isolated installs for all five deployables;
- type checks, existing core tests, design-system checks and production builds;
- current public pages at signalstudio.ie plus reachable product surfaces;
- July suite architecture review and operator-gate records;
- docs/content-truth-audit.md.

Authenticated provider journeys, production checkout amounts, restore recency and all operator gates were not re-certified. Broad external launch remains no-go.

## Current suite state

| Product | Production URL | Deployment | Access claim that is safe now |
| --- | --- | --- | --- |
| Signal Studio | signalstudio.ie | Deployed | Public marketing and waitlist. Private preview with staged access. |
| Signal Tasks | tasks.signalstudio.ie | Deployed | Task product exists and is used in preview. Do not claim broad availability or certified checkout. |
| Signal Timeline | timeline.signalstudio.ie | Deployed | Legacy public examples exist. Do not describe legacy slug pages as private Class or Couple Timelines. |
| Signal Notes | notes.signalstudio.ie | Deployed | Private capture and the Notes-to-Tasks extract path exist in code. Authenticated production journey remains an operator gate. |
| Signal | signal.signalstudio.ie | Deployed | Briefing product exists in preview. Do not claim Planning Period Signal until its rollout evidence is complete. |

Public conversion is waitlist-first. There is no authorized broad launch date. Dates used as internal targets do not become launch state automatically.

## Capability boundaries

### Tasks

- Tasks is the current runtime authority for Workspace and Membership.
- Existing multi-workspace and active-workspace behavior exists.
- Planning Periods, contextual onboarding and lifecycle work are under a feature-gated implementation branch until migration and production proof complete.
- Tier and checkout source exists, but production Price amounts and complete purchase journeys require operator verification.

### Timeline

- Legacy public-by-slug pages are a separate historical publication model.
- New Class, Module and Couple Timeline claims require the frozen safe projection, hashed share lifecycle, strict DTO and immediate revocation evidence.
- Do not claim that a private Task or Note is shared merely because a Timeline page hides fields in the UI.

### Notes

- Notes are private working material.
- Notes-to-Tasks sends a user-selected extract, not the raw private Note automatically.
- Workspace association must degrade to unfiled capture if the Tasks catalog resolver is unavailable.

### Signal

- Signal must say why each surfaced item appears.
- Planning Period scope is capped at three total, not three per category.
- Removed Workspace Members must not retain derived access.

## Verified commercial facts

The machine-readable current contract is contracts/commercial-terms.v1.json. Only verified values below may be used as current numbers.

| Offer | Verified fact | Important unresolved point |
| --- | --- | --- |
| Free | €0; does not expire; one Workspace; three editing guests beyond the owner. | Editing guests and link-only audience viewers must remain separate concepts. |
| Student | €9.99 per year is the ratified public price. | Verification, payment implementation and Workspace limit are not ratified. Joining the waitlist does not activate or charge an account. |
| Pro | €12 per month; internal entitlement key remains workspace. | Annual price is unresolved between €100 and €120. Workspace and editor limits are unresolved. Do not open annual checkout. |
| Event | €89 one-time; 12-month active window. | The legal/retention meaning of read afterward must be confirmed before purchase. |
| Venue Edition | €1,500 per venue per year, prepaid; first fifteen founding venues retain that price; each sponsored couple receives 18 months, operationally represented as 548 days. | Activation allowance and calendar-month versus fixed-day semantics remain unresolved. |

Committee Workspace at €49 is not an authorized offer. No school price or seat limit exists. Do not invent either for the design-partner pilot.

## Sponsorship and privacy

A school or venue entitlement does not create Workspace Membership or private-content access.

A sponsor may administer invitation, entitlement and activation state plus a sponsor-local reference. Workspace label, primary date or ceremony information needs a separate versioned field-level consent receipt. Notes, Tasks, private Timeline material, comments, attachments and collaborators are never sponsor-visible through the sponsor relation.

A venue activation register may group sponsor-owned activation references. It must not claim to show every couple’s plan, infer On track, or expose names/dates by default.

## Programmes

- Venue Edition: paid annual patronage. The venue sponsors access; the couple owns the private Workspace.
- Review access: a named, time-bounded operator grant.
- Compliments: founder-issued access only; not the venue model.
- School design-partner pilot: entitlement-backed, time-bounded and feature-gated. No public price, permanent free account or school content access is implied.

## Planning Period release state

The Planning Period contract and implementation work do not become shipped by appearing in a branch. Public claims require:

1. additive migration and realistic backfill proof;
2. current Membership authorization tests;
3. production provider identity verification;
4. public DTO leak tests and immediate share revocation;
5. keyboard, accessibility, mobile and reduced-motion proof;
6. legal/privacy review for the school pilot;
7. deployment and post-deploy smoke receipts.

Until those receipts exist, describe Planning Periods and Audience Timeline as staged pilot work, not generally available functionality.
