"use client";

import { useEffect, useMemo, useRef } from "react";
import { formatCadence, getDirector, type Director } from "@/lib/hq/elt";
import { roleTitle, autonomyLabel } from "./org-utils";
import { OrgAvatar } from "./org-avatars";
import { UNIVERSAL_TOOLS, coordinationPartners, mcpGrants } from "./org-coordination";
import { councilsForDirector, functionalTools } from "./org-intel";

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
  const councils = useMemo(() => councilsForDirector(director.id), [director.id]);
  const functional = functionalTools(director.id);

  useEffect(() => {
    headingRef.current?.focus();
  }, [director.id]);

  return (
    <>
      <button
        type="button"
        className="orgc-drawer-scrim"
        aria-label="Close detail"
        tabIndex={-1}
        onClick={onClose}
      />
      <aside
        className="orgc-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="orgc-drawer-title"
      >
        <button type="button" className="orgc-drawer-close" onClick={onClose} aria-label="Close detail">
          ×
        </button>

      <div className="orgc-panel-hero">
        <span className="orgc-avatar orgc-avatar--panel" aria-hidden="true">
          <OrgAvatar id={director.id} title={director.persona} />
        </span>
        <div>
          <div className="orgc-panel-type">{clusterLabel} · Director</div>
          <h2 id="orgc-drawer-title" className="orgc-panel-name" tabIndex={-1} ref={headingRef}>
            {roleTitle(director.name)}
          </h2>
          <div className="orgc-panel-subline">
            {director.shortName} · {director.persona} ·{" "}
            {director.autonomyLayer === 3 ? "Layer 3" : "Layer 2"}
          </div>
        </div>
      </div>

      <div className="orgc-investor-card">
        <div className="orgc-investor-kicker">the read</div>
        <p>
          {director.shortName} owns a defined surface, reports to {founderName},
          and works through a repeatable cadence. Complexity stays visible without
          the founder handing off final control.
        </p>
      </div>

      <p className="orgc-panel-desc">{director.oneLine}</p>

      <Section title="Authority">
        <div className="orgc-facts">
          <Fact label="Reports to" value={`${founderName} (Founder)`} />
          <Fact label="Autonomy" value={autonomyLabel(director.autonomyLayer)} />
          <Fact label="Cadence" value={formatCadence(director.cadence)} />
          {director.product ? <Fact label="Product" value={director.product} /> : null}
        </div>
      </Section>

      {councils.length ? (
        <Section title={`Councils · ${councils.length}`}>
          <div className="orgc-chips">
            {councils.map(({ council, isChair }) => (
              <span
                key={council.id}
                className="orgc-chip"
                data-chair={isChair ? "true" : undefined}
              >
                {council.label}
                {isChair ? " · chair" : ""}
              </span>
            ))}
          </div>
        </Section>
      ) : null}

      {director.owns.length ? (
        <Section title="Owns">
          <ul className="orgc-plist">
            {director.owns.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {director.veto?.length ? (
        <Section title="Veto authority">
          <ul className="orgc-plist orgc-plist--risk">
            {director.veto.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {related.length ? (
        <Section title="Coordination paths">
          <div className="orgc-chips">
            {related.map((p) => (
              <button
                key={p.id}
                type="button"
                className="orgc-chip"
                onClick={() => onNavigate(p.id)}
              >
                {p.shortName}
              </button>
            ))}
          </div>
        </Section>
      ) : null}

      {peers.length ? (
        <Section title="Division peers">
          <div className="orgc-chips">
            {peers.map((p) => (
              <button
                key={p.id}
                type="button"
                className="orgc-chip"
                onClick={() => onNavigate(p.id)}
              >
                {p.shortName}
              </button>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Tools + grants">
        <ul className="orgc-plist">
          {UNIVERSAL_TOOLS.map((t) => (
            <li key={t}>{t}</li>
          ))}
          {functional.map((t) => (
            <li key={t}>{t}</li>
          ))}
          {mcpGrants(director.id).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>

      <Section title="Evidence links">
        <div className="orgc-links">
          <a href={director.charterHref} className="orgc-link" target="_blank" rel="noreferrer">
            <span>Open charter</span>
            <span className="orgc-link-hint">github</span>
          </a>
          <a href={`/hq/org/${director.id}`} className="orgc-link">
            <span>Full detail page</span>
            <span className="orgc-link-hint">internal</span>
          </a>
          <div className="orgc-link" style={{ cursor: "default" }}>
            <span>{director.slackChannel}</span>
            <span className="orgc-link-hint">slack</span>
          </div>
        </div>
      </Section>
      </aside>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="orgc-panel-section">
      <div className="orgc-panel-h">{title}</div>
      {children}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="orgc-fact-label">{label}</div>
      <div className="orgc-fact-value">{value}</div>
    </div>
  );
}
