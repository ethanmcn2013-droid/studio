/**
 * Asset Command System — the launch-asset operating layer for Signal Studio.
 *
 * This is not a brand guide and not a wish-list. It is the standing decision
 * record for which launch assets must exist, in what order, why, and to what
 * bar — plus the reusable machinery (quality gate + Claude Design prompt
 * framework) for producing one asset at a time until it is right.
 *
 * It was convened as a strategic launch-production exercise against the
 * wedding-venue wedge, Limerick-first, founder-led, with the asset bank due
 * ready for 1 September 2026.
 *
 * Honesty contract: this is the PLAN and the SYSTEM, not the finished assets.
 * Design/copy status fields below tell the truth about each asset today; the
 * audit reads from the live HQ inventory (operating-system.ts · HQ_ASSETS).
 * No partner, press, statistic, testimonial, or permission is invented here —
 * any "Founding Limerick Partner" example is a specimen placeholder until a
 * real partner is signed.
 *
 * Source register: BRAND.md (voice, naming, visual register), the growth deck
 * (growth.signalstudio.ie), MARKETING_PLAN_6MO.md (Gate 0 = one paid premium
 * venue), and the live HQ asset inventory. If those move, reconcile here.
 *
 * Pure + client-safe — no server-only import.
 */

export const ACS_META = {
  title: "Asset Command System",
  kind: "Launch-asset operating layer",
  logline:
    "The standing decision record for which launch assets exist, in what order, why, and to what bar — plus the reusable quality gate and Claude Design prompt framework to produce them one at a time.",
  thesis:
    "Signal Studio does not need more assets. It needs the minimum complete premium bank that closes a venue, creates real proof, and survives a respected venue's front desk. Everything else is refused until proof exists.",
  launchHorizon: "1 September 2026",
  horizonNote:
    "Treated as the asset-bank readiness deadline, not a public countdown. BRAND.md §8 still governs outward copy: no urgency banners, no launch-date theatre.",
  wedge: "Wedding venues / premium hospitality, Limerick-first, founder-led",
  revisedOn: "2026-06-20",
  livesAt: [
    "Signal HQ · the Assets room governs production order",
    "feeds the venue CRM motion and the launch-readiness gate",
  ],
  references: [
    { label: "Brand handbook — voice, naming, visual register", href: "/hq/one-pagers/brand", external: false },
    { label: "Brand kit — the live system", href: "/brand", external: false },
    { label: "The Film System — motion brief", href: "/brand/motion-brief.html", external: false },
    { label: "Growth deck", href: "https://growth.signalstudio.ie/", external: true },
    { label: "Asset inventory (current state)", href: "/hq/assets", external: false },
  ] as Array<{ label: string; href: string; external: boolean }>,
};

export const EXECUTIVE_JUDGEMENT = [
  "The brand system, decks, financial pack, and product are well ahead of the sales-and-proof objects a venue actually touches. Signal Studio can describe itself beautifully to an investor and barely at all to a wedding coordinator across a table. That is the gap to close before 1 September.",
  "The bottleneck is not design capacity. It is the absence of a single keystone object — the venue one-pager — that locks the venue message and the print system that every other physical asset inherits. Build it first; extract the document shell and micro-label system from it rather than designing an abstract system in a vacuum.",
  "The discipline that wins here is refusal. No merch, no flyers, no laminated anything, no fabricated proof. The numbered Founding Partner system is the highest-leverage proof engine in the bank — but it stays a specimen placeholder until a real venue signs. Build the machine now so it fires the day proof is real.",
];

// ── The director panel — operating lenses, not roleplay. One decisive line each. ──

export type Director = {
  name: string;
  lens: string;
  call: string;
};

export const PANEL: Director[] = [
  { name: "Jobs", lens: "Product strategy · restraint · say no", call: "One object decides everything: the venue one-pager. Make it perfect, ship nothing else until it is, and refuse the merch reflex entirely." },
  { name: "Cook", lens: "Brand trust · premium execution · consistency", call: "Every printed object must pass the front-desk test of a premium venue. One print system, heavy uncoated stock, one earned indigo per object — no exceptions." },
  { name: "Norman", lens: "UX · cognitive load · non-technical clarity", call: "A coordinator must grasp the offer in seven seconds with no product vocabulary. If a sentence needs explaining, cut it." },
  { name: "Cuban", lens: "Go-to-market · sales motion · founder urgency", call: "Nothing matters until a founder can walk in, leave one object, and book a demo. One-pager, card, deck, outreach email — that is the revenue spine." },
  { name: "Drucker", lens: "Management · prioritisation · measurement", call: "Score every asset on revenue proximity, proof, and trust. Build only what scores; the rest is documented and deferred, not made." },
  { name: "Grove", lens: "Execution cadence · sequencing", call: "Sequence by dependency: keystone first, the objects that inherit it next, proof machinery armed but gated last. One asset at a time, finished before the next starts." },
  { name: "Buffett", lens: "Budget discipline · ROI · asset-to-revenue", call: "Spend the founder's scarcest hours on assets nearest a signed venue. Print only what a front desk will keep; everything else is a liability dressed as marketing." },
  { name: "Specter", lens: "Legal · permission · claims · press risk", call: "No invented proof, ever. Named partners only with written permission; every Founding Partner example marked specimen until signed. A permission form ships before the social system does." },
  { name: "Pixar", lens: "Story · emotional resonance · launch narrative", call: "The story is one wedding running calmly through four views. The one-pager and the film tell the same story in two media — keep them in lockstep." },
  { name: "Jensen", lens: "Technical feasibility · product truth · demo integrity", call: "Every screenshot must be a real screen with real-shaped data. No fake dashboards. The wedding workflow shown must be one a coordinator can actually run today." },
  { name: "Da Vinci", lens: "Notes — capture clarity", call: "Show capture as the calm first move: a wedding enquiry caught in three seconds. Notes is where the story starts on every asset." },
  { name: "Dali", lens: "Tasks — execution clarity", call: "Show the run-sheet writing itself from the note. Tasks is the proof that nothing falls through — the coordinator's relief, made visible." },
  { name: "Caravaggio", lens: "Timeline — direction clarity", call: "Show the shared timeline the couple can see. Timeline is the trust object — the venue looks organised to its own client." },
  { name: "Einstein", lens: "Signal — attention clarity", call: "Show the one thing due today, everything else quiet. Signal is the payoff line of every asset: the status meeting that never had to happen." },
];

export type ConsensusBlock = { label: string; points: string[] };

