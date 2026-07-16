# Commercial truth · source-of-truth audit for the email design system

This document is the gate in front of the code-owned email design system and the three film briefs. It records what the business currently says is true, where each claim lives, where sources disagree, and what the email system may safely assume while each disagreement stands. Every quoted source was re-read at audit time. Nothing here is a decision; decisions this audit surfaces live in `docs/email-system/decisions-required.md`.

**Audited:** 2026-07-16. HQ reads from source files; this document follows the same rule. It points at the sources and does not replace them. When a source changes, this audit is stale, not the other way around.

## Where the cited files live

Cited files sit in several checkouts. Paths below are relative to the named checkout root.

| Checkout | Local path | Branch at audit time |
| --- | --- | --- |
| worktree (this repo) | `_wt-email-system/` | `feat/email-design-system`, cut from `origin/main`; every worktree file cited below is on `origin/main` unless noted |
| studio | `studio/` | `feat/experience-quality-os` |
| access-build | `access-build/` | `feat/access-system` (not merged to main) |
| motion-hq worktree | `_wt-motion-hq/` | `feat/motion-production-hq` |
| tasks | `tasks/` | `feat/tasks-hero-lab` |
| analytics (the Signal product repo) | `analytics/` | `main` |
| notes | `notes/` | `feat/notes-hero-lab` |
| collateral | `collateral/` | `main` |
| ds-foundation | `ds-foundation/` | `fix/package-name-canon` |

Two repo-level anchors matter for everything below and were both verified on `origin/main`:

- `contracts/commercial-terms.v1.json` (worktree): the typed, machine-readable commercial contract. Verified prices carry a `status` field; unresolved values are `null` and listed in an explicit `unresolved` array.
- `docs/shipped-state.md` (worktree): the reality anchor, last verified 2026-07-12, with a four-state access vocabulary (Deployed · Private preview · Staged access · Generally available).
- `docs/content-truth-audit.md` (worktree): the 2026-07-12 content and commercial truth audit that produced both files above. This email-system audit builds on it and re-verified its load-bearing rows.

---

## 1 · Pricing

### 1.1 Venue Edition price

| Field | Value |
| --- | --- |
| Topic | Venue Edition price and founding lock |
| Current apparent truth | €1,500 per venue, per year, prepaid. One price for every venue; size and site count do not create tiers. The first ~15 founding venues lock €1,500 for as long as they stay. The couple never sees a price. |
| Supporting source | `content/hq/decisions/venue-edition-fixed-price-2026-07-11.md` (studio and worktree); `contracts/commercial-terms.v1.json` (`venue.annualAmountCents: 150000`, `foundingCohortSize: 15`); `docs/MARKETING_PLAN_6MO.md` §1 (amended 2026-07-11); `docs/VENUE_EDITIONS_PLAN.md`; `src/app/venues/page.tsx` ("€1,500 per venue, per year · prepaid") |
| Conflicting source | `docs/strategy/BUSINESS_PARTNER_REVIEW_2026_05.md` (thesis: a venue will pay €1,500 to €4,000 a year). **Resolved:** the 2026-07-11 amendment retires the band explicitly, stating that the prior band of €1.5k to €4k is retired. Recorded as a resolved contradiction, not a live one. |
| Date/version | Decision dated 2026-07-11, status Active, review 2026-10-11 |
| Confidence | High |
| Implementation assumption | Venue emails state €1,500 a year, prepaid, one price. Lock wording follows the decision file: founding venues lock the price "for as long as they stay". Do not write "for life"; that phrasing appears in summaries, not in the canonical decision. Do not state an activation allowance or per-couple count; the contract marks `activationAllowance: null` and calendar-month semantics unresolved. |
| Founder decision required | No (price). The open allowance and calendar-semantics points are already on the operator ledger (`content/hq/operator-todos/licensing-policy-ratification.md`). |

### 1.2 Sponsored couples: duration and drop-down

