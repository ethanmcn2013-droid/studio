# Cycle 8: Notes Private Layer

Date: 2026-05-12

## Intent

Signal Notes should feel private, emotionally intelligent, and protected.
It is the context layer, but it is not a collaborative surface by default.

## Product Rule

Raw note bodies stay private unless the creator deliberately turns a
selected part of the note into work.

This means raw Notes content should be excluded from:

- shared workspaces
- shared roadmap updates
- task views
- analytics summaries
- workspace briefings
- public or guest-facing collaboration surfaces

## Implemented

- Notes empty capture field now shows a quiet rotating private-writing line.
- The message fades away as soon as typing begins.
- The decorative copy is `aria-hidden` so it is not repeatedly announced.
- The visible handoff language now says "Draft action" instead of implying an automatic shared task.
- Signal HQ now records Notes privacy as an active product decision.

## Next

- Define extract-level permissions for actions, decisions, risks, and summaries.
- Add tests when the real workspace/auth model exists to prove shared surfaces cannot query raw note bodies.
- Keep shareable collaboration outputs built from approved extracts, never from private raw notes.
