import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { SiteFooter } from "@/components/landing/site-footer";

const ROUTES = [
  {
    href: "/",
    label: "Home",
    detail: "Start from the suite entrance.",
  },
  {
    href: "/design",
    label: "Design",
    detail: "See the dot system behind this page.",
  },
  {
    href: "/waitlist?source=not_found&campaign=pre_access_waitlist&artifact=404_route&touch=site",
    label: "Waitlist",
    detail: "Get access when the next batch opens.",
  },
] as const;

const NOT_FOUND_CSS = `
.nf {
  --nf-stage-size: min(100%, 580px);
}

.nf ::selection {
  background: var(--accent);
  color: var(--paper);
}

.nf-shell {
  min-height: calc(100dvh - var(--nav-h, 56px));
  display: grid;
  align-items: center;
  padding: clamp(56px, 8vw, 96px) 24px clamp(48px, 7vw, 88px);
}

.nf-grid {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 0.86fr) minmax(360px, 1fr);
  gap: clamp(40px, 8vw, 108px);
  align-items: center;
}

.nf-copy {
  max-width: 620px;
}

.nf-kicker,
.nf-label {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.nf-kicker {
  color: var(--accent);
}

.nf-title {
  margin-top: 18px;
  max-width: 9.8ch;
  color: var(--ink);
  font-size: 92px;
  font-weight: 600;
  line-height: 0.98;
  letter-spacing: 0;
  text-wrap: balance;
}

.nf-body {
  margin-top: 24px;
  max-width: 38ch;
  color: var(--ink-soft);
  font-size: 17px;
  line-height: 1.6;
}

.nf-routes {
  margin-top: 36px;
  max-width: 520px;
  border-top: 1px solid var(--hairline);
}

.nf-route {
  display: grid;
  grid-template-columns: minmax(84px, 0.34fr) minmax(0, 1fr);
  gap: 18px;
  min-height: 68px;
  align-items: center;
  border-bottom: 1px solid var(--hairline);
  color: var(--ink);
  text-decoration: none;
  transition:
    color var(--motion-fast) var(--ease-out),
    background var(--motion-fast) var(--ease-out),
    transform var(--motion-fast) var(--ease-out);
}

.nf-route:hover {
  background: color-mix(in srgb, var(--accent) 6%, transparent);
  color: var(--accent-hover);
}

.nf-route:focus-visible {
  outline: 1.5px solid var(--accent);
  outline-offset: 4px;
}

.nf-route:active {
  transform: translateY(1px);
}

.nf-route-name {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0;
}

.nf-route-detail {
  color: var(--ink-faint);
  font-size: 13.5px;
  line-height: 1.45;
}

.nf-stage {
  position: relative;
  width: var(--nf-stage-size);
  margin-left: auto;
  aspect-ratio: 1.02;
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(to right, var(--hairline-soft) 1px, transparent 1px),
    linear-gradient(to bottom, var(--hairline-soft) 1px, transparent 1px),
    var(--paper);
  background-size: 48px 48px;
  box-shadow: var(--shadow-float);
}

.nf-stage::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid color-mix(in srgb, var(--paper) 74%, transparent);
  pointer-events: none;
}

.nf-cap,
.nf-base {
  position: absolute;
  left: clamp(24px, 5vw, 56px);
  right: clamp(24px, 5vw, 56px);
  border-top: 1px dashed color-mix(in srgb, var(--ink) 20%, transparent);
}

.nf-cap {
  top: 25%;
}

.nf-base {
  bottom: 30%;
}

.nf-cap span,
.nf-base span {
  position: absolute;
  right: 0;
  transform: translateY(-140%);
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.nf-number {
  position: absolute;
  left: clamp(24px, 6vw, 64px);
  right: clamp(24px, 6vw, 64px);
  top: 50%;
  transform: translateY(-45%);
  color: var(--ink);
  font-size: 190px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 0.82;
  font-feature-settings: "tnum";
}

.nf-number span {
  display: inline-block;
}

.nf-number span:nth-child(2) {
  color: color-mix(in srgb, var(--ink) 14%, transparent);
}

.nf-dot {
  position: absolute;
  left: 63.5%;
  bottom: calc(30% - 1px);
  width: clamp(16px, 2.3vw, 24px);
  height: clamp(16px, 2.3vw, 24px);
  border-radius: 50%;
  background: var(--accent);
  transform: translateX(-50%);
  transform-origin: 50% 100%;
}

.nf-dot-shadow {
  position: absolute;
  left: 63.5%;
  bottom: calc(30% - 5px);
  width: clamp(20px, 2.8vw, 30px);
  height: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 28%, transparent);
  transform: translateX(-50%);
}

.nf-stage-wordmark {
  position: absolute;
  left: clamp(20px, 4vw, 44px);
  top: clamp(18px, 4vw, 40px);
}

.nf-stage-note {
  position: absolute;
  left: clamp(20px, 4vw, 44px);
  right: clamp(20px, 4vw, 44px);
  bottom: clamp(18px, 4vw, 40px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  color: var(--ink-faint);
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.35;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.nf-stage-note strong {
  color: var(--ink);
  font-weight: 600;
}

@media (prefers-reduced-motion: no-preference) {
  .nf-copy {
    animation: nf-arrive var(--motion-slow) var(--ease-out) 120ms both;
  }

  .nf-stage {
    animation: nf-arrive var(--motion-slow) var(--ease-out) 260ms both;
  }

  .nf-dot {
    animation: nf-dot-land 1.25s linear 680ms both;
  }

  .nf-dot-shadow {
    animation: nf-dot-shadow 1.25s linear 680ms both;
  }
}

@keyframes nf-arrive {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes nf-dot-land {
  0% {
    opacity: 0;
    transform: translate(-50%, -170px) scale(0.94, 1.1);
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4); /* ds-allow, dot landing choreography from /design */
  }
  7% {
    opacity: 1;
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4); /* ds-allow, dot landing choreography from /design */
  }
  44% {
    transform: translate(-50%, 0) scale(1.46, 0.54);
    animation-timing-function: cubic-bezier(0.15, 0.6, 0.3, 1); /* ds-allow, dot landing choreography from /design */
  }
  58% {
    transform: translate(-50%, -18px) scale(0.9, 1.12);
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.45); /* ds-allow, dot landing choreography from /design */
  }
  70% {
    transform: translate(-50%, 0) scale(1.18, 0.84);
    animation-timing-function: cubic-bezier(0.25, 0.5, 0.4, 1); /* ds-allow, dot landing choreography from /design */
  }
  83% {
    transform: translate(-50%, -5px) scale(0.97, 1.04);
    animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.45); /* ds-allow, dot landing choreography from /design */
  }
  100% {
    opacity: 1;
    transform: translate(-50%, 0) scale(1, 1);
  }
}

@keyframes nf-dot-shadow {
  0% {
    opacity: 0;
    transform: translateX(-50%) scaleX(0.44);
  }
  44% {
    opacity: 0.62;
    transform: translateX(-50%) scaleX(1.5);
  }
  58% {
    opacity: 0.34;
    transform: translateX(-50%) scaleX(0.76);
  }
  70% {
    opacity: 0.52;
    transform: translateX(-50%) scaleX(1.18);
  }
  100% {
    opacity: 0.42;
    transform: translateX(-50%) scaleX(1);
  }
}

@media (max-width: 900px) {
  .nf-shell {
    padding-top: 48px;
  }

  .nf-grid {
    grid-template-columns: 1fr;
    gap: 44px;
  }

  .nf-copy {
    max-width: 680px;
  }

  .nf-title {
    max-width: 10.8ch;
    font-size: 72px;
  }

  .nf-stage {
    margin: 0;
    width: 100%;
  }
}

@media (max-width: 560px) {
  .nf-shell {
    padding-left: 18px;
    padding-right: 18px;
  }

  .nf-title {
    font-size: 52px;
  }

  .nf-body {
    font-size: 15px;
  }

  .nf-route {
    grid-template-columns: 1fr;
    gap: 6px;
    align-items: start;
    padding: 16px 0;
  }

  .nf-stage {
    aspect-ratio: 0.9;
    background-size: 36px 36px;
  }

  .nf-number {
    font-size: 112px;
  }

  .nf-stage-note {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nf-copy,
  .nf-stage,
  .nf-dot,
  .nf-dot-shadow {
    animation: none !important;
  }
}
`;

