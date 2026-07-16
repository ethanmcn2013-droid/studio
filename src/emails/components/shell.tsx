import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from "@react-email/components";
import type { ReactNode } from "react";
import { type EmailDirection, INDIGO, INK, INK_SOFT } from "../directions";
import { BrandHeader } from "./header";
import { EmailFooter, type FooterLink } from "./footer";

/**
 * EmailShell owns everything a template should never think about: the
 * document, the hidden preheader, the dark-mode stylesheet, the header,
 * the surface and the footer. Templates only supply content.
 *
 * Dark mode is progressive enhancement via prefers-color-scheme classes.
 * Directions with dark:"adapt" re-colour the whole message to their dark
 * stock; "hold" keeps the paper sheet and darkens only the room around
 * it. React Email copies the canvas onto a class-less wrapper cell, so
 * the dark canvas is also driven through a structural selector (CL-09).
 * Everything stays legible when a client ignores the media query or
 * force-inverts.
 */
export function EmailShell({
  direction,
  preheader,
  category,
  dateISO,
  metaLine,
  footerNote,
  footerLinks,
  /** Letterhead only: suppress the postal contact when a signature block carries it. */
  postalContact = true,
  children,
}: {
  direction: EmailDirection;
  /** Hidden inbox-snippet text. */
  preheader: string;
  /** Mono classification shown in the header, e.g. "Security". */
  category?: string;
  /** The message date; each direction formats it in its own grammar. */
  dateISO?: string;
  /** Pre-composed folio (e.g. the Dispatch issue line). Wins over dateISO. */
  metaLine?: string;
  /** One sentence: why the recipient received this message. */
  footerNote: string;
  footerLinks?: FooterLink[];
  postalContact?: boolean;
  children: ReactNode;
}) {
  const d = direction;
  const holdSheet = d.dark === "hold";
  const dk = d.darkPalette;

  const darkCss = `
    html { background-color: ${d.canvasBg}; }
    @media (prefers-color-scheme: dark) {
      html { background-color: ${dk.canvas} !important; }
      .em-canvas, body > table > tbody > tr > td { background-color: ${dk.canvas} !important; }
      ${
        holdSheet
          ? `
      /* The room goes dark; the letter does not. */
      .em-outside, .em-outside a { color: #9b9ba3 !important; }
      `
          : `
      .em-surface { background-color: ${dk.surface} !important; border-color: ${dk.hairline} !important; }
      .em-ink { color: ${dk.text} !important; }
      .em-soft { color: ${dk.soft} !important; }
      .em-faint { color: ${dk.faint} !important; }
      .em-hair { border-color: ${dk.hairline} !important; }
      .em-rule-ink { border-color: ${dk.text} !important; }
      .em-panel { background-color: ${dk.panel} !important; border-color: ${dk.hairline} !important; }
      .em-btn-ink { background-color: ${dk.text} !important; color: ${dk.canvas} !important; }
      .em-btn-engraved { background-color: ${dk.canvas} !important; color: ${dk.text} !important; border-color: ${dk.text} !important; }
      .em-danger { color: #f87171 !important; }
      .em-link { color: ${d.link.color === INDIGO ? "#a5b4fc" : dk.soft} !important; }
      .em-img { border-color: ${dk.hairline} !important; background-color: ${dk.panel} !important; }
      `
      }
    }
    @media (max-width: 480px) {
      .em-edge { padding-left: 20px !important; padding-right: 20px !important; }
    }
  `;

  const resolvedMeta =
    metaLine ?? (dateISO ? d.formatDate(dateISO) : undefined);

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
          fontFamily: d.fontStack,
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
          <BrandHeader direction={d} category={category} metaLine={resolvedMeta} />
          <Section className="em-edge" style={{ padding: `0 ${d.edgePad}px` }}>
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
                fontFamily: d.fontStack,
                fontSize: 12,
                lineHeight: "18px",
                color: INK_SOFT,
                textAlign: "center" as const,
              }}
            >
              {postalContact ? (
                <>
                  Signal Studio · Limerick, Ireland ·{" "}
                  <a
                    href="mailto:hello@signalstudio.ie"
                    style={{ color: INK_SOFT, textDecoration: "underline" }}
                  >
                    hello@signalstudio.ie
                  </a>
                </>
              ) : (
                <>Signal Studio · Limerick, Ireland</>
              )}
            </Section>
          </Container>
        ) : null}
      </Body>
    </Html>
  );
}

/**
 * The lowercase wordmark drawn in type. The indigo dot is the brand;
 * in Hairline it is the only indigo on the page. Text, not an image,
 * so it survives image blocking and every dark theme.
 */
export function Wordmark({
  direction,
  size = 13,
}: {
  direction: EmailDirection;
  size?: number;
}) {
  return (
    <span
      className="em-ink"
      style={{
        fontFamily: direction.fontStack,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: "-0.025em",
        color: INK,
        whiteSpace: "nowrap" as const,
      }}
    >
      signal studio<span style={{ color: INDIGO }}>.</span>
    </span>
  );
}
