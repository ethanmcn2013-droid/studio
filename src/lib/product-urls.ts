/**
 * Sister-product URLs for Signal Studio.
 *
 * Defaults to Vercel deployment URLs in dev; override per environment via
 * NEXT_PUBLIC_TASKS_URL, NEXT_PUBLIC_ROADMAP_URL, NEXT_PUBLIC_ANALYTICS_URL,
 * NEXT_PUBLIC_NOTES_URL on Vercel once custom domains are wired.
 */
export const TASKS_URL =
  process.env.NEXT_PUBLIC_TASKS_URL ?? "https://tasks.signalstudio.ie";

export const ROADMAP_URL =
  process.env.NEXT_PUBLIC_ROADMAP_URL ?? "https://roadmap.signalstudio.ie";

export const ANALYTICS_URL =
  process.env.NEXT_PUBLIC_ANALYTICS_URL ?? "https://analytics.signalstudio.ie";

export const NOTES_URL =
  process.env.NEXT_PUBLIC_NOTES_URL ?? "https://notes.signalstudio.ie";
