"use client";

/**
 * The public waitlist, "The Line". On-system: flat paper, hairlines, no
 * gradients or glow, accent spent on three marks (tick rule, headline
 * period, your dot). Wired to the real joinWaitlistAction: on success your
 * accent dot arrives at the back of the line and the form gives way to a
 * held-place line. Honeypot + tracking fields ride along hidden.
 */

import { useActionState } from "react";
import { joinWaitlistAction } from "./actions";
import { initialWaitlistFormState } from "./types";

const WAITING = 16;

type Props = {
  source: string;
  campaign: string;
  audience?: string;
  artifact?: string;
  touch: string;
  path: string;
};

export function WaitlistLine(props: Props) {
  const [state, formAction, pending] = useActionState(
    joinWaitlistAction,
    initialWaitlistFormState,
  );
  const done = state.status === "success";

  return (
    <section className="wl">
      <div className="wl-shell">
        <div className="wl-rule" aria-hidden />
        <p className="wl-eyebrow">The line</p>

        <h1 className="wl-headline" aria-label="Join the line.">
          Join the line<span className="wl-headline-dot" aria-hidden />
        </h1>
        <p className="wl-lede">
          Signal Studio opens in small batches from 1 September. Add your name and
          we write when your batch is ready, not before.
        </p>

        <div className="wl-queue" aria-hidden>
          <span className="wl-line">
            {Array.from({ length: WAITING }).map((_, i) => {
              const tint = 38 + ((i * 7) % 5) * 9;
              const size = i % 6 === 2 ? 11 : 9;
              return (
                <span
                  className="wl-dot"
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
            {done ? <span className="wl-dot wl-dot--you" /> : null}
          </span>
        </div>
        <p className="wl-queue-label">
          {done ? "You are in the line." : "A quiet line, already forming."}
        </p>

        {done ? (
          <p className="wl-echo" role="status">
            {state.message}
          </p>
        ) : (
          <form className="wl-form" action={formAction}>
            <input type="hidden" name="source" value={props.source} />
            <input type="hidden" name="campaign" value={props.campaign} />
            <input type="hidden" name="audience" value={props.audience ?? ""} />
            <input type="hidden" name="artifact" value={props.artifact ?? ""} />
            <input type="hidden" name="touch" value={props.touch} />
            <input type="hidden" name="path" value={props.path} />
            {/* honeypot: real people leave it blank */}
            <input
              className="wl-pot"
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              aria-label="Email"
            />
            <button type="submit" disabled={pending}>
              {pending ? "Holding" : "Hold my place"}
            </button>
          </form>
        )}

        {state.status === "error" ? (
          <p className="wl-error" role="alert">
            {state.message}
          </p>
        ) : null}

        <p className="wl-foot">No newsletter. No noise. Just the access window.</p>
      </div>

      <style>{`
        .wl {
          min-height: calc(100dvh - 56px);
          display: grid;
          place-items: center;
          padding: clamp(56px, 9vh, 120px) 24px;
          background: var(--bg);
        }
        .wl-shell { width: min(600px, 100%); text-align: center; }
        .wl-rule { width: 132px; height: 1px; margin: 0 auto 30px; background: var(--accent); }
        .wl-eyebrow,
        .wl-headline,
        .wl-lede,
        .wl-queue,
        .wl-queue-label,
        .wl-form,
        .wl-echo,
        .wl-foot { animation: wl-in 0.7s var(--ease-out) both; }
        .wl-eyebrow {
          margin: 0 0 24px;
          color: var(--ink-quiet);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .wl-headline {
          margin: 0;
          color: var(--ink);
          font-size: clamp(2.9rem, 7.4vw, 5.25rem);
          font-weight: 600;
          letter-spacing: -0.045em;
          line-height: 0.96;
          animation-delay: 0.06s;
        }
        .wl-headline-dot {
          display: inline-block;
          width: 0.2em;
          height: 0.2em;
          margin-left: 0.04em;
          border-radius: 50%;
          background: var(--accent);
          vertical-align: baseline;
          transform: translateY(-0.02em) scale(0);
          animation: wl-dot-in 0.5s var(--ease-out) 0.5s both;
        }
        .wl-lede {
          max-width: 44ch;
          margin: 24px auto 0;
          color: var(--ink-soft);
          font-size: clamp(1rem, 0.96rem + 0.3vw, 1.16rem);
          line-height: 1.62;
          animation-delay: 0.12s;
        }
        .wl-queue { display: flex; justify-content: center; margin: 54px auto 0; min-height: 16px; animation-delay: 0.2s; }
        .wl-line { position: relative; display: inline-flex; align-items: center; gap: 13px; padding-right: 2px; }
        .wl-line::before {
          content: "";
          position: absolute;
          left: 0; right: -26px; top: 50%;
          height: 1px;
          background: var(--border);
          transform: translateY(-50%);
          z-index: 0;
        }
        .wl-dot {
          position: relative;
          z-index: 1;
          width: 9px; height: 9px;
          border-radius: 50%;
          background: var(--ink-quiet);
          transform: translateX(18px) scale(0.4);
          animation: wl-settle 0.62s cubic-bezier(0.2, 0.7, 0.2, 1) both; /* ds-allow - waitlist dot choreography */
        }
        .wl-dot--you {
          background: var(--accent) !important;
          width: 13px !important; height: 13px !important;
          transform: translateX(20px) scale(0.4);
          animation: wl-arrive 0.62s cubic-bezier(0.2, 0.7, 0.2, 1) both; /* ds-allow - waitlist dot choreography */
        }
        .wl-dot--you::before {
          content: "";
          position: absolute;
          inset: -6px;
          border: 1.5px solid var(--accent);
          border-radius: 50%;
          opacity: 0;
          transform: scale(0.7);
          animation: wl-emit 2.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s infinite; /* ds-allow - waitlist dot choreography */
        }
        .wl-queue-label {
          margin: 24px 0 0;
          color: var(--ink-quiet);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation-delay: 0.26s;
        }
        .wl-form {
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
        .wl-form:focus-within { border-color: var(--accent); }
        .wl-form input[type="email"] {
          flex: 1; min-width: 0; height: 44px;
          padding: 0 8px 0 16px;
          border: 0; background: transparent;
          color: var(--ink); font: inherit; font-size: 15px; outline: none;
        }
        .wl-form input::placeholder { color: var(--ink-faint, var(--ink-quiet)); }
        .wl-form button {
          flex-shrink: 0; height: 44px; padding: 0 22px;
          border: 0; border-radius: 999px;
          background: var(--ink); color: var(--bg-elev);
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: opacity var(--motion-base) var(--ease-out), transform var(--motion-fast) var(--ease-out);
        }
        .wl-form button:hover { opacity: 0.9; }
        .wl-form button:active { transform: translateY(1px); }
        .wl-form button:disabled { cursor: wait; opacity: 0.7; }
        .wl-form input:focus-visible,
        .wl-form button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .wl-pot { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
        .wl-echo { margin: 32px auto 0; color: var(--ink-soft); font-size: 15px; }
        .wl-error { margin: 16px auto 0; color: var(--danger, var(--status-blocked)); font-size: 13px; }
        .wl-foot {
          margin: 44px 0 0;
          color: var(--ink-faint, var(--ink-quiet));
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation-delay: 0.38s;
        }
        @keyframes wl-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wl-dot-in { from { transform: translateY(-0.02em) scale(0); } to { transform: translateY(-0.02em) scale(1); } }
        @keyframes wl-settle { to { transform: translateX(0) scale(1); } }
        @keyframes wl-arrive { from { transform: translateX(20px) scale(0.4); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
        @keyframes wl-emit { 0%, 55% { opacity: 0; transform: scale(0.7); } 65% { opacity: 0.85; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
        @media (max-width: 520px) {
          .wl-line { gap: 10px; }
          .wl-form { flex-wrap: wrap; border-radius: 16px; }
          .wl-form button { width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wl-eyebrow, .wl-headline, .wl-lede, .wl-queue, .wl-queue-label,
          .wl-form, .wl-echo, .wl-foot { animation: none; opacity: 1; transform: none; }
          .wl-headline-dot { animation: none; transform: translateY(-0.02em) scale(1); }
          .wl-dot { animation: none; transform: none; }
          .wl-dot--you { animation: none; transform: none; }
          .wl-dot--you::before { animation: none; }
        }
      `}</style>
    </section>
  );
}
