# DEPENDENCY MAP — Venue Edition and Films (VEF-2026)

Task E01.07. Written 2026-08-03.

`PROJECT_STATE.json` is canonical for the edges themselves. This file explains
them, names the five critical paths, and records what could not be determined.

**Before this task: 20 edges across 4 tasks.** Every other task in a 211-task
programme declared no predecessor, which meant the graph could not answer the one
question a dependency graph exists for. **After: 134 edges across 52 tasks**,
each with a written basis, verified acyclic by `findCycles`.

---

## 1. How a dependency behaves here

**A dependency is satisfied when its predecessor reaches Founder Review, not
Done.** This is deliberate and it is the single most consequential design choice
in this task.

Done requires explicit founder approval (D-001 point 20) and D-024 batches that
approval to the end of a work package. If a successor could only start once its
predecessor were *approved*, wiring the real graph would have idled every
parallel package behind one person's queue. R-006 is founder capacity; a graph
that converts it into a hard deadlock makes the risk worse, not visible.

A task in Founder Review has agreed acceptance criteria, recorded evidence and
passed verification. Its content is settled. Only the signature is outstanding.

**The cost, stated rather than hidden:** if the founder rejects a predecessor,
successors started against it may need rework. `task <ID>` prints
`Satisfied but not yet approved` for exactly this reason, and starting a task in
that state writes a note onto it naming the predecessors involved.

Edges are **controlling** — the tool refuses `start` on an unmet one and
`--waive-deps` records a founder waiver. Advisory edges are listed in §5 and are
deliberately **not** in state, because the schema has no advisory flag and
inventing one would make guidance look like a rule.

## 2. Where the edges come from

| Source | Edges | Character |
|---|---|---|
| The four critical blocking rules, imported | 20 | Verbatim from the supplied backlog. Unchanged |
| CR-001, approved as D-023 | 3 | The GDPR role map hard-gates three legal documents |
| Named in a decision's own affects-list | 21 | D-009, D-013, D-020, D-022 name the task IDs |
| `DECISION_DOCKET.md` Round 2 | 6 | The docket states what unblocks each open question |
| `BASELINE_REVIEW.md` §4, promoted | 8 | Six of the twelve proposed items now carry a task-level basis |
| Production order, inferred and labelled as such | 76 | Mostly epic-completion blocks: QA and lock tasks depending on the work they QA |

The 76 inferred edges are concentrated in five block dependencies — E05.12,
E06.12, E07.18, E10.12 and E12.14 each depend on the epic work they close. Those
are the bulk of the count and the least controversial edges in the graph: a lock
task cannot lock work that does not exist.

## 3. The five critical paths

Freeze dates from D-008, days from 2026-08-03: offer 12d · UI 17d · copy 18d ·
capture 19d · film lock 25d · release candidate 27d · release 29d.

**No task carries an effort estimate** (D-015 Q3, deliberate). Every judgement
below is risk-based, not calendar arithmetic. A dependency map cannot produce a
date-accurate critical path without estimates, and inventing them is the
fabricated precision this project forbids.

### Legal — E03.01 → E03.04 / E03.05 / E03.06

Two hops. E03.04, E03.05 and E03.06 are parallel siblings behind one gate.
Terminal: the legal gate's twelve exit criteria.
**Most likely to fail: E03.01**, the GDPR role map. It hard-gates three
documents, it is `founder_choice`, and R-017 put Article 9 guest data inside it.
**Achievable by copy freeze: yes.** D-016 removed the external-review wait
entirely, so the constraint is founder-review throughput, not lead time.
This is the only one of the five genuinely decoupled from the engineering volume.

### Product — E03.08 → E04.07 → E05.12

Three hops, with E04.09 and the eleven-task E05 block as parallel requirements.
Terminal: **E05.12**, the design-system review and locked visual baselines. That
task *is* UI-freeze.
**Most likely to fail: E04.07.** Not hypothetical: R-015 is a live defect and the
mint still refuses the ratified term.
**Achievable by UI freeze, 17 days: at risk.** The R-015 fix is small. The
exposure is E05.01 to E05.11 — eleven substantial tasks, one lane, every one
founder-review gated.

### Capture — E03.01 → E03.06 → E06.01 → E06.12 → E14.15

Five hops. Terminal: **E14.15**, product footage recorded against a locked build.
Lands exactly on capture freeze, 22 August.
**Most likely to fail: E06.12.** `BASELINE_REVIEW.md` §9 found candidate
implementation for E07, E04, E08, E09, E10 to E14 — and **nothing for E05 or
E06**. E06 also carries the highest creative bar in the programme: the Shared
Timeline is the principal emotional artifact (D-001 point 13).
**Achievable by 22 August, 19 days: at risk, and it is the tightest date here.**
It needs E04, E05, E06, E07 and E09 substantially built and approved. This is
R-001 stated concretely rather than as a headline.

