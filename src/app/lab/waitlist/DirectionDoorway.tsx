"use client";

/**
 * Direction A — "The Doorway".
 *
 * Editorial-calm. Leads with the launch-date pill (the homepage gesture),
 * a masked word-by-word headline, and a single email row. Everything past
 * the email is progressive disclosure ("Add context") so the first read
 * stays low-noise. On submit the row collapses into a held-place line with
 * a pulsing accent dot. Review-only mock; the real action gets wired to
 * the winning direction.
 */

import { useState } from "react";

const HEADLINE = ["The", "list", "before", "the", "launch."];

export function DirectionDoorway() {
  const [email, setEmail] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  }

  return (
    <section className="wla">
      <div className="wla-rule" aria-hidden />

      <div className="wla-shell">
        <p className="wla-pill">
          <span className="wla-pill-dot" aria-hidden />
          Arriving 1 September 2026
        </p>

        <h1 className="wla-headline" aria-label={HEADLINE.join(" ")}>
          {HEADLINE.map((word, i) => (
            <span className="wla-word" key={i}>
              <span className="wla-word-inner" style={{ animationDelay: `${0.08 * i}s` }}>
                {word}
              </span>{" "}
            </span>
          ))}
        </h1>

        <p className="wla-lede">
          Signal Studio opens in small batches from 1 September. Take your place
          and we will write when your batch is ready.
        </p>

        {done ? (
          <div className="wla-done" role="status">
            <span className="wla-done-dot" aria-hidden />
            <div>
              <strong>You are on the list.</strong>
              <span>Place held. We will write to {email} when your batch opens.</span>
            </div>
          </div>
        ) : (
          <form className="wla-form" onSubmit={onSubmit}>
            <div className="wla-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email"
                required
              />
              <button type="submit">Join the list</button>
            </div>

            <button
              type="button"
              className="wla-expand"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Less" : "Add a line of context"}
            </button>

            <div className="wla-more" data-open={expanded}>
              <label>
                <span>Name</span>
                <input type="text" placeholder="Optional" />
              </label>
              <label>
                <span>What should it help you run?</span>
                <select defaultValue="">
                  <option value="">Choose one</option>
                  <option>Wedding or event planning</option>
                  <option>Venue Edition</option>
                  <option>Student work</option>
                  <option>Freelance client work</option>
                  <option>Trades or site work</option>
                  <option>Small business rhythm</option>
                  <option>Something else</option>
                </select>
              </label>
            </div>
          </form>
        )}

        <ul className="wla-support" aria-label="What you are joining">
          <li>
            <span className="wla-support-dot" aria-hidden />
            For the 80% who don&rsquo;t work in tech.
          </li>
          <li>
            <span className="wla-support-dot" aria-hidden />
            Notes, Tasks, Timeline, and Signal. One system.
          </li>
          <li>
            <span className="wla-support-dot" aria-hidden />
            No newsletter. Just the access window.
          </li>
        </ul>
      </div>

      <style>{`
        .wla {
          position: relative;
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: clamp(56px, 9vh, 120px) 24px;
          background:
            radial-gradient(120% 80% at 50% -10%, var(--accent-glow) 0%, transparent 55%),
            linear-gradient(180deg, var(--bg) 0%, var(--bg-deep) 100%);
        }
        .wla-rule {
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.8;
        }
        .wla-shell {
          width: min(680px, 100%);
          text-align: center;
        }
        .wla-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 30px;
          padding: 5px 13px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--paper-soft, var(--bg-elev));
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-quiet);
        }
        .wla-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 0 var(--accent-glow);
          animation: wla-pulse 3.2s var(--ease-out) infinite;
        }
        .wla-headline {
          margin: 0;
          color: var(--ink);
          font-size: clamp(2.6rem, 6.4vw, 4.6rem);
          font-weight: 600;
          letter-spacing: -0.04em;
          line-height: 1.0;
          text-wrap: balance;
        }
        .wla-word {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }
        .wla-word-inner {
          display: inline-block;
          transform: translateY(110%);
          animation: wla-rise 0.72s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .wla-lede {
          max-width: 46ch;
          margin: 24px auto 0;
          color: var(--ink-soft);
          font-size: clamp(1.02rem, 0.98rem + 0.3vw, 1.2rem);
          line-height: 1.6;
        }
        .wla-form {
          margin: 36px auto 0;
          max-width: 468px;
        }
        .wla-row {
          display: flex;
          gap: 8px;
          padding: 6px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--bg-elev);
          box-shadow: var(--shadow-2);
          transition: border-color var(--motion-base) var(--ease-out);
        }
        .wla-row:focus-within {
          border-color: var(--accent);
        }
        .wla-row input {
          flex: 1;
          min-width: 0;
          height: 44px;
          padding: 0 8px 0 16px;
          border: 0;
          background: transparent;
          color: var(--ink);
          font: inherit;
          font-size: 15px;
          outline: none;
        }
        .wla-row button {
          flex-shrink: 0;
          height: 44px;
          padding: 0 22px;
          border: 0;
          border-radius: 999px;
          background: var(--ink);
          color: var(--bg-elev);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity var(--motion-base) var(--ease-out), transform var(--motion-fast) var(--ease-out);
        }
        .wla-row button:hover { opacity: 0.9; }
        .wla-row button:active { transform: translateY(1px); }
        .wla-expand {
          margin: 14px auto 0;
          border: 0;
          background: transparent;
          color: var(--ink-quiet);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color var(--motion-base) var(--ease-out);
        }
        .wla-expand:hover { color: var(--ink); }
        .wla-more {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          max-height: 0;
          margin-top: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.42s var(--ease-out), opacity 0.42s var(--ease-out), margin-top 0.42s var(--ease-out);
        }
        .wla-more[data-open="true"] {
          max-height: 200px;
          margin-top: 16px;
          opacity: 1;
        }
        .wla-more label {
          display: grid;
          gap: 6px;
          text-align: left;
        }
        .wla-more span {
          color: var(--ink-quiet);
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .wla-more input,
        .wla-more select {
          height: 42px;
          padding: 0 12px;
          border: 1px solid var(--border-soft);
          border-radius: 8px;
          background: var(--bg);
          color: var(--ink);
          font: inherit;
          font-size: 14px;
          outline: none;
        }
        .wla-more input:focus,
        .wla-more select:focus { border-color: var(--accent); }
        .wla-done {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin: 36px auto 0;
          padding: 16px 24px 16px 18px;
          border: 1px solid var(--border);
          border-radius: 14px;
          background: var(--bg-elev);
          box-shadow: var(--shadow-accent);
          text-align: left;
          animation: wla-rise 0.5s var(--ease-out) both;
        }
        .wla-done-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--accent);
          animation: wla-pulse 2.4s var(--ease-out) infinite;
        }
        .wla-done strong { display: block; color: var(--ink); font-size: 15px; }
        .wla-done span { display: block; margin-top: 3px; color: var(--ink-quiet); font-size: 13px; }
        .wla-support {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px 24px;
          margin: 48px 0 0;
          padding: 0;
          list-style: none;
        }
        .wla-support li {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--ink-quiet);
          font-size: 12.5px;
        }
        .wla-support-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
          opacity: 0.7;
        }
        @keyframes wla-rise {
          from { transform: translateY(110%); }
          to { transform: translateY(0); }
        }
        @keyframes wla-pulse {
          0% { box-shadow: 0 0 0 0 var(--accent-glow); }
          60%, 100% { box-shadow: 0 0 0 10px transparent; }
        }
        @media (max-width: 520px) {
          .wla-more { grid-template-columns: 1fr; }
          .wla-row { flex-wrap: wrap; border-radius: 16px; }
          .wla-row button { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wla-word-inner, .wla-done { animation: none; transform: none; }
          .wla-pill-dot, .wla-done-dot { animation: none; }
        }
      `}</style>
    </section>
  );
}
