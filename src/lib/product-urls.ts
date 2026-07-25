/**
 * Explicit URL contract for Signal Studio's four products.
 *
 * Marketing destinations are umbrella anchors. Authenticated product work
 * lives on the consolidated app. Public Timeline/share links and the Tasks
 * template surface retain their own public origins for compatibility.
 */

const studioOrigin = (process.env.NEXT_PUBLIC_STUDIO_URL ?? "https://signalstudio.ie").replace(/\/$/, "");
const appOrigin = (process.env.NEXT_PUBLIC_APP_URL ?? "https://app.signalstudio.ie").replace(/\/$/, "");

export const PRODUCT_MARKETING_URLS = Object.freeze({
  notes: `${studioOrigin}/#notes`,
  tasks: `${studioOrigin}/#tasks`,
  timeline: `${studioOrigin}/#timeline`,
  signal: `${studioOrigin}/#signal`,
});

export const PRODUCT_APP_URLS = Object.freeze({
  notes: `${appOrigin}/app/notes`,
  tasks: `${appOrigin}/app/board`,
  timeline: `${appOrigin}/app/plan`,
  signal: `${appOrigin}/app/brief`,
});

/** Public origins retained for share links, templates, and compatibility routes. */
export const PRODUCT_PUBLIC_ORIGINS = Object.freeze({
  tasks: process.env.NEXT_PUBLIC_TASKS_PUBLIC_URL ?? "https://tasks.signalstudio.ie",
  timeline: process.env.NEXT_PUBLIC_TIMELINE_PUBLIC_URL ?? "https://timeline.signalstudio.ie",
  signal: process.env.NEXT_PUBLIC_SIGNAL_PUBLIC_URL ?? "https://signal.signalstudio.ie",
  notes: process.env.NEXT_PUBLIC_NOTES_PUBLIC_URL ?? "https://notes.signalstudio.ie",
});

/** @deprecated Use an explicit marketing, app, or public-origin contract. */
export const TASKS_URL = PRODUCT_PUBLIC_ORIGINS.tasks;
/** @deprecated Use an explicit marketing, app, or public-origin contract. */
export const TIMELINE_URL = PRODUCT_PUBLIC_ORIGINS.timeline;
/** @deprecated Use an explicit marketing, app, or public-origin contract. */
export const SIGNAL_URL = PRODUCT_PUBLIC_ORIGINS.signal;
/** @deprecated Use an explicit marketing, app, or public-origin contract. */
export const NOTES_URL = PRODUCT_PUBLIC_ORIGINS.notes;

export const APP_ORIGIN = appOrigin;
export const TASKS_MARKETING_ORIGIN = PRODUCT_PUBLIC_ORIGINS.tasks;
export const TIMELINE_PUBLIC_ORIGIN = PRODUCT_PUBLIC_ORIGINS.timeline;

export const IOS_APP_URL =
  process.env.NEXT_PUBLIC_IOS_APP_URL ?? "https://signalstudio.ie/ios";

/** Marketing deep link, pre-selects onboarding segment after sign-up. */
export function tasksSignUpUrl(useCase?: string | null): string {
  const base = `${APP_ORIGIN}/sign-up`;
  if (!useCase) return base;
  return `${base}?use=${encodeURIComponent(useCase)}`;
}

export function tasksWelcomeUrl(useCase?: string | null): string {
  const base = `${APP_ORIGIN}/welcome`;
  if (!useCase) return base;
  return `${base}?use=${encodeURIComponent(useCase)}`;
}
