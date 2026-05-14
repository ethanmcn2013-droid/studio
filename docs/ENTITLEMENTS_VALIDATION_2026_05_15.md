# Entitlements validation — 2026-05-15

Code-side validation pass on the entitlements sprint that closed
2026-05-14. Companion to `ENTITLEMENTS_OPS.md` (operator runbook)
and the in-memory sprint scope at
`~/.claude/projects/-Users-ethanmcnamara/memory/project_entitlements_sprint_2026_05_14.md`.

This document covers what was verifiable by reading code across the
five repos. Two things still need a human:

- **Stripe live checkout** with card `4242 4242 4242 4242`.
  Sandbox keys are set; no card has been run through.
- **Cross-product gate walk in a browser**, signed-in as a free user,
  hitting each gated surface to confirm the gate fires + the upgrade
  message renders.

## 1 — Pricing-honesty audit

Each row of `signalstudio.ie/pricing` mapped to its enforcing repo,
gate location, and verification status.

| Pricing claim                                       | Enforcing repo | Gate location                                                | Verified |
|-----------------------------------------------------|----------------|--------------------------------------------------------------|----------|
| Free · One workspace                                | roadmap        | `src/server/actions/workspaces.ts:114` (`FREE_WORKSPACE_CAP = 1`) | code ✓   |
| Free · Three editing guests                         | tasks          | `src/server/db/membership.ts:25` (`FREE_WORKSPACE_MEMBER_CAP = 4`, owner + 3) | code ✓   |
| Free · All four products                            | (no gate)      | All four ship without tier-gated entry — match ✓             | code ✓   |
| Workspace · Unlimited workspaces                    | roadmap        | `src/server/actions/workspaces.ts:114-126` (skipped when `tierAtLeast(tier, "workspace")`) | code ✓   |
| Workspace · Unlimited guests                        | tasks          | `src/server/db/membership.ts:111-118` (`isUnlimited` covers workspace/studio/wedding/event → `max: null`) | code ✓   |
| Workspace · Drops to Free after window              | shared DB      | `src/lib/entitlements-db/reads.ts:62` (`gt(expiresAt, now)` SQL filter) | code ✓   |
| Workspace · Cancel anytime                          | stripe         | Tasks `/api/webhooks/stripe` handles `subscription.deleted`  | code ✓   |
| Event · One workspace for one event                 | roadmap        | `src/server/actions/workspaces.ts:114-126` (`tier === "event"` branch returns event-shaped error) | code ✓   |
| Event · 12-month window                             | shared DB      | `durationDays` honored in grant payload; expiry filter as above | code ✓   |
| Event · Workspace keeps reading forever after expiry | (no read gate) | Tasks/Roadmap read paths are not tier-gated — workspaces remain readable post-expiry | code ✓   |
| Student · .edu verification                         | (manual)       | Pricing CTA is `mailto:hello@signalstudio.ie` — no automated flow | honest gap (operator grants via `/api/internal/entitlements/grant`) |
| Analytics · Daily briefing email (Workspace+)       | analytics      | `src/app/api/cron/briefings/route.ts:107-108` (skip non-paid users) | code ✓   |
| Analytics · Briefing visible on /app (Free)         | analytics      | `src/app/app/brief/page.tsx:26-27` (UI renders; `emailDispatchEnabled` only gates the email banner) | code ✓   |
| Notes · all features Free                           | notes          | `src/server/entitlements.ts` predicate has **0 call sites** — Notes deliberately ships no Pro gate today | code ✓   |

### Verdict

The pricing page is **honest** against the current implementation.
Every paywalled promise has a code-level gate. The expiry → free
fallback is enforced by a SQL `WHERE` clause, not a cron sweep,
which is the right shape (failure-closed even if the cron drops).

## 2 — Per-product call-site map

For future operators tracing a gate decision through the stack.

