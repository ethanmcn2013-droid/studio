/**
 * "What we make" — philosophy fragment.
 * 50-80 words. Quiet, specific, anti-jargon.
 * Tone mirrors Tasks /principles: confident, dry, no hedging.
 */
export function Manifesto() {
  return (
    <section className="mx-auto w-full max-w-[760px] px-6 pb-28">
      <div className="max-w-[520px]">
        <div
          className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--accent)" }}
        >
          What we make
        </div>
        <p
          className="leading-[1.7] text-ink-soft"
          style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
        >
          We build two tools. Both are specific. Neither has a pricing tier
          designed to trap you. We don&rsquo;t believe software should need
          onboarding videos or a customer success manager. If you can&rsquo;t
          figure it out in five minutes, that&rsquo;s on us. The goal is
          software quiet enough to disappear into the work.
        </p>
      </div>
    </section>
  );
}
