import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { VAULT, vaultStats, type VaultItem } from "@/lib/hq/vault";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Vault · Signal HQ",
  description: "Every legal, brand, founder, and operating document in one place.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

const KIND_VERB: Record<VaultItem["kind"], string> = {
  doc: "read",
  route: "open",
  asset: "open",
  source: "in repo",
};

function VaultRow({ item }: { item: VaultItem }) {
  const verb = KIND_VERB[item.kind];

  const body = (
    <>
      <span className="vault-row-main">
        <span className="vault-row-title">{item.title}</span>
        <span className="vault-row-note">{item.note}</span>
      </span>
      <span className="vault-row-side">
        <span className="vault-tag" data-state={item.state}>
          {item.state}
        </span>
        {item.kind === "source" ? (
          <code className="vault-row-src">{item.source}</code>
        ) : (
          <span className="vault-row-go">{verb} →</span>
        )}
      </span>
    </>
  );

  if (item.kind === "doc" && item.slug) {
    return (
      <Link href={`/hq/vault/${item.slug}`} className="vault-row" data-kind="doc">
        {body}
      </Link>
    );
  }

  if ((item.kind === "route" || item.kind === "asset") && item.href) {
    const external = item.href.endsWith(".html") || item.href.endsWith(".zip");
    if (external) {
      return (
        <a className="vault-row" href={item.href} data-kind={item.kind}>
          {body}
        </a>
      );
    }
    return (
      <Link href={item.href} className="vault-row" data-kind={item.kind}>
        {body}
      </Link>
    );
  }

  return (
    <div className="vault-row" data-kind="source" aria-disabled="true">
      {body}
    </div>
  );
}

export default async function VaultPage() {
  await requireHqAccess();

  const stats = vaultStats();

  return (
    <main id="main" className="vault-shell">
      <section className="vault-hero" aria-labelledby="vault-title">
        <div className="vault-hero-mark" aria-hidden="true" />
        <span className="vault-kicker">Signal HQ</span>
        <h1 id="vault-title" className="vault-title">
          The Vault<span aria-hidden="true">.</span>
        </h1>
        <p className="vault-lede">
          Everything the business runs on, in one place, ownership and legal,
          the Founder Circle, brand and motion, the plan, the pipeline, and the
          numbers. One index, kept honest.
        </p>
        <p className="vault-stat">
          {stats.domains} domains · {stats.docs} documents · {stats.routes} live
          surfaces · {stats.sources} in-repo sources
        </p>
        <nav className="vault-jump" aria-label="vault domains">
          {VAULT.map((domain) => (
            <a key={domain.id} href={`#${domain.id}`} className="vault-jump-link">
              {domain.label}
            </a>
          ))}
        </nav>
      </section>

      <div className="vault-domains">
        {VAULT.map((domain) => (
          <section
            key={domain.id}
            id={domain.id}
            className="vault-domain"
            aria-labelledby={`${domain.id}-title`}
          >
            <header className="vault-domain-head">
              <span className="vault-domain-kicker">{domain.kicker}</span>
              <div>
                <h2 id={`${domain.id}-title`} className="vault-domain-label">
                  {domain.label}
                </h2>
                <p className="vault-domain-blurb">{domain.blurb}</p>
              </div>
            </header>
            <div className="vault-rows">
              {domain.items.map((item) => (
                <VaultRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="vault-foot">
        <Link href="/hq" className="vault-foot-back">
          ← signal hq
        </Link>
        <span className="vault-foot-note">
          Documents render inside the access gate. Items marked “in repo” carry
          private data and are referenced by path, not served.
        </span>
      </footer>
    </main>
  );
}
