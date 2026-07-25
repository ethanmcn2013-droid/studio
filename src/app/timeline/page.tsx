import type { Metadata } from "next";
import { ProductMarketingPage } from "@/components/marketing/product-marketing-page";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "Signal Timeline · Direction clarity",
  description:
    "Shape work into a plan people can read, then publish only the timeline you mean to share.",
  alternates: { canonical: PRODUCT_MARKETING_URLS.timeline },
};

export default function TimelineMarketingPage() {
  return <ProductMarketingPage product="timeline" />;
}
