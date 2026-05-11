interface WordmarkProps {
  className?: string;
  /** Play the pulse-slow gesture on the dot. Default true. */
  animate?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  as?: "span" | "div" | "h1";
}

const SIZE: Record<string, string> = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-[clamp(2.25rem,1.6rem+2.8vw,4rem)]",
};

/**
 * Signal Studio wordmark — per the 2026-05-11 brand guide (D01 —
 * Refined Indigo Dot). Geist 500, dot 0.16em indigo at the baseline
 * lower-right. Pulse-slow gesture on the dot (5.2s ease-in-out) when
 * animate is true; static dot when false.
 */
export function Wordmark({
  className = "",
  animate = true,
  size = "md",
  as: Tag = "span",
}: WordmarkProps) {
  const sizeClass = SIZE[size] ?? SIZE.md;

  return (
    <Tag className={`studio-mark ${animate ? "is-live" : ""} ${sizeClass} ${className}`}>
      <span className="word">signal&nbsp;studio</span>
      <span className="dot" aria-hidden />
    </Tag>
  );
}
