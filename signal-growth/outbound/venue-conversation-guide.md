# Venue Conversation Guide

**Owner**: Ethan (use) · **Status**: ready · **Format**: not a form — a conversation shape

The structured ask Ethan brings to every founding-venue conversation. Shared with the venue coordinator 24 hours ahead of the call so they know the conversation has a shape, not a sales pitch.

Voice register from `BRAND.md` §3: declarative, warm, factual, plain. No "discovery call" language. No "pain points". No "north star metric". A founder asking a venue coordinator what their actual day looks like.

---

## Before the call (Ethan's prep, 10 minutes)

1. Re-read this venue's entry in `wedding-venue-list.md` — the reason-this-venue sentence and the source.
2. Open `signalstudio.ie/weddings` and confirm the demo loads cleanly on the device Ethan will share-screen from.
3. Have one specific question ready that names something from the venue's own site or recent feature — proves attention, not a template.
4. Block 45 minutes on calendar (30 min target + 15 min buffer for the conversation running over).

---

## Send 24h ahead of the call

Short email, plain text. Subject: `For tomorrow — quick shape of the call`.

> Hi [Name],
>
> Looking forward to our chat tomorrow at [time]. Here's the shape so you know what to expect.
>
> **First 5 minutes** — how you actually run wedding coordination today. Notebook, inbox, calendar, anything else. No software talk.
>
> **Middle 15 minutes** — I'll walk through the wedding planning workspace. Real workspace, not slides. You tell me what's missing, what's wrong, what's interesting.
>
> **Last 10 minutes** — if it looks useful, what a founding venue pilot would actually mean for [Venue Name]. If not, what would have to be true for it to be useful.
>
> No prep needed. The whole thing is in plain English.
>
> Ethan

---

## The conversation (30 minutes)

### Part 1 · How you run it today (5 minutes)

**Open**: "Before I show you anything, walk me through what wedding coordination at [Venue Name] actually looks like from your side. Don't simplify it — the messy version is the useful one."

Listen for:
- What tools they reach for (notebook? inbox? spreadsheet? specific software?)
- Where information gets lost (the bridal party group chat? Forgotten supplier email?)
- What the painful 48-hour window before a wedding looks like
- Whether they coordinate with couples directly or only suppliers
- Whether they think the couples *should* see the plan

Don't interrupt with "so we built Signal because…". Just listen. One follow-up question per topic, then move on.

---

### Part 2 · Walk the workspace (15 minutes)

Share screen. Open the live wedding workspace at `tasks.signalstudio.ie/templates/wedding-planning-workspace` and walk it the same way every time:

1. **The notebook entry** — open `notes.signalstudio.ie/wedding-planning/`. "This is the venue meeting note. Real prose, no auto-detect. The next move is approving extracts into the workspace."
2. **The workspace** — the 18 tasks across Venue / Suppliers / Guest list / Final week / Decisions / Risks. "This is what couples and the coordinator both see. Same workspace, different views."
3. **The shared update** — `roadmap.signalstudio.ie/wedding-planning/update`. "This is the artefact you forward to the couple. One URL, no login. They read it in 30 seconds."
4. **The briefing** — `analytics.signalstudio.ie/wedding-planning`. "This is what arrives on the Sunday before the wedding. The three things to chase that week."

**Pause every 90 seconds**: "What's missing? What's wrong? What's interesting?"

The coordinator's verbatim answers are the data. Write them down (literally — paper notebook, not laptop, so they see the listening).

---

### Part 3 · What a pilot would look like (10 minutes)

Two paths from here.

**Path A — they're interested.**

- "What would the first wedding through this look like? Real wedding, real couple."
- "Who from your side would use it most — you, the bridal team, suppliers, the couples?"
- "What's the one thing that would have to be true before you'd put a real couple through it?"
- "If it works for one wedding, does it scale to all 25 you do this year?"

End with: "Let me send a written summary of what we agreed in the next 24 hours. If it lands well, the next step is a 30-minute setup call to put the first wedding through it."

**Path B — they're skeptical or it's not the right time.**

- "What would have to change for this to be useful?"
- "Is the wrong piece the workspace, the couples-facing page, the briefing, or the offer itself?"
- "Is there a different shape of wedding venue this would fit better — bigger, smaller, more rural, more hotel-style?"

End with: "Thanks for the honesty. The pilot offer stays open if circumstances change. Mind if I follow up in three months?"

---

## What to capture (within 2 hours of the call)

In `wedding-venue-list.md`, update this venue's block with:
- `Conversation held`: YYYY-MM-DD
- `Outcome`: declined / interest / pilot / pending
- Notes (append below the entry block, indented):
  - **What they actually do today** (one paragraph)
  - **What landed in the demo** (one paragraph — direct quotes where useful)
  - **What didn't land** (one paragraph — this is the most valuable data)
  - **The one thing they'd want changed before piloting** (one sentence)
  - **Next step agreed** (one sentence with date)

---

## What this guide deliberately does NOT have

- **No NPS score**. A 0–10 rating from a sample size of 3 conversations is noise. Real prose beats fake quantification.
- **No "decision criteria" matrix**. Couples-facing page works or doesn't. Workspace works or doesn't. Plain-language answers compound; matrices don't.
- **No "next steps" template the coordinator fills out themselves**. Ethan writes the summary. That's the founder's job during a 10-venue pilot.
- **No "would you recommend" question**. They haven't used it yet. Asking would mark Signal as a SaaS pretending to be further along than it is. BRAND.md §2.2 fails this test if it appears.
- **No reference offer ("if you bring two other venues you get..."**). Founding venue is the offer. Don't water it down.

---

## After three conversations

Three is the deadline-relevant count. After the third conversation, before any product change:

1. Read the three entries side-by-side in `wedding-venue-list.md`.
2. Find the **one pattern** that appears in all three "what didn't land" paragraphs. That's the thing to fix.
3. Find the **one pattern** that appears in all three "what landed" paragraphs. That's the thing to lead the next 10 emails with.
4. Update `wedding-venue-outreach-kit.md` if the pattern justifies a script change.
5. Update HQ `founding-venue-pilot` programme `feedbackCollected` count.

If the three conversations point in different directions — the pattern is "the wedge is too broad" or "the offer is wrong for the segment". That's the cycle to bring back to HQ for a decision.
