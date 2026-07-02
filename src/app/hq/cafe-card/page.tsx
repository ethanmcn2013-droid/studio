import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { ReviewRoom, type ReviewDirection } from "../_review/ReviewRoom";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Café Card — Signal HQ",
  description: "Four directions for the A6 café card — the permission-placed object.",
  robots: { index: false, follow: false },
};

const P = "/brand/collateral/explorations";

const DIRECTIONS: ReviewDirection[] = [
  {
    id: "ink",
    name: "01 · Ink",
    spec: "A6 · rich black · ≥300gsm uncoated",
    images: [
      { src: `${P}/cafex-ink-preview.png`, alt: "Ink café card", caption: "The quiet introduction — wordmark, one line, the QR on a paper chip." },
    ],
    read: "Doesn't ask for attention; earns it. On a counter full of neon flyers, the calmest object wins the glance.",
    links: [{ label: "print pdf", href: `${P}/cafex-ink-print.pdf` }],
  },
  {
    id: "campaign",
    name: "02 · Campaign",
    spec: "A6 · rich black · the poster at counter scale",
    images: [
      { src: `${P}/cafex-campaign-preview.png`, alt: "Campaign café card", caption: "The campaign line two-tone — the strongest hook of the four." },
    ],
    read: "Runs the same line as the poster and the posts — one campaign, every surface. The line does the work a logo can't: it makes a stranger nod.",
    links: [{ label: "print pdf", href: `${P}/cafex-campaign-print.pdf` }],
  },
  {
    id: "belief",
    name: "03 · Belief",
    spec: "A6 · paper white · brand thinking in public",
    images: [
      { src: `${P}/cafex-belief-preview.png`, alt: "Belief café card", caption: "One of the nine beliefs, set plainly — the S·2 post as an object." },
    ],
    read: "The most surprising in a café: a software company saying something true about calm, with no product pitch anywhere. Curiosity does the rest.",
    links: [{ label: "print pdf", href: `${P}/cafex-belief-print.pdf` }],
  },
  {
    id: "indigo",
    name: "04 · Indigo",
    spec: "A6 · PMS 2726C · the bold introduction",
    images: [
      { src: `${P}/cafex-indigo-preview.png`, alt: "Indigo café card", caption: "The brand colour owned completely — impossible to miss on any counter." },
    ],
    read: "The loudest the brand ever gets, and still no exclamation mark. Best for the venues and campuses where the black card would disappear into dark wood.",
    links: [{ label: "print pdf", href: `${P}/cafex-indigo-print.pdf` }],
  },
];

export default async function CafeCardPage() {
  await requireHqAccess();
  return (
    <ReviewRoom
      wide
      eyebrow="Signal HQ · The café card · Permission placement only"
      title={<>Earn a stranger's glance, then reward it</>}
      intro="A6, heavy uncoated, placed by permission in cafés, venues, and on campus boards — never dropped, never stacked. One job: a stranger picks it up, scans, and lands somewhere calm. All four are print-ready."
      directions={DIRECTIONS}
      advice="Cafés differ — a dark counter wants the indigo or belief card, a bright one wants ink. Nothing stops you running two: same campaign, chosen per placement. Placement rules hold either way: by permission, person to person, nothing laminated."
    />
  );
}
