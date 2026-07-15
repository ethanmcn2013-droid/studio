---
id: branch-protection
title: Enable required checks on private GitHub repositories
status: open
priority: P1
blocking: true
phase: Experience Quality OS release
why: GitHub rejected branch-protection configuration for the private repositories with HTTP 403 because the current account plan does not include protection for private repositories. Only the founder can approve a plan upgrade or change repository visibility.
href: /hq/experience-quality
date: 2026-07-15
action: "Upgrade the GitHub account to a plan that supports protected private branches, then require the passing verification and design-quality checks on main for every Signal repository."
product: "Studio, Tasks, Timeline, Signal, Notes, Signal Design System, and Signal Review"
recommended: "Keep every repository private, upgrade GitHub, require pull requests and the repository's green CI/design-quality jobs, enforce linear history and conversation resolution, and disallow force pushes and branch deletion."
alternatives: ["Use GitHub organization rulesets if a future organization plan provides equivalent private-repository enforcement.", "Keep the current private repositories and rely on workflow checks plus the clean-main release procedure until the plan is upgraded."]
default: "Repositories remain private; CI runs on pull requests and main, releases use clean main-based pull requests, but GitHub cannot yet make those checks mandatory."
consequence: "A privileged actor can still bypass a failing check or push directly to main, so continuous quality enforcement is procedural rather than platform-enforced."
trigger: "Before another autonomous or human committer receives write access, or before the next production release after this closeout."
links: ["../../../docs/experience/DESIGN_QUALITY_CI.md"]
---

## Completion evidence

- GitHub accepts branch protection or an equivalent repository ruleset for each private repository.
- Required checks match the repository's verified workflow job names.
- Direct pushes, force pushes, and branch deletion are blocked on `main`.
- A deliberately failing test pull request cannot merge.
