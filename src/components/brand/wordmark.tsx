type Variant = "signal" | "tasks" | "roadmap" | "analytics" | "notes";
type Size = "sm" | "md" | "lg" | "xl";

interface WordmarkProps {
  className?: string;
  /** Run the variant's motion gesture. Defaults to true. */
  animate?: boolean;
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

const LABEL: Record<Variant, string> = {
  signal: "signal studio",
  tasks: "tasks",
  roadmap: "roadmap",
  analytics: "analytics",
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
 *   - tasks·          heartbeat  1.6s
 *   - roadmap·        advance    2.6s
 *   - analytics·      tick       2.4s
 *   - notes.          settle     3.2s
 *
 * Period (.pd) is baseline-seated — used by umbrella + nouns.
 * Middot (.md) is lifted toward cap-height — used by verbs.
 */
export function Wordmark({
  className = "",
  animate = true,
  size = "md",
  as: Tag = "span",
  variant = "signal",
}: WordmarkProps) {
  const sizeClass = SIZE[size] ?? SIZE.md;
  const liveClass = animate ? "is-live" : "";
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
          {variant === "signal" && animate ? (
            <span className="ring" aria-hidden />
          ) : null}
        </>
      ) : (
        <span className="md" aria-hidden />
      )}
    </Tag>
  );
}
