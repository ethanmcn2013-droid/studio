import { getDirector } from "@/lib/hq/elt";
import { daysUntil, formatDateHuman } from "@/features/atlas/utils/atlas-scoring";
import {
  CADENCES,
  ROADMAP,
  OPERATING_TIMEZONE,
  roadmapDotClass,
} from "./org-cadence";

/**
 * Operating rhythm — the org's cadences and the AI-leadership build roadmap.
 * Static, server-rendered, real (mirrors config/cadences.yaml + README).
 */
export function OrgOperating() {
  return (
    <section className="orgc-operating" aria-label="Operating rhythm">
      <div className="orgc-op-eyebrow">Operating rhythm</div>
      <p className="orgc-op-lede">
        The org is a rhythm, not just a chart. These cadences run in{" "}
        {OPERATING_TIMEZONE.replace("/", ", ")} time. Silence is a signal; two
        skipped cycles trigger a review.
      </p>

      <div className="orgc-cadence-grid">
        {CADENCES.map((c) => {
          const owner = getDirector(c.ownerId);
          const days = c.nextDue ? daysUntil(c.nextDue) : null;
          const next = c.nextDue
            ? `${formatDateHuman(c.nextDue)}${days !== null ? ` · in ${days} days` : ""}`
            : null;
          return (
            <div key={c.id} className="orgc-cadence">
              <div className="orgc-cad-when">{c.when}</div>
              <div className="orgc-cad-label">{c.label}</div>
              <div className="orgc-cad-artefact">{c.artefact}</div>
              <div className="orgc-cad-owner">
                Owner · {owner?.shortName ?? c.ownerId}
                {next ? <> · next {next}</> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="orgc-op-title">Build roadmap</div>
      <ol className="orgc-roadmap">
        {ROADMAP.map((p) => (
          <li key={p.n} className="orgc-phase">
            <span className={roadmapDotClass(p.status)} aria-hidden="true" />
            <span className="orgc-phase-n">{p.n}</span>
            <span className="orgc-phase-body">
              <span className="orgc-phase-label">{p.label}</span>
              <span className="orgc-phase-detail">{p.detail}</span>
            </span>
            <span className="orgc-phase-status">{p.status.replace("-", " ")}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
