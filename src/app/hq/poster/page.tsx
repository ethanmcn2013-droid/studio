import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { ReviewRoom, type ReviewDirection } from "../_review/ReviewRoom";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Campaign Poster · Signal HQ",
  description: "Four directions for the A2 campaign poster, permission boards only.",
  robots: { index: false, follow: false },
};

const P = "/brand/collateral/explorations";

const DIRECTIONS: ReviewDirection[] = [
  {
    id: "ink",
    name: "01 · Ink",
    chosen: "CHOSEN",
    spec: "A2 · rich black · the deck's poster",
    images: [
      { src: `${P}/posterx-ink-preview.png`, alt: "Ink campaign poster", caption: "White opening, indigo-mid payoff, the deck's poster, exactly." },
    ],
    read: "The reference object from the growth deck. Reads across a room, photographs beautifully behind the founder at any event.",
    links: [{ label: "print pdf", href: `${P}/posterx-ink-print.pdf` }],
  },
  {
    id: "indigo",
    name: "02 · Indigo",
    spec: "A2 · PMS 2726C · ink payoff",
    images: [
      { src: `${P}/posterx-indigo-preview.png`, alt: "Indigo campaign poster", caption: "The wall goes indigo; the payoff lands in ink." },
    ],
    read: "The boldest wall in Limerick. Where a black poster recedes politely, this one owns the corridor, best for campus boards drowning in colour.",
    links: [{ label: "print pdf", href: `${P}/posterx-indigo-print.pdf` }],
  },
  {
    id: "paper",
    name: "03 · Paper",
    spec: "A2 · uncoated white · gallery print",
    images: [
      { src: `${P}/posterx-paper-preview.png`, alt: "Paper campaign poster", caption: "Ink line, indigo payoff, white space doing the work, the gallery print." },
    ],
    read: "The one that looks most like art. In a café that hangs prints, this doesn't read as advertising at all, which is exactly why it works.",
    links: [{ label: "print pdf", href: `${P}/posterx-paper-print.pdf` }],
  },
  {
    id: "dot",
    name: "04 · The Dot",
    spec: "A2 · rich black · the brand as an object",
    images: [
      { src: `${P}/posterx-dot-preview.png`, alt: "Dot campaign poster", caption: "A 120mm indigo dot in darkness; the line whispers at the foot." },
    ],
    read: "Museum energy. No product, no pitch, a giant calm dot and one quiet line. The one people photograph and post themselves.",
    links: [{ label: "print pdf", href: `${P}/posterx-dot-print.pdf` }],
  },
];

export default async function PosterPage() {
  await requireHqAccess();
  return (
    <ReviewRoom
      wide
      eyebrow="Signal HQ · The campaign poster · Permission boards only"
      title={<>One line, held across a room</>}
      intro="A2, one campaign line, no urgency theatre. The same line runs across the poster, the posts, and the café cards, repetition is the system working. All four are print-ready with bleed and crop marks."
      directions={DIRECTIONS}
      advice="Decision recorded: Ink is the campaign poster, the deck's object, exactly. The other three grounds stay archived below for walls that ever need them."
    />
  );
}
