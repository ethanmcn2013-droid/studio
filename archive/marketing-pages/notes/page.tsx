import type { Metadata } from "next";
import { ProductMarketingPage } from "@/components/marketing/product-marketing-page";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "Signal Notes · Capture clarity",
  description:
    "A private notebook for work as it happens. Capture it, find it, and move it into Tasks only when you decide it is ready.",
  alternates: { canonical: PRODUCT_MARKETING_URLS.notes },
};

export default function NotesMarketingPage() {
  return <ProductMarketingPage product="notes" />;
}
