"use client";

/**
 * Signal HQ · marketing-plan deck, brand-book edition.
 *
 * Private (rendered only behind the /hq token gate). This deck is built
 * to the Signal Studio Brand Book §11, Pitch Deck system: every slide
 * is a true 16:9 frame carrying the same four-corner chrome (kicker
 * top-left, ref top-right, wordmark + indigo dot bottom-left, slide
 * number bottom-right). Three palettes only, paper, ink, indigo —
 * cycled, never mixed: paper is the default, ink is the divider, indigo
 * is the closing slide and nothing else. Type is held at the projection
 * floor (≥ ~1.4cqi). Slides cut, they never fade, push, or build
 * (Brand Book §11.01.6); the only motion is the cover dot settling.
 *
 * Faithful to the book but not a VC pitch: this is a living strategy
 * document, so the eight templates are extended with a disciplined
 * content frame (defs / ledger / figures) that stays inside the same
 * chrome, mono labels, hairlines, one indigo. Read-mode renders the
 * whole plan as one document. Tokens are pinned locally to the book's
 * exact values so the deck reads as torn out of it, independent of the
 * app theme, and they sit inside the 2026-05-13 white/zinc lock.
 *
 * Content source of truth: docs/MARKETING_PLAN_6MO.md.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";

type SectionId = "verdict" | "engine" | "machine" | "sixmonths" | "field";

const SECTIONS: { id: SectionId; numeral: string; title: string; line: string }[] =
  [
    { id: "verdict", numeral: "I", title: "The verdict", line: "Why the number had to change before anything else could." },
    { id: "engine", numeral: "II", title: "The engine", line: "The one decision that makes the revenue real." },
    { id: "machine", numeral: "III", title: "The machine", line: "The bar, and the factory that holds it overnight." },
    { id: "sixmonths", numeral: "IV", title: "Six months", line: "What happens, in what order, judged on what." },
    { id: "field", numeral: "V", title: "The field & the test", line: "Where we play, what we refuse, how we know it worked." },
  ];

type Kind = "title" | "divider" | "statement" | "metrics" | "content" | "closing";
export type Slide = {
  kind: Kind;
  section?: SectionId;
  kicker?: string;
  title: string;
  /** statement only, the short line spoken under the headline */
  say?: string;
  body?: ReactNode;
};

/**
 * Title, renders a heading string with its trailing full-stop in
 * indigo. "The period is a signal" (Brand Book §00): the dot is the
 * brand mark, so every titled statement lands on it.
 */
