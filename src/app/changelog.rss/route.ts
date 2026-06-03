import {
  readDispatchEntries,
  paragraphs,
  sectionDate,
  xmlEscape,
} from "@/lib/changelog";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

/**
 * /changelog.rss — RSS 2.0 feed mirroring the dispatch.
 *
 * The URL stays /changelog.rss for backwards compatibility with any
 * subscriber already set up; the content is the dispatch (operator
 * voice, four-line cap — see BRAND.md §6.5). One <item> per entry in
 * content/dispatch/*.md. pubDate uses the entry date at noon UTC; GUID
 * is constructed from date + slugified headline so re-ordered files
 * don't collapse readers' caches.
 */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function GET() {
  const entries = await readDispatchEntries();

  const items = entries.map((entry) => {
    const pubDate = sectionDate(entry.date).toUTCString();
    const guid = `signalstudio:dispatch:${entry.date}:${slugify(entry.headline)}`;
    const descriptionParts: string[] = [];
    if (entry.boldLead) descriptionParts.push(entry.boldLead);
    const bodyParas = paragraphs(entry.body);
    if (bodyParas.length) descriptionParts.push(...bodyParas);
    const description = descriptionParts.join("\n\n");
    const title = entry.verb
      ? `${entry.verb} · ${entry.headline}`
      : entry.headline;
    return {
      title,
      description,
      pubDate,
      guid,
      link: `${SITE_URL}/dispatch`,
    };
  });

  const channelTitle = "Signal Studio — The dispatch";
  const channelDescription =
    "What gets sent, not what accumulates. Shipped work across the Signal Studio suite, in plain English. Updated when something is worth saying out loud.";
  const channelLink = `${SITE_URL}/dispatch`;
  const feedLink = `${SITE_URL}/changelog.rss`;
  const lastBuildDate = new Date().toUTCString();

  const itemXml = items
    .map(
      (item) => `    <item>
      <title>${xmlEscape(item.title)}</title>
      <link>${xmlEscape(item.link)}</link>
      <guid isPermaLink="false">${xmlEscape(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${xmlEscape(item.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(channelTitle)}</title>
    <link>${xmlEscape(channelLink)}</link>
    <atom:link href="${xmlEscape(feedLink)}" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(channelDescription)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${itemXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
