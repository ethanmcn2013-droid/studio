import { Wordmark } from "@/components/brand/wordmark";

/**
 * Hero section — Studio's opening frame.
 *
 * No cinematic demo, no CTA. Studio is the workshop: it holds the
 * tools, it doesn't sell them from a stage. The wordmark sets the
 * tone; the manifesto line does the rest.
 */
export function Hero() {
  return (
    <section className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      {/* Wordmark — xl settling treatment */}
      <Wordmark size="xl" as="div" />

      {/* Manifesto headline */}
      <h1
        className="mt-8 text-balance font-semibold leading-[1.06] tracking-[-0.03em] text-ink"
        style={{ fontSize: "clamp(1.75rem, 1.2rem + 2.6vw, 3rem)" }}
      >
        Tools made by hand,
        <br />
        for people who don&rsquo;t work in tech.
      </h1>

      {/* Sub-paragraph */}
      <p
        className="mt-5 max-w-[520px] leading-[1.6] text-ink-quiet"
        style={{ fontSize: "clamp(1rem, 0.9rem + 0.4vw, 1.125rem)" }}
      >
        Studio builds focused software — a task manager and a public
        roadmap tool — for the 80% of people the industry keeps building
        around instead of for.
      </p>

      {/* Quiet hairline separator */}
      <div
        className="mt-14 h-px w-12"
        style={{ background: "var(--accent)" }}
        aria-hidden
      />
    </section>
  );
}
