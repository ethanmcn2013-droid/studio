"use client";

/**
 * Signal HQ · interactive marketing-plan deck.
 *
 * Private (rendered only behind the /hq token gate by the server page).
 * Brand-faithful per DESIGN.md: paper white, ink, one indigo accent,
 * Geist + Geist Mono, hairlines over shadows, restraint. Motion is
 * subtle and fully disabled under prefers-reduced-motion (DESIGN.md
 * §5/§10 — no celebration, no confetti). Source of truth for the
 * content is docs/MARKETING_PLAN_6MO.md; this is its presentation.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Slide = {
  kicker: string;
  title: string;
  body: ReactNode;
};

function Lead({ children }: { children: ReactNode }) {
  return <p className="mdk-lead">{children}</p>;
}

function Rows({ items }: { items: [string, string][] }) {
  return (
    <div className="mdk-rows">
      {items.map(([k, v]) => (
        <div className="mdk-row" key={k}>
          <span className="mdk-row-k">{k}</span>
          <span className="mdk-row-v">{v}</span>
        </div>
      ))}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="mdk-stat">
      <div className="mdk-stat-v">{value}</div>
      <div className="mdk-stat-l">{label}</div>
    </div>
  );
}

const SLIDES: Slide[] = [
  {
    kicker: "Signal HQ · Private",
    title: "Six-month marketing plan.",
    body: (
      <>
        <Lead>
          The engine that takes Signal Studio to its first real revenue,
          built for one founder and a room of agents. Ratified 2026-05-16.
        </Lead>
        <p className="mdk-foot-note">
          Brand integrity is the gating metric. Press → or space to move.
        </p>
      </>
    ),
  },
  {
    kicker: "The verdict",
    title: "The number is arithmetic before it is marketing.",
    body: (
      <>
        <Lead>
          At €12/mo and €79 one-time, a solo zero-ad motion produces
          ≤€125k optimistically. The venue wedge as &ldquo;with our
          compliments&rdquo; produced nothing. A flattering plan would
          have hidden that.
        </Lead>
        <p className="mdk-body">
          So the goal was reframed — and it is still ambitious.
        </p>
      </>
    ),
  },
  {
    kicker: "The goal",
    title: "Reframed, and accepted.",
    body: (
      <div className="mdk-stats">
        <Stat value="€250k" label="cash · first 6 months" />
        <Stat value="€500k" label="by month 12" />
        <Stat value="0" label="brand-integrity exceptions" />
      </div>
    ),
  },
  {
    kicker: "Gate zero · ratified",
    title: "The venue pays.",
    body: (
      <>
        <Lead>
          The Venue Edition is now a paid annual tier. Patronage, not
          enterprise software — the venue stands behind the couple&rsquo;s
          planning.
        </Lead>
        <Rows
          items={[
            ["Venue Edition", "€1,500–€4,000 / year, prepaid"],
            ["Founding lock", "first ~15 venues hold €1,500 for life"],
            ["Workspace", "€120 / year annual prepay"],
            ["Event", "€79 one-time — unchanged"],
          ]}
        />
      </>
    ),
  },
  {
    kicker: "Why this is the plan",
    title: "A paid venue is negative-CAC.",
    body: (
      <Lead>
        It pays Signal Studio to seed 50–150 high-intent couples into the
        suite, every year, recurring. And the restraint is the pitch — a
        taste-driven venue owner is exactly the buyer the brand is built
        for. Without it, the honest six-month number is under €75k.
      </Lead>
    ),
  },
  {
    kicker: "Revenue architecture",
    title: "Three motions, in order.",
    body: (
      <Rows
        items={[
          ["1 · Paid Venue Edition", "the engine — 75–85% of the number"],
          ["2 · Event €79 at volume", "fed by sponsoring venues' couples"],
          ["3 · Workspace €12/mo", "the compounding year-two annuity"],
        ]}
      />
    ),
  },
  {
    kicker: "Scenarios · cash, 6 months",
    title: "Plan to the middle line.",
    body: (
      <div className="mdk-table">
        <div className="mdk-tr mdk-th">
          <span>Scenario</span>
          <span>Venues</span>
          <span>6-mo cash</span>
        </div>
        <div className="mdk-tr">
          <span>Floor</span>
          <span>25</span>
          <span>~€77k</span>
        </div>
        <div className="mdk-tr mdk-tr-on">
          <span>Stretch-credible</span>
          <span>60</span>
          <span>~€295k</span>
        </div>
        <div className="mdk-tr">
          <span>€500k path</span>
          <span>120</span>
          <span>~€500k</span>
        </div>
        <p className="mdk-foot-note">
          The €500k path needs ~120 closed contracts in 26 weeks — a
          sales-team output. Plan to ~€250–300k; €500k is the month-12
          destination of the same motion.
        </p>
      </div>
    ),
  },
  {
    kicker: "The brand line",
    title: "The gate every asset passes.",
    body: (
      <>
        <Lead>
          No exclamation marks. No AI-marketing register. No SaaS fluff.
          No three-adjective trios. Never &ldquo;Signal&rdquo; alone.
        </Lead>
        <p className="mdk-pull">
          Every piece must contain a sentence a generic competitor would
          never publish. If the logo could be swapped, it fails.
        </p>
      </>
    ),
  },
  {
    kicker: "The agent factory",
    title: "You approve. You do not produce.",
    body: (
      <Lead>
        A standing pipeline runs overnight. Production agents draft;
        a four-agent panel reviews; what survives lands in a queue that
        never exceeds seven items on a Monday. The laptop is the studio.
        Your eye is the last gate, not the first.
      </Lead>
    ),
  },
  {
    kicker: "The review panel",
    title: "Four agents before you see anything.",
    body: (
      <Rows
        items={[
          ["Brand QA", "BRAND.md compliance — hard-blocks banned register"],
          ["Reality Anchor", "claims checked against shipped-state — anti-drift"],
          ["Tone", "Stark + Jobs register, scored, rewritten below 7"],
          ["Audience Fit", "the Sinéad test — would a venue coordinator forward it"],
        ]}
      />
    ),
  },
  {
    kicker: "Six months",
    title: "Month by month.",
    body: (
      <div className="mdk-table mdk-table-6">
        <div className="mdk-tr mdk-th">
          <span>Mo.</span>
          <span>Theme</span>
          <span>Judged on</span>
        </div>
        {[
          ["M1", "Foundations + first signal", "1 qualified venue talk"],
          ["M2", "SEO flywheel + pilot live", "first posts' CTR"],
          ["M3", "First public proof", "50 subs · first €79"],
          ["M4", "Venue channel repeatable", "3 active venues"],
          ["M5", "Workspace + shareable proof", "Workspace MRR"],
          ["M6", "Self-sustaining referral", "2 warm referrals"],
        ].map(([m, t, j]) => (
          <div className="mdk-tr" key={m}>
            <span>{m}</span>
            <span>{t}</span>
            <span>{j}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    kicker: "Founder rhythm",
    title: "~3.5 deliberate hours a week.",
    body: (
      <Rows
        items={[
          ["Mon · 60m", "clear the queue · write the brief · 1 venue email"],
          ["Tue–Thu · 30m", "same-day venue replies · publish one approved asset"],
          ["Fri · 30m", "what shipped · one retro line · fix one factory miss"],
        ]}
      />
    ),
  },
  {
    kicker: "Channels · free only",
    title: "Ranked by real return.",
    body: (
      <Rows
        items={[
          ["1", "Hand-written venue outreach — ≤50/round, founder-signed"],
          ["2", "Sponsored-workspace loop — every shared artifact acquires"],
          ["3", "Comparison / alternative SEO pages — real angles only"],
          ["4", "Wedding-pro communities — value first, product second"],
          ["5", "Restrained founder video + one-time directory pass"],
        ]}
      />
    ),
  },
  {
    kicker: "Non-goals",
    title: "What we will not do.",
    body: (
      <Lead>
        No paid ads. No Product Hunt or Show HN. No daily short-form
        treadmill. No AI-listicle SEO at volume. No mass-blast outbound.
        No content for the sake of frequency. Each of these would buy
        reach by spending the moat.
      </Lead>
    ),
  },
  {
    kicker: "Risks · kill triggers",
    title: "What breaks the plan.",
    body: (
      <Rows
        items={[
          ["Brand vs the number", "any motion needing a banned tactic — the motion is wrong"],
          ["Solo throughput", "1/10 venue replies by M3 → product call, not copy"],
          ["Concentration", "75% one buyer — M4 SEO pivot is the second leg"],
          ["Factory slop", "two off-register published → pause, tighten, resume"],
        ]}
      />
    ),
  },
  {
    kicker: "Definition of success",
    title: "Judge it on these five.",
    body: (
      <Rows
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
    kicker: "What's next",
    title: "One gate between this and month one.",
    body: (
      <>
        <Lead>
          Pre-launch readiness. Operator-only: provision Roadmap Upstash,
          clear the four Lamb&rsquo;s Hill steps. Agent-side: write
          shipped-state, fix the pricing-surface drift, stand up the
          factory.
        </Lead>
        <p className="mdk-foot-note">
          Full plan · docs/MARKETING_PLAN_6MO.md — decision ·
          content/hq/decisions/venue-editions-paid-tier.md
        </p>
      </>
    ),
  },
];

export default function MarketingDeck() {
  const total = SLIDES.length;
  const [index, setIndex] = useState(0);
  const [overview, setOverview] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const liveRef = useRef<HTMLDivElement>(null);

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

  // Deep-link via hash (#3 = slide 3, 1-indexed). Two-way sync.
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
    if (window.location.hash !== target) {
      window.history.replaceState(null, "", target);
    }
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
        case "j":
          e.preventDefault();
          setOverview(false);
          go(index + 1);
          break;
        case "ArrowLeft":
        case "PageUp":
        case "k":
          e.preventDefault();
          setOverview(false);
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
        case "g":
        case "Escape":
          e.preventDefault();
          setOverview((v) => !v);
          break;
        default:
          if (/^[1-9]$/.test(e.key)) {
            e.preventDefault();
            setOverview(false);
            go(parseInt(e.key, 10) - 1);
          }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go, total]);

  const slide = SLIDES[index];
  const progress = useMemo(
    () => ((index + 1) / total) * 100,
    [index, total],
  );

  return (
    <div className="mdk-root" aria-roledescription="carousel">
      <style>{CSS}</style>

      {overview ? (
        <div className="mdk-grid" role="list" aria-label="All slides">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="listitem"
              className={`mdk-card${i === index ? " mdk-card-on" : ""}`}
              onClick={() => {
                setOverview(false);
                go(i);
              }}
            >
              <span className="mdk-card-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="mdk-card-k">{s.kicker}</span>
              <span className="mdk-card-t">{s.title}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div
            className="mdk-zone mdk-zone-prev"
            aria-hidden="true"
            onClick={() => go(index - 1)}
          />
          <div
            className="mdk-zone mdk-zone-next"
            aria-hidden="true"
            onClick={() => go(index + 1)}
          />

          <section
            key={animKey}
            className="mdk-slide"
            aria-label={`Slide ${index + 1} of ${total}: ${slide.title}`}
            ref={liveRef}
          >
            <div className="mdk-kicker">
              {slide.kicker}
              <span className="mdk-kicker-n">
                {String(index + 1).padStart(2, "0")} / {total}
              </span>
            </div>
            <h2 className="mdk-title">{slide.title}</h2>
            <div className="mdk-content">{slide.body}</div>
          </section>
        </>
      )}

      <footer className="mdk-bar">
        <div className="mdk-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="mdk-controls">
          <button
            type="button"
            className="mdk-btn"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <span className="mdk-count" aria-live="polite">
            {String(index + 1).padStart(2, "0")}
            <span className="mdk-count-sep"> / </span>
            {String(total).padStart(2, "0")}
          </span>
          <button
            type="button"
            className="mdk-btn"
            onClick={() => go(index + 1)}
            disabled={index === total - 1}
            aria-label="Next slide"
          >
            →
          </button>
          <button
            type="button"
            className="mdk-btn mdk-btn-grid"
            onClick={() => setOverview((v) => !v)}
            aria-label="Toggle overview grid"
          >
            {overview ? "deck" : "grid"}
          </button>
        </div>
        <div className="mdk-dots" role="tablist" aria-label="Slides">
          {SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              className={`mdk-dot${i === index ? " mdk-dot-on" : ""}`}
              onClick={() => {
                setOverview(false);
                go(i);
              }}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}

const CSS = `
.mdk-root{position:relative;min-height:calc(100vh - 0px);min-height:100dvh;
  background:var(--paper,#fff);color:var(--ink,#111);
  display:flex;flex-direction:column;overflow:hidden}
.mdk-zone{position:absolute;top:0;bottom:64px;width:22%;z-index:2;cursor:pointer}
.mdk-zone-prev{left:0}.mdk-zone-next{right:0}
.mdk-slide{flex:1;display:flex;flex-direction:column;justify-content:center;
  max-width:60rem;margin:0 auto;padding:7vh 7vw 96px;width:100%}
.mdk-kicker{display:flex;justify-content:space-between;align-items:baseline;gap:1rem;
  font-family:var(--font-mono-stack);font-size:11px;font-weight:600;
  letter-spacing:var(--tracking-eyebrow,.14em);text-transform:uppercase;
  color:var(--ink-quiet,#71717a);margin-bottom:1.75rem}
.mdk-kicker-n{color:var(--accent,#4f46e5);font-variant-numeric:tabular-nums;flex:none}
.mdk-title{font-size:clamp(2rem,1.3rem+3.6vw,4.25rem);line-height:1.04;
  letter-spacing:-.035em;font-weight:600;margin:0 0 1.75rem;max-width:18ch}
.mdk-content{font-size:17px;line-height:1.6;color:var(--ink-soft,#3f3f46)}
.mdk-lead{font-size:clamp(1.05rem,.95rem+.5vw,1.4rem);line-height:1.5;
  color:var(--ink,#111);margin:0 0 1rem;max-width:42ch;font-weight:400}
.mdk-body{margin:.75rem 0 0;max-width:46ch}
.mdk-foot-note{margin:1.75rem 0 0;font-size:13px;line-height:1.55;
  color:var(--ink-quiet,#71717a);max-width:52ch}
.mdk-pull{margin:1.5rem 0 0;font-size:clamp(1rem,.9rem+.4vw,1.2rem);
  line-height:1.45;color:var(--ink,#111);max-width:40ch;
  border-left:2px solid var(--accent,#4f46e5);padding-left:1.1rem}
.mdk-rows{display:flex;flex-direction:column;border-top:1px solid var(--border-soft,rgba(17,17,17,.06))}
.mdk-row{display:grid;grid-template-columns:minmax(7rem,14rem) 1fr;gap:1.5rem;
  padding:.85rem 0;border-bottom:1px solid var(--border-soft,rgba(17,17,17,.06))}
.mdk-row-k{font-family:var(--font-mono-stack);font-size:12px;font-weight:600;
  color:var(--ink,#111);letter-spacing:.01em;padding-top:2px}
.mdk-row-v{font-size:15px;line-height:1.5;color:var(--ink-soft,#3f3f46)}
.mdk-stats{display:flex;flex-wrap:wrap;gap:clamp(1.5rem,5vw,4rem)}
.mdk-stat-v{font-size:clamp(2.5rem,1.5rem+4vw,5rem);font-weight:600;
  letter-spacing:-.04em;line-height:1;color:var(--ink,#111)}
.mdk-stat-l{margin-top:.6rem;font-family:var(--font-mono-stack);font-size:11px;
  font-weight:600;letter-spacing:var(--tracking-eyebrow,.14em);
  text-transform:uppercase;color:var(--ink-quiet,#71717a)}
.mdk-table{display:flex;flex-direction:column}
.mdk-tr{display:grid;grid-template-columns:9rem 1fr 7rem;gap:1rem;
  padding:.7rem 0;border-bottom:1px solid var(--border-soft,rgba(17,17,17,.06));
  font-size:15px;color:var(--ink-soft,#3f3f46)}
.mdk-table-6 .mdk-tr{grid-template-columns:3.5rem 1fr 10rem}
.mdk-th{font-family:var(--font-mono-stack);font-size:11px;font-weight:600;
  letter-spacing:var(--tracking-eyebrow,.14em);text-transform:uppercase;
  color:var(--ink-quiet,#71717a);border-bottom-color:var(--ink,#111)}
.mdk-tr-on{color:var(--ink,#111);font-weight:600}
.mdk-tr-on span:last-child{color:var(--accent,#4f46e5)}
.mdk-bar{position:relative;z-index:3;display:flex;align-items:center;gap:1.5rem;
  padding:.8rem 1.25rem;border-top:1px solid var(--border-soft,rgba(17,17,17,.06));
  background:var(--paper,#fff)}
.mdk-progress{position:absolute;top:-1px;left:0;right:0;height:2px;background:transparent}
.mdk-progress span{display:block;height:100%;background:var(--accent,#4f46e5);
  transition:width .4s cubic-bezier(.22,.61,.36,1)}
.mdk-controls{display:flex;align-items:center;gap:.5rem}
.mdk-btn{font-family:var(--font-mono-stack);font-size:13px;color:var(--ink,#111);
  background:none;border:1px solid var(--border-soft,rgba(17,17,17,.12));
  border-radius:999px;min-width:34px;height:30px;padding:0 12px;cursor:pointer;
  transition:border-color .15s,color .15s}
.mdk-btn:hover:not(:disabled){border-color:var(--accent,#4f46e5);color:var(--accent,#4f46e5)}
.mdk-btn:disabled{opacity:.32;cursor:default}
.mdk-btn-grid{margin-left:.25rem}
.mdk-count{font-family:var(--font-mono-stack);font-size:13px;font-weight:600;
  font-variant-numeric:tabular-nums;color:var(--ink,#111);min-width:64px;text-align:center}
.mdk-count-sep{color:var(--ink-quiet,#71717a);font-weight:400}
.mdk-dots{display:flex;gap:6px;margin-left:auto;flex-wrap:wrap}
.mdk-dot{width:7px;height:7px;border-radius:999px;border:0;padding:0;cursor:pointer;
  background:var(--ink-ghost,#d4d4d8);transition:background .15s,transform .15s}
.mdk-dot:hover{background:var(--ink-quiet,#71717a)}
.mdk-dot-on{background:var(--accent,#4f46e5);transform:scale(1.25)}
.mdk-grid{flex:1;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:1px;background:var(--border-soft,rgba(17,17,17,.06));
  border-bottom:1px solid var(--border-soft,rgba(17,17,17,.06));overflow:auto}
.mdk-card{display:flex;flex-direction:column;align-items:flex-start;gap:.5rem;
  text-align:left;background:var(--paper,#fff);border:0;padding:1.4rem 1.25rem;
  cursor:pointer;min-height:148px;transition:background .15s}
.mdk-card:hover{background:var(--paper-soft,#fafafa)}
.mdk-card-on{box-shadow:inset 2px 0 0 var(--accent,#4f46e5)}
.mdk-card-n{font-family:var(--font-mono-stack);font-size:11px;font-weight:600;
  color:var(--accent,#4f46e5);font-variant-numeric:tabular-nums}
.mdk-card-k{font-family:var(--font-mono-stack);font-size:10px;font-weight:600;
  letter-spacing:var(--tracking-eyebrow,.14em);text-transform:uppercase;
  color:var(--ink-quiet,#71717a)}
.mdk-card-t{font-size:15px;line-height:1.25;letter-spacing:-.02em;
  font-weight:600;color:var(--ink,#111)}
.mdk-slide,.mdk-progress span{will-change:opacity,transform}
@keyframes mdk-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.mdk-slide{animation:mdk-in .42s cubic-bezier(.22,.61,.36,1)}
:focus-visible{outline:2px solid var(--accent,#4f46e5);outline-offset:2px}
@media (prefers-reduced-motion:reduce){
  .mdk-slide{animation:none}
  .mdk-progress span{transition:none}
  .mdk-dot-on{transform:none}
}
@media (max-width:640px){
  .mdk-zone{display:none}
  .mdk-row{grid-template-columns:1fr;gap:.25rem}
  .mdk-tr,.mdk-table-6 .mdk-tr{grid-template-columns:1fr;gap:.15rem}
  .mdk-th{display:none}
  .mdk-dots{display:none}
}
`;
