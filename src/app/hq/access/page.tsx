import type { Metadata } from "next";
import { isHqPasswordConfigured } from "@/lib/hq/auth";

export const metadata: Metadata = {
  title: "Signal HQ Access · Signal Studio",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function HqAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  const params = await searchParams;
  const from = params.from?.startsWith("/hq") ? params.from : "/hq";
  const configured = isHqPasswordConfigured();

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-bg px-5 py-12 text-ink">
      <section className="w-full max-w-[420px] rounded-[8px] border border-border-soft bg-bg-elev p-6 shadow-2">
        <div className="mb-8">
          <div className="mb-2 text-[24px] font-semibold tracking-[-0.045em]">
            signal hq<span style={{ color: "var(--accent)" }}>.</span>
          </div>
          <p className="text-[14px] leading-6 text-ink-quiet">
            Private operating dashboard for product, launch, growth, and decisions.
          </p>
        </div>

        {configured ? (
          <form action="/hq/access/check" method="post" className="grid gap-4">
            <input type="hidden" name="from" value={from} />
            <label className="grid gap-2 text-[13px] font-medium text-ink">
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                autoFocus
                className="h-11 rounded-[6px] border border-border-soft bg-bg px-3 text-[14px] outline-none transition focus:border-accent"
              />
            </label>
            {params.error ? (
              <p className="text-[13px] text-red-700">That password did not open Signal HQ.</p>
            ) : null}
            <button
              type="submit"
              className="h-11 rounded-[6px] bg-ink px-4 text-[13px] font-medium text-white transition hover:bg-ink-soft"
            >
              Open Signal HQ
            </button>
          </form>
        ) : (
          <div className="rounded-[6px] border border-red-100 bg-red-50 p-4 text-[13px] leading-6 text-red-800">
            Set <span className="font-mono">SIGNAL_HQ_PASSWORD</span> before using this route.
            Without it, HQ stays locked.
          </div>
        )}
      </section>
    </main>
  );
}
