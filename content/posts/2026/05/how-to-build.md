---
title: How to Build
date: 2026-05-16
tags: [tech]
audience: public
type: journal
summary: The infrastructure build and the content build are different things with different costs and different triggers. Separating them means a new post doesn't require a full Next.js rebuild.
workflow: published
---

There are two kinds of builds: infrastructure builds and content builds. Right now they run together. They shouldn't.

**Infrastructure build** — Next.js compiles React, generates static HTML pages, deploys to S3. Triggered by app code changes. Slow. Full rebuild every time.

**Content build** — reads markdown, generates `content.json` indexes, syncs to S3. Triggered by content changes. Fast. No framework required.

The HTML pages define routes and layout — that's infrastructure. The content indexes feed the browser at runtime — that's data. Different reasons to change, different build costs, different triggers.

A new post shouldn't require a Next.js rebuild. A layout change shouldn't require re-processing all content. Separating the builds makes both faster and more independent.

The content build is essentially `build-indexes.mjs` already — a Node script that reads markdown and writes JSON. It could run in its own pipeline, triggered by content repo pushes, writing directly to S3. No Next.js, no React, no full deploy.

Each content repo could run its own build independently. Public content builds and syncs `public/content.json`. Private content builds and syncs `user/content.json`. They don't coordinate — S3 is the meeting point.

Async content builds. Content repos from anywhere — GitHub, GitLab, a private server. Each builds its slice of the namespace independently. The browser fetches and merges them at runtime. The infrastructure doesn't need to know they exist.
