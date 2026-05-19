---
title: Plugins Are Specs, Not Code
date: 2026-05-18
tags: [tech]
type: post
audience: public
status: vague-thought
coffee: 2
summary: A plugin isn't code you install — it's a spec you combine with your platform spec. AI generates the implementation that fits your site. No compatibility issues.
---

The traditional plugin model: install someone else's code, hope it works with your theme, override their CSS, fight their assumptions. WordPress plugins break each other. npm packages have version conflicts. The plugin never quite fits. And you might get more code than you want — supply chain attacks hide in dependencies you didn't audit. Installing a plugin means trusting everything it pulls in.

## The new model

A plugin is a repo with a spec. Not code — a description of what it does. Fork it, combine it with your platform spec and your design, and AI generates an implementation that fits your site perfectly.

The comment system is the example:
- The comment spec describes: what a comment is, how it's submitted, how it's stored, how it's displayed
- Your platform spec describes: files at URLs, events endpoint, S3 storage, CloudFront serving
- Your design describes: the CSS, the layout, the visual conventions

AI reads all three and produces code that does comments *your way*. Not generic comment code with your CSS bolted on — native code that was never anything else.

## Why this works

The specs are the stable part. The code is disposable. If your design changes, regenerate the comment code from the same specs. If the comment spec evolves, regenerate. The implementation is always fresh, always fits, always native.

Plugin compatibility problems disappear because there's no foreign code. Every implementation is generated for your specific context. Two sites using the same comment spec get different code — each native to their platform.

## The repo is the plugin

The plugin lives in its own repo with its own deploy. Install = add a line to `blocks.md`. The plugin repo deploys independently to its own S3 prefix. Your site fetches from its URLs. No code enters your repo. No PR to merge. No foreign code to audit.

Uninstall = remove the line from `blocks.md`. The plugin's S3 prefix can stay or be cleaned up — either way your site stops using it.

## Plugin isolation

The plugin lives in its own repo with its own deploy. Its IAM credentials are scoped to its own S3 prefix — `s3://bucket/comments/*` only. It can't touch posts, can't touch the main site, can't read private content. Least privilege by infrastructure.

Even if the plugin code has a bug or gets compromised, the blast radius is one prefix. The rest of the site is untouchable. That's real isolation — not "runs in the same process and hopes for the best" like WordPress. Actually separate. Actually sandboxed. By IAM, not by code.

## Versioned specs

Pin a spec version in `blocks.md`:

```
| `[comment]:` | trsvax/thetube-comments@v1.2 | Comment form and display |
```

AI fetches the schema at that tag, not `main`. The spec can evolve without affecting your implementation until you choose to bump. Upgrading = AI reads the new spec and regenerates. Not you debugging breaking changes in someone else's code.

AI can diff the two schema versions and tell you what changed: "Added `parentId` for threading — no breakage." "Removed `author`, replaced with `userId` — breaking, form needs to change." You decide: upgrade or stay. If you upgrade, AI generates the new implementation and shows you the diff as a PR. The upgrade path is: read the diff, understand the impact, merge or don't.

`blocks.md` is Plan 9's mount table. Each line mounts a remote resource (the spec repo) into your namespace at a mount point (the block name). Version pinning is mounting a specific snapshot. Upgrading is remounting a newer version. `mount trsvax/thetube-comments@v1.2 /comment` — same semantics, different syntax.

Multiple entries for the same block merge — like Plan 9's `bind`. The order in the table is the priority. Move a line up or down to change precedence. No configuration flags. Just row order.

## Two file servers

- **Git** — the source file server. Versioned, content-addressed, full history. Where specs, content, and code live. The write side.
- **S3** — the serving file server. Versioned, durable, globally accessible via CloudFront. Where the built output lives. The read side.

The build syncs between them. Both are file servers. Both are versioned. Both are addressable by URL. Two file servers, one namespace, merged at build time. Plan 9 with two file servers mounted into one view.

## blocks.md is the build filesystem

`blocks.md` is in git. Every commit records exactly what the build filesystem looked like — which repos, which versions, which mount points. Go back to any commit and you know exactly what was mounted. Fully reproducible builds from the mount table.

The deploy workflow reads `blocks.md`, clones each referenced repo at the pinned version, mounts them into the build tree, builds, deploys. Add a plugin = add a line = next deploy includes it. That's `package-lock.json` — except it's a markdown table and the "packages" are specs, not code.

## Discovery

"I want comments" → AI searches for spec repos that provide `[comment]`, reads each schema, gives you a comparison in 30 seconds. You pick. No marketplace UI needed — AI is the discovery engine.

The semantic web promised this — machines reading specs and understanding what services do. It failed because it required XML, RDF, OWL, and a PhD to participate. This delivers it via GraphQL schemas and markdown READMEs that AI reads naturally. The semantic web, realized through formats AI already understands.

## Merge specs, swap stacks

"Give me the comment plugin spec + the platform spec but swap Next.js for Vue and AWS for Azure." AI reads both specs and generates an implementation using Vue components, Azure Blob Storage, Azure CDN, Azure Functions. Same behavior, different stack.

The specs are stack-agnostic — they describe *what*, not *how*. The implementation choices are made at generation time based on what you tell AI you want. One comment spec. Infinite implementations. Each native to its target platform.

And it can still publish to your S3. The contract is files at URLs. A Vue app on Azure can produce a `content.json` and sync it to your S3 bucket. Or to its own Azure Blob Storage. Or both. The front end fetches from a URL — doesn't care which cloud hosts it. Multi-cloud by default. Because the interface is HTTP, not an SDK.

## Zero lines

Lines of code to implement this plugin system: zero. `blocks.md` is a markdown table. The comment spec is a GraphQL schema. Neither is code. The implementation comes when you say "build it." Until then — a complete plugin architecture with versioning, isolation, discovery, and reproducible builds. No code.

That's a pretty big feature.

[journey]:
prev: the-log-is-the-event-bus
The event bus enables comments. Comments are the first plugin. The plugin model emerged: specs not code, AI generates the implementation, no compatibility issues because there's no foreign code.

Built `blocks.md` as the plugin registry — maps block names to usage and spec URLs. The workspace only needs to know how to *use* a block, not how it works. The spec URL is for when AI needs to implement it. Two levels of knowledge, accessed on demand.

Key insight: the comments repo doesn't need to be in the workspace. `blocks.md` is the pointer. AI follows the URL when it needs the details. Install a plugin = add a line. Uninstall = remove the line. The repo is never cloned unless you're working on the plugin itself.

Evaluation workflow: AI reads the spec from the URL, gives an opinion (does it fit, security concerns, what's missing), and you decide whether to dig deeper. 30 lines of GraphQL is auditable in seconds. Thousands of lines of code isn't. The spec is the pitch — read it, evaluate it, adopt it or don't. No commitment until you clone.

Multiple repos can respond to the same block — not a collision, a collaboration. One renders the UI, another indexes, another sends notifications. Same block, different readers, different jobs.
