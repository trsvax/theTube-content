---
title: The Diff Is Small
date: 2026-05-15
tags: [tech]
draft: true
summary: When concerns are separated into repos, the pull request is small. A tag color change is one line in one file in the tags repo. Not a PR against a monorepo where the reviewer has to figure out what changed and why.
---

Fork, change, pull request. That's how open source works. The repo model applies it at every level of the stack.

Someone uses your design theme and finds the line-height too tight for long-form reading. They fork `theTube-design`, change one CSS value, open a PR. The diff is one line. The reviewer knows exactly what changed and why. There's no renderer code in the diff, no content files, no Actions workflow. Just the change.

That's not how it works in a monorepo. In a monorepo, a CSS change is a PR against a repo that also contains business logic, content, infrastructure, and auth. The reviewer has to establish what's safe to merge and what isn't. The diff is small but the context is large.

## Issues go to the right place

A bug in the tag taxonomy goes to the tags repo. A rendering bug goes to the renderer. A typo in a post goes to the content repo. The issue tracker is already organized by concern because GitHub organizes it by repo.

In a monorepo, every issue lands in the same tracker. You label them. You triage them. You maintain a convention that tells contributors where in the codebase to look. That's overhead that the repo boundary eliminates.

## The contribution model scales

When a component lives in its own repo, it can have its own maintainer. The tags taxonomy could be maintained by someone who cares about information architecture but has no interest in rendering engines. The design theme could be maintained by someone who cares about typography but doesn't write code.

Neither of them needs commit access to the renderer. Neither of them needs to understand Next.js. The boundary is a permission boundary as much as it's a code boundary.

## What GitHub already knows

GitHub knows how to surface good repos. Stars, forks, activity, open issues, Dependabot status. These are signals about the health of a component. A design theme with 40 stars and active maintenance is a better dependency than one with 2 stars and 18 months of silence.

That signal exists for npm packages too, but it's one abstraction removed — the package is published from the repo, and you're evaluating the package not the repo. In the repo-as-package model, you're evaluating the thing directly.

Fork, change, PR. The collaboration model is the same as always. The repos are just smaller and the diffs are focused.

[journey]:
prev: the-registry-already-exists
From the observation: "and I can change things and create pull requests." Yes — and the PR is small because the repo is focused. The diff follows the concern boundary. The entire thread — six posts, a software development methodology — worked out on a cruise ship. Wandering produces more than the itinerary does.
