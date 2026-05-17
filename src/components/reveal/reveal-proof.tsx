/**
 * Reveal proof — the one beat on the umbrella front door where the
 * abstract manifesto ("Signal Studio gives you less") becomes a
 * concrete, dated scene in the audience's own life. Sits between the
 * manifesto and the four-product stack: assert less → show what less
 * looks like for a real person → name the tools.
 *
 * Deliberately NOT a product mockup or UI chrome — it stays in the
 * Reveal's editorial-type register (mono time-stamp + plain sentence),
 * the same restraint the rest of the page holds. The scene is the
 * canonical /proof scene (Sarah & James, 26 Sept — Powerscourt, Bloom
 * & Co, save-the-dates by 15 July). One scene, one truth across the
 * site — no demo-vs-reality drift between here and /proof.
 *
 * Pure markup. Server-rendered visible so it reads with no JS, for
 * crawlers, and under prefers-reduced-motion. The scroll-triggered
 * reveal is wired in RevealEngine and only plays when motion is
 * allowed.
 */

import Link from "next/link";

const SCENE = [
  {
    when: "The venue call",
    what: "A wedding planner fills forty-five minutes of notes. Vendors, deposits, the date the couple want held. Nothing is sorted yet — it does not need to be.",
  },
  {
    when: "That evening",
    what: "Three notes become three tasks. Sarah and James, the 26th of September. No setup. No projects to configure first.",
  },
  {
    when: "Midnight",
    what: "One link goes to the couple. They read the plan on their phone, in plain English. No login. No app to install.",
  },
  {
    when: "6 am",
    what: "The morning briefing names two things. The florist has been quiet eight days. The save-the-dates are three days late.",
  },
] as const;

export function RevealProof() {
  return (
    <section className="reveal-proof" aria-label="One real scene, end to end">
      <div className="reveal-proof-eyebrow reveal">
        Proof <span className="gold">·</span> one real Tuesday
      </div>
      <h2 className="reveal-proof-h2 reveal">
        Here is what <span className="em">less</span> looks like on a real
        day.
      </h2>

      <ol className="reveal-proof-scene">
        {SCENE.map((step) => (
          <li className="reveal-proof-line reveal" key={step.when}>
            <span className="when">{step.when}</span>
            <span className="what">{step.what}</span>
          </li>
        ))}
      </ol>

      <p className="reveal-proof-outro reveal">
        No dashboards. No vocabulary to learn. The plan, and the few things
        that need attention.{" "}
        <Link className="reveal-proof-link" href="/proof">
          See the scene in full{" "}
          <span className="cta-arrow" aria-hidden>
            →
          </span>
        </Link>
      </p>
    </section>
  );
}
