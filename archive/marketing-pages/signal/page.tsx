import { permanentRedirect } from "next/navigation";

/**
 * The retired /signal product page (Signal → Home consolidation,
 * 2026-08-04). Signal left the product line; the daily-briefing story
 * lives at /features/daily-briefing, and old links land there
 * permanently. Keep until the consolidation has settled.
 */
export default function RetiredSignalProductPage() {
  permanentRedirect("/features/daily-briefing");
}
