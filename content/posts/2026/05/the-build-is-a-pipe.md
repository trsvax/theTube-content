---
title: The Build Is a Pipe
date: 2026-05-15
tags: [tech, architecture]
audience: public
summary: The deploy pipeline is just another Unix pipe. Each repo owns one stage.
type: journal
workflow: published
---

The deploy workflow in most projects is treated as a single monolithic script. One repo, one workflow, one big blob of steps that does everything. That works fine until you split your content out of your app repo — and then you have to ask: who builds what?

For theTube, the split is:

- **theTube** — app code, renderer, CloudFront function, infra
- **theTube-content** — public posts, about page, links
- **thetube-private** — protected content, auth, keys

Right now the build lives entirely in theTube. When content changes, you push to theTube to trigger the deploy. That's a seam in the wrong place — the content repo should own the trigger.

## The pipe model

A Unix pipe connects two programs: one writes, one reads. The pipe itself is the contract. Neither program needs to know what the other one looks like internally.

The build is the same thing. theTube-content writes content. theTube reads it and produces HTML. The `workflow_dispatch` call is the pipe connector — theTube-content pushes, fires a dispatch, theTube builds.

Each repo owns one stage of the pipeline:

```
theTube-content push → workflow_dispatch → theTube build → S3 sync → CloudFront invalidation
```

The stages don't bleed into each other. theTube-content doesn't know how the renderer works. theTube doesn't need to watch for content changes — it just responds when called.

## What theTube builds

theTube owns the app shell: the JS bundles, the CSS, the CloudFront function, the infra. These change infrequently. When they do change, a push to theTube triggers a full rebuild.

theTube-content owns the trigger for content changes. Its "build" is writing markdown. The dispatch call is the handoff.

## The tradeoff

You could go further: theTube-content syncs its own content directly to S3, bypassing the Next.js build entirely. Each repo owns its own output path. The pipe is fully decoupled.

That's the cleaner model architecturally — but it breaks `generateStaticParams`, build-time tag aggregation, and anything else the renderer needs to know about posts at build time. The cost of full decoupling is a dumber renderer.

Or you keep the build in theTube and use `workflow_dispatch` as the pipe joint — theTube-content is the trigger, theTube is the builder. Looser coupling than a single repo, tighter than full independence.

Which model holds up depends on how the renderer evolves. That's a decision for when it matters.