export const PANEL_CONSENSUS: ConsensusBlock[] = [
  {
    label: "Build first — the keystone",
    points: [
      "The venue one-pager (A4). It locks the venue message and instantiates the print system (document shell + micro-label grammar) that every other physical object inherits.",
      "Do not design an abstract brand system in a vacuum. Build the highest-value object and extract the system from it.",
    ],
  },
  {
    label: "The minimum complete bank",
    points: [
      "Revenue spine: one-pager · founder card system · 10-slide venue deck · outreach + follow-up · demo script + objection sheet.",
      "Proof spine: real product screenshots (the wedding workflow) · numbered Founding Partner system · social proof templates — all armed, gated on real proof.",
      "Launch spine: press kit shell · launch-week kit · website hero update. Press releases only when real proof exists.",
    ],
  },
  {
    label: "Refuse for now",
    points: [
      "No merch-for-merch's-sake, no laminated anything, no flyer drops or windscreen leaflets, no discount theatre, no urgency banners.",
      "No flagship film as a blocker (the demo-film scaffold covers the need; render when the pipeline is free).",
      "Student ambassador kit deferred to the secondary wedge — built after the venue spine and first proof, not before.",
    ],
  },
  {
    label: "Biggest brand risk",
    points: [
      "A weak or generic printed object on a premium front desk. One bad leave-behind undoes the positioning faster than ten good emails build it.",
      "Any invented or prematurely-named proof. Specimen discipline is non-negotiable.",
    ],
  },
];

// ── Master asset taxonomy — curated, scored, ruthless. Not every conceivable asset. ──

export type Tri = "High" | "Medium" | "Low";
export type Status = "exists" | "partial" | "missing";
export type Family =
  | "A · Core brand system"
  | "B · Venue sales kit"
  | "C · Founding Partner kit"
  | "D · Press kit"
  | "E · Student ambassador kit"
  | "F · Social proof system"
  | "G · Local physical presence"
  | "H · Motion & film"
  | "I · Product demonstration"
  | "J · Launch week";

export type Asset = {
  id: string;
  name: string;
  family: Family;
  audience: string;
  purpose: string;
  funnel: "Awareness" | "Consideration" | "Conversion" | "Proof" | "Onboarding" | "Launch";
  revenue: Tri;
  proof: Tri;
  brandRisk: Tri;
  difficulty: Tri;
  required: boolean; // required before 1 Sep launch
  dependency: string;
  owner: string;
  format: string;
  copy: Status;
  design: Status;
  score: number; // out of 100, per the weighted model
  rationale: string;
};

/**
 * Scoring model (per the brief): revenue 30 · proof 20 · brand trust 20 ·
 * reusability 10 · launch timing 10 · feasibility 10. Scores are the panel's
 * weighted judgement, not a spreadsheet output — they exist to force order.
 */
