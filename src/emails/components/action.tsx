import { Link, Section, Text } from "@react-email/components";
import type { EmailDirection } from "../directions";
import { INK_FAINT } from "../directions";

/**
 * PrimaryAction · one per message, by rule. Three constructions, one per
 * direction (the charters): Hairline's engraved rule, Broadsheet's filled
 * ink, Letterhead's indigo pill. Each is bulletproof: a padded anchor for
 * everyone plus a VML twin for Outlook's Word engine (CL-08), so the
 * fallback button is the same design, not an accident. A raw-link line
 * follows so the action survives image blocking, forced high-contrast
 * and screen readers.
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
  fallbackLabel?: string;
}) {
  const d = direction;
  const c = d.cta;
  const fontSize = Number(c.font.fontSize ?? 14);
  const height = c.padV * 2 + Math.round(fontSize * 1.2);
  // Word cannot measure text; approximate the anchor's box for the twin.
  const width = c.padH * 2 + Math.round(label.length * fontSize * 0.62);
  const arc =
    c.radius >= 999 ? "50%" : `${Math.min(50, Math.round((c.radius / height) * 100))}%`;
  const stroke = c.border
    ? `strokecolor="${c.border.split(" ").pop()}" strokeweight="1px"`
    : `stroked="false"`;
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  // Outlook's Word engine normally falls through to Arial; keeping Geist
  // first preserves the brand face in clients that can resolve it.
  const vml = `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${esc(href)}" style="height:${height}px;v-text-anchor:middle;width:${width}px;" arcsize="${arc}" ${stroke} fillcolor="${c.bg}">
<w:anchorlock/>
<center style="color:${c.color};font-family:Geist,Arial,sans-serif;font-size:${fontSize}px;font-weight:600;">${esc(label)}</center>
</v:roundrect>
<![endif]--><!--[if !mso]><!-->
<a href="${esc(href)}" class="${c.variant === "ink" ? "em-btn-ink" : c.variant === "engraved" ? "em-btn-engraved" : ""}" style="display:inline-block;background-color:${c.bg};color:${c.color};${c.border ? `border:${c.border};` : ""}border-radius:${c.radius}px;padding:${c.padV}px ${c.padH}px;text-decoration:none;font-size:${fontSize}px;font-weight:600;letter-spacing:${String(c.font.letterSpacing ?? "0")};font-family:${d.fontStack.replace(/"/g, "'")}">${esc(label)}</a>
<!--<![endif]-->`;

  return (
    <Section style={{ margin: `${d.space.block}px 0` }}>
      <div dangerouslySetInnerHTML={{ __html: vml }} />
      <Text
        className="em-faint"
        style={{ margin: "10px 0 0", fontSize: 12, lineHeight: "18px", color: INK_FAINT }}
      >
        {fallbackLabel ?? "If the button does not work, use this link:"}{" "}
        <Link
          href={href}
          className="em-link"
          style={{
            color: d.link.color,
            textDecoration: "underline",
            wordBreak: "break-all" as const,
          }}
        >
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
        style={{
          color: direction.link.color,
          textDecoration: "underline",
          fontWeight: 500,
        }}
      >
        {label}
      </Link>
    </Text>
  );
}
