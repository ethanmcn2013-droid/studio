import { Heading, Link, Text } from "@react-email/components";
import type { ReactNode } from "react";
import type { EmailDirection } from "../directions";

/** The one h1 every message gets. Semantic heading order starts here. */
export function EmailHeading({
  direction,
  children,
}: {
  direction: EmailDirection;
  children: ReactNode;
}) {
  return (
    <Heading
      as="h1"
      className="em-ink"
      style={{ ...direction.h1, margin: `0 0 ${direction.space.para}px` }}
    >
      {children}
    </Heading>
  );
}

/** First paragraph after the heading, slightly larger where the scale allows. */
export function LeadText({
  direction,
  children,
}: {
  direction: EmailDirection;
  children: ReactNode;
}) {
  return (
    <Text
      className="em-soft"
      style={{ ...direction.lead, margin: `0 0 ${direction.space.block}px` }}
    >
      {children}
    </Text>
  );
}

export function BodyText({
  direction,
  children,
  last,
}: {
  direction: EmailDirection;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <Text
      className="em-soft"
      style={{
        ...direction.body,
        margin: last ? 0 : `0 0 ${direction.space.para}px`,
      }}
    >
      {children}
    </Text>
  );
}

export function SmallText({
  direction,
  children,
}: {
  direction: EmailDirection;
  children: ReactNode;
}) {
  return (
    <Text className="em-faint" style={{ ...direction.small, margin: 0 }}>
      {children}
    </Text>
  );
}

/** Mono eyebrow in the direction's one tracked-caps register. */
export function MonoLabel({
  direction,
  children,
}: {
  direction: EmailDirection;
  children: ReactNode;
}) {
  return (
    <Text className="em-faint" style={{ ...direction.label, margin: `0 0 8px` }}>
      {children}
    </Text>
  );
}

/** An inline link in the direction's link register (CL-16, CL-23). */
export function InlineLink({
  direction,
  href,
  children,
}: {
  direction: EmailDirection;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="em-link"
      style={{
        color: direction.link.color,
        textDecoration: "underline",
        fontWeight: 500,
      }}
    >
      {children}
    </Link>
  );
}

/**
 * StoryNumber · Broadsheet's numbered register: mono numerals that carry
 * information (which story you are on). The other directions refuse
 * numbers, so this renders nothing for them by design.
 */
export function StoryNumber({
  direction,
  n,
}: {
  direction: EmailDirection;
  n: number;
}) {
  if (direction.id !== "broadsheet") return null;
  return (
    <Text className="em-faint" style={{ ...direction.label, margin: "0 0 4px" }}>
      {String(n).padStart(2, "0")}
    </Text>
  );
}

/** A quiet spacer that survives every client. */
export function Gap({ h }: { h: number }) {
  return <div style={{ height: h, lineHeight: `${h}px`, fontSize: 1 }}>{" "}</div>;
}
