import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { Wordmark } from "@/components/brand/wordmark";
import { MotionSpecimen } from "@/components/brand/motion-specimen";
import { ReadingProgress } from "@/components/reading-progress";

export const metadata: Metadata = {
  title: "Brand · signal studio.",
  description:
    "The full signal studio brand system — wordmarks, palette, typography, the loader, and a downloadable SVG-first kit. One umbrella. One indigo. Boring on purpose.",
  openGraph: {
    title: "signal studio. · brand system",
    description: "One umbrella. One indigo. Boring on purpose.",
    type: "website",
  },
};

/* ──────────────────────────────────────────────────────────────────────────
   ASSET KIT — maps the real /public/brand/kit/ directory 1:1.
   SVG masters are the source of truth; PNGs are linked when rendered.
   Don't hand-list files — derive them here so
   the page can never drift from what actually shipped in the kit.
   ────────────────────────────────────────────────────────────────────────── */

type Surface = "paper" | "deep" | "ink" | "indigo" | "cream";

type Asset = {
  /** kit base filename, no extension */
  base: string;
  /** human label */
  name: string;
  /** kit subfolder under svg/ and png/ */
  family: "wordmark" | "lockup" | "mark" | "app-icon" | "product-wordmarks";
  /** PNG sizes that exist for this base */
  png: number[];
  /** background the preview sits on so the asset is legible */
  surface: Surface;
  /** how the preview image is constrained */
  fit: "wide" | "tall" | "tile";
};

const SURFACE_BG: Record<Surface, string> = {
  paper: "var(--paper)",
  deep: "var(--paper-deep)",
  ink: "#111111",
  indigo: "#4f46e5",
  cream: "#faf8f1",
};

const KIND_SIZES = {
  wordmark: [128, 256, 512],
  lockup: [800, 1600],
  mark: [16, 32, 64, 128, 256, 512, 1024],
  appicon: [16, 32, 64, 128, 256, 512, 1024],
  product: [128, 256, 512],
} as const;

type AssetGroup = {
  num: string;
  kicker: string;
  title: string;
  blurb: React.ReactNode;
  assets: Asset[];
};

const ASSET_GROUPS: AssetGroup[] = [
  {
    num: "A",
    kicker: "Wordmark",
    title: "The house signature.",
    blurb: (
      <>
        Geist 500, lowercase, kerning <strong className="text-[var(--ink)]">−0.025em</strong>,
        and the indigo period. Three colourways for three surfaces.
      </>
    ),
    assets: [
      { base: "signal-studio-indigo", name: "signal studio. · indigo", family: "wordmark", png: [...KIND_SIZES.wordmark], surface: "deep", fit: "wide" },
      { base: "signal-studio-ink", name: "signal studio. · ink", family: "wordmark", png: [...KIND_SIZES.wordmark], surface: "deep", fit: "wide" },
      { base: "signal-studio-paper", name: "signal studio. · paper", family: "wordmark", png: [...KIND_SIZES.wordmark], surface: "ink", fit: "wide" },
    ],
  },
  {
    num: "B",
    kicker: "Lockup",
    title: "Share cards. 16 : 9.",
    blurb: (
      <>
        The wordmark centred and breathing on a full bleed — for hero images,
        OpenGraph cards, slide title pages. Three grounds: cream, ink, indigo.
      </>
    ),
    assets: [
      { base: "on-cream", name: "lockup · on cream", family: "lockup", png: [...KIND_SIZES.lockup], surface: "cream", fit: "wide" },
      { base: "on-ink", name: "lockup · on ink", family: "lockup", png: [...KIND_SIZES.lockup], surface: "ink", fit: "wide" },
      { base: "on-indigo", name: "lockup · on indigo", family: "lockup", png: [...KIND_SIZES.lockup], surface: "indigo", fit: "wide" },
    ],
  },
  {
    num: "C",
    kicker: "The dot",
    title: "The brand, at any size.",
    blurb: (
      <>
        One indigo circle — or dot with broadcast ring for favicons. Same shape
        from a 16px favicon to a billboard. Don&apos;t recolour it — it{" "}
        <em className="not-italic font-medium text-[var(--indigo)]">is</em> the
        brand. Seven PNG sizes, plus the vector.
      </>
    ),
    assets: [
      { base: "dot-ring-indigo", name: "dot + ring · indigo", family: "mark", png: [...KIND_SIZES.mark], surface: "ink", fit: "tile" },
      { base: "dot-indigo", name: "dot · indigo", family: "mark", png: [...KIND_SIZES.mark], surface: "deep", fit: "tile" },
      { base: "dot-ink", name: "dot · ink", family: "mark", png: [...KIND_SIZES.mark], surface: "deep", fit: "tile" },
      { base: "dot-paper", name: "dot · paper", family: "mark", png: [...KIND_SIZES.mark], surface: "ink", fit: "tile" },
    ],
  },
  {
    num: "D",
    kicker: "App icon",
    title: "The squircle tile.",
    blurb: (
      <>
        The dot, seated in a rounded tile for launchers, social avatars, and
        anywhere a square is required. Four colourways — including the inverse.
      </>
    ),
    assets: [
      { base: "cream", name: "app icon · cream", family: "app-icon", png: [...KIND_SIZES.appicon], surface: "deep", fit: "tile" },
      { base: "indigo", name: "app icon · indigo", family: "app-icon", png: [...KIND_SIZES.appicon], surface: "deep", fit: "tile" },
      { base: "ink", name: "app icon · ink", family: "app-icon", png: [...KIND_SIZES.appicon], surface: "deep", fit: "tile" },
      { base: "paper", name: "app icon · paper", family: "app-icon", png: [...KIND_SIZES.appicon], surface: "ink", fit: "tile" },
    ],
  },
  {
    num: "E",
    kicker: "Products",
    title: "Four products, one house.",
    blurb: (
      <>
        Each product wordmark carries the house signature with its own noun.
        The verbs take a <em className="not-italic font-medium text-[var(--indigo)]">middot</em>;
        notes takes a <em className="not-italic font-medium text-[var(--indigo)]">period</em>.
      </>
    ),
    assets: [
      { base: "tasks", name: "tasks·", family: "product-wordmarks", png: [...KIND_SIZES.product], surface: "deep", fit: "wide" },
      { base: "timeline", name: "timeline·", family: "product-wordmarks", png: [...KIND_SIZES.product], surface: "deep", fit: "wide" },
      { base: "signal", name: "signal·", family: "product-wordmarks", png: [...KIND_SIZES.product], surface: "deep", fit: "wide" },
      { base: "notes", name: "notes.", family: "product-wordmarks", png: [...KIND_SIZES.product], surface: "deep", fit: "wide" },
    ],
  },
];

