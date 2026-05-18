export type TrackingParams = {
  source: string;
  campaign: string;
  audience: string;
  artifact: string;
  touch: string;
  venue?: string;
};

export const VENUE_SITE_TRACKING = {
  source: "studio_site",
  campaign: "founding_venue",
  audience: "venue",
  touch: "site",
  venue: "unknown",
} satisfies Omit<TrackingParams, "artifact">;

export function withTracking(href: string, params: TrackingParams): string {
  const absolute = /^https?:\/\//.test(href);
  const url = new URL(href, absolute ? undefined : "https://signalstudio.ie");

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  if (absolute) return url.toString();
  return `${url.pathname}${url.search}${url.hash}`;
}
