---
title: Plugins Are Specs, Not Code
date: 2026-05-18
tags: [tech]
type: journal
audience: user
status: vague-thought
coffee: 1
summary: A plugin isn't code you install — it's a spec you combine with your platform spec. AI generates the implementation that fits your site. No compatibility issues.
---

The traditional plugin model: install someone else's code, hope it works with your theme, override their CSS, fight their assumptions. WordPress plugins break each other. npm packages have version conflicts. The plugin never quite fits.

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

Fork the comment spec repo. That's installing the plugin. The spec is the interface. The implementation is generated. Uninstall = remove the repo. Upgrade = pull the latest spec and regenerate.

## Merge specs, swap stacks

"Give me the comment plugin spec + the platform spec but swap Next.js for Vue and AWS for Azure." AI reads both specs and generates an implementation using Vue components, Azure Blob Storage, Azure CDN, Azure Functions. Same behavior, different stack.

The specs are stack-agnostic — they describe *what*, not *how*. The implementation choices are made at generation time based on what you tell AI you want. One comment spec. Infinite implementations. Each native to its target platform.

And it can still publish to your S3. The contract is files at URLs. A Vue app on Azure can produce a `content.json` and sync it to your S3 bucket. Or to its own Azure Blob Storage. Or both. The front end fetches from a URL — doesn't care which cloud hosts it. Multi-cloud by default. Because the interface is HTTP, not an SDK.

[journey]:
prev: the-log-is-the-event-bus
The event bus enables comments. Comments are the first plugin. The plugin model emerged: specs not code, AI generates the implementation, no compatibility issues because there's no foreign code.

Built `blocks.md` as the plugin registry — maps block names to usage and spec URLs. The workspace only needs to know how to *use* a block, not how it works. The spec URL is for when AI needs to implement it. Two levels of knowledge, accessed on demand.

Key insight: the comments repo doesn't need to be in the workspace. `blocks.md` is the pointer. AI follows the URL when it needs the details. Install a plugin = add a line. Uninstall = remove the line. The repo is never cloned unless you're working on the plugin itself.

Multiple repos can respond to the same block — not a collision, a collaboration. One renders the UI, another indexes, another sends notifications. Same block, different readers, different jobs.
