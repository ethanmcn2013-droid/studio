# Cycle 8 · Wedding Demo Script (60 seconds)

**Status**: locked draft · ready for storyboard
**Brand-current revision**: 2026-05-16 — Scenes 1, 10, 11 re-aligned to design-system v1 (DESIGN.md §2). The original draft predated the 2026-05-13 paper-white lock and the antique-gold retirement (2026-05-11); it specified a warm-stone background, antique-gold hairlines, and a non-locked closing line. Frame timing and all verbatim real prose are unchanged — only the visual register and the closer moved.
**Owner**: Ethan (render); Claude (script + frame timing)
**Source artefacts** (all live):
- `notes.signalstudio.ie/wedding-planning/` — context
- `tasks.signalstudio.ie/templates/wedding-planning-workspace` — execution
- `roadmap.signalstudio.ie/wedding-planning/update` — direction
- `analytics.signalstudio.ie/wedding-planning` — attention
- `signalstudio.ie/weddings` — the conversion page

**Format**: 60-second hero video for the `/weddings` page, venue outreach, and the signal-demo Remotion repo. Two render targets: 16:9 (embed) + 9:16 (social).

**Voice register**: typography-first like the existing `/demo`. No voiceover in v1. Real prose drawn verbatim from the four shipped artefacts. Silence is the signal — the brand position holds.

---

## Frame timing — 60 seconds @ 30fps = 1800 frames