export const TAXONOMY: Asset[] = [
  // A · Core brand system
  { id: "doc-shell", name: "Document shell + micro-label system", family: "A · Core brand system", audience: "Internal / every asset", purpose: "The print grammar every physical object inherits: margins, hairlines, mono micro-labels, one earned indigo.", funnel: "Consideration", revenue: "High", proof: "Medium", brandRisk: "High", difficulty: "Medium", required: true, dependency: "Extracted from the venue one-pager", owner: "Founder / Brand", format: "Spec + reusable layout", copy: "exists", design: "exists", score: 88, rationale: "Shipped 2026-07-01 in the collateral repo (shell/print/social CSS + render pipeline); extracted from the venue one-pager draft as doctrine required." },
  { id: "founder-card", name: "Founder business card system", family: "A · Core brand system", audience: "Venue owners / coordinators", purpose: "The cheapest premium-signal object; gates every in-person meeting.", funnel: "Awareness", revenue: "High", proof: "Low", brandRisk: "High", difficulty: "Low", required: true, dependency: "doc-shell", owner: "Founder", format: "Print · heavy uncoated · 55×85mm", copy: "exists", design: "exists", score: 84, rationale: "Shipped 2026-07-01 — print PDFs + previews at /brand/collateral/identity/. Awaits founder sign-off before print." },
  { id: "email-sig", name: "Email signature + letterhead", family: "A · Core brand system", audience: "Venues / press / partners", purpose: "Consistent founder correspondence surface.", funnel: "Consideration", revenue: "Medium", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: true, dependency: "doc-shell", owner: "Founder", format: "HTML sig + A4 letterhead", copy: "exists", design: "exists", score: 70, rationale: "Shipped 2026-07-01 — signature HTML/txt + letterhead PDFs at /brand/collateral/identity/. Location line changed Dublin→Limerick; founder to confirm." },
  { id: "brand-kit", name: "Brand kit (live)", family: "A · Core brand system", audience: "Internal / collaborators", purpose: "Wordmarks, dot, lockups, palette, motion canon.", funnel: "Consideration", revenue: "Low", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: false, dependency: "—", owner: "Brand", format: "Live page + zip", copy: "exists", design: "exists", score: 60, rationale: "Already shipped; the foundation, not a launch task." },

  // B · Venue sales kit
  { id: "venue-onepager", name: "Venue one-pager (A4)", family: "B · Venue sales kit", audience: "Venue owner / wedding coordinator", purpose: "The leave-behind that explains the offer in seven seconds and books a demo.", funnel: "Conversion", revenue: "High", proof: "Medium", brandRisk: "High", difficulty: "Medium", required: true, dependency: "—", owner: "Founder", format: "A4 print + PDF", copy: "exists", design: "partial", score: 96, rationale: "The keystone: drafted 2026-07-01 as the shell-calibration object (collateral repo, marked DRAFT); finishing pass waits on real wedding-workflow screenshots." },
  { id: "venue-deck", name: "Venue pitch deck (10 slides)", family: "B · Venue sales kit", audience: "Venue decision-maker", purpose: "The seated conversation backbone; demo container.", funnel: "Conversion", revenue: "High", proof: "Medium", brandRisk: "Medium", difficulty: "Medium", required: true, dependency: "venue-onepager · screenshots", owner: "Founder", format: "Deck (HTML/PDF) 16:9", copy: "partial", design: "missing", score: 87, rationale: "Inherits one-pager message; the conversion conversation." },
  { id: "demo-script", name: "Demo script + objection sheet", family: "B · Venue sales kit", audience: "Founder (in the room)", purpose: "Run the demo and handle the five real objections without improvising.", funnel: "Conversion", revenue: "High", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: true, dependency: "screenshots", owner: "Founder", format: "1–2pp internal doc", copy: "partial", design: "missing", score: 82, rationale: "Founder-time leverage; turns interest into a booked pilot." },
  { id: "outreach-seq", name: "Founder outreach + follow-up email", family: "B · Venue sales kit", audience: "Venue owner / coordinator", purpose: "The founder-signed first touch and the one follow-up.", funnel: "Awareness", revenue: "High", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: true, dependency: "venue-onepager", owner: "Founder", format: "Plain-text email + attachment", copy: "partial", design: "missing", score: 83, rationale: "The actual revenue trigger; copy mostly exists, needs the gate." },
  { id: "venue-leavebehind", name: "A5 venue leave-behind", family: "B · Venue sales kit", audience: "Front desk / coordinator", purpose: "A smaller object to leave when the one-pager is too much.", funnel: "Awareness", revenue: "Medium", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: false, dependency: "venue-onepager", owner: "Founder", format: "A5 print", copy: "missing", design: "missing", score: 64, rationale: "Derivative of the one-pager; build only if a venue asks." },
  { id: "qr-cards", name: "Workspace QR cards", family: "B · Venue sales kit", audience: "Venue staff", purpose: "Calm route from physical object to a real workspace.", funnel: "Onboarding", revenue: "Medium", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: false, dependency: "doc-shell · QR destination rules", owner: "Founder", format: "A6/A7 print", copy: "missing", design: "missing", score: 58, rationale: "Useful post-demo; not a pre-outreach blocker." },
  { id: "pricing-explainer", name: "Pricing / invoice explanation", family: "B · Venue sales kit", audience: "Venue decision-maker", purpose: "Make the €1.5k–€4k/yr ask legible and calm.", funnel: "Conversion", revenue: "High", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: true, dependency: "venue-deck", owner: "Founder", format: "1pp + invoice template", copy: "partial", design: "missing", score: 76, rationale: "Removes the awkward money moment; closes the loop." },

  // C · Founding Partner kit
  { id: "fp-signing-card", name: "Numbered partner signing card", family: "C · Founding Partner kit", audience: "First signed venues", purpose: "The physical moment of becoming Founding Limerick Partner No. __.", funnel: "Proof", revenue: "Medium", proof: "High", brandRisk: "High", difficulty: "Medium", required: true, dependency: "permission-form", owner: "Founder", format: "Heavy card, numbered, desk-safe", copy: "partial", design: "missing", score: 80, rationale: "Specimen now; the proof engine the day a venue signs." },
  { id: "fp-welcome", name: "Welcome letter + certificate / desk object", family: "C · Founding Partner kit", audience: "Signed venue", purpose: "Make the partnership feel earned and premium on the desk.", funnel: "Onboarding", revenue: "Low", proof: "High", brandRisk: "High", difficulty: "Medium", required: false, dependency: "fp-signing-card", owner: "Founder", format: "A4 letter + desk certificate", copy: "missing", design: "missing", score: 68, rationale: "High proof value; build with the first real signing." },
  { id: "permission-form", name: "Permission form + approval language", family: "C · Founding Partner kit", audience: "Signed venue (legal)", purpose: "Written permission before any named use of a partner.", funnel: "Proof", revenue: "Low", proof: "High", brandRisk: "High", difficulty: "Low", required: true, dependency: "—", owner: "Founder / Legal", format: "1pp form + clause library", copy: "missing", design: "missing", score: 78, rationale: "Must exist before the social system can ever name a partner." },
  { id: "fp-badge", name: "Partner mark / badge + web listing", family: "C · Founding Partner kit", audience: "Public / signed venues", purpose: "A restrained badge a venue can show; a web listing of real partners.", funnel: "Proof", revenue: "Low", proof: "High", brandRisk: "High", difficulty: "Medium", required: false, dependency: "permission-form", owner: "Brand", format: "SVG mark + web component", copy: "missing", design: "missing", score: 66, rationale: "Compounds proof; gated entirely on real, permissioned partners." },

  // D · Press kit
  { id: "press-shell", name: "Press kit shell (release + fact sheet + bio + media block)", family: "D · Press kit", audience: "Local + national press", purpose: "Everything a journalist needs, armed and ready to fire on real proof.", funnel: "Launch", revenue: "Low", proof: "Medium", brandRisk: "Medium", difficulty: "Medium", required: true, dependency: "screenshots · headshot", owner: "Founder", format: "Web press page + PDFs", copy: "partial", design: "missing", score: 72, rationale: "Build the shell now; the release body waits for proof." },
  { id: "press-logo-pack", name: "Logo pack + founder headshot spec", family: "D · Press kit", audience: "Press / partners", purpose: "Correct marks and a headshot brief so coverage looks right.", funnel: "Launch", revenue: "Low", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: true, dependency: "brand-kit", owner: "Brand", format: "Zip + shoot brief", copy: "partial", design: "partial", score: 62, rationale: "Mostly exists; needs a headshot brief and press-correct exports." },
  { id: "press-faq", name: "Company fact sheet + FAQ (local + national angle)", family: "D · Press kit", audience: "Press", purpose: "The Limerick-first story and the national story, no invented claims.", funnel: "Launch", revenue: "Low", proof: "Medium", brandRisk: "High", difficulty: "Low", required: false, dependency: "press-shell", owner: "Founder", format: "Web + PDF", copy: "partial", design: "missing", score: 60, rationale: "Two angles, one truth; claims-checked, no fabricated proof." },

  // E · Student ambassador kit (secondary wedge — deferred)
  { id: "student-onepager", name: "Student one-pager + society pitch sheet", family: "E · Student ambassador kit", audience: "Students / societies / committees", purpose: "The secondary-wedge equivalent of the venue one-pager.", funnel: "Awareness", revenue: "Medium", proof: "Medium", brandRisk: "Medium", difficulty: "Low", required: false, dependency: "venue-onepager (pattern)", owner: "Founder", format: "A4 + A5 print", copy: "missing", design: "missing", score: 54, rationale: "Secondary wedge; inherits the venue one-pager pattern later." },
  { id: "campus-poster", name: "A2 campus permission-board poster", family: "E · Student ambassador kit", audience: "Students", purpose: "Permission-led campus presence, one useful object.", funnel: "Awareness", revenue: "Low", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: false, dependency: "doc-shell", owner: "Founder", format: "A2 print", copy: "missing", design: "missing", score: 46, rationale: "After first proof; permission-led placement only." },
  { id: "ambassador-brief", name: "Ambassador invitation + briefing + code/QR", family: "E · Student ambassador kit", audience: "Student ambassadors", purpose: "A small, real ambassador program — not influencer hype.", funnel: "Onboarding", revenue: "Medium", proof: "Medium", brandRisk: "Medium", difficulty: "Medium", required: false, dependency: "student-onepager", owner: "Founder", format: "Doc + QR card", copy: "missing", design: "missing", score: 48, rationale: "Earns its place only after the venue spine is done." },

  // F · Social proof system
  { id: "fp-post-system", name: "\"Founding Limerick Partner No. __\" post system", family: "F · Social proof system", audience: "LinkedIn / Instagram / web", purpose: "Numbered, restrained proof posts across LinkedIn, IG square, IG story, web card.", funnel: "Proof", revenue: "Medium", proof: "High", brandRisk: "High", difficulty: "Medium", required: true, dependency: "permission-form · fp-signing-card", owner: "Founder / Brand", format: "Template set + export rules + alt-text", copy: "exists", design: "exists", score: 81, rationale: "Shipped 2026-07-01 as part of the S·1–S·6 social system at /brand/collateral/social/ — structurally specimen until the first real signing." },
  { id: "social-permission", name: "Social permission workflow", family: "F · Social proof system", audience: "Internal", purpose: "The checklist that gates every named-partner post.", funnel: "Proof", revenue: "Low", proof: "High", brandRisk: "High", difficulty: "Low", required: true, dependency: "permission-form", owner: "Founder", format: "Workflow doc", copy: "missing", design: "missing", score: 70, rationale: "No post goes out without it; protects the whole position." },

  // G · Local physical presence
  { id: "cafe-card", name: "Café card / A6 card", family: "G · Local physical presence", audience: "Limerick walk-by / café tables", purpose: "A quiet, permission-placed object that earns a glance, never a flyer.", funnel: "Awareness", revenue: "Low", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: false, dependency: "founder-card (grammar)", owner: "Founder", format: "A6 print + placement rules", copy: "exists", design: "exists", score: 56, rationale: "Shipped 2026-07-01 — campaign-line A6 at /brand/collateral/identity/; placement rules in print-notes. Placement-led, never dropped." },
  { id: "print-specs", name: "Print specs + QR destination + placement rules", family: "G · Local physical presence", audience: "Internal / printer", purpose: "One spec so every physical object prints and lands consistently.", funnel: "Onboarding", revenue: "Low", proof: "Low", brandRisk: "Medium", difficulty: "Low", required: true, dependency: "doc-shell", owner: "Founder", format: "Spec doc", copy: "missing", design: "missing", score: 64, rationale: "Cheap insurance against an off-brand print run." },

  // H · Motion & film
  { id: "demo-film", name: "Hero demo film — One Wedding, Four Views", family: "H · Motion & film", audience: "Homepage / deck / social", purpose: "The four-products-one-system idea felt, not explained.", funnel: "Awareness", revenue: "Medium", proof: "Medium", brandRisk: "Medium", difficulty: "High", required: false, dependency: "screenshots", owner: "Creative", format: "30s film (Remotion) + vertical cut", copy: "exists", design: "partial", score: 65, rationale: "Scaffold ready; render when the pipeline is free — not a blocker." },

  // I · Product demonstration
  { id: "screenshots", name: "Product screenshots — wedding workflow (real)", family: "I · Product demonstration", audience: "Every visual asset", purpose: "Notes → Tasks → Timeline → Signal, shown on real screens with real-shaped data.", funnel: "Proof", revenue: "High", proof: "High", brandRisk: "High", difficulty: "Medium", required: true, dependency: "wedding workspace seed", owner: "Founder / Product", format: "PNG set + device frames", copy: "partial", design: "missing", score: 86, rationale: "Feeds one-pager, deck, press, film; must be real, never faked." },
  { id: "device-frames", name: "Device frames + before/after examples", family: "I · Product demonstration", audience: "Decks / web / press", purpose: "Consistent framing and the calm before/after of a venue's week.", funnel: "Proof", revenue: "Medium", proof: "High", brandRisk: "Medium", difficulty: "Low", required: false, dependency: "screenshots", owner: "Brand", format: "Frame set + layouts", copy: "missing", design: "missing", score: 63, rationale: "Multiplies the value of the screenshots; build alongside them." },

  // J · Launch week
  { id: "launch-kit", name: "Launch-week kit (announcement · founder post · hero update · FAQ)", family: "J · Launch week", audience: "Public / Limerick / press", purpose: "The coordinated, calm launch surface — no hype, no banners.", funnel: "Launch", revenue: "Medium", proof: "Medium", brandRisk: "High", difficulty: "Medium", required: true, dependency: "screenshots · press-shell", owner: "Founder", format: "Copy set + web hero", copy: "partial", design: "missing", score: 74, rationale: "Ties the bank together for the week itself; restraint is the brief." },
  { id: "proof-gate-fields", name: "CRM tracking fields + proof-gate dashboard", family: "J · Launch week", audience: "Internal", purpose: "Track which proof is real so claims never get ahead of reality.", funnel: "Launch", revenue: "Medium", proof: "High", brandRisk: "High", difficulty: "Low", required: true, dependency: "—", owner: "Founder", format: "HQ fields (mostly exist)", copy: "partial", design: "partial", score: 71, rationale: "Largely built in HQ; the discipline that keeps proof honest." },
];

