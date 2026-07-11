# Venue Outreach Sequence

Status: held draft - 2026-05-26
Owner: founder
Boundary: do not send. These are working drafts for later founder approval after sales pack, motion/video, tracking, and ops rehearsal are ready.

---

## Rule

No email is sent until the no-outreach gates in `VENUE_GTM_EXECUTION_PLAN.md` are complete.

This sequence exists so the message can be refined now while the visual system, motion graphics, and demo material are being built.

---

## Positioning

| Element | Decision |
| --- | --- |
| Sender | Founder. Plain text. No mail merge feel. |
| Recipient | Owner/operator, GM, wedding director, or events lead with a credible path to the signer. |
| Ask | A short venue conversation, not a product demo. |
| Proof | One-page sales pack + 30-second video or `/venues/demo` link once approved. |
| First batch | 10-12 venues maximum. Wave 1 only. |
| Cadence | Day 0, Day 5, Day 14. Stop after three unless they engage. |
| Tone | Calm, specific, not flattery-heavy. |

---

## Personalization Slots

Use these before sending. Never send a generic version.

| Slot | Required | Example |
| --- | --- | --- |
| `[venue_name]` | Yes | Tankardstown House |
| `[specific_observation]` | Yes | "Your Orangery/walled-garden wedding flow already reads like a planned journey." |
| `[venue_pain_guess]` | Yes | "I imagine the last month before a wedding still creates repeated questions around timing, supplier access, and final numbers." |
| `[proof_link]` | Yes, once ready | 30s video or `https://signalstudio.ie/venues/demo?...` |
| `[pdf_link]` | Yes, once ready | One-page PDF |

---

## Email 1 - Founder Introduction

**Subject options**

| Option | Use when |
| --- | --- |
| Signal Studio for [venue_name] couples | Most direct. |
| A planning layer for [venue_name] couples | Slightly warmer. |
| Fewer repeated planning questions | Use for wedding-led venues where coordinator pain is obvious. |

**Body**

```text
Hi [first_name],

I am building Signal Studio for premium wedding venues: a planning layer the venue gives every couple after booking.

The venue pays once a year. Each couple gets a code. They open a calm wedding workspace with the venue's name in a quiet line at the top.

The point is simple: fewer confused couples, fewer repetitive emails, and a planning experience that still feels like [venue_name] after the booking is signed.

I was looking at [specific_observation]. It made me think [venue_name] is exactly the kind of venue where the planning year should feel as considered as the day itself.

Here is the short version:
[proof_link]

And the one-page note:
[pdf_link]

Would it be worth a short conversation?

Ethan
Signal Studio
```

---

## Email 2 - Practical Follow-Up

Send on Day 5 if no reply.

**Subject**

`Re: Signal Studio for [venue_name] couples`

**Body**

```text
Hi [first_name],

Just following this once.

The thing I am trying to solve is not "more wedding software." It is the admin that comes back to a venue when couples are planning through email, WhatsApp, spreadsheets, and old PDFs.

For a venue, the operation is deliberately small:

1. You pay once a year.
2. You give each couple a code.
3. The couple gets eighteen months of Signal Studio.
4. Your team has nothing to run.

The couple never sees a price.

If this is not for [venue_name], no problem. If repeated planning questions are a real thing for your wedding team, I would value 20 minutes to show you the shape.

Ethan
```

---

## Email 3 - Close The Loop

Send on Day 14 if no reply.

**Subject**

`Closing the loop`

**Body**

```text
Hi [first_name],

I will close the loop here.

My guess may be wrong, but I suspect venues with the strongest service reputation are also the ones most exposed to planning noise between booking and wedding day.

Signal Studio is my attempt to make that middle stretch calmer without asking the venue to run another system.

If it becomes relevant later, the venue page is here:
https://signalstudio.ie/venues

All the best,
Ethan
```

---

## LinkedIn Connection Note

Use only if the person is clearly active on LinkedIn. Do not use as a mass channel.

```text
I am building Signal Studio for premium wedding venues: one planning layer a venue gives every couple after booking. Thought it might be relevant to [venue_name].
```

---

## Post-Reply Branches

| Reply | Response |
| --- | --- |
| "Send more information" | Send the one-page PDF and ask one question: "Is repeated planning admin a live issue for your team, or is the current process already calm?" |
| "We already have planners" | "That usually helps. The question is whether the planner, couple, suppliers, and venue are all working from one current picture. Signal Studio is for that shared picture." |
| "We are too busy right now" | "Completely fair. Is there a better month to revisit, or should I leave it?" |
| "What does it cost?" | "Venue Edition is EUR1,500 per venue/year, prepaid. Founding venues lock that price for as long as they stay. The couple never sees a price." |
| "Who else uses it?" | Be honest. "This is the founding cohort, so the early venues are shaping the motion before there is a case study." |
| "Can we see a demo?" | Offer the setup ritual, not a feature demo: "The best version is 25 minutes with one real upcoming wedding from your side. I build the shape live, you see whether it is useful." |
| "No thanks" | Thank them and stop. No nurture unless they explicitly invite it. |

---

## First Batch Recommendation

Start with 10-12 accounts from Wave 1.

| Batch | Venues |
| --- | --- |
| A | Tankardstown House, Ballymagarvey Village, Clonabreany House, Boyne Hill House Estate |
| B | The Millhouse, Rathsallagh House, Bellingham Castle, Darver Castle |
| C | Markree Castle, Castle Leslie Estate, Cliff at Lyons, Kilkea Castle |

Batch A is the most natural first send because it gives a tight Meath/North-East cluster plus venue styles that are premium but not impossibly corporate.

---

## Send Readiness Checklist

| Gate | State required before sending |
| --- | --- |
| Sales pack | One-page PDF designed and founder-approved. |
| Proof link | 30-second video or polished `/venues/demo` proof approved. |
| Tracking | Every link uses the tracking contract in `VENUE_TRACKING_AND_CONVERSION.md`. |
| Ops | One test code redeemed end to end. |
| Personalization | Every email has a specific venue observation. |
| CRM/log | The send can be logged against venue, wave, touch, and response. |

