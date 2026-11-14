import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/landing/site-footer";
import { SHARE_CARD } from "@/lib/brand/share-card";
import { isPreLaunch } from "@/lib/launch";
import { tasksSignUpUrl } from "@/lib/product-urls";
import { WaitlistLine } from "./waitlist-line";

export const metadata: Metadata = {
  title: "Waitlist · Signal Studio",
  description:
    "Join the Signal Studio waitlist. Access opens in small batches when each product and privacy gate is ready.",
  // Campaign links arrive with tracking parameters; the canonical drops them.
  alternates: { canonical: "/waitlist" },
  openGraph: {
    title: "Waitlist · Signal Studio",
    description: "Join the Signal Studio waitlist. Access opens in small batches.",
    type: "website",
    url: "/waitlist",
    siteName: "Signal Studio",
    images: [SHARE_CARD],
  },
  twitter: {
    card: "summary_large_image",
    title: "Waitlist · Signal Studio",
    description: "Join the Signal Studio waitlist. Access opens in small batches.",
    images: [SHARE_CARD],
  },
};

type Search = {
  source?: string;
  campaign?: string;
  audience?: string;
  artifact?: string;
  touch?: string;
  product?: string;
  plan?: string;
};

function pick(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const plan = pick(params.plan);
  const audienceParam = pick(params.audience);
  // Generic waitlist calls and the Free plan now lead to public account
  // creation. Keep Student and venue/school programme interest on the
  // waitlist while their separate eligibility and sponsorship terms apply.
  if (!isPreLaunch() && (!plan || plan === "free") && !audienceParam) {
    redirect(tasksSignUpUrl());
  }
  const source = pick(params.source) ?? "waitlist_page";
  const campaign = pick(params.campaign) ?? "pre_access_waitlist";
  const audience = audienceParam;
  const artifact =
    pick(params.artifact) ?? pick(params.product) ?? pick(params.plan);
  const touch = pick(params.touch) ?? "site";

  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <WaitlistLine
          source={source}
          campaign={campaign}
          audience={audience}
          artifact={artifact}
          touch={touch}
          path="/waitlist"
        />
      </main>
      <SiteFooter />
    </>
  );
}
