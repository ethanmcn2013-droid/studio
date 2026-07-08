"use client";

import Link from "next/link";
import type { AtlasSummaryStat } from "../types";
import { dotClass } from "../utils/view";

/**
 * Founder Mission Control — a calm instrument cluster, not an analytics wall.
 * Every figure is computed from content/hq/** and carries an "as of" date.
 */
export function AtlasMissionControl({
  stats,
  asOf,
}: {
  stats: AtlasSummaryStat[];
  asOf: string;
}) {
  return (
    <section className="atlas-mc" aria-label="Mission control summary">
      {stats.map((stat) => {
        const body = (
          <>
            <span className="atlas-mc-label">
              {stat.health ? (
                <span className={dotClass(stat.health)} aria-hidden="true" />
              ) : null}
              {stat.label}
            </span>
            <span className="atlas-mc-value">{stat.value}</span>
            {stat.note ? <span className="atlas-mc-note">{stat.note}</span> : null}
          </>
        );
        return stat.href ? (
          <Link key={stat.key} href={stat.href} className="atlas-mc-stat">
            {body}
          </Link>
        ) : (
          <div key={stat.key} className="atlas-mc-stat">
            {body}
          </div>
        );
      })}
      <div className="atlas-mc-foot">as of {asOf} · read from content/hq</div>
    </section>
  );
}
