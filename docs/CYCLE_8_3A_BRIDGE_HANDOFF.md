# Cycle 8.3a — Redemption handoff bridge (studio side)

**Status:** shipped 2026-05-13. Studio side complete. Cycle 8.3b (Tasks-side consumption) is the explicit next cycle and the only thing standing between the venue pilot and a working end-to-end flow.

## What shipped this cycle

### Architecture decision: signed handoff to Tasks (Architecture B)

`/redeem/[code]` on studio renders the co-branded landing. CTA POSTs to `/api/redeem`. For venue-edition codes, the API signs an HMAC-SHA256 token encoding the redemption shape and redirects to `tasks.signalstudio.ie/sign-up?redemption=<token>`. Tasks's existing Clerk app completes the sign-up; Tasks-side post-sign-up logic (Cycle 8.3b) verifies the token and writes the entitlement to studio's DB.

Rejected: adding Clerk to studio (would require either a Clerk-app refactor or per-product accounts). Deferred: compliments + review_access redemption — they imply cross-product entitlements which require cross-product identity (Cycle 9+ problem). Those codes render an inline manual-provisioning view that surfaces a pre-filled mailto.

### Files shipped

| File | Purpose |
|---|---|
| `src/lib/redeem/token.ts` | HMAC sign + verify (stdlib-only, no crypto deps) |
| `src/app/api/redeem/route.ts` | POST handler — validates code, routes to handoff or manual page |
| `src/app/redeem/[code]/page.tsx` | CTA wired to form POST; new ManualProvisioningView for compliments/review_access; preview states extended |

### Env

| Var | Where | Notes |
|---|---|---|
| `REDEMPTION_HANDOFF_SECRET` | studio .env.local + Vercel prod (sensitive) | 64-hex (256-bit) HMAC secret. Generated 2026-05-13. **Tasks needs the same value in 8.3b.** |

### Verification this cycle

- `tsc --noEmit` clean
- `next build` clean — `/api/redeem` and `/redeem/[code]` both registered as `ƒ` dynamic
- Sign + verify roundtrip works with the real env secret (verified via tsx script):
  - Valid token: decodes payload correctly
  - Tampered token (single byte change in signature): `{ ok: false, reason: 'bad_signature' }`
  - Malformed input: `{ ok: false, reason: 'malformed' }`
- Token length: ~304 bytes (URL-safe; fits comfortably under common URL limits)

## Contract for Cycle 8.3b (Tasks-side consumption)

**This section is the spec Tasks-side code in 8.3b must implement against. Do not deviate without coordinating a token-version bump.**

### 1 · Token payload shape

```ts
type RedemptionTokenPayload = {
  v: 1;
  code: string;                 // "LAMBSHIL-MP93X"
  sponsor_slug: string;         // "lambs-hill"
  sponsor_name: string;         // "Lamb's Hill" (display copy for the welcome card)
  source_type: "venue_edition" | "compliments" | "review_access";
  tier: "free" | "event" | "wedding" | "workspace" | "studio";
  duration_days: number | null; // 365 for venue weddings, 90 for review, null = no expiry
  iat: number;                  // unix ms
  exp: number;                  // unix ms — currently iat + 10 minutes
};
```

Token format: `<base64url(JSON)>.<base64url(HMAC-SHA256(body, secret))>`.

### 2 · Verify on the Tasks side

Tasks should implement its own copy of `verifyRedemptionToken` — the source-of-truth is `studio/src/lib/redeem/token.ts`. The contract:

```ts
type VerifyResult =
  | { ok: true; payload: RedemptionTokenPayload }
  | { ok: false; reason: "malformed" | "bad_signature" | "expired" | "wrong_version" };
```

Tasks-side implementation should be a direct copy — stdlib `node:crypto` only, no extra deps. Future option: extract to a workspace package, but a copy is fine for two consumers.

### 3 · Env vars Tasks needs in 8.3b

| Var | Value | Purpose |
|---|---|---|
| `REDEMPTION_HANDOFF_SECRET` | same as studio (64-hex) | HMAC verify |
| `TURSO_STUDIO_DATABASE_URL` | `libsql://ethanmcnamara-studio-ethan387.aws-eu-west-1.turso.io` | Read entitlements + write license_codes status |
| `TURSO_STUDIO_AUTH_TOKEN` | full-access token to studio DB | (Same token currently set on studio. May want to create a Tasks-scoped token via `turso db tokens create ethanmcnamara-studio --expiration none` for revocability.) |

### 4 · Sign-up page change

Tasks's existing sign-up page (`src/app/sign-up/...`) must accept `?redemption=<token>` and pass it into Clerk's `unsafeMetadata`. Then Clerk fires `user.created` to the webhook with the metadata attached.