/**
 * 404, built from the /design page grammar: baseline, cap height,
 * one indigo dot, and routes that get the reader unstuck.
 */
export default function NotFound() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NOT_FOUND_CSS }} />
      <main id="main" tabIndex={-1} className="nf flex flex-1 flex-col">
        <section className="nf-shell" aria-labelledby="not-found-title">
          <div className="nf-grid">
            <div className="nf-copy">
              <div className="nf-kicker">404</div>
              <h1 id="not-found-title" className="nf-title">
                This page is not here.
              </h1>
              <p className="nf-body">
                Start at Signal Studio, see the design system, or join the
                waitlist for the next access batch.
              </p>

              <nav className="nf-routes" aria-label="Helpful routes">
                {ROUTES.map((route) => (
                  <Link key={route.href} href={route.href} className="nf-route">
                    <span className="nf-route-name">{route.label}</span>
                    <span className="nf-route-detail">{route.detail}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="nf-stage" aria-hidden="true">
              <div className="nf-stage-wordmark">
                <Wordmark kind="studio" size="md" animate={false} />
              </div>
              <div className="nf-cap">
                <span>cap height</span>
              </div>
              <div className="nf-base">
                <span>baseline</span>
              </div>
              <div className="nf-number" aria-hidden="true">
                <span>4</span>
                <span>0</span>
                <span>4</span>
              </div>
              <span className="nf-dot-shadow" />
              <span className="nf-dot" />
              <div className="nf-stage-note">
                <span>Page missing.</span>
                <strong>Signal Studio is still here.</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
