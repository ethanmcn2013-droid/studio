import "./venue-kit-print.css";
import {
  KIT_CHANNELS,
  KIT_TEAM_NOTES,
  MARKETING_UNDERTAKING,
  PREBOOKING_AFTER_SENTENCE,
  PREBOOKING_CORE_SENTENCE,
  PREBOOKING_PRIVACY_SENTENCE,
  PROHIBITED_SHEET,
} from "@/lib/venue-prebooking-kit";

/**
 * E12.12 — the pre-booking venue sales kit, rendered.
 *
 * The artefact is a document a venue is handed. D-018: venue packs are
 * digital, and anything printed is printed by the venue at its own cost, so
 * this renders to screen and to A4 from the same markup.
 *
 * A plain server component, no script. A kit that measured which block a
 * coordinator read would be measuring the venue's staff on our behalf, and
 * nothing in this programme grants that.
 *
 * Every string comes from `src/lib/venue-prebooking-kit.ts`.
 */

const LENGTH_LABEL: Record<string, string> = {
  "one-line": "One line",
  short: "Short",
  full: "Full",
};

export function VenuePrebookingKitSheet({
  className = "",
}: {
  className?: string;
}) {
  return (
    <article
      className={`venue-kit-sheet mx-auto w-full max-w-[820px] bg-bg-elev px-8 py-10 text-ink sm:px-12 sm:py-14 ${className}`}
      aria-labelledby="prebooking-kit-title"
    >
      <header className="border-b border-border-soft pb-6">
        <p
          className="mb-3 font-mono text-[11px] uppercase text-ink-quiet"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          Signal Studio · Founding 25 · for your team
        </p>
        <h1
          id="prebooking-kit-title"
          className="text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink"
        >
          What to say before a couple books.
        </h1>
        <p className="mt-3 max-w-[62ch] text-[14px] leading-[1.6] text-ink-soft">
          Sentences that are true, per place you would use them. Say it your own
          way and keep the facts.
        </p>
      </header>

      <section className="mt-10" aria-labelledby="kit-core">
        <h2
          id="kit-core"
          className="text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-quiet"
        >
          The three that matter most
        </h2>
        <div className="mt-4 space-y-3 border-l-2 border-border pl-5">
          <p className="text-[16px] leading-[1.6] text-ink">
            {PREBOOKING_CORE_SENTENCE}
          </p>
          <p className="text-[16px] leading-[1.6] text-ink">
            {PREBOOKING_PRIVACY_SENTENCE}
          </p>
          <p className="text-[16px] leading-[1.6] text-ink">
            {PREBOOKING_AFTER_SENTENCE}
          </p>
        </div>
      </section>

      {KIT_CHANNELS.map((channel) => (
        <section
          key={channel.id}
          className="venue-kit-block mt-12 border-t border-border-soft pt-8"
          aria-labelledby={`kit-${channel.id}`}
        >
          <h2
            id={`kit-${channel.id}`}
            className="text-[clamp(1.1rem,1rem+0.4vw,1.35rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink"
          >
            {channel.name}
          </h2>
          <p className="mt-2 max-w-[62ch] text-[13px] leading-[1.6] text-ink-quiet">
            {channel.moment}
          </p>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-[1.62] text-ink-soft">
            {channel.rule}
          </p>

          <dl className="mt-6 space-y-4">
            {channel.blocks.map((block) => (
              <div key={block.length}>
                <dt
                  className="font-mono text-[11px] uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  {LENGTH_LABEL[block.length]}
                </dt>
                <dd className="mt-1 max-w-[68ch] border-l-2 border-border-soft pl-4 text-[15px] leading-[1.62] text-ink">
                  {block.text}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.08em] text-ink-quiet">
            Not here
          </h3>
          <ul className="mt-2 max-w-[68ch] list-disc space-y-1.5 pl-5 text-[14px] leading-[1.6] text-ink-soft">
            {channel.neverHere.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ))}

      <section
        className="venue-kit-block mt-12 border-t border-border-soft pt-8"
        aria-labelledby="kit-team"
      >
        <h2
          id="kit-team"
          className="text-[clamp(1.1rem,1rem+0.4vw,1.35rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink"
        >
          For your team, and not for a couple
        </h2>
        <ul className="mt-4 max-w-[68ch] space-y-2.5 text-[15px] leading-[1.62] text-ink-soft">
          {KIT_TEAM_NOTES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section
        className="venue-kit-block mt-12 border-t border-border-soft pt-8"
        aria-labelledby="kit-undertaking"
      >
        <h2
          id="kit-undertaking"
          className="text-[clamp(1.1rem,1rem+0.4vw,1.35rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink"
        >
          What the agreement asks of you
        </h2>
        <ol className="mt-4 max-w-[68ch] list-decimal space-y-2 pl-5 text-[15px] leading-[1.62] text-ink-soft">
          {MARKETING_UNDERTAKING.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      <section
        className="venue-kit-block mt-12 border-t border-border-soft pt-8"
        aria-labelledby="kit-prohibited"
      >
        <h2
          id="kit-prohibited"
          className="text-[clamp(1.1rem,1rem+0.4vw,1.35rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-ink"
        >
          {PROHIBITED_SHEET.title}
        </h2>
        <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.62] text-ink-soft">
          {PROHIBITED_SHEET.note}
        </p>
        <p className="mt-2 max-w-[68ch] font-mono text-[12px] leading-[1.6] text-ink-quiet">
          {PROHIBITED_SHEET.source}
        </p>
      </section>

      <footer className="mt-12 border-t border-border-soft pt-6">
        <p className="font-mono text-[11px] text-ink-quiet">
          Signal Studio · hello@signalstudio.ie
        </p>
      </footer>
    </article>
  );
}
