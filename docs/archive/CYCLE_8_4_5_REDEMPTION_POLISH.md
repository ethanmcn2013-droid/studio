# Cycle 8.4.5 — Redemption flow polish (pre-launch)

**Status:** Planned 2026-05-13 (end of session). Sequenced BEFORE Cycle 8.5 (Lamb's Hill provision).
**Window:** ~2 hours of focused work + one deploy slot.
**Closes when:** Items 1–4 below are shipped + walked end-to-end + sponsor email is reviewed and ready to send.

---

## 1 · The frame

A four-agent panel (creative-director, ux-director, ux-tester, strategy) reviewed the venue redemption flow on 2026-05-13. Convergence was strong. The synthesis below is the actionable subset.

**Operating heuristic (from strategy):**
> *Would a tired adult thank us for this, or skip past it?*

Apply to every proposed change. If skip-past, cut it. This sits on top of BRAND.md §3 voice rules and §2.1 audience definition.

The frame is **Position B** — restraint over warmth. A wedding-stressed couple has been over-charmed by twelve other vendors this month. The win isn't surprise-and-delight, it's being the first piece of software that treats them like an adult with a logistics problem.

---

## 2 · What gets shipped (sequenced)

### Item 1 — Sponsor-to-couple email template *(copy work, no deploy needed)*

**The problem:** The email Sinéad sends to her couples is the *actual* first touch with the Signal Studio brand. It doesn't exist yet. If Sinéad writes her own version, our first-impression copy is uncontrolled.

**What ships:**
- `docs/VENUE_EDITION_EMAIL_TEMPLATE.md` — vetted template, written in BRAND.md §3 register, in the venue contact's voice.
- pm-gates the CSV send to Lamb's Hill on this template existing + being reviewed.

**Starter draft** (review tomorrow with fresh eyes before locking):

> **Subject:** A year of Signal Studio, on us
>
> Hi [first name],
>
> A small gift from Lamb's Hill: a year of Signal Studio for your wedding planning. Quiet, plain-English software for the work of getting married — tasks, notes, a shared timeline, a daily briefing of what needs attention next.
>
> Your code below. Yours alone, activates once.
>
> Code: **[CODE]**
> Open: signalstudio.ie/redeem/[CODE]
>
> Reply with any questions.
>
> Sinéad
> Lamb's Hill

Notes on the draft:
- No exclamation marks. ✓ (BRAND.md §3)
- One sentence of "what it is" — minimum viable; the landing page does the rest.
- "Yours alone, activates once" — preempts the per-couple confusion.
- Plain text. No HTML branding. The email should look like Sinéad wrote it, not like marketing automation.
- Sinéad sends from her own address, not via a system mailer.

**Open question for review:** is "the work of getting married" too crafted for a venue admin email? Alternative: "tasks, notes, a shared timeline, a daily briefing — clear and quiet." Cuts the meta sentence; lets the bullets do it.

**Acceptance:** template doc committed; pm review pass complete; ready to paste into Sinéad's handoff packet.

---

### Item 2 — Sign-up page context bridge *(highest-leverage code change)*

**The problem:** The single biggest hole in the flow. All four panel agents flagged this independently. Couples leave `signalstudio.ie/redeem` with Lamb's Hill in mind, get bounced to `tasks.signalstudio.ie/sign-up` where every venue signal disappears. ux-tester estimated 40% bounce rate at this seam.

**What ships:**

`tasks/src/app/sign-up/[[...sign-up]]/page.tsx`:

- Read `redirect_url` from search params (Clerk preserves it through the sign-up flow).
- If it matches the pattern `/redeem/CODE`, parse `CODE` and look up the sponsor.
- Sponsor lookup: query Tasks's `comp_codes` table for that code, parse `notes` JSON for `sponsor_name`. Re-use the same lookup pattern as `detectVenueWelcome`. No new infrastructure.
- If sponsor found: render a persistent context strip ABOVE the Clerk `<SignUp />` component:
  - Eyebrow: 11px Geist Mono, `var(--ink-quiet)`, uppercase: `[SPONSOR NAME]`
  - Sentence: 14–15px ink-soft: *"Almost there. Lamb's Hill is covering your year."*
  - Code: 11px mono tabular, faint: `Code · [CODE]`
- If no sponsor / no redirect_url / lookup fails: render existing minimal sign-up unchanged.

**Why this shape and not the alternatives:**
- Heading variants ("Continue to claim your seat") read marketing-y. The eyebrow shape *matches* the studio landing's eyebrow — the thread is the visual repetition, not new prose.
- No buttons, no animation, no flourish. The bridge is structural, not decorative.

**Files touched:**
- `tasks/src/app/sign-up/[[...sign-up]]/page.tsx` (component change + searchParams handling)
- New helper or inline import from existing `tasks/src/server/db/venue-welcome.ts` pattern

**Acceptance:** in an incognito session, visiting `tasks.signalstudio.ie/sign-up?redirect_url=%2Fredeem%2FLAMBSHIL-MP93X` shows the Lamb's Hill eyebrow + continuation sentence + code, persistently visible while the Clerk component handles auth.

---

### Item 3 — Cut /welcome from the venue redemption path

**The problem:** Result card → "Open the workspace" → `/welcome` (server short-circuit) → `/app/board?welcome=venue` is a triple-redirect that elides the moment the success card just earned. ux-director: "the result card is the emotional high of the flow and the product immediately yanks them through two more server hops."

**What ships:**

`tasks/src/server/actions/comp.ts` — extend `redeemCompCodeAction` so on `ok: true` for a `comp` source entitlement with `tier: 'wedding'` AND notes containing a sponsor:
- Apply the wedding template inline (same call /welcome makes today).
- Update workspaces.template_id + active_domain = 'wedding'.
- Result type stays the same; the side effects move forward.

`tasks/src/components/redeem/redeem-result-card.tsx`:
- Change success CTA `href` from `/welcome` to `/app/board?welcome=venue&v=<sponsorSlug>`.
- Pass `sponsorSlug` through the action's `ok: true` shape so the card has it. (Today the slug isn't in the return type — add it.)

