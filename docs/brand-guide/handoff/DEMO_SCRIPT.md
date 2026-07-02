# Signal Studio · Live Pitch Script

**Runtime.** 4:00 exactly. Four sections. Per-section timing locked below.

**Audience.** A venue operator, a wedding planner, or any sharp creative partner meeting Signal Studio for the first time. They do not know the suite. They do not know the vocabulary. The script never reaches for one they would not use.

**Tone.** Declarative. Plain English. No exclamation marks. No three-adjective trios. The voice rules from `press-kit.md` §5 apply at every line.

**Setup before pitch.** Logged in to the demo workspace. Two browser tabs ready: `signalstudio.ie` for the umbrella, and `tasks.signalstudio.ie` for the product flow. Sound off.

---

## Section 1 · Umbrella pitch — 0:40

**What to say** (≈90 words, ≈40 seconds at a measured pace):

> Signal Studio is project management for the eighty percent not in tech. Wedding planners, freelance designers, tradespeople, students, the people the work routes through. It is four products that read as one. Tasks runs the work. Timeline explains the work. Signal surfaces what matters. Notes captures what is not ready for the room yet. The brand promise is one line. Clarity, not configuration. Every product opens usable on first paint, in plain English, with no setup.

**What to show.**

- Open `https://signalstudio.ie` on the umbrella tab.
- Stay on the hero — the H1 reads *Project management for the 80% not in tech.* The eighty-percent carries the indigo highlight.
- Scroll once, slowly, to reveal the four product wordmarks. Pause on the slow pulse of `signal studio.` — that gesture is the umbrella.

**Source paths for the presenter.**

- Hero: `studio/src/components/reveal/reveal-hero.tsx`
- Product grid: `studio/src/components/reveal/reveal-products.tsx`

---

## Section 2 · Four-product flow tour — 1:40 (25 seconds each)

The tour shows one operating year compressed: a wedding planner books a couple, opens a workspace, shares it, gets a daily briefing, captures what isn't ready. The order is Tasks → Timeline → Signal → Notes.

### 2a · Tasks (0:25)

**Say.**

> Tasks is where the work lives. Open a workspace, see your week. Five views, no setup. The dot pulses because the queue is alive.

**Show.**

- Switch tabs to `tasks.signalstudio.ie/app`.
- Land on the default workspace. Show the multi-view switcher. Spend the bulk of the twenty-five seconds on one view — Today or Week — and one card moving from in-flight to done.

**Source paths.**

- App entry: `tasks/src/app/app/page.tsx`
- Wordmark gesture (`tasks-dot-pulse`, 2.6s ease-in-out infinite): `tasks/src/app/globals.css:397`

### 2b · Timeline (0:25)

**Say.**

> Timeline is the public version of the workspace. The same plan, written so anyone can read it. Share a link. The recipient sees direction without a login.

**Show.**

- Switch to `timeline.signalstudio.ie/signal-timeline` (the live demo workspace).
- Show the public viewer with the three-view switcher. Land on the list view.
- Optional: open the calendar view to make the shareability concrete.

**Source paths.**

- Public viewer: `timeline/src/app/[workspace]/page.tsx`
- Wordmark gesture (`timeline-sweep`, 5.4s sweep): `timeline/src/app/globals.css`

### 2c · Signal (0:25)

**Say.**

> Signal is a briefing, not a dashboard. Three things in plain English. It arrives at six in the morning. If nothing moved yesterday, silence — the briefing skips, because silence is the message.

**Show.**

- Switch to `signal.signalstudio.ie/app`.
- Show the rendered daily briefing — three blocks, hard cap of three. Read the bold impact-lead line out loud.

**Source paths.**

- Briefing render: `signal/src/app/app/page.tsx`
- Builder pipeline: `signal/src/lib/briefing/build.ts`
- Wordmark gesture (`signal-tick`, 3.6s steps(1) infinite): `signal/src/app/globals.css`

