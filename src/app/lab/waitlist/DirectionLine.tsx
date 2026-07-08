"use client";

/**
 * Direction B — "The Line" (locked, design pass 2).
 *
 * The suite's signature dot becomes quiet company: a line already forming.
 * Crowd dots settle in from the right with a light organic variance so it
 * reads as people, not a ruler. On submit your dot (accent) joins the BACK
 * of the line, honestly, and pulses. No fake counters, no scarcity. Calm
 * on purpose. Review-only mock; the winner is wired to joinWaitlistAction.
 */

import { useState } from "react";

const WAITING = 19;

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
      <div className="wlb-rule" aria-hidden />

      <div className="wlb-shell">
        <p className="wlb-eyebrow">The line</p>

        <h1 className="wlb-headline">Join the line.</h1>
        <p className="wlb-lede">
          Signal Studio opens in small batches from 1 September. Add your name and
          we write when your batch is ready, not before.
        </p>

        <div className="wlb-queue" aria-hidden>
          {Array.from({ length: WAITING }).map((_, i) => {
            const opacity = 0.4 + ((i * 7) % 5) * 0.06;
            const size = i % 6 === 2 ? 12 : 10;
            return (
              <span
                className="wlb-dot"
                key={i}
                style={{
                  animationDelay: `${0.45 + i * 0.04}s`,
                  opacity,
                  width: size,
                  height: size,
                }}
              />
            );
          })}
          {done ? <span className="wlb-dot wlb-dot--you" /> : null}
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
          position: relative;
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: clamp(56px, 9vh, 120px) 24px;
          background:
            radial-gradient(130% 90% at 50% 8%, var(--accent-glow) 0%, transparent 52%),
            linear-gradient(180deg, var(--bg-deep) 0%, var(--bg) 62%);
        }
        .wlb-rule {
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.75;
        }
        .wlb-shell {
          width: min(640px, 100%);
          text-align: center;
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
          animation-delay: 0.06s;
        }
        .wlb-lede {
          max-width: 44ch;
          margin: 22px auto 0;
          color: var(--ink-soft);
          font-size: clamp(1rem, 0.96rem + 0.3vw, 1.16rem);
          line-height: 1.6;
          animation-delay: 0.12s;
        }
        .wlb-queue {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 11px;
          margin: 52px auto 0;
          max-width: 430px;
          min-height: 20px;
          animation-delay: 0.18s;
        }
        .wlb-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--ink-quiet);
          transform: translateX(16px) scale(0.5);
          animation: wlb-settle 0.62s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        .wlb-dot--you {
          background: var(--accent);
          opacity: 1 !important;
          width: 15px !important;
          height: 15px !important;
          transform: none;
          animation: wlb-drop 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both,
                     wlb-pulse 2.6s var(--ease-out) 0.6s infinite;
          box-shadow: 0 0 0 0 var(--accent-glow);
        }
        .wlb-queue-label {
          margin: 22px 0 0;
          color: var(--ink-quiet);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation-delay: 0.24s;
        }
        .wlb-form {
          display: flex;
          gap: 8px;
          width: min(468px, 100%);
          margin: 30px auto 0;
          padding: 6px;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--bg-elev);
          box-shadow: var(--shadow-2);
          transition: border-color var(--motion-base) var(--ease-out);
          animation-delay: 0.3s;
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
          background: var(--accent);
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: filter var(--motion-base) var(--ease-out), transform var(--motion-fast) var(--ease-out);
        }
        .wlb-form button:hover { filter: brightness(1.08); }
        .wlb-form button:active { transform: translateY(1px); }
        .wlb-form button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .wlb-echo {
          margin: 30px auto 0;
          color: var(--ink-soft);
          font-size: 15px;
        }
        .wlb-echo strong { color: var(--ink); }
        .wlb-foot {
          margin: 40px 0 0;
          color: var(--ink-faint, var(--ink-quiet));
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation-delay: 0.36s;
        }
        @keyframes wlb-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
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
          .wlb-eyebrow, .wlb-headline, .wlb-lede, .wlb-queue, .wlb-queue-label,
          .wlb-form, .wlb-echo, .wlb-foot { animation: none; opacity: 1; transform: none; }
          .wlb-dot { animation: none; transform: none; }
          .wlb-dot--you { animation: none; }
        }
      `}</style>
    </section>
  );
}