**Tasks** (canonical writer for Stripe; also reads shared DB):
- `src/lib/entitlements-shared/` — shared client (mirrored across all 5 repos).
- `src/server/db/membership.ts` — `FREE_WORKSPACE_MEMBER_CAP = 4`, `getMemberCapacity()`, `canAddMember()`.
- `src/server/db/entitlements.ts:36` — `resolveEntitlement(userId)` for per-user tier.
- `src/server/actions/billing.ts` — `createCheckoutSessionAction`.
- `src/app/api/checkout/route.ts` — cross-product entry point (consumed by Studio's /pricing CTAs).
- `src/app/api/webhooks/stripe/route.ts` — webhook → Tasks DB → mirror to shared DB.
- `src/app/api/internal/reconcile-entitlements/route.ts` — manual reconcile endpoint.

**Roadmap** (workspace count + event-shape gate):
- `src/lib/entitlements-shared/` — shared client.
- `src/server/actions/workspaces.ts:114-126` — `createWorkspace` gate. Reads `resolveEntitlement(userId)`; rejects with tier-specific error message when free user owns 1+ workspaces.

**Analytics** (email-dispatch gate):
- `src/lib/entitlements-shared/` — shared client.
- `src/app/api/cron/briefings/route.ts:107-108` — gate inside `processOne()`. Free users are skipped with `reason: "free-tier-no-email"`.
- `src/app/app/brief/page.tsx:26-27` — `emailDispatchEnabled` computed; banner shown to Free users with /pricing upgrade link.

**Notes** (forward-compat only):
- `src/lib/entitlements-shared/` — shared client.
- `src/server/entitlements.ts` — `getNotesTier()` + `notesProEnabled()` helpers. **0 call sites today.** Header comment explicitly states "No Pro-worthy gate at v1".

**Studio** (admin + cross-product checkout proxy):
- `src/lib/entitlements-db/` — shared-DB writes (this is the **canonical** copy; siblings mirror the read layer).
- `src/app/hq/entitlements/` — admin UI for grants + expirations.
- `src/app/api/internal/entitlements/grant/route.ts` + `expire/route.ts` — Bearer-authed mutation endpoints.
- `src/app/pricing/page.tsx` — paid-tier CTAs route through Tasks's `/api/checkout`.

## 3 — Architecture decision check (E-2 dissent)

The sprint debated whether entitlements should live in Tasks (writer)
or Studio (writer). Studio won. Reading the result:

- The shared-DB module path is `src/lib/entitlements-db/` in **studio
  only** (full schema + writes). The other four repos hold
  `src/lib/entitlements-shared/` which is **reads-only** + tier enum
  + ranking helpers. That asymmetry is correct — only studio mutates.
- Tasks is the Stripe writer; webhooks land in Tasks DB *and* mirror
  to shared. The mirror is the load-bearing piece — if it fails, the
  reconcile cron picks up the gap on the next sweep.
- Sibling products do not call Studio for reads. They each open the
  shared Turso DB directly with `TURSO_ENTITLEMENTS_*` env vars.

**Verdict on E-2:** the lift to Studio was correct. The alternative
(Tasks as suite-wide entitlement writer) would have inverted product
ownership — Stripe webhook lives where pricing surface lives is
ergonomic, but coupling pricing-surface-as-marketing to billing-as-
backend would have made every billing schema migration touch Studio's
build. The current shape lets Tasks own Stripe end-to-end and
publishes through a shared substrate.

**Honest dissent against the chosen path:** if a second product needs
to write entitlements (e.g. Notes shipping a tier as part of N-1's
email-to-capture), the writer-in-studio rule forces a cross-repo
call. Pre-empt this by exposing `/api/internal/entitlements/grant`
as the canonical write path (already shipped) rather than letting
siblings open the DB write-token. Token scope discipline is the
maintenance cost of the chosen architecture.

## 4 — Outstanding operator todos

Sequenced for an operator running them solo. Items with no
agent-side prerequisite are marked **NOW**.

1. **NOW — Stripe live checkout test.** Use card `4242 4242 4242 4242`,
   any future expiry, any CVC. Walk:
   - Visit `signalstudio.ie/pricing` → click "Start a workspace" (Workspace tier CTA).
   - Land on Tasks `/api/checkout?tier=workspace` → redirected to Stripe checkout.
   - Complete checkout.
   - Confirm in Tasks DB that the user has an active `workspace` row.
   - Confirm in shared signal-entitlements DB that the same user has an active `workspace` row (the mirror).
   - Verify Roadmap allows creating a 2nd workspace (cap lifted).
   - Verify Analytics next briefing email is dispatched (or trigger cron manually).
2. **NOW — Free-tier gate walk in browser.** Sign in as a free user.
   - Tasks: invite a 4th member to a workspace → confirm gate fires with upgrade message.
   - Roadmap: try to create a 2nd workspace → confirm "Free includes one workspace" error.
   - Analytics: visit `/app/brief` → confirm the upgrade banner shows.
   - Notes: confirm there is no gate (deliberate).
3. **NOW — Comp-code regression test.** Redeem a Lamb's Hill code
   (any unused `LAMBSHIL-*`). Confirm:
   - Studio `license_codes` row updates.
   - Tasks `comp_codes` row updates.
   - Tasks user gets `wedding` tier in shared signal-entitlements DB.
   - User's first-touch lands at `/app/board?welcome=venue&v=lambs-hill`.
4. **Resend Inbound + DNS** for Notes capture-by-email (N-1 follow-up).
   Runbook: `notes/docs/INBOUND_EMAIL_SETUP.md`.
5. **Turso group token rotation.** 30-min coordinated rotation across
   all 5 Vercel projects when ready.

## 5 — What this validation pass did NOT do

For an honest record:

- Did not run a real Stripe checkout. Sandbox keys are set; the
  cross-product CTA route is shipped; the gate is documented; but no
  card has been put through.
- Did not Playwright-walk any of the gate surfaces. Each gate is
  verifiable from code as a structural check; the user-visible error
  message and CTA still need a human eye.
- Did not validate the `isUnlimited` path in Tasks against a real
  paying user with multiple workspaces. The code path is correct
  for all four paid tiers; the smoke test in §4 item 1 closes this.
- Did not audit the reconcile cron's daily cadence against the
  realistic Stripe webhook failure window. The hourly upgrade is a
  Pro-plan decision deferred until pilot scale (per memory).
