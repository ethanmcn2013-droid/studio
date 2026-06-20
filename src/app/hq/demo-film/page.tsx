import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import {
  FILM_META,
  MOTION_GRAMMAR,
  PRODUCTION,
  productionProgress,
  STORYBOARD,
} from "@/lib/hq/demo-film";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Demo film — Signal HQ",
  description:
    "Production scaffold for the hero product demo film — logline, spec, storyboard, motion grammar, and the build checklist. Not yet rendered.",
  robots: { index: false, follow: false },
};

/**
 * /hq/demo-film — the production scaffold for the hero product film. A
 * buildable brief grounded in the Film System; honest that the film is not
 * yet rendered (the checklist tracks what's left).
 */
export default async function DemoFilmPage() {
  await requireHqAccess();

  const progress = productionProgress();

  return (
    <main id="main" className="hq-page">
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">Signal HQ · Demo Film</span>
        <h1 className="hq-page-title">{FILM_META.title}<span aria-hidden="true">.</span></h1>
        <p className="hq-page-intro">{FILM_META.logline}</p>
        <p className="hq-page-intro" style={{ fontSize: 15 }}>{FILM_META.why}</p>
        <span className="hq-co-status" data-status="pre-incorporation">
          {FILM_META.statusLabel} · {progress.done}/{progress.total} steps done
        </span>
        <p className="hq-film-build">
          <span className="hq-film-build-label">build</span> {FILM_META.build.project} ·{" "}
          <span className="hq-fm-mono">{FILM_META.build.run}</span> — {FILM_META.build.state}
        </p>
      </header>

      {/* Spec */}
      <section className="hq-co-facts" aria-label="film spec">
        <Fact label="Duration" value={`${FILM_META.spec.duration} · ${FILM_META.spec.frames}`} />
        <Fact label="Formats" value={FILM_META.spec.formats} />
        <Fact label="Tool" value={FILM_META.spec.tool} />
        <Fact label="Type" value={FILM_META.spec.type} />
        <Fact label="Palette" value={FILM_META.spec.palette} />
        <Fact label="Sound" value={FILM_META.spec.sound} />
      </section>

      {/* Storyboard */}
      <section className="hq-co-block" aria-label="storyboard">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">storyboard · the 30-second cut</span>
          <p>Seven beats, one per product plus the dot to open and close. Captions are the only words allowed on screen.</p>
        </div>
        <div className="hq-film-board">
          {STORYBOARD.map((s, i) => (
            <article key={s.t} className="hq-film-scene">
              <div className="hq-film-scene-rail">
                <span className="hq-film-scene-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="hq-film-scene-t">{s.t}</span>
              </div>
              <div className="hq-film-scene-body">
                <p className="hq-film-scene-beat">{s.beat}</p>
                <p className="hq-film-scene-caption">&ldquo;{s.caption}&rdquo;</p>
                <div className="hq-film-scene-meta">
                  <span className="hq-film-scene-gesture">{s.gesture}</span>
                  <span className="hq-film-scene-sound">{s.sound}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Motion grammar */}
      <section className="hq-co-block" aria-label="motion grammar">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">the motion alphabet</span>
          <p>Five gestures, distilled from the Film System brief — one per product, plus the hero dot.</p>
        </div>
        <div className="hq-co-rights">
          {MOTION_GRAMMAR.map((g) => (
            <div key={g.gesture} className="hq-co-right">
              <h3 className="hq-co-right-cls">
                {g.gesture}
                <span className="hq-film-grammar-product"> · {g.product}</span>
              </h3>
              <p className="hq-co-right-body">{g.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Production checklist */}
      <section className="hq-co-block" aria-label="production checklist">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">production · what's left</span>
          <p>The script and storyboard are this scaffold; the render needs the motion pipeline.</p>
        </div>
        <ul className="hq-incorp-steps" role="list">
          {PRODUCTION.map((p) => (
            <li key={p.step} className="hq-incorp-step" data-status={p.status === "blocked" ? "todo" : p.status}>
              <span className="hq-incorp-step-mark" aria-hidden="true">
                {p.status === "done" ? "✓" : ""}
              </span>
              <span className="hq-incorp-step-label">
                {p.step}
                {p.note ? <span className="hq-incorp-step-note"> · {p.note}</span> : null}
              </span>
              <span className="hq-incorp-step-status" data-blocked={p.status === "blocked" ? "true" : undefined}>
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="hq-dr-foot">
        <Link href="/hq/data-room" className="hq-dr-back">← back to the data room</Link>
        <span className="hq-dr-source">
          lives at · {FILM_META.livesAt.join(" · ")} ·{" "}
          {FILM_META.references.map((r, i) => (
            <span key={r.href}>
              {i > 0 ? " · " : ""}
              {r.external ? (
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="hq-co-srclink">{r.label}</a>
              ) : (
                <a href={r.href} className="hq-co-srclink">{r.label}</a>
              )}
            </span>
          ))}
        </span>
      </footer>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="hq-co-fact">
      <span className="hq-co-fact-label">{label}</span>
      <span className="hq-co-fact-value">{value}</span>
    </div>
  );
}
