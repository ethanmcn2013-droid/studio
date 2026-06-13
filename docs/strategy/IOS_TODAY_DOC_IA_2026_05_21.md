# Signal Studio iOS — Today Document IA Spec

**Status:** Canonical design source for the iOS app's native home surface.
**Authored:** 2026-05-21 (post 5-director panel review of 14-app iOS canon teardown).
**Supersedes:** none — first formal spec.
**Build state:** PRE-BUILD. iOS submission gated on Timeline + Signal reaching ≥9.5 (memo `project-ios-app-research-2026-05-19.md`).
**Read alongside:** `~/.claude/projects/-Users-ethanmcnamara/memory/project_ios_app_research_2026_05_19.md`, studio repo `BRAND.md`, studio repo `DESIGN.md`, studio repo `docs/SEAMLESS_ECOSYSTEM_PLAN.md` (the same "one suite, four products, native today" thesis as the web seamless plan, rendered for iOS).

---

## 0. Thesis (one paragraph)

The Today Document is not a navigation surface. It is the brand. The iOS suite app is identifiable by its home — the same way Things 3 is identifiable by its Today list, Day One by its timeline, Endel by its single-mode launch. Every world-class iOS app in the design canon treats the home screen as a curated artifact with structure, not a filter of a larger dataset. For Signal Studio that means: the iOS app's identity is not "we wrapped four products in a tab bar." It is "we made one home that talks to all of them." This artifact is also exactly what survives App Store Guideline 4.2 review — the rule that rejects "repackaged website" apps. Native today document + native auth + native push + native gestures = the four-load-bearing native layers. The four products live behind the home as remote-URL Capacitor WebViews, but the user's first ~10 seconds every day are 100% native.

---

## 1. The eight regions (top → bottom)

```
┌─────────────────────────────────────┐
│  R1  Status bar (native, paper)     │  ← iOS chrome, paper-white tint
├─────────────────────────────────────┤
│                                     │
│  R2  Greeting band                  │
│      "Good morning, Ethan."         │  ← time-of-day aware
│      Thursday, 21 May               │  ← editorial date string
│                                     │
├─────────────────────────────────────┤
│                                     │
│  R3  Anchor card  ──────────────    │
│         12                          │  ← New York serif 56pt
│         tasks done this week        │  ← SF Pro 17pt
│         Thursday was your busiest.  │  ← SF Pro 15pt secondary
│                                     │
├─────────────────────────────────────┤
│  TODAY                              │  ← section header 13pt UPPER +0.08em
│  ○  Final dress fitting walkthrough │
│  ○  Confirm Lamb's Hill floor plan  │
│  ○  Send Glenmara invoice           │
├─────────────────────────────────────┤
│  THIS EVENING            (post-3pm) │  ← conditional, hides 3am–3pm
│  ○  Pack rehearsal-dinner kit       │
├─────────────────────────────────────┤
│  COMING UP                          │
│  ▸  Lamb's Hill — final walkthrough │  ← Roadmap milestone
│     Tuesday                         │
│  ▸  Glenmara — handover             │
│     Friday                          │
├─────────────────────────────────────┤
│  CAUGHT YESTERDAY                   │
│  ◇  Voice memo — caterer follow-up  │  ← Notes ambient pull
│  ◇  Photo note — colour swatches    │
├─────────────────────────────────────┤
│  R8  Product switcher (bottom-fixed)│
│  ●Tasks  ◐Notes  ◑Roadmap  ◒Analy.  │  ← thumb-zone, native
└─────────────────────────────────────┘
```

