import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { ReviewRoom, type ReviewDirection } from "../_review/ReviewRoom";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Slide 30 directions · Signal HQ",
  description: "Four retained directions for Slide 30 of the market-entry deck.",
  robots: { index: false, follow: false },
};

const P = "/brand/collateral/explorations/slide-30";

const DIRECTIONS: ReviewDirection[] = [
  {
    id: "proof-mark",
    name: "01 · The Proof Mark",
    chosen: "IN THE DECK",
    spec: "paper · monumental numeral · selected direction",
    images: [
      {
        src: `${P}/option-01-proof-mark.png`,
        alt: "Option 01, The Proof Mark, for market-entry deck Slide 30",
        caption: "The first twenty-five presented as the market-entry proof object, with the offer, promise, and invitation held on one plane.",
      },
    ],
    read: "Selected for Slide 30. The number is the evidence, not decoration: twenty-five founding venues, one close feedback loop, and a clear route from Limerick proof to five-market scale.",
    links: [{ label: "open full size", href: `${P}/option-01-proof-mark.png` }],
  },
  {
    id: "indigo-edition",
    name: "02 · Indigo Edition",
    spec: "solid indigo · outlined numeral · retained direction",
    images: [
      {
        src: `${P}/option-02-indigo-edition.png`,
        alt: "Option 02, Indigo Edition, for market-entry deck Slide 30",
        caption: "The brand colour treated as the honour itself, with the cohort number carrying the entire composition.",
      },
    ],
    read: "The most declarative brand expression. It turns the full slide into the founding-partner object and keeps the invitation deliberately spare.",
    links: [{ label: "open full size", href: `${P}/option-02-indigo-edition.png` }],
  },
  {
    id: "founding-ledger",
    name: "03 · The Founding Ledger",
    spec: "ink · twenty-five positions · retained direction",
    images: [
      {
        src: `${P}/option-03-proof-ledger.png`,
        alt: "Option 03, The Founding Ledger, for market-entry deck Slide 30",
        caption: "Every founding position is explicit. The system reads as rigorous, finite, and ready to be earned one venue at a time.",
      },
    ],
    read: "The proof-first direction. It makes the cohort operational rather than ceremonial and gives the founder a visible ledger that can fill as venues join.",
    links: [{ label: "open full size", href: `${P}/option-03-proof-ledger.png` }],
  },
  {
    id: "founders-circle",
    name: "05 · Founder's Circle",
    spec: "ink · network motif · retained direction",
    images: [
      {
        src: `${P}/option-05-founders-circle.png`,
        alt: "Option 05, Founder's Circle, for market-entry deck Slide 30",
        caption: "The cohort presented as a close operating network: twenty-five venues around one shared standard.",
      },
    ],
    read: "The most relational direction. It shifts the emphasis from membership count to proximity, shared learning, and the compounding value of the founding cohort.",
    links: [{ label: "open full size", href: `${P}/option-05-founders-circle.png` }],
  },
];

export default async function Slide30ReviewPage() {
  await requireHqAccess();

  return (
    <ReviewRoom
      eyebrow="Signal HQ · Assets · Market-entry deck"
      title={<>Slide 30 directions</>}
      intro="Four directions are retained for review. Option 01 is now the working deck slide; Options 02, 03, and 05 remain here as considered alternatives. Every direction reflects the corrected cohort of twenty-five founding venues."
      directions={DIRECTIONS}
      advice="Decision recorded: Option 01, The Proof Mark, is now in the market-entry deck. Keep Options 02, 03, and 05 in this room for comparison until the deck is signed off."
    />
  );
}