| Field | Value |
| --- | --- |
| Topic | What a venue-sponsored couple receives |
| Current apparent truth | 18 months of full-suite access (operationally 548 days), redeemed by code, at the wedding package. At month 18 the account drops to Free with one quiet prompt beforehand. |
| Supporting source | `contracts/commercial-terms.v1.json` (`coupleAccessMonths: 18`, `operationalAccessDays: 548`); `content/hq/decisions/venue-edition-fixed-price-2026-07-11.md` ("Each sponsored couple receives 18 months of access, as confirmed by the founder on 2026-07-01"); `docs/VENUE_EDITIONS_PLAN.md` ("18 months from redemption, auto-drop to Free at month 18 with one quiet prompt beforehand"); `docs/shipped-state.md` §Verified commercial facts; wedding tier exists in `tasks/src/server/stripe.ts` (`STRIPE_PRICE_WEDDING_ONETIME`) and in `docs/LICENSING_ACCESS_DESIGN.md` (wedding listed as a non-purchasable tier, granted not bought) |
| Conflicting source | None on duration. Contract status is `verified_price_duration_allowance_unresolved`: calendar-month versus fixed-548-day semantics are unresolved. |
| Date/version | Founder confirmation 2026-07-01, decision 2026-07-11 |
| Confidence | High (duration), medium (exact end-date semantics) |
| Implementation assumption | Sponsored-couple emails say "eighteen months". They never compute or promise a specific end date. The quiet pre-drop prompt is a legitimate, already-decided email moment and belongs in the transactional set. |
| Founder decision required | No (covered by `licensing-policy-ratification`). |

### 1.3 Student

| Field | Value |
| --- | --- |
| Topic | Student price and verification |
| Current apparent truth | €9.99 per year, ratified public price, mapping to the internal `workspace` tier. Verification method, payment implementation, and workspace limit are not ratified. Annual, renews while the person remains a student. |
| Supporting source | `contracts/commercial-terms.v1.json` (`student.amountCents: 999`, status `price_verified_payment_unverified`); `src/app/pricing/page.tsx` (Student card, cadence "/ year · verification confirmed before access"); `docs/shipped-state.md` ("€9.99 per year is the ratified public price... Verification, payment implementation and Workspace limit are not ratified"); `docs/LICENSING_ACCESS_DESIGN.md` (`Student EUR9.99/yr -> workspace`; "Student is a mapping (`workspace` + `student_edu`), NOT a new tier"), implementation on access-build |
| Conflicting source | `docs/content-truth-audit.md` C-03 records that the pre-remediation Student flow minted a free 365-day entitlement for any syntactically valid email; the current React surfaces no longer claim a verification method. |
| Date/version | Contract v1; shipped-state verified 2026-07-12 |
| Confidence | High (price), low (verification method: none exists) |
| Implementation assumption | Student emails may state €9.99 a year. They never describe how verification works, never say "verified student email" as if it were a shipped mechanism, and never imply paid student access is open today. |
| Founder decision required | Yes: verification method (`content/hq/operator-todos/licensing-policy-ratification.md`, step 3). |

### 1.4 Pro

| Field | Value |
| --- | --- |
| Topic | Pro monthly and annual price |
| Current apparent truth | €12 per month, verified. Internal entitlement key remains `workspace`. The annual price is formally unresolved between €100 and €120; annual checkout is closed and the pricing page says "Annual Pro terms are not open while they are being confirmed." |
| Supporting source | `contracts/commercial-terms.v1.json` (`pro.monthlyAmountCents: 1200`, `annualAmountCents: null`, `annualCandidatesCents: [10000, 12000]`, status `monthly_verified_annual_unresolved`); `docs/shipped-state.md` ("Annual price is unresolved between €100 and €120... Do not open annual checkout"); `src/app/pricing/page.tsx` (reads only verified amounts via `requireVerifiedAmount`) |
| Conflicting source | Live, two-sided: €120 side: `docs/MARKETING_PLAN_6MO.md` ("Workspace annual prepay €120/yr... RATIFIED 2026-05-16") and `tasks/src/server/stripe.ts` (comment: "€120/yr, ratified 2026-05-16"). €100 side: `docs/LICENSING_ACCESS_DESIGN.md` (`Pro EUR100/yr` in `STRIPE_PRICE_MAP`, on main and access-build) and the pre-remediation pricing page (€100 rendered; removed 2026-07-12 per `docs/content-truth-audit.md`). |
| Date/version | Contract v1; contradiction first recorded 2026-07-12 |
| Confidence | High (monthly), low (annual) |
| Implementation assumption | Email fixtures display "€12 a month" only. No fixture, template, or film frame asserts an annual Pro figure until the founder resolves €100 versus €120. |
| Founder decision required | Yes. See decisions doc, item 1. |

### 1.5 Event

