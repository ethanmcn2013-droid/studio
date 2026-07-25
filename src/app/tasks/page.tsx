import type { Metadata } from "next";
import { ProductMarketingPage } from "@/components/marketing/product-marketing-page";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "Signal Tasks · Execution clarity",
  description:
    "A shared place for live work in plain English. See what needs doing, who owns it, and what the week is asking for.",
  alternates: { canonical: PRODUCT_MARKETING_URLS.tasks },
};

export default function TasksMarketingPage() {
  return <ProductMarketingPage product="tasks" />;
}
