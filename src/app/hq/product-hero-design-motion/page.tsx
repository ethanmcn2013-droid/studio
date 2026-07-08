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

type Badge = "PREFERRED" | "REFERENCE" | "REBUILDING" | "CANDIDATE" | "ARCHIVE";

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
          "Operator pick. A caret catches the fading word gone; loss reversed by capture. Now carries the one-way promote-to-Tasks crossing: the note stays private, the extract crosses as an open task.",
        path: "/lab/before-it-leaves",
        file: "src/components/lab/option-before-it-leaves.tsx",
      },
      {
        name: "Three Seconds",
        badge: "PREFERRED",
        gesture: "caret",
        concept:
          "Operator pick. The locked design budget as the whole story. Calm, typographic, no spectacle; the claim is the restraint.",
        path: "/lab/three-seconds",
        file: "src/components/lab/option-three-seconds.tsx",
      },
      {
        name: "The Blank Line",
        badge: "CANDIDATE",
        gesture: "caret",
        concept:
          "The whole hero is one caret; it drops on the word write and the capture field materialises around it. Swiss, minimal counterpoint.",
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
        badge: "REBUILDING",
        gesture: "pulse",
        concept:
          "Flagship, iterating toward world-class. A clean indigo check strikes through the seed word done, and a believable Today board resolves: two open items complete one satisfying tick at a time, the live item ignites with the pulse. px display type; one-accent discipline.",
        path: "/lab/done",
        file: "src/components/lab/option-done.tsx",
      },
      {
        name: "What's Next",
        badge: "CANDIDATE",
        gesture: "pulse",
        concept:
          "Execution-clarity counterpoint: a pile of open work distils to the three that matter today. Rework pending once Done clears the gate.",
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
          "Operator pick. The product's own gesture at hero scale: a hairline draws across and the plan sets onto it — Now, Soon, Later, Done — each a plain sentence at its marker, dated, with what was set aside kept honestly below.",
        path: "/lab/the-line",
        file: "src/components/lab/option-the-line.tsx",
      },
      {
        name: "One Line",
        badge: "PREFERRED",
        gesture: "sweep",
        concept:
          "Operator pick. The sentence's own underline beneath one line extends into the actual timeline axis and the dated markers drop onto it.",
        path: "/lab/one-line",
        file: "src/components/lab/option-one-line.tsx",
      },
      {
        name: "The Link · Open Line · Open Plan",
        badge: "CANDIDATE",
        gesture: "sweep",
        concept:
          "The sharing story: a shared URL opens the whole plan with no wall. Kept as candidates against the preferred pair.",
        path: "/lab",
        file: "src/components/lab/option-*.tsx",
      },
    ],
  },
];

const BADGE_STYLE: Record<Badge, { fg: string; bg: string; bd: string }> = {
  PREFERRED: { fg: "#ffffff", bg: "var(--accent)", bd: "var(--accent)" },
  REFERENCE: { fg: "#ffffff", bg: "var(--ink)", bd: "var(--ink)" },
  REBUILDING: { fg: "var(--accent)", bg: "var(--accent-soft)", bd: "var(--accent)" },
  CANDIDATE: { fg: "var(--ink-faint)", bg: "transparent", bd: "var(--hairline)" },
  ARCHIVE: { fg: "var(--ink-faint)", bg: "transparent", bd: "var(--hairline)" },
};

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
      href={`${base}${d.path}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(150px, 210px) 110px 1fr",
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
          &nearr;
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
          straight to that direction's live preview. Nothing here is on a product
          homepage yet; the labs are review surfaces.
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
          The Line + One Line. Tasks — no pick yet; Done is rebuilding to
          world-class. All four must clear 9.5 from every council lens (creative,
          motion, product, UX, engineering) before they ship. Signal — The Brief
          is the untouched reference.
        </p>
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
          Click any row to open that direction's live preview (press 1–N to switch
          directions, R to replay). Full concepts and build specs live at{" "}
          <code>audit/HERO_COUNCIL_SPECS.md</code>; the iteration log at{" "}
          <code>audit/HERO_ITERATION_LOG.md</code>. Nothing here reaches a product
          homepage until the operator selects it and it clears the 9.5 council
          gate. The Signal Hero Playbook is the bar; follow it or veto with a
          reason.
        </p>
      </section>
    </main>
  );
}
