# DESIGN DOCKET — what "design directions" actually means

Written 2026-08-03 for I-009. **Zero design decisions have ever been ratified**
in this project. Twenty-four decisions cover commercial, legal, product boundary
and programme. None covers what anything looks like.

Forty open tasks have a design decision inside them. They collapse into **seven
real choices.** Four of the seven gate everything else. This page states what
each choice actually is, so it can be made rather than described.

**Nothing here is decided. Nothing here is a recommendation yet** — the workspace
ritual is labs-first: two or three genuinely different builds, one bolder than
feels safe, then you pick.

---

## The four that gate everything

### 1. What the Shared Timeline looks like

**Why it is first.** D-001 point 13 calls it "the principal emotional and visual
product artifact". It is the hero of *Before the Day* (E14.08). It is what a
couple shares with their family, so it is the only surface a venue's customers
see without logging in.

> **CORRECTION, 2026-08-03.** This section originally read "`BASELINE_REVIEW.md`
> §9 found no candidate implementation for E06 at all, this is a blank page, not
> a refinement." **That was false and it was my error.** §9's table lists tasks
> where candidate evidence was found at import; E06 is absent from the table, and
> I read absence from a document as absence from the codebase. It is not.
>
> What actually ships today: `app/src/modules/timeline/components/artifact/timeline-artifact.tsx`
> at 684 lines with its own CSS module, a model with contract tests and a phone
> preview; `app/src/modules/timeline/app/audience/` with the shared artifact,
> an artifact studio and a viewer tracker; `app/src/components/published/wedding-theme.tsx`
> at 312 lines; and `app/docs/TIMELINE_OWNER_ARTIFACT_CONTRACT.md`. It had a
> design-review pass recently.
>
> **E06.10's own title says "refine the desktop editorial Timeline shown in the
> Mara and Finn concept."** The backlog said it existed. I did not read it.
>
> Three redesign variants were commissioned on the false premise. This should
> have been the audit D-015 Q2 mandates, and that audit is now running.

**The choice.** D-001 point 15 gives the constraint, not the answer: shared
public artifacts "should feel owned by the couple rather than like public
productivity-software screens." That rules things out. It does not draw anything.
The real fork:

