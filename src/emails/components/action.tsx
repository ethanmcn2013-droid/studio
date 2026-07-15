import { Button, Link, Section, Text } from "@react-email/components";
import type { EmailDirection } from "../directions";
import { INDIGO, INK_FAINT } from "../directions";

/**
 * PrimaryAction · one per message, by rule. A bulletproof padded link
 * (no VML, no background images) plus a plain text-link fallback so the
 * action survives image blocking, forced high-contrast and screen readers.
 *
 * The button class is em-btn-ink only for the Broadsheet ink button so
 * dark mode can flip it; indigo works on both schemes untouched.
 */
export function PrimaryAction({
  direction,
  href,
  label,
  fallbackLabel,
}: {
  direction: EmailDirection;
  href: string;
  label: string;
  /** Text shown before the raw fallback link. Defaults to a plain phrase. */
  fallbackLabel?: string;
}) {
  const d = direction;
  return (
    <Section style={{ margin: `${d.space.block}px 0` }}>
      <Button
        href={href}
        className={d.cta.variant === "ink" ? "em-btn-ink" : undefined}
        style={{
          display: "inline-block",
          backgroundColor: d.cta.bg,
          color: d.cta.color,
          borderRadius: d.cta.radius,
          padding: d.cta.pad,
          textDecoration: "none",
          ...d.cta.font,
        }}
      >
        {label}
      </Button>
      <Text
        className="em-faint"
        style={{ margin: "10px 0 0", fontSize: 12, lineHeight: "18px", color: INK_FAINT }}
      >
        {fallbackLabel ?? "If the button does not work, use this link:"}{" "}
        <Link href={href} className="em-link" style={{ color: INDIGO, textDecoration: "underline", wordBreak: "break-all" as const }}>
          {href.replace(/^https:\/\//, "")}
        </Link>
      </Text>
    </Section>
  );
}

/** A quieter second path. Text only, never a second button. */
export function SecondaryAction({
  direction,
  href,
  label,
}: {
  direction: EmailDirection;
  href: string;
  label: string;
}) {
  return (
    <Text style={{ ...direction.body, margin: `0 0 ${direction.space.para}px` }}>
      <Link
        href={href}
        className="em-link"
        style={{ color: INDIGO, textDecoration: "underline", fontWeight: 500 }}
      >
        {label}
      </Link>
    </Text>
  );
}
