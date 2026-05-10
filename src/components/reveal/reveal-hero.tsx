/**
 * Reveal hero — antique-gold hairline + masked word-by-word headline +
 * subhead + four-product wordmark stack with the §4 brand gestures.
 *
 * Pure markup. The animation choreography is owned by RevealEngine
 * which targets the class names in this file from a client component.
 */

export function RevealHero() {
  return (
    <section
      className="reveal-hero"
      aria-label="Signal Studio — Cut through the noise"
    >
      <div className="reveal-gold-rule" aria-hidden />

      <h1 className="reveal-headline" aria-label="Cut through the noise.">
        <span className="word">
          <span className="word-inner">Cut</span>
        </span>{" "}
        <span className="word">
          <span className="word-inner">through</span>
        </span>
        <br />
        <span className="word">
          <span className="word-inner">the</span>
        </span>{" "}
        <span className="word">
          <span className="word-inner">noise.</span>
        </span>
      </h1>

      <p className="reveal-subhead">
        Four small tools.{" "}
        <span className="em">Built for the 80%.</span>
      </p>

      <nav className="reveal-stack" aria-label="Signal Studio products">
        <a className="stack-row" data-key="tasks" href="#tasks">
          <span className="mark">
            <span className="word">tasks</span>
            <span className="dot" />
          </span>
        </a>
        <a className="stack-row" data-key="roadmap" href="#roadmap">
          <span className="mark">
            <span className="word">roadmap</span>
            <span className="dot" />
          </span>
        </a>
        <a className="stack-row" data-key="analytics" href="#analytics">
          <span className="mark">
            <span className="word">analytics</span>
            <span className="dot" />
          </span>
        </a>
        <a className="stack-row" data-key="notes" href="#notes">
          <span className="mark">
            <span className="word">notes</span>
            <span className="dot" />
          </span>
        </a>
      </nav>

      <div className="reveal-scroll-cue" aria-hidden>
        Read on
        <span className="arrow">↓</span>
      </div>
    </section>
  );
}
