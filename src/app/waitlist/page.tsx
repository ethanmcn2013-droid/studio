import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { WaitlistLine } from "./waitlist-line";

export const metadata: Metadata = {
  title: "Waitlist | Signal Studio",
  description:
    "Join the Signal Studio waitlist. Access opens in small batches from 1 September.",
  openGraph: {
    title: "Waitlist | Signal Studio",
    description: "Join the Signal Studio waitlist. Access opens in small batches.",
    type: "website",
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
  const source = pick(params.source) ?? "waitlist_page";
  const campaign = pick(params.campaign) ?? "pre_access_waitlist";
  const audience = pick(params.audience);
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
