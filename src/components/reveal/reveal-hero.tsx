/**
 * Reveal hero: indigo accent hairline + headline + Studio conductor
 * handoff. RevealEngine owns the house-mark broadcast and product
 * gesture timing through the class names rendered here.
 */

export function RevealHero() {
  return (
    <section className="reveal-hero" aria-label="Signal Studio suite">
      <div className="reveal-gold-rule" aria-hidden />

      <p
        className="reveal-launch-note"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          margin: "0 0 22px",
          padding: "5px 13px",
          border: "1px solid var(--border)",
          borderRadius: 999,
          background: "var(--paper-soft)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink-quiet)",
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent)",
          }}
        />
        Arriving 1 September 2026
      </p>

      <h1
        className="reveal-headline"
        aria-label="Project management for the 80% not in tech."
      >
        <span className="line line-1">
          <span className="word">
            <span className="word-inner">Project</span>
          </span>{" "}
          <span className="word">
            <span className="word-inner">management</span>
          </span>
        </span>
        <span className="line line-2">
          <span className="word">
            <span className="word-inner">for</span>
          </span>{" "}
          <span className="word">
            <span className="word-inner">the</span>
          </span>{" "}
          <span className="word">
            <span className="word-inner">80%</span>
          </span>
        </span>
        <span className="line line-3">
          <span className="word">
            <span className="word-inner em">not</span>
          </span>{" "}
          <span className="word">
            <span className="word-inner">in</span>
          </span>{" "}
          <span className="word">
            <span className="word-inner">tech.</span>
          </span>
        </span>
      </h1>

      <p className="reveal-subhead">
        Capture the note. Execute the task. Set the timeline. Read the signal.
      </p>

      <div className="reveal-conductor" aria-label="Signal Studio product handoff">
        <div className="reveal-house-mark" aria-label="Signal Studio">
          <span className="house-word">signal studio</span>
          <span className="house-dot" aria-hidden />
        </div>

        <nav className="reveal-stack" aria-label="Signal Studio products">
          <a
            className="stack-row"
            data-key="notes"
            data-stage="capture"
            href="#notes"
            aria-label="Notes: capture"
          >
            <span className="mark">
              <span className="word">notes</span>
              <span className="dot" />
            </span>
          </a>
          <a
            className="stack-row"
            data-key="tasks"
            data-stage="execution"
            href="#tasks"
            aria-label="Tasks: execution"
          >
            <span className="mark">
              <span className="word">tasks</span>
              <span className="dot" />
            </span>
          </a>
          <a
            className="stack-row"
            data-key="timeline"
            data-stage="direction"
            href="#timeline"
            aria-label="Timeline: direction"
          >
            <span className="mark">
              <span className="word">timeline</span>
              <span className="dot" />
            </span>
          </a>
          <a
            className="stack-row"
            data-key="signal"
            data-stage="attention"
            href="#signal"
            aria-label="Signal: attention"
          >
            <span className="mark">
              <span className="word">signal</span>
              <span className="dot" />
            </span>
          </a>
        </nav>
      </div>
    </section>
  );
}
