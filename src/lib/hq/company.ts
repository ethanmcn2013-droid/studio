/**
 * Company, the cap table and the incorporation pack.
 *
 * Every figure here is transcribed from the founder-owned legal blueprint in
 * the vault, it is NOT invented:
 *   - cap table + class rights → content/vault/legal-constitution-shares.md
 *   - incorporation runbook     → content/vault/legal-cro-incorporation.md
 *   - tax / gift valuation      → content/vault/legal-tax-valuation.md
 *   - shareholders' agreement   → content/vault/legal-agreement.md
 *
 * Honesty contract: the company is PRE-INCORPORATION. The structure is
 * defined and decisions confirmed, but no shares are issued yet and there is
 * no CRO number. Every surface says so plainly, a defined cap table is not a
 * live one. Pure + client-safe (no server-only import).
 *
 * Statutory references carry a Jan-2026 cutoff, verify against cro.ie /
 * revenue.ie at filing. This is a working blueprint, not regulated advice.
 */

export const COMPANY_META = {
  legalName: "Signal Studio Limited",
  type: "Private Company Limited by Shares (LTD) · Companies Act 2014",
  status: "pre-incorporation" as const,
  statusLabel: "Pre-incorporation · structure defined, shares not yet issued",
  incorporationTarget: "July 2026",
  registeredOffice: "320 Glantann, Castletroy, Limerick, V94 RTP1",
  director: "Ethan McNamara (sole director · EEA-resident, no §137 bond)",
  secretary: "Sheauveen McCallig (company secretary, required for a sole director)",
  nominalPerShare: "€0.001",
  giftModel: "Model B, Ethan subscribes for all 1,000,000, then gift-transfers 100,000 Class B to the Founding Member",
  revisedOn: "2026-06-19",
  // The vault holds the binding documents; this is the read-out.
  sources: [
    { label: "Constitution & share structure", href: "/hq/vault/legal-constitution-shares" },
    { label: "CRO incorporation runbook", href: "/hq/vault/legal-cro-incorporation" },
    { label: "Tax & gift valuation memo", href: "/hq/vault/legal-tax-valuation" },
    { label: "Shareholders' agreement", href: "/hq/vault/legal-agreement" },
  ],
};

export type Shareholder = {
  holder: string;
  /** Redacted label for the external view, no personal name. */
  redactedHolder: string;
  role: string;
  shareClass: "A, ordinary" | "B, Founder Circle";
  voting: boolean;
  shares: number;
  nominalEur: number;
  pct: number;
};

export const CAP_TABLE: {
  shareholders: Shareholder[];
  totalShares: number;
  totalNominalEur: number;
} = {
  shareholders: [
    {
      holder: "Ethan McNamara",
      redactedHolder: "Founder",
      role: "Founder · sole director",
      shareClass: "A, ordinary",
      voting: true,
      shares: 900_000,
      nominalEur: 900,
      pct: 90,
    },
    {
      holder: "Sheauveen McCallig",
      redactedHolder: "Founding Member",
      role: "Founding Member (Founder Circle)",
      shareClass: "B, Founder Circle",
      voting: false,
      shares: 100_000,
      nominalEur: 100,
      pct: 10,
    },
  ],
  totalShares: 1_000_000,
  totalNominalEur: 1_000,
};

export const CLASS_RIGHTS: Array<{ cls: string; rights: string }> = [
  {
    cls: "Class A, ordinary, voting",
    rights:
      "Full voting rights; dividends and capital as declared. The founder's controlling class.",
  },
  {
    cls: "Class B, Founder Circle, non-voting",
    rights:
      "Non-voting (save the statutory vote on varying Class B rights); ranks pari passu with Class A for dividends and on a return of capital, pro rata to nominal; no right to appoint a director; rights variable only with the Class B holder's written consent.",
  },
];

export const BENEFICIAL_OWNERS = {
  note: "RBO (Central Register of Beneficial Ownership), >25% test on shares or voting.",
  owners: [
    {
      holder: "Ethan McNamara",
      redactedHolder: "Founder",
      basis: "90%, the only beneficial owner over the 25% threshold",
    },
  ],
  excluded: "The Founding Member at 10% non-voting is below the threshold and is not a beneficial owner.",
};

export type IncorpStatus = "done" | "todo" | "future";

export type IncorpStep = { label: string; status: IncorpStatus; note?: string };
export type IncorpPhase = { id: string; title: string; blurb: string; steps: IncorpStep[] };