const PALETTE = [
  { token: "--indigo", hex: "#4F46E5", desc: "The single brand accent. Every primary action, every dot, every product wordmark." },
  { token: "--paper", hex: "#FFFFFF", desc: "Page background. White, restrained. Hairlines do the work shadows would." },
  { token: "--paper-soft", hex: "#FAFAFA", desc: "Recessed surfaces. Alt-row backgrounds." },
  { token: "--paper-deep", hex: "#F4F4F5", desc: "Inset blocks. Code surfaces. Pills and badges." },
  { token: "--ink", hex: "#111111", desc: "Body text. Primary buttons. Off-black, never pure." },
  { token: "--ink-soft", hex: "#3F3F46", desc: "Secondary text. Descriptions." },
  { token: "--ink-faint", hex: "#71717A", desc: "Mono kickers. Metadata. Captions." },
  { token: "--ink-ghost", hex: "#D4D4D8", desc: "Placeholders. Separators. Subtle hairlines." },
];

// Canon: DESIGN.md §5 (ratified 2026-05-16, deployed + live-verified).
// Order: the house first, then the four products in workflow order
// (Notes captures → Tasks runs → Timeline shows → Signal surfaces).
const MOTIONS: Array<{ code: string; kind: "studio" | "tasks" | "timeline" | "signal" | "notes"; name: string; cycle: string; line: string }> = [
  { code: "M·01", kind: "studio", name: "broadcast", cycle: "once", line: "One ring radiates from the period and is gone. The house announcing itself on arrival: said once, never repeated." },
  { code: "M·02", kind: "notes", name: "caret", cycle: "1.1s", line: "Blinks like a held cursor. A thought mid-formation." },
  { code: "M·03", kind: "tasks", name: "pulse", cycle: "2.6s", line: "The dot breathes at rest and quickens under load. Work, alive but unhurried." },
  { code: "M·04", kind: "timeline", name: "sweep", cycle: "5.4s", line: "The dot tracks left to right along an unseen timeline, then resets. Direction without urgency." },
  { code: "M·05", kind: "signal", name: "tick", cycle: "3.6s", line: "The dot snaps between discrete sample heights and holds, never gliding. Reading the signal, not streaming it." },
];

const REFUSALS = [
  { num: "N·01", text: "Hero with laptop mockup + 3-column features grid." },
  { num: "N·02", text: "Project-management vocabulary: sprints, epics, burndowns." },
  { num: "N·03", text: "Productivity-coach voice. Phrases that hustle you." },
  { num: "N·04", text: "AI-workspace framing. \"Your second brain.\" \"Magical.\"" },
  { num: "N·05", text: "Stock photography of teams pointing at screens." },
  { num: "N·06", text: "Emoji as decoration. Anywhere. Including in product copy." },
  { num: "N·07", text: "A plan that promises features the team won't deliver." },
];

