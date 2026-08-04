import "./venue-proposal.css";
import type { VenueProposal, VenueProposalSlotId } from "@/lib/venue-proposal";
import { VENUE_PROPOSAL_SLOT_LABELS } from "@/lib/venue-proposal";

/**
 * E12.09 — the one page a venue is sent, rendered.
 *
 * No "use client": this is a plain server component so the proposal state of
 * the private venue page (E12.03) can render it without shipping JavaScript,
 * and so nothing on the sheet can measure the reader.
 *
 * Concise is the specification, not a preference. Every rule below exists to
 * keep it to one page:
 *   - Twelve blocks, heading plus body, no cards, no columns, no imagery.
 *   - The price is set once at display size and never repeated as a card.
 *   - The print stylesheet is A4 with 16mm margins and the sheet is sized to
 *     fill exactly one of them, so "one page" is true on paper and on screen.
 */

export function VenueProposalSheet({
  proposal,
  className = "",
  headingLevel = 1,
}: {
  proposal: VenueProposal;
  className?: string;
  /**
   * The sheet's own title level. 1 when the sheet IS the page: the printed
   * proposal, and the proposal state of the private venue page (E12.03),
   * where the document title is the page title.
   *
   * 2 when the sheet is embedded in a surface that already has an h1, which
   * today is the `/hq/venue-proposal` composer. Measured, not assumed: the
   * E12.14 sweep found two h1 elements on that route and this is the fix.
   * The body headings follow one level down, so the outline stays ordered
   * either way and no level is skipped.
   */
  headingLevel?: 1 | 2;
}) {
  const Title = headingLevel === 1 ? "h1" : "h2";
  const BlockHeading = headingLevel === 1 ? "h2" : "h3";

  return (
    <article
      className={`venue-proposal-sheet mx-auto w-full max-w-[820px] bg-bg-elev px-8 py-10 text-ink sm:px-12 sm:py-14 ${className}`}
      aria-labelledby="venue-proposal-title"
    >
      {!proposal.sendable && (
        <UnfilledSlotNotice unfilled={proposal.unfilledSlots} />
      )}

      <header className="border-b border-border-soft pb-6">
        <p
          className="mb-3 text-[11px] font-semibold uppercase text-ink-quiet"
          style={{ letterSpacing: "var(--tracking-eyebrow)" }}
        >
          The Founding 25
        </p>
        <Title
          id="venue-proposal-title"
          className="text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink"
        >
          {proposal.title}
        </Title>
        <p className="mt-3 text-[14px] leading-[1.6] text-ink-soft">
          {proposal.preparedFor}
        </p>
      </header>

      <div className="mt-8 space-y-6">
        {proposal.blocks.map((block) => (
          <section
            key={block.id}
            className="grid gap-1.5 md:grid-cols-[0.62fr_1.38fr] md:gap-8"
          >
            {block.heading && (
              <BlockHeading className="text-[14px] font-medium leading-[1.5] text-ink">
                {block.heading}
              </BlockHeading>
            )}
            <div className="space-y-2.5">
              {block.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    block.id === "what-it-costs" && index === 0
                      ? "text-[17px] font-medium leading-[1.5] tracking-[-0.01em] text-ink"
                      : "text-[13.5px] leading-[1.6] text-ink-soft"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-10 border-t border-border-soft pt-6">
        {proposal.signature.map((line, index) => (
          <p
            key={line}
            className={
              index === 0
                ? "text-[13.5px] font-medium text-ink"
                : "text-[13.5px] leading-[1.6] text-ink-soft"
            }
          >
            {line}
          </p>
        ))}
      </footer>
    </article>
  );
}

/**
 * E11.11 §2: "Every slot is filled before sending. A slot left unfilled is a
 * send defect." A comment in a document does not stop a send. This does: the
 * defect is named, at the top of the page, in the print output as well as on
 * screen, so a half-filled proposal cannot be mistaken for a finished one.
 */
function UnfilledSlotNotice({ unfilled }: { unfilled: VenueProposalSlotId[] }) {
  return (
    <div
      role="status"
      className="mb-8 rounded-[8px] border border-dashed border-border-soft bg-bg-deep px-4 py-3"
    >
      <p className="text-[12px] font-semibold uppercase text-ink" style={{ letterSpacing: "var(--tracking-eyebrow)" }}>
        Do not send
      </p>
      <p className="mt-2 text-[13px] leading-[1.6] text-ink-soft">
        {unfilled.length === 1
          ? "One slot is unfilled. A slot left unfilled is a send defect."
          : `${unfilled.length} slots are unfilled. A slot left unfilled is a send defect.`}
      </p>
      <p className="mt-1.5 text-[13px] leading-[1.6] text-ink-quiet">
        {unfilled
          .map((id) => VENUE_PROPOSAL_SLOT_LABELS[id].label.toLowerCase())
          .join(", ")}
        .
      </p>
    </div>
  );
}
