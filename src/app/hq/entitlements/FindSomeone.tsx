"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Find someone: a single box that routes to the Person view by Clerk id.
 *  (Email / code lookup resolves upstream to a Clerk id; wired when the
 *  Clerk backend lands.) */
export function FindSomeone() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (v) router.push(`/hq/entitlements/${encodeURIComponent(v)}`);
  }

  return (
    <form onSubmit={go} className="flex gap-2 rounded-md border border-border-soft bg-bg-elev p-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Clerk user id"
        className="h-9 flex-1 rounded border border-border-soft bg-bg px-2 font-mono text-[11.5px] outline-none focus:border-accent"
      />
      <button
        type="submit"
        className="h-9 rounded px-4 text-[12.5px] font-medium text-white transition"
        style={{ background: "var(--accent)" }}
      >
        Find
      </button>
    </form>
  );
}
