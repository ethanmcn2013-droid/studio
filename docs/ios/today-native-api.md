# /api/native/today — iOS-shaped Today payload

The iOS native presentation layer on top of `/api/today`. The native client renders this payload directly — it does not own greeting strings, anchor-card selection, date formatting, or "should This Evening render right now." The server owns all of that so a single truth holds across the suite.

Type contract: `src/server/today/types.ts` (`TodayNativePayload`, `TodayNativeRequest`).
Shaper:       `src/server/today/shape-native.ts` (pure, unit-tested).
Route:        `src/app/api/native/today/route.ts`.
Tests:        `src/server/today/shape-native.test.ts`.
Spec source:  `docs/strategy/IOS_TODAY_DOC_IA_2026_05_21.md` § 8b.

## Architectural separation

```
                       (raw per-product slices,
                        stable contract for web
                        seamless-ecosystem widget)
                              ▲
                              │
                       /api/today  ──── aggregateToday()
                              ▲                 │
                              │                 │ reads 4 product Tursos
                              │                 ▼
/api/native/today  ──► shapeNativePayload()  (no I/O — pure)
       │                      │
       │                      └─► server-decides:
       │                            • time-of-day greeting (§2)
       │                            • editorial date string
       │                            • anchor card priority
       │                            • section visibility flags
       ▼
(iOS-shaped TodayNativePayload — render-ready)
```

`/api/today` stays the canonical raw aggregator (web widget still consumes it, contract unchanged). `/api/native/today` is the iOS-specific presentation wrapper. Both endpoints share the same `SUITE_API_KEY` Bearer auth and the same upstream Turso reads.

## Request

```http
POST /api/native/today
Authorization: Bearer $SUITE_API_KEY
Content-Type: application/json

{
  "clerkId": "user_2abc…",
  "email": "anya@example.ie",
  "name": "Anya Smith",          // optional — first-name drives greeting
  "timezone": "Europe/Dublin",   // optional — IANA; falls back to analytics.timezone, then UTC
  "locale": "en-IE"              // optional — BCP 47; defaults to en-IE
}
```

The iOS app's backend proxy is the caller. The proxy authenticates the user via Clerk hosted sign-in (via ASWebAuthenticationSession), then forwards the request with the resolved Clerk identity. `name`, `timezone`, and `locale` come from the Clerk user object — the native client never types them by hand.

Server-decides logic uses `nowMs` if supplied (server-only, test-only override) otherwise wall-clock `Date.now()`.

## Response

```typescript
type TodayNativePayload = {
  user: {
    name: string;        // First name, "Anya"
    timezone: string;    // IANA, "Europe/Dublin"
    locale: string;      // BCP 47, "en-IE"
  };
  greeting: {
    phrase: string;      // "Good morning, Anya."  (§2 time-of-day rule)
    dateString: string;  // "Thursday, 21 May"     (locale-formatted)
  };
  anchor: {
    numeral: string;            // "12", "0", "—"
    label: string;              // "tasks shipped in the last day"
    supportingLine?: string;    // "3 still in your court."
    productSlug: "tasks" | "notes" | "roadmap" | "analytics";
    deepLink: string;           // canonical product URL the anchor card opens
  };
  sections: Array<{
    id: "today" | "evening" | "upcoming" | "caught";
    visible: boolean;     // server-decides — client renders if true, hides if false
    items: Array<TodayNativeItem>;
  }>;
  meta: {
    lastUpdated: string;        // ISO — aggregator generation time
    serverGeneratedAt: string;  // ISO — shaper generation time
    reads: {                    // per-product health, pass-through from aggregator
      tasks: "ok" | "skipped_no_env" | "error";
      notes: "ok" | "skipped_no_env" | "error";
      roadmap: "ok" | "skipped_no_env" | "error";
      analytics: "ok" | "skipped_no_env" | "error";
    };
  };
};
```

### Anchor card priority (§1 R3)

The shaper picks the most-interesting headline in this order:

1. **Tasks shipped in the last 24h** — positive momentum signal. Includes a supporting line when there are still items in court.
2. **Timeline milestones shipped this week** — forward-look momentum.
3. **Items currently in your court** — the unfinished-work signal when nothing has shipped.
4. **Notes captured** — the lightest hook when no task/timeline data exists.
5. **"Your day starts here."** — first-run / fully empty state.

