/**
 * Signal Studio URL contract.
 *
 * There are two canonical user-facing origins:
 *   - signalstudio.ie: company and product marketing
 *   - app.signalstudio.ie: the one signed-in application
 *
 * Legacy product hosts are compatibility/public-service origins, not product
 * marketing homes and not separate applications. Keep those categories
 * explicit so a marketing link cannot accidentally become an app, webhook,
 * template, redeem, or share link.
 */

export type ProductId = "notes" | "tasks" | "timeline" | "signal";

export const STUDIO_ORIGIN = (
  process.env.NEXT_PUBLIC_STUDIO_URL ?? "https://signalstudio.ie"
).replace(/\/$/, "");

export const APP_ORIGIN = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.signalstudio.ie"
).replace(/\/$/, "");

export const PRODUCT_MARKETING_URLS: Readonly<Record<ProductId, string>> =
  Object.freeze({
    notes: `${STUDIO_ORIGIN}/notes`,
    tasks: `${STUDIO_ORIGIN}/tasks`,
    timeline: `${STUDIO_ORIGIN}/timeline`,
    signal: `${STUDIO_ORIGIN}/signal`,
  });

export const PRODUCT_APP_PATHS: Readonly<Record<ProductId, string>> =
  Object.freeze({
    notes: "/app/notes",
    tasks: "/app/tasks",
    timeline: "/app/timeline",
    signal: "/app/signal",
  });

export const PRODUCT_APP_URLS: Readonly<Record<ProductId, string>> =
  Object.freeze({
    notes: `${APP_ORIGIN}${PRODUCT_APP_PATHS.notes}`,
    tasks: `${APP_ORIGIN}${PRODUCT_APP_PATHS.tasks}`,
    timeline: `${APP_ORIGIN}${PRODUCT_APP_PATHS.timeline}`,
    signal: `${APP_ORIGIN}${PRODUCT_APP_PATHS.signal}`,
  });

/**
 * Retired product origins. These remain useful as redirect entry points and,
 * in the cases called out below, as stable public/service origins.
 */
export const LEGACY_PRODUCT_ORIGINS: Readonly<Record<ProductId, string>> =
  Object.freeze({
    notes: "https://notes.signalstudio.ie",
    tasks: "https://tasks.signalstudio.ie",
    timeline: "https://timeline.signalstudio.ie",
    signal: "https://signal.signalstudio.ie",
  });

/** Templates, embeds, webhooks, invites, and operational APIs still use it. */
export const TASKS_PUBLIC_ORIGIN =
  process.env.NEXT_PUBLIC_TASKS_PUBLIC_URL ??
  LEGACY_PRODUCT_ORIGINS.tasks;

/** Bearer Timeline artifacts and the public wedding example use this host. */
export const TIMELINE_PUBLIC_ORIGIN =
  process.env.NEXT_PUBLIC_TIMELINE_SITE_URL ??
  process.env.NEXT_PUBLIC_TIMELINE_PUBLIC_URL ??
  LEGACY_PRODUCT_ORIGINS.timeline;

export const IOS_APP_URL =
  process.env.NEXT_PUBLIC_IOS_APP_URL ?? `${STUDIO_ORIGIN}/ios`;

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

/** @deprecated Use TASKS_PUBLIC_ORIGIN, PRODUCT_MARKETING_URLS, or PRODUCT_APP_URLS. */
export const TASKS_URL = TASKS_PUBLIC_ORIGIN;
/** @deprecated Use TIMELINE_PUBLIC_ORIGIN, PRODUCT_MARKETING_URLS, or PRODUCT_APP_URLS. */
export const TIMELINE_URL = TIMELINE_PUBLIC_ORIGIN;
/** @deprecated Compatibility-only. Use PRODUCT_MARKETING_URLS or PRODUCT_APP_URLS. */
export const SIGNAL_URL = LEGACY_PRODUCT_ORIGINS.signal;
/** @deprecated Compatibility-only. Use PRODUCT_MARKETING_URLS or PRODUCT_APP_URLS. */
export const NOTES_URL = LEGACY_PRODUCT_ORIGINS.notes;
