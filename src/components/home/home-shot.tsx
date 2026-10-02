import { shotSize, shotSources } from "./shot-sources";

/**
 * One product capture. The dark file is in the markup, so the page reads
 * with no script. The boot script and the runtime point it at the light
 * file when the page is light, which is why the attributes may differ from
 * the server's by the time React arrives.
 */
export function Shot({ name, alt }: { name: string; alt: string }) {
  const { src, srcSet } = shotSources(name, "dark");
  const { width, height } = shotSize(name);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- the crop maths needs the raw capture, not a resized one
    <img
      src={src}
      srcSet={srcSet}
      data-shot={name}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      alt={alt}
      suppressHydrationWarning
    />
  );
}
