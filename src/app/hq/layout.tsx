import { HqShell } from "@/components/hq/hq-shell";

/**
 * Signal HQ Layout, the environment wrapper for all /hq/* pages.
 *
 * Provides two persistent signals that make this surface unambiguously
 * internal at a glance:
 *
 *   1. Environment strip, a 28px bar reading "● SIGNAL HQ · INTERNAL"
 *      in the paper-deep (#f4f4f5) register. Never appears on external
 *      surfaces. Sticky so it stays in frame as you scroll.
 *
 *   2. Persistent nav, a 44px bar below the strip with the full HQ
 *      hub list and an "exit → signalstudio.ie" escape. Background
 *      --paper-soft (#fafafa) to shift the internal surface temperature
 *      visibly from the external pure-white.
 *
 * The exit link is intentional: any employee seeing "← signalstudio.ie"
 * knows immediately which side of the product they're on.
 *
 * NOTE: The /hq/access page (password gate) intentionally inherits this
 * layout, showing INTERNAL before the user is logged in is correct and
 * safe (the content behind the gate is still protected).
 */
export default function HqLayout({ children }: { children: React.ReactNode }) {
  return <HqShell>{children}</HqShell>;
}
