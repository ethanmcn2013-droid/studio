import "./venue-sales-deck.css";
import type { Slide, VenueSalesDeck } from "@/lib/venue-sales-deck";

/**
 * E12.10 — the detailed Venue Edition sales deck, rendered.
 *
 * A plain server component. No "use client", no script, nothing on this
 * surface can measure a reader, and the deck can therefore be embedded in the
 * proposal state of the private venue page later without shipping JavaScript.
 *
 * ── What this render deliberately does not decide ────────────────────────
 * The visual language. This is structure and hierarchy: one idea per slide,
 * a mono kicker, one headline at display size, body at reading size, and the
 * source trace in the corner where the founder can see what a slide is
 * standing on. Colour, type scale, the cover treatment and whether the slides
 * carry an image band are founder-taste calls and are raised as options in the
 * recommendation packet rather than settled here.
 *
 * Every string comes from `src/lib/venue-sales-deck.ts`. This file adds no
 * copy, which is the rule that keeps one price in the repository.
 */

function SlideChrome({
  slide,
  children,
}: {
  slide: Slide;
  children: React.ReactNode;
}) {
  return (
    <section
      id={`slide-${slide.id}`}
      aria-labelledby={`slide-${slide.id}-headline`}
      className="venue-deck-slide relative flex w-full flex-col justify-between overflow-hidden rounded-lg border border-border-soft bg-bg-elev px-8 py-8 text-ink sm:px-12 sm:py-10"
    >
      <div className="flex flex-col gap-5">
        <p
          className="text-[11px] font-semibold uppercase text-ink-quiet"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          {slide.kicker}
        </p>
        {children}
      </div>

      <footer className="mt-8 flex items-end justify-between gap-6 border-t border-border-soft pt-4">
        <p className="text-[11px] leading-[1.5] text-ink-quiet">
          {slide.sources.join(" · ")}
        </p>
        <p className="font-mono text-[11px] text-ink-quiet">{slide.number}</p>
      </footer>
    </section>
  );
}

function NotBuilt({ note }: { note: string }) {
  return (
    <p className="mt-4 border-l-2 border-border pl-4 text-[13px] leading-[1.6] text-ink-soft">
      <span
        className="mr-2 font-mono text-[11px] uppercase text-ink-quiet"
        style={{ letterSpacing: "var(--tracking-eyebrow)" }}
      >
        Not built
      </span>
      {note}
    </p>
  );
}

function Headline({ slide }: { slide: Slide }) {
  return (
    <h2
      id={`slide-${slide.id}-headline`}
      className="max-w-[24ch] text-[clamp(1.5rem,1.1rem+1.8vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink"
    >
      {slide.headline}
    </h2>
  );
}

function Body({ slide }: { slide: Slide }) {
  return (
    <div className="max-w-[64ch] space-y-3">
      {slide.body.map((line) => (
        <p key={line} className="text-[15px] leading-[1.62] text-ink-soft">
          {line}
        </p>
      ))}
    </div>
  );
}

function SummaryTable({ slide }: { slide: Slide }) {
  return (
    <table className="venue-deck-table mt-5 w-full border-collapse text-left text-[13px]">
      <caption className="sr-only">{slide.headline}</caption>
      <tbody>
        {(slide.rows ?? []).map(([label, value]) => (
          <tr key={label} className="border-t border-border-soft align-top">
            <th
              scope="row"
              className="w-[34%] py-1.5 pr-4 font-medium text-ink"
            >
              {label}
            </th>
            <td className="py-1.5 text-ink-soft">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function VenueSalesDeckView({
  deck,
  className = "",
}: {
  deck: VenueSalesDeck;
  className?: string;
}) {
  return (
    <div className={`venue-deck mx-auto flex w-full max-w-[1120px] flex-col gap-8 ${className}`}>
      {!deck.filled && (
        <p
          className="rounded-md border border-border bg-bg-deep px-4 py-3 text-[13px] leading-[1.6] text-ink-soft print:hidden"
          role="status"
        >
          No venue name has been supplied, so the cover reads {deck.venueName}.
          A deck shown with a placeholder on the cover is a deck that was not
          prepared.
        </p>
      )}

      {deck.slides.map((slide) => (
        <SlideChrome key={slide.id} slide={slide}>
          <Headline slide={slide} />
          <Body slide={slide} />
          {slide.kind === "table" && <SummaryTable slide={slide} />}
          {slide.notBuilt && <NotBuilt note={slide.notBuilt} />}
        </SlideChrome>
      ))}
    </div>
  );
}