export function T({ children }: { children: string }) {
  const s = children;
  if (s.endsWith(".")) {
    return (
      <>
        {s.slice(0, -1)}
        <span className="mdk-period">.</span>
      </>
    );
  }
  return <>{s}</>;
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="mdk-lead">{children}</p>;
}
function Note({ children }: { children: ReactNode }) {
  return <p className="mdk-note">{children}</p>;
}
function Pull({ children }: { children: ReactNode }) {
  return <p className="mdk-pull">{children}</p>;
}
function Defs({ items }: { items: [string, string][] }) {
  return (
    <dl className="mdk-defs">
      {items.map(([k, v]) => (
        <div className="mdk-def" key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
function Figures({ items }: { items: { v: string; l: string }[] }) {
  return (
    <div className="mdk-figs">
      {items.map((f) => (
        <div className="mdk-fig" key={f.l}>
          <div className="mdk-fig-v">{f.v}</div>
          <div className="mdk-fig-l">{f.l}</div>
        </div>
      ))}
    </div>
  );
}
function Ledger({
  head,
  rows,
  onIndex,
}: {
  head: [string, string, string];
  rows: [string, string, string][];
  onIndex?: number;
}) {
  return (
    <div className="mdk-ledger" role="table">
      <div className="mdk-lr mdk-lh" role="row">
        {head.map((h) => (
          <span key={h} role="columnheader">
            {h}
          </span>
        ))}
      </div>
      {rows.map((r, i) => (
        <div
          className={`mdk-lr${i === onIndex ? " mdk-lr-on" : ""}`}
          role="row"
          key={r[0]}
        >
          {r.map((c, j) => (
            <span key={j} role="cell">
              {c}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export const DECK: Slide[] = [
  {
    kind: "title",
    title: "Six-month\nmarketing plan.",
  },
  // ── I · The verdict ────────────────────────────────
  { kind: "divider", section: "verdict", title: "The verdict" },
  {
    kind: "content",
    section: "verdict",
    kicker: "The honest read",
    title: "Arithmetic before marketing.",
    body: (
      <>
        <Lead>
          At €12 a month and €89 one-time, a solo, zero-ad motion produces
          ≤€125k optimistically. The Venue Edition now adds exactly €1,500
          for each venue closed; the old complimentary model adds nothing.
          A plan that flattered you would have hidden that.
        </Lead>
        <Note>So the goal was reframed. It is still ambitious.</Note>
      </>
    ),
  },
  {
    kind: "metrics",
    section: "verdict",
    kicker: "The goal",
    title: "Reframed, and accepted.",
    body: (
      <Figures
        items={[
          { v: "€250k", l: "cash · first six months" },
          { v: "€500k", l: "by month twelve" },
          { v: "zero", l: "brand-integrity exceptions" },
        ]}
      />
    ),
  },
  // ── II · The engine ────────────────────────────────
  { kind: "divider", section: "engine", title: "The engine" },
  {
    kind: "content",
    section: "engine",
    kicker: "Gate zero · ratified",
    title: "The venue pays.",
    body: (
      <>
        <Lead>
          The Venue Edition is a paid annual tier. Patronage, not
          enterprise software, the venue stands behind the couple&rsquo;s
          planning.
        </Lead>
        <Defs
          items={[
            ["Venue Edition", "€1,500 per venue, per year, prepaid"],
            ["Founding lock", "first ~15 venues hold that price for life"],
            ["Pro", "€120 a year, annual prepay"],
            ["Event", "€89 one-time"],
          ]}
        />
      </>
    ),
  },
  {
    kind: "statement",
    section: "engine",
    kicker: "Why this is the plan",
    title: "A paid venue is negative-CAC.",
    say: "Without it, the honest six-month number is under €75k.",
    body: (
      <Lead>
        It pays Signal Studio to seed fifty to a hundred and fifty
        high-intent couples into the suite, every year, recurring. The
        restraint is the pitch, a taste-driven venue owner is exactly the
        buyer this brand was built for. Without it, the honest six-month
        number is under €75k.
      </Lead>
    ),
  },
  {
    kind: "content",
    section: "engine",
    kicker: "Revenue architecture",
    title: "Three motions, in order.",
    body: (
      <Defs
        items={[
          ["One", "Paid Venue Edition, the wedge and distribution engine"],
          ["Two", "Event €89 at volume, fed by sponsoring venues' couples"],
          ["Three", "Pro €12/mo, the compounding year-two annuity"],
        ]}
      />
    ),
  },
  {
    kind: "content",
    section: "engine",
    kicker: "Scenarios · cash, six months",
    title: "Plan to the middle line.",
    body: (
      <>
        <Ledger
          head={["Scenario", "Venues", "6-mo cash"]}
          rows={[
            ["Floor", "25", "~€78k"],
            ["Stretch-credible", "60", "~€235k"],
            ["€500k path", "240", "~€500k"],
          ]}
          onIndex={1}
        />
        <Note>
          The €500k path needs ~240 closed contracts in 26 weeks, well beyond
          a solo sales motion. Plan to ~€235k; €500k is a mathematical
          boundary, not a forecast.
        </Note>
      </>
    ),
  },
  // ── III · The machine ──────────────────────────────
  { kind: "divider", section: "machine", title: "The machine" },
  {
    kind: "content",
    section: "machine",
    kicker: "The bar",
    title: "The gate every asset passes.",
    body: (
      <>
        <Lead>
          No exclamation marks. No AI-marketing register. No SaaS fluff.
          No three-adjective trios. Never &ldquo;Signal&rdquo; alone.
        </Lead>
        <Pull>
          Every piece must contain a sentence a generic competitor would
          never publish. If the logo could be swapped, it fails.
        </Pull>
      </>
    ),
  },
  {
    kind: "statement",
    section: "machine",
    kicker: "The factory",
    title: "You approve. You do not produce.",
    say: "The laptop is the studio. Your eye is the last gate, not the first.",
    body: (
      <Lead>
        A standing pipeline runs overnight. Production agents draft; a
        four-agent panel reviews; what survives lands in a queue that
        never exceeds seven items on a Monday. The laptop is the studio.
        Your eye is the last gate, not the first.
      </Lead>
    ),
  },
  {
    kind: "content",
    section: "machine",
    kicker: "The review panel",
    title: "Four agents before you see anything.",
    body: (
      <Defs
        items={[
          ["Brand QA", "BRAND.md compliance, hard-blocks banned register"],
          ["Reality Anchor", "claims checked against shipped state, anti-drift"],
          ["Tone", "Stark + Jobs register, scored, rewritten below seven"],
          ["Audience Fit", "the Sinéad test, would a coordinator forward it"],
        ]}
      />
    ),
  },
  // ── IV · Six months ────────────────────────────────
  { kind: "divider", section: "sixmonths", title: "Six months" },
  {
    kind: "content",
    section: "sixmonths",
    kicker: "Month by month",
    title: "The sequence.",
    body: (
      <Ledger
        head={["Mo.", "Theme", "Judged on"]}
        rows={[
          ["M1", "Foundations + first signal", "1 qualified venue talk"],
          ["M2", "SEO flywheel + pilot live", "first posts' CTR"],
          ["M3", "First public proof", "50 subs · first €89"],
          ["M4", "Venue channel repeatable", "3 active venues"],
          ["M5", "Pro + shareable proof", "Pro MRR"],
          ["M6", "Self-sustaining referral", "2 warm referrals"],
        ]}
      />
    ),
  },
  {
    kind: "content",
    section: "sixmonths",
    kicker: "Founder rhythm",
    title: "Three and a half deliberate hours a week.",
    body: (
      <Defs
        items={[
          ["Monday · 60m", "clear the queue · write the brief · one venue email"],
          ["Tue–Thu · 30m", "same-day venue replies · publish one approved asset"],
          ["Friday · 30m", "what shipped · one retro line · fix one factory miss"],
        ]}
      />
    ),
  },
  // ── V · The field & the test ───────────────────────
  { kind: "divider", section: "field", title: "The field & the test" },
  {
    kind: "content",
    section: "field",
    kicker: "Channels · free only",
    title: "Ranked by real return.",
    body: (
      <Defs
        items={[
          ["One", "Hand-written venue outreach, ≤50 a round, founder-signed"],
          ["Two", "Sponsored-workspace loop, every shared artifact acquires"],
          ["Three", "Comparison / alternative SEO pages, real angles only"],
          ["Four", "Wedding-pro communities, value first, product second"],
          ["Five", "Restrained founder video + a one-time directory pass"],
        ]}
      />
    ),
  },
  {
    kind: "content",
    section: "field",
    kicker: "Non-goals",
    title: "What we refuse.",
    body: (
      <Lead>
        No paid ads. No Product Hunt or Show HN. No daily short-form
        treadmill. No AI-listicle SEO at volume. No mass-blast outbound.
        No content for the sake of frequency. Each would buy reach by
        spending the moat.
      </Lead>
    ),
  },
  {
    kind: "content",
    section: "field",
    kicker: "Risks · kill triggers",
    title: "What breaks the plan.",
    body: (
      <Defs
        items={[
          ["Brand vs the number", "any motion needing a banned tactic, the motion is wrong"],
          ["Solo throughput", "1/10 venue replies by M3 → product call, not copy"],
          ["Concentration", "75% one buyer, the M4 SEO pivot is the second leg"],
          ["Factory slop", "two off-register published → pause, tighten, resume"],
        ]}
      />
    ),
  },
  {
    kind: "content",
    section: "field",
    kicker: "Definition of success",
    title: "Judge it on these five.",
    body: (
      <Defs
        items={[
          ["By M3", "≥10 paid venues, the motion, not the deck"],
          ["Repeatable", "≥25% close rate on qualified talks"],
          ["By M4", "≥1 inbound venue from a referral"],
          ["Distribution", "≥40% sponsored-couple → active user"],
          ["The moat", "zero brand-integrity exceptions logged"],
        ]}
      />
    ),
  },
  {
    kind: "closing",
    section: "field",
    kicker: "The ask",
    title: "One gate. Then month one.",
    body: (
      <>
        <Lead>
          Pre-launch readiness. Operator: provision Timeline Upstash, clear
          the four Lamb&rsquo;s Hill steps. Agent-side: write shipped
          state, fix the pricing-surface drift, stand up the factory.
        </Lead>
        <Note>
          docs/MARKETING_PLAN_6MO.md ·
          content/hq/decisions/venue-editions-paid-tier.md
        </Note>
      </>
    ),
  },
];

function sectionOf(s: Slide): SectionId | null {
  return s.section ?? null;
}

/** The four corners every slide carries, the binding of the deck. */
function Chrome({
  index,
  total,
}: {
  index: number;
  total: number;
}) {
  return (
    <>
      <span className="mdk-c mdk-c-tl">signal studio · plan</span>
      <span className="mdk-c mdk-c-tr">2026.05 · private</span>
      <span className="mdk-c mdk-c-bl">
        signal studio<span className="mdk-c-dot" />
      </span>
      <span className="mdk-c mdk-c-br">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </>
  );
}

export default function MarketingDeck() {
  const total = DECK.length;
  const [index, setIndex] = useState(0);
  const [pane, setPane] = useState<null | "contents" | "read" | "help">(null);
  const liveSlide = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setIndex(clamped);
    },
    [total],
  );

  useEffect(() => {
    const fromHash = () => {
      const n = parseInt(window.location.hash.replace("#", ""), 10);
      if (!Number.isNaN(n) && n >= 1 && n <= total) setIndex(n - 1);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [total]);

  useEffect(() => {
    const target = `#${index + 1}`;
    if (window.location.hash !== target)
      window.history.replaceState(null, "", target);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setPane((p) => (p ? null : "contents"));
        return;
      }
      if (e.key === "?") {
        e.preventDefault();
        setPane((p) => (p === "help" ? null : "help"));
        return;
      }
      if (e.key === "r") {
        e.preventDefault();
        setPane((p) => (p === "read" ? null : "read"));
        return;
      }
      if (e.key === "g") {
        e.preventDefault();
        setPane((p) => (p === "contents" ? null : "contents"));
        return;
      }
      if (e.key === "f") {
        e.preventDefault();
        if (!document.fullscreenElement)
          document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
        return;
      }
      if (pane) return;
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
        case "j":
          e.preventDefault();
          go(index + 1);
          break;
        case "ArrowLeft":
        case "PageUp":
        case "k":
          e.preventDefault();
          go(index - 1);
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(total - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go, total, pane]);

  const slide = DECK[index];
  const sec = sectionOf(slide);
  const secMeta = SECTIONS.find((s) => s.id === sec) ?? null;

  const kickerLine = slide.kicker
    ? secMeta
      ? `${secMeta.numeral} · ${slide.kicker}`
      : slide.kicker
    : null;

  const counter = (
    <span className="mdk-count" aria-live="polite">
      {String(index + 1).padStart(2, "0")}
      <span className="mdk-count-sep">&thinsp;/&thinsp;</span>
      {String(total).padStart(2, "0")}
    </span>
  );

  return (
    <div className="mdk-root">
      <style>{CSS}</style>

      {pane === "read" ? (
        <article className="mdk-read">
          <header className="mdk-read-head">
            <span className="mdk-eyebrow">Signal HQ · Private</span>
            <h1>Six-month marketing plan</h1>
            <p>
              The ratified plan as one document. Press <kbd>r</kbd> to
              return to the deck.
            </p>
          </header>
          {DECK.map((s, i) => {
            if (s.kind === "title") return null;
            if (s.kind === "divider") {
              const m = SECTIONS.find((x) => x.id === s.section);
              return (
                <div className="mdk-read-act" key={i}>
                  <span>{m?.numeral}</span>
                  <h2>
                    <T>{s.title}</T>
                  </h2>
                  <p>{m?.line}</p>
                </div>
              );
            }
            return (
              <section className="mdk-read-sec" key={i}>
                {s.kicker ? (
                  <span className="mdk-eyebrow">{s.kicker}</span>
                ) : null}
                <h3>
                  <T>{s.title}</T>
                </h3>
                <div className="mdk-read-body">{s.body}</div>
              </section>
            );
          })}
        </article>
      ) : pane === "contents" ? (
        <div className="mdk-contents">
          <div className="mdk-contents-inner">
            <span className="mdk-eyebrow">Contents</span>
            {SECTIONS.map((m) => (
              <div className="mdk-toc-act" key={m.id}>
                <button
                  type="button"
                  className="mdk-toc-acthead"
                  onClick={() => {
                    const di = DECK.findIndex(
                      (d) => d.kind === "divider" && d.section === m.id,
                    );
                    if (di >= 0) {
                      setPane(null);
                      go(di);
                    }
                  }}
                >
                  <span className="mdk-toc-num">{m.numeral}</span>
                  <span className="mdk-toc-title">{m.title}</span>
                </button>
                <ul>
                  {DECK.map((d, i) =>
                    (d.kind === "content" ||
                      d.kind === "statement" ||
                      d.kind === "metrics" ||
                      d.kind === "closing") &&
                    d.section === m.id ? (
                      <li key={i}>
                        <button
                          type="button"
                          className={i === index ? "on" : ""}
                          onClick={() => {
                            setPane(null);
                            go(i);
                          }}
                        >
                          <span className="mdk-toc-i">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {d.title}
                        </button>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : pane === "help" ? (
        <div className="mdk-help">
          <div className="mdk-help-inner">
            <span className="mdk-eyebrow">Keys</span>
            <Defs
              items={[
                ["→ space j", "next"],
                ["← k", "previous"],
                ["g · Esc", "contents"],
                ["r", "read mode, the plan as one document"],
                ["f", "fullscreen, present"],
                ["?", "this"],
              ]}
            />
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            className="mdk-zone mdk-zone-prev"
            aria-label="Previous"
            tabIndex={-1}
            onClick={() => go(index - 1)}
          />
          <button
            type="button"
            className="mdk-zone mdk-zone-next"
            aria-label="Next"
            tabIndex={-1}
            onClick={() => go(index + 1)}
          />

          <div className="mdk-canvas">
            <div
              ref={liveSlide}
              className={`mdk-slide mdk-${slide.kind}${
                slide.kind === "divider"
                  ? " is-ink"
                  : slide.kind === "closing"
                    ? " is-indigo"
                    : ""
              }`}
              aria-label={`Slide ${index + 1} of ${total}: ${slide.title}`}
            >
              <Chrome index={index} total={total} />

              {slide.kind === "title" ? (
                <div className="mdk-area">
                  <span className="mdk-kick">2026·05 · ratified</span>
                  <h1 className="mdk-title-h">
                    {slide.title.split("\n").map((l, i) => (
                      <span key={i}>
                        <T>{l}</T>
                      </span>
                    ))}
                  </h1>
                  <p className="mdk-title-sub">
                    The engine that takes Signal Studio to its first real
                    revenue, one founder, a room of agents.
                  </p>
                </div>
              ) : slide.kind === "divider" ? (
                <div className="mdk-area">
                  <span className="mdk-div-num" aria-hidden="true">
                    {secMeta?.numeral}
                  </span>
                  <div className="mdk-div-text">
                    <span className="mdk-kick">section</span>
                    <h2 className="mdk-div-h">
                      <T>{slide.title}</T>
                    </h2>
                    <p className="mdk-div-line">{secMeta?.line}</p>
                  </div>
                </div>
              ) : slide.kind === "statement" ? (
                <div className="mdk-area">
                  {kickerLine ? (
                    <span className="mdk-kick mdk-kick-pip">
                      {kickerLine}
                    </span>
                  ) : null}
                  <p className="mdk-statement">
                    <T>{slide.title}</T>
                  </p>
                  {slide.say ? (
                    <p className="mdk-statement-say">{slide.say}</p>
                  ) : null}
                </div>
              ) : slide.kind === "metrics" ? (
                <div className="mdk-area">
                  {kickerLine ? (
                    <span className="mdk-kick">{kickerLine}</span>
                  ) : null}
                  <h2 className="mdk-metrics-h">
                    <T>{slide.title}</T>
                  </h2>
                  <div className="mdk-metrics-row">{slide.body}</div>
                </div>
              ) : slide.kind === "closing" ? (
                <div className="mdk-area">
                  <div className="mdk-close-top">
                    {kickerLine ? (
                      <span className="mdk-kick">{kickerLine}</span>
                    ) : null}
                    <h2 className="mdk-close-h">
                      <T>{slide.title}</T>
                    </h2>
                    <div className="mdk-close-body">{slide.body}</div>
                  </div>
                  <div className="mdk-close-foot">
                    <span>signal studio · plan</span>
                    <span className="mdk-close-end">hello@signalstudio.ie</span>
                  </div>
                </div>
              ) : (
                <div className="mdk-area mdk-area-content">
                  {kickerLine ? (
                    <span className="mdk-kick">{kickerLine}</span>
                  ) : null}
                  <h2 className="mdk-content-h">
                    <T>{slide.title}</T>
                  </h2>
                  <div className="mdk-content-body">{slide.body}</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <footer className="mdk-bar">
        <div className="mdk-seg" aria-hidden="true">
          {SECTIONS.map((m) => {
            const ids = DECK.map((d, i) => ({ d, i })).filter(
              ({ d }) => d.section === m.id,
            );
            const done = ids.filter(({ i }) => i <= index).length;
            const pct = ids.length ? (done / ids.length) * 100 : 0;
            return (
              <span className="mdk-seg-u" key={m.id}>
                <span className="mdk-seg-f" style={{ width: `${pct}%` }} />
              </span>
            );
          })}
        </div>
        <div className="mdk-bar-l">
          {secMeta ? `Act ${secMeta.numeral}, ${secMeta.title}` : "Cover"}
        </div>
        <div className="mdk-bar-c">
          <button
            type="button"
            className="mdk-btn"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          {counter}
          <button
            type="button"
            className="mdk-btn"
            onClick={() => go(index + 1)}
            disabled={index === total - 1}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
        <div className="mdk-bar-r">
          <Link
            href="/hq/plan/print"
            className="mdk-tab"
            title="Open the print-ready version, then Export PDF"
          >
            export pdf
          </Link>
          <button
            type="button"
            className={`mdk-tab${pane === "contents" ? " on" : ""}`}
            onClick={() =>
              setPane((p) => (p === "contents" ? null : "contents"))
            }
          >
            contents
          </button>
          <button
            type="button"
            className={`mdk-tab${pane === "read" ? " on" : ""}`}
            onClick={() => setPane((p) => (p === "read" ? null : "read"))}
          >
            read
          </button>
          <button
            type="button"
            className="mdk-tab mdk-tab-q"
            onClick={() => setPane((p) => (p === "help" ? null : "help"))}
            aria-label="Keyboard help"
          >
            ?
          </button>
        </div>
      </footer>
    </div>
  );
}

const CSS = `
/* ═══ Signal HQ marketing deck, Brand Book §11 · Pitch Deck system.
 * Tokens pinned to the book's exact values so the deck reads as torn
 * out of it. Three palettes only, paper / ink / indigo, cycled,
 * never mixed. Geist 500 lowercase headings, Geist Mono chrome, the
 * indigo period is the signature, hairlines never shadows. Type held
 * at the projection floor. Slides cut; they never build. Neutrals sit
 * inside the 2026-05-13 white/zinc lock. ═══ */
.mdk-root{
  --paper:#FFFFFF; --paper-soft:#F4F4F5;
  --ink:#0B0B0F; --ink-soft:#2A2A30; --ink-faint:#71717A; --ink-ghost:#B5B5BC;
  --hair:#E4E4E7; --hair-soft:#EFEFF1;
  --indigo:#4F46E5;
  --grid:rgba(0,0,0,0.035);
  --foot:64px;
  position:relative;min-height:100dvh;
  background:var(--paper);color:var(--ink);display:flex;
  flex-direction:column;overflow:hidden;
  font-feature-settings:"ss01","cv11"}
.mdk-period{color:var(--indigo)}
.mdk-eyebrow{font-family:var(--font-mono-stack);font-size:10px;font-weight:500;
  letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint)}
.mdk-zone{position:absolute;top:0;bottom:var(--foot);width:22%;z-index:6;
  border:0;background:transparent;cursor:pointer;padding:0}
.mdk-zone-prev{left:0}.mdk-zone-next{right:0}
.mdk-zone:focus-visible{outline:none}

/* ── the canvas: a page from the book, slide centred on a faint grid */
.mdk-canvas{flex:1;display:flex;align-items:center;justify-content:center;
  padding:clamp(16px,3.2vw,52px);min-height:0;
  background-image:
    linear-gradient(to right,var(--grid) 1px,transparent 1px),
    linear-gradient(to bottom,var(--grid) 1px,transparent 1px);
  background-size:clamp(28px,3vw,48px) clamp(28px,3vw,48px);
  background-position:-1px -1px}

/* ── the slide: a true 16:9 frame, internally scaled by container query */
.mdk-slide{
  position:relative;width:100%;
  max-width:min(100%, calc((100dvh - var(--foot) - clamp(32px,6.4vw,104px)) * 16 / 9));
  aspect-ratio:16 / 9;
  background:var(--paper);color:var(--ink);
  border:1px solid var(--hair);border-radius:5px;
  overflow:hidden;container-type:inline-size;isolation:isolate}
.mdk-slide.is-ink{background:var(--ink);color:var(--paper);
  border-color:var(--ink)}
.mdk-slide.is-indigo{background:var(--indigo);color:var(--paper);
  border-color:var(--indigo)}

/* ── chrome: the four corners, identical on every slide */
.mdk-c{position:absolute;z-index:5;font-family:var(--font-mono-stack);
  font-size:1.4cqi;font-weight:500;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink-ghost)}
.mdk-c-tl{top:3.4cqi;left:3.8cqi}
.mdk-c-tr{top:3.4cqi;right:3.8cqi}
.mdk-c-bl{bottom:3.4cqi;left:3.8cqi;color:var(--ink-faint);
  display:inline-flex;align-items:baseline}
.mdk-c-br{bottom:3.4cqi;right:3.8cqi;font-variant-numeric:tabular-nums}
.mdk-c-dot{display:inline-block;width:.4em;height:.4em;border-radius:50%;
  background:var(--indigo);margin-left:.12em;vertical-align:.04em}
.is-ink .mdk-c,.is-indigo .mdk-c{color:rgba(255,255,255,.5)}
.is-ink .mdk-c-bl,.is-indigo .mdk-c-bl{color:rgba(255,255,255,.66)}
.is-indigo .mdk-c-dot{background:var(--paper)}

/* ── body area: the safe field inside the chrome */
.mdk-area{position:absolute;top:7.4cqi;bottom:7cqi;left:6.4cqi;right:6.4cqi;
  display:flex;flex-direction:column;z-index:2}

/* shared kicker */
.mdk-kick{font-family:var(--font-mono-stack);font-size:1.45cqi;font-weight:500;
  letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint)}
.is-ink .mdk-kick,.is-indigo .mdk-kick{color:rgba(255,255,255,.6)}
.mdk-kick-pip::before{content:"";display:inline-block;width:.62em;height:.62em;
  border-radius:50%;background:var(--indigo);margin-right:.62em;
  vertical-align:.04em}

/* ── TITLE, headline anchored bottom-left, the front door */
.mdk-title .mdk-area{justify-content:flex-end;align-items:flex-start}
.mdk-title-h{font-size:8.2cqi;line-height:.98;letter-spacing:-.03em;
  font-weight:500;margin:2.4cqi 0 0;text-transform:lowercase;
  font-feature-settings:"ss01","cv11"}
.mdk-title-h span{display:block}
.mdk-title-sub{margin:3cqi 0 0;max-width:46cqi;font-size:1.9cqi;
  line-height:1.5;color:var(--ink-soft)}

/* ── DIVIDER, ink only; giant indigo numeral + chapter title */
.mdk-divider .mdk-area{flex-direction:row;align-items:center;
  gap:6cqi;top:8cqi;bottom:8cqi}
.mdk-div-num{font-family:var(--font-mono-stack);font-weight:500;
  font-size:30cqi;line-height:1;letter-spacing:-.04em;color:var(--indigo);
  flex:none;user-select:none;font-variant-numeric:tabular-nums}
.mdk-div-text{display:flex;flex-direction:column;gap:1.6cqi}
.mdk-div-h{font-size:6.4cqi;line-height:1;letter-spacing:-.025em;
  font-weight:500;margin:0;text-transform:lowercase;max-width:14ch}
.mdk-div-line{margin:1cqi 0 0;max-width:34ch;font-size:1.8cqi;
  line-height:1.5;color:rgba(255,255,255,.62)}

/* ── STATEMENT, one sentence is the slide */
.mdk-statement-slide{}
.mdk-statement .mdk-area{justify-content:center;align-items:flex-start}
.mdk-statement{font-size:6.4cqi;line-height:1.04;letter-spacing:-.026em;
  font-weight:500;margin:2.4cqi 0 0;max-width:17ch;text-transform:lowercase;
  text-wrap:balance;font-feature-settings:"ss01","cv11"}
.mdk-statement-say{margin:3cqi 0 0;font-size:1.95cqi;line-height:1.5;
  color:var(--ink-soft);max-width:42cqi}

/* ── METRICS, the number row, three figures, hairlines */
.mdk-metrics .mdk-area{justify-content:center;gap:4cqi}
.mdk-metrics-h{font-size:4.4cqi;line-height:1.05;letter-spacing:-.022em;
  font-weight:500;margin:0;max-width:20ch;text-transform:lowercase}

/* ── CONTENT, the living-document frame, still in chrome.
 * Top-anchored, not centred: predictable rhythm, never clips. */
.mdk-area-content{justify-content:flex-start;gap:0}
.mdk-content-h{font-size:3.5cqi;line-height:1.05;letter-spacing:-.024em;
  font-weight:500;margin:.85cqi 0 1.7cqi;max-width:24ch;
  text-transform:lowercase}
.mdk-content-body{font-size:1.6cqi;line-height:1.5;color:var(--ink-soft)}

/* ── CLOSING, indigo, the only one; ask high, address low */
.mdk-closing .mdk-area{justify-content:space-between}
.mdk-close-top{display:flex;flex-direction:column;gap:1.8cqi}
.mdk-close-h{font-size:6.2cqi;line-height:1;letter-spacing:-.026em;
  font-weight:500;margin:0;max-width:15ch;text-transform:lowercase}
.is-indigo .mdk-close-h .mdk-period{color:var(--paper)}
.mdk-close-body{margin-top:.6cqi;max-width:54cqi}
.mdk-close-body .mdk-lead{color:var(--paper);font-size:1.95cqi}
.mdk-close-body .mdk-note{color:rgba(255,255,255,.6);margin-top:1.2cqi}
.mdk-close-foot{display:flex;justify-content:space-between;align-items:baseline;
  width:100%;padding-top:2cqi;border-top:1px solid rgba(255,255,255,.22);
  font-family:var(--font-mono-stack);font-size:1.4cqi;font-weight:500;
  letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7)}
.mdk-close-end{color:var(--paper)}

/* ── content primitives, scaled to the frame (cqi) ─────────────── */
.mdk-lead{font-size:2.1cqi;line-height:1.42;color:var(--ink);margin:0;
  max-width:42ch;font-weight:400;text-wrap:pretty}
.is-ink .mdk-lead,.is-indigo .mdk-lead{color:var(--paper)}
.mdk-note{margin:2cqi 0 0;font-size:1.55cqi;line-height:1.55;
  color:var(--ink-faint);max-width:52ch}
.mdk-pull{margin:2.4cqi 0 0;font-size:2.05cqi;line-height:1.45;
  color:var(--ink);max-width:40ch;padding-left:1.6cqi;
  border-left:.28cqi solid var(--indigo)}
.mdk-defs{display:flex;flex-direction:column;
  border-top:1px solid var(--hair)}
.mdk-def{display:grid;grid-template-columns:minmax(13cqi,20cqi) 1fr;
  gap:2.4cqi;padding:.82cqi 0;border-bottom:1px solid var(--hair-soft)}
.mdk-def dt{font-family:var(--font-mono-stack);font-size:1.45cqi;
  font-weight:500;color:var(--ink);letter-spacing:.01em;padding-top:.2cqi}
.mdk-def dd{margin:0;font-size:1.65cqi;line-height:1.42;
  color:var(--ink-soft);max-width:46ch}
.is-ink .mdk-def dt,.is-indigo .mdk-def dt{color:var(--paper)}
.is-ink .mdk-def dd,.is-indigo .mdk-def dd{color:rgba(255,255,255,.72)}
.mdk-figs{display:grid;grid-template-columns:1fr 1fr 1fr;
  border-top:1px solid var(--hair);border-bottom:1px solid var(--hair)}
.mdk-fig{padding:2.6cqi 0 2.6cqi 2.4cqi;border-left:1px solid var(--hair)}
.mdk-fig:first-child{border-left:0;padding-left:0}
.mdk-fig-v{font-size:7cqi;font-weight:500;letter-spacing:-.03em;
  line-height:1;color:var(--ink);font-variant-numeric:tabular-nums}
.mdk-fig:first-child .mdk-fig-v{color:var(--indigo)}
.mdk-fig-l{margin-top:1.4cqi;font-family:var(--font-mono-stack);
  font-size:1.3cqi;font-weight:500;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink-faint)}
.mdk-ledger{display:flex;flex-direction:column}
.mdk-lr{display:grid;grid-template-columns:1fr 2.2fr 1fr;gap:2cqi;
  padding:.62cqi 0;border-bottom:1px solid var(--hair-soft);
  font-size:1.62cqi;color:var(--ink-soft);align-items:baseline}
.mdk-lr span:last-child{font-variant-numeric:tabular-nums;text-align:right}
.mdk-lh{font-family:var(--font-mono-stack);font-size:1.3cqi;font-weight:500;
  letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint);
  border-bottom:1px solid var(--ink)}
.mdk-lr-on{color:var(--ink);font-weight:500}
.mdk-lr-on span:last-child{color:var(--indigo)}

/* ── footer chrome (presenter UI, not on the slide) */
.mdk-bar{position:relative;z-index:4;display:grid;
  grid-template-columns:1fr auto 1fr;align-items:center;gap:1.5rem;
  height:var(--foot);padding:0 clamp(1rem,3vw,1.75rem);
  border-top:1px solid var(--hair-soft);background:var(--paper)}
.mdk-seg{position:absolute;top:-1px;left:0;right:0;height:2px;display:flex;
  gap:3px;padding:0 clamp(1rem,3vw,1.75rem)}
.mdk-seg-u{flex:1;background:var(--hair);overflow:hidden}
.mdk-seg-f{display:block;height:100%;background:var(--indigo)}
.mdk-bar-l{font-family:var(--font-mono-stack);font-size:10px;font-weight:500;
  letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mdk-bar-c{display:flex;align-items:center;gap:.6rem;justify-self:center}
.mdk-bar-r{display:flex;align-items:center;gap:.35rem;justify-self:end}
.mdk-btn{font-family:var(--font-mono-stack);font-size:14px;color:var(--ink);
  background:none;border:1px solid var(--hair);border-radius:999px;
  width:32px;height:32px;cursor:pointer;
  transition:border-color .15s,color .15s}
.mdk-btn:hover:not(:disabled){border-color:var(--indigo);color:var(--indigo)}
.mdk-btn:disabled{opacity:.3;cursor:default}
.mdk-count{font-family:var(--font-mono-stack);font-size:13px;font-weight:500;
  font-variant-numeric:tabular-nums;min-width:62px;text-align:center}
.mdk-count-sep{color:var(--ink-faint);font-weight:400}
.mdk-tab{position:relative;font-family:var(--font-mono-stack);font-size:11px;
  font-weight:500;letter-spacing:.04em;color:var(--ink-faint);
  background:none;border:0;padding:6px 8px 6px 14px;cursor:pointer;
  text-transform:lowercase;transition:color .15s}
.mdk-tab::before{content:"";position:absolute;left:5px;top:50%;width:4px;
  height:4px;border-radius:50%;background:var(--indigo);
  transform:translateY(-50%) scale(0);transition:transform .16s
  cubic-bezier(.22,.7,.2,1)}
.mdk-tab:hover{color:var(--ink)}
.mdk-tab.on{color:var(--ink)}
.mdk-tab.on::before{transform:translateY(-50%) scale(1)}
.mdk-tab-q{width:24px;padding-left:8px}
.mdk-tab-q::before{content:none}

/* ── contents */
.mdk-contents{flex:1;overflow:auto;padding:clamp(3rem,9vh,6rem) clamp(1.5rem,5vw,5rem)}
.mdk-contents-inner{max-width:60rem;margin:0 auto;display:flex;
  flex-direction:column;gap:2.5rem}
.mdk-toc-act{display:flex;flex-direction:column;gap:.5rem}
.mdk-toc-acthead{display:flex;align-items:baseline;gap:1rem;background:none;
  border:0;padding:.5rem 0;cursor:pointer;text-align:left;
  border-bottom:1px solid var(--hair)}
.mdk-toc-num{font-family:var(--font-mono-stack);font-size:13px;font-weight:500;
  color:var(--indigo);min-width:2rem}
.mdk-toc-title{font-size:clamp(1.25rem,1rem+1vw,1.75rem);font-weight:500;
  letter-spacing:-.022em;color:var(--ink);text-transform:lowercase}
.mdk-toc-act ul{list-style:none;margin:0;padding:.5rem 0 0 3rem;
  display:flex;flex-direction:column}
.mdk-toc-act li button{position:relative;display:flex;gap:1rem;
  align-items:baseline;background:none;border:0;padding:.5rem 0 .5rem 1rem;
  cursor:pointer;text-align:left;font-size:16px;color:var(--ink-soft);
  width:100%;text-transform:lowercase;transition:color .15s}
.mdk-toc-act li button::before{content:"";position:absolute;left:0;top:1.05rem;
  width:5px;height:5px;border-radius:50%;background:var(--indigo);
  transform:scale(0);transition:transform .16s cubic-bezier(.22,.7,.2,1)}
.mdk-toc-act li button:hover{color:var(--ink)}
.mdk-toc-act li button.on{color:var(--ink)}
.mdk-toc-act li button.on::before{transform:scale(1)}
.mdk-toc-i{font-family:var(--font-mono-stack);font-size:11px;font-weight:500;
  color:var(--ink-faint);min-width:1.75rem}

/* ── read mode (the plan as one document, px, not a slide) */
.mdk-read{flex:1;overflow:auto;padding:clamp(3rem,10vh,7rem) clamp(1.5rem,5vw,5rem) 8rem}
.mdk-read>*{max-width:42rem;margin-left:auto;margin-right:auto}
.mdk-read-head h1{font-size:clamp(2rem,1.4rem+3vw,3.25rem);
  letter-spacing:-.025em;font-weight:500;margin:.75rem 0 .5rem;
  line-height:1.08;text-transform:lowercase}
.mdk-read-head p{color:var(--ink-faint);font-size:15px;margin:0}
.mdk-read-head kbd{font-family:var(--font-mono-stack);font-size:12px;
  border:1px solid var(--hair);border-radius:4px;padding:1px 5px}
.mdk-read-act{margin:5rem auto 2rem;padding-top:1.5rem;
  border-top:1px solid var(--ink);display:flex;align-items:baseline;
  gap:1rem;flex-wrap:wrap}
.mdk-read-act span{font-family:var(--font-mono-stack);font-size:13px;
  font-weight:500;color:var(--indigo)}
.mdk-read-act h2{font-size:clamp(1.6rem,1.2rem+2vw,2.4rem);font-weight:500;
  letter-spacing:-.025em;margin:0;text-transform:lowercase}
.mdk-read-act p{flex-basis:100%;color:var(--ink-faint);
  font-size:15px;margin:.25rem 0 0}
.mdk-read-sec{margin:2.75rem auto 0}
.mdk-read-sec h3{font-size:clamp(1.35rem,1.1rem+1.2vw,1.85rem);font-weight:500;
  letter-spacing:-.022em;margin:.6rem 0 1rem;line-height:1.18;
  text-transform:lowercase}
.mdk-read-body{font-size:16px;line-height:1.7;color:var(--ink-soft)}
.mdk-read-body .mdk-lead{font-size:17px;color:var(--ink);max-width:none;
  line-height:1.6}
.mdk-read-body .mdk-note{font-size:14px;max-width:none}
.mdk-read-body .mdk-pull{font-size:17px;padding-left:1.15rem;
  border-left-width:2px}
.mdk-read-body .mdk-defs{margin-top:1.25rem;border-top-width:1px}
.mdk-read-body .mdk-def{grid-template-columns:minmax(7rem,13rem) 1fr;
  gap:1.75rem;padding:.9rem 0}
.mdk-read-body .mdk-def dt{font-size:12px}
.mdk-read-body .mdk-def dd{font-size:15px}
.mdk-read-body .mdk-figs{margin-top:1.25rem;gap:0}
.mdk-read-body .mdk-fig{padding:1.25rem 0 1.25rem 1.5rem}
.mdk-read-body .mdk-fig-v{font-size:2.5rem}
.mdk-read-body .mdk-fig-l{font-size:10px;margin-top:.75rem}
.mdk-read-body .mdk-lr{grid-template-columns:8rem 1fr 7rem;gap:1.25rem;
  padding:.78rem 0;font-size:15px}
.mdk-read-body .mdk-lh{font-size:10px}

/* ── help */
.mdk-help{flex:1;display:flex;align-items:center;justify-content:center;
  padding:clamp(1.5rem,5vw,5rem)}
.mdk-help-inner{width:100%;max-width:30rem;display:flex;flex-direction:column;
  gap:1.5rem}
.mdk-help-inner .mdk-defs{border-top:1px solid var(--hair)}
.mdk-help-inner .mdk-def{grid-template-columns:minmax(7rem,11rem) 1fr;
  gap:1.5rem;padding:.7rem 0}
.mdk-help-inner .mdk-def dt{font-size:12px}
.mdk-help-inner .mdk-def dd{font-size:14px}

/* slides cut, they never build (Brand Book §11.01.6).
 * the only motion in the deck is the cover dot settling once. */
:focus-visible{outline:2px solid var(--indigo);outline-offset:3px}
.mdk-title .mdk-c-dot{animation:mdk-settle .9s cubic-bezier(.22,.7,.2,1) both}
@keyframes mdk-settle{0%{transform:scale(0);opacity:0}
  60%{opacity:1}100%{transform:scale(1);opacity:1}}
@media (prefers-reduced-motion:reduce){
  .mdk-title .mdk-c-dot{animation:none}
  .mdk-tab::before,.mdk-toc-act li button::before{transition:none}}

@media (max-width:820px){
  .mdk-zone{display:none}
  .mdk-canvas{padding:16px}
  .mdk-slide{max-width:100%}
  .mdk-bar{grid-template-columns:auto 1fr;gap:.75rem}
  .mdk-bar-l{display:none}
  .mdk-bar-c{justify-self:start}
  .mdk-bar-r{justify-self:end}
  .mdk-read-body .mdk-def{grid-template-columns:1fr;gap:.25rem}
  .mdk-read-body .mdk-lr{grid-template-columns:3rem 1fr;gap:.5rem 1rem}
  .mdk-read-body .mdk-lr span:last-child{grid-column:2;text-align:left}
  .mdk-read-body .mdk-lh{display:none}}
`;