| Field | Value |
| --- | --- |
| Topic | Event one-time price |
| Current apparent truth | On Studio main: €89 one-time, 12-month active window, price status verified, retention wording pending. Shipped to /pricing via PR #26 ("studio · pricing: Pro, €89 Event, development status"). |
| Supporting source | `contracts/commercial-terms.v1.json` (`event.amountCents: 8900`, `activeWindowMonths: 12`, status `verified_price_retention_wording_pending`); `docs/shipped-state.md` ("€89 one-time; 12-month active window"); `src/app/pricing/page.tsx` (renders the contract amount); branch `codex/pricing-pro-event-89-dev` exists locally and on origin, evidence of the in-flight move to 89 |
| Conflicting source | Live, cross-repo: `docs/MARKETING_PLAN_6MO.md` ("Event €79 one-time held as-is (do not touch...)" and €79 throughout §2 scenarios); Tasks live surfaces still render €79 (`tasks/src/components/settings/plan/plan-view.tsx`: "€79 · one-time" for both event and wedding; `tasks/src/components/marketing/for-community.tsx`: "Event is €79 once"). `docs/content-truth-audit.md` flags "Event checkout and Tasks product copy still carry €79 in multiple live-capable locations." |
| Date/version | Contract v1; PR #26 pre-dates 2026-07-12 verification |
| Confidence | Medium for €89 as the intended current price; the marketing plan and the sibling product disagree in public-visible places |
| Implementation assumption | Email fixtures do not assert the Event price at all until the founder ratifies one number and the €79 remnants are purged or the contract is reverted. |
| Founder decision required | Yes. See decisions doc, item 2. |

### 1.6 Free

| Field | Value |
| --- | --- |
| Topic | Free tier shape |
| Current apparent truth | €0, does not expire. One workspace, all four products, three editing guests beyond the owner. Editing guests and link-only viewers are separate concepts. |
| Supporting source | `contracts/commercial-terms.v1.json` (`free`: 0, `workspaceLimit: 1`, `editingGuestLimit: 3`, status verified); `src/app/pricing/page.tsx` ("One workspace. All four products. Three editing guests. No card needed."); `docs/shipped-state.md`; enforcement in Tasks per `docs/content-truth-audit.md` C-01 (`FREE_WORKSPACE_MEMBER_CAP = 4`, owner plus three) |
| Conflicting source | None current. C-02 of the content-truth audit records one incorrect Tasks settings sentence about Pro guest caps; it does not affect Free. |
| Date/version | Contract v1; verified 2026-07-12 |
| Confidence | High |
| Implementation assumption | Free is safe to state in full: €0, one workspace, three editing guests, all four products. |
| Founder decision required | No. |

---

## 2 · Product names and availability

### 2.1 Names and wordmarks

| Field | Value |
| --- | --- |
| Topic | Canonical product names |
| Current apparent truth | Products: Signal Tasks, Signal Timeline, Signal, Signal Notes; umbrella: Signal Studio. Wordmark forms are lowercase: `tasks·`, `timeline·`, `signal·`, `notes.`, and `signal studio.` with the indigo dot. Never "Signal" alone in body copy (collides with Signal Messenger). |
| Supporting source | `BRAND.md` §4 (worktree, lines 146 to 164); `AGENTS.md` (worktree) |
| Conflicting source | `analytics/.env.example` still names the sender "Signal Analytics", a retired product name; the code default is correct (see §5.1). |
| Date/version | BRAND.md current on main |
| Confidence | High |
| Implementation assumption | Email prose uses full product names. Wordmark lockups in email headers follow the BRAND.md grammar. No email is ever signed "Signal" bare in body copy. |
| Founder decision required | No. |

### 2.2 Availability state

| Field | Value |
| --- | --- |
| Topic | What the suite may claim about being live |
| Current apparent truth | All five surfaces are Deployed (signalstudio.ie plus four product subdomains). Access is private preview with staged batches; nothing is Generally available; broad external launch is no-go. The /pricing page deliberately labels all four products "In development", and its FAQ says "The suite is in development." This is the post-remediation intent, not stale copy. |
| Supporting source | `docs/shipped-state.md` (last verified 2026-07-12: suite table, "Never shorten deployed or private preview to Live", "Broad external launch remains no-go"); `src/app/pricing/page.tsx` (`statusLabel: "In development"` on all four products); `docs/content-truth-audit.md` (remediation list: development banners moved from launch-clock claims to private-preview truth) |
| Conflicting source | The earlier audit finding "all four products are live/shipped and the pricing 'in build' labels are stale" is superseded. The old shipped-state ship dates (Notes 2026-05-14, Signal 2026-05-13) are no longer present in the current file and could not be re-verified as current claims; treat them as historical evidence only. |
| Date/version | shipped-state verified 2026-07-12 |
| Confidence | High |
| Implementation assumption | No email claims general availability, "live", or a launch date. Emails describe the suite as in development with access opening in small batches. Film may show all four shipped surfaces but must not present staged features (Planning Periods, Audience Timeline) as available. |
| Founder decision required | No. |

