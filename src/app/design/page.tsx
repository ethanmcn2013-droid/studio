import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/landing/site-footer";
import { MotionSpecimen } from "@/components/brand/motion-specimen";
import { ReadingProgress } from "@/components/reading-progress";

export const metadata: Metadata = {
  title: "Design — Signal Studio",
  description:
    "The physical and moving side of Signal Studio — cards, posters, social pieces, and the motion system. The products launch in September. The standard is already here.",
  openGraph: {
    title: "Design — Signal Studio",
    description: "The products launch in September. The standard is already here.",
    type: "website",
  },
};

/* ── The squish-bounce dot ──────────────────────────────────────────
   Carried over from the documents.signalstudio.ie cover slide (parity
   with plan.signalstudio.ie). Same physics, scaled to page chrome:
   idle breathe → anticipation squat → takeoff stretch → apex hang →
   accelerating fall → maximum squash → three decaying rebounds →
   jelly settle. Squash and stretch conserve volume (x·y ≈ 1).
   Indigo rides var(--accent); no literals, ds-check stays clean. */
const SQUISH_CSS = `
.dsq-origin {
  position: absolute;
  top: 16px;
  right: clamp(24px, 6vw, 96px);
  width: 48px;
  height: 168px;
  pointer-events: none;
  z-index: 1;
}
.dsq-dot {
  position: absolute;
  left: 50%;
  bottom: 8px;
  width: 28px;
  height: 28px;
  margin-left: -14px;
  border-radius: 50%;
  background: var(--accent);
  transform-origin: 50% 100%;
  animation: dsq-bounce 4.2s linear infinite;
  will-change: transform;
}
.dsq-shadow {
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 30px;
  height: 4px;
  margin-left: -15px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--accent) 35%, transparent);
  transform-origin: 50% 50%;
  animation: dsq-shadow 4.2s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .dsq-dot, .dsq-shadow { animation: none; }
}
@keyframes dsq-bounce {
  0%    { transform: translateY(0)     scale(1, 1);         animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  7%    { transform: translateY(0)     scale(1.045, 0.965); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  14%   { transform: translateY(0)     scale(0.99, 1.01);   animation-timing-function: cubic-bezier(0.5, 0, 0.7, 0.2); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  20%   { transform: translateY(0)     scale(1.45, 0.55);   animation-timing-function: cubic-bezier(0.15, 0.7, 0.3, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  24%   { transform: translateY(-29px)  scale(0.70, 1.42);  animation-timing-function: cubic-bezier(0.2, 0.6, 0.45, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  36%   { transform: translateY(-88px)  scale(0.95, 1.07);  animation-timing-function: cubic-bezier(0.35, 0.6, 0.6, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  43%   { transform: translateY(-97px)  scale(1.05, 0.96);  animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.3); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  52%   { transform: translateY(-23px)  scale(0.76, 1.34);  animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  55%   { transform: translateY(0)     scale(1.65, 0.42);   animation-timing-function: cubic-bezier(0.15, 0.6, 0.3, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  58.5% { transform: translateY(-19px)  scale(0.84, 1.22);  animation-timing-function: cubic-bezier(0.3, 0.55, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  65%   { transform: translateY(-41px)  scale(0.99, 1.03);  animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  72%   { transform: translateY(-5px)   scale(0.85, 1.19);  animation-timing-function: cubic-bezier(0.4, 0, 0.4, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  74%   { transform: translateY(0)     scale(1.36, 0.66);   animation-timing-function: cubic-bezier(0.25, 0.5, 0.4, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  78%   { transform: translateY(-10px)  scale(0.95, 1.07);  animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.45); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  82%   { transform: translateY(0)     scale(1.17, 0.85);   animation-timing-function: cubic-bezier(0.3, 0.5, 0.5, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  86%   { transform: translateY(0)     scale(0.93, 1.075);  animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  90%   { transform: translateY(0)     scale(1.05, 0.955);  animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  93.5% { transform: translateY(0)     scale(0.975, 1.025); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  96.5% { transform: translateY(0)     scale(1.012, 0.99);  animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  100%  { transform: translateY(0)     scale(1, 1); }
}
@keyframes dsq-shadow {
  0%    { transform: scale(1, 1);    opacity: 0.50; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  7%    { transform: scale(1.05, 1); opacity: 0.52; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  14%   { transform: scale(1, 1);    opacity: 0.50; animation-timing-function: cubic-bezier(0.5, 0, 0.7, 0.2); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  20%   { transform: scale(1.48, 1); opacity: 0.62; animation-timing-function: cubic-bezier(0.2, 0.6, 0.45, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  24%   { transform: scale(0.78, 1); opacity: 0.30; animation-timing-function: cubic-bezier(0.35, 0.6, 0.6, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  36%   { transform: scale(0.44, 1); opacity: 0.13; animation-timing-function: cubic-bezier(0.5, 0, 0.8, 0.3); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  43%   { transform: scale(0.40, 1); opacity: 0.10; animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  52%   { transform: scale(0.80, 1); opacity: 0.33; animation-timing-function: cubic-bezier(0.15, 0.6, 0.3, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  55%   { transform: scale(1.62, 1); opacity: 0.62; animation-timing-function: cubic-bezier(0.3, 0.55, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  58.5% { transform: scale(0.90, 1); opacity: 0.38; animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.4); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  65%   { transform: scale(0.64, 1); opacity: 0.20; animation-timing-function: cubic-bezier(0.4, 0, 0.4, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  74%   { transform: scale(1.32, 1); opacity: 0.56; animation-timing-function: cubic-bezier(0.55, 0, 0.85, 0.45); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  78%   { transform: scale(0.94, 1); opacity: 0.40; animation-timing-function: cubic-bezier(0.3, 0.5, 0.5, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  82%   { transform: scale(1.15, 1); opacity: 0.50; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); } /* ds-allow — squish-bounce choreography, documents-deck parity */
  100%  { transform: scale(1, 1);    opacity: 0.50; }
}
`;

