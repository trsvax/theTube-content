---
title: The Registry Already Exists
date: 2026-05-15
tags: [tech]
type: draft
summary: GitHub is already the package registry. Dependabot scans each repo. Secret scanning runs on each repo. The security tooling is built around the unit that matters — the repo. The format-agreement model gets that for free.
---

GitHub scans repos. Every repo — Dependabot for vulnerable dependencies, secret scanning for leaked keys, code scanning for known vulnerability patterns. That's already running on every public and private repo in the account.

In the npm model, you trust the package author to have run their own security checks. You install the package, you inherit whatever is in it. The registry has no security posture — it hosts what it's given.

In the repo-as-package model, the security posture is visible before you wire anything in. The tags repo has a green Dependabot badge or it doesn't. The design repo has no code scanning findings or it does. You can see that before the checkout step in your workflow.

## The attack surface follows the boundary

A tags repo is JSON files. No npm dependencies, no executable code, no attack surface worth scanning. Dependabot has nothing to do there. That's the right answer — the security surface is as small as the concern.

The renderer is where the npm dependencies live. Four of them: `next`, `react`, `react-dom`, `marked`. Dependabot watches those. When `marked` has a vulnerability, the alert goes to the renderer repo, not to the content repo, not to the design repo. The boundary is correct.

The private repo holds secrets (encrypted) and auth logic. That's where secret scanning matters most, and that's exactly where it runs.

## No publish step

npm packages have to be published to be discoverable. The author publishes, you install, the registry intermediates. The repo model skips the registry entirely. A public GitHub repo is already discoverable — search, fork count, the README. Wiring it into a workflow is a one-line change to a checkout step.

The version pin is the commit SHA or a branch name. Rolling back is `git revert`. Auditing what changed is `git log`. The tooling you already know.

## What GitHub becomes

Not just source control. The source control is the package registry, the security scanner, the audit log, and the distribution mechanism — all at once, because those are all things GitHub already does to repos.

The format-agreement model didn't design this in. It's a consequence of choosing repos as the unit of composition. The tooling was already there. The model just uses it correctly.

[journey]:
prev: clone-it-and-wire-it-in
From the observation: "and GitHub scans my repos and suggests security fixes?" — yes, and that's not incidental. The security model fits the composability model because both are built around the repo as the unit.
