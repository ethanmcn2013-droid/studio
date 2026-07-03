import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { renderVaultMarkdown } from "@/lib/hq/vault-markdown";
import { findVaultDoc, readVaultDocBody } from "@/lib/hq/vault";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = findVaultDoc(slug);
  return {
    title: found ? `${found.item.title}, vault` : "vault, signal hq",
    description: found?.item.note ?? "Signal HQ vault document.",
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

const STATE_LABEL: Record<string, string> = {
  draft: "draft",
  ready: "ready",
  private: "private",
  parked: "parked",
  live: "live",
  source: "source",
};

export default async function VaultDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireHqAccess();

  const { slug } = await params;
  const found = findVaultDoc(slug);
  if (!found) notFound();

  const body = await readVaultDocBody(slug);
  if (body === null) notFound();

  const { item, domain } = found;
  const html = renderVaultMarkdown(body);

  return (
    <main id="main" className="vault-shell vault-doc-shell">
      <article className="vault-doc">
        <nav className="vault-doc-crumb" aria-label="breadcrumb">
          <Link href="/hq/vault">vault</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/hq/vault#${domain.id}`}>{domain.label.toLowerCase()}</Link>
        </nav>

        <header className="vault-doc-head">
          <h1 className="vault-doc-title">{item.title}</h1>
          <p className="vault-doc-note">{item.note}</p>
          <div className="vault-doc-tags">
            <span className="vault-tag" data-state={item.state}>
              {STATE_LABEL[item.state] ?? item.state}
            </span>
            {item.meta && <span className="vault-doc-meta">{item.meta}</span>}
            <span className="vault-doc-src">{item.source}</span>
          </div>
        </header>

        <div className="vault-prose" dangerouslySetInnerHTML={{ __html: html }} />

        <footer className="vault-doc-foot">
          <span>
            Mirrored into Signal HQ from <code>{item.source}</code>. The source
            repository remains the place to edit.
          </span>
          <Link href="/hq/vault" className="vault-doc-back">
            ← all of the vault
          </Link>
        </footer>
      </article>
    </main>
  );
}
