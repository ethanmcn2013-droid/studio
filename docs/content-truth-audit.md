# Content and commercial truth audit

**Audit date:** 2026-07-12
**Scope:** Signal Studio plus the four product worktrees at the commits below.
**Purpose:** separate current promises from superseded decisions, frozen examples, and unresolved commercial choices before Planning Period work reuses any of them.

| Deployable | Commit audited |
| --- | --- |
| Signal Studio | `2cdc05d8171221b6024bfb11116e2329c0bb3dd1` |
| Signal Tasks | `3111a6baf5852a4c9944f92639d9f8a1f33768ae` |
| Signal Timeline | `b595f6cad0ae40e8e7a0cca3abaf207aaf0adf4c` |
| Signal | `56890df1f7eaec9f0874f37a1d5856f012327686` |
| Signal Notes | `cab8c67ecb84913bea071b99ad1d4d8f3a822c7e` |

The audit searched tracked application source, marketing pages, HQ content, public/generated collateral, documentation, seeds, fixtures, and demos. Build output, dependency trees, lockfiles, and generated TypeScript build state were excluded. Changelogs and dated campaign drafts were searched, but are classified as historical evidence unless they are still rendered or presented as current.

## Classification and authority

- **Canonical/current** means supported by an active, dated founder decision and, where applicable, current enforcement code.
- **Current surface, unratified** means rendered today but not supported by a business decision that resolves conflicting values.
- **Historical/frozen** means useful evidence of an earlier state. It must be dated or marked superseded and must not feed current UI, checkout, onboarding, sales collateral, or demos.
- **Example** means illustrative data. It must carry a reference date or an explicit frozen-example label when time affects meaning.
- **Unresolved** means the repository contains no safe basis for choosing a value. This audit does not invent one.

Authority for this audit is, in order:

1. active dated decisions in `content/hq/decisions/`;
2. current typed commercial contracts and actual entitlement enforcement;
3. the currently rendered public surface, as evidence of what visitors are told, not automatic proof of ratification;
4. `docs/shipped-state.md` after a current re-verification;
5. dated plans, decks, changelogs, campaign drafts, and examples as historical evidence only.

`docs/shipped-state.md` declares itself the reality anchor, but its last verification is 2026-05-16 and its pricing and product-state tables contradict later active decisions. It cannot safely act as the current anchor until refreshed.

## Executive verdict

The repositories do not currently have one canonical commercial configuration. Venue Edition is the exception: price and couple-access duration are typed and enforced in `src/lib/venue-edition.ts`. Consumer pricing remains duplicated across Studio, Tasks, internal HQ material, public HTML collateral, and dated launch documents.

Safe facts already supported by active decisions are:

- Free is €0 and does not expire.
- Student is €9.99 per year, not free, and renews while the person remains a student.
- Pro is €12 per month. `workspace` remains the internal entitlement name.
- Event is €89 one-time and has a 12-month active window; current copy promises that content remains readable afterward.
- Venue Edition is €1,500 per venue per year, prepaid, with one price regardless of venue size or site count.
- Founding Venue Edition means the first fifteen venues lock €1,500 for as long as they stay.
- Each venue-sponsored couple receives 18 months of access.
- Public conversion is waitlist-first; broad external launch is not yet approved.

Unsafe or unresolved facts are:

- Pro annual prepay is rendered as €100 but ratified and billing-oriented records say €120.
- Pro and Student are described as both one paid workspace and unlimited workspaces.
- the Student flow advertises €9.99 but currently mints a free 365-day Workspace entitlement for any syntactically valid email;
- Committee Workspace is rendered at €49 per year but has no active decision or billing path;
- Event checkout and Tasks product copy still carry €79 in multiple live-capable locations;
- venue activation allowance is described as unlimited while the operator writer requires and enforces a numeric allotment, defaulting to ten;
- no school-seat limit or school sponsorship price exists;
- product status is variously Live, Private preview, Private build, and In development;
- 1 September 2026 is presented publicly as a fixed launch date even though the vision forbids fixed go-live dates and the latest launch review is no-go;
- one prominent Signal demo dateline has an incorrect weekday.

## Remediation applied after the audit snapshot

The audit remains the before-state evidence. The Planning Period branch has
since applied these safe corrections without inventing an owner decision:

- added typed contracts/commercial-terms.v1.json and matching fixtures in all
  four product repositories; verified prices are machine-readable and every
  unresolved field remains null or explicitly unresolved;
- made current Studio Pricing and Student pages consume the typed verified
  amounts;
- removed the unratified €100 Pro annual offer, one-paid-Workspace promises,
  Committee €49 offer, fixed Student launch date and unverified Student
  verification claims from current React surfaces;
- corrected wedding access copy to the typed 18-month Venue Edition value;
- replaced the venue concept that exposed couple names, dates, activity and
  On track status with an activation-only concept and an explicit private
  content boundary;
- added the teacher proposition with one class per Workspace, no pupil data,
  private Notes/Tasks and deliberate Class Timeline sharing;
- changed key Studio hero, waitlist, press and development banners from a
  clock-driven 1 September launch claim to private-preview/staged-access truth;
- refreshed docs/shipped-state.md with the four-state access vocabulary and
  current operator gates;
- marked the dated loan, market-entry, pitch and pricing-wireframe HTML as
  noindex historical snapshots with a visible current-truth banner, and made
  the retired static Student HTML canonical/redirect to /students;
- added scripts/check-content-truth.mjs to enforce canonical consumption,
  prevent the retired Event/annual literals on current pricing, protect venue
  privacy wording and catch weekday/date mismatch in the Signal hero.

Remaining cross-product code corrections and unresolved owner decisions stay
open in the rows below. Historical records are not bulk-rewritten.

## Commercial statements

### C-01. Free price, window, workspace, and editing-guest limit