### 2.3 Waitlist gate

| Field | Value |
| --- | --- |
| Topic | Public access path |
| Current apparent truth | Every public CTA routes to /waitlist. Current copy: "Access opens in small batches when each product and privacy gate is ready." Submissions write to the database only; no confirmation email is sent. |
| Supporting source | `src/app/waitlist/page.tsx` (metadata description); `src/lib/waitlist.ts` (DB insert/upsert, no send call anywhere in the module or its callers) |
| Conflicting source | The earlier wording "Access opens in small batches from 1 September." is gone from the page; 1 September 2026 survives only as an internal target (`src/lib/hq/launch.ts`, `src/lib/hq/asset-command.ts`). Superseded, not live. |
| Date/version | Current main; waitlist shipped via PR #27 (2026-07-08), copy revised in the 2026-07-12 remediation |
| Confidence | High |
| Implementation assumption | Email templates never promise an access date. A waitlist confirmation email does not exist today; building one is new scope and a listed decision. |
| Founder decision required | Yes for adding a confirmation email. See decisions doc, item 9. |

---

## 3 · Segments

### 3.1 Segment sequencing (the standing constraint)

| Field | Value |
| --- | --- |
| Topic | Which audiences may receive outbound |
| Current apparent truth | Binding sequencing: venues only now; contractors second, only if venues prove. Teachers and students are "audience truth in BRAND.md §2.1 only. No outbound, no demos, no pilots, no dedicated paid push, no segment landing page built on population grounds." Teachers fail four of six lenses. The under-18 data regime (FERPA plus GDPR Art. 8) is one "a solo founder must not carry". Compliance fence: before any school or classroom surface ships, age-fence the entitlement source to adults, zero pupil PII. |
| Supporting source | `content/hq/decisions/segment-sequencing-2026-05.md` (worktree and studio; status Active, review 2026-08-16) |
| Conflicting source | See 3.3. |
| Date/version | 2026-05-16, Active, reviewDate 2026-08-16 |
| Confidence | High |
| Implementation assumption | The email system ships no sendable school or student outreach. See 3.3 for the resolution shape. |
| Founder decision required | Yes if any school or student sending is wanted before the review date. |

### 3.2 Student segment records

| Field | Value |
| --- | --- |
| Topic | Student audience truth |
| Current apparent truth | Segment `students`: confidence 62, status Explore, "Useful feedback channel, less likely to be the first revenue engine." Core message: "Group projects without the group chat mess." Campaign `student-projects`: status Queued, progress 5, current blocker "Weddings wedge comes first." |
| Supporting source | `content/hq/segments/students.md`; `content/hq/campaigns/student-projects.md` (both worktree and studio) |
| Conflicting source | None. |
| Date/version | Campaign window 2026-06-01 to 2026-08-31, still Queued |
| Confidence | High |
| Implementation assumption | If student templates are prototyped, "Group projects without the group chat mess" is the approved core message. Nothing sends while the campaign is Queued behind the weddings wedge. |
| Founder decision required | No for the message; yes for any send (3.1). |

### 3.3 The live contradiction: school and student asks versus the sequencing decision

