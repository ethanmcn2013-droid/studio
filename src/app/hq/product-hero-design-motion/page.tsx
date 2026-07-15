import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product Hero Room · Signal HQ",
  description:
    "The design + motion room for the four product heroes. Every direction, the preferred versions, and a live link to each.",
  robots: { index: false, follow: false },
};

/**
 * The Product Hero Design/Motion Room.
 *
 * A durable HQ hub for the landing-page hero motion graphics of the four
 * products, redesigned against the Signal Hero Playbook. It records every
 * direction, which the operator preferred, and links straight to each one's
 * live preview so any session can find, watch, and iterate them. Signal
 * ("The Brief") is the untouched reference the others are measured against.
 *
 * Source-of-truth companions (in the workspace, branch-independent):
 *   audit/HERO_COUNCIL_SPECS.md   — concepts + build specs + the ten Playbook laws
 *   audit/HERO_ITERATION_LOG.md   — the world-class iteration log
 */

type Badge = "PREFERRED" | "REFERENCE" | "CANDIDATE" | "ARCHIVE";

type Direction = {
  name: string;
  badge: Badge;
  concept: string;
  gesture: string;
  path: string; // route appended to the product's live base
  file: string;
};

type Product = {
  key: string;
  name: string;
  repo: string;
  branch: string;
  base: string; // live base URL (preview for labs, production for the reference)
  brief: string;
  directions: Direction[];
};

const PRODUCTS: Product[] = [
  {
    key: "signal",
    name: "Signal — The Brief",
    repo: "analytics/",
    branch: "main · shipped",
    base: "https://signal.signalstudio.ie",
    brief:
      "The gold standard and the reference for all others. Not to be changed, only studied. The Signal Hero Playbook is reverse-engineered from it.",
    directions: [
      {
        name: "The Brief",
        badge: "REFERENCE",
        gesture: "tick",
        concept:
          "Idea to philosophy to demonstration to clarity. Three spoken lines, the seed word chaos blooms into a noise pile, the mechanism reads and distils it into a real front page. SSR-settled, plays once, rests.",
        path: "/",
        file: "src/components/landing/the-brief-hero.tsx",
      },
    ],
  },
  {
    key: "notes",
    name: "Signal Notes",
    repo: "notes/",
    branch: "feat/notes-hero-lab",
    base: "https://notes-git-feat-notes-hero-lab-ethanmcn2013-1730s-projects.vercel.app",
    brief: "Capture; the thought caught before it leaves. Wordmark gesture: caret.",
    directions: [
      {
        name: "Before It Leaves",
        badge: "PREFERRED",
        gesture: "caret",
        concept:
          "Operator pick, rebuilt. The notebook is present from the start. A caret catches one thought, files it, then a deliberate approval sends only the extract to Tasks while the private note stays put.",
        path: "/lab/before-it-leaves",
        file: "src/components/lab/option-before-it-leaves.tsx",
      },
      {
        name: "Three Seconds",
        badge: "PREFERRED",
        gesture: "caret",
        concept:
          "Operator pick, rebuilt. Three seconds becomes the literal clock: thought, capture, filed. The product promise is demonstrated in one quiet editorial sequence.",
        path: "/lab/three-seconds",
        file: "src/components/lab/option-three-seconds.tsx",
      },
      {
        name: "The Blank Line",
        badge: "ARCHIVE",
        gesture: "caret",
        concept:
          "Earlier minimal study: one caret drops on write and the capture field materialises around it. Kept for research outside the active pair.",
        path: "/lab/the-blank-line",
        file: "src/components/lab/option-the-blank-line.tsx",
      },
      {
        name: "The Notebook · earlier directions",
        badge: "ARCHIVE",
        gesture: "caret",
        concept:
          "Round-one lab directions (The Notebook, Notebook First, Before It Fades, The Crossing). Kept for reference; not the chosen pair.",
        path: "/lab",
        file: "src/components/lab/option-*.tsx",
      },
    ],
  },
  {
    key: "tasks",
    name: "Signal Tasks",
    repo: "tasks/",
    branch: "feat/tasks-hero-lab",
    base: "https://tasks-git-feat-tasks-hero-lab-ethanmcn2013-1730s-projects.vercel.app",
    brief:
      "Momentum; open to done. Wordmark gesture: pulse. Replaces the old infinite-loop ticker with a play-once hero that rests.",
    directions: [
      {
        name: "Done.",
        badge: "CANDIDATE",
        gesture: "pulse",
        concept:
          "Rebuilt flagship. A real commitment ledger is visible from frame one; ownership lands, two completion ticks clear, and one live commitment carries the pulse. Five visible rows earn the final receipt.",
        path: "/lab/done",
        file: "src/components/lab/option-done.tsx",
      },
      {
        name: "Owned.",
        badge: "CANDIDATE",
        gesture: "pulse",
        concept:
          "Ownership-native counterpoint. An unowned commitment becomes explicit, due, and actionable. It proves accountable movement without borrowing Signal's noise-distillation job.",
        path: "/lab/owned",
        file: "src/components/lab/option-owned.tsx",
      },
      {
        name: "What's Next",
        badge: "ARCHIVE",
        gesture: "pulse",
        concept:
          "Earlier distillation study. Kept for research, but it overlaps Signal's attention-clarity job and is no longer an active Tasks direction.",
        path: "/lab/whats-next",
        file: "src/components/lab/option-whats-next.tsx",
      },
    ],
  },
  {
    key: "timeline",
    name: "Signal Timeline",
    repo: "roadmap/",
    branch: "feat/timeline-hero-lab",
    base: "https://roadmap-git-feat-timeline-hero-lab-ethanmcn2013-1730s-projects.vercel.app",
    brief:
      "Time made visible; the whole plan at a glance. Wordmark gesture: sweep. (Repo dir is roadmap/, serves the Timeline domain.)",
    directions: [
      {
        name: "The Line",
        badge: "PREFERRED",
        gesture: "sweep",
        concept:
          "Operator pick, rebuilt as the quieter counterpoint. A fixed folio holds the frame while one pass reveals a semantic public plan: Now, Soon, Later, Done, then rest.",
        path: "/lab/the-line",
        file: "src/components/lab/option-the-line.tsx",
      },
      {
        name: "One Line",
        badge: "CANDIDATE",
        gesture: "sweep",
        concept:
          "Operator pick, rebuilt as the flagship. The sentence underline is the timeline axis, not a timed substitute; it extends through four real moments, turns vertical on mobile, and ends in one small canonical sweep.",
        path: "/lab/one-line",
        file: "src/components/lab/option-one-line.tsx",
      },
      {
        name: "The Link · Open Line · Open Plan",
        badge: "ARCHIVE",
        gesture: "sweep",
        concept:
          "Earlier sharing studies: a public URL opens the whole plan without a wall. Kept for research outside the active pair.",
        path: "/lab",
        file: "src/components/lab/option-*.tsx",
      },
    ],
  },
];

