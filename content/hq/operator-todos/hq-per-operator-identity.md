---
id: hq-per-operator-identity
title: Approve moving HQ to per-operator identity so the audit ledger is real.
status: open
priority: P0
blocking: true
phase: Phase 1
why: With a single shared HQ password the audit log can only ever say "someone with the cookie", so it is theatre.
href: /hq
date: 2026-07-09
---

## Why

The access system's headline safety feature is a tamper-evident, append-only ledger of every grant, revoke, extend, and expire. That ledger's whole value is answering "who did this". Today HQ auth is one shared password, so the recorded actor can only ever be "studio-hq". The moment a second person (a contractor, or a leaked cookie) holds it, the ledger cannot attribute anything. Per-operator identity is a launch gate for the ledger to be load-bearing rather than decorative, before any revoke or bulk-action UI ships.

## Steps

1. Approve moving HQ off the shared cookie to **per-operator auth** (or, as a solo-founder interim, a **required named-operator prompt** captured into every mutation).
2. Confirm **who the operators are**.
3. Set the **two-person-approval threshold**: the row count above which a bulk revoke needs a second approver, and name that approver (or accept single-operator attribution for now).

## Done when

Every access mutation records a real, per-operator actor identity, and the bulk-action approval policy is set.