| Field | Value |
| --- | --- |
| Topic | Founder brief versus standing decision |
| Current apparent truth | The founder's email-system brief (2026-07, delivered in-session; no repo file exists for it) asks for school pilot emails, school outreach emails, a school film brief, and student onboarding emails. The Active sequencing decision forbids outbound, demos, pilots, and dedicated paid pushes for exactly these segments. The tension is already visible on main: `/teachers` and `/students` pages exist (`src/app/teachers/page.tsx` routes to the waitlist with `campaign=school_design_partner`), and `docs/shipped-state.md` describes a "School design-partner pilot: entitlement-backed, time-bounded and feature-gated. No public price, permanent free account or school content access is implied." No school price or seat limit exists and must not be invented. |
| Supporting source | `content/hq/decisions/segment-sequencing-2026-05.md`; `src/app/teachers/page.tsx`; `docs/shipped-state.md` §Programmes; `docs/content-truth-audit.md` (teacher proposition added in remediation) |
| Conflicting source | The two sides above are the conflict. |
| Date/version | Sequencing 2026-05-16 (review 2026-08-16); teacher surface merged to main by 2026-07-12 |
| Confidence | High that both sides say what they say |
| Implementation assumption | Recommended resolution, pending founder ratification: build the school and student assets as decision-ready prototypes inside the email system, clearly flagged `provisional: blocked by segment-sequencing-2026-05`, and ship nothing to those segments until the founder explicitly reverses or amends the sequencing decision at or before its 2026-08-16 review. Every school and student template, fixture, and film brief carries the provisional flag in code and in copy review. |
| Founder decision required | Yes. See decisions doc, item 5. |

---

## 4 · Entitlements and billing systems

### 4.1 Access system

| Field | Value |
| --- | --- |
| Topic | Entitlements backend and console |
| Current apparent truth | Entitlements schema, license codes, sponsors, batch grants, hash-chained event ledger, and the /hq/entitlements console are built on branch `feat/access-system` (checkout `access-build/`), not merged to main. Founder gates before go-live: production DB migration (0001/0002 with backfill and cash-parity gate) and the merge itself. Stripe billing is Phase 4, gated on `register-ltd-ireland`. |
| Supporting source | `docs/LICENSING_ACCESS_DESIGN.md` (the design doc is on main; the implementation is only on `feat/access-system`); `access-build/docs/LICENSING_ACCESS_DESIGN.md` (same file, verified in the branch checkout); operator todos `register-ltd-ireland.md`, `licensing-policy-ratification.md`, `stripe-tax-eu-vat.md` |
| Conflicting source | None. |
| Date/version | Design and build 2026-07-09 per project records |
| Confidence | High |
| Implementation assumption | Email templates reference no entitlement mechanics that only exist on the branch (batch grants, ledger, console). Redemption-code emails may exist because Tasks already sends codes today (see 5.1), but new lifecycle emails tied to the shared entitlements DB stay in the prototype tier until merge. |
| Founder decision required | No new decision; the two gates are already recorded. |

### 4.2 Stripe today

| Field | Value |
| --- | --- |
| Topic | Payment emails |
| Current apparent truth | Tasks has live Stripe checkout and webhook code for the workspace, studio, wedding, and event tiers. Annual price IDs are sparse: only workspace has an annual env slot. Stripe sends its own receipts; no Signal-owned receipt email exists. Production price amounts and complete purchase journeys still require operator verification. |
| Supporting source | `tasks/src/server/stripe.ts` (PRICE_IDS map; comment "Annual prices are sparse, only Workspace has one today (€120/yr, ratified 2026-05-16...)"); `docs/shipped-state.md` ("Tier and checkout source exists, but production Price amounts and complete purchase journeys require operator verification") |
| Conflicting source | The stripe.ts €120 comment is one side of the Pro-annual contradiction (1.4). |
| Date/version | tasks checkout at audit time (branch `feat/tasks-hero-lab`; file matches the main-line implementation the content-truth audit cites) |
| Confidence | High |
| Implementation assumption | The email system does not build receipt or invoice emails yet. Stripe's native receipts remain the transactional payment surface until the founder asks otherwise. |
| Founder decision required | No. |

---

## 5 · Email infrastructure today

### 5.1 Who sends what

