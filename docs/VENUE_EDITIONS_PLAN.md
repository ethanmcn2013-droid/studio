# Plan 8 — Venue Editions

**Status:** Cycle 8.0 (Decisions lock) — locked 2026-05-13.
**Owner:** Ethan.
**Plan window:** 2026-05-13 → first venue cohort active for 30 days (target: late June 2026).
**Closes when:** Lamb's Hill couples have a measurable 90-day active rate and decision logged on venue #2.

---

> ## ⚠ AMENDED 2026-05-16 — the money reversed
>
> This plan was written for a **free** model ("with our compliments"). On
> 2026-05-16 the founder ratified the **paid Venue Edition**:
> **€1,500–€4,000 / year, prepaid**, founding cohort locks €1,500 for
> life. The venue now **pays Signal Studio** for the sponsorship. The
> canonical decision is `content/hq/decisions/venue-editions-paid-tier.md`
> — read it first; where it and this doc disagree, the decision wins.
>
> **What changed:** the money only. The venue pays instead of receiving
> "with our compliments". §1's "extends free, full-suite access", §3's
> "Free for your couples" pitch, and §4's "not a public tier on /pricing"
> are **superseded** — the Venue Edition is now a paid tier surfaced on
> `signalstudio.ie/pricing` and `signalstudio.ie/venues`.
>
> **What did NOT change (still load-bearing below):** the mechanic —
> per-couple codes, co-branded eyebrow only (no venue logo), 12-month
> couple duration, auto-drop to Free at month 12, sponsor-aware welcome.
> "With our compliments" survives ONLY as the founder-issued
> family/friends comp track, never as the venue model. Lamb's Hill, in
> flight as a free pilot, is honoured at the founding €1,500 lock if it
> converts.

---

## 1 · What this program is

Signal Studio extends free, full-suite access to its 80% audience through **two named programs**:

- **Venue Editions** — a venue (or other channel partner) sponsors free Signal Studio access for their customers. License bound to the *user*, not the venue. First partner: Lamb's Hill. Wedding venues use the existing Wedding package (Tasks + Notes + Timeline + Signal, wedding-coded onboarding, 12-month duration).
- **With our compliments / Review access** — direct gifts dispensed by Ethan. "Compliments" for friends and family (no fixed duration — just an open account). "Review access" for press, 90 days, named as such on the gift surface.

These programs ride a shared **entitlements layer** (built in Cycle 8.1).

## 2 · What this program isn't

- Not a free trial. No countdown framing in the user-facing copy.
- Not an affiliate or reseller program. No margin to the venue, no kickback.
- Not co-marketing. Venue logos do not appear next to the `signal studio.` wordmark. The venue is named in a quiet eyebrow; the wordmark holds equal-weight ground alone.
- Not a public tier on `/pricing`. One quiet line below the Event tier is the only public surfacing.
- Not "20 free licenses per partner." Allocation is **unlimited per partner**, with a strategy-level guardrail on partner-sourced share of active workspaces.

## 3 · The pitch to the venue

> *Couples who plan with Signal Studio show up better-organized. Less ad-hoc questions to your wedding coordinator. Fewer last-week panics. Free for your couples — less load on your team.*

Operational benefit to the venue is the lead. Marketing co-branding is a side benefit, never the headline.

---

## 4 · Locked decisions (Cycle 8.0)

