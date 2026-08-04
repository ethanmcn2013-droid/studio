import "./venue-kit-print.css";
import {
  buildWelcomeCard,
  buildWelcomeEmail,
  ONBOARDING_STEPS,
  welcomeSlotsState,
  type CoupleWelcomeSlots,
} from "@/lib/couple-welcome-kit";

/**
 * E12.13 — the post-booking couple welcome kit, rendered.
 *
 * Three things on one surface, and the order matters:
 *   1. The printed welcome object, which is couple-facing. It sits first,
 *      alone on its own printed page, and it is the only part of this document
 *      a couple ever sees.
 *   2. The email wording, which the venue pastes into its own mail.
 *   3. The onboarding sequence, which is venue-facing and states which steps
 *      are built, which are done by hand today, and which do not exist.
 *
 * A plain server component, no script.
 *
 * ── The state badges are load-bearing, not decoration ───────────────────
 * D-016 requires any capability not yet built to be stated as not yet built.
 * The sequence carries `built`, `by hand` and `not built` on every step, so a
 * coordinator reading it learns what actually happens rather than what was
 * planned. The last step is `not built` and that is deliberate: the Keepsake
 * is decided and does not exist, and hiding that row is how a venue ends up
 * promising it to a couple.
 *
 * Every string comes from `src/lib/couple-welcome-kit.ts`.
 */

const STATE_LABEL: Record<string, string> = {
  built: "Built",
  manual: "By hand",
  "not-built": "Not built",
};

const ACTOR_LABEL: Record<string, string> = {
  venue: "You",
  couple: "The couple",
  "signal-studio": "Signal Studio",
};