| Field | Audit |
| --- | --- |
| Statement | `€0 forever`; one workspace; three editing guests beyond the owner. Link-only viewers are not editing guests. |
| Locations | Current: `src/app/pricing/page.tsx:55-64,151-180`; `docs/shipped-state.md:76`; `docs/ENTITLEMENTS_VALIDATION_2026_05_15.md:24-25`; `../tasks/src/server/db/membership.ts:9-19,89-113`; `../tasks/src/server/email.ts:80`; `../tasks/src/server/actions/settings.ts:257,403`; `../tasks/src/components/app/settings/sections/billing.tsx:36-44`; `../tasks/src/components/app/settings/sections/members.tsx:247-260`; `../timeline/src/server/actions/workspaces.ts:40,126-136`. The same current wording appears in Tasks audience pages and template essays under `../tasks/src/components/marketing/` and `../tasks/src/lib/template-essays/`. Historical US-dollar launch material appears under `../tasks/docs/posts-week-{2..8}.md`, `show-hn.md`, `syndication.md`, and `product-hunt-page.md`. |
| Agreement | **Yes for current Free behavior.** `FREE_WORKSPACE_MEMBER_CAP = 4` means owner plus three invited editors. Historical launch copy uses old tier names and currencies but repeats the same Free limit. |
| Authority | Current enforcement in Tasks plus the current Studio pricing surface. `docs/shipped-state.md` agrees on this row. |
| Action taken | Recorded as verified and eligible for typed centralisation. Historical US-dollar material remains historical and must never feed a live surface. |
| Owner input | None for the verified limit. Product copy should explicitly distinguish editing members from view-only share links. |

### C-02. Paid editing guests and guest entitlement shape

| Field | Audit |
| --- | --- |
| Statement | Student, Pro/Workspace, Event, Wedding, and Studio are presented as allowing unlimited invited people; Free allows three editing guests. Public Timeline viewing needs no account. |
| Locations | `src/app/pricing/page.tsx:66-109,151-180,203-207`; `../tasks/src/server/db/membership.ts:89-113`; `../tasks/src/components/app/settings/sections/billing.tsx:46-70`; `../timeline/docs/PRODUCT.md:8-16`; `../timeline/docs/COLLABORATION_LOOP.md:73-81`; `../notes/docs/COLLABORATION_LOOP.md:90-98`; `../signal/docs/COLLABORATION_LOOP.md:73-89`. Conflict: `../tasks/src/components/app/settings/sections/members.tsx:218` says “Free + Pro workspaces” have owner plus three editing guests. |
| Agreement | **No.** Enforcement treats internal `workspace` (public Pro), Event, Wedding, and Studio as unlimited, while one Tasks settings sentence puts Pro under the Free cap. Notes and Signal guest-safe views are documented intentions, not equivalent shipped guest entitlements. |
| Authority | `../tasks/src/server/db/membership.ts` for actual editing-member capacity; active `content/hq/decisions/unified-pricing.md` for the public Pro-to-`workspace` mapping. |
| Action taken | Recorded the Tasks settings sentence as incorrect current copy. Kept planned guest-summary statements separate from shipped access. |
| Owner input | Decide whether “unlimited guests” includes editing members, link-only viewers, or both. Use separate labels and DTOs; do not use one count for all three. |

### C-03. Student price, verification, duration, and billing behavior

| Field | Audit |
| --- | --- |
| Statement | Student is €9.99 per year, verified with a student/college email, renewed yearly while studying. |
| Locations | Current/ratified: `content/hq/decisions/unified-pricing.md:29`; `DESIGN.md:18`; `src/app/pricing/page.tsx:66-79,171-179`; `src/app/students/page.tsx:8-12,82-104`; `src/app/templates/page.tsx:122`; `src/lib/comparison-pages.ts:169`; `public/brand/students.html:7,298-304`; `public/brand/market-entry-deck-2026.html:2320-2326`; `public/brand/business-loan-pack-2026.html:2174,2199,2639,2672,2860-2861,2879`; `../tasks/src/app/students/page.tsx:8-19`; `../tasks/src/app/students/opengraph-image.tsx:63-77`; `../tasks/src/app/for/students/page.tsx:8-19`; `../tasks/src/components/marketing/for-students.tsx:9,57-60,202-213`; `../tasks/src/components/marketing/students-form.tsx:119-130,249-258`; `../tasks/src/components/marketing/templates-gallery.tsx:174`; `../tasks/src/server/actions/comp.ts:266-303`. Contradictions: `src/app/hq/socials/page.tsx:65` and `content/hq/operator-todos/collateral-ambassador-signoff.md:22` say €8.99; `docs/shipped-state.md:77`, `content/atlas/signal-studio-umbrella.md:74`, `.agents/product-marketing.md:30`, `docs/ios/listing.md:75`, and dated Tasks campaign/template files say free with `.edu` for two years; `public/brand/pitch-deck-2026.html:577` says verified `.edu`, two years. |
| Agreement | **No.** The active price is clear, but verification and charging are not. Current Tasks code accepts any syntactically valid email, calls it honour-system verification, and mints a single-use 365-day Workspace code without taking €9.99. No Student Stripe price exists in `../tasks/src/server/stripe.ts`. `public/brand/students.html:343-349` instead implies an institutional-domain allowlist. |
| Authority | Price: active `unified-pricing` decision. Verification intent: `DESIGN.md:18` and Tasks action comments say any student email, no `.edu`. Actual behavior: `requestStudentCodeAction`. |
| Action taken | Classified €8.99, free `.edu`, and two-year claims as stale. Recorded the no-charge grant path as a billing blocker rather than pretending the advertised price is enforced. |
| Owner input | Choose a real verification standard and fraud tolerance. Decide whether Student remains an honour-system paid checkout or an operator/pilot grant. No paid launch should open until €9.99 is charged or the public price is withdrawn. |

### C-04. Student and Pro workspace limits

| Field | Audit |
| --- | --- |
| Statement | Studio pricing says Student and Pro each include “one paid workspace.” Tasks says the same Workspace entitlement gives unlimited workspaces. |
| Locations | One paid workspace: `src/app/pricing/page.tsx:66-91,151-180`. Unlimited: `docs/shipped-state.md:78`; `docs/ENTITLEMENTS_VALIDATION_2026_05_15.md:27`; `../tasks/src/components/app/settings/sections/billing.tsx:46-57`; `../tasks/src/components/marketing/for-students.tsx:59-60`; `../tasks/src/components/marketing/students-form.tsx:249-250`; `../tasks/src/components/marketing/for-freelancers.tsx:184-218`; `../tasks/src/components/marketing/for-community.tsx:109-116`; `../tasks/src/components/marketing/for-small-business.tsx:126-132`; `../tasks/src/components/marketing/for-trades.tsx:159-166`; `../tasks/src/app/for/freelancers/page.tsx:8-19`; current template essays in `../tasks/src/lib/template-essays/`; `../tasks/src/server/stripe.ts:22-30`. |
| Agreement | **No.** This is a commercial limit, not a wording difference. |
| Authority | No active decision resolves the count. `unified-pricing` only establishes price/name mapping. Current enforcement behavior is split across products. |
| Action taken | Marked unresolved. No limit was inferred from either the newer marketing page or the older entitlement implementation. |
| Owner input | Ratify one of: one paid workspace per subscription, or unlimited owned workspaces. Then update entitlement scope, checkout metadata, Tasks/Timeline creation gates, and all audience copy together. |

