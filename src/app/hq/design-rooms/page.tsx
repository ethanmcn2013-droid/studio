import type { Metadata } from "next";
import Link from "next/link";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { requireHqAccess } from "@/lib/hq/access-guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design Rooms · Signal HQ",
  description: "Every design decision, its iterations, and its chosen direction, in one place.",
  robots: { index: false, follow: false },
};

type Room = { href: string; name: string; state: string; note: string };

const ROOMS: Room[] = [
  { href: "/hq/product-hero-design-motion", name: "The Product Hero Room", state: "REVIEW · 6", note: "Signal is the reference. Six active Notes, Tasks and Timeline candidates are built, linked and waiting for the product picks." },
  { href: "/hq/cards", name: "The Founder Card", state: "DECIDED · TRIO", note: "Ink, Indigo and Duo chosen from six. One reverse, QR on the front. Proof order packaged." },
  { href: "/hq/partner-card", name: "The Founding Partner Card", state: "SHORTLIST · 2", note: "Indigo and Numeral shortlisted from four. Founder-contact reverse carries the direct line." },
  { href: "/hq/cafe-card", name: "The Café Card", state: "DECIDED", note: "Campaign chosen from four. The poster's line at counter scale." },
  { href: "/hq/poster", name: "The Campaign Poster", state: "DECIDED", note: "Ink chosen from four grounds. Alternates archived, choosable per wall." },
  { href: "/hq/venue-kit", name: "The Venue Kit", state: "APPROVED", note: "Seven objects: deck, pricing, outreach, script, permission form, pilot card, personalisation." },
  { href: "/hq/socials", name: "The Posting Queue", state: "APPROVED", note: "Twelve posts over six weeks. Cleared to schedule as written." },
];

const GALLERIES: Room[] = [
  { href: "/brand/collateral/identity/index.html", name: "Identity & the card system", state: "GALLERY", note: "Cards, letterhead, poster, signature. Every final, with print notes." },
  { href: "/brand/collateral/social/index.html", name: "The social system", state: "GALLERY", note: "S·1 to S·6 in every size. Nine beliefs, three numbers, three before/afters, end cards, banners." },
  { href: "/brand/press/index.html", name: "The press kit", state: "GALLERY", note: "Release, fact sheet, founder story, usage notes. Photography and screenshots pending." },
  { href: "/brand/collateral/ambassador/index.html", name: "The ambassador kit", state: "GALLERY", note: "The letter, the guide, four templates, the QR card, the notebook spec." },
  { href: "/brand/collateral/venue/index.html", name: "The venue set", state: "GALLERY", note: "One-pager, leave-behind, deck, pricing, pilot card." },
  { href: "/design", name: "The design page & motion canon", state: "LIVE", note: "The dot narrative, five gestures, print plates. Kit files at /brand/kit/." },
];

function Row({ r }: { r: Room }) {
  return (
    <Link
      href={r.href}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(160px, 220px) 110px 1fr",
        gap: "16px",
        alignItems: "baseline",
        padding: "14px 18px",
        borderBottom: "1px solid var(--hairline)",
        textDecoration: "none",
        color: "var(--ink)",
      }}
    >
      <span style={{ fontWeight: 600 }}>{r.name}</span>
      <span
        style={{
          fontFamily: "var(--font-mono-stack)",
          fontSize: "9.5px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          color: r.state.startsWith("DECIDED") || r.state === "APPROVED" ? "#ffffff" : "var(--accent)",
          background: r.state.startsWith("DECIDED") || r.state === "APPROVED" ? "var(--accent)" : "var(--accent-soft)",
          borderRadius: "999px",
          padding: "2px 10px",
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {r.state}
      </span>
      <span style={{ fontSize: "13.5px", lineHeight: 1.5, color: "var(--ink-faint)" }}>{r.note}</span>
    </Link>
  );
}

export default async function DesignRoomsPage() {
  await requireHqAccess();

  return (
    <main id="main" className="hq-page">
      <HqPageHeader
        slug="design-rooms"
        title="Nothing here took the easy route."
        standfirst="Every object was explored in directions, chosen, and recorded; this page is the record."
        meta={
          <span className="hq-page-head-note">
            {ROOMS.length} decision rooms · {GALLERIES.length} galleries
          </span>
        }
      />

      <section aria-label="decision rooms" style={{ border: "1px solid var(--hairline)", borderRadius: "10px", overflow: "hidden", marginBottom: "32px" }}>
        <div style={{ padding: "10px 18px", background: "var(--paper-soft)", borderBottom: "1px solid var(--hairline)", fontFamily: "var(--font-mono-stack)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          The decision rooms
        </div>
        {ROOMS.map((r) => <Row key={r.href} r={r} />)}
      </section>

      <section aria-label="galleries" style={{ border: "1px solid var(--hairline)", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ padding: "10px 18px", background: "var(--paper-soft)", borderBottom: "1px solid var(--hairline)", fontFamily: "var(--font-mono-stack)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          The galleries. Every final, every size
        </div>
        {GALLERIES.map((r) => <Row key={r.href} r={r} />)}
      </section>

      <section
        aria-label="going public"
        style={{ marginTop: "32px", background: "var(--accent-soft)", borderLeft: "3px solid var(--accent)", borderRadius: "0 6px 6px 0", padding: "16px 20px" }}
      >
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--accent)", fontWeight: 500 }}>
          The public version, if shipped: chosen objects, archived
          directions, one line of reasoning per decision. Specimens stay
          marked; partners stay unnamed until permissioned.
        </p>
      </section>
    </main>
  );
}