- **An intentional vertical scroll** (E06.09's own words). Mobile-native, one
  moment at a time, paced like a story someone reads on a phone at a kitchen table.
- **A desktop editorial spread.** Magazine register, generous type, photographs
  given room. Reads as a keepsake object rather than a feed.
- Or one of those as primary with the other as a genuine second layout, not a reflow.

**Gates:** E06.01 to E06.12, E14.08, E14.15 capture, E12.05, E07.17. **The longest
dependency chain in the programme runs through this.**

### 2. The venue-branded welcome

**Why it matters more than it sounds.** This is the first thing a sponsored
couple sees, and it is the only moment the venue is visibly the giver. Get it
gracious and the whole sponsorship model reads as a gift. Get it wrong and it
reads as advertising inside someone's wedding.

**The choice.** E05.02 fixes the words: "Compliments of [Venue]", no visible
price. It does not fix the register. D-011 point 2 already ruled on the *public
keepsake* — one line in the footer, no logo, no badge — but the welcome is a
different moment with a different answer available.

- **Restrained:** the venue's name set in Signal Studio's own type, no logo anywhere, one line.
- ~~**Hosted:** the venue's logo and colour on the welcome only, then it disappears entirely once the couple is inside.~~ **KILLED by D-027 point 3 (2026-08-03).** Launch branding is the venue's name only. There is no logo anywhere in the product and no venue-controlled colour. Do not mock this option.
- **Ceremonial:** a full welcome moment that feels like opening a gift, then never seen again.

~~E07.17 gives the venue branding *controls*, so the second question is how
much latitude a venue gets and where the ceiling sits.~~ **Answered by D-027 point 3: at launch a venue gets no branding controls and the latitude is zero.** E07.17's title predates that decision; imported backlog titles are never rewritten, so the title stays and its scope narrows. The open question is only which of the two surviving options — Restrained or Ceremonial — the name-only welcome uses.

**Gates:** E05.02, E05.12 (UI freeze), E07.17, E12.05, E14.11.

### 3. The indigo-dot motion language

**What it is.** E13.02: one visual idea connecting the map, the venue pin, the
Timeline milestone and the Signal Studio mark. It is the through-line that makes
*Limerick First* feel like Signal Studio rather than a stock template, and it is
reused in *Before the Day* at the map-pin-to-milestone transition (E14.08).

**The choice.** Whether the dot is literal (a pin that becomes a milestone),
structural (a system of points and connections), or restrained to the point of
being almost absent. This is Codex's lane to execute, but the language is a
direction, and it is upstream of the storyboard.

**Gates:** E13.07, E13.10, E13.11, E13.14, E13.17, E14.08.

### 4. Before the Day's narrative arc

**The choice.** E14.02 states the arc as "fragmented planning to one calm
sponsored experience", and E14.03 opens on "messages, email, phone notes,
journals and disconnected decisions". The open question is how the *before* is
shown. Played for chaos it becomes a caricature of a stressed couple, which is
the register the brand forbids. Played too gently there is nothing to resolve.

**Gates:** E14.03, E14.06 to E14.11, E14.14, E14.15 capture.

---

## The three that can wait, but not past copy freeze

### 5. The Founding Venue certificate (E12.11)

01/25 to 25/25 at €1,000. This is the scarcity object — the thing a venue puts
in a proposal or on a wall. **Choice:** formal and engraved, or restrained and
modern. It is the one asset where the brand's usual restraint may be the wrong
answer, because the whole point is that it feels like a thing worth having.

### 6. How far the sales assets depart from the product's restraint

The deck (E12.10), the venue sales kit (E12.12) and the couple welcome kit
(E12.13). **Choice:** do they hold the product's quiet register, or is a sales
asset allowed to be warmer and more persuasive than the product it sells.

### 7. What "world-class design-system review" means (E05.11, E05.12)

E05.12 is the operational definition of UI freeze, and nothing currently defines
its bar or says who calls it. **Choice:** name the bar and the seats. The `/panel`
ritual already does this at 9.5/10 by default. This is a one-line answer, but
without it E05.12 cannot pass and UI freeze has no test.

---

## The schedule problem, stated plainly

| Freeze | Date | Days | Needs decided |
|---|---|---|---|
| Offer | 15 Aug | 12 | none of these |
| **UI** | **20 Aug** | **17** | **1, 2, 7** |
| Copy | 21 Aug | 18 | 5, 6 |
| **Capture** | **22 Aug** | **19** | **1, 2, 4** — the film films the product |
| Film lock | 28 Aug | 25 | 3, 4 |

Capture freeze is the tightest date in the programme. It needs E05 and E06
substantially built and approved in nineteen days, and E06 has no head start at
all. **Every day decision 1 slips comes off the build, not off the freeze.**

## What I recommend, and what I need from you

Deciding four directions from a blank page in two days is not realistic. Deciding
four directions by **picking between built options** is.

**The proposal:** run `/lab` on **1 and 2** — the two product surfaces, which are
my lane. Two or three genuinely different builds each, deployed as previews, one
bolder than feels safe, plus the standing wildcard. Options in front of you
Tuesday, you pick Wednesday.

**3 and 4 are Codex's lane.** They need a written direction brief from you rather
than a lab from me, and they are downstream of 1 anyway — the motion language and
the film narrative both point at the Timeline.

**7 costs you one sentence** and I would take it now: name the bar, and I will run
`/panel` against it at E05.12.

**The question back to you: do you want the labs on 1 and 2 started now?** That is
the only thing standing between here and a Wednesday decision.