### C-05. Pro monthly price and internal name

| Field | Audit |
| --- | --- |
| Statement | Public plan name is Pro at €12 per month. Internal entitlement and checkout key remains `workspace`. |
| Locations | `content/hq/decisions/unified-pricing.md:29`; `content/hq/decisions/pricing-pro-event-89-development-status.md:13-21`; `content/hq/launch-readiness/pricing.md:13`; `src/app/pricing/page.tsx:8,81-91,171`; `src/app/hq/one-pagers/brand/page.tsx:71`; `src/components/hq/hq-traction.tsx:104`; Tasks current marketing and template essays, notably `../tasks/src/app/for/freelancers/page.tsx:8-19`, `../tasks/src/components/marketing/for-freelancers.tsx:218`, and `../tasks/src/components/app/settings/sections/billing.tsx:46-57`. |
| Agreement | **Yes on €12/month.** “Workspace” remains visible in several product settings and older docs; that is an internal/public naming leak, not a different numeric price. |
| Authority | Active `unified-pricing` and `pricing-pro-event-89-development-status` decisions. |
| Action taken | Recorded as verified. Public content should say Pro; code may retain `workspace` until a safe entitlement migration. |
| Owner input | None on monthly price. Decide separately whether product settings intentionally expose “Workspace” as a legacy/grandfathered plan name. |

### C-06. Pro annual prepay

| Field | Audit |
| --- | --- |
| Statement | Current public pricing says €100/year. Ratified, checkout-oriented, and HQ records say €120/year. |
| Locations | €100: `src/app/pricing/page.tsx:8,86`; `../tasks/src/components/marketing/students-form.tsx:258`. €120: `content/hq/decisions/venue-editions-paid-tier.md:15,35`; `docs/MARKETING_PLAN_6MO.md:51,65,184`; `docs/shipped-state.md:78`; `content/atlas/pricing-and-entitlements.md:110`; `content/atlas/signal-studio-umbrella.md:74`; `src/components/hq/marketing-deck.tsx:200`; `../tasks/src/server/stripe.ts:51-60`; `../tasks/src/app/api/checkout/route.ts:19-23`; `../tasks/docs/gtm-plan.md:36`. |
| Agreement | **No.** The current rendered value conflicts with the only explicit ratification. The checkout implementation is also unsafe as truth: if the annual price ID is missing, `priceIdFor` silently falls through to the monthly price. |
| Authority | The 2026-05-16 ratification says €120, but the 2026-07 public page says €100 without a dated decision. Owner confirmation is required before changing a live or future billing path. |
| Action taken | Marked unresolved; no price was centralised. The silent annual-to-monthly fallback is recorded as a launch blocker. |
| Owner input | Ratify €100 or €120. Provision and verify the matching Stripe Price. Annual checkout must fail clearly when that Price is absent; it must not sell a monthly subscription from an annual CTA. |

### C-07. Event price

| Field | Audit |
| --- | --- |
| Statement | Current public Event price is €89 one-time. |
| Locations | €89/current: `content/hq/decisions/unified-pricing.md:29`; `content/hq/decisions/pricing-pro-event-89-development-status.md:13-21`; `content/hq/launch-readiness/pricing.md:13`; `src/app/pricing/page.tsx:8,96-109,171,201,347,930,958`; `src/app/hq/one-pagers/brand/page.tsx:71`; `src/components/hq/marketing-deck.tsx:158,201,232,326`; `src/lib/hq/marketing.ts:331,411,747`. €79/current-capable or public: `../tasks/src/components/app/settings/sections/billing.tsx:63-70`; `../tasks/src/components/settings/plan/plan-view.tsx:187-189`; `../tasks/src/components/marketing/for-community.tsx:116`; `../tasks/src/components/marketing/for-small-business.tsx:132`; `../tasks/src/components/marketing/for-trades.tsx:166`; `../tasks/src/lib/template-essays/wedding-3-month-countdown.ts:25`; `../tasks/src/lib/template-essays/wedding-day-of-run-of-show.ts:22`; `../tasks/src/server/roadmap/launch-readiness-seed.ts:164,172,295`; `../tasks/docs/STRIPE_SETUP.md:26`; `docs/shipped-state.md:79`; `docs/MARKETING_PLAN_6MO.md:14,51,64,119`; `docs/ONE_PAGER_SPEC.md:344`; `signal-growth/pricing-wireframe.html:522,617,623,680`; `public/brand/business-loan-pack-2026.html:2671`; `public/brand/pitch-deck-2026.html:570,789`; `content/vault/fc-valuation-formula.md:15`; `content/atlas/signal-studio-umbrella.md:74`; older dispatch/changelog material. Historical US-dollar Wedding $79 material is concentrated in `../tasks/docs/posts-week-{2..8}.md`, `syndication.md`, `show-hn.md`, `launch-day-*.md`, and `../tasks/src/app/social/reddit-ads-wedding/opengraph-image.tsx`. |
| Agreement | **No.** €89 is actively ratified. €79 remains in application copy, QA seeds, setup instructions, public collateral, and old campaign material. The Stripe amount itself cannot be verified from source because code stores only a Price ID. |
| Authority | Active `pricing-pro-event-89-development-status` and `unified-pricing` decisions. The former explicitly requires checkout verification before conversion opens. |
| Action taken | Classified €79 as superseded for current sales. Preserved dated campaign history as history, but identified every live-capable/public €79 location for removal or a historical banner. |
| Owner input | None on the public number. Operator must verify the production Stripe Price behind `STRIPE_PRICE_EVENT_ONETIME` is exactly €89 before checkout is enabled. |

