/**
 * Reveal products — four typographic-poster rows. Position-clarity label
 * as mono eyebrow → giant wordmark → essence + meta. Hrefs point at the
 * real product subdomains via product-urls.ts.
 *
 * Each row's layout enters from both sides on scroll (left from -x,
 * right from +x) — directional, not generic fade-up. Per-character
 * hover lift on the wordmark is wired in RevealEngine, gated to
 * (hover: hover) devices.
 */

import {
  TASKS_URL,
  ROADMAP_URL,
  ANALYTICS_URL,
  NOTES_URL,
} from "@/lib/product-urls";

interface ProductRowProps {
  id: string;
  dataKey: "tasks" | "roadmap" | "analytics" | "notes";
  position: string;
  word: string;
  essence: string;
  pills: string[];
  cta: string;
  href: string;
  external?: boolean;
  comingSoon?: boolean;
}

function ProductRow({
  id,
  dataKey,
  position,
  word,
  essence,
  pills,
  cta,
  href,
  external,
  comingSoon,
}: ProductRowProps) {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};

  return (
    <a
      className="reveal-product-row"
      id={id}
      data-key={dataKey}
      href={href}
      {...linkProps}
    >
      <div className="left">
        <div className="position">{position}</div>
        <span className="mark">
          <span className="word">{word}</span>
          <span className="dot" />
        </span>
      </div>
      <div className="right">
        <p className="essence">{essence}</p>
        <div className="meta">
          {pills.map((label, i) => (
            <span
              key={label}
              className={`pill${i === 0 && comingSoon ? " soon" : ""}`}
            >
              {label}
            </span>
          ))}
          <span className="open">{cta}</span>
        </div>
      </div>
    </a>
  );
}

export function RevealProducts() {
  return (
    <section className="reveal-products">
      <div className="reveal-products-head">
        Four products <span className="gold">·</span> one voice
      </div>

      <ProductRow
        id="tasks"
        dataKey="tasks"
        position="Execution clarity"
        word="tasks"
        essence="Run the work. Without the project-manager voice."
        pills={["Live", "Multi-view"]}
        cta="Open the workspace →"
        href={TASKS_URL}
        external
      />
      <ProductRow
        id="roadmap"
        dataKey="roadmap"
        position="Direction clarity"
        word="roadmap"
        essence="Show what you’re building. In plain English, on a public page."
        pills={["Live", "Public roadmaps"]}
        cta="Open the roadmap →"
        href={ROADMAP_URL}
        external
      />
      <ProductRow
        id="analytics"
        dataKey="analytics"
        position="Attention clarity"
        word="analytics"
        essence="A morning briefing. Not a dashboard."
        pills={["Live", "Daily Signal"]}
        cta="Open the briefing →"
        href={ANALYTICS_URL}
        external
      />
      <ProductRow
        id="notes"
        dataKey="notes"
        position="Capture clarity"
        word="notes"
        essence="Catch what slips. Find it again later."
        pills={["Soon", "In design"]}
        cta="See what’s coming →"
        href={NOTES_URL}
        external
        comingSoon
      />
    </section>
  );
}
