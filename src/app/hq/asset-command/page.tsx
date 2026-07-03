import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import {
  ACS_META,
  assetById,
  COMPLETED_PROMPTS,
  EXECUTIVE_JUDGEMENT,
  FIRST_TEN,
  OPEN_QUESTIONS,
  PANEL,
  PANEL_CONSENSUS,
  PROMPT_FRAMEWORK,
  QUALITY_GATE,
  RANKED,
  TAXONOMY,
  taxonomyProgress,
} from "@/lib/hq/asset-command";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Asset Command System · Signal HQ",
  description:
    "The launch-asset operating layer: director panel, master taxonomy, ranked priorities, the first ten assets, the quality gate, the Claude Design prompt framework, and the first completed prompt.",
  robots: { index: false, follow: false },
};

/**
 * /hq/asset-command, the Asset Command System. The standing decision record
 * for which launch assets exist, in what order, why, and to what bar, plus the
 * reusable quality gate and Claude Design prompt framework. Source of truth:
 * src/lib/hq/asset-command.ts.
 */
export default async function AssetCommandPage() {
  await requireHqAccess();
  const progress = taxonomyProgress();

  return (
    <main id="main" className="hq-page">
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">Signal HQ · Asset Command System</span>
        <h1 className="hq-page-title">
          {ACS_META.title}
          <span aria-hidden="true">.</span>
        </h1>
        <p className="hq-page-intro">{ACS_META.logline}</p>
        <p className="hq-page-intro" style={{ fontSize: 15 }}>
          {ACS_META.thesis}
        </p>
        <span className="hq-co-status" data-status="pre-incorporation">
          horizon · {ACS_META.launchHorizon} · {progress.required} required of{" "}
          {progress.total} assets
        </span>
        <p className="hq-film-build">
          <span className="hq-film-build-label">wedge</span> {ACS_META.wedge} ·{" "}
          {ACS_META.horizonNote}
        </p>
      </header>

      {/* 1 · Executive judgement */}
      <section className="hq-co-block" aria-label="executive judgement">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">01 · executive judgement</span>
          <p>The distilled call before any asset is designed.</p>
        </div>
        {EXECUTIVE_JUDGEMENT.map((para, i) => (
          <p key={i} className="hq-page-intro" style={{ fontSize: 15 }}>
            {para}
          </p>
        ))}
      </section>

      {/* 2 · Current asset audit */}
      <section className="hq-co-block" aria-label="current asset audit">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">02 · current asset audit</span>
          <p>
            Read against the live inventory in the{" "}
            <Link href="/hq/assets" className="hq-co-srclink">
              Assets room
            </Link>
            . Strict, not flattering, copy and design status per asset live in
            the taxonomy below.
          </p>
        </div>
        <div className="hq-co-rights">
          <AuditCard
            title="Ahead of need"
            body="Brand kit, motion brief, investor & market-entry decks, financial model, cap table, incorporation and loan packs. The company can describe itself to a lender beautifully."
          />
          <AuditCard
            title="Written, not designed"
            body="Venue sales pack, outreach sequence, founder review pack, copy exists as source docs; none is a finished, on-brand object a venue would touch."
          />
          <AuditCard
            title="Scaffolded, not production-ready"
            body="Hero demo film (Remotion skeleton), venue-edition video brief. Real progress, but neither is rendered or shippable."
          />
          <AuditCard
            title="Referenced, missing as a file"
            body="The single most-needed object, a venue one-pager built for the buyer, not a product feature sheet, does not exist as a designed artifact."
          />
          <AuditCard
            title="Required for venue sales"
            body="One-pager, founder card, 10-slide deck, demo script, pricing explainer. The revenue spine is mostly missing."
          />
          <AuditCard
            title="Required for proof"
            body="Real wedding-workflow screenshots, the numbered Founding Partner system, the permission form. The proof machinery is unbuilt and must stay gated."
          />
          <AuditCard
            title="Required for press"
            body="A press shell, fact sheet, headshot, and logo pack, armed but firing only on real proof. Release bodies must wait for a signed venue."
          />
          <AuditCard
            title="Required for launch week"
            body="A coordinated, calm launch surface and a proof-gate that keeps claims honest. Largely unbuilt; the proof-gate fields mostly exist in HQ."
          />
        </div>
      </section>

      {/* 3 · Director panel consensus */}
      <section className="hq-co-block" aria-label="director panel">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">03 · director panel · consensus</span>
          <p>
            Fourteen operating lenses, one decisive line each, then the
            distilled decision.
          </p>
        </div>
        <div className="hq-co-rights">
          {PANEL.map((d) => (
            <div key={d.name} className="hq-co-right">
              <h3 className="hq-co-right-cls">
                {d.name}
                <span className="hq-film-grammar-product"> · {d.lens}</span>
              </h3>
              <p className="hq-co-right-body">{d.call}</p>
            </div>
          ))}
        </div>
        <div className="hq-co-gates" style={{ marginTop: 24 }}>
          {PANEL_CONSENSUS.map((block) => (
            <div key={block.label} className="hq-co-right">
              <h3 className="hq-co-right-cls">{block.label}</h3>
              <ul className="hq-incorp-steps" role="list">
                {block.points.map((p, i) => (
                  <li key={i} className="hq-incorp-step" data-status="done">
                    <span className="hq-incorp-step-mark" aria-hidden="true">
                      ·
                    </span>
                    <span className="hq-incorp-step-label">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 4 · Master asset taxonomy */}
      <section className="hq-co-table-wrap" aria-label="master asset taxonomy">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">04 · master asset taxonomy</span>
          <p>
            The curated bank, not every conceivable asset. Scored on the
            weighted model (revenue 30 · proof 20 · trust 20 · reuse 10 · timing
            10 · feasibility 10). Sorted by score.
          </p>
        </div>
        <div className="hq-fm-scroll">
          <table className="hq-fm-table hq-co-table">
            <thead>
              <tr>
                <th scope="col">Asset</th>
                <th scope="col">Family</th>
                <th scope="col">Rev</th>
                <th scope="col">Proof</th>
                <th scope="col">Risk</th>
                <th scope="col">Diff</th>
                <th scope="col">Copy</th>
                <th scope="col">Design</th>
                <th scope="col">Req</th>
                <th scope="col">Score</th>
              </tr>
            </thead>
            <tbody>
              {[...TAXONOMY]
                .sort((a, b) => b.score - a.score)
                .map((a) => (
                  <tr key={a.id}>
                    <th scope="row">
                      <span className="hq-co-class">{a.name}</span>
                      <span
                        className="hq-co-role"
                        style={{ display: "block", maxWidth: 360 }}
                      >
                        {a.rationale}
                      </span>
                    </th>
                    <td className="hq-fm-mono">{a.family.split(" · ")[0]}</td>
                    <td>{a.revenue}</td>
                    <td>{a.proof}</td>
                    <td>{a.brandRisk}</td>
                    <td>{a.difficulty}</td>
                    <td className="hq-fm-mono">{a.copy}</td>
                    <td className="hq-fm-mono">{a.design}</td>
                    <td>{a.required ? "Yes" : "—"}</td>
                    <td className="hq-fm-cash">{a.score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5 · Ranked priority lists */}
      <section className="hq-co-block" aria-label="ranked priorities">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">05 · ranked priority lists</span>
          <p>
            Ruthless sequencing. The answer is not &ldquo;make everything&rdquo;
           , it is the minimum complete premium bank, in order.
          </p>
        </div>
        <div className="hq-co-gates">
          {RANKED.map((list) => (
            <div key={list.key} className="hq-co-right">
              <h3 className="hq-co-right-cls">{list.title}</h3>
              <p className="hq-co-right-body">{list.note}</p>
              <ol className="hq-incorp-steps" role="list">
                {list.assetIds.map((id) => {
                  const a = assetById(id);
                  if (!a) return null;
                  return (
                    <li
                      key={id}
                      className="hq-incorp-step"
                      data-status={a.design === "exists" ? "done" : "todo"}
                    >
                      <span className="hq-incorp-step-mark" aria-hidden="true">
                        {a.design === "exists" ? "✓" : ""}
                      </span>
                      <span className="hq-incorp-step-label">
                        {a.name}
                        <span className="hq-incorp-step-note">
                          {" "}
                          · score {a.score}
                        </span>
                      </span>
                      <span className="hq-incorp-step-status">{a.design}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* 6 · First ten assets */}
      <section className="hq-co-block" aria-label="first ten assets">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">06 · the first ten · in exact order</span>
          <p>
            One asset at a time, in Claude Design, until it is perfect. Chosen by
            what matters most for launch, not by what is easiest.
          </p>
        </div>
        <div className="hq-film-board">
          {FIRST_TEN.map((a) => (
            <article key={a.order} className="hq-film-scene">
              <div className="hq-film-scene-rail">
                <span className="hq-film-scene-n">
                  {String(a.order).padStart(2, "0")}
                </span>
                <span className="hq-film-scene-t">{a.type}</span>
              </div>
              <div className="hq-film-scene-body">
                <p className="hq-film-scene-beat">{a.name}</p>
                <p className="hq-co-right-body">
                  <strong>Why now.</strong> {a.whyNow}
                </p>
                <p className="hq-co-right-body">
                  <strong>Risk removed.</strong> {a.riskRemoved}
                </p>
                <p className="hq-co-right-body">
                  <strong>Depends on it.</strong> {a.dependents}
                </p>
                <div className="hq-film-scene-meta">
                  <span className="hq-film-scene-gesture">
                    excellent · {a.excellent}
                  </span>
                  <span className="hq-film-scene-sound">fails · {a.fails}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7 · Quality gate */}
      <section className="hq-co-block" aria-label="quality gate">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">07 · asset quality gate</span>
          <p>
            Every asset passes all ten before production. Practical enough to use
            repeatedly.
          </p>
        </div>
        <ul className="hq-incorp-steps" role="list">
          {QUALITY_GATE.map((c) => (
            <li key={c.id} className="hq-incorp-step" data-status="todo">
              <span className="hq-incorp-step-mark" aria-hidden="true">
                {String(c.id).padStart(2, "0")}
              </span>
              <span className="hq-incorp-step-label">
                <strong>{c.name}.</strong> {c.question}
                <span className="hq-incorp-step-note"> · bar: {c.bar}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 8 · Prompt framework */}
      <section className="hq-co-block" aria-label="prompt framework">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">08 · claude design prompt framework</span>
          <p>
            Sixteen sections. Fill every one and Claude Design produces a
            premium, usable first draft, not vague inspiration.
          </p>
        </div>
        <div className="hq-co-rights">
          {PROMPT_FRAMEWORK.map((s) => (
            <div key={s.n} className="hq-co-right">
              <h3 className="hq-co-right-cls">
                {String(s.n).padStart(2, "0")} · {s.title}
              </h3>
              <p className="hq-co-right-body">{s.guidance}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9 · Completed prompt library */}
      <section className="hq-co-block" aria-label="completed prompt library">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">09 · completed prompt library</span>
          <p>
            Each prompt is written in full and ready to paste into Claude Design,
            alongside the brand guide. The library grows one asset at a time, in
            priority order. {COMPLETED_PROMPTS.length} ready.
          </p>
        </div>
        {COMPLETED_PROMPTS.map((p, i) => (
          <details key={p.id} className="hq-co-right" open={i === 0} style={{ marginBottom: 14 }}>
            <summary style={{ cursor: "pointer", listStyle: "revert" }}>
              <span className="hq-co-right-cls">
                {String(i + 1).padStart(2, "0")} · {p.asset}
              </span>
              <span className="hq-co-right-body" style={{ display: "block", marginTop: 6 }}>
                {p.intent}
              </span>
            </summary>
            <pre className="hq-ff-mono" style={prePromptStyle}>
              {p.body}
            </pre>
          </details>
        ))}
      </section>

      {/* 10 · Open questions */}
      <section className="hq-co-block" aria-label="open questions">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">10 · open questions · missing inputs</span>
          <p>What the founder needs to confirm before the first prints and sends.</p>
        </div>
        <ul className="hq-incorp-steps" role="list">
          {OPEN_QUESTIONS.map((o, i) => (
            <li key={i} className="hq-incorp-step" data-status="todo">
              <span className="hq-incorp-step-mark" aria-hidden="true">
                ?
              </span>
              <span className="hq-incorp-step-label">
                {o.q}
                <span className="hq-incorp-step-note"> · why: {o.why}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="hq-dr-foot">
        <Link href="/hq/assets" className="hq-dr-back">
          ← back to the Assets room
        </Link>
        <span className="hq-dr-source">
          lives at · {ACS_META.livesAt.join(" · ")} ·{" "}
          {ACS_META.references.map((r, i) => (
            <span key={r.href}>
              {i > 0 ? " · " : ""}
              {r.external ? (
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hq-co-srclink"
                >
                  {r.label}
                </a>
              ) : (
                <a href={r.href} className="hq-co-srclink">
                  {r.label}
                </a>
              )}
            </span>
          ))}
        </span>
      </footer>
    </main>
  );
}

const prePromptStyle: React.CSSProperties = {
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: 12.5,
  lineHeight: 1.6,
  padding: "20px 22px",
  border: "1px solid var(--hairline, #e7e7ea)",
  borderRadius: 8,
  background: "var(--bg-recessed, #fafafa)",
  overflowX: "auto",
};

function AuditCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="hq-co-right">
      <h3 className="hq-co-right-cls">{title}</h3>
      <p className="hq-co-right-body">{body}</p>
    </div>
  );
}