### Film — capture chain → E14.16 → E14.17 → E14.18

Eight hops, the first five identical to Capture. **These are not two independent
risks. They are one risk counted twice.**
Terminal: **E14.18**, final brand, product-accuracy, privacy, audio, caption and
archive QA.
**Most likely to fail: E14.16**, the edit. Most labour-intensive step, single
lane, no fallback.
**Achievable by film lock, 25 days: entirely contingent on capture.** Film lock
sits six days after capture freeze and does not move independently in D-008.
Every day capture slips consumes that buffer one for one.

### Outreach — E13.07 → E13.10 → E13.11 → E13.14 → E13.17 → E15.07

Six hops, plus two co-requisites that are not on the longest thread and will
decide it anyway: **E10.12** (Cohort 1 locked) and **E11.04** (DKIM).
Terminal: **E15.07**, the first commercial invitation.
**Most likely to fail: E13.17**, the highest fan-in task in the graph — six
predecessors converging research, creative and engineering into 25 individually
branded renders QA'd by hand for the first time.
**Achievable by release, 29 days: the most achievable of the four non-legal
paths.** E10 and E13 pre-production need no product work. But E15.07 still sits
behind E15.01 to E15.06, which need a *functionally working* product — a
materially lower bar than capture's *visually locked* one.

### The honest summary

Product, capture and film share a root (E03.08 and E03.01 into E04, E05, E06) and
a convergence (E14.15). Outreach shares the product-functionality requirement
through E15. **Four of the five paths are the same underlying risk wearing
different names, and that risk is R-001.** Only legal is separable.

## 4. Conflicts recorded, not reconciled

**I-003 — when E04 starts.** The sequencing directive says start E04 to E09
immediately and in parallel. E04's own epic note says it begins once E02 and E03
core decisions are stable. Both are in the same supplied document. This map does
not resolve the conflict; it **localises** it. E04.07, E04.09 and E06.01 carry
edges because D-022 and the privacy rules genuinely gate them. E04.01 to E04.06,
E04.08, E04.10 to E04.12 and E06.02 to E06.11 carry none and can start now,
exactly as the directive says.

**`DECISION_DOCKET.md` Round 2 is stale in three rows.** It gives E03.11's
unblocker as the legal review, E02.07's as the accountant's VAT view, and
E13.09's as the legal review. D-016 removed both. The docket is append-only and
still reads as written. Effect on this map: E03.11 ← E03.12 is **dropped
entirely**; E02.07 and E13.09 keep only the surviving half of their basis.

**No conflict with any imported edge.** All three extensions (E09.12 + E09.11,
E13.17 + E13.14, E15.07 + E13.17 and E11.04) are additive.

## 5. Advisory, deliberately not in state

- **E13.12 and E13.13 ← E13.11.** Voiceover and music are usually timed to the animatic but could run in parallel. Making it controlling would serialise film work for no gain.
- **E11 final system ← offer lock and asset lock.** Stated at epic level in the backlog. It does not resolve to task IDs without inventing them.
- **E12 and E13 final versions ← E02, E03, E09.** Partly made controlling above where a decision named the task. The rest stays epic-level guidance.
- **E15.01 ← all six gates.** Modelled as gate state, which already exists. Adding task edges would duplicate a working mechanism.

## 6. What could not be determined

- **"E04's core decisions" is undefined.** Resolved narrowly to E03.08, which D-022 names. A broader reading is defensible and would add edges.
- **E13's epic note says final rendering requires E09.** No specific E09 task ties to it in any source read.
- **Fine-grained order inside E07's seventeen non-lock tasks.** Only E07.04, E07.07 and E07.08 are individually sourced. The rest feed E07.18 as a block. This is the biggest remaining gap if a week-by-week schedule is ever needed.
- **E15.09 to E15.14, onboarding and operations.** Not modelled. Outside the five named paths and unsourced.
- **Whether E11.01, the CRM, gates E15.07.** Plausible, but ad-hoc tracking could satisfy E15.07's title. Left out rather than guessed.
- **No task represents "file and receive the Revenue reply."** D-021 and R-018 make it a real gate on E02.07 and E03.02, but there is nothing to draw an edge from. Recorded as a gap, not invented as a task.

## 7. Reproducing this

```bash
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs validate
node studio/docs/execution/venue-edition-and-films/tools/project-control.mjs task E13.17
```

`validate` reports the edge count and runs the cycle check. `task <ID>` prints
that task's unmet dependencies, its satisfied-but-unapproved predecessors, its
recorded basis, and what it blocks.
