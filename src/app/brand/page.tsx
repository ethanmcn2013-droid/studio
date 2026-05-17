import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { Wordmark } from "@/components/brand/wordmark";
import { MotionSpecimen } from "@/components/brand/motion-specimen";
import { ReadingProgress } from "@/components/reading-progress";

export const metadata: Metadata = {
  title: "Brand · signal studio.",
  description:
    "The full signal studio brand system — wordmarks, palette, typography, and downloadable assets. One umbrella. One indigo. Boring on purpose.",
  openGraph: {
    title: "signal studio. · brand system",
    description: "One umbrella. One indigo. Boring on purpose.",
    type: "website",
  },
};

type LogoFile = {
  file: string;
  name: string;
  surface: "paper" | "ink" | "indigo";
  variant: "signal" | "tasks" | "roadmap" | "analytics" | "notes";
  kind: "wordmark" | "lockup" | "mark";
};

const LOGOS: LogoFile[] = [
  { file: "signal-studio.svg", name: "signal studio. · wordmark", surface: "paper", variant: "signal", kind: "wordmark" },
  { file: "signal-studio-on-dark.svg", name: "signal studio. · on dark", surface: "ink", variant: "signal", kind: "wordmark" },
  { file: "signal-studio-mono.svg", name: "signal studio. · monochrome", surface: "paper", variant: "signal", kind: "wordmark" },
  { file: "signal-studio-mark.svg", name: "signal studio. · square mark", surface: "ink", variant: "signal", kind: "mark" },
  { file: "signal-studio-monogram.svg", name: "signal studio. · monogram", surface: "paper", variant: "signal", kind: "mark" },
  { file: "signal-tasks.svg", name: "tasks· · wordmark", surface: "paper", variant: "tasks", kind: "wordmark" },
  { file: "signal-tasks-full.svg", name: "tasks· · full lockup", surface: "paper", variant: "tasks", kind: "lockup" },
  { file: "lockup-tasks.svg", name: "tasks· · house lockup", surface: "paper", variant: "tasks", kind: "lockup" },
  { file: "mark-tasks.svg", name: "tasks· · square mark", surface: "ink", variant: "tasks", kind: "mark" },
  { file: "signal-roadmap.svg", name: "roadmap· · wordmark", surface: "paper", variant: "roadmap", kind: "wordmark" },
  { file: "signal-roadmap-full.svg", name: "roadmap· · full lockup", surface: "paper", variant: "roadmap", kind: "lockup" },
  { file: "mark-roadmap.svg", name: "roadmap· · square mark", surface: "ink", variant: "roadmap", kind: "mark" },
  { file: "signal-analytics.svg", name: "analytics· · wordmark", surface: "paper", variant: "analytics", kind: "wordmark" },
  { file: "signal-analytics-full.svg", name: "analytics· · full lockup", surface: "paper", variant: "analytics", kind: "lockup" },
  { file: "mark-analytics.svg", name: "analytics· · square mark", surface: "ink", variant: "analytics", kind: "mark" },
  { file: "signal-notes.svg", name: "notes. · wordmark", surface: "paper", variant: "notes", kind: "wordmark" },
  { file: "signal-notes-full.svg", name: "notes. · full lockup", surface: "paper", variant: "notes", kind: "lockup" },
  { file: "mark-notes.svg", name: "notes. · square mark", surface: "ink", variant: "notes", kind: "mark" },
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
// Each line describes the gesture as it actually ships — not the
// retired pre-canon vocabulary (heartbeat tap-tap / 2.4s squash).
const MOTIONS: Array<{ code: string; variant: LogoFile["variant"]; name: string; cycle: string; line: string }> = [
  { code: "M·01", variant: "signal", name: "broadcast", cycle: "once", line: "One ring radiates from the period and is gone. The house announcing itself on arrival — said once, never repeated." },
  { code: "M·02", variant: "tasks", name: "pulse", cycle: "2.6s", line: "The dot breathes at rest and quickens under load. Work — alive, but unhurried." },
  { code: "M·03", variant: "roadmap", name: "sweep", cycle: "5.4s", line: "The dot tracks left to right along an unseen timeline, then resets. Direction without urgency." },
  { code: "M·04", variant: "analytics", name: "tick", cycle: "3.6s", line: "The dot snaps between discrete sample heights and holds — never gliding. Reading the signal, not streaming it." },
  { code: "M·05", variant: "notes", name: "caret", cycle: "1.1s", line: "Blinks like a held cursor. A thought mid-formation." },
];

const REFUSALS = [
  { num: "N·01", text: "Hero with laptop mockup + 3-column features grid." },
  { num: "N·02", text: "Project-management vocabulary: sprints, epics, burndowns." },
  { num: "N·03", text: "Productivity-coach voice. Phrases that hustle you." },
  { num: "N·04", text: "AI-workspace framing. \"Your second brain.\" \"Magical.\"" },
  { num: "N·05", text: "Stock photography of teams pointing at screens." },
  { num: "N·06", text: "Emoji as decoration. Anywhere. Including in product copy." },
  { num: "N·07", text: "A roadmap that promises features the team won't ship." },
];

function AssetCard({ logo }: { logo: LogoFile }) {
  const surfaceBg =
    logo.surface === "ink"
      ? "var(--ink)"
      : logo.surface === "indigo"
        ? "var(--indigo)"
        : "var(--paper-deep)";

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] transition-transform hover:-translate-y-[3px]">
      <div
        className="flex aspect-[16/9] items-center justify-center"
        style={{ background: surfaceBg }}
      >
        <img
          src={`/brand/logos/${logo.file}`}
          alt={logo.name}
          loading="lazy"
          decoding="async"
          className="max-h-[60%] max-w-[70%]"
        />
      </div>
      <div className="flex flex-col gap-1 px-[18px] pt-4 pb-[18px]">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
          {logo.kind}
        </span>
        <span className="text-[15px] font-medium tracking-[-0.015em] text-[var(--ink)]">
          {logo.name}
        </span>
        <span className="mt-1 font-mono text-[10.5px] text-[var(--ink-faint)]">
          {logo.file}
        </span>
        <div className="mt-3 flex gap-1.5">
          <a
            href={`/brand/logos/${logo.file}`}
            download
            className="inline-flex min-h-[40px] items-center rounded-full border border-[var(--hairline)] bg-[var(--paper)] px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]"
          >
            ↓ svg
          </a>
          <a
            href={`/brand/logos/${logo.file}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[40px] items-center rounded-full border border-[var(--hairline)] bg-[var(--paper)] px-3 py-1.5 font-mono text-[11px] tracking-[0.04em] text-[var(--ink-soft)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
          >
            ↗ open
          </a>
        </div>
      </div>
    </div>
  );
}

function SwatchCard({ token, hex, desc }: { token: string; hex: string; desc: string }) {
  const isDark = ["#4F46E5", "#111111", "#3F3F46", "#71717A"].includes(hex);
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
      {/* visual swatch is rendered with explicit hex so the page stays correct even if the token shifts */}
      <span className="sr-only">{isDark ? "dark" : "light"}</span>
    </div>
  );
}

export default function BrandPage() {
  return (
    <>
    <ReadingProgress />
    <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1200px] px-8 pb-32">
      {/* HERO */}
      <header className="pt-24 pb-12">
        <div className="mb-9 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--ink-faint)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-2.5 py-1 text-[10px] tracking-[0.06em] text-[var(--paper)]">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--indigo)", boxShadow: "0 0 0 3px rgba(79,70,229,0.30)" }}
              aria-hidden
            />
            Brand · living document
          </span>
          <span>v1.0 · 2026.05.16</span>
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
          <span className="text-[var(--indigo)] font-semibold">.</span>
        </h1>

        <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-[1fr_320px]">
          <p className="m-0 max-w-[580px] text-[19px] leading-[1.5] text-[var(--ink-soft)] text-pretty">
            The brand system for{" "}
            <Wordmark variant="signal" size="sm" animate />. One house, four
            products, one indigo. Built for the people the work routes
            through, not the people who run sprints.{" "}
            <strong className="font-semibold text-[var(--ink)]">
              Everything important, nothing distracting.
            </strong>
          </p>
          <div className="border-l border-[var(--hairline)] pl-6 font-mono text-[11px] leading-[1.7] tracking-[0.02em] text-[var(--ink-faint)]">
            {[
              ["Maintainer", "Ethan McNamara"],
              ["House", "signal studio."],
              ["Products", "04"],
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

      {/* WORDMARKS */}
      <section className="border-t border-[var(--hairline-2)] py-20">
        <SectionHead
          num="01 / 05"
          kicker="The mark"
          title="Five wordmarks. Five motions."
          intro={
            <>
              The signature is a single indigo circle at the end of the
              wordmark. The umbrella + nouns take a <em className="not-italic font-medium text-[var(--indigo)]">period</em>,
              baseline-seated. The verbs take a{" "}
              <em className="not-italic font-medium text-[var(--indigo)]">middot</em>,
              lifted toward the cap-height. Each wordmark carries its own
              ambient motion — a pulse fitting the product's job.
            </>
          }
        />

        <div className="grid grid-cols-2 overflow-hidden rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] sm:grid-cols-3 md:grid-cols-5">
          {MOTIONS.map((m, i) => (
            <MotionSpecimen
              key={m.code}
              variant={m.variant}
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
                {m.variant === "signal" ? "signal studio." : m.variant + (m.variant === "notes" ? "." : "·")}
              </h4>
              <p className="m-0 text-[12.5px] leading-[1.5] text-[var(--ink-soft)]">{m.line}</p>
            </div>
          ))}
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
          num="02 / 05"
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
          num="03 / 05"
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
            sample="— signal studio · brand index · 2026.05.16"
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

      {/* ASSETS */}
      <section className="border-t border-[var(--hairline-2)] py-20" id="assets">
        <SectionHead
          num="04 / 05"
          kicker="Asset library"
          title="Every brand surface, in one place."
          intro={
            <>
              Eighteen wordmarks and marks across the suite — house, lockups,
              dark variants, square marks. Every asset ships as{" "}
              <strong className="text-[var(--ink)]">SVG</strong> (vector,
              editable). Use them. Don&apos;t recompose them.
            </>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LOGOS.map((logo) => (
            <AssetCard key={logo.file} logo={logo} />
          ))}
        </div>

        {/* Email signatures + companion files */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-[var(--r-3)] border border-[var(--hairline)] bg-[var(--paper-elev)] p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--ink-faint)]">
              Email signature · plain text
            </span>
            <pre className="m-0 whitespace-pre-wrap rounded-[var(--r-2)] border border-[var(--hairline-2)] bg-[var(--paper-deep)] p-4 font-mono text-[12px] leading-[1.6] text-[var(--ink)]">
{`Ethan McNamara
Founder · signal studio.

hello@signalstudio.ie
Dublin · Ireland · signalstudio.ie`}
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
              <li>Use the wordmark in the right surface — light SVG on paper, dark SVG on ink.</li>
              <li>Never recolour the indigo dot. It&apos;s the brand.</li>
              <li>Square marks are for favicons, app icons, social avatars.</li>
              <li>Lockups (full) include the house tag; use them only where context needs it.</li>
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

      {/* VOICE / FOOTER */}
      <section className="border-t border-[var(--hairline-2)] py-20">
        <SectionHead
          num="05 / 05"
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

      {/* Editorial signoff — stays brand-page-specific because /brand IS
          an editorial object. The standard SiteFooter handles nav + tagline
          + legal links below it. */}
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
            ["Address", "Dublin, Ireland"],
            ["Mail", "hello@signalstudio.ie"],
            ["Version", "1.0 · 2026-05-16"],
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
