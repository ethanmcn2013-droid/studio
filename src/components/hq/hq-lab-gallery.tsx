import Link from "next/link";
import {
  MAKE_LABS,
  MAKE_SECTIONS,
  labMonogram,
  labThumb,
  type Lab,
} from "@/lib/hq/make-labs";

const STATE_TONE: Record<string, string> = {
  LIVE: "done",
  SHIPPED: "done",
  APPROVED: "done",
  DECIDED: "accent",
  REVIEW: "flight",
  SHORTLIST: "flight",
  BUILDING: "flight",
  GALLERY: "quiet",
  PARKED: "quiet",
};

function LabCard({ lab }: { lab: Lab }) {
  const thumb = labThumb(lab);
  const inner = (
    <>
      <div
        className="hqx-lab-thumb"
        data-cat={lab.category}
        style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
      >
        {!thumb ? <span className="hqx-lab-monogram">{labMonogram(lab.name)}</span> : null}
        <span className="hqx-pill hqx-lab-state" data-tone={STATE_TONE[lab.state] ?? "quiet"}>{lab.state}</span>
        {lab.external ? <span className="hqx-lab-ext" aria-hidden="true">↗</span> : null}
      </div>
      <div className="hqx-lab-body">
        <span className="hqx-lab-name">{lab.name}</span>
        <span className="hqx-lab-note">{lab.note}</span>
        {lab.where ? <span className="hqx-lab-where">{lab.where}</span> : null}
      </div>
    </>
  );

  return lab.external ? (
    <a href={lab.href} target="_blank" rel="noreferrer" className="hqx-lab-card">{inner}</a>
  ) : (
    <Link href={lab.href} className="hqx-lab-card">{inner}</Link>
  );
}

export function HqLabGallery() {
  return (
    <div className="hqx-section" style={{ gap: "var(--space-9)" }}>
      {MAKE_SECTIONS.map((section) => {
        const labs = MAKE_LABS.filter((l) => l.category === section.category);
        if (labs.length === 0) return null;
        return (
          <section key={section.category} className="hqx-section" aria-label={section.label}>
            <div className="hqx-section-head">
              <h2 className="hqx-section-title">{section.label}</h2>
              <span className="hqx-section-action">{labs.length}</span>
            </div>
            <p className="hqx-lab-blurb">{section.blurb}</p>
            <div className="hqx-lab-grid">
              {labs.map((lab) => <LabCard key={lab.id} lab={lab} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
