---
title: What Earns a Repo
date: 2026-05-15
tags: [tech]
audience: public
type: journal
summary: Content got one. Design is next. The question isn't "should this be a repo" — it's "does this evolve independently." Tags, callouts, auth roles. The pipe has more joints than it looks.
workflow: published
---

The test is simple: does this thing change for reasons independent of everything else? If yes, it earns a repo.

Content changes when you write something. Design changes when you want a different look. The renderer changes when you need a new feature. Those are different events, different authors, different timelines. They don't belong in the same repo.

The same test applied to the rest of the stack produces a longer list than expected.

## Tags

Right now tags are strings. `tech`, `travel`, `meta` — declared in frontmatter, rendered as filter pills, no definition anywhere. That works until it doesn't.

A `theTube-tags` repo would define what a tag means: label, color, description, grouping. The renderer checks it out and uses it. The Austin Healey restorer forks the renderer, brings their own tag set — `restoration`, `sourcing`, `electrical` — without touching the renderer. The tag taxonomy is their concern, not the renderer's.

The format agreement is simple: a JSON file mapping tag name to metadata. Any renderer that reads it gets the taxonomy for free.

## Callouts

Callouts are currently hardcoded in the renderer — `[!NOTE]` is blue, `[!TRAVEL]` has specific args, the HTML structure is baked in. That's a design and content decision living in renderer code.

A `theTube-callouts` repo would define the callout registry: types, colors, allowed args, HTML templates. The renderer reads it at build time. New callout types don't require touching the renderer. The restorer adds `[!SPEC]` for part specifications without filing a PR against the rendering engine.

## Auth roles

The role definitions — who is `friends`, what does `kids` mean, which posts they can see — are currently split between the private repo and the CloudFront configuration. That's the right instinct (private data stays private) but the wrong shape.

Auth roles evolve when access changes: someone gets added, a role gets renamed, a new tier appears. That's not a code change. It's a configuration change. A `theTube-auth` repo (private, naturally) would hold role definitions and allowlists as the source of truth. The infra reads from it. The content frontmatter references role names from it.

## What doesn't earn a repo

Not every module is a pipe joint. The CloudFront rewrite function is glue — it translates URIs and has no identity outside this stack. The GitHub Actions workflow is wiring. The `lib/posts.ts` loader is an adapter, not a system.

The test is independence. Glue that only makes sense in context of the specific stack stays in the stack. Configuration that an owner would customize gets its own repo.

## The renderer as the pipe

When everything that's domain-specific is extracted, what remains in the renderer is the wiring: read markdown, apply design, apply callouts, produce HTML, deploy. That's not nothing — it's the integration point. But it's thin. Thin enough that forking it is low cost, and operating it is replacing config repos, not editing code.

## IAM as the infrastructure boundary

The repo boundary is a code boundary. IAM is the same boundary at the infrastructure layer.

Each workflow gets its own IAM user scoped to exactly its output path and nothing more:

| Workflow         | IAM permissions                                                           |
| ---------------- | ------------------------------------------------------------------------- |
| Main deploy      | `s3:PutObject` on `thetube-today/*`, CloudFront invalidation              |
| Journey build    | `s3:PutObject` on `thetube-today/journeys/*` only                         |
| Design delivery  | `s3:PutObject` on `thetube-today/images/posts/*` only                     |
| Subscribe Lambda | `s3:GetObject` + `s3:PutObject` on `thetube-today/_subscribers.json` only |

The journey build can't touch the post HTML. The design delivery can't touch the subscriber registry. The separation of concerns goes all the way down — from the repo boundary to the S3 path boundary to the IAM policy.

The pipe has more joints than it looks. Each joint is a place where the system becomes more composable — and more auditable.

[journey]:
prev: the-pattern-generalizes
Grew out of thinking about tags as a pluggable concern — the user asked "what part of the implementation should be a repo, for example a tag repo so you can plug them in." The auth roles observation came from looking at where role definitions actually live today.
