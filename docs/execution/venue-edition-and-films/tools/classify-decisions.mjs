#!/usr/bin/env node
// classify-decisions.mjs — one-time pass that tags every task with how it gets
// decided. Run once on 2026-08-02; kept for provenance and re-runnable safely
// (it only writes decisionClass, never status, evidence or history).
//
//   node tools/classify-decisions.mjs [--now=<ISO>]
//
// Classes:
//   founder_only    Only Ethan can answer. Not derivable from code, research or
//                   precedent. These become questions.
//   founder_choice  Claude brings 2-3 options with a recommendation; Ethan picks.
//                   Not a question today.
//   execution       Claude or Codex does the work; Ethan approves the result.
//
// The default is `execution`. A task is only promoted when the decision is
// genuinely a preference, a commercial judgement, a risk appetite, a spend, or
// a claim on Ethan's own time.

import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PATH = join(ROOT, "PROJECT_STATE.json");

const FOUNDER_ONLY = {
  "E01.04": "Are the exclusions right, and is anything missing from them?",
  "E01.06": "Do you accept the proposed epic lanes?",
  "E01.11": "What are the six freeze dates?",
  "E01.12": "When does the weekly operating review happen?",
  "E02.01": "Ratify 25 founding venues at EUR 1,000 against the standard EUR 1,500.",
  "E02.02": "Which price-reduction wording?",
  "E02.03": "What exactly does the EUR 1,000 lock cover, and for how long?",
  "E02.04": "What happens on missed payment, cancellation, lapse and reactivation?",
  "E02.05": "What happens to the founding rate on sale, acquisition, rebrand or relocation?",
  "E02.06": "What sits outside the locked base price?",
  "E02.07": "Invoice timing, renewal notice period, refund position.",
  "E02.09": "How much of your time is the founder-access benefit worth?",
  "E02.10": "Programme name, and when is a venue's number assigned?",
  "E02.11": "How long is a founding place held before it expires?",
  "E02.12": "Entitlement model and its unit economics at EUR 1,000.",
  "E03.07": "What rights do you ask venues and couples for?",
  "E03.08": "How long does a couple keep full access, and measured from what?",
  "E03.09": "What is Keepsake mode, exactly, and what does it never promise?",
  "E03.10": "The lifecycle edge cases: venue change, separation, non-renewal, ownership.",
  "E03.11": "Retention, deletion and the legal basis for cold outreach.",
  "E03.12": "Who does the Irish legal and accounting review, when, and at what budget?",
  "E04.09": "Which wedding dates may the venue see?",
  "E06.08": "How visible is Signal Studio on a couple's public keepsake?",
  "E07.04": "Ratify the adoption-funnel definitions.",
  "E07.07": "Replace the 40/80 allotment language with what?",
  "E07.12": "What are the small-cohort suppression thresholds?",
  "E09.06": "Approve the canonical demo venue, couple and wedding story.",
  "E09.08": "What is the budget for licensed demonstration photography?",
  "E10.01": "Where exactly does Greater Limerick start and stop?",
  "E10.02": "Which venue types are in, and which are excluded?",
  "E11.03": "How many venues per week can you personally run?",
  "E11.04": "Which sending domain, and do you track opens and clicks?",
  "E11.06": "Are you doing physical letters and in-person visits?",
  "E11.13": "How many touches before you stop?",
  "E11.14": "Slot holds, proposal expiry, referral asks, publicity consent.",
  "E13.09": "Sign off the founding-rate-lock language for voiceover and screen.",
  "E14.13": "Where does the price appear in the film, if at all?",
  "E15.01": "The go/no-go decision itself, at the gate.",
  "E15.13": "Where is the line on founding-venue custom requests?",
};

const FOUNDER_CHOICE = [
  "E01.10", // gate exit criteria — drafted, you approve
  "E02.08", // benefits charter — drafted from E02.09
  "E03.01", // controller/processor roles — legal-informed draft
  "E04.02", // venue member roles and permissions
  "E04.04", // couple workspace ownership and recovery model
  "E04.05", // branding inheritance model
  "E05.03", // default wedding workspace template content
  "E06.05", // sharing modes
  "E06.11", // Keepsake export format
  "E07.01", // portal information architecture
  "E09.02", // metric definitions
  "E09.10", // copy hierarchy and terminology
  "E10.03", // ranking score weights
  "E10.14", // consent and reserve-cohort policy
  "E12.11", // certificate design
  "E13.07", // the 35-45 second script
  "E14.05", // which wedding decision travels through the film
];

const args = process.argv.slice(2);
const nowArg = args.find((a) => a.startsWith("--now="));
const NOW = nowArg ? nowArg.slice(6) : new Date().toISOString();

const state = JSON.parse(readFileSync(PATH, "utf8"));
const byId = new Map(state.tasks.map((t) => [t.id, t]));

for (const id of [...Object.keys(FOUNDER_ONLY), ...FOUNDER_CHOICE]) {
  if (!byId.has(id)) throw new Error(`Classification names a task that does not exist: ${id}`);
}

let counts = { founder_only: 0, founder_choice: 0, execution: 0 };
for (const t of state.tasks) {
  if (FOUNDER_ONLY[t.id]) {
    t.decisionClass = "founder_only";
    t.decisionQuestion = FOUNDER_ONLY[t.id];
  } else if (FOUNDER_CHOICE.includes(t.id)) {
    t.decisionClass = "founder_choice";
    t.decisionQuestion = null;
  } else {
    t.decisionClass = "execution";
    t.decisionQuestion = null;
  }
  counts[t.decisionClass]++;
}

state.meta.lastUpdatedAt = NOW;
state.meta.decisionsClassifiedAt = NOW;

const tmp = `${PATH}.tmp`;
writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`, "utf8");
renameSync(tmp, PATH);

console.log(`Classified ${state.tasks.length} tasks:`, counts);
console.log("Proposed classification. Confirmed at baseline approval.");
