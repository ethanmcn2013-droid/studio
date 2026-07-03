/**
 * Reveal manifesto — operating principle eyebrow → display H2 with
 * indigo accent highlight on "less" → two body paragraphs.
 *
 * Pure markup. ScrollTrigger reveals are wired in RevealEngine.
 */

export function RevealManifesto() {
  return (
    <section className="reveal-manifesto">
      <div className="reveal-manifesto-eyebrow reveal">
        Operating principle <span className="gold">·</span> everything important. nothing distracting.
      </div>
      <h2 className="reveal-manifesto-h2 reveal">
        Most software gives you more. Signal Studio gives you{" "}
        <span className="em">less</span>.
      </h2>
      <p className="reveal-manifesto-body reveal">
        Less to manage. Less to monitor. Less to remember. The category isn’t
        productivity. It’s clarity. Every tool here is built to reduce
        ambiguity, not add information. If a feature can’t earn its place that
        way, it doesn’t ship.
      </p>
      <p className="reveal-manifesto-body reveal">
        Built for the <strong>80%</strong> of people who run real work without
        working in tech — wedding planners, freelance designers, tradespeople,
        students, small-business owners, teachers. No setup. No vocabulary. Just
        open the page and start.
      </p>
    </section>
  );
}
