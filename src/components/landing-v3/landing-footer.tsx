"use client";

/**
 * The home page footer. Hand-placed, not from the canvas port: landing-v3.tsx renders it in place
 * of the ported footer, so keep it on re-port.
 *
 * It closes on a sign-off and the page's one action, then the links, then the company's name set
 * as large as the page is wide. Its full stop is Dot. The server draws that full stop as the
 * approved rest pose (a true circle, two capsule eyes) at period size on the baseline, so without
 * scripting, and under reduced motion before anything loads, the wordmark is complete. As the
 * footer comes near, the Dot engine loads (a dynamic import, so the page's first load does not
 * carry it) and takes the full stop over in place: see src/lib/dot-engine/footer.ts.
 */
import React, { useEffect, useRef } from "react";
import "./landing-footer.css";

const LABEL = "Dot, the Signal Studio mascot. Poke Dot.";

export function LandingFooter({ landingOnly = false }: { landingOnly?: boolean }) {
  const footer = useRef<HTMLElement>(null);
  const stop = useRef<HTMLSpanElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const live = useRef<HTMLParagraphElement>(null);
  const base = useRef<HTMLDivElement>(null);
  const studio = useRef<HTMLSpanElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = footer.current;
    if (!host || typeof IntersectionObserver === "undefined") return;
    let stopDot: (() => void) | undefined, cancelled = false;
    // Nothing loads until the footer is within about a screen of the viewport.
    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      near.disconnect();
      import("@/lib/dot-engine/footer")
        .then(({ startFooterDot }) => {
          if (cancelled || !stop.current || !button.current || !live.current || !base.current || !studio.current || !mark.current) return;
          stopDot = startFooterDot({ host, stop: stop.current, button: button.current, live: live.current, ground: base.current, studio: studio.current, mark: mark.current });
        })
        .catch(() => {
          // The full stop the server drew stays: the wordmark never reads without it.
        });
    }, { rootMargin: "900px 0px" });
    near.observe(host);
    return () => { cancelled = true; near.disconnect(); stopDot?.(); };
  }, []);

  return (
    <footer className="lf" ref={footer}>
      <div className="wrap lf-wrap">
        <div className="lf-sign">
          <p className="lf-line">Everything important. <span>Nothing distracting.</span></p>
          <a href="#waitlist" className="btn btn-solid lf-cta">Join the waitlist</a>
        </div>
        <nav className="lf-cols" aria-label="Footer">
          <div className="lf-col">
            <h2 className="lf-h">Product</h2>
            <ul>
              <li><a href="#timeline">Timeline</a></li>
              <li><a href="#analytics">Analytics</a></li>
              <li><a href="#files">Files</a></li>
              <li><a href="#chat">Chat</a></li>
            </ul>
          </div>
          <div className="lf-col">
            <h2 className="lf-h">Company</h2>
            <ul>
              <li><a href="#venues">For venues</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#waitlist">Join the waitlist</a></li>
            </ul>
          </div>
          <div className="lf-col">
            <h2 className="lf-h">Contact</h2>
            <ul>
              <li><a href="mailto:hello@signalstudio.ie">hello@signalstudio.ie</a></li>
            </ul>
            <p className="lf-meta">Limerick, Ireland</p>
          </div>
        </nav>
        <div className="lf-mark" ref={mark}>
          {/* One accessible text, "signal studio", then Dot as a button. The full stop is Dot. */}
          <p className="lf-word" translate="no">
            signal <span ref={studio}>studio</span>
            <span className="lf-stop" ref={stop}>
              <button type="button" className="lf-dot" ref={button} aria-label={LABEL} />
              <svg className="lf-still" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">
                <circle className="lf-still-body" r="50" />
                <rect className="lf-still-eye" x="-18.52" y="-27.2" width="12.24" height="26.4" rx="6.12" />
                <rect className="lf-still-eye" x="6.64" y="-27.6" width="11.52" height="25.2" rx="5.76" />
              </svg>
            </span>
          </p>
        </div>
        <div className="lf-base" ref={base}>
          <p className="lf-legal">© 2026 Signal Studio Limited. Registered in Ireland, <span className="nw">CRO&nbsp;823488</span>.</p>
          <p className="lf-links">
            {landingOnly ? null : <a href="/privacy">Privacy</a>}
            {landingOnly ? null : <a href="/terms">Terms</a>}
            <a href="#top">Back to top</a>
          </p>
        </div>
        <p className="sr lf-live" ref={live} role="status" aria-live="polite" />
      </div>
    </footer>
  );
}
