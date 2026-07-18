---
id: platform-migration-supabase-auth
title: Decide the Supabase + Cloudflare + Google OAuth platform migration
status: open
priority: P1
blocking: false
phase: Platform foundation
why: This is a direction-setting call only the founder can make. It re-platforms identity and the database off two managed vendors, so it needs a founder go/no-go and a trigger before engineering touches auth or the live lead book.
href: /hq/decisions
date: 2026-07-18
action: "Review the expert panel consensus below, approve the target architecture (Supabase as the identity + data core, Cloudflare as the edge shield, Vercel as the host, Google primary sign-in), and set the trigger that unlocks the heavy Phase 1 and Phase 2 migrations. The two cheap, reversible wins in Phase 0 can be authorized to start immediately."
product: "Studio umbrella and all suite apps (analytics, tasks, notes, timeline, signal) plus the entitlements/licensing system, the waitlist, and the CRM lead books."
recommended: "Adopt Supabase as the Clerk replacement (not Cloudflare). Make Google OAuth primary with an email magic-link fallback. Keep Cloudflare as DNS/WAF/DDoS/Turnstile/R2 in front of Vercel. Keep Vercel as the Next.js host. Ship Phase 0 now; gate Phase 1 (DB swap) and Phase 2 (auth swap) behind a written trigger; never migrate DB and auth in the same release."
alternatives: ["Do nothing now: keep Clerk + Turso, and only add Google OAuth as a sign-in method inside Clerk to capture the conversion win with zero migration.", "Commit to the full migration immediately as a dedicated project if a concrete trigger already exists (a paying multi-seat/SSO deal, or a Clerk/Turso cost-or-limit cliff)."]
default: "If left undecided, the suite stays on Clerk + Turso. Nothing breaks. The strategic upside (vendor consolidation, owned identity, RLS multi-tenancy, cross-suite SSO) stays unrealized, and the Google-primary conversion win stays unshipped."
consequence: "Deferring is safe. The only real cost is opportunity: no cross-suite single sign-on as a product feature, and continued spend on two managed vendors that Supabase could consolidate."
trigger: "Unlock Phase 1 and Phase 2 when a concrete pain point lands: the first paying multi-seat or SSO deal that requires cross-domain SSO and RLS tenant isolation, OR a Clerk/Turso pricing-or-limit cliff. Phase 0 needs no trigger."
---

## Background

In this session a five-person expert panel (platform architecture, identity/security, data, product, brand) pressure-tested a three-part proposal: use Cloudflare instead of Clerk, Google OAuth as primary sign-in, and Supabase instead of Turso. The panel reached consensus. This to-do is the founder go/no-go on that consensus.

## The one reframe that unlocks everything

"Cloudflare instead of Clerk" is a category error. Cloudflare is not a customer auth provider. Its nearest product, Cloudflare Access, is an internal-team ZTNA gateway, not customer sign-in. The real Clerk replacement is Supabase Auth, which ships Google OAuth natively. So the three requests collapse into one coherent architecture:

- Adopt Supabase as the linchpin (Auth + Postgres). This is what actually retires Clerk and makes Google primary.
- Keep Cloudflare, but as the edge and security layer (DNS, WAF, DDoS, Turnstile, R2), not as auth.
- Keep Vercel as the host. Do not drift into a Workers migration.

## Panel verdict per proposal

1. Cloudflare instead of Clerk: REJECT as framed. Re-role Cloudflare to the front door. Supabase Auth replaces Clerk.
2. Google OAuth primary: ADOPT WITH CHANGES. Primary, not only. Add email magic-link fallback (and ideally Microsoft), plus account-linking so one email equals one identity.
3. Supabase instead of Turso: ADOPT WITH CHANGES. The genuine prize (Auth + DB + RLS + Storage consolidated), but only via a phased, dual-write, reversible migration. Never a big-bang cutover of the 148 live leads.

## The one disagreement, and how it was resolved

Product argued this is the right destination but the wrong sprint (premature infra churn pre-scale). Everyone else assumed proceed-but-sequenced. Chair resolution: adopt Product's gating for the heavy work, adopt everyone's sequencing for how it runs. Ship the reversible near-zero-risk pieces now; hold the irreversible DB and auth cutovers behind a written trigger and a staging parity gate.

## Steps (recommended sequence)

1. Phase 0, now, no trigger needed, reversible, near-zero risk:
   - Make Google OAuth the primary sign-in with an email magic-link fallback (configurable in the current stack).
   - Instrument the waitlist to signup to activation funnel by auth method, so we have data to justify or kill the later platform move.
   - Put Cloudflare in front of Vercel: DNS, WAF, DDoS, Turnstile on the waitlist and auth forms, R2 for asset offload. This replaces nothing we rely on and hardens the perimeter.
2. Phase 1, trigger-gated, high risk, reversible behind a flag:
   - Migrate Turso to Supabase Postgres as a database swap only, auth untouched.
   - Pin the Supabase project to an EU region (Ireland, eu-west-1) for data residency.
   - Route all serverless traffic through the Supavisor transaction-mode pooler (port 6543) with prepared statements off.
   - Port the Drizzle schema from the libsql dialect to the pg dialect (serial/identity, real boolean, timestamptz, jsonb, real foreign-key enforcement).
   - Migrate the 148 live leads plus app tables via dual-write and field-level checksum diff. Retain the Turso snapshot for rollback. No big-bang.
3. Phase 2, trigger-gated, high risk, harder to reverse:
   - Cut auth over from Clerk to Supabase Auth, preserving Google primary.
   - Wire cross-subdomain SSO (cookie domain .signalstudio.ie) and ship one-login-across-the-suite as a real product feature, not a silent swap.
   - Re-key the entitlements/licensing system to auth.users.id. Auth answers "who are you"; entitlements answer "what may you do". Keep them separate.
4. Never migrate the database and auth in the same release. One reversible change at a time.

## Non-negotiable guardrails the panel is holding

- Data: no big-bang cutover of the lead book. Dual-write, field-level diff, retained Turso snapshot, or it does not ship. Watch SQLite to Postgres type coercion (boolean, datetime, JSON) and newly enforced foreign keys.
- Security: RLS becomes the primary data boundary. Default-deny, policies keyed to auth.uid(), CI fails if any customer table has RLS off. The service_role key is server-only, never in a NEXT_PUBLIC var, rotated at cutover. A leaked service_role key equals a full breach.
- Platform: Cloudflare scoped to the front door only. Do not let "use Cloudflare" drift into leaving Vercel for Workers.
- Product: entitlements and Stripe are a protected contract with regression tests. The waitlist gate must survive the OAuth change and cannot be bypassed by Google sign-in.
- Brand: if Clerk's polished UI goes, auth becomes a first-class product surface. One shared light-locked @signal/auth-ui package across all six subdomains, a spec-exact "Sign in with Google" button, every state designed (idle, focus, loading, success, error), and Clerk's accessibility bar held (focus ring, keyboard path, aria-live errors). If we cannot hold that bar, we do not leave Clerk.

## First decision to make when you pick this up

Approve or reject the target architecture, then either authorize Phase 0 to start now, or set the trigger that unlocks Phase 1 and Phase 2. If you want, this can also be promoted into a formal entry in /hq/decisions with alternatives and a review date.