export const INCORPORATION_PHASES: IncorpPhase[] = [
  {
    id: "decisions",
    title: "Phase 1 · Pre-filing decisions",
    blurb: "Confirmed 2026-06-01. The structural calls are made.",
    steps: [
      { label: "Company name · Signal Studio Limited", status: "done", note: "still check availability on CORE" },
      { label: "Registered office, Castletroy, Limerick", status: "done" },
      { label: "Director, Ethan McNamara (no §137 bond)", status: "done" },
      { label: "Company secretary, Sheauveen McCallig", status: "done" },
      { label: "Nominal value, €0.001/share", status: "done" },
      { label: "Gift model, Model B", status: "done" },
      { label: "Execution as a deed", status: "done" },
      { label: "Constitution drafted with Class A/B structure", status: "todo" },
      { label: "Director/secretary identity verification (PPSN/IPN) ready", status: "todo" },
    ],
  },
  {
    id: "incorporate",
    title: "Phase 2 · Incorporate (CORE / Form A1)",
    blurb: "Targeted July 2026. Produces the Certificate of Incorporation + CRO number.",
    steps: [
      { label: "Register a CORE account (core.cro.ie)", status: "todo" },
      { label: "Complete Form A1 (name, type, office, officers, capital, subscribers)", status: "todo" },
      { label: "Upload the constitution", status: "todo" },
      { label: "Subscribers, Ethan subscribes for all 1,000,000 (Model B)", status: "todo" },
      { label: "Pay the fee (~€50, verify) and submit", status: "todo" },
      { label: "Receive Certificate of Incorporation + CRO number", status: "todo", note: "unblocks the €40k facility" },
    ],
  },
  {
    id: "post-incorp",
    title: "Phase 3 · Immediately post-incorporation",
    blurb: "Issue the shares and execute the gift while value is ~nominal (late July).",
    steps: [
      { label: "First director's minutes (adopt constitution, appoint secretary, approve issue)", status: "todo" },
      { label: "Issue shares per the cap table (900k A + 100k B to Ethan)", status: "todo" },
      { label: "Gift-transfer 100,000 B to the Founding Member (stock transfer, nil consideration)", status: "todo" },
      { label: "Write up registers of members + directors/secretary", status: "todo" },
      { label: "Date the Gift Valuation Note", status: "todo" },
      { label: "Sign the shareholders' agreement", status: "todo" },
      { label: "Issue the Founding Member's share certificate (SS-FC-M)", status: "todo" },
    ],
  },
  {
    id: "statutory",
    title: "Phase 4 · Statutory registrations",
    blurb: "Post-incorporation obligations; RBO within 5 months.",
    steps: [
      { label: "RBO, file beneficial ownership (Ethan, 90%) within 5 months", status: "todo" },
      { label: "Revenue / ROS, register for Corporation Tax (VAT only if thresholds require)", status: "todo" },
      { label: "Open a business bank account in the company name", status: "todo" },
      { label: "Company seal (optional, conventional for deeds/certs)", status: "future" },
    ],
  },
  {
    id: "housekeeping",
    title: "Phase 5 · Recurring housekeeping",
    blurb: "Don't miss the first annual return.",
    steps: [
      { label: "First Annual Return (Form B1), ARD ~6 months after incorporation", status: "future", note: "late filing loses audit exemption" },
      { label: "Maintain registers as the cap table changes", status: "future" },
      { label: "Keep agreement, valuation note, transfer form, certificate together", status: "future" },
    ],
  },
];

export const INCORP_TIMELINE: Array<{ milestone: string; target: string; gates: string }> = [
  { milestone: "Incorporate Signal Studio Limited", target: "July 2026", gates: "must exist before shares can issue; unblocks the facility" },
  { milestone: "Issue shares + gift-transfer + sign agreement", target: "Late July 2026", gates: "gift must land while value is ~nominal (tax)" },
  { milestone: "Founder Circle artifacts to print", target: "~1 August 2026", gates: "2-week print + delivery runway" },
  { milestone: "Full launch + Founder Circle send", target: "1 September 2026", gates: "the fixed date" },
  { milestone: "RBO (beneficial ownership) filing", target: "within 5 months", gates: "statutory; not launch-gating" },
];

export const INCORP_NOT_NEEDED = [
  "No authorised-capital ceiling (LTD)",
  "No memorandum + articles (LTD has a single constitution)",
  "No §137 non-resident bond (EEA-resident director)",
  "No CAT return expected (per the tax memo)",
  "No auditor in year one (audit exemption if filed on time)",
];

export function incorporationProgress() {
  const steps = INCORPORATION_PHASES.flatMap((p) => p.steps);
  const actionable = steps.filter((s) => s.status !== "future");
  const done = actionable.filter((s) => s.status === "done").length;
  return { done, total: actionable.length, all: steps.length };
}
