import { FILM } from "@/lib/venue-copy";
import styles from "./venue-a.module.css";

type FilmSlotProps = {
  /** The rendered master. Absent today; the founder supplies the file later. */
  src?: string;
  /** Poster frame, shown before the first click. Never autoplay. */
  poster?: string;
  /** WebVTT captions track. */
  captions?: string;
};

/**
 * The film slot, wearing the same chrome as the product views.
 *
 * `.reveal-relay-preview` + `.reveal-relay-sample` is the house frame for a
 * real product surface, so the film sits inside it rather than in a bespoke
 * box. That is the whole point: when the file arrives it drops into a frame
 * the page already treats as a first-class object.
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
 */
export function FilmSlot({ src, poster, captions }: FilmSlotProps) {
  return (
    <div className="reveal-relay-preview">
      <p className="reveal-relay-sample">Sample product view</p>

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
            role="img"
            aria-label={FILM.posterAlt}
          >
            <span className={styles.filmPlay} aria-hidden="true">
              <span />
            </span>
            <p className={styles.filmPlaceholder}>{FILM.placeholder}</p>
            <p className={styles.filmMeta}>16 : 9 · 1920 × 1080</p>
          </div>
        )}
      </div>
    </div>
  );
}
