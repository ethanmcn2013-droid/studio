"use client";

import type { AtlasSnapshot } from "../types";

/**
 * Investor / loan-officer snapshot. States the thesis and backs it with the
 * same real figures the rest of the map uses, plus the discipline evidence.
 * Print-friendly (see atlas.css @media print).
 */
export function AtlasInvestorSnapshot({
  investor,
  placeholders,
}: {
  investor: AtlasSnapshot["investor"];
  placeholders: string[];
}) {
  return (
    <section className="atlas-investor" aria-label="Investor snapshot">
      <h2 className="atlas-investor-thesis">{investor.thesis}</h2>
      <p className="atlas-investor-lede">
        Signal Studio ships four calm products. The operating system behind them
        is mapped, measured, and written down. These figures are read live from
        the same source of truth the founder edits, not a pitch deck.
      </p>

      <div className="atlas-investor-figs">
        {investor.figures.map((f) => (
          <div key={f.label} className="atlas-investor-fig">
            <div className="atlas-investor-fig-value">{f.value}</div>
            <div className="atlas-investor-fig-label">{f.label}</div>
            {f.note ? <div className="atlas-investor-fig-note">{f.note}</div> : null}
          </div>
        ))}
      </div>

      <div className="atlas-investor-disc">
        {investor.discipline.map((d, i) => (
          <div key={i} className="atlas-investor-disc-item">
            {d}
          </div>
        ))}
      </div>

      <div className="atlas-investor-actions">
        <button
          type="button"
          className="atlas-print-btn"
          onClick={() => window.print()}
        >
          Print snapshot
        </button>
      </div>

      {placeholders.length ? (
        <details className="atlas-placeholders">
          <summary>Data still to fill in ({placeholders.length})</summary>
          <ul>
            {placeholders.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
