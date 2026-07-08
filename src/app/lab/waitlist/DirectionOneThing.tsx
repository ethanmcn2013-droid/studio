"use client";

/**
 * Direction C — "One thing, first".
 *
 * Radical restraint, the Jobs read. Near-empty page. One line of copy, one
 * field. The dot is the period at the end of the line and it pulses. On
 * submit the whole line rewrites to a held-place state and the underline
 * fills with accent. Maximum signal, minimum noise, the literal answer to
 * "simple". Review-only mock.
 */

import { useState } from "react";

export function DirectionOneThing() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setDone(true);
  }

  return (
    <section className="wlc">
      <div className="wlc-shell">
        <p className="wlc-stamp">01·09·2026</p>

        <h1 className="wlc-line" data-done={done}>
          {done ? "Your place is held" : "Signal Studio opens in batches. Get your place"}
          <span className="wlc-dot" aria-hidden />
        </h1>

        {done ? (
          <p className="wlc-echo" role="status">
            We will write to {email} when your batch opens.
          </p>
        ) : (
          <form className="wlc-form" onSubmit={onSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email"
              required
            />
            <button type="submit" aria-label="Join">
              <span aria-hidden>&rarr;</span>
            </button>
          </form>
        )}

        <p className="wlc-foot">
          For the 80% who don&rsquo;t work in tech. No newsletter.
        </p>
      </div>

      <style>{`
        .wlc {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: clamp(56px, 12vh, 160px) 24px;
          background: var(--bg);
        }
        .wlc-shell {
          width: min(720px, 100%);
        }
        .wlc-stamp {
          margin: 0 0 40px;
          color: var(--ink-quiet);
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.28em;
        }
        .wlc-line {
          margin: 0;
          color: var(--ink);
          font-size: clamp(2rem, 4.6vw, 3.6rem);
          font-weight: 500;
          letter-spacing: -0.03em;
          line-height: 1.14;
          text-wrap: balance;
        }
        .wlc-dot {
          display: inline-block;
          width: 0.5em;
          height: 0.5em;
          margin-left: 0.08em;
          border-radius: 50%;
          background: var(--accent);
          vertical-align: baseline;
          animation: wlc-pulse 3s var(--ease-out) infinite;
        }
        .wlc-line[data-done="true"] .wlc-dot {
          animation: wlc-pop 0.5s var(--ease-out) both, wlc-pulse 2.2s var(--ease-out) 0.5s infinite;
        }
        .wlc-form {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 440px;
          margin: 44px 0 0;
          border-bottom: 1.5px solid var(--border);
          transition: border-color var(--motion-base) var(--ease-out);
        }
        .wlc-form:focus-within { border-color: var(--accent); }
        .wlc-form input {
          flex: 1;
          min-width: 0;
          height: 52px;
          border: 0;
          background: transparent;
          color: var(--ink);
          font: inherit;
          font-size: clamp(1.1rem, 1rem + 0.5vw, 1.4rem);
          outline: none;
        }
        .wlc-form input::placeholder { color: var(--ink-faint, var(--ink-quiet)); }
        .wlc-form button {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: var(--ink);
          color: var(--bg);
          font-size: 20px;
          cursor: pointer;
          transition: transform var(--motion-base) var(--ease-out), background var(--motion-base) var(--ease-out);
        }
        .wlc-form button:hover { transform: translateX(3px); background: var(--accent); color: #fff; }
        .wlc-echo {
          margin: 24px 0 0;
          color: var(--ink-quiet);
          font-size: 15px;
          animation: wlc-fade 0.5s var(--ease-out) both;
        }
        .wlc-foot {
          margin: 56px 0 0;
          color: var(--ink-faint, var(--ink-quiet));
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        @keyframes wlc-pulse {
          0% { box-shadow: 0 0 0 0 var(--accent-glow); }
          60%, 100% { box-shadow: 0 0 0 8px transparent; }
        }
        @keyframes wlc-pop {
          0% { transform: scale(0.2); opacity: 0; }
          60% { transform: scale(1.25); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes wlc-fade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wlc-dot, .wlc-echo { animation: none; }
        }
      `}</style>
    </section>
  );
}