### C-08. Event active window and post-window access

| Field | Audit |
| --- | --- |
| Statement | One event-shaped workspace is active for 12 months; afterward it remains readable and no longer has paid editing access. |
| Locations | `src/app/pricing/page.tsx:96-109,151-180,201,930`; `../tasks/src/components/app/settings/sections/billing.tsx:63-70`; `docs/ENTITLEMENTS_VALIDATION_2026_05_15.md:29,33`; `src/lib/entitlements-db/reads.ts:16`; `signal-growth/pricing-wireframe.html:617,680`; `public/brand/pitch-deck-2026.html:570`; `public/brand/business-loan-pack-2026.html:2671`. Conflicts: old Tasks campaign and data comments call Wedding/Event “lifetime,” including `../tasks/src/lib/data.ts:665,698` and `../tasks/docs/posts-week-{2..8}.md`. |
| Agreement | **Current surfaces agree on 12 active months plus read-only afterward.** Historical Wedding material used lifetime access and old tier naming. |
| Authority | Current Studio pricing plus entitlement validation/read behavior. |
| Action taken | Classified “lifetime” as historical. Recorded the need for an explicit read-only state in entitlement DTOs so “reads forever” is not accidentally implemented as perpetual editing. |
| Owner input | Confirm whether “forever” is a contractual promise or plain-language indefinite retention subject to the privacy/retention policy. Legal copy should not promise infinite storage if the policy does not. |

### C-09. Venue Edition price and venue term

| Field | Audit |
| --- | --- |
| Statement | €1,500 per venue per year, prepaid. One price for every venue; founding venues lock it for as long as they stay. The venue commercial term defaults to 12 months. |
| Locations | Canonical: `content/hq/decisions/venue-edition-fixed-price-2026-07-11.md:13-23`; `src/lib/venue-edition.ts:1-18`; `src/lib/venue-edition.test.ts`; `docs/LICENSING_ACCESS_DESIGN.md:3,45`; `docs/strategy/VENUE_EDITION_STRATEGY.md:21-49`; `src/app/venues/page.tsx:10,101,460-479`; `src/app/hq/entitlements/OnboardVenueForm.tsx:69-87`; `src/app/hq/entitlements/actions.ts:247-270`; `docs/MARKETING_PLAN_6MO.md:44-55`; `docs/shipped-state.md:80`; `content/atlas/pricing-and-entitlements.md:84`; current venue strategy, sales, fulfilment, outreach, and deck files under `docs/strategy/`, `signal-growth/outbound/venue-edition-*`, `public/brand/market-entry-deck-2026.html`, and `public/brand/business-loan-pack-2026.html`. Superseded: `content/hq/decisions/venue-editions-paid-tier.md:13-17` preserves the old €1,500–€4,000 band with a reversal notice; `signal-growth/outbound/venue-edition-outreach.md:8` names the older free-for-12-months then €49/month kit as retired; `docs/VENUE_EDITIONS_PLAN.md:9-31` banners its original free model as superseded. |
| Agreement | **Yes in current, explicitly amended material.** Old range/free-model text survives inside documents that carry a reversal or superseded banner. |
| Authority | Active fixed-price decision plus typed `src/lib/venue-edition.ts`. |
| Action taken | Recorded as verified. Historical cash amounts must remain exact; new paid/founding writes must use the typed €1,500 constant. |
| Owner input | None on price. Existing public/generated collateral should be re-rendered from the typed value where practical. |

### C-10. Venue-sponsored couple duration

| Field | Audit |
| --- | --- |
| Statement | 18 months from redemption, represented operationally as 548 days, then drop to Free. |
| Locations | `src/lib/venue-edition.ts:4-6`; `src/lib/venue-edition.test.ts:22-24`; `src/lib/entitlements-db/codes.ts:16,80-87`; `src/app/redeem/[code]/page.tsx:5,45`; `src/app/hq/entitlements/MintCodesForm.tsx:36`; `src/app/hq/entitlements/actions.ts:24,236`; `scripts/issue-codes.ts:7,79,106,125-127`; `scripts/migrate-venue-access-18-months.mjs`; `scripts/check-venue-edition-contract.mjs:142-143`; `docs/ENTITLEMENTS_OPS.md:128-172`; `docs/LICENSING_ACCESS_DESIGN.md:3,45`; `docs/VENUE_EDITIONS_PLAN.md:28,73`; `docs/strategy/VENUE_EDITION_STRATEGY.md:21,41,70,108-114`; `docs/strategy/VENUE_FULFILMENT_RUNBOOK.md:26`; `content/hq/decisions/venue-edition-fixed-price-2026-07-11.md:15`; `content/hq/decisions/venue-editions-mechanic.md:13-29`; `content/hq/campaigns/founding-venue.md:20`; `content/hq/pilots/founding-venue-pilot.md:15`. Superseded 12-month/365-day records: `content/hq/decisions/venue-editions-paid-tier.md:17`; `docs/CYCLE_8_1_ENTITLEMENTS_HANDOFF.md:55,135`; `docs/CYCLE_8_2_REDEEM_ROUTE_HANDOFF.md:15,33-35`; `signal-growth/outbound/lambs-hill-pilot-send.md:3,107`; `../tasks/src/components/app/settings/sections/billing.tsx:91-98`. |
| Agreement | **Current contract agrees; product copy still drifts.** The migration tooling explicitly treats old 365-day rows as data requiring review/migration. |
| Authority | Typed Venue Edition constants and the 2026-07-01/11 active decisions. |
| Action taken | Classified 12-month Venue Edition copy as stale. Existing issued rows must be verified through the reviewed migration workflow, not assumed migrated because source code now says 548. |
| Owner input | Confirm whether “18 months” remains a calendar-month promise or the current fixed 548-day operational approximation. They diverge around leap years and some month lengths. |

### C-11. Venue activation allowance