// ── Ranked priority lists ──

export type RankedList = { key: string; title: string; note: string; assetIds: string[] };

export const RANKED: RankedList[] = [
  {
    key: "before-outreach",
    title: "1 · Must exist before any serious venue outreach",
    note: "The founder cannot walk into a premium venue without these. Nothing else gets made until they are done.",
    assetIds: ["venue-onepager", "doc-shell", "screenshots", "founder-card", "outreach-seq", "demo-script"],
  },
  {
    key: "before-launch",
    title: "2 · Must exist before public launch week",
    note: "Armed and gated. The proof machinery is built but only fires on real, permissioned proof.",
    assetIds: ["venue-deck", "pricing-explainer", "permission-form", "fp-signing-card", "fp-post-system", "social-permission", "press-shell", "launch-kit", "proof-gate-fields", "print-specs", "email-sig"],
  },
  {
    key: "after-proof",
    title: "3 · Can wait until after first proof / first paid venue",
    note: "Real assets, deliberately deferred. Building them earlier would be motion without leverage.",
    assetIds: ["fp-welcome", "fp-badge", "press-faq", "press-logo-pack", "device-frames", "demo-film", "venue-leavebehind", "qr-cards", "cafe-card", "student-onepager", "ambassador-brief", "campus-poster"],
  },
];

// ── The first 10 assets to create, in exact order ──

export type FirstAsset = {
  order: number;
  assetId: string;
  name: string;
  type: "Revenue" | "Proof" | "Press" | "Student growth" | "Trust";
  whyNow: string;
  riskRemoved: string;
  dependents: string;
  excellent: string;
  fails: string;
};

