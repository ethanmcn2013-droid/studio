# Website Review — Response & Disposition

**Date:** 2026-06-18 · **Surface:** signalstudio.ie (umbrella, `studio` repo)
Two reviews were actioned together: a 10-point UX/legal/conversion review and a 5-point brand-vs-funding-deck brief. Each point below is marked **Fixed today**, **Already handled** (the review predated current state), **By design** (a deliberate brand decision), or **Deferred — strategic** (a direction-altering call left to the operator).

Code shipped today: `reveal-loading-showcase.tsx` (hero), `reveal-closing.tsx` + `globals.css` (CTA), two `content/dispatch/*.md` (de-jargon + fresh entry). Commits `79cb3ec`, `7188f69`.

---

## Review A — 10-point UX / legal / conversion review

| # | Item | Disposition | Detail |
|---|---|---|---|
| 1 | Tech jargon in the changelog ("four visible pills, not a hidden popover") | **Fixed today** | The home page "Recent dispatch" rail showed bare UI-jargon headlines. Re-titled that entry to its plain-English summary and shipped a fresh business-outcome dispatch entry; the rail now reads in operator language end to end. Full technical detail still lives on `/dispatch`. |
| 2 | GDPR — no cookie banner / privacy / terms | **Already handled** | Footer links Privacy, Terms, Security, Accessibility. The privacy page states the site sets **only sign-in session cookies**, uses **cookieless** Vercel Analytics, and **no trackers that need consent** — so no banner is legally required, and adding one would harm the UX for no benefit. Left intentionally absent. |
| 3 | Company transparency — no CRO number | **By design (truthful)** | Incorporation is pending a CRO number (locked operator truth). Publishing a registration number now would be false. The footer/close carry `hello@signalstudio.ie · Dublin` honestly; CRO line gets added the day the number exists. |
| 4 | No primary hero CTA — only "Read on ↓" | **Fixed today** | Added an on-brand two-path CTA at the page close (the high-intent point): **Start with Signal Tasks** (self-serve, the live product) + **For venues & events** (high-touch). The hero's editorial "headline, not a wall" opening is a documented brand decision and stays; the conversion now lives where intent is highest. |
| 5 | "Private preview" dead ends | **Fixed today** | The new CTA gives a ready visitor two real next steps (start in Tasks today, or open the venue path) instead of bouncing off product subdomains with no route in. |
| 6 | Single use-case bias (only weddings shown) | **Already handled** | Weddings is the deliberate first-revenue GTM wedge, but `/venues`, `/students`, and the manifesto's audience list (tradespeople, designers, teachers, small-shop owners) are all present. The new "For venues & events" CTA surfaces the non-wedding vertical on the home page. |
| 7 | Nav CSS spacing bug ("WorkPricingAboutContact") | **Already handled** | The nav uses a flex layout with `gap-4 sm:gap-5` and collapses to a hamburger below `sm`. No merge bug in current code — the review predated this. |
| 8 | Lack of trust signals | **Already handled / partial** | `/proof` exists and is linked; the live "Recent dispatch" rail is itself a velocity proof. Testimonials/client logos are intentionally absent because the product is pre-launch — fabricating them would breach the design rule against fake proof. Add real ones post-launch. |
| 9 | Inconsistent capitalisation | **By design** | Lowercase wordmarks (`notes`, `tasks`) are the brand system; "Daily Signal", "Multi-view" are proper-noun feature labels. This is intentional typographic register, not drift. |
| 10 | Contact is mailto-only | **By design** | `/contact` is a deliberate, documented "no form, no CRM" decision — but it is **not** a bare mailto: it prefills subject/body per intent (incl. a Founding-Venue path) and rides outreach attribution into the CRM. The restraint is the brand; the dead-end the review feared isn't there. |

---

## Review B — brand vs. funding-deck alignment (5 points)

| # | Item | Disposition | Detail |
|---|---|---|---|
| 1 | Positioning mismatch — horizontal copy vs. vertical (€2,500 Venue) pricing | **Fixed today (additive) / Deferred (full pivot)** | The new CTA pair makes the dual audience explicit on the home page — self-serve operator *and* venue buyer — resolving the "which is it?" split without nuking the horizontal brand. A full hero re-positioning around venues is a strategic, direction-altering call left to the operator. |
| 2 | Indie-hacker changelog jargon on the home page | **Fixed today** | Same fix as Review A #1 — home-page rail is now business-outcome language; technical log stays on `/dispatch`. |
| 3 | "Less is more" reads as under-built to B2B buyers | **Deferred — strategic** | Reframing the core "we give you less" manifesto toward "zero cognitive overhead," plus an explicit Integrations & Security reassurance block, is a brand-voice change. `/security` already exists to link. Recommended, but it touches the manifesto — operator's call. |
| 4 | Self-serve illusion — needs a high-touch enterprise CTA | **Fixed today** | "For venues & events →" routes to the Founding Venue Programme (`/venues`), the high-touch path the funding model depends on, sitting beside the self-serve CTA exactly as recommended. |
| 5 | "Bus factor 1" / side-project perception | **Deferred — strategic** | Shifting maintenance/hosting copy from "I" to "we" and adding an infrastructure-stability line is sound, but it's a positioning decision about how the founder presents the business — left to the operator. |

---

## Net

- **Shipped today:** hero overflow fix, two-path conversion CTA, de-jargoned + refreshed home-page dispatch rail.
- **Confirmed already-handled or by-design:** cookie/legal posture, nav spacing, contact, capitalisation, CRO timing — several review items predated the current site.
- **Deferred to the operator (genuinely strategic):** full horizontal→vertical hero re-positioning, the "less is more" manifesto reframe, and the I→we institutional-voice shift. These change brand direction, not just execution, so they shouldn't be made unilaterally.
