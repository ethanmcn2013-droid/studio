"use client";

import { useEffect, useRef } from "react";
import { formatCadence, type Director } from "@/lib/hq/elt";
import { roleTitle, autonomyLabel } from "./org-utils";

export function OrgDetailPanel({
  director,
  clusterLabel,
  peers,
  founderName,
  onNavigate,
  onClose,
}: {
  director: Director;
  clusterLabel: string;
  peers: Director[];
  founderName: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [director.id]);

  return (
    <aside className="atlas-panel" role="complementary" aria-label={`${director.name} detail`}>
      <button type="button" className="atlas-panel-close" onClick={onClose} aria-label="Close detail">
        ×
      </button>

      <div className="atlas-panel-type">{clusterLabel} · Director</div>
      <h2 className="atlas-panel-name" tabIndex={-1} ref={headingRef}>
        {roleTitle(director.name)}
      </h2>
      <div className="atlas-health-chip">
        <span aria-hidden="true">◈</span>
        Persona · {director.persona}
      </div>
      <p className="atlas-panel-desc">{director.oneLine}</p>

      <Section title="State">
        <div className="atlas-facts">
          <Fact label="Reports to" value={`${founderName} (Founder)`} />
          <Fact label="Autonomy" value={autonomyLabel(director.autonomyLayer)} />
          <Fact label="Cadence" value={formatCadence(director.cadence)} />
          {director.product ? <Fact label="Product" value={director.product} /> : null}
        </div>
      </Section>

      {director.veto?.length ? (
        <Section title="Veto authority">
          <ul className="atlas-list atlas-list--risk">
            {director.veto.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {director.owns.length ? (
        <Section title="Portfolio">
          <ul className="atlas-list">
            {director.owns.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {peers.length ? (
        <Section title="Cluster peers">
          <div className="atlas-chips">
            {peers.map((p) => (
              <button
                key={p.id}
                type="button"
                className="atlas-chip"
                onClick={() => onNavigate(p.id)}
              >
                {p.shortName}
              </button>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Go to">
        <div className="atlas-links">
          <a href={director.charterHref} className="atlas-link" target="_blank" rel="noreferrer">
            <span>Open charter</span>
            <span className="atlas-link-hint">github</span>
          </a>
          <a href={`/hq/org/${director.id}`} className="atlas-link">
            <span>Full detail page</span>
            <span className="atlas-link-hint">internal</span>
          </a>
          <div className="atlas-link" style={{ cursor: "default" }}>
            <span>{director.slackChannel}</span>
            <span className="atlas-link-hint">slack</span>
          </div>
        </div>
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="atlas-panel-section">
      <div className="atlas-panel-h">{title}</div>
      {children}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="atlas-fact-label">{label}</div>
      <div className="atlas-fact-value">{value}</div>
    </div>
  );
}
