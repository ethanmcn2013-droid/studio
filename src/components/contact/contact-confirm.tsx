"use client";

/**
 * Contact confirmation — the success beat for a contact submission:
 * one indigo dot emits a single broadcast ring (the house gesture,
 * M·01, reused verbatim — same brand-signal-emit + brand-signal-ring
 * keyframes), then the line settles in under it. No check, no toast,
 * no exclamation mark: the dot is the acknowledgement.
 *
 * Standalone and unwired by design. /contact has no form ("No form.
 * No CRM." — a deliberate brand stance, not an omission). This is the
 * motion deliverable for P9, ready the moment a contact-success
 * surface ever exists: render <ContactConfirm /> when a submission
 * succeeds and it plays once.
 *
 * Reduced motion: the ring element is not rendered and the keyframes
 * are neutralised by the global reduced-motion block — the line is
 * simply present, which is the correct quiet acknowledgement.
 */

import { useEffect, useState } from "react";

export function ContactConfirm() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  return (
    <div className="contact-confirm" role="status" aria-live="polite">
      <span className="contact-confirm-dot" aria-hidden>
        {reduced ? null : <span className="contact-confirm-ring" />}
      </span>
      <p className="contact-confirm-line">
        Got it. We&apos;ll reply from hello@.
      </p>
    </div>
  );
}
