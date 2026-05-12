import {
  readChangelogSections,
  paragraphs,
  sectionDate,
  xmlEscape,
} from "@/lib/changelog";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://signalstudio.ie";

/**
 * /changelog.rss — RSS 2.0 feed for the umbrella changelog.
 *
 * One <item> per entry inside studio/CHANGELOG.md. pubDate uses the
 * section's YYYY-MM-DD at noon UTC (the file does not carry per-entry
 * timestamps and a date-stable wall-clock keeps the feed deterministic).
 * GUIDs are constructed from the section date plus an entry index so
 * a duplicate title across sections doesn't collapse readers' caches.
 */
export async function GET() {
  const sections = await readChangelogSections();

  type FeedItem = {
    title: string;
    description: string;
    pubDate: string;
    guid: string;
    link: string;
  };

  const items: FeedItem[] = [];
  for (const section of sections) {
    const pubDate = sectionDate(section.date).toUTCString();
    section.entries.forEach((entry, idx) => {
      const guid = `signalstudio:changelog:${section.date}:${idx}`;
      const description = paragraphs(entry.body).join("\n\n");
      items.push({
        title: entry.title,
        description,
        pubDate,
        guid,
        link: `${SITE}/changelog`,
      });
    });
  }

  const channelTitle = "Signal Studio — Changelog";
  const channelDescription =
    "Process notes from the Signal Studio umbrella. Updated when something is worth saying out loud.";
  const channelLink = `${SITE}/changelog`;
  const feedLink = `${SITE}/changelog.rss`;
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
