# Signal Studio · Vision

What this document is: the **strategic context** any agent needs to make sound judgment calls on this suite. BRAND.md handles voice, naming, visual register. VISION.md handles intent — where we're going, why, and what we're explicitly *not* building.

Read this after BRAND.md, before touching code or copy.

---

## 1 · What Signal Studio is

Signal Studio is a four-product suite for the 80% of working people who don't work in tech and have been failed by every productivity tool ever made for them. Wedding planners. Tradespeople. Freelance designers. Students. Small-business operators. Teachers. People whose work is real, deadline-bound, money-attached, and not described in the vocabulary of software product managers.

The category we operate in is **operational clarity**. Not productivity. Not project management. Not analytics-as-dashboard. The four products each surface a different kind of clarity:

- **Signal Tasks** — execution clarity. Run the work.
- **Signal Roadmap** — direction clarity. Explain the work.
- **Signal Analytics** — attention clarity. Surface what matters in the work.
- **Signal Notes** — capture clarity. Hold the work as it happens. *(Planned, not yet scaffolded.)*

Each product solves one slice. The suite is the system. The umbrella site (this repo) is the brand surface that makes the relationship between the four legible without forcing a "platform" story.

## 2 · The thesis (one paragraph)

Most software gives you more. Signal Studio gives you less. Less vocabulary to learn. Less configuration to do. Less surface to get lost in. Less project-manager voice talking down to you. The position is: software for the person *the work routes through* in a category that does not call itself an industry — and the experience is built so that the first paint is usable, the language is plain, and nothing on the screen requires you to become a project manager to operate the tool.

## 3 · The moat — discipline, not feature

A reasonable critique: any incumbent could ship a "plain English mode." That critique is right if the moat is features. It isn't.

