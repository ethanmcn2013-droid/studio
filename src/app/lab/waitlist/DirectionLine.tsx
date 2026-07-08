"use client";

/**
 * Direction B — "The Line" (locked, design pass 4 — craft elevation).
 *
 * Still flat, still on-system: paper, hairlines, no gradients, no glow, no
 * drop-shadows. The craft budget goes where BRAND.md says it should, to
 * typography, hierarchy, and a couple of unforgettable moments:
 *
 *   1. The headline ends with the accent dot as its period, the house
 *      wordmark gesture, so it rhymes with the queue and the suite mark.
 *   2. The queue is a real line: dots threaded on one 1px hairline (the
 *      brand's material) that runs open-ended to the right, so the line
 *      reads as still forming. Dots are opaque color-mix tints, so the
 *      thread reads cleanly through the gaps.
 *   3. Accent is spent in exactly three meaningful marks: the tick rule,
 *      the headline period, your dot. Your dot arrives ALONG the line from
 *      the right, honestly to the back, and emits one crisp ring per breath.
 *
 * Review-only mock; the winner is wired to joinWaitlistAction.
 */

import { useState } from "react";

const WAITING = 16;

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
        <div className="wlb-rule" aria-hidden />
        <p className="wlb-eyebrow">The line</p>

        <h1 className="wlb-headline" aria-label="Join the line.">
          Join the line<span className="wlb-headline-dot" aria-hidden />
        </h1>
        <p className="wlb-lede">
          Signal Studio opens in small batches from 1 September. Add your name and
          we write when your batch is ready, not before.
        </p>

        <div className="wlb-queue" aria-hidden>
          <span className="wlb-line">
            {Array.from({ length: WAITING }).map((_, i) => {
              const tint = 38 + ((i * 7) % 5) * 9;
              const size = i % 6 === 2 ? 11 : 9;
              return (
                <span
                  className="wlb-dot"
                  key={i}
                  style={{
                    animationDelay: `${0.5 + i * 0.045}s`,
                    background: `color-mix(in srgb, var(--ink-quiet) ${tint}%, var(--bg))`,
                    width: size,
                    height: size,
                  }}
                />
              );
            })}
            {done ? <span className="wlb-dot wlb-dot--you" /> : null}
          </span>
        </div>
        <p className="wlb-queue-label">
          {done ? "You are in the line." : "A quiet line, already forming."}
        </p>

        {done ? (
          <p className="wlb-echo" role="status">
            We&rsquo;ll write to <strong>{email}</strong> when your batch opens.
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
            <button type="submit">Hold my place</button>
          </form>
        )}

        <p className="wlb-foot">No newsletter. No noise. Just the access window.</p>
      </div>

      <style>{`
        .wlb {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: clamp(56px, 9vh, 120px) 24px;
          background: var(--bg);
        }
        .wlb-shell {
          width: min(600px, 100%);
          text-align: center;
        }
        .wlb-rule {
          width: 44px;
          height: 1px;
          margin: 0 auto 30px;
          background: var(--accent);
        }
        .wlb-eyebrow,
        .wlb-headline,
        .wlb-lede,
        .wlb-queue,
        .wlb-queue-label,
        .wlb-form,
        .wlb-echo,
        .wlb-foot {
          animation: wlb-in 0.7s var(--ease-out) both;
        }
        .wlb-eyebrow {
          margin: 0 0 24px;
          color: var(--ink-quiet);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .wlb-headline {
          margin: 0;
          color: var(--ink);
          font-size: clamp(2.9rem, 7.4vw, 5.25rem);
          font-weight: 600;
          letter-spacing: -0.045em;
          line-height: 0.96;
          animation-delay: 0.06s;
        }
        .wlb-headline-dot {
          display: inline-block;
          width: 0.2em;
          height: 0.2em;
          margin-left: 0.04em;
          border-radius: 50%;
          background: var(--accent);
          vertical-align: baseline;
          transform: translateY(-0.02em) scale(0);
          animation: wlb-dot-in 0.5s var(--ease-out) 0.5s both;
        }
        .wlb-lede {
          max-width: 44ch;
          margin: 24px auto 0;
          color: var(--ink-soft);
          font-size: clamp(1rem, 0.96rem + 0.3vw, 1.16rem);
          line-height: 1.62;
          animation-delay: 0.12s;
        }
        .wlb-queue {
          display: flex;
          justify-content: center;
          margin: 54px auto 0;
          min-height: 16px;
          animation-delay: 0.2s;
        }
        .wlb-line {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 13px;
          padding-right: 2px;
        }
        .wlb-line::before {
          content: "";
          position: absolute;
          left: 0;
          right: -26px;
          top: 50%;
          height: 1px;
          background: var(--border);
          transform: translateY(-50%);
          z-index: 0;
        }
        .wlb-dot {
          position: relative;
          z-index: 1;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--ink-quiet);
          transform: translateX(18px) scale(0.4);
          animation: wlb-settle 0.62s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .wlb-dot--you {
          background: var(--accent) !important;
          width: 13px !important;
          height: 13px !important;
          transform: translateX(20px) scale(0.4);
          animation: wlb-arrive 0.62s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .wlb-dot--you::before {
          content: "";
          position: absolute;
          inset: -6px;
          border: 1.5px solid var(--accent);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.7);
          animation: wlb-emit 2.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s infinite;
        }
        .wlb-queue-label {
          margin: 24px 0 0;
          color: var(--ink-quiet);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation-delay: 0.26s;
        }
        .wlb-form {
          display: flex;
          gap: 8px;
          width: min(460px, 100%);
          margin: 32px auto 0;
          padding: 6px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--bg-elev);
          transition: border-color var(--motion-base) var(--ease-out);
          animation-delay: 0.32s;
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
        .wlb-form input::placeholder { color: var(--ink-faint, var(--ink-quiet)); }
        .wlb-form button {
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
        .wlb-form button:hover { opacity: 0.9; }
        .wlb-form button:active { transform: translateY(1px); }
        .wlb-form input:focus-visible,
        .wlb-form button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .wlb-echo {
          margin: 32px auto 0;
          color: var(--ink-soft);
          font-size: 15px;
        }
        .wlb-echo strong { color: var(--ink); }
        .wlb-foot {
          margin: 44px 0 0;
          color: var(--ink-faint, var(--ink-quiet));
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation-delay: 0.38s;
        }
        @keyframes wlb-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wlb-dot-in {
          from { transform: translateY(-0.02em) scale(0); }
          to { transform: translateY(-0.02em) scale(1); }
        }
        @keyframes wlb-settle {
          to { transform: translateX(0) scale(1); }
        }
        @keyframes wlb-arrive {
          from { transform: translateX(20px) scale(0.4); opacity: 0; }
          to { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes wlb-emit {
          0%, 55% { opacity: 0; transform: scale(0.7); }
          65% { opacity: 0.85; transform: scale(1); }
          100% { opacity: 0; transform: scale(2.4); }
        }
        @media (max-width: 520px) {
          .wlb-line { gap: 10px; }
          .wlb-form { flex-wrap: wrap; border-radius: 16px; }
          .wlb-form button { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wlb-eyebrow, .wlb-headline, .wlb-lede, .wlb-queue, .wlb-queue-label,
          .wlb-form, .wlb-echo, .wlb-foot { animation: none; opacity: 1; transform: none; }
          .wlb-headline-dot { animation: none; transform: translateY(-0.02em) scale(1); }
          .wlb-dot { animation: none; transform: none; }
          .wlb-dot--you { animation: none; transform: none; }
          .wlb-dot--you::before { animation: none; }
        }
      `}</style>
    </section>
  );
}
