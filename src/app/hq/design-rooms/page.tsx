import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design Rooms — Signal HQ",
  description: "Every design decision, its iterations, and its chosen direction — in one place.",
  robots: { index: false, follow: false },
};

type Room = { href: string; name: string; state: string; note: string };

const ROOMS: Room[] = [
  { href: "/hq/cards", name: "The Founder Card", state: "DECIDED · TRIO", note: "Six directions explored; Ink, Indigo and Duo chosen — one reverse, QR to the site. Proof order packaged." },
  { href: "/hq/partner-card", name: "The Founding Partner Card", state: "SHORTLIST · 2", note: "Four directions; Indigo and Numeral shortlisted with the founder-contact reverse (direct line lives here)." },
  { href: "/hq/cafe-card", name: "The Café Card", state: "DECIDED", note: "Four directions; Campaign chosen — the poster's line at counter scale. Alternates archived." },
  { href: "/hq/poster", name: "The Campaign Poster", state: "DECIDED", note: "Four grounds; Ink chosen. Indigo, Paper and The Dot archived, choosable per wall." },
  { href: "/hq/venue-kit", name: "The Venue Kit", state: "APPROVED", note: "Seven objects — deck, pricing, outreach, script, permission form, pilot card, prepared-for personalisation." },
  { href: "/hq/socials", name: "The Posting Queue", state: "APPROVED", note: "Six weeks, twelve posts, drafted captions and alt text — cleared to schedule as written." },
];

const GALLERIES: Room[] = [
  { href: "/brand/collateral/identity/index.html", name: "Identity & the card system", state: "GALLERY", note: "Cards, letterhead, poster, signature — every final with print notes." },
  { href: "/brand/collateral/social/index.html", name: "The social system", state: "GALLERY", note: "S·1–S·6 across every size: nine beliefs, three numbers, three before/afters, end cards, banners." },
  { href: "/brand/press/index.html", name: "The press kit", state: "GALLERY", note: "Release, fact sheet, founder story, usage notes — photography and screenshots pending." },
  { href: "/brand/collateral/ambassador/index.html", name: "The ambassador kit", state: "GALLERY", note: "K·0–K·4: the letter, the guide, four templates, the QR card, the notebook spec." },
  { href: "/brand/collateral/venue/index.html", name: "The venue set", state: "GALLERY", note: "One-pager, leave-behind, deck, pricing, pilot card — the revenue spine's objects." },
  { href: "/brand", name: "The brand kit & motion canon", state: "LIVE", note: "Wordmarks, the dot, lockups, app icons, the five gestures — the system everything inherits." },
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
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">Signal HQ · Design Rooms</span>
        <h1 className="hq-page-title">
          Nothing here took the easy route
          <span aria-hidden="true" style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <p className="hq-page-intro">
          Every physical and social object was explored in directions, argued
          over, chosen, and recorded — six founder cards, four posters, four
          partner cards, a signable pilot. This page is the record. On launch,
          some version of it may go public: proof of how seriously the design
          is taken, the way ten loading screens beat one.
        </p>
      </header>

      <section aria-label="decision rooms" style={{ border: "1px solid var(--hairline)", borderRadius: "10px", overflow: "hidden", marginBottom: "32px" }}>
        <div style={{ padding: "10px 18px", background: "var(--paper-soft)", borderBottom: "1px solid var(--hairline)", fontFamily: "var(--font-mono-stack)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          The decision rooms
        </div>
        {ROOMS.map((r) => <Row key={r.href} r={r} />)}
      </section>

      <section aria-label="galleries" style={{ border: "1px solid var(--hairline)", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ padding: "10px 18px", background: "var(--paper-soft)", borderBottom: "1px solid var(--hairline)", fontFamily: "var(--font-mono-stack)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          The galleries — every final, every size
        </div>
        {GALLERIES.map((r) => <Row key={r.href} r={r} />)}
      </section>

      <section
        aria-label="going public"
        style={{ marginTop: "32px", background: "var(--accent-soft)", borderLeft: "3px solid var(--accent)", borderRadius: "0 6px 6px 0", padding: "16px 20px" }}
      >
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--accent)", fontWeight: 500 }}>
          The public version, if we ship it at launch: the chosen objects, the
          archived directions, and one line of reasoning per decision — a
          design annual report. Specimens stay marked, partners stay
          unnamed until permissioned, and the review-room chrome comes with it.
        </p>
      </section>
    </main>
  );
}
