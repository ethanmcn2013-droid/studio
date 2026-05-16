# Shipped state — the reality anchor

**Purpose.** This file is the single source of truth for *what is actually
live*. The marketing factory's **Reality Anchor** agent cross-checks every
product claim in every asset against this file before it reaches the founder
queue. If a claim is not supported here, the asset is rejected. Marketing copy
may describe what is in this file. It may not describe anything that is not.

**Rule for this file:** a line only moves to "live" when the URL responds and
the path through it works for a real user. "Built" is not "live". When in
doubt, it is not shipped — say less, truthfully.

**Last verified:** 2026-05-16 (subdomains curled → 200; cross-checked against
the 2026-05-14 suite audits).

---

## The suite

| Product | URL | State | Safe to claim |
|---|---|---|---|
| Signal Tasks | tasks.signalstudio.ie | **Live** | "Live now." Plain-English task workspace. Multi-view. Real persistence (Turso). |
| Signal Roadmap | roadmap.signalstudio.ie | **Live, with one caveat** | "Live now." Public roadmap, shared updates. **Caveat below — do not claim write reliability in prod until Upstash is provisioned.** |
| Signal Notes | notes.signalstudio.ie | **Live** | "Live now." Capture, then promote a note into a task in one tap. Never auto-detected. |
| Signal Analytics | analytics.signalstudio.ie | **Live** | "Live now." The daily briefing — three things in plain English. Real Tasks-DB read, daily + Monday cron. |
| Signal Studio (umbrella) | signalstudio.ie | **Live** | Marketing surface, pricing, /weddings, /venues, /redeem, /dispatch, /brand. |

**The `/pricing` "in build" labels for Notes and Analytics are stale as of
2026-05-16.** Both shipped (Notes 2026-05-14, Analytics end-to-end
2026-05-13). The pricing rebuild corrects this. Until the page is redeployed,
treat Notes/Analytics as **live** for copy purposes — saying "in build" about a
shipped product is itself a reality violation.

---

## Per-product detail

### Signal Tasks — live
- Standalone Next.js 16 workspace. Turso/libSQL persistence (migrated 2026-05-08).
- Auth via Clerk; `/app/*` redirect fixed.
- Cinematic homepage demo, multi-view app, marketing site.
- Tier enforcement is real here (the only product that gates tiers today).
- **Do not claim:** features behind Turnstile+Clerk that are env-blocked from
  live-cert. The `/app` live walkthrough is not operator-verified end-to-end.

### Signal Roadmap — live, one hard caveat
- roadmap.signalstudio.ie responds 200. Public viewer + 3-view switcher shipped.
- **Caveat (load-bearing):** production has no Upstash env. The rate limiter
  denies 100% of writes until the operator provisions Upstash and redeploys.
  **Copy may say Roadmap is live and show the public/read experience. Copy may
  not invite a reader to create or edit a roadmap in prod** until this clears.
  The marketing plan gates M1 on this exact fix.

### Signal Notes — live
- Full Next 16 + Clerk + Turso build at notes.signalstudio.ie.
- Cross-repo Notes→Tasks extract edge shipped (Cycle 9.4b).
- Deferred (do not claim): email-to-capture, FTS5 search UI, mobile share sheet.

### Signal Analytics — live
- analytics.signalstudio.ie shipped end-to-end 2026-05-13.
- Real Tasks-DB read → briefing engine (triggers + phrasings) → web render at
  `/app` + Resend email with RFC 8058 unsubscribe → Vercel cron 06:00 UTC
  daily + Mondays weekly.
- **Claim "daily briefing" only** — per the 2026-05-10 reality-alignment pass,
  do not reintroduce "team activity", "decelerating sharply", or slow-burn
  cadence language. Three things, hard cap of three.

---

## Pricing — the live truth (post 2026-05-16 ratification)

The factory may state these and only these prices:

| Tier | Price | Shape |
|---|---|---|
| Free | €0 forever | One workspace, all products, three editing guests. |
| Student | €0 with verified .edu | Workspace tier, two-year window. |
| Workspace | €12 / month, **or €120 / year prepaid** | Unlimited workspaces. Annual prepay stated plainly — **no "SAVE 17%" theatre.** |
| Event | €79 one-time, 12 months | One event-shaped workspace. Unchanged. Not a lever. |
| **Venue Edition** | **€1,500–€4,000 / year, prepaid annually** | The venue stands behind every couple's planning. Patronage, not enterprise SaaS. Founding cohort (first ~15) locks €1,500 for life — **permanence, not a discount.** |

**Banned in venue copy** (BRAND.md §3 + the 2026-05-16 decision): "free for
your couples", "with our compliments", "the gift", "12 months free", "no card",
"on us", seats, per-user, MSA, license, "SAVE", discount banners, enterprise.
The venue *pays Signal Studio*. Say that with a straight back.

---

## Programmes

- **Founding Venue Programme** — paid annual patronage (see pricing). Lamb's
  Hill is the in-flight pilot; if it converts it is honoured at the founding
  €1,500 lock. Per-couple redemption codes, co-branded eyebrow only, 12-month
  couple duration, auto-drop to Free at month 12. The *mechanic* is unchanged
  by the 2026-05-16 decision; only the money reversed (venue now pays).
- **Review access** — press, 90 days, named as such. Unchanged.
- **With our compliments** — this phrase now refers ONLY to founder-issued
  family/friends comp accounts. It is **no longer the venue model** and must
  never appear in venue-facing copy.

---

## How the Reality Anchor uses this file

1. Extract every factual product/price/availability claim from the asset.
2. For each claim, find the supporting line here. No support → reject with the
   unsupported claim quoted.
3. "Live" claims require a row marked **Live** above. A caveated product may be
   described as live only within its caveat.
4. Price claims must match the pricing table exactly, including the banned-copy
   list for venue assets.
5. Output: `status: pass | reject`, and for rejects, the exact line and why.
