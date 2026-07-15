import { Img, Link, Section, Text } from "@react-email/components";
import type { EmailDirection } from "../directions";
import { INDIGO, INK_FAINT, INK_SOFT } from "../directions";

/**
 * ProductFrame · a real product still treated like a photograph: hairline
 * frame, explicit dimensions, alt text that says what the screen shows.
 * Never load-bearing: the surrounding copy must carry the meaning with
 * images off.
 */
export function ProductFrame({
  direction,
  src,
  alt,
  width,
  height,
  caption,
}: {
  direction: EmailDirection;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}) {
  const d = direction;
  return (
    <Section style={{ margin: `${d.space.block}px 0` }}>
      <Img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          border: d.imagery.border,
          borderRadius: d.imagery.radius,
        }}
      />
      {caption ? (
        <Text
          className="em-faint"
          style={
            d.imagery.caption === "mono"
              ? { ...d.label, margin: "8px 0 0", textTransform: "none" as const, letterSpacing: "0.04em" }
              : { ...d.small, margin: "8px 0 0" }
          }
        >
          {caption}
        </Text>
      ) : null}
    </Section>
  );
}

/**
 * VideoPoster · the wedge-film treatment. A composed static poster frame,
 * a descriptive caption, and a text link that works with images blocked.
 * The film never depends on inbox playback; the poster links out to the
 * film page.
 */
export function VideoPoster({
  direction,
  src,
  alt,
  href,
  width,
  height,
  caption,
  linkLabel,
  duration,
}: {
  direction: EmailDirection;
  src: string;
  alt: string;
  href: string;
  width: number;
  height: number;
  caption: string;
  linkLabel: string;
  /** Spoken plainly, e.g. "60 seconds". */
  duration: string;
}) {
  const d = direction;
  return (
    <Section style={{ margin: `${d.space.block}px 0` }}>
      <Link href={href}>
        <Img
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            border: d.imagery.border,
            borderRadius: d.imagery.radius,
          }}
        />
      </Link>
      <Text className="em-faint" style={{ ...d.small, color: INK_FAINT, margin: "8px 0 0" }}>
        {caption} · {duration}
      </Text>
      <Text style={{ ...d.small, margin: "4px 0 0" }}>
        <Link
          href={href}
          className="em-link"
          style={{ color: INDIGO, textDecoration: "underline", fontWeight: 500 }}
        >
          {linkLabel}
        </Link>
      </Text>
    </Section>
  );
}

export const IMAGERY_TEXT_COLORS = { INK_SOFT };