`tasks/src/app/welcome/page.tsx`:
- Keep all existing logic. /welcome still serves non-venue first-time sign-ups, the template flow for direct-signups, etc.
- Defensive: the venue short-circuit can stay as a fallback in case someone navigates directly to /welcome with a venue entitlement.

**Why both ends, not just one:**
- Apply-template-server-side without the card-link change means the card still bounces through /welcome (no win).
- Card-link change without the server-side apply means the user lands on an empty board (the template never runs).
- Both ends together: one click, one destination.

**Acceptance:** click "Open the workspace" on the success card → land on `/app/board?welcome=venue&v=lambs-hill` with the wedding template populated. No intermediate `/welcome` request in the network panel.

---

### Item 4 — Success card palette correction

**The problem:** The success card uses emerald (`bg-emerald-50/30`, `border-emerald-200`, `text-emerald-700`, `bg-emerald-500` for the icon). BRAND.md §5 reserves emerald `#10b981` for task-status "shipped/done" — it reads "system success," not "your wedding workspace just activated." Wrong register.

**What ships:**

`tasks/src/components/redeem/redeem-result-card.tsx`:

- Replace emerald palette with the audience-accent for weddings: rose `#be185d` (BRAND.md §7 `--aud-wedding`).
  - Border: `border-[rose]/20` or equivalent — soft tint, not full saturation
  - Background tint: very faint rose wash
  - Eyebrow color: full rose
  - Tier label color: full rose
  - Icon background: full rose
- **Keep the check icon.** ux-tester explicitly named the success card as "the moment I'd screenshot and send to Jamie." creative-director argued for removing it ("most generic element in the suite"); I disagree — at a moment of high anxiety, an instant "yes this worked" affordance is exactly something a tired adult thanks us for (strategy heuristic, applied). The fix is the *color*, not the iconography.
- Keep the entrance motion (`y: 10 → 0`, 400ms, `[0.16, 1, 0.3, 1]`). On-brand, doesn't fail the heuristic.

**Acceptance:** success card reads as a wedding-audience artifact, not a generic system toast.

---

## 3 · Sequencing + deploy plan

