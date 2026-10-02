/**
 * The ring and dot, as the home page header draws it: a ring with a dot 41%
 * of its width. It takes the current text colour, so the caller picks the
 * indigo. Decorative; the words beside it carry the name.
 */
export function RingDotMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.7" fill="currentColor" />
    </svg>
  );
}
