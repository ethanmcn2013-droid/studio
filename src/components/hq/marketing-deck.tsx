"use client";

/**
 * Signal HQ · marketing-plan deck — founder edition.
 *
 * Private (rendered only behind the /hq token gate). Authority for
 * every token is DESIGN.md (paper white, ink #111, one indigo, Geist +
 * Geist Mono, hairlines over shadows, restraint). This is not "more" —
 * it is precision: an editorial grid, typographic command, acts that
 * give the plan a spine, a contents map, and a read-mode so the deck
 * doubles as a living strategy document the founder actually uses.
 * Motion is subtle and fully removed under prefers-reduced-motion
 * (DESIGN.md §5/§10 — no decoration, no celebration). Content source
 * of truth: docs/MARKETING_PLAN_6MO.md.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SectionId = "verdict" | "engine" | "machine" | "sixmonths" | "field";

const SECTIONS: { id: SectionId; numeral: string; title: string; line: string }[] =
  [
    { id: "verdict", numeral: "I", title: "The verdict", line: "Why the number had to change before anything else could." },
    { id: "engine", numeral: "II", title: "The engine", line: "The one decision that makes the revenue real." },
    { id: "machine", numeral: "III", title: "The machine", line: "The bar, and the factory that holds it overnight." },
    { id: "sixmonths", numeral: "IV", title: "Six months", line: "What happens, in what order, judged on what." },
    { id: "field", numeral: "V", title: "The field & the test", line: "Where we play, what we refuse, how we know it worked." },
  ];

type Kind = "cover" | "divider" | "content" | "closing";
type Slide = {
  kind: Kind;
  section?: SectionId;
  kicker?: string;
  title: string;
  body?: ReactNode;
};

/**
 * Title — renders a heading string with its trailing full-stop in
 * indigo. "The period is a signal" (new brand guide, principle 06):
 * the dot is the brand mark, so every titled statement ends on it.
 */
