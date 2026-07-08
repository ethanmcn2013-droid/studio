import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { WaitlistForm } from "./waitlist-form";

export const metadata: Metadata = {
  title: "Waitlist | Signal Studio",
  description:
    "Join the Signal Studio waitlist. Product access is staged while the suite is prepared for the next access window.",
  openGraph: {
    title: "Waitlist | Signal Studio",
    description:
      "Join the Signal Studio waitlist for staged product access.",
    type: "website",
  },
};

type Search = {
  source?: string;
  campaign?: string;
  audience?: string;
  artifact?: string;
  touch?: string;
  useCase?: string;
  product?: string;
  plan?: string;
};

function pick(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

function inferUseCase(params: Search): string | undefined {
  const explicit = pick(params.useCase);
  if (explicit) return explicit;

  const joined = [
    params.audience,
    params.artifact,
    params.product,
    params.plan,
    params.campaign,
  ]
    .map(pick)
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/venue/.test(joined)) return "venues";
  if (/wedding|event/.test(joined)) return "weddings";
  if (/student/.test(joined)) return "students";
  if (/freelance/.test(joined)) return "freelance";
  if (/trade|builder|site/.test(joined)) return "trades";
  if (/business|operator/.test(joined)) return "small-business";
  return undefined;
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
  const artifact = pick(params.artifact) ?? pick(params.product) ?? pick(params.plan);
  const touch = pick(params.touch) ?? "site";
  const defaultUseCase = inferUseCase(params);

  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="waitlist-page">
          <div className="waitlist-grid">
            <div className="waitlist-copy">
              <p className="waitlist-kicker">Signal Studio waitlist</p>
              <h1>Project management for the 80% not in tech.</h1>
              <p className="waitlist-lede">
                Signal Studio is moving to staged access. Join the waitlist and
                we will open the right door when the next window is ready.
              </p>
              <div className="waitlist-proof" aria-label="What the waitlist is for">
                <div>
                  <span>01</span>
                  <p>Wedding planners, venues, students, freelancers, trades, and small operators.</p>
                </div>
                <div>
                  <span>02</span>
                  <p>Notes, Tasks, Timeline, and Signal, one work system, no setup theatre.</p>
                </div>
                <div>
                  <span>03</span>
                  <p>Access opens in small batches, so the product stays honest while it grows.</p>
                </div>
              </div>
              <p className="waitlist-contact">
                Venue conversations still go through{" "}
                <Link href="/venues">the Venue Edition</Link>.
              </p>
            </div>

            <div className="waitlist-panel" aria-label="Join the waitlist">
              <div className="waitlist-panel-head">
                <span>Access request</span>
                <span>Private preview</span>
              </div>
              <WaitlistForm
                source={source}
                campaign={campaign}
                audience={audience}
                artifact={artifact}
                touch={touch}
                path="/waitlist"
                defaultUseCase={defaultUseCase}
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <style>{`
        .waitlist-page {
          min-height: calc(100dvh - 56px);
          padding: clamp(48px, 7vw, 104px) 24px clamp(72px, 8vw, 128px);
          border-bottom: 1px solid var(--border-soft);
          background:
            linear-gradient(180deg, var(--bg) 0%, var(--bg-deep) 100%);
        }
        .waitlist-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 440px);
          gap: clamp(36px, 7vw, 96px);
          align-items: start;
          width: min(1120px, 100%);
          margin: 0 auto;
        }
        .waitlist-kicker,
        .waitlist-panel-head,
        .waitlist-proof span,
        .waitlist-form label span,
        .waitlist-form-message {
          font-family: var(--font-mono-stack);
        }
        .waitlist-kicker {
          margin: 0 0 24px;
          color: var(--accent);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: var(--tracking-eyebrow);
          text-transform: uppercase;
        }
        .waitlist-copy h1 {
          max-width: 11ch;
          margin: 0;
          color: var(--ink);
          font-size: clamp(3rem, 8vw, 6.75rem);
          font-weight: 600;
          letter-spacing: -0.045em;
          line-height: 0.94;
          text-wrap: balance;
        }
        .waitlist-lede {
          max-width: 56ch;
          margin: 28px 0 0;
          color: var(--ink-soft);
          font-size: clamp(1rem, 0.96rem + 0.22vw, 1.14rem);
          line-height: 1.65;
        }
        .waitlist-proof {
          display: grid;
          max-width: 680px;
          margin-top: 48px;
          border-top: 1px solid var(--border-soft);
        }
        .waitlist-proof div {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          gap: 18px;
          padding: 18px 0;
          border-bottom: 1px solid var(--border-soft);
        }
        .waitlist-proof span {
          color: var(--ink-faint);
          font-size: 11px;
          font-variant-numeric: tabular-nums;
        }
        .waitlist-proof p {
          margin: 0;
          color: var(--ink-soft);
          font-size: 14.5px;
          line-height: 1.6;
        }
        .waitlist-contact {
          margin: 28px 0 0;
          color: var(--ink-quiet);
          font-size: 13.5px;
          line-height: 1.6;
        }
        .waitlist-contact a {
          color: var(--ink);
          text-decoration: underline;
          text-decoration-color: var(--border);
          text-underline-offset: 3px;
        }
        .waitlist-contact a:hover {
          color: var(--accent);
          text-decoration-color: var(--accent);
        }
        .waitlist-panel {
          position: sticky;
          top: 88px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--bg-elev);
          box-shadow: var(--shadow-2);
          overflow: hidden;
        }
        .waitlist-panel-head {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-soft);
          color: var(--ink-quiet);
          font-size: 10.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .waitlist-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          padding: 18px;
        }
        .waitlist-field {
          display: grid;
          gap: 7px;
          min-width: 0;
        }
        .waitlist-field--full {
          grid-column: 1 / -1;
        }
        .waitlist-field span {
          color: var(--ink-quiet);
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .waitlist-field input,
        .waitlist-field select,
        .waitlist-field textarea {
          width: 100%;
          border: 1px solid var(--border-soft);
          border-radius: 6px;
          background: var(--bg);
          color: var(--ink);
          font: inherit;
          font-size: 14px;
          outline: none;
          transition:
            border-color var(--motion-base) var(--ease-out),
            background var(--motion-base) var(--ease-out);
        }
        .waitlist-field input,
        .waitlist-field select {
          min-height: 44px;
          padding: 0 12px;
        }
        .waitlist-field textarea {
          resize: vertical;
          min-height: 112px;
          padding: 12px;
          line-height: 1.55;
        }
        .waitlist-field input:focus,
        .waitlist-field select:focus,
        .waitlist-field textarea:focus {
          border-color: var(--accent);
          background: var(--bg-elev);
        }
        .waitlist-form-foot {
          grid-column: 1 / -1;
          display: grid;
          gap: 12px;
          padding-top: 4px;
        }
        .waitlist-submit {
          min-height: 46px;
          border: 0;
          border-radius: 999px;
          background: var(--ink);
          color: var(--bg-elev);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition:
            opacity var(--motion-base) var(--ease-out),
            transform var(--motion-fast) var(--ease-out);
        }
        .waitlist-submit:hover {
          opacity: 0.9;
        }
        .waitlist-submit:active {
          transform: translateY(1px);
        }
        .waitlist-submit:disabled {
          cursor: wait;
          opacity: 0.7;
        }
        .waitlist-form-message {
          min-height: 18px;
          margin: 0;
          color: var(--ink-quiet);
          font-size: 11px;
          line-height: 1.55;
        }
        .waitlist-form-message[data-state="success"] {
          color: var(--accent);
        }
        .waitlist-form-message[data-state="error"] {
          color: var(--danger, #b91c1c);
        }
        .waitlist-pot {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
        @media (max-width: 860px) {
          .waitlist-grid {
            grid-template-columns: 1fr;
          }
          .waitlist-panel {
            position: static;
          }
          .waitlist-copy h1 {
            max-width: 12ch;
          }
        }
        @media (max-width: 560px) {
          .waitlist-page {
            padding-inline: 18px;
          }
          .waitlist-form {
            grid-template-columns: 1fr;
            padding: 16px;
          }
          .waitlist-proof div {
            grid-template-columns: 34px minmax(0, 1fr);
          }
        }
      `}</style>
    </>
  );
}
