import { memo } from "react";
import { evaluateClip } from "@/lib/dot/clips";
import { clipInfo, type ClipId, type DotColor } from "@/lib/dot/model";
import { renderContents } from "@/lib/dot/render";

/** Static, memoized library specimens. Only the main stage runs a clock. */
export const DotSpecimen = memo(function DotSpecimen({
  clip,
  color = "indigo",
  className,
}: {
  clip: ClipId;
  color?: DotColor;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="-70 -70 140 140"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{
        __html: renderContents(evaluateClip(clip, clipInfo(clip).poster), {
          color,
          stage: "transparent",
          effects:
            clip === "orbit" || clip === "notice" || clip === "satellites",
          grounded: false,
        }),
      }}
    />
  );
});

export function DotIcon({
  kind,
  size = 18,
}: {
  kind:
    | "play"
    | "pause"
    | "replay"
    | "back"
    | "next"
    | "download"
    | "inspect"
    | "close"
    | "sun"
    | "moon"
    | "arrow"
    | "plus";
  size?: number;
}) {
  const paths = {
    play: <path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none" />,
    pause: (
      <>
        <path d="M8 5v14M16 5v14" strokeWidth="3.5" />
      </>
    ),
    replay: (
      <>
        <path d="M4 10a8 8 0 1 1 2 8M4 4v6h6" />
      </>
    ),
    back: (
      <>
        <path d="M6 5v14m12-14-9 7 9 7Z" />
      </>
    ),
    next: (
      <>
        <path d="M18 5v14M6 5l9 7-9 7Z" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4" />
      </>
    ),
    inspect: (
      <>
        <path d="M4 7h16M4 17h16M8 4v6m8 4v6" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" />
      </>
    ),
    moon: <path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10Z" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[kind]}
    </svg>
  );
}
