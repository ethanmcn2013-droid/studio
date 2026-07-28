import { NotesBeforeItLeaves } from "./notes/before-it-leaves";
import { SignalTheRead } from "./signal/the-read";
import { TasksTheBoard } from "./tasks/hero";
import { TimelineTheLine } from "./timeline/the-line";
import type { ProductId } from "@/lib/product-urls";

/**
 * The product hero band.
 *
 * Ported 2026-07-28 from the hero gallery, where each of these was reviewed
 * and signed off in isolation. They replace `ProductHeroGesture`, a static
 * CSS mock that stood in while the real heroes were stranded across four
 * repos after the consolidation.
 *
 * Each hero owns its own headline, so the page no longer renders the generic
 * copy column above them; two headlines competing was the whole reason the
 * gesture never grew past a placeholder. The rest of the page is unchanged:
 * the day-in-the-work section and the boundary band still read from
 * `PRODUCT_MARKETING`, and `definition.headline` still drives metadata and
 * the boundary copy.
 *
 * All four are client components with scoped CSS and their own motion. They
 * self-gate on `prefers-reduced-motion`.
 */
export function ProductHero({ product }: { product: ProductId }) {
  if (product === "tasks") return <TasksTheBoard />;
  if (product === "timeline") return <TimelineTheLine />;
  if (product === "notes") return <NotesBeforeItLeaves />;
  return <SignalTheRead />;
}
