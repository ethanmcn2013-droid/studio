import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { ReviewRoom, type ReviewDirection } from "../_review/ReviewRoom";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Venue Kit · Signal HQ",
  description: "The revenue spine: deck, pricing, outreach, demo script, permission form.",
  robots: { index: false, follow: false },
};

const P = "/brand/collateral/venue";

const DIRECTIONS: ReviewDirection[] = [
  {
    id: "deck",
    name: "01 · The venue pitch deck",
    spec: "10 slides · 16:9 · one idea each",
    images: [{ src: `${P}/venue-deck-preview.png`, alt: "All ten slides of the venue pitch deck", caption: "Cover → the 19,898 problem → four views → the couple → the team → the demo → €2,500 → Founding Partner → the standard → the pilot ask." }],
    read: "The seated-conversation backbone. Inherits the one-pager's message; slide 06 hands over to the live demo, no feature tour, ever.",
    links: [{ label: "deck pdf", href: `${P}/venue-deck-screen.pdf` }],
  },
  {
    id: "pricing",
    name: "02 · The pricing explainer",
    spec: "A4 · one number · no discount theatre",
    images: [{ src: `${P}/pricing-explainer-preview.png`, alt: "Pricing explainer", caption: "€2,500 a year, prepaid, everything included, framed in the venue's own terms: a few euro per wedding." }],
    read: "Makes the money moment calm. Founding pricing is described as a price lock, not a markdown, permanence, not a discount.",
    links: [
      { label: "screen pdf", href: `${P}/pricing-explainer-screen.pdf` },
      { label: "print pdf", href: `${P}/pricing-explainer-print.pdf` },
    ],
  },
  {
    id: "outreach",
    name: "03 · The outreach email + one follow-up",
    spec: "plain text · founder-signed · one ask · never mass-blast",
    images: [],
    read: "First touch opens with one real, specific line written fresh per venue; the one-pager is the attachment. The follow-up is a single quiet line ten days later, and there is no third email, the 'a one-word no is genuinely welcome' close protects every future conversation in a small city.",
    links: [{ label: "read the drafts", href: `${P}/outreach-email.txt` }],
  },
  {
    id: "script",
    name: "04 · The demo script + objection sheet",
    spec: "A4 ×2 · internal · seven minutes, never longer",
    images: [{ src: `${P}/demo-script-preview.png`, alt: "Demo script and objection sheet", caption: "Page one: the seven-minute run, timed. Page two: the five real objections, one calm sentence each, agree, then show." }],
    read: "Founder-time leverage. Minute five is the most important line on the page: stop demoing, hand over the one-pager, ask about their week, and listen.",
    links: [{ label: "internal pdf", href: `${P}/demo-script-screen.pdf` }],
  },
  {
    id: "pilot",
    name: "06 · The pilot card",
    spec: "A5 · signed on the desk · no contract to read",
    images: [{ src: `${P}/pilot-card-preview.png`, alt: "The pilot on one page", caption: "One wedding, one coordinator, two weeks, then you decide. Costs nothing, data stays theirs, hosted in the EU." }],
    read: "The close as an object. 'No contract to read' becomes literally true, the whole agreement fits on a card signed at the end of a good demo.",
    links: [
      { label: "screen pdf", href: `${P}/pilot-card-screen.pdf` },
      { label: "print pdf", href: `${P}/pilot-card-print.pdf` },
    ],
  },
  {
    id: "prepared",
    name: "07 · Prepared-for personalisation",
    spec: "?venue= · every object renders bespoke · zero marginal cost",
    images: [{ src: `${P}/venue-onepager-prepared-preview.png`, alt: "One-pager prepared for a named venue", caption: "The one-pager and the deck cover take a venue name and render 'Prepared for —' in the header strip. Shown here with a placeholder." }],
    read: "The world-class move no venue expects from a software company: their name on the object before the first meeting. Say the venue and the personalised kit renders in minutes.",
    links: [{ label: "specimen preview", href: `${P}/venue-onepager-prepared-preview.png` }],
  },
  {
    id: "permission",
    name: "05 · The permission form",
    spec: "A4 · one page · legal review before first use",
    images: [{ src: `${P}/permission-form-preview.png`, alt: "Partner permission form", caption: "Five tick-lines, name, logo, quote, press, case study, each standing alone, each withdrawable by one email." }],
    read: "The legal floor of the proof system: until a venue signs this, the S·4 post, the partner card, and every named mention stay specimens. Designed to be signed without hesitation.",
    links: [
      { label: "screen pdf", href: `${P}/permission-form-screen.pdf` },
      { label: "print pdf", href: `${P}/permission-form-print.pdf` },
    ],
  },
];

export default async function VenueKitPage() {
  await requireHqAccess();
  return (
    <ReviewRoom
      wide
      eyebrow="Signal HQ · The venue kit · The revenue spine"
      title={<>The five objects that close a venue</>}
      intro="Everything before this was brand; this is the sale. One-pager attached to the email, deck frames the demo, script runs it, pricing closes it, permission form makes the proof engine legal. Every claim is deck-locked; the email and objection answers are the only new copy, drafted for your approval."
      directions={DIRECTIONS}
      advice="Order of operations: approve these five, then outreach starts, one venue at a time, first line written fresh, one-pager attached. The permission form goes past a solicitor once before its first signature. Nothing here is sent, shown, or printed before your yes."
    />
  );
}
