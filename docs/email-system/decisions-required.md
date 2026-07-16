# Decisions required · email design system and film briefs

This is the short list of founder decisions that materially change email copy, email design, implementation, or film production. Each item names the decision, the live alternatives, what each costs, a recommendation, and what the email system assumes while the decision is open. Full evidence for every item is in `docs/email-system/commercial-truth.md`.

**Audited:** 2026-07-16. HQ reads from source files; when a decision here is made, it belongs in `content/hq/decisions/` (or the operator ledger), and this list retires against those files.

---

## 1 · Pro annual: €100 or €120

- **Decision:** ratify one annual Pro price.
- **Alternatives:** €100 (`docs/LICENSING_ACCESS_DESIGN.md` Stripe map, the pre-remediation pricing page) or €120 (`docs/MARKETING_PLAN_6MO.md` and `tasks/src/server/stripe.ts`, both citing a 2026-05-16 ratification). The typed contract holds both as candidates and the amount as null.
- **Consequences:** €120 honors the recorded ratification and the plainly stated no-discount-theatre stance; €100 matches the access-system billing map and reads as a cleaner round number but reverses a recorded ratification and undercuts twelve months of monthly (€144) by more. Either way, annual checkout stays closed until the contract is updated and the losing literal is purged.
- **Recommendation:** €120, because it is the only side with a dated ratification; then correct `LICENSING_ACCESS_DESIGN.md`.
- **Email system assumes meanwhile:** fixtures state "€12 a month" only. No annual figure appears in any template, fixture, or film frame.

## 2 · Event: €79 or €89

- **Decision:** ratify one Event price and reconcile the losing surfaces.
- **Alternatives:** €89 (Studio main: `contracts/commercial-terms.v1.json`, /pricing, `docs/shipped-state.md`, plus branch `codex/pricing-pro-event-89-dev` showing the in-flight change) or €79 (`docs/MARKETING_PLAN_6MO.md` "held as-is", live Tasks surfaces including `plan-view.tsx` and marketing pages).
- **Consequences:** confirming €89 requires purging €79 from Tasks live surfaces and amending the marketing plan; reverting to €79 requires changing the contract, /pricing, and shipped-state. Until one side wins, the suite quotes two prices for the same offer in public-visible places.
- **Recommendation:** confirm €89, since it is what the typed contract and the current public pricing page already assert, and sweep the €79 remnants in the same pass.
- **Email system assumes meanwhile:** no email fixture asserts the Event price.

## 3 · Sender architecture: hello@ only, or multiple addresses

- **Decision:** keep the single canonical `hello@signalstudio.ie` (BRAND.md §4) or approve a multi-address architecture (for example a separate outreach address or subdomain sending for bulk mail).
- **Consequences:** hello@-only keeps the brand rule intact and reputation concentrated, but one address carries transactional, briefing, and outreach traffic, so an outreach complaint spike could bruise transactional deliverability. Multiple addresses isolate reputation but contradict BRAND.md as written and multiply DNS and warm-up work.
- **Recommendation:** stay hello@-only for now; volumes are tiny and outreach is founder-signed and low-volume by plan. Revisit if outreach ever becomes sequence-shaped, which the marketing plan currently forbids anyway.
- **Email system assumes meanwhile:** every template sends from `hello@signalstudio.ie` with per-product display names, matching production.

## 4 · DKIM before any outreach sending

- **Decision:** perform the DKIM setup in Google Workspace (founder-only action, ~10 minutes, runbook at `docs/DKIM_SETUP.md`).
- **Alternatives:** do it now, or send outreach without it.
- **Consequences:** without DKIM, hello@ is SPF-only signed and venue outreach to Outlook and corporate filters risks the spam folder, wasting the founder-signed touches the plan limits to two per venue. With it, the deliverability stack is complete.
- **Recommendation:** do it before the first outreach send; there is no argument for the alternative. Also: file it in `content/hq/operator-todos/`, where it is currently missing.
- **Email system assumes meanwhile:** outreach templates are built and previewable but no outreach sending is enabled. Product transactional email continues unchanged.

