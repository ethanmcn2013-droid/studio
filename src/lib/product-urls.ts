/**
 * Sister-product URLs for Signal Studio.
 *
 * Defaults to Vercel deployment URLs in dev; override per environment via
 * NEXT_PUBLIC_TASKS_URL, NEXT_PUBLIC_TIMELINE_URL, NEXT_PUBLIC_SIGNAL_URL,
 * NEXT_PUBLIC_NOTES_URL on Vercel once custom domains are wired.
 */
export const TASKS_URL =
  process.env.NEXT_PUBLIC_TASKS_URL ?? "https://tasks.signalstudio.ie";

export const TIMELINE_URL =
  process.env.NEXT_PUBLIC_TIMELINE_URL ?? "https://timeline.signalstudio.ie";

export const SIGNAL_URL =
  process.env.NEXT_PUBLIC_SIGNAL_URL ?? "https://signal.signalstudio.ie";

export const NOTES_URL =
  process.env.NEXT_PUBLIC_NOTES_URL ?? "https://notes.signalstudio.ie";

export const IOS_APP_URL =
  process.env.NEXT_PUBLIC_IOS_APP_URL ?? "https://signalstudio.ie/ios";

const tasksBase = () => TASKS_URL.replace(/\/$/, "");

/** Marketing deep link, pre-selects onboarding segment after sign-up. */
export function tasksSignUpUrl(useCase?: string | null): string {
  if (!useCase) return `${tasksBase()}/sign-up`;
  return `${tasksBase()}/sign-up?use=${encodeURIComponent(useCase)}`;
}

export function tasksWelcomeUrl(useCase?: string | null): string {
  if (!useCase) return `${tasksBase()}/welcome`;
  return `${tasksBase()}/welcome?use=${encodeURIComponent(useCase)}`;
}
