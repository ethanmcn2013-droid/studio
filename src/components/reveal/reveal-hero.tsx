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
      aria-label="Signal Studio — Project Management for the 80% who don't work in tech"
    >
      <div className="reveal-gold-rule" aria-hidden />

      <h1
        className="reveal-headline"
        aria-label="Project Management for the 80% who don't work in tech."
      >
        <span className="word">
          <span className="word-inner">Project</span>
        </span>{" "}
        <span className="word">
          <span className="word-inner">Management</span>
        </span>
        <br />
        <span className="word">
          <span className="word-inner">for</span>
        </span>{" "}
        <span className="word">
          <span className="word-inner">the</span>
        </span>{" "}
        <span className="word">
          <span className="word-inner">80%</span>
        </span>{" "}
        <span className="word">
          <span className="word-inner">who</span>
        </span>
        <br />
        <span className="word">
          <span className="word-inner">don&apos;t</span>
        </span>{" "}
        <span className="word">
          <span className="word-inner">work</span>
        </span>{" "}
        <span className="word">
          <span className="word-inner">in</span>
        </span>{" "}
        <span className="word">
          <span className="word-inner">tech.</span>
        </span>
      </h1>

      <p className="reveal-subhead">
        <span>Four small tools.</span>
        <span className="em">Built for the 80% who don&apos;t work in tech.</span>
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
