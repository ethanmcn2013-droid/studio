import { evaluateClip } from "./clips";
import {
  clipInfo,
  DOT_VERSION,
  FPS,
  type ClipId,
  type DotColor,
} from "./model";
import { renderSvg } from "./render";

type Entry = {
  name: Uint8Array;
  bytes: Uint8Array;
  crc: number;
  offset: number;
};
const encode = new TextEncoder();
const crcTable = Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
  return n >>> 0;
});
function crc32(bytes: Uint8Array) {
  let c = 0xffffffff;
  for (const b of bytes) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function header(size: number) {
  const bytes = new Uint8Array(size),
    v = new DataView(bytes.buffer);
  return { bytes, v };
}
/** Stored ZIP: PNGs are already compressed. Stable timestamps make archive order reproducible. */
export function pngArchive(files: { name: string; bytes: Uint8Array }[]) {
  const entries: Entry[] = [],
    pieces: BlobPart[] = [];
  let offset = 0;
  for (const file of files) {
    const name = encode.encode(file.name),
      bytes = file.bytes,
      crc = crc32(bytes),
      h = header(30);
    h.v.setUint32(0, 0x04034b50, true);
    h.v.setUint16(4, 20, true);
    h.v.setUint16(12, 33, true);
    h.v.setUint32(14, crc, true);
    h.v.setUint32(18, bytes.length, true);
    h.v.setUint32(22, bytes.length, true);
    h.v.setUint16(26, name.length, true);
    pieces.push(h.bytes as BlobPart, name as BlobPart, bytes as BlobPart);
    entries.push({ name, bytes, crc, offset });
    offset += 30 + name.length + bytes.length;
  }
  const centralOffset = offset;
  for (const e of entries) {
    const h = header(46);
    h.v.setUint32(0, 0x02014b50, true);
    h.v.setUint16(4, 20, true);
    h.v.setUint16(6, 20, true);
    h.v.setUint16(14, 33, true);
    h.v.setUint32(16, e.crc, true);
    h.v.setUint32(20, e.bytes.length, true);
    h.v.setUint32(24, e.bytes.length, true);
    h.v.setUint16(28, e.name.length, true);
    h.v.setUint32(42, e.offset, true);
    pieces.push(h.bytes as BlobPart, e.name as BlobPart);
    offset += 46 + e.name.length;
  }
  const end = header(22);
  end.v.setUint32(0, 0x06054b50, true);
  end.v.setUint16(8, entries.length, true);
  end.v.setUint16(10, entries.length, true);
  end.v.setUint32(12, offset - centralOffset, true);
  end.v.setUint32(16, centralOffset, true);
  pieces.push(end.bytes as BlobPart);
  return new Blob(pieces, { type: "application/zip" });
}
export async function svgPng(
  svg: string,
  size: number,
  canvas?: HTMLCanvasElement,
): Promise<Blob> {
  const target = canvas ?? document.createElement("canvas");
  target.width = target.height = size;
  const context = target.getContext("2d");
  if (!context)
    throw new Error("This browser cannot export images. Try another browser.");
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error("Could not render this frame. Try the export again."));
      image.src = url;
    });
    context.clearRect(0, 0, size, size);
    context.drawImage(image, 0, 0, size, size);
    // toBlob schedules idle work and can throttle each frame in a background tab.
    // Encoding one frame synchronously keeps progress bounded; each image load
    // yields back to the browser so cancellation remains responsive.
    const encoded = atob(target.toDataURL("image/png").split(",")[1]);
    const bytes = new Uint8Array(encoded.length);
    for (let i = 0; i < encoded.length; i++) bytes[i] = encoded.charCodeAt(i);
    return new Blob([bytes], { type: "image/png" });
  } finally {
    URL.revokeObjectURL(url);
  }
}
export async function exportSequence(options: {
  clip: ClipId;
  seed: number;
  size: number;
  color: DotColor;
  effects: boolean;
  signal: AbortSignal;
  progress: (done: number, total: number) => void;
}) {
  const { clip, seed, size, color, effects, signal, progress } = options;
  const frames = Math.round(clipInfo(clip).duration * FPS),
    files: { name: string; bytes: Uint8Array }[] = [],
    canvas = document.createElement("canvas");
  for (let f = 0; f < frames; f++) {
    signal.throwIfAborted();
    const svg = renderSvg(evaluateClip(clip, f / FPS, seed), {
      size,
      color,
      effects,
      stage: "transparent",
    });
    const png = await svgPng(svg, size, canvas);
    signal.throwIfAborted();
    files.push({
      name: `frame-${String(f).padStart(5, "0")}.png`,
      bytes: new Uint8Array(await png.arrayBuffer()),
    });
    progress(f + 1, frames);
  }
  files.push({
    name: "manifest.json",
    bytes: encode.encode(
      JSON.stringify(
        {
          version: DOT_VERSION,
          clip,
          seed,
          size,
          color,
          effects,
          fps: FPS,
          frames,
          duration: frames / FPS,
          alpha: true,
          renderer: "browser SVG rasterizer",
          frameOrigin: 0,
        },
        null,
        2,
      ),
    ),
  });
  signal.throwIfAborted();
  return pngArchive(files);
}