const CONSTRUCTION = [
  { k: "Face", v: "Geist · weight 500" },
  { k: "Case", v: "lowercase — always" },
  { k: "Kerning", v: "−0.025em" },
  { k: "The dot", v: "0.16 × cap-height" },
  { k: "Dot gap", v: "0.06em from the wordmark" },
  { k: "Indigo", v: "#4F46E5 — never recoloured" },
];

function totalAssetCount() {
  // svg masters + every rendered png across all groups
  let svg = 0;
  let png = 0;
  for (const g of ASSET_GROUPS) {
    for (const a of g.assets) {
      svg += 1;
      png += a.png.length;
    }
  }
  return { svg, png, total: svg + png };
}

function AssetCard({ asset }: { asset: Asset }) {
  const svgPath = `/brand/kit/svg/${asset.family}/${asset.base}.svg`;
  const sizes = asset.png;
  const largest = sizes[sizes.length - 1];
  const hasPng = sizes.length > 0;
  const pngPath = (s: number) => `/brand/kit/png/${asset.family}/${asset.base}-${s}.png`;

  const previewClass =
    asset.fit === "tile"
      ? "max-h-[44%] max-w-[44%]"
      : asset.fit === "tall"
        ? "max-h-[62%] max-w-[58%]"
        : "max-h-[52%] max-w-[78%]";

  return (
    <div className="group flex flex-col overflow-hidden rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] transition-transform hover:-translate-y-[3px]">
      <div
        className="flex aspect-[16/10] items-center justify-center"
        style={{ background: SURFACE_BG[asset.surface] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={svgPath}
          alt={asset.name}
          loading="lazy"
          decoding="async"
          className={previewClass}
        />
      </div>
      <div className="flex flex-col gap-1 px-[18px] pt-4 pb-[18px]">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
          {asset.family.replace("-", " ")}
        </span>
        <span className="text-[15px] font-medium tracking-[-0.015em] text-[var(--ink)]">
          {asset.name}
        </span>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <a
            href={svgPath}
            download
            className="inline-flex min-h-[38px] items-center rounded-full border border-[var(--hairline)] bg-[var(--paper)] px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
          >
            ↓ svg
          </a>
          {hasPng ? (
            <a
              href={pngPath(largest)}
              download
              className="inline-flex min-h-[38px] items-center rounded-full border border-[var(--hairline)] bg-[var(--paper)] px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] text-[var(--ink-soft)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
              title={`${largest}px PNG`}
            >
              ↓ png
            </a>
          ) : (
            <span
              className="inline-flex min-h-[38px] items-center rounded-full border border-dashed border-[var(--hairline)] bg-[var(--paper)] px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] text-[var(--ink-faint)]"
              title="PNG export is tracked in the brand kit README."
            >
              png todo
            </span>
          )}
          <a
            href={svgPath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[38px] items-center rounded-full px-2.5 py-1.5 font-mono text-[11px] tracking-[0.04em] text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
          >
            ↗ open
          </a>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1 border-t border-dashed border-[var(--hairline-2)] pt-2.5 font-mono text-[10px] text-[var(--ink-faint)]">
          <span className="mr-1 text-[var(--ink-ghost)]">png</span>
          {hasPng ? (
            sizes.map((s) => (
              <a
                key={s}
                href={pngPath(s)}
                download
                className="rounded-[4px] px-1.5 py-0.5 transition-colors hover:bg-[var(--ink)] hover:text-[var(--paper)]"
              >
                {s}
              </a>
            ))
          ) : (
            <span>export pending</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SwatchCard({ token, hex, desc }: { token: string; hex: string; desc: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] p-5">
      <div
        className="h-20 rounded-[var(--r-2)] border border-[var(--hairline)]"
        style={{ background: hex }}
        aria-hidden
      />
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[12px] text-[var(--ink)]">{token}</span>
        <span className="font-mono text-[11px] text-[var(--ink-faint)]">{hex}</span>
      </div>
      <p className="m-0 text-[13px] leading-snug text-[var(--ink-soft)]">{desc}</p>
    </div>
  );
}

export default function BrandPage() {
  const { svg, png, total } = totalAssetCount();

  return (
    <>
    <ReadingProgress />
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1200px] px-8 pb-32">
      {/* HERO */}
      <header className="pt-24 pb-12">
        <div className="mb-9 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-faint)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-2.5 py-1 text-[10px] tracking-[0.06em] text-[var(--paper)]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--indigo)", boxShadow: "0 0 0 3px rgba(79,70,229,0.30)" }}
              aria-hidden
            />
            Brand · living document
          </span>
          <span>v1.1 · 2026.05.18</span>
          <span className="text-[var(--ink-ghost)]">·</span>
          <span>built slowly, maintained quietly</span>
        </div>

        <h1
          className="m-0 mb-8 max-w-[14ch] text-balance font-medium text-[var(--ink)]"
          style={{
            fontSize: "clamp(48px, 9vw, 132px)",
            lineHeight: 0.92,
            letterSpacing: "-0.05em",
          }}
        >
          One umbrella.{" "}
          <em className="not-italic font-normal text-[var(--ink-faint)]">
            One indigo.
          </em>
          <br />
          Boring on purpose
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "0.16em",
              height: "0.16em",
              borderRadius: "50%",
              background: "var(--indigo)",
              marginLeft: "0.04em",
              verticalAlign: "0.02em",
            }}
          />
        </h1>

        <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-[1fr_320px]">
          <div>
            <p className="m-0 mb-6 max-w-[580px] text-[19px] leading-[1.5] text-[var(--ink-soft)] text-pretty">
              The brand system for{" "}
              <Wordmark kind="studio" size="sm" animate />. One house, four
              products, one indigo. Built for the people the work routes
              through, not the people who run sprints.{" "}
              <strong className="font-semibold text-[var(--ink)]">
                Everything important, nothing distracting.
              </strong>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/brand/signal-studio-brand-kit.zip"
                download
                className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-2.5 font-mono text-[12px] tracking-[0.04em] text-[var(--paper)] transition-colors hover:bg-[var(--indigo)]"
              >
                ↓ Download the full kit
                <span className="opacity-60">· {total} files</span>
              </a>
              <a
                href="#assets"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--paper)] px-5 py-2.5 font-mono text-[12px] tracking-[0.04em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              >
                Browse assets ↓
              </a>
            </div>
          </div>
          <div className="border-l border-[var(--hairline)] pl-6 font-mono text-[11px] leading-[1.7] tracking-[0.02em] text-[var(--ink-faint)]">
            {[
              ["Maintainer", "Ethan McNamara"],
              ["House", "signal studio."],
              ["Products", "04"],
              ["SVG masters", String(svg).padStart(2, "0")],
              ["PNG renders", String(png)],
              ["Bar", "Editorial"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between gap-3 border-b border-dashed border-[var(--hairline)] py-1 last:border-b-0"
              >
                <span>{k}</span>
                <span className="text-[var(--ink)]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* WORDMARKS / MOTION */}
      <section className="border-t border-[var(--hairline-2)] py-20">
        <SectionHead
          num="01 / 06"
          kicker="The mark"
          title="Five wordmarks. Five motions."
          intro={
            <>
              The signature is a single indigo circle at the end of the
              wordmark. The umbrella + nouns take a <em className="not-italic font-medium text-[var(--indigo)]">period</em>,
              baseline-seated. The verbs take a{" "}
              <em className="not-italic font-medium text-[var(--indigo)]">middot</em>,
              lifted toward the cap-height. Each wordmark carries its own
              ambient motion, a pulse fitting the product&apos;s job.
            </>
          }
        />

        <div className="grid grid-cols-2 overflow-hidden rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] sm:grid-cols-3 md:grid-cols-5">
          {MOTIONS.map((m, i) => (
            <MotionSpecimen
              key={m.code}
              kind={m.kind}
              name={m.name}
              cycle={m.cycle}
              className={`border-b border-[var(--hairline-2)] md:border-b-0 ${
                i === MOTIONS.length - 1 ? "" : "md:border-r"
              }`}
            />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {MOTIONS.map((m, i) => (
            <div
              key={m.code}
              className="pt-3.5"
              style={{
                borderTop: `1px solid ${i === 0 ? "var(--indigo)" : "var(--hairline)"}`,
              }}
            >
              <span
                className="font-mono text-[10px] uppercase tracking-[0.06em]"
                style={{ color: i === 0 ? "var(--indigo)" : "var(--ink-faint)" }}
              >
                {m.code} · {m.name}
              </span>
              <h4 className="m-0 mt-1.5 mb-1.5 text-[15px] font-medium tracking-[-0.015em] text-[var(--ink)]">
                {m.kind === "studio"
                  ? "signal studio."
                  : m.kind + (m.kind === "notes" ? "." : "·")}
              </h4>
              <p className="m-0 text-[12.5px] leading-[1.5] text-[var(--ink-soft)]">{m.line}</p>
            </div>
          ))}
        </div>

        {/* Construction spec */}
        <div className="mt-16 grid grid-cols-1 gap-8 rounded-[var(--r-4)] border border-[var(--hairline)] bg-[var(--paper-elev)] p-8 md:grid-cols-[1fr_1fr] md:p-10">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
              Construction
            </span>
            <h3 className="m-0 mt-2 mb-3 text-[24px] font-medium tracking-[-0.025em] text-[var(--ink)]">
              The wordmark is built to a spec, not eyeballed.
            </h3>
            <p className="m-0 max-w-[440px] text-[14.5px] leading-[1.55] text-[var(--ink-soft)]">
              Every export in the kit holds these exact relationships. If a
              layout needs something the spec doesn&apos;t cover, the answer is
              ask — not improvise.
            </p>
          </div>
          <dl className="m-0 grid grid-cols-1 gap-0 self-center font-mono text-[12px]">
            {CONSTRUCTION.map(({ k, v }) => (
              <div
                key={k}
                className="flex items-center justify-between border-b border-dashed border-[var(--hairline-2)] py-2.5 last:border-b-0"
              >
                <dt className="text-[var(--ink-faint)]">{k}</dt>
                <dd className="m-0 text-[var(--ink)]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Refusals */}
        <div className="mt-20">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
            The refusal list
          </span>
          <h3 className="m-0 mt-2 mb-6 max-w-[540px] text-[26px] font-medium tracking-[-0.025em] text-[var(--ink)] text-balance">
            Boring on purpose. Built slowly.
          </h3>
          <div className="grid grid-cols-1 overflow-hidden rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] sm:grid-cols-2 md:grid-cols-3">
            {REFUSALS.map((r) => (
              <div
                key={r.num}
                className="relative border-b border-r border-[var(--hairline-2)] p-5"
              >
                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)]">
                    ×
                  </span>
                  Never
                </div>
                <p
                  className="m-0 text-[14.5px] leading-[1.5] text-[var(--ink-soft)] text-pretty"
                  style={{
                    textDecoration: "line-through",
                    textDecorationColor: "var(--ink-ghost)",
                    textDecorationThickness: "1.5px",
                  }}
                >
                  {r.text}
                </p>
                <span className="absolute right-4 top-4 font-mono text-[10px] text-[var(--ink-ghost)]">
                  {r.num}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLOR */}
      <section className="border-t border-[var(--hairline-2)] py-20">
        <SectionHead
          num="02 / 06"
          kicker="Color"
          title="One indigo. White paper. Off-black ink."
          intro={
            <>
              No product gets its own colour.{" "}
              <strong className="text-[var(--ink)]">One indigo</strong> ties
              every wordmark, every CTA, every pulse-dot together. Surfaces
              are <em className="not-italic font-medium text-[var(--indigo)]">white</em>,
              restrained. Ink is{" "}
              <em className="not-italic font-medium text-[var(--indigo)]">off-black</em>,
              never pure black.
            </>
          }
        />

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr]">
          <div
            className="flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[var(--r-4)] p-10 text-white"
            style={{ background: "#4F46E5" }}
          >
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.06em] opacity-70">
                — Brand · primary
              </div>
              <div
                className="my-3 text-[44px] font-medium tracking-[-0.025em]"
                style={{ fontFeatureSettings: "'tnum'" }}
              >
                #4F46E5
              </div>
              <div className="max-w-[360px] text-[17px] leading-[1.4] opacity-90">
                indigo. The dot, every primary action, every product accent.
                There is no second brand colour.
              </div>
            </div>
            <div className="flex flex-wrap gap-5 font-mono text-[11px] opacity-75">
              <span>oklch(0.51 0.24 273)</span>
              <span>RGB 79 70 229</span>
              <span>AA on white · 6.3</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div
              className="flex aspect-[4/2.4] flex-col justify-between rounded-[var(--r-3)] border border-[var(--hairline)] p-4"
              style={{ background: "#ffffff", color: "var(--ink)" }}
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.06em] opacity-65">
                — Paper
              </div>
              <div className="text-[22px] font-medium tracking-[-0.02em]">
                #FFFFFF
              </div>
            </div>
            <div
              className="flex aspect-[4/2.4] flex-col justify-between rounded-[var(--r-3)] p-4"
              style={{ background: "#111111", color: "var(--paper)" }}
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.06em] opacity-65">
                — Ink
              </div>
              <div className="text-[22px] font-medium tracking-[-0.02em]">
                #111111
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {PALETTE.map((p) => (
            <SwatchCard key={p.token} {...p} />
          ))}
        </div>
      </section>

      {/* TYPOGRAPHY */}
      <section className="border-t border-[var(--hairline-2)] py-20">
        <SectionHead
          num="03 / 06"
          kicker="Type"
          title="Geist sans. Geist Mono as the kicker."
          intro={
            <>
              Two faces.{" "}
              <em className="not-italic font-medium text-[var(--indigo)]">
                Geist 500
              </em>{" "}
              sets every wordmark, headline, and label.{" "}
              <em className="not-italic font-medium text-[var(--indigo)]">
                Geist Mono
              </em>{" "}
              sets every kicker, page-number, and timestamp — anything that
              wants to read as{" "}
              <strong className="text-[var(--ink)]">
                information, not voice
              </strong>
              .
            </>
          }
        />

        <div className="overflow-hidden rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)]">
          <TypeRow
            label="display l"
            meta="96 / 0.95 · −4.5%"
            sample="Operational clarity."
            sampleStyle={{ fontSize: 96, letterSpacing: "-0.045em", lineHeight: 0.95, fontWeight: 500 }}
            usage="page heroes only · 1 per page"
          />
          <TypeRow
            label="display m"
            meta="64 / 1.0 · −4.0%"
            sample="Plain English, on a public page."
            sampleStyle={{ fontSize: 64, letterSpacing: "-0.04em", lineHeight: 1.0, fontWeight: 500 }}
            usage="section heads · landing pages"
          />
          <TypeRow
            label="display s"
            meta="44 / 1.05 · −3.0%"
            sample="A morning briefing, not a dashboard."
            sampleStyle={{ fontSize: 44, letterSpacing: "-0.03em", lineHeight: 1.05, fontWeight: 500 }}
            usage="in-product page titles"
          />
          <TypeRow
            label="title"
            meta="28 / 1.2 · −2.0%"
            sample="Built for the 80%."
            sampleStyle={{ fontSize: 28, letterSpacing: "-0.02em", fontWeight: 500 }}
            usage="cards · modal titles"
          />
          <TypeRow
            label="body"
            meta="17 / 1.55 · 0"
            sample="Most software gives you more. Signal Studio gives you less — less to manage, less to monitor, less to remember."
            sampleStyle={{ fontSize: 17, lineHeight: 1.55, color: "var(--ink-soft)" }}
            usage="paragraphs · descriptions"
          />
          <TypeRow
            label="mono"
            meta="12 / 1.5 · +4%"
            sample="— signal studio · brand index · 2026.05.18"
            sampleStyle={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            }}
            usage="kickers · metadata · stamps"
          />
        </div>
      </section>

      {/* THE LOADER */}
      <section className="border-t border-[var(--hairline-2)] py-20">
        <SectionHead
          num="04 / 06"
          kicker="In motion"
          title="The loader. The brand, assembling itself."
          intro={
            <>
              The wait is part of the work. The wordmark rolls in, the four
              products rise once, the pip stays live. No spinner, no progress
              bar — the house{" "}
              <strong className="text-[var(--ink)]">composing itself</strong>{" "}
              while the data lands. It honours{" "}
              <em className="not-italic font-medium text-[var(--indigo)]">
                prefers-reduced-motion
              </em>{" "}
              and pauses when the tab is hidden.
            </>
          }
        />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[300px_1fr] md:items-center">
          {/* phone frame */}
          <div className="mx-auto">
            <div
              className="relative rounded-[44px] border border-[var(--hairline)] bg-[var(--ink)] p-[10px] shadow-[0_30px_60px_-20px_rgba(17,17,17,0.30)]"
              style={{ width: 264 }}
            >
              <div
                className="absolute left-1/2 top-[18px] z-10 h-[5px] w-[64px] -translate-x-1/2 rounded-full"
                style={{ background: "rgba(255,255,255,0.18)" }}
                aria-hidden
              />
              {/* Loader.html is designed for a real phone viewport (390×844).
                  Render at native iPhone resolution and scale-transform to fit
                  the 244×528 aperture — preserves hero wordmark scale + keeps
                  the downloadable .html byte-identical to the standalone. */}
              <div
                className="overflow-hidden rounded-[34px] bg-[#fafaf7]"
                style={{ width: 244, height: 528 }}
              >
                <iframe
                  src="/brand/loader.html"
                  title="signal studio. mobile loader"
                  loading="lazy"
                  className="block border-0 bg-[#fafaf7]"
                  style={{
                    width: 390,
                    height: 844,
                    transformOrigin: "top left",
                    transform: "scale(0.6257)",
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 overflow-hidden rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] sm:grid-cols-2">
              {[
                ["Choreography", "wordmark roll · products rise once · live pip"],
                ["Period", "5.0s loop · fade at 4.7s"],
                ["Reduced motion", "static wordmark · “ready”"],
                ["Type", "Geist 500 · Geist Mono chrome"],
                ["Ground", "#fafaf7 stone · safe-area aware"],
                ["Footprint", "single self-contained .html"],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex flex-col gap-1 p-5 ${i % 2 === 0 ? "sm:border-r" : ""} border-b border-[var(--hairline-2)] [&:nth-last-child(-n+1)]:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
                    {k}
                  </span>
                  <span className="text-[14px] leading-[1.45] text-[var(--ink)]">
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="/brand/loader.html"
                download="signal-studio-loader.html"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--paper)] px-4 py-2 font-mono text-[12px] tracking-[0.04em] text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
              >
                ↓ loader.html
              </a>
              <a
                href="/brand/loader.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 font-mono text-[12px] tracking-[0.04em] text-[var(--ink-faint)] transition-colors hover:text-[var(--ink)]"
              >
                ↗ open full screen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ASSETS */}
      <section className="border-t border-[var(--hairline-2)] py-20" id="assets">
        <SectionHead
          num="05 / 06"
          kicker="Asset library"
          title="The complete kit. SVG masters, PNG renders where exported."
          intro={
            <>
              Every brand surface in one place — wordmark, lockup, the dot,
              the app-icon tile, and four product wordmarks. SVGs are the{" "}
              <strong className="text-[var(--ink)]">canonical masters</strong>
              . PNGs are linked where the export exists for Slack, GitHub, and
              email. Use them. Don&apos;t recompose them.
            </>
          }
        />

        <div className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] px-6 py-5">
          <div className="font-mono text-[12px] text-[var(--ink-soft)]">
            <span className="text-[var(--ink)]">{total} files</span> ·{" "}
            {svg} SVG masters · {png} PNG renders mapped here · one zip
          </div>
          <a
            href="/brand/signal-studio-brand-kit.zip"
            download
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-2.5 font-mono text-[12px] tracking-[0.04em] text-[var(--paper)] transition-colors hover:bg-[var(--indigo)]"
          >
            ↓ Download everything
          </a>
        </div>

        <div className="flex flex-col gap-16">
          {ASSET_GROUPS.map((group) => (
            <div key={group.num}>
              <div className="mb-7 grid grid-cols-1 items-start gap-6 md:grid-cols-[220px_1fr]">
                <div className="font-mono text-[12px] tracking-[0.06em] text-[var(--ink-faint)]">
                  {group.num}
                  <span className="mx-2 text-[var(--ink-ghost)]">/</span>
                  {group.kicker}
                </div>
                <div>
                  <h3 className="m-0 mb-2 text-[24px] font-medium tracking-[-0.025em] text-[var(--ink)]">
                    {group.title}
                  </h3>
                  <p className="m-0 max-w-[560px] text-[14.5px] leading-[1.55] text-[var(--ink-soft)] text-pretty">
                    {group.blurb}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.assets.map((asset) => (
                  <AssetCard key={`${group.num}-${asset.base}`} asset={asset} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Email signatures + companion files */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
              Email signature · plain text
            </span>
            <pre className="m-0 whitespace-pre-wrap rounded-[var(--r-2)] border border-[var(--hairline-2)] bg-[var(--paper-deep)] p-4 font-mono text-[12px] leading-[1.6] text-[var(--ink)]">
{`Ethan McNamara
Founder · signal studio.

hello@signalstudio.ie
Limerick · Ireland · signalstudio.ie`}
            </pre>
            <div className="flex gap-2">
              <a
                href="/brand/email/signature.txt"
                download
                className="rounded-full border border-[var(--hairline)] bg-[var(--paper)] px-3 py-1.5 font-mono text-[11px] text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
              >
                ↓ signature.txt
              </a>
              <a
                href="/brand/email/signature-mini.txt"
                download
                className="rounded-full border border-[var(--hairline)] bg-[var(--paper)] px-3 py-1.5 font-mono text-[11px] text-[var(--ink-soft)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
              >
                ↓ signature-mini.txt
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
              Usage in plain English
            </span>
            <ol className="m-0 list-decimal pl-5 text-[14px] leading-[1.6] text-[var(--ink-soft)] marker:text-[var(--ink-faint)]">
              <li>Light wordmark on light, paper wordmark on ink. Match the surface.</li>
              <li>Never recolour the indigo dot. It&apos;s the brand.</li>
              <li>App-icon tiles are for favicons, launchers, social avatars.</li>
              <li>Lockups are the 16:9 share card — hero images and slide titles only.</li>
              <li>Don&apos;t recompose the wordmark. If a layout needs something different, ask.</li>
            </ol>
            <a
              href="mailto:hello@signalstudio.ie"
              className="mt-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--hairline)] bg-[var(--paper)] px-3 py-1.5 font-mono text-[11px] text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] self-start"
            >
              ↗ hello@signalstudio.ie
            </a>
          </div>
        </div>
      </section>

      {/* VOICE */}
      <section className="border-t border-[var(--hairline-2)] py-20">
        <SectionHead
          num="06 / 06"
          kicker="Voice"
          title="Plain English. The vocabulary of the work."
          intro={
            <>
              The 80% don&apos;t speak software. A wedding planner doesn&apos;t have{" "}
              <em className="not-italic font-medium text-[var(--indigo)]">epics</em>.
              A tradesperson doesn&apos;t run{" "}
              <em className="not-italic font-medium text-[var(--indigo)]">sprints</em>.
              Product copy reads like a thoughtful person describing what&apos;s
              in front of them — calm, exact, never selling.
            </>
          }
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              num: "V·01",
              title: "Banned words.",
              body: "unleash · empower · seamless · magical · revolutionary · 10x · delight · crush · disrupt · synergy · leverage. Strike on sight.",
            },
            {
              num: "V·02",
              title: "Banned PM vocabulary.",
              body: "sprint · epic · backlog · burndown · velocity · ticket · stand-up · groom · refine. Talk like a person who has the work in front of them.",
            },
            {
              num: "V·03",
              title: "Refusal language is signature.",
              body: "Not a productivity suite. Not a project manager. Not an AI workspace. The brand introduces itself by saying what it isn't first.",
            },
          ].map((r) => (
            <div
              key={r.num}
              className="rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] p-5"
            >
              <div className="mb-2 font-mono text-[10px] tracking-[0.06em] text-[var(--indigo)]">
                {r.num}
              </div>
              <h4 className="m-0 mb-1.5 text-[16px] font-medium tracking-[-0.015em] text-[var(--ink)]">
                {r.title}
              </h4>
              <p className="m-0 text-[13.5px] leading-[1.5] text-[var(--ink-soft)]">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial signoff */}
      <section className="grid grid-cols-1 items-end gap-12 border-t border-[var(--hairline-2)] py-20 md:grid-cols-2">
        <div>
          <h3 className="m-0 mb-3 flex items-baseline gap-1.5 text-[30px] font-medium tracking-[-0.025em] text-[var(--ink)]">
            Built slowly
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "var(--indigo)" }}
              aria-hidden
            />
            <span>Maintained quietly.</span>
          </h3>
          <p className="m-0 max-w-[380px] text-[15px] leading-[1.5] text-[var(--ink-faint)]">
            The brand sells nothing twice. Everything important, nothing
            distracting. When this system says no, it means no.
          </p>
        </div>
        <div className="font-mono text-[11px] tracking-[0.02em] text-[var(--ink-faint)]">
          {[
            ["Maintainer", "Ethan McNamara"],
            ["House", "signal studio."],
            ["Address", "Limerick, Ireland"],
            ["Mail", "hello@signalstudio.ie"],
            ["Version", "1.1 · 2026-05-18"],
            ["Status", "Living document"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between border-b border-[var(--hairline-2)] py-2 last:border-b-0"
            >
              <span>{k}</span>
              <span className="text-[var(--ink)]">{v}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
    <SiteFooter />
  </>
  );
}

function SectionHead({
  num,
  kicker,
  title,
  intro,
}: {
  num: string;
  kicker: string;
  title: string;
  intro: React.ReactNode;
}) {
  return (
    <div className="mb-12 grid grid-cols-1 items-start gap-12 md:grid-cols-[220px_1fr]">
      <div className="font-mono text-[12px] tracking-[0.06em] text-[var(--ink-faint)]">
        {num}
      </div>
      <div>
        <span className="mb-2.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
          {kicker}
        </span>
        <h2
          className="m-0 mb-3.5 text-balance font-medium text-[var(--ink)]"
          style={{
            fontSize: "clamp(30px, 4.4vw, 54px)",
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
          }}
        >
          {title}
        </h2>
        <p className="m-0 max-w-[640px] text-[17px] leading-[1.55] text-[var(--ink-soft)] text-pretty">
          {intro}
        </p>
      </div>
    </div>
  );
}

function TypeRow({
  label,
  meta,
  sample,
  sampleStyle,
  usage,
}: {
  label: string;
  meta: string;
  sample: string;
  sampleStyle: React.CSSProperties;
  usage: string;
}) {
  return (
    <div className="grid grid-cols-1 items-baseline gap-4 border-b border-[var(--hairline-2)] px-7 py-6 last:border-b-0 md:grid-cols-[110px_110px_1fr_140px]">
      <div className="font-mono text-[10px] tracking-[0.06em] text-[var(--ink-faint)]">
        <strong className="mb-0.5 block text-[12px] font-medium text-[var(--ink)]">
          {label}
        </strong>
        {meta}
      </div>
      <div className="font-mono text-[10px] tracking-[0.06em] text-[var(--ink-faint)]">
        {label === "mono" ? "geist mono" : label.startsWith("display") || label === "title" ? "geist 500" : "geist 400"}
      </div>
      <div
        className="text-pretty text-[var(--ink)]"
        style={{ letterSpacing: "-0.025em", fontWeight: 500, lineHeight: 1.05, ...sampleStyle }}
      >
        {sample}
      </div>
      <div className="font-mono text-[10.5px] tracking-[0.04em] text-[var(--ink-faint)]">
        {usage}
      </div>
    </div>
  );
}