| Decision | Lock |
|---|---|
| Partner program name | **Venue Editions** (e.g. *Signal Studio, Lamb's Hill edition*) |
| Comp track names | **"With our compliments"** (family/friends, no expiry) + **"Review access"** (press, 90 days) |
| Allocation | **Unlimited per partner** — track partner-sourced share of active wedding workspaces; revisit if it exceeds 40% by end of pilot |
| Co-brand register | Venue name in 11px Geist Mono eyebrow, `var(--ink-quiet)`, above the wordmark. **No venue logo.** |
| Handoff artifact (venue #1) | **Email template** — Sinéad at Lamb's Hill drops it into post-booking comms |
| Handoff artifact (venue #2+) | Printed card in welcome pack — commission after venue #1 pilot validates |
| Code shape | **Per-couple** codes, not generic. Bulk-issued via CLI script in batches of 10 |
| Public surfacing on /pricing | One quiet line below the Event tier: *"Planning a wedding? Ask your venue."* — 15px, `var(--ink-quiet)`, no CTA |
| License duration (Venue Editions, weddings) | 12 months from redemption, auto-drop to Free at month 12 with a single in-app prompt at day 330 |
| Expiry behaviour | No grandfathering. One honest message: *"Your venue's gift ends in 30 days. Stay free or upgrade."* |

## 5 · Voice and copy register

All user-facing strings in Plan 8 follow `BRAND.md` §3:

- Plain English, declarative, no exclamation marks.
- No banned vocabulary (AI-marketing, SaaS fluff, PM jargon, tech jargon on user-facing pages).
- Emotional intelligence: not *"This code is invalid."* but *"That code doesn't match anything. Double-check the link from your venue."*

The five canonical redemption error strings (locked from ux-director panel input):

1. **Already used** — *"This code was already used. Ask Lamb's Hill for a new one."*
2. **Invalid** — *"That code doesn't match anything. Double-check the link from your venue."*
3. **Already on a paid plan** — *"You're already on a paid plan. Contact us and we'll sort it."*
4. **Expired** — *"This offer has ended. Your venue can issue a fresh one."*
5. **Network / unknown** — *"Something went sideways on our end. Try again in a minute, or email hello@signalstudio.ie."*

`[VENUE_NAME]` interpolates from the `sponsors` table.

---

## 6 · Phased cycle plan

### Cycle 8.0 — Decisions lock *(closing this turn)*

Ships: this document, phase.md update, no code.

Acceptance: `studio/docs/VENUE_EDITIONS_PLAN.md` written; `.claude/state/phase.md` appended with the cycle line.

### Cycle 8.1 — Entitlements layer

The load-bearing foundation. No visible output, no skipping.

Ships:
- Turso table `entitlements` on the studio DB: `id, user_clerk_id, tier, source, source_ref, granted_at, expires_at, status`
- Source enum: `workspace_subscription`, `event_pass`, `student_edu`, `venue_edition`, `compliments`, `review_access`
- Read function `getEntitlement(clerkId)` exposed cross-product (initially imported by Tasks; future products consume same shape)
- Drizzle migration applied to studio's Turso prod
- One seeded test row for development

Defers: entitlement-aware paywall rewiring in Timeline / Signal / Notes. Tasks-only in Cycle 8.3.

Acceptance: `getEntitlement()` returns the correct shape for a hand-seeded `venue_edition` row. `pnpm typecheck` + `pnpm build` clean on studio. Migration applied via Turso CLI (per the 6.4 pattern — Vercel Sensitive env vars blocked agent path).

### Cycle 8.2 — Sponsor data model + `/redeem/[code]` *(CLOSED 2026-05-13)*

Ships:
- Turso tables on studio: `sponsors`, `license_codes` (with `duration_days` for entitlement scoping), `redemptions` audit log
- `scripts/create-sponsor.ts` and `scripts/issue-codes.ts` (Ethan-run; CSV out, no-ambiguity alphabet, sponsor-slug-prefixed codes)
- `/redeem/[code]` server component at `src/app/redeem/[code]/page.tsx`
- `src/lib/redeem/lookup.ts` shared lookup helper (importable by Tasks-side in 8.3)
- Source-aware rendering: `venue_edition` shows venue eyebrow (no logo); `compliments` and `review_access` render with no eyebrow
- All seven view states (claimable × 3 sources + 4 error states); `?state=` preview for visual review
- Robots `noindex, nofollow` on the route
- One sponsor + 3 minted codes seeded in prod (Lamb's Hill, `LAMBSHIL-XXXXX`) for 8.3 testing

Deferred to 8.3: Clerk integration on studio (or signed-handoff token to Tasks); entitlement-writing on redemption; the "already on a paid plan" error state (reachable only post-auth).

Acceptance: code in prod redeems through `lookupRedemption()` to the correct view shape. All seven states render correctly under `?state=`. `tsc` + `next build` clean. **Closed.**

### Cycle 8.3 — Redemption-completion bridge + first-touch product experience (Tasks)

**Reconciled scope after 8.3a/8.3b discovery (2026-05-13):** the originally-planned signed-handoff bridge was abandoned mid-cycle when grep across Tasks revealed a pre-existing redemption system (comp_codes table + /redeem/[code] route + redeemCompCodeAction + workspace-scoped entitlements + Stripe-wired grantEntitlement). The reconciliation: studio's /redeem/[code] stays as the co-branded landing; studio's sponsors + license_codes tables stay as the source-of-truth for sponsor audit; the CTA redirects to tasks.signalstudio.ie/redeem/[code] which runs Tasks's existing redemption flow; issue-codes.ts dual-writes to both studio's license_codes (audit) and Tasks's comp_codes (runtime) so codes work end-to-end through the existing path.

Ships across studio + `~/Projects/personal/tasks`:
- **Redemption-completion bridge.** When the `/redeem/[code]` CTA fires, atomically: insert an `entitlements` row (using `license_codes.source_type` + `tier` + `duration_days` to compute the entitlement shape), update `license_codes.status` to `redeemed` (with `redeemed_by_user_id` + `redeemed_at`), insert a `redemptions` audit row. Likely shape: studio renders /redeem/, hands a signed token to Tasks's sign-up flow, Tasks consumes the token after Clerk auth completes and writes the entitlement via shared Turso token.
- **"Already on a paid plan" error state** wires here — only reachable when an authenticated user attempts redemption.
- Tasks reads `getEntitlement(userId)` on first session. If source is `venue_edition` + tier is wedding, **skip the `/welcome` picker entirely** — auto-create the wedding workspace.
- One-time, dismissible workspace welcome card: *"Compliments of [VENUE_NAME]. Plan your wedding without the noise."* — copy locked, no edits at venue boundary.
- Replace `"Pick a starter so you have something to play with"` and `"Loaded · ready to open"` strings in the welcome picker even for non-redeemed users (ux-tester caught these as on-brand violations regardless).

Defers: Notes / Timeline / Signal auto-provisioning. Tasks first; the others open on demand once the user is signed in. Notes/Timeline/Signal entitlement-aware paywall rewiring deferred to Cycle 8.7+.

Acceptance: a fresh sign-up from `/redeem/LAMBSHIL-XXX` lands directly in a wedding workspace, sees the compliments card, never touches the picker, and the corresponding `license_codes` row flips to `redeemed`. Tasks + studio `pnpm typecheck` clean.

### Cycle 8.4 — Operator surface (lightweight) *(CLOSED 2026-05-13)*

Ships:
- `/pricing` quiet line below the Event tier — *"Planning a wedding? Ask your venue."* — 15px, `var(--ink-quiet)`, no CTA, no link
- Internal `/hq/partners` read-only view on signalstudio.ie (gated by existing HQ password): list of sponsors with `codes_issued / codes_redeemed / active_30d` columns, plus most-recent-redemption timestamp and rollup totals
- `scripts/partner-digest.ts <sponsor-slug>` — Ethan-run, prints a one-paragraph activation summary suitable for forwarding to the venue contact
- `src/lib/partners/stats.ts` — shared helper used by both surfaces; cross-DB read from Tasks (`comp_codes` keyed by sponsor JSON in `notes`, `entitlements` filtered on `source='comp' AND notes IN ('comp:CODE'...)`); `TASKS_DATABASE_URL` + `TASKS_AUTH_TOKEN` set on studio's Vercel production
- `partner:digest` package script alias

**Entitlements-table decision (kept, not dropped):** Studio's `entitlements` table remains in place but unused at runtime. Dropping requires a migration that would have to be reversed if cross-product identity (Cycle 9+) rehabilitates it. Empty table costs nothing. The Tasks `entitlements` table is authoritative for runtime; studio's stays as scaffolding for the cross-product future. Re-evaluate in Cycle 9 if cross-product entitlements move to deferred-deliberation rather than imminent build.

**Redemptions audit decision (still empty):** Studio's `redemptions` table sits unwritten. Populating it would need either a Tasks → studio webhook on each redemption, or a periodic sync. /hq/partners reads live from Tasks's `entitlements` instead, which is the source of truth anyway. Cycle 9+ candidate.

Defers: self-serve partner sign-up; partner web dashboard; automated digest cron; read-only Turso auth token (currently reuses the write-capable token from `issue-codes.ts`); pre-auth code validation on Tasks's /redeem/[code] so typo'd URLs don't push couples through Clerk. All Cycle 9+ candidates.

Acceptance: `/hq/partners` accurately reflects Lamb's Hill's seeded state (3 codes issued, 0 redeemed pre-pilot). `partner-digest.ts lambs-hill` produces a single sendable paragraph. Both verified live against prod Turso.

### Cycle 8.5 — Lamb's Hill provision + soft launch

Ships:
- Lamb's Hill sponsor record provisioned via `issue-codes.ts`
- First batch of 10 per-couple codes issued
- Email template + CSV sent to Sinéad at Lamb's Hill
- Soft-launch window: 14 days
- Day-14 retro: redemption count, activation count, qualitative feedback from Sinéad

Defers: any change to program design before retro completes. Discipline against in-flight tweaks.

Acceptance: at least one couple redeems and lands in Tasks. Retro doc captured as `studio/docs/CYCLE_8_5_LAMBS_HILL_RETRO.md`.

### Cycle 8.6 — Comp Program split track

Built deliberately late — pm's "comp is a distraction" warning is correct *until the venue motion proves out*.

Ships:
- `scripts/issue-compliments.ts <email> <name>` — Ethan-run, no UI. Generates a `compliments` source entitlement with no `expires_at`. Sends a warmer redemption email (no venue eyebrow, no expiry copy).
- `scripts/issue-review-access.ts <email> <publication>` — same shape, but `expires_at = now + 90 days`. Email body explicitly names it as review access ("90-day review access to all four Signal Studio products. Beat the system or break it — that's the point.").
- Redemption page register adjustments for non-venue codes (no venue eyebrow, slightly warmer hero copy).

Defers: any self-serve press-application flow; any UI for managing comps.

Acceptance: Ethan dispenses both flavours from CLI in under 30 seconds each. Both surfaces render at `?state=preview` for inspection before going live.

---

## 7 · Closure criteria for Plan 8

- Lamb's Hill cohort active for 30+ days post-launch
- 90-day active rate measured for the first cohort (pm's kill/extend metric — single cohort below 40% triggers a venue conversation, not termination; two consecutive cohorts below threshold is the kill signal)
- Signal HQ updated: `src/lib/hq/data.ts` includes Venue Editions as a live initiative; `signal-growth/` reflects venue-pilot motion state
- `CHANGELOG.md` carries the launch entry in playful voice (per saved feedback)
- Decision logged: continue to venue #2 (commission printed cards) or pause and iterate

## 8 · Explicit not-doing in Plan 8

- Partner web dashboard (Cycle 9 candidate, after venue #3)
- Self-serve venue sign-up
- Channel extension to non-wedding partners (planners, trades organisations, student unions)
- Per-venue customisation of product UI ("Edition" is positioning, not a feature toggle)
- Automated press-comp expiry warnings
- Auto-renewal of any comp or sponsored license
- Public "ask your venue" lookup tool

## 9 · Open risks

- **Entitlements cycle (8.1) is the slip risk.** No visible output makes it tempting to skip. If `/redeem/[code]` gets wired directly to Clerk metadata "just for Lamb's Hill," the shortcut compounds into four product repos. Discipline: 8.1 ships before 8.2.
- **Per-couple codes add ops weight** — a CSV exchange per booking cycle vs. a single static code. Accepted because (a) sharing a generic code creates abuse vectors the program can't survive, and (b) per-couple redemption is the *signal* the pilot exists to measure.
- **Printed cards may slip beyond pilot.** Venue #1 ships email-only by design; venue #2 commits to commissioning cards. If cards slip again at venue #2, revisit the brand-register call from creative-director panel input.
- **Venue commitment to surface Signal Studio** — strategy panel flagged this as the program's collapse risk. The pilot must include a Lamb's Hill commitment to put the email template into their post-booking flow, not a vague "we'll mention it." Acceptance criterion for Cycle 8.5.
- **Unlimited allocation may erode the §2.3 audience-first moat** — if partner-sourced share exceeds 40% of active wedding workspaces by end of pilot, revisit the cap.

## 10 · Cross-references

- `BRAND.md` §2.1, §2.2, §2.3 — audience definition, what fails them, the moat
- `BRAND.md` §3 — voice rules (banned words, cadence)
- `BRAND.md` §6 — page-level conventions (footer, changelog, "What this isn't")
- `analytics/docs/PRODUCT.md` — entitlements-aware briefing scope (Cycle 8.7+ candidate)
- `roadmap/CHANGELOG.md`, `tasks/CHANGELOG.md` — per-product launch notes routing to umbrella `signalstudio.ie/changelog` per locked convention (BRAND.md §6)
- `~/Projects/personal/studio/.claude/state/phase.md` — cycle status of record