| Field | Value |
| --- | --- |
| Topic | Current senders |
| Current apparent truth | Resend is the delivery provider suite-wide. Signal (repo `analytics/`) sends briefing emails: React Email components (`@react-email/components`, `@react-email/render`), Vercel cron `0 6 * * *` UTC at `/api/cron/briefings`, unsubscribe compliance headers (`List-Unsubscribe`, `List-Unsubscribe-Post: List-Unsubscribe=One-Click`, `List-Id`, asserted in tests), code-default sender `Signal <hello@signalstudio.ie>`. Tasks sends raw-HTML template-string emails, default sender `Signal Tasks <hello@signalstudio.ie>`: workspace invites (`src/server/actions/settings.ts`), share links (`src/server/actions/share.ts`), comp and student codes (`src/server/actions/comp.ts`, `studentCodeEmailHtml`), daily digests (`src/app/api/cron/digest/route.ts`). Notes inbound capture (`capture-<slug>@notes.signalstudio.ie`) is documented but not wired; the endpoint 401s until the Resend inbound route is configured. Clerk sends all auth emails natively (verification, reset, magic link). The Studio repo sends nothing: no Resend dependency; Resend appears only as a disclosure on the privacy and security pages. |
| Supporting source | `analytics/src/lib/email/dispatch.ts`; `analytics/CONTRIBUTING.md` (headers, cron); `analytics/package.json`; `tasks/src/server/email.ts`; `notes/docs/INBOUND_EMAIL_SETUP.md`; worktree `package.json` (no resend); `src/app/privacy/page.tsx` ("Outbound mail (briefing emails and operator notifications) is sent through Resend", "Signing in ... creates an account through Clerk") |
| Conflicting source | `analytics/.env.example` line 32 shows `RESEND_FROM=Signal Analytics <hello@signalstudio.ie>`, a retired display name. The production env value cannot be verified from the repo; the code default is `Signal <hello@signalstudio.ie>`. |
| Date/version | Current checkouts at audit time |
| Confidence | High for code paths; medium for what production env vars actually hold; medium for Clerk (inferred from Clerk usage and privacy copy; no custom auth-email code exists anywhere, which supports it) |
| Implementation assumption | The email design system standardizes what already exists: Resend as provider, one address, per-product display names. It replaces Tasks raw HTML and Signal's React Email with one code-owned system. Auth emails stay with Clerk and are out of scope. Notes inbound capture is an operator activation, not email-system scope. |
| Founder decision required | Only where sender architecture changes (5.3). |

### 5.2 Deliverability

| Field | Value |
| --- | --- |
| Topic | Domain authentication |
| Current apparent truth | SPF, DMARC, and MX are live on signalstudio.ie (verified 2026-05-09). DKIM is the one missing record. Without DKIM, mail from hello@ is SPF-only signed and Outlook and corporate filters may flag it; venue outreach risks the spam folder. |
| Supporting source | `docs/DKIM_SETUP.md` ("SPF + DMARC + MX are already live... DKIM is the one record missing"); `docs/OPERATOR_ACTIONS_2026_05_16.md` §2b |
| Conflicting source | The prior finding "already on the operator ledger" did not verify: no file in `content/hq/operator-todos/` covers DKIM. It lives only in the two docs above, which predate the ledger rule. This is a ledger gap, noted for whoever executes. |
| Date/version | 2026-05-09 verification; unchanged since |
| Confidence | High |
| Implementation assumption | The email system may build and preview outreach templates, but no outreach sending is turned on before DKIM passes. Product transactional email already ships without DKIM and continues unchanged. |
| Founder decision required | Yes: DKIM is a founder-only Google Workspace action. See decisions doc, item 4. |

### 5.3 Sender addresses

| Field | Value |
| --- | --- |
| Topic | Canonical address |
| Current apparent truth | One canonical address: `hello@signalstudio.ie`. "Not `contact@`, not `support@`, not `team@`." All current senders already comply, varying only the display name. |
| Supporting source | `BRAND.md` §4 Email (worktree); production senders in 5.1 |
| Conflicting source | None live. Any proposed multi-address architecture (for example separate transactional and outreach addresses or subdomain sending) contradicts BRAND.md as written. |
| Date/version | BRAND.md current on main |
| Confidence | High |
| Implementation assumption | All fixtures send from `hello@signalstudio.ie` with per-product display names, matching production. Multi-address designs stay on paper until the founder rules. |
| Founder decision required | Yes if the email system proposes more addresses. See decisions doc, item 3. |

---

## 6 · Privacy

### 6.1 Privacy page claims

| Field | Value |
| --- | --- |
| Topic | Claims email copy may restate |
| Current apparent truth | Minimal collection. "No third-party advertising trackers. No fingerprinting. No session replay. No marketing pixels. No behavioural profiling." GDPR rights honored: "We respond inside thirty days, usually faster." Deletion within sixty days of account close; "Backups age out inside ninety days." |
| Supporting source | `src/app/privacy/page.tsx` (worktree, verified quotes) |
| Conflicting source | None. |
| Date/version | Current main |
| Confidence | High |
| Implementation assumption | Email footers and privacy-adjacent copy may restate these exactly. Numbers are written as the page writes them (thirty, sixty, ninety days). |
| Founder decision required | No. |

### 6.2 Notes privacy

