/**
 * Reveal manifesto, operating principle eyebrow → display H2 with
 * indigo accent highlight on "less" and one concise body paragraph.
 *
 * Pure markup. ScrollTrigger reveals are wired in RevealEngine.
 */

export function RevealManifesto() {
  return (
    <section className="reveal-manifesto">
      <div className="reveal-manifesto-eyebrow">
        Operating principle <span className="gold">·</span> everything important. nothing distracting.
      </div>
      <h2 className="reveal-manifesto-h2">
        Most software gives you more. Signal Studio gives you{" "}
        <span className="em">less</span>.
      </h2>
      <p className="reveal-manifesto-body">
        Less to manage. Less to monitor. Less to remember. The category isn’t
        productivity. It’s clarity.
      </p>
    </section>
  );
}
