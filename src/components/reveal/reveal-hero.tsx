/**
 * Reveal hero — indigo accent hairline + masked word-by-word headline +
 * typewriter subhead + four-product wordmark stack with the §4 brand
 * gestures.
 *
 * Mostly pure markup. The headline + stack choreography is owned by
 * RevealEngine which targets the class names in this file from a
 * client component. The subhead is a small client component
 * (TypewriterSub) which types itself in and keeps its caret blinking.
 */

import { TypewriterSub } from "./typewriter-sub";

export function RevealHero() {
  return (
    <section
      className="reveal-hero"
      aria-label="Signal Studio — Project Management for the 80% not in tech"
    >
      <div className="reveal-gold-rule" aria-hidden />

      <h1
        className="reveal-headline"
        aria-label="Project Management for the 80% not in tech."
      >
        <span className="line line-1">
          <span className="word">
            <span className="word-inner">Project</span>
          </span>{" "}
          <span className="word">
            <span className="word-inner">Management</span>
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
            <span className="word-inner em">80%</span>
          </span>
        </span>
        <span className="line line-3">
          <span className="word">
            <span className="word-inner">not</span>
          </span>{" "}
          <span className="word">
            <span className="word-inner">in</span>
          </span>{" "}
          <span className="word">
            <span className="word-inner">tech.</span>
          </span>
        </span>
      </h1>

      <TypewriterSub
        text="Four small tools. Plain English. Built for the work, not the workflow."
        startDelayMs={2200}
      />

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
