import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ProductHandoffLab } from "@/components/marketing/handoff-lab/product-handoff-lab";
import { getAccessMode } from "@/lib/access-mode";
import type {
  HandoffOption,
  HandoffProductSelection,
  HandoffViewport,
} from "@/components/marketing/handoff-lab/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Product Handoff Study · Signal Studio",
  description:
    "Three review-only directions for the Signal Studio Product Handoff.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const OPTIONS = new Set<HandoffOption>(["a", "b", "c"]);
const PRODUCTS = new Set<HandoffProductSelection>([
  "notes",
  "tasks",
  "timeline",
  "signal",
  "walk",
]);
const VIEWPORTS = new Set<HandoffViewport>([
  "auto",
  "mobile",
  "tablet",
  "desktop",
]);

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function boundedProgress(value: string | undefined): number | null {
  if (value === undefined) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return Math.min(1, Math.max(0, parsed));
}

export default async function ProductHandoffLabPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const mode = getAccessMode();
  const requestHeaders = await headers();
  const host = (requestHeaders.get("host") ?? "").split(":")[0].toLowerCase();
  const isCanonicalProductionHost =
    host === "signalstudio.ie" || host === "www.signalstudio.ie";

  if (
    isCanonicalProductionHost ||
    (mode !== "development" && mode !== "review")
  ) {
    notFound();
  }

  const params = await searchParams;
  const optionParam = first(params.option);
  const productParam = first(params.product);
  const viewportParam = first(params.viewport);
  const progress = boundedProgress(first(params.progress));

  const option = OPTIONS.has(optionParam as HandoffOption)
    ? (optionParam as HandoffOption)
    : "a";
  const product = PRODUCTS.has(productParam as HandoffProductSelection)
    ? (productParam as HandoffProductSelection)
    : "notes";
  const viewport = VIEWPORTS.has(viewportParam as HandoffViewport)
    ? (viewportParam as HandoffViewport)
    : "auto";

  return (
    <ProductHandoffLab
      initialMotion={first(params.motion) === "reduce" ? "reduce" : "auto"}
      initialOption={option}
      initialProduct={product}
      initialProgress={progress}
      initialViewport={viewport}
    />
  );
}
