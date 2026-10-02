import type { ReactNode } from "react";
import { shotGeometry, shotSizes, shotSources } from "./shot-sources";
import { v } from "./style-vars";

/** A ring on the capture, in the capture's own pixels. */
export type Spot = { x: number; y: number; w: number; h: number };

/**
 * One product capture in its frame. Every number the frame needs is in the
 * markup: its shape, where the picture sits in it and where the rings go, so
 * the page has its final height before any script runs.
 *
 * The dark file is in the markup. The boot script and the runtime point it
 * at the light file when the page is light, which is why the attributes may
 * differ from the server's by the time React arrives.
 */
export function Shot({
  name,
  alt,
  className = "",
  spots = [],
  fade = false,
  view,
  children,
}: {
  name: string;
  alt: string;
  className?: string;
  spots?: readonly Spot[];
  fade?: boolean;
  /** Which tab of a plate this capture belongs to. */
  view?: number;
  children?: ReactNode;
}) {
  const g = shotGeometry(name);
  const { src, srcSet } = shotSources(name, "dark");
  const classes = ["shot", `v-${g.kind}`, g.wide ? "wide" : "", fade ? "fade" : "", spots.length ? "lit" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <figure
      className={classes}
      data-view={view}
      style={v({ "--lp-fw": g.fileWidth, "--lp-px": g.x, "--lp-pw": g.width, "--lp-h": g.height })}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- the frame places the raw capture itself */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={shotSizes(name)}
        data-shot={name}
        loading="lazy"
        decoding="async"
        width={g.fileWidth}
        height={g.height}
        alt={alt}
        suppressHydrationWarning
      />
      {spots.map((spot, index) => (
        <span
          key={index}
          className={index === 0 ? "spot dim" : "spot"}
          style={v({ "--lp-sx": spot.x, "--lp-sy": spot.y - g.top, "--lp-spw": spot.w, "--lp-sph": spot.h })}
        ></span>
      ))}
      {children}
    </figure>
  );
}
