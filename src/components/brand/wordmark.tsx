type Variant = "signal" | "tasks" | "roadmap" | "analytics" | "notes";
type Size = "sm" | "md" | "lg" | "xl";

interface WordmarkProps {
  className?: string;
  /** Run the variant's motion gesture (looping). Defaults to true. */
  animate?: boolean;
  /**
   * Play the signal broadcast exactly once on mount, then go quiet —
   * the house wordmark's page-load gesture, not a perpetual one.
   * Ignored for non-signal variants. Independent of `animate`.
   */
  intro?: boolean;
  size?: Size;
  as?: "span" | "div" | "h1";
  /** Which wordmark — default "signal" (the umbrella). */
  variant?: Variant;
}

const SIZE: Record<Size, string> = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-[clamp(2.25rem,1.6rem+2.8vw,4rem)]",
};

// Keys are the internal variant identity (coupled to motion + CSS
// data-variant); values are the visible wordmark text. The 2026-06-13
// rename changes only the text: roadmap→timeline, analytics→signal.
const LABEL: Record<Variant, string> = {
  signal: "signal studio",
  tasks: "tasks",
  roadmap: "timeline",
  analytics: "signal",
  notes: "notes",
};

const USES_PERIOD: Record<Variant, boolean> = {
  signal: true,
  tasks: false,
  roadmap: false,
  analytics: false,
  notes: true,
};

/**
 * Canonical wordmark per the suite design system (v1, 2026-05-13).
 *
 * Five variants, five motions, one indigo:
 *   - signal studio.  broadcast  2.6s  (period + emit ring)
 *   - tasks·          pulse      2.6s  ease-in-out
 *   - roadmap·        sweep      5.4s  cubic-bezier(.22,.7,.2,1)
 *   - analytics·      tick       3.6s  steps(1,end)
 *   - notes.          caret      1.1s  steps(1,end)
 *
 * Period (.pd) is baseline-seated — used by umbrella + nouns.
 * Middot (.md) is lifted toward cap-height — used by verbs.
 */
export function Wordmark({
  className = "",
  animate = true,
  intro = false,
  size = "md",
  as: Tag = "span",
  variant = "signal",
}: WordmarkProps) {
  const sizeClass = SIZE[size] ?? SIZE.md;
  const isIntro = intro && variant === "signal";
  const liveClass = isIntro ? "is-intro" : animate ? "is-live" : "";
  const label = LABEL[variant];
  const usesPeriod = USES_PERIOD[variant];

  return (
    <Tag
      className={`brand-mark ${liveClass} ${sizeClass} ${className}`.trim()}
      data-variant={variant}
    >
      <span className="word">{label}</span>
      {usesPeriod ? (
        <>
          <span className="pd" aria-hidden>
            .
          </span>
          {variant === "signal" && (animate || isIntro) ? (
            <span className="ring" aria-hidden />
          ) : null}
        </>
      ) : (
        <span className="md" aria-hidden />
      )}
    </Tag>
  );
}
