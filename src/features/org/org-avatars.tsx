/**
 * Signal Studio Director avatars — symbolic glyphs.
 *
 * One object, one idea. Symbolic, never humanoid. A single ink stroke weight
 * plus one indigo point of emphasis. Reads at small size. Follows the brief in
 * `signal-directors/slack/avatar-direction.md` for the 10 core Directors; the
 * remaining 7 are designed to the same system.
 *
 * `currentColor` = the ink stroke, so an active node (which turns the avatar
 * ring to accent) tints the whole glyph. The indigo point uses `var(--accent)`.
 */

type GlyphProps = { title: string };

const S = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const ACC = "var(--accent)";

/** id → glyph. Each is a single primary form. */
const GLYPHS: Record<string, () => React.ReactNode> = {
  // Horizon line with a single waypoint marker.
  "product-strategy": () => (
    <>
      <line x1="4" y1="16" x2="20" y2="16" {...S} />
      <line x1="14.5" y1="16" x2="14.5" y2="9" {...S} />
      <circle cx="14.5" cy="8" r="1.7" fill={ACC} />
    </>
  ),
  // A serif terminal — the end of a single letterform.
  "brand-narrative-positioning": () => (
    <>
      <line x1="12" y1="6" x2="12" y2="18" {...S} />
      <line x1="9" y1="6" x2="15" y2="6" {...S} />
      <line x1="9" y1="18" x2="15" y2="18" {...S} />
      <circle cx="15" cy="18" r="1.6" fill={ACC} />
    </>
  ),
  // An open ear, abstracted to a single curve.
  "customer-success-research-insight": () => (
    <>
      <path d="M16 7 A 6 6 0 1 0 15 17" {...S} />
      <path d="M13.5 10.5 A 2.4 2.4 0 0 0 13 14" {...S} stroke={ACC} />
    </>
  ),
  // A rising plotted line resolving to a point — the plan.
  "roadmap-product-excellence": () => (
    <>
      <polyline points="4,17 9.5,13 13.5,15 19,7" {...S} />
      <circle cx="19" cy="7" r="1.7" fill={ACC} />
    </>
  ),
  // A single firm downstroke crossing a baseline — a mark made.
  "tasks-product-excellence": () => (
    <>
      <line x1="6" y1="18" x2="18" y2="18" {...S} />
      <line x1="12" y1="6" x2="12" y2="18" {...S} />
      <circle cx="12" cy="18" r="1.7" fill={ACC} />
    </>
  ),
  // A dog-eared page corner — effortless capture.
  "notes-product-excellence": () => (
    <>
      <path d="M7 5 H15 L18 8 V19 H7 Z" {...S} />
      <path d="M15 5 V8 H18" {...S} stroke={ACC} />
    </>
  ),
  // A single reading held on a line — signal without overwhelm.
  "analytics-product-excellence": () => (
    <>
      <line x1="4" y1="12" x2="20" y2="12" {...S} />
      <circle cx="12" cy="12" r="3.2" {...S} />
      <circle cx="12" cy="12" r="1.4" fill={ACC} />
    </>
  ),
  // A doorway, viewed straight on — the user passes through.
  "product-experience-ux": () => (
    <>
      <path d="M7 20 V7 H17 V20" {...S} />
      <line x1="5.5" y1="20" x2="18.5" y2="20" {...S} stroke={ACC} />
    </>
  ),
  // A single ruled margin on a page — restraint, framing.
  "product-taste-design-integrity": () => (
    <>
      <rect x="6" y="5" width="12" height="14" rx="1" {...S} />
      <line x1="9" y1="5" x2="9" y2="19" {...S} stroke={ACC} />
    </>
  ),
  // A swift, taut arc — velocity, kept calm.
  "performance-excellence-innovation": () => (
    <>
      <path d="M5 18 Q 12 3.5, 19 10.5" {...S} />
      <circle cx="19" cy="10.5" r="1.7" fill={ACC} />
    </>
  ),
  // A keystone in a stone arch — structural load, boring on purpose.
  "engineering-systems-architecture": () => (
    <>
      <path d="M5 19 V13 A 7 7 0 0 1 19 13 V19" {...S} />
      <path d="M10.4 6.4 H13.6 L14.6 9.4 H9.4 Z" {...S} stroke={ACC} />
    </>
  ),
  // An easing S-curve — motion, resolved.
  "creative-motion-experience": () => (
    <>
      <path d="M6 18 C 6 12, 18 12, 18 6" {...S} />
      <circle cx="18" cy="6" r="1.7" fill={ACC} />
    </>
  ),
  // A standing bell, struck once — punctual signal, silence around it.
  "operations-admin-founder-support": () => (
    <>
      <line x1="12" y1="5" x2="12" y2="7" {...S} />
      <path d="M8 16 Q 8 7.5, 12 7.5 Q 16 7.5, 16 16" {...S} />
      <line x1="6.5" y1="16" x2="17.5" y2="16" {...S} />
      <circle cx="12" cy="16" r="1.6" fill={ACC} />
    </>
  ),
  // A reed bending in wind — audience signal as a natural force.
  "marketing-growth-audience-insight": () => (
    <>
      <path d="M9 20 C 9 12, 12 10, 16.5 7" {...S} />
      <circle cx="16.5" cy="7" r="1.7" fill={ACC} />
    </>
  ),
  // Two arcs meeting at a single tangent — two parties touching once.
  "revenue-partnerships-business-development": () => (
    <>
      <path d="M4 17 A 5.5 5.5 0 0 1 12 12" {...S} />
      <path d="M20 17 A 5.5 5.5 0 0 0 12 12" {...S} />
      <circle cx="12" cy="12" r="1.7" fill={ACC} />
    </>
  ),
  // A balance beam at rest — runway and pricing, not money.
  "finance-capital-commercial-planning": () => (
    <>
      <line x1="5" y1="10" x2="19" y2="10" {...S} />
      <line x1="5" y1="10" x2="5" y2="12.5" {...S} />
      <line x1="19" y1="10" x2="19" y2="12.5" {...S} />
      <path d="M9 16 L12 10 L15 16" {...S} />
      <circle cx="12" cy="10" r="1.6" fill={ACC} />
    </>
  ),
  // A safe frame — two corner brackets. How do we safely do yes.
  "legal-risk-corporate-affairs": () => (
    <>
      <path d="M6 9.5 V6 H9.5" {...S} />
      <path d="M18 14.5 V18 H14.5" {...S} />
      <circle cx="12" cy="12" r="1.6" fill={ACC} />
    </>
  ),
};

export function OrgAvatar({ id, title }: { id: string } & Partial<GlyphProps>) {
  const glyph = GLYPHS[id];
  return (
    <svg
      className="orgc-glyph"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      role="img"
      aria-label={title ?? "director symbol"}
    >
      {glyph ? glyph() : <circle cx="12" cy="12" r="2" fill={ACC} />}
    </svg>
  );
}