| # | Region | Source product | Visible when | Tap behavior |
|---|---|---|---|---|
| R1 | Status bar | OS native | always | n/a |
| R2 | Greeting band | native (clock + Clerk profile) | always | n/a — never a button |
| R3 | Anchor card | Signal briefing engine | always (loading state if empty) | opens Signal product at the matching insight deep link |
| R4 | TODAY | Tasks (due:today + overdue collapsed) | always | row tap → Tasks WebView at that task; check-tap → native haptic + optimistic UI + bridge event |
| R5 | THIS EVENING | Tasks (due:today + tag:evening OR due:today + first-tagged-after-3pm) | 15:00–02:59 local | same as R4 |
| R6 | COMING UP | Timeline (next 7 days, public + private workspaces user owns) | always (collapses to header if empty) | row tap → Timeline WebView at the milestone |
| R7 | CAUGHT YESTERDAY | Notes (captured <24h ago, not yet promoted to Tasks) | conditional — shows if ≥1 item exists | row tap → Notes WebView at the note; long-press → "Promote to Task" sheet (native) |
| R8 | Product switcher | native, 4 product identities | always | tap → product WebView; double-tap own = jump to product home; swipe-up = two-context flick (see §5) |

---

## 2. Time-of-day adaptation (the "This Evening" trick from Things 3)

The greeting and the conditional "This Evening" section are the two time-aware mechanics. They are NOT decorative — they are the proof that the document reflects the user's reality.

| Local time | Greeting | Evening section | Anchor card variant |
|---|---|---|---|
| 04:00–11:59 | "Good morning, {firstName}." | hidden | yesterday's summary |
| 12:00–14:59 | "Afternoon, {firstName}." | hidden | this-week-so-far running count |
| 15:00–18:59 | "Afternoon, {firstName}." | **visible** | today-so-far |
| 19:00–02:59 | "Evening, {firstName}." | **visible** | today complete + tomorrow preview line |
| 03:00–03:59 | "Up late, {firstName}." | hidden | yesterday's summary |

Greeting and section visibility are recomputed on app foreground, never on a timer. No animation between states — the document just *is* what it is when opened.

---

## 3. States (every state named, no "loading…" hand-waving)

| State | What renders | Anti-pattern avoided |
|---|---|---|
| **Cold first launch** | One-screen onboarding (4 product lines, "Skip" defaults focus to "Get started"), then today doc with first-day empty state copy: *"This is where your day lives. Add a task to begin."* | No carousel. No "let's set up your account." No tour. |
| **Returning, empty** | Greeting + anchor card with the most recent non-zero metric (e.g. "12 tasks done last week") + a single line below all sections: *"Nothing today. Use the moment."* | No apology copy. No "you have no tasks!" with confetti. |
| **Offline** | Cached snapshot from last successful fetch + thin banner at top: *"Showing your day from 9:42 AM."* No errors thrown. | No blocking modal. No "you are offline" full-screen. |
| **Multi-day gap** (returning user, last open >7d) | All overdue collapsed into one row at top of TODAY: *"23 items overdue. Open ›"* — expandable in place, never a separate screen | No shame copy. No notification spam to "catch up." |
| **Slow network (>2s)** | Document renders with cached data immediately; spinner overlay only on the anchor card if it's >2s stale | No skeleton screens. No blinking placeholders. Stripe pattern — data loads before UI when possible. |
| **Push-permission denied** | Today doc loads normally; one passive line in Signal insight card on day 3: *"Want a morning brief? Enable notifications in Settings."* — once, never again | No re-prompt loop. No nag dot. |
| **All four products zero data** | Onboarding + single primary card: *"Pick where to start."* with the four product cards larger, equal weight | No card grid. No "explore" tab. No empty enterprise dashboard. |
| **Product down (e.g. Signal outage)** | Anchor card hides silently; the rest of the document is unaffected; tiny passive line in the gap: *"Insights resume soon."* | No suite-wide error. No retry button. The other 3 products are still fully usable. |

---

## 4. Typography spec (canon, not suggestion)

All sizes in pt. Line-height ratio is the second number.

