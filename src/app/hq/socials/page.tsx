import type { Metadata } from "next";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { requireHqAccess } from "@/lib/hq/access-guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Posting Queue · Signal HQ",
  description: "Six weeks of social posts, drafted and sequenced. Founder approves; nothing posts without a yes.",
  robots: { index: false, follow: false },
};

const P = "/brand/collateral/social";

type QueuedPost = {
  slot: string;
  format: string;
  platforms: string;
  image: string;
  caption: string;
  alt: string;
  sizes: Array<{ label: string; file: string }>;
};

function post(slot: string, format: string, platforms: string, base: string, caption: string, alt: string, extraSizes: string[] = ["ig-portrait", "li-landscape"]): QueuedPost {
  return {
    slot,
    format,
    platforms,
    image: `${P}/${base}-ig-square.png`,
    caption,
    alt,
    sizes: [
      { label: "square", file: `${P}/${base}-ig-square.png` },
      ...extraSizes.map((s) => ({ label: s.replace("ig-", "").replace("li-", "linkedin "), file: `${P}/${base}-${s}.png` })),
    ],
  };
}

const QUEUE: QueuedPost[] = [
  post("W1 · Mon", "S·2 The Belief", "Instagram · LinkedIn", "s2-belief-b00",
    "Calm is a feature. We build it on purpose. One of the nine beliefs Signal Studio is built on. signalstudio.ie",
    "Signal Studio belief, Calm is a feature. We build it on purpose."),
  post("W1 · Thu", "S·1 The Number", "Instagram · LinkedIn", "s1-number-n01",
    "19,898 weddings in Ireland last year. Most were planned in a group chat. We think the people running them deserve better tools. Built in Limerick.",
    "Signal Studio, 19,898 weddings in Ireland last year. Most were planned in a group chat."),
  post("W2 · Mon", "S·3 Before / After", "Instagram · TikTok", "s3-beforeafter-schedule",
    "One plan. Everyone sees it. signalstudio.ie",
    "Signal Studio, before: an email thread titled Re: Re: Re: FINAL schedule v7. After: one plan, everyone sees it."),
  post("W2 · Thu", "S·2 The Belief", "Instagram · LinkedIn", "s2-belief-b03",
    "Elegance is restraint. Belief three of nine. signalstudio.ie",
    "Signal Studio belief three, Elegance is restraint."),
  post("W3 · Mon", "S·5 Founder Note", "LinkedIn", "s5-foundernote-quote01",
    "Most of the projects in this country never get called one. The weddings, the venues, the committees, real coordination, none of the tooling. We built the software those projects deserve., Ethan",
    "Quote from Ethan McNamara, founder of Signal Studio.", ["li-landscape"]),
  post("W3 · Thu", "S·1 The Number", "Instagram · LinkedIn", "s1-number-n02",
    "€36,641, the average spend on an Irish wedding. The plan holding it together deserves more than a group chat.",
    "Signal Studio, €36,641, the average spend on an Irish wedding."),
  post("W4 · Mon", "S·3 Before / After", "Instagram · TikTok", "s3-beforeafter-owner",
    "One owner, one date, per task. That's the whole trick. signalstudio.ie",
    "Signal Studio, before: a file named final underscore FINAL v9 use this one. After: one owner, one date, per task."),
  post("W4 · Thu", "S·2 The Belief", "Instagram · LinkedIn", "s2-belief-b05",
    "People want calm, not more features. Belief five of nine. signalstudio.ie",
    "Signal Studio belief five, People want calm, not more features."),
  post("W5 · Mon", "S·1 The Number", "Instagram · LinkedIn", "s1-number-n03",
    "70+ societies at UL alone. Most run their year in a group chat. The Student Edition is €8.99 a year with a college email, committee workspace included.",
    "Signal Studio, 70 plus societies at UL alone."),
  post("W5 · Thu", "S·2 The Belief", "Instagram · LinkedIn", "s2-belief-b07",
    "The best systems reduce cognitive load. Belief seven of nine. signalstudio.ie",
    "Signal Studio belief seven, The best systems reduce cognitive load."),
  post("W6 · Mon", "S·3 Before / After", "Instagram · TikTok", "s3-beforeafter-unread",
    "The one thing due today. Everything else can wait its turn. signalstudio.ie",
    "Signal Studio, before: you have 47 unread messages. After: the one thing due today."),
  post("W6 · Thu", "S·2 The Belief", "Instagram · LinkedIn", "s2-belief-b09",
    "Signal over noise, in product, brand, and plan. Belief nine of nine. signalstudio.ie",
    "Signal Studio belief nine, Signal over noise, in product, brand, and plan."),
];

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono-stack)",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

