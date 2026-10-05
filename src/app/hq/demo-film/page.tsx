import type { Metadata } from "next";
import Link from "next/link";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { requireHqAccess } from "@/lib/hq/access-guard";
import {
  FILM_META,
  MOTION_GRAMMAR,
  PRODUCTION,
  productionProgress,
  STORYBOARD,
} from "@/lib/hq/demo-film";
import { BRAND_FILM } from "@/lib/hq/brand-film";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Demo film · Signal HQ",
  description:
    "Signal Studio's films: the rendered brand film Plain Words (flagship prototype v1) and the production scaffold for the 30-second hero product film.",
  robots: { index: false, follow: false },
};

/**
 * /hq/demo-film, the film room. The rendered brand film (Plain Words,
 * flagship prototype v1) leads; below it, the production scaffold for the
 * hero product film, a buildable brief grounded in the Film System and
 * honest that it is not yet rendered (the checklist tracks what's left).
 */
export default async function DemoFilmPage() {
  await requireHqAccess();

  const progress = productionProgress();

  return (
    <main id="main" className="hq-page">
      <HqPageHeader
        slug="demo-film"
        title="Films."
        standfirst="Plain Words, the brand film, is cut, scored and rendered. One Wedding, Four Views, the 30-second hero film, is the next one."
        meta={
          <span className="hq-page-head-note">
            {BRAND_FILM.title} · {BRAND_FILM.version.toLowerCase()} · hero film {progress.done}/{progress.total} steps done
          </span>
        }
      />

      <BrandFilm />

      <div className="hq-bf-next">
        <span className="hq-os-eyebrow">next · the 30-second hero film · scaffold</span>
        <h2 className="hq-bf-h2">{FILM_META.title}.</h2>
        <p className="hq-bf-standfirst">
          A coordinator runs a whole wedding through Signal Studio in 30 seconds, and it resolves to the dot.
        </p>
        <p className="hq-page-head-note">{FILM_META.statusLabel}</p>
      </div>

      <section className="hq-page-header" aria-label="why and build state">
        <p className="hq-page-intro" style={{ fontSize: 15 }}>{FILM_META.why}</p>
        <p className="hq-film-build">
          <span className="hq-film-build-label">build</span> {FILM_META.build.project} ·{" "}
          <span className="hq-fm-mono">{FILM_META.build.run}</span>, {FILM_META.build.state}
        </p>
      </section>

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
          <p>Five gestures, distilled from the Film System brief, one per product, plus the hero dot.</p>
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
          <span className="hq-os-eyebrow">production · what’s left</span>
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

/** The rendered brand film: the player, the cuts, the spec, the beats, and what v1.1 still owes. */
function BrandFilm() {
  const f = BRAND_FILM;
  return (
    <section className="hq-co-block hq-bf" aria-label={`brand film, ${f.title}`}>
      <div className="hq-fm-unit-head">
        <span className="hq-os-eyebrow">
          rendered · {f.version.toLowerCase()} · frozen {f.frozenOn}
        </span>
        <h2 className="hq-bf-h2">{f.title}.</h2>
        <p className="hq-bf-standfirst">{f.logline}</p>
      </div>

      <figure className="hq-bf-player">
        <video
          controls
          playsInline
          preload="metadata"
          poster={f.player.poster}
          src={f.player.src}
          aria-label={`${f.title}, ${f.version}, the full film with sound`}
        />
        <figcaption className="hq-bf-cap">
          <span>{f.why}</span>
          <span className="hq-bf-links">
            {f.cuts.map((c) => (
              <a key={c.src} href={c.src} className="hq-co-srclink" download>
                {c.label} · {c.length}
              </a>
            ))}
            <a href={f.player.interactive} target="_blank" rel="noopener noreferrer" className="hq-co-srclink">
              interactive player, with chapters
            </a>
          </span>
        </figcaption>
      </figure>

      <div className="hq-co-facts" aria-label="brand film spec">
        <Fact label="Duration" value={f.spec.duration} />
        <Fact label="Master" value={f.spec.master} />
        <Fact label="Web" value={f.spec.web} />
        <Fact label="Sound" value={f.spec.sound} />
        <Fact label="Type" value={f.spec.type} />
        <Fact label="Source" value={f.spec.source} />
      </div>

      <div className="hq-film-board" aria-label="brand film beats">
        {f.beats.map((b, i) => (
          <article key={b.t} className="hq-film-scene">
            <div className="hq-film-scene-rail">
              <span className="hq-film-scene-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="hq-film-scene-t">{b.t}</span>
            </div>
            <div className="hq-film-scene-body">
              <p className="hq-film-scene-caption">{b.beat}</p>
              <p className="hq-film-scene-beat">{b.note}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="hq-bf-review">
        <div>
          <span className="hq-os-eyebrow">open for v1.1 · from the v1 review</span>
          <ul className="hq-bf-list" role="list">
            {f.openItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="hq-os-eyebrow">gates before it leaves HQ</span>
          <ul className="hq-bf-list" role="list">
            {f.gates.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
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
