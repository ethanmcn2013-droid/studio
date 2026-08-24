import type { GuidelineSection } from "@/lib/brand-guidelines/types";

export const GUIDELINE_SECTIONS = [
  {
    id: "introduction",
    number: "01",
    label: "Introduction",
    title: "Everything important. Nothing distracting.",
    summary:
      "Signal Studio gives ordinary work a clear place to live, move, and finish.",
    theme: "paper",
    anchor: "#introduction",
  },
  {
    id: "logo",
    number: "02",
    label: "Logo",
    title: "The dot is the signal.",
    summary:
      "One round point turns a quiet wordmark into a recognisable operating system.",
    theme: "soft",
    anchor: "#logo",
  },
  {
    id: "color",
    number: "03",
    label: "Color",
    title: "One indigo. Earned.",
    summary:
      "Paper carries the work, ink makes it legible, and indigo marks what matters now.",
    theme: "paper",
    anchor: "#color",
  },
  {
    id: "typography",
    number: "04",
    label: "Typography",
    title: "Geist, at every scale.",
    summary:
      "Nine type steps and three weights create a voice that is direct without becoming cold.",
    theme: "soft",
    anchor: "#typography",
  },
  {
    id: "motion",
    number: "05",
    label: "Motion",
    title: "Motion is meaning.",
    summary:
      "Every gesture explains arrival, acknowledgement, state, handoff, or reveal.",
    theme: "paper",
    anchor: "#motion",
  },
  {
    id: "voice-and-tone",
    number: "06",
    label: "Voice and tone",
    title: "A calm person, not software.",
    summary:
      "Signal Studio says the true thing in plain language, one useful sentence at a time.",
    theme: "soft",
    anchor: "#voice-and-tone",
  },
  {
    id: "moodboard",
    number: "07",
    label: "Moodboard",
    title: "The world before the screen.",
    summary:
      "Paper plans, real preparation, useful marks, Irish texture, and one deliberate indigo.",
    theme: "paper",
    anchor: "#moodboard",
  },
  {
    id: "applications",
    number: "08",
    label: "Applications",
    title: "One system, doing real work.",
    summary:
      "Product surfaces, public artifacts, print, identity, and campaigns share one clear grammar.",
    theme: "soft",
    anchor: "#applications",
  },
  {
    id: "assets",
    number: "09",
    label: "Assets",
    title: "Use the real thing.",
    summary:
      "Approved files, exact formats, current tokens, and one package that stays in sync.",
    theme: "paper",
    anchor: "#assets",
  },
] as const satisfies readonly GuidelineSection[];
