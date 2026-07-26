# Account Brief quality lift → 9.5+

Status: complete (implementation + tests).
Target: Design ≥9.5 · UX ≥9.5 · Practical utility ≥9.5.

## Shipped in this lift

- HQ nav longest-prefix active match (`/hq` no longer steals Account review)
- Collapsed founder fixture chrome; single sample chip inside product frame
- Portal decorative shadow removed; quieter review bar
- Access headline: “N codes ready to send.” + role denial copy
- Usage: text-only lifecycle state when coverage is not complete (no empty bars)
- Reports/Account: point-of-denial role explanations; Overview ↔ report journey parity
- Sticky mobile tabs + mount-safe tab scrollIntoView (hydration hardening)

## Plan

| Priority | Work | Outcome |
| --- | --- | --- |
| P0 | Fix hydration mismatch attributed to AccountReview; clear Next issue overlay | Clean runtime; no red badge during review |
| P0 | Mobile 390 tab reach with HQ shell open/closed | No click intercepts; full labels; snap + selected visibility |
| P1 | Collapse founder meta chrome after selection | One sample indicator inside product frame; advanced controls denser/quieter |
| P1 | Access headline grammar + role-disabled explanations | Editorial clarity; capability feedback at point of denial |
| P1 | Remove portal decorative shadow; tighten first-viewport hierarchy | Product frame reads as the composition |
| P2 | Usage suppressed/unavailable: text state only, no empty bars | Honest degradation without chart junk |
| P2 | Report preview / Overview parity polish | Same journey language and sample mark hierarchy |
| Gate | Desktop 1440 + mobile 390 browser pass; tests/typecheck/lint | Ready for founder 9.5 scoring |

## Non-goals

- Sponsor auth, live telemetry, entitlement mutation
- Reopening concept selection
- Parallel Education/Organisation full products
