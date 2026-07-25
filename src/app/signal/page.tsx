import type { Metadata } from "next";
import { ProductMarketingPage } from "@/components/marketing/product-marketing-page";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "Signal · Attention clarity",
  description:
    "A briefing drawn from the work already in Signal Studio. The few things that deserve attention, without another dashboard.",
  alternates: { canonical: PRODUCT_MARKETING_URLS.signal },
};

export default function SignalMarketingPage() {
  return <ProductMarketingPage product="signal" />;
}
