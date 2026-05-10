/**
 * Reveal closing — antique-gold hairline (mirrors the opening rule) +
 * editorial sign-off + mono address line. Page begins and ends on the
 * gold accent. Circular structure.
 */

export function RevealClosing() {
  return (
    <section className="reveal-closing">
      <div className="reveal-closing-rule" aria-hidden />
      <p className="reveal-closing-sign">
        Built for <span className="em">everyone else</span>.
      </p>
      <p className="reveal-closing-addr">
        <a href="mailto:hello@signalstudio.ie">hello@signalstudio.ie</a>
        <span className="sep" aria-hidden>·</span>
        <span>Dublin, 2026</span>
      </p>
    </section>
  );
}
