/**
 * Signal Studio's public social profiles, held once.
 *
 * The footer links and the structured data in the root layout both read this
 * list, so the two cannot disagree. Before 2026-10-02 they did: the footer
 * carried four handles of its own (three returned 404) while `sameAs` carried
 * a different four that resolve.
 *
 * TikTok is not listed. A profile is added here only once its address
 * resolves in a browser and the founder confirms the handle is ours.
 */
export type SocialId = "x" | "youtube" | "linkedin" | "instagram";

export const SOCIAL_PROFILES: ReadonlyArray<{
  id: SocialId;
  label: string;
  href: string;
}> = [
  { id: "x", label: "X", href: "https://x.com/SignalStudioIE" },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@SignalStudioIE",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/signalstudio-ie/",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/signalstudioie/",
  },
];

export const SOCIAL_PROFILE_URLS = SOCIAL_PROFILES.map((profile) => profile.href);