| Field | Value |
| --- | --- |
| Topic | Notes in email and film copy |
| Current apparent truth | "Treat Signal Notes as private by design." Only creator-approved extracts leave Notes; raw note bodies stay out of Tasks, Timeline, Signal, shared updates, and briefings by default. |
| Supporting source | `content/hq/decisions/notes-private-by-design.md` (worktree and studio); reinforced by `docs/shipped-state.md` §Notes ("Notes-to-Tasks sends a user-selected extract, not the raw private Note automatically") |
| Conflicting source | None. |
| Date/version | 2026-05-12, Active |
| Confidence | High |
| Implementation assumption | No email or film ever shows or implies a briefing quoting raw note content. Extract language is always "you choose what leaves Notes". |
| Founder decision required | No. |

### 6.3 "No pupil database"

| Field | Value |
| --- | --- |
| Topic | The school privacy claim |
| Current apparent truth | The phrase is now live copy on main: the /teachers page leads with "Six classes. One school year. No pupil database." and "No pupil names, emails, accounts, grades or attendance." It is backed in principle by the sequencing decision's zero-pupil-PII fence and by shipped-state's sponsorship boundary, but no enforced age-fence entitlement has shipped and the school pilot itself is staged, feature-gated work. |
| Supporting source | `src/app/teachers/page.tsx`; `content/hq/decisions/segment-sequencing-2026-05.md` (compliance fence); `docs/shipped-state.md` §Sponsorship and privacy and §Planning Period release state (legal/privacy review for the school pilot is an unmet precondition) |
| Conflicting source | Claim versus enforcement: the copy is live while the enforcement and legal review are not. |
| Date/version | Teacher page on main as of 2026-07-12 remediation |
| Confidence | Medium: the intent is decided, the enforcement is not shipped |
| Implementation assumption | Any school email or film using "no pupil database" carries the provisional flag from 3.3 and must not describe it as an operating, audited system. Prefer forward-shaped wording ("built so that no pupil data is needed") in prototypes. |
| Founder decision required | Yes, bundled with the school outreach decision (decisions doc, item 5). |

---

## 7 · Brand and design tokens

### 7.1 Background color drift

| Field | Value |
| --- | --- |
| Topic | Email surface color |
| Current apparent truth | Two canons disagree. `BRAND.md` §5: "Background: warm-stone `#fafaf7` (`--bg`). Never pure white in elevated surfaces." `ds-foundation/tokens/tokens.css` v2.1.0 (the declared single source of truth for every Signal Studio surface, approved at the 2026-07-02 design-system mandate): the paper comment records white as "locked by operator decision 2026-07-02", `--paper: #ffffff`, with `--bg` marked deprecated. |
| Supporting source | `BRAND.md` §5 (worktree); `ds-foundation/tokens/tokens.css` (checkout branch `fix/package-name-canon`; the paper lock dates to v2, 2026-07-02) |
| Conflicting source | The two files above are the conflict. The tokens file wins: it is newer, operator-locked, and self-declares canonical. |
| Date/version | tokens.css v2.1.0, lock dated 2026-07-02; BRAND.md §5 predates it |
| Confidence | High |
| Implementation assumption | The email system follows tokens.css: paper `#ffffff`, indigo `#4f46e5`. A BRAND.md §5 update is owed and should be filed as drift, not decided again. Signal Studio is light-locked; no dark-mode email variants. |
| Founder decision required | No (already decided 2026-07-02); recording the drift is enough. |

---

## 8 · Film

### 8.1 The locked venue film

| Field | Value |
| --- | --- |
| Topic | "As Considered as the Day" |
| Current apparent truth | Locked 2026-07-11. Proposition: Signal Studio allows a venue to extend the quality of its wedding experience into the months of planning that precede the day. Primary line: "Make the planning feel as considered as the day." Governing motion concept: "Care becomes clarity." Shared semantic object: "Final guest count to catering." Product path: Signal Notes → Signal Tasks → Signal Timeline → Signal. The restrained visual identifier is not yet approved; scene V05 (2026-07-11) carries a REVISE verdict. |
| Supporting source | `studio/docs/strategy/VENUE_FILM_REVIEW_LEDGER.md`. Note: this file is untracked in the studio checkout (branch `feat/experience-quality-os`); it exists on disk only and is not on any branch. It should be committed before it governs production. |
| Conflicting source | `docs/strategy/VENUE_EDITION_VIDEO_BRIEF.md` (2026-05-16, "production-ready") is explicitly demoted by the ledger to historical context; it does not override the locked brief. Resolved by the ledger's own words. |
| Date/version | Ledger locked 2026-07-11 |
| Confidence | High for the locked anchors; the untracked-file status is a durability risk |
| Implementation assumption | The three film briefs treat the ledger anchors as canon: primary line, motion concept, product path, continuity geometry rules. Film-related emails quote only the primary line as locked copy. |
| Founder decision required | No for the anchors; committing the ledger is an operator hygiene item. |

