# Lab 01 — the Shared Timeline and the venue welcome

Two briefs, three variants each, built in parallel and verified rendered. Both
gate capture freeze on 22 August. 2026-08-03.

**Previews**
- Timeline: `https://app-git-lab-timeline-ethanmcn2013-1730s-projects.vercel.app/lab/timeline-a` · `/lab/timeline-b` · `/lab/timeline-w`
- Welcome: `https://app-git-lab-welcome-ethanmcn2013-1730s-projects.vercel.app/lab/welcome-a` · `/lab/welcome-b` · `/lab/welcome-w`

**No screenshots in this sheet.** The browser pane was not displayed in this
session so no frame ever composited. Rather than paste something I did not see,
every variant was verified another way: route returns 200, content read out of
the served HTML, console clean, `tsc` clean, brand-voice lint clean, and the
hard constraints grepped. The previews are the look.

---

## Brief 1 — the Shared Timeline

> **CORRECTION, 2026-08-03. Do not pick from this brief.**
>
> This section originally read "no candidate implementation existed, so all three
> are from a blank page." **That was false.** A substantial Shared Timeline ships
> today: a 684-line artifact component with its own CSS module, model, contract
> tests and phone preview, an audience layer with an artifact studio and viewer
> tracker, a 312-line wedding theme, and a written owner-artifact contract. It
> had a design-review pass recently.
>
> The claim came from reading E06's absence from `BASELINE_REVIEW.md` §9's
> candidate-evidence table as absence from the codebase. It is an inference, it
> was wrong, and it was repeated in four places before the founder caught it.
> **E06.10's own title says "refine the desktop editorial Timeline shown in the
> Mara and Finn concept."** The backlog said it existed.
>
> These three variants are therefore **provocations against a design that already
> exists**, not a choice of direction. The correct step, which D-015 Q2 required
> before any of this, is an audit of the shipped artifact against E06's twelve
> tasks. That audit is running. Read its result before reading these.

The couple's public keepsake. The hero of *Before the Day*.

### A · the intentional vertical scroll

**The idea.** One moment at a time down a single column, with an indigo thread
that fills as the reader passes Now to Soon to Later and arrives at the day.

**What it does best.** It makes time feel physical instead of administrative.
The thread shortens as the wedding nears and the final card breaks into indigo
at nearly twice the type scale of anything before it, so the page's shape argues
"a year narrowing to a day" without a countdown, a progress bar or a badge.

**Honest cost.** Everything is one long pass, so a guest who just wants the date
scrolls the whole story to find it. Its two best devices lean on
`animation-timeline: view()`, which is recent in Safari and Firefox; older
browsers get a calm static page rather than a paced one.

### B · the editorial spread

**The idea.** Names and date get equal monumental billing on a masthead, and
every item leads with its date set as a bold numeral instead of trailing it as
metadata.

**What it does best.** It makes the two things people actually feel, who is
getting married and when, the visual subject of the page. It reads as a printed
order of service rather than a task list with good fonts.

**Honest cost.** It carries meaningfully more markup and custom sizing than six
short items need, so it only earns that weight if it reads as considered rather
than fussy. Its two most ambitious moves, the rotated section labels and the
soft glow behind the date, are the ones to look at first.

### W · the wildcard — staged as a short film

**The idea.** The background itself moves from candlelit night through dusk to
cream daylight across three acts, with Wedding Day as the sunrise climax.

**What it does best.** It makes the one date that matters actually feel like it
matters. Every other item gets the same quiet treatment; Wedding Day alone gets
the full-width arc, the largest numerals on the page, and the only moment the
canvas turns to daylight. That is exactly backwards from a dashboard, where
every row is deliberately equal, and it is the right way round for this.

**Honest cost.** Built for one slow linear read, not for reference. A parent
checking the date two weeks later scrolls a film to find one fact. It would not
survive a couple publishing fifteen items instead of six. And with no persistent
chrome, a mid-scroll screenshot carries no brand recall at all.

**Rules it broke, precisely.**
1. **The design register, entirely.** No Geist, no indigo anchor, no token palette. System serif paired with monospace. Its case: the page competes for feeling against actual wedding stationery, not against the product's other screens.
2. **Standard layout.** No cards, no dashboard structure, no persistent nav. Three full-viewport scenes. Its case: six items are a story with a beginning and an arrival, and a list flattens that.
3. **A single consistent visual identity.** Background and ink flip twice as you scroll. Its case: it turns "time is passing" into something the eye does rather than something the copy says.

It did **not** break: the three product constraints, accessibility (landmarks, unbroken heading order, skip link, contrast roughly 7:1 to 13:1, a genuinely static reduced-motion path), or voice.

