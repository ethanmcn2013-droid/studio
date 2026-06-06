/**
 * Direction C — the umbrella IS a Daily Signal briefing.
 *
 * An alternative landing concept (branch `direction-c-daily-signal`,
 * not production). Per docs/VISION.md §5: Analytics's product format
 * applied to the studio itself. Dated. Timestamped. Sectioned. Three
 * things in plain English. Silence is the signal.
 *
 * Server component — the date is computed at render time in Dublin
 * local. No client JS; no choreography; no ticker. Restraint is the
 * point. The brand work the reveal hero does in motion, this
 * concept does by *being the format the brand sells*.
 *
 * Voice: BRAND.md §3 (Stark+Jobs, declarative, no exclamation marks,
 * no PM jargon, plain English at ~7th-grade reading level). The body
 * copy below was authored against §3 cadence; no banned-words.
 */
import { SuiteSwitcher } from "@/components/layout/suite-switcher-pills";
import {
  ANALYTICS_URL,
  NOTES_URL,
  ROADMAP_URL,
  TASKS_URL,
} from "@/lib/product-urls";

export function DirectionCBriefing() {
  const now = new Date();
  const dateHeader = formatDateHeader(now);
  const timeStamp = formatTimestamp(now);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto w-full max-w-[760px] px-6 pb-32 pt-10"
    >
      {/* Suite-coherent chrome at the top — same SuiteSwitcher every
          product app surfaces. The umbrella reads as one of the family
          the moment you land, not as a marketing detour. */}
      <div className="flex justify-center">
        <SuiteSwitcher showUmbrella={false} />
      </div>

      {/* Briefing masthead — dated, timestamped, the Analytics product
          format applied to the studio itself. */}
      <header className="mt-14 border-b border-line-soft pb-6">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-quiet">
          Signal Studio · Daily Signal
        </p>
        <h1 className="mt-3 text-[clamp(2rem,1.4rem+2.4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
          {dateHeader}
        </h1>
        <p className="mt-3 text-[13px] text-ink-quiet">
          Compiled {timeStamp} · Dublin. The state of the suite, in
          plain English. Three sections. Silence is the signal.
        </p>
      </header>

      {/* Section 1 — what just shipped. The "ships" voice from §6.5 */}
      <section className="mt-12">
        <h2 className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-quiet">
          What just shipped
        </h2>
        <p className="mt-4 text-[18px] leading-[1.5] tracking-[-0.005em] text-ink">
          Signal Tasks closed the audience archetype set: all five
          BRAND.md §2.1 personas now carry dedicated landing pages,
          with the small-business operators and the public-facing
          coordinators newly wired to the sitemap and footer. The
          calm-status vocabulary thread also closed across the suite
          — Roadmap, Tasks, and Analytics now share a single human
          register, and Notes stays silent on status by spec.
        </p>
        <p className="mt-4 text-[14px] leading-[1.55] text-ink-soft">
          Detail: dispatch entries T·83 and the calm-vocab refusal in{" "}
          <a
            href="/hq/features/calm-status-vocabulary"
            className="underline decoration-line-soft underline-offset-[3px] hover:text-ink"
          >
            HQ →
          </a>
        </p>
      </section>

      {/* Section 2 — what's moving. */}
      <section className="mt-12">
        <h2 className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-quiet">
          What is moving
        </h2>
        <p className="mt-4 text-[18px] leading-[1.5] tracking-[-0.005em] text-ink">
          Signal Notes is being scaffolded as the fourth product —
          one-way Notes→Tasks promotion only, never auto-detect todos.
          Lock 1 of the PRODUCT.md is closed. The Show HN beat is
          ten days out and the Product Hunt beat is seventeen, both
          gated on Tasks launch polish rather than new product work.
        </p>
      </section>

      {/* Section 3 — what's quiet, and why. The honesty section. */}
      <section className="mt-12">
        <h2 className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-quiet">
          What is quiet — and why
        </h2>
        <p className="mt-4 text-[18px] leading-[1.5] tracking-[-0.005em] text-ink">
          The cross-product chrome — the top-bar product switcher,
          the shared auth seam — is deferred until Notes lands.
          That is on purpose. Building shared chrome against three
          products and a stub is how the chrome ends up shaped for
          the stub. Roadmap is waiting on the Upstash provisioning
          on Vercel; until that lands every write returns
          rate-limited in production. That is one operator action,
          not a roadmap item.
        </p>
        <p className="mt-4 text-[14px] leading-[1.55] text-ink-soft">
          A briefing that says "everything is moving" is not a
          briefing. Silence is itself information.
        </p>
      </section>

      {/* Footer — the four products, quiet, the way Analytics signs off */}
      <footer className="mt-20 border-t border-line-soft pt-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-quiet">
          The suite
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <BriefingProduct
            name="tasks·"
            tagline="Execution clarity"
            href={TASKS_URL}
          />
          <BriefingProduct
            name="roadmap·"
            tagline="Direction clarity"
            href={ROADMAP_URL}
          />
          <BriefingProduct
            name="analytics·"
            tagline="Attention clarity"
            href={ANALYTICS_URL}
          />
          <BriefingProduct
            name="notes·"
            tagline="Capture clarity"
            href={NOTES_URL}
          />
        </ul>
        <p className="mt-10 text-[12px] text-ink-quiet">
          Signal Studio. Project management for the 80% not in tech.
          Clarity, not configuration.
        </p>
      </footer>
    </main>
  );
}

function BriefingProduct({
  name,
  tagline,
  href,
}: {
  name: string;
  tagline: string;
  href: string;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block border border-line-soft px-4 py-3 transition-colors hover:border-line"
        style={{ transition: "border-color var(--motion-fast) var(--ease-standard)" }}
      >
        <span className="block text-[15px] font-medium text-ink">{name}</span>
        <span className="mt-1 block text-[12.5px] text-ink-quiet">
          {tagline}
        </span>
      </a>
    </li>
  );
}

function formatDateHeader(d: Date): string {
  const fmt = new Intl.DateTimeFormat("en-IE", {
    timeZone: "Europe/Dublin",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return fmt.format(d);
}

function formatTimestamp(d: Date): string {
  const fmt = new Intl.DateTimeFormat("en-IE", {
    timeZone: "Europe/Dublin",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return fmt.format(d);
}
