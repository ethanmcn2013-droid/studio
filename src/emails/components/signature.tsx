import { Link, Section, Text } from "@react-email/components";
import type { EmailDirection } from "../directions";
import { INK, INK_FAINT, INK_SOFT } from "../directions";

/**
 * FounderSignature · three registers of the same person.
 *
 *   plain  (Hairline)   a single line, the way infrastructure signs off.
 *   byline (Broadsheet) an editorial credit in the mono register.
 *   letter (Letterhead) a real letter closing: name, role, direct address.
 *
 * The name is provisional pending founder confirmation of the exact
 * signature line (docs/email-system/decisions-required.md).
 */
export function FounderSignature({
  direction,
  name = "Ethan",
  fullName = "Ethan McNamara",
  role = "Founder, Signal Studio",
  closing = "Thanks,",
}: {
  direction: EmailDirection;
  name?: string;
  fullName?: string;
  role?: string;
  closing?: string;
}) {
  const d = direction;

  if (d.signature === "byline") {
    return (
      <Section style={{ margin: `${d.space.block}px 0 0` }}>
        <Text className="em-faint" style={{ ...d.label, margin: 0 }}>
          {fullName} · {role}
        </Text>
      </Section>
    );
  }

  if (d.signature === "letter") {
    return (
      <Section style={{ margin: `${d.space.section}px 0 0` }}>
        <Text className="em-soft" style={{ ...d.body, color: INK_SOFT, margin: "0 0 14px" }}>
          {closing}
        </Text>
        <Text
          className="em-ink"
          style={{ fontSize: 18, lineHeight: "24px", fontWeight: 600, color: INK, margin: 0 }}
        >
          {name}
        </Text>
        <Text className="em-soft" style={{ fontSize: 13, lineHeight: "20px", color: INK_SOFT, margin: "2px 0 0" }}>
          {role}
        </Text>
        <Text style={{ fontSize: 13, lineHeight: "20px", margin: "2px 0 0" }}>
          <Link
            href="mailto:hello@signalstudio.ie"
            className="em-link"
            style={{ color: INK_FAINT, textDecoration: "underline" }}
          >
            hello@signalstudio.ie
          </Link>
        </Text>
      </Section>
    );
  }

  // plain
  return (
    <Section style={{ margin: `${d.space.block}px 0 0` }}>
      <Text className="em-soft" style={{ ...d.body, color: INK_SOFT, margin: 0 }}>
        {name}, Signal Studio
      </Text>
    </Section>
  );
}
