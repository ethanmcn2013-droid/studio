/**
 * Hero — Signal Studio's opening frame.
 *
 * Headline carries the operating headline ("Cut through the noise.")
 * Sub-paragraph carries the operating principle. Both are locked in
 * brand memory as load-bearing copy.
 *
 * No cinematic demo. The umbrella site is a directory; the
 * products carry the weight. A quiet anchor CTA invites the scroll.
 */
export function Hero() {
  return (
    <section className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      <h1
        className="rise mt-8 text-balance font-semibold leading-[1.04] tracking-[-0.035em] text-ink"
        style={{ fontSize: "clamp(2rem, 1.3rem + 3vw, 3.5rem)", animationDelay: "0ms" }}
      >
        Cut through the noise.
      </h1>

      <p
        className="rise mt-6 max-w-[540px] leading-[1.6] text-ink-soft"
        style={{ fontSize: "clamp(1.0625rem, 0.95rem + 0.45vw, 1.1875rem)", animationDelay: "120ms" }}
      >
        Operational clarity software. Built for people who want to know
        what matters next, not be told everything at once.
      </p>

      <p
        className="rise mt-3 max-w-[540px] leading-[1.6] text-ink-quiet"
        style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)", animationDelay: "120ms" }}
      >
        Four tools live here. Each one specific, finished, and already shipped.
      </p>

      {/* Quiet anchor CTA — a small invitation, not a funnel */}
      <a
        href="#products"
        className="rise mt-6 inline-block text-[13.5px] text-ink-quiet transition-colors hover:text-ink"
        style={{ animationDelay: "200ms" }}
      >
        See what we make ↓
      </a>

      <div
        className="rise mt-14 h-px w-12"
        style={{ background: "var(--accent)", animationDelay: "240ms" }}
        aria-hidden
      />

      <p
        className="rise mt-4 font-mono text-[11px] uppercase text-ink-faint"
        style={{ letterSpacing: "var(--tracking-eyebrow)", animationDelay: "360ms" }}
      >
        Operating principle &middot; Everything important. Nothing distracting.
      </p>
    </section>
  );
}