export default async function SocialsPage() {
  await requireHqAccess();

  return (
    <main id="main" className="hq-page">
      <HqPageHeader
        slug="socials"
        title="Nothing is written the day it posts"
        standfirst="Twelve posts, two a week, deck-locked images with alt text; nothing posts without the founder's yes."
        meta={
          <span className="hq-page-head-note">
            six weeks · twelve posts · pre-approved
          </span>
        }
      />

      <section aria-label="posting rules"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          margin: "32px 0 32px",
        }}
      >
        {[
          ["Cadence", "Two to three per week, pre-approved"],
          ["One idea", "One claim per post, fully made"],
          ["Numbers", "Only statistics the deck defends"],
          ["Access", "Alt text on every image, always"],
          ["No bait", "No hashtag clouds, no engagement hooks"],
          ["Replies", "The founder answers every comment"],
        ].map(([k, v]) => (
          <div key={k} style={{ border: "1px solid var(--hairline)", borderRadius: "8px", padding: "12px 14px" }}>
            <div style={{ ...mono, fontSize: "10px", fontWeight: 600, color: "var(--accent)" }}>{k}</div>
            <div style={{ fontSize: "13px", color: "var(--ink-soft)", marginTop: "4px", lineHeight: 1.45 }}>{v}</div>
          </div>
        ))}
      </section>

      <section aria-label="the queue" style={{ display: "grid", gap: "28px" }}>
        {QUEUE.map((q) => (
          <article
            key={q.slot + q.image}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(220px, 300px) 1fr",
              gap: "0",
              border: "1px solid var(--hairline)",
              borderRadius: "10px",
              overflow: "hidden",
              background: "var(--paper)",
            }}
          >
            <div style={{ background: "var(--paper-deep)", padding: "14px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={q.image}
                alt={q.alt}
                style={{ width: "100%", height: "auto", display: "block", borderRadius: "6px", boxShadow: "0 12px 32px rgba(10,10,11,0.12)" }}
              />
            </div>
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", ...mono, fontSize: "11px" }}>
                <span style={{ fontWeight: 600 }}>
                  <span style={{ color: "var(--accent)" }}>{q.slot}</span>
                  &ensp;·&ensp;{q.format}
                </span>
                <span style={{ color: "var(--ink-faint)" }}>{q.platforms}</span>
              </div>
              <div
                style={{
                  border: "1px solid var(--hairline)",
                  borderRadius: "6px",
                  background: "var(--paper-soft)",
                  padding: "12px 14px",
                  fontSize: "14px",
                  lineHeight: 1.55,
                  color: "var(--ink)",
                }}
              >
                {q.caption}
              </div>
              <div style={{ fontSize: "12px", lineHeight: 1.5, color: "var(--ink-faint)" }}>
                <span style={{ ...mono, fontSize: "9.5px", fontWeight: 600 }}>alt&ensp;</span>
                {q.alt}
              </div>
              <div style={{ marginTop: "auto", ...mono, fontSize: "10.5px" }}>
                {q.sizes.map((s, i) => (
                  <span key={s.file}>
                    {i > 0 && " · "}
                    <a href={s.file} style={{ color: "var(--accent)" }}>{s.label}</a>
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section
        aria-label="how to approve"
        style={{
          marginTop: "40px",
          background: "var(--accent-soft)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "0 6px 6px 0",
          padding: "16px 20px",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--accent)", fontWeight: 500 }}>
          The images are deck-locked; the captions are drafts, approve the
          queue as written, or name the slots to change. Nothing posts without
          your yes. The full bank (all nine beliefs, every size, every format)
          lives at /brand/collateral/social/.
        </p>
      </section>
    </main>
  );
}
