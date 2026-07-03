type Kind = "studio" | "tasks" | "timeline" | "signal" | "notes";
type Variant = "signal" | "tasks" | "roadmap" | "analytics" | "notes" | "timeline" | "studio";
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
  /** Canonical wordmark kind. Prefer this over variant for new code. */
  kind?: Kind;
  /** Legacy alias. `signal` means the umbrella mark for compatibility. */
  variant?: Variant;
}

const SIZE: Record<Size, string> = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-[clamp(2.25rem,1.6rem+2.8vw,4rem)]",
};

const LABEL: Record<Kind, string> = {
  studio: "signal studio",
  tasks: "tasks",
  timeline: "timeline",
  signal: "signal",
  notes: "notes",
};

const USES_PERIOD: Record<Kind, boolean> = {
  studio: true,
  signal: true,
  notes: true,
  tasks: false,
  timeline: false,
};

const LEGACY_CSS_VARIANT: Record<Kind, "signal" | "tasks" | "roadmap" | "analytics" | "notes"> = {
  studio: "signal",
  tasks: "tasks",
  timeline: "roadmap",
  signal: "analytics",
  notes: "notes",
};

/**
 * Canonical wordmark per the suite design system (v1, 2026-05-13).
 *
 * Five canonical kinds, five motions, one indigo:
 *   - signal studio.  broadcast
 *   - notes.          caret
 *   - tasks·          pulse
 *   - timeline·       sweep
 *   - signal·         tick
 *
 * Period (.pd) is baseline-seated, used by umbrella + nouns.
 * Middot (.md) is lifted toward cap-height, used by verbs.
 */
export function Wordmark({
  className = "",
  animate = true,
  intro = false,
  size = "md",
  as: Tag = "span",
  kind,
  variant = "signal",
}: WordmarkProps) {
  const resolvedKind: Kind =
    kind ??
    (variant === "roadmap"
      ? "timeline"
      : variant === "analytics"
        ? "signal"
        : variant === "signal"
          ? "studio"
          : variant);
  const sizeClass = SIZE[size] ?? SIZE.md;
  const isIntro = intro && resolvedKind === "studio";
  const liveClass = isIntro ? "is-intro" : animate ? "is-live" : "";
  const label = LABEL[resolvedKind];
  const usesPeriod = USES_PERIOD[resolvedKind];
  const legacyVariant = LEGACY_CSS_VARIANT[resolvedKind];

  return (
    <Tag
      className={`brand-mark ${liveClass} ${sizeClass} ${className}`.trim()}
      data-kind={resolvedKind}
      data-variant={legacyVariant}
    >
      <span className="word">{label}</span>
      {usesPeriod ? (
        <>
          <span className="pd" aria-hidden>
            .
          </span>
          {resolvedKind === "studio" && (animate || isIntro) ? (
            <span className="ring" aria-hidden />
          ) : null}
        </>
      ) : (
        <span className="md" aria-hidden />
      )}
    </Tag>
  );
}