export const FIRST_TEN: FirstAsset[] = [
  { order: 1, assetId: "venue-onepager", name: "Venue one-pager (A4)", type: "Revenue", whyNow: "It is the keystone — it locks the venue message and the print system every other physical object inherits.", riskRemoved: "Removes the risk of walking into a premium venue with nothing on-brand to leave behind.", dependents: "Document shell, micro-label system, venue deck, outreach email, leave-behind, partner pack.", excellent: "A coordinator grasps the offer in seven seconds, keeps it on the desk, and asks for a demo.", fails: "Reads like a SaaS flyer, needs explaining, or feels disposable on a premium front desk." },
  { order: 2, assetId: "screenshots", name: "Product screenshots — wedding workflow", type: "Proof", whyNow: "Every visual asset needs real screens; nothing convincing can be made without them.", riskRemoved: "Removes the risk of faked or generic product imagery — the fastest way to lose a premium buyer's trust.", dependents: "One-pager, deck, press kit, demo film, device frames.", excellent: "Real screens, real-shaped wedding data, the Notes→Tasks→Timeline→Signal story legible at a glance.", fails: "Fabricated dashboards, lorem data, or screens a coordinator could not actually produce." },
  { order: 3, assetId: "founder-card", name: "Founder business card system", type: "Trust", whyNow: "The first object a venue holds; cheapest possible premium signal and it gates every in-person meeting.", riskRemoved: "Removes the credibility gap in the opening seconds of a face-to-face introduction.", dependents: "Café card, A6 card, the whole card grammar of the physical kit.", excellent: "Heavy uncoated stock, one earned indigo, document-like restraint — it feels like a respected company.", fails: "Glossy, busy, laminated, or indistinguishable from a generic startup card." },
  { order: 4, assetId: "outreach-seq", name: "Founder outreach + follow-up email", type: "Revenue", whyNow: "It is the actual revenue trigger; the copy mostly exists and only needs the gate and the attachment.", riskRemoved: "Removes the risk of the pipeline never starting — or starting with off-brand, spammy first contact.", dependents: "The entire CRM motion depends on this being ready and gated.", excellent: "Founder-signed, plainly written, one ask, the one-pager attached, no mass-blast energy.", fails: "Reads as outbound spam, over-claims, or goes out before the asset gate clears." },
  { order: 5, assetId: "demo-script", name: "Demo script + objection sheet", type: "Revenue", whyNow: "The founder's time is the scarcest input; a tight script turns interest into a booked pilot.", riskRemoved: "Removes the risk of an improvised demo that wanders or fails to handle the five real objections.", dependents: "The venue deck's narrative and the pricing conversation both lean on it.", excellent: "Seven-minute run, plain English, every objection answered in one calm sentence.", fails: "Feature-tour energy, jargon, or no answer to 'why not just use a spreadsheet'." },
  { order: 6, assetId: "venue-deck", name: "Venue pitch deck (10 slides)", type: "Revenue", whyNow: "The seated-conversation backbone; it inherits the one-pager message and frames the demo.", riskRemoved: "Removes the risk of a meandering meeting with no structure toward a pilot ask.", dependents: "Pricing explainer and the demo flow sit inside it.", excellent: "Ten restrained slides, one idea each, the wedding story carried by real screenshots.", fails: "Forty slides, feature grids, or three-adjective hero slides." },
  { order: 7, assetId: "pricing-explainer", name: "Pricing / invoice explanation", type: "Revenue", whyNow: "Closes the loop — makes the €1.5k–€4k/yr ask legible and calm so the money moment isn't awkward.", riskRemoved: "Removes the risk of a warm demo stalling at an unclear or apologetic price.", dependents: "The invoice template and the close itself.", excellent: "One page, one number, the value framed in the venue's own terms, no discount theatre.", fails: "Tiered-pricing complexity, hedging, or any 'launch offer' urgency." },
  { order: 8, assetId: "permission-form", name: "Permission form + approval language", type: "Proof", whyNow: "It must exist before any named-partner asset can be made — it is the legal floor of the proof system.", riskRemoved: "Removes the legal and brand risk of naming or implying a partner without written permission.", dependents: "Numbered signing card, social proof system, partner web listing, press proof inserts.", excellent: "One clear page a venue signs without hesitation; a clause library for every use.", fails: "Legalese that scares a venue, or gaps that let an unpermissioned name slip out." },
  { order: 9, assetId: "fp-post-system", name: "Founding Partner numbered system (card + post templates)", type: "Proof", whyNow: "The compounding proof engine; build the machine now so it fires the day a real venue signs.", riskRemoved: "Removes the risk of improvising proof under pressure and getting the specimen/real line wrong.", dependents: "LinkedIn, Instagram square + story, web card, press proof insert.", excellent: "Numbered, restrained, instantly recognisable; specimen versions clearly marked until real.", fails: "Celebratory hype, fabricated numbers, or a real-looking post before a partner is signed." },
  { order: 10, assetId: "launch-kit", name: "Launch-week kit", type: "Press", whyNow: "It ties the bank into one coordinated, calm launch surface for the week itself.", riskRemoved: "Removes the risk of an uncoordinated or hyped launch that contradicts the positioning.", dependents: "Website hero update, FAQ, founder post, local press email.", excellent: "Quiet confidence across every surface; one story, no banners, no countdowns.", fails: "Urgency theatre, scattered messaging, or claims that outrun real proof." },
];

// ── The asset quality gate — every asset passes before production ──

export type GateCheck = { id: number; name: string; question: string; bar: string };

export const QUALITY_GATE: GateCheck[] = [
  { id: 1, name: "Brand restraint", question: "Is there exactly one earned indigo accent, no decorative noise, no unsanctioned gradient?", bar: "White / black / indigo only. One accent per object. Hairlines do the work shadows would." },
  { id: 2, name: "Premium front-desk", question: "Would a respected Limerick venue feel comfortable leaving this on its front desk?", bar: "Looks and reads like a premium, founder-led company — never a startup flyer." },
  { id: 3, name: "Non-technical clarity", question: "Can a wedding coordinator grasp it in seven seconds with no product vocabulary?", bar: "Plain English at ~7th-grade level. No PM, AI, or tech jargon. Outcome before mechanism." },
  { id: 4, name: "Proof / claims", question: "Is every claim true, and is every named partner real and permissioned?", bar: "No invented proof, press, stats, or testimonials. Specimen examples clearly marked." },
  { id: 5, name: "Permission", question: "Is there written permission for every name, logo, or quote used?", bar: "No named use without a signed permission form. Placement is permission-led only." },
  { id: 6, name: "Copy precision", question: "Is every word declarative, banned-word-free, and earning its place?", bar: "Verbs over nouns, no exclamation marks, no three-adjective trios. Cut anything that needs explaining." },
  { id: 7, name: "Accessibility", question: "Does it meet contrast, alt-text, and legibility minimums?", bar: "WCAG AA contrast, real alt text, type legible at intended size and distance." },
  { id: 8, name: "Print / export", question: "Are bleed, stock, dimensions, and PDF/X output correct for the printer?", bar: "Heavy uncoated stock, correct bleed and safe margins, CMYK-aware, print-ready PDF." },
  { id: 9, name: "Reusability", question: "Does it strengthen the system, or fork it?", bar: "Inherits the document shell and micro-label grammar; contributes a reusable pattern." },
  { id: 10, name: "Founder sign-off", question: "Has the founder confirmed it would represent the company to a venue?", bar: "Explicit founder yes — the final gate before anything is printed or sent." },
];

// ── The Claude Design prompt framework — 16 sections, reusable for any one asset ──

export type FrameworkSection = { n: number; title: string; guidance: string };

export const PROMPT_FRAMEWORK: FrameworkSection[] = [
  { n: 1, title: "Asset name", guidance: "The exact asset and format, e.g. 'Venue one-pager (A4, single-sided)'." },
  { n: 2, title: "Business objective", guidance: "The one commercial job this asset does. Tie it to revenue, proof, trust, press, or launch clarity." },
  { n: 3, title: "Audience", guidance: "Who holds it and what they know — name the real person (a wedding coordinator), not a segment." },
  { n: 4, title: "Moment of use", guidance: "Exactly when and where it is used: left on a desk after a meeting, attached to an email, shown on screen." },
  { n: 5, title: "Source context", guidance: "The brand handbook, the growth deck, and the real product the asset must stay true to. Link them." },
  { n: 6, title: "Required copy", guidance: "Provide exact copy or clearly-marked placeholder copy. Never let Claude Design invent claims or proof." },
  { n: 7, title: "Visual hierarchy", guidance: "What the eye must hit first, second, third. The seven-second read, named explicitly." },
  { n: 8, title: "Layout requirements", guidance: "Grid, margins, regions, and how the document shell and micro-labels are used." },
  { n: 9, title: "Brand rules", guidance: "White/black/indigo, one earned accent, Geist + Geist Mono, hairlines, heavy uncoated feel." },
  { n: 10, title: "What to avoid", guidance: "The explicit refusal list — no SaaS people, no fake dashboards, no gradients, no hype, no jargon." },
  { n: 11, title: "Print / export specifications", guidance: "Dimensions, bleed, safe area, stock, colour space, and the exact deliverable file types." },
  { n: 12, title: "Accessibility requirements", guidance: "Contrast, minimum type sizes, alt text where digital, legibility at real distance." },
  { n: 13, title: "Variants required", guidance: "The minimum set: e.g. print A4, screen PDF, and a clearly-marked specimen version." },
  { n: 14, title: "Quality bar", guidance: "Point Claude Design at the 10-point quality gate; the asset must pass all ten." },
  { n: 15, title: "Final deliverables", guidance: "The exact files expected back, named and formatted, ready for the founder sign-off gate." },
  { n: 16, title: "Self-review checklist", guidance: "A short checklist Claude Design runs before returning the draft — the gate, in question form." },
];