/* Motion canon — same five gestures the brand system ratified
   (DESIGN.md §5). House first, then workflow order. */
const MOTIONS: Array<{
  code: string;
  kind: "studio" | "tasks" | "timeline" | "signal" | "notes";
  name: string;
  cycle: string;
}> = [
  { code: "M·01", kind: "studio", name: "broadcast", cycle: "once" },
  { code: "M·02", kind: "notes", name: "caret", cycle: "1.1s" },
  { code: "M·03", kind: "tasks", name: "pulse", cycle: "2.6s" },
  { code: "M·04", kind: "timeline", name: "sweep", cycle: "5.4s" },
  { code: "M·05", kind: "signal", name: "tick", cycle: "3.6s" },
];

const C = "/brand/collateral";

/* First six of the approved posting queue (founder-approved 2026-07-02,
   /hq/socials). Deck-locked images; order preserved. */
const SOCIAL: Array<{ src: string; alt: string }> = [
  { src: `${C}/social/s2-belief-b00-ig-square.png`, alt: "Social post — a belief statement, white type on black" },
  { src: `${C}/social/s1-number-n01-ig-square.png`, alt: "Social post — one large number with a one-line claim" },
  { src: `${C}/social/s3-beforeafter-schedule-ig-square.png`, alt: "Social post — a messy schedule beside a clear one" },
  { src: `${C}/social/s2-belief-b03-ig-square.png`, alt: "Social post — a belief statement, indigo emphasis" },
  { src: `${C}/social/s5-foundernote-quote01-ig-square.png`, alt: "Social post — a short founder note, set like a letter" },
  { src: `${C}/social/s1-number-n02-ig-square.png`, alt: "Social post — one large number with a one-line claim" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-6 text-[11px] font-semibold uppercase"
      style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
    >
      {children}
    </div>
  );
}

function SpecLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-quiet">
      {children}
    </p>
  );
}

function Frame({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1240px) 50vw, 400px"
        className="h-auto w-full"
      />
    </div>
  );
}

