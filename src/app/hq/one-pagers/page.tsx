import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { ONE_PAGERS, DECK_EXPORT } from "@/lib/hq/one-pagers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "One-pagers · Signal HQ",
  description: "Print-ready brand documents, exported individually as PDF.",
  robots: { index: false, follow: false },
};

const products = ONE_PAGERS.filter((d) => d.slug !== "brand");
const brand = ONE_PAGERS.find((d) => d.slug === "brand");

function Row({
  href,
  name,
  summary,
  meta,
}: {
  href: string;
  name: string;
  summary: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-baseline justify-between gap-6 border-b border-[rgba(17,17,17,0.10)] py-4 no-underline"
    >
      <div className="min-w-0">
        <div className="text-[15px] font-semibold tracking-[-0.01em] text-[#111111]">
          {name}
          <span className="text-[#4f46e5]">.</span>
        </div>
        <div className="mt-1 text-[13.5px] leading-relaxed text-[#71717a]">
          {summary}
        </div>
      </div>
      <div className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[#71717a] group-hover:text-[#111111]">
        {meta} →
      </div>
    </Link>
  );
}

export default async function OnePagersHub() {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  return (
    <main id="main" className="mx-auto w-full max-w-[820px] px-6 pb-24 pt-16 md:pt-20">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#71717a]">
        Signal HQ
      </p>
      <h1 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#111111]">
        One-pagers<span className="text-[#4f46e5]">.</span>
      </h1>
      <p className="mt-3 max-w-[60ch] text-[14px] leading-relaxed text-[#71717a]">
        Six print-ready documents, one system. Open any one and use Export PDF
       , the browser renders vector text at A4. White paper, one indigo
        period, each product&rsquo;s gesture as a typographic mark.
      </p>

      <section className="mt-12">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#71717a]">
          Product one-pagers
        </h2>
        <div className="mt-3 border-t border-[rgba(17,17,17,0.10)]">
          {products.map((d) => (
            <Row
              key={d.slug}
              href={d.href}
              name={d.wordmark.replace(/\.$/, "")}
              summary={d.summary}
              meta="A4 portrait"
            />
          ))}
        </div>
      </section>

      {brand && (
        <section className="mt-12">
          <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#71717a]">
            Brand
          </h2>
          <div className="mt-3 border-t border-[rgba(17,17,17,0.10)]">
            <Row
              href={brand.href}
              name={brand.wordmark.replace(/\.$/, "")}
              summary={brand.summary}
              meta="A4 portrait"
            />
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#71717a]">
          Marketing plan
        </h2>
        <div className="mt-3 border-t border-[rgba(17,17,17,0.10)]">
          <Row
            href={DECK_EXPORT.href}
            name="signal studio · six-month plan"
            summary={DECK_EXPORT.summary}
            meta="A4 landscape"
          />
        </div>
      </section>
    </main>
  );
}
