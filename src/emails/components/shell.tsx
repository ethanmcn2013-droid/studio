import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from "@react-email/components";
import type { ReactNode } from "react";
import {
  type EmailDirection,
  FONT_SANS,
  HAIRLINE,
  INK,
  INK_SOFT,
  PAPER,
} from "../directions";
import { BrandHeader } from "./header";
import { EmailFooter, type FooterLink } from "./footer";

/**
 * EmailShell owns everything a template should never think about: the
 * document, the hidden preheader, the dark-mode stylesheet, the header,
 * the surface and the footer. Templates only supply content.
 *
 * Dark mode is progressive enhancement via prefers-color-scheme classes.
 * Directions with dark:"adapt" re-colour the whole message; "hold" keeps
 * the paper sheet and dims only the canvas around it. Everything stays
 * legible when a client ignores the media query or force-inverts.
 */
export function EmailShell({
  direction,
  preheader,
  category,
  metaLine,
  footerNote,
  footerLinks,
  children,
}: {
  direction: EmailDirection;
  /** Hidden inbox-snippet text. */
  preheader: string;
  /** Mono classification shown in the header, e.g. "Security". */
  category?: string;
  /** Right-aligned mono line, usually the date. */
  metaLine?: string;
  /** One sentence: why the recipient received this message. */
  footerNote: string;
  footerLinks?: FooterLink[];
  children: ReactNode;
}) {
  const d = direction;
  const holdSheet = d.dark === "hold";

  const darkCss = `
    html { background-color: ${d.canvasBg}; }
    @media (prefers-color-scheme: dark) {
      html { background-color: ${holdSheet ? "#161618" : "#1c1c1e"} !important; }
      .em-canvas { background-color: ${holdSheet ? "#161618" : "#1c1c1e"} !important; }
      .em-danger { color: #f87171 !important; }
      ${
        holdSheet
          ? `.em-outside, .em-outside a { color: #9b9ba3 !important; }`
          : `
      .em-surface { background-color: #232326 !important; border-color: #3a3a3f !important; }
      .em-ink { color: #f4f4f5 !important; }
      .em-soft { color: #c8c8cd !important; }
      .em-faint { color: #9b9ba3 !important; }
      .em-hair { border-color: #3a3a3f !important; }
      .em-panel { background-color: #2a2a2e !important; border-color: #3a3a3f !important; }
      .em-btn-ink { background-color: #f4f4f5 !important; color: #111111 !important; }
      .em-link { color: #a5b4fc !important; }
      `
      }
    }
    @media (max-width: 480px) {
      .em-edge { padding-left: 20px !important; padding-right: 20px !important; }
    }
  `;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <style>{darkCss}</style>
      </Head>
      <Preview>{preheader}</Preview>
      <Body
        className="em-canvas"
        style={{
          margin: 0,
          padding: `${d.frame.canvasPad}px 12px`,
          backgroundColor: d.canvasBg,
          fontFamily: FONT_SANS,
        }}
      >
        <Container
          className="em-surface"
          style={{
            maxWidth: d.maxWidth,
            margin: "0 auto",
            backgroundColor: d.surfaceBg,
            border: d.frame.border,
            borderRadius: d.frame.radius,
            overflow: "hidden",
          }}
        >
          <BrandHeader direction={d} category={category} metaLine={metaLine} />
          <Section
            className="em-edge"
            style={{
              padding: `0 ${d.edgePad}px`,
            }}
          >
            {children}
          </Section>
          <EmailFooter direction={d} note={footerNote} links={footerLinks} />
        </Container>
        {d.footer === "postal" ? (
          <Container style={{ maxWidth: d.maxWidth, margin: "0 auto" }}>
            <Section
              className="em-outside"
              style={{
                padding: "16px 8px 0",
                fontFamily: FONT_SANS,
                fontSize: 12,
                lineHeight: "18px",
                color: INK_SOFT,
                textAlign: "center" as const,
              }}
            >
              Signal Studio · Dublin, Ireland ·{" "}
              <a
                href="mailto:hello@signalstudio.ie"
                style={{ color: INK_SOFT, textDecoration: "underline" }}
              >
                hello@signalstudio.ie
              </a>
            </Section>
          </Container>
        ) : null}
      </Body>
    </Html>
  );
}

/**
 * The lowercase wordmark drawn in type. The indigo dot is the brand;
 * everything else is quiet. Text, not an image, so it survives image
 * blocking and every dark theme.
 */
export function Wordmark({ size = 13 }: { size?: number }) {
  return (
    <span
      className="em-ink"
      style={{
        fontFamily: FONT_SANS,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: "-0.025em",
        color: INK,
        whiteSpace: "nowrap" as const,
      }}
    >
      signal studio<span style={{ color: "#4f46e5" }}>.</span>
    </span>
  );
}

export const SHELL_COLOR_NOTES = { PAPER, INK, HAIRLINE };
