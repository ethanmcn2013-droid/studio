"use client";

import { useMemo, useState } from "react";
import { VenueProposalSheet } from "@/components/venue/venue-proposal-sheet";
import {
  EMPTY_VENUE_PROPOSAL_SLOTS,
  VENUE_PROPOSAL_SLOT_IDS,
  VENUE_PROPOSAL_SLOT_LABELS,
  buildVenueProposal,
  type VenueProposalSlots,
} from "@/lib/venue-proposal";

/**
 * E12.09 — the founder's tool for producing one venue's proposal.
 *
 * What it deliberately does not do:
 *   - It does not persist. Nothing is written to a database, to local storage
 *     or to the URL. A venue's name in a query string is forwarded, pasted
 *     into chat threads and logged by every proxy on the way (E13.16 §1), and
 *     that reasoning does not stop applying because the page is internal.
 *   - It does not send. The artefact is printed or saved as a PDF and goes out
 *     from the founder's own mail client, in the thread the walkthrough came
 *     off (E11.11 §6).
 *   - It does not fetch the paid count. The register cannot report it yet
 *     (E11.11 §8, blocker 7), and a number the tool invented would be worse
 *     than a field the founder has to fill from the register on purpose.
 */
export function VenueProposalComposer() {
  const [slots, setSlots] = useState<VenueProposalSlots>(
    EMPTY_VENUE_PROPOSAL_SLOTS,
  );
  const proposal = useMemo(() => buildVenueProposal(slots), [slots]);

  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-12">
        <form
          className="print:hidden"
          onSubmit={(event) => event.preventDefault()}
          aria-label="Proposal slots"
        >
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">
            Venue Edition proposal
          </h1>
          <p className="mt-3 text-[13px] leading-[1.6] text-ink-soft">
            One page, sent the same day as the walkthrough. Fill every slot,
            check the page beside you, then print it or save it as a PDF.
          </p>
          <p className="mt-3 text-[13px] leading-[1.6] text-ink-quiet">
            Verify the places taken against the register before you send. A
            count carried over from the last proposal is how two venues come to
            believe they hold the same number.
          </p>

          <div className="mt-7 space-y-5">
            {VENUE_PROPOSAL_SLOT_IDS.map((id) => {
              const field = VENUE_PROPOSAL_SLOT_LABELS[id];
              return (
                <div key={id} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={`slot-${id}`}
                    className="text-[13px] font-medium text-ink"
                  >
                    {field.label}
                  </label>
                  <input
                    id={`slot-${id}`}
                    name={id}
                    type="text"
                    value={slots[id]}
                    placeholder={field.placeholder}
                    autoComplete="off"
                    onChange={(event) =>
                      setSlots((current) => ({
                        ...current,
                        [id]: event.target.value,
                      }))
                    }
                    aria-describedby={`slot-${id}-hint`}
                    className="min-h-11 rounded-[6px] border border-border-soft bg-bg-elev px-3 text-[14px] text-ink outline-none focus-visible:border-ink"
                  />
                  <p
                    id={`slot-${id}-hint`}
                    className="text-[12px] leading-[1.5] text-ink-quiet"
                  >
                    {field.hint}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!proposal.sendable}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Print the proposal
            </button>
            <p
              className="text-[12px] leading-[1.5] text-ink-quiet"
              role="status"
            >
              {proposal.sendable
                ? "Every slot is filled. A4, one page, 16mm margins."
                : `${proposal.unfilledSlots.length} of ${VENUE_PROPOSAL_SLOT_IDS.length} slots still to fill.`}
            </p>
            <button
              type="button"
              onClick={() => setSlots(EMPTY_VENUE_PROPOSAL_SLOTS)}
              className="self-start text-[13px] text-ink-soft underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-ink"
            >
              Clear every slot
            </button>
          </div>

          <p className="mt-8 border-t border-border-soft pt-5 text-[12px] leading-[1.6] text-ink-quiet">
            Nothing typed here is stored. Closing this page clears it.
          </p>
        </form>

        <div className="border border-border-soft print:border-0">
          {/* This page already has an h1 (the tool's own title), so the sheet
              takes level 2 here. On the printed page and on the private venue
              page the sheet is the document and keeps level 1. E12.14. */}
          <VenueProposalSheet proposal={proposal} headingLevel={2} />
        </div>
      </div>
    </div>
  );
}
