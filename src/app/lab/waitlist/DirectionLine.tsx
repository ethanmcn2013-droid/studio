"use client";

/**
 * Direction B — "The Line".
 *
 * The suite's signature dot becomes the thing itself: a line of people
 * already waiting. Dots settle in from the right on mount; on submit your
 * dot (accent, larger) drops into the front of the line and pulses. Warm,
 * a little delightful, no fake counters. Review-only mock.
 */

import { useState } from "react";

const WAITING = 18;

export function DirectionLine() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  }

  return (
    <section className="wlb">
      <div className="wlb-shell">
        <p className="wlb-eyebrow">The line</p>

        <h1 className="wlb-headline">
          Join the line.
        </h1>
        <p className="wlb-lede">
          Signal Studio opens in small batches from 1 September. Take your place.
          We write when the room is ready, not before.
        </p>

        <div className="wlb-queue" aria-hidden data-done={done}>
          {done ? (
            <span className="wlb-dot wlb-dot--you" title="You" />
          ) : null}
          {Array.from({ length: WAITING }).map((_, i) => (
            <span
              className="wlb-dot"
              key={i}
              style={{ animationDelay: `${0.5 + i * 0.045}s` }}
            />
          ))}
        </div>
        <p className="wlb-queue-label">
          {done ? "You are in the line." : "A quiet line, already forming."}
        </p>

        {done ? (
          <p className="wlb-done" role="status">
            We will write to <strong>{email}</strong> when your batch opens.
          </p>
        ) : (
          <form className="wlb-form" onSubmit={onSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email"
              required
            />
            <button type="submit">Take your place</button>
          </form>
        )}
      </div>

      <style>{`
        .wlb {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: clamp(56px, 9vh, 120px) 24px;
          background: linear-gradient(180deg, var(--bg-deep) 0%, var(--bg) 60%);
        }
        .wlb-shell {
          width: min(640px, 100%);
          text-align: center;
        }
        .wlb-eyebrow {
          margin: 0 0 22px;
          color: var(--accent);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .wlb-headline {
          margin: 0;
          color: var(--ink);
          font-size: clamp(2.8rem, 7vw, 5rem);
          font-weight: 600;
          letter-spacing: -0.045em;
          line-height: 0.98;
        }
        .wlb-lede {
          max-width: 44ch;
          margin: 22px auto 0;
          color: var(--ink-soft);
          font-size: clamp(1rem, 0.96rem + 0.3vw, 1.16rem);
          line-height: 1.6;
        }
        .wlb-queue {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin: 52px auto 0;
          max-width: 440px;
          min-height: 20px;
        }
        .wlb-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--ink-faint, var(--ink-quiet));
          opacity: 0.55;
          transform: translateX(14px) scale(0.6);
          animation: wlb-settle 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .wlb-dot--you {
          width: 15px;
          height: 15px;
          background: var(--accent);
          opacity: 1;
          transform: none;
          animation: wlb-drop 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both,
                     wlb-pulse 2.4s var(--ease-out) 0.6s infinite;
          box-shadow: 0 0 0 0 var(--accent-glow);
        }
        .wlb-queue-label {
          margin: 20px 0 0;
          color: var(--ink-quiet);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .wlb-form {
          display: flex;
          gap: 8px;
          width: min(468px, 100%);
          margin: 32px auto 0;
          padding: 6px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--bg-elev);
          box-shadow: var(--shadow-2);
          transition: border-color var(--motion-base) var(--ease-out);
        }
        .wlb-form:focus-within { border-color: var(--accent); }
        .wlb-form input {
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
        .wlb-form button {
          flex-shrink: 0;
          height: 44px;
          padding: 0 22px;
          border: 0;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: filter var(--motion-base) var(--ease-out), transform var(--motion-fast) var(--ease-out);
        }
        .wlb-form button:hover { filter: brightness(1.08); }
        .wlb-form button:active { transform: translateY(1px); }
        .wlb-done {
          margin: 32px auto 0;
          color: var(--ink-soft);
          font-size: 15px;
        }
        .wlb-done strong { color: var(--ink); }
        @keyframes wlb-settle {
          to { transform: translateX(0) scale(1); }
        }
        @keyframes wlb-drop {
          from { transform: translateY(-16px) scale(0.4); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes wlb-pulse {
          0% { box-shadow: 0 0 0 0 var(--accent-glow); }
          60%, 100% { box-shadow: 0 0 0 12px transparent; }
        }
        @media (max-width: 520px) {
          .wlb-form { flex-wrap: wrap; border-radius: 16px; }
          .wlb-form button { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wlb-dot, .wlb-dot--you { animation: none; transform: none; opacity: 0.55; }
          .wlb-dot--you { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