### 8.2 What a film may truthfully show

| Field | Value |
| --- | --- |
| Topic | Product surfaces on screen |
| Current apparent truth | All four product surfaces are deployed and may be shown, provided depicted states match the shipping interfaces (the V05 REVISE verdict rejected non-matching Notes states). The Signal briefing card stays impressionistic: the motion guidance says to "keep the briefing card impressionistic (a designed prop, not a screen recording)" because Signal is in-flight and must not read as shipped. |
| Supporting source | `docs/shipped-state.md` (deployment table); `studio/docs/strategy/VENUE_FILM_REVIEW_LEDGER.md` (V05 entry); `_wt-motion-hq/content/hq/content/motion-venue-edition.md` (verified, branch `feat/motion-production-hq`) |
| Conflicting source | None. |
| Date/version | motion guidance current in the motion-hq worktree; shipped-state 2026-07-12 |
| Confidence | High |
| Implementation assumption | Film briefs may storyboard all four products; the Signal briefing card is a designed prop, never a claimed screen recording. No staged Planning Period surfaces appear. |
| Founder decision required | No. |

### 8.3 Founder signature

| Field | Value |
| --- | --- |
| Topic | Name on outreach emails and film credits |
| Current apparent truth | The collateral identity masters attribute the founder quote to "Ethan McNamara", "founder of Signal Studio". |
| Supporting source | `collateral/data/specimens.json` (who: "Ethan McNamara"; alt text: "Quote from Ethan McNamara, founder of Signal Studio..."); repeated across `collateral/data/manifest.json` |
| Conflicting source | None found, but no ratified signature line (name plus role plus any sign-off phrase) exists anywhere. |
| Date/version | Collateral masters, main |
| Confidence | Medium: the name is consistent in collateral; the exact signature line is unconfirmed |
| Implementation assumption | Outreach fixtures use "Ethan McNamara, Founder, Signal Studio" as a placeholder marked for founder confirmation. |
| Founder decision required | Yes. See decisions doc, item 8. |

---

## 9 · Claims from the pre-audit findings that did not verify as written

These were checked against primary sources and corrected above. Recorded so nobody re-imports them.

| Claim as briefed | What the sources actually say |
| --- | --- |
| "Pricing page code says €100/year" | The €100 literal was removed in the 2026-07-12 remediation. The page now reads only verified amounts from `contracts/commercial-terms.v1.json` and states annual Pro terms are not open. The €100 side of the contradiction survives in `docs/LICENSING_ACCESS_DESIGN.md`. |
| "Event: pricing page code €89 vs docs €79" | Direction confirmed but wider: Studio main (contract, /pricing, shipped-state) says €89; `docs/MARKETING_PLAN_6MO.md` and live Tasks surfaces say €79. |
| "Notes shipped 2026-05-14, Signal end-to-end 2026-05-13 per docs/shipped-state.md" | The current shipped-state (2026-07-12) no longer carries these dates and uses the Deployed/Private preview vocabulary instead. The dates are historical evidence only; not re-verified. |
| "/pricing 'in build' labels were flagged stale" | Superseded. "In development" labels are the deliberate post-remediation state. |
| "Waitlist page: 'Access opens in small batches from 1 September.'" | The current page says "when each product and privacy gate is ready." The dated wording was retired in the remediation. |
| "From 'Signal Analytics <hello@signalstudio.ie>'" | Env-example only. The code default is `Signal <hello@signalstudio.ie>`. Production env value not verifiable from the repo. |
| "DKIM... already on the operator ledger" | Not in `content/hq/operator-todos/`. It exists only in `docs/DKIM_SETUP.md` and `docs/OPERATOR_ACTIONS_2026_05_16.md`. Ledger gap noted. |
| "Founding cohort locks it for life" | The decision file wording is "for as long as they stay". Use that wording. |
| "The founder's email-system brief (2026-07)" | No repo file exists; it is the in-session brief. Its school and student asks are recorded in 3.3 as one side of the live contradiction. |