- Vercel Hobby daily deploy limit resets at UTC midnight (~22h from end of session).
- **Item 1** (email template) is copy work — no deploy. Do it before the others to gate the CSV send.
- **Items 2 + 3 + 4** ship as a single bundled deploy. They touch overlapping surfaces (the sign-up page, the redemption action, the result card); deploying them together means one Vercel slot and one walk.
- Order within the bundle: write item 2 → item 3 → item 4 → typecheck → build → deploy.
- Walk the flow once after the deploy lands.

**Total estimated time:** 30 min (item 1 copy) + 30 min (item 2) + 30 min (item 3) + 15 min (item 4) + 15 min (walk) = ~2 hours.

---

## 4 · What we are NOT doing in this cycle

Deferred to a later polish pass (or to Cycle 8.5+ as it scales):

- **IncludedStack box → ruled list** (creative-director's specific call). Cosmetic. The current box reads "widget" rather than "gift"; a ruled list reads "what's yours." Defer because the change has visual implications and deserves an unhurried design pass.
- **"Sponsoring" → softer phrasing** on studio landing (ux-tester flagged commercial undertone). One-word swap; bundle with the IncludedStack pass.
- **"Claim your seat" CTA** (ux-tester: webinar register). Same bundle.
- **"every view is the same items, all in plain English"** in VenueWelcomeCard (ux-tester flagged this as a BRAND.md §2.2 jargon-adjacent failure). Easy fix; bundle.
- **Sponsor-named tasks in seeded wedding template** (ux-tester's "Confirm reception layout with Lamb's Hill"). Highest-leverage one-line but touches the wedding template — needs its own decision on how much personalization is locked in by sponsor.
- **`already_used` error routing logic** (ux-director's call: split self-redemption case from another-user case). Real edge case; not pilot blocker.

These are tracked as a single "Cycle 8.5.5 — Redemption flow polish v2" follow-up, post-soft-launch retro.

---

## 5 · Open questions for tomorrow

- Email template subject line: "A year of Signal Studio, on us" vs alternatives like "Your Lamb's Hill wedding workspace." Sleep on it.
- Whether the email template lives in `docs/` (operator reference) or in a structured location the CLI can reference (e.g. `studio/data/sponsor-email.md` with `{{first_name}}`, `{{code}}` placeholders). If we ever script the email, the latter; for the Lamb's Hill pilot, the former is fine.
- The `redirect_url` query param on Clerk's sign-up flow — confirm it survives all Clerk navigation steps (sign-up → email verification → maybe SSO callback). Likely yes, but worth a one-shot test before assuming.

---

## 6 · Definition of done

- [ ] Email template doc committed to `studio/docs/VENUE_EDITION_EMAIL_TEMPLATE.md`
- [ ] Sign-up context bridge live; verified via `tasks.signalstudio.ie/sign-up?redirect_url=%2Fredeem%2FLAMBSHIL-MP93X` showing Lamb's Hill eyebrow + sentence + code
- [ ] /welcome cut from venue path; result card → `/app/board?welcome=venue&v=lambs-hill` directly; no intermediate /welcome render in network panel during venue walk
- [ ] Success card palette swapped to `--aud-wedding` rose; check icon retained
- [ ] One real-account walk end-to-end without bugs
- [ ] `pnpm partner:digest lambs-hill` reflects the test redemption
- [ ] CHANGELOG entry on Tasks describing the four-item polish bundle
- [ ] CHANGELOG entry on Studio describing the email-template addition
- [ ] phase.md updated to reflect closure of 8.4.5 and clearance for 8.5

---

## 7 · File index for tomorrow's first read

- `docs/CYCLE_8_4_5_REDEMPTION_POLISH.md` — this file
- `docs/CYCLE_8_5_HANDOFF.md` — original Cycle 8.5 handoff (now sequenced AFTER this work)
- `docs/VENUE_EDITIONS_PLAN.md` — full plan
- `BRAND.md` §3 (voice), §5 (status palette), §7 (audience accents), §2.1 (audience deep-dive)
- `tasks/src/app/sign-up/[[...sign-up]]/page.tsx` — item 2 target
- `tasks/src/server/actions/comp.ts` — item 3 target
- `tasks/src/components/redeem/redeem-result-card.tsx` — items 3 + 4 target
- `tasks/src/app/welcome/page.tsx` — item 3 cross-check
- `tasks/src/server/db/venue-welcome.ts` — reference for sponsor JSON lookup pattern
