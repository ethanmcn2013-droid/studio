export type TrackingParams = {
  source: string;
  campaign: string;
  audience: string;
  artifact: string;
  touch: string;
  venue?: string;
};

export const TRACKING_PARAM_KEYS = [
  "source",
  "campaign",
  "audience",
  "artifact",
  "touch",
  "venue",
] as const satisfies readonly (keyof TrackingParams)[];

export type TrackingParamKey = (typeof TRACKING_PARAM_KEYS)[number];

export const VENUE_SITE_TRACKING = {
  source: "studio_site",
  campaign: "founding_venue",
  audience: "venue",
  touch: "site",
  venue: "unknown",
} satisfies Omit<TrackingParams, "artifact">;

export function normalizeTrackingParams(
  input: Partial<Record<TrackingParamKey, string | string[] | undefined>>,
): Partial<TrackingParams> {
  const out: Partial<TrackingParams> = {};

  for (const key of TRACKING_PARAM_KEYS) {
    const raw = input[key];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (!value) continue;

    const trimmed = value.trim();
    if (!trimmed) continue;

    out[key] = trimmed;
  }

  return out;
}

export function formatTrackingRef(
  input: Partial<Record<TrackingParamKey, string | string[] | undefined>>,
): string {
  const params = normalizeTrackingParams(input);

  return TRACKING_PARAM_KEYS.map((key) => {
    const value = params[key];
    return value ? `${key}=${value}` : null;
  })
    .filter(Boolean)
    .join(" · ");
}

export function withTracking(href: string, params: TrackingParams): string {
  const absolute = /^https?:\/\//.test(href);
  const url = new URL(href, absolute ? undefined : "https://signalstudio.ie");

  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }

  if (absolute) return url.toString();
  return `${url.pathname}${url.search}${url.hash}`;
}
