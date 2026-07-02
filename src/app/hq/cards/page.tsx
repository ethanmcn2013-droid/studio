import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Card — batch two — Signal HQ",
  description: "Six directions for the founder card. Founder chooses; the printer gets one file.",
  robots: { index: false, follow: false },
};

type CardVariant = {
  id: string;
  name: string;
  front: string;
  back: string;
  read: string;
  spec: string;
};

const VARIANTS: CardVariant[] = [
  {
    id: "ink",
    name: "01 · Ink",
    front: "Ink-dark front — the wordmark high, the indigo stroke low.",
    back: "White reverse — the contact grid, site in indigo mono.",
    read: "The deck's card. Serious, editorial, photographs beautifully. The safest world-class choice.",
    spec: "350–400gsm uncoated duplex · rich black front · one indigo event per side",
  },
  {
    id: "indigo",
    name: "02 · Indigo",
    front: "Solid indigo front — white wordmark, white stroke. The panel is the event.",
    back: "White reverse — the contact grid.",
    read: "The boldest of the six. Owns the brand colour completely; unmistakable in a stack of business cards.",
    spec: "350–400gsm uncoated duplex · PMS 2726C if offset · white reverse",
  },
  {
    id: "paper",
    name: "03 · Paper",
    front: "White front — the wordmark alone, optically centred.",
    back: "White reverse — the contact grid.",
    read: "Quietest confidence. With an indigo painted edge it becomes the most tactile object of the set — the accent only appears when the card turns.",
    spec: "600gsm duplexed uncoated · indigo edge paint (the one indigo event) · letterpress optional",
  },
  {
    id: "duo",
    name: "04 · Duo",
    front: "Ink-dark front — wordmark and stroke.",
    back: "Solid indigo reverse — the contact grid in white.",
    read: "The mix-and-match: black hands the brand, indigo hands the person. Two panels, no white anywhere — the palette is the finish, literally.",
    spec: "350–400gsm uncoated duplex · rich black + PMS 2726C · no white face",
  },
  {
    id: "dot",
    name: "05 · The Dot",
    front: "Ink-dark front — the indigo dot, alone, dead centre. Nothing else.",
    back: "White reverse — wordmark joins the contact grid.",
    read: "The brand at its most distilled: the dot is the company. Demands a beat of curiosity before the flip — the most conversation-starting object here.",
    spec: "400gsm uncoated duplex · rich black · spot-colour dot, or a deboss + indigo fill",
  },
  {
    id: "broadcast",
    name: "06 · Broadcast",
    front: "White front — the dot mid-emit, two hairline rings holding the motion still.",
    back: "White reverse — wordmark joins the contact grid.",
    read: "The suite's hero gesture as a printed emblem. With the rings blind-debossed and only the dot in ink, it reads like a maker's mark — the most delightful in the hand.",
    spec: "600gsm uncoated · rings blind-debossed, dot printed · the quiet flex",
  },
];

export default async function CardsPage() {
  await requireHqAccess();

  return (
    <main id="main" className="hq-page">
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">Signal HQ · The card system · Batch two</span>
        <h1 className="hq-page-title">
          Six ways to hand someone the company
          <span aria-hidden="true" style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <p className="hq-page-intro">
          The card is the first thing most of Limerick will hold — one accent,
          no finish to hide behind. Every direction below is print-ready at
          85×55mm with bleed and crop marks. Choose a front and a back; they
          mix and match — say the pairing and the print file is ready the
          same day.
        </p>
      </header>

      <section aria-label="card directions" style={{ display: "grid", gap: "40px", marginTop: "8px" }}>
        {VARIANTS.map((v) => (
          <article
            key={v.id}
            style={{
              border: "1px solid var(--hairline)",
              borderRadius: "10px",
              overflow: "hidden",
              background: "var(--paper)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "16px",
                padding: "10px 18px",
                borderBottom: "1px solid var(--hairline)",
                background: "var(--paper-soft)",
                fontFamily: "var(--font-mono-stack)",
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ fontWeight: 600 }}>{v.name}</span>
              <span style={{ color: "var(--ink-faint)" }}>{v.spec}</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "18px",
                padding: "18px",
                background: "var(--paper-deep)",
              }}
            >
              <figure style={{ margin: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/brand/collateral/cards/cardx-${v.id}-front-preview.png`}
                  alt={`${v.name} — front: ${v.front}`}
                  style={{ width: "100%", height: "auto", display: "block", borderRadius: "6px", boxShadow: "0 16px 40px rgba(10,10,11,0.12)" }}
                />
                <figcaption style={{ fontSize: "12.5px", color: "var(--ink-faint)", marginTop: "8px", lineHeight: 1.5 }}>
                  {v.front}
                </figcaption>
              </figure>
              <figure style={{ margin: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/brand/collateral/cards/cardx-${v.id}-back-preview.png`}
                  alt={`${v.name} — back: ${v.back}`}
                  style={{ width: "100%", height: "auto", display: "block", borderRadius: "6px", boxShadow: "0 16px 40px rgba(10,10,11,0.12)" }}
                />
                <figcaption style={{ fontSize: "12.5px", color: "var(--ink-faint)", marginTop: "8px", lineHeight: 1.5 }}>
                  {v.back}
                </figcaption>
              </figure>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "24px",
                padding: "14px 18px",
                borderTop: "1px solid var(--hairline)",
              }}
            >
              <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.55, color: "var(--ink-soft)", maxWidth: "70ch" }}>{v.read}</p>
              <span style={{ whiteSpace: "nowrap", fontFamily: "var(--font-mono-stack)", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <a href={`/brand/collateral/cards/cardx-${v.id}-front-print.pdf`} style={{ color: "var(--accent)" }}>front pdf</a>
                {" · "}
                <a href={`/brand/collateral/cards/cardx-${v.id}-back-print.pdf`} style={{ color: "var(--accent)" }}>back pdf</a>
              </span>
            </div>
          </article>
        ))}
      </section>

      <section
        aria-label="how to decide"
        style={{
          marginTop: "40px",
          background: "var(--accent-soft)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "0 6px 6px 0",
          padding: "16px 20px",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--accent)", fontWeight: 500 }}>
          How to decide: order a short proof run of your top two on the real
          stock and choose by touch. The test is unchanged — would you be
          proud to leave it on the front desk of the best venue in Limerick?
          Fronts and backs mix freely; the print notes ship with whichever
          pairing you name.
        </p>
      </section>
    </main>
  );
}
