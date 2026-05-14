"use client";

import { useTransition } from "react";
import { expireAction } from "./actions";

export function ExpireButton({ sourceRef }: { sourceRef: string }) {
  const [pending, start] = useTransition();
  function onClick() {
    if (
      !confirm(
        `Expire entitlement with sourceRef "${sourceRef}"? The row stays but status becomes expired.`,
      )
    ) {
      return;
    }
    start(async () => {
      const fd = new FormData();
      fd.set("sourceRef", sourceRef);
      await expireAction(fd);
    });
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="rounded border border-border-soft bg-bg px-2 py-1 text-[11px] font-medium text-ink-soft transition hover:border-rose-300 hover:text-rose-600 disabled:opacity-50"
    >
      {pending ? "Expiring…" : "Expire"}
    </button>
  );
}
