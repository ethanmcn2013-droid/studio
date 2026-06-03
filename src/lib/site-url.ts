const FALLBACK_SITE_URL = "https://signalstudio.ie";

export function getSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL) {
  const candidate = value?.trim();
  if (!candidate) return FALLBACK_SITE_URL;

  try {
    const url = new URL(candidate);
    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = getSiteUrl();