Pattern (Clerk's custom sign-up flow with metadata):

```tsx
// In the sign-up component:
const searchParams = useSearchParams();
const redemption = searchParams.get("redemption");

// When invoking signUp.create():
await signUp.create({
  emailAddress,
  password,
  unsafeMetadata: redemption ? { redemption } : undefined,
});
```

### 5 · Webhook handler change

Tasks's existing `src/app/api/webhooks/clerk/route.ts` already handles `user.created`. Extend the handler:

```ts
if (event.type === "user.created") {
  const user = event.data;
  const redemption = (user.unsafe_metadata as { redemption?: string })?.redemption;
  if (redemption) {
    await consumeRedemption(redemption, user.id);
  }
  // existing user-creation logic continues
}
```

`consumeRedemption` (new helper) does, atomically:
1. `verifyRedemptionToken(token)` — bail if !ok
2. Re-query studio DB: confirm `license_codes.code = payload.code AND status = 'minted'`. Bail if not (could be redeemed between sign-token-time and webhook-fire-time).
3. Insert `entitlements` row: `{ user_clerk_id: user.id, tier: payload.tier, source: payload.source_type, source_ref: payload.code, expires_at: payload.duration_days ? now + payload.duration_days * 86400000 : null }`
4. Update `license_codes`: `SET status='redeemed', redeemed_by_user_id=user.id, redeemed_at=now WHERE code=payload.code`
5. Insert `redemptions` audit row.

Wrap 2-5 in a Turso transaction.

### 6 · Workspace welcome card + skip welcome picker

After successful redemption, the user lands in Tasks. Two UX changes (per `VENUE_EDITIONS_PLAN.md` §6 Cycle 8.3):

- Read `getEntitlement(user.id)` (Tasks-side import of the studio helper, or HTTP-fetch from a small endpoint — TBD in 8.3b)
- If source = `venue_edition` + tier = `wedding`: skip `/welcome` picker, pre-create wedding workspace
- Show one-time dismissible card: *"Compliments of [VENUE_NAME]. Plan your wedding without the noise."* — sponsor_name comes from the token payload (no DB lookup needed)
- Replace strings: `"Pick a starter so you have something to play with"` → cleaner copy; `"Loaded · ready to open"` → cleaner copy

## Open architectural question for 8.3b

**How does Tasks read studio's entitlements long-term?** Two options:

- **Option A — Direct DB read.** Tasks holds `TURSO_STUDIO_*` env and imports `getEntitlement` from a duplicated `tasks/src/lib/entitlements/` (copy of studio's). Pro: fastest, simplest, matches the Cycle 6.3 precedent (signal reads Tasks's DB this way). Con: schema knowledge duplicated.
- **Option B — HTTP fetch.** Tasks calls `signalstudio.ie/api/entitlements/[clerkId]` (a new studio endpoint protected by a shared secret). Pro: schema owned in one place. Con: extra network hop on every paywall check (mitigated by per-request caching).

Recommendation: **Option A for 8.3b.** Mirrors the existing pattern in the codebase. Revisit if Notes/Timeline/Signal also need entitlement reads (then HTTP starts looking better).

## Acceptance checklist for 8.3a

- [x] Architecture B (signed handoff) decision documented + dissent named
- [x] `REDEMPTION_HANDOFF_SECRET` generated, set in .env.local + Vercel prod (sensitive)
- [x] HMAC sign + verify helpers in `src/lib/redeem/token.ts`
- [x] `POST /api/redeem` handler implemented
- [x] `/redeem/[code]` CTA converted from placeholder to form POST
- [x] Manual-provisioning interim view added for compliments/review_access
- [x] Preview states extended to cover manual_provisioning variants
- [x] tsc + next build clean
- [x] Sign/verify smoke test: roundtrip, tamper detection, malformed handling
- [x] 8.3b consumption contract specified

## What remains for Cycle 8.3b

- [ ] Tasks: add env vars (REDEMPTION_HANDOFF_SECRET, TURSO_STUDIO_*)
- [ ] Tasks: copy verify helper from studio
- [ ] Tasks: sign-up page reads `?redemption=` into Clerk unsafeMetadata
- [ ] Tasks: webhook handler consumes redemption — transactional entitlement write + status flip + audit row
- [ ] Tasks: import or duplicate `getEntitlement`; read on first session
- [ ] Tasks: skip welcome picker if entitlement source = venue_edition + tier = wedding
- [ ] Tasks: workspace welcome card with sponsor name
- [ ] Tasks: replace `"Pick a starter so you have something to play with"` and `"Loaded · ready to open"` strings
- [ ] Tasks: deploy + end-to-end test with `LAMBSHIL-MP93X`
- [ ] Vercel: set REDEMPTION_HANDOFF_SECRET on Tasks production (sensitive)
- [ ] Vercel: set TURSO_STUDIO_* on Tasks production

Once 8.3b ships, the flow is end-to-end live and Cycle 8.4 (operator surface) can start.