function T({ children }: { children: string }) {
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

const DECK: Slide[] = [
  {
    kind: "cover",
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
          At €12 a month and €79 one-time, a solo, zero-ad motion produces
          ≤€125k optimistically. The venue wedge, given away, produced
          nothing. A plan that flattered you would have hidden that.
        </Lead>
        <Note>So the goal was reframed. It is still ambitious.</Note>
      </>
    ),
  },
  {
    kind: "content",
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
          enterprise software — the venue stands behind the couple&rsquo;s
          planning.
        </Lead>
        <Defs
          items={[
            ["Venue Edition", "€1,500–€4,000 a year, prepaid"],
            ["Founding lock", "first ~15 venues hold €1,500 for life"],
            ["Workspace", "€120 a year, annual prepay"],
            ["Event", "€79 one-time — unchanged"],
          ]}
        />
      </>
    ),
  },
  {
    kind: "content",
    section: "engine",
    kicker: "Why this is the plan",
    title: "A paid venue is negative-CAC.",
    body: (
      <Lead>
        It pays Signal Studio to seed fifty to a hundred and fifty
        high-intent couples into the suite, every year, recurring. The
        restraint is the pitch — a taste-driven venue owner is exactly the
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
          ["One", "Paid Venue Edition — the engine, 75–85% of the number"],
          ["Two", "Event €79 at volume — fed by sponsoring venues' couples"],
          ["Three", "Workspace €12/mo — the compounding year-two annuity"],
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
            ["Floor", "25", "~€77k"],
            ["Stretch-credible", "60", "~€295k"],
            ["€500k path", "120", "~€500k"],
          ]}
          onIndex={1}
        />
        <Note>
          The €500k path needs ~120 closed contracts in 26 weeks — a
          sales-team output. Plan to ~€250–300k; €500k is the month-twelve
          destination of the same motion.
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
    kind: "content",
    section: "machine",
    kicker: "The factory",
    title: "You approve. You do not produce.",
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
          ["Brand QA", "BRAND.md compliance — hard-blocks banned register"],
          ["Reality Anchor", "claims checked against shipped state — anti-drift"],
          ["Tone", "Stark + Jobs register, scored, rewritten below seven"],
          ["Audience Fit", "the Sinéad test — would a coordinator forward it"],
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
          ["M3", "First public proof", "50 subs · first €79"],
          ["M4", "Venue channel repeatable", "3 active venues"],
          ["M5", "Workspace + shareable proof", "Workspace MRR"],
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
          ["One", "Hand-written venue outreach — ≤50 a round, founder-signed"],
          ["Two", "Sponsored-workspace loop — every shared artifact acquires"],
          ["Three", "Comparison / alternative SEO pages — real angles only"],
          ["Four", "Wedding-pro communities — value first, product second"],
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
          ["Brand vs the number", "any motion needing a banned tactic — the motion is wrong"],
          ["Solo throughput", "1/10 venue replies by M3 → product call, not copy"],
          ["Concentration", "75% one buyer — the M4 SEO pivot is the second leg"],
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
          ["By M3", "≥10 paid venues — the motion, not the deck"],
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
    title: "One gate between this and month one.",
    body: (
      <>
        <Lead>
          Pre-launch readiness. Operator: provision Roadmap Upstash, clear
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

export default function MarketingDeck() {
  const total = DECK.length;
  const [index, setIndex] = useState(0);
  const [pane, setPane] = useState<null | "contents" | "read" | "help">(null);
  const [animKey, setAnimKey] = useState(0);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(total - 1, next));
      setIndex((cur) => {
        if (clamped !== cur) setAnimKey((k) => k + 1);
        return clamped;
      });
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
  const progress = ((index + 1) / total) * 100;

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
              The ratified plan as one document. Press{" "}
              <kbd>r</kbd> to return to the deck.
            </p>
          </header>
          {DECK.map((s, i) => {
            if (s.kind === "cover") return null;
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
                    d.kind === "content" && d.section === m.id ? (
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
                ["r", "read mode — the plan as one document"],
                ["1–9", "(in contents) jump"],
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

          {slide.kind === "cover" ? (
            <section key={animKey} className="mdk-stage mdk-cover">
              <span className="mdk-eyebrow mdk-cover-meta">
                Signal HQ · Private · Ratified 2026·05·16
              </span>
              <h1 className="mdk-cover-title">
                {slide.title.split("\n").map((l, i) => (
                  <span key={i}>
                    <T>{l}</T>
                  </span>
                ))}
              </h1>
              <p className="mdk-cover-sub">
                The engine that takes Signal Studio to its first real
                revenue, built for one founder and a room of agents.
              </p>
              <span className="mdk-cover-wm">
                signal studio<span className="mdk-dot">.</span>
              </span>
              <svg
                className="mdk-rings"
                viewBox="0 0 200 200"
                aria-hidden="true"
              >
                {[28, 52, 78, 104].map((r, i) => (
                  <circle
                    key={r}
                    className="mdk-ring"
                    cx="100"
                    cy="100"
                    r={r}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="1"
                    style={{ animationDelay: `${i * 140}ms` }}
                  />
                ))}
              </svg>
            </section>
          ) : slide.kind === "divider" ? (
            <section key={animKey} className="mdk-stage mdk-divider">
              <span className="mdk-div-num" aria-hidden="true">
                {secMeta?.numeral}
              </span>
              <div className="mdk-div-body">
                <span className="mdk-eyebrow">
                  Act {secMeta?.numeral}
                </span>
                <h2 className="mdk-div-title">
                <T>{slide.title}</T>
              </h2>
                <p className="mdk-div-line">{secMeta?.line}</p>
              </div>
            </section>
          ) : (
            <section
              key={animKey}
              className="mdk-stage mdk-slide"
              aria-label={`Slide ${index + 1} of ${total}: ${slide.title}`}
            >
              <div className="mdk-rail">
                <span className="mdk-rail-i">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mdk-rail-act">
                  {secMeta ? `${secMeta.numeral} · ${secMeta.title}` : ""}
                </span>
                {slide.kicker ? (
                  <span className="mdk-rail-k">{slide.kicker}</span>
                ) : null}
              </div>
              <div className="mdk-well">
                <h2 className="mdk-h">
                  <T>{slide.title}</T>
                </h2>
                <div className="mdk-content">{slide.body}</div>
              </div>
            </section>
          )}
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
                <span
                  className="mdk-seg-f"
                  style={{ width: `${pct}%` }}
                />
              </span>
            );
          })}
        </div>
        <div className="mdk-bar-l">
          {secMeta ? `Act ${secMeta.numeral} — ${secMeta.title}` : "—"}
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
/* ═══ Signal Studio marketing deck — new design system, white-locked
 * Geist 500 lowercase headings · the indigo period is the signature ·
 * fixed type ladder · hairlines, never shadows · one indigo · the dot
 * reads time. Neutrals held to the 2026-05-13 white/zinc lock; the
 * brand guide's warm Stone ramp is book-only. ═══ */
.mdk-root{--gap:clamp(1.5rem,5vw,5rem);
  --r:6px;
  position:relative;min-height:100dvh;
  background:var(--paper,#fff);color:var(--ink,#111);display:flex;
  flex-direction:column;overflow:hidden;
  font-feature-settings:"ss01","cv11"}
/* the period is a signal — every titled statement lands on the dot */
.mdk-period{color:var(--accent,#4f46e5)}
.mdk-eyebrow{font-family:var(--font-mono-stack);font-size:10px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;
  color:var(--ink-quiet,#71717a)}
.mdk-zone{position:absolute;top:0;bottom:68px;width:24%;z-index:2;border:0;
  background:transparent;cursor:pointer;padding:0}
.mdk-zone-prev{left:0}.mdk-zone-next{right:0}
.mdk-zone:focus-visible{outline:none}

/* shared stage */
.mdk-stage{flex:1;display:flex;width:100%;max-width:76rem;margin:0 auto;
  padding:clamp(3rem,9vh,7rem) var(--gap) calc(68px + clamp(1rem,4vh,2.5rem))}

/* cover */
.mdk-cover{flex-direction:column;justify-content:center;position:relative}
.mdk-cover-meta{display:block;margin-bottom:clamp(2rem,8vh,4rem)}
.mdk-cover-title{font-size:clamp(2.75rem,1.5rem+5.5vw,6rem);line-height:.96;
  letter-spacing:-.03em;font-weight:500;margin:0;text-transform:lowercase;
  font-feature-settings:"ss01","cv11"}
.mdk-cover-title span{display:block}
.mdk-cover-sub{margin:clamp(1.5rem,4vh,2.5rem) 0 0;max-width:36ch;
  font-size:clamp(1rem,.92rem+.38vw,1.2rem);line-height:1.55;
  color:var(--ink-soft,#3f3f46)}
.mdk-cover-wm{position:absolute;left:var(--gap);
  bottom:calc(68px + clamp(1rem,4vh,2.5rem));font-size:13px;font-weight:500;
  letter-spacing:-.025em;color:var(--ink-quiet,#71717a);
  text-transform:lowercase}
.mdk-cover-wm .mdk-dot{color:var(--accent,#4f46e5)}
.mdk-rings{position:absolute;right:calc(var(--gap) - 1rem);
  bottom:calc(68px - 2rem);width:clamp(180px,26vw,340px);height:auto;
  opacity:.14;pointer-events:none}
/* broadcast — the Studio gesture: rings send outward once, then rest */
.mdk-ring{transform-box:fill-box;transform-origin:center;
  animation:mdk-broadcast 1.4s cubic-bezier(.22,.7,.2,1) both}
@keyframes mdk-broadcast{
  0%{transform:scale(.2);opacity:0}
  35%{opacity:1}
  100%{transform:scale(1);opacity:1}}

/* divider */
.mdk-divider{align-items:center;gap:clamp(2rem,6vw,5rem)}
.mdk-div-num{font-size:clamp(7rem,12rem+6vw,20rem);line-height:.8;
  font-weight:500;letter-spacing:-.05em;color:var(--ink,#111);
  opacity:.05;flex:none;user-select:none;font-variant-numeric:tabular-nums}
.mdk-div-body{align-self:center}
.mdk-div-title{font-size:clamp(2.25rem,1.5rem+4vw,4.5rem);line-height:1.05;
  letter-spacing:-.025em;font-weight:500;margin:1rem 0 0;
  text-transform:lowercase}
.mdk-div-line{margin:1.25rem 0 0;max-width:36ch;font-size:16px;
  line-height:1.55;color:var(--ink-soft,#3f3f46)}

/* content — editorial two-column */
.mdk-slide{gap:clamp(2rem,6vw,5.5rem)}
.mdk-rail{flex:none;width:clamp(7rem,16vw,12rem);display:flex;
  flex-direction:column;gap:.85rem;padding-top:.4rem;
  border-top:1px solid var(--ink,#111)}
.mdk-rail-i{font-family:var(--font-mono-stack);font-size:13px;font-weight:500;
  font-variant-numeric:tabular-nums;color:var(--accent,#4f46e5);
  margin-top:.85rem}
.mdk-rail-act,.mdk-rail-k{font-family:var(--font-mono-stack);font-size:10px;
  font-weight:500;letter-spacing:.08em;
  text-transform:uppercase;color:var(--ink-quiet,#71717a);line-height:1.5}
.mdk-rail-k{color:var(--ink-soft,#3f3f46)}
.mdk-well{flex:1;min-width:0;display:flex;flex-direction:column;
  justify-content:center;max-width:46rem}
.mdk-h{font-size:clamp(1.85rem,1.25rem+3vw,3.4rem);line-height:1.08;
  letter-spacing:-.025em;font-weight:500;margin:0 0 clamp(1.5rem,4vh,2.5rem);
  max-width:18ch;text-transform:lowercase}
.mdk-content{font-size:16px;line-height:1.65;color:var(--ink-soft,#3f3f46)}
.mdk-lead{font-size:clamp(1.1rem,.98rem+.55vw,1.4rem);line-height:1.5;
  color:var(--ink,#111);margin:0;max-width:40ch;font-weight:400}
.mdk-note{margin:1.6rem 0 0;font-size:14px;line-height:1.6;
  color:var(--ink-quiet,#71717a);max-width:52ch}
.mdk-pull{margin:1.5rem 0 0;font-size:clamp(1.05rem,.95rem+.4vw,1.3rem);
  line-height:1.5;color:var(--ink,#111);max-width:38ch;
  padding-left:1.15rem;border-left:2px solid var(--accent,#4f46e5)}
.mdk-defs{display:flex;flex-direction:column;
  border-top:1px solid var(--hairline,rgba(17,17,17,.10))}
.mdk-def{display:grid;grid-template-columns:minmax(7rem,13rem) 1fr;
  gap:1.75rem;padding:.9rem 0;
  border-bottom:1px solid var(--hairline-2,rgba(17,17,17,.06))}
.mdk-def dt{font-family:var(--font-mono-stack);font-size:12px;font-weight:500;
  color:var(--ink,#111);letter-spacing:.01em;padding-top:1px}
.mdk-def dd{margin:0;font-size:15px;line-height:1.55;
  color:var(--ink-soft,#3f3f46)}
.mdk-figs{display:flex;flex-wrap:wrap;gap:clamp(2rem,7vw,5rem)}
.mdk-fig-v{font-size:clamp(2.75rem,1.6rem+4.5vw,5.25rem);font-weight:500;
  letter-spacing:-.03em;line-height:.96;color:var(--ink,#111);
  font-variant-numeric:tabular-nums}
.mdk-fig:first-child .mdk-fig-v{color:var(--accent,#4f46e5)}
.mdk-fig-l{margin-top:.75rem;font-family:var(--font-mono-stack);font-size:10px;
  font-weight:500;letter-spacing:.08em;
  text-transform:uppercase;color:var(--ink-quiet,#71717a)}
.mdk-ledger{display:flex;flex-direction:column}
.mdk-lr{display:grid;grid-template-columns:8rem 1fr 7rem;gap:1.25rem;
  padding:.78rem 0;border-bottom:1px solid var(--hairline-2,rgba(17,17,17,.06));
  font-size:15px;color:var(--ink-soft,#3f3f46);align-items:baseline}
.mdk-lr span:last-child{font-variant-numeric:tabular-nums;text-align:right}
.mdk-lh{font-family:var(--font-mono-stack);font-size:10px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;
  color:var(--ink-quiet,#71717a);border-bottom:1px solid var(--ink,#111)}
.mdk-lr-on{color:var(--ink,#111);font-weight:500}
.mdk-lr-on span:last-child{color:var(--accent,#4f46e5)}

/* footer chrome */
.mdk-bar{position:relative;z-index:3;display:grid;
  grid-template-columns:1fr auto 1fr;align-items:center;gap:1.5rem;
  height:68px;padding:0 clamp(1rem,3vw,1.75rem);
  border-top:1px solid var(--hairline-2,rgba(17,17,17,.06));
  background:var(--paper,#fff)}
.mdk-seg{position:absolute;top:-1px;left:0;right:0;height:2px;display:flex;
  gap:3px;padding:0 clamp(1rem,3vw,1.75rem)}
.mdk-seg-u{flex:1;background:var(--ink-ghost,#d4d4d8);overflow:hidden}
.mdk-seg-f{display:block;height:100%;background:var(--accent,#4f46e5);
  transition:width .5s cubic-bezier(.32,.72,0,1)}
.mdk-bar-l{font-family:var(--font-mono-stack);font-size:10px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;color:var(--ink-quiet,#71717a);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mdk-bar-c{display:flex;align-items:center;gap:.6rem;justify-self:center}
.mdk-bar-r{display:flex;align-items:center;gap:.35rem;justify-self:end}
.mdk-btn{font-family:var(--font-mono-stack);font-size:14px;color:var(--ink,#111);
  background:none;border:1px solid var(--hairline,rgba(17,17,17,.10));
  border-radius:999px;width:32px;height:32px;cursor:pointer;
  transition:border-color .15s,color .15s,background .15s}
.mdk-btn:hover:not(:disabled){border-color:var(--accent,#4f46e5);
  color:var(--accent,#4f46e5)}
.mdk-btn:disabled{opacity:.3;cursor:default}
.mdk-count{font-family:var(--font-mono-stack);font-size:13px;font-weight:500;
  font-variant-numeric:tabular-nums;min-width:62px;text-align:center}
.mdk-count-sep{color:var(--ink-quiet,#71717a);font-weight:400}
.mdk-tab{position:relative;font-family:var(--font-mono-stack);font-size:11px;
  font-weight:500;letter-spacing:.04em;color:var(--ink-quiet,#71717a);
  background:none;border:0;padding:6px 8px 6px 14px;cursor:pointer;
  text-transform:lowercase;transition:color .15s}
.mdk-tab::before{content:"";position:absolute;left:5px;top:50%;width:4px;
  height:4px;border-radius:50%;background:var(--accent,#4f46e5);
  transform:translateY(-50%) scale(0);transition:transform .16s
  cubic-bezier(.22,.7,.2,1)}
.mdk-tab:hover{color:var(--ink,#111)}
.mdk-tab.on{color:var(--ink,#111)}
.mdk-tab.on::before{transform:translateY(-50%) scale(1)}
.mdk-tab-q{width:24px;padding-left:8px}
.mdk-tab-q::before{content:none}

/* contents */
.mdk-contents{flex:1;overflow:auto;padding:clamp(3rem,9vh,6rem) var(--gap)}
.mdk-contents-inner{max-width:60rem;margin:0 auto;display:flex;
  flex-direction:column;gap:2.5rem}
.mdk-toc-act{display:flex;flex-direction:column;gap:.5rem}
.mdk-toc-acthead{display:flex;align-items:baseline;gap:1rem;background:none;
  border:0;padding:.5rem 0;cursor:pointer;text-align:left;
  border-bottom:1px solid var(--hairline,rgba(17,17,17,.10))}
.mdk-toc-num{font-family:var(--font-mono-stack);font-size:13px;font-weight:500;
  color:var(--accent,#4f46e5);min-width:2rem}
.mdk-toc-title{font-size:clamp(1.25rem,1rem+1vw,1.75rem);font-weight:500;
  letter-spacing:-.022em;color:var(--ink,#111);text-transform:lowercase}
.mdk-toc-act ul{list-style:none;margin:0;padding:.5rem 0 0 3rem;
  display:flex;flex-direction:column}
.mdk-toc-act li button{position:relative;display:flex;gap:1rem;
  align-items:baseline;background:none;border:0;padding:.5rem 0 .5rem 1rem;
  cursor:pointer;text-align:left;font-size:16px;color:var(--ink-soft,#3f3f46);
  width:100%;text-transform:lowercase;transition:color .15s}
.mdk-toc-act li button::before{content:"";position:absolute;left:0;top:1.05rem;
  width:5px;height:5px;border-radius:50%;background:var(--accent,#4f46e5);
  transform:scale(0);transition:transform .16s cubic-bezier(.22,.7,.2,1)}
.mdk-toc-act li button:hover{color:var(--ink,#111)}
.mdk-toc-act li button.on{color:var(--ink,#111)}
.mdk-toc-act li button.on::before{transform:scale(1)}
.mdk-toc-i{font-family:var(--font-mono-stack);font-size:11px;font-weight:500;
  color:var(--ink-quiet,#71717a);min-width:1.75rem}

/* read mode */
.mdk-read{flex:1;overflow:auto;padding:clamp(3rem,10vh,7rem) var(--gap) 8rem}
.mdk-read>*{max-width:42rem;margin-left:auto;margin-right:auto}
.mdk-read-head h1{font-size:clamp(2rem,1.4rem+3vw,3.25rem);
  letter-spacing:-.025em;font-weight:500;margin:.75rem 0 .5rem;
  line-height:1.08;text-transform:lowercase}
.mdk-read-head p{color:var(--ink-quiet,#71717a);font-size:15px;margin:0}
.mdk-read-head kbd{font-family:var(--font-mono-stack);font-size:12px;
  border:1px solid var(--hairline,rgba(17,17,17,.10));border-radius:4px;
  padding:1px 5px}
.mdk-read-act{margin:5rem auto 2rem;padding-top:1.5rem;
  border-top:1px solid var(--ink,#111);display:flex;align-items:baseline;
  gap:1rem;flex-wrap:wrap}
.mdk-read-act span{font-family:var(--font-mono-stack);font-size:13px;
  font-weight:500;color:var(--accent,#4f46e5)}
.mdk-read-act h2{font-size:clamp(1.6rem,1.2rem+2vw,2.4rem);font-weight:500;
  letter-spacing:-.025em;margin:0;text-transform:lowercase}
.mdk-read-act p{flex-basis:100%;color:var(--ink-quiet,#71717a);
  font-size:15px;margin:.25rem 0 0}
.mdk-read-sec{margin:2.75rem auto 0}
.mdk-read-sec h3{font-size:clamp(1.35rem,1.1rem+1.2vw,1.85rem);font-weight:500;
  letter-spacing:-.022em;margin:.6rem 0 1rem;line-height:1.18;
  text-transform:lowercase}
.mdk-read-body{font-size:16px;line-height:1.7;color:var(--ink-soft,#3f3f46)}
.mdk-read-body .mdk-lead{font-size:17px;color:var(--ink,#111);max-width:none}
.mdk-read-body .mdk-pull{font-size:17px}
.mdk-read-body .mdk-defs,.mdk-read-body .mdk-figs{margin-top:1.25rem}
.mdk-read-body .mdk-figs{gap:2.5rem}
.mdk-read-body .mdk-fig-v{font-size:2.5rem}

/* help */
.mdk-help{flex:1;display:flex;align-items:center;justify-content:center;
  padding:var(--gap)}
.mdk-help-inner{width:100%;max-width:30rem;display:flex;flex-direction:column;
  gap:1.5rem}

/* motion */
@keyframes mdk-in{from{opacity:0;transform:translateY(14px)}
  to{opacity:1;transform:none}}
.mdk-stage{animation:mdk-in .5s cubic-bezier(.32,.72,0,1)}
:focus-visible{outline:2px solid var(--accent,#4f46e5);outline-offset:3px}
@media (prefers-reduced-motion:reduce){
  .mdk-stage{animation:none}
  .mdk-seg-f{transition:none}
  .mdk-ring{animation:none;opacity:1}
  .mdk-tab::before,.mdk-toc-act li button::before{transition:none}
}
@media (max-width:760px){
  .mdk-zone{display:none}
  .mdk-stage{flex-direction:column;padding-top:clamp(2rem,7vh,3.5rem)}
  .mdk-slide{gap:1.5rem}
  .mdk-rail{width:auto;flex-direction:row;flex-wrap:wrap;gap:.75rem 1.25rem;
    align-items:baseline}
  .mdk-rail-i{margin-top:0}
  .mdk-divider{flex-direction:column;align-items:flex-start;
    justify-content:center;gap:0}
  .mdk-div-num{font-size:8rem}
  .mdk-def{grid-template-columns:1fr;gap:.25rem}
  .mdk-lr{grid-template-columns:3rem 1fr;gap:.5rem 1rem}
  .mdk-lr span:last-child{grid-column:2;text-align:left}
  .mdk-lh{display:none}
  .mdk-bar{grid-template-columns:auto 1fr;gap:.75rem}
  .mdk-bar-l{display:none}
  .mdk-bar-c{justify-self:start}
  .mdk-bar-r{justify-self:end}
  .mdk-cover-wm{display:none}
}
`;
