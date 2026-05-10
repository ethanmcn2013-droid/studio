"use client";

interface WordmarkProps {
  className?: string;
  /** Show the settling animation on the period. Default true. */
  animate?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  /** Render as a plain span instead of a heading element. */
  as?: "span" | "div" | "h1";
}

const SIZE: Record<string, string> = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-[clamp(2.25rem,1.6rem+2.8vw,4rem)]",
};

/**
 * Signal Studio wordmark: "signal studio."
 *
 * Signature: lowercase wordmark, period is accent-gold and fades in
 * 200ms after mount — a settling gesture, not a pulse. The period is
 * the brand DNA carried over from the prior `studio.` mark; "signal"
 * now prefixes for primary semantic weight. Lowercase keeps the
 * register calm/premium (Linear/Arc/Notion family), not generic SaaS.
 *
 * Animation is fully driven by the `.studio-period` CSS class —
 * no JS ref or effect needed.
 *
 * Never use just "Signal" alone in body copy — collides with Signal
 * Messenger and is unownable as a standalone noun.
 */
export function Wordmark({
  className = "",
  animate = true,
  size = "md",
  as: Tag = "span",
}: WordmarkProps) {
  const sizeClass = SIZE[size] ?? SIZE.md;

  return (
    <Tag
      className={`inline-flex select-none items-baseline font-semibold tracking-[-0.045em] ${sizeClass} ${className}`}
    >
      <span
        className="wordmark"
        style={{ fontWeight: 600 }}
      >
        signal&nbsp;studio
      </span>
      <span
        aria-hidden
        className={animate ? "studio-period" : ""}
        style={{
          color: "var(--accent)",
          fontWeight: 600,
          opacity: animate ? undefined : 1,
        }}
      >
        .
      </span>
    </Tag>
  );
}
