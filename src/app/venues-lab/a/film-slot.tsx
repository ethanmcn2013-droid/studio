import { FILM } from "@/lib/venue-copy";
import styles from "./venue-a.module.css";

/**
 * Connective furniture only. The rendered master format, written once.
 * No ratified claim is restated here; the film's own label, placeholder
 * and note all come from FILM in `src/lib/venue-copy.ts`.
 */
const COPY = {
  format: "16 : 9 · 1920 × 1080",
} as const;

type FilmSlotProps = {
  /** The rendered master. Absent today; the founder supplies the file later. */
  src?: string;
  /** Poster frame, shown before the first click. Never autoplay. */
  poster?: string;
  /** WebVTT captions track. */
  captions?: string;
};

/**
 * The film slot, wearing the house preview chrome.
 *
 * `.reveal-relay-preview` is the house frame for a first-class object, so the
 * film sits inside it rather than in a bespoke box. That is the whole point:
 * when the file arrives it drops into a frame the page already treats as a
 * first-class object.
 *
 * It does NOT wear `.reveal-relay-sample`. That label reads "Sample product
 * view", which is what the two live surfaces above it are and what a film is
 * not. The frame's title and its reserved-state label live beside it in
 * page.tsx, so this box carries two lines rather than four.
 *
 * Built to the spec ratified for the private film page: 16:9 reserved by
 * `aspect-ratio` so the box never collapses or shifts layout, poster first,
 * click to play, never autoplay, a `.vtt` track element wired and ready.
 *
 * No film file exists in the repo today, so the empty state is the state that
 * ships and the state that gets reviewed. It is drawn deliberately: the play
 * affordance is present so the frame reads as a film and not as a broken
 * image, but it is inert decoration inside a labelled region rather than a
 * control, because a button that cannot play anything is a lie about the
 * state of the work.
 *
 * ACCESSIBILITY. The empty state is a `role="group"` carrying FILM.posterAlt,
 * not a `role="img"`. `role="img"` collapses its subtree, so a screen reader
 * announced the label and never reached either of the two visible strings
 * inside it, giving sighted and non-sighted readers different copy from the
 * same ratified constant.
 */
export function FilmSlot({ src, poster, captions }: FilmSlotProps) {
  return (
    <div className="reveal-relay-preview">
      <div className={styles.filmFrame} style={{ aspectRatio: FILM.aspect }}>
        {src ? (
          <video
            className={styles.filmVideo}
            controls
            preload="none"
            playsInline
            poster={poster}
          >
            <source src={src} type="video/mp4" />
            {captions ? (
              <track
                kind="captions"
                src={captions}
                srcLang="en"
                label="English"
                default
              />
            ) : null}
          </video>
        ) : (
          <div
            className={styles.filmEmpty}
            role="group"
            aria-label={FILM.posterAlt}
          >
            <span className={styles.filmPlay} aria-hidden="true">
              <span />
            </span>
            <p className={styles.filmPlaceholder}>{FILM.placeholder}</p>
            <p className={styles.filmMeta}>{COPY.format}</p>
          </div>
        )}
      </div>
    </div>
  );
}
