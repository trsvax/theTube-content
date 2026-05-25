---
title: Clone It and Wire It In
date: 2026-05-15
tags: [tech]
audience: public
type: journal
summary: If someone builds a better tag taxonomy, a recipe callout set, a minimal design theme — you clone their repo and point your build at it. No npm. No negotiation. The format agreement is the interface.
workflow: published
---

If the pipe model is right, reuse looks like this: someone else builds a travel-optimized tag taxonomy. You clone their repo and point your build at it instead of yours. That's it. No npm install, no version negotiation, no peer dependency warnings. The format agreement is the interface.

This is what package managers do, but at a different granularity. A package is a function. A repo is a concern. `npm install` gives you a function to call. `git clone` gives you a configuration to apply.

## The format is the contract

For tags, the format is a JSON file: tag name to metadata. Any renderer that reads that format can use any tags repo that produces it. The Austin Healey restorer clones a `theTube-tags-restoration` repo someone built for vintage equipment writing. They point their build at it. It works without reading the source.

For design, the format is a CSS file and a fonts directory. For callouts, it's a registry JSON and optionally template partials. The renderer doesn't care who wrote the files. It cares that the files are in the expected shape.

This is how Unix tools compose. `grep` doesn't know or care that the output came from `git log` versus `cat` versus a network pipe. It reads stdin. The format is the contract.

## What someone else can build

A recipe blog callout set: `[!INGREDIENT]`, `[!STEP]`, `[!TIME]`. A design theme for technical writing — monospace-heavy, dense, no decoration. A tag taxonomy for travel writing — regions, transport modes, cost tiers. A tag taxonomy for a software project — languages, frameworks, status.

None of those require forking the renderer. They're repos with files in the agreed format. Clone, wire into the Actions workflow, deploy. The renderer stays the same.

## The install step is a checkout

In GitHub Actions, "install a component" is already a first-class operation:

```yaml
- uses: actions/checkout@v4
  with:
    repository: someuser/thetube-tags-travel
    path: tags-repo
```

That's the package install. No registry, no lockfile, no publish step. Public repos are the package registry. Git is the package manager. The `repository:` field is the version pin — at HEAD until you want to change it.

## What this requires

The format agreements have to be real. Right now they're implied — the renderer reads whatever files it reads, and the shape is defined by what the renderer expects. That's fine for one site. For composability, the format has to be documented and stable. A schema. A SKILL.md. Something a stranger can read and build against without looking at the renderer source.

That's the missing piece. Not the repos — the specs.

[journey]:
prev: what-earns-a-repo
From the observation: "in theory if someone else creates a new workflow I can just clone it and use it." Yes. That's exactly it. The repos are the packages. The format agreements are the package API.
