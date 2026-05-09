/**
 * Operational-clarity philosophy fragment.
 * 50-80 words. Quiet, specific, anti-jargon. No "AI-powered", no
 * "all-in-one". Frames the category — operational clarity — as
 * deliberate, not aspirational.
 */
export function Manifesto() {
  return (
    <section className="mx-auto w-full max-w-[760px] px-6 pb-28">
      <div className="max-w-[540px]">
        <span aria-hidden className="manifesto-rule" />
        <div
          className="mb-5 text-[11px] font-semibold uppercase"
          style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
        >
          Operational clarity
        </div>
        <p
          className="leading-[1.7] text-ink-soft"
          style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
        >
          Most software gives you more — more dashboards, more notifications,
          more places to check. We give you less. Less to manage, less to
          monitor, less to remember. The category isn&rsquo;t productivity.
          It&rsquo;s clarity. Every product here is built to reduce ambiguity,
          not add information. If a feature can&rsquo;t earn its place that
          way, it doesn&rsquo;t ship.
        </p>
      </div>
    </section>
  );
}
