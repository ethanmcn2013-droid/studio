import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { ReviewRoom, type ReviewDirection } from "../_review/ReviewRoom";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Partner Card — Signal HQ",
  description: "Four directions for the Founding Limerick Partner card — the object presented at signing.",
  robots: { index: false, follow: false },
};

const P = "/brand/collateral/explorations";

const DIRECTIONS: ReviewDirection[] = [
  {
    id: "indigo",
    name: "01 · Indigo",
    spec: "solid indigo · PMS 2726C · hand-completed reverse",
    images: [
      { src: `${P}/fpx-indigo-front-preview.png`, alt: "Indigo partner card front", caption: "The deck's card — solid indigo, the title and blank number low." },
      { src: `${P}/fpx-indigo-back-preview.png`, alt: "Indigo partner card back", caption: "The reverse is completed by hand at signing: venue, signature — never reprinted." },
    ],
    read: "The brand colour as the honour itself. The hand-filled reverse turns each card into a one-of-one artifact — the founder writes the venue's name in front of them.",
    links: [
      { label: "front pdf", href: `${P}/fpx-indigo-front-print.pdf` },
      { label: "back pdf", href: `${P}/fpx-indigo-back-print.pdf` },
    ],
  },
  {
    id: "certificate",
    name: "02 · Certificate",
    spec: "600gsm · hairline frame · indigo reverse",
    images: [
      { src: `${P}/fpx-certificate-front-preview.png`, alt: "Certificate partner card front", caption: "A hairline frame and a centred stack — the number waits to be written." },
      { src: `${P}/fpx-certificate-back-preview.png`, alt: "Certificate partner card back", caption: "Solid indigo reverse, the wordmark at rest." },
    ],
    read: "Reads like a bank note or a member's card from a very old club. The most formal of the four — for venues that will frame it.",
    links: [
      { label: "front pdf", href: `${P}/fpx-certificate-front-print.pdf` },
      { label: "back pdf", href: `${P}/fpx-certificate-back-print.pdf` },
    ],
  },
  {
    id: "numeral",
    name: "03 · Numeral",
    spec: "rich black · the number as hero · hand-completed reverse",
    images: [
      { src: `${P}/fpx-numeral-front-preview.png`, alt: "Numeral partner card front", caption: "Ink-dark, the № monumental in indigo-mid — the position is the design." },
      { src: `${P}/fpx-numeral-back-preview.png`, alt: "Numeral partner card back", caption: "Hand-completed reverse: venue, signature, never reprinted." },
    ],
    read: "The S·4 post as a physical object — the number carries everything. Pairs perfectly with the social system when partners are announced.",
    links: [
      { label: "front pdf", href: `${P}/fpx-numeral-front-print.pdf` },
      { label: "back pdf", href: `${P}/fpx-numeral-back-print.pdf` },
    ],
  },
  {
    id: "seal",
    name: "04 · Seal",
    spec: "600gsm · rings blind-debossed, dot printed · ink reverse",
    images: [
      { src: `${P}/fpx-seal-front-preview.png`, alt: "Seal partner card front", caption: "The broadcast emblem as a maker's seal — specced for blind deboss." },
      { src: `${P}/fpx-seal-back-preview.png`, alt: "Seal partner card back", caption: "Ink-dark reverse, the wordmark at rest." },
    ],
    read: "The quietest and most tactile: the emblem catches light instead of shouting. The one a coordinator keeps in a wallet.",
    links: [
      { label: "front pdf", href: `${P}/fpx-seal-front-print.pdf` },
      { label: "back pdf", href: `${P}/fpx-seal-back-print.pdf` },
    ],
  },
];

export default async function PartnerCardPage() {
  await requireHqAccess();
  return (
    <ReviewRoom
      eyebrow="Signal HQ · The Founding Partner card · Presented at signing"
      title={<>A position, not a purchase</>}
      intro="Twenty-five cards, numbered by hand, never reprinted. This is the object that makes joining the first twenty-five feel like what it is. Every direction is print-ready at 85×55mm; the number field stays blank until a real venue signs."
      directions={DIRECTIONS}
      advice="The ceremony matters more than the card: whichever direction you choose, the number is written by hand, in front of the venue, at signing. Proof the top two on real stock — the deboss options need a sample to judge."
    />
  );
}