export function CoupleWelcomeKitSheet({
  slots,
  className = "",
}: {
  slots: CoupleWelcomeSlots;
  className?: string;
}) {
  const card = buildWelcomeCard(slots);
  const email = buildWelcomeEmail(slots);
  const { filled, missing } = welcomeSlotsState(slots);

  return (
    <article
      className={`venue-kit-sheet mx-auto w-full max-w-[820px] bg-bg-elev px-8 py-10 text-ink sm:px-12 sm:py-14 ${className}`}
      aria-labelledby="couple-welcome-title"
    >
      <header className="border-b border-border-soft pb-6">
        <p
          className="mb-3 font-mono text-[11px] uppercase text-ink-quiet"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          Signal Studio · Founding 25 · after a couple books
        </p>
        <h1
          id="couple-welcome-title"
          className="text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink"
        >
          The welcome kit.
        </h1>
        <p className="mt-3 max-w-[62ch] text-[14px] leading-[1.6] text-ink-soft">
          A card you can print, an email you can send, and what actually happens
          after you send it.
        </p>
      </header>

      {!filled && (
        <p
          className="mt-6 rounded-md border border-border bg-bg-deep px-4 py-3 text-[13px] leading-[1.6] text-ink-soft print:hidden"
          role="status"
        >
          Not ready to send. Still to fill: {missing.join(", ")}. A card handed
          over with a placeholder on it is a card that says nobody checked.
        </p>
      )}

      {/* ── 1 · The printed card ─────────────────────────────────────── */}
      <section className="mt-10" aria-labelledby="welcome-card-heading">
        <h2
          id="welcome-card-heading"
          className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-quiet print:hidden"
        >
          The card · print at A5, one side
        </h2>

        <div className="venue-kit-card mt-4 rounded-lg border border-border-soft px-8 py-10 sm:px-10 sm:py-12">
          <p
            className="font-mono text-[11px] uppercase text-ink-quiet"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            {card.attribution}
          </p>
          <p className="mt-6 max-w-[24ch] text-[clamp(1.4rem,1.2rem+1vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            {card.headline}
          </p>
          <div className="mt-6 max-w-[52ch] space-y-3">
            {card.body.map((line) => (
              <p key={line} className="text-[15px] leading-[1.62] text-ink-soft">
                {line}
              </p>
            ))}
          </div>
          <ol className="mt-8 max-w-[52ch] list-decimal space-y-1.5 pl-5 text-[15px] leading-[1.6] text-ink">
            {card.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="mt-8 border-t border-border-soft pt-5">
            <p
              className="font-mono text-[11px] uppercase text-ink-quiet"
              style={{ letterSpacing: "var(--tracking-eyebrow)" }}
            >
              {card.codeLabel}
            </p>
            <p className="mt-1 font-mono text-[clamp(1.1rem,1rem+0.6vw,1.5rem)] tracking-[0.04em] text-ink">
              {card.code}
            </p>
          </div>
          <p className="mt-8 font-mono text-[11px] text-ink-quiet">
            {card.footer}
          </p>
        </div>
      </section>

      {/* ── 2 · The email ────────────────────────────────────────────── */}
      <section
        className="venue-kit-block mt-12 border-t border-border-soft pt-8"
        aria-labelledby="welcome-email-heading"
      >
        <h2
          id="welcome-email-heading"
          className="text-[clamp(1.1rem,1rem+0.4vw,1.35rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink"
        >
          The email
        </h2>
        <p className="mt-2 max-w-[62ch] text-[13px] leading-[1.6] text-ink-quiet">
          Sent from your own mail, as plain text. No image, no button, no link
          that measures anybody.
        </p>

        <dl className="mt-6 max-w-[68ch] border-l-2 border-border-soft pl-5">
          <dt
            className="font-mono text-[11px] uppercase text-ink-quiet"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Subject
          </dt>
          <dd className="mt-1 text-[15px] leading-[1.6] text-ink">
            {email.subject}
          </dd>
          <dt className="sr-only">Body</dt>
          <dd className="mt-5 space-y-3">
            {email.body.map((line) => (
              <p key={line} className="text-[15px] leading-[1.62] text-ink">
                {line}
              </p>
            ))}
            <p className="text-[15px] leading-[1.62] text-ink">
              {email.signOff}
            </p>
          </dd>
        </dl>

        <h3 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-quiet">
          What you may change
        </h3>
        <ul className="mt-2 max-w-[68ch] list-disc space-y-1.5 pl-5 text-[14px] leading-[1.6] text-ink-soft">
          {email.editingRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      {/* ── 3 · The sequence ─────────────────────────────────────────── */}
      <section
        className="venue-kit-block mt-12 border-t border-border-soft pt-8"
        aria-labelledby="welcome-sequence-heading"
      >
        <h2
          id="welcome-sequence-heading"
          className="text-[clamp(1.1rem,1rem+0.4vw,1.35rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink"
        >
          What happens, in order
        </h2>
        <p className="mt-2 max-w-[62ch] text-[13px] leading-[1.6] text-ink-quiet">
          Read out of the running product on 3 August 2026. Every step says
          whether it runs on its own, is done by hand at Signal Studio, or does
          not exist yet.
        </p>

        <ol className="mt-6 space-y-6">
          {ONBOARDING_STEPS.map((step) => (
            <li key={step.order} className="venue-kit-block">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-[11px] text-ink-quiet">
                  {String(step.order).padStart(2, "0")}
                </span>
                <span
                  className="font-mono text-[11px] uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  {ACTOR_LABEL[step.actor]} · {STATE_LABEL[step.state]}
                </span>
              </div>
              <p className="mt-1.5 max-w-[62ch] text-[16px] font-medium leading-[1.4] text-ink">
                {step.title}
              </p>
              <p className="mt-1.5 max-w-[68ch] text-[14px] leading-[1.62] text-ink-soft">
                {step.detail}
              </p>
              <p className="mt-1.5 max-w-[68ch] font-mono text-[11px] leading-[1.5] text-ink-quiet">
                {step.evidence}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-12 border-t border-border-soft pt-6">
        <p className="font-mono text-[11px] text-ink-quiet">
          Signal Studio · hello@signalstudio.ie
        </p>
      </footer>
    </article>
  );
}