| Field | Audit |
| --- | --- |
| Statement | Strategy says every couple booked in the paid year can receive access, with no per-couple arithmetic or seat counting. Implementation requires a numeric allotment and blocks minting above it. |
| Locations | Unlimited/no seat counting: `docs/VENUE_EDITIONS_PLAN.md:51,67,219`; `content/hq/decisions/venue-editions-mechanic.md:29`; `docs/strategy/VENUE_EDITION_STRATEGY.md:21,41-44`; `public/brand/business-loan-pack-2026.html:2580,2665`; current venue copy `src/app/venues/page.tsx:460-487`. Numeric allotment: `src/app/hq/entitlements/OnboardVenueForm.tsx:37-63` defaults to 10; `src/lib/entitlements-db/schema.ts:145-152`; `src/lib/entitlements-db/venues.ts:81-119`; `src/lib/entitlements-db/codes.ts:102-117`; `docs/LICENSING_ACCESS_DESIGN.md:45`; `content/atlas/pricing-and-entitlements.md:84`; `content/hq/decisions/licensing-access-architecture.md:22`. Pilot batch of ten: `docs/CYCLE_8_5_HANDOFF.md:101,147`; `docs/CYCLE_8_5_LAMBS_HILL_RETRO.md:90`; `signal-growth/outbound/lambs-hill-pilot-send.md:3,60`. Forecast examples also say 50–150 couples (`venue-editions-paid-tier.md:21`) or about 80 (`business-loan-pack-2026.html:2580`). |
| Agreement | **No.** A batch size is not necessarily a commercial cap, but the database writer makes the entered allotment a hard cap. The default ten can therefore become a commercial limit accidentally. |
| Authority | Current strategy says unlimited couples. Current writer enforces allotment. No decision reconciles them. |
| Action taken | Marked unresolved and separated “batch size” from “annual allowance.” No numeric allowance was invented. |
| Owner input | Decide whether `codeAllotment` is an operational safety ceiling that can be raised without commercial meaning, or a contractual allowance. If access is commercially unlimited, rename it to an ops issuance ceiling and provide audited top-ups. |

### C-12. Founding Venue cohort size

| Field | Audit |
| --- | --- |
| Statement | The first fifteen venues lock €1,500 for as long as they stay. |
| Locations | `content/hq/decisions/venue-edition-fixed-price-2026-07-11.md:13-15`; `docs/strategy/VENUE_EDITION_STRATEGY.md:45-49`; `src/app/venues/page.tsx:466-479`; `src/lib/venues/wave-one.ts:448`; `docs/MARKETING_PLAN_6MO.md:50`; `docs/shipped-state.md:80`; `docs/strategy/VENUE_SETUP_RITUAL.md:49`; `docs/strategy/VENUE_FAQ_OBJECTIONS.md:29`; `docs/strategy/VENUE_EDITION_VIDEO_BRIEF.md:94,129,240`; `docs/strategy/VENUE_SALES_PACK.md:72`; `docs/brand-guide/handoff/DEMO_SCRIPT.md:133`; `signal-growth/outbound/venue-edition-outreach.md:5,34,113,165`; `signal-growth/outbound/venue-edition-A1-staged.md`; `signal-growth/assets/year-one-asset-library.md:34,81`; `src/components/hq/marketing-deck.tsx:199`; `content/atlas/signal-studio-umbrella.md:74`. Separate/ambiguous “twenty-five” program: `public/brand/market-entry-deck-2026.html:2490,2607,2623,3076,3672`; `src/app/design/page.tsx:1286`; `src/app/hq/partner-card/page.tsx:82`. |
| Agreement | **Fifteen is consistent for Venue Edition.** Twenty-five is described as a broader Limerick founding-partner program, but venue-oriented partner-card copy makes the programs easy to confuse. |
| Authority | Active fixed-price decision for Venue Edition. |
| Action taken | Kept the cohorts distinct in this audit. Marked “Founding Partner 1 of 25” assets as ambiguous rather than changing the Venue Edition limit. |
| Owner input | Name the 25-member program distinctly or retire the venue-shaped card. A venue must never be promised both “first fifteen” and “one of twenty-five.” |

### C-13. Committee Workspace

| Field | Audit |
| --- | --- |
| Statement | Committee Workspace is presented as €49 per year for one society with unlimited members, nested inside Student Edition. |
| Locations | `src/app/students/page.tsx:128-170`; `public/brand/students.html:323-347`; `public/brand/business-loan-pack-2026.html:2672,2711,2860`; `public/brand/market-entry-deck-2026.html:2320,2739-2740`; `src/app/hq/socials/page.tsx:65` and `content/hq/operator-todos/collateral-ambassador-signoff.md:22` mention the nested workspace while carrying the wrong €8.99 Student price. |
| Agreement | **The rendered/public materials agree on €49 where a number appears, but no active HQ decision, entitlement tier, Stripe Price, or checkout path authorises it.** It is absent from the four-tier active `unified-pricing` decision. |
| Authority | None sufficient. Current page is evidence of a promise, not proof of ratification. |
| Action taken | Marked current-surface, unratified. No billing or entitlement behavior was inferred. |
| Owner input | Ratify or remove €49. Define whether it is an add-on to one Student account, who owns the society workspace after officers graduate, and whether “unlimited members” means editors or viewers. |

### C-14. Review access, compliments, and pilots

| Field | Audit |
| --- | --- |
| Statement | Review access is 90 days. Founder-issued compliments may be perpetual. Commercial Venue Edition is paid, including the founding pilot; `pilot` remains a no-cash operator plan for explicitly approved cases. None is a public free trial. |
| Locations | `docs/VENUE_EDITIONS_PLAN.md:39-49,64-73,186`; `src/app/redeem/[code]/page.tsx:63,322`; `docs/shipped-state.md:91-99`; `docs/strategy/VENUE_EDITION_STRATEGY.md:61-80`; `src/lib/venue-edition.ts:8-18`; `src/app/hq/entitlements/OnboardVenueForm.tsx:6-11,72-87`; `content/hq/pilots/founding-venue-pilot.md`; `signal-growth/outbound/lambs-hill-pilot-send.md:3`. Internal organisational UI says “Trial, 90 days by default” at `src/features/org/org-intel.ts:235`. |
| Agreement | **Mostly.** Explicitly named grant programs are distinct, but “pilot,” “review,” and “trial” are still used as near-synonyms in internal surfaces. The Lamb's Hill free-pilot packet is correctly blocked/superseded. |
| Authority | Active Venue Edition decisions and the current entitlement source types. |
| Action taken | Classified the blocked Lamb's Hill packet as historical. Recorded that no public page should call Free or paid founding access a trial. |
| Owner input | Ratify the allowed no-cash `pilot` cases and maximum duration. Every pilot grant needs a named sponsor, reason, start/end, and revocation state; never hardcode a free account. |

