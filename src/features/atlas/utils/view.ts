/**
 * Client-safe view helpers for the Atlas. Pure, no server-only, no fs.
 * These merge the curated graph with the live snapshot and provide the small
 * label/class maps the components share.
 */

import type {
  AtlasObject,
  AtlasDomainSignal,
  AtlasHealth,
  AtlasObjectType,
} from "../types";

/** Overlay a domain's live signal onto its curated node. */
export function resolveNode(
  node: AtlasObject,
  signal: AtlasDomainSignal | undefined,
): AtlasObject {
  if (!signal) return node;
  return {
    ...node,
    health: signal.health,
    maturity: signal.maturity ?? node.maturity,
    launchReadiness: signal.launchReadiness ?? node.launchReadiness,
    metrics: signal.metrics.length ? signal.metrics : node.metrics,
    risks: signal.risks.length ? signal.risks : node.risks,
    nextActions: signal.nextActions.length ? signal.nextActions : node.nextActions,
    lastReviewed: signal.lastReviewed ?? node.lastReviewed,
  };
}

/** Health → dot color modifier class. */
export function dotClass(health: AtlasHealth): string {
  return `atlas-dot atlas-dot--${health}`;
}

const TYPE_LABEL: Record<AtlasObjectType, string> = {
  company: "Company",
  domain: "System",
  product: "Product",
  feature: "Feature",
  workflow: "Workflow",
  design_principle: "Principle",
  ai_director: "AI director",
  ai_workflow: "AI workflow",
  engineering_system: "System",
  integration: "Integration",
  metric: "Metric",
  risk: "Risk",
  decision: "Decision",
  milestone: "Milestone",
  document: "Document",
};

export function typeLabel(type: AtlasObjectType): string {
  return TYPE_LABEL[type] ?? "Object";
}

/** The bar value a node shows: launch readiness if present, else maturity. */
export function barValue(node: AtlasObject): number | null {
  if (typeof node.launchReadiness === "number") return node.launchReadiness;
  if (typeof node.maturity === "number") return node.maturity;
  return null;
}

const DOC_LABEL: Record<string, string> = {
  none: "None",
  partial: "Partial",
  good: "Good",
  complete: "Complete",
};

export function docLabel(doc: string | undefined): string | null {
  return doc ? (DOC_LABEL[doc] ?? doc) : null;
}
