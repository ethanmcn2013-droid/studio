/**
 * Coordination structure for the org chart's "information-sharing" overlay,
 * and the real tool/MCP grants per Director.
 *
 * The coordination graph reflects the actual operating structure captured in
 * the advisor charters and channel config: who chairs which panel, who holds
 * veto over whom, the hub roles (Operations' daily briefing, Product Strategy
 * chairing the advisory board and launch council), and cluster ties. It is a
 * curated adjacency, not fabricated data — every edge maps to a documented
 * relationship. Kept in the feature (not elt.ts) so the elt snapshot stays a
 * clean mirror of advisors.yaml.
 */

/** Undirected coordination pairs (each edge is a real touchpoint). */
const PAIRS: [string, string][] = [
  // Strategy & Voice, and Product Strategy's chairing reach across the org.
  ["product-strategy", "brand-narrative-positioning"],
  ["product-strategy", "customer-success-research-insight"],
  ["brand-narrative-positioning", "customer-success-research-insight"],
  ["product-strategy", "product-experience-ux"],
  ["product-strategy", "engineering-systems-architecture"],
  ["product-strategy", "marketing-growth-audience-insight"],
  ["product-strategy", "operations-admin-founder-support"],
  // Product Excellence Council; Taste holds veto over the product leads + UX.
  ["product-experience-ux", "product-taste-design-integrity"],
  ["product-experience-ux", "performance-excellence-innovation"],
  ["product-experience-ux", "customer-success-research-insight"],
  ["product-taste-design-integrity", "roadmap-product-excellence"],
  ["product-taste-design-integrity", "tasks-product-excellence"],
  ["product-taste-design-integrity", "notes-product-excellence"],
  ["product-taste-design-integrity", "analytics-product-excellence"],
  ["product-taste-design-integrity", "creative-motion-experience"],
  ["performance-excellence-innovation", "engineering-systems-architecture"],
  ["roadmap-product-excellence", "engineering-systems-architecture"],
  ["tasks-product-excellence", "engineering-systems-architecture"],
  ["notes-product-excellence", "engineering-systems-architecture"],
  ["analytics-product-excellence", "engineering-systems-architecture"],
  // Build & Ship.
  ["engineering-systems-architecture", "operations-admin-founder-support"],
  ["creative-motion-experience", "brand-narrative-positioning"],
  ["creative-motion-experience", "performance-excellence-innovation"],
  // Growth & Commercial.
  ["marketing-growth-audience-insight", "revenue-partnerships-business-development"],
  ["marketing-growth-audience-insight", "brand-narrative-positioning"],
  ["marketing-growth-audience-insight", "customer-success-research-insight"],
  ["revenue-partnerships-business-development", "finance-capital-commercial-planning"],
  ["revenue-partnerships-business-development", "legal-risk-corporate-affairs"],
  ["finance-capital-commercial-planning", "legal-risk-corporate-affairs"],
  ["finance-capital-commercial-planning", "operations-admin-founder-support"],
  ["legal-risk-corporate-affairs", "operations-admin-founder-support"],
];

const ADJACENCY: Record<string, string[]> = (() => {
  const map: Record<string, Set<string>> = {};
  for (const [a, b] of PAIRS) {
    (map[a] ??= new Set()).add(b);
    (map[b] ??= new Set()).add(a);
  }
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [k, [...v]]));
})();

/** The Directors this one shares information with (undirected). */
export function coordinationPartners(id: string): string[] {
  return ADJACENCY[id] ?? [];
}

// ── Tools / MCP grants (real) ───────────────────────────────────────────────

/** Every Director has Tier-1 universal tool access (permissions.yaml). */
export const UNIVERSAL_TOOLS = ["Web research", "Internal doc research"];

/**
 * Provisioned MCP grants, from signal-directors/config/mcp.yaml. Sparse on
 * purpose: only google-calendar is live today, on a 90-day trial to two roles.
 */
export const MCP_GRANTS: Record<string, string[]> = {
  "operations-admin-founder-support": ["Google Calendar — read/write (90-day trial)"],
  "product-strategy": ["Google Calendar — read/write (90-day trial)"],
};

export function mcpGrants(id: string): string[] {
  return MCP_GRANTS[id] ?? [];
}