### C-15. School seats and school sponsorship

| Field | Audit |
| --- | --- |
| Statement | No school-specific seat limit, school sponsor price, teacher plan, or classroom entitlement exists in the audited repositories. |
| Locations | No numeric school-seat statement was found in current pricing, entitlement enums, Stripe mappings, sponsor writers, or product marketing. Generic limits exist only for Free (`../tasks/src/server/db/membership.ts`) and current Student/Committee copy. School/teacher mentions in Tasks and Notes are examples, not a commercial contract. |
| Agreement | **Not applicable; the value is absent.** |
| Authority | None. The Planning Period brief requires pilot entitlements to use the current entitlement system, not a newly invented price or hardcoded free account. |
| Action taken | Recorded as unresolved and prohibited any school-seat claim until ratified. |
| Owner input | Define pilot cohort size and duration only if needed to operate the controlled design-partner pilot. Do not define a public school price or permanent seat limit as part of architecture work without a separate owner decision. |

### C-16. Venue privacy promise

| Field | Audit |
| --- | --- |
| Statement | Venue sponsorship does not grant access to couple content; a venue may see only activation state and explicitly consented metadata. |
| Locations | Privacy promise: `docs/strategy/VENUE_EDITION_STRATEGY.md:71,112-114`; `docs/CYCLE_2_INVITE_AND_FIRST_VIEW.md:31-36`; current assignment architecture. Contradictory public concept: `src/app/venues/page.tsx:340-430` says “See every couple’s plan from one place,” lists named couples, wedding dates, and statuses such as On track/Needs attention. Earlier mock status also appears at `src/app/venues/page.tsx:201,219`. |
| Agreement | **No. High-risk public contradiction.** Calling the panel a concept does not cure the promise or the privacy implication. |
| Authority | The explicit privacy strategy and least-privilege architecture. |
| Action taken | Recorded the coordinator concept as unsafe current copy. It must not be used as a requirements source for Planning Periods. |
| Owner input | None needed to preserve privacy. Any future venue console requires a separately consented metadata allowlist; content-derived status such as “On track” is out unless the couple explicitly shares a safe projection. |

## Product, launch, and programme status

### S-01. Product status labels

| Field | Audit |
| --- | --- |
| Statement | Current public pricing labels all four products “In development.” Current public access is controlled private preview. Deployments may be reachable without making the suite generally available. |
| Locations | In development: active `content/hq/decisions/pricing-pro-event-89-development-status.md:13-21`; `src/app/pricing/page.tsx:111-143,888`; copied non-production banners in `src/components/dev-banner.tsx:15,47` and each product `../{tasks,timeline,signal,notes}/src/components/dev-banner.tsx`. Private preview/build: `docs/VISION.md:38-42`; `docs/SUITE.md:15-19`; `content/hq/products/{tasks,roadmap,notes}.md`; `src/components/reveal/reveal-products.tsx:114-154`; `src/app/work/page.tsx:16-63`; product waitlist pages; `../timeline/docs/PRODUCT.md:16`; `../notes/docs/PRODUCT.md:175`. Live claims: `docs/shipped-state.md:20-32`; `BRAND.md:13`; `public/brand/pitch-deck-2026.html:617-632`; `public/brand/market-entry-deck-2026.html:1520,3668`; `public/brand/business-loan-pack-2026.html:2174,2199,2233,2878`. Latest readiness verdict: `docs/signal-studio-review/00-executive-decision.md:4-8` and `06-launch-readiness.md:5` say no-go for broad external launch. |
| Agreement | **No.** “Deployed/reachable,” “private preview,” “in development,” and “generally available” are being collapsed into one Live/not-live label. `docs/shipped-state.md` is stale and conflicts with the later active pricing decision and July launch review. |
| Authority | Latest July architecture/launch review for launch readiness; active pricing-status decision for the pricing page; product evidence for individual capability claims. |
| Action taken | Classified public “four products live today” deck claims as unsupported for broad availability. Kept deployment proof separate from access state. |
| Owner input | Ratify a four-state vocabulary: deployed, private preview, staged access, general availability. Refresh `docs/shipped-state.md` with a current verification date and per-capability evidence. |

### S-02. Waitlist and staged access

| Field | Audit |
| --- | --- |
| Statement | Public conversion routes through the waitlist until access deliberately opens; issued codes and authenticated navigation may still reach products. |
| Locations | `content/hq/decisions/waitlist-first-public-access.md`; `src/app/pricing/page.tsx:46-52`; `src/app/waitlist/page.tsx:6-11,30-52`; `src/app/waitlist/waitlist-line.tsx:43`; product waitlist pages at `../{tasks,timeline,signal,notes}/src/app/waitlist/page.tsx`; current Studio public CTAs. |
| Agreement | **Yes in current conversion surfaces.** Older `public/brand/students.html` still links directly to Tasks sign-up and therefore bypasses the current waitlist contract. |
| Authority | Active waitlist-first decision. |
| Action taken | Recorded the static Student HTML direct sign-up as stale. |
| Owner input | None. All public/generated artifacts must route through the same staged-access contract until the decision changes. |

### S-03. 1 September 2026 launch date and countdown

