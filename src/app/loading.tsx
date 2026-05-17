/**
 * Studio root loading boundary — App Router loading.tsx
 *
 * Spec: DESIGN.md §13 Loading boundary (2026-05-17).
 *
 * Visual: the studio broadcast dot — a small indigo circle, hard-clamped to
 * 10px max so it never balloons if fonts are slow to resolve. Centered on the
 * product's paper background (#ffffff). No spinner, no skeleton, no text.
 *
 * The dot is a plain <div> (not the Wordmark component) so this file has zero
 * client-component overhead, renders immediately in the RSC shell, and
 * carries no animation dependencies that could delay paint.
 *
 * Reduced-motion: the broadcast ring is suppressed via @media
 * (prefers-reduced-motion: reduce) in globals.css. The static dot always
 * shows regardless.
 */
export default function Loading() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--paper, #ffffff)",
        zIndex: 9999,
      }}
    >
      {/* The brand dot at its intended size (10px = 0.16em at the md size used
          in the wordmark). Hard-clamped here with an explicit px value so it
          is immune to font-size inheritance before Geist loads. */}
      <div
        className="loading-dot"
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "var(--indigo, #4f46e5)",
          flexShrink: 0,
        }}
      />
    </div>
  );
}