The moat is **disciplined refusal sustained across a suite of products over time.** Voice discipline (every page, every empty state, every email passes through one register). Refusal discipline (each product publishes locked refusals — Notion can't refuse to be a wiki, Asana can't refuse to surface metrics, Signal Studio's refusals compound). Visual restraint (one accent across the suite, one per-product gesture, no category-colour fragmentation, no mascots). Audience-first scoping (every cycle asks "would a wedding planner / freelance designer / tradesperson use this?" first, and "would it look good in a comparison table" never).

Discipline moats are slower than feature moats. There will be cycles where Signal Studio looks "behind" because an incumbent shipped a feature we refused. **That is the moat working, not failing.** The metric to watch is *unprompted user language* — when users say back to us "this doesn't talk like Jira," the moat is paying out. When users start describing Signal Studio in incumbents' vocabulary, the moat has been breached.

## 4 · Current state (as of 2026-05-10)

| Surface | URL | Status |
|---|---|---|
| Signal Studio (umbrella) | signalstudio.ie | **Live private preview.** Reveal v3 shipped as the umbrella brand surface. |
| Signal Tasks | tasks.signalstudio.ie | **Private preview.** Auth, persistence, app workspace, cinematic demo, and audience pages are in active refinement. |
| Signal Roadmap | roadmap.signalstudio.ie | **Private preview.** Core roadmap, editor, and public viewer are in active refinement. Launch claims must stay tied to what the repo and preview prove. |
| Signal Analytics | analytics.signalstudio.ie | **Private preview · product committed.** Attention clarity is locked as a product. The briefing engine claim must be reconciled with the current repo before it appears in marketing. |
| Signal Notes | notes.signalstudio.ie | **Planned, not scaffolded.** PRODUCT.md drafted; one-way Notes → Tasks promotion is locked; underline-writes-itself wordmark gesture designed. |

**Email:** `hello@signalstudio.ie` via Google Workspace (DKIM completion pending in Admin Console).

**Defensive:** `signalhq.ie` reserved, will 301 to signalstudio.ie post-cutover.

## 5 · Where we're heading (next 2–4 cycles)

- **Direction C — Daily Signal as page.** Alternative experiment for the umbrella landing: the umbrella IS a Daily Signal briefing (Analytics's product format applied to the studio itself, dated, timestamped, sectioned). Strategically distinctive — only Signal Studio could ship this. Build off main on a fresh branch, do NOT replace production.
- **Notes scaffolding.** Stand the fourth product up. Position: capture clarity. One-way Notes→Tasks promotion only — never auto-detect todos (that's a refusal locked in `notes/docs/PRODUCT.md`).
- **Cross-product chrome.** Top-bar product switcher, shared auth seam. Deferred until all four products are at parity. Studio is currently ahead of Notes; chrome work waits for Notes scaffolding.
- **Audience archetype completion.** BRAND.md §2.1 names 5 audience archetypes; only 3 of 5 have dedicated landing pages on Tasks. Missing: small-business operators (restaurant owners, shop owners, clinic operators, studio owners) and public-facing coordinators (teachers, school admins, club coaches, parish coordinators, community organisers). Building these is ~500 lines of brand-coherent writing per page — a positioning + content decision, not a polish.
- **Performance pass with a real browser.** Plan 4 closed pragmatically without Lighthouse access. Owed: Core Web Vitals run against each deployed product, surface Largest Contentful Paint / Cumulative Layout Shift outliers, fix.
- **CSP enforce-mode promotion.** Suite-wide Content-Security-Policy currently in Report-Only mode. Promote to enforce after browser verification confirms no false-positive blocks.

## 6 · What we are explicitly NOT building

These are locked refusals. Not "maybe later" — refusals.

- **No "AI-powered" anything.** Ambient AI is fine inside the engine (Analytics's trigger detection is rules-based today; if it ever uses an LLM, it stays unmarketed). Never named in copy. Never themed in marketing.
- **No "team tier" on Roadmap.** v1 lock. Solo + Pro only.
- **No private workspaces on Roadmap.** Public-by-default is the position.
- **No comment threading on Roadmap.** Refused.
- **No public directory of Roadmap workspaces.** Refused in v1.
- **No "all-in-one productivity platform" framing.** Anywhere. Ever.
- **No three-adjective hero grids** ("Calm. Clear. Confident."). Anywhere.
- **No purple gradients.** The historical Tasks accent was purple-leaning; that was purged. Don't reintroduce.
- **No demo-vs-reality gap.** The marketing site reflects what's actually shipped. If we describe a feature, that feature works in production *today*. If a feature is planned, it's marked planned.
- **No mascots, no robot iconography, no AI-generic aesthetics** (gradient blooms, glassmorphism, generic grid heroes). The visual register is specific. BRAND.md §5 is the contract.

## 7 · Operating constraints

- **No fixed go-live dates.** Show HN was dropped 2026-05-08 and is no longer scope. Each product, page, and feature ships when it's right — not when a calendar says.
- **Build until it's right.** Polish is the work, not the cleanup.
- **Voice rules apply at every layer.** Body copy, alt text, OG cards, error messages, empty states, sign-in flows, email forwarders, terminal output that ships to users.
- **Brand-handbook drift is a bug.** When BRAND.md is wrong, fix it there first, then fix the code. When AGENTS.md or VISION.md drifts from BRAND.md, fix them here.
- **Sole designer-operator context.** Signal Studio is built by one person (Ethan). Scope decisions favour discipline + restraint over breadth. Anything that broadens the surface area without sharpening the moat is a refusal candidate.

## 8 · Voice signals you should look for

When you read existing code or copy and want to know if something is on-brand, listen for these:

**On-brand sounds like:**
- "Cut through the noise."
- "A briefing, not a dashboard."
- "Show your work, not your Jira."
- "Built for everyone else."
- "Most software gives you more. Signal Studio gives you less."

**Off-brand sounds like:**
- "Modern, simple, beautiful." (any 3-adjective trio)
- "Seamlessly integrate your workflow."
- "AI-powered briefings."
- "Empower your team." / "Supercharge your productivity."
- "Built for engineering teams."

If a line you're about to write sounds like it could appear on Asana's homepage, delete it.

## 9 · Reference

- **`docs/BRAND.md`** — voice, naming, banned words, visual register, audience archetypes, page conventions. Source of truth for the suite's identity.
- **`AGENTS.md`** — locked rules + workflow contract for any agent working in this repo.
- **`CHANGELOG.md`** — narrative log of suite-level launches and decisions. Read for tonal reference.

When this document is wrong, fix it here first, then fix the code or the AGENTS.md.