| Field | Audit |
| --- | --- |
| Statement | 1 September 2026 is variously presented as a hard public launch, a small-batch opening date, an expected launch, an iOS launch, and an internal asset deadline. |
| Locations | Public/runtime: `src/components/reveal/reveal-hero.tsx:22-53`; `src/app/waitlist/page.tsx:6-11`; `src/app/waitlist/waitlist-line.tsx:43`; `src/app/students/page.tsx:56`; `src/app/press/page.tsx:76,95`; `src/app/design/page.tsx:1364`; `src/app/pricing/page.tsx:46-49`; copied product DevBanners; `public/brand/students.html:292`; `public/brand/press/index.html:32`; `public/brand/pitch-deck-2026.html:649,709,807,840`; `public/brand/market-entry-deck-2026.html:1384,2490,2874,3242,3254,3424,3548,3566,3699`; `public/brand/business-loan-pack-2026.html:2174,2209,2486-2489,2687-2692,2750,2859`; internal `src/lib/hq/launch.ts:16-17`; `src/lib/hq/company.ts:185`; `src/lib/hq/asset-command.ts:11,34,53,580`; launch/operator/legal/vault files listed by the date search. Conflict: `docs/VISION.md:79` says no fixed go-live dates. `src/lib/hq/asset-command.ts:580` already records the unresolved question and assumes internal-only. |
| Agreement | **No.** The same date has at least five meanings. The HQ countdown also sets `launched: true` once the date arrives even if launch gates remain pending (`src/lib/hq/launch.ts:45-100`). |
| Authority | No active decision authorises 1 September as an unconditional broad public launch. The waitlist-first decision authorises staged access, not general availability. The latest July launch review remains no-go. |
| Action taken | Marked all unconditional public-launch statements unresolved. Recorded the countdown’s date-only `launched` inference as unsafe. |
| Owner input | Decide whether 1 September is: internal readiness target, first small-batch date, paid checkout target, iOS target, or broad launch. If gates can block it, UI must say target and derive launch state from an operator-controlled status, not the clock. |

### S-04. Trial and pilot wording

| Field | Audit |
| --- | --- |
| Statement | Free is not a trial. Venue founding access is a paid pilot, not a free trial. Review access is explicitly time-bounded. School design-partner access will be an entitlement-backed pilot. |
| Locations | `src/app/pricing/page.tsx:183-196`; `docs/VENUE_EDITIONS_PLAN.md:45-52`; `docs/strategy/VENUE_EDITION_STRATEGY.md:61-80`; `content/hq/pilots/founding-venue-pilot.md`; `signal-growth/outbound/lambs-hill-pilot-send.md:3`; `src/features/org/org-intel.ts:235`; historical free-pilot language inside amended venue documents. |
| Agreement | **Mostly, once historical records are respected.** Unqualified “trial” in generic internal UI remains ambiguous. |
| Authority | Active entitlement/program decisions. |
| Action taken | Defined the distinctions here. No hardcoded school-free wording exists and none should be added. |
| Owner input | Ratify a pilot grant policy: named programme, source, sponsor, start, end, renewal, revocation, and permitted metadata. |

## Demo, seed, fixture, date, and countdown truth

### D-01. Signal homepage dateline

| Field | Audit |
| --- | --- |
| Statement | `FRIDAY · 4 JULY 2026`. |
| Locations | `../signal/src/components/landing/the-brief-hero.tsx:322`; related relative copy at `:149-151,364,433`. |
| Agreement | **Incorrect.** 4 July 2026 is Saturday, not Friday. |
| Authority | Gregorian calendar; verified with the platform date library during this audit. |
| Action taken | Recorded as a confirmed defect. No replacement date was invented in this documentation-only pass. |
| Owner input | None. Either change the weekday to Saturday, choose a real Friday, or define a fixed demo reference date and generate the label from it. |

### D-02. Timeline product and wedding demo dates

| Field | Audit |
| --- | --- |
| Statement | Timeline demo work is presented through fixed May 2026 dates and open statuses; the wedding seed spans January-September 2026. |
| Locations | `../timeline/src/lib/roadmap/demo-data.ts:3,46-186,317-361`; `../timeline/scripts/seed-demo.ts:53-126`; `../timeline/scripts/seed-wedding.ts:57-211`; public demo routing under `../timeline/src/app/[workspaceSlug]/`; state calculation in `../timeline/src/lib/roadmap/current-state.ts`; tests use fixed `NOW` only in `current-state.test.ts`. |
| Agreement | **Dates agree between mirrored seed/source files, but the presentation is not time-safe.** The source has no documented reference date for the public demo. Open May 2026 items are now expired and can render as current/aiming rather than clearly historical. `currentState` chooses the first non-shipped dated milestone without rejecting a past milestone. |
| Authority | None for “today.” These are examples and must be frozen/labeled or regenerated. |
| Action taken | Classified as frozen examples that currently lack a frozen label. Recorded the expired-milestone risk. |
| Owner input | Choose one approach: documented fixed reference date for the entire demo, or deterministic generation from a supplied `now`. Do not mix fixed dates with the viewer’s real clock. |

### D-03. Tasks GTM roadmap countdown

| Field | Audit |
| --- | --- |
| Statement | Public/runtime roadmap code still frames Show HN (2026-06-16), Product Hunt (2026-06-23), and Indie Hackers (2026-06-24) as upcoming launch beats and computes day counts from the real current date. |
| Locations | `../tasks/src/app/roadmap/roadmap-view.tsx:166-168,180-207,377-378,526-567,834-853`; `../tasks/src/server/roadmap/launch-readiness-seed.ts:109-127`; parser ranges at `../tasks/src/server/roadmap/parser.ts:371,397-411`; dated campaign documents under `../tasks/docs/`. |
| Agreement | **Weekdays are correct** (16 and 23 June 2026 were Tuesdays; 24 June was Wednesday), but the countdown is expired and still lives in an application route. |
| Authority | Historical GTM plan only. `docs/VISION.md:79` says Show HN was dropped and is no longer scope. |
| Action taken | Classified the roadmap as historical/frozen and recorded that an expired countdown must not appear current. |
| Owner input | None. Archive or label the route with its fixed 2026-05-11 to 2026-07-05 reference window. |

### D-04. Wedding collateral calendar

| Field | Audit |
| --- | --- |
| Statement | Aoife & Dan marry Saturday 17 October 2026, with tasks on Wednesday 14, Thursday 15, Friday 16, and Monday 19 October. |
| Locations | `public/brand/collateral/venue/wedding-seed.md:1,11,23-30`. |
| Agreement | **Correct.** The weekday/date combinations checked during this audit match the calendar. |
| Authority | Fixed collateral reference date. |
| Action taken | Classified as a valid frozen example. |
| Owner input | None. Add automated validation so later edits cannot create a mismatch. |

### D-05. Relative demo language without a clock

