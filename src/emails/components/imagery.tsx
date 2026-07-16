import { Img, Link, Section, Text } from "@react-email/components";
import type { EmailDirection } from "../directions";
import { HAIRLINE, PAPER_SOFT } from "../directions";

/**
 * Shared frame treatment: explicit dimensions, a quiet panel behind the
 * image so the blocked state reads designed (CL-12), and alt text dressed
 * as copy (the img's own colour and size style the alt rendering).
 */
function frameStyle(d: EmailDirection): React.CSSProperties {
  return {
    width: "100%",
    height: "auto",
    display: "block",
    border: d.imagery.border,
    borderRadius: d.imagery.radius,
    backgroundColor: PAPER_SOFT,
    // Dresses the alt text when images are blocked.
    color: "#3f3f46",
    fontFamily: d.fontStack,
    fontSize: 13,
    lineHeight: "20px",
  };
}

/**
 * ProductFrame · a real product still treated like a photograph: cropped
 * to its subject by the picture desk, framed by a hairline, captioned in
 * the direction's one caption grammar (CL-04). Never load-bearing: the
 * surrounding copy must carry the meaning with images off.
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
        className="em-img"
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={frameStyle(d)}
      />
      {caption ? (
        <>
          {d.imagery.captionRule ? (
            <div
              className="em-hair"
              style={{ borderTop: `1px solid ${HAIRLINE}`, marginTop: 8 }}
            />
          ) : null}
          <Text className="em-faint" style={{ ...d.caption, margin: "8px 0 0" }}>
            {caption}
          </Text>
        </>
      ) : null}
    </Section>
  );
}

/**
 * VideoPoster · the wedge-film treatment. A composed static poster frame,
 * a descriptive caption, and a text link that works with images blocked.
 * Letterhead names it the way a letter does: an enclosure line beneath
 * the photograph. The film never depends on inbox playback.
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
  /** Letterhead's enclosure line, e.g. "FILM-VEN". */
  enclosureId,
}: {
  direction: EmailDirection;
  src: string;
  alt: string;
  href: string;
  width: number;
  height: number;
  caption: string;
  linkLabel: string;
  duration: string;
  enclosureId?: string;
}) {
  const d = direction;
  const isLetter = d.signature === "letter";
  return (
    <Section style={{ margin: `${d.space.block}px 0` }}>
      <Link href={href}>
        <Img
          className="em-img"
          src={src}
          alt={alt}
          width={width}
          height={height}
          style={frameStyle(d)}
        />
      </Link>
      {d.imagery.captionRule ? (
        <div
          className="em-hair"
          style={{ borderTop: `1px solid ${HAIRLINE}`, marginTop: 8 }}
        />
      ) : null}
      {isLetter && enclosureId ? (
        <Text className="em-faint" style={{ ...d.label, margin: "10px 0 0" }}>
          Encl · {enclosureId} · {duration}
        </Text>
      ) : (
        <Text className="em-faint" style={{ ...d.caption, margin: "8px 0 0" }}>
          {caption} · {duration}
        </Text>
      )}
      <Text style={{ ...d.small, margin: "6px 0 0" }}>
        <Link
          href={href}
          className="em-link"
          style={{
            color: d.link.color,
            textDecoration: "underline",
            fontWeight: 500,
          }}
        >
          {linkLabel}
        </Link>
      </Text>
    </Section>
  );
}
