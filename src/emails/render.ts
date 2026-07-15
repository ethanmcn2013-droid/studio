import { render } from "@react-email/render";
import { DIRECTIONS, type DirectionId } from "./directions";
import { getTemplate } from "./registry";

export type RenderedEmail = {
  templateId: string;
  directionId: DirectionId;
  fixtureId: string;
  subject: string;
  preheader: string;
  html: string;
  text: string;
};

/**
 * Renders one template in one direction with one fixture, producing the
 * production-safe HTML and the plain-text alternative in a single pass.
 * This is the only render entry point; the Lab, the tests and the
 * screenshot script all go through it so what the founder reviews is
 * exactly what a send pipeline would emit.
 */
export async function renderEmail(
  templateId: string,
  directionId: DirectionId,
  fixtureId = "default",
): Promise<RenderedEmail> {
  const template = getTemplate(templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  const direction = DIRECTIONS[directionId];
  if (!direction) throw new Error(`Unknown direction: ${directionId}`);
  const fixture = template.fixtures[fixtureId] ?? template.fixtures.default;
  if (!fixture) throw new Error(`Template ${templateId} has no fixtures`);

  const element = template.render(direction, fixture.data);
  const [html, text] = await Promise.all([
    render(element, { pretty: true }),
    render(element, { plainText: true }),
  ]);

  return {
    templateId,
    directionId,
    fixtureId,
    subject: template.subject(fixture.data),
    preheader: template.preheader(fixture.data),
    html,
    text,
  };
}

/**
 * Review-only transforms for the Email Lab. Never part of a send path.
 */

/** Force the dark-scheme styles on, simulating a dark-mode client. */
export function forceDark(html: string): string {
  return html.replace(/@media\s*\(prefers-color-scheme:\s*dark\)/g, "@media all");
}

/**
 * Simulate image blocking: strip every src so clients fall back to alt
 * text, exactly as a locked-down inbox does.
 */
export function blockImages(html: string): string {
  return html.replace(/(<img\b[^>]*?)\ssrc="[^"]*"/gi, '$1 data-blocked-src=""');
}
