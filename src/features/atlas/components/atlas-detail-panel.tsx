"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { AtlasObject, AtlasLens } from "../types";
import { healthLabel } from "../utils/atlas-scoring";
import { dotClass, typeLabel, docLabel } from "../utils/view";

const LENS_LABEL: Record<AtlasLens, string> = {
  founder: "Founder",
  product: "Product",
  design: "Design",
  engineering: "Engineering",
  ai: "AI",
  launch: "Launch",
  investor: "Investor",
};

export function AtlasDetailPanel({
  node,
  lens,
  nodesById,
  onNavigate,
  onClose,
}: {
  node: AtlasObject;
  lens: AtlasLens;
  nodesById: Record<string, AtlasObject>;
  onNavigate: (id: string) => void;
  onClose: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [node.id]);

  const facts: Array<{ label: string; value: React.ReactNode }> = [];
  if (node.owner) facts.push({ label: "Owner", value: node.owner });
  facts.push({
    label: "Maturity",
    value: node.maturity !== null ? `${node.maturity} / 100` : "Not scored",
  });
  if (typeof node.launchReadiness === "number")
    facts.push({ label: "Launch readiness", value: `${node.launchReadiness} / 100` });
  const doc = docLabel(node.documentation);
  if (doc) facts.push({ label: "Documentation", value: doc });
  if (node.confidence)
    facts.push({ label: "Confidence", value: cap(node.confidence) });
  if (node.lastReviewed)
    facts.push({ label: "Last reviewed", value: node.lastReviewed });

  return (
    <aside
      className="atlas-panel"
      role="complementary"
      aria-label={`${node.name} detail`}
    >
      <button
        type="button"
        className="atlas-panel-close"
        onClick={onClose}
        aria-label="Close detail"
      >
        ×
      </button>

      <div className="atlas-panel-type">
        {typeLabel(node.type)} · {LENS_LABEL[lens]} view
      </div>
      <h2 className="atlas-panel-name" tabIndex={-1} ref={headingRef}>
        {node.name}
      </h2>
      <div className="atlas-health-chip">
        <span className={dotClass(node.health)} aria-hidden="true" />
        {healthLabel(node.health)}
      </div>
      <p className="atlas-panel-desc">{node.description}</p>

      {node.purpose ? (
        <Section title="What this is">
          <p className="atlas-panel-p">{node.purpose}</p>
        </Section>
      ) : null}

      {node.why ? (
        <Section title="Why it exists">
          <p className="atlas-panel-p">{node.why}</p>
        </Section>
      ) : null}

      {facts.length ? (
        <Section title="State">
          <div className="atlas-facts">
            {facts.map((f) => (
              <div key={f.label}>
                <div className="atlas-fact-label">{f.label}</div>
                <div className="atlas-fact-value">{f.value}</div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {node.metrics?.length ? (
        <Section title="Signals">
          <ul className="atlas-list">
            {node.metrics.map((m, i) => (
              <li key={i}>
                <strong>{m.value}</strong> · {m.label}
                {m.note ? <span> ({m.note})</span> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {node.risks?.length ? (
        <Section title="Risks">
          <ul className="atlas-list atlas-list--risk">
            {node.risks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {node.nextActions?.length ? (
        <Section title="Next actions">
          <ul className="atlas-list">
            {node.nextActions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {node.dependencies?.length ? (
        <Section title="Depends on">
          <NodeChips ids={node.dependencies} nodesById={nodesById} onNavigate={onNavigate} />
        </Section>
      ) : null}

      {node.related?.length ? (
        <Section title="Connected">
          <NodeChips ids={node.related} nodesById={nodesById} onNavigate={onNavigate} />
        </Section>
      ) : null}

      {node.evidence?.length ? (
        <Section title="Evidence">
          <ul className="atlas-list">
            {node.evidence.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {node.links?.length ? (
        <Section title="Go to">
          <div className="atlas-links">
            {node.links.map((l) => (
              <Link key={l.href} href={l.href} className="atlas-link">
                <span>{l.label}</span>
                {l.hint ? <span className="atlas-link-hint">{l.hint}</span> : null}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
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

function NodeChips({
  ids,
  nodesById,
  onNavigate,
}: {
  ids: string[];
  nodesById: Record<string, AtlasObject>;
  onNavigate: (id: string) => void;
}) {
  return (
    <div className="atlas-chips">
      {ids.map((id) => {
        const target = nodesById[id];
        if (!target) {
          return (
            <span key={id} className="atlas-chip atlas-chip--muted">
              {id}
            </span>
          );
        }
        return (
          <button
            key={id}
            type="button"
            className="atlas-chip"
            onClick={() => onNavigate(id)}
          >
            {target.name}
          </button>
        );
      })}
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