## 5 · School and student outreach: reverse or hold segment-sequencing

- **Decision:** the email brief asks for school pilot emails, school outreach, a school film brief, and student onboarding emails; `content/hq/decisions/segment-sequencing-2026-05.md` (Active, review 2026-08-16) forbids outbound, demos, pilots, and dedicated paid pushes for those segments. Choose: amend the decision, or hold it.
- **Consequences:** amending opens the school design-partner motion early but takes on the compliance fence obligations (age-fenced entitlements to adults, zero pupil PII, legal review per `docs/shipped-state.md`) before anything ships, and re-litigates a panel decision the founder accepted in full. Holding keeps the wedge clean but means the requested school and student assets cannot send.
- **Recommendation:** hold the decision and build the assets as decision-ready prototypes flagged `provisional: blocked by segment-sequencing-2026-05`, so nothing is lost and nothing sends. Decide properly at the 2026-08-16 review.
- **Email system assumes meanwhile:** school and student templates exist only as flagged prototypes. No send path, no fixture that reads as live. "No pupil database" copy is worded as design intent, not as an audited operating claim.

## 6 · Student verification method

- **Decision:** choose the verification method at purchase and the graduation and re-verification policy for the €9.99 tier (`content/hq/operator-todos/licensing-policy-ratification.md`, step 3).
- **Alternatives:** verified student email domain, a verification provider, manual review, or honor-system with audit.
- **Consequences:** the choice dictates the student onboarding email sequence (what we ask for, when access opens, what the renewal email says) and the fraud posture of a €9.99 price.
- **Recommendation:** none from this audit; it is a pure policy call already on the ledger.
- **Email system assumes meanwhile:** student emails state the €9.99 price and never describe a verification mechanism.

## 7 · Dispatch as an email edition

- **Decision:** today "the dispatch" is the suite changelog convention at signalstudio.ie/dispatch (BRAND.md §6.5). An emailed dispatch edition is new scope. Approve or hold.
- **Consequences:** approving creates a recurring editorial email (list management, cadence, unsubscribe surface, a standing writing obligation the brand's "silence is also brand" rule cuts against). Holding costs nothing; the web dispatch already exists.
- **Recommendation:** hold. Design the email system so a dispatch edition template slots in later without rework, but do not commit to a cadence now.
- **Email system assumes meanwhile:** no dispatch email template ships as sendable; at most a prototype exists in the pattern library.

## 8 · Founder signature line

- **Decision:** confirm the exact signature line for outreach emails (name, role, and any sign-off phrase).
- **Alternatives:** "Ethan McNamara, Founder, Signal Studio" (matches `collateral/data/specimens.json`), a shorter "Ethan · Signal Studio", or first-name-only for warm follow-ups.
- **Consequences:** outreach is founder-signed by design (`docs/MARKETING_PLAN_6MO.md`); the signature is the single most repeated line in the outreach set, so it should be set once and never vary by accident.
- **Recommendation:** "Ethan McNamara, Founder, Signal Studio" for first touches, first name for replies; founder to confirm.
- **Email system assumes meanwhile:** fixtures carry "Ethan McNamara, Founder, Signal Studio" marked as a placeholder pending confirmation.

## 9 · Waitlist confirmation email

- **Decision:** today a waitlist submission writes to the database and sends nothing (`src/lib/waitlist.ts`). Approve adding a confirmation email once a direction for it is chosen.
- **Alternatives:** no email (status quo), a plain receipt ("you are on the list, access opens in small batches"), or a receipt plus a single expectations-setting note about batches and the privacy stance.
- **Consequences:** no email leaves the most motivated prospects with silence after their only action; a confirmation is the natural first production template for the new system and a live proof of the DKIM and header work. Any version must not promise a date, matching current page copy.
- **Recommendation:** approve a plain receipt as the email system's first shipped template, gated on item 4 (DKIM) being done first for the cleanest start.
- **Email system assumes meanwhile:** the confirmation template is designed and tested against fixtures but not wired to the waitlist action until approved.
