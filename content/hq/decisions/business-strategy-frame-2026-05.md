---
id: business-strategy-frame-2026-05
title: Business-strategy frame — coordination clarity for the 80%, venues as the commercial wedge
category: Strategy
date: 2026-05-16
status: Active
reviewDate: 2026-06-16
relatedObjects: [docs/strategy/BUSINESS_PARTNER_REVIEW_2026_05.md, docs/strategy/VENUE_EDITION_STRATEGY.md, docs/strategy/VENUE_EDITION_VIDEO_BRIEF.md, docs/MARKETING_PLAN_6MO.md, venue-editions-paid-tier, Founding Venue Programme]
---

## Decision

The mission-control frame for the next cycle. Canonical detail in `docs/strategy/BUSINESS_PARTNER_REVIEW_2026_05.md`; this is the HQ-facing summary.

**North Star.** Signal Studio helps non-technical people coordinate important work without making everyone learn project-management software. The category is coordination clarity for the 80% who don't work in tech — not productivity software, not wedding software.

**Current wedge.** Premium venues, as the lead *commercial* motion (who pays first). Distinct from the lead *product* story, which is Roadmap (the visible artifact an outsider can open without an account). The two stack: a venue is sold a calmer planning experience for its couples (Notes → Tasks); the forwardable proof of that calm is a Roadmap.

**Product hierarchy** (canonical, replaces prior orderings):
1. Roadmap — what people see. The shareable public artifact.
2. Tasks — where the work happens. The operational engine.
3. Notes — where work begins. Private context capture.
4. Analytics — what tells you what needs attention. A morning briefing, not a dashboard.

**30-day focus.** One complete wedding-venue demo · one premium public Roadmap example · one venue-facing landing page · 20 founder-signed venue outreaches · track only the five metrics.

**Five metrics.** Qualified replies · booked calls · paid pilots (the proof gate, target ≥ 1) · couples activated · shared artifacts. Nothing else gets a number this cycle.

**Next decisions.** (1) Founder finalises the 20-venue list against the qualification criteria in VENUE_EDITION_STRATEGY.md. (2) Founder settles the first paid pilot — the single event the cycle exists to reach. (3) Coordinate the dedicated `/hq` strategy *view* with the parallel HQ-mission-control session rather than racing `src/lib/hq/data.ts` (this decision file is the contract-compliant interim surface).

## Reason

Two instructions in the brief sound like one and are not: "make Roadmap the lead story" and "venues are the wedge." Holding them apart is the strategy. Roadmap is the lead product narrative because it is the only surface legible to someone who never logs in; venues are the lead commercial motion because a premium venue owner is a buyer with real money, weekly pain, sole sign-off, and a cohort of couples behind one signature. Collapsing them — selling a public roadmap to a privacy-sensitive couple, or letting "wedding" into the umbrella positioning — breaks both. Ambition is also separated from proof: the first goal is not €250k, it is one venue paying real money unprompted by a discount (see MARKETING_PLAN_6MO §0.5 proof gate).

## Risks

Wedding trap (vertical swallows the 80% positioning). Buyer ≠ sufferer (coordinator feels the pain, owner signs — sale stalls in the gap). Diffuse low-grade pain rarely buys. Roadmap mis-sell (reads as "we sell a public page"). Demo-vs-reality drift. Founder-time concentration (whole motion is founder-signed; single point of failure for 30 days, accepted not mitigated).

## Kill / pivot triggers

Pre-committed so the call is cheap now, not emotional later. **Kill the venue wedge** if 20 founder-signed outreaches + their calls produce zero paid pilots within 60 days and the stated reason is consistently "not worth paying for." **Pivot the buyer** (not kill) if venues engage warmly but cannot sign because the sufferer isn't the buyer — move to planners/coordinators who own their P&L. **Pivot off weddings** if the same pitch lands faster with a different premium coordinator in unsolicited inbound. **Stop, do not pivot,** if pilots sign but couples don't activate — that means the product, not the wedge, is the problem. No trigger fires on vanity metrics; only on the five.

## Notes

Spine: `docs/strategy/BUSINESS_PARTNER_REVIEW_2026_05.md`. Venue operating detail (sales narrative, pricing logic, objections, qualification, success metrics, kill triggers): `docs/strategy/VENUE_EDITION_STRATEGY.md`. Production-ready video brief (30/60/90s, storyboard, VO, motion + sound, website/LinkedIn/outreach variants): `docs/strategy/VENUE_EDITION_VIDEO_BRIEF.md`. Marketing plan now carries a proof-gate layer above the revenue scenarios (§0.5). Homepage/products/pricing/metadata/messaging.md reordered to the product hierarchy above (Roadmap-first), brand-gated through signal-brand-voice. A dedicated `/hq` strategy view is owed and deliberately deferred to avoid racing the live parallel HQ-mission-control session on branch `feat/hq-mission-control-2026-05-16`.