### 2d · Notes (0:25)

**Say.**

> Notes is the layer for what is not ready for the room. Write here first. When a note becomes a task, promote it in one tap. Never auto-detected. The decision stays yours.

**Show.**

- Switch to `notes.signalstudio.ie/app`.
- Open one note. Demonstrate the promote-to-Tasks action — one tap, one task created.

**Source paths.**

- Note editor: `notes/src/app/app/page.tsx`
- Notes→Tasks extract: `notes/src/server/extract.ts`
- Wordmark gesture (`notes-dot-caret`, 1.1s sharp blink): `notes/src/app/globals.css:399`

---

## Section 3 · Wedding-operator proof — 0:50

The audience is the venue. This section makes the operating loop concrete using the Wave 1 venue ICP narrative.

**Say** (≈110 words, ≈50 seconds):

> The first pilots are Irish wedding venues. The venue books a couple. From the booking, a workspace is created. The couple plans inside it. The venue sees what the couple chooses to share — direction, updates, the artefacts that belong in the planning relationship. The couple gets the daily briefing. The venue gets a calmer year. Nothing leaks the other way. The couple workspace is private by default. The venue is not buying seats. It is backing the planning year for every couple it books. Annual prepay, fifteen hundred to four thousand euro, founding cohort locks fifteen hundred for life. Permanence, not a discount.

**Show.**

- Open `signalstudio.ie/venues` (the venue marketing page).
- Scroll to the four-layer planning loop diagram.
- Then switch to `signalstudio.ie/weddings` for two seconds to show the couple-facing surface.

**Source paths.**

- Venues page: `studio/src/app/venues/page.tsx`
- Wave 1 venue narrative: `studio/src/lib/venues/wave-one.ts`
- Weddings page: `studio/src/app/weddings/page.tsx`

---

## Section 4 · Redeem and venue signup CTA flow — 0:50

The close. Show the two doors the audience can walk through after the pitch.

**Say** (≈100 words, ≈50 seconds):

> Two paths from here. A couple with a venue code redeems at signalstudio.ie/redeem — one code, one workspace, twelve months. A venue ready to talk goes to signalstudio.ie/venues and uses the contact route at the foot of the page. The venue conversation is short. One demo, one call, one annual prepay. We are in the founding cohort window. The first fifteen venues lock fifteen hundred euro for life. That is the offer. Clarity, not configuration. Everything important. Nothing distracting. That is the suite.

**Show.**

- Open `signalstudio.ie/redeem/[code]` (use a real demo code if available; otherwise the empty redeem page at `signalstudio.ie/redeem`).
- Walk the redeem flow: enter code → workspace created → land in the workspace.
- Close on `signalstudio.ie/venues` with the contact link visible.

**Source paths.**

- Redeem flow: `studio/src/app/redeem/[code]/page.tsx`
- Venue contact route: `studio/src/app/venues/page.tsx` (footer contact link)

---

## Timing total

| Section | Runtime |
|---|---|
| 1 · Umbrella pitch | 0:40 |
| 2 · Four-product flow tour | 1:40 |
| 3 · Wedding-operator proof | 0:50 |
| 4 · Redeem and venue signup CTA | 0:50 |
| **Total** | **4:00** |

---

## Notes for the presenter

- The `/redeem` and `/venues` flows are live on the umbrella. Timeline workspace creation is paused in production until Upstash is provisioned — do not invite the audience to create a timeline during the live pitch. Read-only viewing is fine. See `KNOWN_LIMITATIONS.md` for the current caveat list.
- If the Tasks `/app` walkthrough behaves unexpectedly, fall back to `tasks.signalstudio.ie` (the marketing home with the cinematic demo) — the homepage demo is reliable and tells the same story.
- Reduced-motion preference is honoured everywhere. If the presenter has it on, gestures will be static — say so out loud rather than apologising for them.