const BADGE_STYLE: Record<Badge, { fg: string; bg: string; bd: string }> = {
  PREFERRED: { fg: "var(--paper)", bg: "var(--accent)", bd: "var(--accent)" },
  REFERENCE: { fg: "var(--paper)", bg: "var(--ink)", bd: "var(--ink)" },
  CANDIDATE: { fg: "var(--ink-faint)", bg: "transparent", bd: "var(--hairline)" },
  ARCHIVE: { fg: "var(--ink-faint)", bg: "transparent", bd: "var(--hairline)" },
};

const REVIEW_GATES = [
  "The first frame has a crisp product anchor.",
  "One transformation explains the product's real job.",
  "The settled artifact is useful, semantic, and honest.",
  "Mobile keeps the signature motion and every key state.",
  "Reduced motion receives the same complete result immediately.",
];

function BadgeTag({ badge }: { badge: Badge }) {
  const s = BADGE_STYLE[badge];
  return (
    <span
      style={{
        fontFamily: "var(--font-mono-stack)",
        fontSize: "9.5px",
        fontWeight: 600,
        letterSpacing: "0.1em",
        color: s.fg,
        background: s.bg,
        border: `1px solid ${s.bd}`,
        borderRadius: "999px",
        padding: "2px 10px",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {badge}
    </span>
  );
}

function DirectionRow({ d, base }: { d: Direction; base: string }) {
  return (
    <a
      className="hero-room-direction"
      href={`${base}${d.path}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "grid",
        gap: "16px",
        alignItems: "baseline",
        padding: "14px 18px",
        borderBottom: "1px solid var(--hairline)",
        textDecoration: "none",
        color: "var(--ink)",
      }}
    >
      <span style={{ fontWeight: 600 }}>
        {d.name}{" "}
        <span aria-hidden style={{ color: "var(--accent)", fontWeight: 500 }}>
          ↗
        </span>
      </span>
      <BadgeTag badge={d.badge} />
      <div>
        <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.55, color: "var(--ink-faint)" }}>{d.concept}</p>
        <p
          style={{
            margin: "8px 0 0",
            fontFamily: "var(--font-mono-stack)",
            fontSize: "11px",
            letterSpacing: "0.02em",
            color: "var(--ink-faint)",
          }}
        >
          gesture: {d.gesture} · {d.file}
        </p>
        <span
          className="hero-room-open"
          style={{
            display: "inline-block",
            marginTop: "10px",
            color: "var(--accent)",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          Open rendered preview ↗
        </span>
      </div>
    </a>
  );
}

export default async function ProductHeroRoomPage() {
  await requireHqAccess();

  return (
    <main id="main" className="hq-page">
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">Signal HQ · Product Hero Room</span>
        <h1 className="hq-page-title">
          The four heroes, in one room
          <span aria-hidden="true" style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <p className="hq-page-intro">
          The design and motion room for the product landing-page heroes. Each is
          a full motion graphic redesigned against the Signal Hero Playbook, the
          transferable DNA reverse-engineered from The Brief. Every row links
          straight to that direction’s live preview. These candidates stay in
          the labs until the operator selects what reaches each product homepage.
        </p>
      </header>

      <section
        aria-label="preferred versions"
        style={{
          marginBottom: "28px",
          background: "var(--accent-soft)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "0 6px 6px 0",
          padding: "16px 20px",
        }}
      >
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--accent)", fontWeight: 500 }}>
          Operator-preferred: Notes — Before It Leaves + Three Seconds. Timeline —
          The Line is selected; One Line remains the counterpoint. Tasks — no pick yet; Done + Owned are the active
          candidates. Signal — The Brief stays unchanged as the reference. The
          lab bar is product truth, motion, UX, accessibility, and engineering,
          not visual spectacle by itself.
        </p>
      </section>

      <section
        aria-label="hero review contract"
        style={{
          marginBottom: "28px",
          borderTop: "1px solid var(--hairline)",
          borderBottom: "1px solid var(--hairline)",
          padding: "18px 0",
        }}
      >
        <span className="hq-page-eyebrow">The review contract</span>
        <ol className="hero-room-gates">
          {REVIEW_GATES.map((gate) => (
            <li key={gate}>{gate}</li>
          ))}
        </ol>
      </section>

      {PRODUCTS.map((p) => (
        <section
          key={p.key}
          aria-label={p.name}
          style={{ border: "1px solid var(--hairline)", borderRadius: "10px", overflow: "hidden", marginBottom: "24px" }}
        >
          <div
            style={{
              padding: "12px 18px",
              background: "var(--paper-soft)",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 600, fontSize: "15px", color: "var(--ink)" }}>{p.name}</span>
              <span style={{ fontFamily: "var(--font-mono-stack)", fontSize: "11px", letterSpacing: "0.04em", color: "var(--ink-faint)" }}>
                {p.repo} · {p.branch}
              </span>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: 1.5, color: "var(--ink-faint)" }}>{p.brief}</p>
          </div>
          {p.directions.map((d) => (
            <DirectionRow key={d.name} d={d} base={p.base} />
          ))}
        </section>
      ))}

      <section
        aria-label="how to use"
        style={{ marginTop: "8px", border: "1px solid var(--hairline)", borderRadius: "10px", padding: "16px 20px" }}
      >
        <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.6, color: "var(--ink-faint)" }}>
          Click any row to open that direction’s live preview (press 1–N to switch
          directions, R to replay). Full concepts and build specs live at{" "}
          <code>audit/HERO_COUNCIL_SPECS.md</code>; the iteration log at{" "}
          <code>audit/HERO_ITERATION_LOG.md</code>. Nothing here reaches a product
          homepage until the operator selects it and it clears the 9.5 council
          gate. The Signal Hero Playbook is the bar; follow it or veto with a
          reason.
        </p>
      </section>

      <style>{`
        .hero-room-direction {
          grid-template-columns: minmax(150px, 210px) 110px 1fr;
          transition: background var(--motion-instant) var(--ease-out);
        }

        .hero-room-direction:hover {
          background: var(--paper-soft);
        }

        .hero-room-direction:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: -2px;
        }

        .hero-room-gates {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 1px;
          list-style: none;
          margin: 14px 0 0;
          padding: 0;
          background: var(--hairline);
          border: 1px solid var(--hairline);
        }

        .hero-room-gates li {
          min-width: 0;
          padding: 14px;
          background: var(--paper);
          color: var(--ink-faint);
          font-size: 12px;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .hero-room-gates {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .hero-room-direction {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }
      `}</style>
    </main>
  );
}