---

## Brief 2 — the venue-branded welcome

The first thing a sponsored couple sees. The only moment the venue is visibly
the giver.

> **The brief moved mid-build.** D-027 point 3, ratified 2026-08-03 while these
> were compiling, sets venue branding at launch to the venue's **name only**: no
> logo, no venue-written message, no venue-controlled colour. **That kills B
> outright** and leaves A and W as the only live options. Both are name-only and
> both were checked against the decision after it landed: A carries the venue's
> name and nothing else, and W's wax seal carries "M · F", the couple's own
> monogram, not a venue mark.
>
> D-027 also turns this into a standing copy constraint before copy-freeze on
> 21 August: no sales asset, agreement, proposal page, film line, venue pack or
> outreach email may imply a venue's logo or its own words appear in the couple's
> workspace. That binds E11, E12.12, E12.13, E13.09 and E14.12.

### A · restrained

**The idea.** "Compliments of Glenmara House" small and unbadged between two
hairlines, then the couple's names arrive large and the venue is never mentioned
again.

**What it does best.** The sequencing. The emotional handoff from gift to
ownership happens in the page's rhythm rather than in its copy.

**Honest cost.** Restraint this literal lives or dies on execution. Slightly
wrong and the same layout reads as empty rather than composed, and a fast skim
could mistake its quietness for a lack of effort.

### B · hosted — **DEAD. Do not pick this.**

**D-027 point 3 was ratified while this was being built:** venue branding at
launch is the venue's **name only**. No logo, no venue-written welcome message.
B is built on a Glenmara House crest and a venue colour, so it is not a variant
that might lose. It is forbidden.

I am leaving it deployed and leaving this entry here rather than quietly
deleting both, because the lab is the record of what was explored and a silent
deletion would hide that the brief moved under the work. **The build was correct
against the brief it was given and is now out of scope.**

**What it is still worth for.** It is the only artifact that shows what the
launch decision actually costs. Look at it once and you can see what a venue is
not getting, which is a better basis for the sales conversation than a
description. Its handover moment, where the venue's presence recedes and the
page says "This is Mara and Finn's plan now. Glenmara House will not see what
goes in it from here", is a genuinely good idea that survives without any logo,
and it is worth lifting into whichever variant wins.

**Its cost was already the giveaway.** It invents a plausible Glenmara House
brand to test itself, and a real venue's logo would be worse, often much worse.
D-027 removes that whole failure mode.

### W · the wildcard — a gift arriving

**The idea.** Not a screen that loads but a present that arrives: "A gift has
arrived for Mara and Finn", sealed, and you break the seal to open it.

**What it does best.** It refuses the framing. A and B both answer "how much
venue branding is tasteful". W asks whether that is the question at all, and
treats the moment as ceremony rather than configuration.

**Honest cost.** A gate in front of the product. Charming once, friction on the
second visit, and the couple has to earn their way in before seeing anything
useful. Whether that is delightful or precious is exactly the judgement only you
can make.

---

## What held across all six

| Constraint | Result |
|---|---|
| Venue attribution one footer line, no logo, no badge (D-011) | Held in all three Timeline variants |
| No price anywhere | Held in all six |
| No "forever", "for life", "lifetime" | Held in all six |
| Brand voice, no em dash, no exclamation | Clean in all six |
| Renders, console clean | Verified in all six |
| `tsc --noEmit` | Clean in both worktrees |

**One fix I made after the build.** `timeline-w`'s pre-hydration script mutated
two attributes React never rendered, which produced a hydration mismatch React
explicitly will not patch. `suppressHydrationWarning` on both elements, verified
clean afterwards.

**One deliberate content change.** The canonical fixture's line "One reply to
Glenmara House, including dietary notes" was cut to "One reply to Glenmara
House." Dietary notes are Article 9 health data about guests who consented to
nothing. It is R-017, it is live in the shipped wedding template and on a public
marketing page, and it has no business on a public keepsake whatever that risk
resolves to.

**One thing to know.** The `app` repo is public, so these lab branches are
publicly visible. The fixture is synthetic so nothing real is exposed, and the
routes carry `robots: noindex`. Existing lab routes on `main` already sit in the
same position.

---

## The question

**Timeline: A, B, W, or a blend?**

**Welcome: A or W, or a blend?** B is out by D-027 and is not on the ballot.

If a wildcard wins, that is a signal about the rules rather than a preference,
and it triggers the calibration loop: a rule-friction report naming exactly which
breaks carried the win, and an honest verdict on whether the register is
miscalibrated or the on-brief variants were simply weaker work.

After the pick: implement properly on a feature branch, then delete both lab
branches and their worktrees. Every lab ends keep or kill.
