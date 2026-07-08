/**
 * Reveal closing, indigo accent hairline (mirrors the opening rule) +
 * editorial sign-off + a two-path call to action + mono address line.
 * Page begins and ends on the indigo accent. Circular structure.
 *
 * The CTA pair is the conversion point the front door deliberately
 * withholds (the hero reads as a headline, not a wall). It serves both
 * audiences the suite actually has: the person joining staged access
 * (waitlist), and the venue/events buyer whose path is high-touch.
 */

import Link from "next/link";

export function RevealClosing() {
  return (
    <section className="reveal-closing">
      <div className="reveal-closing-rule" aria-hidden />
      <p className="reveal-closing-sign reveal">
        Built for <span className="em">everyone else</span>.
      </p>

      <div className="reveal-closing-cta reveal">
        <Link
          className="reveal-cta reveal-cta-primary"
          href="/waitlist?source=home_closing&campaign=pre_access_waitlist&artifact=closing_cta&touch=site"
        >
          Join the waitlist
          <span className="cta-arrow" aria-hidden>
            {" "}
            →
          </span>
        </Link>
        <Link className="reveal-cta reveal-cta-ghost" href="/venues">
          For venues &amp; events
          <span className="cta-arrow" aria-hidden>
            {" "}
            →
          </span>
        </Link>
      </div>

      <p className="reveal-closing-addr reveal">
        <a href="mailto:hello@signalstudio.ie">hello@signalstudio.ie</a>
        <span className="sep" aria-hidden>·</span>
        <span>Limerick, {new Date().getFullYear()}</span>
      </p>
    </section>
  );
}
