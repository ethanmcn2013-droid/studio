"use client";

import { useEffect, useMemo, useRef } from "react";
import { formatCadence, getDirector, type Director } from "@/lib/hq/elt";
import { roleTitle, autonomyLabel } from "./org-utils";
import { OrgAvatar } from "./org-avatars";
import { UNIVERSAL_TOOLS, coordinationPartners, mcpGrants } from "./org-coordination";

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
  const related = useMemo(
    () =>
      coordinationPartners(director.id)
        .map((id) => getDirector(id))
        .filter((d): d is Director => Boolean(d)),
    [director.id],
  );

  useEffect(() => {
    headingRef.current?.focus();
  }, [director.id]);

  return (
    <aside className="atlas-panel orgc-panel" role="complementary" aria-label={`${director.name} detail`}>
      <button type="button" className="atlas-panel-close" onClick={onClose} aria-label="Close detail">
        x
      </button>

      <div className="orgc-panel-hero">
        <span className="orgc-avatar orgc-avatar--panel" aria-hidden="true">
          <OrgAvatar id={director.id} title={director.persona} />
        </span>
        <div>
          <div className="atlas-panel-type">{clusterLabel} / Director</div>
          <h2 className="atlas-panel-name" tabIndex={-1} ref={headingRef}>
            {roleTitle(director.name)}
          </h2>
          <div className="orgc-panel-subline">
            {director.shortName} / {director.persona} /{" "}
            {director.autonomyLayer === 3 ? "Layer 3" : "Layer 2"}
          </div>
        </div>
      </div>

      <div className="orgc-investor-card">
        <div className="orgc-investor-kicker">investor read</div>
        <p>
          {director.shortName} owns a defined surface, reports to {founderName},
          and works through a repeatable cadence. This keeps complexity visible
          without making the founder hand off final control.
        </p>
      </div>

      <p className="atlas-panel-desc">{director.oneLine}</p>

      <Section title="Authority">
        <div className="atlas-facts">
          <Fact label="Reports to" value={`${founderName} (Founder)`} />
          <Fact label="Autonomy" value={autonomyLabel(director.autonomyLayer)} />
          <Fact label="Cadence" value={formatCadence(director.cadence)} />
          {director.product ? <Fact label="Product" value={director.product} /> : null}
        </div>
      </Section>

      {director.owns.length ? (
        <Section title="Owns">
          <ul className="atlas-list">
            {director.owns.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {director.veto?.length ? (
        <Section title="Veto authority">
          <ul className="atlas-list atlas-list--risk">
            {director.veto.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {related.length ? (
        <Section title="Information paths">
          <div className="atlas-chips">
            {related.slice(0, 8).map((p) => (
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

      {peers.length ? (
        <Section title="Council peers">
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

      <Section title="Tools">
        <ul className="atlas-list">
          {UNIVERSAL_TOOLS.map((t) => (
            <li key={t}>{t}</li>
          ))}
          {mcpGrants(director.id).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>

      <Section title="Evidence links">
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