export default function DesignPage() {
  return (
    <>
      <ReadingProgress />
      <style dangerouslySetInnerHTML={{ __html: SQUISH_CSS }} />
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        {/* ── Statement ─────────────────────────────────────────── */}
        <section className="relative mx-auto w-full max-w-[1240px] px-6 pb-10 pt-16 md:pt-24">
          <div aria-hidden className="dsq-origin hidden sm:block">
            <span className="dsq-dot" />
            <span className="dsq-shadow" />
          </div>

          <div className="max-w-[760px]">
            <Eyebrow>Design</Eyebrow>
            <h1 className="text-balance text-[clamp(34px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
              The products launch in September. The standard is already here.
            </h1>
            <p className="mt-6 max-w-[52ch] text-[16.5px] leading-relaxed text-ink-soft">
              Everything Signal Studio puts into the world gets the same care —
              a business card, a poster, a loading dot. You can judge us on
              this page before you can judge us on the software.
            </p>
          </div>
        </section>

        {/* ── Cards ─────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1240px] px-6 py-14 md:py-20">
          <div className="max-w-[760px]">
            <Eyebrow>Cards</Eyebrow>
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.015em] text-ink">
              Three cards. One decision each.
            </h2>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">
              The trio going to print — Ink, Indigo, and Duo. Black carries the
              name, indigo carries the point, the QR carries you to the site.
              Nothing else earned a place.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Frame src={`${C}/cards/cardx-ink-front-preview.png`} alt="Business card, Ink — signal studio wordmark on black" width={748} height={522} priority />
            <Frame src={`${C}/cards/cardx-indigo-front-preview.png`} alt="Business card, Indigo — wordmark on indigo" width={748} height={522} />
            <Frame src={`${C}/cards/cardx-duo-front-preview.png`} alt="Business card, Duo — split black and indigo face" width={748} height={522} />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
            <Frame src={`${C}/cards/cardx-ink-back-preview.png`} alt="Business card reverse — QR code, lower right" width={748} height={522} />
            <Frame src={`${C}/identity/founder-card-front-preview.png`} alt="Founder card front — name and title" width={748} height={522} />
            <Frame src={`${C}/identity/founder-card-back-preview.png`} alt="Founder card reverse — QR to the site" width={748} height={522} />
          </div>

          <SpecLine>350–400gsm uncoated · rich black · PMS 2726C · proof order packaged</SpecLine>
        </section>

        {/* ── Print ─────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1240px] px-6 py-14 md:py-20">
          <div className="max-w-[760px]">
            <Eyebrow>Print</Eyebrow>
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.015em] text-ink">
              Made to sit on a café counter, not in a deck.
            </h2>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">
              The chosen pieces: the Campaign café card and the Ink poster.
              A5 and A2, black almost everywhere, one sentence doing the work.
            </p>
          </div>

          <div className="mt-10 grid items-start gap-5 md:grid-cols-[2fr_3fr]">
            <Frame
              src={`${C}/identity/cafe-card-preview.png`}
              alt="Café card, Campaign — “Calm coordination, built in Limerick.” on black with QR"
              width={900}
              height={1224}
            />
            <Frame
              src={`${C}/identity/campaign-poster-preview.png`}
              alt="Poster, Ink — “Most projects never get called one.” in white and indigo on black"
              width={3280}
              height={4596}
            />
          </div>

          <SpecLine>café card A5 · poster A2 · signalstudio.ie QR on every piece</SpecLine>
        </section>

        {/* ── Social ────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1240px] px-6 py-14 md:py-20">
          <div className="max-w-[760px]">
            <Eyebrow>Social</Eyebrow>
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.015em] text-ink">
              Two posts a week. Every one approved before it exists in public.
            </h2>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">
              From the six-week opening queue: numbers, beliefs, before-and-afters,
              and a founder note. Type on black, no stock photography, alt text
              on every image.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3">
            {SOCIAL.map((post) => (
              <Frame key={post.src} src={post.src} alt={post.alt} width={1080} height={1080} />
            ))}
          </div>
        </section>

        {/* ── Motion ────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1240px] px-6 py-14 md:py-20">
          <div className="max-w-[760px]">
            <Eyebrow>Motion</Eyebrow>
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.015em] text-ink">
              Five wordmarks, five gestures. Nothing moves without a reason.
            </h2>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">
              Each product gets exactly one motion — hover a cell to replay it,
              click to freeze it. This is the entire animation vocabulary of the
              suite. The restraint is the design.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] sm:grid-cols-3 md:grid-cols-5">
            {MOTIONS.map((m) => (
              <MotionSpecimen key={m.code} kind={m.kind} name={m.name} cycle={m.cycle} />
            ))}
          </div>
        </section>

        {/* ── Endcap ────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1240px] px-6 pb-8 pt-14 md:pt-20">
          <div className="max-w-[760px]">
            <p className="text-[16.5px] leading-relaxed text-ink-soft">
              The software this page is dressed for arrives 1 September 2026.
            </p>
            <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-quiet">
              hello@signalstudio.ie
            </p>
          </div>
        </section>

        <SiteFooter />
      </main>
    </>
  );
}