### Section visibility rules (§2)

| Section   | Visible when                                                              |
| --------- | ------------------------------------------------------------------------- |
| `today`   | Always.                                                                   |
| `evening` | Local hour ∈ [15:00, 02:59]. Hidden 03:00–14:59. Driven by user timezone. |
| `upcoming`| ≥1 upcoming Timeline milestone in the response.                            |
| `caught`  | Notes touched within the last 36 hours.                                   |

The native client trusts the `visible` flag — it does not re-derive these rules.

## Status codes

| Status | Meaning                                                            |
| ------ | ------------------------------------------------------------------ |
| `200`  | Success. `TodayNativePayload` body.                                |
| `400`  | Body malformed or missing `clerkId` / `email`.                     |
| `401`  | Missing or wrong Bearer token. Timing-safe compare.                |
| `500`  | Shaper threw. Aggregator per-product errors do NOT 500 — they surface via `meta.reads`. |
| `503`  | `SUITE_API_KEY` not set in the deployment.                         |

`Cache-Control: no-store, private` — never cached, per-user, time-sensitive.

## Known v1 limitations

These are honest gaps named so they aren't surprises when the iOS build starts.

- **Workspace-level row granularity in `sections[].items`.** Today and Evening sections currently surface workspace-summary rows (`"Hartwell Wedding"` / `"3 in your court · 1 blocked"`), NOT individual task titles. The aggregator's `TaskSummary` returns counts, not items. Wiring item-level fidelity requires extending `aggregate.ts` to read a few actual tasks per workspace — a follow-up cycle when iOS build starts. The IA spec's R4/R5 wireframe shows task-title rows; the v1 endpoint returns workspace-row rows that are still useful but read differently.
- **Evening section mirrors Today.** Until the aggregator returns per-task due-time, the Evening section's items are the same as Today's. The visibility logic is correct; the item discrimination is the gap. Same follow-up cycle as above.
- **`canCheck` / `isComplete` are always false.** Native check-off lights up once aggregator returns item-level data.
- **Notes "caught" surfaces only the single most-recent note.** Multi-note surface needs aggregator extension (`recentNotes: NoteItem[]`).
- **Timeline member workspaces are silently omitted** (inherited from `aggregate.ts`).

When item-level data lands, the route signature does not need to change — the `items[]` array grows fidelity, the iOS client renders more.

## Operator provisioning

No new env vars beyond what `/api/today` already requires (see `docs/ios/today-api.md` § Operator provisioning). The native route reuses `SUITE_API_KEY` and the four product Turso pairs.

## Test coverage

`pnpm test` runs `src/server/today/shape-native.test.ts` — 20+ assertions covering:
- Greeting bands across all four time-of-day windows + edge hours (3, 4, 11, 12, 15, 18, 19, 23, 0, 2).
- Evening visibility across timezones (Dublin and Pacific at the same UTC moment).
- Anchor priority (shipped-24h → timeline-7d → in-court → notes → welcome) including singular/plural label correctness.
- Section visibility flags and item shaping (workspace metadata, deep-link composition).
- Name resolution (full name → first; email local-part fallback).
- Timezone fallback chain (request → signal.timezone → UTC).
- Reads health-map pass-through.

The shaper is a pure function — all tests run against synthetic `TodayResponse` fixtures, no network, no DB, no real time.

## Migration target

When studio gains `@clerk/nextjs`, this route should migrate from the `SUITE_API_KEY` Bearer to a Clerk session check and derive `clerkId` / `email` / `name` from the session rather than the request body. One-cycle migration, low risk — the shaper and the aggregator stay unchanged.

## Cross-references

- `docs/strategy/IOS_TODAY_DOC_IA_2026_05_21.md` — the IA spec this endpoint implements.
- `docs/ios/today-api.md` — the raw aggregator this endpoint composes on top of.
- `docs/ios/auth-bridge.md` — how the iOS app's backend proxy authenticates the user before calling here.
- `docs/ios/data-flow.md` — broader cross-product data flow context.
