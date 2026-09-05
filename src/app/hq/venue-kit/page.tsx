import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { ReviewRoom, type ReviewDirection } from "../_review/ReviewRoom";
import styles from "./venue-kit.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Venue Kit · Signal HQ",
  description: "Held January venue material, current terms and founder action drafts.",
  robots: { index: false, follow: false },
};

const P = "/brand/collateral/venue";

const DIRECTIONS: ReviewDirection[] = [
  {
    id: "deck",
    name: "01 · The venue pitch deck",
    spec: "10 slides · 16:9 · one idea each",
    images: [{ src: `${P}/venue-deck-preview.png`, alt: "Historical ten-slide venue deck specimen", caption: "Historical specimen. Review every claim, product name and price against the January offer before use." }],
    read: "Use the existing deck as source material. Its images and PDF are retained specimens, not a current approval or evidence of customer use.",
    links: [{ label: "deck pdf", href: `${P}/venue-deck-screen.pdf` }],
  },
  {
    id: "pricing",
    name: "02 · The pricing explainer",
    spec: "annual prepayment · VAT-inclusive",
    images: [{ src: `${P}/pricing-explainer-preview.png`, alt: "Historical pricing explainer specimen", caption: "Historical specimen. Current annual terms are €1,500 standard or €1,000 for a qualifying Founding 25 agreement, prepaid and VAT-inclusive." }],
    read: "The founding rate is held on continuous renewal without lapse. A number follows cleared payment. The current Atlas offer table and payment guide govern; this retained PDF needs reconciliation before handoff.",
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
    read: "Delegated January choice: one personal note, one follow-up ten days after the actual send, then stop unless they engage. Stop sooner on a no or opt-out. Use the current VENUE_OUTREACH_SEQUENCE source and the January founder packet; the retained text file below is historical.",
    links: [{ label: "historical text specimen", href: `${P}/outreach-email.txt` }],
  },
  {
    id: "script",
    name: "04 · The demo script + objection sheet",
    spec: "A4 ×2 · internal · seven minutes, never longer",
    images: [{ src: `${P}/demo-script-preview.png`, alt: "Demo script and objection sheet", caption: "Page one: the seven-minute run, timed. Page two: the five real objections, one calm sentence each, agree, then show." }],
    read: "Rehearse the current couple path and support recovery before a conversation. Use only observed behavior and a reviewed proof link; a polished script does not establish human comprehension.",
    links: [{ label: "internal pdf", href: `${P}/demo-script-screen.pdf` }],
  },
  {
    id: "pilot",
    name: "06 · The pilot card",
    spec: "historical specimen · explicit exception only",
    images: [{ src: `${P}/pilot-card-preview.png`, alt: "Historical pilot-card specimen, not current offer terms", caption: "Historical specimen. It does not establish a free pilot, a two-week term or approval to issue codes." }],
    read: "The normal Venue path requires recorded payment. An explicit pilot needs a current limited term, positive allotment and retained exception reference. Confirm those exact terms before making an offer or preparing a packet.",
    links: [
      { label: "screen pdf", href: `${P}/pilot-card-screen.pdf` },
      { label: "print pdf", href: `${P}/pilot-card-print.pdf` },
    ],
  },
  {
    id: "prepared",
    name: "07 · Prepared-for personalisation",
    spec: "named specimen · verify before handoff",
    images: [{ src: `${P}/venue-onepager-prepared-preview.png`, alt: "One-pager prepared for a named venue", caption: "The one-pager and the deck cover take a venue name and render 'Prepared for —' in the header strip. Shown here with a placeholder." }],
    read: "Check the venue name and every enclosure in the final private draft. Placeholder personalisation is not evidence of a selected recipient or an actual send.",
    links: [{ label: "specimen preview", href: `${P}/venue-onepager-prepared-preview.png` }],
  },
  {
    id: "permission",
    name: "05 · The permission form",
    spec: "A4 · one page · legal review before first use",
    images: [{ src: `${P}/permission-form-preview.png`, alt: "Historical venue permission-form specimen", caption: "Historical specimen. Verify the applicable permission and wording before any named publication." }],
    read: "Keep name, logo, quote, press and case-study permissions distinct. This specimen supplies neither legal approval nor permission to publish a venue's identity.",
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
      className={styles.kit}
      wide
      eyebrow="Signal HQ · The venue kit · Held January drafts"
      title={<>Prepare the venue conversation</>}
      intro="Internal preparation for 21 January 2027. The current offer, support guides and founder action packet govern. The retained images and PDFs below are historical specimens; they need current-term review before a customer handoff."
      directions={DIRECTIONS}
      advice="Use the January go/no-go todo for the exact action packet. User launch and first outreach need separate recorded decisions against the final revisions. No send before 21 January 2027. The old kit signoff does not authorise outreach, and no message is sent from this room."
    />
  );
}