| Element | Font | Size / leading | Weight | Color token | Tracking |
|---|---|---|---|---|---|
| Greeting | SF Pro Display | 22 / 28 | Semibold | `ink.primary` (#111) | -0.01em |
| Date string | SF Pro Text | 15 / 20 | Regular | `ink.secondary` | 0 |
| **Anchor numeral** | **New York** (Apple serif) | **56 / 60** | **Regular** | `ink.primary` | -0.02em |
| Anchor label | SF Pro Text | 17 / 22 | Regular | `ink.primary` | 0 |
| Anchor supporting line | SF Pro Text | 15 / 20 | Regular | `ink.secondary` | 0 |
| Section headers (TODAY etc.) | SF Pro Text | 13 / 16 | Semibold | `ink.tertiary` | +0.08em UPPERCASE |
| List item title | SF Pro Text | 17 / 22 | Regular | `ink.primary` | 0 |
| List item meta (e.g. "Tuesday") | SF Pro Text | 13 / 16 | Regular | `ink.tertiary` | 0 |
| Product switcher label | SF Pro Text | 11 / 14 | Medium | `ink.secondary` | +0.04em |

**Refusals:** never SF Pro Bold. Never SF Pro Light. No italics in UI (only allowed inside note body content inside the Notes WebView). One serif moment in the whole app — the anchor numeral — and nowhere else.

**Why New York for the numeral:** Mercury Weather's serif numeral is the single move users notice. SF Pro at any size still reads as "system app." A serif numeral at this exact placement and scale converts the home from "iOS app" to "personal artifact." It's a one-token choice with disproportionate identity payoff.

---

## 5. Color & contrast

| Token | Value | Usage |
|---|---|---|
| `paper` | `#FAFAF7` | document background, all surfaces |
| `paper.elevated` | `#FFFFFF` | (reserved — no use on Today doc; flagged for product detail surfaces) |
| `ink.primary` | `#111111` | all primary text, anchor numeral |
| `ink.secondary` | `#5C5C58` | supporting text, dates |
| `ink.tertiary` | `#9A9A95` | section headers, list metadata |
| `indigo` | `#4f46e5` | **active state only** — selected product in switcher, checkbox fill on completion, active deep-link arrow on tap, push-permission CTA. Never decorative. |
| `hairline` | `#EAEAE3` | section dividers (only between R6/R7, R7/R8) |

**Halide rule (active panel decision #9 IMPLEMENT):** indigo only ever means "active / selected / brand-presence." If indigo appears somewhere, the user should be able to predict it is interactive. Currently the web suite leaks indigo onto decorative dividers in 2 places (per panel audit) — the iOS shell does NOT inherit this drift.

---

## 6. Motion contract

| Interaction | Duration | Easing | Notes |
|---|---|---|---|
| Today doc cold open | 0 | n/a | document is rendered behind the splash; splash-to-doc is a fade (200ms) when data is ready |
| Card tap → product WebView | 350ms | `spring(response: 0.35, dampingFraction: 0.78)` | scale 1.0 → 0.97 on press, then card "opens" into the WebView with the source card's bounds as origin (Stripe pattern) |
| Task check-off | 220ms | ease-out | circle fills indigo, check stroke draws in 140ms, row dims to ink.tertiary after 320ms |
| Anchor numeral count animation | 600ms | ease-out | digit-by-digit flip when the count changes (e.g. on task.completed bridge event — pattern #13) |
| Section header reveal (rare) | 180ms | ease-out | only when a section transitions from empty→populated (e.g. first Note captured during session) |
| Two-context flick | 250ms | ease-in-out | crossfade between current and previous product card highlight + 4pt vertical lift on the new one |
| Pull-to-refresh | OS standard | OS standard | triggers cross-product re-fetch; spinner sits in the greeting band, not as an overlay |

**Reduced motion (system setting respected):** all spring/scale animations collapse to a 120ms cross-fade. Count animation collapses to instant replacement. Pull-to-refresh remains (OS-controlled).

**Haptic contract (panel decision #12):**
- `UIImpactFeedbackGenerator(.light)` on task check-off
- `UIImpactFeedbackGenerator(.medium)` on milestone publish (bridge event from Timeline WebView)
- `UINotificationFeedbackGenerator.notificationOccurred(.success)` on streak crossed — **only fires once per streak crossed in a session**, debounced
- No haptic anywhere else. No haptic on tap. No haptic on scroll. No haptic on swipe. The scarcity *is* the design.

---

## 7. Gestures (one per primary action, no more)

| Gesture | Surface | Action | Rationale |
|---|---|---|---|
| Tap row | R4/R5/R6/R7 list item | Open in product WebView | Standard. |
| Tap circle | R4/R5 leading circle | Toggle complete, optimistic UI + bridge event | The check-off ritual — the Tasks signature on the suite home. |
| Long-press row | R7 (Caught) | "Promote to task" native action sheet | The Notes→Tasks bridge already shipped on web (memo `project-notes-elevation-2026-05-19`); native sheet is the iOS surface. |
| Swipe right on row | any list row | Open in product (same as tap) | Reeder-derived. Backup gesture for users who developed RSS habits. Adopted *once* across the doc — never different swipes for different rows. |
| Swipe left on row | any list row | "Snooze to tomorrow" (Tasks) / "Dismiss" (Notes/Timeline) | One swipe direction per row, consistent across products. |
| Swipe up on product switcher | R8 | **Two-context flick** — swap to last-active product | The Arc Search move. The shareable suite-only moment. |
| Pull down on document | any scroll position above top | Refresh all four product summaries | OS standard, repurposed. |

**Refusals:** no horizontal carousel anywhere on this surface. No 3D Touch / Force Touch. No hidden-by-gesture-only navigation (panel #17 adapted — affordances visible). No swipe-to-delete (destructive, and we don't want users deleting on the home doc — that's a product-detail-surface action).

---

## 8. Native ↔ Capacitor contract (the bridge spec)

> **Implementation status (2026-05-21):** `/api/native/today` is **SHIPPED** as a server stub on top of the existing `/api/today` aggregator. The pure shaper at `src/server/today/shape-native.ts` implements the server-decides logic in §8b below — greeting bands, editorial date string, anchor card priority, section visibility — with 23 unit-test assertions. The iOS client side (Phase A4 onward) is not yet built. Endpoint doc: `docs/ios/today-native-api.md`. Known v1 limitations (workspace-row vs task-row granularity in §1 R4/R5) are named in that doc and will close when the aggregator grows item-level fidelity.


The Today doc is 100% native (SwiftUI). The four product surfaces are 100% remote-URL WebViews. The bridge is the conversation between them.

### 8a. Data flow

```
                ┌─────────────────────────────────────┐
                │  Today Document (SwiftUI)           │
                │  - Greeting / Anchor / 4 sections   │
                └────────────┬────────────────────────┘
                             │
                  GET /api/native/today
                             │
                ┌────────────▼────────────────────────┐
                │  Studio HQ aggregation endpoint     │
                │  (signalstudio.ie/api/native/today) │
                │  - reads from all 4 product DBs     │
                │  - returns shaped Today payload     │
                └─────────────────────────────────────┘
```

### 8b. The `/api/native/today` response shape

```typescript
type TodayPayload = {
  user: { name: string; timezone: string; locale: string };
  greeting: { phrase: string; dateString: string };
  anchor: {
    numeral: string;          // pre-formatted, e.g. "12" or "0"
    label: string;            // e.g. "tasks done this week"
    supportingLine?: string;  // e.g. "Thursday was your busiest."
    productSlug: "tasks" | "notes" | "roadmap" | "analytics";
    deepLink: string;         // canonical URL inside the product
  };
  sections: Array<{
    id: "today" | "evening" | "upcoming" | "caught";
    visible: boolean;         // server-decides — keeps client dumb
    items: Array<{
      id: string;
      productSlug: "tasks" | "notes" | "roadmap" | "analytics";
      title: string;
      meta?: string;          // date string, voice memo duration, etc.
      deepLink: string;
      canCheck?: boolean;     // R4/R5 task rows only
      isComplete?: boolean;
    }>;
  }>;
  meta: { lastUpdated: string; serverGeneratedAt: string };
};
```

Server-decides visibility (`section.visible`) is deliberate — the iOS client never owns "should I show This Evening" logic. The server reads the user's timezone and decides. This keeps the iOS app dumb and the truth single-sourced.

### 8c. Capacitor bridge events (WebView → native)

These are the cross-product coupling events (panel #13 IMPLEMENT). Each product WebView emits these via `Capacitor.Plugins.SignalBridge.emit(...)`:

| Event | From | Native does | Re-fetch? |
|---|---|---|---|
| `task.completed` | Tasks WebView | Animate Signal anchor count + light haptic | No — optimistic |
| `task.created` | Tasks WebView | Insert row into TODAY section if due:today | No — optimistic |
| `note.captured` | Notes WebView | Insert row into CAUGHT YESTERDAY section | No — optimistic |
| `milestone.published` | Timeline WebView | Medium haptic + insert into COMING UP if within 7d | Yes — debounced 1s |
| `workspace.opened` | any product | Update "last-active product" for two-context flick | No |
| `app.foreground` | native | Re-fetch `/api/native/today` if last fetch >5 min ago | Yes |

Optimistic events update the native UI without a server round-trip; the next foreground/refresh reconciles.

---

## 9. Onboarding screen (the panel concession)

CD wanted zero-onboarding (Endel model). UX overruled — audience is wedding planners and tradespeople, not designers. One screen, no carousel:

```
┌─────────────────────────────────────┐
│                                     │
│  signal studio.                     │  ← wordmark with terminal-dot
│                                     │
│  One home. Four tools.              │
│                                     │
│  Tasks      What's on today.        │
│  Notes      What you don't lose.    │
│  Roadmap    What others see.        │
│  Analytics  What's working.         │
│                                     │
│              ┌──────────────────┐   │
│              │  Get started  →  │   │
│              └──────────────────┘   │
│                                     │
│             Already signed in?      │
│                                     │
└─────────────────────────────────────┘
```

- One screen. No carousel. No skip-tour-of-five-screens.
- "Get started" deep-links to Clerk hosted sign-in (existing `signalstudio.ie` Clerk app, shared session across the suite — already shipped per memo `project-roadmap-clerk-prod-blocker-2026-05-17`).
- After auth, lands on Today doc. Never shows this screen again.
- The four product lines are the BRAND.md §3 voice-lines. Each is exactly 4-5 words, declarative, never a verb-imperative.

---

## 10. App Store 4.2 survival checklist (mapped to this spec)

Each row is the 4.2 reviewer-checkable claim and the spec line that satisfies it.

| Claim | Section in this spec | What reviewer sees |
|---|---|---|
| "Has substantial native UI beyond a webview" | §1 (8 native regions) | The Today doc is fully native SwiftUI; reviewer sees this immediately on launch. |
| "Native auth, not in-webview sign-in" | §9 | Clerk hosted sign-in via ASWebAuthenticationSession (native), not inside the product WebView. |
| "Native push notifications (APNs)" | panel #5 | Daily APNs push wired to the Signal briefing engine. |
| "Native offline state" | §3 (offline row) | Cached snapshot + banner — not a generic "no internet" page. |
| "Native gestures / haptics" | §6, §7 | 6 distinct gestures, 3 calibrated haptics — all native shell. |
| "Account deletion in-app" | (out of scope this doc) | Required separate sheet; reuses Clerk + Turso purge. Tracked in iOS submission punch list. |
| "Privacy nutrition label + PrivacyInfo.xcprivacy" | (out of scope this doc) | Required separate config. Tracked in iOS submission punch list. |
| "Sign in with Apple if any social sign-in offered" | §9 | Inherited via Clerk's hosted page — Clerk handles SIWA. |

This document specifically defeats the 4.2 "repackaged website" rejection. The Today doc is the load-bearing argument. The four product surfaces being WebViews is acceptable *because* the home isn't one.

---

## 11. Build sequencing (only the IMPLEMENT calls, in order)

Inherits from the panel's near-perfect punch list (Phase A/B/C). Re-stated here as iOS-specific work units.

**Phase A — Native shell foundation** (required before any external testflight)
- A1. SwiftUI scaffold for the 8 regions per §1 with mock data
- A2. Type/space/color tokens per §4–§5 wired as SwiftUI environment values
- A3. `/api/native/today` endpoint on studio HQ (server-side) — server owns visibility/locale logic per §8b
- A4. Capacitor shell wrapping 4 product remote URLs with the bridge skeleton per §8c
- A5. Clerk hosted sign-in via ASWebAuthenticationSession, shared session to WebView cookies
- A6. Splash → Today doc fade (200ms) per §6

**Phase B — Signature interactions** (the "world-class" inflection)
- B1. Anchor card with New York serif numeral + count-flip animation per §6
- B2. Spring card-open transition into product WebViews per §6
- B3. Three calibrated haptics per §6
- B4. Two-context flick gesture on R8 per §7
- B5. Capacitor bridge events with optimistic UI updates per §8c
- B6. Pull-to-refresh wired to `/api/native/today`

**Phase C — Retention + delight**
- C1. Daily APNs push from Signal briefing engine — permission ask deferred until first organic value moment (per panel #5 dissent resolution)
- C2. Long-press on Notes row → native "Promote to task" sheet
- C3. Multi-day-gap collapse behavior per §3
- C4. Time-of-day greeting + This Evening conditional rendering per §2
- C5. Offline cached snapshot per §3

**Phase D — App Store submission gating** (the 4.2 punch list per §10)
- D1. Account deletion sheet (Clerk + Turso purge)
- D2. Privacy nutrition label + PrivacyInfo.xcprivacy
- D3. Authed smoke test from first-launch through all 4 products
- D4. Submission

---

## 12. What this spec deliberately does NOT cover

- **Per-product detail surfaces.** Each WebView retains its own design. This spec governs the native shell only.
- **iPad layout.** Phone-only target for v1. iPad in v2 (split-view candidate, not the same IA).
- **Apple Watch.** Not in scope. The natural Watch surface would be the anchor card only; deferred.
- **Live Activities / Dynamic Island.** Not in scope for v1. Strong candidate for v2 once we know which insight users care about most.
- **Widgets.** Not in scope for v1. Strong candidate for v2 — the anchor card translates 1:1 to a medium widget.
- **Theming / dark mode.** Paper-white is the brand. No dark mode in v1; revisit only if user research demands it. Linear's warm-gray dark would be the reference if we ever do.

---

## 13. Risks named (the panel's strongest counter-arguments preserved)

1. **Three highest-leverage moves depend on Signal + Timeline maturity.** Items B1 (anchor numeral), B5 (bridge events), C1 (daily push) all require the Signal briefing engine + cross-product event bus at production quality. The operator already accepted this in the iOS memo (submission gated post-July). Re-stated so it is not a July surprise.
2. **iOS 26 Liquid Glass material.** Post-WWDC 2026, the native chrome may shift. Spec assumes pre-Liquid-Glass iOS 17–18 system materials. If WWDC 2026 reshapes navigation chrome, §6/§7 may need a revision pass.
3. **Server timezone logic carries truth.** §8b's server-decides-visibility is correct but means a server bug can break the Today doc for all users. Mitigation: visibility flags must be unit-tested, and the iOS client must render a sane default (all sections visible) if a flag is missing — never an empty document.
4. **The serif numeral is a one-shot decision.** §4 commits the app to New York for the anchor. If we ever want a second serif moment (e.g. greeting), we lose the singularity. Spec line: *the serif is the anchor numeral, and only the anchor numeral, until the spec is amended.*
5. **The two-context flick is discoverable only by accident.** Like Arc Search's original. Panel accepted this — the gesture's job is to delight power users, not to be the primary cross-product nav. The product switcher tap (R8) handles 95% of switching.

---

## 14. Cross-references

- `project-ios-app-research-2026-05-19.md` (memory) — the architectural decision to build a SUITE app with a native today spine, not 4 webview tabs.
- `project-seamless-ecosystem-2026-05-18.md` (memory) — the web-side counterpart: same thesis, different surface.
- `project-analytics-elevation-2026-05-19.md` (memory) — the briefing engine that powers R3 (anchor card) and the daily push.
- `project-notes-elevation-2026-05-19.md` (memory) — the Notes→Tasks bridge that the R7 long-press surfaces natively.
- `BRAND.md` — voice for §9 onboarding copy and the section header tone.
- `DESIGN.md` §13 — loading boundary canon (web). iOS shell inherits the principle; renders it natively per §3.

---

**End of spec. This document is the canonical reference for the iOS Today Document build. Amendments require operator sign-off + a 4-director re-review (creative-director, ux-director, architect, senior-engineer minimum).**