// ── Completed Claude Design prompts — the growing, paste-ready library ──

export type CompletedPrompt = {
  id: string;
  asset: string;
  intent: string;
  status: "ready" | "blocked";
  body: string;
};

export const COMPLETED_PROMPTS: CompletedPrompt[] = [
  {
    id: "venue-onepager",
    asset: "Venue one-pager (A4, single-sided, print + screen PDF)",
    intent:
      "The revenue keystone — explains the offer in seven seconds and instantiates the print system every other physical object inherits.",
    status: "ready",
    body: `1 · ASSET NAME
Signal Studio — Venue One-Pager. A4, single-sided. Print version (heavy uncoated leave-behind) and a screen PDF for email attachment.

2 · BUSINESS OBJECTIVE
The first premium object a wedding venue holds. It must explain what Signal Studio does for a venue in seven seconds, feel safe on a premium front desk, and earn one action: book a demo. This is the revenue keystone — it locks the venue message and the print system every other physical asset inherits.

3 · AUDIENCE
A wedding coordinator or venue owner in Limerick. Runs many weddings at once, lives in email, WhatsApp, and a notebook, would never call their work "project management" and has no patience for software vocabulary. Premium, time-poor, allergic to anything that looks cheap or pushy.

4 · MOMENT OF USE
Left on a desk at the end of a short founder meeting, or attached to a founder-signed email. It is read alone, after the founder has gone, in under a minute. It must survive sitting on a premium front desk for a week without looking out of place.

5 · SOURCE CONTEXT
Stay true to: the Signal Studio brand handbook (voice: declarative, plain English, no jargon, no exclamation marks; visual: white/black/indigo #4f46e5, Geist + Geist Mono, hairlines, one earned accent), the growth deck (growth.signalstudio.ie), and the real product. The four products are Notes (capture), Tasks (execution), Timeline (direction), Signal (attention) — four products, one system.

6 · REQUIRED COPY (use as written; placeholders clearly marked)
Eyebrow (mono, uppercase): SIGNAL STUDIO · FOR WEDDING VENUES
Headline: Run every wedding without the status meeting.
Subhead: Four calm views — capture, run-sheet, shared timeline, and the one thing due today — so nothing falls through and the couple sees a venue that has it handled.
Three quiet proof lines (no metrics invented):
 — Capture an enquiry in three seconds. It becomes the run-sheet itself.
 — Share a timeline the couple can actually see. You look organised because you are.
 — Open it in the morning and see the one thing that needs you today.
The ask: A short demo, on your desk, at your pace. No setup, no jargon, no contract to read.
Footer block: hello@signalstudio.ie · signalstudio.ie · Limerick · [SPECIMEN: "Founding Limerick Partner programme — by invitation" — include only as a specimen line, clearly not implying any real partner yet].
QR: links to a real venue workspace demo destination (confirm URL before print).

7 · VISUAL HIERARCHY
First: the headline. Second: the four-views idea (a single restrained diagram or four labelled lines, real screenshot crops if available — never faked). Third: the ask + how to reach the founder. The eye should land headline → what it is → what to do, in that order, in seven seconds.

8 · LAYOUT REQUIREMENTS
Establish the reusable document shell here: generous margins, a hairline rule under the eyebrow, mono micro-labels for each region, a single column with one calm diagram band. This one-pager defines the grid the deck, leave-behind, and partner pack will inherit. Leave deliberate whitespace — restraint is the message.

9 · BRAND RULES
White paper (#ffffff / #fafafa recessed). Ink black for text. Exactly one earned indigo accent (#4f46e5) — use it once, with intent. Geist Sans for everything, Geist Mono for the eyebrow and micro-labels. Hairlines, never shadows. No gradient. Feels like heavy uncoated stock.

10 · WHAT TO AVOID
No SaaS cartoon people. No fake dashboards or invented screens. No stock photography. No gradients or glow. No three-adjective hero trios. No PM/AI/tech jargon. No exclamation marks. No "SAVE 20%", no urgency banner, no countdown. Nothing laminated or glossy. Nothing that needs explaining.

11 · PRINT / EXPORT SPECIFICATIONS
A4 (210×297mm), single-sided. 3mm bleed, 10mm safe margin. CMYK-aware, print-ready PDF/X-1a. Heavy uncoated stock (≥300gsm). Also export a screen-optimised RGB PDF for email. Keep file size email-friendly.

12 · ACCESSIBILITY REQUIREMENTS
WCAG AA contrast for all text. Body type no smaller than 10pt at print size. The indigo accent must not be the only carrier of meaning. The screen PDF must be tagged with real alt text on any image.

13 · VARIANTS REQUIRED
(a) Print A4 (CMYK, bleed). (b) Screen PDF (RGB, email-sized). (c) A clearly-marked SPECIMEN variant where the Founding Partner line is visibly a placeholder — for internal review only.

14 · QUALITY BAR
Must pass all ten checks of the Asset Quality Gate: brand restraint, premium front-desk, non-technical clarity, proof/claims, permission, copy precision, accessibility, print/export, reusability, founder sign-off. Do not return a draft that fails any one of them.

15 · FINAL DELIVERABLES
venue-onepager-print.pdf (A4, CMYK, bleed) · venue-onepager-screen.pdf (RGB) · venue-onepager-specimen.pdf · the editable source · and a one-line note on what the founder should check before printing.

16 · SELF-REVIEW CHECKLIST (run before returning)
Would a premium venue keep this on its desk? Is there exactly one indigo accent? Can a coordinator grasp it in seven seconds? Is every claim true and every partner reference a clear specimen? Is there any banned word, gradient, or fake screen? Is it print-ready at A4 with bleed? Does it establish a document shell the next asset can inherit?

HOW TO JUDGE SUCCESS
The one-pager succeeds if a busy wedding coordinator, reading it alone for under a minute, understands the offer, trusts the company, and wants the demo — and if the founder would be proud to see it sitting on the front desk of the best venue in Limerick.`,
  },
  {
    id: "founder-card",
    asset: "Founder business card (85×55mm, double-sided, print + screen preview)",
    intent:
      "The cheapest premium-signal object; the first thing a venue holds, and it sets the card grammar the café and A6 cards inherit.",
    status: "ready",
    body: `1 · ASSET NAME
Signal Studio — Founder business card. Double-sided, standard 85×55mm. Print-ready (heavy uncoated) plus a screen preview.

2 · BUSINESS OBJECTIVE
The first object a venue holds. The cheapest possible premium signal: it must make the founder and the company read as a respected, established business in the opening seconds of a face-to-face introduction, and carry one clear way to make contact. It also sets the card grammar the café card and A6 card inherit.

3 · AUDIENCE
A wedding-venue owner or coordinator in Limerick — premium, time-poor, judges credibility instantly. Also handed to partners, press, and peers.

4 · MOMENT OF USE
Handed across a table at the start or end of a short in-person meeting; later found in a pocket or on a desk. It is judged by touch and at a glance.

5 · SOURCE CONTEXT
Brand handbook: white/black/indigo #4f46e5, Geist Sans + Geist Mono, hairlines not shadows, one earned accent, lowercase wordmark "signal studio." with the indigo period. Voice: declarative, plain English. The dot is the brand's hero gesture.

6 · REQUIRED COPY (use as written; confirm name/title before print)
Front:
 — Wordmark: signal studio. (lowercase, indigo period), optically centred
 — Nothing else, or at most a single mono micro-label: CALM COORDINATION
Back:
 — Name: Ethan McNamara  [confirm exact spelling]
 — Role: Founder  [confirm preferred title]
 — hello@signalstudio.ie
 — signalstudio.ie
 — Limerick, Ireland
 — Optional single quiet line (one only, if any): Four products, one system.
No phone number unless the founder wants one; no social handles; no QR unless it resolves to a real destination.

7 · VISUAL HIERARCHY
Front is the brand: the wordmark and its indigo period, centred in calm space — that is the whole front. Back is the contact: name first, then role, then the two ways to reach (email, site), then place. The eye should rest, not work.

8 · LAYOUT REQUIREMENTS
Front: wordmark optically centred, generous margins, one hairline only if it earns its place. Back: left-aligned block, mono micro-labels for the field rows, the email as the one emphasised line. This card defines the card grammar — margins, micro-label style, and the single-accent rule — that the café and A6 cards reuse.

9 · BRAND RULES
Paper white. Ink-black text. Exactly one indigo accent (the wordmark period is the natural place). Geist Sans for the name; Geist Mono for micro-labels and the URL/email. Hairlines, no shadows, no gradient. Heavy uncoated stock; the card should feel substantial.

10 · WHAT TO AVOID
No gloss, no lamination, no rounded-corner gimmicks, no spot-UV trickery. No logo soup. No second colour. No stock icons (no phone/mail glyph clutter). No tagline stack. No QR to a placeholder. Nothing that looks like a generic startup card.

11 · PRINT / EXPORT SPECIFICATIONS
85×55mm, double-sided. 3mm bleed, 4mm safe margin. CMYK, print-ready PDF/X-1a, 350–400gsm uncoated (duplex for weight if available). Supply front and back as separate artboards. Also export an RGB screen preview (front + back) for review.

12 · ACCESSIBILITY REQUIREMENTS
WCAG AA contrast (black on white passes; if indigo touches text, confirm it also passes). Smallest type no less than 7–8pt at print size; the email no smaller than the name's secondary line. Don't rely on the accent alone to carry meaning.

13 · VARIANTS REQUIRED
(a) Print PDF (CMYK, bleed, separate front/back). (b) Screen preview PNG/PDF (RGB). Optional (c) a "with phone number" variant if the founder decides to include one.

14 · QUALITY BAR
Passes all ten checks of the Asset Quality Gate, with particular weight on brand restraint, premium front-desk, and print/export. Do not return a draft that fails any check.

15 · FINAL DELIVERABLES
founder-card-front.pdf · founder-card-back.pdf (CMYK, bleed) · founder-card-preview.png (RGB) · the editable source · and a one-line print note (stock weight + finish).

16 · SELF-REVIEW CHECKLIST
Does it feel substantial and restrained? One indigo accent only? Is the email the clear way to make contact? Any gloss, gradient, icon clutter, or second colour? Correct at 85×55mm with bleed? Does it set a card grammar the next card can inherit?

HOW TO JUDGE SUCCESS
The card succeeds if a premium venue owner, handed it across a table, reads the company as established and trustworthy before a word is spoken — and if the founder is glad to leave it behind.`,
  },
  {
    id: "fp-social",
    asset: "\"Founding Limerick Partner No. __\" social post system (LinkedIn · IG square · IG story · website card)",
    intent:
      "The compounding proof engine — numbered, restrained, recognisable; built so it is impossible to publish before a partner is real and permissioned.",
    status: "ready",
    body: `1 · ASSET NAME
Signal Studio — "Founding Limerick Partner No. __" social post system. A template set across LinkedIn, Instagram square, Instagram story, and a website card.

2 · BUSINESS OBJECTIVE
The compounding proof engine. Each real signed venue becomes a numbered, restrained, instantly recognisable announcement that builds credibility without hype. The system must make proof feel earned and premium — and must be impossible to use before a partner is real and has given written permission.

3 · AUDIENCE
Other premium venues and coordinators watching quietly; the local Limerick business community; press. People who trust calm proof and distrust noise.

4 · MOMENT OF USE
Published when a venue signs and has given written permission — one post per partner, occasionally a milestone recap. Seen in a fast-scrolling feed; it must read in one second and reward a second look.

5 · SOURCE CONTEXT
Brand handbook: white/black/indigo #4f46e5, Geist + Geist Mono, hairlines, one earned accent. Voice: declarative, plain, no exclamation. The number is the hero — Geist Mono, large, calm. Permission and specimen discipline are non-negotiable: no invented partners, ever.

6 · REQUIRED COPY (template; bracketed fields filled per real, permissioned partner)
Hero (mono): Founding Limerick Partner No. [01]
Line 1: [Venue Name] is a Founding Limerick Partner of Signal Studio.
Line 2 (optional, plain): One of the first venues in Limerick running calm coordination — capture, run-sheet, shared timeline, and the day's one priority.
Footer: signalstudio.ie · Limerick
SPECIMEN RULE: until a real partner is signed and has signed the permission form, every export must carry a visible "SPECIMEN — not a real partner" mark and use a placeholder name like "[Venue Name]". Deliver both the specimen build and the clean template.
Do not add: metrics, quotes, logos, or any claim that is not in writing.

7 · VISUAL HIERARCHY
First: the number ("No. 01"). Second: the venue name. Third: the single supporting line and the site. The number and the partner's name carry the post; everything else recedes.

8 · LAYOUT REQUIREMENTS
A calm card on paper white with one hairline frame and one indigo accent (the period, or a single dot beside the number). The number sits large in mono; the venue name in Geist Sans beneath. Generous margins. The same composition adapts across the four formats by re-flowing, not redesigning.

9 · BRAND RULES
White background. Black text. One indigo accent only. Geist Mono for the number and micro-labels; Geist Sans for the venue name and line. Hairlines, no shadow, no gradient, no photo background. The Signal Studio wordmark appears once, small, as the signer.

10 · WHAT TO AVOID
No confetti, balloons, or emoji. No exclamation marks. No "thrilled / excited to announce". No fabricated logos or venue photos without permission. No metrics. No gradient or glow. No template that could be posted with a real-looking name before the partner is signed.

11 · EXPORT SPECIFICATIONS (screen)
LinkedIn: 1200×1200 (square reads best in-feed); also supply 1200×627 if used as a link image. Instagram square: 1080×1080. Instagram story: 1080×1920, text inside safe margins clear of top/bottom UI. Website card: a responsive component spec (16:9 + a compact variant), supplied as SVG. Export PNG for social, SVG for web. RGB / sRGB.

12 · ACCESSIBILITY REQUIREMENTS
WCAG AA contrast. Provide an alt-text template: "Signal Studio — Founding Limerick Partner number [01], [Venue Name]." Story text within the safe area. The accent is never the sole carrier of meaning.

13 · VARIANTS REQUIRED
(a) LinkedIn 1200×1200. (b) Instagram square 1080×1080. (c) Instagram story 1080×1920. (d) Website card (SVG / responsive). (e) A clearly-marked SPECIMEN version of each, for internal review only.

14 · QUALITY BAR
Passes all ten checks of the Asset Quality Gate, with particular weight on proof/claims and permission. A draft that omits the specimen mark, or that could imply an unsigned partner, fails automatically.

15 · FINAL DELIVERABLES
fp-no-__-linkedin.png · fp-no-__-ig-square.png · fp-no-__-ig-story.png · fp-card.svg (website) · the matching SPECIMEN exports · the editable source with the number and name as the only fields to change · and the alt-text + permission-gate note.

16 · SELF-REVIEW CHECKLIST
Is the number the hero, calm in mono? One indigo accent only? Any hype word, emoji, or exclamation? Is there a visible specimen mark on the review build? Could this be posted with a real name before the partner is signed (it must not)? Does every format share one composition? Alt text present?

HOW TO JUDGE SUCCESS
The system succeeds if a single numbered post makes a watching venue think "I want to be one of those" — quietly, with no hype — and if it is structurally impossible to publish before a partner is real and has given written permission.`,
  },
  {
    id: "email-sig",
    asset: "Founder email signature (HTML + plain text) + A4 letterhead (print + PDF)",
    intent:
      "Cheap consistency used daily — makes every founder email and letter read as a real, premium company; inherits the one-pager's document shell.",
    status: "ready",
    body: `1 · ASSET NAME
Signal Studio — Founder email signature (HTML) + A4 letterhead (print + PDF).

2 · BUSINESS OBJECTIVE
Make every founder email and letter read as a real, premium company. Low effort, used daily — cheap consistency that compounds trust across outreach, press, and partner correspondence.

3 · AUDIENCE
Venues, press, partners, advisors — anyone the founder writes to.

4 · MOMENT OF USE
Signature: the foot of every founder email. Letterhead: formal letters (welcome letters, partner correspondence), printed or as PDF.

5 · SOURCE CONTEXT
Brand handbook: white/black/indigo #4f46e5, Geist + Geist Mono, hairlines, one earned accent, lowercase "signal studio." wordmark with indigo period. Canonical address hello@signalstudio.ie.

6 · REQUIRED COPY
Signature:
 — Ethan McNamara [confirm] · Founder
 — Signal Studio
 — hello@signalstudio.ie · signalstudio.ie
 — Limerick, Ireland
 — (no quotes, no banner, no "sent from", no social icons)
Letterhead:
 — Header: signal studio. wordmark (indigo period) + a hairline rule.
 — Footer (mono, small): Signal Studio · Limerick, Ireland · hello@signalstudio.ie · signalstudio.ie

7 · VISUAL HIERARCHY
Signature: name first, then role, then the one contact line. Letterhead: the wordmark sits quietly top-left; the letter body is the focus; the footer is a faint mono line.

8 · LAYOUT REQUIREMENTS
Signature: a compact left-aligned block, web-safe, no images that break in clients (use a unicode middot for separators; an inline SVG dot only if it renders reliably). Letterhead: A4 with a quiet header band, generous body margins, a footer rule. Inherits the document shell from the one-pager.

9 · BRAND RULES
White, black, one indigo accent (the wordmark period). Geist where it renders, with a clean fallback stack for email (Geist → Helvetica Neue → Arial → sans-serif). Hairlines, no shadow, no gradient.

10 · WHAT TO AVOID
No logo image that fails to load, no banner ads, no quotes or aphorisms, no wall of confidentiality text unless legally required (keep it minimal), no social-icon row, no second colour, no marketing tagline.

11 · EXPORT SPECIFICATIONS
Signature: HTML snippet (inline CSS, robust across Gmail / Apple Mail / Outlook) plus a plain-text fallback. Letterhead: A4 (210×297mm), 15–20mm margins, print-ready PDF + an editable template (Docs/Word + source).

12 · ACCESSIBILITY REQUIREMENTS
WCAG AA contrast. Real selectable text, not an image (screen-reader friendly). Any image carries alt text.

13 · VARIANTS REQUIRED
(a) HTML signature. (b) Plain-text signature. (c) A4 letterhead PDF. (d) Editable letterhead template.

14 · QUALITY BAR
Passes the Asset Quality Gate, with weight on brand restraint, copy precision, accessibility, and reusability.

15 · FINAL DELIVERABLES
signature.html · signature.txt · letterhead.pdf · letterhead-template (editable) · a one-line install note for the signature.

16 · SELF-REVIEW CHECKLIST
Does the signature render without broken images in major clients? Real selectable text? One indigo accent only? Any banner, quote, or icon clutter? Letterhead correct at A4 with sensible margins? Does it inherit the one-pager's document shell?

HOW TO JUDGE SUCCESS
Succeeds if a recipient's eye goes to the message, not the chrome — yet the email or letter unmistakably reads as Signal Studio: quiet, consistent, premium.`,
  },
];

