import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Experimentation Room · Signal HQ",
  description: "Every hero and umbrella direction we explored, what shipped, and what still lives in the lab.",
  robots: { index: false, follow: false },
};

type State = "SHIPPED" | "REVIEW" | "PARKED" | "SYSTEM";

type Experiment = {
  href: string;
  external?: boolean;
  name: string;
  state: State;
  where: string; // repo · branch coordinates
  note: string;
};

// Directions that graduated from a lab and are live in production.
const SHIPPED: Experiment[] = [
  {
    href: "https://signal.signalstudio.ie",
    external: true,
    name: "Signal · The Brief",
    state: "SHIPPED",
    where: "analytics · feat/signal-hero-the-brief",
    note: "The broadsheet opener. Noise resolves into one signal. Chosen from five directions and shipped as the Signal homepage hero.",
  },
  {
    href: "https://timeline.signalstudio.ie",
    external: true,
    name: "Timeline · The Link",
    state: "SHIPPED",
    where: "roadmap · feat/timeline-hero-lab",
    note: "The chain that holds a plan together. Graduated from the lab to the front page as R·30. Live on the Timeline homepage.",
  },
];

// Directions still on their branch: kept for review or parked as runners-up.
// None of these ship to a product route; they live on the branch named below.
const LAB: Experiment[] = [
  {
    href: "https://github.com/ethanmcn2013-droid/notes/tree/feat/notes-hero-lab",
    external: true,
    name: "Notes hero lab",
    state: "REVIEW",
    where: "notes · feat/notes-hero-lab",
    note: "Four directions for the Notes hero: Notebook First, Before It Fades, Three Seconds, and The Crossing. Review only, not cleared for deploy.",
  },
  {
    href: "https://github.com/ethanmcn2013-droid/roadmap/tree/feat/timeline-hero-lab",
    external: true,
    name: "Timeline · The Line & Open Line",
    state: "PARKED",
    where: "roadmap · feat/timeline-hero-lab",
    note: "The two runners-up behind The Link. Kept on the branch as alternate directions for the Timeline hero.",
  },
  {
    href: "https://github.com/ethanmcn2013-droid/analytics/tree/feat/signal-hero-the-brief",
    external: true,
    name: "Signal · the five directions",
    state: "PARKED",
    where: "analytics · feat/signal-hero-the-brief",
    note: "The full five-direction exploration that produced The Brief. Held on the branch as the record of how the opener was found.",
  },
  {
    href: "https://github.com/ethanmcn2013-droid/studio/tree/direction-c-daily-signal",
    external: true,
    name: "Umbrella · the Daily Signal",
    state: "PARKED",
    where: "studio · direction-c-daily-signal",
    note: "An experiment where the umbrella site is itself a daily briefing. Parked as a direction for the Studio homepage.",
  },
];

// Systems explorations that already have their own room.
const SYSTEMS: Experiment[] = [
  {
    href: "/hq/loading-review",
    name: "The loading canon",
    state: "SHIPPED",
    where: "all products · main",
    note: "Ten loading moments, one system: the 10px boundary dot, the sub-120ms handoff, the honest long-wait escalation. Live across every product.",
  },
];

function badgeStyle(state: State) {
  const solid = state === "SHIPPED";
  return {
    fontFamily: "var(--font-mono-stack)",
    fontSize: "9.5px",
    fontWeight: 600,
    letterSpacing: "0.1em",
    color: solid ? "var(--paper)" : state === "PARKED" ? "var(--ink-faint)" : "var(--accent)",
    background: solid ? "var(--accent)" : state === "PARKED" ? "var(--paper-soft)" : "var(--accent-soft)",
    border: state === "PARKED" ? "1px solid var(--hairline)" : undefined,
    borderRadius: "999px",
    padding: "2px 10px",
    textAlign: "center" as const,
    whiteSpace: "nowrap" as const,
  };
}

function Row({ x }: { x: Experiment }) {
  const inner = (
    <>
      <span style={{ fontWeight: 600 }}>{x.name}</span>
      <span style={badgeStyle(x.state)}>{x.state}</span>
      <span style={{ fontSize: "13.5px", lineHeight: 1.5, color: "var(--ink-faint)" }}>
        {x.note}
        <span style={{ display: "block", marginTop: "4px", fontFamily: "var(--font-mono-stack)", fontSize: "10.5px", letterSpacing: "0.06em", color: "var(--ink-faint)", opacity: 0.8 }}>
          {x.where}
        </span>
      </span>
    </>
  );
  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(180px, 240px) 96px 1fr",
    gap: "16px",
    alignItems: "baseline" as const,
    padding: "14px 18px",
    borderBottom: "1px solid var(--hairline)",
    textDecoration: "none",
    color: "var(--ink)",
  };
  if (x.external) {
    return (
      <a href={x.href} target="_blank" rel="noreferrer" style={rowStyle}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={x.href} style={rowStyle}>
      {inner}
    </Link>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "10px 18px", background: "var(--paper-soft)", borderBottom: "1px solid var(--hairline)", fontFamily: "var(--font-mono-stack)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

export default async function ExperimentationRoomPage() {
  await requireHqAccess();

  return (
    <main id="main" className="hq-page">
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">Signal HQ · Experimentation Room</span>
        <h1 className="hq-page-title">
          Where every direction is kept
          <span aria-hidden="true" style={{ color: "var(--accent)" }}>.</span>
        </h1>
        <p className="hq-page-intro">
          Every hero and umbrella exploration lives here: the ones that
          graduated to the front page and the ones still on their branch.
          Nothing is thrown away. Each row carries the repo and branch it
          lives on, so any direction can be checked out and revisited.
        </p>
      </header>

      <section aria-label="graduated to the front page" style={{ border: "1px solid var(--hairline)", borderRadius: "10px", overflow: "hidden", marginBottom: "32px" }}>
        <SectionHeader>Graduated to the front page</SectionHeader>
        {SHIPPED.map((x) => <Row key={x.href} x={x} />)}
      </section>

      <section aria-label="still in the lab" style={{ border: "1px solid var(--hairline)", borderRadius: "10px", overflow: "hidden", marginBottom: "32px" }}>
        <SectionHeader>Still in the lab. Kept, not shipped</SectionHeader>
        {LAB.map((x) => <Row key={x.href} x={x} />)}
      </section>

      <section aria-label="systems" style={{ border: "1px solid var(--hairline)", borderRadius: "10px", overflow: "hidden" }}>
        <SectionHeader>Systems, with their own room</SectionHeader>
        {SYSTEMS.map((x) => <Row key={x.href} x={x} />)}
      </section>

      <section
        aria-label="how the lab works"
        style={{ marginTop: "32px", background: "var(--accent-soft)", borderLeft: "3px solid var(--accent)", borderRadius: "0 6px 6px 0", padding: "16px 20px" }}
      >
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.6, color: "var(--accent)", fontWeight: 500 }}>
          A direction earns the front page or it waits on its branch. Parked
          work is never deleted, so the record of how each hero was found
          stays intact and any runner-up can be brought back.
        </p>
      </section>
    </main>
  );
}
