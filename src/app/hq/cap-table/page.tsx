import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import {
  BENEFICIAL_OWNERS,
  CAP_TABLE,
  CLASS_RIGHTS,
  COMPANY_META,
} from "@/lib/hq/company";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cap table — Signal HQ",
  description:
    "Signal Studio Limited ownership — Class A voting (90%) and Class B Founder Circle (10%), as defined in the constitution. Pre-incorporation.",
  robots: { index: false, follow: false },
};

/**
 * /hq/cap-table — the ownership read-out. Transcribed from the constitution
 * blueprint in the vault; honest that the company is pre-incorporation (the
 * structure is defined, the shares are not yet issued).
 */
export default async function CapTablePage() {
  await requireHqAccess();

  const { shareholders, totalShares, totalNominalEur } = CAP_TABLE;

  return (
    <main id="main" className="hq-page">
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">Signal HQ · Cap Table</span>
        <h1 className="hq-page-title">{COMPANY_META.legalName}<span aria-hidden="true">.</span></h1>
        <p className="hq-page-intro">
          {COMPANY_META.type}. The structure is defined in the constitution and
          the decisions are confirmed — but the company is{" "}
          <strong>pre-incorporation</strong>: no shares are issued and there is
          no CRO number yet. This is the defined cap table, not a live register.
        </p>
        <span className="hq-co-status" data-status={COMPANY_META.status}>
          {COMPANY_META.statusLabel}
        </span>
      </header>

      {/* Ownership bar */}
      <section className="hq-co-ownerbar" aria-label="ownership split">
        {shareholders.map((s) => (
          <div
            key={s.holder}
            className="hq-co-ownerbar-seg"
            data-voting={s.voting ? "true" : undefined}
            style={{ flexGrow: s.pct }}
            title={`${s.holder} — ${s.pct}%`}
          >
            <span className="hq-co-ownerbar-pct">{s.pct}%</span>
            <span className="hq-co-ownerbar-who">{s.holder.split(" ")[0]}</span>
          </div>
        ))}
      </section>

      {/* Cap table */}
      <section className="hq-co-table-wrap" aria-label="capitalisation table">
        <div className="hq-fm-scroll">
          <table className="hq-fm-table hq-co-table">
            <thead>
              <tr>
                <th scope="col">Holder</th>
                <th scope="col">Class</th>
                <th scope="col">Voting</th>
                <th scope="col">Shares</th>
                <th scope="col">Nominal</th>
                <th scope="col">%</th>
              </tr>
            </thead>
            <tbody>
              {shareholders.map((s) => (
                <tr key={s.holder}>
                  <th scope="row">
                    {s.holder}
                    <span className="hq-co-role">{s.role}</span>
                  </th>
                  <td className="hq-co-class">{s.shareClass}</td>
                  <td>{s.voting ? "voting" : "non-voting"}</td>
                  <td>{s.shares.toLocaleString("en-IE")}</td>
                  <td>€{s.nominalEur.toLocaleString("en-IE")}</td>
                  <td className="hq-fm-cash">{s.pct}%</td>
                </tr>
              ))}
              <tr className="hq-co-total">
                <th scope="row">Total issued</th>
                <td />
                <td />
                <td>{totalShares.toLocaleString("en-IE")}</td>
                <td>€{totalNominalEur.toLocaleString("en-IE")}</td>
                <td className="hq-fm-cash">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="hq-co-foot-note">
          Nominal {COMPANY_META.nominalPerShare}/share. {COMPANY_META.giftModel}.
        </p>
      </section>

      {/* Class rights */}
      <section className="hq-co-block" aria-label="class rights">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">class rights</span>
          <p>Written into the constitution; the commercial machinery lives in the shareholders&rsquo; agreement.</p>
        </div>
        <div className="hq-co-rights">
          {CLASS_RIGHTS.map((r) => (
            <div key={r.cls} className="hq-co-right">
              <h3 className="hq-co-right-cls">{r.cls}</h3>
              <p className="hq-co-right-body">{r.rights}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficial ownership */}
      <section className="hq-co-block" aria-label="beneficial ownership">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">beneficial ownership · RBO</span>
          <p>{BENEFICIAL_OWNERS.note}</p>
        </div>
        <ul className="hq-co-bo">
          {BENEFICIAL_OWNERS.owners.map((o) => (
            <li key={o.holder}>
              <span className="hq-co-bo-who">{o.holder}</span>
              <span className="hq-co-bo-basis">{o.basis}</span>
            </li>
          ))}
        </ul>
        <p className="hq-co-foot-note">{BENEFICIAL_OWNERS.excluded}</p>
      </section>

      <footer className="hq-dr-foot">
        <Link href="/hq/incorporation" className="hq-dr-back">incorporation pack →</Link>
        <span className="hq-dr-source">
          source · {COMPANY_META.sources.map((s, i) => (
            <span key={s.href}>
              {i > 0 ? " · " : ""}
              <Link href={s.href} className="hq-co-srclink">{s.label}</Link>
            </span>
          ))}
        </span>
      </footer>
    </main>
  );
}