export const FIRST_PROMPT = COMPLETED_PROMPTS[0];

export const OPEN_QUESTIONS: Array<{ q: string; why: string }> = [
  { q: "Launch-date contract: BRAND.md §8 says 'no launch dates / build until it's right', but this brief sets a hard 1 Sep 2026. Confirm 1 Sep is an internal asset-readiness deadline only, not a public countdown.", why: "Determines whether any asset may reference a date publicly. Current assumption: internal only." },
  { q: "Venue pricing for the one-pager / pricing explainer: confirm the public-facing number or range (the financial model and MARKETING_PLAN reference €1.5k–€4k/yr).", why: "The pricing explainer and one-pager ask both need a confirmed figure before print." },
  { q: "QR destination: is there a real venue-workspace demo URL ready to point physical objects at?", why: "Every printed object's QR must resolve to a real, calm destination — not a placeholder." },
  { q: "Founder headshot: does a print-quality headshot exist, or is a shoot needed before the press kit ships?", why: "Press coverage quality depends on it; flagged as a dependency, not yet resolved." },
  { q: "Wedding workspace seed data: is there a real, populated wedding workspace to screenshot, or must one be built first?", why: "The screenshots asset (priority #2) is blocked until real-shaped data exists." },
];

export function assetById(id: string): Asset | undefined {
  return TAXONOMY.find((a) => a.id === id);
}

export function taxonomyProgress() {
  const required = TAXONOMY.filter((a) => a.required);
  const ready = TAXONOMY.filter((a) => a.design === "exists").length;
  return { total: TAXONOMY.length, required: required.length, ready };
}
