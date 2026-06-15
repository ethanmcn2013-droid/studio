import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: "Accessibility — Signal Studio",
  description:
    "How Signal Studio approaches accessibility — the target standard, what works today, what doesn't, and how to flag a barrier.",
};

const SECTIONS = [
  {
    heading: "The commitment",
    body: [
      "Signal Studio is built for the eighty percent of the world who don't work in tech. That audience includes people using screen readers, people navigating with a keyboard, people who avoid mouse precision, people with low vision, people who need motion stripped out, people on slow connections, people on small screens.",
      "Building plain-language software that quietly excludes any of those readers is a contradiction, not an oversight. Accessibility is part of the product brief.",
    ],
  },
  {
    heading: "The target standard",
    body: [
      "Signal Studio targets WCAG 2.1 Level AA across every public surface and every product. AA is the realistic, defensible bar for a small team shipping at speed. AAA is the aspiration where the rules don't fight the product (text contrast, motion).",
    ],
  },
  {
    heading: "What works today",
    body: [
      "Every page can be navigated by keyboard. Focus rings are visible. Tab order is meaningful.",
      "Every product respects prefers-reduced-motion. The cinematic homepage demos on Tasks, Timeline, and Signal fall back to a static frame for readers who have asked the OS to reduce motion.",
      "Text colours meet WCAG AA contrast against the white background. Body sizes are at least 14px on marketing surfaces.",
      "All form fields are labelled. Required fields are announced as required, not just visually marked.",
      "Headings follow a logical hierarchy on every page. Skip links land users at main content.",
      "Images that carry meaning have alt text. Decorative images are aria-hidden.",
    ],
  },
  {
    heading: "Where we know we fall short",
    body: [
      "Some interactive demos rely on motion to tell their story. Reduced-motion users see a static fallback, but the static fallback is less rich than the animated version. We are not yet at parity.",
      "Some long-form changelogs and shared updates use markdown rendering with default heading styles. The hierarchy is correct, but the visual rhythm could be sharper for low-vision readers.",
      "Mobile menus on a small number of pages still use native details/summary patterns. They work — but they could be more discoverable.",
      "We have not yet completed an end-to-end audit with a professional screen-reader user. That audit is on the roadmap.",
    ],
  },
  {
    heading: "Flagging a barrier",
    body: [
      "If you hit a wall — a page you cannot read, a flow you cannot complete, a button you cannot reach — write to hello@signalstudio.ie. Tell us what you were trying to do and what got in the way. We will reply within five working days and tell you whether and when we can fix it.",
      "We are not big enough to have a dedicated accessibility team. We are small enough to read every email.",
    ],
  },
] as const;

export default function AccessibilityPage() {
  return (
    <LegalDocument
      eyebrow="Accessibility"
      title={
        <>Plain-language software that doesn&apos;t quietly exclude people.</>
      }
      intro={
        <>
          We target WCAG 2.1 AA across the suite. We tell you what works, what
          doesn&apos;t, and what we are still working on.
        </>
      }
      updated="2026-05-12"
      sections={SECTIONS}
      footnote={
        <>
          Hit a wall we didn&rsquo;t list? Tell us what you were trying to do
          and what got in the way: hello@signalstudio.ie. We read every one.
        </>
      }
    />
  );
}