| Scene | Frames | Seconds | What's on screen | Notes |
|---|---|---|---|---|
| 1 · Hold | 0–60 | 0–2 | Paper-white background (`--paper` #ffffff), single centred hairline rule (`rgba(17,17,17,0.10)`, 1px, ~120px wide) | Design-system v1 opening grammar — matches the brand-current Signal demo. Hairlines do the work shadows would. |
| 2 · Eyebrow | 60–180 | 2–6 | Mono eyebrow types in: `WEDDING PLANNING · WITHOUT THE SPREADSHEET CHAOS` | Stark statement. Names the wedge and the enemy in one line. |
| 3 · Problem line | 180–360 | 6–12 | Eyebrow fades. Headline word-by-word: *"Four weeks out. Three live suppliers. One date held but not confirmed."* | Real situation a wedding planner recognises. No abstractions. |
| 4 · Notes scene | 360–600 | 12–20 | Cut to a notebook-paper card with the venue meeting note (real prose from notes/wedding-planning). Words type in over 4 seconds. Bottom-left mono tag: `NOTES · CONTEXT` | The meeting as it actually happened. |
| 5 · Notes extract | 600–780 | 20–26 | The note card pulls up. Four small cards rise underneath: Actions / Decisions / Questions / Risk. Each shows one real line. Bottom-left tag swap to `→ TASKS · EXECUTION` | The "context becomes work" moment. Plain English, no auto-detect framing. |
| 6 · Tasks workspace | 780–960 | 26–32 | Cross-fade to the wedding workspace template — six tag groupings visible in a clean list: Venue / Suppliers / Guest list / Final week / Decisions / Risks. Bottom-left tag: `→ ROADMAP · DIRECTION` | Real, no fake screenshot. Pull a frame from `tasks.signalstudio.ie/templates/wedding-planning-workspace`. |
| 7 · Timeline shared | 960–1140 | 32–38 | The workspace simplifies into the shared update view — three columns: Now / Needs attention / Next. One sentence each. Bottom-left tag: `→ ANALYTICS · ATTENTION` | The artefact you forward to the couple. |
| 8 · Signal briefing | 1140–1380 | 38–46 | Background goes paper-white. Briefing format: `Good morning. Four weeks to go. Here's where the wedding stands.` Then the three Needs Attention items from `analytics.signalstudio.ie/wedding-planning`. | The Sunday morning before the suppliers wake up. |
| 9 · Suggested focus | 1380–1500 | 46–50 | One line: *"Chase the Lambs Hill visit today — it is blocking the venue decision."* | One thing to do today. The point of the briefing. |
| 10 · Closer | 1500–1680 | 50–56 | Pull back. Four layer marks dim onto screen in mono caps, stacked: `notes · tasks · roadmap · analytics`. An indigo period (`--accent` #4f46e5) appears under each at 1700, 1720, 1740, 1760. | Suite reveal — one product across four scenes. Periods are indigo, not gold (gold retired 2026-05-11; only the literal `signal studio.` wordmark period in Scene 11 retains the gold detail). |
| 11 · Wordmark | 1680–1800 | 56–60 | `signal studio.` wordmark fades in centred (period carries the broadcast gesture — one concentric ring outward, once). Below in mono: `Clarity, not configuration.` | Closing register: the locked suite tagline (BRAND.md §1 / DESIGN.md §1), not a one-off line. |

---

## Real prose to use (verbatim, no invented copy)

### The note (Scene 4)
> "Walked through Highfield House with Aoife and Conor. Niamh needs the final guest count by 12 May and dietary list by 4 June. They're holding the date but need a €4,200 deposit by 2 June. Conor wants to see Lambs Hill before deciding."

(Compressed from the live notes demo to fit the 4-second window. Full version stays on the site.)

### The four extract cards (Scene 5)
- **Actions** · "Pay 50% deposit (€4,200) by 2 June."
- **Decisions** · "Catering: 4-course with vegetarian option for 22 guests."
- **Questions** · "Lambs Hill vs Highfield — decide before 2 June."
- **Risk** · "Date held, not confirmed. 2 June deadline is hard."

### The briefing (Scene 8 — needs attention)
> "The Highfield deposit (€4,200) is due in 9 days, and Niamh has been waiting on confirmation.
> The final guest count was due 5 days ago.
> Lambs Hill visit hasn't been booked, and the venue decision is held up by it."

### The suggested focus line (Scene 9)
> "Chase the Lambs Hill visit today — it is blocking the venue decision."

---

## Music + voice

**Voice**: none in v1. Test typography-only first. If venue feedback during outreach says voiceover would land harder, record a 60-second soft VO in v1.1 — Stark+Jobs register, Irish or neutral British accent, ~140 words.

**Music**: low-key cinematic piano + light strings, ~70 BPM, no drum kit. Reference: the Signal typography demo's silence-as-signal register. If music is added, it should sit at -18 dB under the visuals and fade out by Scene 10. Avoid Epidemic Sound's "corporate inspiration" packs — too generic.

**Aspect ratios**:
- 16:9 1920×1080 for `/weddings` embed and email outreach
- 9:16 1080×1920 for Instagram Reels / TikTok / social posts. Same frame timing; type wraps differently.

---

## Brand register guard

Every sentence must pass BRAND.md §3 banned-word check before render. Specifically:
- No "AI", "intelligent", "automatically", "predicts", "recommends" anywhere.
- No "stakeholder", "burndown", "sprint", "epic".
- No 3-adjective hero trios.
- No exclamation marks.

The narration register is declarative, factual, period-terminated. The video earns conviction from real prose + clean motion, not from claim copy.

---

## What this demo does NOT do

- Does not show the Signal live briefing product (which doesn't exist yet — the demo points at the marketing artefact)
- Does not show a sign-up flow or pricing
- Does not name a competitor
- Does not mention "Signal HQ" — that surface is internal
- Does not promise email delivery, integrations, or AI features

The whole point is to show one wedding, walked across four layers, in plain English. If a venue coordinator watches it and says "that's the meeting I had last week" — the demo worked.

---

## Render target paths

**Standalone Remotion project**: `~/Projects/personal/analytics-demo/`. Add a new composition `SignalWeddingDemo` (or fork `SignalAnalyticsDemo.tsx`) parameterized for wedding scenes. Both compositions can share the same code with a `wedge: "analytics" | "wedding"` prop.

**Output files**:
- `out/demo-wedding-wide.mp4` (16:9 1920×1080)
- `out/demo-wedding-vertical.mp4` (9:16 1080×1920)

**Embed locations after render**:
- Copy 16:9 to `studio/public/demo-wedding.mp4` and embed at `signalstudio.ie/weddings` hero
- Copy 16:9 to `analytics/public/demo-wedding.mp4` and embed under `analytics.signalstudio.ie/wedding-planning`
- Keep 9:16 in signal-demo `out/` for social — Ethan posts manually

---

## Open calls for Ethan

1. **Voiceover**: typography-only v1, or record VO from the start? Default: typography-only.
2. **Music**: silent v1, or commission a 60-second piano piece? Default: silent.
3. **Render window**: this week, or after the first 3 venue conversations to incorporate feedback? Default: render after first 3 conversations so the demo reflects what venues actually ask about.