| Field | Audit |
| --- | --- |
| Statement | Notes, Tasks, and Signal demos use “today,” “tomorrow,” named weekdays, “due in 9 days,” and “four weeks to go” without one shared documented reference date. |
| Locations | `../notes/src/server/demo/notes-demo.ts:41-65,87,104-114`; `../notes/scripts/seed-demo-notes.mjs:41-57`; `../tasks/src/server/demo/tasks-demo.ts:51-93`; `../signal/src/app/wedding-planning/page.tsx:8,16-17,33-43,79-104`; `../signal/src/components/landing/the-brief-hero.tsx:149-151,322-433`. |
| Agreement | **Internally plausible but not verifiable over time.** The copy reads as current whenever rendered, even when it is a frozen scene. |
| Authority | None until a reference date is declared. |
| Action taken | Classified as examples and recorded the missing reference-date contract. |
| Owner input | None on dates themselves. Product owners should choose a fixed reference date per named demo and render a visible “Example”/date label, or generate every relative phrase from a supplied clock. |

### D-06. Date validation coverage

| Field | Audit |
| --- | --- |
| Statement | Date/weekday consistency should be automatically validated. |
| Locations | No suite-wide validator was found. Existing date tests are domain-specific, such as `../timeline/src/lib/roadmap/current-state.test.ts` and Tasks natural-language date parsing; they do not scan content/demo literals. |
| Agreement | **Missing.** The incorrect Signal dateline proves the gap. |
| Authority | Planning Period acceptance requirement. |
| Action taken | Recorded required validation scope: ISO dates, English weekday/date phrases, frozen reference dates, and expired open milestones. |
| Owner input | None. Validation should fail CI for mismatched weekday/date pairs and unlabelled fixed-date demos on current public surfaces. |

## Public and generated artifact disposition

| Artifact | Current classification | Findings and required disposition |
| --- | --- | --- |
| `public/brand/business-loan-pack-2026.html` | Public, dated commercial artifact | Venue €1,500 and Student €9.99 are current. Event €79 is stale. Committee €49 is unratified. “Four products live today” and a hard 1 September launch conflict with current staged-access truth. Re-render after owner decisions; do not hand out as current before sign-off. |
| `public/brand/market-entry-deck-2026.html` | Public, dated strategy artifact | Venue price and Student base price are current. Committee €49 is unratified. Twenty-five Limerick partners must not be confused with the fifteen Venue Edition founders. Hard launch claims need a target/status label. |
| `public/brand/pitch-deck-2026.html` | Public, dated business-plan artifact | Carries old Event €79, free `.edu` Student for two years, and unconditional Live/September claims. Freeze with an “as of” banner or regenerate; it is not current commercial truth. |
| `public/brand/students.html` | Public static page | Student €9.99 and Committee €49 match the React Student page, but the direct Tasks sign-up bypasses waitlist-first access; institutional-domain verification conflicts with Tasks’ any-email action. Replace with the canonical route or generate it from shared values. |
| `signal-growth/pricing-wireframe.html` | Historical wireframe | Carries €79 Event and old Student/Workspace assumptions. Mark historical; never publish or use as a copy source. |
| `docs/shipped-state.md` | Intended reality anchor, stale | Last verified 2026-05-16. Refresh status, prices, limits, and caveats only from fresh evidence. Until then, active decisions and July launch review outrank it. |
| `../tasks/docs/posts-week-{2..8}.md` and related launch documents | Historical campaign drafts | Preserve as dated history. Old dollar prices, lifetime Wedding language, launch dates, and placeholder performance claims must not feed current marketing or demos. |
| Product changelogs and Studio `content/dispatch/` | Historical release record | Preserve dated facts. Do not bulk-rewrite old prices; add a supersession note only where a historical file is likely to be used operationally. |

## Owner decisions required

The following decisions must be made before consumer checkout or new sponsored programmes open:

1. Pro annual price: €100 or €120.
2. Pro/Workspace entitlement scope: one paid workspace or unlimited owned workspaces.
3. Student verification and payment: what proves student status, and how €9.99 is actually charged.
4. Committee Workspace: ratify or remove €49; define ownership, renewal, and member scope.
5. “Unlimited guests”: define editors, authenticated guests, and link-only viewers separately.
6. Event “reads forever”: confirm the legal/retention meaning of forever.
7. Venue activation allowance: unlimited commercial access with an operational issuance ceiling, or a real contractual cap.
8. Venue 18 months: calendar-month semantics or fixed 548-day semantics.
9. No-cash pilot policy: allowed programmes, duration, sponsor, approval, and renewal.
10. 1 September 2026: internal target, staged opening, paid launch, iOS target, or broad launch.
11. Product-state vocabulary and evidence owner for deployed/private preview/staged/general availability.

No owner decision is required to preserve venue privacy: sponsorship must not imply content access.

## Required centralisation after decisions

This audit intentionally does not choose unresolved values. Once ratified, straightforward centralisation should produce:

- one typed Studio consumer-pricing contract for Free, Student, Pro, Event, and any ratified Committee add-on;
- the existing typed Venue Edition contract retained as the source for €1,500 and 18-month access;
- explicit fields for public name, internal entitlement key, price/cadence, workspace count, editor count, viewer semantics, active window, and post-window state;
- a versioned JSON consumer fixture for sibling deployables, with drift tests like the existing suite-contract checks;
- checkout verification tests that assert the Stripe Price amount/currency/cadence before access opens;
- no annual checkout fallback to a different billing cadence;
- a typed launch/access-status contract separate from date countdowns;
- a demo manifest with `kind: "frozen" | "relative"`, reference date, timezone, and expiry policy;
- a CI content check for contradictory commercial literals, weekday/date mismatch, and expired open demo milestones.

## Search coverage record

The audit used case-insensitive searches across all five roots for:

- currency symbols and amounts, `EUR`, monthly/annual/one-time/billing/price/tier;
- one/single/unlimited workspace, editing guests, members, seats, allotments, activations, codes, cohort/founding counts;
- 12/18/24 months, 90/365/548/730 days, lifetime, forever, drop to Free;
- school, teacher, class, student, module, semester, society, committee;
- Live, In development, Private preview, Private build, waitlist, launch, trial, pilot, founding;
- 1 September variants, ISO dates, weekday names, countdown/T-minus/day-remaining phrases;
- demo, seed, fixture, example, mock, frozen, and reference-date language.

This file is the audit record, not a substitute for correcting current code and public artifacts. Every unresolved value remains blocked until a named owner decision exists.
