import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { MotionSpecimen } from "@/components/brand/motion-specimen";
import { Dissolve } from "@/components/design/dissolve";
import { LoadingCanon } from "@/components/design/loading-canon";
import { AppliedMotion } from "@/components/brand-guidelines/applied-motion";
import { ApplicationGallery } from "@/components/brand-guidelines/application-gallery";
import { AssetLedger } from "@/components/brand-guidelines/asset-ledger";
import { ColorSystem } from "@/components/brand-guidelines/color-system";
import { GuidelinesEngine } from "@/components/brand-guidelines/guidelines-engine";
import { HeroSequence } from "@/components/brand-guidelines/hero-sequence";
import { Moodboard } from "@/components/brand-guidelines/moodboard";
import { MotionCurve } from "@/components/brand-guidelines/motion-curve";
import { GUIDELINE_SECTIONS } from "@/lib/brand-guidelines/sections";
import { getAccessMode } from "@/lib/access-mode";
import type { GuidelineSectionId } from "@/lib/brand-guidelines/types";
import "./guidelines.css";

export const metadata: Metadata = {
  title: "Signal Studio brand guidelines",
  description:
    "The Signal Studio system for logo, color, typography, motion, voice, imagery, applications, and approved assets.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

const MOTIONS = [
  { kind: "studio", name: "Broadcast", cycle: "one shot" },
  { kind: "notes", name: "Caret", cycle: "1.1s" },
  { kind: "tasks", name: "Pulse", cycle: "2.6s" },
  { kind: "timeline", name: "Sweep", cycle: "5.4s" },
  { kind: "signal", name: "Tick", cycle: "3.6s" },
] as const;

const TYPE_STEPS = [
  ["Display", "Everything important.", "var(--text-display)", "600"],
  ["Title", "Nothing distracting.", "var(--text-title)", "600"],
  ["Section", "The work, in order.", "var(--text-section)", "600"],
  ["Heading", "Who owns the next step", "var(--text-heading)", "600"],
  ["Body large", "A clear sentence for a clear decision.", "var(--text-body-lg)", "400"],
  ["Body", "Useful detail without product theatre.", "var(--text-body)", "400"],
  ["Body small", "Supporting context stays readable.", "var(--text-body-sm)", "400"],
  ["Caption", "Harbour House, Saturday", "var(--text-caption)", "500"],
  ["Label", "READY FOR REVIEW", "var(--text-label)", "500"],
] as const;

const VOICE_PRINCIPLES = [
  {
    title: "Say the true thing.",
    copy: "Name what happened, what matters now, and what the person can do next.",
  },
  {
    title: "Plain over clever.",
    copy: "Use the words people already use for their work.",
  },
  {
    title: "One sentence, one job.",
    copy: "A sentence either explains, asks, confirms, or refuses.",
  },
  {
    title: "Refusal is signature.",
    copy: "Signal Studio earns trust by naming what it will not pretend to know.",
  },
] as const;

const VOICE_EXAMPLES = [
  {
    context: "Campaign",
    dont: "Turn chaos into effortless productivity.",
    do: "Know what needs you today.",
  },
  {
    context: "Product",
    dont: "Centralize cross-functional workstreams.",
    do: "Keep the plan, the work, and the update together.",
  },
  {
    context: "Error",
    dont: "Something went wrong. Try again later.",
    do: "We could not save this note. Your draft is still here.",
  },
  {
    context: "Action",
    dont: "Unlock your potential.",
    do: "Create the project.",
  },
] as const;

function ChapterHead({ id }: { id: GuidelineSectionId }) {
  const section = GUIDELINE_SECTIONS.find((item) => item.id === id);
  if (!section) return null;
  return (
    <header className="guidelines-chapter-head">
      <p>{section.label}</p>
      <h2>{section.title}</h2>
      <div className="guidelines-chapter-rule" aria-hidden />
      <p>{section.summary}</p>
    </header>
  );
}

function hostname(value: string | null): string {
  return (value ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
}

export default async function BrandGuidelinesLabPage() {
  const mode = getAccessMode();
  const requestHeaders = await headers();
  const host = hostname(
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host"),
  );
  const isCanonicalProductionHost =
    host === "signalstudio.ie" || host === "www.signalstudio.ie";
  const isProductionDeployment = process.env.VERCEL_ENV === "production";

  if (
    isProductionDeployment ||
    isCanonicalProductionHost ||
    (mode !== "development" && mode !== "review")
  ) {
    notFound();
  }

  return (
    <main id="main" className="guidelines-root">
      <GuidelinesEngine sections={GUIDELINE_SECTIONS} />

      <div className="guidelines-document">
        <section
          id="introduction"
          data-guideline-section
          className="guidelines-chapter guidelines-introduction"
        >
          <div className="guidelines-hero-copy">
            <Wordmark kind="studio" animate={false} size="sm" />
            <h1>Everything important. Nothing distracting.</h1>
            <dl>
              <div><dt>Category</dt><dd>Operational clarity</dd></div>
              <div><dt>Audience</dt><dd>The 80% not in tech</dd></div>
              <div><dt>System</dt><dd>Four products, one app</dd></div>
              <div><dt>Order</dt><dd>Notes, Tasks, Timeline, Signal</dd></div>
            </dl>
          </div>

          <HeroSequence />

          <div className="guidelines-intro-spread guidelines-container">
            <p>Most software gives you more. Signal Studio gives you less.</p>
            <div>
              <article>
                <span>Notes</span>
                <h2>Remember the thing.</h2>
                <p>Keep the thought, decision, or detail close to the project it belongs to.</p>
              </article>
              <article>
                <span>Tasks</span>
                <h2>Own the next step.</h2>
                <p>Make responsibility visible without turning work into administration.</p>
              </article>
              <article>
                <span>Timeline</span>
                <h2>See the order.</h2>
                <p>Give the plan a shape that makes sense before anyone opens the app.</p>
              </article>
              <article>
                <span>Signal</span>
                <h2>Notice what changed.</h2>
                <p>Bring the useful update forward and let everything else stay quiet.</p>
              </article>
            </div>
          </div>
        </section>

        <section
          id="logo"
          data-guideline-section
          className="guidelines-chapter guidelines-logo"
        >
          <div className="guidelines-container">
            <ChapterHead id="logo" />

            <div
              className="guidelines-logo-build"
              role="img"
              aria-label="Signal Studio wordmark construction"
            >
              <div aria-hidden className="guidelines-logo-build-mask">
                {"signal studio".split("").map((character, index) => (
                  <span
                    key={`${character}-${index}`}
                    style={{ "--letter-index": index } as CSSProperties}
                  >
                    {character === " " ? "\u00a0" : character}
                  </span>
                ))}
                <i />
              </div>
            </div>

            <div className="guidelines-logo-contexts">
              <div className="is-paper">
                <Wordmark kind="studio" animate={false} size="lg" />
                <span>Paper</span>
              </div>
              <div className="is-ink">
                <Wordmark kind="studio" animate={false} size="lg" />
                <span>Ink</span>
              </div>
              <div className="is-indigo">
                <Wordmark kind="studio" animate={false} size="lg" />
                <span>Indigo</span>
              </div>
            </div>

            <div className="guidelines-logo-construction">
              <div className="guidelines-construction-stage">
                <span className="guidelines-cap-line">cap height</span>
                <span className="guidelines-base-line">baseline</span>
                <Wordmark kind="studio" animate={false} size="xl" />
              </div>
              <dl>
                <div><dt>Dot</dt><dd>0.16x cap height</dd></div>
                <div><dt>Gap</dt><dd>0.06em after the word</dd></div>
                <div><dt>Period</dt><dd>Finished things: notes. and signal.</dd></div>
                <div><dt>Middot</dt><dd>Working tools: tasks and timeline</dd></div>
              </dl>
            </div>

            <div className="guidelines-product-marks">
              {MOTIONS.slice(1).map((motion) => (
                <MotionSpecimen
                  key={motion.kind}
                  kind={motion.kind}
                  name={motion.name}
                  cycle={motion.cycle}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          id="color"
          data-guideline-section
          className="guidelines-chapter guidelines-color"
        >
          <div className="guidelines-container">
            <ChapterHead id="color" />
            <ColorSystem />
          </div>
        </section>

        <section
          id="typography"
          data-guideline-section
          className="guidelines-chapter guidelines-typography"
        >
          <div className="guidelines-container">
            <ChapterHead id="typography" />

            <div className="guidelines-type-specimen">
              <p>Geist</p>
              <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
              <p>abcdefghijklmnopqrstuvwxyz</p>
              <p>0123456789&nbsp;&nbsp;.,:;!?&amp;@</p>
            </div>

            <div className="guidelines-weight-lanes">
              <p style={{ fontWeight: 400 }}><span>400</span>Clear enough to disappear.</p>
              <p style={{ fontWeight: 500 }}><span>500</span>Present when a choice matters.</p>
              <p style={{ fontWeight: 600 }}><span>600</span>Strong enough to set the order.</p>
            </div>

            <div className="guidelines-type-scale">
              {TYPE_STEPS.map(([name, sample, size, weight], index) => (
                <article
                  key={name}
                  style={{ "--type-index": index } as CSSProperties}
                >
                  <span>{name}</span>
                  <p style={{ fontSize: size, fontWeight: Number(weight) }}>{sample}</p>
                  <code>{size} / {weight}</code>
                </article>
              ))}
            </div>

            <div className="guidelines-type-rules">
              <p>Weights 400, 500, 600. Never 700.</p>
              <p>Large type tightens. Labels open up.</p>
              <p>Body copy stops near 65 characters.</p>
              <p className="is-tabular">08:30&nbsp;&nbsp;19,898&nbsp;&nbsp;€89.99</p>
            </div>
          </div>
        </section>

        <section
          id="motion"
          data-guideline-section
          className="guidelines-chapter guidelines-motion"
        >
          <div className="guidelines-container">
            <ChapterHead id="motion" />

            <div className="guidelines-subhead">
              <h3>In motion</h3>
              <p>Five names. Five gestures. Hover to replay. Activate to freeze.</p>
            </div>
            <div className="guidelines-motion-specimens">
              {MOTIONS.map((motion) => (
                <MotionSpecimen
                  key={motion.kind}
                  kind={motion.kind}
                  name={motion.name}
                  cycle={motion.cycle}
                />
              ))}
            </div>

            <div className="guidelines-subhead">
              <h3>In real use</h3>
              <p>Motion follows the event that made it necessary.</p>
            </div>
            <AppliedMotion />

            <div className="guidelines-subhead">
              <h3>The curve</h3>
              <p>Four durations. Two curves. One way of arriving.</p>
            </div>
            <div className="guidelines-duration-row">
              <span><strong>80</strong>ms</span>
              <span><strong>140</strong>ms</span>
              <span><strong>220</strong>ms</span>
              <span><strong>400</strong>ms</span>
            </div>
            <MotionCurve />

            <div className="guidelines-subhead guidelines-loading-head">
              <h3>The loading canon</h3>
              <p>Waiting tells the truth. It never invents progress.</p>
            </div>
            <LoadingCanon autoAdvance={false} singleRun />
          </div>
        </section>

        <section
          id="voice-and-tone"
          data-guideline-section
          className="guidelines-chapter guidelines-voice"
        >
          <div className="guidelines-container">
            <ChapterHead id="voice-and-tone" />

            <div className="guidelines-voice-principles">
              {VOICE_PRINCIPLES.map((principle, index) => (
                <article key={principle.title} style={{ "--voice-index": index } as CSSProperties}>
                  <h3>{principle.title}</h3>
                  <p>{principle.copy}</p>
                </article>
              ))}
            </div>

            <div className="guidelines-voice-edit">
              <p>Editing software language</p>
              <Dissolve />
            </div>

            <div className="guidelines-voice-examples">
              {VOICE_EXAMPLES.map((example) => (
                <article key={example.context}>
                  <h3>{example.context}</h3>
                  <div data-copy-tone="dont">
                    <span>Do not</span>
                    <p>{example.dont}</p>
                  </div>
                  <div data-copy-tone="do">
                    <span>Do</span>
                    <p>{example.do}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="moodboard"
          data-guideline-section
          className="guidelines-chapter guidelines-moodboard-section"
        >
          <div className="guidelines-container">
            <ChapterHead id="moodboard" />
          </div>
          <Moodboard />
        </section>

        <section
          id="applications"
          data-guideline-section
          className="guidelines-chapter guidelines-applications-section"
        >
          <div className="guidelines-container">
            <ChapterHead id="applications" />
            <ApplicationGallery />
          </div>
        </section>

        <section
          id="assets"
          data-guideline-section
          className="guidelines-chapter guidelines-assets-section"
        >
          <div className="guidelines-container">
            <ChapterHead id="assets" />
            <AssetLedger />
            <div className="guidelines-closing">
              <Wordmark kind="studio" animate={false} size="xl" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
