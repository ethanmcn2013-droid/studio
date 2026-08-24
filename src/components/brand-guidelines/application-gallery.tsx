import Image from "next/image";
import { FlipCard } from "@/components/design/flip-card";
import type { ApplicationStatus } from "@/lib/brand-guidelines/types";

interface Application {
  title: string;
  detail: string;
  src: string;
  alt: string;
  status: ApplicationStatus;
  aspect: "wide" | "screen" | "portrait" | "square" | "card";
  interactive?: boolean;
}

const APPLICATIONS: readonly Application[] = [
  {
    title: "Unified app rail",
    detail: "The four products, in their canonical order.",
    src: "/brand/guidelines/applications/notes-wedding.webp",
    alt: "The shared Signal Studio app rail above Signal Notes.",
    status: "live",
    aspect: "wide",
    interactive: true,
  },
  {
    title: "Signal Notes",
    detail: "A venue meeting note inside the wedding project.",
    src: "/brand/guidelines/applications/notes-wedding.webp",
    alt: "Signal Notes wedding project surface.",
    status: "live",
    aspect: "screen",
    interactive: true,
  },
  {
    title: "Signal Tasks",
    detail: "The same project, expressed as clear ownership.",
    src: "/brand/guidelines/applications/tasks-board.webp",
    alt: "Signal Tasks project board.",
    status: "live",
    aspect: "screen",
    interactive: true,
  },
  {
    title: "Signal Timeline",
    detail: "A public plan that reads without product training.",
    src: "/brand/guidelines/applications/timeline-wedding.webp",
    alt: "Signal Timeline public wedding plan.",
    status: "live",
    aspect: "screen",
    interactive: true,
  },
  {
    title: "Signal",
    detail: "A briefing surface, not a second dashboard.",
    src: "/brand/guidelines/applications/signal-briefing.webp",
    alt: "Signal daily briefing.",
    status: "live",
    aspect: "screen",
    interactive: true,
  },
  {
    title: "Public home",
    detail: "The front door to one app with four products.",
    src: "/brand/guidelines/applications/studio-home.webp",
    alt: "Signal Studio public home page.",
    status: "live",
    aspect: "wide",
    interactive: true,
  },
  {
    title: "Browser and favicon",
    detail: "The dot survives at sixteen pixels.",
    src: "/brand/kit/png/app-icon/indigo-512.png",
    alt: "Signal Studio indigo app icon.",
    status: "approved",
    aspect: "square",
  },
  {
    title: "iOS icon study",
    detail: "In build. Not presented as a shipped app.",
    src: "/brand/kit/png/app-icon/paper-512.png",
    alt: "Signal Studio paper app icon study.",
    status: "concept",
    aspect: "square",
  },
  {
    title: "Presentation title",
    detail: "A useful claim, one hierarchy, one indigo.",
    src: "/brand/guidelines/applications/presentation-title.webp",
    alt: "Signal Studio presentation title slide.",
    status: "approved",
    aspect: "wide",
  },
  {
    title: "Email signature",
    detail: "Identity reduced to what the recipient needs.",
    src: "/brand/collateral/identity/email-signature-preview.png",
    alt: "Signal Studio email signature.",
    status: "approved",
    aspect: "wide",
  },
  {
    title: "Venue one-pager",
    detail: "The product explained for a working venue.",
    src: "/brand/collateral/venue/venue-onepager-preview.png",
    alt: "Signal Studio venue one-page guide.",
    status: "approved",
    aspect: "portrait",
  },
  {
    title: "Campaign poster",
    detail: "A refusal expressed in one sentence.",
    src: "/brand/collateral/identity/campaign-poster-preview.png",
    alt: "Signal Studio campaign poster reading Most projects never get called one.",
    status: "approved",
    aspect: "portrait",
  },
  {
    title: "Social system",
    detail: "A sourced number with no decorative theatre.",
    src: "/brand/collateral/social/s1-number-n01-ig-square.png",
    alt: "Signal Studio numbered social campaign post.",
    status: "approved",
    aspect: "square",
  },
  {
    title: "Partner card",
    detail: "A numbered object for a real relationship.",
    src: "/brand/collateral/identity/fp-card-preview.png",
    alt: "Signal Studio founding partner card.",
    status: "approved",
    aspect: "card",
  },
] as const;

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  live: "Live",
  approved: "Approved asset",
  concept: "Concept",
};

export function ApplicationGallery() {
  return (
    <div className="guidelines-applications">
      {APPLICATIONS.map((application, index) => {
        if (application.title === "Partner card") {
          return (
            <figure
              key={application.title}
              className="guidelines-application guidelines-application-card"
              data-aspect="card"
            >
              <FlipCard
                front="/brand/collateral/identity/fp-card-preview.png"
                back="/brand/collateral/explorations/fpx-indigo-back-preview.png"
                frontAlt="Signal Studio founding partner card, numbered one of twenty-five."
                backAlt="The indigo reverse with founder contact details."
                width={748}
                height={522}
              />
              <figcaption>
                <span>{STATUS_LABEL[application.status]}</span>
                <strong>{application.title}</strong>
                <p>{application.detail}</p>
              </figcaption>
            </figure>
          );
        }

        return (
          <figure
            key={application.title}
            className="guidelines-application"
            data-aspect={application.aspect}
            data-interactive={application.interactive || undefined}
            tabIndex={application.interactive ? 0 : undefined}
            aria-label={
              application.interactive
                ? `${application.title}. Focus or hover to replay the attention move.`
                : undefined
            }
          >
            <div className="guidelines-application-media">
              <Image
                src={application.src}
                alt={application.alt}
                fill
                sizes={
                  index < 2
                    ? "(max-width: 760px) 100vw, 65vw"
                    : "(max-width: 760px) 100vw, 32vw"
                }
              />
            </div>
            <figcaption>
              <span>{STATUS_LABEL[application.status]}</span>
              <strong>{application.title}</strong>
              <p>{application.detail}</p>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
