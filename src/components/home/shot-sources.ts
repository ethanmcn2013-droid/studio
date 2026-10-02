/**
 * The product captures: which file a frame takes and how it sits in it.
 *
 * scripts/build-landing-shots.mjs cuts each capture to the rows a frame can
 * show (shots.json) and writes it to public/landing/<version>/, where the
 * version is a hash of every file, so the folder can be cached for good.
 *
 * A desk capture keeps its whole width: the app's sidebar and its main
 * panel. From 1272 to 1679 px a frame shows the panel alone, one source
 * pixel to one CSS pixel. From 1680 px a "wide" capture shows the whole
 * window, again one to one. A tablet capture (1024 wide) does the same
 * between 641 and 1023 px: the panel, then the whole window from 856 px.
 * Anywhere a capture is drawn at another scale the `sizes` value asks for
 * the 2x file, so it is sampled down, never up.
 */
import registry from "./shots.json";
import manifest from "./shot-manifest.json";

export type ShotTheme = "dark" | "light";
export type ShotKind = "desk" | "tablet" | "phone";

type Entry = { kind: string; y: number; h: number; wide?: boolean; x?: number; w?: number };

export const SHOT_BASE = `/landing/${manifest.version}/`;

export type ShotGeometry = {
  kind: ShotKind;
  /** CSS width of the file. */
  fileWidth: number;
  /** Rows of the file, in CSS px. */
  height: number;
  /** Left edge and width of the default crop, inside the file. */
  x: number;
  width: number;
  /** The whole window can be shown from 1680 px. */
  wide: boolean;
  /** The top of the file in the capture, for spots given in capture pixels. */
  top: number;
  /** Pixel densities shipped. */
  scales: readonly number[];
};

export function shotGeometry(name: string): ShotGeometry {
  const entry = (registry.shots as Record<string, Entry>)[name];
  if (!entry) throw new Error(`Unknown capture: ${name}`);
  const kind = entry.kind as ShotKind;
  if (kind === "phone") {
    const width = registry.phone.sourceWidth;
    return { kind, fileWidth: width, height: entry.h, x: 0, width, wide: false, top: entry.y, scales: [2, 3] };
  }
  const { sourceWidth, panelX, panelWidth } = registry[kind];
  const scales = kind === "desk" ? [1, 2] : [2];
  if (entry.wide) return { kind, fileWidth: sourceWidth, height: entry.h, x: panelX, width: panelWidth, wide: true, top: entry.y, scales };
  /* A capture from another shell is cut to its own panel and sits centred in the frame,
     on the same surface colour, so it is still drawn at its own size. */
  const fileWidth = entry.w ?? panelWidth;
  return { kind, fileWidth, height: entry.h, x: (fileWidth - panelWidth) / 2, width: panelWidth, wide: false, top: entry.y, scales };
}

export function shotSources(name: string, theme: ShotTheme) {
  const g = shotGeometry(name);
  const file = (scale: number) => `${SHOT_BASE}${name}-${theme}-${scale}x.webp`;
  return {
    src: file(g.scales[0]),
    srcSet: g.scales.map((scale) => `${file(scale)} ${g.fileWidth * scale}w`).join(", "),
  };
}

/** What the browser is told the image's width is, so it takes the right file. */
export function shotSizes(name: string) {
  const g = shotGeometry(name);
  if (g.kind === "phone") return `${g.fileWidth}px`;
  if (g.kind === "tablet") return `${registry.tablet.sourceWidth * 2}px`;
  const twice = `${g.fileWidth * 2}px`;
  return g.wide
    ? `(min-width: 79.5em) ${g.fileWidth}px, ${twice}`
    : `(min-width: 105em) ${twice}, (min-width: 79.5em) ${g.fileWidth}px, ${twice}`;
}

/** Swaps a capture's address between the two themes. The inline boot script does the same with a replace. */
export function themed(value: string, theme: ShotTheme) {
  return value.replace(/-(?:dark|light)-(\dx\.webp)/g, `-${theme}-$1`);
}
