import { Heading, Text } from "@react-email/components";
import type { ReactNode } from "react";
import type { EmailDirection } from "../directions";
import { INDIGO } from "../directions";

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

/** Mono eyebrow. Broadsheet numbers its sections; others use it sparingly. */
export function MonoLabel({
  direction,
  children,
}: {
  direction: EmailDirection;
  children: ReactNode;
}) {
  return (
    <Text
      className="em-faint"
      style={{ ...direction.label, margin: `0 0 8px` }}
    >
      {children}
    </Text>
  );
}

/** A quiet spacer that survives every client. */
export function Gap({ h }: { h: number }) {
  return <div style={{ height: h, lineHeight: `${h}px`, fontSize: 1 }}>{" "}</div>;
}

/** Inline indigo, rationed: the live thing, never decoration. */
export function Accent({ children }: { children: ReactNode }) {
  return <span style={{ color: INDIGO, fontWeight: 600 }}>{children}</span>;
}
