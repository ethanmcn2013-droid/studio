import "./founding-certificate.css";
import type { FoundingCertificate } from "@/lib/founding-certificate";

/**
 * E12.11 — the Founding Venue certificate, rendered.
 *
 * A plain server component. No script, so nothing on the artefact can measure
 * a reader, and the number cannot be edited in the browser and printed.
 *
 * ── The refusal is rendered, not hidden ─────────────────────────────────
 * When `buildFoundingCertificate` refuses, this component prints the reason
 * rather than an empty frame. A blank certificate is worse than no
 * certificate: a blank number field invites somebody to write one in, and a
 * number written in by hand is a number that was not assigned by the register.
 * That is the exact failure D-027 point 2 exists to prevent, and it is why the
 * refusal has a visual treatment at all.
 *
 * ── What this render deliberately does not decide ───────────────────────
 * The visual language. The hierarchy is fixed here because it is a
 * correctness question: the number is the hero, the statement of fact sits
 * under it, the record block is a list, and the terms are the smallest type on
 * the page but they are on the page. Stock, colour, frame, foil, whether the
 * number is set in mono or in a numeral face, and whether this is A4 or a
 * smaller desk object are founder-taste calls raised in the packet.
 *
 * Every string comes from `src/lib/founding-certificate.ts`.
 */

export function FoundingCertificateSheet({
  certificate,
  className = "",
  headingLevel = 1,
}: {
  certificate: FoundingCertificate;
  className?: string;
  /** 1 when the certificate is the page. 2 when it sits inside a composer. */
  headingLevel?: 1 | 2;
}) {
  const Title = headingLevel === 1 ? "h1" : "h2";

  if (certificate.state === "refused") {
    return (
      <div
        className={`founding-certificate mx-auto w-full max-w-[760px] rounded-lg border border-border bg-bg-deep px-8 py-10 text-ink ${className}`}
        role="status"
      >
        <p
          className="mb-3 font-mono text-[11px] uppercase text-ink-quiet"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          No certificate
        </p>
        <Title className="text-[clamp(1.3rem,1.1rem+0.8vw,1.7rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink">
          There is nothing to issue yet.
        </Title>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.62] text-ink-soft">
          {certificate.reason}.
        </p>
        <p className="mt-4 max-w-[52ch] text-[14px] leading-[1.62] text-ink-quiet">
          The number is assigned by the register when the first payment clears.
          Nothing here writes one, and there is no blank to fill in by hand.
        </p>
      </div>
    );
  }

  return (
    <article
      className={`founding-certificate mx-auto w-full max-w-[760px] rounded-lg border border-border-soft bg-bg-elev px-10 py-14 text-ink sm:px-16 sm:py-20 ${className}`}
      aria-labelledby="founding-certificate-title"
    >
      <header className="text-center">
        <p
          className="mb-8 font-mono text-[11px] uppercase text-ink-quiet"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          Signal Studio · Founding 25
        </p>
        <p
          className="founding-certificate-number font-mono text-[clamp(3rem,2rem+6vw,5.5rem)] font-medium leading-none tracking-[-0.04em] text-ink"
          aria-hidden="true"
        >
          {certificate.number}
        </p>
        <Title
          id="founding-certificate-title"
          className="mx-auto mt-10 max-w-[34ch] text-[clamp(1.15rem,1rem+0.7vw,1.5rem)] font-semibold leading-[1.35] tracking-[-0.02em] text-ink"
        >
          {certificate.statement}
        </Title>
      </header>

      <dl className="mx-auto mt-12 grid max-w-[36rem] grid-cols-1 gap-x-8 gap-y-3 border-t border-border-soft pt-8 sm:grid-cols-[10rem_1fr]">
        {certificate.record.map((line) => (
          <div key={line.label} className="contents">
            <dt
              className="font-mono text-[11px] uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              {line.label}
            </dt>
            <dd className="mb-2 text-[15px] leading-[1.5] text-ink sm:mb-0">
              {line.value}
            </dd>
          </div>
        ))}
      </dl>

      <section
        className="founding-certificate-terms mx-auto mt-12 max-w-[36rem] space-y-2 border-t border-border-soft pt-6"
        aria-label="The founding rate and what holds it"
      >
        {certificate.terms.map((line) => (
          <p key={line} className="text-[12px] leading-[1.6] text-ink-soft">
            {line}
          </p>
        ))}
      </section>

      <footer className="mt-10 text-center">
        <p className="font-mono text-[11px] text-ink-quiet">
          {certificate.signature}
        </p>
      </footer>
    </article>
  );
}
